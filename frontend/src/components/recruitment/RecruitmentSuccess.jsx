import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Check, Copy, Home, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { formatDateTime, formatDay } from "../../lib/recruitment";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function RecruitmentSuccess({ registration, config }) {
  const headingRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const name = (id) => config.domains.find((d) => d.id === id)?.name || id;
  const nonTech = config.domains.find((d) => !d.technical);
  const { preferences: p } = registration;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(registration.registrationId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* the ID stays visible to copy by hand */
    }
  };

  return (
    <section className="ui-card rounded-3xl p-6 text-center sm:p-10" aria-labelledby="recruit-success">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .recruit-check-ring { animation: recruit-pop 420ms cubic-bezier(.2,1.4,.4,1) both; }
          .recruit-check-path { stroke-dasharray: 30; stroke-dashoffset: 30; animation: recruit-draw 420ms 260ms ease-out forwards; }
        }
        @keyframes recruit-pop { from { transform: scale(.6); opacity: 0; } }
        @keyframes recruit-draw { to { stroke-dashoffset: 0; } }
      `}</style>
      <div className="recruit-check-ring mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success ring-1 ring-success/30" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path className="recruit-check-path" d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>

      <h2 id="recruit-success" ref={headingRef} tabIndex={-1} className="ui-heading mt-6 text-3xl font-bold text-ink outline-none">
        You're registered!
      </h2>
      <p className="mx-auto mt-2 max-w-md text-ink-muted">
        Thanks, {registration.fullName.split(" ")[0]}. Your registration is saved. Keep your reference ID handy.
      </p>

      <div className="ui-well mx-auto mt-6 flex max-w-sm items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Reference ID</p>
          <p className="mt-1 font-mono text-xl font-bold tracking-wider text-ink">{registration.registrationId}</p>
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy reference ID"
          className={`ui-pill grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink ${FOCUS}`}
        >
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        </button>
      </div>
      <p className="mt-2 text-sm text-ink-muted" aria-live="polite">
        {copied ? "Copied to clipboard." : `Registered ${formatDateTime(registration.createdAt)} IST`}
      </p>

      {registration.whatsappLink && (
        <div className="ui-well mx-auto mt-6 max-w-md rounded-2xl p-5 text-left" data-part="whatsapp-join">
          <div className="flex items-start gap-4">
            <span className="brand-whatsapp brand-whatsapp-tile grid h-12 w-12 shrink-0 place-items-center rounded-2xl" aria-hidden="true">
              <FaWhatsapp size={26} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-ink">One more step</p>
              <h3 className="ui-heading mt-1 text-lg font-bold text-ink">Join the recruitment WhatsApp group</h3>
              <p className="mt-1 text-sm text-ink-muted">The schedule, venue and any changes are shared here first.</p>
            </div>
          </div>
          <a
            href={registration.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`ui-solid mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold ${FOCUS}`}
          >
            <FaWhatsapp size={18} aria-hidden="true" />
            Join WhatsApp group
            <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only"> (opens WhatsApp)</span>
          </a>
        </div>
      )}

      <div className="mx-auto mt-6 max-w-md text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {registration.registrationType === "TECHNICAL" ? "Technical domains" : "Non-Tech only"}
        </p>
        {registration.registrationType === "TECHNICAL" ? (
          <ol className="mt-2 grid gap-1.5 text-sm text-ink">
            <li>1. {name(p.first)}</li>
            <li>2. {name(p.second)}</li>
            {p.third && <li>3. {name(p.third)} (optional)</li>}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-ink">{nonTech?.name || "Non-Tech"}</p>
        )}
      </div>

      {(config.recruitmentDate || config.recruitmentVenue || config.nextSteps) && (
        <div className="ui-well mx-auto mt-6 max-w-md rounded-2xl p-5 text-left">
          <p className="text-sm font-semibold text-ink">Next steps</p>
          {config.recruitmentDate && (
            <p className="mt-3 flex items-start gap-2 text-sm text-ink">
              <CalendarDays size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Recruitment on {formatDay(config.recruitmentDate)}
                {config.recruitmentTime ? `, ${config.recruitmentTime}` : ""}
              </span>
            </p>
          )}
          {config.recruitmentVenue && (
            <p className="mt-2 flex items-start gap-2 text-sm text-ink">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <span>{config.recruitmentVenue}</span>
            </p>
          )}
          {config.nextSteps && <p className="mt-3 text-sm text-ink-muted">{config.nextSteps}</p>}
        </div>
      )}

      <Link to="/" className={`ui-solid mt-8 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold ${FOCUS}`}>
        <Home size={16} aria-hidden="true" />
        Back to AdroIT
      </Link>
    </section>
  );
}
