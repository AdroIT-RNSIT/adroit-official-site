import { adminSession, send } from "./admin-auth.js";

export async function handleAdminMessages(req, res) {
  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });
  return send(res, 501, { message: "Message inbox is not available." });
}
