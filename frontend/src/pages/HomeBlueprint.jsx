import { ArrowUpRight, BarChart3, Brain, Cloud, Megaphone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../lib/theme";

const showcase = [
  {
    name: "Machine Learning",
    Icon: Brain,
    text: "Understand the ML workflow from data preparation and model training to evaluation and deploying a working model.",
    tools: "Python · NumPy · Pandas · scikit-learn",
    ref: "DOM-ML",
  },
  {
    name: "Cybersecurity",
    Icon: ShieldCheck,
    text: "Understand how web applications and networks can be attacked, then learn the fundamentals of securing them.",
    tools: "Web Security · Networking · Ethical Hacking",
    ref: "DOM-SEC",
  },
  {
    name: "Cloud Computing",
    Icon: Cloud,
    text: "Learn how modern applications are deployed, scaled and secured using cloud infrastructure and services.",
    tools: "AWS · Docker · Linux · Networking",
    ref: "DOM-CLD",
  },
  {
    name: "Data Analytics",
    Icon: BarChart3,
    text: "Work with real datasets, clean and analyse data, build dashboards, and turn numbers into useful insights.",
    tools: "Python · SQL · Power BI",
    ref: "DOM-DA",
  },
  {
    name: "Non-Tech",
    Icon: Megaphone,
    text: "Plan and run events, manage social media, design posters, and handle the outreach that keeps the club visible and moving.",
    tools: "Events · Design · Social · Outreach",
    ref: "DOM-OPS",
  },
];

const events = [
  {
    name: "Paradox",
    text: "Our inter-collegiate fest — CTF, Tech Auction, and AI Film Making.",
    href: "/events/paradox-2026",
    ref: "EVT-01",
  },
  {
    name: "Skill Up Boot Camp",
    text: "Four days covering Data Analytics, Cloud, Machine Learning, and Cybersecurity.",
    href: "/events/skill-up-bootcamp",
    ref: "EVT-02",
  },
  {
    name: "Peptalks",
    text: "Talks with alumni and people from industry.",
    ref: "EVT-03",
  },
  {
    name: "Tech Escape",
    text: "A technical event run by the club.",
    ref: "EVT-04",
  },
  {
    name: "Internship Program",
    text: "A month of sessions for CSE students, taught by AdroIT members.",
    href: "/events/internship-2026",
    ref: "EVT-05",
  },
  {
    name: "Online sessions",
    text: "Open to everyone in CSE, not just club members.",
    ref: "EVT-06",
  },
];

/** Blueprint Tech presentation of the home page — CAD/doc composition, same content. */
export default function HomeBlueprint() {
  const { isDark } = useTheme();

  return (
    <div data-page="home-blueprint" className="home-root relative min-h-dvh overflow-x-clip bg-page text-ink">
      <div data-part="bp-sheet" className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div data-part="bp-meta" className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            AdroIT · RNSIT CSE · DWG-HOME-01
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            Rev A · Public
          </p>
        </div>

        <section data-part="bp-hero" className="grid gap-8 border-b border-line pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-10 lg:pb-14">
          <div className="min-w-0">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              Title block
            </p>
            <h1 className="ui-heading fluid-h1 mb-5 max-w-xl">
              AdroIT
              <span className="mt-2 block text-[0.36em] font-medium tracking-[-0.02em] text-ink-muted sm:text-[0.32em]">
                Department of Computer Science &amp; Engineering
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
              The Premier Technical Club{" "}
              <span className="text-primary-ink">Empowering Tomorrow&apos;s Innovators</span>{" "}
              through cutting-edge technology, collaborative projects, and industry-ready skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/domains" className="ui-solid px-5 py-2.5 text-sm">
                Explore Domains
              </Link>
              <Link
                to="/events"
                className="ui-pill inline-flex min-h-11 items-center gap-2 px-4 text-xs"
              >
                View Events
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div data-part="bp-titleblock" className="ui-card min-w-0 overflow-hidden p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-line pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                Sheet · Identity
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Scale NTS
              </span>
            </div>
            <img
              alt="AdroIT"
              className="mx-auto mb-4 h-16 w-auto object-contain sm:h-20"
              src={isDark ? "/adroit-ctf-logo-white-blue.png" : "/adroit-ctf-logo.png"}
            />
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              Learn · Build · Show
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
              {["CSE", "RNSIT", "2020+"].map((cell) => (
                <div key={cell} className="ui-well px-2 py-2 text-center">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                    {cell}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line py-12 lg:py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                01 · About
              </p>
              <h2 className="ui-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Learn it. Build it. Show it.
              </h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              Spec / method
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <p className="max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              At AdroIT, learning goes beyond following tutorials. You learn a concept, apply it to a
              project, work with other students and present what you built.
            </p>
            <div className="ui-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Note</p>
              <p className="mt-2 text-sm leading-relaxed text-ink sm:text-base">
                Learn from seniors. Build with your peers. Then become the senior who helps someone
                else get started.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-line py-12 lg:py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                02 · Domains
              </p>
              <h2 className="ui-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                System modules
              </h2>
              <p className="mt-2 max-w-xl text-sm text-ink-muted sm:text-base">
                Explore the technical and non-technical domains at AdroIT, and build real projects and
                events while learning the fundamentals.
              </p>
            </div>
            <Link to="/domains" className="ui-solid px-4 py-2 text-xs">
              All domains
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {showcase.map((d) => {
              const Icon = d.Icon;
              return (
                <article
                  key={d.name}
                  data-part="bp-module"
                  className={`ui-card flex min-w-0 flex-col justify-between overflow-hidden p-5 ${
                    d.name === "Non-Tech" ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      {d.ref}
                    </span>
                    <Icon size={20} strokeWidth={1.75} className="shrink-0 text-primary" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="ui-heading text-lg font-semibold tracking-tight sm:text-xl">
                      {d.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d.text}</p>
                    <p className="mt-4 break-words font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                      {d.tools}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-12 lg:py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                03 · Events
              </p>
              <h2 className="ui-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Schedule through the year
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

          <ul data-part="events-list" className="ui-card overflow-hidden px-2 sm:px-3">
            {events.map((e) => {
              const inner = (
                <>
                  <span className="w-16 shrink-0 pt-0.5 font-mono text-[11px] text-primary">
                    {e.ref}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-ink sm:text-lg">{e.name}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{e.text}</span>
                  </span>
                  {e.href ? (
                    <ArrowUpRight size={16} className="mt-1 shrink-0 text-ink-muted" aria-hidden="true" />
                  ) : (
                    <span className="mt-1 w-4 shrink-0" aria-hidden="true" />
                  )}
                </>
              );

              return (
                <li key={e.name} className="ui-well">
                  {e.href ? (
                    <Link
                      to={e.href}
                      className="group -mx-1 flex items-start gap-3 rounded-sm px-2 py-4 sm:gap-4 sm:px-3 sm:py-5"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 px-2 py-4 sm:gap-4 sm:px-3 sm:py-5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
