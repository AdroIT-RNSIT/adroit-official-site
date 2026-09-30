import React, { useEffect, useRef } from 'react';
import { Brain, Cloud, ShieldCheck, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EventCarousel from '../components/EventCarousel';

// ============================================
// DOMAIN CARD COMPONENT - NEW!
// ============================================
const DomainCard = ({ icon, title, description }) => (
  <div className="group relative bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 hover:border-sky-600/25 hover:-translate-y-2 transition-all duration-300">
    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-900/10 mb-4 group-hover:scale-110 transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-sky-800 dark:group-hover:text-sky-300 transition-colors">
      {title}
    </h3>
    <p className="text-slate-600 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

// ============================================
// MAIN HOME COMPONENT
// ============================================
const Home = () => {
  const navigate = useNavigate();
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

  const domainCards = [
    ...domains.map((domain) => ({
      _id: domain.title,
      title: domain.title,
      description: domain.description,
      label: "Technical",
      link: "/domains",
    })),
    {
      _id: "non-tech",
      title: "Non-Tech",
      label: "Non-Tech",
      description: "Events, social media, marketing, and outreach that keep the club visible and moving.",
      link: "/domains",
    },
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
          className="h-[12rem] w-auto max-w-[50%] object-contain object-left drop-shadow-2xl mix-blend-multiply"
        />
        <img
          src="/25_years_new.png"
          alt="25 Years Excellence"
          className="h-[10rem] w-auto max-w-[28%] object-contain object-right drop-shadow-2xl mix-blend-multiply"
        />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section 
        ref={heroRef}
        className="relative flex flex-col items-center overflow-x-clip px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:pt-24 sm:pb-10 lg:pt-28 lg:pb-8 opacity-0 translate-y-4 transition-all duration-500 ease-out"
      >
        <div className="max-w-5xl text-center z-10 relative w-full mx-auto">
          <span className="inline-flex items-center mb-4 rounded-full border border-slate-300/80 px-3.5 py-1 font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase text-sky-800">
            Recruiting soon
          </span>
          <img
            alt="AdroIT"
            className="block object-contain drop-shadow-[0_0_18px_rgba(34,211,238,0.35)] h-[5.25rem] sm:h-24 md:h-[7.5rem] w-auto mx-auto mb-5"
            src="/adroit-ctf-logo.png"
          />
          <h1 className="mx-auto mb-8 max-w-xl px-4 text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-sky-800 leading-snug">
            <span className="sr-only">AdroIT — </span>
            Department of
            <span className="mt-0.5 block font-bold">
              Computer Science &amp; Engineering
            </span>
          </h1>
          <p className="fluid-lead text-slate-600 leading-relaxed max-w-4xl mx-auto mb-8">
            The Premier Technical Club <span className="text-sky-800">Empowering Tomorrow's Innovators</span> through cutting-edge technology, collaborative projects, and industry-ready skills
          </p>
          <EventCarousel
            events={domainCards}
            onSelect={(domain) => navigate(domain.link || "/domains")}
          />
        </div>
      </section>

      {/* ===== WHY JOIN SECTION ===== */}
      <section id="why-join" ref={missionRef} className="pt-10 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-sky-800 font-mono tracking-widest uppercase text-sm">01 // Our Mission</span>
            <h2 className="fluid-h2 font-bold mt-4 mb-8 text-slate-900 pb-2">Why Join AdroIT?</h2>
            <p className="text-slate-600 fluid-lead max-w-4xl mx-auto">
              We bridge the gap between academic theory and industry demands, creating 
              <span className="text-sky-800"> future-ready professionals</span> through practical learning and innovation
            </p>
          </div>

          {/* YOUR ORIGINAL 3-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Column - 3 Cards */}
            <div className="space-y-8">
              
              <div className="p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                    <span className="text-xl font-bold">01</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Practical Skill Development</h3>
                </div>
                <p className="text-slate-600">
                  Move beyond theory with <b>AdroIT</b> — build real-world projects, master industry tools, and gain in-demand skills across Machine Learning, Data Analytics, Cloud Computing, and Cybersecurity.
                </p>
              </div>

              <div className="p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                    <span className="text-xl font-bold">02</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Industry Exposure</h3>
                </div>
                <p className="text-slate-600">
                  Connect with alumni at top tech companies, learn from industry expert workshops, and join sponsored hackathons. We give you the network, exposure, and opportunities to kickstart your career.
                </p>
              </div>

              <div className="p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                    <span className="text-xl font-bold">03</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Collaborative Environment</h3>
                </div>
                <p className="text-slate-600">
                  Join a community of passionate learners and innovators. Collaborate on projects, 
                  share knowledge, and grow together. Our senior-junior mentorship model ensures 
                  everyone gets the guidance they need to succeed.
                </p>
              </div>
            </div>

            {/* Right Column - Advantage Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-sky-600/15 rounded-3xl blur opacity-50 group-hover:opacity-80 transition duration-1000"></div>
              <div className="relative bg-white/50 backdrop-blur-3xl border border-slate-200/80 p-10 rounded-3xl">
                <h3 className="text-3xl font-bold mb-6 text-center text-slate-900">The AdroIT Advantage</h3>
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
                      <div className="w-6 h-6 rounded-full bg-sky-600/10 text-sky-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17L4 12"/>
                        </svg>
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DOMAINS SHOWCASE - NEW SECTION ===== */}
      <section ref={domainsRef} className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-sky-800 font-mono tracking-widest uppercase text-sm">02 // Our Expertise</span>
            <h2 className="fluid-h2 font-bold mt-4 mb-8 text-slate-900 pb-2">Technical Domains</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-xl text-sky-800 hover:text-slate-900 hover:border-sky-600/30 transition-all duration-300 group"
            >
              <span>Explore All Domains</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section
        ref={approachRef}
        className="relative z-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 opacity-0 translate-y-4 transition-all duration-500"
      >
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
            <span className="text-sky-800 font-mono tracking-widest uppercase text-sm">03 // Your Growth</span>
            <h2 className="fluid-h2 font-bold mt-4 mb-8 text-slate-900 pb-2">How AdroIT Will Transform You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="group p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Technical Excellence</h3>
              <p className="text-slate-600">
                Develop strong technical thinking by understanding core concepts, problem-solving approaches,
                and real-world applications across all four domains.
              </p>
            </div>

            <div className="group p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/><path d="M6 18v-2a6 6 0 0112 0v2"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Professional Network</h3>
              <p className="text-slate-600">
                Connect with peers, mentors, and industry professionals through collaborations, events, and community-driven learning.
              </p>
            </div>

            <div className="group p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-16 h-16 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Leadership Skills</h3>
              <p className="text-slate-600">
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
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-4 transition-all duration-500"
      >
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-sky-800 font-mono tracking-widest uppercase text-sm">04 // What We Do</span>
            <h2 className="fluid-h2 font-bold mt-4 mb-8 text-slate-900 pb-2">Join the AdroIT Community</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto">
              Learn by building through hands-on sessions, collaborative projects, and real-world exposure 
              in Machine Learning, Cloud Computing, Cybersecurity, and Data Analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 hover:bg-sky-50/40 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Weekly Tech Sessions</h3>
              <p className="text-slate-600 mb-4">
                Structured, hands-on learning focused on core domains through guided workshops and practical demonstrations.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• Machine Learning Fundamentals & Projects</li>
                <li>• Cloud Computing Concepts & Deployment</li>
                <li>• Cybersecurity Basics & Practices</li>
                <li>• Data Analytics Tools & Workflows</li>
              </ul>
            </div>

            <div className="p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 hover:bg-sky-50/40 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Project Sprints</h3>
              <p className="text-slate-600 mb-4">
                Team-based project cycles designed to apply skills through real-world problem solving.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• ML Model Development</li>
                <li>• Cloud-based Application Deployment</li>
                <li>• Security Analysis & Testing</li>
                <li>• Data-driven Insights Projects</li>
              </ul>
            </div>

            <div className="p-8 border border-slate-200/80 rounded-2xl bg-white/40 hover:border-sky-600/25 hover:bg-sky-50/40 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Community & Events</h3>
              <p className="text-slate-600 mb-4">
                Events that encourage collaboration, innovation, and exposure to industry practices.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• HackAdroIT Hackathon</li>
                <li>• Industry Talks & Expert Sessions</li>
                <li>• Project Demo Days</li>
                <li>• Peer Learning & Networking Events</li>
              </ul>
            </div>
          </div>

          {/* REMOVED: Duplicate "Join AdroIT and Start Building" button */}
          <div className="text-center mt-16">
            <p className="text-slate-500 text-sm">
              Recruiting soon.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;