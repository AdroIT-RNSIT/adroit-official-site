import React, { useEffect, useRef, useState } from 'react';
import ThreeScene from '../home/ThreeScene';
import { Link } from "react-router-dom";

// ============================================
// FIXED INTERACTIVE BALL COMPONENT
// ============================================
const InteractiveBall = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0.5, y: 0.5 });
  const [color, setColor] = useState('from-cyan-400 to-purple-600');
  const [hitColor, setHitColor] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ballRef = useRef(null);
  const [containerSize, setContainerSize] = useState(325);
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);

  const colors = [
    'from-cyan-400 to-purple-600',
    'from-green-400 to-blue-600',
    'from-yellow-400 to-red-600',
    'from-pink-400 to-indigo-600',
    'from-orange-400 to-cyan-600',
    'from-teal-400 to-pink-600'
  ];

  const hitEffectColors = [
    'bg-gradient-to-r from-cyan-400 to-purple-600',
    'bg-gradient-to-r from-green-400 to-blue-600',
    'bg-gradient-to-r from-yellow-400 to-red-600',
    'bg-gradient-to-r from-pink-400 to-indigo-600',
    'bg-gradient-to-r from-orange-400 to-cyan-600',
    'bg-gradient-to-r from-teal-400 to-pink-600'
  ];

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.hero-ring-container');
      if (container) {
        const width = container.clientWidth;
        setContainerSize(width / 2);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = document.querySelector('.relative.min-h-screen');
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // FIXED: Clean animation loop - removed setInterval conflict
  useEffect(() => {
    let lastTime = 0;
    const FPS = 60;
    const interval = 1000 / FPS;

    const moveBall = (time) => {
      if (time - lastTime >= interval) {
        setPosition(prev => {
          let newX = prev.x + velocity.x;
          let newY = prev.y + velocity.y;
          let newVx = velocity.x;
          let newVy = velocity.y;

          // Bounce off container walls
          if (newX > containerSize - 15 || newX < -containerSize + 15) {
            newVx = -newVx * (0.9 + Math.random() * 0.2);
            newX = newX > 0 ? containerSize - 15 : -containerSize + 15;
          }
          if (newY > containerSize - 15 || newY < -containerSize + 15) {
            newVy = -newVy * (0.9 + Math.random() * 0.2);
            newY = newY > 0 ? containerSize - 15 : -containerSize + 15;
          }

          // Occasionally change direction
          if (Math.random() < 0.01) {
            newVx += (Math.random() - 0.5) * 0.5;
            newVy += (Math.random() - 0.5) * 0.5;
          }

          // Limit max speed
          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (speed > 2) {
            newVx = (newVx / speed) * 2;
            newVy = (newVy / speed) * 2;
          }

          // Check for cursor collision
          const ballX = newX + containerSize;
          const ballY = newY + containerSize;
          const cursorX = mousePosition.x + containerSize;
          const cursorY = mousePosition.y + containerSize;
          
          const distance = Math.sqrt(
            Math.pow(ballX - cursorX, 2) + Math.pow(ballY - cursorY, 2)
          );

          if (distance < 50 && !hitColor) {
            const newColor = colors[Math.floor(Math.random() * colors.length)];
            setColor(newColor);
            
            const effectColor = hitEffectColors[Math.floor(Math.random() * hitEffectColors.length)];
            setHitColor(effectColor);
            
            newVx = -newVx * 1.5;
            newVy = -newVy * 1.5;
            
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              setHitColor(null);
            }, 2000 + Math.random() * 1000);
          }

          setVelocity({ x: newVx, y: newVy });
          return { x: newX, y: newY };
        });
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(moveBall);
    };

    animationRef.current = requestAnimationFrame(moveBall);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [velocity, mousePosition, hitColor, containerSize]);

  // FIXED: Static classes instead of dynamic Tailwind
  const trailSizes = ['w-2 h-2', 'w-1.5 h-1.5', 'w-1 h-1'];
  const trailOpacities = ['opacity-30', 'opacity-20', 'opacity-10'];

  return (
    <>
      {/* Interactive Ball */}
      <div 
        ref={ballRef}
        className={`absolute w-6 h-6 rounded-full bg-gradient-to-r ${color} shadow-[0_0_20px_8px_rgba(34,211,238,0.4)] transition-all duration-300 pointer-events-auto cursor-pointer`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: '50%',
          top: '50%',
          zIndex: 20,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-60"></div>
        <div className="absolute -inset-3 rounded-full bg-current opacity-20 blur-md"></div>
      </div>

      {/* Hit Effect Particles */}
      {hitColor && (
        <>
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const distance = 30 + Math.random() * 20;
            return (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${hitColor} animate-hit-particle`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(${position.x + Math.cos(angle) * distance}px, ${position.y + Math.sin(angle) * distance}px)`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.7,
                }}
              />
            );
          })}
          
          <div 
            className={`absolute rounded-full border-2 ${hitColor.replace('bg-gradient-to-r', 'border-gradient-to-r')} animate-ripple`}
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(${position.x}px, ${position.y}px)`,
              width: '0px',
              height: '0px',
            }}
          />
        </>
      )}

      {/* FIXED: Trail Particles - Static classes instead of dynamic */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`trail-${i}`}
          className={`absolute ${trailSizes[i]} rounded-full bg-gradient-to-r ${color} ${trailOpacities[i]} animate-trail`}
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${position.x - velocity.x * (i + 1) * 10}px, ${position.y - velocity.y * (i + 1) * 10}px)`,
            animationDelay: `${i * 0.05}s`,
            zIndex: 19 - i,
          }}
        />
      ))}

      {/* Connection Lines */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M325,325 Q200,200 400,100 Q500,200 250,400 Q100,500 300,300"
          fill="none"
          stroke="url(#spiralGradient)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
      </svg>
    </>
  );
};

// ============================================
// DOMAIN CARD COMPONENT - NEW!
// ============================================
const DomainCard = ({ icon, title, description, color, link }) => (
  <Link 
    to={link}
    className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
  >
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">
      {description}
    </p>
    <div className="mt-4 inline-flex items-center gap-1 text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
      Explore Resources
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
);

// ============================================
// MAIN HOME COMPONENT
// ============================================
const Home = () => {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const domainsRef = useRef(null);
  const approachRef = useRef(null);
  const benefitsRef = useRef(null);
  const activitiesRef = useRef(null);

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

    const refs = [heroRef, missionRef, domainsRef, approachRef, benefitsRef, activitiesRef];
    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Domain data for your 4 core domains
  const domains = [
    {
      icon: '🤖',
      title: 'Machine Learning',
      description: 'Build intelligent systems that learn from data. Dive into neural networks, computer vision, and NLP.',
      color: 'from-cyan-500 to-cyan-600',
      link: '/resources/ml'
    },
    {
      icon: '☁️',
      title: 'Cloud Computing',
      description: 'Design and deploy scalable applications on AWS, Azure, and GCP. Master Docker and Kubernetes.',
      color: 'from-purple-500 to-purple-600',
      link: '/resources/cc'
    },
    {
      icon: '🔒',
      title: 'Cybersecurity',
      description: 'Protect systems from threats. Learn ethical hacking, network security, and cryptography.',
      color: 'from-pink-500 to-pink-600',
      link: '/resources/cy'
    },
    {
      icon: '📊',
      title: 'Data Analytics',
      description: 'Extract insights from data. Master visualization, SQL, Python, and business intelligence.',
      color: 'from-green-500 to-green-600',
      link: '/resources/da'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip">
      
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* ===== HERO SECTION - YOUR ORIGINAL DESIGN ===== */}
      <section 
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8 py-20 opacity-0 translate-y-4 transition-all duration-1000 ease-out overflow-hidden"
      >
        <div className="max-w-5xl text-center z-10 relative">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-gray-400">
            <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></span>
            <span>Department of Computer Science & Engineering</span>
          </div>

          {/* Title */}
          <h1 className="mb-6">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 uppercase tracking-[0.2em] mb-2">
              Welcome to
            </span>
            <span className="block text-6xl md:text-8xl lg:text-9xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent leading-none tracking-tight">
              AdroIT
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-4xl mx-auto mb-8">
            The Premier Technical Club <span className="text-cyan-400">Empowering Tomorrow's Innovators</span> through 
            cutting-edge technology, collaborative projects, and industry-ready skills
          </p>

          {/* SINGLE CTA BUTTON - Removed duplicate */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Join AdroIT Now</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="relative z-10 group-hover:translate-x-1 transition-transform">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* FIXED: Responsive rings container */}
        <div className="hero-ring-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[650px] aspect-square pointer-events-none z-0 px-4">
          <div className="relative w-full h-full">
            
            {/* Outer Glow */}
            <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-cyan-400/5 to-purple-600/5 blur-[20px] animate-pulse-glow"></div>
            
            {/* Main Rings */}
            <div className="absolute w-full h-full border border-cyan-500/30 rounded-full animate-spin-slow shadow-[0_0_30px_5px_rgba(34,211,238,0.15)]"></div>
            <div className="absolute w-[70%] h-[70%] top-[15%] left-[15%] border border-purple-500/25 rounded-full animate-spin-slower-reverse shadow-[0_0_25px_5px_rgba(168,85,247,0.1)]"></div>
            <div className="absolute w-[40%] h-[40%] top-[30%] left-[30%] border border-cyan-400/20 rounded-full animate-spin-slowest shadow-[0_0_20px_3px_rgba(34,211,238,0.1)]"></div>

            {/* Moving Dot */}
            <div className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 shadow-[0_0_15px_5px_rgba(34,211,238,0.4)] animate-move-spiral">
              <div className="absolute inset-0 rounded-full bg-white animate-ping"></div>
            </div>

            {/* Trail Dots */}
            <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/50 shadow-[0_0_8px_2px_rgba(34,211,238,0.3)] animate-move-spiral-trail-1"></div>
            <div className="absolute w-1 h-1 rounded-full bg-purple-500/40 shadow-[0_0_6px_1px_rgba(168,85,247,0.3)] animate-move-spiral-trail-2"></div>
            <div className="absolute w-0.5 h-0.5 rounded-full bg-cyan-400/30 shadow-[0_0_4px_1px_rgba(34,211,238,0.3)] animate-move-spiral-trail-3"></div>

            {/* Interactive Ball */}
            <InteractiveBall />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500">Scroll</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7m14-6l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ===== WHY JOIN SECTION ===== */}
      <section id="why-join" ref={missionRef} className="py-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm">01 // Our Mission</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-8">Why Join AdroIT?</h2>
            <p className="text-gray-400 text-xl max-w-4xl mx-auto">
              We bridge the gap between academic theory and industry demands, creating 
              <span className="text-cyan-400"> future-ready professionals</span> through practical learning and innovation
            </p>
          </div>

          {/* YOUR ORIGINAL 3-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - 3 Cards */}
            <div className="space-y-8">
              
              <div className="p-8 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <span className="text-xl font-bold">01</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Practical Skill Development</h3>
                </div>
                <p className="text-gray-400">
                  Move beyond theory with <b>AdroIT</b> — build real-world projects, master industry tools, and gain in-demand skills across Machine Learning, Data Analytics, Cloud Computing, and Cybersecurity.
                </p>
              </div>

              <div className="p-8 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xl font-bold">02</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Industry Exposure</h3>
                </div>
                <p className="text-gray-400">
                  Connect with alumni at top tech companies, learn from industry expert workshops, and join sponsored hackathons. We give you the network, exposure, and opportunities to kickstart your career.
                </p>
              </div>

              <div className="p-8 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-pink-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                    <span className="text-xl font-bold">03</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Collaborative Environment</h3>
                </div>
                <p className="text-gray-400">
                  Join a community of passionate learners and innovators. Collaborate on projects, 
                  share knowledge, and grow together. Our senior-junior mentorship model ensures 
                  everyone gets the guidance they need to succeed.
                </p>
              </div>
            </div>

            {/* Right Column - Advantage Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 p-10 rounded-3xl">
                <h3 className="text-3xl font-bold mb-6 text-center text-cyan-400">The AdroIT Advantage</h3>
                <div className="space-y-6">
                  {[
                    "Build an impressive portfolio with real projects",
                    "Master in-demand technologies before they're in your syllabus",
                    "Network with industry professionals and alumni",
                    "Develop leadership and teamwork skills",
                    "Gain confidence through regular presentations and demos",
                    "Access exclusive learning resources and workshops"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17L4 12"/>
                        </svg>
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DOMAINS SHOWCASE - NEW SECTION ===== */}
      <section ref={domainsRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/5 opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm">02 // Our Expertise</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-8">Technical Domains</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Four pillars of technical excellence driving innovation at AdroIT
            </p>
          </div>

          {/* 4-Column Grid for Domains */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain, index) => (
              <DomainCard key={index} {...domain} />
            ))}
          </div>

          {/* Domain CTA */}
          <div className="text-center mt-12">
            <Link
              to="/domains"
              onClick={()=>window.scrollTo(0,0)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-cyan-400 hover:text-white hover:border-cyan-500/30 transition-all duration-300 group"
            >
              <span>Explore All Domains</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE CANVAS SECTION ===== */}
      <section 
        ref={approachRef}
        className="min-h-[60vh] relative flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-12 transition-all duration-1000"
      >
        <ThreeScene />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4 py-2">
            Our Learning Philosophy
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Like dynamic particles, we believe in adaptive, hands-on learning — not just teaching technology, but building how you <span className="text-cyan-400">think</span>, 
            <span className="text-purple-400"> innovate</span>, and <span className="text-pink-400">create</span>.
          </p>
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section 
        ref={benefitsRef}
        className="py-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-12 transition-all duration-1000"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm">03 // Your Growth</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-8">How AdroIT Will Transform You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="group p-8 border border-white/10 rounded-2xl bg-gradient-to-b from-transparent to-black/20 hover:border-cyan-500/50 hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Technical Excellence</h3>
              <p className="text-gray-400">
                Develop strong technical thinking by understanding core concepts, problem-solving approaches,
                and real-world applications across all four domains.
              </p>
            </div>

            <div className="group p-8 border border-white/10 rounded-2xl bg-gradient-to-b from-transparent to-black/20 hover:border-purple-500/50 hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/><path d="M6 18v-2a6 6 0 0112 0v2"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Professional Network</h3>
              <p className="text-gray-400">
                Connect with peers, mentors, and industry professionals through collaborations, events, and community-driven learning.
              </p>
            </div>

            <div className="group p-8 border border-white/10 rounded-2xl bg-gradient-to-b from-transparent to-black/20 hover:border-pink-500/50 hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-pink-400">Leadership Skills</h3>
              <p className="text-gray-400">
                Take ownership of projects, lead teams in hackathons, and organize events. 
                Develop the soft skills that complement your technical expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLUB ACTIVITIES ===== */}
      <section 
        ref={activitiesRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/5 backdrop-blur-sm opacity-0 translate-y-12 transition-all duration-1000"
      >
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm">04 // What We Do</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-8">Join the AdroIT Community</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Learn by building through hands-on sessions, collaborative projects, and real-world exposure 
              in Machine Learning, Cloud Computing, Cybersecurity, and Data Analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="p-8 border border-white/10 rounded-2xl hover:bg-gradient-to-br from-cyan-500/10 to-transparent transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Weekly Tech Sessions</h3>
              <p className="text-gray-400 mb-4">
                Structured, hands-on learning focused on core domains through guided workshops and practical demonstrations.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Machine Learning Fundamentals & Projects</li>
                <li>• Cloud Computing Concepts & Deployment</li>
                <li>• Cybersecurity Basics & Practices</li>
                <li>• Data Analytics Tools & Workflows</li>
              </ul>
            </div>

            <div className="p-8 border border-white/10 rounded-2xl hover:bg-gradient-to-br from-purple-500/10 to-transparent transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Project Sprints</h3>
              <p className="text-gray-400 mb-4">
                Team-based project cycles designed to apply skills through real-world problem solving.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• ML Model Development</li>
                <li>• Cloud-based Application Deployment</li>
                <li>• Security Analysis & Testing</li>
                <li>• Data-driven Insights Projects</li>
              </ul>
            </div>

            <div className="p-8 border border-white/10 rounded-2xl hover:bg-gradient-to-br from-pink-500/10 to-transparent transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-pink-400">Community & Events</h3>
              <p className="text-gray-400 mb-4">
                Events that encourage collaboration, innovation, and exposure to industry practices.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• HackAdroIT Hackathon</li>
                <li>• Industry Talks & Expert Sessions</li>
                <li>• Project Demo Days</li>
                <li>• Peer Learning & Networking Events</li>
              </ul>
            </div>
          </div>

          {/* REMOVED: Duplicate "Join AdroIT and Start Building" button */}
          <div className="text-center mt-16">
            <p className="text-gray-500 text-sm">
              Recruitment for this cycle is closed. Next recruitment opens later this year.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FIXED: Global Styles - Replaced style jsx with regular style ===== */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-slower-reverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes spin-slowest {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(720deg); }
        }
        @keyframes move-spiral {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          25% { transform: translate(-120px, -120px) scale(1.2); opacity: 0.8; }
          50% { transform: translate(120px, -120px) scale(1); opacity: 1; }
          75% { transform: translate(120px, 120px) scale(1.2); opacity: 0.8; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes move-spiral-trail-1 {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { transform: translate(-40px, -40px); opacity: 0.5; }
          20% { transform: translate(-80px, -80px); opacity: 0.3; }
          30% { transform: translate(-120px, -120px); opacity: 0.1; }
          100% { transform: translate(-120px, -120px); opacity: 0; }
        }
        @keyframes move-spiral-trail-2 {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { transform: translate(60px, -60px); opacity: 0.5; }
          40% { transform: translate(120px, -120px); opacity: 0.3; }
          60% { transform: translate(180px, -180px); opacity: 0.1; }
          100% { transform: translate(180px, -180px); opacity: 0; }
        }
        @keyframes move-spiral-trail-3 {
          0% { transform: translate(0, 0); opacity: 0; }
          30% { transform: translate(60px, 60px); opacity: 0.5; }
          60% { transform: translate(120px, 120px); opacity: 0.3; }
          90% { transform: translate(180px, 180px); opacity: 0.1; }
          100% { transform: translate(180px, 180px); opacity: 0; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10%, 90% { opacity: 0.3; }
          50% { opacity: 0.6; transform: translate(20px, -20px); }
        }
        @keyframes hit-particle {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes ripple {
          0% { width: 0px; height: 0px; opacity: 0.8; }
          100% { width: 100px; height: 100px; opacity: 0; }
        }
        @keyframes trail {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slower-reverse { animation: spin-slower-reverse 25s linear infinite; }
        .animate-spin-slowest { animation: spin-slowest 40s linear infinite; }
        .animate-move-spiral { animation: move-spiral 6s ease-in-out infinite; }
        .animate-move-spiral-trail-1 { animation: move-spiral-trail-1 6s ease-out infinite; }
        .animate-move-spiral-trail-2 { animation: move-spiral-trail-2 6s ease-out infinite; animation-delay: 0.3s; }
        .animate-move-spiral-trail-3 { animation: move-spiral-trail-3 6s ease-out infinite; animation-delay: 0.6s; }
        .animate-float-particle { animation: float-particle var(--duration) ease-in-out infinite; }
        .animate-hit-particle { animation: hit-particle 0.8s ease-out forwards; }
        .animate-ripple { animation: ripple 1.5s ease-out forwards; }
        .animate-trail { animation: trail 0.5s linear forwards; }
      `}</style>
    </div>
  );
};

export default Home;