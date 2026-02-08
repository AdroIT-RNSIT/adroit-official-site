import React, { useEffect, useRef } from 'react';
import ThreeScene from '../home/ThreeScene';

const Home = () => {
  const heroRef = useRef(null);
  const interactiveRef = useRef(null);
  const aboutRef = useRef(null);
  const eventsRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-12');
        }
      });
    }, observerOptions);

    if (heroRef.current) observer.observe(heroRef.current);
    if (interactiveRef.current) observer.observe(interactiveRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (eventsRef.current) observer.observe(eventsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0a0a0f] to-[#1a0a2e] text-white font-sans overflow-x-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar and Sidebar moved to MainLayout */}
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative px-8 py-20 opacity-0 translate-y-12 transition-all duration-1000"
      >
        <div className="max-w-4xl text-center z-10 relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-gray-400">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
            <span>CSE Innovation Hub</span>
          </div>

          {/* Title */}
          <h1 className="mb-6">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 uppercase tracking-[0.2em] mb-2">
              Welcome to
            </span>
            <span className="block text-6xl md:text-8xl lg:text-9xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent leading-none tracking-tight drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
              AdroIT
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12">
            Pioneering low-code development and empowering skill mastery
            <br />
            through hands-on innovation and collaborative growth
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden w-full sm:w-auto">
              <span className="relative z-10">Join the Club</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="relative z-10">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            
            <button className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:-translate-y-1 hover:border-white/20 transition-all duration-300 w-full sm:w-auto">
              Explore Events
            </button>
          </div>
        </div>

        {/* Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-cyan-500/10 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-purple-500/10 rounded-full animate-spin-slower-reverse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] border border-pink-500/10 rounded-full animate-spin-slowest"></div>
        </div>
      </section>

      {/* Three.js Interactive Section - Seamlessly Blended */}
      <section 
        ref={interactiveRef}
        className="min-h-[70vh] relative flex items-center justify-center py-20 opacity-0 translate-y-12 transition-all duration-1000"
      >
        {/* Three.js Canvas Background */}
        <ThreeScene />
        
        {/* Content Overlay */}
        <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-6 drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            Experience Innovation
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8">
            Where code meets creativity in three dimensions
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Interact with the particles by moving your mouse or touching the screen. 
            Watch as technology and artistry blend together in real-time.
          </p>
        </div>

        {/* Gradient overlays for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0f] to-transparent pointer-events-none z-5"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-5"></div>
      </section>

      {/* About Preview Section */}
      <section 
        ref={aboutRef}
        className="py-32 px-8 opacity-0 translate-y-12 transition-all duration-1000"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-cyan-400 uppercase tracking-wider mb-4">
              Our Mission
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Building Tomorrow's Developers
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:-translate-y-3 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-cyan-400/30 to-purple-600/20 rounded-2xl mb-6 text-cyan-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Low-Code Excellence</h3>
                <p className="text-gray-400 leading-relaxed">
                  Master rapid development frameworks and build powerful applications with minimal coding complexity
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:-translate-y-3 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-cyan-400/30 to-purple-600/20 rounded-2xl mb-6 text-cyan-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Collaborative Growth</h3>
                <p className="text-gray-400 leading-relaxed">
                  Join a vibrant community of learners, innovators, and builders working together on real-world projects
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:-translate-y-3 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-cyan-400/30 to-purple-600/20 rounded-2xl mb-6 text-cyan-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Skill Development</h3>
                <p className="text-gray-400 leading-relaxed">
                  Enhance your technical expertise through workshops, hackathons, and mentorship from industry professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Highlight Section */}
      <section 
        ref={eventsRef}
        className="py-32 px-8 opacity-0 translate-y-12 transition-all duration-1000"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-cyan-400 uppercase tracking-wider mb-4">
              What's Happening
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Event Card */}
            <div className="relative group p-8 bg-gradient-to-br from-cyan-400/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:-translate-y-3 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-500 flex flex-col md:flex-row lg:flex-col gap-6">
              <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-400 text-black text-xs font-bold rounded-full uppercase">
                Featured
              </div>
              
              <div className="flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl text-black">
                <span className="text-3xl font-bold leading-none">24</span>
                <span className="text-xs font-semibold uppercase tracking-wider">FEB</span>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-3 text-white">Low-Code Hackathon 2026</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  48-hour innovation challenge to build impactful applications using modern low-code platforms
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Hybrid Event
                  </span>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    2 Days
                  </span>
                </div>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="group p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:-translate-y-3 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-500 flex flex-col md:flex-row lg:flex-col gap-6">
              <div className="flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl text-black">
                <span className="text-3xl font-bold leading-none">15</span>
                <span className="text-xs font-semibold uppercase tracking-wider">MAR</span>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-3 text-white">AI & Automation Workshop</h3>
                <p className="text-gray-400 leading-relaxed">
                  Learn to integrate AI capabilities into your low-code applications
                </p>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="group p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:-translate-y-3 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-500 flex flex-col md:flex-row lg:flex-col gap-6">
              <div className="flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl text-black">
                <span className="text-3xl font-bold leading-none">05</span>
                <span className="text-xs font-semibold uppercase tracking-wider">APR</span>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-3 text-white">Industry Expert Talk</h3>
                <p className="text-gray-400 leading-relaxed">
                  Guest lecture on the future of rapid application development
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer moved to MainLayout */}

      {/* Custom animations in style tag */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes spin-slower-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        
        @keyframes spin-slowest {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slower-reverse {
          animation: spin-slower-reverse 15s linear infinite;
        }
        
        .animate-spin-slowest {
          animation: spin-slowest 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;