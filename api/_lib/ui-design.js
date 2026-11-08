import { adminSession, send } from "./admin-auth.js";

// Keep in sync with frontend/src/ui-designs/registry.js
const UI_DESIGN_IDS = ["glass", "neu"];
const DEFAULT_DESIGN = "glass";

export async function handleUiDesign(req, res, { fresh = false } = {}) {
  if (req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", fresh ? "no-store" : "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
    res.end(JSON.stringify({ design: DEFAULT_DESIGN, updatedAt: null }));
    return;
  }

  if (req.method !== "POST") {
    return send(res, 405, { message: "Method not allowed" }, { Allow: "GET, POST" });
  }

  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });
  return send(res, 501, { message: "Design switching is not available." });
}
