import { ArrowUpRight, BarChart3, Brain, Cloud, Megaphone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../lib/theme";

const showcase = [
  {
    name: "Data Analytics",
    Icon: BarChart3,
    text: "Work with real datasets, clean and analyse data, build dashboards, and turn numbers into useful insights.",
    tools: "Python, SQL, Power BI",
    tone: "mint",
  },
  {
    name: "Cloud Computing",
    Icon: Cloud,
    text: "Learn how modern applications are deployed, scaled and secured using cloud infrastructure and services.",
    tools: "AWS, Docker, Linux, Networking",
    tone: "sky",
  },
  {
    name: "Machine Learning",
    Icon: Brain,
    text: "Understand the ML workflow from data preparation and model training to evaluation and deploying a working model.",
    tools: "Python, NumPy, Pandas, scikit-learn",
    tone: "lavender",
  },
  {
    name: "Cybersecurity",
    Icon: ShieldCheck,
    text: "Understand how web applications and networks can be attacked, then learn the fundamentals of securing them.",
    tools: "Web Security, Networking, Ethical Hacking",
    tone: "coral",
  },
  {
    name: "Non-Tech",
    Icon: Megaphone,
    text: "Plan and run events, manage social media, design posters, and handle the outreach that keeps the club visible and moving.",
    tools: "Events, Design, Social Media, Outreach",
    tone: "yellow",
  },
];

const events = [
  {
    name: "Paradox",
    text: "Our inter-collegiate fest — CTF, Tech Auction, and AI Film Making.",
    href: "/events/paradox-2026",
    tone: "coral",
  },
  {
    name: "Skill Up Boot Camp",
    text: "Four days covering Data Analytics, Cloud, Machine Learning, and Cybersecurity.",
    href: "/events/skill-up-bootcamp",
    tone: "sky",
  },
  {
    name: "Peptalks",
    text: "Talks with alumni and people from industry.",
    tone: "lavender",
  },
  {
    name: "Tech Escape",
    text: "A technical event run by the club.",
    tone: "mint",
  },
  {
    name: "Internship Program",
    text: "A month of sessions for CSE students, taught by AdroIT members.",
    href: "/events/internship-2026",
    tone: "yellow",
  },
  {
    name: "Online sessions",
    text: "Open to everyone in CSE, not just club members.",
    tone: "peach",
  },
];

/** Creative Campus presentation of the home page — same content, warmer composition. */
export default function HomeCreativeCampus() {
  const { isDark } = useTheme();

  return (
    <div data-page="home-campus" className="home-root relative min-h-dvh overflow-x-clip bg-page text-ink">
      <section data-part="cc-hero" className="relative overflow-x-clip px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-10 lg:pb-24 lg:pt-16">
        <span
          data-part="cc-blob"
          data-tone="yellow"
          aria-hidden="true"
          className="pointer-events-none left-[8%] top-8 hidden h-28 w-28 opacity-70 sm:block sm:h-40 sm:w-40"
        />
        <span
          data-part="cc-blob"
          data-tone="sky"
          aria-hidden="true"
          className="pointer-events-none right-[6%] top-24 hidden h-24 w-32 opacity-60 sm:block sm:h-36 sm:w-44"
        />
        <span
          data-part="cc-blob"
          data-tone="lavender"
          aria-hidden="true"
          className="pointer-events-none bottom-6 left-[42%] hidden h-20 w-28 opacity-50 lg:block"
        />

        <div className="relative z-[1] mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div>
            <span data-part="cc-chip" className="mb-5">
              RNSIT · CSE community
            </span>
            <h1 className="ui-heading fluid-h1 mb-5 max-w-xl">
              AdroIT
              <span className="mt-2 block text-[0.38em] font-semibold tracking-[-0.02em] text-ink-muted sm:text-[0.34em]">
                Department of Computer Science &amp; Engineering
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
              The Premier Technical Club{" "}
              <span className="font-semibold text-primary-ink">Empowering Tomorrow&apos;s Innovators</span>{" "}
              through cutting-edge technology, collaborative projects, and industry-ready skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/domains" className="ui-solid">
                Explore Domains
              </Link>
              <Link
                to="/events"
                className="ui-pill inline-flex min-h-11 items-center gap-2 px-5 text-sm"
              >
                View Events
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div data-part="cc-panel" className="relative overflow-hidden p-6 sm:p-8">
            <span
              data-part="cc-blob"
              data-tone="coral"
              aria-hidden="true"
              className="pointer-events-none -right-8 -top-10 h-24 w-24 opacity-45"
            />
            <img
              alt="AdroIT"
              className="relative z-[1] mx-auto mb-5 h-20 w-auto object-contain sm:h-28"
              src={isDark ? "/adroit-ctf-logo-white-blue.png" : "/adroit-ctf-logo.png"}
            />
            <p className="relative z-[1] text-center font-semibold text-ink sm:text-lg">
              Learn it. Build it. Show it.
            </p>
            <p className="relative z-[1] mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-ink-muted">
              At AdroIT, learning goes beyond following tutorials. You learn a concept, apply it to a
              project, work with other students and present what you built.
            </p>
          </div>
        </div>
      </section>

      <hr data-part="cc-divider" className="mx-auto max-w-6xl" />

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span data-part="cc-chip">About the club</span>
          </div>
          <h2 className="ui-heading mb-6 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            Learn from seniors. Build with your peers. Then become the senior who helps someone else
            get started.
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Learn", text: "Sessions with members and industry-oriented workshops." },
              { title: "Build", text: "Team projects that turn ideas into working applications." },
              { title: "Show", text: "Present what you built and learn from feedback." },
            ].map((step, i) => (
              <div key={step.title} className="ui-well rounded-3xl p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  0{i + 1}
                </p>
                <h3 className="ui-heading mt-2 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span data-part="cc-chip" className="mb-4">
                Domains
              </span>
              <h2 className="ui-heading mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                What you could build
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
                  data-part="cc-domain"
                  data-tone={d.tone}
                  className={`flex flex-col justify-between p-5 sm:p-6 ${
                    d.name === "Non-Tech" ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-page text-ink">
                      <Icon size={22} strokeWidth={2} aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <h3 className="ui-heading text-xl font-bold tracking-tight sm:text-2xl">{d.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">{d.text}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
                      {d.tools}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <hr data-part="cc-divider" className="mx-auto max-w-6xl" />

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span data-part="cc-chip" className="mb-4">
                Events through the year
              </span>
              <h2 className="ui-heading mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Something happening, always
              </h2>
            </div>
            <Link
              to="/events"
              className="ui-pill inline-flex min-h-11 items-center gap-2 px-4 text-sm"
            >
              Open events
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const body = (
                <>
                  <h3 className="ui-heading text-xl font-bold tracking-tight">{e.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{e.text}</p>
                  {e.href ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-ink">
                      Open
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              );

              const className = "block p-5 sm:p-6";

              return e.href ? (
                <Link key={e.name} to={e.href} data-part="cc-event" data-tone={e.tone} className={className}>
                  {body}
                </Link>
              ) : (
                <div key={e.name} data-part="cc-event" data-tone={e.tone} className={className}>
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
