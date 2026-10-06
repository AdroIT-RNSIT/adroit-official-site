import { handleAdminMessages } from "../_lib/admin-messages.js";

export default function handler(req, res) {
  return handleAdminMessages(req, res);
}
