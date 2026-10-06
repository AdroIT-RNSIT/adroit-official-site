import { defaultClosed, readClosed, storeConfigured } from "./registration-store.js";

export async function handleRegistrationStatus(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ message: "Method not allowed" }));
    return;
  }
  let closed = defaultClosed();
  let cache = "no-store";
  if (storeConfigured()) {
    try {
      closed = await readClosed();
      cache = "public, max-age=0, s-maxage=5, stale-while-revalidate=30";
    } catch {
      /* fall back to the defaults in code */
    }
  }
  res.statusCode = 200;
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify({ closed }));
}
