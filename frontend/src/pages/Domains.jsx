import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../lib/auth-client';

export default function Domains() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [activeDomain, setActiveDomain] = useState('ml');
  const [hoveredDomain, setHoveredDomain] = useState(null);
  
  const sectionRefs = {
    hero: useRef(null),
    overview: useRef(null),
    domains: useRef(null)
  };

  // ===== SVG ICONS =====
  const icons = {
    ml: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-2.88-2.88c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l3.59 3.59c.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.38-1.41 0z" fill="currentColor"/>
      </svg>
    ),
    cc: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z" fill="currentColor"/>
        <path d="M12 10v2h2v2h-2v2h-2v-2H8v-2h2v-2h2z" fill="currentColor"/>
      </svg>
    ),
    cy: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
      </svg>
    ),
    da: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
      </svg>
    ),
    members: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-1 .05 1.16.84 2 1.87 2 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
      </svg>
    ),
    projects: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z" fill="currentColor"/>
      </svg>
    ),
    resources: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 6H2v12h20V8zm-2 10H4v-8h16v8z" fill="currentColor"/>
      </svg>
    ),
    career: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z" fill="currentColor"/>
      </svg>
    ),
    skills: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
      </svg>
    ),
    tools: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.79 2.59 5.01 4 8.19 4s6.4-1.41 8.19-4H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-4 6c0 2.76-2.24 5-5 5s-5-2.24-5-5V9c0-2.76 2.24-5 5-5s5 2.24 5 5v5z" fill="currentColor"/>
      </svg>
    ),
    roadmap: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" fill="currentColor"/>
      </svg>
    ),
    community: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7zm0 4h8v2H7z" fill="currentColor"/>
      </svg>
    ),
    arrow: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
      </svg>
    ),
    arrowRight: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor"/>
      </svg>
    ),
    check: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
      </svg>
    ),
    book: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 6H2v12h20V8zm-2 10H4v-8h16v8z" fill="currentColor"/>
      </svg>
    ),
    domain: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill="currentColor"/>
      </svg>
    )
  };

  // ===== DOMAIN DEFINITIONS =====
  const domains = [
    {
      id: 'ml',
      name: 'Machine Learning',
      shortName: 'ML',
      icon: icons.ml,
      color: 'from-cyan-500 to-cyan-600',
      lightColor: 'from-cyan-400/20 to-cyan-600/20',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      gradient: 'bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-transparent',
      description: 'Build intelligent systems that learn, adapt, and make decisions from data.',
      longDescription: 'Machine Learning empowers computers to learn without explicit programming. From recommendation systems to self-driving cars, ML is revolutionizing every industry.',
      careerPaths: ['AI Engineer', 'ML Engineer', 'Data Scientist', 'Research Scientist', 'Computer Vision Engineer'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Neural Networks', 'Computer Vision', 'NLP', 'Reinforcement Learning'],
      tools: ['Jupyter', 'Google Colab', 'AWS SageMaker', 'Hugging Face', 'Keras'],
      projects: [
        { name: 'Image Classifier', difficulty: 'Beginner', icon: '🖼️' },
        { name: 'Sentiment Analysis', difficulty: 'Intermediate', icon: '💬' },
        { name: 'Object Detection', difficulty: 'Advanced', icon: '👁️' },
        { name: 'Recommendation System', difficulty: 'Intermediate', icon: '🎬' }
      ],
      resources: [
        { title: 'ML Crash Course', type: 'Course', provider: 'Google' },
        { title: 'Deep Learning Specialization', type: 'Course', provider: 'Andrew Ng' },
        { title: 'Fast.ai', type: 'Course', provider: 'Jeremy Howard' }
      ],
      stats: {
        members: 8,
        projects: 12,
        events: 6,
        resources: 24
      },
      leads: ['Sarah Chen', 'Rohan Kumar'],
      roadmap: [
        'Python Basics',
        'Math Fundamentals',
        'ML Algorithms',
        'Deep Learning',
        'Specialization'
      ]
    },
    {
      id: 'cc',
      name: 'Cloud Computing',
      shortName: 'Cloud',
      icon: icons.cc,
      color: 'from-purple-500 to-purple-600',
      lightColor: 'from-purple-400/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      gradient: 'bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent',
      description: 'Design, deploy, and scale applications on world-class cloud infrastructure.',
      longDescription: 'Cloud Computing delivers on-demand computing resources over the internet. Master AWS, Azure, GCP and modern DevOps practices to build resilient, scalable applications.',
      careerPaths: ['Cloud Architect', 'DevOps Engineer', 'Site Reliability Engineer', 'Cloud Developer', 'Platform Engineer'],
      skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Serverless'],
      tools: ['AWS Console', 'Azure Portal', 'Google Cloud Console', 'Docker Desktop', 'kubectl', 'Jenkins'],
      projects: [
        { name: 'Serverless API', difficulty: 'Beginner', icon: '⚡' },
        { name: 'Containerized App', difficulty: 'Intermediate', icon: '🐳' },
        { name: 'K8s Cluster', difficulty: 'Advanced', icon: '⎈' },
        { name: 'Cloud Monitoring', difficulty: 'Intermediate', icon: '📊' }
      ],
      resources: [
        { title: 'AWS Training', type: 'Certification', provider: 'Amazon' },
        { title: 'Kubernetes Basics', type: 'Course', provider: 'Google' },
        { title: 'DevOps Roadmap', type: 'Guide', provider: 'Community' }
      ],
      stats: {
        members: 6,
        projects: 8,
        events: 4,
        resources: 18
      },
      leads: ['Ananya Singh', 'Vikram Joshi'],
      roadmap: [
        'Networking Basics',
        'One Cloud Platform',
        'Containers',
        'Orchestration',
        'DevOps Practices'
      ]
    },
    {
      id: 'cy',
      name: 'Cybersecurity',
      shortName: 'Cyber',
      icon: icons.cy,
      color: 'from-pink-500 to-pink-600',
      lightColor: 'from-pink-400/20 to-pink-600/20',
      borderColor: 'border-pink-500/30',
      textColor: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      gradient: 'bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-transparent',
      description: 'Protect systems, networks, and data from evolving cyber threats.',
      longDescription: 'Cybersecurity defends computers, servers, networks, and data from malicious attacks. Learn ethical hacking, cryptography, and security architecture to become a security expert.',
      careerPaths: ['Security Analyst', 'Penetration Tester', 'Security Engineer', 'SOC Analyst', 'Cryptographer'],
      skills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Incident Response', 'Risk Assessment', 'Forensics'],
      tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Nmap', 'John the Ripper'],
      projects: [
        { name: 'Network Scanner', difficulty: 'Beginner', icon: '🔍' },
        { name: 'Password Cracker', difficulty: 'Intermediate', icon: '🔑' },
        { name: 'Web App Pentest', difficulty: 'Advanced', icon: '🌐' },
        { name: 'Security Audit', difficulty: 'Intermediate', icon: '📋' }
      ],
      resources: [
        { title: 'TryHackMe', type: 'Platform', provider: 'Community' },
        { title: 'Cybersecurity Basics', type: 'Course', provider: 'Coursera' },
        { title: 'OWASP Top 10', type: 'Guide', provider: 'OWASP' }
      ],
      stats: {
        members: 5,
        projects: 6,
        events: 3,
        resources: 15
      },
      leads: ['Kabir Malhotra'],
      roadmap: [
        'Networking',
        'Operating Systems',
        'Security Fundamentals',
        'Ethical Hacking',
        'Specialization'
      ]
    },
    {
      id: 'da',
      name: 'Data Analytics',
      shortName: 'DA',
      icon: icons.da,
      color: 'from-green-500 to-green-600',
      lightColor: 'from-green-400/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      gradient: 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent',
      description: 'Extract actionable insights from complex datasets to drive decisions.',
      longDescription: 'Data Analytics transforms raw data into meaningful insights. Master data visualization, statistical analysis, and business intelligence to become a data-driven decision maker.',
      careerPaths: ['Data Analyst', 'Business Intelligence Analyst', 'Data Engineer', 'Analytics Manager', 'BI Developer'],
      skills: ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Statistics', 'Data Visualization'],
      tools: ['PostgreSQL', 'MySQL', 'Tableau', 'Power BI', 'Pandas', 'Matplotlib', 'Looker'],
      projects: [
        { name: 'Sales Dashboard', difficulty: 'Beginner', icon: '📉' },
        { name: 'Customer Segmentation', difficulty: 'Intermediate', icon: '👥' },
        { name: 'Predictive Analytics', difficulty: 'Advanced', icon: '🔮' },
        { name: 'ETL Pipeline', difficulty: 'Intermediate', icon: '🔄' }
      ],
      resources: [
        { title: 'SQL for Data Science', type: 'Course', provider: 'Coursera' },
        { title: 'Python Data Analysis', type: 'Course', provider: 'DataCamp' },
        { title: 'Tableau Public', type: 'Tool', provider: 'Salesforce' }
      ],
      stats: {
        members: 7,
        projects: 10,
        events: 5,
        resources: 20
      },
      leads: ['Neha Reddy'],
      roadmap: [
        'Excel Basics',
        'SQL Mastery',
        'Python/R',
        'Visualization',
        'Advanced Analytics'
      ]
    }
  ];

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

  const currentDomain = domains.find(d => d.id === activeDomain) || domains[0];

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip pt-20 pb-16">
      
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/2 via-purple-500/2 to-pink-500/2 rounded-full blur-[150px]"></div>
      </div>

      {/* ===== FLOATING PARTICLES ===== */}
      <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              activeDomain === 'ml' ? 'bg-cyan-400/30' :
              activeDomain === 'cc' ? 'bg-purple-400/30' :
              activeDomain === 'cy' ? 'bg-pink-400/30' :
              'bg-green-400/30'
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===== HERO SECTION ===== */}
        <section
          ref={sectionRefs.hero}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-1000"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-400">AdroIT Knowledge Hub</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Technical Domains
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Master the four pillars of modern technology with our comprehensive learning paths,
            <span className="text-cyan-400"> hands-on projects</span>, and
            <span className="text-purple-400"> expert mentorship</span>
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur px-6 py-4 rounded-2xl border border-white/10">
              <span className="text-3xl">🎯</span>
              <div>
                <span className="text-2xl font-bold text-white">4</span>
                <span className="text-gray-400 text-sm ml-2">Core Domains</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur px-6 py-4 rounded-2xl border border-white/10">
              <span className="text-3xl">🚀</span>
              <div>
                <span className="text-2xl font-bold text-white">36+</span>
                <span className="text-gray-400 text-sm ml-2">Projects</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur px-6 py-4 rounded-2xl border border-white/10">
              <span className="text-3xl">👥</span>
              <div>
                <span className="text-2xl font-bold text-white">26+</span>
                <span className="text-gray-400 text-sm ml-2">Members</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DOMAIN SELECTOR ===== */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                onMouseEnter={() => setHoveredDomain(domain.id)}
                onMouseLeave={() => setHoveredDomain(null)}
                className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500 ${
                  activeDomain === domain.id
                    ? `bg-gradient-to-r ${domain.color} text-white shadow-lg scale-105`
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {activeDomain === domain.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${domain.color} rounded-2xl blur-xl opacity-50 animate-pulse`}></div>
                )}
                
                <span className="relative w-6 h-6">{domain.icon}</span>
                <span className="relative font-semibold">{domain.name}</span>
                
                {hoveredDomain === domain.id && activeDomain !== domain.id && (
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 whitespace-nowrap z-50 animate-fade-in">
                    <div className="flex gap-4 text-xs">
                      <div><span className="text-cyan-400">{domain.stats.members}</span> members</div>
                      <div><span className="text-purple-400">{domain.stats.projects}</span> projects</div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ===== ACTIVE DOMAIN DASHBOARD ===== */}
        <section
          key={activeDomain}
          className="opacity-0 translate-y-8 animate-fade-in-up"
        >
          {/* Domain Hero Banner */}
          <div className={`relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br ${currentDomain.lightColor} border ${currentDomain.borderColor}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${currentDomain.color}/10`}></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${currentDomain.color} flex items-center justify-center text-4xl md:text-5xl shadow-xl`}>
                    <div className="w-12 h-12 md:w-14 md:h-14">
                      {currentDomain.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl md:text-4xl font-bold text-white">{currentDomain.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border ${currentDomain.borderColor}`}>
                        {currentDomain.shortName}
                      </span>
                    </div>
                    <p className="text-gray-300 text-lg max-w-2xl">{currentDomain.description}</p>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="flex gap-3">
                  <div className="bg-black/40 backdrop-blur px-4 py-3 rounded-xl border border-white/10">
                    <div className={`text-2xl font-bold ${currentDomain.textColor}`}>
                      {currentDomain.stats.members}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      {icons.members} Members
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur px-4 py-3 rounded-xl border border-white/10">
                    <div className={`text-2xl font-bold ${currentDomain.textColor}`}>
                      {currentDomain.stats.projects}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      {icons.projects} Projects
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur px-4 py-3 rounded-xl border border-white/10">
                    <div className={`text-2xl font-bold ${currentDomain.textColor}`}>
                      {currentDomain.stats.resources}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      {icons.resources} Resources
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Column 1: About & Career */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* About Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className={`text-lg font-bold ${currentDomain.textColor} mb-3 flex items-center gap-2`}>
                  {icons.domain} About This Domain
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentDomain.longDescription}
                </p>
              </div>

              {/* Career Paths Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className={`text-lg font-bold ${currentDomain.textColor} mb-4 flex items-center gap-2`}>
                  {icons.career} Career Paths
                </h3>
                <div className="space-y-2">
                  {currentDomain.careerPaths.map((career, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-cyan-400">{icons.check}</span>
                      <span className="text-gray-300">{career}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain Leads Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className={`text-lg font-bold ${currentDomain.textColor} mb-4 flex items-center gap-2`}>
                  {icons.members} Domain Leads
                </h3>
                <div className="space-y-3">
                  {currentDomain.leads.map((lead, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentDomain.color} flex items-center justify-center text-white text-xs font-bold`}>
                        {lead.charAt(0)}
                      </div>
                      <span className="text-white text-sm font-medium">{lead}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/members"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  View all team members {icons.arrow}
                </Link>
              </div>
            </div>

            {/* Column 2: Skills, Tools, Projects */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Skills Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className={`text-lg font-bold ${currentDomain.textColor} mb-4 flex items-center gap-2`}>
                  {icons.skills} Skills to Master
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentDomain.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${currentDomain.bgColor} ${currentDomain.textColor} border ${currentDomain.borderColor}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className={`text-lg font-bold ${currentDomain.textColor} mb-4 flex items-center gap-2`}>
                  {icons.tools} Popular Tools
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentDomain.tools.map((tool, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-xs">{icons.tools}</span>
                      <span className="text-gray-300 text-xs">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Projects Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className={`text-lg font-bold ${currentDomain.textColor} mb-4 flex items-center gap-2`}>
                  {icons.projects} Sample Projects
                </h3>
                <div className="space-y-3">
                  {currentDomain.projects.map((project, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{project.icon}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{project.name}</div>
                          <span className={`text-xs ${
                            project.difficulty === 'Beginner' ? 'text-green-400' :
                            project.difficulty === 'Intermediate' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {project.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Roadmap & Resources */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Learning Roadmap Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className={`text-lg font-bold ${currentDomain.textColor} mb-4 flex items-center gap-2`}>
                  {icons.roadmap} Learning Roadmap
                </h3>
                <div className="relative">
                  {currentDomain.roadmap.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 mb-4 last:mb-0">
                      <div className="relative">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentDomain.color} flex items-center justify-center text-white text-xs font-bold`}>
                          {idx + 1}
                        </div>
                        {idx < currentDomain.roadmap.length - 1 && (
                          <div className={`absolute top-6 left-3 w-0.5 h-8 bg-gradient-to-b ${currentDomain.color}`}></div>
                        )}
                      </div>
                      <div>
                        <span className="text-white text-sm font-medium">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Resources Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className={`text-lg font-bold ${currentDomain.textColor} mb-4 flex items-center gap-2`}>
                  {icons.book} Recommended Resources
                </h3>
                <div className="space-y-3">
                  {currentDomain.resources.map((resource, idx) => (
                    <div key={idx} className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-white text-sm font-medium">{resource.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{resource.type}</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-500">{resource.provider}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/resources/${activeDomain}`}
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Explore All {currentDomain.shortName} Resources
                  {icons.arrowRight}
                </Link>
              </div>

              {/* Community Card - Now shows different content based on login status */}
              <div className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{icons.community}</span>
                  <h3 className="text-lg font-bold text-white">Join the Community</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Connect with peers, ask questions, and collaborate on projects
                </p>
                {isLoggedIn ? (
                  <Link
                    to={`/resources/${activeDomain}`}
                    className="block w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl text-center transition-all duration-300"
                  >
                    Start Learning
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold rounded-xl text-center hover:scale-105 transition-all duration-300"
                  >
                    Sign In to Access
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Domain Comparison Table */}
          <div className="mt-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-x-auto">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              {icons.da} Domain Comparison
            </h3>
            
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Domain</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Members</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Projects</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Resources</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Lead</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((domain) => (
                  <tr 
                    key={domain.id} 
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                      activeDomain === domain.id ? 'bg-white/5' : ''
                    }`}
                    onClick={() => setActiveDomain(domain.id)}
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5">{domain.icon}</span>
                        <span className="text-white font-medium">{domain.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-gray-300">{domain.stats.members}</td>
                    <td className="py-4 px-2 text-gray-300">{domain.stats.projects}</td>
                    <td className="py-4 px-2 text-gray-300">{domain.stats.resources}</td>
                    <td className="py-4 px-2">
                      <span className="text-gray-300">{domain.leads[0]}</span>
                    </td>
                    <td className="py-4 px-2">
                      <Link
                        to={`/resources/${domain.id}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Resources
                        {icons.arrow}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== CTA SECTION - ONLY VISIBLE WHEN NOT LOGGED IN ===== */}
        {!isLoggedIn && (
          <section className="mt-16 text-center">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Master Your Domain?
                </h2>
                <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                  Access curated resources, join project teams, and connect with domain experts
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                  >
                    Sign In to Access Resources
                  </Link>
                  <Link
                    to="/members"
                    className="px-8 py-4 bg-white/5 backdrop-blur border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                  >
                    Meet the Team
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
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
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 8s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 20s linear infinite; }
      `}</style>
    </div>
  );
}