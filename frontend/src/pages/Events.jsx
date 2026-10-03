import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { eventPhase, eventStatusLabel, partitionEvents } from "../data/events";
import ShareEventButton from "../components/ShareEventButton";

const formatRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();
  if (sameMonth) {
    return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
};

export default function Events() {
  const { upcoming: upcomingEvents, completed: completedEvents } = partitionEvents();
  return (
    <div className="relative overflow-x-clip pt-8 pb-10 text-slate-900 dark:text-slate-100">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-900/5 px-4 py-2 dark:border-white/10 dark:bg-white/5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-600" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Department of CSE · RNSIT</span>
          </div>
          <h1 className="fluid-h1 mb-4 font-extrabold">
            <span className="text-sky-800">Events</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Upcoming sessions and recaps from AdroIT.
          </p>
        </header>

        {upcomingEvents.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                Upcoming
              </h2>
            </div>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <FeaturedEvent key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Completed
            </h2>
          </div>
          {completedEvents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-16 text-center shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No past events yet</h3>
            </div>
          ) : (
            <div className="space-y-6">
              {completedEvents.map((event) => (
                <FeaturedEvent key={event._id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FeaturedEvent({ event }) {
  const poster = event.poster || event.imageUrl;
  const posterContained = event.posterFit === "contain";
  const glimpses = event.glimpses?.slice(0, 3) || [];
  const when = event.slug === "skill-up-bootcamp" ? "" : event.dateLabel || formatRange(event.date, event.endDate);
  const phase = eventPhase(event);
  const upcoming = phase !== "completed";
  const statusLabel = eventStatusLabel(event);
  const shareText = upcoming ? `Attend ${event.title} with AdroIT.` : `${event.title} — AdroIT.`;

  return (
    <article
      className={`group relative grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm shadow-slate-900/5 transition-all duration-500 hover:-translate-y-1 hover:border-sky-600/30 hover:shadow-xl hover:shadow-sky-900/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-400/30 ${poster ? "md:grid-cols-[minmax(0,14rem)_1fr]" : ""}`}
    >
      {poster && (
        <Link
          to={`/events/${event.slug}`}
          className={`relative block overflow-hidden ${posterContained ? "aspect-video bg-slate-50 dark:bg-white/5 md:aspect-auto md:flex md:h-full md:min-h-40 md:items-center md:justify-center md:p-3" : "h-36 sm:h-40"}`}
        >
          <img
            src={poster}
            alt=""
            className={posterContained ? "h-full w-full object-contain object-center" : "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"}
          />
          {!posterContained && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white/20 dark:md:to-[#000000]/40" />
          )}
          <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-800 backdrop-blur-md dark:border-white/15 dark:bg-slate-950/70 dark:text-sky-300">
            {statusLabel}
          </span>
        </Link>
      )}

      <div className="relative flex flex-col justify-between p-4 sm:p-5">
        <Link to={`/events/${event.slug}`} className="block">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              {event.eyebrow || "Fest recap"}
            </p>
            {!poster && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-800 dark:border-white/10 dark:bg-white/5 dark:text-sky-300">
                {statusLabel}
              </span>
            )}
          </div>
          <h3 className="mt-1 text-xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            {event.title}
          </h3>
          {event.tagline && (
            <p className="mt-2 text-base text-sky-700">{event.tagline}</p>
          )}
          {(when || event.location) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {when && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <Calendar size={13} className="text-sky-600" />
                  {when}
                </span>
              )}
              {event.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <MapPin size={13} className="text-sky-600" />
                  {event.location}
                </span>
              )}
            </div>
          )}
          {event.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {event.description}
            </p>
          )}
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {glimpses.length > 0 && (
            <div className="flex -space-x-3">
              {glimpses.map((src, idx) => (
                <img
                  key={`${src}-${idx}`}
                  src={src}
                  alt=""
                  className="h-9 w-9 rounded-lg border-2 border-white object-cover shadow-sm dark:border-[#000000]"
                />
              ))}
            </div>
          )}
          <div className="ml-auto flex items-center gap-3">
            <ShareEventButton title={event.title} text={shareText} path={`/events/${event.slug}`} />
            <Link
              to={`/events/${event.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              {upcoming ? "View and register" : poster ? "View recap" : "View details"}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
