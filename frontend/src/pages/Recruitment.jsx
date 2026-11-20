import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";
import { RECRUITMENT_INFO } from "../lib/recruitment";

export default function Recruitment() {
  useEffect(() => {
    document.title = "Recruitment | AdroIT";
  }, []);

  return (
    <div data-page="recruitment" className="mx-auto max-w-xl overflow-x-clip px-4 py-12 sm:px-6 sm:py-16">
      <Link
        to="/"
        className="ui-pill inline-flex w-fit min-h-10 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-ink transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <p className="mt-6 font-mono text-xs tracking-[0.22em] uppercase text-primary-ink">
        AdroIT · RNSIT · CSE
      </p>
      <h1 className="ui-heading mt-3 text-3xl font-bold text-ink">Recruitment 2026</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="ui-well flex items-center gap-3 rounded-2xl p-4">
          <CalendarDays size={18} className="shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-ink">{RECRUITMENT_INFO.dates}</p>
        </div>
        <div className="ui-well flex items-center gap-3 rounded-2xl p-4">
          <Clock size={18} className="shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-ink">{RECRUITMENT_INFO.time}</p>
        </div>
        <div className="ui-well flex items-center gap-3 rounded-2xl p-4">
          <MapPin size={18} className="shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-ink">{RECRUITMENT_INFO.venue}</p>
        </div>
      </div>

      <div className="ui-card mt-8 rounded-2xl px-6 py-8">
        <h2 className="ui-heading text-lg font-semibold text-ink">Registration closed</h2>
        <p className="mt-2 text-sm text-ink-muted">
          AdroIT Recruitment 2026 is over. Follow the club for the next cycle and other events.
        </p>
        <Link
          to="/events"
          className="ui-solid mt-6 inline-flex min-h-11 w-fit items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          View events
        </Link>
      </div>
    </div>
  );
}
