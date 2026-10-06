import { mongoConfigured } from "./_lib/mongo.js";
import { countRecent, markEmailed, saveMessage } from "./_lib/contact-store.js";
import { checkEmail } from "./_lib/email-check.js";

const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PER_WINDOW = 2;
const RATE_LIMITED = {
  status: 429,
  body: { message: "Rate limit reached. You can send up to 2 messages every 24 hours." },
};

// Only used when MongoDB is unavailable; per-instance, so it resets on cold starts.
const hits = new Map();

function recentHits(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((ts) => now - ts < WINDOW_MS);
  hits.set(ip, recent);
  return recent;
}

async function sendEmail(endpoint, { name, email, subject, message }) {
  try {
    const upstream = await fetch(`https://formsubmit.co/ajax/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _replyto: email,
        _subject: `AdroIT contact: ${subject}`,
        _template: "table",
        _captcha: "true",
      }),
    });
    const data = await upstream.json().catch(() => ({}));
    const ok = upstream.ok && data.success !== "false" && data.success !== false;
    return { ok, message: data.message };
  } catch {
    return { ok: false };
  }
}

export async function sendContact(body, ip = "unknown") {
  if (body?.website) return { status: 200, body: { success: true } };

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const subject = String(body?.subject || "").trim();
  const message = String(body?.message || "").trim();
  if (!name || !email || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 400, body: { message: "Please fill in a valid name, email, subject, and message." } };
  }
  if (name.length > 120 || subject.length > 160 || message.length > 4000) {
    return { status: 400, body: { message: "That message is too long." } };
  }
  const emailProblem = await checkEmail(email);
  if (emailProblem) return { status: 400, body: { message: emailProblem, field: "email" } };

  const endpoint = process.env.FORMSUBMIT_ENDPOINT;
  if (!endpoint && !mongoConfigured()) {
    return { status: 500, body: { message: "Contact form is not configured." } };
  }

  let savedId = null;
  if (mongoConfigured()) {
    try {
      if ((await countRecent(ip, WINDOW_MS)) >= MAX_PER_WINDOW) return RATE_LIMITED;
      savedId = await saveMessage({ name, email, subject, message }, ip);
    } catch {
      /* fall back to email-only below */
    }
  }

  if (!savedId) {
    const recent = recentHits(ip);
    if (recent.length >= MAX_PER_WINDOW) return RATE_LIMITED;
    if (!endpoint) return { status: 502, body: { message: "Failed to send message" } };
  }

  if (endpoint) {
    const emailed = await sendEmail(endpoint, { name, email, subject, message });
    if (emailed.ok && savedId) await markEmailed(savedId).catch(() => {});
    if (!emailed.ok && !savedId) {
      return { status: 502, body: { message: emailed.message || "Failed to send message" } };
    }
  }

  if (!savedId) recentHits(ip).push(Date.now());
  return { status: 200, body: { success: true } };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }
  const ip = String(req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
  const result = await sendContact(req.body, ip);
  return res.status(result.status).json(result.body);
}
