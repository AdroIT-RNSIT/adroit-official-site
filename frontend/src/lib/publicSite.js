export const PUBLIC_SITE_PATHS = new Set(["/", "/events", "/domains", "/contact"]);

export function isPublicSitePath(pathname) {
  return PUBLIC_SITE_PATHS.has(pathname);
}
