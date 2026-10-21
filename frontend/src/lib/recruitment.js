// Client helpers for /recruitment. The server re-validates everything (api/_lib/recruitment-validate.js);
// these checks only give earlier feedback. Keep the USN and phone rules in sync with the server.

export const TIME_ZONE = "Asia/Kolkata";

export const DOMAIN_ACCENTS = {
  CLOUD: "#c084fc",
  ML_AI: "#22d3ee",
  CYBERSECURITY: "#f472b6",
  DATA_ANALYTICS: "#34d399",
  NON_TECH: "#fbbf24",
};

const USN_PATTERN = /^(?=.*[A-Z])(?=.*\d)[A-Z0-9]{6,15}$/;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

export const normalizeUsn = (value) => String(value || "").toUpperCase().replace(/[\s-]/g, "");

export function normalizePhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

function githubOk(value) {
  const raw = value.trim();
  if (!raw) return true;
  if (/^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/.test(raw)) return true;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const parts = url.pathname.split("/").filter(Boolean);
    return ["github.com", "www.github.com"].includes(url.hostname.toLowerCase()) && parts.length === 1;
  } catch {
    return false;
  }
}

export function detailErrors(form, config) {
  const errors = {};
  const name = form.fullName.replace(/\s+/g, " ").trim();
  if (!name) errors.fullName = "Enter your full name.";
  else if (name.length < 2 || name.length > 80) errors.fullName = "Use 2–80 characters.";
  else if (!NAME_PATTERN.test(name)) errors.fullName = "Use letters, spaces, dots, hyphens or apostrophes only.";

  const usn = normalizeUsn(form.usn);
  if (!usn) errors.usn = "Enter your USN.";
  else if (!USN_PATTERN.test(usn)) errors.usn = "Enter your USN using letters and digits, for example 1RN24CS001.";

  const year = config.years.find((y) => y.id === form.academicYear);
  if (!year) errors.academicYear = "Choose your year.";
  if (!form.semester) errors.semester = "Choose your semester.";
  else if (year && !year.semesters.includes(Number(form.semester))) errors.semester = "Choose a semester for your year.";
  const section = form.section.trim();
  if (!section) errors.section = "Enter your section.";
  else if (!/^[A-Za-z]$/.test(section)) errors.section = "Enter a single letter, for example A.";

  if (!form.phoneNumber) errors.phoneNumber = "Enter your phone number.";
  else if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) errors.phoneNumber = "Enter a valid 10-digit mobile number.";

  if (!githubOk(form.githubProfile)) errors.githubProfile = "Enter a GitHub profile link like https://github.com/username.";
  return errors;
}

/**
 * Students tick the domains they want. Two technical picks (in the order ticked) make a technical
 * registration, with Non-Tech as an optional extra; Non-Tech alone makes a Non-Tech only registration.
 */
export function selectionType(tech, nonTech) {
  if (tech.length === 2) return "TECHNICAL";
  if (tech.length === 0 && nonTech) return "NON_TECH_ONLY";
  return null;
}

export function selectionError(tech, nonTech) {
  if (!tech.length && !nonTech) return "Choose the domains you want to apply for.";
  if (tech.length === 1) return "Pick one more technical domain, or untick it to apply for Non-Tech only.";
  return "";
}

export function formatDateTime(iso, opts = { dateStyle: "medium", timeStyle: "short" }) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", { timeZone: TIME_ZONE, ...opts }).format(new Date(iso));
}

// recruitmentDate is a calendar date ("2026-11-05"); show it without shifting time zones.
export function formatDay(ymd) {
  if (!ymd) return "";
  return new Intl.DateTimeFormat("en-IN", { timeZone: TIME_ZONE, weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${ymd}T12:00:00+05:30`),
  );
}

export function daysLeft(iso, serverOffsetMs = 0) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - (Date.now() + serverOffsetMs);
  if (ms <= 0) return 0;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

export async function fetchRecruitmentConfig() {
  const res = await fetch("/api/recruitment/config", { headers: { Accept: "application/json" }, cache: "no-cache" });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status) throw new Error(data?.message || "Couldn't load recruitment details.");
  return data;
}

export async function submitRegistration(payload) {
  try {
    const res = await fetch("/api/recruitment/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  } catch {
    return { status: 0, data: { code: "NETWORK", message: "Couldn't reach the server. Check your connection and try again." } };
  }
}
