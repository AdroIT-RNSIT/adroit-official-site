import { useCallback, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { BTN, PANEL, api } from "./shared";
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

export default function Recruitment({ active, onExpired }) {
  const [view, setView] = useState("overview");
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState(null);
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

  return (
    <section className={`${PANEL} p-4 sm:p-6`} aria-labelledby="recruitment-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <UserPlus size={22} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
          <div>
            <h2 id="recruitment-title" className="font-semibold text-white">
              {data?.settings.recruitmentName || "Recruitment"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {data
                ? data.status.open
                  ? "Registration is open."
                  : `Registration is ${data.status.reason === "NOT_STARTED" ? "scheduled" : "closed"}.`
                : "Loading…"}
            </p>
          </div>
        </div>
        {!data && notice && (
          <button type="button" className={BTN} onClick={loadSettings}>
            Retry
          </button>
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
