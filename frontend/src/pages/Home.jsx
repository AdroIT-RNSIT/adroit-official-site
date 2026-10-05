import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BarChart3, Brain, Cloud, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EventCarousel from '../components/EventCarousel';
import { ParticleStage, ACCENTS, AUTO_MS } from "../components/DomainParticleStage";
import { registrationDomains } from '../data/domainRegistration';
import { useTheme } from '../lib/theme';

const liveEvent = {
  name: "Skill Up Boot Camp",
  when: "October 6–9, 2026",
  href: "/events/skill-up-bootcamp",
};

const showcase = [
  {
    name: "Data Analytics",
    Icon: BarChart3,
    text: "Work with real datasets, clean and analyse data, build dashboards, and turn numbers into useful insights.",
    tools: "Python, SQL, Power BI",
  },
  {
    name: "Cloud Computing",
    Icon: Cloud,
    text: "Learn how modern applications are deployed, scaled and secured using cloud infrastructure and services.",
    tools: "AWS, Docker, Linux, Networking",
  },
  {
    name: "Machine Learning",
    Icon: Brain,
    text: "Understand the ML workflow from data preparation and model training to evaluation and deploying a working model.",
    tools: "Python, NumPy, Pandas, scikit-learn",
  },
  {
    name: "Cybersecurity",
    Icon: ShieldCheck,
    text: "Understand how web applications and networks can be attacked, then learn the fundamentals of securing them.",
    tools: "Web Security, Networking, Ethical Hacking",
  },
];

const DomainShowcase = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const activeRef = useRef(0);
  const rotateRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ down: false, x: 0, y: 0 });

  activeRef.current = active;

  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (paused || reduce) return undefined;

    const id = setTimeout(
      () => setActive((a) => (a + 1) % showcase.length),
      AUTO_MS
    );

    return () => clearTimeout(id);
  }, [active, paused, tick, reduce]);

  const d = showcase[active];
  const accent = ACCENTS[active];

  const onStart = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragRef.current = {
      down: true,
      x: e.clientX,
      y: e.clientY,
    };

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e) => {
    if (!dragRef.current.down) return;

    rotateRef.current.y +=
      (e.clientX - dragRef.current.x) * 0.006;

    rotateRef.current.x = Math.max(
      -0.7,
      Math.min(
        0.7,
        rotateRef.current.x +
          (e.clientY - dragRef.current.y) * 0.004
      )
    );

    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
  };

  const onEnd = () => {
    dragRef.current.down = false;
  };

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div
        className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl sm:rounded-[2rem] bg-white text-slate-900 ring-1 ring-slate-200 dark:bg-black dark:text-white dark:ring-white/10"
        onPointerEnter={(e) => {
          if (e.pointerType !== "touch") setPaused(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "touch") {
            setPaused(false);
            setTick((t) => t + 1);
          }
        }}
      >
        {ACCENTS.map((c, i) => (
          <div
            key={c}
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: i === active ? 1 : 0,
              background: `radial-gradient(60% 70% at 72% 42%, ${c}33, transparent 70%)`,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col lg:min-h-[36rem]">
          <div className="px-5 pt-6 sm:px-10 sm:pt-10">
            <h2 className="text-2xl sm:text-5xl font-black leading-tight">
              What you could build
            </h2>

            <p className="mt-2 max-w-xl text-slate-600 dark:text-white/70">
              Explore the technical domains covered by AdroIT and build practical
              projects while learning the fundamentals behind them.
            </p>
          </div>

          <div className="relative mt-2 h-[clamp(13rem,56vw,20rem)] lg:pointer-events-none lg:absolute lg:inset-0 lg:z-20 lg:mt-0 lg:h-auto">
            <ParticleStage
              activeRef={activeRef}
              rotateRef={rotateRef}
            />

            <div
              aria-label="Drag sideways to rotate the shape"
              className="pointer-events-auto absolute inset-0 z-20 cursor-grab touch-pan-y select-none active:cursor-grabbing lg:inset-auto lg:bottom-32 lg:left-[48%] lg:right-0 lg:top-[10%] lg:touch-none"
              onPointerDown={onStart}
              onPointerMove={onMove}
              onPointerUp={onEnd}
              onPointerCancel={onEnd}
            />
          </div>

          <div className="flex flex-1 flex-col justify-end px-5 pb-6 pt-2 sm:px-10 sm:pb-8 lg:max-w-[48%]">
            <div
              key={active}
              style={{
                animation: reduce
                  ? "none"
                  : "domRise 600ms ease-out both",
              }}
            >
              <p
                className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base font-semibold"
                style={{ color: accent }}
              >
                <d.Icon size={18} className="shrink-0" />
                <span className="min-w-0 break-words">{d.tools}</span>
              </p>

              <h3 className="mt-1 text-2xl sm:text-5xl font-extrabold leading-tight">
                {d.name}
              </h3>

              <p className="mt-3 max-w-md text-base sm:text-lg text-slate-600 dark:text-white/70">
                {d.text}
              </p>
            </div>
          </div>

          <div
            role="tablist"
            className="grid grid-cols-2 lg:grid-cols-4 gap-px border-t border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/10"
          >
            {showcase.map((s, i) => {
              const on = i === active;

              return (
                <button
                  key={s.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setActive(i);
                    setTick((t) => t + 1);
                  }}
                  className={`relative flex min-h-[3.25rem] items-center justify-between gap-2 px-3 py-3 sm:min-h-[3.5rem] sm:px-7 sm:py-5 text-left transition-colors ${
                    on
                      ? "bg-white dark:bg-[#111111]"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-black dark:hover:bg-[#1a1a1a]"
                  }`}
                >
                  {on && (
                    <span
                      key={`${active}-${tick}`}
                      className="absolute left-0 top-0 h-[3px] w-full origin-left"
                      style={{
                        backgroundColor: ACCENTS[i],
                        animation: reduce
                          ? "none"
                          : `domFill ${AUTO_MS}ms linear forwards`,
                        animationPlayState: paused
                          ? "paused"
                          : "running",
                      }}
                    />
                  )}

                  <span
                    className={`text-[13px] leading-snug sm:text-lg font-bold ${
                      on
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-white/70"
                    }`}
                  >
                    {s.name}
                  </span>

                  <s.Icon
                    className="hidden sm:block shrink-0"
                    size={22}
                    style={{
                      color: on
                        ? ACCENTS[i]
                        : "rgba(71,85,105,.5)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes domFill {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @keyframes domRise {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

const session = [
  {
    cmd: "adroit learn",
    out: "Learn technical concepts through sessions conducted by AdroIT members and industry-oriented workshops.",
  },
  {
    cmd: "adroit build --team",
    out: "Work with your team on practical projects and turn ideas into working applications.",
  },
  {
    cmd: "adroit demo",
    out: "Present what you built, explain your decisions, and learn from feedback.",
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

const Terminal = () => {
  const ref = useRef(null);
  const total = session.reduce(
    (n, s) => n + s.cmd.length,
    0
  );

  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) {
      setTyped(total);
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) io.observe(ref.current);

    return () => io.disconnect();
  }, [total]);

  useEffect(() => {
    if (!started) return;

    const id = setInterval(
      () =>
        setTyped((t) =>
          t >= total ? t : t + 1
        ),
      45
    );

    return () => clearInterval(id);
  }, [started, total]);

  let left = typed;

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-slate-900 text-slate-100 shadow-xl overflow-hidden border border-slate-700"
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700">
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />

        <span className="ml-3 font-mono text-xs text-slate-400">
          adroit.sh
        </span>
      </div>

      <div className="p-4 sm:p-7 font-mono text-[13px] sm:text-base space-y-5 min-h-[16rem] sm:min-h-[20rem] overflow-x-auto">
        {session.map((s) => {
          const shown = Math.max(
            0,
            Math.min(left, s.cmd.length)
          );

          const done = left >= s.cmd.length;

          left -= s.cmd.length;

          if (shown === 0 && !done) return null;

          return (
            <div key={s.cmd}>
              <p className="break-words">
                <span className="text-sky-400">
                  ${" "}
                </span>
                {s.cmd.slice(0, shown)}
              </p>

              {done && (
                <p className="text-slate-400 mt-1 pl-4 font-sans text-sm sm:text-base">
                  {s.out}
                </p>
              )}
            </div>
          );
        })}

        <p aria-hidden="true">
          <span className="text-sky-400">$ </span>
          <span className="inline-block w-2 h-4 bg-sky-400 align-middle animate-pulse" />
        </p>
      </div>
    </div>
  );
};

const Home = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;

    if (!el) return;

    const frame = requestAnimationFrame(() => {
      el.classList.add(
        "opacity-100",
        "translate-y-0"
      );

      el.classList.remove(
        "opacity-0",
        "translate-y-4"
      );
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const domainCards = registrationDomains
    .filter((domain) => domain.slug !== "non-tech")
    .map((domain) => ({
      _id: domain.slug,
      title: domain.title,
      description: domain.description,
      label: domain.label,
      link: `/register/${domain.slug}`,
    }));

  return (
    <div className="home-root relative min-h-dvh overflow-x-clip">
      <div className="lg:hidden relative z-[1001] flex items-center justify-between gap-3 px-3 pt-1">
        <img
          src={
            isDark
              ? "/rnsit_logo_white_text.png"
              : "/rnsit_logo.png"
          }
          alt="RNSIT Logo"
          className={`h-auto w-[min(7.35rem,52%)] sm:w-[11.55rem] object-contain object-left ${
            isDark ? "" : "mix-blend-multiply"
          }`}
        />

        <img
          src="/25_years_new.png"
          alt="25 Years Excellence"
          className="h-auto w-[min(3.15rem,26%)] sm:w-[4.2rem] object-contain object-right mix-blend-multiply"
        />
      </div>

      <div className="hidden lg:flex absolute top-0 inset-x-0 z-[1001] items-center justify-between pointer-events-none">
        <img
          src={
            isDark
              ? "/rnsit_logo_white_text.png"
              : "/rnsit_logo.png"
          }
          alt="RNSIT Logo"
          className={`h-[9rem] w-auto max-w-[37.5%] object-contain object-left ${
            isDark ? "" : "mix-blend-multiply"
          }`}
        />

        <img
          src="/25_years_new.png"
          alt="25 Years Excellence"
          className="h-[7.5rem] w-auto max-w-[21%] object-contain object-right mix-blend-multiply"
        />
      </div>

      <section
        ref={heroRef}
        className="relative flex flex-col items-center overflow-x-clip px-4 sm:px-6 lg:px-8 pt-6 pb-6 sm:pt-24 sm:pb-10 lg:pt-28 lg:pb-8 opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none"
      >
        <div className="max-w-5xl text-center z-10 relative w-full mx-auto">
          <span className="inline-flex max-w-full items-center mb-4 rounded-full border border-slate-300/80 px-3 py-1 font-mono text-[10px] tracking-[0.18em] uppercase text-sky-800 whitespace-nowrap sm:px-3.5 sm:text-xs sm:tracking-[0.22em]">
            Recruiting soon
          </span>
          <img
            alt="AdroIT"
            className="block object-contain h-16 sm:h-24 md:h-[7.5rem] w-auto max-w-[min(100%,18rem)] mx-auto mb-4 sm:mb-5"
            src={isDark ? "/adroit-ctf-logo-white-blue.png" : "/adroit-ctf-logo.png"}
          />
          <h1 className="mx-auto mb-5 max-w-xl px-1 text-base sm:mb-8 sm:px-4 sm:text-xl md:text-2xl font-medium tracking-tight text-sky-800 leading-snug">
            <span className="sr-only">AdroIT — </span>
            Department of
            <span className="mt-0.5 block font-bold">
              Computer Science &amp; Engineering
            </span>
          </h1>
          <p className="text-[0.95rem] leading-relaxed text-slate-600 max-w-4xl mx-auto mb-4 sm:mb-8 sm:text-lg md:text-xl">
            The Premier Technical Club{" "}
            <span className="text-sky-800">Empowering Tomorrow's Innovators</span>{" "}
            through cutting-edge technology, collaborative projects, and industry-ready skills
          </p>
          <EventCarousel
            events={domainCards}
            onSelect={(domain) => {
              navigate(`/events/skill-up-bootcamp?domain=${domain._id}`);
            }}
          />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-14">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 className="fluid-h2 font-bold text-slate-900 dark:text-white leading-[1.1] mb-5">
              Learn it. Build it. Show it.
            </h2>

            <p className="text-slate-600 dark:text-white/70 text-lg leading-relaxed max-w-md">
              At AdroIT, learning goes beyond following tutorials.
              You learn a concept, apply it to a project, work with
              other students and present what you built.
            </p>
          </div>

          <Terminal />
        </div>
      </section>

      <DomainShowcase />

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <p className="fluid-h2 font-bold text-slate-900 dark:text-white leading-[1.15] max-w-4xl">
            Learn from seniors. Build with your peers. Then become
            the senior who helps someone else get started.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Events through the year
          </h2>

          <ul className="divide-y divide-slate-200/80 border-y border-slate-200/80 dark:divide-white/10 dark:border-white/10">
            {events.map((e, i) => {
              const n = String(i + 1).padStart(2, "0");
              const inner = (
                <>
                  <span className="font-mono text-xs text-sky-800 dark:text-sky-300 pt-1.5 w-8 shrink-0">
                    {n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                      {e.name}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                      {e.text}
                    </span>
                  </span>
                  {e.href ? (
                    <ArrowUpRight
                      size={18}
                      className="mt-1.5 shrink-0 text-slate-400 transition-colors group-hover:text-sky-700 dark:group-hover:text-sky-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="mt-1.5 w-[18px] shrink-0" aria-hidden="true" />
                  )}
                </>
              );

              return (
                <li key={e.name}>
                  {e.href ? (
                    <Link
                      to={e.href}
                      className="group flex items-start gap-3 sm:gap-4 py-5 sm:py-6 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03] -mx-2 px-2 sm:mx-0 sm:px-0"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 sm:gap-4 py-5 sm:py-6">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl bg-sky-700 text-white p-6 sm:p-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold">
              Skill Up Boot Camp
            </h2>

            <p className="text-sky-100 mt-2">
              Four days. Four domains. Hands-on technical
              exposure from October 6 to October 9, 2026.
            </p>
          </div>

          <Link
            to={liveEvent.href}
            className="shrink-0 inline-flex w-full sm:w-auto justify-center rounded-lg bg-white px-6 py-3 font-semibold text-sky-800 hover:bg-sky-50 transition-colors"
          >
            Explore the boot camp
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;