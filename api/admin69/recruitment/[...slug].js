import { handleRecruitment } from "../../_lib/recruitment.js";

export default function handler(req, res) {
  const slug = req.query?.slug;
  const route = (Array.isArray(slug) ? slug : slug ? [slug] : []).join("/");
  const params = new URL(req.url || "/", "http://local").searchParams;
  return handleRecruitment(req, res, { admin: true, route, params });
}
