import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import RegistrationModal from "../components/RegistrationModal";
import { getEventBySlug } from "../data/events";

const feeItems = (cost) => {
  if (!cost) return [];
  const items = [];
  if (cost.ieee != null) items.push({ label: "IEEE", value: cost.ieee });
  if (cost.nonIeee != null) items.push({ label: "Non-IEEE", value: cost.nonIeee });
  if (cost.all != null) items.push({ label: "Everyone", value: cost.all });
  return items;
};

export default function EventDetail() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);
  const [isRegOpen, setIsRegOpen] = useState(false);

  if (!event) return <Navigate to="/events" replace />;

  const poster = event.poster || event.imageUrl;
  const fees = feeItems(event.registrationCost);
  const dateLabel = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="event-page-enter min-h-dvh bg-[#080c16] text-slate-100">
      <section className="relative min-h-[52vh] sm:min-h-[58vh] lg:min-h-[70vh] overflow-hidden">
        {poster && (
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/55 to-black/30" />

        <div className="relative z-10 mx-auto flex min-h-[52vh] sm:min-h-[58vh] lg:min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14">
          <Link
            to="/events"
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-sm text-slate-200 backdrop-blur-md transition-colors hover:border-cyan-400/40 hover:text-white"
          >
            <ArrowLeft size={16} />
            Paradox 2026
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan-300">
            Paradox 2026
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            {event.title}
          </h1>
          {event.tagline && (
            <p className="mt-3 max-w-2xl text-base text-cyan-100/80 sm:text-lg">
              {event.tagline}
            </p>
          )}
        </div>
      </section>

      <div className="relative mx-auto max-w-6xl px-4 pb-28 sm:px-6 lg:px-8 lg:pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetaCard icon={<Calendar size={16} />} label="Date" value={dateLabel} />
          {event.location && (
            <MetaCard icon={<MapPin size={16} />} label="Venue" value={event.location} />
          )}
          {event.teamSize && (
            <MetaCard icon={<Users size={16} />} label="Team size" value={event.teamSize} />
          )}
          {fees.length > 0 && (
            <MetaCard
              icon={<span className="text-cyan-400">₹</span>}
              label="Registration"
              value={fees.map((fee) => `${fee.label} ₹${fee.value}`).join(" · ")}
            />
          )}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              About the event
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-200 sm:text-lg">
              {event.description}
            </p>
          </div>

          {event.rules?.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Rules &amp; guidelines
              </h2>
              <ol className="mt-5 space-y-4">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex gap-3 text-sm leading-relaxed text-slate-200 sm:text-[15px]">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="mt-10 hidden lg:block">
          <button
            type="button"
            onClick={() => setIsRegOpen(true)}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3.5 text-base font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.28)] transition-transform hover:scale-[1.02] hover:from-cyan-300 hover:to-blue-400"
          >
            Register now
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#080c16]/90 p-4 backdrop-blur-xl lg:hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => setIsRegOpen(true)}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3.5 text-base font-bold text-slate-950"
        >
          Register now
        </button>
      </div>

      <RegistrationModal
        isOpen={isRegOpen}
        onClose={() => setIsRegOpen(false)}
        eventTitle={event.title}
      />
    </div>
  );
}

function MetaCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <span className="text-cyan-400">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-snug text-white">{value}</p>
    </div>
  );
}
