import { useCallback, useEffect, useState } from "react";
import { Download, ExternalLink, Power, SlidersHorizontal, UserPlus } from "lucide-react";
import { BTN, BTN_DANGER, BTN_PRIMARY, PANEL, api, download, formatIST } from "./shared";
import { Notice } from "./ui";
import Overview from "./Overview";
import Registrations from "./Registrations";
import Exports from "./Exports";
import Settings from "./Settings";
import AuditLog from "./AuditLog";

const VIEWS = [
  { id: "overview", label: "Overview" },
  { id: "registrations", label: "Registrations" },
  { id: "exports", label: "Exports" },
  { id: "settings", label: "Settings" },
  { id: "audit", label: "Audit log" },
];

const STATUS = {
  OPEN: { label: "Open", badge: "bg-emerald-500/15 text-emerald-300", dot: "bg-emerald-400" },
  NOT_STARTED: { label: "Scheduled", badge: "bg-amber-500/15 text-amber-300", dot: "bg-amber-400" },
  ENDED: { label: "Ended", badge: "bg-white/10 text-slate-300", dot: "bg-slate-400" },
  CLOSED: { label: "Closed", badge: "bg-white/10 text-slate-300", dot: "bg-slate-400" },
};

export default function Recruitment({ active, onExpired }) {
  const [view, setView] = useState("overview");
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadSettings = useCallback(
    () =>
      api("/settings", onExpired).then((res) => {
        if (res.ok) {
          setData(res.data);
          setNotice(null);
        } else if (res.status !== 401) setNotice({ tone: "error", text: res.data.message || "Couldn't load recruitment settings." });
      }),
    [onExpired],
  );

  useEffect(() => {
    if (active && !data) loadSettings();
  }, [active, data, loadSettings]);

  const bump = useCallback(() => setRefreshKey((k) => k + 1), []);

  const toggleRegistration = async () => {
    const opening = !data.settings.registrationOpen;
    const message = opening
      ? "Open registration? Students can register as soon as the opening time (if set) has passed."
      : "Close registration? New submissions are refused immediately. Existing registrations are kept.";
    if (!window.confirm(message)) return;
    setBusy("toggle");
    const res = await api("/settings", onExpired, { method: "PATCH", body: JSON.stringify({ registrationOpen: opening }) });
    setBusy("");
    if (res.ok) {
      setData(res.data);
      bump();
      setNotice({ tone: "ok", text: opening ? "Registration switched on." : "Registration closed. Existing registrations are kept." });
    } else if (res.status !== 401) setNotice({ tone: "error", text: res.data.message || "Couldn't change registration." });
  };

  const exportAll = async () => {
    setBusy("export");
    const res = await download("/api/admin69/recruitment/export?report=all", onExpired);
    setBusy("");
    setNotice(res.ok ? { tone: "ok", text: `Downloaded ${res.name} (${res.count} records).` } : { tone: "error", text: res.message });
  };

  const status = data ? STATUS[data.status.reason] : null;

  return (
    <section className={`${PANEL} p-4 sm:p-6`} aria-labelledby="recruitment-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <UserPlus size={22} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
          <div>
            <h2 id="recruitment-title" className="font-semibold text-white">
              {data?.settings.recruitmentName || "Recruitment"}
            </h2>
            {data ? (
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-400" aria-live="polite">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                  {status.label}
                </span>
                <span>
                  {data.status.reason === "NOT_STARTED"
                    ? `Opens ${formatIST(data.status.opensAt)} IST`
                    : data.status.closesAt
                      ? `${data.status.open ? "Closes" : "Deadline"} ${formatIST(data.status.closesAt)} IST`
                      : "No deadline set"}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-400">Loading…</p>
            )}
          </div>
        </div>
        {!data && notice && (
          <button type="button" className={BTN} onClick={loadSettings}>
            Retry
          </button>
        )}
        {data && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={toggleRegistration}
              className={data.settings.registrationOpen ? BTN_DANGER : BTN_PRIMARY}
            >
              <Power size={16} aria-hidden="true" />
              {busy === "toggle" ? "Saving…" : data.settings.registrationOpen ? "Close registration" : "Open registration"}
            </button>
            <button type="button" className={BTN} onClick={() => setView("settings")}>
              <SlidersHorizontal size={16} aria-hidden="true" />
              Edit form &amp; dates
            </button>
            <a href="/recruitment" target="_blank" rel="noopener" className={BTN}>
              <ExternalLink size={16} aria-hidden="true" />
              View form
            </a>
            <button type="button" className={BTN} disabled={Boolean(busy)} onClick={exportAll}>
              <Download size={16} aria-hidden="true" />
              {busy === "export" ? "Preparing…" : "Export all"}
            </button>
          </div>
        )}
      </div>

      <div role="tablist" aria-label="Recruitment sections" className="mt-5 flex gap-1 overflow-x-auto border-b border-white/10">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            id={`rtab-${v.id}`}
            aria-selected={view === v.id}
            aria-controls={`rpanel-${v.id}`}
            onClick={() => setView(v.id)}
            className={`-mb-px min-h-10 shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              view === v.id ? "border-sky-400 text-white" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <Notice notice={notice} />
        {data &&
          VIEWS.map((v) => (
            <div key={v.id} role="tabpanel" id={`rpanel-${v.id}`} aria-labelledby={`rtab-${v.id}`} hidden={view !== v.id}>
              {v.id === "overview" && <Overview active={active && view === "overview"} onExpired={onExpired} refreshKey={refreshKey} />}
              {v.id === "registrations" && (
                <Registrations active={active && view === "registrations"} settings={data.settings} onExpired={onExpired} onChanged={bump} />
              )}
              {v.id === "exports" && <Exports settings={data.settings} onExpired={onExpired} />}
              {v.id === "settings" && (
                <Settings
                  data={data}
                  onExpired={onExpired}
                  onSaved={(next) => {
                    setData(next);
                    bump();
                  }}
                />
              )}
              {v.id === "audit" && <AuditLog active={active && view === "audit"} onExpired={onExpired} refreshKey={refreshKey} />}
            </div>
          ))}
      </div>
    </section>
  );
}
