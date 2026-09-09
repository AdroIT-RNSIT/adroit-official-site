import React, { useEffect, useState } from "react";
import { X, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { stopLenis, startLenis } from "../lib/scroll";

export default function EventDetailsModal({ isOpen, onClose, event, onRegisterClick }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stopLenis();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const timer = setTimeout(() => setEntered(true), 10);
    return () => {
      document.body.style.overflow = prev;
      startLenis();
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
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
    <div className="modal-root modal-root--details">
      <div
        className={`modal-overlay ${entered ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-title"
        className={`modal-panel w-full sm:max-w-2xl bg-bg-surface border border-border-subtle sm:rounded-xl shadow-md overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90dvh] ${entered ? "is-open" : ""}`}
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

        <div className="p-5 overflow-y-auto flex-1" data-lenis-prevent>
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
