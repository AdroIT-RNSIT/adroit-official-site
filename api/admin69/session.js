import { handleSession } from "../_lib/admin-auth.js";

export default function handler(req, res) {
  return handleSession(req, res);
}
