import { useEffect, useMemo, useState } from "react";
import { Brain, Cloud, Shield, BarChart3, Megaphone, User, Search, X, Crown } from "lucide-react";
import { cloudinaryUrl } from "../lib/cloudinaryUrl";
import { memberGroups } from "../data/members";

/*
  CONCEPT: "The AdroIT network"
  Pure-black, terminal-flavoured directory. Domains are clusters, members are
  nodes with ids like ml-01 (the lead is always 01). Pick a node and a
  terminal-style inspector shows its details: a side panel on desktop, a
  bottom sheet on mobile. Search and the cluster key dim non-matching nodes.
*/

const DOMAINS = {
  ml: { icon: Brain, c: "#22d3ee" },
  cc: { icon: Cloud, c: "#c084fc" },
  cy: { icon: Shield, c: "#f472b6" },
  da: { icon: BarChart3, c: "#34d399" },
  nt: { icon: Megaphone, c: "#fbbf24" },
};
const FALLBACK = { icon: User, c: "#94a3b8" };
const dom = (id) => DOMAINS[id] || FALLBACK;
const vars = (id) => ({ "--c": dom(id).c });

const MONO = "font-['JetBrains_Mono','Geist_Mono',ui-monospace,SFMono-Regular,Menlo,monospace]";
const SANS = "font-['Geist','Inter',ui-sans-serif,system-ui,sans-serif]";
const pad = (n) => String(n).padStart(2, "0");
const initialsOf = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

// Build once: lead first in each cluster, ids like ml-01
const GROUPS = memberGroups.map((g, gi) => ({
  ...g,
  index: gi + 1,
  items: [...g.members]
    .sort((a, b) => (b.role === "Domain Lead") - (a.role === "Domain Lead"))
    .map((m, i) => ({
      ...m,
      key: `${g.id}-${pad(i + 1)}`,
      nodeId: `${g.id}-${pad(i + 1)}`,
      gid: g.id,
      gname: g.name,
      gindex: gi + 1,
      isLead: m.role === "Domain Lead",
    })),
}));
const ALL = GROUPS.flatMap((g) => g.items);
const LEADS = ALL.filter((e) => e.isLead).length;

const CSS = `
@keyframes am-in { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }
@keyframes am-up { from { transform: translateY(100%); } to { transform:none; } }
@keyframes am-blink { 50% { opacity:0; } }
@keyframes am-pulse { 0%,100% { opacity:.35; } 50% { opacity:1; } }
.am-in { animation: am-in .5s cubic-bezier(.2,.8,.2,1) backwards; }
.am-up { animation: am-up .3s cubic-bezier(.2,.8,.2,1); }
.am-blink { animation: am-blink 1.05s steps(1) infinite; }
.am-pulse { animation: am-pulse 2.6s ease-in-out infinite; }
.am-node:hover { border-color: color-mix(in srgb, var(--c) 55%, transparent); }
@media (prefers-reduced-motion: reduce) { .am-in, .am-up, .am-blink, .am-pulse { animation: none; } }
`;

export default function Members() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");
  const [selKey, setSelKey] = useState(null);

  const q = query.trim().toLowerCase();
  const matches = (el) => (active === "all" || el.gid === active) && (!q || el.name.toLowerCase().includes(q));
  const matchCount = useMemo(() => ALL.filter(matches).length, [q, active]); // eslint-disable-line
  const selected = ALL.find((el) => el.key === selKey) || null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelKey(null);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("am-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pickDomain = (id) => {
    setActive(id);
    if (id !== "all") document.getElementById(`g-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`${SANS} relative min-h-dvh overflow-x-clip bg-[#ffffff] text-slate-900 antialiased dark:bg-[#000000] dark:text-slate-100`}>
      <style>{CSS}</style>

      {/* faint dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] text-slate-900/[0.08] dark:text-white/[0.08] bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      {/* ============ HEADER ============ */}
      <header className="relative mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="min-w-0">
          <p className={`${MONO} am-in text-xs text-slate-500 sm:text-sm`}>
            <span className="text-sky-700">$</span> adroit members --all
            <span aria-hidden="true" className="am-blink ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 bg-sky-700" />
          </p>
          <h1 style={{ animationDelay: "90ms" }} className="am-in mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-slate-900 dark:text-slate-100 sm:text-7xl lg:text-8xl">
            The AdroIT
            <br />
            <span className="text-sky-800">network.</span>
          </h1>
          <p style={{ animationDelay: "180ms" }} className="am-in mt-4 max-w-md text-base text-slate-600 sm:text-lg">
            Pick a node to see who’s behind it.
          </p>
          <p style={{ animationDelay: "260ms" }} className={`${MONO} am-in mt-6 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500`}>
            <span><b className="font-semibold text-slate-900 dark:text-slate-100">{ALL.length}</b> nodes</span>
            <span><b className="font-semibold text-slate-900 dark:text-slate-100">{GROUPS.length}</b> clusters</span>
            <span><b className="font-semibold text-slate-900 dark:text-slate-100">{LEADS}</b> leads</span>
          </p>
        </div>
        <Topology />
      </header>

      {/* ============ CONTROLS ============ */}
      <div className="sticky top-[var(--nav-height)] z-30 border-y border-slate-200 bg-[#ffffff]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#000000]/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div role="group" aria-label="Highlight a cluster" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 lg:mx-0 lg:flex-wrap lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <KeyChip on={active === "all"} onClick={() => pickDomain("all")} label="All" count={ALL.length} />
            {GROUPS.map((g) => (
              <KeyChip key={g.id} on={active === g.id} onClick={() => pickDomain(g.id)} label={g.name} count={g.items.length} id={g.id} Icon={dom(g.id).icon} />
            ))}
          </div>
          <label className="relative block lg:w-72">
            <span className="sr-only">Search members</span>
            <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="am-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const first = ALL.find(matches);
                  if (first) setSelKey(first.key);
                }
              }}
              placeholder="grep name…"
              className={`${MONO} w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:border-sky-600/40 focus-visible:ring-2 focus-visible:ring-sky-600/30 dark:border-white/10 dark:bg-[#111111] dark:text-slate-100 dark:placeholder:text-slate-500 [&::-webkit-search-cancel-button]:hidden`}
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={14} />
              </button>
            )}
          </label>
        </div>
        <p aria-live="polite" className={`${MONO} mx-auto h-5 max-w-7xl px-4 pb-1 text-[11px] text-slate-500 sm:px-6 lg:px-8`}>
          {q || active !== "all" ? `${matchCount} of ${ALL.length} nodes matched` : ""}
        </p>
      </div>

      {/* ============ CLUSTERS + INSPECTOR ============ */}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_20rem] lg:gap-12 lg:px-8">
        <main className={`min-w-0 space-y-14 ${selected ? "pb-60 lg:pb-0" : ""}`}>
          {matchCount === 0 && (
            <p className={`${MONO} rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-white/15`}>
              <span className="text-sky-800">error:</span> no node matches “{query}”
            </p>
          )}
          {GROUPS.map((g) => {
            const { icon: Icon } = dom(g.id);
            return (
              <section key={g.id} id={`g-${g.id}`} style={vars(g.id)} aria-labelledby={`h-${g.id}`} className="scroll-mt-40">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ color: "var(--c)", backgroundColor: "color-mix(in srgb, var(--c) 18%, transparent)" }}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className={`${MONO} text-[11px] text-slate-500`}>// cluster {pad(g.index)}</p>
                    <h2 id={`h-${g.id}`} className="text-xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">{g.name}</h2>
                  </div>
                  <div aria-hidden="true" className="ml-2 hidden h-px flex-1 sm:block" style={{ backgroundColor: "color-mix(in srgb, var(--c) 40%, transparent)" }} />
                  <span className={`${MONO} ml-auto text-xs text-slate-500 sm:ml-0`}>{g.items.length} nodes</span>
                </div>
                <ul className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {g.items.map((el, i) => (
                    <li key={el.key}>
                      <NodeCard el={el} dim={!matches(el)} selected={selKey === el.key} delay={Math.min(i * 25, 400)} onSelect={() => setSelKey(selKey === el.key ? null : el.key)} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </main>

        <aside className="hidden lg:block" aria-label="Node inspector">
          <div className="sticky top-32">{selected ? <Inspector el={selected} onClose={() => setSelKey(null)} /> : <Idle />}</div>
        </aside>
      </div>

      {selected && (
        <div role="dialog" aria-label="Node inspector" className="am-up fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-slate-200 bg-white p-3 pb-5 shadow-[0_-24px_60px_-20px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#111111] lg:hidden">
          <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 dark:bg-white/20" />
          <Inspector el={selected} onClose={() => setSelKey(null)} compact />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

/* Decorative cluster map: five domain nodes orbiting a hub */
function Topology() {
  const pts = [[60, 18], [112, 56], [92, 112], [28, 112], [8, 56]];
  const ids = Object.keys(DOMAINS);
  return (
    <svg aria-hidden="true" viewBox="0 0 120 130" className="am-pulse hidden h-44 w-44 shrink-0 sm:block lg:h-56 lg:w-56">
      {pts.map(([x, y], i) => (
        <line key={i} x1="60" y1="66" x2={x} y2={y} stroke={DOMAINS[ids[i]].c} strokeOpacity="0.35" strokeWidth="0.8" />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={DOMAINS[ids[i]].c} />
      ))}
      <circle cx="60" cy="66" r="9" fill="#0284c7" />
    </svg>
  );
}

function KeyChip({ on, onClick, label, count, id, Icon }) {
  const colored = Boolean(id);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        ...(colored ? vars(id) : {}),
        ...(on && colored
          ? { backgroundColor: "var(--c)", borderColor: "var(--c)", color: "#0f172a" }
          : {}),
      }}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/40 ${
        on && !colored
          ? "border-sky-600 bg-sky-600 text-white"
          : on
            ? ""
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-white"
      }`}
    >
      {Icon && <Icon size={14} aria-hidden="true" style={on ? undefined : { color: "var(--c)" }} />}
      {label}
      <span className={`${MONO} text-[11px] opacity-60`}>{count}</span>
    </button>
  );
}

function Avatar({ el, size = 40, text = "text-sm", radius = "rounded-lg" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [el.key]);
  const src = el.imagePublicId ? cloudinaryUrl(el.imagePublicId, { width: size * 3, height: size * 3 }) : null;
  const box = { width: size, height: size };
  if (src && !failed) {
    return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} style={box} className={`shrink-0 object-cover ${radius}`} />;
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...box, color: "var(--c)", backgroundColor: "color-mix(in srgb, var(--c) 16%, transparent)" }}
      className={`flex shrink-0 items-center justify-center overflow-hidden font-semibold ${radius} ${text}`}
    >
      {initialsOf(el.name)}
    </span>
  );
}

function NodeCard({ el, dim, selected, delay, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${el.name}, ${el.gname}${el.isLead ? ", domain lead" : ""}`}
      style={{
        ...vars(el.gid),
        animationDelay: `${delay}ms`,
        ...(el.isLead
          ? {
              borderColor: "color-mix(in srgb, var(--c) 45%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--c) 10%, transparent)",
            }
          : {}),
        ...(selected ? { borderColor: "var(--c)", boxShadow: "0 0 0 1px var(--c)" } : {}),
      }}
      className={[
        "am-node am-in group relative flex w-full items-center gap-2.5 overflow-hidden rounded-xl border p-2.5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/40",
        el.isLead ? "" : "border-slate-200 bg-white dark:border-white/10 dark:bg-[#111111]",
        dim ? "scale-[0.97] opacity-[0.28]" : "hover:-translate-y-0.5",
      ].join(" ")}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5" style={{ background: "var(--c)" }} />
      <Avatar el={el} size={38} />
      <span className="min-w-0">
        <span className="line-clamp-2 block text-[13px] font-medium leading-tight sm:text-sm">{el.name}</span>
        <span className={`${MONO} mt-1 flex items-center gap-1.5 text-[10px] text-slate-500`}>
          {el.nodeId}
          {el.isLead && (
            <span className="inline-flex items-center gap-0.5 rounded px-1 font-semibold text-slate-950" style={{ background: "var(--c)" }}>
              <Crown size={9} aria-hidden="true" />
              LEAD
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

function Inspector({ el, onClose, compact }) {
  const rows = [
    ["name", el.name],
    ["role", el.isLead ? "Domain Lead" : el.role || "Member"],
    ["cluster", el.gname],
    ["id", el.nodeId],
    ...(el.year ? [["year", `${el.year}`]] : []),
  ];
  return (
    <div style={vars(el.gid)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111111]">
      <div aria-hidden="true" className="h-1" style={{ background: "var(--c)" }} />
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-white/10">
        <span aria-hidden="true" className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
        </span>
        <span className={`${MONO} ml-2 truncate text-[11px] text-slate-500`}>inspect {el.nodeId}</span>
        <button type="button" onClick={onClose} aria-label="Close inspector" className="ml-auto rounded p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <X size={15} />
        </button>
      </div>

      <div className={`flex gap-4 p-4 ${compact ? "items-start" : "flex-col"}`}>
        <div className={compact ? "" : "flex justify-center py-2"}>
          <Avatar el={el} size={compact ? 72 : 144} text={compact ? "text-2xl" : "text-5xl"} radius={compact ? "rounded-xl" : "rounded-2xl"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`${MONO} text-xs`}>
            <span style={{ color: "var(--c)" }}>$</span> <span className="text-slate-500">inspect {el.nodeId}</span>
          </p>
          <dl className={`${MONO} mt-3 space-y-1.5 text-xs`}>
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[4.5rem_1fr] gap-2">
                <dt style={{ color: "var(--c)" }}>{k}</dt>
                <dd className="break-words text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

function Idle() {
  return (
    <div className={`${MONO} rounded-2xl border border-dashed border-slate-200 p-6 text-xs text-slate-500 dark:border-white/15`}>
      <p>
        <span className="text-sky-700">$</span> select a node
        <span aria-hidden="true" className="am-blink ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-sky-700" />
      </p>
      <p className="mt-3 text-slate-400">Click any card, or press Enter in the search box to open the first match.</p>
    </div>
  );
}
