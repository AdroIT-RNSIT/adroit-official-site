import React, { useState, useEffect } from 'react';
import { useSession } from '../lib/auth-client';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ===== PROFILE FORM STATE =====
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    domain: '',
    role: '',
    bio: '',
    year: '',
    department: '',
    linkedin: '',
    github: '',
    phone: '',
    imagePublicId: '',
    imageUrl: ''
  });

  // ===== PASSWORD CHANGE STATE =====
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ===== ACCOUNT SETTINGS STATE =====
  const [settings, setSettings] = useState({
    emailNotifications: true,
    eventReminders: true,
    resourceUpdates: true,
    profileVisibility: 'members', // 'public', 'members', 'private'
    geminiApiKey: ''
  });

  // ===== LOAD USER DATA FROM SESSION =====
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();

      setProfile({
        name: data.name || session?.user?.name || '',
        email: data.email || session?.user?.email || '',
        domain: data.domain || '',
        role: data.role || session?.user?.role || 'Member',
        bio: data.bio || '',
        year: data.year || '',
        department: data.department || 'CSE',
        linkedin: data.linkedin || '',
        github: data.github || '',
        phone: data.phone || '',
        imagePublicId: data.imagePublicId || session?.user?.imagePublicId || '',
        imageUrl: data.imageUrl || session?.user?.image || ''
      });

      // Load settings
      if (data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
      
      // Check if user has API key set
      try {
        const keyRes = await fetch(`${API_URL}/api/apikey/check`, {
          credentials: 'include'
        });
        if (keyRes.ok) {
          const keyData = await keyRes.json();
          if (keyData.hasApiKey) {
            setSettings(prev => ({ ...prev, hasApiKey: true }));
          }
        }
      } catch (err) {
        console.warn('Could not check API key status:', err);
      }
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== CLOUDINARY UPLOAD =====
  const [fileStart, setFileStart] = useState(null);
  const [fileUploading, setFileUploading] = useState(false); // Renamed to avoid conflict

  const handleFileUpload = async () => {
    if (!fileStart || !session?.user) return; // Use session.user instead of user

    setFileUploading(true); // Use the new state
    const formData = new FormData();
    formData.append("userId", session.user.id); // Use session.user.id
    formData.append("file", fileStart);

    try {
      const res = await fetch("http://localhost:8000/user/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        showMessage('success', "File uploaded and indexed successfully! You can now ask questions about it.");
        setFileStart(null);
      } else {
        throw new Error(data.detail || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showMessage('error', "Failed to upload file: " + error.message);
    } finally {
      setFileUploading(false); // Use the new state
    }
  };

  const handleImageUpload = async (e) => {
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

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'adroit_profiles');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/adroit/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await res.json();

      setProfile(prev => ({
        ...prev,
        imagePublicId: data.public_id,
        imageUrl: data.secure_url
      }));

      showMessage('success', 'Profile photo uploaded successfully!');
    } catch (error) {
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveApiKey = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/apikey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          apiKey: settings.geminiApiKey
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to save API Key');
      }

      showMessage('success', 'API Key saved successfully! You can now use personalized chat.');
      setSettings(prev => ({ ...prev, geminiApiKey: '', hasApiKey: true }));
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE PROFILE =====
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          domain: profile.domain,
          year: profile.year,
          department: profile.department,
          linkedin: profile.linkedin,
          github: profile.github,
          phone: profile.phone,
          imagePublicId: profile.imagePublicId
        })
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const updatedUser = await res.json();

      // Update session
      await updateSession({
        user: {
          ...session.user,
          name: profile.name,
          image: profile.imageUrl
        }
      });

      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== CHANGE PASSWORD =====
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!res.ok) throw new Error('Failed to change password');

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      showMessage('success', 'Password changed successfully!');
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE SETTINGS =====
  const handleUpdateSettings = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings })
      });

      if (!res.ok) throw new Error('Failed to update settings');

      showMessage('success', 'Settings updated successfully!');
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== SHOW MESSAGE =====
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // ===== CLOUDINARY URL BUILDER =====
  const getCloudinaryUrl = (publicId, width = 200, height = 200) => {
    if (!publicId) return null;
    return `https://res.cloudinary.com/adroit/image/upload/c_fill,w_${width},h_${height},q_auto/f_auto/${publicId}`;
  };

  // ===== DOMAIN OPTIONS =====
  const domainOptions = [
    { value: '', label: 'Not Assigned', icon: '❓' },
    { value: 'ml', label: 'Machine Learning', icon: '🤖', color: 'cyan' },
    { value: 'cc', label: 'Cloud Computing', icon: '☁️', color: 'purple' },
    { value: 'cy', label: 'Cybersecurity', icon: '🔒', color: 'pink' },
    { value: 'da', label: 'Data Analytics', icon: '📊', color: 'green' }
  ];

  // ===== YEAR OPTIONS =====
  const yearOptions = [
    { value: '', label: 'Select Year' },
    { value: '1st', label: '1st Year' },
    { value: '2nd', label: '2nd Year' },
    { value: '3rd', label: '3rd Year' },
    { value: '4th', label: '4th Year' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Alumni', label: 'Alumni' }
  ];

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans pt-20 pb-16">

      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== HEADER ===== */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and profile information
          </p>
        </div>

        {/* ===== MESSAGE ===== */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
            {message.text}
          </div>
        )}

        {/* ===== PROFILE TABS ===== */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile Information
          </TabButton>
          <TabButton
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          >
            🔐 Security
          </TabButton>
          <TabButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </TabButton>
          <TabButton
            active={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
          >
            📊 Activity
          </TabButton>
          <TabButton
            active={activeTab === 'ai'}
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI Settings
          </TabButton>
        </div>

        {/* ===== TAB CONTENT ===== */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">

          {/* ===== TAB 1: PROFILE INFORMATION ===== */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-8">

              {/* Profile Photo Section */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="relative group">
                    {/* Avatar */}
                    <div className="relative w-32 h-32 md:w-36 md:h-36">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
                      {profile.imagePublicId || profile.imageUrl ? (
                        <img
                          src={profile.imagePublicId
                            ? getCloudinaryUrl(profile.imagePublicId, 300, 300)
                            : profile.imageUrl
                          }
                          alt={profile.name}
                          className="relative w-full h-full object-cover rounded-2xl border-2 border-white/10"
                        />
                      ) : (
                        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-4xl md:text-5xl font-bold text-white">
                          {profile.name?.charAt(0).toUpperCase() || session?.user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}

                      {/* Upload Overlay */}
                      <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-white text-xs">Change Photo</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>

                    {/* Upload Status */}
                    {uploading && (
                      <p className="text-xs text-cyan-400 mt-2 text-center">Uploading...</p>
                    )}
                  </div>
                </div>

                {/* Profile Summary */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {profile.name || session?.user?.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.role === 'Admin' ? 'bg-red-500/20 text-red-400' :
                      profile.role === 'President' ? 'bg-yellow-500/20 text-yellow-400' :
                        profile.role === 'Domain Lead' ? 'bg-purple-500/20 text-purple-400' :
                          profile.role === 'Core Member' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                      }`}>
                      {profile.role || 'Member'}
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium">
                      {profile.email || session?.user?.email}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Member since {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Profile Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      placeholder="your.email@example.com"
                      disabled // Email cannot be changed directly
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Domain
                    </label>
                    <select
                      value={profile.domain}
                      onChange={(e) => setProfile({ ...profile, domain: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    >
                      {domainOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Year
                    </label>
                    <select
                      value={profile.year}
                      onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    >
                      {yearOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      placeholder="Computer Science & Engineering"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                      placeholder="Tell us about yourself, your interests, and what you're working on..."
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {profile.bio.length}/500
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </span>
                      <input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      GitHub Profile
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.098 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                      </span>
                      <input
                        type="url"
                        value={profile.github}
                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => fetchUserProfile()}
                  className="px-6 py-2.5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* ===== TAB 2: SECURITY ===== */}
          {activeTab === 'security' && (
            <div className="space-y-8">

              {/* Change Password */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </h3>

                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Account Security Tips */}
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-6">
                <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Security Tips
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Use a strong password with at least 8 characters</li>
                  <li>• Include numbers, symbols, and mixed case letters</li>
                  <li>• Don't reuse passwords from other websites</li>
                  <li>• Change your password regularly</li>
                </ul>
              </div>
            </div>
          )}

          {/* ===== TAB 3: SETTINGS ===== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notification Preferences
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <span className="text-white text-sm font-medium">Email Notifications</span>
                      <p className="text-gray-500 text-xs">Receive updates via email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-cyan-500' : 'bg-gray-600'
                        }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-6' : ''
                        }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <span className="text-white text-sm font-medium">Event Reminders</span>
                      <p className="text-gray-500 text-xs">Get notified about upcoming events</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, eventReminders: !settings.eventReminders })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${settings.eventReminders ? 'bg-cyan-500' : 'bg-gray-600'
                        }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.eventReminders ? 'translate-x-6' : ''
                        }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <span className="text-white text-sm font-medium">Resource Updates</span>
                      <p className="text-gray-500 text-xs">New resources in your domain</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, resourceUpdates: !settings.resourceUpdates })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${settings.resourceUpdates ? 'bg-cyan-500' : 'bg-gray-600'
                        }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.resourceUpdates ? 'translate-x-6' : ''
                        }`} />
                    </button>
                  </label>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Privacy Settings
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <span className="text-white text-sm font-medium block mb-2">Profile Visibility</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          checked={settings.profileVisibility === 'public'}
                          onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                          className="w-4 h-4 text-cyan-500 bg-white/5 border-white/10 focus:ring-cyan-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-gray-300">Public</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          value="members"
                          checked={settings.profileVisibility === 'members'}
                          onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                          className="w-4 h-4 text-cyan-500 bg-white/5 border-white/10 focus:ring-cyan-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-gray-300">Members Only</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          checked={settings.profileVisibility === 'private'}
                          onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                          className="w-4 h-4 text-cyan-500 bg-white/5 border-white/10 focus:ring-cyan-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-gray-300">Private</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Settings */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleUpdateSettings}
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}

          {/* ===== TAB 4: ACTIVITY ===== */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Activity Overview
              </h3>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-cyan-400">12</div>
                  <div className="text-sm text-gray-400">Resources Accessed</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-purple-400">5</div>
                  <div className="text-sm text-gray-400">Events Attended</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-pink-400">3</div>
                  <div className="text-sm text-gray-400">Projects Contributed</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-green-400">8</div>
                  <div className="text-sm text-gray-400">Workshops Completed</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-white font-semibold mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Accessed resource: "Machine Learning Fundamentals"</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB 5: AI SETTINGS ===== */}
          {activeTab === 'ai' && (
            <div className="space-y-6">

              {/* API Key Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  Personalization Key
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Provide your Google Gemini API Key to enable a personalized assistant that knows your name and context.
                  Your key is encrypted and stored securely.
                </p>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="password"
                      value={settings.geminiApiKey}
                      onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                      placeholder={settings.hasApiKey ? "API Key is set (Hidden)" : "Paste your Gemini API Key here"}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSaveApiKey}
                    disabled={loading || !settings.geminiApiKey}
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Key'}
                  </button>
                </div>
                {settings.hasApiKey && (
                  <p className="text-green-400 text-sm mt-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    key configured. Personalization active.
                  </p>
                )}
              </div>

              {/* Knowledge Base Upload Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Private Knowledge Base</h2>
                    <p className="text-gray-400 text-sm">Upload documents (PDF, TXT, MD) to train your personal AI assistant.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 items-center">
                    <label className="flex-1 cursor-pointer">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-30 group-hover:opacity-75 transition duration-200 blur"></div>
                        <div className="relative flex items-center justify-center w-full px-4 py-8 bg-[#0d1117] border border-white/10 rounded-xl">
                          {fileStart ? (
                            <span className="text-purple-300 font-medium truncate">{fileStart.name}</span>
                          ) : (
                            <div className="text-center">
                              <p className="text-gray-400 text-sm font-medium">Click to select a file</p>
                              <p className="text-gray-600 text-xs mt-1">MAX 10MB</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          onChange={(e) => setFileStart(e.target.files[0])}
                          className="hidden"
                          accept=".txt,.md,.pdf"
                        />
                      </div>
                    </label>
                    <button
                      onClick={handleFileUpload}
                      disabled={fileUploading || !fileStart}
                      className="px-6 py-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {fileUploading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : "Upload"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Uploaded files are indexed privately. The AI will prioritize this knowledge when answering you.
                  </p>
                </div>
              </div>
            </div>
          )}
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
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active
        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
    >
      {children}
    </button>
  );
}