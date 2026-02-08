import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Events() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = session?.user?.role === "admin";

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
    workshop: "bg-orange-100 text-orange-700",
    seminar: "bg-blue-100 text-blue-700",
    hackathon: "bg-purple-100 text-purple-700",
    meetup: "bg-green-100 text-green-700",
    other: "bg-gray-100 text-gray-700",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">
            Upcoming workshops, hackathons, and meetups
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No events yet</h3>
          <p className="text-gray-500 mt-1">
            Events created by the admin will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Date badge */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                  <span className="text-xs font-medium uppercase">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-xl font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium ${typeColors[event.type] || typeColors.other}`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
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
                      <span className="flex items-center gap-1">
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

                {/* Admin delete */}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-2 flex-shrink-0"
                    title="Delete event"
                  >
                    <svg
                      className="w-5 h-5"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
