import { useCallback, useEffect, useState } from "react";
import { BTN, PANEL, api, formatIST } from "./shared";
import { Empty, Notice } from "./ui";

const ACTION = {
  "registration.open": "Opened registration",
  "registration.close": "Closed registration",
  "settings.update": "Updated settings",
  "registration.update": "Edited registration",
  "registration.delete": "Deleted registration",
  export: "Exported report",
};

const show = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "object") return JSON.stringify(v);
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)) return `${formatIST(v)} IST`;
  return String(v);
};

export default function AuditLog({ active, onExpired, refreshKey }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = useCallback(
    () =>
      api(`/audit-logs?page=${page}`, onExpired).then((res) => {
        if (res.ok) {
          setData(res.data);
          setNotice(null);
        } else if (res.status !== 401) setNotice({ tone: "error", text: res.data.message || "Couldn't load the audit log." });
      }),
    [page, onExpired],
  );

  useEffect(() => {
    if (active) load();
  }, [active, load, refreshKey]);

  return (
    <div className="grid gap-4">
      <p className="text-sm text-slate-400">
        Every settings change, registration edit or deletion and export. Admins share one login, so entries show the sign-in session that made them. Phone numbers are masked.
      </p>
      <Notice notice={notice} />
      <section className={PANEL}>
        {data && !data.entries.length ? (
          <Empty>Nothing logged yet.</Empty>
        ) : (
          <ul className="divide-y divide-white/10">
            {data?.entries.map((e) => (
              <li key={e.id} className="px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-white">
                    {ACTION[e.action] || e.action}
                    {e.target && e.target !== "settings" && <span className="ml-2 font-mono text-sm text-sky-400">{e.target}</span>}
                    {e.count != null && <span className="ml-2 text-sm text-slate-400">({e.count} records)</span>}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatIST(e.at)} IST · session {e.session || "—"}
                  </p>
                </div>
                {e.changes && Object.keys(e.changes).length > 0 && (
                  <dl className="mt-2 grid gap-1 text-sm">
                    {Object.entries(e.changes).map(([field, c]) => (
                      <div key={field} className="flex flex-wrap gap-x-2">
                        <dt className="text-slate-400">{field}:</dt>
                        <dd className="min-w-0 break-all text-slate-300">
                          <span className="text-slate-500 line-through">{show(c.from)}</span> → {show(c.to)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ul>
        )}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-3 text-sm text-slate-400">
            <button type="button" className={BTN} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Newer
            </button>
            <span>
              Page {data.page} of {data.pages}
            </span>
            <button type="button" className={BTN} disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
              Older
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
