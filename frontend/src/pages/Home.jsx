import {
  Brain,
  Cloud,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CalendarDays,
  Rocket,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { sharedEvents } from "../data/events";
import Reveal from "../components/Reveal";
import RevealGroup from "../components/RevealGroup";
import { scrollToTop } from "../lib/scroll";

const missionItems = [
  {
    num: "01",
    title: "Practical Skill Development",
    body: (
      <>
        Move beyond theory with <b>AdroIT</b> — build real-world projects, master industry tools, and
        gain in-demand skills across Machine Learning, Data Analytics, Cloud Computing, and
        Cybersecurity.
      </>
    ),
    className: "mission-item flex gap-4 pb-8",
  },
  {
    num: "02",
    title: "Industry Exposure",
    body: (
      <>
        Connect with alumni at top tech companies, learn from industry expert workshops, and join
        sponsored hackathons. We give you the network, exposure, and opportunities to kickstart your
        career.
      </>
    ),
    className: "mission-item flex gap-4 py-8",
  },
  {
    num: "03",
    title: "Collaborative Environment",
    body: (
      <>
        Join a community of passionate learners and innovators. Collaborate on projects, share
        knowledge, and grow together. Our senior-junior mentorship model ensures everyone gets the
        guidance they need to succeed.
      </>
    ),
    className: "mission-item flex gap-4 pt-8",
  },
];

const Home = () => {
  const domains = [
    {
      icon: <Brain size={22} strokeWidth={2} />,
      title: "Machine Learning",
      description:
        "Build intelligent systems that learn from data. Dive into neural networks, computer vision, and NLP.",
    },
    {
      icon: <Cloud size={22} strokeWidth={2} />,
      title: "Cloud Computing",
      description:
        "Design and deploy scalable applications on AWS, Azure, and GCP. Master Docker and Kubernetes.",
    },
    {
      icon: <ShieldCheck size={22} strokeWidth={2} />,
      title: "Cybersecurity",
      description:
        "Protect systems from threats. Learn ethical hacking, network security, and cryptography.",
    },
    {
      icon: <BarChart3 size={22} strokeWidth={2} />,
      title: "Data Analytics",
      description:
        "Extract insights from data. Master visualization, SQL, Python, and business intelligence.",
    },
  ];

  const advantages = [
    "Build an impressive portfolio with real projects",
    "Master in-demand technologies before they're in your syllabus",
    "Network with industry professionals and alumni",
    "Develop leadership and teamwork skills",
    "Gain confidence through regular presentations and demos",
    "Access exclusive learning resources and workshops",
  ];

  const communityCards = [
    {
      icon: <CalendarDays size={20} strokeWidth={2} />,
      title: "Weekly Tech Sessions",
      description:
        "Structured, hands-on learning focused on core domains through guided workshops and practical demonstrations.",
      items: [
        "Machine Learning Fundamentals & Projects",
        "Cloud Computing Concepts & Deployment",
        "Cybersecurity Basics & Practices",
        "Data Analytics Tools & Workflows",
      ],
    },
    {
      icon: <Rocket size={20} strokeWidth={2} />,
      title: "Project Sprints",
      description:
        "Team-based project cycles designed to apply skills through real-world problem solving.",
      items: [
        "ML Model Development",
        "Cloud-based Application Deployment",
        "Security Analysis & Testing",
        "Data-driven Insights Projects",
      ],
    },
    {
      icon: <Users size={20} strokeWidth={2} />,
      title: "Community & Events",
      description:
        "Events that encourage collaboration, innovation, and exposure to industry practices.",
      items: [
        "HackAdroIT Hackathon",
        "Industry Talks & Expert Sessions",
        "Project Demo Days",
        "Peer Learning & Networking Events",
      ],
    },
  ];

  const growthPillars = [
    {
      num: "01",
      title: "Technical Excellence",
      description:
        "Develop strong technical thinking by understanding core concepts, problem-solving approaches, and real-world applications across all four domains.",
    },
    {
      num: "02",
      title: "Professional Network",
      description:
        "Connect with peers, mentors, and industry professionals through collaborations, events, and community-driven learning.",
    },
    {
      num: "03",
      title: "Leadership Skills",
      description:
        "Take ownership of projects, lead teams in hackathons, and organize events. Develop the soft skills that complement your technical expertise.",
    },
  ];

  return (
    <div className="relative overflow-x-clip">
      <section className="hero-section relative overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden="true" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, var(--accent-primary-tint), transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="page-wrap relative py-8 sm:py-10 lg:py-12">
          <RevealGroup immediate className="hero-sequence">
            <p
              className="reveal-item text-sm font-medium tracking-[0.18em] uppercase text-text-muted mb-3"
              style={{ "--index": 0 }}
            >
              Welcome to
            </p>
            <h1
              className="reveal-item text-[2.5rem] sm:text-6xl lg:text-7xl font-extrabold tracking-[0.12em] text-text-primary leading-none mb-6"
              style={{ "--index": 1 }}
            >
              AdroIT
            </h1>
            <div className="reveal-item" style={{ "--index": 2 }}>
              <div className="badge mb-6 max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0" />
                <span className="text-left">Department of Computer Science &amp; Engineering</span>
              </div>
            </div>
            <p
              className="reveal-item text-base sm:text-lg lg:text-xl text-text-body leading-relaxed max-w-3xl"
              style={{ "--index": 3 }}
            >
              The Premier Technical Club{" "}
              <span className="text-text-primary font-medium">Empowering Tomorrow's Innovators</span>{" "}
              through cutting-edge technology, collaborative projects, and industry-ready skills
            </p>
            <div className="reveal-item hero-branding" style={{ "--index": 4 }}>
              <div className="hero-branding-college">
                <img
                  src="/rnsit_logo.png"
                  alt="RNS Institute of Technology"
                  width={120}
                  height={44}
                  className="brand-mark hero-brand-rnsit"
                />
                <img
                  src="/25_years.png"
                  alt="25 Years of RNSIT"
                  width={88}
                  height={44}
                  className="brand-mark hero-brand-25"
                />
              </div>
              <div className="hero-branding-event">
                <span className="hero-branding-label">In association with</span>
                <img
                  src="/ieee_logo.png"
                  alt="IEEE RNSIT Student Branch"
                  width={208}
                  height={32}
                  className="brand-mark hero-brand-ieee"
                />
              </div>
            </div>
          </RevealGroup>

          <div className="mt-6">
            <RevealGroup className="snap-strip mb-10" data-lenis-prevent>
              {sharedEvents.map((event, index) => (
                <Link
                  key={event._id}
                  to="/events"
                  className="reveal-item snap-card event-card card card-hover p-5 text-left block h-full"
                  style={{ "--index": index }}
                >
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <span className="badge-amber badge text-xs font-semibold">Paradox 2026</span>
                    <span className="text-xs text-text-muted text-right shrink-0">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h3 className="event-card-title font-semibold text-lg text-text-primary mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-text-body line-clamp-3 mb-3">{event.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-primary">
                    View details
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={120}>
            <div className="flex flex-col items-start gap-2">
              <button type="button" disabled className="btn btn-primary">
                Join AdroIT Now
                <ArrowRight size={18} />
              </button>
              <p className="text-xs text-text-muted">
                Recruitment for this cycle is closed. Next recruitment opens later this year.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="why-join" className="section-block section-tint">
        <div className="page-wrap">
          <Reveal>
            <p className="section-kicker">01 // Our Mission</p>
            <h2 className="section-title">Why Join AdroIT?</h2>
            <p className="section-lead mb-10">
              We bridge the gap between academic theory and industry demands, creating
              <span className="text-text-primary"> future-ready professionals</span> through
              practical learning and innovation
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <RevealGroup as="ol" className="lg:col-span-7 space-y-0">
              {missionItems.map((item, index) => (
                <li
                  key={item.num}
                  className={`reveal-item ${item.className}`}
                  style={{ "--index": index }}
                >
                  <span className="mission-marker">{item.num}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-text-body">{item.body}</p>
                  </div>
                </li>
              ))}
            </RevealGroup>

            <Reveal delay={180} className="lg:col-span-5">
              <aside className="advantage-panel card card-elevated p-6 sm:p-8 h-full">
                <h3 className="text-lg font-semibold text-text-primary mb-5">The AdroIT Advantage</h3>
                <ul className="space-y-3">
                  {advantages.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-body">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-block section-surface">
        <div className="page-wrap">
          <Reveal>
            <p className="section-kicker">02 // Our Expertise</p>
            <h2 className="section-title">Technical Domains</h2>
            <p className="section-lead mb-10">
              Four pillars of technical excellence driving innovation at AdroIT
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((domain, index) => (
              <article
                key={domain.title}
                className="reveal-item domain-card card card-hover h-full"
                style={{ "--index": index }}
              >
                <div className="domain-icon">{domain.icon}</div>
                <h3 className="domain-title">{domain.title}</h3>
                <p className="text-sm text-text-body leading-relaxed flex-1">{domain.description}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-accent-primary">
                  Learn more
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </article>
            ))}
          </RevealGroup>

          <Reveal delay={180} className="mt-8">
            <Link
              to="/domains"
              onClick={() => scrollToTop({ immediate: true })}
              className="btn btn-secondary"
            >
              Explore All Domains
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-philosophy">
        <div className="page-wrap relative">
          <Reveal>
            <div className="max-w-2xl philosophy-copy">
              <h2 className="section-title">Our Learning Philosophy</h2>
              <p className="text-text-body text-lg leading-relaxed">
                Like dynamic particles, we believe in adaptive, hands-on learning — not just
                teaching technology, but building how you{" "}
                <span className="philosophy-emphasis text-text-body font-medium">think</span>,
                <span className="philosophy-emphasis text-text-body font-medium"> innovate</span>, and{" "}
                <span className="philosophy-emphasis text-text-body font-medium">create</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-tint">
        <div className="page-wrap">
          <Reveal>
            <p className="section-kicker">03 // Your Growth</p>
            <h2 className="section-title mb-10">How AdroIT Will Transform You</h2>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {growthPillars.map((pillar, index) => (
              <article
                key={pillar.num}
                className="reveal-item pillar-card card-hover h-full"
                style={{ "--index": index }}
              >
                <div className="pillar-accent" aria-hidden="true" />
                <p className="font-mono text-sm font-semibold text-accent-primary mb-2">
                  {pillar.num}
                </p>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{pillar.title}</h3>
                <p className="text-text-body text-sm leading-relaxed">{pillar.description}</p>
              </article>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section-block section-surface">
        <div className="page-wrap">
          <Reveal>
            <p className="section-kicker">04 // What We Do</p>
            <h2 className="section-title">Join the AdroIT Community</h2>
            <p className="section-lead mb-10">
              Learn by building through hands-on sessions, collaborative projects, and real-world
              exposure in Machine Learning, Cloud Computing, Cybersecurity, and Data Analytics.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityCards.map((card, index) => (
              <article
                key={card.title}
                className="reveal-item community-card card card-hover p-6 h-full"
                style={{ "--index": index }}
              >
                <div className="community-icon">{card.icon}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">{card.title}</h3>
                <p className="text-text-body text-sm mb-4">{card.description}</p>
                <ul className="space-y-2 text-sm text-text-body">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 w-1 h-1 rounded-full bg-accent-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </RevealGroup>

          <Reveal delay={120}>
            <p className="text-sm text-text-muted mt-10">
              Recruitment for this cycle is closed. Next recruitment opens later this year.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
