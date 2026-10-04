import { useEffect, useMemo, useRef, useState } from "react";
import { Brain, Cloud, Shield, BarChart3, Megaphone, User, Search, SearchX, X } from "lucide-react";
import { cloudinaryUrl } from "../lib/cloudinaryUrl";
import { memberGroups } from "../data/members";

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* Each domain sets --c (light mode) and --cd (dark mode). Everything  */
/* accent-coloured reads from those two variables.                     */
/* ------------------------------------------------------------------ */
const DOMAINS = {
  ml: { icon: Brain, c: "#0e7490", cd: "#22d3ee" },
  cc: { icon: Cloud, c: "#7e22ce", cd: "#c084fc" },
  cy: { icon: Shield, c: "#be185d", cd: "#f472b6" },
  da: { icon: BarChart3, c: "#047857", cd: "#34d399" },
  nt: { icon: Megaphone, c: "#b45309", cd: "#fbbf24" },
};
const FALLBACK = { icon: User, c: "#475569", cd: "#94a3b8" };
const dom = (id) => DOMAINS[id] || FALLBACK;
const vars = (id) => ({ "--c": dom(id).c, "--cd": dom(id).cd });

// Reusable class strings (kept static so Tailwind can see them)
const accentText = "text-[var(--c)] dark:text-[var(--cd)]";
const muted = "text-slate-500 dark:text-[#8B8B93]";
const surface = "border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B0B0D]";
const tint = "bg-[color-mix(in_srgb,var(--c)_10%,white)] dark:bg-[color-mix(in_srgb,var(--cd)_12%,#0B0B0D)]";
const accentBorder = "border-[color-mix(in_srgb,var(--c)_45%,transparent)] dark:border-[color-mix(in_srgb,var(--cd)_45%,transparent)]";
const accentGlow = "shadow-[0_0_28px_-6px_color-mix(in_srgb,var(--c)_45%,transparent)] dark:shadow-[0_0_28px_-6px_color-mix(in_srgb,var(--cd)_50%,transparent)]";
const FONT = "font-['Geist','Inter',ui-sans-serif,system-ui,sans-serif]";

const CSS = `
@keyframes am-rise { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform:none; } }
@keyframes am-shimmer { to { background-position: 200% center; } }
@keyframes am-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(2%,3%,0) scale(1.06); } }
.am-rise { animation: am-rise .8s cubic-bezier(.2,.7,.2,1) both; }
.am-shimmer { background-size: 200% auto; animation: am-shimmer 6s linear infinite; }
.am-drift { animation: am-drift 14s ease-in-out infinite; }
.am-noise { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.am-dots { background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 26px 26px; }
@media (prefers-reduced-motion: reduce) { .am-rise, .am-shimmer, .am-drift { animation: none; } }
`;

/* Fades a section in once as it enters the viewport */
function Reveal({ children, className = "", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { rootMargin: "0px 0px -10% 0px" });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} {...rest} className={`transition-all duration-700 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"} ${className}`}>
      {children}
    </section>
  );
}

export default function Members() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(memberGroups[0]?.id);

  const total = useMemo(() => memberGroups.reduce((n, g) => n + g.members.length, 0), []);
  const leadCount = memberGroups.filter((g) => g.members.some((m) => m.role === "Domain Lead")).length;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return memberGroups
      .map((g) => {
        const matches = g.members.filter((m) => m.name.toLowerCase().includes(q));
        const lead = matches.find((m) => m.role === "Domain Lead");
        return { ...g, lead, rest: matches.filter((m) => m !== lead), count: matches.length };
      })
      .filter((g) => g.count > 0);
  }, [query]);
  const resultCount = groups.reduce((n, g) => n + g.count, 0);

  // Scroll-spy
  const ids = groups.map((g) => g.id).join(",");
  useEffect(() => {
    const els = ids.split(",").filter(Boolean).map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: "-25% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  // Cmd/Ctrl + K focuses whichever search box is visible
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        [...document.querySelectorAll("[data-search]")].find((el) => el.offsetParent)?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const jump = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`${FONT} relative min-h-dvh overflow-x-clip bg-[#FAFAFA] text-slate-900 antialiased dark:bg-[#050505] dark:text-[#F5F5F5]`}>
      <style>{CSS}</style>

      {/* Technology canvas: faint dot grid + noise, masked toward the top */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[60rem] text-slate-900/[0.07] [mask-image:linear-gradient(to_bottom,black,transparent)] dark:text-white/[0.07]">
        <div className="am-dots absolute inset-0" />
      </div>
      <div aria-hidden="true" className="am-noise pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay dark:opacity-[0.05]" />

      {/* ============================ HERO ============================ */}
      <header className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="am-drift pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[min(60rem,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.28),rgba(139,92,246,0.14)_55%,transparent)] blur-3xl dark:bg-[radial-gradient(closest-side,rgba(56,189,248,0.22),rgba(139,92,246,0.16)_55%,transparent)]" />
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-20 text-center sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <p className="am-rise text-xs font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-[#8B8B93] sm:text-sm">
            Meet the people behind
          </p>
          <h1
            style={{ animationDelay: "80ms" }}
            className="am-rise am-shimmer mt-4 bg-[linear-gradient(110deg,#0369a1,#7c3aed,#0369a1)] bg-clip-text pb-2 text-[clamp(4.25rem,18vw,12rem)] font-black leading-[0.9] tracking-[-0.05em] text-transparent dark:bg-[linear-gradient(110deg,#ffffff,#7dd3fc,#c4b5fd,#ffffff)]"
          >
            AdroIT
          </h1>
          <p style={{ animationDelay: "180ms" }} className={`am-rise mx-auto mt-5 max-w-md text-base sm:text-lg ${muted}`}>
            Find the people building, leading and shaping every domain.
          </p>

          <dl className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
            {[["Members", total], ["Domains", memberGroups.length], ["Leads", leadCount]].map(([label, value], i) => (
              <div
                key={label}
                style={{ animationDelay: `${300 + i * 90}ms` }}
                className="am-rise rounded-2xl border border-slate-200 bg-white/70 px-3 py-4 text-left backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/20 sm:px-5 sm:py-5"
              >
                <dd className="text-3xl font-semibold leading-none tracking-tight tabular-nums sm:text-5xl">{value}</dd>
                <dt className={`mt-2 text-[10px] font-medium uppercase tracking-[0.2em] sm:text-xs ${muted}`}>{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ===================== MOBILE / TABLET BAR ==================== */}
      <div className="sticky top-0 z-30 space-y-2.5 border-y border-slate-200 bg-[#FAFAFA]/85 px-4 py-3 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#050505]/85 lg:hidden">
        <SearchBox value={query} onChange={setQuery} resultCount={resultCount} />
        <nav aria-label="Domains" className="-mx-4 flex gap-2 overflow-x-auto scroll-smooth px-4 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {groups.map((g) => {
            const on = activeId === g.id;
            const { icon: Icon } = dom(g.id);
            return (
              <a
                key={g.id}
                href={`#${g.id}`}
                onClick={jump(g.id)}
                style={vars(g.id)}
                aria-current={on ? "true" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ${
                  on
                    ? `${tint} ${accentText} ${accentBorder} ${accentGlow}`
                    : "border-slate-200 bg-transparent text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-[#8B8B93]"
                }`}
              >
                <Icon size={14} aria-hidden="true" />
                {g.name}
                <span className="text-xs opacity-60">{g.count}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[16rem_1fr] lg:gap-14 lg:px-8 lg:py-16">
        {/* ====================== DESKTOP RAIL ======================= */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-5">
            <SearchBox value={query} onChange={setQuery} resultCount={resultCount} />
            <nav aria-label="Domains" className={`rounded-2xl border p-2 ${surface}`}>
              <p className={`px-3 pb-2 pt-2 text-[10px] font-medium uppercase tracking-[0.25em] ${muted}`}>Domains</p>
              <div className="space-y-0.5">
                {groups.map((g) => {
                  const { icon: Icon } = dom(g.id);
                  const on = activeId === g.id;
                  return (
                    <a
                      key={g.id}
                      href={`#${g.id}`}
                      onClick={jump(g.id)}
                      style={vars(g.id)}
                      aria-current={on ? "true" : undefined}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:translate-x-0.5 ${
                        on ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-[#8B8B93] dark:hover:text-white"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute -left-0.5 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[var(--c)] transition-all duration-300 dark:bg-[var(--cd)] ${
                          on ? "scale-y-100 opacity-100 shadow-[0_0_10px_var(--c)] dark:shadow-[0_0_12px_var(--cd)]" : "scale-y-0 opacity-0"
                        }`}
                      />
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300 ${on ? `${tint} ${accentText}` : "bg-slate-100 dark:bg-white/[0.04]"}`}>
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span className="flex-1">{g.name}</span>
                      <span className="text-xs tabular-nums opacity-60">{g.count}</span>
                    </a>
                  );
                })}
              </div>
            </nav>
          </div>
        </aside>

        {/* ========================= CONTENT ========================= */}
        <main className="min-w-0 space-y-20">
          {groups.length === 0 && (
            <div className="flex flex-col items-center py-24 text-center">
              <span className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${surface} ${muted}`}>
                <SearchX size={26} aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-xl font-semibold">No members found</h2>
              <p className={`mt-1.5 text-sm ${muted}`}>Try searching with another name.</p>
              <button type="button" onClick={() => setQuery("")} className="mt-6 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 dark:border-white/15 dark:hover:bg-white/[0.06]">
                Clear search
              </button>
            </div>
          )}

          {groups.map((g) => {
            const { icon: Icon } = dom(g.id);
            return (
              <Reveal key={g.id} id={g.id} style={vars(g.id)} aria-labelledby={`h-${g.id}`} className="scroll-mt-40 lg:scroll-mt-8">
                {/* Chapter header */}
                <div className="flex items-center gap-4">
                  <span className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur ${tint} ${accentText} ${accentBorder} ${accentGlow}`}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id={`h-${g.id}`} className="text-2xl font-semibold tracking-tight sm:text-3xl">{g.name}</h2>
                    <p className={`mt-0.5 text-xs font-medium uppercase tracking-[0.18em] ${muted}`}>
                      {g.count} {g.count === 1 ? "member" : "members"}
                    </p>
                  </div>
                </div>
                <div aria-hidden="true" className="mb-6 mt-5 h-px w-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--c)_70%,transparent),transparent_75%)] dark:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--cd)_70%,transparent),transparent_75%)]" />

                {g.lead && <LeadCard member={g.lead} Icon={Icon} />}

                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
                  {g.rest.map((m) => (
                    <MemberCard key={`${g.id}-${m.name}`} member={m} />
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SearchBox({ value, onChange, resultCount }) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || "");
  return (
    <div>
      <label className="group relative block">
        <span className="sr-only">Search members</span>
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-sky-600 dark:group-focus-within:text-sky-400" />
        <input
          data-search
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search members..."
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-16 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-white/[0.08] dark:bg-[#0B0B0D] dark:text-white dark:placeholder:text-[#8B8B93] [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X size={14} />
          </button>
        ) : (
          <kbd aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 px-1.5 py-0.5 font-sans text-[11px] text-slate-400 dark:border-white/10 dark:text-[#8B8B93] sm:block">
            {isMac ? "⌘ K" : "Ctrl K"}
          </kbd>
        )}
      </label>
      <p aria-live="polite" className={`mt-2 h-4 px-1 text-xs ${muted}`}>
        {value.trim() ? `${resultCount} ${resultCount === 1 ? "result" : "results"}` : ""}
      </p>
    </div>
  );
}

/* Portrait: photo if available, otherwise a layered generative tile */
function Portrait({ member, className = "", letterClass = "text-6xl", imgClass = "" }) {
  const [failed, setFailed] = useState(false);
  const src = member.imagePublicId ? cloudinaryUrl(member.imagePublicId, { width: 480, height: 480 }) : null;
  if (src && !failed) {
    return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className} ${imgClass}`} />;
  }
  return (
    <div aria-hidden="true" className={`relative isolate overflow-hidden ${className}`}>
      <div className={`absolute inset-0 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--c)_20%,white),color-mix(in_srgb,var(--c)_5%,white))] dark:bg-[linear-gradient(145deg,color-mix(in_srgb,var(--cd)_24%,#0B0B0D),#0B0B0D_75%)] ${imgClass}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,color-mix(in_srgb,var(--c)_30%,transparent),transparent_60%)] dark:bg-[radial-gradient(circle_at_28%_18%,color-mix(in_srgb,var(--cd)_34%,transparent),transparent_60%)]" />
      <div className={`absolute inset-0 bg-[repeating-linear-gradient(45deg,currentColor_0_1px,transparent_1px_16px)] opacity-[0.07] ${accentText}`} />
      <div className="am-noise absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      <span className={`absolute inset-0 flex items-center justify-center font-semibold tracking-tight drop-shadow-[0_2px_18px_color-mix(in_srgb,var(--c)_40%,transparent)] ${letterClass} ${accentText}`}>
        {member.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function LeadCard({ member, Icon }) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:shadow-none sm:p-6 hover:border-[color-mix(in_srgb,var(--c)_45%,transparent)] dark:hover:border-[color-mix(in_srgb,var(--cd)_45%,transparent)] ${surface}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(60%_90%_at_100%_0%,color-mix(in_srgb,var(--c)_16%,transparent),transparent)] dark:bg-[radial-gradient(60%_90%_at_100%_0%,color-mix(in_srgb,var(--cd)_22%,transparent),transparent)]" />
      <Icon aria-hidden="true" strokeWidth={1} className={`pointer-events-none absolute -right-6 -top-6 h-48 w-48 opacity-[0.08] sm:h-64 sm:w-64 ${accentText}`} />
      <div className="relative flex items-center gap-4 sm:gap-8">
        <div className={`shrink-0 overflow-hidden rounded-[1.75rem] border ${accentBorder} ${accentGlow}`}>
          <Portrait member={member} className="h-28 w-28 sm:h-44 sm:w-44" letterClass="text-6xl sm:text-8xl" imgClass="transition-transform duration-500 group-hover:scale-[1.04]" />
        </div>
        <div className="min-w-0">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${tint} ${accentText} ${accentBorder}`}>
            Domain lead
          </span>
          <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">{member.name}</h3>
          {member.year && <p className={`mt-1.5 text-sm ${muted}`}>{member.year} Year</p>}
        </div>
      </div>
    </div>
  );
}

function MemberCard({ member }) {
  const sub = member.role && member.role !== "Member" ? member.role : member.year ? `${member.year} Year` : "Member";
  return (
    <li
      className={`group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_-16px_color-mix(in_srgb,var(--c)_55%,transparent)] dark:hover:shadow-[0_14px_36px_-16px_color-mix(in_srgb,var(--cd)_60%,transparent)] hover:border-[color-mix(in_srgb,var(--c)_50%,transparent)] dark:hover:border-[color-mix(in_srgb,var(--cd)_50%,transparent)] ${surface}`}
    >
      <div className="overflow-hidden">
        <Portrait member={member} className="aspect-square w-full" letterClass="text-6xl sm:text-7xl" imgClass="transition-transform duration-500 group-hover:scale-[1.04]" />
      </div>
      <div className="px-3.5 py-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 transition-colors duration-300 group-hover:text-[var(--c)] dark:group-hover:text-[var(--cd)]" title={member.name}>
          {member.name}
        </p>
        <p className={`mt-0.5 truncate text-[11px] font-medium uppercase tracking-[0.14em] ${muted}`}>{sub}</p>
      </div>
    </li>
  );
}