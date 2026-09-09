import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";
import RegistrationModal from "../components/RegistrationModal";
import EventDetailsModal from "../components/EventDetailsModal";
import { sharedEvents } from "../data/events";
import Reveal from "../components/Reveal";
import RevealGroup from "../components/RevealGroup";

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
    workshop: "badge-accent",
    seminar: "badge-accent",
    hackathon: "badge-accent",
    meetup: "badge-accent",
    other: "badge-accent",
  };

  const typeGradients = {
    workshop: "from-accent-primary to-accent-primary-hover",
    seminar: "from-accent-primary to-accent-primary-hover",
    hackathon: "from-accent-primary to-accent-primary-hover",
    meetup: "from-accent-primary to-accent-primary-hover",
    other: "from-accent-primary to-accent-primary-hover",
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

  const upcomingEvents = filteredEvents;
  const pastEvents = [];

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-border-subtle border-t-accent-primary rounded-full animate-spin" />
          <p className="text-text-body font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base overflow-x-clip">
      <div className="page-wrap py-10 sm:py-14">
        <Reveal>
          <p className="section-kicker">Paradox 2026</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary mb-4">
            Paradox 2026
          </h1>
          <div className="brand-event mb-8">
            <img
              src="/ieee_logo.png"
              alt="IEEE RNSIT Student Branch"
              width={208}
              height={32}
              className="brand-mark brand-event-ieee"
            />
          </div>
        </Reveal>

        {error && (
          <div className="mb-6 p-4 card text-sm text-red-700 flex items-center gap-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle bg-accent-primary-tint">
              <p className="font-semibold text-accent-primary">Prize Pool</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: "CTF", amount: 10000 },
                { name: "Tech Auction", amount: 6000 },
                { name: "AI Film Making", amount: 4000 },
              ].map((prize) => (
                <div key={prize.name} className="flex justify-between gap-3 text-sm">
                  <span className="text-text-body min-w-0">{prize.name}</span>
                  <span className="font-semibold text-text-primary shrink-0 tabular-nums">
                    ₹{prize.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-border-subtle flex justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Total Prize Pool
                </span>
                <span className="font-bold text-accent-primary">₹20,000</span>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle">
              <p className="font-semibold text-text-primary">Sponsors</p>
            </div>
            <div className="p-5 flex flex-wrap gap-6 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <img
                  src="/whovr.png"
                  alt="WHO VR"
                  width={120}
                  height={64}
                  className="h-14 w-auto max-w-[9rem] object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden text-xs text-text-muted">Logo</div>
                <span className="text-sm font-semibold text-text-primary">WHO VR</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img
                  src="/nexploit.jpeg"
                  alt="Nexploit"
                  width={120}
                  height={64}
                  className="h-14 w-auto max-w-[9rem] object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden text-xs text-text-muted">Logo</div>
                <span className="text-sm font-semibold text-text-primary">Nexploit</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 p-4 card text-sm text-text-body">
          All participants must read the generic Rules and Guidelines at the bottom of this page
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-text-primary mb-2">No events yet</h3>
            <p className="text-text-muted max-w-sm mx-auto">
              Stay tuned — upcoming workshops, hackathons and meetups will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {upcomingEvents.length > 0 && (
              <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event, index) => (
                  <div key={event._id} className="reveal-item h-full" style={{ "--index": index }}>
                    <EventCard
                      event={event}
                      typeColors={typeColors}
                      typeGradients={typeGradients}
                      formatDate={formatDate}
                      isAdmin={isAdmin}
                      onDelete={handleDelete}
                      onRegister={(title) => {
                        const clickedEvent = upcomingEvents.find((e) => e.title === title);
                        setSelectedEventData(clickedEvent);
                        setIsDetailsModalOpen(true);
                      }}
                    />
                  </div>
                ))}
              </RevealGroup>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-6">
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

        <div className="mt-16 card p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Rules and Guidelines</h2>
          <p className="mb-6 text-text-body">
            These guidelines apply across every Paradox 2026 event. Event-specific additions, where applicable, are listed under each event below.
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm sm:text-base text-text-body marker:text-accent-primary marker:font-bold">
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

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventTitle={selectedEventTitle}
      />

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
      className={`card event-card flex flex-col overflow-hidden h-full ${
        isPast ? "opacity-60" : "card-hover cursor-pointer"
      }`}
    >
      {event.imageUrl ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="p-5 flex-1 flex flex-col">
        {isAdmin && (
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event._id);
              }}
              className="btn btn-danger min-h-11 px-3 text-sm"
              title="Delete event"
            >
              Delete
            </button>
          </div>
        )}

        <h3 className="text-xl font-semibold text-text-primary mb-2">{event.title}</h3>

        {event.date && (
          <p className="text-sm font-medium text-text-body mb-3">{formatDate(event.date)}</p>
        )}

        {event.description && (
          <p className="text-sm text-text-body leading-relaxed mb-4">{event.description}</p>
        )}

        {!isPast && event.registrationCost && (
          <div className="mt-auto p-3 rounded-lg bg-bg-base border border-border-subtle">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Registration Cost
            </p>
            <div className="flex flex-wrap gap-3">
              {event.registrationCost.ieee !== undefined && (
                <span className="text-sm font-semibold text-text-primary">
                  IEEE: ₹{event.registrationCost.ieee}
                </span>
              )}
              {event.registrationCost.nonIeee !== undefined && (
                <span className="text-sm font-semibold text-text-primary">
                  Non-IEEE: ₹{event.registrationCost.nonIeee}
                </span>
              )}
              {event.registrationCost.all !== undefined && (
                <span className="text-sm font-semibold text-text-primary">
                  All: ₹{event.registrationCost.all}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {!isPast && onRegister && (
        <div className="px-5 pb-5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegister(event.title);
            }}
            className="btn btn-primary w-full"
          >
            View Details &amp; Register
          </button>
        </div>
      )}
    </div>
  );
}
