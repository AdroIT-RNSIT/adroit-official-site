import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Calendar, Users, CheckCircle2 } from "lucide-react";

const feeItems = (cost) => {
  if (!cost) return [];
  const items = [];
  if (cost.ieee != null) items.push({ label: "IEEE", value: cost.ieee });
  if (cost.nonIeee != null) items.push({ label: "Non-IEEE", value: cost.nonIeee });
  if (cost.all != null) items.push({ label: "Everyone", value: cost.all });
  return items;
};

export default function EventDetailsModal({ isOpen, onClose, event, onRegisterClick }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const { body, documentElement } = document;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.overflow = "";
      body.style.paddingRight = "";
      documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const poster = event.poster || event.imageUrl;
  const fees = feeItems(event.registrationCost);
  const dateLabel = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center sm:p-5">
      <button
        type="button"
        aria-label="Close event details"
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-dialog-title"
        className="relative z-10 flex w-full max-w-5xl max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl bg-[#0c1222] text-slate-100 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:rounded-3xl lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="event-dialog-title" className="sr-only">
          {event.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/25 hover:bg-black/90"
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        <div className="relative h-48 w-full shrink-0 sm:h-56 lg:h-auto lg:min-h-[32rem] lg:w-[44%] lg:self-stretch">
          {poster ? (
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-700 to-indigo-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0c1222]" />
          <div className="absolute bottom-4 left-4 right-14 lg:hidden" aria-hidden="true">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300">
              Paradox 2026
            </p>
            <p className="mt-1 text-2xl font-black leading-tight text-white">
              {event.title}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
            <div className="hidden lg:block pr-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300">
                Paradox 2026
              </p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-white">
                {event.title}
              </h2>
            </div>
            {event.tagline && (
              <p className="mt-2 text-sm font-medium text-cyan-200/80 lg:mt-3">
                {event.tagline}
              </p>
            )}

            <dl className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <Calendar size={14} className="text-cyan-400" />
                  Date
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">{dateLabel}</dd>
              </div>
              {event.location && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
                  <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <MapPin size={14} className="text-cyan-400" />
                    Venue
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white">{event.location}</dd>
                </div>
              )}
              {event.teamSize && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
                  <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <Users size={14} className="text-cyan-400" />
                    Team size
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white">{event.teamSize}</dd>
                </div>
              )}
              {fees.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
                  <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <span className="text-cyan-400">₹</span>
                    Registration
                  </dt>
                  <dd className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-white">
                    {fees.map((fee) => (
                      <span key={fee.label}>
                        {fee.label} ₹{fee.value}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                About
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-200">
                {event.description}
              </p>
            </section>

            {event.rules?.length > 0 && (
              <section className="mt-6 pb-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Rules &amp; guidelines
                </h3>
                <ol className="mt-3 space-y-2.5">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex gap-3 text-[14px] leading-relaxed text-slate-200">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#0c1222] p-4 sm:px-7 sm:py-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRegisterClick?.(event.title);
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3.5 text-base font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.28)] hover:from-cyan-300 hover:to-blue-400"
            >
              Register now
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
