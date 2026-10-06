import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const COOKIE = "adroit_admin";
const COOKIE_PATH = "/api/admin69";
const SESSION_SECONDS = 2 * 60 * 60;
const MAX_PASSWORD_LENGTH = 256;
const FREE_ATTEMPTS = 5;
const LOCK_BASE_MS = 60 * 1000;
const LOCK_MAX_MS = 60 * 60 * 1000;
const FAIL_DELAY_MS = 400;

export const HASH_PARAMS = { N: 2 ** 15, r: 8, p: 1, keylen: 64 };

// Per-instance only: serverless instances don't share memory, so this slows
// guessing but the real defence is a long random password + scrypt cost.
const failures = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function scryptKey(password, salt, { N, r, p, keylen }) {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, { N, r, p, maxmem: 256 * N * r }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

// `:` separators because Vite/dotenv expand `$` inside .env values.
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptKey(password, salt, HASH_PARAMS);
  const { N, r, p } = HASH_PARAMS;
  return ["scrypt", N, r, p, salt.toString("base64url"), key.toString("base64url")].join(":");
}

async function verifyPassword(password, stored) {
  const parts = String(stored).split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [N, r, p] = parts.slice(1, 4).map(Number);
  if (![N, r, p].every(Number.isInteger) || N < 2 ** 14 || N > 2 ** 17 || r < 8 || r > 16 || p < 1 || p > 4) {
    return false;
  }
  const salt = Buffer.from(parts[4], "base64url");
  const expected = Buffer.from(parts[5], "base64url");
  if (salt.length < 16 || expected.length < 32) return false;
  const actual = await scryptKey(password, salt, { N, r, p, keylen: expected.length });
  return timingSafeEqual(actual, expected);
}

export function passwordProblems(password) {
  const pw = String(password || "");
  const problems = [];
  if (pw.length < 14) problems.push("use at least 14 characters");
  if (pw.length > MAX_PASSWORD_LENGTH) problems.push(`use at most ${MAX_PASSWORD_LENGTH} characters`);
  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((re) => re.test(pw)).length;
  if (classes < 3) problems.push("mix at least three of: lowercase, uppercase, digits, symbols");
  if (new Set(pw).size < 8) problems.push("use at least 8 different characters");
  if (/adroit|rnsit|admin|password|qwerty|123456/i.test(pw)) {
    problems.push("avoid obvious words like adroit, rnsit, admin, password");
  }
  return problems;
}

function config() {
  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  if (!hash.startsWith("scrypt:") || secret.length < 32) return null;
  // Binding the signing key to the hash logs everyone out when the password changes.
  const key = createHmac("sha256", secret).update(`adroit-admin-v1:${hash}`).digest();
  return { hash, key };
}

function sign(key, payload) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function createToken(key) {
  const iat = Math.floor(Date.now() / 1000);
  const payload = `${iat}.${iat + SESSION_SECONDS}.${randomBytes(12).toString("base64url")}`;
  return { token: `${payload}.${sign(key, payload)}`, expiresAt: (iat + SESSION_SECONDS) * 1000 };
}

function readToken(key, token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 4) return null;
  const payload = parts.slice(0, 3).join(".");
  const given = Buffer.from(parts[3], "base64url");
  const expected = Buffer.from(sign(key, payload), "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  const now = Math.floor(Date.now() / 1000);
  const iat = Number(parts[0]);
  const exp = Number(parts[1]);
  if (!Number.isInteger(iat) || !Number.isInteger(exp) || iat > now + 60 || exp <= now) return null;
  return { expiresAt: exp * 1000 };
}

function readCookie(req, name) {
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return "";
}

function isHttps(req) {
  return String(req.headers["x-forwarded-proto"] || "").includes("https") || Boolean(process.env.VERCEL);
}

function cookieHeader(req, value, maxAge) {
  const flags = [`${COOKIE}=${value}`, `Path=${COOKIE_PATH}`, "HttpOnly", "SameSite=Strict", `Max-Age=${maxAge}`];
  if (isHttps(req)) flags.push("Secure");
  return flags.join("; ");
}

function clientIp(req) {
  return String(req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

// Cross-site pages can't send application/json without a CORS preflight, which we never allow.
export function sameOrigin(req) {
  if (!String(req.headers["content-type"] || "").startsWith("application/json")) return false;
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    return new URL(origin).host === String(host).split(",")[0].trim();
  } catch {
    return false;
  }
}

export async function readJson(req) {
  try {
    if (req.body !== undefined) {
      return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    }
  } catch {
    return {};
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 4096) return {};
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return {};
  }
}

function lockRemaining(ip) {
  const entry = failures.get(ip);
  return entry && entry.until > Date.now() ? entry.until - Date.now() : 0;
}

function recordFailure(ip) {
  if (failures.size > 5000) {
    const now = Date.now();
    for (const [k, v] of failures) if (v.until < now - LOCK_MAX_MS) failures.delete(k);
  }
  const entry = failures.get(ip) || { count: 0, until: 0 };
  entry.count += 1;
  if (entry.count >= FREE_ATTEMPTS) {
    entry.until = Date.now() + Math.min(LOCK_BASE_MS * 2 ** (entry.count - FREE_ATTEMPTS), LOCK_MAX_MS);
  }
  failures.set(ip, entry);
  return entry;
}

export async function handleLogin(req, res) {
  if (req.method !== "POST") return send(res, 405, { message: "Method not allowed" }, { Allow: "POST" });
  if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });

  const cfg = config();
  if (!cfg) return send(res, 503, { message: "Admin access is not configured on the server." });

  const ip = clientIp(req);
  const locked = lockRemaining(ip);
  if (locked) {
    const retryAfter = Math.ceil(locked / 1000);
    return send(res, 429, { message: "Too many attempts.", retryAfter }, { "Retry-After": String(retryAfter) });
  }

  const { password } = await readJson(req);
  const ok =
    typeof password === "string" &&
    password.length > 0 &&
    password.length <= MAX_PASSWORD_LENGTH &&
    (await verifyPassword(password, cfg.hash));

  if (!ok) {
    const entry = recordFailure(ip);
    await sleep(FAIL_DELAY_MS);
    const retryAfter = entry.until > Date.now() ? Math.ceil((entry.until - Date.now()) / 1000) : 0;
    return send(res, retryAfter ? 429 : 401, {
      message: retryAfter ? "Too many attempts." : "Incorrect password.",
      retryAfter,
      attemptsLeft: Math.max(FREE_ATTEMPTS - entry.count, 0),
    });
  }

  failures.delete(ip);
  const { token, expiresAt } = createToken(cfg.key);
  return send(res, 200, { ok: true, expiresAt }, { "Set-Cookie": cookieHeader(req, token, SESSION_SECONDS) });
}

export function adminSession(req) {
  const cfg = config();
  return cfg ? readToken(cfg.key, readCookie(req, COOKIE)) : null;
}

export function handleSession(req, res) {
  if (req.method !== "GET") return send(res, 405, { message: "Method not allowed" }, { Allow: "GET" });
  if (!config()) return send(res, 503, { message: "Admin access is not configured on the server." });
  const session = adminSession(req);
  if (!session) return send(res, 401, { ok: false });
  return send(res, 200, { ok: true, expiresAt: session.expiresAt });
}

export function handleLogout(req, res) {
  if (req.method !== "POST") return send(res, 405, { message: "Method not allowed" }, { Allow: "POST" });
  if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });
  return send(res, 200, { ok: true }, { "Set-Cookie": cookieHeader(req, "", 0) });
}