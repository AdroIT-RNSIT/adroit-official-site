import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import RegistrationModal from "../components/RegistrationModal";
import GlimpseGallery from "../components/GlimpseGallery";
import { findEditionForCompetitionSlug, getEventBySlug } from "../data/events";

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

export default function EventDetail() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);
  const legacyEdition = findEditionForCompetitionSlug(slug);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [glimpseIndex, setGlimpseIndex] = useState(null);

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

  const isCompleted = event.status === "completed";
  const poster = event.poster || event.imageUrl;
  const glimpses = [
    ...(event.glimpses || []),
    ...(event.competitions || []).map((c) => c.poster || c.imageUrl),
    event.poster,
    event.imageUrl,
  ].filter((src, idx, arr) => src && arr.indexOf(src) === idx);
  const competitions = event.competitions || [];
  const dateLabel = formatRange(event.date, event.endDate);
  const activeGlimpse =
    glimpseIndex == null ? null : ((glimpseIndex % glimpses.length) + glimpses.length) % glimpses.length;

  return (
    <div className="relative min-h-dvh overflow-x-clip pb-16 text-slate-900 dark:text-slate-100">
      <section className="relative min-h-[42vh] overflow-hidden sm:min-h-[48vh]">
        {poster && (
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-black/25 dark:from-[#080c16] dark:via-[#080c16]/70 dark:to-black/40" />

        <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-8 sm:min-h-[48vh] sm:px-6 lg:px-8">
          <Link
            to="/events"
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3.5 py-1.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-sky-600/40 hover:text-sky-800"
          >
            <ArrowLeft size={16} />
            Events
          </Link>
          <div className="flex items-center justify-between gap-6 sm:gap-10">
            <h1 className="min-w-0 flex-1 text-4xl font-extrabold leading-tight text-sky-800 sm:text-5xl">
              {event.title}
            </h1>
            {!isCompleted && (
              <button
                type="button"
                onClick={() => setIsRegOpen(true)}
                className="shrink-0 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-900/15 hover:bg-sky-700 sm:px-7 sm:py-3"
              >
                Register now
              </button>
            )}
          </div>
          {event.tagline && (
            <p className="mt-3 max-w-2xl text-base text-slate-700 sm:text-lg">
              {event.tagline}
            </p>
          )}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetaCard icon={<Calendar size={16} />} label="Date" value={dateLabel} />
          {event.location && (
            <MetaCard icon={<MapPin size={16} />} label="Venue" value={event.location} />
          )}
          {isCompleted && (
            <MetaCard icon={<span className="text-sky-600">●</span>} label="Status" value="Completed" />
          )}
        </div>

        {event.description && (
          <section className="mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              About the event
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              {event.description}
            </p>
          </section>
        )}

        {competitions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Competitions
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-12">
            <GlimpseGallery images={glimpses} onSelect={setGlimpseIndex} />
          </div>
        )}
      </div>

      {activeGlimpse != null && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/80 p-4"
          onClick={() => setGlimpseIndex(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white"
            aria-label="Close"
            onClick={() => setGlimpseIndex(null)}
          >
            <X size={18} />
          </button>
          {glimpses.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white sm:left-6"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white sm:right-6"
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
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {!isCompleted && (
        <RegistrationModal
          isOpen={isRegOpen}
          onClose={() => setIsRegOpen(false)}
          event={event}
        />
      )}
    </div>
  );
}

function MetaCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <span className="text-sky-600">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-snug text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
