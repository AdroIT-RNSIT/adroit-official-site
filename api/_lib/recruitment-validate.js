import {
  BRANCH,
  DOMAIN_IDS,
  NON_TECH,
  REGISTRATION_TYPES,
  STATUSES,
  TECH_DOMAIN_IDS,
  YEARS,
  YEAR_IDS,
} from "./recruitment-config.js";

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const str = (v) => (typeof v === "string" ? v : v == null ? "" : null);

// Same leniency as the Skill Up Boot Camp form: any USN the college issued (e.g. 1RN24CS001),
// as 6–15 capital letters and digits with at least one of each. Spaces and hyphens are removed first.
export const USN_PATTERN = /^(?=.*[A-Z])(?=.*\d)[A-Z0-9]{6,15}$/;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;
const GITHUB_USER = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeUsn(value) {
  return String(value ?? "").toUpperCase().replace(/[\s-]/g, "");
}

export function normalizePhone(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function normalizeName(value) {
  return String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
}

// Accepts "github.com/user", "https://github.com/user/" or a bare username; returns the canonical URL or null.
export function normalizeGithub(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return { ok: true, value: null };
  if (raw.length > 120) return { ok: false };
  if (GITHUB_USER.test(raw)) return { ok: true, value: `https://github.com/${raw}` };
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false };
  }
  if (!["http:", "https:"].includes(url.protocol)) return { ok: false };
  if (!["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) return { ok: false };
  if (url.username || url.password || url.port) return { ok: false };
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length !== 1 || !GITHUB_USER.test(parts[0])) return { ok: false };
  return { ok: true, value: `https://github.com/${parts[0]}` };
}

const REGISTRATION_KEYS = new Set([
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
  "website",
  "captchaToken",
]);
const PREFERENCE_KEYS = new Set(["first", "second", "third"]);

function preferenceErrors(type, prefs, techIds) {
  const errors = {};
  if (type === "NON_TECH_ONLY") {
    if (prefs && (prefs.first || prefs.second || prefs.third)) {
      errors.preferences = "The Non-Tech only route doesn't take technical preferences.";
    }
    return { errors, value: { first: null, second: null, third: null } };
  }
  const first = str(prefs?.first);
  const second = str(prefs?.second);
  const third = prefs?.third == null || prefs?.third === "" ? null : prefs.third;
  if (!first) errors.first = "Choose your first technical preference.";
  else if (!techIds.includes(first)) errors.first = "Choose a technical domain.";
  if (!second) errors.second = "Choose your second technical preference.";
  else if (!techIds.includes(second)) errors.second = "Choose a technical domain.";
  if (first && second && first === second) errors.second = "Your two technical preferences must be different.";
  if (third !== null && third !== NON_TECH) errors.third = "The optional third preference can only be Non-Tech.";
  return { errors, value: { first, second, third } };
}

/**
 * Validates a registration against the current settings. With `existing`, fields the admin
 * didn't send keep their stored values; `admin` also allows `status`.
 */
export function validateRegistration(input, settings, { existing = null, admin = false } = {}) {
  const errors = {};
  if (!isPlainObject(input)) return { errors: { form: "Invalid request." } };

  const unexpected = Object.keys(input).filter((k) => !REGISTRATION_KEYS.has(k) && !(admin && k === "status"));
  if (unexpected.length) return { errors: { form: "The request contained unexpected fields." } };
  if (input.preferences != null) {
    if (!isPlainObject(input.preferences) || Object.keys(input.preferences).some((k) => !PREFERENCE_KEYS.has(k))) {
      return { errors: { preferences: "Invalid preferences." } };
    }
  }

  const merged = existing ? { ...existing, ...input, preferences: input.preferences ?? existing.preferences } : input;

  const fullName = normalizeName(str(merged.fullName) ?? "");
  if (!fullName) errors.fullName = "Enter your full name.";
  else if (fullName.length < 2 || fullName.length > 80) errors.fullName = "Use 2–80 characters.";
  else if (!NAME_PATTERN.test(fullName)) errors.fullName = "Use letters, spaces, dots, hyphens or apostrophes only.";

  const usn = normalizeUsn(str(merged.usn) ?? "");
  if (!usn) errors.usn = "Enter your USN.";
  else if (!USN_PATTERN.test(usn)) errors.usn = "Enter your USN using letters and digits, for example 1RN24CS001.";

  if (merged.branch != null && merged.branch !== "" && merged.branch !== BRANCH) {
    errors.branch = "Recruitment is open to CSE students only.";
  }

  const allowedYears = (settings?.allowedYears?.length ? settings.allowedYears : YEAR_IDS).filter((y) => YEARS[y]);
  const academicYear = str(merged.academicYear);
  if (!academicYear) errors.academicYear = "Choose your year.";
  else if (!allowedYears.includes(academicYear)) errors.academicYear = "This year isn't eligible for recruitment.";

  const semester = Number(merged.semester);
  if (merged.semester == null || merged.semester === "") errors.semester = "Choose your semester.";
  else if (!Number.isInteger(semester)) errors.semester = "Choose a valid semester.";
  else if (YEARS[academicYear] && !YEARS[academicYear].semesters.includes(semester)) {
    errors.semester = `${YEARS[academicYear].label} students are in semester ${YEARS[academicYear].semesters.join(" or ")}.`;
  }

  const section = String(str(merged.section) ?? "").trim().toUpperCase();
  if (!section) errors.section = "Enter your section.";
  else if (!/^[A-Z]$/.test(section)) errors.section = "Enter a single letter, for example A.";

  const phoneNumber = normalizePhone(str(merged.phoneNumber) ?? "");
  if (!phoneNumber) errors.phoneNumber = "Enter your phone number.";
  else if (!/^[6-9]\d{9}$/.test(phoneNumber)) errors.phoneNumber = "Enter a valid 10-digit Indian mobile number.";

  const github = normalizeGithub(str(merged.githubProfile) ?? "");
  if (!github.ok) errors.githubProfile = "Enter a GitHub profile link like https://github.com/username.";

  const registrationType = str(merged.registrationType);
  if (!REGISTRATION_TYPES.includes(registrationType)) {
    errors.registrationType = "Choose how you're registering.";
  }

  const techIds = TECH_DOMAIN_IDS.filter((id) => (settings?.domains || []).some((d) => d.id === id) || !settings?.domains);
  const prefs = REGISTRATION_TYPES.includes(registrationType)
    ? preferenceErrors(registrationType, merged.preferences, techIds)
    : { errors: {}, value: null };
  Object.assign(errors, prefs.errors);

  let status;
  if (admin) {
    status = merged.status ?? "REGISTERED";
    if (!STATUSES.includes(status)) errors.status = "Invalid status.";
  }

  if (Object.keys(errors).length) return { errors };
  return {
    value: {
      fullName,
      usn,
      branch: BRANCH,
      academicYear,
      semester,
      section,
      phoneNumber,
      githubProfile: github.value,
      registrationType,
      preferences: prefs.value,
      ...(admin ? { status } : {}),
    },
  };
}

function parseInstant(value, label, errors, key) {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || value.length > 40) {
    errors[key] = `${label} is invalid.`;
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors[key] = `${label} is invalid.`;
    return undefined;
  }
  return date;
}

function boundedString(value, max, label, errors, key, { required = false } = {}) {
  if (typeof value !== "string") {
    errors[key] = `${label} must be text.`;
    return undefined;
  }
  const trimmed = value.trim();
  if (required && !trimmed) errors[key] = `${label} is required.`;
  else if (trimmed.length > max) errors[key] = `${label} must be at most ${max} characters.`;
  return trimmed;
}

const SETTINGS_KEYS = new Set([
  "recruitmentName",
  "registrationOpen",
  "registrationStartAt",
  "registrationEndAt",
  "recruitmentDate",
  "recruitmentTime",
  "recruitmentVenue",
  "announcement",
  "instructions",
  "nextSteps",
  "allowedYears",
  "sections",
  "domains",
]);

/** Validates an admin settings patch and returns the merged settings document. */
export function validateSettingsPatch(patch, current) {
  if (!isPlainObject(patch)) return { errors: { form: "Invalid request." } };
  const unknown = Object.keys(patch).filter((k) => !SETTINGS_KEYS.has(k));
  if (unknown.length) return { errors: { form: `Unknown settings: ${unknown.join(", ")}.` } };

  const errors = {};
  const next = { ...current };
  const has = (k) => Object.prototype.hasOwnProperty.call(patch, k);

  if (has("recruitmentName")) next.recruitmentName = boundedString(patch.recruitmentName, 80, "Name", errors, "recruitmentName", { required: true });
  if (has("registrationOpen")) {
    if (typeof patch.registrationOpen !== "boolean") errors.registrationOpen = "Must be on or off.";
    else next.registrationOpen = patch.registrationOpen;
  }
  if (has("registrationStartAt")) next.registrationStartAt = parseInstant(patch.registrationStartAt, "Opening time", errors, "registrationStartAt");
  if (has("registrationEndAt")) next.registrationEndAt = parseInstant(patch.registrationEndAt, "Closing time", errors, "registrationEndAt");
  if (has("recruitmentDate")) {
    const v = patch.recruitmentDate;
    if (v === null || v === "") next.recruitmentDate = null;
    else if (typeof v !== "string" || !DATE_ONLY.test(v) || Number.isNaN(new Date(`${v}T00:00:00+05:30`).getTime())) {
      errors.recruitmentDate = "Recruitment date is invalid.";
    } else next.recruitmentDate = v;
  }
  if (has("recruitmentTime")) next.recruitmentTime = boundedString(patch.recruitmentTime, 40, "Time", errors, "recruitmentTime");
  if (has("recruitmentVenue")) next.recruitmentVenue = boundedString(patch.recruitmentVenue, 120, "Venue", errors, "recruitmentVenue");
  if (has("announcement")) next.announcement = boundedString(patch.announcement, 1000, "Announcement", errors, "announcement");
  if (has("nextSteps")) next.nextSteps = boundedString(patch.nextSteps, 600, "Next steps", errors, "nextSteps");
  if (has("instructions")) {
    const list = patch.instructions;
    if (!Array.isArray(list) || list.length > 10 || !list.every((s) => typeof s === "string" && s.trim().length <= 300)) {
      errors.instructions = "Use up to 10 instructions of at most 300 characters each.";
    } else next.instructions = list.map((s) => s.trim()).filter(Boolean);
  }
  if (has("allowedYears")) {
    const list = patch.allowedYears;
    if (!Array.isArray(list) || !list.length || !list.every((y) => YEARS[y]) || new Set(list).size !== list.length) {
      errors.allowedYears = "Pick at least one eligible year.";
    } else next.allowedYears = YEAR_IDS.filter((y) => list.includes(y));
  }
  if (has("sections")) {
    const list = Array.isArray(patch.sections) ? patch.sections.map((s) => String(s).trim().toUpperCase()) : null;
    if (!list || !list.length || list.length > 20 || !list.every((s) => /^[A-Z0-9]{1,3}$/.test(s)) || new Set(list).size !== list.length) {
      errors.sections = "Use 1–20 unique sections of 1–3 letters or digits.";
    } else next.sections = list;
  }
  if (has("domains")) {
    const list = patch.domains;
    const valid =
      Array.isArray(list) &&
      list.length === DOMAIN_IDS.length &&
      DOMAIN_IDS.every((id) => list.filter((d) => isPlainObject(d) && d.id === id).length === 1);
    if (!valid) errors.domains = "Every domain must be listed exactly once.";
    else {
      const domains = [];
      for (const d of list) {
        const extra = Object.keys(d).filter((k) => !["id", "name", "description", "target"].includes(k));
        const name = typeof d.name === "string" ? d.name.trim() : "";
        const description = typeof d.description === "string" ? d.description.trim() : "";
        const target = Number(d.target ?? 0);
        if (extra.length || name.length < 2 || name.length > 60 || description.length > 300 || !Number.isInteger(target) || target < 0 || target > 5000) {
          errors.domains = "Each domain needs a 2–60 character name, a description up to 300 characters and a target from 0 to 5000.";
          break;
        }
        domains.push({ id: d.id, name, description, target });
      }
      if (!errors.domains) next.domains = DOMAIN_IDS.map((id) => domains.find((d) => d.id === id));
    }
  }

  if (!errors.registrationStartAt && !errors.registrationEndAt && next.registrationStartAt && next.registrationEndAt) {
    if (new Date(next.registrationEndAt) <= new Date(next.registrationStartAt)) {
      errors.registrationEndAt = "The closing time must be after the opening time.";
    }
  }

  if (Object.keys(errors).length) return { errors };
  return { value: next };
}

const SORTS = {
  createdAt: "createdAt",
  fullName: "fullName",
  usn: "usn",
  semester: "semester",
  section: "section",
  registrationId: "registrationId",
};
const PAGE_SIZES = [10, 25, 50, 100];

/** Parses list/export filters from a query string. Unknown or malformed values are rejected, not ignored. */
export function parseFilters(params) {
  const errors = {};
  const get = (k) => {
    const v = params.get(k);
    return v == null || v === "" ? null : v;
  };
  const f = {};

  const q = get("q");
  if (q) {
    if (q.length > 60) errors.q = "Search is too long.";
    else f.q = q.trim();
  }
  const type = get("type");
  if (type) REGISTRATION_TYPES.includes(type) ? (f.type = type) : (errors.type = "Unknown type.");
  const year = get("year");
  if (year) YEARS[year] ? (f.year = year) : (errors.year = "Unknown year.");
  const semester = get("semester");
  if (semester) /^[1-8]$/.test(semester) ? (f.semester = Number(semester)) : (errors.semester = "Unknown semester.");
  const section = get("section");
  if (section) /^[A-Za-z0-9]{1,3}$/.test(section) ? (f.section = section.toUpperCase()) : (errors.section = "Unknown section.");
  for (const k of ["first", "second", "domain"]) {
    const v = get(k);
    if (v) TECH_DOMAIN_IDS.includes(v) ? (f[k] = v) : (errors[k] = "Unknown domain.");
  }
  const third = get("third");
  if (third) ["NON_TECH", "NONE"].includes(third) ? (f.third = third) : (errors.third = "Unknown value.");
  const status = get("status");
  if (status) STATUSES.includes(status) ? (f.status = status) : (errors.status = "Unknown status.");
  for (const k of ["from", "to"]) {
    const v = get(k);
    if (v) DATE_ONLY.test(v) && !Number.isNaN(new Date(`${v}T00:00:00+05:30`).getTime()) ? (f[k] = v) : (errors[k] = "Invalid date.");
  }
  if (f.from && f.to && f.to < f.from) errors.to = "The end date is before the start date.";

  const sort = get("sort") || "createdAt";
  if (!SORTS[sort]) errors.sort = "Unknown sort.";
  const dir = get("dir") || "desc";
  if (!["asc", "desc"].includes(dir)) errors.dir = "Unknown direction.";
  const page = Number(get("page") || 1);
  if (!Number.isInteger(page) || page < 1 || page > 10000) errors.page = "Invalid page.";
  const pageSize = Number(get("pageSize") || 25);
  if (!PAGE_SIZES.includes(pageSize)) errors.pageSize = "Invalid page size.";

  if (Object.keys(errors).length) return { errors };
  return { value: { filters: f, sort: SORTS[sort], dir, page, pageSize } };
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const istDayStart = (ymd) => new Date(`${ymd}T00:00:00+05:30`);

export function filtersToQuery(f) {
  const query = {};
  if (f.type) query.registrationType = f.type;
  if (f.year) query.academicYear = f.year;
  if (f.semester) query.semester = f.semester;
  if (f.section) query.section = f.section;
  if (f.first) query["preferences.first"] = f.first;
  if (f.second) query["preferences.second"] = f.second;
  if (f.domain) {
    query.registrationType = "TECHNICAL";
    query.$or = [{ "preferences.first": f.domain }, { "preferences.second": f.domain }];
  }
  if (f.third === "NON_TECH") query["preferences.third"] = NON_TECH;
  if (f.third === "NONE") query["preferences.third"] = null;
  if (f.status) query.status = f.status;
  if (f.from || f.to) {
    query.createdAt = {};
    if (f.from) query.createdAt.$gte = istDayStart(f.from);
    if (f.to) query.createdAt.$lt = new Date(istDayStart(f.to).getTime() + 24 * 60 * 60 * 1000);
  }
  if (f.q) {
    const re = new RegExp(escapeRegex(f.q), "i");
    const digits = f.q.replace(/\D/g, "");
    const or = [{ fullName: re }, { usn: new RegExp(escapeRegex(normalizeUsn(f.q))) }, { registrationId: re }];
    if (digits.length >= 4) or.push({ phoneNumber: new RegExp(escapeRegex(digits)) });
    query.$and = [...(query.$and || []), { $or: or }];
  }
  return query;
}
