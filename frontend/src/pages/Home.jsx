import React, { useEffect, useRef } from 'react';
import { Brain, Cloud, ShieldCheck, BarChart3 } from "lucide-react";
import ThreeScene from '../home/ThreeScene';
import { Link, useNavigate } from "react-router-dom";
import BrandMark from '../components/BrandMark';
import EventCarousel from '../components/EventCarousel';
import { sharedEvents } from '../data/events';
import { useTheme } from '../lib/theme';

// ============================================
// FIXED INTERACTIVE BALL COMPONENT
// ============================================
import InteractiveRings from '../components/InteractiveRings';

// ============================================
// DOMAIN CARD COMPONENT - NEW!
// ============================================
const DomainCard = ({ icon, title, description }) => (
  <div className="group relative rounded-2xl p-px overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-sky-400/15 via-violet-400/10 to-transparent dark:from-sky-400/20 dark:via-violet-400/12 dark:to-transparent">
    {/* Hover border intensifier */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-gradient-to-br from-sky-400/50 via-violet-400/35 to-sky-400/15" />
    <div className="relative rounded-2xl p-6 h-full bg-white/80 dark:bg-[#0b1225]/90 backdrop-blur-xl">
      {/* Icon */}
      <div className="relative w-11 h-11 flex items-center justify-center rounded-xl mb-5 transition-all duration-300 group-hover:scale-110 bg-sky-50 dark:bg-sky-400/10 border border-sky-200/60 dark:border-sky-400/20">
        <span className="text-sky-600 dark:text-sky-400 group-hover:text-sky-500 dark:group-hover:text-cyan-300 transition-colors duration-300">{icon}</span>
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-sky-700 dark:group-hover:text-white transition-colors duration-300 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-500 text-sm leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);

// ============================================
// MAIN HOME COMPONENT
// ============================================
const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const domainsRef = useRef(null);
  const approachRef = useRef(null);
  const benefitsRef = useRef(null);
  const activitiesRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0,
      rootMargin: '80px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4', 'translate-y-12');
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
      icon: <Brain size={28} strokeWidth={2} />,
      title: 'Machine Learning',
      description: 'Build intelligent systems that learn from data. Dive into neural networks, computer vision, and NLP.',
      link: '/resources/ml'
    },
    {
      icon: <Cloud size={28} strokeWidth={2} />,
      title: 'Cloud Computing',
      description: 'Design and deploy scalable applications on AWS, Azure, and GCP. Master Docker and Kubernetes.',
      link: '/resources/cc'
    },
    {
      icon: <ShieldCheck size={28} strokeWidth={2} />,
      title: 'Cybersecurity',
      description: 'Protect systems from threats. Learn ethical hacking, network security, and cryptography.',
      link: '/resources/cy'
    },
    {
      icon: <BarChart3 size={28} strokeWidth={2} />,
      title: 'Data Analytics',
      description: 'Extract insights from data. Master visualization, SQL, Python, and business intelligence.',
      link: '/resources/da'
    }
  ];

  return (
    <div className="home-root relative min-h-dvh overflow-x-clip">
      
      {/* Mobile: original corner sizes in flow so the hero sits below. Laptop: larger aligned pair. */}
      <div className="lg:hidden relative z-[1001] flex items-center justify-between">
        <img
          src="/rnsit_logo.png"
          alt="RNSIT Logo"
          className="w-[7.35rem] sm:w-[11.55rem] h-auto max-w-[72%] object-contain object-left drop-shadow-2xl"
          style={{ mixBlendMode: "multiply" }}
        />
        <img
          src="/25_years_new.png"
          alt="25 Years Excellence"
          className="w-[3.15rem] sm:w-[4.2rem] h-auto max-w-[36%] object-contain object-right drop-shadow-2xl mix-blend-multiply"
        />
      </div>
      <div className="hidden lg:flex absolute top-0 inset-x-0 z-[1001] items-center justify-between pointer-events-none">
        <img
          src="/rnsit_logo.png"
          alt="RNSIT Logo"
          className="h-[12.6rem] w-auto max-w-[80%] object-contain object-left drop-shadow-2xl mix-blend-multiply"
        />
        <img
          src="/25_years_new.png"
          alt="25 Years Excellence"
          className="h-[10.08rem] w-auto max-w-[40%] object-contain object-right drop-shadow-2xl mix-blend-multiply"
        />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-start overflow-x-clip px-4 sm:px-6 lg:px-8 pt-8 pb-24 sm:pt-10 lg:min-h-dvh lg:justify-center lg:py-20 opacity-0 translate-y-4 transition-all duration-500 ease-out"
      >
        <div className="max-w-5xl text-center z-10 relative w-full mx-auto">

          {/* ── Terminal-style badge ── */}
          <div className="inline-flex items-center gap-3 mb-6 rounded-full px-4 py-2"
            style={{
              background: isDark ? "rgba(11,18,37,0.85)" : "rgba(14,165,233,0.06)",
              border: isDark ? "1px solid rgba(56,189,248,0.28)" : "1px solid rgba(14,165,233,0.22)",
              backdropFilter: "blur(16px)",
              boxShadow: isDark
                ? "0 0 24px rgba(56,189,248,0.10), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "0 2px 8px rgba(14,165,233,0.08)"
            }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </span>
            <span className="w-px h-4 bg-slate-300 dark:bg-white/15" />
            <span className="font-mono-tech text-[10px] sm:text-xs text-cyan-600 dark:text-cyan-400 tracking-widest">
              <span className="text-violet-600 dark:text-violet-400 mr-1">~/adroit</span>
              $ event --season paradox-2026
              <span className="cursor-blink" />
            </span>
          </div>

          <BrandMark size="home" className="mb-6 drop-shadow-[0_0_32px_rgba(56,189,248,0.45)]" />

          <h1 className="mx-auto mb-3 max-w-2xl px-4 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight leading-snug text-slate-800 dark:text-slate-200">
            <span className="sr-only">AdroIT — </span>
            Department of{" "}
            <span className="text-gradient-aurora font-bold">Computer Science & Engineering</span>
          </h1>

          {/* Tagline */}
          <p className="fluid-lead leading-relaxed max-w-3xl mx-auto mb-10 text-slate-600 dark:text-slate-400">
            The Premier Technical Club —{" "}
            <span className="text-sky-600 dark:text-sky-300 font-medium">empowering tomorrow's innovators</span>{" "}
            through cutting-edge technology, collaborative projects, and industry-ready skills
          </p>

          <EventCarousel
            events={sharedEvents}
            onSelect={(event) => navigate(`/events/${event.slug}`)}
          />

          {/* ── CTA Buttons ── */}
          <div className="flex flex-row flex-wrap gap-3 justify-center items-center relative z-20">
            <Link
              to="/domains"
              className="group inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-full text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
                boxShadow: "0 0 20px rgba(14,165,233,0.3), 0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              <span>Explore AdroIT</span>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-105 text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 backdrop-blur-sm hover:border-sky-400/40"
            >
              See Events
            </Link>
          </div>
        </div>

        {/* FIXED: Responsive rings container */}
        <InteractiveRings />
      </section>

      {/* ===== WHY JOIN SECTION ===== */}
      <section id="why-join" ref={missionRef} className="py-10 sm:py-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="section-label mb-4 block">01 // Our Mission</span>
            <h2 className="fluid-h2 font-bold mt-4 mb-6 text-slate-900 dark:text-white">
              Why Join <span className="text-gradient-cyan">AdroIT?</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 fluid-lead max-w-3xl mx-auto">
              We bridge the gap between academic theory and industry demands, creating{" "}
              <span className="text-sky-600 dark:text-sky-300 font-medium">future-ready professionals</span>{" "}
              through practical learning and innovation
            </p>
          </div>

          {/* YOUR ORIGINAL 3-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Column - 3 Cards */}
            <div className="space-y-5">
              {[
                { n: "01", title: "Practical Skill Development", body: <>Move beyond theory with <b>AdroIT</b> — build real-world projects, master industry tools, and gain in-demand skills across Machine Learning, Data Analytics, Cloud Computing, and Cybersecurity.</> },
                { n: "02", title: "Industry Exposure", body: "Connect with alumni at top tech companies, learn from industry expert workshops, and join sponsored hackathons. We give you the network, exposure, and opportunities to kickstart your career." },
                { n: "03", title: "Collaborative Environment", body: "Join a community of passionate learners and innovators. Collaborate on projects, share knowledge, and grow together. Our senior-junior mentorship model ensures everyone gets the guidance they need to succeed." },
              ].map(({ n, title, body }) => (
                <div key={n} className="flex gap-5 p-6 rounded-xl transition-all duration-300 group bg-white/70 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] hover:border-sky-400/30 dark:hover:border-sky-400/25 hover:shadow-[0_4px_20px_rgba(14,165,233,0.07)] backdrop-blur-sm">
                  <span className="font-mono-tech text-cyan-400 text-sm pt-0.5 shrink-0 tabular-nums">{n}</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Advantage Card */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{background:"linear-gradient(135deg,rgba(0,212,255,0.06),rgba(124,58,237,0.06))",boxShadow:"0 0 60px rgba(56,189,248,0.12)"}} />
              <div className="relative p-8 rounded-3xl bg-white/75 dark:bg-[#0b1225]/85 backdrop-blur-xl border border-slate-100 dark:border-sky-400/12">
                <span className="font-mono-tech text-sky-700 dark:text-sky-400 text-xs tracking-widest uppercase block mb-3">The AdroIT Advantage</span>
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Why you'll grow faster here</h3>
                <ul className="space-y-4">
                  {[
                    "Build an impressive portfolio with real projects",
                    "Master in-demand technologies before they're in your syllabus",
                    "Network with industry professionals and alumni",
                    "Develop leadership and teamwork skills",
                    "Gain confidence through regular presentations and demos",
                    "Access exclusive learning resources and workshops"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-sky-500/15 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-sky-600 dark:text-sky-400">
                          <path d="M20 6L9 17L4 12"/>
                        </svg>
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DOMAINS SHOWCASE - NEW SECTION ===== */}
      <section ref={domainsRef} className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="section-label mb-4 block">02 // Our Expertise</span>
            <h2 className="fluid-h2 font-bold mt-4 mb-6 text-slate-900 dark:text-white">
              Technical <span className="text-gradient-cyan">Domains</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl mx-auto">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 group" style={{background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.25)",color:"rgba(125,211,252,0.9)",backdropFilter:"blur(12px)"}}
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
        className="relative z-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 opacity-0 translate-y-4 transition-all duration-500"
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 -bottom-24 z-0 sm:-top-32 sm:-bottom-32"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          }}
        >
          <ThreeScene />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="fluid-h2 font-bold text-slate-900 mb-4 py-2">
            Our Learning Philosophy
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Like dynamic particles, we believe in adaptive, hands-on learning — not just teaching technology, but building how you <span className="text-sky-800">think</span>, 
            <span className="text-sky-800"> innovate</span>, and <span className="text-sky-800">create</span>.
          </p>
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section 
        ref={benefitsRef}
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-4 transition-all duration-500"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label mb-4 block">03 // Your Growth</span>
            <h2 className="fluid-h2 font-bold mt-4 mb-6 text-slate-900 dark:text-white">
              How AdroIT Will <span className="text-gradient-cyan">Transform You</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></>,
                title: "Technical Excellence",
                body: "Develop strong technical thinking by understanding core concepts, problem-solving approaches, and real-world applications across all four domains."
              },
              {
                icon: <><circle cx="12" cy="8" r="4"/><path d="M6 18v-2a6 6 0 0112 0v2"/></>,
                title: "Professional Network",
                body: "Connect with peers, mentors, and industry professionals through collaborations, events, and community-driven learning."
              },
              {
                icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
                title: "Leadership Skills",
                body: "Take ownership of projects, lead teams in hackathons, and organize events. Develop the soft skills that complement your technical expertise."
              }
            ].map(({ icon, title, body }) => (
              <div key={title} className="group relative p-7 rounded-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] hover:border-sky-400/30 dark:hover:border-sky-400/25 hover:shadow-[0_8px_28px_rgba(14,165,233,0.08)] backdrop-blur-sm">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl mb-5 text-sky-600 dark:text-sky-400 transition-all duration-300 group-hover:scale-110 group-hover:text-sky-500 dark:group-hover:text-cyan-300 bg-sky-50 dark:bg-sky-400/10 border border-sky-200/60 dark:border-sky-400/18">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLUB ACTIVITIES ===== */}
      <section 
        ref={activitiesRef}
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/5 backdrop-blur-sm opacity-0 translate-y-4 transition-all duration-500"
      >
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="section-label mb-4 block">04 // What We Do</span>
            <h2 className="fluid-h2 font-bold mt-4 mb-6 text-slate-900 dark:text-white">
              Join the <span className="text-gradient-cyan">AdroIT Community</span>
            </h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto">
              Learn by building through hands-on sessions, collaborative projects, and real-world exposure 
              in Machine Learning, Cloud Computing, Cybersecurity, and Data Analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Weekly Tech Sessions", desc: "Structured, hands-on learning focused on core domains through guided workshops and practical demonstrations.", items: ["Machine Learning Fundamentals & Projects", "Cloud Computing Concepts & Deployment", "Cybersecurity Basics & Practices", "Data Analytics Tools & Workflows"] },
              { title: "Project Sprints", desc: "Team-based project cycles designed to apply skills through real-world problem solving.", items: ["ML Model Development", "Cloud-based Application Deployment", "Security Analysis & Testing", "Data-driven Insights Projects"] },
              { title: "Community & Events", desc: "Events that encourage collaboration, innovation, and exposure to industry practices.", items: ["HackAdroIT Hackathon", "Industry Talks & Expert Sessions", "Project Demo Days", "Peer Learning & Networking Events"] },
            ].map(({ title, desc, items }) => (
              <div key={title} className="p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 bg-white/70 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] hover:border-sky-400/25 hover:shadow-[0_4px_16px_rgba(14,165,233,0.06)] backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 leading-relaxed">{desc}</p>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-sky-500 shrink-0">›</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* REMOVED: Duplicate "Join AdroIT and Start Building" button */}
          <div className="text-center mt-16">
            <p className="text-slate-500 text-sm">
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
          25% { transform: translate(-18%, -18%) scale(1.2); opacity: 0.8; }
          50% { transform: translate(18%, -18%) scale(1); opacity: 1; }
          75% { transform: translate(18%, 18%) scale(1.2); opacity: 0.8; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes move-spiral-trail-1 {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { transform: translate(-6%, -6%); opacity: 0.5; }
          20% { transform: translate(-12%, -12%); opacity: 0.3; }
          30% { transform: translate(-18%, -18%); opacity: 0.1; }
          100% { transform: translate(-18%, -18%); opacity: 0; }
        }
        @keyframes move-spiral-trail-2 {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { transform: translate(9%, -9%); opacity: 0.5; }
          40% { transform: translate(18%, -18%); opacity: 0.3; }
          60% { transform: translate(27%, -27%); opacity: 0.1; }
          100% { transform: translate(27%, -27%); opacity: 0; }
        }
        @keyframes move-spiral-trail-3 {
          0% { transform: translate(0, 0); opacity: 0; }
          30% { transform: translate(9%, 9%); opacity: 0.5; }
          60% { transform: translate(18%, 18%); opacity: 0.3; }
          90% { transform: translate(27%, 27%); opacity: 0.1; }
          100% { transform: translate(27%, 27%); opacity: 0; }
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
