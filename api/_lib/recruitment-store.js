import { createHmac, randomInt } from "node:crypto";
import { collection, database } from "./mongo.js";
import {
  DEFAULT_SETTINGS,
  DOMAINS,
  NON_TECH,
  REGISTRATION_TYPES,
  STATUSES,
  TECH_DOMAIN_IDS,
  TIME_ZONE,
  YEAR_IDS,
} from "./recruitment-config.js";
import { USN_PATTERN, filtersToQuery } from "./recruitment-validate.js";

const REGISTRATIONS = "recruitment_registrations";
const SETTINGS = "recruitment_settings";
const AUDIT = "recruitment_audit";
const RATE = "recruitment_rate";
const SETTINGS_ID = "current";

const ID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export const REGISTRATION_ID_PATTERN = /^AR\d{2}-[0-9A-HJKMNP-TV-Z]{6}$/;

const nullable = (bsonType) => ({ bsonType: [bsonType, "null"] });

// Enforced by MongoDB itself, in addition to the checks in recruitment-validate.js.
const REGISTRATION_SCHEMA = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    required: [
      "registrationId",
      "fullName",
      "usn",
      "branch",
      "academicYear",
      "semester",
      "section",
      "phoneNumber",
      "githubProfile",
      "registrationType",
      "preferences",
      "status",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      _id: { bsonType: "objectId" },
      registrationId: { bsonType: "string", pattern: REGISTRATION_ID_PATTERN.source },
      fullName: { bsonType: "string", minLength: 2, maxLength: 80 },
      usn: { bsonType: "string", pattern: USN_PATTERN.source },
      branch: { enum: ["CSE"] },
      academicYear: { enum: YEAR_IDS },
      semester: { bsonType: "int", minimum: 1, maximum: 8 },
      section: { bsonType: "string", minLength: 1, maxLength: 3 },
      phoneNumber: { bsonType: "string", pattern: "^[6-9][0-9]{9}$" },
      githubProfile: nullable("string"),
      registrationType: { enum: REGISTRATION_TYPES },
      preferences: {
        bsonType: "object",
        additionalProperties: false,
        required: ["first", "second", "third"],
        properties: {
          first: { enum: [...TECH_DOMAIN_IDS, null] },
          second: { enum: [...TECH_DOMAIN_IDS, null] },
          third: { enum: [NON_TECH, null] },
        },
      },
      status: { enum: STATUSES },
      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" },
    },
  },
};

let ready = null;

async function setup() {
  const db = await database();
  try {
    await db.createCollection(REGISTRATIONS, { validator: REGISTRATION_SCHEMA, validationLevel: "strict" });
  } catch (err) {
    if (err?.code !== 48) throw err;
    // The collection exists: refresh the validator. Needs the collMod privilege; the app-level checks still apply without it.
    await db.command({ collMod: REGISTRATIONS, validator: REGISTRATION_SCHEMA, validationLevel: "strict" }).catch(() => {});
  }
  const active = { partialFilterExpression: { status: "REGISTERED" } };
  await db.collection(REGISTRATIONS).createIndexes([
    { key: { usn: 1 }, name: "usn_active_unique", unique: true, ...active },
    { key: { phoneNumber: 1 }, name: "phone_active_unique", unique: true, ...active },
    { key: { registrationId: 1 }, name: "registration_id_unique", unique: true },
    { key: { createdAt: -1 } },
    { key: { registrationType: 1, createdAt: -1 } },
    { key: { "preferences.first": 1 } },
    { key: { "preferences.second": 1 } },
    { key: { academicYear: 1, semester: 1, section: 1 } },
  ]);
  await db.collection(RATE).createIndexes([
    { key: { key: 1, kind: 1, at: -1 } },
    { key: { at: 1 }, name: "expire_rate_entries", expireAfterSeconds: 24 * 60 * 60 },
  ]);
  await db.collection(AUDIT).createIndexes([{ key: { at: -1 } }]);
}

/** Creates the collection, validator and indexes once per server instance. Fails closed: no writes without unique indexes. */
export function ensureRecruitmentStore() {
  ready ||= setup().catch((err) => {
    ready = null;
    throw err;
  });
  return ready;
}

async function registrations() {
  await ensureRecruitmentStore();
  return collection(REGISTRATIONS);
}

/* ----- Settings ----- */

function mergeSettings(saved) {
  const base = structuredClone(DEFAULT_SETTINGS);
  if (!saved) return { ...base, updatedAt: null, updatedBy: null };
  const merged = { ...base };
  for (const key of Object.keys(base)) {
    if (key === "domains" || key === "allowedBranch") continue;
    if (saved[key] !== undefined) merged[key] = saved[key];
  }
  merged.domains = DOMAINS.map((d) => {
    const savedDomain = Array.isArray(saved.domains) ? saved.domains.find((s) => s?.id === d.id) : null;
    const fallback = base.domains.find((b) => b.id === d.id);
    return { ...fallback, ...(savedDomain || {}), id: d.id };
  });
  merged.allowedYears = (merged.allowedYears || []).filter((y) => YEAR_IDS.includes(y));
  return { ...merged, updatedAt: saved.updatedAt || null, updatedBy: saved.updatedBy || null };
}

export async function readSettings() {
  const doc = await (await collection(SETTINGS)).findOne({ _id: SETTINGS_ID });
  return mergeSettings(doc);
}

export async function writeSettings(next, actor) {
  const { updatedAt: _u, updatedBy: _b, ...fields } = next;
  const doc = { ...fields, allowedBranch: "CSE", updatedAt: new Date(), updatedBy: actor };
  await (await collection(SETTINGS)).replaceOne({ _id: SETTINGS_ID }, doc, { upsert: true });
  return mergeSettings(doc);
}

export function availability(settings, now = new Date()) {
  const opensAt = settings.registrationStartAt ? new Date(settings.registrationStartAt) : null;
  const closesAt = settings.registrationEndAt ? new Date(settings.registrationEndAt) : null;
  let reason = "OPEN";
  if (!settings.registrationOpen) reason = "CLOSED";
  else if (opensAt && now < opensAt) reason = "NOT_STARTED";
  else if (closesAt && now >= closesAt) reason = "ENDED";
  return {
    open: reason === "OPEN",
    reason,
    opensAt: opensAt ? opensAt.toISOString() : null,
    closesAt: closesAt ? closesAt.toISOString() : null,
  };
}

/* ----- Rate limiting (shared across serverless instances through MongoDB) ----- */

const hashKey = (ip) =>
  createHmac("sha256", process.env.RECRUITMENT_RATE_SECRET || process.env.ADMIN_SESSION_SECRET || "adroit-recruitment")
    .update(String(ip))
    .digest("base64url");

export const RATE_LIMITS = {
  attempt: { windowMs: 10 * 60 * 1000, max: 10 },
  fail: { windowMs: 60 * 60 * 1000, max: 15 },
};

export async function rateLimited(ip) {
  await ensureRecruitmentStore();
  const col = await collection(RATE);
  const key = hashKey(ip);
  for (const [kind, { windowMs, max }] of Object.entries(RATE_LIMITS)) {
    const since = new Date(Date.now() - windowMs);
    const count = await col.countDocuments({ key, kind, at: { $gte: since } }, { limit: max });
    if (count >= max) {
      const oldest = await col.find({ key, kind, at: { $gte: since } }).sort({ at: 1 }).limit(1).next();
      const retryAfter = Math.max(1, Math.ceil(((oldest?.at?.getTime() ?? Date.now()) + windowMs - Date.now()) / 1000));
      return { limited: true, retryAfter, kind };
    }
  }
  return { limited: false };
}

export async function recordRate(ip, kind) {
  await (await collection(RATE)).insertOne({ key: hashKey(ip), kind, at: new Date() });
}

/* ----- Registrations ----- */

function newRegistrationId(now = new Date()) {
  const yy = String(now.getUTCFullYear()).slice(-2);
  let code = "";
  for (let i = 0; i < 6; i += 1) code += ID_ALPHABET[randomInt(ID_ALPHABET.length)];
  return `AR${yy}-${code}`;
}

export class DuplicateRegistrationError extends Error {
  constructor(field) {
    super("duplicate");
    this.field = field;
  }
}

function duplicateField(err) {
  const pattern = err?.keyPattern || {};
  const text = String(err?.errmsg || err?.message || "");
  if (pattern.usn || text.includes("usn_active_unique")) return "usn";
  if (pattern.phoneNumber || text.includes("phone_active_unique")) return "phoneNumber";
  if (pattern.registrationId || text.includes("registration_id_unique")) return "registrationId";
  return "unknown";
}

/** Inserts atomically; the unique indexes decide duplicates, so concurrent submissions can't both succeed. */
export async function createRegistration(value) {
  const col = await registrations();
  const now = new Date();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const doc = { registrationId: newRegistrationId(now), ...value, status: "REGISTERED", createdAt: now, updatedAt: now };
    try {
      await col.insertOne(doc);
      return toPublic(doc);
    } catch (err) {
      if (err?.code !== 11000) throw err;
      const field = duplicateField(err);
      if (field !== "registrationId") throw new DuplicateRegistrationError(field);
    }
  }
  throw new Error("Could not allocate a registration id.");
}

export function toPublic(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return {
    ...rest,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt,
  };
}

export async function listRegistrations({ filters, sort, dir, page, pageSize }) {
  const col = await registrations();
  const query = filtersToQuery(filters);
  const order = dir === "asc" ? 1 : -1;
  const [total, docs] = await Promise.all([
    col.countDocuments(query),
    col
      .find(query)
      .sort({ [sort]: order, _id: order })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);
  return { total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)), registrations: docs.map(toPublic) };
}

export async function findForExport(query, sort = { createdAt: 1, _id: 1 }) {
  const col = await registrations();
  return (await col.find(query).sort(sort).limit(20000).toArray()).map(toPublic);
}

export async function getRegistration(registrationId) {
  return toPublic(await (await registrations()).findOne({ registrationId }));
}

export async function rawRegistration(registrationId) {
  return (await registrations()).findOne({ registrationId });
}

export async function updateRegistration(registrationId, value) {
  try {
    const updated = await (await registrations()).findOneAndUpdate(
      { registrationId },
      { $set: { ...value, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    return toPublic(updated);
  } catch (err) {
    if (err?.code === 11000) throw new DuplicateRegistrationError(duplicateField(err));
    throw err;
  }
}

export async function deleteRegistration(registrationId) {
  const { deletedCount } = await (await registrations()).deleteOne({ registrationId });
  return deletedCount === 1;
}

/* ----- Analytics ----- */

const istDate = (date) => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);
const istMidnight = (ymd) => new Date(`${ymd}T00:00:00+05:30`);
const DAY = 24 * 60 * 60 * 1000;

const countBy = (rows) => Object.fromEntries(rows.filter((r) => r._id != null).map((r) => [String(r._id), r.n]));

export async function recruitmentAnalytics(settings, now = new Date()) {
  const col = await registrations();
  const todayStart = istMidnight(istDate(now));
  const weekStart = new Date(todayStart.getTime() - 6 * DAY);
  const trendStart = new Date(todayStart.getTime() - 29 * DAY);

  const [facets] = await col
    .aggregate([
      { $match: { status: "REGISTERED" } },
      {
        $facet: {
          byType: [{ $group: { _id: "$registrationType", n: { $sum: 1 } } }],
          byYear: [{ $group: { _id: "$academicYear", n: { $sum: 1 } } }],
          bySemester: [{ $group: { _id: "$semester", n: { $sum: 1 } } }],
          bySection: [{ $group: { _id: "$section", n: { $sum: 1 } } }],
          first: [{ $match: { registrationType: "TECHNICAL" } }, { $group: { _id: "$preferences.first", n: { $sum: 1 } } }],
          second: [{ $match: { registrationType: "TECHNICAL" } }, { $group: { _id: "$preferences.second", n: { $sum: 1 } } }],
          optionalNonTech: [
            { $match: { registrationType: "TECHNICAL", "preferences.third": NON_TECH } },
            { $count: "n" },
          ],
          nonTechStudents: [
            {
              $match: {
                $or: [{ registrationType: "NON_TECH_ONLY" }, { registrationType: "TECHNICAL", "preferences.third": NON_TECH }],
              },
            },
            { $group: { _id: "$usn" } },
            { $count: "n" },
          ],
          unique: [{ $group: { _id: "$usn" } }, { $count: "n" }],
          today: [{ $match: { createdAt: { $gte: todayStart } } }, { $count: "n" }],
          week: [{ $match: { createdAt: { $gte: weekStart } } }, { $count: "n" }],
          trend: [
            { $match: { createdAt: { $gte: trendStart } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TIME_ZONE } }, n: { $sum: 1 } } },
          ],
        },
      },
    ])
    .toArray();

  const withdrawn = await col.countDocuments({ status: "WITHDRAWN" });
  const one = (arr) => arr?.[0]?.n || 0;
  const byType = countBy(facets.byType);
  const technical = byType.TECHNICAL || 0;
  const nonTechOnly = byType.NON_TECH_ONLY || 0;
  const firstCounts = countBy(facets.first);
  const secondCounts = countBy(facets.second);
  const optionalNonTech = one(facets.optionalNonTech);

  const techDomains = settings.domains.filter((d) => TECH_DOMAIN_IDS.includes(d.id));
  const averageShare = techDomains.length ? 2 / techDomains.length : 0;
  const domains = techDomains.map((d) => {
    const first = firstCounts[d.id] || 0;
    const second = secondCounts[d.id] || 0;
    // first and second are always different, so their sum is the number of distinct students.
    const total = first + second;
    const share = technical ? total / technical : 0;
    const low = d.target > 0 ? total < d.target * 0.5 : technical >= 10 && share < averageShare * 0.5;
    return {
      id: d.id,
      name: d.name,
      first,
      second,
      total,
      percent: technical ? Math.round((total / technical) * 1000) / 10 : 0,
      target: d.target || 0,
      remaining: d.target > 0 ? Math.max(0, d.target - total) : null,
      low,
    };
  });
  const nonTechDomain = settings.domains.find((d) => d.id === NON_TECH);
  const nonTechCombined = one(facets.nonTechStudents);

  const trendCounts = countBy(facets.trend);
  const trend = [];
  for (let i = 29; i >= 0; i -= 1) {
    const day = istDate(new Date(todayStart.getTime() - i * DAY + 12 * 60 * 60 * 1000));
    trend.push({ date: day, count: trendCounts[day] || 0 });
  }

  return {
    generatedAt: now.toISOString(),
    totals: {
      total: technical + nonTechOnly,
      technical,
      nonTechOnly,
      firstYear: countBy(facets.byYear).FIRST_YEAR || 0,
      secondYear: countBy(facets.byYear).SECOND_YEAR || 0,
      today: one(facets.today),
      last7Days: one(facets.week),
      uniqueStudents: one(facets.unique),
      withdrawn,
    },
    bySection: countBy(facets.bySection),
    bySemester: countBy(facets.bySemester),
    byYear: countBy(facets.byYear),
    domains,
    nonTech: {
      name: nonTechDomain?.name || "Non-Tech",
      optionalThird: optionalNonTech,
      onlyRoute: nonTechOnly,
      combinedUnique: nonTechCombined,
      target: nonTechDomain?.target || 0,
      remaining: nonTechDomain?.target > 0 ? Math.max(0, nonTechDomain.target - nonTechCombined) : null,
      low: nonTechDomain?.target > 0 ? nonTechCombined < nonTechDomain.target * 0.5 : false,
    },
    trend,
  };
}

/* ----- Audit log ----- */

export async function audit(action, session, details = {}) {
  await ensureRecruitmentStore();
  await (await collection(AUDIT)).insertOne({
    at: new Date(),
    action,
    actor: "admin",
    session: session?.sid || null,
    ...details,
  });
}

export async function listAudit({ page = 1, pageSize = 50 } = {}) {
  await ensureRecruitmentStore();
  const col = await collection(AUDIT);
  const [total, docs] = await Promise.all([
    col.countDocuments({}),
    col
      .find({})
      .sort({ at: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);
  return {
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
    entries: docs.map(({ _id, at, ...rest }) => ({ id: _id.toString(), at: at.toISOString(), ...rest })),
  };
}
