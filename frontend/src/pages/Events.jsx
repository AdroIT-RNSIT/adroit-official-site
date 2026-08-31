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
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center overflow-x-clip">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] overflow-x-clip relative">
      
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
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] filter py-2">
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-2xl mb-6">
              <svg
                className="w-10 h-10 text-gray-500"
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
            <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Stay tuned — upcoming workshops, hackathons and meetups will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Upcoming Events */}
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
                        // Find the full event object
                        const clickedEvent = upcomingEvents.find(e => e.title === title);
                        setSelectedEventData(clickedEvent);
                        setIsDetailsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2">
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
        )}
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
          ? "border-white/5 bg-white/[0.03] opacity-60 hover:opacity-80"
          : "border-cyan-500/30 bg-gradient-to-br from-blue-500/20 via-[#0d1117] to-cyan-900/20 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] cursor-pointer hover:-translate-y-2 hover:scale-105 z-10"
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
              onClick={() => onDelete(event._id)}
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

        {/* Title */}
        <h3 className="text-xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] group-hover:brightness-125 transition-all duration-300 mb-2">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-gray-400 text-base leading-relaxed mb-4">
            {event.description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex flex-wrap items-center gap-3 text-base text-gray-500 pt-4">
          <span className="flex items-center gap-1.5">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatDate(event.date)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {event.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
