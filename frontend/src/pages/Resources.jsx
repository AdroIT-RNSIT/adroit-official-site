import { useState, useEffect } from "react";
import { useSession } from "../lib/auth-client";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Domain definitions - Simplified
const DOMAINS = [
  { id: 'all', name: 'All Resources', icon: '📚', color: 'from-purple-500 to-purple-600' },
  { id: 'web-dev', name: 'Web Development', icon: '🌐', color: 'from-cyan-500 to-blue-600' },
  { id: 'data-science', name: 'Data Science', icon: '📊', color: 'from-green-500 to-emerald-600' },
  { id: 'cybersecurity', name: 'Cyber Security', icon: '🔒', color: 'from-red-500 to-orange-600' },
  { id: 'mobile-dev', name: 'Mobile Dev', icon: '📱', color: 'from-indigo-500 to-violet-600' },
  { id: 'design', name: 'UI/UX Design', icon: '🎨', color: 'from-pink-500 to-rose-600' },
  { id: 'devops', name: 'DevOps', icon: '⚙️', color: 'from-gray-500 to-slate-600' },
  { id: 'general', name: 'General', icon: '📌', color: 'from-amber-500 to-yellow-600' }
];

// Resource type configuration
const TYPE_CONFIG = {
  article: { icon: '📝', label: 'Article', color: 'from-blue-500 to-blue-600' },
  video: { icon: '🎬', label: 'Video', color: 'from-red-500 to-red-600' },
  document: { icon: '📄', label: 'Document', color: 'from-green-500 to-green-600' },
  code: { icon: '💻', label: 'Code', color: 'from-purple-500 to-purple-600' },
  course: { icon: '🎓', label: 'Course', color: 'from-amber-500 to-amber-600' },
  book: { icon: '📚', label: 'Book', color: 'from-emerald-500 to-emerald-600' },
  link: { icon: '🔗', label: 'Link', color: 'from-indigo-500 to-indigo-600' }
};

// Difficulty configuration
const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', color: 'from-green-500 to-green-600' },
  intermediate: { label: 'Intermediate', color: 'from-yellow-500 to-yellow-600' },
  advanced: { label: 'Advanced', color: 'from-red-500 to-red-600' }
};

// Main Resources Page
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

  useEffect(() => {
    fetchResources();
  }, [domain]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/resources`;
      const params = new URLSearchParams();
      
      if (domain && domain !== 'all') {
        params.append('domain', domain);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this resource?")) return;
    try {
      const res = await fetch(`${API_URL}/api/resources/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to delete resource");
    }
  };

  // Handle filter changes
  useEffect(() => {
    fetchResources();
  }, [filters.type, filters.difficulty, filters.search]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-8 py-20">
        <div className="max-w-7xl mx-auto z-10 relative">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-gray-400">
            <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></span>
            <span>AdroIT Learning Hub</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              {currentDomain?.name || 'Resources'}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12">
            Curated learning materials to accelerate your technical journey
          </p>

          {/* Domain Navigation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
            {DOMAINS.map((d) => (
              <Link
                key={d.id}
                to={`/resources${d.id === 'all' ? '' : `/${d.id}`}`}
                className={`group relative bg-black/40 backdrop-blur-xl border ${domain === d.id || (d.id === 'all' && !domain) ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-purple-500/10' : 'border-white/10'} rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500/30`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl mb-2">{d.icon}</span>
                  <span className="text-sm font-medium">{d.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <select 
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                value={filters.type}
              >
                <option value="">All Types</option>
                {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                  <option key={type} value={type}>{config.icon} {config.label}</option>
                ))}
              </select>
              <select 
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                value={filters.difficulty}
              >
                <option value="">All Levels</option>
                {Object.entries(DIFFICULTY_CONFIG).map(([level, config]) => (
                  <option key={level} value={level}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources Grid */}
          {error && <ErrorAlert error={error} />}
          
          {resources.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      <style jsx>{`
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

// Resource Card Component
function ResourceCard({ resource, isAdmin, onDelete }) {
  const typeConfig = TYPE_CONFIG[resource.type] || TYPE_CONFIG.link;
  const difficultyConfig = resource.difficulty ? DIFFICULTY_CONFIG[resource.difficulty] : null;
  const domain = DOMAINS.find(d => d.id === resource.domain) || DOMAINS[0];

  return (
    <div className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center text-2xl`}>
              {typeConfig.icon}
            </div>
            <div>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${typeConfig.color} bg-opacity-20 text-white`}>
                {typeConfig.label}
              </span>
              {difficultyConfig && (
                <span className={`ml-2 inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${difficultyConfig.color} bg-opacity-20 text-white`}>
                  {difficultyConfig.label}
                </span>
              )}
            </div>
          </div>
          
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(resource._id)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-2 hover:bg-red-500/10 rounded-lg"
              title="Delete resource"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
          {resource.description}
        </p>

        {/* Domain Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gradient-to-r ${domain.color} bg-opacity-20 text-white`}>
            <span>{domain.icon}</span>
            <span>{domain.name}</span>
          </span>
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2.5 py-1 text-xs bg-white/5 rounded-lg text-gray-300">
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="px-2.5 py-1 text-xs bg-white/5 rounded-lg text-gray-400">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {new Date(resource.uploadDate || resource.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Access
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Loading Spinner
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-gray-400 text-lg">Loading resources...</p>
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full mb-6">
        <span className="text-5xl">📚</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">No resources found</h3>
      <p className="text-gray-400 text-lg max-w-md mx-auto">
        Be the first to add resources in this domain!
      </p>
    </div>
  );
}

// Error Alert
function ErrorAlert({ error }) {
  return (
    <div className="mb-6 p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
      </svg>
      {error}
    </div>
  );
}