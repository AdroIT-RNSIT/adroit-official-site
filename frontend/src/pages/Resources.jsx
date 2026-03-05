import { useState, useEffect } from 'react';
import { useSession } from '../lib/auth-client';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// DOMAIN DEFINITIONS - ONLY YOUR 4 CORE DOMAINS
// =============================================
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

// RESOURCE TYPE CONFIGURATION
// ===========================
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

function Resources(){
  const [resources, setResources] = useState([]);
  const [resourceStats, setResourceStats] = useState({ all : 0, ml : 0, cy : 0, cc : 0, da : 0 });
  const [filters, setFilters] = useState({ type: "", difficulty: "", search: "" });

  const { session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const { domain } = useParams();
  const currentDomain = DOMAINS.find(d => d.id === domain) || DOMAINS[0];
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/resources/stats`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setResourceStats(data);
    } catch (err) {
      console.error("Error fetching resource stats:", err);
    }
  };

  const fetchResources = async ()=>{
    setLoading(true);
    try{
      const res = await fetch(`${API_URL}/api/resources?domain=${domain || ''}&type=${filters.type || ''}&difficulty=${filters.difficulty || ''}&search=${filters.search || ''}`,
      { credentials: 'include' });

      if(!res.ok) throw new Error("Failed to fetch resources");
      const data = await res.json();
      setResources(data);
    }
    catch (err) {
        console.log(err);
    }
    finally{ setLoading(false); }
  };

  const handleDelete = async (resourceID) => {
    if (!confirm("Delete this resource?")) return;
    try {
      const res = await fetch(`${API_URL}/api/resources/${resourceID}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      // Update local state
      setResources((prev) => prev.filter((r) => r._id !== resourceID));
      
    } catch (err) {
      alert("Failed to delete resource");
      console.error("Error deleting resource:", err);
    }
  };

  useEffect( () => {
    fetchStats();
  },[]);
  useEffect( () => {
    fetchResources();
  },[domain, filters]);

  if (loading) {
    return <LoadingSpinner icon="📚" text="Loading resources..." />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip">
    
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-100 h-100 bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-125 h-125 bg-purple-600/5 rounded-full blur-[120px] animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-r from-cyan-500/2 via-purple-500/2 to-pink-500/2 rounded-full blur-[150px]"></div>
      </div>
    
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              domain === 'ml' ? 'bg-cyan-400/20' :
              domain === 'cc' ? 'bg-purple-400/20' :
              domain === 'cy' ? 'bg-pink-400/20' :
              domain === 'da' ? 'bg-green-400/20' :
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

      <div className="text-center mb-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
          <span className="bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {currentDomain?.name || 'Resources'}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
          Curated learning materials to accelerate your technical journey
        </p>

        {/* Domain cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 ml-3 mr-3 mt-2">
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
          
                <span className="text-xs text-gray-500 mt-1">
                  {resourceStats[d.id] || 0} resources
                </span>
                
              </div>
            </Link>
          ))}
        </div>

      </div>

    <SearchBar filters={filters} currentDomainName={currentDomain.name} onUpdate={(e) =>setFilters({...e})}/>

    <div id="resources" className="m-6">
    {
      error !== "" ? <ErrorAlert error={error} onRetry={fetchResources} />
      : resources.length === 0 ? <p className="text-center text-gray-500 mt-20">No resources found. Try adjusting your filters or check back later!</p>
      : 
      <>
      {/* Summary */}
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
      {/* Resources */}
      <ResourceGrid resources={resources} isAdmin={isAdmin} onDelete={handleDelete}/>
      </>
    }

    {/* Styles */}
    </div>
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
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${typeConfig.color} flex items-center justify-center text-xl`}>
              {typeConfig.icon}
            </div>
            <div>
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-linear-to-r ${typeConfig.color} bg-opacity-20 text-white`}>
                {typeConfig.label}
              </span>
              {difficultyConfig && (
                <span className={`ml-1.5 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-linear-to-r ${difficultyConfig.color} bg-opacity-20 ${difficultyConfig.textColor}`}>
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
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-linear-to-r ${domain.color} bg-opacity-20 text-white`}>
            <span>{domain.icon}</span>
            <span>{domain.name}</span>
          </span>
          {resource.author && (
            <span className="text-xs text-gray-500 truncate max-w-30">
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
            className="inline-flex items-center gap-1 bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105"
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

function ResourceGrid({ resources, isAdmin, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {resources.map((resource) => (
        <ResourceCard 
          key={resource._id} 
          resource={resource} 
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

function SearchBar({ filters, currentDomainName, onUpdate }) {

  const [mFilters, setMFilters] = useState(filters);

  return ( 
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-10"
    onKeyDown={(e) => {
    if (e.key === 'Enter') {
      onUpdate(mFilters);
    }
  }}>
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
    
    {/* Search - Wider */}
    <div className="lg:col-span-5 relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
        value={mFilters.search}
        placeholder={`Search ${currentDomainName}...`}
        onChange={(e) => setMFilters({ ...mFilters, search: e.target.value })}
      />
      {mFilters.search && (
          <div className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 flex items-center animate-in fade-in zoom-in duration-200" 
              onClick={() => {onUpdate(mFilters)}}
          >
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-gray-400 mr-2">
              ENTER
            </kbd>
            <svg 
              className="w-4 h-4 text-cyan-500 hover:text-cyan-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </div>
        )}
    </div>

    {/* Type Filter */}
    <div className="lg:col-span-3">
      <select 
        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
        value={mFilters.type}
        onChange={(e) => { onUpdate({ ...mFilters, type: e.target.value }); }}
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
        value={mFilters.difficulty}
        onChange={(e) => { onUpdate({ ...mFilters, difficulty: e.target.value }); }}
      >
        <option value="">All Levels</option>
        {Object.entries(DIFFICULTY_CONFIG).map(([level, config]) => (
          <option key={level} value={level}>{config.label}</option>
        ))}
      </select>
    </div>

    {/* Actions */}
    <div className="lg:col-span-2">   
      <button
        onClick={() => onUpdate({ type: "", difficulty: "", search: "" })}
        className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white text-sm transition-all"
      >
        Clear Filters
      </button>
    </div>
  </div>
</div>
)
}

function ErrorAlert({ error, onRetry }) {
  return (
    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default Resources;
