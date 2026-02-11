import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Members() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDomain, setActiveDomain] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = session?.user?.role === "admin";

  // Fetch members from backend
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Domain definitions with colors and icons
  const domains = [
    { id: 'all', name: 'All Members', icon: '👥', color: 'from-gray-500 to-gray-600' },
    { id: 'ml', name: 'Machine Learning', icon: '🤖', color: 'from-cyan-500 to-cyan-600' },
    { id: 'cc', name: 'Cloud Computing', icon: '☁️', color: 'from-purple-500 to-purple-600' },
    { id: 'cy', name: 'Cybersecurity', icon: '🔒', color: 'from-pink-500 to-pink-600' },
    { id: 'da', name: 'Data Analytics', icon: '📊', color: 'from-green-500 to-green-600' }
  ];

  // Filter members by domain and search
  const filteredMembers = members.filter(member => {
    const matchesDomain = activeDomain === 'all' || member.domain === activeDomain;
    const matchesSearch = member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && (searchQuery ? matchesSearch : true);
  });

  // Group members by role within domain
  const getLeads = (domainMembers) => domainMembers.filter(m => m.role === 'Lead' || m.role?.includes('Head'));
  const getCore = (domainMembers) => domainMembers.filter(m => m.role === 'Core' || m.role === 'Senior');
  const getMembers = (domainMembers) => domainMembers.filter(m => !['Lead', 'Core', 'Senior', 'Head'].includes(m.role));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-gray-400 text-lg">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Failed to Load Members</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchMembers}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip pt-20 pb-16">
      
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===== HEADER SECTION ===== */}
        <div className="text-center mb-12">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-400">AdroIT Team Directory</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Passionate technologists driving innovation across 
            <span className="text-cyan-400"> Machine Learning</span>, 
            <span className="text-purple-400"> Cloud Computing</span>, 
            <span className="text-pink-400"> Cybersecurity</span>, and 
            <span className="text-green-400"> Data Analytics</span>
          </p>

          {/* Stats counter */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur px-5 py-3 rounded-xl border border-white/10">
              <span className="text-2xl">👥</span>
              <div>
                <span className="text-2xl font-bold text-white">{members.length}</span>
                <span className="text-gray-400 text-sm ml-2">Total Members</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur px-5 py-3 rounded-xl border border-white/10">
              <span className="text-2xl">🎯</span>
              <div>
                <span className="text-2xl font-bold text-white">4</span>
                <span className="text-gray-400 text-sm ml-2">Domains</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SEARCH & FILTER BAR ===== */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search members by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Domain Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeDomain === domain.id
                      ? `bg-gradient-to-r ${domain.color} text-white shadow-lg`
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{domain.icon}</span>
                  <span>{domain.name}</span>
                  {domain.id !== 'all' && (
                    <span className="ml-1 text-xs opacity-80">
                      ({members.filter(m => m.domain === domain.id).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== MEMBERS GRID ===== */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 border border-white/10 rounded-full mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No members found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search or filter"
                : "Members will appear here once they join the team"}
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* If viewing all domains, group by domain */}
            {activeDomain === 'all' ? (
              domains.filter(d => d.id !== 'all').map((domain) => {
                const domainMembers = members.filter(m => m.domain === domain.id);
                if (domainMembers.length === 0) return null;

                return (
                  <div key={domain.id} className="space-y-6">
                    {/* Domain Header */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-2xl`}>
                        {domain.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{domain.name}</h2>
                        <p className="text-gray-500 text-sm">{domainMembers.length} members</p>
                      </div>
                    </div>

                    {/* Members Grid */}
                    <MemberGrid members={domainMembers} isAdmin={isAdmin} onRefresh={fetchMembers} />
                  </div>
                );
              })
            ) : (
              // Single domain view
              <div className="space-y-8">
                {/* Domain Overview Card */}
                {(() => {
                  const domain = domains.find(d => d.id === activeDomain);
                  const domainMembers = members.filter(m => m.domain === activeDomain);
                  
                  return (
                    <>
                      {/* Domain Hero */}
                      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${domain.color}/10 border border-white/10 p-8`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-start justify-between">
                          <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-4xl`}>
                              {domain.icon}
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold text-white mb-2">{domain.name}</h2>
                              <p className="text-gray-400 max-w-2xl">
                                {domain.id === 'ml' && 'Building intelligent systems that learn and adapt from data'}
                                {domain.id === 'cc' && 'Designing and deploying scalable cloud-native applications'}
                                {domain.id === 'cy' && 'Protecting systems and networks from emerging threats'}
                                {domain.id === 'da' && 'Extracting actionable insights from complex datasets'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-2xl">{domain.icon}</span>
                            <span className="text-white font-bold">{domainMembers.length}</span>
                            <span className="text-gray-400">members</span>
                          </div>
                        </div>
                      </div>

                      {/* Members Grid */}
                      <MemberGrid members={domainMembers} isAdmin={isAdmin} onRefresh={fetchMembers} />
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ===== JOIN CTA ===== */}
        {!session && (
          <div className="mt-20 text-center">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Want to be part of this team?
                </h3>
                <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                  Join AdroIT and work on cutting-edge projects with talented peers
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                >
                  Join AdroIT Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ============================================
// MEMBER GRID COMPONENT
// ============================================
function MemberGrid({ members, isAdmin, onRefresh }) {
  
  // Group members by role
  const leads = members.filter(m => m.role === 'Lead' || m.role?.includes('Head'));
  const core = members.filter(m => m.role === 'Core' || m.role === 'Senior');
  const regular = members.filter(m => !['Lead', 'Core', 'Senior', 'Head'].includes(m.role));

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      const res = await fetch(`${API_URL}/api/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete member');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Leads Section */}
      {leads.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-400">Domain Leads</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {leads.map((member) => (
              <MemberCard 
                key={member._id} 
                member={member} 
                variant="lead"
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Core Members Section */}
      {core.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">Core Members</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {core.map((member) => (
              <MemberCard 
                key={member._id} 
                member={member} 
                variant="core"
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Members Section */}
      {regular.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Members</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {regular.map((member) => (
              <MemberCard 
                key={member._id} 
                member={member} 
                variant="regular"
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MEMBER CARD COMPONENT
// ============================================
function MemberCard({ member, variant = 'regular', isAdmin, onDelete }) {
  
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

  const color = domainColors[member.domain] || 'from-gray-500 to-gray-600';
  const icon = domainIcons[member.domain] || '👤';

  // Variant styles
  const variants = {
    lead: 'border-yellow-500/30 hover:border-yellow-500/60 bg-gradient-to-br from-yellow-500/10 to-transparent',
    core: 'border-blue-500/30 hover:border-blue-500/60',
    regular: 'border-white/10 hover:border-white/20'
  };

  return (
    <div className={`group relative bg-black/40 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 ${variants[variant]}`}>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        
        {/* Avatar with domain color */}
        <div className="relative mb-3">
          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{member.name?.charAt(0).toUpperCase() || '?'}</span>
            )}
          </div>
          
          {/* Domain icon badge */}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs border-2 border-[#0d1117]`}>
            {icon}
          </div>

          {/* Admin delete button */}
          {isAdmin && (
            <button
              onClick={() => onDelete(member._id)}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              title="Remove member"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Member info */}
        <div className="text-center">
          <h3 className="text-white font-semibold text-base truncate group-hover:text-cyan-400 transition-colors">
            {member.name}
          </h3>
          
          {/* Role badge */}
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg">
            {member.role === 'Lead' && (
              <>
                <span className="text-yellow-400 text-xs">⭐</span>
                <span className="text-yellow-400 text-xs font-medium">Domain Lead</span>
              </>
            )}
            {member.role === 'Core' && (
              <span className="text-blue-400 text-xs font-medium">Core Member</span>
            )}
            {member.role === 'Senior' && (
              <span className="text-purple-400 text-xs font-medium">Senior Member</span>
            )}
            {!['Lead', 'Core', 'Senior'].includes(member.role) && member.role && (
              <span className="text-gray-400 text-xs">{member.role}</span>
            )}
          </div>

          {/* Year/Batch (optional) */}
          {member.year && (
            <p className="text-gray-500 text-xs mt-2">{member.year} Year</p>
          )}
        </div>
      </div>
    </div>
  );
}