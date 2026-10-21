// The admin session cookie is scoped to /api/admin69, same as the other admin writes.
const URL = "/api/admin69/ui-design";

export async function saveUiDesign(id) {
  const res = await fetch(URL, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ design: id }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || "Couldn't save the design.");
    error.status = res.status;
    throw error;
  }
  return data;
}
