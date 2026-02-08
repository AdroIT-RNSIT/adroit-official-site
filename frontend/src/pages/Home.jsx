import React, { useEffect, useRef } from 'react';
import ThreeScene from '../home/ThreeScene';

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
        className="min-h-screen flex items-center justify-center relative px-8 py-20 opacity-0 translate-y-4 transition-all duration-1000 ease-out"
      >
        <div className="max-w-5xl text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-gray-400">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
            <span>Department of Computer Science & Engineering</span>
          </div>

          <h1 className="mb-6">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 uppercase tracking-[0.2em] mb-2">
              Welcome to
            </span>
            <span className="block text-6xl md:text-8xl lg:text-9xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent leading-none tracking-tight drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
              AdroIT
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-4xl mx-auto mb-8">
            The Premier Technical Club <span className="text-cyan-400">Empowering Tomorrow's Innovators</span> through 
            cutting-edge technology, collaborative projects, and industry-ready skills
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden w-full sm:w-auto">
              <span className="relative z-10">Join AdroIT Now</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="relative z-10">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
              Explore Our Projects
            </button>
          </div>
        </div>

        {/* Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0 opacity-20">
          <div className="absolute w-full h-full border border-cyan-500/20 rounded-full animate-spin-slow"></div>
          <div className="absolute w-[70%] h-[70%] top-[15%] left-[15%] border border-purple-500/20 rounded-full animate-spin-slower-reverse"></div>
        </div>
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
                  Move beyond textbooks and lectures. At AdroIT, you'll work on real-world projects, 
                  learn industry-standard tools, and develop skills that employers actually value. 
                  From web development to AI/ML, we cover the technologies shaping tomorrow.
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
                  Connect with alumni working at top tech companies, attend workshops by industry experts, 
                  and participate in hackathons sponsored by leading organizations. We provide the network 
                  and exposure you need to launch your career.
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
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Learning Philosophy
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Just as these particles react dynamically, we believe in adaptive, hands-on learning. 
            We don't just teach technology—we teach you how to <span className="text-cyan-400">think</span>, 
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
                Master full-stack development, cloud computing, AI/ML, and more through 
                structured learning paths and project-based practice.
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
                Connect with alumni at FAANG companies, startups, and established enterprises. 
                Get referrals, internship opportunities, and career guidance.
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
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-8">Join Our Thriving Community</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              From weekly workshops to annual hackathons, we create opportunities for 
              continuous learning and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-white/10 rounded-2xl hover:bg-gradient-to-br from-cyan-500/10 to-transparent transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Weekly Tech Sessions</h3>
              <p className="text-gray-400 mb-4">
                Hands-on workshops covering the latest technologies, tools, and frameworks.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Web Development Bootcamps</li>
                <li>• AI/ML Implementation</li>
                <li>• Cloud & DevOps</li>
                <li>• Competitive Programming</li>
              </ul>
            </div>

            <div className="p-8 border border-white/10 rounded-2xl hover:bg-gradient-to-br from-purple-500/10 to-transparent transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Project Sprints</h3>
              <p className="text-gray-400 mb-4">
                Collaborative development of real-world applications in 4-6 week cycles.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Open Source Contributions</li>
                <li>• Startup Ideas Implementation</li>
                <li>• Community Service Tech Solutions</li>
                <li>• Research Projects</li>
              </ul>
            </div>

            <div className="p-8 border border-white/10 rounded-2xl hover:bg-gradient-to-br from-pink-500/10 to-transparent transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-pink-400">Annual Events</h3>
              <p className="text-gray-400 mb-4">
                Flagship events that put your skills to the test and connect you with industry.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• HackAdroit (24-hour Hackathon)</li>
                <li>• Tech Summit with Industry Leaders</li>
                <li>• Project Expo & Demo Day</li>
                <li>• Alumni Interaction Sessions</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-16">
            <button className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 mx-auto">
              <span>Ready to Transform Your College Journey?</span>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="group-hover:translate-x-2 transition-transform duration-300">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p className="text-gray-500 mt-4 text-sm">
              Applications open for the 2024-25 academic year. Limited seats available.
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