import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Download, Search, X } from "lucide-react";
import {
  BTN,
  BTN_DANGER,
  BTN_PRIMARY,
  INPUT,
  LABEL,
  PANEL,
  STATUS_LABEL,
  TYPE_LABEL,
  YEAR_LABEL,
  api,
  domainName,
  download,
  formatIST,
} from "./shared";
import { Empty, Notice } from "./ui";

const SEMESTERS = { FIRST_YEAR: [1], SECOND_YEAR: [3] };
const DEFAULT_FILTERS = { q: "", status: "REGISTERED", domain: "", choice: "either", type: "", semester: "", section: "", from: "", to: "" };
const CHOICE_LABEL = { either: "1st or 2nd", first: "1st choice", second: "2nd choice" };

// Turns the panel's filters into the API's query parameters.
function toParams(f) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.status) p.set("status", f.status);
  if (f.type) p.set("type", f.type);
  if (f.semester) p.set("semester", f.semester);
  if (f.section) p.set("section", f.section);
  if (f.from) p.set("from", f.from);
  if (f.to) p.set("to", f.to);
  if (f.domain === "NON_TECH" || (f.domain && f.choice === "either")) p.set("domain", f.domain);
  else if (f.domain && f.choice === "first") p.set("first", f.domain);
  else if (f.domain && f.choice === "second") p.set("second", f.domain);
  return p;
}
const COLUMNS = [
  { key: "registrationId", label: "ID", sort: "registrationId" },
  { key: "fullName", label: "Name", sort: "fullName" },
  { key: "usn", label: "USN", sort: "usn" },
  { key: "year", label: "Year" },
  { key: "semester", label: "Sem", sort: "semester" },
  { key: "section", label: "Sec", sort: "section" },
  { key: "phoneNumber", label: "Phone" },
  { key: "type", label: "Type" },
  { key: "first", label: "1st" },
  { key: "second", label: "2nd" },
  { key: "third", label: "3rd" },
  { key: "createdAt", label: "Registered", sort: "createdAt" },
  { key: "status", label: "Status" },
];

function Select({ id, label, value, onChange, options, any = "Any" }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <select id={id} className={INPUT} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{any}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

function Detail({ registration, settings, onClose, onSaved, onDeleted, onExpired }) {
  const ref = useRef(null);
  const [form, setForm] = useState(() => ({
    ...registration,
    githubProfile: registration.githubProfile || "",
    preferences: { ...registration.preferences },
  }));
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  const tech = settings.domains.filter((d) => d.id !== "NON_TECH");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setPref = (k, v) => setForm((f) => ({ ...f, preferences: { ...f.preferences, [k]: v || null } }));

  const save = async () => {
    setBusy(true);
    setErrors({});
    setNotice(null);
    const technical = form.registrationType === "TECHNICAL";
    const body = {
      fullName: form.fullName,
      usn: form.usn,
      academicYear: form.academicYear,
      semester: Number(form.semester),
      section: form.section,
      phoneNumber: form.phoneNumber,
      githubProfile: form.githubProfile,
      registrationType: form.registrationType,
      preferences: technical ? form.preferences : null,
      status: form.status,
    };
    const res = await api(`/registrations/${registration.registrationId}`, onExpired, { method: "PATCH", body: JSON.stringify(body) });
    setBusy(false);
    if (res.ok) {
      setEditing(false);
      setNotice({ tone: "ok", text: "Saved. The change is in the audit log." });
      onSaved(res.data.registration);
    } else {
      setErrors(res.data.errors || {});
      setNotice({ tone: "error", text: res.data.message || "Couldn't save." });
    }
  };

  const remove = async () => {
    setBusy(true);
    const res = await api(`/registrations/${registration.registrationId}`, onExpired, {
      method: "DELETE",
      body: JSON.stringify({ confirm: confirmDelete }),
    });
    setBusy(false);
    if (res.ok) onDeleted(registration.registrationId);
    else setNotice({ tone: "error", text: res.data.message || "Couldn't delete." });
  };

  const display = { academicYear: YEAR_LABEL, status: STATUS_LABEL };
  const field = (k, label, input) => (
    <div>
      <p className={LABEL}>{label}</p>
      {editing ? input : <p className="break-words text-sm text-white">{display[k]?.[form[k]] || String(form[k] ?? "") || "—"}</p>}
      {errors[k] && <p className="mt-1 text-xs text-rose-300">{errors[k]}</p>}
    </div>
  );

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="reg-detail-title"
      className="m-auto w-[min(44rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0b0b0b] p-0 text-slate-200 backdrop:bg-black/70"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
        <div>
          <p className="font-mono text-sm text-sky-400">{registration.registrationId}</p>
          <h3 id="reg-detail-title" className="mt-1 text-lg font-semibold text-white">
            {registration.fullName}
          </h3>
          <p className="text-xs text-slate-500">
            Registered {formatIST(registration.createdAt)} · Updated {formatIST(registration.updatedAt)}
          </p>
        </div>
        <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className={`${BTN} w-10 px-0`}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="grid max-h-[65dvh] gap-5 overflow-y-auto p-5">
        <Notice notice={notice} />
        <div className="grid gap-4 sm:grid-cols-2">
          {field("fullName", "Name", <input className={INPUT} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />)}
          {field("usn", "USN", <input className={INPUT} value={form.usn} onChange={(e) => set("usn", e.target.value.toUpperCase())} />)}
          {field(
            "academicYear",
            "Year",
            <select className={INPUT} value={form.academicYear} onChange={(e) => set("academicYear", e.target.value)}>
              {Object.entries(YEAR_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>,
          )}
          {field(
            "semester",
            "Semester",
            <select className={INPUT} value={form.semester} onChange={(e) => set("semester", e.target.value)}>
              {(SEMESTERS[form.academicYear] || []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>,
          )}
          {field(
            "section",
            "Section",
            <input
              className={INPUT}
              maxLength={1}
              value={form.section}
              onChange={(e) => set("section", e.target.value.replace(/[^a-z]/gi, "").slice(-1).toUpperCase())}
            />,
          )}
          {field("phoneNumber", "Phone", <input className={INPUT} value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} />)}
          {field("githubProfile", "GitHub", <input className={INPUT} value={form.githubProfile} onChange={(e) => set("githubProfile", e.target.value)} />)}
          {field(
            "status",
            "Status",
            <select className={INPUT} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {Object.entries(STATUS_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>,
          )}
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <p className={LABEL}>Registration type and preferences</p>
          {editing ? (
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <select className={INPUT} aria-label="Registration type" value={form.registrationType} onChange={(e) => set("registrationType", e.target.value)}>
                {Object.entries(TYPE_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              {form.registrationType === "TECHNICAL" && (
                <>
                  {["first", "second"].map((k) => (
                    <select key={k} className={INPUT} aria-label={`${k} preference`} value={form.preferences[k] || ""} onChange={(e) => setPref(k, e.target.value)}>
                      <option value="">{k === "first" ? "1st preference" : "2nd preference"}</option>
                      {tech.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  ))}
                  <label className="flex min-h-10 items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.preferences.third === "NON_TECH"} onChange={(e) => setPref("third", e.target.checked ? "NON_TECH" : null)} />
                    Non-Tech as optional 3rd
                  </label>
                </>
              )}
            </div>
          ) : (
            <p className="mt-1 text-sm text-white">
              {TYPE_LABEL[form.registrationType]}
              {form.registrationType === "TECHNICAL" &&
                ` · 1. ${domainName(settings, form.preferences.first)} · 2. ${domainName(settings, form.preferences.second)}${
                  form.preferences.third ? ` · 3. ${domainName(settings, form.preferences.third)}` : ""
                }`}
            </p>
          )}
          {["registrationType", "first", "second", "third", "preferences"].map((k) =>
            errors[k] ? (
              <p key={k} className="mt-1 text-xs text-rose-300">
                {errors[k]}
              </p>
            ) : null,
          )}
        </div>

        {!editing && (
          <details className="rounded-xl border border-rose-500/20 p-4">
            <summary className="cursor-pointer text-sm text-rose-300">Delete this registration</summary>
            <p className="mt-2 text-sm text-slate-400">
              Deleting is permanent and logged. To keep the record but remove it from counts, set the status to Withdrawn instead. Type <span className="font-mono text-white">{registration.registrationId}</span> to confirm.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input className={`${INPUT} max-w-[14rem] font-mono`} aria-label="Registration ID to confirm deletion" value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value.trim().toUpperCase())} />
              <button type="button" className={BTN_DANGER} disabled={busy || confirmDelete !== registration.registrationId} onClick={remove}>
                Delete permanently
              </button>
            </div>
          </details>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 p-5">
        {editing ? (
          <>
            <button
              type="button"
              className={BTN}
              disabled={busy}
              onClick={() => {
                setEditing(false);
                setErrors({});
                setForm({ ...registration, githubProfile: registration.githubProfile || "", preferences: { ...registration.preferences } });
              }}
            >
              Cancel
            </button>
            <button type="button" className={BTN_PRIMARY} disabled={busy} onClick={save}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </>
        ) : (
          <button type="button" className={BTN_PRIMARY} onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
      </div>
    </dialog>
  );
}

export default function Registrations({ active, settings, onExpired, onChanged }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState(null);
  const [selected, setSelected] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setFilters((f) => (f.q === q ? f : { ...f, q }));
      setPage(1);
    }, 300);
    return () => window.clearTimeout(id);
  }, [q]);

  const query = useMemo(() => {
    const p = toParams(filters);
    p.set("sort", sort.key);
    p.set("dir", sort.dir);
    return p;
  }, [filters, sort]);

  const load = useCallback(() => {
    const p = new URLSearchParams(query);
    p.set("page", String(page));
    p.set("pageSize", String(pageSize));
    return api(`/registrations?${p}`, onExpired).then((res) => {
      if (res.ok) {
        setData(res.data);
        setNotice(null);
      } else if (res.status !== 401) setNotice({ tone: "error", text: res.data.message || "Couldn't load registrations." });
    });
  }, [query, page, pageSize, onExpired]);

  useEffect(() => {
    if (active) load();
  }, [active, load]);

  const setFilter = (k, v) => {
    setFilters((f) => ({ ...f, [k]: v, ...(k === "domain" ? { choice: "either" } : {}) }));
    if (k === "q") setQ(v);
    setPage(1);
  };

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setQ("");
    setPage(1);
  };

  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "createdAt" ? "desc" : "asc" }));
    setPage(1);
  };

  const exportFiltered = async () => {
    setExporting(true);
    const p = new URLSearchParams(query);
    p.set("report", "filtered");
    const res = await download(`/api/admin69/recruitment/export?${p}`, onExpired);
    setExporting(false);
    setNotice(res.ok ? { tone: "ok", text: `Downloaded ${res.name} (${res.count} records).` } : { tone: "error", text: res.message });
  };

  const domainOptions = settings.domains.map((d) => [d.id, d.name]);
  const semesterOptions = Object.values(SEMESTERS)
    .flat()
    .map((s) => [String(s), `Semester ${s}`]);
  const technicalDomain = filters.domain && filters.domain !== "NON_TECH";

  const chips = [
    filters.q && { key: "q", label: `Search: “${filters.q}”` },
    filters.domain && {
      key: "domain",
      label: technicalDomain ? `${domainName(settings, filters.domain)} · ${CHOICE_LABEL[filters.choice]}` : `${domainName(settings, filters.domain)} (any route)`,
    },
    filters.type && { key: "type", label: TYPE_LABEL[filters.type] },
    filters.semester && { key: "semester", label: `Semester ${filters.semester}` },
    filters.section && { key: "section", label: `Section ${filters.section}` },
    filters.status !== DEFAULT_FILTERS.status && { key: "status", label: filters.status ? STATUS_LABEL[filters.status] : "Any status" },
    filters.from && { key: "from", label: `From ${filters.from}` },
    filters.to && { key: "to", label: `To ${filters.to}` },
  ].filter(Boolean);
  const activeFilters = chips.length;

  return (
    <div className="grid gap-4">
      <section className={`${PANEL} p-4 sm:p-5`} aria-label="Filters">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <div>
            <label htmlFor="reg-q" className={LABEL}>
              Search
            </label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input id="reg-q" type="search" className={`${INPUT} pl-9`} placeholder="Name, USN, reference ID or phone" value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} />
            </div>
          </div>
          <Select id="f-status" label="Status" any="Any status" value={filters.status} onChange={(v) => setFilter("status", v)} options={Object.entries(STATUS_LABEL)} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_6rem]">
          <div className="col-span-2 md:col-span-1">
            <Select id="f-domain" label="Domain" any="All domains" value={filters.domain} onChange={(v) => setFilter("domain", v)} options={domainOptions} />
          </div>
          {technicalDomain ? (
            <Select
              id="f-choice"
              label="Choice"
              any="1st or 2nd"
              value={filters.choice === "either" ? "" : filters.choice}
              onChange={(v) => setFilter("choice", v || "either")}
              options={[
                ["first", "1st choice only"],
                ["second", "2nd choice only"],
              ]}
            />
          ) : (
            <Select id="f-type" label="Applied for" any="Everything" value={filters.type} onChange={(v) => setFilter("type", v)} options={Object.entries(TYPE_LABEL)} />
          )}
          <Select id="f-sem" label="Semester" any="All" value={filters.semester} onChange={(v) => setFilter("semester", v)} options={semesterOptions} />
          <div>
            <label htmlFor="f-sec" className={LABEL}>
              Section
            </label>
            <input
              id="f-sec"
              className={`${INPUT} text-center uppercase`}
              placeholder="All"
              maxLength={1}
              value={filters.section}
              onChange={(e) => setFilter("section", e.target.value.replace(/[^a-z]/gi, "").slice(-1).toUpperCase())}
            />
          </div>
        </div>

        <details className="mt-3 group" open={Boolean(filters.from || filters.to) || undefined}>
          <summary className="inline-flex min-h-10 cursor-pointer select-none items-center text-sm text-slate-300 hover:text-white">More filters</summary>
          <div className="mt-2 grid max-w-md grid-cols-2 gap-3">
            <div>
              <label htmlFor="f-from" className={LABEL}>
                Registered from
              </label>
              <input id="f-from" type="date" className={INPUT} value={filters.from} max={filters.to || undefined} onChange={(e) => setFilter("from", e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-to" className={LABEL}>
                Registered to
              </label>
              <input id="f-to" type="date" className={INPUT} value={filters.to} min={filters.from || undefined} onChange={(e) => setFilter("to", e.target.value)} />
            </div>
          </div>
        </details>

        {chips.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => setFilter(c.key, c.key === "status" ? DEFAULT_FILTERS.status : "")}
                  className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 text-xs font-medium text-sky-200 hover:bg-sky-500/20 focus-visible:outline-2 focus-visible:outline-sky-400"
                  aria-label={`Remove filter: ${c.label}`}
                >
                  {c.label}
                  <X size={12} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-sm text-slate-400" aria-live="polite">
            {data ? `${data.total} registration${data.total === 1 ? "" : "s"}` : "Loading…"}
            {filters.status === "REGISTERED" ? " (withdrawn hidden)" : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={BTN} disabled={!activeFilters} onClick={clearAll}>
              Clear all
            </button>
            <button type="button" className={BTN_PRIMARY} onClick={exportFiltered} disabled={exporting || !data?.total}>
              <Download size={16} aria-hidden="true" />
              {exporting ? "Preparing…" : "Export these (.docx)"}
            </button>
          </div>
        </div>
      </section>

      <Notice notice={notice} />

      <section className={PANEL} aria-label="Registrations">
        {data && !data.registrations.length ? (
          <Empty>{activeFilters ? "No registrations match these filters." : "No registrations yet."}</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.08em] text-slate-400">
                <tr>
                  {COLUMNS.map((c) => (
                    <th
                      key={c.key}
                      scope="col"
                      className="px-3 py-3 font-medium"
                      aria-sort={sort.key === c.sort ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                    >
                      {c.sort ? (
                        <button type="button" onClick={() => toggleSort(c.sort)} className="inline-flex min-h-8 items-center gap-1 uppercase hover:text-white">
                          {c.label}
                          {sort.key === c.sort && (sort.dir === "asc" ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />)}
                        </button>
                      ) : (
                        c.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.registrations.map((r) => (
                  <tr key={r.registrationId} className={`hover:bg-white/[0.03] ${r.status === "WITHDRAWN" ? "text-slate-500" : "text-slate-200"}`}>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => setSelected(r)}
                        className="min-h-8 font-mono text-sky-400 hover:underline focus-visible:outline-2 focus-visible:outline-sky-400"
                        aria-label={`Open ${r.registrationId}, ${r.fullName}`}
                      >
                        {r.registrationId}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-white">{r.fullName}</td>
                    <td className="px-3 py-2.5 font-mono">{r.usn}</td>
                    <td className="px-3 py-2.5">{YEAR_LABEL[r.academicYear]?.replace(" Year", "")}</td>
                    <td className="px-3 py-2.5 tabular-nums">{r.semester}</td>
                    <td className="px-3 py-2.5">{r.section}</td>
                    <td className="px-3 py-2.5 font-mono">{r.phoneNumber}</td>
                    <td className="px-3 py-2.5">{TYPE_LABEL[r.registrationType]}</td>
                    <td className="px-3 py-2.5">{r.preferences.first ? domainName(settings, r.preferences.first) : "—"}</td>
                    <td className="px-3 py-2.5">{r.preferences.second ? domainName(settings, r.preferences.second) : "—"}</td>
                    <td className="px-3 py-2.5">{r.preferences.third ? "Non-Tech" : "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">{formatIST(r.createdAt)}</td>
                    <td className="px-3 py-2.5">{STATUS_LABEL[r.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data && data.total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-sm text-slate-400">
            <label className="flex items-center gap-2">
              Rows
              <select className={`${INPUT} w-auto`} value={pageSize} onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2">
              <button type="button" className={BTN} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span aria-live="polite">
                Page {data.page} of {data.pages}
              </span>
              <button type="button" className={BTN} disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {selected && (
        <Detail
          key={selected.registrationId}
          registration={selected}
          settings={settings}
          onExpired={onExpired}
          onClose={() => setSelected(null)}
          onSaved={(r) => {
            setSelected(r);
            load();
            onChanged();
          }}
          onDeleted={() => {
            setSelected(null);
            setNotice({ tone: "ok", text: "Registration deleted." });
            load();
            onChanged();
          }}
        />
      )}
    </div>
  );
}
