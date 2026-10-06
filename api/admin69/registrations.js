import { handleRegistrations } from "../_lib/admin-registrations.js";

export default function handler(req, res) {
  return handleRegistrations(req, res);
}
