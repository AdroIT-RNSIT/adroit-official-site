import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { stopLenis, startLenis } from '../lib/scroll';

const RegistrationModal = ({ isOpen, onClose, eventTitle }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSuccessData(null);
      setErrorMsg("");
      setIsSubmitting(false);
      stopLenis();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
        startLenis();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    const timer = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const getTeamConstraints = () => {
    const title = eventTitle || '';
    if (title.includes('CTF') || title.includes('Capture The Flag')) return { min: 3, max: 4 };
    if (title.includes('Tech Auction')) return { min: 3, max: 4 };
    if (title.includes('AI Film Making')) return { min: 1, max: 2 };
    return { min: 1, max: 4 };
  };

  const { min, max } = getTeamConstraints();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          collegeName: collegeName,
          email: i === 0 ? leaderEmail : "",
          teamName: teamName
        });
      }
    }

    try {
      const supabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseConfigured) {
        const { data, error } = await supabase
          .from('event_registrations')
          .insert({
            event_name: eventTitle,
            team_name: teamName,
            college_name: collegeName,
            leader_email: leaderEmail,
            ieee_membership_id: ieeeMembershipId,
            team_size: participants.length,
            participants: participants,
            submitted_at: new Date().toISOString()
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
            eventName: eventTitle,
            teamName,
            collegeName,
            leaderEmail,
            participants
          })
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

  return (
    <div className="modal-root">
      <div
        className={`modal-overlay ${entered ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        className={`modal-panel w-full sm:max-w-md bg-bg-surface border border-border-subtle sm:rounded-xl overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90dvh] ${entered ? "is-open" : ""}`}
      >
        <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
          <h2 id="register-title" className="text-lg font-bold text-text-primary pr-4">
            Register for <span className="text-accent-primary">{eventTitle}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-text-body hover:bg-bg-base"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1" data-lenis-prevent>
          {successData ? (
            <div className="text-center py-6">
              <h3 className="text-xl font-bold text-text-primary mb-2">Registration Successful!</h3>
              <p className="text-text-body text-sm mb-4">We've received your registration for {eventTitle}.</p>
              <div className="card p-4 inline-block mb-6">
                <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Your Registration ID</p>
                <p className="text-xl font-mono font-bold text-accent-primary">{successData.registrationId}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-3">If a new tab doesn't open automatically, click below:</p>
                <a
                  href="https://payments.billdesk.com/bdcollect/bd/rnsiotec/7312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Proceed to Payment
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="field-label">Team Name</label>
                <input type="text" name="teamName" required className="input-field" placeholder="e.g. Byte Bandits" />
              </div>
              <div>
                <label className="field-label">College Name</label>
                <input type="text" name="collegeName" required className="input-field" placeholder="e.g. RNS Institute of Technology" />
              </div>
              <div>
                <label className="field-label">Team Leader Email</label>
                <input type="email" name="leaderEmail" required className="input-field" placeholder="leader@example.com" />
              </div>
              <div>
                <label className="field-label">IEEE Membership ID (Optional)</label>
                <input type="text" name="ieeeMembershipId" maxLength={15} defaultValue="NA" className="input-field" placeholder="Max 15 digits or NA" />
              </div>

              <div className="pt-1">
                <h4 className="text-sm font-semibold text-accent-primary mb-3">
                  Team Members ({min}{min !== max ? `-${max}` : ''})
                </h4>
                <div className="space-y-3">
                  {Array.from({ length: max }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border-subtle space-y-3">
                      <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Participant {i + 1} {i === 0 ? '(Leader)' : ''} {i > (min - 1) ? '(Optional)' : '(Required)'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          name={`participant_${i}`}
                          required={i < min}
                          className="input-field"
                          placeholder="Full Name"
                        />
                        <input
                          type="text"
                          name={`participant_usn_${i}`}
                          required={i < min}
                          className="input-field"
                          placeholder="USN / ID"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                {isSubmitting ? "Registering..." : "Complete Registration"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
