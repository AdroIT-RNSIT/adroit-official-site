import { call } from "../api";

export const TZ = "Asia/Kolkata";
export const YEAR_LABEL = { FIRST_YEAR: "First Year", SECOND_YEAR: "Second Year" };
export const TYPE_LABEL = { TECHNICAL: "Technical", NON_TECH_ONLY: "Non-Tech only" };
export const STATUS_LABEL = { REGISTERED: "Registered", WITHDRAWN: "Withdrawn" };

export const BTN =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";
export const BTN_PRIMARY =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-black hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300";
export const BTN_DANGER =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";
export const INPUT =
  "w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30";
export const LABEL = "mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-400";
export const PANEL = "rounded-2xl border border-white/10 bg-[#0b0b0b]";

/** Calls /api/admin69/recruitment/<path>; a 401 signs the admin out. */
export async function api(path, onExpired, options = {}) {
  try {
    const res = await call(`/recruitment${path}`, options);
    if (res.status === 401) {
      onExpired();
      return { ok: false, status: 401, data: { message: "Session expired." } };
    }
    return { ok: res.status >= 200 && res.status < 300, ...res };
  } catch {
    return { ok: false, status: 0, data: { message: "Couldn't reach the server." } };
  }
}

export const formatIST = (iso, opts = { dateStyle: "medium", timeStyle: "short" }) =>
  iso ? new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...opts }).format(new Date(iso)) : "—";

/** ISO instant -> "YYYY-MM-DDTHH:mm" in IST, for <input type="datetime-local">. */
export function toIstInput(iso) {
  if (!iso) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** "YYYY-MM-DDTHH:mm" typed as IST -> ISO instant. */
export const fromIstInput = (value) => (value ? new Date(`${value}:00+05:30`).toISOString() : null);

export const domainName = (settings, id) => settings?.domains.find((d) => d.id === id)?.name || id || "—";

export async function download(url, onExpired) {
  const res = await fetch(url, { credentials: "same-origin", cache: "no-store" });
  if (res.status === 401) {
    onExpired();
    return { ok: false, message: "Session expired." };
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, message: data.message || "Export failed." };
  }
  const blob = await res.blob();
  const name = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") || "")?.[1] || "AdroIT_Export.docx";
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
  return { ok: true, count: Number(res.headers.get("X-Record-Count") || 0), name };
}
