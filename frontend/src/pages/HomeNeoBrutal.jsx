import { ArrowUpRight, BarChart3, Brain, Cloud, Megaphone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../lib/theme";

const showcase = [
  {
    name: "Machine Learning",
    Icon: Brain,
    text: "Understand the ML workflow from data preparation and model training to evaluation and deploying a working model.",
    tools: "Python, NumPy, Pandas, scikit-learn",
    tone: "pink",
    num: "01",
    wide: true,
  },
  {
    name: "Cybersecurity",
    Icon: ShieldCheck,
    text: "Understand how web applications and networks can be attacked, then learn the fundamentals of securing them.",
    tools: "Web Security, Networking, Ethical Hacking",
    tone: "orange",
    num: "02",
  },
  {
    name: "Cloud Computing",
    Icon: Cloud,
    text: "Learn how modern applications are deployed, scaled and secured using cloud infrastructure and services.",
    tools: "AWS, Docker, Linux, Networking",
    tone: "blue",
    num: "03",
  },
  {
    name: "Data Analytics",
    Icon: BarChart3,
    text: "Work with real datasets, clean and analyse data, build dashboards, and turn numbers into useful insights.",
    tools: "Python, SQL, Power BI",
    tone: "yellow",
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
    tone: "yellow",
  },
  {
    name: "Skill Up Boot Camp",
    text: "Four days covering Data Analytics, Cloud, Machine Learning, and Cybersecurity.",
    href: "/events/skill-up-bootcamp",
    tone: "blue",
  },
  {
    name: "Peptalks",
    text: "Talks with alumni and people from industry.",
    tone: "pink",
  },
  {
    name: "Tech Escape",
    text: "A technical event run by the club.",
    tone: "orange",
  },
  {
    name: "Internship Program",
    text: "A month of sessions for CSE students, taught by AdroIT members.",
    href: "/events/internship-2026",
    tone: "cream",
  },
  {
    name: "Online sessions",
    text: "Open to everyone in CSE, not just club members.",
    tone: "yellow",
  },
];

/** Neo-Brutalism presentation of the home page — same content, poster-block composition. */
export default function HomeNeoBrutal() {
  const { isDark } = useTheme();

  return (
    <div data-page="home-brutal" className="home-root relative min-h-dvh overflow-x-clip bg-page text-ink">
      <div data-part="nb-banner" className="px-4 py-2.5 text-center sm:px-6">
        AdroIT · RNSIT CSE · Build · Ship · Show
      </div>

      <section data-part="nb-hero" className="relative px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-stretch lg:gap-6">
          <div className="flex flex-col justify-end">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-ink-muted">
              ADROIT / RNSIT / CSE
            </p>
            <h1 className="ui-heading fluid-h1 mb-6 max-w-3xl uppercase">
              Build the
              <span data-part="nb-mark" className="mt-1 block px-2 sm:inline-block sm:px-3">
                next big
              </span>{" "}
              <span className="block">thing.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              The Premier Technical Club{" "}
              <span className="font-bold text-ink">Empowering Tomorrow&apos;s Innovators</span>{" "}
              through cutting-edge technology, collaborative projects, and industry-ready skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/domains" className="ui-solid px-6 py-3 text-sm">
                Explore Domains
              </Link>
              <Link
                to="/events"
                className="ui-pill inline-flex min-h-12 items-center gap-2 px-5 text-sm font-bold"
              >
                View Events
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:content-between">
            <div data-part="nb-block" className="relative overflow-hidden p-5 sm:p-6">
              <img
                alt="AdroIT"
                className="mb-4 h-16 w-auto object-contain sm:h-20"
                src={isDark ? "/adroit-ctf-logo-white-blue.png" : "/adroit-ctf-logo.png"}
              />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                Department of
              </p>
              <p className="ui-heading mt-1 text-xl font-bold uppercase leading-tight sm:text-2xl">
                Computer Science &amp; Engineering
              </p>
              <div
                data-part="nb-shape"
                data-tone="pink"
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rotate-12"
              />
            </div>
            <div data-part="nb-block" data-tone="blue" className="flex flex-col justify-between p-5 sm:p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] opacity-80">
                Mantra
              </p>
              <p className="ui-heading mt-4 text-2xl font-bold uppercase leading-none sm:text-3xl">
                Learn it.
                <br />
                Build it.
                <br />
                Show it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section data-part="nb-about" className="border-b-[3px] border-ink px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <p data-part="nb-num" aria-hidden="true">
            01
          </p>
          <div>
            <h2 className="ui-heading mb-4 text-3xl font-bold uppercase tracking-tight sm:text-5xl">
              About us
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed opacity-90">
              At AdroIT, learning goes beyond following tutorials. You learn a concept, apply it to a
              project, work with other students and present what you built.
            </p>
            <p className="mt-8 max-w-3xl text-base font-semibold leading-relaxed sm:text-lg">
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
            <Link to="/domains" className="ui-solid px-5 py-2.5 text-xs">
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
                  className={`flex flex-col justify-between p-5 ${d.wide ? "sm:col-span-2" : ""}`}
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
                03 · Events / What&apos;s happening?
              </p>
              <h2 className="ui-heading text-3xl font-bold uppercase tracking-tight sm:text-5xl">
                Poster wall
              </h2>
            </div>
            <Link
              to="/events"
              className="ui-pill inline-flex min-h-11 items-center gap-2 px-4 text-xs font-bold"
            >
              Open events
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const body = (
                <>
                  <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] opacity-75">
                    Event
                  </p>
                  <h3 className="ui-heading text-xl font-bold uppercase tracking-tight sm:text-2xl">
                    {e.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">{e.text}</p>
                  {e.href ? (
                    <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-[0.12em]">
                      Open
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              );

              return e.href ? (
                <Link
                  key={e.name}
                  to={e.href}
                  data-part="nb-domain"
                  data-tone={e.tone}
                  className="block p-5"
                >
                  {body}
                </Link>
              ) : (
                <div key={e.name} data-part="nb-domain" data-tone={e.tone} className="p-5">
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
