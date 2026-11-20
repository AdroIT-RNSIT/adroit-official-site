import { ArrowUpRight, BarChart3, Brain, Cloud, Megaphone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../lib/theme";

const showcase = [
  {
    name: "Machine Learning",
    Icon: Brain,
    text: "Understand the ML workflow from data preparation and model training to evaluation and deploying a working model.",
    tools: "Python · NumPy · Pandas · scikit-learn",
    code: "NODE-01",
  },
  {
    name: "Cybersecurity",
    Icon: ShieldCheck,
    text: "Understand how web applications and networks can be attacked, then learn the fundamentals of securing them.",
    tools: "Web Security · Networking · Ethical Hacking",
    code: "NODE-02",
  },
  {
    name: "Cloud Computing",
    Icon: Cloud,
    text: "Learn how modern applications are deployed, scaled and secured using cloud infrastructure and services.",
    tools: "AWS · Docker · Linux · Networking",
    code: "NODE-03",
  },
  {
    name: "Data Analytics",
    Icon: BarChart3,
    text: "Work with real datasets, clean and analyse data, build dashboards, and turn numbers into useful insights.",
    tools: "Python · SQL · Power BI",
    code: "NODE-04",
  },
  {
    name: "Non-Tech",
    Icon: Megaphone,
    text: "Plan and run events, manage social media, design posters, and handle the outreach that keeps the club visible and moving.",
    tools: "Events · Design · Social · Outreach",
    code: "NODE-05",
    span: "wide",
  },
];

const events = [
  {
    name: "Paradox",
    text: "Our inter-collegiate fest — CTF, Tech Auction, and AI Film Making.",
    href: "/events/paradox-2026",
    tag: "FEST",
  },
  {
    name: "Skill Up Boot Camp",
    text: "Four days covering Data Analytics, Cloud, Machine Learning, and Cybersecurity.",
    href: "/events/skill-up-bootcamp",
    tag: "CAMP",
  },
  {
    name: "Peptalks",
    text: "Talks with alumni and people from industry.",
    tag: "TALK",
  },
  {
    name: "Tech Escape",
    text: "A technical event run by the club.",
    tag: "LAB",
  },
  {
    name: "Internship Program",
    text: "A month of sessions for CSE students, taught by AdroIT members.",
    href: "/events/internship-2026",
    tag: "PROG",
  },
  {
    name: "Online sessions",
    text: "Open to everyone in CSE, not just club members.",
    tag: "LIVE",
  },
];

const stats = [
  { value: "50+", label: "Members" },
  { value: "30+", label: "Projects" },
  { value: "20+", label: "Events" },
  { value: "2020", label: "Boot" },
];

/** Cyber presentation of the home page — neon terminal composition. */
export default function HomeCyber() {
  const { isDark } = useTheme();

  return (
    <div data-page="home-cyber" className="home-root relative min-h-dvh overflow-x-clip bg-page text-ink">
      <section data-part="cy-hero" className="relative px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-10 lg:pb-24 lg:pt-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <p data-part="cy-kicker" aria-live="polite">
              Link established · RNSIT CSE
            </p>
            <h1 className="ui-heading fluid-h1 mb-5 max-w-xl">
              AdroIT
              <span className="mt-3 block text-[0.32em] font-normal tracking-[0.18em] text-ink-muted sm:text-[0.28em]">
                Department of Computer Science &amp; Engineering
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
              The Premier Technical Club{" "}
              <span className="text-primary-ink">Empowering Tomorrow&apos;s Innovators</span>{" "}
              through cutting-edge technology, collaborative projects, and industry-ready skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/domains" className="ui-solid">
                Explore Domains
              </Link>
              <Link
                to="/events"
                className="ui-pill inline-flex min-h-11 items-center gap-2 px-5 text-xs"
              >
                View Events
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div data-part="cy-panel" className="relative flex min-h-[18rem] flex-col justify-between p-5 sm:min-h-[22rem] sm:p-7">
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-2">
              <p data-part="cy-meta">SYS · ONLINE</p>
              <p data-part="cy-meta">ENC · ON</p>
            </div>
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-4">
              <img
                alt="AdroIT"
                className="mb-4 h-20 w-auto object-contain sm:h-28"
                src={isDark ? "/adroit-ctf-logo-white-blue.png" : "/adroit-ctf-logo.png"}
              />
              <p data-part="cy-meta" className="text-center">
                Access · Build · Defend
              </p>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} data-part="cy-stat">
                  <p data-part="value">{s.value}</p>
                  <p data-part="label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr data-part="cy-divider" className="mx-auto max-w-6xl" />

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <div>
            <p data-part="cy-kicker">01 · About</p>
            <h2 className="ui-heading mb-5 text-3xl tracking-tight sm:text-5xl">
              Learn it. Build it. Show it.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
              At AdroIT, learning goes beyond following tutorials. You learn a concept, apply it to a
              project, work with other students and present what you built.
            </p>
          </div>
          <div className="ui-card space-y-6 p-6 sm:p-8">
            <p data-part="cy-meta">Pipeline · peer ops</p>
            <p className="ui-heading text-2xl leading-snug sm:text-3xl">
              Learn from seniors. Build with your peers. Then become the senior who helps someone else
              get started.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Learn", "Build", "Show"].map((step, i) => (
                <div key={step} className="ui-well px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-semibold uppercase tracking-wide text-ink">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p data-part="cy-kicker">02 · Domains</p>
              <h2 className="ui-heading text-3xl tracking-tight sm:text-5xl">
                Attack surface of craft
              </h2>
              <p className="mt-3 max-w-xl text-ink-muted">
                Explore the technical and non-technical domains at AdroIT, and build real projects and
                events while learning the fundamentals.
              </p>
            </div>
            <Link to="/domains" className="ui-solid text-sm">
              All domains
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((d) => {
              const Icon = d.Icon;
              return (
                <article
                  key={d.name}
                  data-part="cy-domain"
                  className={`flex flex-col justify-between p-5 sm:p-6 ${
                    d.span === "wide" ? "sm:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  <div className="mb-8 flex items-start justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      {d.code}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center border border-line text-primary">
                      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <h3 className="ui-heading text-xl tracking-tight sm:text-2xl">{d.name}</h3>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted sm:text-base">
                      {d.text}
                    </p>
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                      {d.tools}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <hr data-part="cy-divider" className="mx-auto max-w-6xl" />

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p data-part="cy-kicker">03 · Events</p>
              <h2 className="ui-heading text-3xl tracking-tight sm:text-5xl">
                Through the year
              </h2>
            </div>
            <Link
              to="/events"
              className="ui-pill inline-flex min-h-11 items-center gap-2 px-4 text-xs"
            >
              Open calendar
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {events.map((e) => {
              const body = (
                <>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      {e.tag}
                    </span>
                    {e.href ? (
                      <ArrowUpRight size={16} className="text-ink-muted" aria-hidden="true" />
                    ) : null}
                  </div>
                  <h3 className="ui-heading text-xl tracking-tight sm:text-2xl">{e.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">{e.text}</p>
                </>
              );

              const className =
                "ui-card block p-5 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 sm:p-6";

              return e.href ? (
                <Link key={e.name} to={e.href} className={className}>
                  {body}
                </Link>
              ) : (
                <div key={e.name} className={className}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
