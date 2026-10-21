import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { findRegistrationDomain } from "../data/domainRegistration";
import { sharedEvents } from "../data/events";
import { supabase } from "../lib/supabaseClient";
import { useRegistrationClosed } from "../lib/registrationStatus";

const fieldClass =
  "ui-input w-full rounded-xl px-4 py-3 text-ink placeholder:text-ink-subtle transition-colors";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-muted";
const BACK = "ui-pill inline-flex w-fit min-h-10 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-ink transition-colors";


export default function DomainRegister() {
  const { domain: slug } = useParams();
  const location = useLocation();
  const domain = findRegistrationDomain(slug);
  const bootcamp = sharedEvents.find((item) => item.slug === "skill-up-bootcamp");
  const session = bootcamp?.sessions?.find((item) => item.slug === slug) || null;
  const backTo = location.state?.back || "/";
  const [form, setForm] = useState({
    name: "",
    usn: "",
    mobile: "",
    semester: "3",
    section: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const isClosed = useRegistrationClosed()(slug);

  if (!domain) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-ink">
        <h1 className="ui-heading text-2xl font-bold text-ink">Domain not found</h1>
        <Link to="/" data-part="back" className={`${BACK} mt-6`}>
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
    if (isClosed) return;
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
    <div className="mx-auto max-w-xl px-4 py-12 text-ink sm:px-6 sm:py-16">
      <Link to={backTo} data-part="back" className={BACK}>
        <ArrowLeft size={16} />
        Back
      </Link>
      <p className="mt-6 font-mono text-xs tracking-[0.22em] uppercase text-primary-ink">
        {domain.label}
      </p>
      <h1 className="ui-heading mt-3 text-3xl font-bold text-ink">{domain.title}</h1>
      {session?.day && (
        <p className="mt-2 text-sm font-medium text-ink-subtle">{session.day}</p>
      )}

      {session?.topics?.length > 0 && (
        <section className="ui-card mt-8 rounded-2xl p-6">
          <h2 className="ui-heading text-lg font-bold text-ink">What We'll Cover</h2>
          <ul className="mt-4 space-y-2.5">
            {session.topics.map((topic) => (
              <li key={topic} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isClosed ? (
        <div className="ui-card mt-8 rounded-2xl px-6 py-8">
          <h2 className="ui-heading text-lg font-semibold text-ink">Registration closed</h2>
          <p className="mt-2 text-sm text-ink-muted">
            {domain.title} registrations are closed for now. Follow AdroIT for updates on the next round.
          </p>
        </div>
      ) : done ? (
        <div role="status" className="mt-8 rounded-2xl border border-success/30 bg-success/10 px-6 py-8">
          <h2 className="text-lg font-semibold text-success">You're registered</h2>
          <p className="mt-2 text-sm text-ink-muted">
            {form.name}, your {domain.title} registration is saved.
          </p>
          {domain.whatsapp && (
            <a
              href={domain.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-solid mt-6 inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Join WhatsApp Group
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="ui-card mt-8 space-y-5 rounded-2xl p-6 sm:p-8">
          <div>
            <label htmlFor="name" className={labelClass}>
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
            <label htmlFor="usn" className={labelClass}>
              USN
            </label>
            <input
              id="usn"
              name="usn"
              type="text"
              required
              value={form.usn}
              onChange={update}
              className={fieldClass}
              placeholder="1RN23CS001"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="semester" className={labelClass}>
                Semester
              </label>
              <input
                id="semester"
                name="semester"
                type="text"
                readOnly
                value={form.semester}
                className={`${fieldClass} cursor-not-allowed opacity-70`}
              />
            </div>
            <div>
              <label htmlFor="section" className={labelClass}>
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
            <label htmlFor="mobile" className={labelClass}>
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
            <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
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

      {!session?.topics?.length && (
      <section className="ui-card mt-8 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          {bootcamp?.poster && session && (
            <img
              src={bootcamp.poster}
              alt=""
              className="h-14 w-24 shrink-0 rounded-lg border border-line bg-ink/5 object-cover"
            />
          )}
          <div>
            {session?.day && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{session.day}</p>
            )}
            <h2 className="ui-heading text-lg font-bold text-ink">{session?.title || domain.title}</h2>
            {(session?.detail || domain.description) && (
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{session?.detail || domain.description}</p>
            )}
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
