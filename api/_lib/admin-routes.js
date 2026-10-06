import { handleLogin, handleLogout, handleSession } from "./admin-auth.js";

export const adminRoutes = {
  "/login": handleLogin,
  "/session": handleSession,
  "/logout": handleLogout,
};
