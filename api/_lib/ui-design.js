import { adminSession, readJson, sameOrigin, send } from "./admin-auth.js";
import { mongoConfigured } from "./mongo.js";
import { readUiDesign, writeUiDesign } from "./ui-design-store.js";

// Keep in sync with frontend/src/ui-designs/registry.js
const UI_DESIGN_IDS = ["glass", "neu"];
const ALLOWED = new Set(UI_DESIGN_IDS);
const DEFAULT_DESIGN = "glass";
const PUBLIC_CACHE = "public, max-age=0, s-maxage=60, stale-while-revalidate=300";

function sendPublic(res, design, updatedAt, cache) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify({ design, updatedAt }));
}

// `fresh` skips the CDN cache so the admin panel always sees the saved value.
export async function handleUiDesign(req, res, { fresh = false } = {}) {
  if (req.method === "GET") {
    const cache = fresh ? "no-store" : PUBLIC_CACHE;
    if (!mongoConfigured()) return sendPublic(res, DEFAULT_DESIGN, null, "no-store");
    try {
      const saved = await readUiDesign();
      if (!saved || !ALLOWED.has(saved.design)) return sendPublic(res, DEFAULT_DESIGN, null, cache);
      return sendPublic(res, saved.design, saved.updatedAt, cache);
    } catch {
      return sendPublic(res, DEFAULT_DESIGN, null, "no-store");
    }
  }

  if (req.method !== "POST") {
    return send(res, 405, { message: "Method not allowed" }, { Allow: "GET, POST" });
  }

  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });
  if (!mongoConfigured()) {
    return send(res, 503, {
      message: "MongoDB isn't connected yet. Add MONGODB_URI in Vercel > Settings > Environment Variables and redeploy.",
    });
  }
  if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });

  try {
    const { design } = await readJson(req);
    if (!ALLOWED.has(design)) return send(res, 400, { message: "Unknown design." });
    return send(res, 200, await writeUiDesign(design, "admin"));
  } catch (err) {
    return send(res, 502, { message: err.message || "Something went wrong." });
  }
}
