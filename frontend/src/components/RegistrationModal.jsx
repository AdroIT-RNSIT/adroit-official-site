import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const RegistrationModal = ({ isOpen, onClose, eventTitle }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Reset state every time modal opens fresh
  useEffect(() => {
    if (isOpen) {
      setSuccessData(null);
      setErrorMsg("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Determine team size constraints based on event
  const getTeamConstraints = () => {
    const title = eventTitle || '';
    if (title.includes('CTF') || title.includes('Capture The Flag')) return { min: 3, max: 4 };
    if (title.includes('Tech Auction')) return { min: 3, max: 4 };
    if (title.includes('AI Film Making')) return { min: 3, max: 3 };
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
      // Check if Supabase credentials are set
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
        // Fallback to FastAPI backend if Supabase env is not configured yet
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

      // Show success message briefly, then open BillDesk
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-white/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-[#f3e8ff] border border-slate-900/10 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-900/10 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-xl font-bold text-slate-900">
            Register for <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{eventTitle}</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {successData ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Registration Successful!</h3>
              <p className="text-slate-600 text-sm mb-4">We've received your registration for {eventTitle}.</p>
              <div className="bg-slate-900/5 border border-slate-900/10 rounded-xl p-4 inline-block mb-6">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Your Registration ID</p>
                <p className="text-2xl font-mono font-bold text-cyan-400">{successData.registrationId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-3">If a new tab doesn't open automatically, click below:</p>
                <a 
                  href="https://payments.billdesk.com/bdcollect/bd/rnsiotec/7312" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                >
                  Proceed to Payment
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70dvh] overflow-y-auto pr-2 custom-scrollbar">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Team Name</label>
                <input 
                  type="text" 
                  name="teamName"
                  required
                  className="w-full bg-slate-900/5 border border-slate-900/10 rounded-xl px-4 py-2.5 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="e.g. Byte Bandits"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">College Name</label>
                <input 
                  type="text" 
                  name="collegeName"
                  required
                  className="w-full bg-slate-900/5 border border-slate-900/10 rounded-xl px-4 py-2.5 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="e.g. RNS Institute of Technology"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Team Leader Email</label>
                <input 
                  type="email" 
                  name="leaderEmail"
                  required
                  className="w-full bg-slate-900/5 border border-slate-900/10 rounded-xl px-4 py-2.5 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="leader@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">IEEE Membership ID (Optional)</label>
                <input 
                  type="text" 
                  name="ieeeMembershipId"
                  maxLength={15}
                  defaultValue="NA"
                  className="w-full bg-slate-900/5 border border-slate-900/10 rounded-xl px-4 py-2.5 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="Max 15 digits or NA"
                />
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-semibold text-cyan-400 mb-3">Team Members ({min}{min !== max ? `-${max}` : ''})</h4>
                <div className="space-y-4">
                  {Array.from({ length: max }).map((_, i) => (
                    <div key={i} className="p-3 bg-white/[0.02] border border-slate-900/5 rounded-xl space-y-3">
                      <h5 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Participant {i + 1} {i === 0 ? '(Leader)' : ''} {i > (min - 1) ? '(Optional)' : '(Required)'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          name={`participant_${i}`}
                          required={i < min}
                          className="w-full bg-slate-900/5 border border-slate-900/10 rounded-lg px-3 py-2 text-slate-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm"
                          placeholder="Full Name"
                        />
                        <input 
                          type="text" 
                          name={`participant_usn_${i}`}
                          required={i < min}
                          className="w-full bg-slate-900/5 border border-slate-900/10 rounded-lg px-3 py-2 text-slate-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm"
                          placeholder="USN / ID"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Registering...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
