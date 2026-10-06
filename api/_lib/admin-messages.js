import { adminSession, readJson, sameOrigin, send } from "./admin-auth.js";
import { mongoConfigured } from "./mongo.js";
import { deleteMessages, listMessages, setRead, toObjectIds } from "./contact-store.js";

export async function handleAdminMessages(req, res) {
  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });
  if (!mongoConfigured()) {
    return send(res, 503, {
      message: "MongoDB isn't connected yet. Add MONGODB_URI in Vercel > Settings > Environment Variables and redeploy.",
    });
  }

  try {
    if (req.method === "GET") return send(res, 200, await listMessages());

    if (req.method === "POST") {
      if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });
      const { action, ids } = await readJson(req, 16 * 1024);
      const objectIds = toObjectIds(ids);
      if (!objectIds || !["read", "unread", "delete"].includes(action)) {
        return send(res, 400, { message: "Invalid request." });
      }
      if (action === "delete") await deleteMessages(objectIds);
      else await setRead(objectIds, action === "read");
      return send(res, 200, await listMessages());
    }

    return send(res, 405, { message: "Method not allowed" }, { Allow: "GET, POST" });
  } catch (err) {
    return send(res, 502, { message: err.message || "Something went wrong." });
  }
}
