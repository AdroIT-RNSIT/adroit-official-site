import { adminSession, readJson, sameOrigin, send } from "./admin-auth.js";
import { readClosed, storeConfigured, writeClosed } from "./registration-store.js";
import { BOOTCAMP_SESSIONS } from "./bootcamp-sessions.js";

async function listSessions() {
  const closed = await readClosed();
  return BOOTCAMP_SESSIONS.map(({ slug, title, day }) => ({ slug, title, day, closed: Boolean(closed[slug]) }));
}

export async function handleRegistrations(req, res) {
  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });
  if (!storeConfigured()) {
    return send(res, 503, {
      message: "MongoDB isn't connected yet. Add MONGODB_URI in Vercel > Settings > Environment Variables and redeploy.",
    });
  }

  try {
    if (req.method === "GET") {
      return send(res, 200, { sessions: await listSessions() });
    }

    if (req.method === "POST") {
      if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });
      const { slugs, closed } = await readJson(req);
      const allowed = new Set(BOOTCAMP_SESSIONS.map((s) => s.slug));
      const targets = Array.isArray(slugs) ? [...new Set(slugs)] : [];
      if (!targets.length || !targets.every((slug) => allowed.has(slug)) || typeof closed !== "boolean") {
        return send(res, 400, { message: "Invalid request." });
      }
      await writeClosed(targets, closed);
      return send(res, 200, { sessions: await listSessions() });
    }

    return send(res, 405, { message: "Method not allowed" }, { Allow: "GET, POST" });
  } catch (err) {
    return send(res, 502, { message: err.message || "Something went wrong." });
  }
}
