import { handleLogout } from "../_lib/admin-auth.js";

export default function handler(req, res) {
  return handleLogout(req, res);
}
