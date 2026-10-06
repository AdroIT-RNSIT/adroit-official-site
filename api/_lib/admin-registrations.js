import { adminSession, readJson, sameOrigin, send } from "./admin-auth.js";
import { readClosed, storeConfigured, writeClosed } from "./registration-store.js";
import { sharedEvents } from "../../frontend/src/data/events.js";

function bootcampSessions() {
  return sharedEvents.find((event) => event.slug === "skill-up-bootcamp")?.sessions || [];
}

async function listSessions() {
  const closed = await readClosed();
  return bootcampSessions().map((session) => ({
    slug: session.slug,
    title: session.title,
    day: session.day || "",
    closed: Boolean(closed[session.slug]),
  }));
}

export async function handleRegistrations(req, res) {
  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });
  if (!storeConfigured()) {
    return send(res, 503, {
      message: "Upstash Redis isn't connected yet. In Vercel, open Storage, add Upstash Redis, connect it to this project, and redeploy.",
    });
  }

  try {
    if (req.method === "GET") {
      return send(res, 200, { sessions: await listSessions() });
    }

    if (req.method === "POST") {
      if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });
      const { slugs, closed } = await readJson(req);
      const allowed = new Set(bootcampSessions().map((s) => s.slug));
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
