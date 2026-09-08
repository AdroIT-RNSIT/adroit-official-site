import React, { useEffect } from "react";
import { X, MapPin, Calendar, CheckCircle2 } from "lucide-react";

export default function EventDetailsModal({ isOpen, onClose, event, onRegisterClick }) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-text-primary/40" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-title"
        className="relative w-full sm:max-w-2xl bg-bg-surface border border-border-subtle sm:rounded-xl shadow-md overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90dvh]"
      >
        <div className="p-5 border-b border-border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 rounded-lg text-text-body hover:bg-bg-base"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <h2 id="event-details-title" className="text-2xl font-bold text-text-primary pr-12">
            {event.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-text-body">
            <span className="badge">
              <Calendar size={14} />
              {formatDate(event.date)}
            </span>
            {event.location && (
              <span className="badge">
                <MapPin size={14} />
                {event.location}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">
            About The Event
          </h3>
          <p className="text-text-body leading-relaxed mb-8">{event.description}</p>

          {event.rules && event.rules.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
                Rules &amp; Guidelines
              </h3>
              <ul className="space-y-3">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-text-body text-sm">
                    <CheckCircle2 size={18} className="text-accent-primary shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-border-subtle">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRegisterClick(event.title);
            }}
            className="btn btn-primary w-full"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
