import { adminRoutes } from "../_lib/admin-routes.js";
import { handleRecruitment } from "../_lib/recruitment.js";

// Single catch-all serverless function for all /api/admin69/* routes.
// Keeps the deployment within Vercel's Hobby plan function limit.
export default function handler(req, res) {
  const url = new URL(req.url || "/", "http://local");
  const path = url.pathname.replace(/^\/api\/admin69\/?/, "/");
  const segment = "/" + (path.split("/").filter(Boolean)[0] || "");

  // Recruitment sub-routes: /api/admin69/recruitment/*
  if (path.startsWith("/recruitment")) {
    const slug = path.replace(/^\/recruitment\/?/, "");
    const params = url.searchParams;
    return handleRecruitment(req, res, { admin: true, route: slug, params });
  }

  // Other admin routes: login, logout, session, members, messages, registrations, ui-design
  const routeHandler = adminRoutes[segment];
  if (routeHandler) return routeHandler(req, res);

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "Not found." }));
}
