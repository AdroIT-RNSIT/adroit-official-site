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
    <div data-page="events" className="relative min-h-screen overflow-x-clip bg-page pt-8 pb-10 text-ink">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="ui-heading fluid-h1 mb-4 font-extrabold text-ink">
            Events
          </h1>
          <p className="mx-auto max-w-2xl text-base text-ink-muted sm:text-lg">
            Upcoming sessions and recaps from AdroIT.
          </p>
        </header>

        {upcomingEvents.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
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
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Completed
            </h2>
          </div>
          {completedEvents.length === 0 ? (
            <div className="ui-card rounded-[2rem] px-6 py-16 text-center">
              <h3 className="ui-heading text-xl font-bold text-ink">No past events yet</h3>
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

function StatusChip({ label, phase, className = "" }) {
  return (
    <span data-part="status" data-phase={phase} className={`ui-chip inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-primary-ink ${className}`}>
      <span data-part="status-led" aria-hidden="true" className="hidden" />
      {label}
    </span>
  );
}

function FeaturedEvent({ event }) {
  const poster = event.poster || event.imageUrl;
  const posterContained = event.posterFit === "contain";
  const posterColumn = event.posterColumn || "52%";
  const glimpses = event.glimpses?.slice(0, 3) || [];
  const when = event.slug === "skill-up-bootcamp" ? "" : event.dateLabel || formatRange(event.date, event.endDate);
  const phase = eventPhase(event);
  const upcoming = phase !== "completed";
  const statusLabel = eventStatusLabel(event);
  const shareText = upcoming ? `Attend ${event.title} with AdroIT.` : `${event.title} — AdroIT.`;

  return (
    <article
      className={`ui-card group grid overflow-hidden rounded-[2rem] transition-transform duration-500 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${poster ? (posterContained ? "md:grid-cols-[minmax(0,var(--poster-col))_1fr] md:items-center" : "md:grid-cols-[minmax(0,14rem)_1fr]") : ""}`}
      style={posterContained ? { "--poster-col": posterColumn } : undefined}
    >
      {poster && (
        <Link
          to={`/events/${event.slug}`}
          data-part="poster"
          data-scheme="dark"
          aria-label={event.title}
          className={`relative block overflow-hidden bg-page ${posterContained ? "aspect-video w-full" : "h-36 sm:h-40"}`}
        >
          <img
            src={poster}
            alt=""
            className={posterContained ? "absolute inset-0 h-full w-full object-contain object-center" : "h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"}
          />
          {!posterContained && (
            <>
              <div data-part="poster-scrim" className="absolute inset-0" />
              <StatusChip label={statusLabel} phase={phase} className="absolute left-4 top-4 px-3 py-1" />
            </>
          )}
        </Link>
      )}

      <div className="relative flex flex-col justify-between p-4 sm:p-5">
        <Link to={`/events/${event.slug}`} className="block">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {event.eyebrow || "Fest recap"}
            </p>
            {(!poster || posterContained) && (
              <StatusChip label={statusLabel} phase={phase} className="px-2.5 py-1" />
            )}
          </div>
          <h3 className="ui-heading mt-1 text-xl font-extrabold leading-tight text-ink sm:text-2xl">
            {event.title}
          </h3>
          {event.tagline && (
            <p className="mt-2 text-base text-primary">{event.tagline}</p>
          )}
          {(when || event.location) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {when && (
                <span className="ui-well inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-ink-muted">
                  <Calendar size={13} className="text-primary" />
                  {when}
                </span>
              )}
              {event.location && (
                <span className="ui-well inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-ink-muted">
                  <MapPin size={13} className="text-primary" />
                  {event.location}
                </span>
              )}
            </div>
          )}
          {event.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
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
                  className="h-9 w-9 rounded-lg border-2 border-page object-cover shadow-sm"
                />
              ))}
            </div>
          )}
          <div className="ml-auto flex items-center gap-3">
            <ShareEventButton title={event.title} text={shareText} path={`/events/${event.slug}`} />
            <Link
              to={`/events/${event.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
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
