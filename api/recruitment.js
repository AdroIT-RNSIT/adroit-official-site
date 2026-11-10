import { handleRecruitment, routeFromUrl } from "./_lib/recruitment.js";

// One function serves /api/recruitment/* and /api/admin69/recruitment/* (see the rewrites in vercel.json),
// which keeps the project inside Vercel's per-deployment function limit. Admin routes always check the
// admin cookie, so the scope flag only selects which routes exist.
export default function handler(req, res) {
  const url = new URL(req.url, "http://local");
  const params = url.searchParams;
  if (params.has("__route")) {
    const route = params.get("__route") || "";
    const admin = params.get("__scope") === "admin";
    params.delete("__route");
    params.delete("__scope");
    return handleRecruitment(req, res, { admin, route, params });
  }
  return handleRecruitment(req, res, routeFromUrl(req.url));
}
