import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";
import RegistrationModal from "../components/RegistrationModal";
import EventDetailsModal from "../components/EventDetailsModal";
import InteractiveRings from "../components/InteractiveRings";
import { sharedEvents } from "../data/events";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Events() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);

  const isAdmin = session?.user?.role === "admin";

  const fetchEvents = async () => {
    // Use shared events
    setEvents(sharedEvents);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  const typeColors = {
    workshop: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    seminar: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    hackathon: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    meetup: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    other: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  };

  const typeGradients = {
    workshop: "from-cyan-500 to-purple-600",
    seminar: "from-cyan-500 to-purple-600",
    hackathon: "from-cyan-500 to-purple-600",
    meetup: "from-cyan-500 to-purple-600",
    other: "from-cyan-500 to-purple-600",
  };

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

  const eventTypes = ["all", ...new Set(events.map((e) => e.type))];
  const filteredEvents =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  // All events shown in upcoming
  const upcomingEvents = filteredEvents;
  const pastEvents = [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3e8ff] flex items-center justify-center overflow-x-clip">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3e8ff] overflow-x-clip relative">
      
      {/* Background Helical Path of Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <InteractiveRings className="absolute -top-[10%] -left-[10%] w-[600px] opacity-60" />
        <InteractiveRings className="absolute top-[25%] left-[20%] w-[500px] opacity-40" />
        <InteractiveRings className="absolute top-[50%] left-[50%] w-[550px] opacity-50" />
        <InteractiveRings className="absolute top-[75%] left-[80%] w-[600px] opacity-40" />
        <InteractiveRings className="absolute top-[100%] left-[100%] w-[700px] opacity-60 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden py-20 z-10">

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center text-center gap-6">
            <div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(56,189,248,0.8)] filter py-2">
                Paradox 2026
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pb-20">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}


        {filteredEvents.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900/5 border border-slate-900/10 rounded-2xl mb-6">
              <svg
                className="w-10 h-10 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No events yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Stay tuned — upcoming workshops, hackathons and meetups will
              appear here.
            </p>
          </div>
        ) : (
          <div className="relative">

            {/* Prize Pool - absolutely positioned to the left, full height */}
            <div className="hidden xl:block absolute -left-72 top-0 w-64 h-full">
              <div className="h-full rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-100/60 via-sky-50/80 to-blue-100/60 backdrop-blur-sm overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center gap-3 shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white font-black text-xl tracking-wide uppercase">Prize Pool</span>
                </div>
                <div className="p-6 flex flex-col gap-6 flex-1">
                  {[
                    { name: "CTF", amount: 10000 },
                    { name: "Tech Auction", amount: 6000 },
                    { name: "AI Film Making", amount: 4000 },
                  ].map((prize, i) => (
                    <div key={i} className="flex flex-col gap-1 py-4 border-b border-cyan-500/20 last:border-0">
                      <span className="text-base font-semibold text-slate-700">{prize.name}</span>
                      <span className="text-xl font-black bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                        ₹{prize.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="mt-auto pt-4 border-t border-cyan-500/30 flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Prize Pool</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">₹20,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Sponsors - absolutely positioned to the right, full height */}
            <div className="hidden xl:block absolute -right-72 top-0 w-64 h-full">
              <div className="h-full rounded-2xl border border-purple-400/40 bg-gradient-to-br from-purple-100/60 via-violet-50/80 to-indigo-100/60 backdrop-blur-sm overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 flex items-center gap-3 shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-white font-black text-xl tracking-wide uppercase">Sponsors</span>
                </div>
                <div className="p-6 flex flex-col gap-8 flex-1">
                  {/* WhoVR */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-full h-24 rounded-xl flex items-center justify-center overflow-hidden">
                      <img
                        src="/whovr.png"
                        alt="WhoVR"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden flex-col items-center gap-1 text-purple-400/60">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold">Logo</span>
                      </div>
                    </div>
                    <span className="text-base font-bold text-slate-700">WHO VR</span>
                  </div>

                  {/* Nexploit */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-full h-24 rounded-xl flex items-center justify-center overflow-hidden">
                      <img
                        src="/nexploit.jpeg"
                        alt="Nexploit"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden flex-col items-center gap-1 text-purple-400/60">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold">Logo</span>
                      </div>
                    </div>
                    <span className="text-base font-bold text-slate-700">Nexploit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Inline Views */}
            <div className="xl:hidden mb-12 flex flex-col md:flex-row gap-6">
              {/* Prize Pool Mobile */}
              <div className="flex-1 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-100/60 via-sky-50/80 to-blue-100/60 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white font-black text-xl tracking-wide uppercase">Prize Pool</span>
                </div>
                <div className="p-6 flex flex-wrap gap-6">
                  {[
                    { name: "CTF", amount: 10000 },
                    { name: "Tech Auction", amount: 6000 },
                    { name: "AI Film Making", amount: 4000 },
                  ].map((prize, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-slate-700">{prize.name}</span>
                      <span className="text-xl font-black bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                        ₹{prize.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Sponsors Mobile */}
              <div className="flex-1 rounded-2xl border border-purple-400/40 bg-gradient-to-br from-purple-100/60 via-violet-50/80 to-indigo-100/60 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-white font-black text-xl tracking-wide uppercase">Event Sponsors</span>
                </div>
                <div className="p-6 flex gap-8 items-center justify-center h-[calc(100%-60px)]">
                  {/* WhoVR Mobile */}
                  <div className="flex flex-col items-center gap-2">
                    <img src="/whovr.png" alt="WHO VR" className="h-16 w-auto object-contain" />
                    <span className="text-sm font-bold text-slate-700">WHO VR</span>
                  </div>
                  {/* Nexploit Mobile */}
                  <div className="flex flex-col items-center gap-2">
                    <img src="/nexploit.jpeg" alt="Nexploit" className="h-16 w-auto object-contain" />
                    <span className="text-sm font-bold text-slate-700">Nexploit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notice Box Above Event Cards */}
            <div className="mb-8 p-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center gap-3 text-slate-800 text-center shadow-sm">
              <svg className="w-5 h-5 text-cyan-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-sm md:text-base">
                All participants must read the generic Rules and Guidelines at the bottom of this page
              </span>
            </div>

            {/* Events Grid - original centered layout */}
            <div className="space-y-12">
              {upcomingEvents.length > 0 && (
                <div>
                  <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <EventCard
                        key={event._id}
                        event={event}
                        typeColors={typeColors}
                        typeGradients={typeGradients}
                        formatDate={formatDate}
                        isAdmin={isAdmin}
                        onDelete={handleDelete}
                        onRegister={(title) => {
                          const clickedEvent = upcomingEvents.find(e => e.title === title);
                          setSelectedEventData(clickedEvent);
                          setIsDetailsModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {pastEvents.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    Past Events
                  </h2>
                  <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {pastEvents.map((event) => (
                      <EventCard
                        key={event._id}
                        event={event}
                        typeColors={typeColors}
                        typeGradients={typeGradients}
                        formatDate={formatDate}
                        isAdmin={isAdmin}
                        onDelete={handleDelete}
                        isPast
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Rules and Guidelines */}
        <div className="mt-20 bg-slate-900/[0.03] backdrop-blur-md border border-slate-900/10 rounded-3xl p-8 lg:p-12 text-slate-700">
          <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-6">
            Rules and Guidelines
          </h2>
          <p className="mb-6 text-lg text-slate-600">
            These guidelines apply across every Paradox 2026 event. Event-specific additions, where applicable, are listed under each event below.
          </p>
          <ol className="list-decimal list-inside space-y-3 text-base marker:text-cyan-500 marker:font-bold">
            <li>To avail the IEEE member discounted fee, at least one member of the team must hold a valid IEEE membership, and the registration must be made under that member's name and membership ID.</li>
            <li>Membership details will be verified. Any discrepancy found will lead to immediate invalidation of the registration, with no refund.</li>
            <li>Payment must be made only through the official payment gateway linked on this website.</li>
            <li>The payment amount must be entered manually at checkout - please double-check it against the fee applicable to your event/category before paying.</li>
            <li>If the amount entered does not match the actual fee applicable, the registration will be considered invalid and no refund will be initiated. Exceptions will be considered only in cases of a genuine, verifiable error.</li>
            <li>A registration is confirmed only after payment and membership details (where applicable) are verified. A confirmation email will follow within 48 hours - please retain your payment reference until then.</li>
            <li>All team member details (name, institution, email, phone, IEEE ID where applicable) must be accurate at the time of registration.</li>
            <li>Multiple/Duplicate registrations for the same team in the same event are not allowed and may lead to cancellation of all such entries.</li>
            <li>All participants must carry a valid college/institution ID card to the venue.</li>
            <li>The organising team reserves the right to modify these guidelines, event rules, schedules, or venues at any time; changes will be communicated through official channels.</li>
          </ol>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        eventTitle={selectedEventTitle} 
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEventData}
        onRegisterClick={(title) => {
          setSelectedEventTitle(title);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}

function EventCard({
  event,
  typeColors,
  typeGradients,
  formatDate,
  isAdmin,
  onDelete,
  onRegister,
  isPast = false,
}) {
  return (
    <div
      onClick={() => !isPast && onRegister && onRegister(event.title)}
      className={`group relative min-h-[420px] flex flex-col backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
        isPast
          ? "border-slate-900/5 bg-slate-900/[0.03] opacity-60 hover:opacity-80"
          : "border-cyan-500/40 bg-gradient-to-br from-cyan-100/60 via-sky-50/80 to-blue-100/60 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] cursor-pointer hover:-translate-y-2 hover:scale-105 z-10"
      }`}
    >
      {/* Animated glossy overlay for special card effect */}
      {!isPast && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none z-20"></div>
      )}
      {/* Event image or gradient top bar */}
      {event.imageUrl ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent"></div>
        </div>
      ) : null}

      <div className="p-6 flex-1 flex flex-col">
        {/* Top row (Admin delete only) */}
        {isAdmin && (
          <div className="flex items-center justify-end mb-4">
            {/* Admin delete */}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(event._id); }}
              className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all p-2 rounded-lg hover:bg-red-500/10"
              title="Delete event"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}

        <h3 className="text-xl font-black bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] group-hover:brightness-125 transition-all duration-300 mb-2">
          {event.title}
        </h3>

        {/* Date and Time */}
        {event.date && (
          <div className="flex items-center gap-2.5 text-base text-slate-600 font-bold mb-4">
            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>
        )}

        {/* Description - FULL DESCRIPTION VISIBLE */}
        {event.description && (
          <p className="text-slate-600 text-base leading-relaxed mb-4">
            {event.description}
          </p>
        )}

        {/* Registration Cost */}
        {!isPast && event.registrationCost && (
          <div className="mt-4 p-3 rounded-xl bg-white/40 border border-cyan-500/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Registration Cost</p>
            <div className="flex flex-wrap gap-3">
              {event.registrationCost.ieee !== undefined && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-cyan-700">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"></span>
                  IEEE: ₹{event.registrationCost.ieee}
                </span>
              )}
              {event.registrationCost.nonIeee !== undefined && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
                  Non-IEEE: ₹{event.registrationCost.nonIeee}
                </span>
              )}
              {event.registrationCost.all !== undefined && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                  All: ₹{event.registrationCost.all}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Register Button */}
      {!isPast && onRegister && (
        <div className="px-6 pb-6">
          <button
            onClick={(e) => { e.stopPropagation(); onRegister(event.title); }}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-300 text-sm tracking-wide"
          >
            View Details &amp; Register
          </button>
        </div>
      )}
    </div>
  );
}
