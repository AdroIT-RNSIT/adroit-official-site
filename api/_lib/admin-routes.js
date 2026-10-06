import { handleLogin, handleLogout, handleSession } from "./admin-auth.js";
import { handleRegistrations } from "./admin-registrations.js";

export const adminRoutes = {
  "/login": handleLogin,
  "/session": handleSession,
  "/logout": handleLogout,
  "/registrations": handleRegistrations,
};
