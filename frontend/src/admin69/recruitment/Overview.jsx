import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { BTN, PANEL, YEAR_LABEL, api, formatIST } from "./shared";
import { BarList, Notice, Stat, TrendChart } from "./ui";

const ACCENT = { CLOUD: "#c084fc", ML_AI: "#22d3ee", CYBERSECURITY: "#f472b6", DATA_ANALYTICS: "#34d399", NON_TECH: "#fbbf24" };

function Card({ title, description, children, action }) {
  return (
    <section className={`${PANEL} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Overview({ active, onExpired, refreshKey }) {
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const fetchAnalytics = useCallback(
    () =>
      api("/analytics", onExpired).then((res) => {
        setBusy(false);
        if (res.ok) {
          setData(res.data);
          setNotice(null);
        } else if (res.status !== 401) setNotice({ tone: "error", text: res.data.message || "Couldn't load analytics." });
      }),
    [onExpired],
  );

  useEffect(() => {
    if (active) fetchAnalytics();
  }, [active, fetchAnalytics, refreshKey]);

  const load = () => {
    setBusy(true);
    fetchAnalytics();
  };

  if (!data) {
    return (
      <div className="grid gap-4">
        <Notice notice={notice} />
        {!notice && <p className="text-sm text-slate-400" aria-busy="true">Loading analytics…</p>}
      </div>
    );
  }

  const t = data.totals;
  const low = data.domains.filter((d) => d.low);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Active registrations only ({t.withdrawn} withdrawn not counted). Updated {formatIST(data.generatedAt, { timeStyle: "short" })} IST.
        </p>
        <button type="button" className={BTN} onClick={load} disabled={busy}>
          <RefreshCw size={16} className={busy ? "animate-spin motion-reduce:animate-none" : ""} aria-hidden="true" />
          Refresh
        </button>
      </div>
      <Notice notice={notice} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total registrations" value={t.total} />
        <Stat label="Technical" value={t.technical} hint="Technical route" />
        <Stat label="Non-Tech only" value={t.nonTechOnly} hint="Non-Tech only route" />
        <Stat label="Unique students" value={t.uniqueStudents} hint="Distinct USNs" />
        <Stat label="First year" value={t.firstYear} />
        <Stat label="Second year" value={t.secondYear} />
        <Stat label="Today" value={t.today} hint="Since midnight IST" />
        <Stat label="Last 7 days" value={t.last7Days} hint="Including today" />
      </div>

      {low.length > 0 && (
        <p className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200" role="status">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Low interest: {low.map((d) => d.name).join(", ")}. Consider promoting {low.length === 1 ? "this domain" : "these domains"}. Applicants' choices are never changed.
          </span>
        </p>
      )}

      <Card
        title="Domain demand"
        description="Total interest counts each technical student once per domain they chose as first or second preference. Percentages are of technical registrations; they add up to 200% because everyone picks two."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.1em] text-slate-400">
              <tr>
                <th scope="col" className="py-2 pr-3 font-medium">Domain</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">1st preference</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">2nd preference</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Total interest</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">% of technical</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Target</th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">Still needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.domains.map((d) => (
                <tr key={d.id} className={d.low ? "bg-amber-500/5" : undefined}>
                  <th scope="row" className="py-3 pr-3 font-medium text-white">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ACCENT[d.id] }} aria-hidden="true" />
                      {d.name}
                      {d.low && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-300">Low</span>}
                    </span>
                  </th>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-200">{d.first}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-200">{d.second}</td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums text-white">{d.total}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-300">{d.percent}%</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-300">{d.target || "—"}</td>
                  <td className="py-3 pl-3 text-right tabular-nums text-slate-300">{d.remaining == null ? "—" : d.remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">Set targets in Settings. A domain is flagged when it's under half its target (or, with no target, under half the average share).</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="First-preference counts" description="Technical students whose first choice is each domain.">
          <BarList rows={data.domains.map((d) => ({ label: d.name, value: d.first, color: ACCENT[d.id] }))} total={t.technical} />
        </Card>
        <Card title="Second-preference counts" description="Technical students whose second choice is each domain.">
          <BarList rows={data.domains.map((d) => ({ label: d.name, value: d.second, color: ACCENT[d.id] }))} total={t.technical} />
        </Card>
      </div>

      <Card title={`${data.nonTech.name} interest`} description="The two routes are counted separately, then combined by distinct USN.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Optional 3rd preference" value={data.nonTech.optionalThird} hint="Technical applicants who added Non-Tech" />
          <Stat label="Non-Tech only route" value={data.nonTech.onlyRoute} hint="Not counted as technical applicants" />
          <Stat
            label="Combined unique students"
            value={data.nonTech.combinedUnique}
            hint={data.nonTech.target ? `Target ${data.nonTech.target} · still needed ${data.nonTech.remaining}` : "No target set"}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="By year">
          <BarList rows={Object.entries(YEAR_LABEL).map(([id, label]) => ({ label, value: data.byYear[id] || 0 }))} total={t.total} />
        </Card>
        <Card title="By semester">
          <BarList
            rows={Object.entries(data.bySemester)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([s, n]) => ({ label: `Semester ${s}`, value: n }))}
            total={t.total}
          />
        </Card>
        <Card title="By section">
          <BarList
            rows={Object.entries(data.bySection)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([s, n]) => ({ label: `Section ${s}`, value: n }))}
            total={t.total}
          />
        </Card>
      </div>

      <Card title="Registrations over time" description="New registrations per day (IST), last 30 days.">
        <TrendChart points={data.trend} />
        <details className="mt-3 text-sm text-slate-400">
          <summary className="cursor-pointer select-none text-slate-300">Show as a table</summary>
          <table className="mt-3 w-full max-w-sm text-left">
            <thead>
              <tr className="text-xs uppercase tracking-[0.1em] text-slate-500">
                <th scope="col" className="py-1 font-medium">Date</th>
                <th scope="col" className="py-1 text-right font-medium">Registrations</th>
              </tr>
            </thead>
            <tbody>
              {data.trend.map((p) => (
                <tr key={p.date}>
                  <td className="py-0.5">{p.date}</td>
                  <td className="py-0.5 text-right tabular-nums">{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </Card>
    </div>
  );
}
