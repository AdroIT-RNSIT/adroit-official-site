import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BarChart3, Brain, Calendar, ChevronLeft, ChevronRight, Cloud, MapPin, ShieldCheck, X } from "lucide-react";
import RegistrationModal from "../components/RegistrationModal";
import GlimpseGallery from "../components/GlimpseGallery";
import ShareEventButton from "../components/ShareEventButton";
import { ACCENTS, AUTO_MS, ParticleStage } from "../components/DomainParticleStage";
import { eventPhase, eventStatusLabel, findEditionForCompetitionSlug, getEventBySlug, sessionCompleted } from "../data/events";
import { useRegistrationClosed } from "../lib/registrationStatus";

const SESSION_ICONS = {
  "data-analytics": BarChart3,
  "cloud-computing": Cloud,
  "machine-learning": Brain,
  cybersecurity: ShieldCheck,
};

const formatRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();
  if (sameMonth) {
    return `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
};

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function EventDetail() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);
  const legacyEdition = findEditionForCompetitionSlug(slug);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [glimpseIndex, setGlimpseIndex] = useState(null);
  const registrationClosed = useRegistrationClosed();

  useEffect(() => {
    setIsRegOpen(false);
    setGlimpseIndex(null);
  }, [slug]);

  useEffect(() => {
    if (glimpseIndex == null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setGlimpseIndex(null);
      if (e.key === "ArrowRight") setGlimpseIndex((i) => (i == null ? i : i + 1));
      if (e.key === "ArrowLeft") setGlimpseIndex((i) => (i == null ? i : i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [glimpseIndex]);

  if (!event && legacyEdition) {
    return <Navigate to={`/events/${legacyEdition.slug}`} replace />;
  }

  if (!event) return <Navigate to="/events" replace />;
  if (event.slug === "skill-up-bootcamp") {
    return <BootcampPage event={event} />;
  }
  if (event.slug === "paradox-2026") {
    return <ParadoxPage event={event} glimpseIndex={glimpseIndex} setGlimpseIndex={setGlimpseIndex} />;
  }

  const isCompleted = event.status === "completed";
  const individualRegistration = event.registration === "individual";
  const poster = event.poster || event.imageUrl;
  const posterContained = event.posterFit === "contain";
  const glimpses = (
    event.glimpses?.length
      ? event.glimpses
      : event.competitions?.length
        ? [
            ...event.competitions.map((c) => c.poster || c.imageUrl),
            event.poster,
            event.imageUrl,
          ]
        : []
  ).filter((src, idx, arr) => src && arr.indexOf(src) === idx);
  const competitions = event.competitions || [];
  const dateLabel = event.dateLabel || formatRange(event.date, event.endDate);
  const sessions = event.sessions || [];
  const activeGlimpse =
    glimpseIndex == null ? null : ((glimpseIndex % glimpses.length) + glimpses.length) % glimpses.length;

  return (
    <div className="relative min-h-dvh overflow-x-clip pb-12 text-slate-900 sm:pb-16 dark:text-slate-100">
      <section className={`relative overflow-hidden ${poster && !posterContained ? "min-h-[34vh] sm:min-h-[48vh]" : "pt-4 sm:pt-6"}`}>
        {poster && !posterContained && (
          <>
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full scale-105 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-black/25 dark:from-[#000000] dark:via-[#000000]/70 dark:to-black/40" />
          </>
        )}

        <div className={`relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-6 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8 ${poster && !posterContained ? "min-h-[34vh] sm:min-h-[48vh]" : ""}`}>
          {posterContained && (
            <img
              src={poster}
              alt={`${event.title} poster`}
              className="mx-auto mb-6 w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50 object-contain sm:mb-8 dark:border-white/10 dark:bg-white/5"
            />
          )}
          <div>
            <Link
              to="/events"
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-sky-600/40 hover:text-sky-800 sm:mb-6"
            >
              <ArrowLeft size={16} />
              Events
            </Link>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
              <div className="min-w-0 flex-1">
                {event.eyebrow && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                    {event.eyebrow}
                  </p>
                )}
                <h1 className="break-words text-3xl font-extrabold leading-tight text-sky-800 sm:text-5xl">
                  {event.title}
                </h1>
              </div>
              <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                <ShareEventButton
                  title={event.title}
                  text={isCompleted ? `${event.title} — AdroIT.` : `Attend ${event.title}${dateLabel ? ` on ${dateLabel}` : ""} with AdroIT.`}
                  path={`/events/${event.slug}`}
                />
                {!isCompleted && !individualRegistration && (
                  <button
                    type="button"
                    onClick={() => setIsRegOpen(true)}
                    className="w-full shrink-0 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-900/15 hover:bg-sky-700 sm:w-auto sm:px-7"
                  >
                    Register now
                  </button>
                )}
              </div>
            </div>
            {event.tagline && (
              <p className="mt-3 max-w-2xl text-base text-slate-700 sm:text-lg">
                {event.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <MetaCard icon={<Calendar size={16} />} label="Date" value={dateLabel} />
          {event.location && (
            <MetaCard icon={<MapPin size={16} />} label="Venue" value={event.location} />
          )}
          <MetaCard
            icon={<span className="text-sky-600">●</span>}
            label="Status"
            value={eventStatusLabel(event)}
          />
        </div>

        {(event.about?.length || event.description) && (
          <section className="mt-8 sm:mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              About
            </h2>
            <div className="mt-3 max-w-3xl space-y-4 sm:mt-4 sm:space-y-5">
              {(event.about?.length ? event.about : [event.description]).map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {sessions.length > 0 && (
          <section className="mt-10 sm:mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Domains
            </h2>
            <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
              {sessions.map((session) => (
                <article
                  key={session.title}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {poster && (
                      <img
                        src={session.image || poster}
                        alt=""
                        className="h-12 w-16 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-cover sm:w-20 dark:border-white/10 dark:bg-white/5"
                      />
                    )}
                    <div className="min-w-0">
                      {session.day && (
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                          {session.day}
                        </p>
                      )}
                      <h3 className="mt-1 break-words text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100">{session.title}</h3>
                    </div>
                  </div>
                  {session.detail && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {session.detail}
                    </p>
                  )}
                  {registrationClosed(session.slug) ? (
                    <span className="mt-4 inline-flex w-full cursor-not-allowed justify-center rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 sm:w-fit sm:py-2 dark:bg-white/10 dark:text-white/50">
                      Registration closed
                    </span>
                  ) : (
                    <Link
                      to={session.slug ? `/register/${session.slug}` : "/events"}
                      state={{ back: `/events/${event.slug}` }}
                      className="mt-4 inline-flex w-full justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 sm:w-fit sm:py-2"
                    >
                      Register
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {competitions.length > 0 && (
          <section className="mt-10 sm:mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Competitions
            </h2>
            <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {competitions.map((competition) => (
                <article
                  key={competition.slug}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm shadow-slate-900/5"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={competition.poster || competition.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-900">{competition.title}</h3>
                    {competition.tagline && (
                      <p className="mt-1 text-sm text-sky-700">{competition.tagline}</p>
                    )}
                    {competition.description && (
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">
                        {competition.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {glimpses.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <GlimpseGallery images={glimpses} onSelect={setGlimpseIndex} />
          </div>
        )}
      </div>

      {activeGlimpse != null && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/80 p-3 sm:p-4"
          onClick={() => setGlimpseIndex(null)}
        >
          <button
            type="button"
            className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 p-2 text-white sm:right-4 sm:top-4"
            aria-label="Close"
            onClick={() => setGlimpseIndex(null)}
          >
            <X size={18} />
          </button>
          {glimpses.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white sm:left-6"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  setGlimpseIndex((i) => i - 1);
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white sm:right-6"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  setGlimpseIndex((i) => i + 1);
                }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <img
            src={glimpses[activeGlimpse]}
            alt=""
            className="max-h-[85dvh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {!isCompleted && !individualRegistration && (
        <RegistrationModal
          isOpen={isRegOpen}
          onClose={() => setIsRegOpen(false)}
          event={event}
        />
      )}
    </div>
  );
}

function starPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return pts.join(" ");
}

function scallopPath(cx, cy, r, bumps, tooth) {
  let d = "";
  for (let i = 0; i < bumps; i += 1) {
    const a0 = (i / bumps) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / bumps) * Math.PI * 2 - Math.PI / 2;
    const mid = (a0 + a1) / 2;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const xm = cx + Math.cos(mid) * (r + tooth);
    const ym = cy + Math.sin(mid) * (r + tooth);
    d += `${i === 0 ? "M" : "L"} ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${xm.toFixed(1)} ${ym.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} `;
  }
  return `${d}Z`;
}

function CompletedSeal({ color, compact = false }) {
  const edge = scallopPath(110, 110, 82, 18, 8);
  return (
    <div
      aria-hidden="true"
      className={
        compact
          ? "pointer-events-none absolute right-1.5 top-1.5 z-10 h-8 w-8 -rotate-12 sm:right-2 sm:top-2 sm:h-12 sm:w-12"
          : "pointer-events-none absolute -top-2 right-0 z-10 h-24 w-24 -rotate-[14deg] sm:top-2 sm:h-44 sm:w-44 lg:h-52 lg:w-52"
      }
      style={{ color }}
    >
      <svg viewBox="0 0 220 220" className="h-full w-full overflow-visible" style={{ fontFamily: "inherit" }}>
        <path d={edge} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="110" cy="110" r="70" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="110" cy="110" r="64" fill="none" stroke="currentColor" strokeWidth="0.7" />
        {compact ? (
          <path
            d="M86 112 L104 130 L136 92"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <polygon points={starPoints(110, 70, 4.5)} fill="currentColor" />
            <line x1="62" y1="84" x2="158" y2="84" stroke="currentColor" strokeWidth="1.15" />
            <text x="110" y="112" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="800" letterSpacing="1.4">
              COMPLETED
            </text>
            <line x1="74" y1="124" x2="146" y2="124" stroke="currentColor" strokeWidth="1.15" />
            <text x="110" y="146" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700" letterSpacing="3.4">
              ADROIT
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

function ParadoxPage({ event, glimpseIndex, setGlimpseIndex }) {
  const poster = event.poster || event.imageUrl;
  const competitions = event.competitions || [];
  const glimpses = (event.glimpses || []).filter(Boolean);
  const dateLabel = event.dateLabel || formatRange(event.date, event.endDate);
  const prizePool = competitions.reduce((sum, item) => sum + (Number(item.prize) || 0), 0);
  const activeGlimpse =
    glimpseIndex == null ? null : ((glimpseIndex % glimpses.length) + glimpses.length) % glimpses.length;

  return (
    <div className="relative min-h-dvh overflow-x-clip pb-14 text-slate-900 dark:text-slate-100">
      <section className="relative overflow-hidden bg-[#05070d] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 70% at 78% 40%, rgba(56,189,248,0.28), transparent 60%), radial-gradient(ellipse 40% 50% at 12% 80%, rgba(99,102,241,0.22), transparent 65%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:px-8">
          <div>
            <Link
              to="/events"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/90 hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Events
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Intercollegiate fest</p>
            <h1 className="mt-2 text-4xl font-black leading-none tracking-tight sm:text-6xl">{event.title}</h1>
            {event.tagline && <p className="mt-4 max-w-xl text-lg text-white/75">{event.tagline}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm">{dateLabel}</span>
              {event.location && <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm">{event.location}</span>}
              {prizePool > 0 && (
                <span className="rounded-full border border-sky-300/40 bg-sky-400/15 px-3 py-1.5 text-sm font-semibold text-sky-100">
                  Prize pool ₹{prizePool.toLocaleString("en-IN")}+
                </span>
              )}
            </div>
            <div className="mt-6">
              <ShareEventButton title={event.title} text={`${event.title} — AdroIT.`} path={`/events/${event.slug}`} tone="dark" />
            </div>
          </div>
          {poster && (
            <img
              src={poster}
              alt={`${event.title} poster`}
              className="mx-auto w-full max-w-sm rounded-2xl border border-white/15 object-contain shadow-[0_20px_60px_rgba(56,189,248,0.18)] lg:max-w-none"
            />
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        {event.description && (
          <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">{event.description}</p>
        )}

        {competitions.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Three competitions</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              {competitions.map((competition) => (
                <article key={competition.slug} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img src={competition.poster || competition.imageUrl} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-xl font-bold text-white">{competition.title}</h3>
                      {competition.tagline && <p className="mt-1 text-sm text-sky-200">{competition.tagline}</p>}
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    {competition.description && (
                      <p className="line-clamp-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{competition.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {competition.date && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">
                          {new Date(competition.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                      {competition.prize && (
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200">
                          ₹{Number(competition.prize).toLocaleString("en-IN")}
                        </span>
                      )}
                      {competition.teamSize && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">{competition.teamSize}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {glimpses.length > 0 && (
          <div className="mt-12">
            <GlimpseGallery images={glimpses} onSelect={setGlimpseIndex} />
          </div>
        )}
      </div>

      {activeGlimpse != null && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/80 p-4" onClick={() => setGlimpseIndex(null)}>
          <button type="button" className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white" aria-label="Close" onClick={() => setGlimpseIndex(null)}>
            <X size={18} />
          </button>
          <img src={glimpses[activeGlimpse]} alt="" className="max-h-[85dvh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function BootcampPage({ event }) {
  const sessions = event.sessions || [];
  const paragraphs = event.about?.length ? event.about : event.description ? [event.description] : [];
  const phase = eventPhase(event);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [searchParams] = useSearchParams();
  const chosenDomain = searchParams.get("domain");
  const chosenIndex = sessions.findIndex((session) => session.slug === chosenDomain);
  const [now, setNow] = useState(() => new Date());
  const registrationClosed = useRegistrationClosed();

  const [active, setActive] = useState(chosenIndex >= 0 ? chosenIndex : 0);
  const [paused, setPaused] = useState(chosenIndex >= 0);
  const [tick, setTick] = useState(0);
  const activeRef = useRef(0);
  const rotateRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ down: false, x: 0, y: 0 });
  activeRef.current = active;
  const [reduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    rotateRef.current.x = 0;
    rotateRef.current.y = 0;
  }, [active]);

  useEffect(() => {
    if (chosenIndex < 0) return undefined;
    setActive(chosenIndex);
    setPaused(true);
    setTick((n) => n + 1);
    const frame = requestAnimationFrame(() => {
      document.getElementById("bootcamp-register")?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [chosenIndex]);

  useEffect(() => {
    if (paused || reduce || sessions.length < 2) return undefined;
    const id = setTimeout(() => setActive((a) => (a + 1) % sessions.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, paused, tick, reduce, sessions.length]);

  const session = sessions[active];
  const accent = ACCENTS[active % ACCENTS.length];
  const Icon = SESSION_ICONS[session?.slug] || Calendar;
  const num = (session?.day?.match(/\d+/)?.[0] || "").padStart(2, "0");

  const onRotateStart = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current.down = true;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onRotateMove = (e) => {
    if (!dragRef.current.down) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    rotateRef.current.y += dx * 0.006;
    rotateRef.current.x = THREE.MathUtils.clamp(rotateRef.current.x + dy * 0.004, -0.7, 0.7);
  };

  const onRotateEnd = (e) => {
    dragRef.current.down = false;
    if (e?.currentTarget?.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const glowPos = isDesktop ? "72% 42%" : "50% 50%";
  const maskPos = isDesktop ? "70% 40%" : "50% 45%";

  return (
    <div className="relative min-h-dvh overflow-x-clip pb-10 text-slate-900 sm:pb-16 dark:text-slate-100">
      <style>{`
        @keyframes bcFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes bcRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="mx-auto max-w-6xl px-3 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl bg-white text-slate-900 ring-1 ring-slate-200 sm:rounded-[2rem] dark:bg-black dark:text-white dark:ring-white/10"
          onPointerEnter={(e) => {
            if (e.pointerType !== "touch") setPaused(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "touch") return;
            setPaused(false);
            setTick((t) => t + 1);
          }}
        >
          {ACCENTS.map((c, i) => (
            <div
              key={c}
              aria-hidden="true"
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: i === active % ACCENTS.length ? 1 : 0,
                background: `radial-gradient(60% 70% at ${glowPos}, ${c}33, transparent 70%)`,
              }}
            />
          ))}
          <div
            aria-hidden="true"
            className="absolute inset-0 dark:hidden"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,23,42,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.08) 1px, transparent 1px)",
              backgroundSize: isDesktop ? "56px 56px" : "36px 36px",
              maskImage: `radial-gradient(ellipse at ${maskPos}, black 15%, transparent 75%)`,
              WebkitMaskImage: `radial-gradient(ellipse at ${maskPos}, black 15%, transparent 75%)`,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden dark:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)",
              backgroundSize: isDesktop ? "56px 56px" : "36px 36px",
              maskImage: `radial-gradient(ellipse at ${maskPos}, black 15%, transparent 75%)`,
              WebkitMaskImage: `radial-gradient(ellipse at ${maskPos}, black 15%, transparent 75%)`,
            }}
          />

          <div className="relative z-10 flex flex-col lg:min-h-[46rem]">
            <div className="px-5 pt-5 sm:px-10 sm:pt-8">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 text-sm text-slate-800 transition-colors hover:bg-white sm:gap-2 sm:px-4 sm:py-2 sm:text-base dark:border-white/20 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <ArrowLeft size={16} />
                  Events
                </Link>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <ShareEventButton
                    title={event.title}
                    text={`Attend ${event.title}${session ? `, ${session.title} on ${session.day}` : ""} with AdroIT.`}
                    path={`/events/${event.slug}${session?.slug ? `?domain=${session.slug}` : ""}`}
                    tone="dark"
                  />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 text-xs text-slate-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-base dark:border-white/20 dark:bg-white/5 dark:text-white/90">
                    <span
                      className={`h-2 w-2 rounded-full ${phase === "live" ? "animate-pulse bg-emerald-400" : ""}`}
                      style={phase === "live" ? undefined : { backgroundColor: accent }}
                    />
                    {eventStatusLabel(event)}
                  </span>
                </div>
              </div>
              <div className="mt-5 sm:mt-8">
                {event.eyebrow && (
                  <p className="text-base font-semibold sm:text-lg" style={{ color: accent }}>
                    {event.eyebrow}
                  </p>
                )}
                <h1 className="mt-1 break-words text-4xl font-black leading-[1.05] sm:text-6xl">{event.title}</h1>
                {event.tagline && <p className="mt-2 max-w-xl text-base text-slate-600 sm:mt-3 sm:text-lg dark:text-white/70">{event.tagline}</p>}
              </div>
            </div>

            <div className="relative mt-2 h-[clamp(13rem,56vw,22rem)] lg:pointer-events-none lg:absolute lg:inset-0 lg:z-20 lg:mt-0 lg:h-auto">
              <ParticleStage activeRef={activeRef} rotateRef={rotateRef} />
              <div
                aria-label="Drag sideways to rotate the shape"
                className="pointer-events-auto absolute inset-0 z-20 cursor-grab touch-pan-y select-none active:cursor-grabbing lg:inset-auto lg:bottom-36 lg:left-[48%] lg:right-0 lg:top-[22%] lg:touch-none"
                onPointerDown={onRotateStart}
                onPointerMove={onRotateMove}
                onPointerUp={onRotateEnd}
                onPointerCancel={onRotateEnd}
              />
            </div>

            <div className="flex flex-1 flex-col justify-end px-5 pb-6 pt-2 sm:px-10 sm:py-8 lg:max-w-[48%]">
              {session && (
                <div key={active} className="relative" style={{ animation: reduce ? "none" : "bcRise 600ms ease-out both" }}>
                  {sessionCompleted(event, active, now) && (
                    <>
                      <span className="sr-only">This day is completed</span>
                      <CompletedSeal color={accent} />
                    </>
                  )}
                  <div className="flex items-end gap-4 sm:gap-6 lg:block">
                    <p
                      className="text-[4.25rem] font-black leading-[0.85] tabular-nums sm:text-[7rem] lg:text-[11rem]"
                      style={{ color: accent }}
                    >
                      {num}
                    </p>
                    <div className="min-w-0 pb-0.5 lg:pb-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 sm:text-xl lg:mt-4 dark:text-white/80">
                        <Icon size={18} className="shrink-0" style={{ color: accent }} />
                        {session.day}
                      </p>
                      <h2 className="mt-1 break-words text-2xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{session.title}</h2>
                    </div>
                  </div>
                  {session.detail && <p className="mt-3 max-w-md text-base text-slate-600 sm:text-lg dark:text-white/70">{session.detail}</p>}
                  {registrationClosed(session.slug) ? (
                    <span
                      id="bootcamp-register"
                      className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-bold text-slate-500 sm:mt-6 sm:w-auto sm:px-7 sm:py-3.5 sm:text-lg dark:border-white/20 dark:text-white/50"
                    >
                      {session.title} registration closed
                    </span>
                  ) : (
                    <Link
                      id="bootcamp-register"
                      to={session.slug ? `/register/${session.slug}` : "/events"}
                      state={{ back: `/events/${event.slug}` }}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold text-black transition-transform active:scale-[0.98] sm:mt-6 sm:w-auto sm:px-7 sm:py-3.5 sm:text-lg sm:hover:scale-105"
                      style={{ backgroundColor: accent }}
                    >
                      Register for {session.title}
                      <ArrowUpRight size={20} className="shrink-0" />
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div role="tablist" className="grid grid-cols-2 gap-px border-t border-slate-200 bg-slate-100 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
              {sessions.map((s, i) => {
                const on = i === active;
                const done = sessionCompleted(event, i, now);
                const TabIcon = SESSION_ICONS[s.slug] || Calendar;
                const c = ACCENTS[i % ACCENTS.length];
                return (
                  <button
                    key={s.title}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setActive(i);
                      setTick((t) => t + 1);
                    }}
                    className={`relative flex min-h-[3.75rem] items-center justify-between gap-2 px-4 py-3 text-left transition-colors sm:gap-3 sm:px-7 sm:py-5 ${
                      on ? "bg-white dark:bg-[#111111]" : "bg-slate-50 hover:bg-slate-100 dark:bg-black dark:hover:bg-[#1a1a1a]"
                    }`}
                  >
                    {on && (
                      <span
                        key={`${active}-${tick}`}
                        className="absolute left-0 top-0 h-[3px] w-full origin-left"
                        style={{
                          backgroundColor: c,
                          animation: reduce ? "none" : `bcFill ${AUTO_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                      />
                    )}
                    <span className="min-w-0 pr-5 sm:pr-0">
                      <span className="block text-xs font-semibold sm:text-lg" style={{ color: on ? c : "rgba(51,65,85,.7)" }}>
                        {s.day?.replace("October", "Oct")}
                      </span>
                      <span className={`block text-sm font-bold leading-tight sm:text-xl ${on ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-white/70"}`}>
                        {s.title}
                      </span>
                    </span>
                    <TabIcon className="hidden shrink-0 sm:block" size={24} style={{ color: on ? c : "rgba(71,85,105,.5)" }} />
                    {done && <CompletedSeal color={c} compact />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {paragraphs.length > 0 && (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-[#ffffff] px-5 py-5 text-slate-900 sm:mt-6 sm:rounded-3xl sm:px-8 sm:py-6 dark:border-white/10 dark:bg-[#000000] dark:text-slate-100">
            <h2 className="text-2xl font-bold text-sky-800 sm:text-3xl">About</h2>
            <div className="mt-3 max-w-4xl space-y-3 sm:mt-4 sm:space-y-4">
              {paragraphs.map((p, i) => (
                <p
                  key={p}
                  className={`text-base leading-7 sm:text-lg sm:leading-8 ${
                    i === 0 ? "text-slate-900" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function MetaCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm shadow-slate-900/5 sm:py-4 dark:border-white/10 dark:bg-white/5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <span className="text-sky-600">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-snug text-slate-900 sm:mt-1.5 dark:text-slate-100">{value}</p>
    </div>
  );
}