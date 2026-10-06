import { handleLogin, handleLogout, handleSession } from "./admin-auth.js";
import { handleRegistrations } from "./admin-registrations.js";
import { handleAdminMembers } from "./admin-members.js";
import { handleAdminMessages } from "./admin-messages.js";

export const adminRoutes = {
  "/login": handleLogin,
  "/session": handleSession,
  "/logout": handleLogout,
  "/registrations": handleRegistrations,
  "/members": handleAdminMembers,
  "/messages": handleAdminMessages,
};
