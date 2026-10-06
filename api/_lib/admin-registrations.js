import { adminSession, readJson, sameOrigin, send } from "./admin-auth.js";
import { sharedEvents } from "../../frontend/src/data/events.js";
import { findRegistrationDomain } from "../../frontend/src/data/domainRegistration.js";

const TABLE = "registration_settings";

function bootcampSessions() {
  return sharedEvents.find((event) => event.slug === "skill-up-bootcamp")?.sessions || [];
}

function supabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return url && key ? { url, key } : null;
}

async function rest(cfg, path, options = {}) {
  const res = await fetch(`${cfg.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const missingTable = res.status === 404 || data?.code === "PGRST205" || data?.code === "42P01";
    const error = new Error(
      missingTable
        ? "The registration_settings table doesn't exist yet. Run supabase/registration_settings.sql in Supabase."
        : data?.message || `Supabase request failed (${res.status}).`,
    );
    error.status = 502;
    throw error;
  }
  return data;
}

async function listSessions(cfg) {
  const rows = await rest(cfg, `${TABLE}?select=slug,closed,updated_at`);
  const bySlug = new Map((rows || []).map((row) => [row.slug, row]));
  return bootcampSessions().map((session) => {
    const row = bySlug.get(session.slug);
    return {
      slug: session.slug,
      title: session.title,
      day: session.day || "",
      closed: row ? Boolean(row.closed) : Boolean(findRegistrationDomain(session.slug)?.closed),
      updatedAt: row?.updated_at || null,
    };
  });
}

export async function handleRegistrations(req, res) {
  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });

  const cfg = supabaseConfig();
  if (!cfg) {
    return send(res, 503, { message: "Supabase isn't configured on the server (SUPABASE_SERVICE_ROLE_KEY)." });
  }

  try {
    if (req.method === "GET") {
      return send(res, 200, { sessions: await listSessions(cfg) });
    }

    if (req.method === "POST") {
      if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });
      const { slugs, closed } = await readJson(req);
      const allowed = new Set(bootcampSessions().map((s) => s.slug));
      const targets = Array.isArray(slugs) ? [...new Set(slugs)] : [];
      if (!targets.length || !targets.every((slug) => allowed.has(slug)) || typeof closed !== "boolean") {
        return send(res, 400, { message: "Invalid request." });
      }
      const updatedAt = new Date().toISOString();
      await rest(cfg, `${TABLE}?on_conflict=slug`, {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(targets.map((slug) => ({ slug, closed, updated_at: updatedAt }))),
      });
      return send(res, 200, { sessions: await listSessions(cfg) });
    }

    return send(res, 405, { message: "Method not allowed" }, { Allow: "GET, POST" });
  } catch (err) {
    return send(res, err.status || 500, { message: err.message || "Something went wrong." });
  }
}
