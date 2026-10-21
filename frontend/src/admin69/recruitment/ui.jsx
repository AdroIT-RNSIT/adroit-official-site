export function Notice({ notice }) {
  if (!notice) return null;
  return (
    <p
      role={notice.tone === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${
        notice.tone === "error" ? "border-rose-500/30 bg-rose-500/10 text-rose-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      {notice.text}
    </p>
  );
}

export function Empty({ children }) {
  return <p className="px-5 py-10 text-center text-sm text-slate-500">{children}</p>;
}

export function Stat({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/** Horizontal bars; each row is { label, value, color?, note? }. */
export function BarList({ rows, total, unit = "" }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <Empty>No data yet.</Empty>;
  return (
    <ul className="grid gap-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-slate-200">{r.label}</span>
            <span className="shrink-0 tabular-nums text-slate-300">
              {r.value}
              {unit}
              {total ? <span className="text-slate-500"> · {Math.round((r.value / total) * 100)}%</span> : null}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5" aria-hidden="true">
            <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, backgroundColor: r.color || "#38bdf8" }} />
          </div>
          {r.note && <p className="mt-1 text-xs text-slate-500">{r.note}</p>}
        </li>
      ))}
    </ul>
  );
}

/** Daily registrations as columns. The table below it is the accessible version. */
export function TrendChart({ points }) {
  const max = Math.max(1, ...points.map((p) => p.count));
  const w = 600;
  const h = 140;
  const gap = 4;
  const bw = (w - gap * (points.length - 1)) / points.length;
  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${h + 18}`} className="h-auto w-full" role="img" aria-label="Registrations per day for the last 30 days">
        {points.map((p, i) => {
          const bh = (p.count / max) * h;
          return (
            <g key={p.date}>
              <rect x={i * (bw + gap)} y={h - bh} width={bw} height={Math.max(bh, p.count ? 2 : 0)} rx="2" fill="#38bdf8">
                <title>{`${p.date}: ${p.count}`}</title>
              </rect>
              {(i === 0 || i === points.length - 1 || i % 7 === 0) && (
                <text x={i * (bw + gap) + bw / 2} y={h + 14} textAnchor="middle" fontSize="10" fill="#94a3b8">
                  {p.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="sr-only">Peak {max} registrations in a day.</figcaption>
    </figure>
  );
}
