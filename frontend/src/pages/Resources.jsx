import { useState, useEffect } from 'react';
import { useSession } from '../lib/auth-client';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner";
import Reveal from "../components/Reveal";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// DOMAIN DEFINITIONS - ONLY YOUR 4 CORE DOMAINS
// =============================================
const DOMAINS = [
  { id: 'all', name: 'All Resources', icon: '📚' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖' },
  { id: 'cc', name: 'Cloud Computing', icon: '☁️' },
  { id: 'cy', name: 'Cybersecurity', icon: '🔒' },
  { id: 'da', name: 'Data Analytics', icon: '📊' }
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

  const { data: session } = useSession();
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
      const params = new URLSearchParams();

      // Only include domain if it is set and not "all"
      if (domain && domain !== 'all') {
        params.set('domain', domain);
      }

      // Only include non-empty filter values
      if (filters.type) {
        params.set('type', filters.type);
      }
      if (filters.difficulty) {
        params.set('difficulty', filters.difficulty);
      }
      if (filters.search) {
        params.set('search', filters.search);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${API_URL}/api/resources?${queryString}`
        : `${API_URL}/api/resources`;

      const res = await fetch(url, { credentials: 'include' });
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
    <div className="min-h-screen bg-bg-base overflow-x-clip">
      <div className="page-wrap py-10 sm:py-12">

        <Reveal>
        <h1 className="section-title">
            {currentDomain?.name || 'Resources'}
        </h1>

        <p className="section-lead mb-8">
          Curated learning materials to accelerate your technical journey
        </p>
        </Reveal>

        {/* Domain cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
          {DOMAINS.map((d) => (
            <Link
              key={d.id}
              to={`/resources${d.id === 'all' ? '' : `/${d.id}`}`}
              className={`card p-4 min-h-11 ${
                (domain === d.id || (d.id === 'all' && !domain))
                  ? 'border-accent-primary bg-accent-primary-tint'
                  : ''
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-1">{d.icon}</span>
                <span className="text-xs font-medium text-text-primary">
                  {d.name}
                </span>
          
                <span className="text-xs text-text-muted mt-1">
                  {resourceStats[d.id] || 0} resources
                </span>
                
              </div>
            </Link>
          ))}
        </div>

        <SearchBar filters={filters} currentDomainName={currentDomain.name} onUpdate={(e) =>setFilters({...e})}/>

        <div id="resources" className="mt-8">
    {
      error !== "" ? <ErrorAlert error={error} onRetry={fetchResources} />
      : resources.length === 0 ? <p className="text-center text-text-muted mt-20">No resources found. Try adjusting your filters or check back later!</p>
      : 
      <>
      {/* Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-muted">
          Showing <span className="text-text-primary font-medium">{resources.length}</span> resources
          {domain && domain !== 'all' && (
            <> in <span className="text-accent-primary">
              {DOMAINS.find(d => d.id === domain)?.name}
            </span></>
          )}
        </p>
      </div>
      {/* Resources */}
      <ResourceGrid resources={resources} isAdmin={isAdmin} onDelete={handleDelete}/>
      </>
    }

        </div>
      </div>
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
    <div className="card card-hover p-5">
      <div>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent-primary-tint flex items-center justify-center text-xl">
              {typeConfig.icon}
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-accent-primary-tint text-accent-primary">
                {typeConfig.label}
              </span>
              {difficultyConfig && (
                <span className="ml-1.5 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-bg-base text-text-body border border-border-subtle">
                  {difficultyConfig.label}
                </span>
              )}
            </div>
          </div>
          
          {/* Admin Delete Button */}
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(resource._id)}
              className="opacity-100 text-red-600 hover:text-red-700 p-2 min-h-11 min-w-11"
              title="Delete resource"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-text-primary mb-2 line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-text-body text-xs leading-relaxed mb-3 line-clamp-2">
          {resource.description}
        </p>

        {/* Domain Badge & Author */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-accent-primary-tint text-accent-primary">
            <span>{domain.icon}</span>
            <span>{domain.name}</span>
          </span>
          {resource.author && (
            <span className="text-xs text-text-muted truncate max-w-30">
              by {resource.author}
            </span>
          )}
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-bg-base rounded text-text-body">
                #{tag}
              </span>
            ))}
            {resource.tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-bg-base rounded text-text-muted">
                +{resource.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
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
            className="btn btn-primary text-xs px-3 py-2 min-h-11"
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
  <div className="card p-5 mb-8"
    onKeyDown={(e) => {
    if (e.key === 'Enter') {
      onUpdate(mFilters);
    }
  }}>
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
    
    {/* Search - Wider */}
    <div className="lg:col-span-5 relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        className="input-field pl-9"
        value={mFilters.search}
        placeholder={`Search ${currentDomainName}...`}
        onChange={(e) => setMFilters({ ...mFilters, search: e.target.value })}
      />
      {mFilters.search && (
          <div className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 flex items-center animate-in fade-in zoom-in duration-200" 
              onClick={() => {onUpdate(mFilters)}}
          >
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-900/20 bg-slate-900/10 px-1.5 font-mono text-[10px] font-medium text-slate-600 mr-2">
              ENTER
            </kbd>
            <svg 
              className="w-4 h-4 text-accent-primary" 
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
        className="input-field"
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
        className="input-field"
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
        className="btn btn-secondary w-full"
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
    <div className="mb-6 p-4 card text-sm text-red-700 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
      <button
        onClick={onRetry}
        className="btn btn-secondary text-xs"
      >
        Retry
      </button>
    </div>
  );
}

export default Resources;
