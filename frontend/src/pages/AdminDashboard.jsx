import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CLOUDINARY_CLOUD_NAME = "adroit"; // Change this to your cloud name
const CLOUDINARY_UPLOAD_PRESET = "adroit_members"; // Create this in Cloudinary dashboard

export default function AdminDashboard({ initialTab = "resources" }) {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);

  // ===== USERS LIST =====
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ===== MEMBERS LIST =====
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // ===== RESOURCE FORM =====
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    url: "",
    type: "article",
    domain: "ml",
    difficulty: "beginner",
    tags: ""
  });

  // ===== EVENT FORM =====
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "workshop",
  });
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ===== MEMBER FORM =====
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    domain: "ml",
    role: "Member",
    year: "1st",
    department: "CSE",
    linkedin: "",
    github: "",
    bio: ""
  });
  const [memberImage, setMemberImage] = useState(null);
  const [memberImagePreview, setMemberImagePreview] = useState(null);
  const [memberImagePublicId, setMemberImagePublicId] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // ===== UI STATE =====
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  // ===== FETCH ALL DATA =====
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchMembers();
  }, []);

  // ===== FETCH STATS =====
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

  // ===== FETCH USERS =====
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

  // ===== FETCH MEMBERS =====
  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/members`, {
        credentials: "include",
      });
      if (res.ok) {
        setMembers(await res.json());
      }
    } catch {
      // Non-critical
    } finally {
      setMembersLoading(false);
    }
  };

  // ===== TOGGLE USER APPROVAL =====
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

  // ===== SHOW MESSAGE =====
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  // ===== CLOUDINARY IMAGE UPLOAD =====
  const handleMemberImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image must be smaller than 5MB');
      return;
    }

    // Preview
    setMemberImagePreview(URL.createObjectURL(file));
    setMemberImage(file);
    
    // Upload to Cloudinary
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await res.json();
      setMemberImagePublicId(data.public_id);
      showMessage('success', 'Image uploaded successfully!');
    } catch (error) {
      showMessage('error', 'Failed to upload image');
      console.error('Cloudinary upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeMemberImage = () => {
    setMemberImage(null);
    setMemberImagePreview(null);
    setMemberImagePublicId("");
  };

  // ===== CREATE RESOURCE =====
  const handleCreateResource = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Convert tags string to array
      const tagsArray = resourceForm.tags
        ? resourceForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const resourceData = {
        ...resourceForm,
        tags: tagsArray
      };

      const res = await fetch(`${API_URL}/api/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(resourceData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create resource");
      }
      setResourceForm({ 
        title: "", 
        description: "", 
        url: "", 
        type: "article", 
        domain: "ml", 
        difficulty: "beginner", 
        tags: "" 
      });
      showMessage("success", "Resource created successfully!");
      fetchStats();
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ===== CREATE EVENT =====
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
        type: "workshop",
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

  // ===== CREATE MEMBER =====
  const handleCreateMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const memberData = {
        ...memberForm,
        imagePublicId: memberImagePublicId || null
      };

      const res = await fetch(`${API_URL}/api/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(memberData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create member");
      }

      const newMember = await res.json();

      // Reset form
      setMemberForm({
        name: "",
        email: "",
        domain: "ml",
        role: "Member",
        year: "1st",
        department: "CSE",
        linkedin: "",
        github: "",
        bio: ""
      });
      setMemberImage(null);
      setMemberImagePreview(null);
      setMemberImagePublicId("");

      showMessage("success", "Member added successfully!");
      fetchMembers(); // Refresh the list
      fetchStats(); // Update stats
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ===== DELETE MEMBER =====
  const handleDeleteMember = async (id) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`${API_URL}/api/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        showMessage("success", "Member removed successfully");
        fetchMembers(); // Refresh the list
        fetchStats(); // Update stats
      }
    } catch (err) {
      showMessage("error", "Failed to delete member");
    }
  };

  // ===== DELETE RESOURCE =====
  const handleDeleteResource = async (id) => {
    if (!confirm("Delete this resource?")) return;
    try {
      const res = await fetch(`${API_URL}/api/resources/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        showMessage("success", "Resource deleted successfully");
        fetchStats();
      }
    } catch {
      showMessage("error", "Failed to delete resource");
    }
  };

  // ===== DELETE EVENT =====
  const handleDeleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        showMessage("success", "Event deleted successfully");
        fetchStats();
      }
    } catch {
      showMessage("error", "Failed to delete event");
    }
  };

  // ===== EVENT IMAGE HANDLER =====
  const handleEventImageChange = (e) => {
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

  const removeEventImage = () => {
    setEventImage(null);
    setImagePreview(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* ===== HEADER ===== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome,{" "}
          <span className="font-medium text-gray-300">
            {session?.user?.name}
          </span>
          . Manage resources, events, users, and members.
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Members"
            value={stats.membersCount || 0}
            gradient="from-blue-500 to-cyan-500"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Resources"
            value={stats.resourcesCount || 0}
            gradient="from-indigo-500 to-purple-500"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard
            title="Events"
            value={stats.eventsCount || 0}
            gradient="from-purple-500 to-pink-500"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Users"
            value={stats.usersCount || 0}
            gradient="from-pink-500 to-rose-500"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* ===== MESSAGE ===== */}
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

      {/* ===== TAB NAVIGATION ===== */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
        <TabButton
          active={activeTab === "resources"}
          onClick={() => setActiveTab("resources")}
        >
          📚 Resources
        </TabButton>
        <TabButton
          active={activeTab === "events"}
          onClick={() => setActiveTab("events")}
        >
          📅 Events
        </TabButton>
        <TabButton
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </TabButton>
        <TabButton
          active={activeTab === "members"}
          onClick={() => setActiveTab("members")}
        >
          🧑‍💻 Members
        </TabButton>
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        
        {/* ===== TAB 1: RESOURCES ===== */}
        {activeTab === "resources" && (
          <form onSubmit={handleCreateResource} className="space-y-5">
            <h2 className="text-xl font-bold text-white mb-4">
              Create New Resource
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                  <option value="article">📝 Article</option>
                  <option value="video">🎬 Video</option>
                  <option value="course">🎓 Course</option>
                  <option value="book">📚 Book</option>
                  <option value="documentation">📄 Documentation</option>
                  <option value="tool">🛠️ Tool</option>
                  <option value="paper">📑 Research Paper</option>
                  <option value="cheatSheet">📋 Cheat Sheet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Domain
                </label>
                <select
                  value={resourceForm.domain}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, domain: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                >
                  <option value="ml">🤖 Machine Learning</option>
                  <option value="cc">☁️ Cloud Computing</option>
                  <option value="cy">🔒 Cybersecurity</option>
                  <option value="da">📊 Data Analytics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={resourceForm.difficulty}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, difficulty: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                >
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🔴 Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                value={resourceForm.tags}
                onChange={(e) =>
                  setResourceForm({ ...resourceForm, tags: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                placeholder="react, javascript, frontend"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Resource"}
            </button>
          </form>
        )}

        {/* ===== TAB 2: EVENTS ===== */}
        {activeTab === "events" && (
          <form onSubmit={handleCreateEvent} className="space-y-5">
            <h2 className="text-xl font-bold text-white mb-4">Create New Event</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <option value="workshop">🛠️ Workshop</option>
                  <option value="seminar">🎤 Seminar</option>
                  <option value="hackathon">💻 Hackathon</option>
                  <option value="meetup">🤝 Meetup</option>
                  <option value="other">📌 Other</option>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            {/* Event Image Upload */}
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
                    onClick={removeEventImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-cyan-500/40 hover:bg-white/[0.02] transition-all">
                  <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-400">Click to upload an image</span>
                  <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP — max 5 MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleEventImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Event"}
            </button>
          </form>
        )}

        {/* ===== TAB 3: USERS ===== */}
        {activeTab === "users" && (
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
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm hover:shadow-md transition-all"
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
        )}

        {/* ===== TAB 4: MEMBERS ===== */}
        {activeTab === "members" && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-white mb-4">Member Management</h2>
            
            {/* ===== ADD MEMBER FORM ===== */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add New Member
              </h3>
              
              <form onSubmit={handleCreateMember} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.name}
                        onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={memberForm.email}
                        onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                        placeholder="john@adroit.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Domain *
                      </label>
                      <select
                        required
                        value={memberForm.domain}
                        onChange={(e) => setMemberForm({...memberForm, domain: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      >
                        <option value="ml">🤖 Machine Learning</option>
                        <option value="cc">☁️ Cloud Computing</option>
                        <option value="cy">🔒 Cybersecurity</option>
                        <option value="da">📊 Data Analytics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Role *
                      </label>
                      <select
                        required
                        value={memberForm.role}
                        onChange={(e) => setMemberForm({...memberForm, role: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      >
                        <option value="President">👑 President</option>
                        <option value="Vice President">👑 Vice President</option>
                        <option value="General Secretary">📋 General Secretary</option>
                        <option value="Domain Lead">🎯 Domain Lead</option>
                        <option value="Core Member">⭐ Core Member</option>
                        <option value="Member">👥 Member</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Year
                      </label>
                      <select
                        value={memberForm.year}
                        onChange={(e) => setMemberForm({...memberForm, year: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      >
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                        <option value="PhD">PhD</option>
                        <option value="Alumni">Alumni</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    
                    {/* Profile Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Profile Photo
                      </label>
                      {memberImagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={memberImagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-xl border border-white/10"
                          />
                          <button
                            type="button"
                            onClick={removeMemberImage}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-cyan-500/40 hover:bg-white/[0.02] transition-all">
                          <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-400">Click to upload photo</span>
                          <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP — max 5 MB</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleMemberImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                      )}
                      {uploadingImage && (
                        <p className="text-xs text-cyan-400 mt-2 flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
                          Uploading to Cloudinary...
                        </p>
                      )}
                      {memberImagePublicId && (
                        <p className="text-xs text-green-400 mt-2">
                          ✓ Uploaded: {memberImagePublicId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={memberForm.department}
                        onChange={(e) => setMemberForm({...memberForm, department: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                        placeholder="Computer Science & Engineering"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={memberForm.linkedin}
                        onChange={(e) => setMemberForm({...memberForm, linkedin: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={memberForm.github}
                        onChange={(e) => setMemberForm({...memberForm, github: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={memberForm.bio}
                    onChange={(e) => setMemberForm({...memberForm, bio: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                    placeholder="Tell us about this member..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Adding Member..." : "Add Member"}
                </button>
              </form>
            </div>

            {/* ===== CURRENT MEMBERS LIST ===== */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
                <span>Current Members</span>
                <span className="text-sm text-gray-400">Total: {members.length}</span>
              </h3>
              
              {membersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : members.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No members added yet.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                          member.domain === 'ml' ? 'from-cyan-500 to-cyan-600' :
                          member.domain === 'cc' ? 'from-purple-500 to-purple-600' :
                          member.domain === 'cy' ? 'from-pink-500 to-pink-600' :
                          member.domain === 'da' ? 'from-green-500 to-green-600' :
                          'from-gray-500 to-gray-600'
                        } flex items-center justify-center text-white font-bold`}>
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{member.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">{member.role}</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-500">{member.domain}</span>
                            {member.year && (
                              <>
                                <span className="text-xs text-gray-600">•</span>
                                <span className="text-xs text-gray-500">{member.year}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMember(member._id)}
                        className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== STAT CARD COMPONENT =====
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

// ===== TAB BUTTON COMPONENT =====
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