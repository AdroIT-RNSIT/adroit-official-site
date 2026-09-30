import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { findRegistrationDomain } from "../data/domainRegistration";
import { supabase } from "../lib/supabaseClient";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

const SEMESTERS = ["1", "3"];

export default function DomainRegister() {
  const { domain: slug } = useParams();
  const domain = findRegistrationDomain(slug);
  const [form, setForm] = useState({
    name: "",
    usn: "",
    mobile: "",
    semester: "",
    section: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!domain) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Domain not found</h1>
        <Link
          to="/"
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-sky-600/40 hover:text-sky-800"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>
    );
  }

  const update = (event) => {
    const { name, value } = event.target;
    let next = value;
    if (name === "usn") next = value.toUpperCase();
    if (name === "section") next = value.replace(/[^a-z]/gi, "").slice(0, 1).toUpperCase();
    if (name === "mobile") next = value.replace(/\D/g, "").slice(0, 10);
    setForm((current) => ({ ...current, [name]: next }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      domain: domain.slug,
      domain_name: domain.title,
      name: form.name.trim(),
      usn: form.usn.trim().toUpperCase(),
      mobile: form.mobile,
      semester: form.semester,
      section: form.section,
      submitted_at: new Date().toISOString(),
    };

    try {
      if (!supabase) {
        throw new Error("Supabase is not connected yet. Add the project URL and anon key, then try again.");
      }

      const { error: insertError } = await supabase.from("domain_registrations").insert(payload);
      if (insertError) throw new Error(insertError.message);
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not save this registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-sky-600/40 hover:text-sky-800"
      >
        <ArrowLeft size={16} />
        Back
      </Link>
      <p className="mt-6 font-mono text-xs tracking-[0.22em] uppercase text-sky-800">
        {domain.label}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">{domain.title}</h1>
      <p className="mt-3 text-slate-600 leading-relaxed">{domain.description}</p>

      {done ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8">
          <h2 className="text-lg font-semibold text-emerald-900">You're registered</h2>
          <p className="mt-2 text-sm text-emerald-800">
            {form.name}, your {domain.title} registration is saved.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={update}
              className={fieldClass}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="usn" className="mb-1.5 block text-sm font-medium text-slate-700">
              USN
            </label>
            <input
              id="usn"
              name="usn"
              type="text"
              required
              minLength={10}
              maxLength={12}
              pattern="[0-9A-Za-z]{10,12}"
              title="Enter your USN, for example 1RN23CS001"
              value={form.usn}
              onChange={update}
              className={fieldClass}
              placeholder="1RN23CS001"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="semester" className="mb-1.5 block text-sm font-medium text-slate-700">
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                required
                value={form.semester}
                onChange={update}
                className={fieldClass}
              >
                <option value="">Select</option>
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="section" className="mb-1.5 block text-sm font-medium text-slate-700">
                Section
              </label>
              <input
                id="section"
                name="section"
                type="text"
                required
                minLength={1}
                maxLength={1}
                pattern="[A-Za-z]"
                title="Enter one letter, for example A"
                value={form.section}
                onChange={update}
                className={fieldClass}
                placeholder="A"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-slate-700">
              Mobile number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              minLength={10}
              maxLength={10}
              pattern="[0-9]{10}"
              title="Enter a 10-digit mobile number"
              value={form.mobile}
              onChange={update}
              className={fieldClass}
              placeholder="9876543210"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-sky-900/15 transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Register"}
          </button>
        </form>
      )}
    </div>
  );
}
