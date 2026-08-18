import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";
import RegistrationModal from "../components/RegistrationModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Events() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");

  const isAdmin = session?.user?.role === "admin";

  const fetchEvents = async () => {
    // Hardcoded events since backend fetch is disabled
    setEvents([
      {
        _id: "1",
        title: "Capture The Flag",
        description: "Join our exciting cybersecurity Capture The Flag competition. Test your skills in cryptography, web exploitation, and reverse engineering.",
        date: "2026-09-17T10:00:00Z",
        location: "Lab 3, CS Department",
        type: "hackathon"
      },
      {
        _id: "2",
        title: "Tech Auction",
        description: "A unique event where teams bid on tech stacks and build a project using only their acquired technologies.",
        date:"2026-09-18T10:00:00Z",
        location: "Main Auditorium",
        type: "Event"
      },
      {
        _id: "3",
        title: "AI Film Making",
        description: "Learn how to leverage generative AI tools to script, storyboard, and produce short films. Showcase your creativity!",
        date:"2026-09-18T10:00:00Z",
        location: "Seminar Hall",
        type: "Event"
      }
    ]);
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
    <div className="min-h-screen bg-[#0d1117] overflow-x-clip">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-20 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-28 pb-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-400 text-sm font-medium">
                  {upcomingEvents.length} upcoming
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Events
              </h1>
              <p className="text-gray-400 mt-3 text-lg max-w-lg">
                Workshops, hackathons, and meetups — join us and level up your
                skills.
              </p>
            </div>

            {/* Filter Tabs */}
            {eventTypes.length > 2 && (
              <div className="flex items-center gap-2 flex-wrap">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                      filter === type
                        ? "bg-gradient-to-r from-cyan-400 to-purple-600 text-white shadow-lg shadow-cyan-400/20"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
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
                <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  Upcoming Events
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                        setSelectedEventTitle(title);
                        setIsModalOpen(true);
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      className={`group relative bg-white/[0.03] backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
        isPast
          ? "border-white/5 opacity-60 hover:opacity-80"
          : "border-white/10 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer hover:-translate-y-1"
      }`}
    >
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
      ) : (
        <div
          className={`h-1 bg-gradient-to-r ${typeGradients[event.type] || typeGradients.other}`}
        ></div>
      )}

      <div className="p-6">
        {/* Date + Type row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${typeGradients[event.type] || typeGradients.other} rounded-xl flex flex-col items-center justify-center text-white shadow-lg`}
            >
              <span className="text-[10px] font-medium uppercase leading-none">
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                })}
              </span>
              <span className="text-lg font-bold leading-none">
                {new Date(event.date).getDate()}
              </span>
            </div>
            <span
              className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${typeColors[event.type] || typeColors.other}`}
            >
              {event.type}
            </span>
          </div>

          {/* Admin delete */}
          {isAdmin && (
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
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {event.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
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
                className="w-3.5 h-3.5"
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
