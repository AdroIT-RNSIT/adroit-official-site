import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("resources");

  // Users list
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Resource form
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    url: "",
    type: "other",
  });

  // Event form
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "other",
  });
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        credentials: "include",
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch {
      // Stats are non-critical
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        credentials: "include",
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch {
      // Non-critical
    } finally {
      setUsersLoading(false);
    }
  };

  const toggleApproval = async (userId, approved) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ approved }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) =>
          prev.map((u) =>
            u.id === updated.id ? { ...u, approved: updated.approved } : u,
          ),
        );
        showMessage(
          "success",
          `User ${approved ? "approved" : "rejected"} successfully`,
        );
      }
    } catch {
      showMessage("error", "Failed to update user");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  // ─── Resource CRUD ────────────────────────────────────────
  const handleCreateResource = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(resourceForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create resource");
      }
      setResourceForm({ title: "", description: "", url: "", type: "other" });
      showMessage("success", "Resource created successfully!");
      fetchStats();
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Event CRUD ───────────────────────────────────────────
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", eventForm.title);
      formData.append("description", eventForm.description);
      formData.append("date", eventForm.date);
      formData.append("location", eventForm.location);
      formData.append("type", eventForm.type);
      if (eventImage) {
        formData.append("image", eventImage);
      }

      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create event");
      }
      setEventForm({
        title: "",
        description: "",
        date: "",
        location: "",
        type: "other",
      });
      setEventImage(null);
      setImagePreview(null);
      showMessage("success", "Event created successfully!");
      fetchStats();
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage("error", "Image must be smaller than 5 MB");
        return;
      }
      setEventImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setEventImage(null);
    setImagePreview(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome,{" "}
          <span className="font-medium text-gray-300">
            {session?.user?.name}
          </span>
          . Manage resources and events.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Members"
            value={stats.membersCount}
            gradient="from-blue-500 to-cyan-500"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Resources"
            value={stats.resourcesCount}
            gradient="from-indigo-500 to-purple-500"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
          />
          <StatCard
            title="Events"
            value={stats.eventsCount}
            gradient="from-purple-500 to-pink-500"
            icon={
              <svg
                className="w-6 h-6"
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
            }
          />
        </div>
      )}

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <TabButton
          active={activeTab === "resources"}
          onClick={() => setActiveTab("resources")}
        >
          Add Resource
        </TabButton>
        <TabButton
          active={activeTab === "events"}
          onClick={() => setActiveTab("events")}
        >
          Add Event
        </TabButton>
        <TabButton
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </TabButton>
      </div>

      {/* Forms */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        {activeTab === "resources" ? (
          <form onSubmit={handleCreateResource} className="space-y-5">
            <h2 className="text-xl font-bold text-white mb-4">
              Create Resource
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  required
                  value={resourceForm.title}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                  placeholder="React Fundamentals"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={resourceForm.type}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                >
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="link">Link</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={resourceForm.description}
                onChange={(e) =>
                  setResourceForm({
                    ...resourceForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                placeholder="A comprehensive guide to React..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL
              </label>
              <input
                type="url"
                value={resourceForm.url}
                onChange={(e) =>
                  setResourceForm({ ...resourceForm, url: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                placeholder="https://example.com/resource"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Resource"}
            </button>
          </form>
        ) : activeTab === "events" ? (
          <form onSubmit={handleCreateEvent} className="space-y-5">
            <h2 className="text-xl font-bold text-white mb-4">Create Event</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  required
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                  placeholder="React Workshop"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={eventForm.type}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="meetup">Meetup</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                placeholder="Join us for a hands-on workshop..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date & Time *
                </label>
                <input
                  required
                  type="datetime-local"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                  placeholder="Room 201, CS Building"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Event Image
              </label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-xs h-40 object-cover rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                    title="Remove image"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-cyan-500/40 hover:bg-white/[0.02] transition-all">
                  <svg
                    className="w-8 h-8 text-gray-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-400">
                    Click to upload an image
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, WebP, GIF — max 5 MB
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Event"}
            </button>
          </form>
        ) : activeTab === "users" ? (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Manage Users</h2>
            <p className="text-sm text-gray-400 mb-6">
              Approve or reject users who signed in via Google. Only approved
              users can access protected pages.
            </p>

            {usersLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No users found.</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {user.role === "admin" ? (
                        <span className="inline-flex px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          Admin
                        </span>
                      ) : user.approved ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex px-3 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            Approved
                          </span>
                          <button
                            onClick={() => toggleApproval(user.id, false)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            Revoke
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Pending
                          </span>
                          <button
                            onClick={() => toggleApproval(user.id, true)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:shadow-md transition-all"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({ title, value, gradient, icon }) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 border border-white/10">
      <div className="flex items-center gap-3">
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-cyan-400 to-purple-600 text-white shadow-lg shadow-cyan-400/20"
          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
