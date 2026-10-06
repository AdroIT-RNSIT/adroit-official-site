import { createHash } from "node:crypto";

function cloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  if (cloudName && apiKey && apiSecret) return { cloudName, apiKey, apiSecret };
  try {
    const u = new URL(process.env.CLOUDINARY_URL || "");
    if (u.protocol !== "cloudinary:" || !u.username || !u.password || !u.hostname) return null;
    return { cloudName: u.hostname, apiKey: decodeURIComponent(u.username), apiSecret: decodeURIComponent(u.password) };
  } catch {
    return null;
  }
}

export const uploadsConfigured = () => Boolean(cloudinaryConfig());

// Lets the browser upload straight to Cloudinary without the API secret leaving the server.
export function signUpload(folder) {
  const cfg = cloudinaryConfig();
  if (!cfg) return null;
  const params = { folder, timestamp: Math.floor(Date.now() / 1000) };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + cfg.apiSecret).digest("hex");
  return { cloudName: cfg.cloudName, apiKey: cfg.apiKey, signature, ...params };
}
