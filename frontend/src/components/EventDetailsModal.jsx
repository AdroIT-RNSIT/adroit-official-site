import React from "react";
import { X, MapPin, Calendar, CheckCircle2 } from "lucide-react";

export default function EventDetailsModal({ isOpen, onClose, event, onRegisterClick }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[#0d1117] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-900/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header styling matching the cards */}
        <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 via-[#0d1117] to-cyan-900/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] pr-8">
            {event.title}
          </h2>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Calendar size={16} className="text-cyan-400" />
              {formatDate(event.date)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <MapPin size={16} className="text-cyan-400" />
                {event.location}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              About The Event
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              {event.description}
            </p>
          </div>

          {event.rules && event.rules.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Rules & Guidelines
              </h3>
              <ul className="space-y-3">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300 text-base">
                    <CheckCircle2 size={20} className="text-cyan-500 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer with Register Button */}
        <div className="p-6 border-t border-white/10 bg-white/[0.02]">
          <button
            onClick={() => {
              onClose();
              onRegisterClick(event.title);
            }}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
