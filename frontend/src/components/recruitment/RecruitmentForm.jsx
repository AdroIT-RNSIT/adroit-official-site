import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock } from "lucide-react";
import {
  DOMAIN_ACCENTS,
  detailErrors,
  normalizeUsn,
  selectionError,
  selectionType,
  submitRegistration,
} from "../../lib/recruitment";
import Turnstile from "./Turnstile";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const INPUT = "ui-input h-12 w-full rounded-xl px-4 text-ink placeholder:text-ink-subtle/70";
const BACK = `ui-pill inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-ink ${FOCUS}`;
const NEXT = `ui-solid inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold ${FOCUS}`;
const GROUP_LABEL = "text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted";

const STEPS = ["Your details", "Domains", "Review"];
const DETAIL_FIELDS = ["fullName", "usn", "academicYear", "semester", "section", "phoneNumber", "githubProfile"];
const RANK = ["1st choice", "2nd choice"];

// Keeps the field to 10 digits; a pasted "+91 98450 12345" or "098450 12345" loses its prefix first.
function tenDigits(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

const EMPTY = {
  fullName: "",
  usn: "",
  academicYear: "",
  semester: "",
  section: "",
  phoneNumber: "",
  githubProfile: "",
};

function Field({ id, label, hint, error, optional = false, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {optional ? (
          <span className="font-normal text-ink-muted"> (optional)</span>
        ) : (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

// A row of equal-width choices, the same height as the text boxes beside it.
function Segmented({ label, error, options, value, onChange, name }) {
  const labelId = useId();
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend id={labelId} className="mb-1.5 text-sm font-medium text-ink">
        {label}
        <span className="text-danger" aria-hidden="true">
          {" "}
          *
        </span>
      </legend>
      <div role="group" aria-labelledby={labelId} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`ui-pill inline-flex h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium text-ink ${FOCUS}`}
          >
            {value === o.value && <Check size={15} className="shrink-0" aria-hidden="true" />}
            {o.label}
          </button>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Progress({ step }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Registration progress">
      {STEPS.map((label, i) => {
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li
            key={label}
            className={`flex min-w-0 items-center gap-2 ${state === "current" ? "flex-1" : "shrink-0 sm:flex-1"}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                state === "todo" ? "ui-well text-ink-muted" : "ui-solid"
              }`}
              aria-hidden="true"
            >
              {state === "done" ? <Check size={16} /> : i + 1}
            </span>
            <span className={`truncate text-sm ${state === "current" ? "font-semibold text-ink" : "sr-only text-ink-muted sm:not-sr-only"}`}>
              {label}
              <span className="sr-only">{state === "done" ? " (done)" : state === "current" ? " (current step)" : ""}</span>
            </span>
            {i < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-line sm:block" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

function Summary({ rows }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{k}</dt>
          <dd className="mt-0.5 break-words text-sm text-ink">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function RecruitmentForm({ config, onSuccess, onClosed }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [tech, setTech] = useState([]);
  const [wantsNonTech, setWantsNonTech] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const honeypot = useRef(null);
  const headingRef = useRef(null);
  const firstStepRender = useRef(true);

  const techDomains = config.domains.filter((d) => d.technical);
  const nonTech = config.domains.find((d) => !d.technical);
  const domainName = (id) => config.domains.find((d) => d.id === id)?.name || id;
  const year = config.years.find((y) => y.id === form.academicYear);
  const type = selectionType(tech, wantsNonTech);

  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  // The year isn't asked for: it follows from the semester (semester 1 is first year, semester 3 second year).
  const pickSemester = (semester) => {
    const owner = config.years.find((y) => y.semesters.includes(semester));
    setForm((f) => ({ ...f, semester, academicYear: owner?.id || "" }));
    setErrors((e) => ({ ...e, semester: undefined, academicYear: undefined }));
  };

  const toggleTech = (id) => {
    setTech((current) => (current.includes(id) ? current.filter((x) => x !== id) : current.length < 2 ? [...current, id] : current));
    setErrors((e) => ({ ...e, domains: undefined }));
  };

  const goTo = (target) => {
    setNotice(null);
    if (target >= 1) {
      const e = detailErrors(form, config);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(0);
        setNotice({ tone: "danger", text: "Please fix the highlighted details." });
        return;
      }
    }
    if (target >= 2) {
      const problem = selectionError(tech, wantsNonTech);
      if (problem) {
        setErrors({ domains: problem });
        setStep(1);
        setNotice({ tone: "danger", text: problem });
        return;
      }
    }
    setErrors({});
    setStep(target);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting || !type) return;
    if (!confirmed) {
      setErrors({ confirm: "Please confirm your details are correct." });
      return;
    }
    if (config.captcha && !captchaToken) {
      setNotice({ tone: "danger", text: "Please complete the verification first." });
      return;
    }
    setSubmitting(true);
    setNotice(null);
    const payload = {
      fullName: form.fullName.replace(/\s+/g, " ").trim(),
      usn: normalizeUsn(form.usn),
      branch: "CSE",
      academicYear: form.academicYear,
      semester: Number(form.semester),
      section: form.section.trim().toUpperCase(),
      phoneNumber: form.phoneNumber,
      githubProfile: form.githubProfile.trim(),
      registrationType: type,
      ...(type === "TECHNICAL"
        ? { preferences: { first: tech[0], second: tech[1], third: wantsNonTech ? nonTech?.id || "NON_TECH" : null } }
        : {}),
      website: honeypot.current?.value || "",
      ...(config.captcha ? { captchaToken } : {}),
    };
    const { status, data } = await submitRegistration(payload);
    setSubmitting(false);

    if (status === 201 && data.registration) {
      onSuccess(data.registration);
      return;
    }
    if (config.captcha) {
      setCaptchaToken("");
      setCaptchaKey((k) => k + 1);
    }
    if (data.code === "REGISTRATION_CLOSED") {
      onClosed(data.status);
      return;
    }
    if (data.code === "VALIDATION" && data.errors) {
      const detailProblem = DETAIL_FIELDS.some((k) => data.errors[k]);
      const domainProblem = data.errors.first || data.errors.second || data.errors.third || data.errors.preferences;
      setErrors(domainProblem && !detailProblem ? { domains: domainProblem } : data.errors);
      setStep(detailProblem ? 0 : domainProblem ? 1 : 2);
      setNotice({ tone: "danger", text: data.message || "Please fix the highlighted fields." });
      return;
    }
    if (data.code === "DUPLICATE_USN") setErrors({ usn: "Already registered." });
    const fallback =
      status === 429
        ? "Too many attempts from this network. Please wait a little and try again."
        : "We couldn't save your registration. Please try again in a few minutes.";
    setNotice({ tone: "danger", text: data.message || fallback });
  };

  const describedBy = (name, hint) => (errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined);

  const choiceSummary =
    type === "TECHNICAL"
      ? `1. ${domainName(tech[0])}, 2. ${domainName(tech[1])}${wantsNonTech ? `, plus ${nonTech?.name}` : ""}.`
      : type === "NON_TECH_ONLY"
        ? `${nonTech?.name} only.`
        : tech.length === 1
          ? `1. ${domainName(tech[0])}. Pick one more technical domain.`
          : "Nothing picked yet.";

  return (
    <form onSubmit={submit} noValidate className="ui-card relative rounded-3xl p-5 sm:p-8" aria-describedby="recruit-notice">
      <Progress step={step} />

      <div id="recruit-notice" aria-live="assertive" className="mt-5">
        {notice && (
          <p role="alert" className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {notice.text}
          </p>
        )}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {step === 0 && (
        <section aria-labelledby="step-details" className="mt-6">
          <h3 id="step-details" ref={headingRef} tabIndex={-1} className="ui-heading text-xl font-bold text-ink outline-none">
            Your details
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Fields marked <span className="text-danger">*</span> are required.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="fullName" label="Full name" error={errors.fullName}>
              <input
                id="fullName"
                className={INPUT}
                autoComplete="name"
                maxLength={80}
                placeholder="e.g. Asha Rao"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={describedBy("fullName")}
                required
              />
            </Field>
            <Field id="usn" label="USN" error={errors.usn}>
              <input
                id="usn"
                className={`${INPUT} uppercase placeholder:normal-case`}
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={15}
                placeholder="e.g. 1RN24CS001"
                value={form.usn}
                onChange={(e) => set("usn", e.target.value.toUpperCase())}
                aria-invalid={Boolean(errors.usn)}
                aria-describedby={describedBy("usn")}
                required
              />
            </Field>
            <div>
              <label htmlFor="branch" className="mb-1.5 block text-sm font-medium text-ink">
                Branch
              </label>
              <div className="relative">
                <input
                  id="branch"
                  readOnly
                  value="Computer Science & Engineering (CSE)"
                  className={`${INPUT} cursor-default pr-11 text-ink-muted`}
                  aria-describedby="branch-hint"
                />
                <Lock size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
              </div>
              <p id="branch-hint" className="mt-1.5 text-xs text-ink-muted">
                Recruitment is open to CSE students only.
              </p>
            </div>
            <Field id="phoneNumber" label="Mobile number" hint="10-digit number, without +91" error={errors.phoneNumber}>
              <input
                id="phoneNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                className={`${INPUT} tabular-nums`}
                placeholder="e.g. 9876543210"
                value={form.phoneNumber}
                onChange={(e) => set("phoneNumber", tenDigits(e.target.value))}
                aria-invalid={Boolean(errors.phoneNumber)}
                aria-describedby={describedBy("phoneNumber", true)}
                required
              />
            </Field>
            <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
              <Segmented
                name="semester"
                label="Semester"
                error={errors.semester || errors.academicYear}
                value={Number(form.semester) || ""}
                onChange={pickSemester}
                options={config.years.flatMap((y) => y.semesters.map((s) => ({ value: s, label: `Semester ${s}` })))}
              />
              <Field id="section" label="Section" error={errors.section}>
                <input
                  id="section"
                  className={`${INPUT} !w-24 text-center font-semibold uppercase placeholder:font-normal placeholder:normal-case`}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={1}
                  placeholder="e.g. A"
                  value={form.section}
                  onChange={(e) => set("section", e.target.value.replace(/[^a-z]/gi, "").slice(-1).toUpperCase())}
                  aria-invalid={Boolean(errors.section)}
                  aria-describedby={describedBy("section")}
                  required
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="githubProfile" label="GitHub profile link" optional error={errors.githubProfile}>
                <input
                  id="githubProfile"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  spellCheck={false}
                  maxLength={120}
                  className={INPUT}
                  placeholder="e.g. https://github.com/username"
                  value={form.githubProfile}
                  onChange={(e) => set("githubProfile", e.target.value)}
                  aria-invalid={Boolean(errors.githubProfile)}
                  aria-describedby={describedBy("githubProfile")}
                />
              </Field>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={() => goTo(1)} className={NEXT}>
              Next: domains
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      {step === 1 && (
        <section aria-labelledby="step-domains" className="mt-6">
          <h3 id="step-domains" ref={headingRef} tabIndex={-1} className="ui-heading text-xl font-bold text-ink outline-none">
            Choose your domains
          </h3>
          <p id="domains-help" className="mt-1 text-sm text-ink-muted">
            Pick two technical domains in the order you prefer them. You can also add {nonTech?.name || "Non-Tech"}, or choose only {nonTech?.name || "Non-Tech"}.
          </p>

          <div className="mt-6 flex items-baseline justify-between gap-3">
            <p id="tech-label" className={GROUP_LABEL}>
              Technical · pick two
            </p>
            <p className="text-xs font-semibold tabular-nums text-ink-muted" aria-hidden="true">
              {tech.length}/2
            </p>
          </div>
          <div role="group" aria-labelledby="tech-label" aria-describedby="domains-help" className="mt-2 grid gap-3 sm:grid-cols-2">
            {techDomains.map((d) => {
              const rank = tech.indexOf(d.id);
              const selected = rank !== -1;
              const full = !selected && tech.length >= 2;
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={selected}
                  disabled={full}
                  onClick={() => toggleTech(d.id)}
                  className={`ui-pill flex h-full min-h-16 items-start gap-3 rounded-2xl px-4 py-3.5 text-left disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`}
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: DOMAIN_ACCENTS[d.id] }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink">{d.name}</span>
                      {selected && (
                        <span className="ui-chip inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-ink">
                          <Check size={12} aria-hidden="true" />
                          {RANK[rank]}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{d.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {nonTech && (
            <>
              <p className={`${GROUP_LABEL} mt-6`}>Non-technical · optional</p>
              <button
                type="button"
                aria-pressed={wantsNonTech}
                onClick={() => {
                  setWantsNonTech((v) => !v);
                  setErrors((e) => ({ ...e, domains: undefined }));
                }}
                className={`ui-pill mt-2 flex min-h-16 w-full items-start gap-3 rounded-2xl px-4 py-3.5 text-left ${FOCUS}`}
              >
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: DOMAIN_ACCENTS[nonTech.id] }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{nonTech.name}</span>
                    {wantsNonTech && (
                      <span className="ui-chip inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-ink">
                        <Check size={12} aria-hidden="true" />
                        Selected
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{nonTech.description}</span>
                </span>
              </button>
            </>
          )}

          <div className="ui-well mt-6 rounded-2xl px-4 py-3">
            <p className="text-sm text-ink" aria-live="polite">
              <span className="font-semibold">Your choices: </span>
              {choiceSummary}
            </p>
            {tech.length >= 2 && <p className="mt-1 text-sm text-ink-muted">To swap a technical domain, untick one first.</p>}
          </div>
          {errors.domains && (
            <p id="domains-error" className="mt-2 text-sm font-medium text-danger">
              {errors.domains}
            </p>
          )}

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button type="button" onClick={() => goTo(0)} className={BACK}>
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </button>
            <button type="button" onClick={() => goTo(2)} className={NEXT}>
              Next: review
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section aria-labelledby="step-review" className="mt-6">
          <h3 id="step-review" ref={headingRef} tabIndex={-1} className="ui-heading text-xl font-bold text-ink outline-none">
            Review and submit
          </h3>
          <div className="ui-well mt-5 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-ink">Your details</h4>
              <button type="button" onClick={() => goTo(0)} className={`min-h-10 rounded-full px-3 text-sm font-semibold text-primary hover:underline ${FOCUS}`}>
                Edit<span className="sr-only"> your details</span>
              </button>
            </div>
            <div className="mt-3">
              <Summary
                rows={[
                  ["Name", form.fullName.replace(/\s+/g, " ").trim()],
                  ["USN", normalizeUsn(form.usn)],
                  ["Branch", "CSE"],
                  ["Semester", `Semester ${form.semester}${year ? ` (${year.label})` : ""}`],
                  ["Section", form.section.toUpperCase()],
                  ["Mobile", form.phoneNumber],
                  ["GitHub", form.githubProfile.trim() || "Not provided"],
                ]}
              />
            </div>
          </div>
          <div className="ui-well mt-4 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-ink">Your domains</h4>
              <button type="button" onClick={() => goTo(1)} className={`min-h-10 rounded-full px-3 text-sm font-semibold text-primary hover:underline ${FOCUS}`}>
                Edit<span className="sr-only"> your domains</span>
              </button>
            </div>
            {type === "TECHNICAL" ? (
              <ol className="mt-3 grid gap-2 text-sm text-ink">
                <li>
                  <span className="text-ink-muted">1st:</span> {domainName(tech[0])}
                </li>
                <li>
                  <span className="text-ink-muted">2nd:</span> {domainName(tech[1])}
                </li>
                {wantsNonTech && (
                  <li>
                    <span className="text-ink-muted">Also:</span> {nonTech?.name}
                  </li>
                )}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-ink">{nonTech?.name || "Non-Tech"} only</p>
            )}
          </div>

          <label className="mt-5 flex min-h-10 cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                setErrors((x) => ({ ...x, confirm: undefined }));
              }}
              aria-invalid={Boolean(errors.confirm)}
              aria-describedby={errors.confirm ? "confirm-error" : undefined}
              className={`mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-primary)] ${FOCUS}`}
            />
            <span className="text-sm text-ink">
              My details are correct. I understand I can register only once, and the AdroIT team will use my phone number only for recruitment updates.
            </span>
          </label>
          {errors.confirm && (
            <p id="confirm-error" className="mt-1.5 text-sm font-medium text-danger">
              {errors.confirm}
            </p>
          )}

          {config.captcha && (
            <div className="mt-5">
              <Turnstile key={captchaKey} siteKey={config.captcha.siteKey} onToken={setCaptchaToken} />
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button type="button" onClick={() => goTo(1)} className={BACK} disabled={submitting}>
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className={`${NEXT} disabled:cursor-wait disabled:opacity-70`}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit registration
                  <Check size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </section>
      )}
    </form>
  );
}
