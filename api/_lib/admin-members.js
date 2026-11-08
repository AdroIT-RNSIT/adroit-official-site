import { adminSession, readJson, sameOrigin, send } from "./admin-auth.js";
import { signUpload, uploadsConfigured } from "./cloudinary-sign.js";

export async function handleAdminMembers(req, res) {
  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });

  if (req.method === "POST") {
    if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });
    const body = await readJson(req, 256 * 1024);
    if (body.action === "upload-signature") {
      const signed = signUpload("adroit/members");
      if (!signed) {
        return send(res, 503, {
          message: "Photo uploads need CLOUDINARY_URL (or the CLOUDINARY_* keys) in Vercel. You can still paste a photo URL.",
        });
      }
      return send(res, 200, signed);
    }
  }

  return send(res, 501, { message: "Member management is not available." });
}
