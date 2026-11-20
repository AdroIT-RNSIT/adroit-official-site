import { ArrowUpRight, BarChart3, Brain, Cloud, Megaphone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../lib/theme";

const showcase = [
  {
    name: "Data Analytics",
    Icon: BarChart3,
    text: "Work with real datasets, clean and analyse data, build dashboards, and turn numbers into useful insights.",
    tools: "Python, SQL, Power BI",
    tone: "yellow",
    num: "01",
  },
  {
    name: "Cloud Computing",
    Icon: Cloud,
    text: "Learn how modern applications are deployed, scaled and secured using cloud infrastructure and services.",
    tools: "AWS, Docker, Linux, Networking",
    tone: "blue",
    num: "02",
  },
  {
    name: "Machine Learning",
    Icon: Brain,
    text: "Understand the ML workflow from data preparation and model training to evaluation and deploying a working model.",
    tools: "Python, NumPy, Pandas, scikit-learn",
    tone: "pink",
    num: "03",
  },
  {
    name: "Cybersecurity",
    Icon: ShieldCheck,
    text: "Understand how web applications and networks can be attacked, then learn the fundamentals of securing them.",
    tools: "Web Security, Networking, Ethical Hacking",
    tone: "orange",
    num: "04",
  },
  {
    name: "Non-Tech",
    Icon: Megaphone,
    text: "Plan and run events, manage social media, design posters, and handle the outreach that keeps the club visible and moving.",
    tools: "Events, Design, Social Media, Outreach",
    tone: "cream",
    num: "05",
  },
];

const events = [
  {
    name: "Paradox",
    text: "Our inter-collegiate fest — CTF, Tech Auction, and AI Film Making.",
    href: "/events/paradox-2026",
  },
  {
    name: "Skill Up Boot Camp",
    text: "Four days covering Data Analytics, Cloud, Machine Learning, and Cybersecurity.",
    href: "/events/skill-up-bootcamp",
  },
  {
    name: "Peptalks",
    text: "Talks with alumni and people from industry.",
  },
  {
    name: "Tech Escape",
    text: "A technical event run by the club.",
  },
  {
    name: "Internship Program",
    text: "A month of sessions for CSE students, taught by AdroIT members.",
    href: "/events/internship-2026",
  },
  {
    name: "Online sessions",
    text: "Open to everyone in CSE, not just club members.",
  },
];

/** Neo-Brutalism presentation of the home page — same content, different composition. */
export default function HomeNeoBrutal() {
  const { isDark } = useTheme();

  return (
    <div data-page="home-brutal" className="home-root relative min-h-dvh overflow-x-clip bg-page text-ink">
      <div data-part="nb-banner" className="px-4 py-2.5 text-center sm:px-6">
        AdroIT · RNSIT CSE · Build · Ship · Show
      </div>

      <section data-part="nb-hero" className="relative px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
              ADROIT / RNSIT
            </p>
            <h1 className="ui-heading fluid-h1 mb-6 max-w-3xl uppercase">
              Build the
              <span className="block">next big</span>
              <span className="block">thing.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              The Premier Technical Club{" "}
              <span className="font-semibold text-ink">Empowering Tomorrow&apos;s Innovators</span>{" "}
              through cutting-edge technology, collaborative projects, and industry-ready skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/domains" className="ui-solid rounded-md px-6 py-3 text-sm">
                Explore Domains
              </Link>
              <Link
                to="/events"
                className="ui-pill inline-flex min-h-12 items-center gap-2 rounded-md px-5 text-sm font-bold"
              >
                View Events
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div data-part="nb-block" className="relative overflow-hidden rounded-xl p-6 sm:p-8">
            <img
              alt="AdroIT"
              className="mx-auto mb-6 h-20 w-auto object-contain sm:h-28"
              src={isDark ? "/adroit-ctf-logo-white-blue.png" : "/adroit-ctf-logo.png"}
            />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">
              Department of
            </p>
            <p className="ui-heading mt-1 text-2xl font-bold sm:text-3xl">
              Computer Science &amp; Engineering
            </p>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-12 border-[3px] border-ink bg-[var(--nb-pink,#ff6b9d)] opacity-90"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 border-[3px] border-ink bg-[var(--nb-blue,#3155e7)]"
            />
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-ink px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <p data-part="nb-num" aria-hidden="true">
            01
          </p>
          <div>
            <h2 className="ui-heading mb-4 text-3xl font-bold uppercase tracking-tight sm:text-5xl">
              About us
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
              At AdroIT, learning goes beyond following tutorials. You learn a concept, apply it to a
              project, work with other students and present what you built.
            </p>
            <p className="mt-6 max-w-2xl text-xl font-bold leading-snug text-ink sm:text-2xl">
              Learn it. Build it. Show it.
            </p>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Learn from seniors. Build with your peers. Then become the senior who helps someone else
              get started.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-ink px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <p data-part="nb-num" aria-hidden="true" className="!text-5xl sm:!text-7xl">
                02
              </p>
              <h2 className="ui-heading text-3xl font-bold uppercase tracking-tight sm:text-5xl">
                Domains
              </h2>
            </div>
            <Link to="/domains" className="ui-solid rounded-md px-5 py-2.5 text-xs">
              All domains
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((d) => {
              const Icon = d.Icon;
              return (
                <article
                  key={d.name}
                  data-part="nb-domain"
                  data-tone={d.tone}
                  className="flex flex-col justify-between rounded-xl p-5"
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] opacity-80">
                      {d.num}
                    </span>
                    <Icon size={28} strokeWidth={2.4} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="ui-heading text-xl font-bold uppercase tracking-tight">{d.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed opacity-90">{d.text}</p>
                    <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-75">
                      {d.tools}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                Events / What&apos;s happening?
              </p>
              <h2 className="ui-heading text-3xl font-bold uppercase tracking-tight sm:text-5xl">
                Through the year
              </h2>
            </div>
            <Link to="/events" className="ui-pill inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-xs font-bold">
              Open events
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <ul data-part="events-list" className="ui-card overflow-hidden rounded-xl px-2 sm:px-4">
            {events.map((e, i) => {
              const n = String(i + 1).padStart(2, "0");
              const inner = (
                <>
                  <span className="w-10 shrink-0 pt-1 font-mono text-sm font-bold text-ink">{n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold uppercase tracking-tight text-ink sm:text-xl">
                      {e.name}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{e.text}</span>
                  </span>
                  {e.href ? (
                    <ArrowUpRight size={18} className="mt-1.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <span className="mt-1.5 w-[18px] shrink-0" aria-hidden="true" />
                  )}
                </>
              );

              return (
                <li key={e.name} className="ui-well">
                  {e.href ? (
                    <Link
                      to={e.href}
                      className="group -mx-1 flex items-start gap-3 rounded-lg px-2 py-5 sm:gap-4 sm:px-3 sm:py-6"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 px-2 py-5 sm:gap-4 sm:px-3 sm:py-6">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
