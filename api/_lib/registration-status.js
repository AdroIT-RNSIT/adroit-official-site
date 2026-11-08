import { BOOTCAMP_SESSIONS } from "./bootcamp-sessions.js";

export async function handleRegistrationStatus(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ message: "Method not allowed" }));
    return;
  }
  const closed = Object.fromEntries(BOOTCAMP_SESSIONS.map((s) => [s.slug, Boolean(s.closed)]));
  res.statusCode = 200;
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  res.end(JSON.stringify({ closed }));
}
