import { handleRegistrationStatus } from "./_lib/registration-status.js";

export default function handler(req, res) {
  return handleRegistrationStatus(req, res);
}
