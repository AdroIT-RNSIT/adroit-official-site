import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { BTN, BTN_PRIMARY, INPUT, LABEL, PANEL, YEAR_LABEL, api, formatIST, fromIstInput, toIstInput } from "./shared";
import { Notice } from "./ui";

const REASON = {
  OPEN: { label: "Open", tone: "text-emerald-400", text: "Students can register now." },
  CLOSED: { label: "Closed", tone: "text-slate-400", text: "Registration is switched off." },
  NOT_STARTED: { label: "Scheduled", tone: "text-amber-300", text: "Switched on, but the opening time hasn't arrived yet." },
  ENDED: { label: "Ended", tone: "text-slate-400", text: "Switched on, but the closing time has passed." },
};

function toForm(s) {
  return {
    recruitmentName: s.recruitmentName,
    registrationStartAt: toIstInput(s.registrationStartAt),
    registrationEndAt: toIstInput(s.registrationEndAt),
    recruitmentDate: s.recruitmentDate || "",
    recruitmentTime: s.recruitmentTime || "",
    recruitmentVenue: s.recruitmentVenue || "",
    announcement: s.announcement || "",
    instructions: (s.instructions || []).join("\n"),
    nextSteps: s.nextSteps || "",
    whatsappLink: s.whatsappLink || "",
    allowedYears: s.allowedYears,
    domains: s.domains.map((d) => ({ ...d })),
  };
}

function toPatch(f) {
  return {
    recruitmentName: f.recruitmentName,
    registrationStartAt: fromIstInput(f.registrationStartAt),
    registrationEndAt: fromIstInput(f.registrationEndAt),
    recruitmentDate: f.recruitmentDate || null,
    recruitmentTime: f.recruitmentTime,
    recruitmentVenue: f.recruitmentVenue,
    announcement: f.announcement,
    instructions: f.instructions.split("\n").map((s) => s.trim()).filter(Boolean),
    nextSteps: f.nextSteps,
    whatsappLink: f.whatsappLink.trim(),
    allowedYears: f.allowedYears,
    domains: f.domains.map(({ id, name, description, target }) => ({ id, name, description, target: Number(target) || 0 })),
  };
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </div>
  );
}

export default function Settings({ data, onSaved, onExpired }) {
  const { settings, status, serverTime } = data;
  const [form, setForm] = useState(() => toForm(settings));
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const dirty = JSON.stringify(toPatch(form)) !== JSON.stringify(toPatch(toForm(settings)));
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const patch = async (body, success, { resetForm = false } = {}) => {
    setBusy(true);
    setNotice(null);
    const res = await api("/settings", onExpired, { method: "PATCH", body: JSON.stringify(body) });
    setBusy(false);
    if (res.ok) {
      setErrors({});
      if (resetForm) setForm(toForm(res.data.settings));
      onSaved(res.data);
      setNotice({ tone: "ok", text: success });
    } else if (res.status !== 401) {
      setErrors(res.data.errors || {});
      setNotice({ tone: "error", text: res.data.message || "Couldn't save settings." });
    }
  };

  const toggle = () => {
    const opening = !settings.registrationOpen;
    const message = opening
      ? "Open registration? Students will be able to register as soon as the opening time (if any) has passed."
      : "Close registration? New submissions will be refused immediately. Existing registrations are kept.";
    if (!window.confirm(message)) return;
    patch({ registrationOpen: opening }, opening ? "Registration switched on." : "Registration closed. Existing records are kept.");
  };

  const save = (e) => {
    e.preventDefault();
    if (form.registrationStartAt && form.registrationEndAt && form.registrationEndAt <= form.registrationStartAt) {
      setErrors({ registrationEndAt: "The closing time must be after the opening time." });
      return;
    }
    patch(toPatch(form), "Settings saved. The public page shows them within a few seconds.", { resetForm: true });
  };

  const reason = REASON[status.reason];

  return (
    <div className="grid gap-6">
      <section className={`${PANEL} p-5 sm:p-6`} aria-labelledby="reg-status">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 id="reg-status" className="font-semibold text-white">
              Registration status: <span className={reason.tone}>{reason.label}</span>
            </h3>
            <p className="mt-1 text-sm text-slate-400">{reason.text}</p>
            <p className="mt-2 text-xs text-slate-500">
              Opens {settings.registrationStartAt ? formatIST(settings.registrationStartAt) : "immediately"} · Closes{" "}
              {settings.registrationEndAt ? formatIST(settings.registrationEndAt) : "when you close it"} · Server time {formatIST(serverTime)} IST
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/recruitment" target="_blank" rel="noopener" className={BTN}>
              Preview public page
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <button
              type="button"
              disabled={busy}
              onClick={toggle}
              className={settings.registrationOpen ? BTN : BTN_PRIMARY}
              aria-describedby="reg-status"
            >
              {settings.registrationOpen ? "Close registration" : "Open registration"}
            </button>
          </div>
        </div>
      </section>

      <Notice notice={notice} />

      <form onSubmit={save} className="grid gap-6" noValidate>
        <section className={`${PANEL} grid gap-4 p-5 sm:grid-cols-2 sm:p-6`} aria-labelledby="reg-window">
          <h3 id="reg-window" className="font-semibold text-white sm:col-span-2">
            Registration window <span className="text-sm font-normal text-slate-400">(times are IST)</span>
          </h3>
          <Field id="s-start" label="Opens at" error={errors.registrationStartAt} hint="Leave empty to open as soon as registration is switched on.">
            <input id="s-start" type="datetime-local" className={INPUT} value={form.registrationStartAt} onChange={(e) => set("registrationStartAt", e.target.value)} />
          </Field>
          <Field id="s-end" label="Closes at (deadline)" error={errors.registrationEndAt} hint="Shown to students as the deadline.">
            <input id="s-end" type="datetime-local" className={INPUT} value={form.registrationEndAt} min={form.registrationStartAt || undefined} onChange={(e) => set("registrationEndAt", e.target.value)} />
          </Field>
        </section>

        <section className={`${PANEL} grid gap-4 p-5 sm:grid-cols-2 sm:p-6`} aria-labelledby="reg-event">
          <h3 id="reg-event" className="font-semibold text-white sm:col-span-2">
            Recruitment details
          </h3>
          <Field id="s-name" label="Recruitment name" error={errors.recruitmentName}>
            <input id="s-name" className={INPUT} maxLength={80} value={form.recruitmentName} onChange={(e) => set("recruitmentName", e.target.value)} />
          </Field>
          <Field id="s-date" label="Recruitment date" error={errors.recruitmentDate}>
            <input id="s-date" type="date" className={INPUT} value={form.recruitmentDate} onChange={(e) => set("recruitmentDate", e.target.value)} />
          </Field>
          <Field id="s-time" label="Recruitment time" error={errors.recruitmentTime} hint='For example "10:00 AM – 1:00 PM"'>
            <input id="s-time" className={INPUT} maxLength={40} value={form.recruitmentTime} onChange={(e) => set("recruitmentTime", e.target.value)} />
          </Field>
          <Field id="s-venue" label="Venue" error={errors.recruitmentVenue}>
            <input id="s-venue" className={INPUT} maxLength={120} value={form.recruitmentVenue} onChange={(e) => set("recruitmentVenue", e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="s-ann" label="Announcement" error={errors.announcement}>
              <textarea id="s-ann" rows={3} className={INPUT} maxLength={1000} value={form.announcement} onChange={(e) => set("announcement", e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field id="s-ins" label="Important instructions" error={errors.instructions} hint="One per line, up to 10.">
              <textarea id="s-ins" rows={4} className={INPUT} value={form.instructions} onChange={(e) => set("instructions", e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field id="s-next" label="Next steps (shown after registering)" error={errors.nextSteps}>
              <textarea id="s-next" rows={2} className={INPUT} maxLength={600} value={form.nextSteps} onChange={(e) => set("nextSteps", e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              id="s-wa"
              label="WhatsApp group link"
              error={errors.whatsappLink}
              hint="Shown as a Join button only to students who have just registered; it never appears on the public page. Leave empty for no group."
            >
              <div className="flex gap-2">
                <input
                  id="s-wa"
                  type="url"
                  inputMode="url"
                  spellCheck={false}
                  className={INPUT}
                  placeholder="https://chat.whatsapp.com/…"
                  value={form.whatsappLink}
                  onChange={(e) => set("whatsappLink", e.target.value)}
                />
                {/^https:\/\/chat\.whatsapp\.com\/\w+/.test(form.whatsappLink.trim()) && (
                  <a href={form.whatsappLink.trim()} target="_blank" rel="noopener noreferrer" className={`${BTN} shrink-0`}>
                    Test link
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </Field>
          </div>
        </section>

        <section className={`${PANEL} grid gap-4 p-5 sm:grid-cols-2 sm:p-6`} aria-labelledby="reg-elig">
          <h3 id="reg-elig" className="font-semibold text-white sm:col-span-2">
            Eligibility
          </h3>
          <fieldset>
            <legend className={LABEL}>Eligible years (branch is always CSE)</legend>
            <div className="flex flex-wrap gap-4">
              {Object.entries(YEAR_LABEL).map(([id, label]) => (
                <label key={id} className="flex min-h-10 items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.allowedYears.includes(id)}
                    onChange={(e) =>
                      set("allowedYears", e.target.checked ? [...form.allowedYears, id] : form.allowedYears.filter((y) => y !== id))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            {errors.allowedYears && <p className="mt-1 text-xs text-rose-300">{errors.allowedYears}</p>}
          </fieldset>
          <p className="self-center text-sm text-slate-400">Students type their section as a single letter (A–Z).</p>
        </section>

        <section className={`${PANEL} p-5 sm:p-6`} aria-labelledby="reg-domains">
          <h3 id="reg-domains" className="font-semibold text-white">
            Domains and targets
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Names and descriptions show on the public page. Targets drive the "still needed" figures; 0 means no target. Domain IDs can't be changed here.
          </p>
          {errors.domains && <p className="mt-2 text-xs text-rose-300">{errors.domains}</p>}
          <div className="mt-4 grid gap-4">
            {form.domains.map((d, i) => (
              <fieldset key={d.id} className="grid gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-[1fr_8rem]">
                <legend className="px-1 font-mono text-xs text-slate-500">{d.id}</legend>
                <Field id={`d-${d.id}-name`} label="Name">
                  <input
                    id={`d-${d.id}-name`}
                    className={INPUT}
                    maxLength={60}
                    value={d.name}
                    onChange={(e) => set("domains", form.domains.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  />
                </Field>
                <Field id={`d-${d.id}-target`} label="Target">
                  <input
                    id={`d-${d.id}-target`}
                    type="number"
                    min={0}
                    max={5000}
                    className={INPUT}
                    value={d.target}
                    onChange={(e) => set("domains", form.domains.map((x, j) => (j === i ? { ...x, target: e.target.value } : x)))}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field id={`d-${d.id}-desc`} label="Description">
                    <textarea
                      id={`d-${d.id}-desc`}
                      rows={2}
                      maxLength={300}
                      className={INPUT}
                      value={d.description}
                      onChange={(e) => set("domains", form.domains.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
                    />
                  </Field>
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 bg-black/90 py-4">
          {settings.updatedAt && <span className="mr-auto text-xs text-slate-500">Last saved {formatIST(settings.updatedAt)} IST</span>}
          <button type="button" className={BTN} disabled={!dirty || busy} onClick={() => setForm(toForm(settings))}>
            Discard changes
          </button>
          <button type="submit" className={BTN_PRIMARY} disabled={!dirty || busy}>
            {busy ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
