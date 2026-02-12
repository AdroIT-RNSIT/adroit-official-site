import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ============================================
// DOMAIN DEFINITIONS - ONLY YOUR 4 CORE DOMAINS
// ============================================
const DOMAINS = [
  { 
    id: 'all', 
    name: 'All Resources', 
    icon: '📚', 
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  { 
    id: 'ml', 
    name: 'Machine Learning', 
    icon: '🤖', 
    color: 'from-cyan-500 to-cyan-600',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30'
  },
  { 
    id: 'cc', 
    name: 'Cloud Computing', 
    icon: '☁️', 
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  { 
    id: 'cy', 
    name: 'Cybersecurity', 
    icon: '🔒', 
    color: 'from-pink-500 to-pink-600',
    textColor: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30'
  },
  { 
    id: 'da', 
    name: 'Data Analytics', 
    icon: '📊', 
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  }
];

// ============================================
// RESOURCE TYPE CONFIGURATION
// ============================================
const TYPE_CONFIG = {
  article: { icon: '📝', label: 'Article', color: 'from-blue-500 to-blue-600' },
  video: { icon: '🎬', label: 'Video', color: 'from-red-500 to-red-600' },
  course: { icon: '🎓', label: 'Course', color: 'from-amber-500 to-amber-600' },
  book: { icon: '📚', label: 'Book', color: 'from-emerald-500 to-emerald-600' },
  documentation: { icon: '📄', label: 'Documentation', color: 'from-indigo-500 to-indigo-600' },
  tool: { icon: '🛠️', label: 'Tool', color: 'from-orange-500 to-orange-600' },
  paper: { icon: '📑', label: 'Research Paper', color: 'from-violet-500 to-violet-600' },
  cheatSheet: { icon: '📋', label: 'Cheat Sheet', color: 'from-teal-500 to-teal-600' }
};

// ============================================
// DIFFICULTY CONFIGURATION
// ============================================
const DIFFICULTY_CONFIG = {
  beginner: { 
    label: 'Beginner', 
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  intermediate: { 
    label: 'Intermediate', 
    color: 'from-yellow-500 to-yellow-600',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30'
  },
  advanced: { 
    label: 'Advanced', 
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30'
  }
};

// ============================================
// MAIN RESOURCES COMPONENT
// ============================================
export default function Resources() {
  const { domain } = useParams();
  const { data: session } = useSession();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    difficulty: "",
    search: ""
  });

  const isAdmin = session?.user?.role === "admin";
  const currentDomain = DOMAINS.find(d => d.id === (domain || 'all'));

  // ===== FETCH REAL DATA FROM BACKEND =====
  useEffect(() => {
    fetchResources();
  }, [domain]); // Re-fetch when domain changes

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/resources`;
      const params = new URLSearchParams();
      
      // Add domain filter from URL
      if (domain && domain !== 'all') {
        params.append('domain', domain);
      }
      
      // Add search query
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add type filter
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      // Add difficulty filter
      if (filters.difficulty) {
        params.append('difficulty', filters.difficulty);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to fetch resources");
      const data = await res.json();
      setResources(data);
      setError("");
    } catch (err) {
      setError(err.message);
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLE FILTER CHANGES =====
  useEffect(() => {
    if (!loading) {
      fetchResources();
    }
  }, [filters.type, filters.difficulty, filters.search]);

  // ===== HANDLE DELETE (Admin only) =====
  const handleDelete = async (id) => {
    if (!confirm("Delete this resource?")) return;
    try {
      const res = await fetch(`${API_URL}/api/resources/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      // Update local state
      setResources((prev) => prev.filter((r) => r._id !== id));
      
    } catch (err) {
      alert("Failed to delete resource");
      console.error("Error deleting resource:", err);
    }
  };

  // ===== GET FILTERED RESOURCES COUNT =====
  const getDomainCount = (domainId) => {
    if (domainId === 'all') return resources.length;
    return resources.filter(r => r.domain === domainId).length;
  };

  if (loading && resources.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip">
      
      {/* ===== BACKGROUND GRADIENTS ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/2 via-purple-500/2 to-pink-500/2 rounded-full blur-[150px]"></div>
      </div>

      {/* ===== FLOATING PARTICLES ===== */}
      <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              currentDomain?.id === 'ml' ? 'bg-cyan-400/20' :
              currentDomain?.id === 'cc' ? 'bg-purple-400/20' :
              currentDomain?.id === 'cy' ? 'bg-pink-400/20' :
              currentDomain?.id === 'da' ? 'bg-green-400/20' :
              'bg-cyan-400/20'
            } animate-float-particle`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ===== HERO SECTION ===== */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-400">AdroIT Learning Hub</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {currentDomain?.name || 'Resources'}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Curated learning materials to accelerate your technical journey
          </p>

          {/* ===== DOMAIN STATS ===== */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl">📚</span>
              <div>
                <span className="text-white font-bold">{resources.length}</span>
                <span className="text-gray-400 text-sm ml-1">Total Resources</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl">🎯</span>
              <div>
                <span className="text-white font-bold">4</span>
                <span className="text-gray-400 text-sm ml-1">Domains</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DOMAIN NAVIGATION CARDS - ONLY 4 DOMAINS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {DOMAINS.map((d) => (
            <Link
              key={d.id}
              to={`/resources${d.id === 'all' ? '' : `/${d.id}`}`}
              className={`group relative bg-black/40 backdrop-blur-xl border rounded-xl p-4 transition-all duration-300 hover:scale-105 ${
                (domain === d.id || (d.id === 'all' && !domain))
                  ? `${d.bgColor} ${d.borderColor} border-2`
                  : 'border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-1">{d.icon}</span>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                  {d.name}
                </span>
                {d.id !== 'all' && (
                  <span className="text-xs text-gray-500 mt-1">
                    {getDomainCount(d.id)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* ===== SEARCH & FILTERS ===== */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            
            {/* Search - Wider */}
            <div className="lg:col-span-5 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search resources..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
              />
            </div>

            {/* Type Filter */}
            <div className="lg:col-span-3">
              <select 
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                value={filters.type}
              >
                <option value="">All Types</option>
                {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                  <option key={type} value={type}>{config.icon} {config.label}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="lg:col-span-2">
              <select 
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                value={filters.difficulty}
              >
                <option value="">All Levels</option>
                {Object.entries(DIFFICULTY_CONFIG).map(([level, config]) => (
                  <option key={level} value={level}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="lg:col-span-2">
              <button
                onClick={() => setFilters({ type: "", difficulty: "", search: "" })}
                className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white text-sm transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* ===== RESULTS SUMMARY ===== */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing <span className="text-white font-medium">{resources.length}</span> resources
              {domain && domain !== 'all' && (
                <> in <span className={DOMAINS.find(d => d.id === domain)?.textColor}>
                  {DOMAINS.find(d => d.id === domain)?.name}
                </span></>
              )}
            </p>
          </div>
        )}

        {/* ===== ERROR MESSAGE ===== */}
        {error && <ErrorAlert error={error} onRetry={fetchResources} />}
        
        {/* ===== RESOURCES GRID ===== */}
        {!loading && resources.length === 0 && !error ? (
          <EmptyState 
            domain={domain}
            filters={filters}
            onClear={() => setFilters({ type: "", difficulty: "", search: "" })}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((resource) => (
              <ResourceCard 
                key={resource._id} 
                resource={resource} 
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* ===== LOADING STATE ===== */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Loading resources...</p>
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
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 8s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 20s linear infinite; }
      `}</style>
    </div>
  );
}

// ============================================
// RESOURCE CARD COMPONENT
// ============================================
function ResourceCard({ resource, isAdmin, onDelete }) {
  const typeConfig = TYPE_CONFIG[resource.type] || TYPE_CONFIG.article;
  const difficultyConfig = resource.difficulty ? DIFFICULTY_CONFIG[resource.difficulty] : null;
  const domain = DOMAINS.find(d => d.id === resource.domain) || DOMAINS[0];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/5">
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${typeConfig.color} flex items-center justify-center text-xl`}>
              {typeConfig.icon}
            </div>
            <div>
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r ${typeConfig.color} bg-opacity-20 text-white`}>
                {typeConfig.label}
              </span>
              {difficultyConfig && (
                <span className={`ml-1.5 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r ${difficultyConfig.color} bg-opacity-20 ${difficultyConfig.textColor}`}>
                  {difficultyConfig.label}
                </span>
              )}
            </div>
          </div>
          
          {/* Admin Delete Button */}
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(resource._id)}
              className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all p-1.5 hover:bg-red-500/10 rounded-lg"
              title="Delete resource"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
          {resource.description}
        </p>

        {/* Domain Badge & Author */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${domain.color} bg-opacity-20 text-white`}>
            <span>{domain.icon}</span>
            <span>{domain.name}</span>
          </span>
          {resource.author && (
            <span className="text-xs text-gray-500 truncate max-w-[120px]">
              by {resource.author}
            </span>
          )}
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-white/5 rounded text-gray-400">
                #{tag}
              </span>
            ))}
            {resource.tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-white/5 rounded text-gray-500">
                +{resource.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatDate(resource.uploadDate || resource.createdAt)}
            </span>
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {resource.views || 0}
            </span>
          </div>
          
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105"
          >
            Access
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LOADING SPINNER
// ============================================
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm">Loading resources...</p>
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({ domain, filters, onClear }) {
  const domainInfo = DOMAINS.find(d => d.id === domain) || DOMAINS[0];
  
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full mb-4">
        <span className="text-3xl">📚</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No resources found</h3>
      <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
        {domain && domain !== 'all' 
          ? `No resources available in ${domainInfo.name} yet.`
          : filters.search || filters.type || filters.difficulty
          ? "Try adjusting your search or filter criteria."
          : "Resources will appear here once added by the team."}
      </p>
      {(filters.search || filters.type || filters.difficulty) && (
        <button
          onClick={onClear}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-all"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// ============================================
// ERROR ALERT
// ============================================
function ErrorAlert({ error, onRetry }) {
  return (
    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
      <button
        onClick={onRetry}
        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-xs transition-colors"
      >
        Retry
      </button>
    </div>
  );
}