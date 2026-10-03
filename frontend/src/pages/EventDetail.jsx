import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BarChart3, Brain, Calendar, ChevronLeft, ChevronRight, Cloud, MapPin, ShieldCheck, X } from "lucide-react";
import RegistrationModal from "../components/RegistrationModal";
import GlimpseGallery from "../components/GlimpseGallery";
import { eventPhase, eventStatusLabel, findEditionForCompetitionSlug, getEventBySlug, sessionCompleted } from "../data/events";

const SESSION_ICONS = {
  "data-analytics": BarChart3,
  "cloud-computing": Cloud,
  "machine-learning": Brain,
  cybersecurity: ShieldCheck,
};

const formatRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();
  if (sameMonth) {
    return `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
};

export default function EventDetail() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);
  const legacyEdition = findEditionForCompetitionSlug(slug);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [glimpseIndex, setGlimpseIndex] = useState(null);

  useEffect(() => {
    setIsRegOpen(false);
    setGlimpseIndex(null);
  }, [slug]);

  useEffect(() => {
    if (glimpseIndex == null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setGlimpseIndex(null);
      if (e.key === "ArrowRight") setGlimpseIndex((i) => (i == null ? i : i + 1));
      if (e.key === "ArrowLeft") setGlimpseIndex((i) => (i == null ? i : i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [glimpseIndex]);

  if (!event && legacyEdition) {
    return <Navigate to={`/events/${legacyEdition.slug}`} replace />;
  }

  if (!event) return <Navigate to="/events" replace />;
  if (event.slug === "skill-up-bootcamp") {
    return <BootcampPage event={event} />;
  }

  const isCompleted = event.status === "completed";
  const individualRegistration = event.registration === "individual";
  const poster = event.poster || event.imageUrl;
  const posterContained = event.posterFit === "contain";
  const glimpses = (
    event.glimpses?.length
      ? event.glimpses
      : event.competitions?.length
        ? [
            ...event.competitions.map((c) => c.poster || c.imageUrl),
            event.poster,
            event.imageUrl,
          ]
        : []
  ).filter((src, idx, arr) => src && arr.indexOf(src) === idx);
  const competitions = event.competitions || [];
  const dateLabel = event.dateLabel || formatRange(event.date, event.endDate);
  const sessions = event.sessions || [];
  const activeGlimpse =
    glimpseIndex == null ? null : ((glimpseIndex % glimpses.length) + glimpses.length) % glimpses.length;

  return (
    <div className="relative min-h-dvh overflow-x-clip pb-16 text-slate-900 dark:text-slate-100">
      <section className={`relative overflow-hidden ${poster && !posterContained ? "min-h-[42vh] sm:min-h-[48vh]" : "pt-6"}`}>
        {poster && !posterContained && (
          <>
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full scale-105 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-black/25 dark:from-[#080c16] dark:via-[#080c16]/70 dark:to-black/40" />
          </>
        )}

        <div className={`relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-10 pt-8 sm:px-6 lg:px-8 ${poster && !posterContained ? "min-h-[42vh] sm:min-h-[48vh]" : ""}`}>
          {posterContained && (
            <img
              src={poster}
              alt={`${event.title} poster`}
              className="mx-auto mb-8 w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50 object-contain dark:border-white/10 dark:bg-white/5"
            />
          )}
          <div>
          <Link
            to="/events"
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-sky-600/40 hover:text-sky-800"
          >
            <ArrowLeft size={16} />
            Events
          </Link>
          <div className="flex items-center justify-between gap-6 sm:gap-10">
            <div className="min-w-0 flex-1">
              {event.eyebrow && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                  {event.eyebrow}
                </p>
              )}
              <h1 className="text-4xl font-extrabold leading-tight text-sky-800 sm:text-5xl">
                {event.title}
              </h1>
            </div>
            {!isCompleted && !individualRegistration && (
              <button
                type="button"
                onClick={() => setIsRegOpen(true)}
                className="shrink-0 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-900/15 hover:bg-sky-700 sm:px-7 sm:py-3"
              >
                Register now
              </button>
            )}
          </div>
          {event.tagline && (
            <p className="mt-3 max-w-2xl text-base text-slate-700 sm:text-lg">
              {event.tagline}
            </p>
          )}
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetaCard icon={<Calendar size={16} />} label="Date" value={dateLabel} />
          {event.location && (
            <MetaCard icon={<MapPin size={16} />} label="Venue" value={event.location} />
          )}
          <MetaCard
            icon={<span className="text-sky-600">●</span>}
            label="Status"
            value={eventStatusLabel(event)}
          />
        </div>

        {(event.about?.length || event.description) && (
          <section className="mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              About
            </h2>
            <div className="mt-4 max-w-3xl space-y-5">
              {(event.about?.length ? event.about : [event.description]).map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {sessions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Domains
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {sessions.map((session) => (
                <article
                  key={session.title}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    {poster && (
                      <img
                        src={session.image || poster}
                        alt=""
                        className="h-12 w-20 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-cover dark:border-white/10 dark:bg-white/5"
                      />
                    )}
                    <div className="min-w-0">
                      {session.day && (
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                          {session.day}
                        </p>
                      )}
                      <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{session.title}</h3>
                    </div>
                  </div>
                  {session.detail && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {session.detail}
                    </p>
                  )}
                  <Link
                    to={session.slug ? `/register/${session.slug}` : "/events"}
                    state={{ back: `/events/${event.slug}` }}
                    className="mt-4 inline-flex w-fit rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    Register
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {competitions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Competitions
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {competitions.map((competition) => (
                <article
                  key={competition.slug}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm shadow-slate-900/5"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={competition.poster || competition.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-900">{competition.title}</h3>
                    {competition.tagline && (
                      <p className="mt-1 text-sm text-sky-700">{competition.tagline}</p>
                    )}
                    {competition.description && (
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">
                        {competition.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {glimpses.length > 0 && (
          <div className="mt-12">
            <GlimpseGallery images={glimpses} onSelect={setGlimpseIndex} />
          </div>
        )}
      </div>

      {activeGlimpse != null && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/80 p-4"
          onClick={() => setGlimpseIndex(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white"
            aria-label="Close"
            onClick={() => setGlimpseIndex(null)}
          >
            <X size={18} />
          </button>
          {glimpses.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white sm:left-6"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  setGlimpseIndex((i) => i - 1);
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white sm:right-6"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  setGlimpseIndex((i) => i + 1);
                }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <img
            src={glimpses[activeGlimpse]}
            alt=""
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {!isCompleted && !individualRegistration && (
        <RegistrationModal
          isOpen={isRegOpen}
          onClose={() => setIsRegOpen(false)}
          event={event}
        />
      )}
    </div>
  );
}

const ACCENTS = ["#34d399", "#818cf8", "#38bdf8", "#fb7185"];
const AUTO_MS = 6000;
const N = 2600;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildFormations() {
  const rnd = mulberry32(7);
  const jz = (s) => (rnd() - 0.5) * s;
  const make = (fn) => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i += 1) {
      const [x, y, z] = fn();
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  };

  const hs = [1.2, 1.9, 1.5, 2.6, 2.2, 3.1, 2.5, 3.5, 2.9, 3.8, 3.2, 4.1];
  const total = hs.reduce((a, b) => a + b, 0);
  const bars = make(() => {
    if (rnd() < 0.08) return [(rnd() - 0.5) * 7.6, -2, jz(0.4)];
    let r = rnd() * total;
    let i = 0;
    while (i < hs.length - 1 && r > hs[i]) {
      r -= hs[i];
      i += 1;
    }
    return [-3.3 + i * 0.6 + (rnd() - 0.5) * 0.4, -2 + rnd() * hs[i], jz(0.5)];
  });

  const blobs = [
    [-2.0, -0.1, 0.9],
    [-1.0, 0.6, 1.1],
    [0.2, 0.9, 1.3],
    [1.4, 0.4, 1.0],
    [2.1, -0.2, 0.8],
    [0.3, -0.2, 1.0],
  ];
  const cloud = make(() => {
    if (rnd() < 0.18) {
      const col = Math.floor(rnd() * 9);
      return [-2.4 + col * 0.6, -2.1 + rnd() * 1.1, jz(0.3)];
    }
    const [cx, cy, r] = blobs[Math.floor(rnd() * blobs.length)];
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * r;
    let y = cy + Math.sin(a) * d + 0.4;
    if (y < -0.5) y = -0.5 + rnd() * 0.05;
    return [cx + Math.cos(a) * d, y, jz(1.0)];
  });

  const layers = [4, 6, 6, 3];
  const xs = [-3.2, -1.1, 1.1, 3.2];
  const nodes = layers.map((n, l) =>
    Array.from({ length: n }, (_, k) => [xs[l], (k - (n - 1) / 2) * (3.6 / Math.max(n - 1, 1))]),
  );
  const net = make(() => {
    if (rnd() < 0.3) {
      const l = Math.floor(rnd() * layers.length);
      const [nx, ny] = nodes[l][Math.floor(rnd() * nodes[l].length)];
      return [nx + (rnd() + rnd() - 1) * 0.16, ny + (rnd() + rnd() - 1) * 0.16, jz(0.3)];
    }
    const l = Math.floor(rnd() * (layers.length - 1));
    const a = nodes[l][Math.floor(rnd() * nodes[l].length)];
    const b = nodes[l + 1][Math.floor(rnd() * nodes[l + 1].length)];
    const t = rnd();
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, jz(0.4)];
  });

  const halfW = (y) => (y > 0 ? 1.6 : 1.6 * Math.sqrt(Math.max(0, (y + 2) / 2)));
  const shield = make(() => {
    const r = rnd();
    if (r < 0.3) {
      const y = -2 + rnd() * 3.8;
      return [(rnd() < 0.5 ? -1 : 1) * halfW(y) * 1.15, y, jz(0.4)];
    }
    if (r < 0.42) return [(rnd() - 0.5) * 3.7, 1.8, jz(0.4)];
    if (r < 0.7) {
      const y = -2 + rnd() * 3.8;
      return [(rnd() - 0.5) * 2 * halfW(y) * 1.15, y, jz(0.5)];
    }
    if (r < 0.88) {
      const a = rnd() * Math.PI * 2;
      return [Math.cos(a) * 0.4, 0.45 + Math.sin(a) * 0.4, jz(0.3)];
    }
    return [(rnd() - 0.5) * 0.24, -0.9 + rnd() * 0.95, jz(0.3)];
  });

  return [bars, cloud, net, shield];
}

function ParticleStage({ activeRef, rotateRef }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forms = buildFormations();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 8;
    const group = new THREE.Group();
    scene.add(group);

    const cur = new Float32Array(forms[0]);
    const speeds = new Float32Array(N);
    const r2 = mulberry32(99);
    for (let i = 0; i < N; i += 1) {
      speeds[i] = 0.025 + r2() * 0.05;
    }
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(cur, 3);
    geo.setAttribute("position", attr);

    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);

    const mat = new THREE.PointsMaterial({
      size: 0.1,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(ACCENTS[0]),
    });
    group.add(new THREE.Points(geo, mat));

    let faceYaw = 0;
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const vw = vh * camera.aspect;
      const desktop = w >= 1024;
      group.scale.setScalar(Math.min(0.9, (vw * (desktop ? 0.55 : 0.95)) / 7.4));
      const px = desktop ? vw * 0.2 : 0;
      const py = desktop ? vh * 0.05 : 0;
      group.position.set(px, py, 0);
      faceYaw = -Math.atan2(px, camera.position.z);
      mat.opacity = desktop ? 0.95 : 0.8;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const mouse = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    const accent = new THREE.Color();
    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const idx = activeRef.current % forms.length;
      const tgt = forms[idx];
      for (let i = 0; i < N; i += 1) {
        const k = reduce ? 1 : speeds[i];
        const b = i * 3;
        cur[b] += (tgt[b] - cur[b]) * k;
        cur[b + 1] += (tgt[b + 1] - cur[b + 1]) * k;
        cur[b + 2] += (tgt[b + 2] - cur[b + 2]) * k;
      }
      attr.needsUpdate = true;
      mat.color.lerp(accent.set(ACCENTS[idx]), 0.06);
      smooth.x += (mouse.x - smooth.x) * 0.05;
      smooth.y += (mouse.y - smooth.y) * 0.05;
      const userY = rotateRef?.current?.y || 0;
      const userX = rotateRef?.current?.x || 0;
      group.rotation.y = faceYaw + (reduce ? 0 : Math.sin(t * 0.35) * 0.08) + smooth.x * 0.35 + userY;
      group.rotation.x = smooth.y * 0.35 + userX;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      geo.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [activeRef, rotateRef]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none h-72 lg:absolute lg:inset-0 lg:-z-10 lg:h-auto"
    />
  );
}

function starPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return pts.join(" ");
}

function scallopPath(cx, cy, r, bumps, tooth) {
  let d = "";
  for (let i = 0; i < bumps; i += 1) {
    const a0 = (i / bumps) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / bumps) * Math.PI * 2 - Math.PI / 2;
    const mid = (a0 + a1) / 2;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const xm = cx + Math.cos(mid) * (r + tooth);
    const ym = cy + Math.sin(mid) * (r + tooth);
    d += `${i === 0 ? "M" : "L"} ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${xm.toFixed(1)} ${ym.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} `;
  }
  return `${d}Z`;
}

function CompletedSeal({ color, compact = false }) {
  const edge = scallopPath(110, 110, 82, 18, 8);
  return (
    <div
      aria-hidden="true"
      className={
        compact
          ? "pointer-events-none absolute right-2 top-2 z-10 h-14 w-14 -rotate-12"
          : "pointer-events-none absolute right-0 top-2 z-10 h-44 w-44 -rotate-[14deg] sm:h-52 sm:w-52"
      }
      style={{ color }}
    >
      <svg viewBox="0 0 220 220" className="h-full w-full overflow-visible" style={{ fontFamily: "inherit" }}>
        <path d={edge} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="110" cy="110" r="70" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="110" cy="110" r="64" fill="none" stroke="currentColor" strokeWidth="0.7" />
        {compact ? (
          <path
            d="M86 112 L104 130 L136 92"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <polygon points={starPoints(110, 70, 4.5)} fill="currentColor" />
            <line x1="62" y1="84" x2="158" y2="84" stroke="currentColor" strokeWidth="1.15" />
            <text x="110" y="112" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="800" letterSpacing="1.4">
              COMPLETED
            </text>
            <line x1="74" y1="124" x2="146" y2="124" stroke="currentColor" strokeWidth="1.15" />
            <text x="110" y="146" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700" letterSpacing="3.4">
              ADROIT
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

function BootcampPage({ event }) {
  const sessions = event.sessions || [];
  const paragraphs = event.about?.length ? event.about : event.description ? [event.description] : [];
  const dateLabel = event.dateLabel || formatRange(event.date, event.endDate);
  const phase = eventPhase(event);
  const [now, setNow] = useState(() => new Date());

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const activeRef = useRef(0);
  const rotateRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ down: false, x: 0, y: 0 });
  activeRef.current = active;
  const [reduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (paused || reduce || sessions.length < 2) return undefined;
    const id = setTimeout(() => setActive((a) => (a + 1) % sessions.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, paused, tick, reduce, sessions.length]);

  const session = sessions[active];
  const accent = ACCENTS[active % ACCENTS.length];
  const Icon = SESSION_ICONS[session?.slug] || Calendar;
  const num = (session?.day?.match(/\d+/)?.[0] || "").padStart(2, "0");

  const onRotateStart = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current.down = true;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onRotateMove = (e) => {
    if (!dragRef.current.down) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    rotateRef.current.y += dx * 0.006;
    rotateRef.current.x = THREE.MathUtils.clamp(rotateRef.current.x + dy * 0.004, -0.7, 0.7);
  };

  const onRotateEnd = (e) => {
    dragRef.current.down = false;
    if (e?.currentTarget?.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-x-clip pb-16 text-slate-900 dark:text-slate-100">
      <style>{`
        @keyframes bcFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes bcRise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        {paragraphs.length > 0 && (
          <section className="glass mb-6 rounded-3xl border border-white/80 px-6 py-6 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:px-8 dark:border-white/10">
            <h2 className="text-3xl font-bold text-sky-800 dark:text-sky-300">About</h2>
            <div className="mt-4 max-w-4xl space-y-4">
              {paragraphs.map((p, i) => (
                <p
                  key={p}
                  className={`text-lg leading-8 ${
                    i === 0 ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        <div
          className="relative overflow-hidden rounded-[2rem] bg-[#060a14] text-white ring-1 ring-white/10"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => {
            setPaused(false);
            setTick((t) => t + 1);
          }}
        >
          {ACCENTS.map((c, i) => (
            <div
              key={c}
              aria-hidden="true"
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: i === active % ACCENTS.length ? 1 : 0,
                background: `radial-gradient(60% 70% at 72% 42%, ${c}33, transparent 70%)`,
              }}
            />
          ))}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at 70% 40%, black 15%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at 70% 40%, black 15%, transparent 75%)",
            }}
          />

          <div className="relative z-10 flex min-h-[46rem] flex-col">
            <div className="px-6 pt-6 sm:px-10 sm:pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-base text-white/90 transition-colors hover:bg-white/10"
                >
                  <ArrowLeft size={18} />
                  Events
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-base">
                    <Calendar size={17} style={{ color: accent }} />
                    {dateLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-base">
                    <span
                      className={`h-2 w-2 rounded-full ${phase === "live" ? "animate-pulse bg-emerald-400" : ""}`}
                      style={phase === "live" ? undefined : { backgroundColor: accent }}
                    />
                    {eventStatusLabel(event)}
                  </span>
                </div>
              </div>
              <div className="mt-8">
                {event.eyebrow && (
                  <p className="text-lg font-semibold" style={{ color: accent }}>
                    {event.eyebrow}
                  </p>
                )}
                <h1 className="mt-1 text-5xl font-black leading-[1.05] sm:text-6xl">{event.title}</h1>
                {event.tagline && <p className="mt-3 max-w-xl text-lg text-white/70">{event.tagline}</p>}
              </div>
            </div>

            <div className="relative h-72 lg:pointer-events-none lg:absolute lg:inset-0 lg:z-20 lg:h-auto">
              <ParticleStage activeRef={activeRef} rotateRef={rotateRef} />
              <div
                aria-label="Drag to rotate the shape"
                className="pointer-events-auto absolute inset-0 z-20 cursor-grab touch-none select-none active:cursor-grabbing lg:inset-auto lg:bottom-36 lg:left-[48%] lg:right-0 lg:top-[22%]"
                onPointerDown={onRotateStart}
                onPointerMove={onRotateMove}
                onPointerUp={onRotateEnd}
                onPointerCancel={onRotateEnd}
              />
            </div>

            <div className="flex flex-1 flex-col justify-end px-6 py-8 sm:px-10 lg:max-w-[48%]">
              {session && (
                <div key={active} className="relative" style={{ animation: reduce ? "none" : "bcRise 600ms ease-out both" }}>
                  {sessionCompleted(event, active, now) && (
                    <>
                      <span className="sr-only">This day is completed</span>
                      <CompletedSeal color={accent} />
                    </>
                  )}
                  <p
                    className="text-[8rem] font-black leading-[0.85] tabular-nums sm:text-[11rem]"
                    style={{ color: accent }}
                  >
                    {num}
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-xl font-semibold text-white/80">
                    <Icon size={22} style={{ color: accent }} />
                    {session.day}
                  </p>
                  <h2 className="mt-1 text-4xl font-extrabold sm:text-5xl">{session.title}</h2>
                  {session.detail && <p className="mt-3 max-w-md text-lg text-white/70">{session.detail}</p>}
                  <Link
                    to={session.slug ? `/register/${session.slug}` : "/events"}
                    state={{ back: `/events/${event.slug}` }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-lg font-bold text-[#06101a] transition-transform hover:scale-105"
                    style={{ backgroundColor: accent }}
                  >
                    Register for {session.title}
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
              )}
            </div>

            <div role="tablist" className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 lg:grid-cols-4">
              {sessions.map((s, i) => {
                const on = i === active;
                const done = sessionCompleted(event, i, now);
                const TabIcon = SESSION_ICONS[s.slug] || Calendar;
                const c = ACCENTS[i % ACCENTS.length];
                return (
                  <button
                    key={s.title}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setActive(i);
                      setTick((t) => t + 1);
                    }}
                    className={`relative flex items-center justify-between gap-3 px-5 py-5 text-left transition-colors sm:px-7 ${
                      on ? "bg-[#0d1424]" : "bg-[#060a14] hover:bg-[#0a1020]"
                    }`}
                  >
                    {on && (
                      <span
                        key={`${active}-${tick}`}
                        className="absolute left-0 top-0 h-[3px] w-full origin-left"
                        style={{
                          backgroundColor: c,
                          animation: reduce ? "none" : `bcFill ${AUTO_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                      />
                    )}
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold" style={{ color: on ? c : "rgba(255,255,255,.55)" }}>
                        {s.day?.replace("October", "Oct")}
                      </span>
                      <span className={`block text-xl font-bold ${on ? "text-white" : "text-white/70"}`}>
                        {s.title}
                      </span>
                    </span>
                    <TabIcon size={24} style={{ color: on ? c : "rgba(255,255,255,.35)" }} />
                    {done && <CompletedSeal color={c} compact />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <span className="text-sky-600">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-snug text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
