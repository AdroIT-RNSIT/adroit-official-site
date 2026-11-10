import { adminSession, readJson, sameOrigin, send } from "./admin-auth.js";
import { mongoConfigured } from "./mongo.js";
import { ConflictError, readMembers, validateGroups, writeMembers } from "./members-store.js";
import { signUpload, uploadsConfigured } from "./cloudinary-sign.js";

export async function handleAdminMembers(req, res) {
  if (!adminSession(req)) return send(res, 401, { message: "Sign in again." });
  if (!mongoConfigured()) {
    return send(res, 503, {
      message: "MongoDB isn't connected yet. Add MONGODB_URI in Vercel > Settings > Environment Variables and redeploy.",
    });
  }

  try {
    if (req.method === "GET") {
      return send(res, 200, { ...(await readMembers()), uploads: uploadsConfigured() });
    }

    if (!sameOrigin(req)) return send(res, 403, { message: "Forbidden" });
    const body = await readJson(req, 256 * 1024);

    if (req.method === "PUT") {
      const { groups, error } = validateGroups(body.groups);
      if (error) return send(res, 400, { message: error });
      const base = typeof body.baseUpdatedAt === "string" && !Number.isNaN(Date.parse(body.baseUpdatedAt))
        ? body.baseUpdatedAt
        : null;
      return send(res, 200, await writeMembers(groups, base));
    }

    if (req.method === "POST" && body.action === "upload-signature") {
      const signed = signUpload("adroit/members");
      if (!signed) {
        return send(res, 503, {
          message: "Photo uploads need CLOUDINARY_URL (or the CLOUDINARY_* keys) in Vercel. You can still paste a photo URL.",
        });
      }
      return send(res, 200, signed);
    }

    return send(res, 405, { message: "Method not allowed" }, { Allow: "GET, PUT, POST" });
  } catch (err) {
    if (err instanceof ConflictError) {
      return send(res, 409, { message: "Someone else saved the members list after you opened it. Reload to get their changes." });
    }
    return send(res, 502, { message: err.message || "Something went wrong." });
  }
}
