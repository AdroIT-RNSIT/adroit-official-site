import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { RECRUITMENT_DOMAINS, RECRUITMENT_INFO } from "../lib/recruitment";

const fieldClass =
  "ui-input w-full rounded-xl px-4 py-3 text-ink placeholder:text-ink-subtle transition-colors";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-muted";
const SEMESTERS = ["1", "3"];

export default function Recruitment() {
  const [form, setForm] = useState({
    name: "",
    usn: "",
    semester: "",
    section: "",
    phone_number: "",
    domain: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = "Recruitment | AdroIT";
  }, []);

  const update = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "usn") next = value.toUpperCase();
    if (name === "section") next = value.replace(/[^a-z]/gi, "").slice(0, 1).toUpperCase();
    if (name === "phone_number") next = value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, [name]: next }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (!supabase) throw new Error("Supabase is not connected. Add the project URL and anon key, then try again.");
      const { error: insertError } = await supabase.from("recruitments").insert({
        name: form.name.trim(),
        usn: form.usn.trim(),
        semester: form.semester,
        section: form.section,
        phone_number: form.phone_number,
        domain: form.domain,
      });
      if (insertError) throw new Error(insertError.message);
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not save registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        to="/"
        className="ui-pill inline-flex w-fit min-h-10 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-ink transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <p className="mt-6 font-mono text-xs tracking-[0.22em] uppercase text-primary-ink">
        AdroIT · RNSIT · CSE
      </p>
      <h1 className="ui-heading mt-3 text-3xl font-bold text-ink">Recruitment 2026</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="ui-well flex items-center gap-3 rounded-2xl p-4">
          <CalendarDays size={18} className="shrink-0 text-primary" />
          <p className="text-sm text-ink">{RECRUITMENT_INFO.dates}</p>
        </div>
        <div className="ui-well flex items-center gap-3 rounded-2xl p-4">
          <Clock size={18} className="shrink-0 text-primary" />
          <p className="text-sm text-ink">{RECRUITMENT_INFO.time}</p>
        </div>
        <div className="ui-well flex items-center gap-3 rounded-2xl p-4">
          <MapPin size={18} className="shrink-0 text-primary" />
          <p className="text-sm text-ink">{RECRUITMENT_INFO.venue}</p>
        </div>
      </div>

      {done ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8">
          <h2 className="text-lg font-semibold text-emerald-900">You're registered!</h2>
          <p className="mt-2 text-sm text-emerald-800">
            {form.name}, your recruitment registration for <strong>{form.domain}</strong> is saved. See you at the recruitment!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 ui-card rounded-2xl p-6 sm:p-8">
          <div>
            <label htmlFor="name" className={labelClass}>Name</label>
            <input id="name" name="name" type="text" required value={form.name} onChange={update} className={fieldClass} placeholder="Your full name" />
          </div>

          <div>
            <label htmlFor="usn" className={labelClass}>USN</label>
            <input id="usn" name="usn" type="text" required value={form.usn} onChange={update} className={fieldClass} placeholder="1RN24CS001" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="semester" className={labelClass}>Semester</label>
              <select id="semester" name="semester" required value={form.semester} onChange={update} className={fieldClass}>
                <option value="">Select</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="section" className={labelClass}>Section</label>
              <input id="section" name="section" type="text" required minLength={1} maxLength={1} pattern="[A-Za-z]" title="Enter one letter" value={form.section} onChange={update} className={fieldClass} placeholder="A" />
            </div>
          </div>

          <div>
            <label htmlFor="phone_number" className={labelClass}>Phone Number</label>
            <input id="phone_number" name="phone_number" type="tel" inputMode="numeric" required minLength={10} maxLength={10} pattern="[0-9]{10}" title="Enter a 10-digit mobile number" value={form.phone_number} onChange={update} className={fieldClass} placeholder="9876543210" />
          </div>

          <div>
            <label htmlFor="domain" className={labelClass}>Domain</label>
            <select id="domain" name="domain" required value={form.domain} onChange={update} className={fieldClass}>
              <option value="">Select a domain</option>
              {RECRUITMENT_DOMAINS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="ui-solid inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Register"}
          </button>
        </form>
      )}
    </div>
  );
}
