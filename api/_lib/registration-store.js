import { registrationDomains } from "../../frontend/src/data/domainRegistration.js";

const KEY = "adroit:registration-closed";

export const defaultClosed = () =>
  Object.fromEntries(registrationDomains.map((d) => [d.slug, Boolean(d.closed)]));

// Vercel's Upstash integration injects KV_*; a direct Upstash setup uses UPSTASH_*.
function redisConfig() {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/+$/, "");
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
  return url && token ? { url, token } : null;
}

export const storeConfigured = () => Boolean(redisConfig());

async function redis(command) {
  const cfg = redisConfig();
  if (!cfg) throw new Error("Upstash Redis isn't connected to this project yet.");
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error || `Redis request failed (${res.status}).`);
  return data.result;
}

export async function readClosed() {
  const closed = defaultClosed();
  const flat = (await redis(["HGETALL", KEY])) || [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    if (flat[i] in closed) closed[flat[i]] = flat[i + 1] === "1";
  }
  return closed;
}

export async function writeClosed(slugs, closed) {
  await redis(["HSET", KEY, ...slugs.flatMap((slug) => [slug, closed ? "1" : "0"])]);
}
