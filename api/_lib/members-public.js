import { mongoConfigured } from "./mongo.js";
import { readMembers } from "./members-store.js";

export async function handleMembers(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ message: "Method not allowed" }));
    return;
  }
  let groups = null;
  let cache = "no-store";
  if (mongoConfigured()) {
    try {
      ({ groups } = await readMembers());
      cache = "public, max-age=0, s-maxage=10, stale-while-revalidate=60";
    } catch {
      /* the site falls back to the list bundled in code */
    }
  }
  res.statusCode = 200;
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify({ groups }));
}
