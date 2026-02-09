import React, { useEffect, useRef } from 'react';

const Team = () => {
  const heroRef = useRef(null);
  const leadershipRef = useRef(null);
  const domainRef = useRef(null);
  const operationsRef = useRef(null);
  const coreRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    const refs = [heroRef, leadershipRef, domainRef, operationsRef, coreRef];
    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const leadership = [
    {
      name: "Aarav Sharma",
      role: "President",
      tagline: "Driving vision & strategy",
      photoColor: "from-cyan-500 to-cyan-600",
      accent: "border-cyan-500"
    },
    {
      name: "Priya Patel",
      role: "Vice President",
      tagline: "Leading operations & growth",
      photoColor: "from-purple-500 to-purple-600",
      accent: "border-purple-500"
    }
  ];

  const domainHeads = [
    {
      name: "Rohan Kumar",
      domain: "Machine Learning",
      description: "AI & deep learning projects",
      color: "from-cyan-500 to-cyan-600",
      badgeColor: "bg-cyan-500/20 text-cyan-400"
    },
    {
      name: "Ananya Singh",
      domain: "Cloud Computing",
      description: "Infrastructure & deployment",
      color: "from-purple-500 to-purple-600",
      badgeColor: "bg-purple-500/20 text-purple-400"
    },
    {
      name: "Kabir Malhotra",
      domain: "Cybersecurity",
      description: "Security & ethical hacking",
      color: "from-pink-500 to-pink-600",
      badgeColor: "bg-pink-500/20 text-pink-400"
    },
    {
      name: "Neha Reddy",
      domain: "Data Analytics",
      description: "Insights & visualization",
      color: "from-cyan-500 to-purple-600",
      badgeColor: "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300"
    }
  ];

  const operations = [
    {
      name: "Vikram Joshi",
      role: "Project & Development Head",
      description: "Technical project management",
      type: "project",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      name: "Sanya Verma",
      role: "Project & Development Head",
      description: "Development pipeline",
      type: "project",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Arjun Mehta",
      role: "Events & Outreach Head",
      description: "Workshops & industry connect",
      type: "events",
      color: "from-pink-500 to-pink-600"
    },
    {
      name: "Ishika Das",
      role: "Social Media Lead",
      description: "Community & engagement",
      type: "social",
      color: "from-cyan-500 to-purple-600"
    }
  ];

  const coreMembers = [
    "Aditya Nair", "Mehak Choudhary", "Rahul Bose", "Pooja Iyer",
    "Karthik Menon", "Divya Srinivasan", "Sanjay Kapoor"
  ];

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/2 to-purple-600/2 rounded-full blur-[80px]"></div>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-[60vh] flex items-center justify-center relative px-8 py-20 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-4xl text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-gray-400">
            <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></span>
            <span>AdroIT Leadership Team</span>
          </div>

          <h1 className="mb-6">
            <span className="block text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent leading-none tracking-tight">
              Meet Our Team
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8">
            The passionate minds driving <span className="text-cyan-400">innovation</span>,{" "}
            <span className="text-purple-400">collaboration</span>, and{" "}
            <span className="text-pink-400">technical excellence</span> at AdroIT
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From visionary leadership to domain expertise, meet the team building the future of technology education.
          </p>
        </div>

        {/* Animated rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none">
          <div className="absolute w-full h-full border border-cyan-500/15 rounded-full animate-spin-slow"></div>
          <div className="absolute w-[70%] h-[70%] top-[15%] left-[15%] border border-purple-500/10 rounded-full animate-spin-slower-reverse"></div>
        </div>
      </section>

      {/* Leadership Section */}
      <section 
        ref={leadershipRef}
        className="py-16 px-8 opacity-0 translate-y-8 transition-all duration-1000 delay-300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">01 // Leadership</span>
              <div className="w-16 h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">AdroIT Present Heads</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Visionary leaders shaping the club&apos;s direction and culture
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {leadership.map((lead, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${lead.photoColor} rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500`}></div>
                <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
                  {/* Photo placeholder with gradient */}
                  <div className={`w-32 h-32 ${lead.photoColor} rounded-2xl mb-8 mx-auto flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{lead.name}</h3>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 mb-3 bg-gradient-to-r ${lead.photoColor.replace('from-', 'from-').replace('to-', 'to-')} bg-opacity-20 rounded-full border ${lead.accent}`}>
                      <span className="font-bold">{lead.role}</span>
                    </div>
                    <p className="text-gray-400 text-lg">{lead.tagline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Heads Section */}
      <section 
        ref={domainRef}
        className="py-16 px-8 bg-gradient-to-b from-transparent to-white/5 opacity-0 translate-y-8 transition-all duration-1000 delay-500"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">02 // Expertise</span>
              <div className="w-16 h-px bg-gradient-to-r from-purple-500 to-transparent"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Domain Heads</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Specialists leading our core technical verticals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domainHeads.map((domain, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 h-full">
                  {/* Photo placeholder */}
                  <div className={`w-20 h-20 ${domain.color} rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{domain.name}</h3>
                  <div className={`inline-flex items-center px-3 py-1.5 mb-3 ${domain.badgeColor} rounded-lg text-sm font-medium`}>
                    {domain.domain}
                  </div>
                  <p className="text-gray-400 text-sm">{domain.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operations Section */}
      <section 
        ref={operationsRef}
        className="py-16 px-8 opacity-0 translate-y-8 transition-all duration-1000 delay-700"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">03 // Operations</span>
              <div className="w-16 h-px bg-gradient-to-r from-pink-500 to-transparent"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Operations Team</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Driving execution, events, and community engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {operations.map((op, index) => (
              <div 
                key={index}
                className={`group relative ${op.type === 'events' || op.type === 'social' ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 h-full">
                  {/* Photo placeholder */}
                  <div className={`w-16 h-16 ${op.color} rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{op.name}</h3>
                  <div className={`inline-flex items-center px-3 py-1 mb-3 ${
                    op.type === 'project' ? 'bg-cyan-500/20 text-cyan-400' :
                    op.type === 'events' ? 'bg-pink-500/20 text-pink-400' :
                    'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300'
                  } rounded-lg text-sm font-medium`}>
                    {op.role}
                  </div>
                  <p className="text-gray-400 text-sm">{op.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Members Section */}
      <section 
        ref={coreRef}
        className="py-16 px-8 bg-gradient-to-b from-transparent to-white/5 opacity-0 translate-y-8 transition-all duration-1000 delay-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">04 // Foundation</span>
              <div className="w-16 h-px bg-gradient-to-r from-cyan-500 to-purple-500"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Senior Members</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              The backbone of AdroIT&apos;s technical projects and mentorship
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {coreMembers.map((member, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-black/30 backdrop-blur-xl border border-white/5 rounded-xl p-6 hover:border-white/15 transition-all duration-300">
                  {/* Photo placeholder */}
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg mb-4 mx-auto flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-sm font-bold mb-1">{member}</h3>
                    <div className="inline-flex items-center px-2 py-1 bg-white/5 rounded text-xs text-gray-400 font-medium">
                      Core Member
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <span className="text-gray-400">Growing team of 30+ passionate members</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="py-12 px-8 text-center">
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Interested in joining our team?{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
            Apply for upcoming recruitments
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes spin-slower-reverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slower-reverse {
          animation: spin-slower-reverse 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Team;