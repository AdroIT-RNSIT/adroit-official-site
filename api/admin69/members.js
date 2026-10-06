import { handleAdminMembers } from "../_lib/admin-members.js";

export default function handler(req, res) {
  return handleAdminMembers(req, res);
}
