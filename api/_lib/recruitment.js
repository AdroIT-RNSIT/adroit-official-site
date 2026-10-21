import { adminSession, clientIp, readJson, sameOrigin, send } from "./admin-auth.js";
import { mongoConfigured } from "./mongo.js";
import { DOMAINS, TIME_ZONE, YEARS } from "./recruitment-config.js";
import { parseFilters, validateRegistration, validateSettingsPatch } from "./recruitment-validate.js";
import {
  DuplicateRegistrationError,
  REGISTRATION_ID_PATTERN,
  audit,
  availability,
  createRegistration,
  deleteRegistration,
  findForExport,
  getRegistration,
  listAudit,
  listRegistrations,
  rateLimited,
  rawRegistration,
  readSettings,
  recordRate,
  recruitmentAnalytics,
  updateRegistration,
  writeSettings,
} from "./recruitment-store.js";
import { buildDocx, exportFilename, resolveReport } from "./recruitment-export.js";

const PUBLIC_BODY_LIMIT = 4 * 1024;
const ADMIN_BODY_LIMIT = 32 * 1024;
// Browsers always revalidate (no stale status after an admin change); Vercel's CDN may serve it for a few seconds.
const CONFIG_CACHE = { "Cache-Control": "public, max-age=0, must-revalidate", "CDN-Cache-Control": "public, s-maxage=5, stale-while-revalidate=20" };
const UNAVAILABLE = { code: "UNAVAILABLE", message: "Registration is temporarily unavailable. Please try again in a few minutes." };

// Never log student details: only the event and an error class/code.
const logEvent = (event, extra = {}) => console.warn(JSON.stringify({ scope: "recruitment", event, ...extra }));

function tooLarge(req, limit) {
  const length = Number(req.headers["content-length"] || 0);
  return Number.isFinite(length) && length > limit;
}

const iso = (d) => (d ? new Date(d).toISOString() : null);

function publicConfig(settings, now = new Date()) {
  const siteKey = process.env.TURNSTILE_SITE_KEY || "";
  return {
    recruitmentName: settings.recruitmentName,
    announcement: settings.announcement,
    instructions: settings.instructions,
    nextSteps: settings.nextSteps,
    status: availability(settings, now),
    serverTime: now.toISOString(),
    timeZone: TIME_ZONE,
    recruitmentDate: settings.recruitmentDate,
    recruitmentTime: settings.recruitmentTime,
    recruitmentVenue: settings.recruitmentVenue,
    branch: "CSE",
    years: settings.allowedYears.map((id) => ({ id, label: YEARS[id].label, semesters: YEARS[id].semesters })),
    sections: settings.sections,
    domains: settings.domains.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      technical: DOMAINS.find((x) => x.id === d.id)?.technical ?? false,
    })),
    captcha: siteKey && process.env.TURNSTILE_SECRET_KEY ? { provider: "turnstile", siteKey } : null,
  };
}

function adminSettings(settings, now = new Date()) {
  return {
    settings: {
      ...settings,
      registrationStartAt: iso(settings.registrationStartAt),
      registrationEndAt: iso(settings.registrationEndAt),
      updatedAt: iso(settings.updatedAt),
    },
    status: availability(settings, now),
    serverTime: now.toISOString(),
  };
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !process.env.TURNSTILE_SITE_KEY) return true;
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return data?.success === true;
  } catch {
    return false;
  }
}

/* ----- Public ----- */

async function handleConfig(req, res) {
  if (req.method !== "GET") return send(res, 405, { message: "Method not allowed" }, { Allow: "GET" });
  if (!mongoConfigured()) return send(res, 503, UNAVAILABLE);
  try {
    const settings = await readSettings();
    return send(res, 200, publicConfig(settings), CONFIG_CACHE);
  } catch (err) {
    logEvent("config_failed", { error: err?.name });
    return send(res, 503, UNAVAILABLE);
  }
}

async function handleRegister(req, res) {
  if (req.method !== "POST") return send(res, 405, { message: "Method not allowed" }, { Allow: "POST" });
  if (!sameOrigin(req)) return send(res, 403, { code: "FORBIDDEN", message: "Forbidden." });
  if (tooLarge(req, PUBLIC_BODY_LIMIT)) return send(res, 413, { code: "TOO_LARGE", message: "The request is too large." });
  if (!mongoConfigured()) return send(res, 503, UNAVAILABLE);

  const ip = clientIp(req);
  const fail = (status, body) =>
    recordRate(ip, "fail")
      .catch(() => {})
      .then(() => send(res, status, body));

  try {
    const limit = await rateLimited(ip);
    if (limit.limited) {
      logEvent("rate_limited", { kind: limit.kind });
      return send(
        res,
        429,
        { code: "RATE_LIMITED", message: "Too many attempts from this network. Please wait a little and try again.", retryAfter: limit.retryAfter },
        { "Retry-After": String(limit.retryAfter) },
      );
    }
    await recordRate(ip, "attempt");

    const body = await readJson(req, PUBLIC_BODY_LIMIT);
    if (body && typeof body === "object" && body.website) {
      logEvent("honeypot");
      return fail(400, { code: "REJECTED", message: "We couldn't accept this submission." });
    }

    if (!(await verifyTurnstile(body?.captchaToken, ip))) {
      return fail(400, { code: "CAPTCHA", message: "Please complete the verification and try again." });
    }

    const settings = await readSettings();
    const status = availability(settings);
    if (!status.open) {
      return send(res, 403, { code: "REGISTRATION_CLOSED", message: "Registration is closed right now.", status });
    }

    const { errors, value } = validateRegistration(body, settings);
    if (errors) return fail(400, { code: "VALIDATION", message: "Please fix the highlighted fields.", errors });

    const registration = await createRegistration(value);
    return send(res, 201, {
      registration: {
        registrationId: registration.registrationId,
        fullName: registration.fullName,
        registrationType: registration.registrationType,
        preferences: registration.preferences,
        createdAt: registration.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof DuplicateRegistrationError) {
      if (err.field === "usn") {
        return fail(409, {
          code: "DUPLICATE_USN",
          message: "A registration already exists for this USN. Contact the AdroIT team if your details need correcting.",
        });
      }
      return fail(409, {
        code: "DUPLICATE",
        message: "We couldn't complete a registration with these details. If you've already registered, contact the AdroIT team.",
      });
    }
    logEvent("register_failed", { error: err?.name, code: err?.code });
    return send(res, 503, { code: "UNAVAILABLE", message: "We couldn't save your registration. Please try again in a few minutes." });
  }
}

/* ----- Admin ----- */

const maskPhone = (v) => (typeof v === "string" && v.length >= 4 ? `******${v.slice(-4)}` : v);

function diff(before, after, keys, { mask = [] } = {}) {
  const changes = {};
  for (const key of keys) {
    const a = JSON.stringify(before?.[key] instanceof Date ? before[key].toISOString() : before?.[key] ?? null);
    const b = JSON.stringify(after?.[key] instanceof Date ? after[key].toISOString() : after?.[key] ?? null);
    if (a !== b) {
      const from = JSON.parse(a);
      const to = JSON.parse(b);
      changes[key] = mask.includes(key) ? { from: maskPhone(from), to: maskPhone(to) } : { from, to };
    }
  }
  return changes;
}

const SETTINGS_AUDIT_KEYS = [
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
];
const REGISTRATION_AUDIT_KEYS = [
  "fullName",
  "usn",
  "academicYear",
  "semester",
  "section",
  "phoneNumber",
  "githubProfile",
  "registrationType",
  "preferences",
  "status",
];

async function adminSettingsRoute(req, res, session) {
  if (req.method === "GET") return send(res, 200, adminSettings(await readSettings()));
  if (req.method !== "PATCH") return send(res, 405, { message: "Method not allowed" }, { Allow: "GET, PATCH" });
  const current = await readSettings();
  const { errors, value } = validateSettingsPatch(await readJson(req, ADMIN_BODY_LIMIT), current);
  if (errors) return send(res, 400, { code: "VALIDATION", message: "Please fix the highlighted settings.", errors });
  const changes = diff(current, value, SETTINGS_AUDIT_KEYS);
  if (changes.domains) {
    delete changes.domains;
    for (const d of value.domains) {
      const before = current.domains.find((c) => c.id === d.id) || {};
      Object.assign(
        changes,
        Object.fromEntries(Object.entries(diff(before, d, ["name", "description", "target"])).map(([k, v]) => [`domains.${d.id}.${k}`, v])),
      );
    }
  }
  if (!Object.keys(changes).length) return send(res, 200, adminSettings(current));
  const saved = await writeSettings(value, `admin:${session.sid}`);
  const action =
    "registrationOpen" in changes ? (value.registrationOpen ? "registration.open" : "registration.close") : "settings.update";
  await audit(action, session, { target: "settings", changes });
  return send(res, 200, adminSettings(saved));
}

async function adminRegistrationRoute(req, res, session, registrationId) {
  if (!REGISTRATION_ID_PATTERN.test(registrationId)) return send(res, 404, { message: "Registration not found." });

  if (req.method === "GET") {
    const registration = await getRegistration(registrationId);
    return registration ? send(res, 200, { registration }) : send(res, 404, { message: "Registration not found." });
  }

  if (req.method === "PATCH") {
    const existing = await rawRegistration(registrationId);
    if (!existing) return send(res, 404, { message: "Registration not found." });
    const settings = await readSettings();
    const patch = await readJson(req, ADMIN_BODY_LIMIT);
    const { errors, value } = validateRegistration(patch, settings, { existing, admin: true });
    if (errors) return send(res, 400, { code: "VALIDATION", message: "This change breaks the registration rules.", errors });
    const changes = diff(existing, value, REGISTRATION_AUDIT_KEYS, { mask: ["phoneNumber"] });
    if (!Object.keys(changes).length) return send(res, 200, { registration: await getRegistration(registrationId) });
    try {
      const registration = await updateRegistration(registrationId, value);
      await audit("registration.update", session, { target: registrationId, changes });
      return send(res, 200, { registration });
    } catch (err) {
      if (err instanceof DuplicateRegistrationError) {
        return send(res, 409, {
          code: "DUPLICATE",
          message: `Another active registration already uses this ${err.field === "usn" ? "USN" : "phone number"}.`,
        });
      }
      throw err;
    }
  }

  if (req.method === "DELETE") {
    const { confirm } = await readJson(req, ADMIN_BODY_LIMIT);
    if (confirm !== registrationId) return send(res, 400, { message: "Type the registration ID to confirm deletion." });
    const existing = await rawRegistration(registrationId);
    if (!existing) return send(res, 404, { message: "Registration not found." });
    await deleteRegistration(registrationId);
    await audit("registration.delete", session, { target: registrationId, changes: { usn: { from: existing.usn, to: null } } });
    return send(res, 200, { ok: true });
  }

  return send(res, 405, { message: "Method not allowed" }, { Allow: "GET, PATCH, DELETE" });
}

async function adminExport(req, res, session, params) {
  const settings = await readSettings();
  const report = resolveReport(params, settings);
  if (!report) return send(res, 400, { message: "Unknown report or invalid filters." });
  const now = new Date();
  const rows = await findForExport(report.query, report.sort);
  const buffer = await buildDocx(report, rows, settings, now);
  await audit("export", session, { target: report.slug, count: rows.length });
  const filename = exportFilename(report.slug, now);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", String(buffer.length));
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Record-Count", String(rows.length));
  res.end(buffer);
}

async function handleAdmin(req, res, route, params) {
  const session = adminSession(req);
  if (!session) return send(res, 401, { message: "Sign in again." });
  if (!mongoConfigured()) {
    return send(res, 503, {
      message: "MongoDB isn't connected yet. Add MONGODB_URI in Vercel > Settings > Environment Variables and redeploy.",
    });
  }
  if (["PATCH", "DELETE", "POST"].includes(req.method)) {
    if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });
    if (tooLarge(req, ADMIN_BODY_LIMIT)) return send(res, 413, { message: "The request is too large." });
  }

  const [head, id, ...rest] = route.split("/").filter(Boolean);
  if (rest.length) return send(res, 404, { message: "Not found." });

  if (head === "settings" && !id) return adminSettingsRoute(req, res, session);

  if (head === "analytics" && !id) {
    if (req.method !== "GET") return send(res, 405, { message: "Method not allowed" }, { Allow: "GET" });
    return send(res, 200, await recruitmentAnalytics(await readSettings()));
  }

  if (head === "registrations" && !id) {
    if (req.method !== "GET") return send(res, 405, { message: "Method not allowed" }, { Allow: "GET" });
    const parsed = parseFilters(params);
    if (parsed.errors) return send(res, 400, { code: "VALIDATION", message: "Invalid filters.", errors: parsed.errors });
    return send(res, 200, await listRegistrations(parsed.value));
  }
  if (head === "registrations") return adminRegistrationRoute(req, res, session, id);

  if (head === "export" && !id) {
    if (req.method !== "GET") return send(res, 405, { message: "Method not allowed" }, { Allow: "GET" });
    return adminExport(req, res, session, params);
  }

  if (head === "audit-logs" && !id) {
    if (req.method !== "GET") return send(res, 405, { message: "Method not allowed" }, { Allow: "GET" });
    const page = Number(params.get("page") || 1);
    if (!Number.isInteger(page) || page < 1 || page > 10000) return send(res, 400, { message: "Invalid page." });
    return send(res, 200, await listAudit({ page }));
  }

  return send(res, 404, { message: "Not found." });
}

/**
 * Entry point for /api/recruitment/* (public) and /api/admin69/recruitment/* (admin).
 * `route` is the path after that prefix, e.g. "config" or "registrations/AR26-7K3M9Q".
 */
export async function handleRecruitment(req, res, { admin, route, params }) {
  try {
    if (admin) return await handleAdmin(req, res, route, params);
    if (route === "config") return await handleConfig(req, res);
    if (route === "register") return await handleRegister(req, res);
    return send(res, 404, { message: "Not found." });
  } catch (err) {
    logEvent(admin ? "admin_failed" : "public_failed", { error: err?.name, code: err?.code });
    if (!res.headersSent) return send(res, 500, { message: "Something went wrong. Please try again." });
  }
}

/** Splits a request URL like "/api/admin69/recruitment/settings?x=1" into the parts above. */
export function routeFromUrl(url) {
  const parsed = new URL(url, "http://local");
  const params = parsed.searchParams;
  const admin = parsed.pathname.startsWith("/api/admin69/recruitment");
  const prefix = admin ? "/api/admin69/recruitment" : "/api/recruitment";
  let route = parsed.pathname.startsWith(prefix) ? parsed.pathname.slice(prefix.length) : "";
  route = route.replace(/^\/+|\/+$/g, "");
  return { admin, route, params };
}
