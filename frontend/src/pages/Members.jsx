import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ============================================
// DOMAIN CONFIGURATION - MATCHES OTHER PAGES
// ============================================
const DOMAINS = [
  { id: 'all', name: 'All Members', icon: '👥', color: 'from-gray-500 to-gray-600', textColor: 'text-gray-400' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖', color: 'from-cyan-500 to-cyan-600', textColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
  { id: 'cc', name: 'Cloud Computing', icon: '☁️', color: 'from-purple-500 to-purple-600', textColor: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  { id: 'cy', name: 'Cybersecurity', icon: '🔒', color: 'from-pink-500 to-pink-600', textColor: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30' },
  { id: 'da', name: 'Data Analytics', icon: '📊', color: 'from-green-500 to-green-600', textColor: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' }
];

// ============================================
// YEAR OPTIONS FOR FILTER
// ============================================
const YEARS = [
  { id: 'all', name: 'All Years' },
  { id: '1st', name: '1st Year' },
  { id: '2nd', name: '2nd Year' },
  { id: '3rd', name: '3rd Year' },
  { id: '4th', name: '4th Year' },
  { id: 'PhD', name: 'PhD' },
  { id: 'Alumni', name: 'Alumni' }
];

// ============================================
// ROLE OPTIONS FOR FILTER
// ============================================
const ROLES = [
  { id: 'all', name: 'All Roles' },
  { id: 'President', name: 'President' },
  { id: 'Vice President', name: 'Vice President' },
  { id: 'General Secretary', name: 'General Secretary' },
  { id: 'Domain Lead', name: 'Domain Lead' },
  { id: 'Core Member', name: 'Core Member' },
  { id: 'Member', name: 'Member' }
];

// ============================================
// MAIN MEMBERS COMPONENT - COMPLETE DIRECTORY
// ============================================
export default function Members() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // ===== FILTERS =====
  const [activeDomain, setActiveDomain] = useState("all");
  const [activeYear, setActiveYear] = useState("all");
  const [activeRole, setActiveRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, year, domain
  
  const isAdmin = session?.user?.role === "admin";

  // ===== FETCH REAL DATA FROM BACKEND =====
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/members`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data);
      setError("");
    } catch (err) {
      setError(err.message);
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== FILTER MEMBERS BASED ON ALL CRITERIA =====
  const getFilteredMembers = () => {
    let filtered = [...members];

    // Filter by domain
    if (activeDomain !== 'all') {
      filtered = filtered.filter(m => m.domain === activeDomain);
    }

    // Filter by year
    if (activeYear !== 'all') {
      filtered = filtered.filter(m => m.year === activeYear);
    }

    // Filter by role
    if (activeRole !== 'all') {
      filtered = filtered.filter(m => m.role === activeRole);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.name?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query) ||
        m.role?.toLowerCase().includes(query) ||
        m.domain?.toLowerCase().includes(query)
      );
    }

    // Sort members
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name);
        case 'year':
          const yearOrder = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, 'PhD': 5, 'Alumni': 6 };
          return (yearOrder[a.year] || 99) - (yearOrder[b.year] || 99);
        case 'domain':
          return a.domain?.localeCompare(b.domain);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredMembers = getFilteredMembers();

  // ===== GET STATS FOR FILTER BADGES =====
  const getDomainCount = (domainId) => {
    if (domainId === 'all') return members.length;
    return members.filter(m => m.domain === domainId).length;
  };

  const getYearCount = (yearId) => {
    if (yearId === 'all') return members.length;
    return members.filter(m => m.year === yearId).length;
  };

  const getRoleCount = (roleId) => {
    if (roleId === 'all') return members.length;
    return members.filter(m => m.role === roleId).length;
  };

  // ===== HANDLE DELETE (Admin only) =====
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`${API_URL}/api/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setMembers(prev => prev.filter(m => m._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete member');
      alert('Failed to delete member');
    }
  };

  // ===== CLOUDINARY URL BUILDER =====
  const getCloudinaryUrl = (publicId, width = 100, height = 100) => {
    if (!publicId) return null;
    return `https://res.cloudinary.com/adroit/image/upload/c_fill,w_${width},h_${height},q_auto/f_auto/${publicId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Loading member directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip pt-20 pb-16">
      
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-40 right-20 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse-slower"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===== HEADER SECTION ===== */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-400">AdroIT Member Directory</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              All Members
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Connect with everyone in the AdroIT community
          </p>

          {/* ===== QUICK STATS ===== */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xl">👥</span>
              <div>
                <span className="text-white font-bold">{members.length}</span>
                <span className="text-gray-400 text-xs ml-1">Total Members</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xl">🎯</span>
              <div>
                <span className="text-white font-bold">4</span>
                <span className="text-gray-400 text-xs ml-1">Domains</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xl">📅</span>
              <div>
                <span className="text-white font-bold">
                  {members.filter(m => m.year?.includes('1st') || m.year?.includes('2nd')).length}
                </span>
                <span className="text-gray-400 text-xs ml-1">Juniors</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SEARCH & FILTERS BAR ===== */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-8">
          
          {/* Search Row */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, role, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
            />
          </div>

          {/* Filter Chips Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Domain Filter */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Domain</label>
              <div className="flex flex-wrap gap-1.5">
                {DOMAINS.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomain(domain.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeDomain === domain.id
                        ? `bg-gradient-to-r ${domain.color} text-white`
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="mr-1">{domain.icon}</span>
                    {domain.id === 'all' ? domain.name : ''}
                    <span className="ml-1 text-xs opacity-80">
                      ({getDomainCount(domain.id)})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Year</label>
              <div className="flex flex-wrap gap-1.5">
                {YEARS.map((year) => (
                  <button
                    key={year.id}
                    onClick={() => setActiveYear(year.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeYear === year.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {year.name}
                    {year.id !== 'all' && (
                      <span className="ml-1 text-xs opacity-80">
                        ({getYearCount(year.id)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Role</label>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeRole === role.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {role.name}
                    {role.id !== 'all' && (
                      <span className="ml-1 text-xs opacity-80">
                        ({getRoleCount(role.id)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort & Clear */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500/50 transition-all"
                >
                  <option value="name">Name</option>
                  <option value="year">Year</option>
                  <option value="domain">Domain</option>
                </select>
                
                <button
                  onClick={() => {
                    setActiveDomain('all');
                    setActiveYear('all');
                    setActiveRole('all');
                    setSearchQuery('');
                    setSortBy('name');
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white text-xs transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RESULTS SUMMARY ===== */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing <span className="text-white font-medium">{filteredMembers.length}</span> of{' '}
            <span className="text-white font-medium">{members.length}</span> members
          </p>
          <p className="text-xs text-gray-600">
            {activeDomain !== 'all' && ` • ${DOMAINS.find(d => d.id === activeDomain)?.name}`}
            {activeYear !== 'all' && ` • ${activeYear}`}
            {activeRole !== 'all' && ` • ${activeRole}`}
          </p>
        </div>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
            <button
              onClick={fetchMembers}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* ===== MEMBERS GRID ===== */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-full mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No members found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              {searchQuery || activeDomain !== 'all' || activeYear !== 'all' || activeRole !== 'all'
                ? "Try adjusting your search or filter criteria."
                : "Members will appear here once they join the club."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                getCloudinaryUrl={getCloudinaryUrl}
              />
            ))}
          </div>
        )}

        {/* ===== JOIN CTA - Only for non-logged in users ===== */}
        {!session && (
          <div className="mt-16 text-center">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  Want to be part of this community?
                </h3>
                <p className="text-gray-400 text-sm mb-4 max-w-lg mx-auto">
                  Join AdroIT and connect with passionate technologists
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                >
                  Join AdroIT Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ============================================
// MEMBER CARD COMPONENT - COMPACT DIRECTORY STYLE
// ============================================
function MemberCard({ member, isAdmin, onDelete, getCloudinaryUrl }) {
  
  // Domain color mapping
  const domainColors = {
    ml: 'from-cyan-500 to-cyan-600',
    cc: 'from-purple-500 to-purple-600',
    cy: 'from-pink-500 to-pink-600',
    da: 'from-green-500 to-green-600'
  };

  const domainIcons = {
    ml: '🤖',
    cc: '☁️',
    cy: '🔒',
    da: '📊'
  };

  const domain = member.domain || 'ml';
  const color = domainColors[domain] || 'from-gray-500 to-gray-600';
  const icon = domainIcons[domain] || '👤';

  // Role badge color
  const getRoleBadgeColor = (role) => {
    if (role === 'President' || role === 'Vice President') return 'bg-yellow-500/20 text-yellow-400';
    if (role === 'Domain Lead') return 'bg-purple-500/20 text-purple-400';
    if (role === 'Core Member') return 'bg-blue-500/20 text-blue-400';
    if (role === 'Member') return 'bg-gray-500/20 text-gray-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5">
      
      <div className="relative">
        
        {/* Avatar */}
        <div className="relative w-14 h-14 mx-auto mb-2">
          <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-lg blur-md opacity-50`}></div>
          
          {member.imagePublicId ? (
            <img
              src={getCloudinaryUrl(member.imagePublicId, 80, 80)}
              alt={member.name}
              className="relative w-full h-full object-cover rounded-lg border border-white/10"
            />
          ) : (
            <div className={`relative w-full h-full rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xl border border-white/10`}>
              {member.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Domain Icon Badge */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-[10px] border-2 border-[#0d1117]`}>
            {icon}
          </div>

          {/* Admin Delete Button */}
          {isAdmin && (
            <button
              onClick={() => onDelete(member._id)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="Remove member"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Member Info */}
        <div className="text-center">
          <h3 className="text-white font-medium text-xs truncate group-hover:text-cyan-400 transition-colors">
            {member.name}
          </h3>
          
          <div className="mt-1 inline-flex items-center px-1.5 py-0.5 bg-white/5 rounded">
            <span className={`text-[9px] font-medium ${getRoleBadgeColor(member.role)}`}>
              {member.role === 'Domain Lead' ? 'Lead' : 
               member.role === 'Core Member' ? 'Core' : 
               member.role || 'Member'}
            </span>
          </div>

          {member.year && (
            <p className="text-[9px] text-gray-600 mt-1">
              {member.year} Year
            </p>
          )}
        </div>
      </div>
    </div>
  );
}