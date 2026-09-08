import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Calendar, MapPin, Users, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const inputClass =
  "h-11 w-full rounded-lg border border-white/[0.08] bg-[#0b101c] px-3 text-[16px] text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-[#0e1628]";

function teamLimits(event) {
  const slug = event?.slug || "";
  const title = event?.title || "";
  if (slug === "ai-film-making" || title.includes("AI Film Making")) return { min: 1, max: 2 };
  if (slug === "tech-auction" || title.includes("Tech Auction")) return { min: 3, max: 4 };
  if (slug === "capture-the-flag" || title.includes("CTF") || title.includes("Capture The Flag")) {
    return { min: 3, max: 4 };
  }
  return { min: 1, max: 4 };
}

function feeLine(cost) {
  if (!cost) return null;
  if (cost.all != null) return `₹${cost.all} per team`;
  const parts = [];
  if (cost.ieee != null) parts.push(`IEEE ₹${cost.ieee}`);
  if (cost.nonIeee != null) parts.push(`Non-IEEE ₹${cost.nonIeee}`);
  return parts.join("  ·  ");
}

export default function RegistrationModal({ isOpen, onClose, event, eventTitle }) {
  const formRef = useRef(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const title = event?.title || eventTitle || "Event";
  const poster = event?.poster || event?.imageUrl;
  const { min, max } = teamLimits(event || { title });
  const fees = feeLine(event?.registrationCost);
  const dateLabel = event?.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  useEffect(() => {
    if (!isOpen) return undefined;

    setStep(1);
    setSuccessData(null);
    setErrorMsg("");
    setIsSubmitting(false);

    const scrollY = window.scrollY;
    document.documentElement.classList.add("reg-scroll-lock");
    document.body.classList.add("reg-scroll-lock");
    document.body.style.top = `-${scrollY}px`;

    const prevent = (e) => {
      if (e.target.closest("[data-registration-scroll]")) return;
      e.preventDefault();
    };
    document.addEventListener("touchmove", prevent, { passive: false });
    document.addEventListener("wheel", prevent, { passive: false });

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.classList.remove("reg-scroll-lock");
      document.body.classList.remove("reg-scroll-lock");
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
      document.removeEventListener("touchmove", prevent);
      document.removeEventListener("wheel", prevent);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const goNext = () => {
    const form = formRef.current;
    if (!form) return;
    for (const name of ["teamName", "collegeName", "leaderEmail"]) {
      const field = form.elements.namedItem(name);
      if (field && !field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2) {
      goNext();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.target);
    const teamName = formData.get("teamName")?.toString().trim() || "";
    const collegeName = formData.get("collegeName")?.toString().trim() || "";
    const leaderEmail = formData.get("leaderEmail")?.toString().trim() || "";
    const ieeeMembershipId = formData.get("ieeeMembershipId")?.toString().trim() || "NA";
    const participants = [];

    for (let i = 0; i < max; i++) {
      const pName = formData.get(`participant_${i}`);
      const pUSN = formData.get(`participant_usn_${i}`);
      if (pName && pName.toString().trim() !== "") {
        participants.push({
          participantNumber: i + 1,
          name: pName.toString().trim(),
          studentId: pUSN ? pUSN.toString().trim() : "",
          collegeName,
          email: i === 0 ? leaderEmail : "",
          teamName,
        });
      }
    }

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("event_registrations")
          .insert({
            event_name: title,
            team_name: teamName,
            college_name: collegeName,
            leader_email: leaderEmail,
            ieee_membership_id: ieeeMembershipId,
            team_size: participants.length,
            participants,
            submitted_at: new Date().toISOString(),
          })
          .select();

        if (error) {
          throw new Error(error.message || "Failed to save registration to database");
        }
        setSuccessData({ registrationId: data[0]?.id || "ADR-SUCCESS" });
      } else {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: title,
            teamName,
            collegeName,
            leaderEmail,
            participants,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Registration failed");
        setSuccessData(data);
      }

      setTimeout(() => {
        window.open("https://payments.billdesk.com/bdcollect/bd/rnsiotec/7312", "_blank");
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while registering.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Register for ${title}`}
        data-registration-sheet="true"
        className="relative flex h-[100dvh] w-full max-w-4xl overflow-hidden bg-[#0b0f19] text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:h-auto sm:max-h-[min(44rem,88dvh)] sm:rounded-2xl sm:border sm:border-white/10 lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]"
      >
        <aside className="relative hidden shrink-0 overflow-hidden lg:block">
          {poster && (
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-black/20" />
          <div className="relative flex h-full flex-col justify-end p-6">
            <p className="text-xs text-cyan-200/80">Paradox 2026</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            {event?.tagline && (
              <p className="mt-2 text-sm text-slate-300">{event.tagline}</p>
            )}
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              {dateLabel && (
                <li className="flex items-center gap-2">
                  <Calendar size={14} className="text-cyan-300" />
                  {dateLabel}
                </li>
              )}
              {event?.location && (
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-cyan-300" />
                  {event.location}
                </li>
              )}
              {event?.teamSize && (
                <li className="flex items-center gap-2">
                  <Users size={14} className="text-cyan-300" />
                  {event.teamSize}
                </li>
              )}
            </ul>
            {fees && <p className="mt-6 text-sm font-medium text-white">{fees}</p>}
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#0b0f19]">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-6">
            <div className="min-w-0 lg:hidden">
              <p className="text-xs text-slate-400">Register</p>
              <p className="truncate text-base font-semibold text-white">{title}</p>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-slate-400">
                {successData ? "Confirmed" : `Step ${step} of 2`}
              </p>
              <p className="text-base font-semibold text-white">
                {successData ? "You're in" : step === 1 ? "Team details" : "Team members"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {successData ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <p className="text-sm text-slate-400">Registration ID</p>
              <p className="mt-2 font-mono text-2xl text-white">{successData.registrationId}</p>
              <p className="mt-4 max-w-sm text-sm text-slate-400">
                We’ve saved your team for {title}. Continue to BillDesk to finish payment.
              </p>
              <a
                href="https://payments.billdesk.com/bdcollect/bd/rnsiotec/7312"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-11 items-center rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Proceed to payment
              </a>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div
                data-registration-scroll="true"
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
              >
                {errorMsg && (
                  <p className="mb-4 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {errorMsg}
                  </p>
                )}

                <div className={step === 1 ? "space-y-4" : "hidden"}>
                  <Field label="Team name">
                    <input type="text" name="teamName" required className={inputClass} placeholder="Byte Bandits" />
                  </Field>
                  <Field label="College">
                    <input
                      type="text"
                      name="collegeName"
                      required
                      className={inputClass}
                      placeholder="RNS Institute of Technology"
                    />
                  </Field>
                  <Field label="Team leader email">
                    <input
                      type="email"
                      name="leaderEmail"
                      required
                      className={inputClass}
                      placeholder="leader@college.edu"
                    />
                  </Field>
                  <Field label="IEEE membership ID" optional>
                    <input
                      type="text"
                      name="ieeeMembershipId"
                      maxLength={15}
                      className={inputClass}
                      placeholder="Leave blank if not a member"
                    />
                  </Field>
                </div>

                <div className={step === 2 ? "space-y-3" : "hidden"}>
                  <p className="text-sm text-slate-400">
                    Add {min}
                    {min !== max ? `–${max}` : ""} members. Name and USN for each.
                  </p>
                  {Array.from({ length: max }).map((_, i) => {
                    const optional = i >= min;
                    return (
                      <div key={i} className="grid grid-cols-[2rem_1fr] items-start gap-3">
                        <span className="mt-2 text-sm tabular-nums text-slate-500">{i + 1}</span>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            name={`participant_${i}`}
                            required={step === 2 && !optional}
                            className={inputClass}
                            placeholder={i === 0 ? "Leader full name" : "Full name"}
                          />
                          <input
                            type="text"
                            name={`participant_usn_${i}`}
                            required={step === 2 && !optional}
                            className={inputClass}
                            placeholder="USN"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 border-t border-white/[0.06] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                )}
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="ml-auto h-11 min-w-[9rem] rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto h-11 min-w-[9rem] rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving…" : "Confirm & pay"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function Field({ label, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-sm text-slate-400">
        {label}
        {optional && <span className="text-xs text-slate-600">optional</span>}
      </span>
      {children}
    </label>
  );
}
