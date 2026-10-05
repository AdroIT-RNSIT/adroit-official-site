const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PER_WINDOW = 2;
const hits = new Map();

function recentHits(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((ts) => now - ts < WINDOW_MS);
  hits.set(ip, recent);
  return recent;
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

  const recent = recentHits(ip);
  if (recent.length >= MAX_PER_WINDOW) {
    return {
      status: 429,
      body: { message: "Rate limit reached. You can send up to 2 messages every 24 hours." },
    };
  }

  const endpoint = process.env.FORMSUBMIT_ENDPOINT;
  if (!endpoint) {
    return { status: 500, body: { message: "Contact form is not configured." } };
  }

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
  if (!upstream.ok || data.success === "false" || data.success === false) {
    return { status: 502, body: { message: data.message || "Failed to send message" } };
  }

  recent.push(Date.now());
  hits.set(ip, recent);
  return { status: 200, body: { success: true } };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const result = await sendContact(req.body, ip);
  return res.status(result.status).json(result.body);
}
