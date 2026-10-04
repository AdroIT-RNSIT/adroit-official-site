import { useEffect, useMemo, useState } from "react";
import { Brain, Cloud, Shield, BarChart3, Megaphone, User, Search, X, Crown } from "lucide-react";
import { cloudinaryUrl } from "../lib/cloudinaryUrl";
import { memberGroups } from "../data/members";

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

const pad = (n) => String(n).padStart(2, "0");
const initialsOf = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const linkedinHref = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.href;
  } catch {
    return null;
  }
};

function LinkedInMark({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const GROUPS = memberGroups.map((g) => ({
  ...g,
  items: [...g.members]
    .sort((a, b) => (b.role === "Domain Lead") - (a.role === "Domain Lead"))
    .map((m, i) => ({
      ...m,
      key: `${g.id}-${pad(i + 1)}`,
      gid: g.id,
      gname: g.name,
      isLead: m.role === "Domain Lead",
    })),
}));
const ALL = GROUPS.flatMap((g) => g.items);
const MOBILE_DOMAIN_LABELS = {
  ml: "ML",
  cc: "Cloud",
  cy: "Cyber",
  da: "Data",
  nt: "Non-Tech",
};

const CSS = `
@keyframes am-in { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }
@keyframes am-up { from { transform: translateY(100%); } to { transform:none; } }
@keyframes am-blink { 50% { opacity:0; } }
@keyframes am-pulse { 0%,100% { opacity:.35; } 50% { opacity:1; } }
.am-in { animation: am-in .5s cubic-bezier(.2,.8,.2,1) backwards; }
.am-up { animation: am-up .3s cubic-bezier(.2,.8,.2,1); }
.am-blink { animation: am-blink 1.05s steps(1) infinite; }
.am-pulse { animation: am-pulse 2.6s ease-in-out infinite; }
.am-glass {
  background:
    linear-gradient(160deg, rgba(255,255,255,0.68), rgba(255,255,255,0.32) 55%, rgba(255,255,255,0.22)),
    linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0));
  -webkit-backdrop-filter: blur(24px) saturate(1.9);
  backdrop-filter: blur(24px) saturate(1.9);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    inset 0 -1px 0 rgba(255,255,255,0.35),
    0 14px 34px rgba(15,23,42,0.10),
    0 1px 0 rgba(255,255,255,0.6);
}
html.dark .am-glass {
  background:
    linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06) 55%, rgba(255,255,255,0.04)),
    linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.25),
    inset 0 -1px 0 rgba(255,255,255,0.06),
    0 14px 34px rgba(0,0,0,0.45),
    0 1px 0 rgba(255,255,255,0.08);
}
.am-node--open {
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.95),
    0 16px 36px rgba(15,23,42,0.16);
}
html.dark .am-node--open {
  background: linear-gradient(180deg, rgba(0,0,0,0.96), rgba(0,0,0,0.9));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.14),
    0 18px 38px rgba(0,0,0,0.5);
}
.am-inspector {
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94));
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  backdrop-filter: blur(20px) saturate(1.4);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.95),
    0 18px 40px rgba(15,23,42,0.14);
}
html.dark .am-inspector {
  background: linear-gradient(180deg, rgba(0,0,0,0.96), rgba(0,0,0,0.9));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 20px 42px rgba(0,0,0,0.5);
}
@media (prefers-reduced-motion: reduce) { .am-in, .am-up, .am-blink, .am-pulse { animation: none; } }
@media (prefers-reduced-transparency: reduce) {
  .am-glass { background: #ffffff; backdrop-filter: none; -webkit-backdrop-filter: none; }
  html.dark .am-glass { background: #111111; }
}
`;

export default function Members() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");
  const [selKey, setSelKey] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const q = query.trim().toLowerCase();
  const matches = (el) => (active === "all" || el.gid === active) && (!q || el.name.toLowerCase().includes(q));
  const matchCount = useMemo(() => ALL.filter(matches).length, [q, active]); // eslint-disable-line
  const selected = ALL.find((el) => el.key === selKey) || null;
  const visibleGroups = useMemo(() => {
    if (!isMobile) return GROUPS;
    if (active === "all") return GROUPS.slice(0, 1);
    return GROUPS.filter((g) => g.id === active);
  }, [isMobile, active]);

  useEffect(() => {
    if (selected && !matches(selected)) setSelKey(null);
  }, [q, active]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (isMobile && active === "all") setActive(GROUPS[0]?.id ?? "all");
  }, [isMobile, active]);

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
    <div className="relative min-h-dvh overflow-x-clip bg-[#ffffff] pt-6 font-sans text-slate-900 antialiased dark:bg-[#000000] dark:text-slate-100 lg:pt-8">
      <style>{CSS}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] text-slate-900/[0.08] dark:text-white/[0.08] bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 style={{ animationDelay: "90ms" }} className="fluid-h1 am-in mt-3 font-extrabold leading-[1.05]">
            AdroIT Members
          </h1>
          <p style={{ animationDelay: "180ms" }} className="am-in mt-3 max-w-md text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Explore members by domain.
          </p>
        </div>
      </header>

      <div className="sticky top-[var(--nav-height)] z-30 border-y border-slate-200 bg-[#ffffff]/95 backdrop-blur dark:border-white/10 dark:bg-[#000000]/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div role="group" aria-label="Filter by domain" className="-mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 pb-0.5 lg:mx-0 lg:flex-wrap lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {!isMobile && <KeyChip on={active === "all"} onClick={() => pickDomain("all")} label="All" />}
            {GROUPS.map((g) => (
              <KeyChip
                key={g.id}
                on={active === g.id}
                onClick={() => pickDomain(g.id)}
                label={g.name}
                shortLabel={MOBILE_DOMAIN_LABELS[g.id] || g.name}
                id={g.id}
                Icon={dom(g.id).icon}
              />
            ))}
          </div>
          <label className="relative block shrink-0 lg:w-72">
            <span className="sr-only">Search members</span>
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
              className="am-glass w-full appearance-none rounded-2xl border border-white/80 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:border-sky-600/40 focus-visible:ring-2 focus-visible:ring-sky-600/30 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={16} />
              </button>
            )}
          </label>
        </div>
        {(q || active !== "all") && (
          <p aria-live="polite" className="mx-auto max-w-7xl px-4 pb-2 font-mono text-xs text-slate-500 sm:px-6 lg:px-8">
            {matchCount} of {ALL.length} nodes matched
          </p>
        )}
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-stretch lg:gap-12 lg:px-8">
        <main className={`min-w-0 space-y-12 ${selected ? "pb-[min(70dvh,22rem)] lg:pb-0" : "pb-10"}`}>
          {matchCount === 0 && (
            <p className="am-glass rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-white/15">
              <span className="font-mono text-sky-800">error:</span> no node matches “{query}”
            </p>
          )}
          {visibleGroups.map((g) => {
            const { icon: Icon } = dom(g.id);
            return (
              <section key={g.id} id={`g-${g.id}`} style={vars(g.id)} aria-labelledby={`h-${g.id}`} className="scroll-mt-[calc(var(--nav-height)+9rem)]">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{ color: "var(--c)", backgroundColor: "color-mix(in srgb, var(--c) 16%, transparent)" }}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 id={`h-${g.id}`} className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{g.name}</h2>
                  </div>
                  <div aria-hidden="true" className="ml-1 hidden h-px min-w-8 flex-1 bg-slate-200 dark:bg-white/10 sm:block" />
                  <span className="font-mono text-xs text-slate-500 sm:ml-0">{g.items.length} nodes</span>
                </div>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {g.items.map((el, i) => (
                    <li key={el.key} className="min-w-0">
                      <NodeCard el={el} dim={!matches(el)} selected={selKey === el.key} delay={Math.min(i * 25, 400)} onSelect={() => setSelKey(selKey === el.key ? null : el.key)} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </main>

        <aside className="hidden lg:block" aria-label="Node inspector">
          <div className="sticky top-[calc(var(--nav-height)+8rem)] max-h-[calc(100dvh-var(--nav-height)-9rem)] overflow-y-auto">
            {selected ? <Inspector el={selected} onClose={() => setSelKey(null)} /> : <Idle />}
          </div>
        </aside>
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Node inspector"
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/35 p-4 backdrop-blur-md dark:bg-black/45 lg:hidden"
          onClick={() => setSelKey(null)}
        >
          <div className="am-up max-h-[min(88dvh,44rem)] w-full max-w-sm overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Inspector el={selected} onClose={() => setSelKey(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

function KeyChip({ on, onClick, label, shortLabel, id, Icon }) {
  const colored = Boolean(id);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={colored ? vars(id) : undefined}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-2xl border px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/40 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
        on
          ? "border-sky-600 bg-sky-600 text-white"
          : "am-glass border-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-white"
      }`}
    >
      {Icon && <Icon size={16} aria-hidden="true" style={{ color: "var(--c)" }} />}
      {shortLabel ? (
        <>
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden sm:inline">{label}</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}

function Avatar({ el, size = 44 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [el.key]);
  const src = el.imagePublicId ? cloudinaryUrl(el.imagePublicId, { width: size * 3, height: size * 3 }) : null;
  if (src && !failed) {
    return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} style={{ width: size, height: size }} className="shrink-0 rounded-xl object-cover" />;
  }
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200 ${size >= 64 ? "text-xl" : "text-sm"}`}
    >
      {initialsOf(el.name)}
    </span>
  );
}

function NodeCard({ el, dim, selected, delay, onSelect }) {
  const linkedin = linkedinHref(el.linkedin);
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={[
        "am-node am-in am-glass flex h-full w-full min-w-0 items-center rounded-2xl border transition-all duration-200",
        selected ? "am-node--open" : "",
        selected
          ? "border-slate-900/55 shadow-[0_14px_35px_rgba(15,23,42,0.16)] dark:border-white/65 dark:shadow-[0_16px_36px_rgba(0,0,0,0.5)]"
          : "border-white/80 hover:border-white/95 hover:shadow-[0_12px_30px_rgba(15,23,42,0.14)] dark:border-white/15 dark:hover:border-white/35 dark:hover:shadow-[0_14px_34px_rgba(0,0,0,0.46)]",
        dim ? "opacity-40" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${el.name}, ${el.gname}${el.isLead ? ", domain lead" : ""}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600/40"
      >
        <Avatar el={el} size={40} />
        <span className="min-w-0 flex-1">
          <span className="block break-words text-sm font-semibold leading-snug text-slate-900">{el.name}</span>
          {el.isLead && (
            <span className="mt-1 inline-flex items-center gap-0.5 rounded bg-slate-900 px-1 font-mono text-[11px] font-semibold text-white dark:bg-white dark:text-slate-950">
              <Crown size={9} aria-hidden="true" />
              LEAD
            </span>
          )}
        </span>
      </button>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${el.name} on LinkedIn`}
          className="social-linkedin mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/40"
        >
          <LinkedInMark />
        </a>
      )}
    </div>
  );
}

function MemberPhoto({ el, compact }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [el.key]);
  if (failed) return <Avatar el={el} size={compact ? 64 : 112} />;
  return (
    <img
      src={el.photo}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={`aspect-square shrink-0 rounded-xl object-cover ${compact ? "h-16 w-16" : "w-full max-w-[13rem]"}`}
    />
  );
}

function Inspector({ el, onClose, compact }) {
  const linkedin = linkedinHref(el.linkedin);
  const rows = [
    ["name", el.name],
    ["role", el.isLead ? "Domain Lead" : el.role || "Member"],
    ["domain", el.gname],
    ...(el.year ? [["year", `${el.year}`]] : []),
  ];
  return (
    <div className="am-inspector overflow-hidden rounded-2xl border border-dotted border-slate-300 text-slate-900 dark:border-white/30 dark:text-slate-100">
      <div className="flex items-center gap-2 border-b border-dotted border-slate-300 px-3 py-2">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
        </span>
        <span className="ml-2 min-w-0 truncate font-mono text-xs text-slate-500">{el.name}</span>
        <button type="button" onClick={onClose} aria-label="Close inspector" className="ml-auto shrink-0 rounded-lg p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className={`flex gap-4 p-4 ${compact ? "items-start" : "flex-col"}`}>
        <div className={compact ? "shrink-0" : "flex justify-center py-2"}>
          {el.photo ? <MemberPhoto el={el} compact={compact} /> : <Avatar el={el} size={compact ? 64 : 112} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs">
            <span className="text-sky-700">$</span> <span className="text-slate-500">{el.name}</span>
          </p>
          <dl className="mt-3 space-y-1.5 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                <dt className="font-mono text-xs text-slate-500">{k}</dt>
                <dd className="break-words text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${el.name} on LinkedIn`}
              className="social-linkedin mt-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/40"
            >
              <LinkedInMark className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Idle() {
  return (
    <div className="am-glass rounded-2xl border border-dotted border-slate-400 p-6 text-sm text-slate-500 dark:border-white/40">
      <span aria-hidden="true" className="mb-4 flex gap-1.5">
        <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
      </span>
      <p className="font-mono text-xs">
        <span className="text-sky-700">$</span> select a node
        <span aria-hidden="true" className="am-blink ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-sky-700" />
      </p>
      <p className="mt-3">Click any card, or press Enter in the search box to open the first match.</p>
    </div>
  );
}
