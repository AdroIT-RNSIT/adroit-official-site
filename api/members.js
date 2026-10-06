import { handleMembers } from "./_lib/members-public.js";

export default function handler(req, res) {
  return handleMembers(req, res);
}
