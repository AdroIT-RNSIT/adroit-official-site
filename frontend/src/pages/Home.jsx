import React, { useEffect, useRef, useState } from 'react';
import ThreeScene from '../home/ThreeScene';
import { Link } from "react-router-dom";


const InteractiveBall = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0.5, y: 0.5 });
  const [color, setColor] = useState('from-cyan-400 to-purple-600');
  const [hitColor, setHitColor] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ballRef = useRef(null);
  const containerSize = 325; // Half of 650px container

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

  // Ball movement animation
  useEffect(() => {
    const moveBall = () => {
      setPosition(prev => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVx = velocity.x;
        let newVy = velocity.y;

        // Bounce off container walls
        if (newX > containerSize - 15 || newX < -containerSize + 15) {
          newVx = -newVx * (0.9 + Math.random() * 0.2); // Dampen with randomness
          newX = newX > 0 ? containerSize - 15 : -containerSize + 15;
        }
        if (newY > containerSize - 15 || newY < -containerSize + 15) {
          newVy = -newVy * (0.9 + Math.random() * 0.2);
          newY = newY > 0 ? containerSize - 15 : -containerSize + 15;
        }

        // Occasionally change direction randomly
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

        if (distance < 50 && !hitColor) { // 50px collision radius
          // Change ball color
          const newColor = colors[Math.floor(Math.random() * colors.length)];
          setColor(newColor);
          
          // Set hit effect color
          const effectColor = hitEffectColors[Math.floor(Math.random() * hitEffectColors.length)];
          setHitColor(effectColor);
          
          // Reverse and boost velocity
          newVx = -newVx * 1.5;
          newVy = -newVy * 1.5;
          
          // Remove hit effect after 2-3 seconds
          setTimeout(() => {
            setHitColor(null);
          }, 2000 + Math.random() * 1000);
        }

        setVelocity({ x: newVx, y: newVy });
        return { x: newX, y: newY };
      });
    };

    const animationId = requestAnimationFrame(() => {
      moveBall();
      const interval = setInterval(moveBall, 16); // ~60fps
      return () => clearInterval(interval);
    });

    return () => cancelAnimationFrame(animationId);
  }, [velocity, mousePosition, hitColor]);

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
        {/* Blinking Core */}
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-60"></div>
        
        {/* Glow effect */}
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
          
          {/* Ripple Effect */}
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

      {/* Trail Particles */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`trail-${i}`}
          className={`absolute w-${2 - i} h-${2 - i} rounded-full bg-gradient-to-r ${color} opacity-${30 - i * 10} animate-trail`}
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
        {/* Spiral line path */}
        <path
          d="M325,325 Q200,200 400,100 Q500,200 250,400 Q100,500 300,300"
          fill="none"
          stroke="url(#spiralGradient)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
      </svg>

      {/* Add particle animations */}
      <style jsx>{`
        @keyframes hit-particle {
          0% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translate(
              calc(var(--tx) + var(--dx) * 50px),
              calc(var(--ty) + var(--dy) * 50px)
            ) scale(0);
            opacity: 0;
          }
        }

        @keyframes ripple {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0.8;
          }
          100% {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }

        @keyframes trail {
          0% {
            opacity: 0.3;
            transform: translate(var(--tx), var(--ty)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(var(--tx) + var(--dx) * 20px),
              calc(var(--ty) + var(--dy) * 20px)
            ) scale(0.5);
          }
        }

        .animate-hit-particle {
          animation: hit-particle 0.8s ease-out forwards;
        }

        .animate-ripple {
          animation: ripple 1.5s ease-out forwards;
        }

        .animate-trail {
          animation: trail 0.5s linear forwards;
        }
      `}</style>
    </>
  );
};

const Home = () => {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
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

    const refs = [heroRef, missionRef, approachRef, benefitsRef, activitiesRef];
    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]"></div>
      </div>

     {/* Hero Section */}
<section 
  ref={heroRef}
  className="min-h-screen flex items-center justify-center relative px-8 py-20 opacity-0 translate-y-4 transition-all duration-1000 ease-out overflow-hidden"
>
  <div className="max-w-5xl text-center z-10 relative">
    <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-gray-400">
      <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></span>
      <span>Department of Computer Science & Engineering</span>
    </div>

    <h1 className="mb-6">
      <span className="block text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 uppercase tracking-[0.2em] mb-2">
        Welcome to
      </span>
      <span className="block text-6xl md:text-8xl lg:text-9xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent leading-none tracking-tight">
        AdroIT
      </span>
    </h1>

    <p className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-4xl mx-auto mb-8">
      The Premier Technical Club <span className="text-cyan-400">Empowering Tomorrow's Innovators</span> through 
      cutting-edge technology, collaborative projects, and industry-ready skills
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link
        to="/login"
        className="group px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden w-full sm:w-auto"
      >
        <span className="relative z-10">Join AdroIT Now</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="relative z-10">
          <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  </div>

  {/* Enhanced Decorative Rings with Glowing Effect and Moving Dot */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] pointer-events-none z-0">
    
    {/* Outer Glow Effect */}
    <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-cyan-400/5 to-purple-600/5 blur-[20px] animate-pulse-glow"></div>
    
    {/* Main Rings with Glow */}
    <div className="absolute w-full h-full border border-cyan-500/30 rounded-full animate-spin-slow shadow-[0_0_30px_5px_rgba(34,211,238,0.15)]"></div>
    <div className="absolute w-[70%] h-[70%] top-[15%] left-[15%] border border-purple-500/25 rounded-full animate-spin-slower-reverse shadow-[0_0_25px_5px_rgba(168,85,247,0.1)]"></div>
    
    {/* Inner Ring */}
    <div className="absolute w-[40%] h-[40%] top-[30%] left-[30%] border border-cyan-400/20 rounded-full animate-spin-slowest shadow-[0_0_20px_3px_rgba(34,211,238,0.1)]"></div>

    {/* Moving Dot from the "i" in AdroIT */}
    <div className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 shadow-[0_0_15px_5px_rgba(34,211,238,0.4)] animate-move-spiral">
      {/* Blinking Core */}
      <div className="absolute inset-0 rounded-full bg-white animate-ping"></div>
    </div>

    {/* Trail Effect Dots */}
    <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/50 shadow-[0_0_8px_2px_rgba(34,211,238,0.3)] animate-move-spiral-trail-1"></div>
    <div className="absolute w-1 h-1 rounded-full bg-purple-500/40 shadow-[0_0_6px_1px_rgba(168,85,247,0.3)] animate-move-spiral-trail-2"></div>
    <div className="absolute w-0.5 h-0.5 rounded-full bg-cyan-400/30 shadow-[0_0_4px_1px_rgba(34,211,238,0.3)] animate-move-spiral-trail-3"></div>

    {/* Connection Lines */}
    <svg className="absolute top-0 left-0 w-full h-full">
      <defs>
        <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Spiral line path */}
      <path
        d="M325,325 Q200,200 400,100 Q500,200 250,400 Q100,500 300,300"
        fill="none"
        stroke="url(#spiralGradient)"
        strokeWidth="0.5"
        strokeDasharray="2 3"
      />
    </svg>

    {/* Floating Particles Along the Path */}
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-cyan-400/30 animate-float-particle"
        style={{
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + i}s`
        }}
      />
    ))}
  </div>

  {/* Add custom animations */}
  <style jsx>{`
    @keyframes pulse-glow {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.02);
      }
    }

    @keyframes spin-slowest {
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    @keyframes move-spiral {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      25% {
        transform: translate(-120px, -120px) scale(1.2);
        opacity: 0.8;
      }
      50% {
        transform: translate(120px, -120px) scale(1);
        opacity: 1;
      }
      75% {
        transform: translate(120px, 120px) scale(1.2);
        opacity: 0.8;
      }
      100% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
    }

    @keyframes move-spiral-trail-1 {
      0% {
        transform: translate(0, 0);
        opacity: 0;
      }
      10% {
        transform: translate(-40px, -40px);
        opacity: 0.5;
      }
      20% {
        transform: translate(-80px, -80px);
        opacity: 0.3;
      }
      30% {
        transform: translate(-120px, -120px);
        opacity: 0.1;
      }
      100% {
        transform: translate(-120px, -120px);
        opacity: 0;
      }
    }

    @keyframes move-spiral-trail-2 {
      0% {
        transform: translate(0, 0);
        opacity: 0;
      }
      20% {
        transform: translate(60px, -60px);
        opacity: 0.5;
      }
      40% {
        transform: translate(120px, -120px);
        opacity: 0.3;
      }
      60% {
        transform: translate(180px, -180px);
        opacity: 0.1;
      }
      100% {
        transform: translate(180px, -180px);
        opacity: 0;
      }
    }

    @keyframes move-spiral-trail-3 {
      0% {
        transform: translate(0, 0);
        opacity: 0;
      }
      30% {
        transform: translate(60px, 60px);
        opacity: 0.5;
      }
      60% {
        transform: translate(120px, 120px);
        opacity: 0.3;
      }
      90% {
        transform: translate(180px, 180px);
        opacity: 0.1;
      }
      100% {
        transform: translate(180px, 180px);
        opacity: 0;
      }
    }

    @keyframes float-particle {
      0%, 100% {
        transform: translate(0, 0);
        opacity: 0;
      }
      10%, 90% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.6;
        transform: translate(20px, -20px);
      }
    }

    .animate-pulse-glow {
      animation: pulse-glow 4s ease-in-out infinite;
    }

    .animate-spin-slowest {
      animation: spin-slowest 40s linear infinite;
    }

    .animate-move-spiral {
      animation: move-spiral 6s ease-in-out infinite;
    }

    .animate-move-spiral-trail-1 {
      animation: move-spiral-trail-1 6s ease-out infinite;
    }

    .animate-move-spiral-trail-2 {
      animation: move-spiral-trail-2 6s ease-out infinite;
      animation-delay: 0.3s;
    }

    .animate-move-spiral-trail-3 {
      animation: move-spiral-trail-3 6s ease-out infinite;
      animation-delay: 0.6s;
    }

    .animate-float-particle {
      animation: float-particle var(--duration) ease-in-out infinite;
    }
  `}</style>
</section>

      {/* Why AdroIT Section */}
      <section 
        ref={missionRef}
        className="py-24 px-8 opacity-0 translate-y-12 transition-all duration-1000"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm">01 // Our Mission</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-8">Why Join AdroIT?</h2>
            <p className="text-gray-400 text-xl max-w-4xl mx-auto">
              We bridge the gap between academic theory and industry demands, creating 
              <span className="text-cyan-400"> future-ready professionals</span> through practical learning and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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

      {/* Interactive Canvas Section */}
      <section 
        ref={approachRef}
        className="min-h-[60vh] relative flex items-center justify-center py-20 opacity-0 translate-y-12 transition-all duration-1000"
      >
        <ThreeScene />
        <div className="relative z-10 text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4 py-2">
            Our Learning Philosophy
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Like dynamic particles, we believe in adaptive, hands-on learning — not just teaching technology, but building how you <span className="text-cyan-400">think</span>, 
            <span className="text-purple-400"> innovate</span>, and <span className="text-pink-400">create</span>.
          </p>
        </div>
      </section>

      {/* Benefits of Joining */}
      <section 
        ref={benefitsRef}
        className="py-24 px-8 opacity-0 translate-y-12 transition-all duration-1000"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm">02 // Your Growth</span>
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
                and real-world applications across Machine Learning, Cloud Computing, Cybersecurity, and Data Analytics.
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

      {/* Club Activities */}
   <section 
  ref={activitiesRef}
  className="py-24 px-8 bg-gradient-to-b from-transparent to-white/5 backdrop-blur-sm opacity-0 translate-y-12 transition-all duration-1000"
>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm">03 // What We Do</span>
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

    <div className="text-center mt-16">
      <p className="text-gray-500 mt-4 text-sm">
        Recruitment for this cycle is closed. Next recruitment opens later this year.
      </p>
    </div>

  </div>
</section>


      <style jsx>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        .animate-spin-slower-reverse { animation: spin 25s linear infinite reverse; }
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;