import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ============================================
// DOMAIN CONFIGURATION - MATCHES OTHER PAGES
// ============================================
const DOMAINS = [
  { id: 'all', name: 'All Members', icon: '👥' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖' },
  { id: 'cc', name: 'Cloud Computing', icon: '☁️' },
  { id: 'cy', name: 'Cybersecurity', icon: '🔒' },
  { id: 'da', name: 'Data Analytics', icon: '📊' }
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
    // Blank section per user request instead of Cloudinary URL
    return `data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-border-subtle border-t-accent-primary rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-slate-600 text-sm">Loading member directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base overflow-x-clip py-10 sm:py-12">
      <div className="page-wrap">
        
        {/* ===== HEADER SECTION ===== */}
        <div className="text-center mb-10">
          <div className="badge mb-4">AdroIT Member Directory</div>

          <h1 className="section-title">All Members</h1>
          
          <p className="section-lead">
            Connect with everyone in the AdroIT community
          </p>

          {/* ===== QUICK STATS ===== */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/5 rounded-xl border border-slate-900/10">
              <span className="text-xl">👥</span>
              <div>
                <span className="text-slate-900 font-bold">{members.length}</span>
                <span className="text-slate-600 text-xs ml-1">Total Members</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/5 rounded-xl border border-slate-900/10">
              <span className="text-xl">🎯</span>
              <div>
                <span className="text-slate-900 font-bold">4</span>
                <span className="text-slate-600 text-xs ml-1">Domains</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/5 rounded-xl border border-slate-900/10">
              <span className="text-xl">📅</span>
              <div>
                <span className="text-slate-900 font-bold">
                  {members.filter(m => m.year?.includes('1st') || m.year?.includes('2nd')).length}
                </span>
                <span className="text-slate-600 text-xs ml-1">Juniors</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SEARCH & FILTERS BAR ===== */}
        <div className="card p-5 mb-8">
          
          {/* Search Row */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, role, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          {/* Filter Chips Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Domain Filter */}
            <div>
              <label className="block text-xs text-slate-500 mb-1">Domain</label>
              <div className="flex flex-wrap gap-1.5">
                {DOMAINS.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomain(domain.id)}
                    className={`min-h-11 px-3 rounded-lg text-xs font-medium ${
                      activeDomain === domain.id
                        ? `bg-accent-primary text-white`
                        : 'bg-bg-base text-text-body border border-border-subtle'
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
              <label className="block text-xs text-slate-500 mb-1">Year</label>
              <div className="flex flex-wrap gap-1.5">
                {YEARS.map((year) => (
                  <button
                    key={year.id}
                    onClick={() => setActiveYear(year.id)}
                    className={`min-h-11 px-3 rounded-lg text-xs font-medium ${
                      activeYear === year.id
                        ? 'bg-accent-primary text-white'
                        : 'bg-bg-base text-text-body border border-border-subtle'
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
              <label className="block text-xs text-slate-500 mb-1">Role</label>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`min-h-11 px-3 rounded-lg text-xs font-medium ${
                      activeRole === role.id
                        ? 'bg-accent-primary text-white'
                        : 'bg-bg-base text-text-body border border-border-subtle'
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
              <label className="block text-xs text-slate-500 mb-1">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm"
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
                  className="btn btn-secondary text-xs"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RESULTS SUMMARY ===== */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-muted">
            Showing <span className="text-text-primary font-medium">{filteredMembers.length}</span> of{' '}
            <span className="text-text-primary font-medium">{members.length}</span> members
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900/5 border border-slate-900/10 rounded-full mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No members found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
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
              <div className="relative card p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                  Want to be part of this community?
                </h3>
                <p className="text-text-body text-sm mb-4 max-w-lg mx-auto">
                  Join AdroIT and connect with passionate technologists
                </p>
                <Link
                  to="/login"
                  className="btn btn-primary"
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
    </div>
  );
}

// ============================================
// MEMBER CARD COMPONENT - COMPACT DIRECTORY STYLE
// ============================================
function MemberCard({ member, isAdmin, onDelete, getCloudinaryUrl }) {
  
  const domainIcons = {
    ml: '🤖',
    cc: '☁️',
    cy: '🔒',
    da: '📊'
  };

  const domain = member.domain || 'ml';
  const icon = domainIcons[domain] || '👤';

  // Role badge color
  const getRoleBadgeColor = (role) => {
    if (role === 'President' || role === 'Vice President') return 'bg-accent-amber-tint text-accent-amber';
    if (role === 'Domain Lead') return 'bg-accent-primary-tint text-accent-primary';
    if (role === 'Core Member') return 'bg-bg-base text-text-body';
    if (role === 'Member') return 'text-text-muted';
    return 'text-text-muted';
  };

  return (
    <div className="card card-hover p-3">
      
      <div className="relative">
        
        {/* Avatar */}
        <div className="relative w-14 h-14 mx-auto mb-2">
          <div className={`absolute inset-0 bg-accent-primary-tint rounded-lg`}></div>
          
          {member.imagePublicId ? (
            <img
              src={getCloudinaryUrl(member.imagePublicId, 80, 80)}
              alt={member.name}
              className="relative w-full h-full object-cover rounded-lg border border-slate-900/10"
            />
          ) : (
            <div className="relative w-full h-full rounded-lg bg-accent-primary text-white flex items-center justify-center font-bold text-xl border border-border-subtle">
              {member.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Domain Icon Badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent-primary-tint text-accent-primary flex items-center justify-center text-[10px] border border-border-subtle">
            {icon}
          </div>

          {/* Admin Delete Button */}
          {isAdmin && (
            <button
              onClick={() => onDelete(member._id)}
              className="absolute -top-1 -right-1 w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white"
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
          <h3 className="text-text-primary font-medium text-xs truncate">
            {member.name}
          </h3>
          
          <div className="mt-1 inline-flex items-center px-1.5 py-0.5 bg-slate-900/5 rounded">
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