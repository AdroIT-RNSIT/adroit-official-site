// Integration tests for the recruitment API against a throwaway MongoDB.
// Run with RECRUITMENT_TEST_MONGODB_URI=mongodb://127.0.0.1:<port> npm run test:recruitment.
// They refuse to run against anything but a local server, and drop their own database afterwards.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomBytes } from "node:crypto";

const TEST_URI = process.env.RECRUITMENT_TEST_MONGODB_URI || "";
const local = /^mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(TEST_URI);

const skip = !local && "set RECRUITMENT_TEST_MONGODB_URI to a local mongodb:// URI to run the integration tests";

let handleRecruitment;
let database;
let ipCounter = 0;
const ADMIN_HASH = "scrypt:32768:8:1:dGVzdHNhbHR0ZXN0c2FsdA:dGVzdGtleXRlc3RrZXl0ZXN0a2V5dGVzdGtleXRlc3Q";
const ADMIN_SECRET = "x".repeat(40);

function adminCookie() {
  const key = createHmac("sha256", ADMIN_SECRET).update(`adroit-admin-v1:${ADMIN_HASH}`).digest();
  const iat = Math.floor(Date.now() / 1000);
  const payload = `${iat}.${iat + 600}.${randomBytes(12).toString("base64url")}`;
  const sig = createHmac("sha256", key).update(payload).digest("base64url");
  return `adroit_admin=${encodeURIComponent(`${payload}.${sig}`)}`;
}

async function call(method, path, { body, admin = false, cookie, ip, origin, contentType = "application/json" } = {}) {
  const url = new URL(path, "http://local");
  const isAdmin = path.startsWith("/api/admin69/recruitment");
  const prefix = isAdmin ? "/api/admin69/recruitment" : "/api/recruitment";
  const route = url.pathname.slice(prefix.length).replace(/^\/+/, "");
  const req = {
    method,
    url: path,
    headers: {
      host: "adroit.test",
      "content-type": contentType,
      "x-real-ip": ip || `10.0.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`,
      ...(origin ? { origin } : {}),
      ...(admin ? { cookie: cookie || adminCookie() } : {}),
    },
    body: body === undefined ? undefined : body,
  };
  const chunks = [];
  const res = {
    statusCode: 0,
    headers: {},
    headersSent: false,
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    end(data) {
      this.headersSent = true;
      if (data) chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(String(data)));
    },
  };
  await handleRecruitment(req, res, { admin: isAdmin, route, params: url.searchParams });
  const buffer = Buffer.concat(chunks);
  let json = null;
  if (String(res.headers["content-type"] || "").includes("json")) json = JSON.parse(buffer.toString("utf8") || "null");
  return { status: res.statusCode, headers: res.headers, json, buffer };
}

let usnSeq = 100;
const student = (overrides = {}) => {
  const n = usnSeq++;
  return {
    fullName: "Test Student",
    usn: `1RN24CS${String(n).padStart(3, "0")}`,
    academicYear: "SECOND_YEAR",
    semester: 3,
    section: "A",
    phoneNumber: `9${String(800000000 + n)}`,
    githubProfile: `student-${n}`,
    registrationType: "TECHNICAL",
    preferences: { first: "CLOUD", second: "ML_AI", third: null },
    ...overrides,
  };
};

const settingsPatch = (patch) => call("PATCH", "/api/admin69/recruitment/settings", { admin: true, body: patch });

describe("recruitment API", { skip }, () => {
  before(async () => {
    process.env.MONGODB_URI = TEST_URI;
    process.env.MONGODB_DB = `adroit_recruitment_test_${process.pid}`;
    process.env.ADMIN_PASSWORD_HASH = ADMIN_HASH;
    process.env.ADMIN_SESSION_SECRET = ADMIN_SECRET;
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.TURNSTILE_SITE_KEY;
    ({ handleRecruitment } = await import("../api/_lib/recruitment.js"));
    ({ database } = await import("../api/_lib/mongo.js"));
  });

  after(async () => {
    const db = await database();
    await db.dropDatabase();
    await db.client.close();
  });

  test("registration starts closed and the API refuses submissions", async () => {
    const config = await call("GET", "/api/recruitment/config");
    assert.equal(config.status, 200);
    assert.equal(config.json.status.open, false);
    assert.equal(config.json.status.reason, "CLOSED");
    assert.equal(config.json.branch, "CSE");
    const res = await call("POST", "/api/recruitment/register", { body: student() });
    assert.equal(res.status, 403);
    assert.equal(res.json.code, "REGISTRATION_CLOSED");
  });

  test("admin endpoints need the admin cookie and same-origin writes", async () => {
    assert.equal((await call("GET", "/api/admin69/recruitment/analytics")).status, 401);
    assert.equal((await call("GET", "/api/admin69/recruitment/export?report=all")).status, 401);
    assert.equal((await call("GET", "/api/admin69/recruitment/registrations", { admin: true, cookie: "adroit_admin=forged.1.2.3" })).status, 401);
    const crossSite = await call("PATCH", "/api/admin69/recruitment/settings", {
      admin: true,
      origin: "https://evil.example",
      body: { registrationOpen: true },
    });
    assert.equal(crossSite.status, 403);
  });

  test("admin opens registration; change is audited", async () => {
    const res = await settingsPatch({ registrationOpen: true });
    assert.equal(res.status, 200);
    assert.equal(res.json.status.open, true);
    const log = await call("GET", "/api/admin69/recruitment/audit-logs", { admin: true });
    assert.equal(log.json.entries[0].action, "registration.open");
    assert.deepEqual(log.json.entries[0].changes.registrationOpen, { from: false, to: true });
  });

  test("valid technical and non-tech-only registrations are stored", async () => {
    const tech = await call("POST", "/api/recruitment/register", { body: student({ preferences: { first: "CLOUD", second: "ML_AI", third: "NON_TECH" } }) });
    assert.equal(tech.status, 201);
    assert.match(tech.json.registration.registrationId, /^AR\d{2}-[0-9A-Z]{6}$/);
    assert.deepEqual(tech.json.registration.preferences, { first: "CLOUD", second: "ML_AI", third: "NON_TECH" });

    const nt = await call("POST", "/api/recruitment/register", {
      body: student({ registrationType: "NON_TECH_ONLY", preferences: undefined, academicYear: "FIRST_YEAR", semester: 1 }),
    });
    assert.equal(nt.status, 201);
    assert.deepEqual(nt.json.registration.preferences, { first: null, second: null, third: null });

    const otherFormat = await call("POST", "/api/recruitment/register", { body: student({ usn: "rns25cse042" }) });
    assert.equal(otherFormat.status, 201, JSON.stringify(otherFormat.json));
  });

  test("invalid submissions are rejected server-side", async () => {
    const cases = [
      student({ preferences: { first: "CLOUD", second: "CLOUD" } }),
      student({ preferences: { first: "CLOUD" } }),
      student({ preferences: { first: "NON_TECH", second: "CLOUD" } }),
      student({ preferences: { first: "CLOUD", second: "ML_AI", third: "CYBERSECURITY" } }),
      student({ academicYear: "FIRST_YEAR", semester: 4 }),
      student({ academicYear: "FIRST_YEAR", semester: 2 }),
      student({ githubProfile: "https://gitlab.com/someone" }),
      student({ branch: "ISE" }),
      student({ registrationType: "NON_TECH_ONLY" }),
      { ...student(), status: "REGISTERED" },
      { ...student(), createdAt: "2020-01-01" },
    ];
    for (const body of cases) {
      const res = await call("POST", "/api/recruitment/register", { body });
      assert.equal(res.status, 400, JSON.stringify(body));
      assert.equal(res.json.code, "VALIDATION");
    }
    const honeypot = await call("POST", "/api/recruitment/register", { body: { ...student(), website: "http://spam" } });
    assert.equal(honeypot.status, 400);
    assert.equal(honeypot.json.code, "REJECTED");
    const notJson = await call("POST", "/api/recruitment/register", { body: student(), contentType: "text/plain" });
    assert.equal(notJson.status, 403);
  });

  test("duplicate USN and phone are refused, even with different formatting", async () => {
    const first = student();
    assert.equal((await call("POST", "/api/recruitment/register", { body: first })).status, 201);
    const sameUsn = await call("POST", "/api/recruitment/register", {
      body: { ...student(), usn: ` ${first.usn.toLowerCase().slice(0, 5)}-${first.usn.slice(5).toLowerCase()} ` },
    });
    assert.equal(sameUsn.status, 409);
    assert.equal(sameUsn.json.code, "DUPLICATE_USN");
    const samePhone = await call("POST", "/api/recruitment/register", { body: { ...student(), phoneNumber: `+91-${first.phoneNumber}` } });
    assert.equal(samePhone.status, 409);
    assert.equal(samePhone.json.code, "DUPLICATE");
    assert.doesNotMatch(JSON.stringify(samePhone.json), new RegExp(first.phoneNumber));
  });

  test("concurrent submissions for one USN produce exactly one registration", async () => {
    const body = student();
    const results = await Promise.all(Array.from({ length: 12 }, () => call("POST", "/api/recruitment/register", { body })));
    assert.equal(results.filter((r) => r.status === 201).length, 1);
    assert.equal(results.filter((r) => r.status === 409).length, 11);
  });

  test("rate limit blocks a flood from one address", async () => {
    const ip = "203.0.113.7";
    const statuses = [];
    for (let i = 0; i < 12; i += 1) {
      statuses.push((await call("POST", "/api/recruitment/register", { ip, body: student({ preferences: { first: "CLOUD", second: "CLOUD" } }) })).status);
    }
    assert.ok(statuses.slice(0, 10).every((s) => s === 400));
    assert.equal(statuses.at(-1), 429);
  });

  test("opening and closing times are enforced on the server", async () => {
    const hour = 60 * 60 * 1000;
    let res = await settingsPatch({ registrationStartAt: new Date(Date.now() + hour).toISOString(), registrationEndAt: null });
    assert.equal(res.json.status.reason, "NOT_STARTED");
    assert.equal((await call("POST", "/api/recruitment/register", { body: student() })).json.code, "REGISTRATION_CLOSED");

    res = await settingsPatch({ registrationStartAt: new Date(Date.now() - 2 * hour).toISOString(), registrationEndAt: new Date(Date.now() - hour).toISOString() });
    assert.equal(res.json.status.reason, "ENDED");
    assert.equal((await call("POST", "/api/recruitment/register", { body: student() })).status, 403);

    const bad = await settingsPatch({ registrationStartAt: "2026-11-02T10:00:00+05:30", registrationEndAt: "2026-11-01T10:00:00+05:30" });
    assert.equal(bad.status, 400);
    assert.ok(bad.json.errors.registrationEndAt);

    res = await settingsPatch({ registrationStartAt: new Date(Date.now() - hour).toISOString(), registrationEndAt: new Date(Date.now() + hour).toISOString() });
    assert.equal(res.json.status.open, true);
  });

  test("analytics count first, second and non-tech interest separately", async () => {
    const db = await database();
    await db.collection("recruitment_registrations").deleteMany({});
    const subs = [
      student({ preferences: { first: "CLOUD", second: "ML_AI", third: "NON_TECH" } }),
      student({ preferences: { first: "CLOUD", second: "CYBERSECURITY", third: null } }),
      student({ preferences: { first: "ML_AI", second: "CLOUD", third: null }, academicYear: "FIRST_YEAR", semester: 1, section: "B" }),
      student({ registrationType: "NON_TECH_ONLY", preferences: undefined }),
      student({ registrationType: "NON_TECH_ONLY", preferences: undefined, academicYear: "FIRST_YEAR", semester: 1 }),
    ];
    for (const body of subs) assert.equal((await call("POST", "/api/recruitment/register", { body })).status, 201);

    const { json } = await call("GET", "/api/admin69/recruitment/analytics", { admin: true });
    assert.equal(json.totals.total, 5);
    assert.equal(json.totals.technical, 3);
    assert.equal(json.totals.nonTechOnly, 2);
    assert.equal(json.totals.firstYear, 2);
    assert.equal(json.totals.today, 5);
    const cloud = json.domains.find((d) => d.id === "CLOUD");
    assert.deepEqual([cloud.first, cloud.second, cloud.total, cloud.percent], [2, 1, 3, 100]);
    const da = json.domains.find((d) => d.id === "DATA_ANALYTICS");
    assert.equal(da.total, 0);
    assert.deepEqual(json.nonTech, { ...json.nonTech, optionalThird: 1, onlyRoute: 2, combinedUnique: 3 });
    assert.equal(json.bySection.B, 1);
    assert.equal(json.trend.length, 30);
    assert.equal(json.trend.at(-1).count, 5);
    assert.ok(!JSON.stringify(json).includes("1RN24CS"), "analytics must not include student records");
  });

  test("DOCX exports match database counts and keep non-tech-only out of technical lists", async () => {
    const expected = {
      "report=all": 5,
      "report=technical": 3,
      "report=non-tech-only": 2,
      "report=first-year": 2,
      "report=second-year": 3,
      "report=domain&domain=CLOUD": 3,
      "report=domain&domain=ML_AI": 2,
      "report=domain&domain=CYBERSECURITY": 1,
      "report=domain&domain=DATA_ANALYTICS": 0,
      "report=non-tech-optional": 1,
      "report=first-preference&domain=CLOUD": 2,
      "report=second-preference&domain=CLOUD": 1,
      "report=filtered&type=TECHNICAL&section=B": 1,
    };
    for (const [query, count] of Object.entries(expected)) {
      const res = await call("GET", `/api/admin69/recruitment/export?${query}`, { admin: true });
      assert.equal(res.status, 200, query);
      assert.equal(res.headers["x-record-count"], String(count), query);
      assert.match(res.headers["content-disposition"], /^attachment; filename="AdroIT_[A-Za-z0-9_]+_\d{4}-\d{2}-\d{2}\.docx"$/);
      assert.equal(res.buffer.subarray(0, 2).toString(), "PK", `${query} is a zip/docx`);
    }
    assert.equal((await call("GET", "/api/admin69/recruitment/export?report=domain&domain=NON_TECH", { admin: true })).status, 400);
    assert.equal((await call("GET", "/api/admin69/recruitment/export?report=nope", { admin: true })).status, 400);
  });

  test("admin list filters, edits within the rules, and audit masks phones", async () => {
    const list = await call("GET", "/api/admin69/recruitment/registrations?domain=CLOUD&sort=usn&dir=asc&pageSize=10", { admin: true });
    assert.equal(list.status, 200);
    assert.equal(list.json.total, 3);
    const target = list.json.registrations[0];

    const bad = await call("PATCH", `/api/admin69/recruitment/registrations/${target.registrationId}`, {
      admin: true,
      body: { preferences: { first: "CLOUD", second: "CLOUD", third: null } },
    });
    assert.equal(bad.status, 400);

    const protectedField = await call("PATCH", `/api/admin69/recruitment/registrations/${target.registrationId}`, {
      admin: true,
      body: { registrationId: "AR26-AAAAAA" },
    });
    assert.equal(protectedField.status, 400);

    const ok = await call("PATCH", `/api/admin69/recruitment/registrations/${target.registrationId}`, {
      admin: true,
      body: { phoneNumber: "9000000001", preferences: { first: "DATA_ANALYTICS", second: "ML_AI", third: null } },
    });
    assert.equal(ok.status, 200);
    assert.equal(ok.json.registration.preferences.first, "DATA_ANALYTICS");

    const log = await call("GET", "/api/admin69/recruitment/audit-logs", { admin: true });
    const entry = log.json.entries.find((e) => e.action === "registration.update");
    assert.equal(entry.target, target.registrationId);
    assert.equal(entry.changes.phoneNumber.to, "******0001");

    const del = await call("DELETE", `/api/admin69/recruitment/registrations/${target.registrationId}`, { admin: true, body: { confirm: "nope" } });
    assert.equal(del.status, 400);
  });

  test("MongoDB's schema validator rejects documents that bypass the API", async () => {
    const col = (await database()).collection("recruitment_registrations");
    const now = new Date();
    const doc = {
      registrationId: "AR26-ZZZZZZ",
      fullName: "Direct Insert",
      usn: "1RN24CS999",
      branch: "ECE",
      academicYear: "SECOND_YEAR",
      semester: 3,
      section: "A",
      phoneNumber: "9111111111",
      githubProfile: null,
      registrationType: "TECHNICAL",
      preferences: { first: "CLOUD", second: "ML_AI", third: null },
      status: "REGISTERED",
      createdAt: now,
      updatedAt: now,
    };
    await assert.rejects(col.insertOne(doc), (err) => err.code === 121);
    await assert.rejects(col.insertOne({ ...doc, branch: "CSE", preferences: { first: "CLOUD", second: "ML_AI", third: "CLOUD" } }), (err) => err.code === 121);
    await assert.rejects(col.insertOne({ ...doc, branch: "CSE", isAdmin: true }), (err) => err.code === 121);
  });

  test("closing registration blocks new submissions but keeps records", async () => {
    await settingsPatch({ registrationOpen: false });
    assert.equal((await call("POST", "/api/recruitment/register", { body: student() })).status, 403);
    const { json } = await call("GET", "/api/admin69/recruitment/analytics", { admin: true });
    assert.equal(json.totals.total, 5);
  });
});
