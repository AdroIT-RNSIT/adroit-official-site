import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../lib/auth-client';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Team() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "admin";
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);
  
  const sectionRefs = {
    hero: useRef(null),
    leadership: useRef(null),
    domains: useRef(null),
    core: useRef(null)
  };

  // ===== SVG ICONS =====
  const icons = {
    ml: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-2.88-2.88c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l3.59 3.59c.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.38-1.41 0z" fill="currentColor"/>
      </svg>
    ),
    cc: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z" fill="currentColor"/>
        <path d="M12 10v2h2v2h-2v2h-2v-2H8v-2h2v-2h2z" fill="currentColor"/>
      </svg>
    ),
    cy: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
      </svg>
    ),
    da: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" fill="currentColor"/>
        <circle cx="4" cy="4" r="2" fill="currentColor"/>
      </svg>
    ),
    github: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.098 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
      </svg>
    ),
    mail: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
      </svg>
    ),
    crown: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    star: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
      </svg>
    ),
    arrow: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
      </svg>
    )
  };

  // ===== DOMAIN CONFIGURATION =====
  const domains = [
    { id: 'all', name: 'All Members', icon: '👥', color: 'from-gray-500 to-gray-600' },
    { id: 'ml', name: 'Machine Learning', icon: icons.ml, color: 'from-cyan-500 to-cyan-600', textColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
    { id: 'cc', name: 'Cloud Computing', icon: icons.cc, color: 'from-purple-500 to-purple-600', textColor: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
    { id: 'cy', name: 'Cybersecurity', icon: icons.cy, color: 'from-pink-500 to-pink-600', textColor: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30' },
    { id: 'da', name: 'Data Analytics', icon: icons.da, color: 'from-green-500 to-green-600', textColor: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' }
  ];

  // ===== CLOUDINARY IMAGE URL BUILDER =====
  const getCloudinaryUrl = (publicId, width = 200, height = 200, crop = 'fill', quality = 'auto') => {
    if (!publicId) return null;
    // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/image/upload/c_fill,w_200,h_200,q_auto/f_auto/<public_id>
    return `https://res.cloudinary.com/adroit/image/upload/c_${crop},w_${width},h_${height},q_${quality}/f_auto/${publicId}`;
  };

  // ===== FETCH TEAM MEMBERS FROM BACKEND =====
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/members`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch team members');
      const data = await res.json();
      setTeamMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== FILTER MEMBERS BY DOMAIN =====
  const filteredMembers = activeTab === 'all' 
    ? teamMembers 
    : teamMembers.filter(m => m.domain === activeTab);

  // ===== GROUP MEMBERS BY ROLE =====
  const leadership = teamMembers.filter(m => 
    m.role === 'President' || m.role === 'Vice President' || m.role === 'General Secretary'
  );

  const domainLeads = teamMembers.filter(m => 
    m.role === 'Domain Lead' || m.role?.includes('Head')
  );

  const coreMembers = teamMembers.filter(m => 
    m.role === 'Core Member' || m.role === 'Senior Member'
  );

  const regularMembers = teamMembers.filter(m => 
    !['President', 'Vice President', 'General Secretary', 'Domain Lead', 'Core Member', 'Senior Member'].includes(m.role)
  );

  // ===== INTERSECTION OBSERVER =====
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // ===== MEMBER DETAIL MODAL =====
  const MemberModal = ({ member, onClose }) => {
    if (!member) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
        <div className="relative max-w-2xl w-full bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
          
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Profile Image - Cloudinary */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                  <div className={`absolute inset-0 bg-gradient-to-br ${domains.find(d => d.id === member.domain)?.color || 'from-gray-500 to-gray-600'} rounded-2xl blur-xl opacity-50`}></div>
                  {member.imagePublicId ? (
                    <img
                      src={getCloudinaryUrl(member.imagePublicId, 400, 400)}
                      alt={member.name}
                      className="relative w-full h-full object-cover rounded-2xl border-2 border-white/10"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${domains.find(d => d.id === member.domain)?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-4xl md:text-5xl font-bold text-white`}>
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Member Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{member.name}</h2>
                  {member.role === 'President' && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                      {icons.crown} President
                    </span>
                  )}
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${domains.find(d => d.id === member.domain)?.bgColor} ${domains.find(d => d.id === member.domain)?.textColor} border ${domains.find(d => d.id === member.domain)?.borderColor} mb-4`}>
                  <span className="w-4 h-4">{domains.find(d => d.id === member.domain)?.icon}</span>
                  <span className="text-sm font-medium">{domains.find(d => d.id === member.domain)?.name}</span>
                </div>

                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {member.bio || `${member.name} is a ${member.role} in the ${domains.find(d => d.id === member.domain)?.name} domain at AdroIT. Passionate about technology and innovation.`}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {member.year && (
                    <div>
                      <div className="text-xs text-gray-500">Year</div>
                      <div className="text-white text-sm font-medium">{member.year}</div>
                    </div>
                  )}
                  {member.department && (
                    <div>
                      <div className="text-xs text-gray-500">Department</div>
                      <div className="text-white text-sm font-medium">{member.department}</div>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors">
                      {icons.linkedin}
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors">
                      {icons.github}
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors">
                      {icons.mail}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <h2 className="text-2xl font-bold text-white mb-3">Failed to Load Team</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchTeamMembers}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip pt-20 pb-16">
      
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/2 via-purple-500/2 to-pink-500/2 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===== HERO SECTION ===== */}
        <section
          ref={sectionRefs.hero}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-1000"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-400">AdroIT Team Directory</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            The passionate minds driving innovation across 
            <span className="text-cyan-400"> Machine Learning</span>,{' '}
            <span className="text-purple-400"> Cloud Computing</span>,{' '}
            <span className="text-pink-400"> Cybersecurity</span>, and{' '}
            <span className="text-green-400"> Data Analytics</span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur px-6 py-4 rounded-2xl border border-white/10">
              <span className="text-3xl">👥</span>
              <div>
                <span className="text-2xl font-bold text-white">{teamMembers.length}</span>
                <span className="text-gray-400 text-sm ml-2">Total Members</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur px-6 py-4 rounded-2xl border border-white/10">
              <span className="text-3xl">🎯</span>
              <div>
                <span className="text-2xl font-bold text-white">4</span>
                <span className="text-gray-400 text-sm ml-2">Domains</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur px-6 py-4 rounded-2xl border border-white/10">
              <span className="text-3xl">🚀</span>
              <div>
                <span className="text-2xl font-bold text-white">{domainLeads.length}</span>
                <span className="text-gray-400 text-sm ml-2">Domain Leads</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DOMAIN FILTER TABS ===== */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setActiveTab(domain.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === domain.id
                    ? `bg-gradient-to-r ${domain.color} text-white shadow-lg scale-105`
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {typeof domain.icon === 'string' ? (
                  <span>{domain.icon}</span>
                ) : (
                  <span className="w-4 h-4">{domain.icon}</span>
                )}
                <span>{domain.name}</span>
                {domain.id !== 'all' && (
                  <span className="ml-1 text-xs opacity-80">
                    ({teamMembers.filter(m => m.domain === domain.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ===== LEADERSHIP SECTION ===== */}
        {activeTab === 'all' && leadership.length > 0 && (
          <section ref={sectionRefs.leadership} className="mb-16 opacity-0 translate-y-8 transition-all duration-1000">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Club Leadership</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((member) => (
                <MemberCard 
                  key={member._id} 
                  member={member} 
                  variant="leadership"
                  domainColor={domains.find(d => d.id === member.domain)?.color}
                  onClick={() => setSelectedMember(member)}
                  getCloudinaryUrl={getCloudinaryUrl}
                  icons={icons}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===== DOMAIN LEADS SECTION ===== */}
        {activeTab === 'all' ? (
          // Group by domain for "All Members" view
          domains.filter(d => d.id !== 'all').map((domain) => {
            const domainMembers = teamMembers.filter(m => m.domain === domain.id);
            if (domainMembers.length === 0) return null;

            const domainLeadsList = domainMembers.filter(m => m.role === 'Domain Lead' || m.role?.includes('Head'));
            const otherMembers = domainMembers.filter(m => !(m.role === 'Domain Lead' || m.role?.includes('Head')));

            return (
              <section key={domain.id} ref={sectionRefs.domains} className="mb-16 opacity-0 translate-y-8 transition-all duration-1000">
                {/* Domain Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-2xl`}>
                    <span className="w-6 h-6">{domain.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{domain.name}</h2>
                    <p className="text-gray-500 text-sm">{domainMembers.length} members</p>
                  </div>
                </div>

                {/* Domain Leads */}
                {domainLeadsList.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-400 mb-4 flex items-center gap-2">
                      {icons.crown} Domain Leads
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {domainLeadsList.map((member) => (
                        <MemberCard 
                          key={member._id} 
                          member={member} 
                          variant="lead"
                          domainColor={domain.color}
                          onClick={() => setSelectedMember(member)}
                          getCloudinaryUrl={getCloudinaryUrl}
                          icons={icons}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Members */}
                {otherMembers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                      Team Members
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {otherMembers.map((member) => (
                        <MemberCard 
                          key={member._id} 
                          member={member} 
                          variant="compact"
                          domainColor={domain.color}
                          onClick={() => setSelectedMember(member)}
                          getCloudinaryUrl={getCloudinaryUrl}
                          icons={icons}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })
        ) : (
          // Single domain view
          <section className="space-y-8">
            {/* Domain Hero */}
            {(() => {
              const domain = domains.find(d => d.id === activeTab);
              const domainMembers = teamMembers.filter(m => m.domain === activeTab);
              const domainLeadsList = domainMembers.filter(m => m.role === 'Domain Lead' || m.role?.includes('Head'));
              const otherMembers = domainMembers.filter(m => !(m.role === 'Domain Lead' || m.role?.includes('Head')));

              return (
                <>
                  <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${domain.lightColor} border ${domain.borderColor} p-8`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${domain.color}/10`}></div>
                    <div className="relative z-10 flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-3xl`}>
                        <span className="w-8 h-8">{domain.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{domain.name}</h2>
                        <p className="text-gray-400">{domainMembers.length} members</p>
                      </div>
                    </div>
                  </div>

                  {/* Domain Leads */}
                  {domainLeadsList.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-400 mb-4 flex items-center gap-2">
                        {icons.crown} Domain Leads
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {domainLeadsList.map((member) => (
                          <MemberCard 
                            key={member._id} 
                            member={member} 
                            variant="lead"
                            domainColor={domain.color}
                            onClick={() => setSelectedMember(member)}
                            getCloudinaryUrl={getCloudinaryUrl}
                            icons={icons}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Members */}
                  {otherMembers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        Team Members
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {otherMembers.map((member) => (
                          <MemberCard 
                            key={member._id} 
                            member={member} 
                            variant="compact"
                            domainColor={domain.color}
                            onClick={() => setSelectedMember(member)}
                            getCloudinaryUrl={getCloudinaryUrl}
                            icons={icons}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </section>
        )}

        {/* ===== JOIN CTA ===== */}
        {!isLoggedIn && (
          <section className="mt-16 text-center">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Want to be part of this team?
                </h2>
                <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                  Join AdroIT and work on cutting-edge projects with talented peers
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                  >
                    Join AdroIT Now
                  </Link>
                  <Link
                    to="/domains"
                    className="px-8 py-4 bg-white/5 backdrop-blur border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                  >
                    Explore Domains
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ===== MEMBER DETAIL MODAL ===== */}
      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />

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
// MEMBER CARD COMPONENT - 3 VARIANTS
// ============================================
function MemberCard({ member, variant = 'compact', domainColor, onClick, getCloudinaryUrl, icons }) {
  
  const variants = {
    leadership: {
      container: 'col-span-1 md:col-span-1',
      card: 'p-6 md:p-8',
      avatar: 'w-24 h-24 md:w-28 md:h-28',
      name: 'text-xl md:text-2xl',
      role: 'text-sm',
      showSocial: true,
      showBio: true
    },
    lead: {
      card: 'p-5',
      avatar: 'w-20 h-20 md:w-24 md:h-24',
      name: 'text-lg md:text-xl',
      role: 'text-xs',
      showSocial: false,
      showBio: false
    },
    compact: {
      card: 'p-4',
      avatar: 'w-16 h-16',
      name: 'text-sm md:text-base',
      role: 'text-xs',
      showSocial: false,
      showBio: false
    }
  };

  const style = variants[variant] || variants.compact;

  // Get domain details
  const domainColors = {
    ml: 'from-cyan-500 to-cyan-600',
    cc: 'from-purple-500 to-purple-600',
    cy: 'from-pink-500 to-pink-600',
    da: 'from-green-500 to-green-600'
  };

  const domainColor_ = domainColor || domainColors[member.domain] || 'from-gray-500 to-gray-600';

  return (
    <div
      onClick={onClick}
      className={`group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl ${style.card} transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer`}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Avatar with Cloudinary image */}
        <div className={`relative ${style.avatar} mb-4`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${domainColor_} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
          
          {member.imagePublicId ? (
            <img
              src={getCloudinaryUrl(member.imagePublicId, 200, 200)}
              alt={member.name}
              className="relative w-full h-full object-cover rounded-2xl border-2 border-white/10 group-hover:border-cyan-400/50 transition-all duration-300"
              loading="lazy"
            />
          ) : (
            <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${domainColor_} flex items-center justify-center text-white font-bold text-2xl md:text-3xl border-2 border-white/10 group-hover:border-cyan-400/50 transition-all duration-300`}>
              {member.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Role badge for leadership */}
          {variant === 'leadership' && member.role === 'President' && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-[#0d1117]">
              <span className="text-white text-xs">{icons.crown}</span>
            </div>
          )}
        </div>

        {/* Member info */}
        <h3 className={`${style.name} font-bold text-white group-hover:text-cyan-400 transition-colors mb-1`}>
          {member.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
            member.role === 'President' ? 'bg-yellow-500/20 text-yellow-400' :
            member.role === 'Domain Lead' ? 'bg-purple-500/20 text-purple-400' :
            member.role === 'Core Member' ? 'bg-blue-500/20 text-blue-400' :
            'bg-white/10 text-gray-300'
          }`}>
            {member.role}
          </span>
        </div>

        {style.showBio && member.bio && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
            {member.bio}
          </p>
        )}

        {/* Social links - only for leadership variant */}
        {style.showSocial && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors" onClick={e => e.stopPropagation()}>
                {icons.linkedin}
              </a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors" onClick={e => e.stopPropagation()}>
                {icons.github}
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors" onClick={e => e.stopPropagation()}>
                {icons.mail}
              </a>
            )}
          </div>
        )}

        {/* View profile indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-cyan-400 flex items-center gap-1">
            View {icons.arrow}
          </span>
        </div>
      </div>
    </div>
  );
}