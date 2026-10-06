import { handleLogin } from "../_lib/admin-auth.js";

export default function handler(req, res) {
  return handleLogin(req, res);
}
