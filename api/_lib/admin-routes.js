import { handleLogin, handleLogout, handleSession } from "./admin-auth.js";
import { handleRegistrations } from "./admin-registrations.js";
import { handleAdminMembers } from "./admin-members.js";
import { handleAdminMessages } from "./admin-messages.js";
import { handleUiDesign } from "./ui-design.js";

export const adminRoutes = {
  "/login": handleLogin,
  "/session": handleSession,
  "/logout": handleLogout,
  "/registrations": handleRegistrations,
  "/members": handleAdminMembers,
  "/messages": handleAdminMessages,
  "/ui-design": (req, res) => handleUiDesign(req, res, { fresh: true }),
};
