const API = "/api/admin69";

export async function call(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}
