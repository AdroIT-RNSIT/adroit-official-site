import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronDown, MapPin, Users } from "lucide-react";
import { useSession } from "../lib/auth-client";
import { sharedEvents } from "../data/events";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SPONSORS = [
  { name: "WHO VR", src: "/whovr.png" },
  { name: "Nexploit", src: "/nexploit.jpeg" },
];

const GENERIC_RULES = [
  "To avail the IEEE member discounted fee, at least one member of the team must hold a valid IEEE membership, and the registration must be made under that member's name and membership ID.",
  "Membership details will be verified. Any discrepancy found will lead to immediate invalidation of the registration, with no refund.",
  "Payment must be made only through the official payment gateway linked on this website.",
  "The payment amount must be entered manually at checkout - please double-check it against the fee applicable to your event/category before paying.",
  "If the amount entered does not match the actual fee applicable, the registration will be considered invalid and no refund will be initiated. Exceptions will be considered only in cases of a genuine, verifiable error.",
  "A registration is confirmed only after payment and membership details (where applicable) are verified. A confirmation email will follow within 48 hours - please retain your payment reference until then.",
  "All team member details (name, institution, email, phone, IEEE ID where applicable) must be accurate at the time of registration.",
  "Multiple/Duplicate registrations for the same team in the same event are not allowed and may lead to cancellation of all such entries.",
  "All participants must carry a valid college/institution ID card to the venue.",
  "The organising team reserves the right to modify these guidelines, event rules, schedules, or venues at any time; changes will be communicated through official channels.",
];

const feeLabel = (cost) => {
  if (!cost) return "";
  if (cost.all != null) return `₹${cost.all}`;
  const parts = [];
  if (cost.ieee != null) parts.push(`IEEE ₹${cost.ieee}`);
  if (cost.nonIeee != null) parts.push(`Non-IEEE ₹${cost.nonIeee}`);
  return parts.join(" · ");
};

const formatDay = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function Events() {
  const { data: session } = useSession();
  const [events, setEvents] = useState(sharedEvents);
  const [rulesOpen, setRulesOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";
  const totalPrize = events.reduce((sum, event) => sum + (event.prize || 0), 0);

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch {
      alert("Failed to delete event");
    }
  };

  return (
    <div className="event-page-enter min-h-dvh bg-[#080c16] text-slate-100">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[90px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Department of CSE · RNSIT
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                Paradox 2026
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
                Three competitions · 17–18 September 2026
              </p>
            </div>

            <div className="rounded-2xl border border-white/12 bg-[#0d1424] px-5 py-4 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Sponsors
              </p>
              <div className="mt-3 flex items-center gap-5 sm:gap-7">
                {SPONSORS.map((sponsor) => (
                  <img
                    key={sponsor.name}
                    src={sponsor.src}
                    alt={sponsor.name}
                    className="h-14 w-auto max-w-[8.5rem] object-contain sm:h-16 sm:max-w-[10rem]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div className="flex flex-col justify-between rounded-2xl border border-cyan-400/35 bg-cyan-400/[0.12] px-5 py-5 lg:min-h-[11.5rem]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Prize pool
              </p>
              <p className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                ₹{totalPrize.toLocaleString("en-IN")}
              </p>
            </div>

            {events.map((event) => {
              const poster = event.poster || event.imageUrl;
              const shortName =
                event.slug === "capture-the-flag" ? "CTF" : event.title;
              return (
                <Link
                  key={event._id}
                  to={`/events/${event.slug}`}
                  className="relative min-h-[8.5rem] overflow-hidden rounded-2xl lg:min-h-[11.5rem]"
                >
                  {poster && (
                    <img
                      src={poster}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
                  <div className="relative flex h-full min-h-[8.5rem] flex-col justify-end p-4 lg:min-h-[11.5rem] lg:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-200">
                      {shortName}
                    </p>
                    <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
                      ₹{(event.prize || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14">
        <p className="mb-8 text-center text-sm text-slate-400">
          All participants must read the generic rules and guidelines at the bottom of this page.
        </p>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-20 text-center">
            <h2 className="text-xl font-bold text-white">No events yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-slate-400">
              Stay tuned — upcoming competitions will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <section className="mt-14">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent">
            <button
              type="button"
              onClick={() => setRulesOpen((open) => !open)}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3.5 text-left sm:px-5 lg:pointer-events-none lg:min-h-0 lg:cursor-default lg:px-0 lg:py-0"
              aria-expanded={rulesOpen}
            >
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  Rules &amp; guidelines
                </h2>
                <p className="mt-1 text-sm text-slate-400 lg:hidden">
                  {GENERIC_RULES.length} points · tap to {rulesOpen ? "hide" : "read"}
                </p>
                <p className="mt-2 hidden max-w-3xl text-sm text-slate-400 lg:block">
                  These apply across every Paradox 2026 event. Event-specific additions are listed on each event page.
                </p>
              </div>
              <ChevronDown
                size={20}
                className={`shrink-0 text-cyan-300 transition-transform lg:hidden ${rulesOpen ? "rotate-180" : ""}`}
              />
            </button>

            <ol
              className={`gap-3 border-t border-white/10 p-3 sm:grid-cols-2 sm:p-4 lg:mt-5 lg:border-0 lg:p-0 ${
                rulesOpen ? "grid" : "hidden lg:grid"
              }`}
            >
              {GENERIC_RULES.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 rounded-xl bg-black/25 px-3.5 py-3.5 sm:rounded-2xl sm:px-5 sm:py-4 lg:border lg:border-white/10 lg:bg-white/[0.04]"
                >
                  <span className="mt-0.5 font-mono text-xs font-semibold text-cyan-400 sm:text-sm">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-relaxed text-slate-200">{rule}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}

function EventCard({ event, isAdmin, onDelete }) {
  const poster = event.poster || event.imageUrl;
  const fees = feeLabel(event.registrationCost);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-colors hover:border-cyan-400/35 hover:bg-white/[0.06]">
      {isAdmin && (
        <button
          type="button"
          onClick={() => onDelete(event._id)}
          className="absolute right-3 top-3 z-20 rounded-lg bg-black/50 p-2 text-red-300/80 backdrop-blur-sm hover:bg-red-500/20 hover:text-red-200"
          title="Delete event"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      <Link to={`/events/${event.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-slate-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/20 to-transparent" />
          {event.prize ? (
            <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold text-cyan-100 backdrop-blur-md">
              Prize ₹{event.prize.toLocaleString("en-IN")}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-xl font-black leading-tight text-white">{event.title}</h2>
          {event.tagline && (
            <p className="mt-1 text-sm text-cyan-200/80">{event.tagline}</p>
          )}

          <div className="mt-4 space-y-1.5 text-sm text-slate-400">
            <p className="flex items-center gap-2">
              <Calendar size={14} className="shrink-0 text-cyan-400" />
              {formatDay(event.date)}
            </p>
            {event.location && (
              <p className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-cyan-400" />
                {event.location}
              </p>
            )}
            {event.teamSize && (
              <p className="flex items-center gap-2">
                <Users size={14} className="shrink-0 text-cyan-400" />
                {event.teamSize}
                {fees ? ` · ${fees}` : ""}
              </p>
            )}
          </div>

          {event.description && (
            <p className="mt-4 mb-5 line-clamp-3 text-sm leading-relaxed text-slate-300">
              {event.description}
            </p>
          )}

          <span className="mt-auto inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.18)] transition-transform group-hover:from-cyan-300 group-hover:to-blue-400">
            View details &amp; register
          </span>
        </div>
      </Link>
    </article>
  );
}
