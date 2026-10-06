import { useEffect, useRef, useState } from "react";
import { ArrowUp, CircleAlert, Clock, ExternalLink, Mail, MapPin, X } from "lucide-react";

const RATE_LIMIT_KEY = "adroit_contact_submissions";
const RATE_LIMIT_MAX = 2;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const MIN_FILL_TIME_MS = 2500;
const CAMPUS_MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3519.4201134668556!2d77.51600707454556!3d12.902195416397204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fa747acf84b%3A0x97a5cf1952c2fe3a!2sRNSIT%20CSE%20Department!5e1!3m2!1sen!2sin!4v1770548920832!5m2!1sen!2sin";

const MAX_CHARS = 1000;
const SEND_STEPS = ["Packing your message", "Folding it into a paper plane", "Flying to Adroit"];
// The plane is ready at ~1.25s; holding until then plus the launch keeps every send around 2.3s.
const MIN_SEND_MS = 1500;
const LAUNCH_MS = 800;
const MIN_ERROR_MS = 700;

const EMPTY_FORM = { name: "", email: "", subject: "", message: "", website: "" };
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const ROW_INPUT =
  "min-w-0 flex-1 bg-transparent py-3.5 text-[15px] text-ink placeholder:text-ink-subtle outline-none";
const GLASS_PILL = `ct-glass ct-pill ct-press inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-ink ${FOCUS}`;

const CONFETTI = ["bg-ink", "bg-ink-muted", "bg-ink-subtle"];

const formatNumber = (n) => n.toLocaleString("en-US");

const POPULAR_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "rediffmail.com",
  "protonmail.com",
  "rnsit.ac.in",
];
// Real providers that sit within two typos of a popular one and must never be "corrected".
const KNOWN_DOMAINS = new Set([
  ...POPULAR_DOMAINS,
  "ymail.com",
  "mail.com",
  "me.com",
  "msn.com",
  "aol.com",
  "gmx.com",
  "zoho.com",
  "proton.me",
  "yahoo.in",
  "live.in",
  "outlook.in",
  "hotmail.co.uk",
]);

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(above + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

function suggestEmail(email) {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain.includes(".") || KNOWN_DOMAINS.has(domain)) return null;
  let best = null;
  let bestDistance = 3;
  for (const known of POPULAR_DOMAINS) {
    const distance = editDistance(domain, known);
    if (distance < bestDistance) {
      best = known;
      bestDistance = distance;
    }
  }
  return best && `${email.slice(0, at)}@${best}`;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const CSS = `
/* Same liquid-glass recipe as the Members domain toggles, in neutral tones. */
.ct-glass {
  --lg-tint: color-mix(in srgb, var(--color-surface) 28%, transparent);
  --lg-hi: var(--color-surface);
  --lg-rim: color-mix(in srgb, var(--color-surface) 92%, transparent);
  --lg-edge: color-mix(in srgb, var(--color-ink) 16%, transparent);
  --lg-glow: color-mix(in srgb, var(--color-ink) 5%, transparent);
  --lg-shadow: color-mix(in srgb, var(--color-ink) 22%, transparent);
  --lg-sheen: 45%;
  --lg-spec: 75%;
  --lg-spec-size: 60% 45%;
  position: relative;
  isolation: isolate;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--lg-hi) var(--lg-sheen), transparent), transparent 45%),
    var(--lg-tint);
  -webkit-backdrop-filter: blur(2px) saturate(1.8);
  backdrop-filter: blur(2px) saturate(1.8);
  border: 1px solid var(--lg-rim);
  box-shadow:
    0 0 0 0.5px var(--lg-edge),
    inset 0 1px 0 var(--lg-hi),
    inset 0 -8px 22px -6px var(--lg-glow),
    0 18px 40px -18px var(--lg-shadow);
}
html.dark .ct-glass {
  --lg-tint: color-mix(in srgb, var(--color-ink) 5%, transparent);
  --lg-hi: color-mix(in srgb, var(--color-ink) 72%, transparent);
  --lg-rim: color-mix(in srgb, var(--color-ink) 24%, transparent);
  --lg-edge: color-mix(in srgb, var(--color-page) 70%, transparent);
  --lg-glow: color-mix(in srgb, var(--color-ink) 9%, transparent);
  --lg-shadow: color-mix(in srgb, var(--color-page) 80%, transparent);
  --lg-sheen: 12%;
  --lg-spec: 24%;
}
.ct-glass::before {
  content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none;
  background: radial-gradient(var(--lg-spec-size) at 22% 0%,
    color-mix(in srgb, var(--lg-hi) var(--lg-spec), transparent), transparent 70%);
  mix-blend-mode: screen;
}
.ct-glass::after {
  content: ""; position: absolute; inset: 1px; z-index: -1; border-radius: inherit; pointer-events: none;
  box-shadow: inset 0 0 0 0.8px color-mix(in srgb, var(--lg-rim) 60%, transparent), inset 0 -1px 4px color-mix(in srgb, var(--lg-hi) 16%, transparent);
}
.ct-pill {
  --lg-tint: color-mix(in srgb, var(--color-ink) 7%, transparent);
  --lg-glow: color-mix(in srgb, var(--color-surface) 80%, transparent);
  --lg-sheen: 56%;
  --lg-spec: 92%;
  --lg-spec-size: 110% 85%;
  box-shadow:
    0 0 0 0.5px var(--lg-edge),
    inset 0 1px 0 var(--lg-hi),
    inset 0 -6px 12px -6px var(--lg-glow),
    0 4px 12px -4px var(--lg-shadow);
}
html.dark .ct-pill {
  --lg-tint: color-mix(in srgb, var(--color-ink) 10%, transparent);
  --lg-sheen: 38%;
  --lg-spec: 60%;
}
.ct-well {
  background: color-mix(in srgb, var(--color-surface) 45%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-surface) 85%, transparent);
  box-shadow:
    0 0 0 0.5px color-mix(in srgb, var(--color-ink) 10%, transparent),
    inset 0 1px 3px color-mix(in srgb, var(--color-ink) 6%, transparent);
}
html.dark .ct-well {
  background:
    linear-gradient(color-mix(in srgb, var(--color-ink) 4%, transparent), color-mix(in srgb, var(--color-ink) 4%, transparent)),
    color-mix(in srgb, var(--color-page) 40%, transparent);
  border-color: color-mix(in srgb, var(--color-ink) 12%, transparent);
  box-shadow:
    0 0 0 0.5px color-mix(in srgb, var(--color-page) 60%, transparent),
    inset 0 1px 3px color-mix(in srgb, var(--color-page) 50%, transparent);
}
.ct-well:focus-within { box-shadow: 0 0 0 2px var(--color-ink-muted); }
.ct-press { transition: transform .4s cubic-bezier(.34, 1.56, .64, 1), background-color .2s ease; }
.ct-press:active { transform: scale(.96); }
.ct-solid {
  border: 1px solid color-mix(in srgb, var(--color-page) 18%, transparent);
  background-image: linear-gradient(180deg, color-mix(in srgb, var(--color-page) 24%, transparent), transparent 60%);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--color-page) 40%, transparent),
    0 10px 24px -12px color-mix(in srgb, var(--color-ink) 45%, transparent);
}
html.dark .ct-solid {
  background-image: none;
  box-shadow: inset 0 -2px 6px color-mix(in srgb, var(--color-page) 18%, transparent);
}
.ct-tile { box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-page) 25%, transparent); }

@media (prefers-reduced-transparency: reduce) {
  .ct-glass, .ct-well, .ct-overlay { background: var(--color-surface); -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@media (prefers-contrast: more) {
  .ct-glass { --lg-edge: var(--color-ink-muted); }
  .ct-well { box-shadow: 0 0 0 1px var(--color-ink-muted); }
}

.ct-overlay {
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  clip-path: circle(150% at var(--ox) var(--oy));
  animation: ct-reveal .45s cubic-bezier(.65, 0, .35, 1) both;
}
.ct-overlay.is-leaving { animation: ct-fade-out .35s ease .45s forwards; }
@keyframes ct-reveal { from { clip-path: circle(0 at var(--ox) var(--oy)); } }
@keyframes ct-fade-out { to { opacity: 0; } }

.ct-pack {
  position: absolute; left: 50%; top: 50%; width: 144px; height: 92px; margin: -46px 0 0 -72px;
  perspective: 500px; opacity: 0;
  filter: drop-shadow(0 8px 16px color-mix(in srgb, var(--color-ink) 14%, transparent));
  animation: ct-pack 1.1s ease both;
}
html.dark .ct-pack { filter: none; }
.ct-mail-back {
  position: absolute; inset: 0; border-radius: 8px;
  background: color-mix(in srgb, var(--color-ink) 20%, var(--color-surface));
  box-shadow: 0 0 0 1px var(--color-line);
}
.ct-letter {
  position: absolute; left: 12px; right: 12px; top: 6px; height: 78px; z-index: 2;
  display: flex; flex-direction: column; gap: 7px; padding: 10px; border-radius: 4px;
  background: var(--color-surface); box-shadow: 0 0 0 1px var(--color-line);
  animation: ct-letter-in .4s cubic-bezier(.3, .8, .4, 1) .12s both;
}
.ct-letter span { height: 4px; border-radius: 2px; background: color-mix(in srgb, var(--color-ink) 35%, transparent); }
.ct-letter span:nth-child(2) { width: 80%; }
.ct-letter span:nth-child(3) { width: 55%; }
.ct-mail-pocket {
  position: absolute; inset: 0; z-index: 3; border-radius: 8px;
  background: color-mix(in srgb, var(--color-ink) 6%, var(--color-surface));
  clip-path: polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%);
}
.ct-mail-flap {
  position: absolute; left: 0; right: 0; top: 0; height: 58%; z-index: 4; transform-origin: top;
  background: color-mix(in srgb, var(--color-ink) 12%, var(--color-surface));
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  animation: ct-flap .3s ease-in .5s both;
}
@keyframes ct-pack {
  0% { opacity: 0; transform: scale(.7) translateY(10px); }
  15%, 72% { opacity: 1; transform: none; }
  100% { opacity: 0; transform: translate(20px, -8px) rotate(-30deg) scale(.35); }
}
@keyframes ct-letter-in { from { transform: translateY(-64px); } }
@keyframes ct-flap {
  0% { transform: rotateX(180deg); z-index: 1; }
  49% { z-index: 1; }
  50% { z-index: 4; }
  100% { transform: rotateX(0deg); z-index: 4; }
}

.ct-plane {
  position: absolute; left: 50%; top: 50%; width: 84px; height: 84px; margin: -42px 0 0 -42px;
  color: var(--color-ink);
  animation: ct-plane-in .4s cubic-bezier(.3, 1.5, .5, 1) .85s both, ct-hover 1.5s ease-in-out 1.25s infinite;
}
.ct-plane.is-launching { animation: ct-launch .8s cubic-bezier(.55, 0, .75, .2) forwards; }
.ct-plane-top { fill: var(--color-surface); }
.ct-plane-under { fill: color-mix(in srgb, var(--color-ink) 35%, var(--color-surface)); }
.ct-plane-keel { fill: color-mix(in srgb, var(--color-ink) 65%, var(--color-surface)); }
.ct-plane-edge { fill: none; stroke: currentColor; stroke-width: 2; stroke-linejoin: round; }
@keyframes ct-plane-in { from { opacity: 0; transform: scale(.3) rotate(30deg); } }
@keyframes ct-hover { 50% { transform: translate(4px, -7px) rotate(-4deg); } }
@keyframes ct-launch {
  0% { transform: none; }
  22% { transform: translate(-16px, 10px) rotate(8deg); }
  100% { transform: translate(280px, -240px) rotate(-14deg) scale(.5); opacity: 0; }
}
.ct-speed {
  position: absolute; height: 2px; width: 36px; border-radius: 2px; opacity: 0;
  background: color-mix(in srgb, var(--color-ink) 45%, transparent);
  animation: ct-wind 1s linear infinite;
}
@keyframes ct-wind {
  0% { transform: translateX(30px); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateX(-40px); opacity: 0; }
}
.ct-trail { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; opacity: 0; }
.ct-trail path {
  fill: none; stroke: color-mix(in srgb, var(--color-ink) 55%, transparent);
  stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 1 10;
}
.ct-trail.is-launching { animation: ct-trail .8s ease-out .1s forwards; }
.ct-trail.is-launching path { animation: ct-dash .8s linear .1s forwards; }
@keyframes ct-trail { 25% { opacity: 1; } 100% { opacity: 0; } }
@keyframes ct-dash { to { stroke-dashoffset: -44; } }

.ct-badge { animation: ct-pop .45s cubic-bezier(.3, 1.6, .5, 1) both; }
.ct-ring { opacity: 0; animation: ct-ring .8s ease-out .15s; }
.ct-check { stroke-dasharray: 22; animation: ct-check .4s ease-out .3s both; }
.ct-confetti {
  position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; margin: -4px; border-radius: 2px;
  opacity: 0; transform: rotate(var(--a)) translateY(-64px);
  animation: ct-confetti .9s cubic-bezier(.2, .7, .3, 1) .2s;
}
.ct-rise { animation: ct-rise .45s ease .35s both; }
@keyframes ct-pop { from { transform: scale(0); } }
@keyframes ct-ring { from { transform: scale(.9); opacity: .55; } to { transform: scale(1.9); opacity: 0; } }
@keyframes ct-check { from { stroke-dashoffset: 22; } }
@keyframes ct-confetti {
  0% { opacity: 1; transform: rotate(var(--a)) translateY(-30px) scale(.6); }
  65% { opacity: 1; }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(-84px) scale(.5) rotate(140deg); }
}
@keyframes ct-rise { from { opacity: 0; transform: translateY(8px); } }

@media (prefers-reduced-motion: reduce) {
  .ct-overlay, .ct-overlay *, .ct-success, .ct-success *, .ct-press {
    animation: none !important;
    transition: none !important;
  }
  .ct-press:active { transform: none; }
}
`;

function ErrorBanner({ children, onDismiss }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-[1.25rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
      <CircleAlert size={18} className="mt-px shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1 font-medium">{children}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className={`-m-1 shrink-0 rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100 ${FOCUS}`}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function FieldRow({ label, htmlFor, children }) {
  return (
    <div className="flex items-center gap-3 px-4 transition-colors focus-within:bg-ink/[0.04]">
      <label htmlFor={htmlFor} className="w-[4.25rem] shrink-0 text-[15px] text-ink-subtle">
        {label}
      </label>
      {children}
    </div>
  );
}

function PaperPlane() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible">
      <path className="ct-plane-under" d="M26 38 L60 6 L36 56 Z" />
      <path className="ct-plane-keel" d="M26 38 L29 50 L36 56 Z" />
      <path className="ct-plane-top" d="M4 28 L60 6 L26 38 Z" />
      <path className="ct-plane-edge" d="M4 28 L60 6 L36 56 L29 50 L26 38 Z M26 38 L60 6" />
    </svg>
  );
}

function SendingOverlay({ origin, step, launching, subject }) {
  return (
    <div
      className={`ct-overlay absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 p-6 text-center ${launching ? "is-leaving" : ""}`}
      style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px` }}
    >
      <div aria-hidden="true" className="relative h-40 w-64">
        {!launching && (
          <>
            <span className="ct-speed" style={{ left: "10%", top: "40%", animationDelay: "1.25s" }} />
            <span className="ct-speed" style={{ left: "4%", top: "55%", animationDelay: "1.55s" }} />
            <span className="ct-speed" style={{ left: "14%", top: "68%", animationDelay: "1.85s" }} />
          </>
        )}
        <div className="ct-pack">
          <div className="ct-mail-back" />
          <div className="ct-letter">
            <span />
            <span />
            <span />
          </div>
          <div className="ct-mail-pocket" />
          <div className="ct-mail-flap" />
        </div>
        <svg className={`ct-trail ${launching ? "is-launching" : ""}`} viewBox="0 0 256 160">
          <path d="M118 88 Q 190 74 262 -40" />
        </svg>
        <div className={`ct-plane ${launching ? "is-launching" : ""}`}>
          <PaperPlane />
        </div>
      </div>
      <div className="min-w-0 max-w-full">
        <p role="status" aria-live="polite" className="text-base font-semibold text-ink sm:text-lg">
          {launching ? "Sent!" : SEND_STEPS[step]}
        </p>
        {subject && <p className="mt-1 truncate text-sm text-ink-muted">“{subject}”</p>}
      </div>
    </div>
  );
}

function SentConfirmation({ headingRef, recipient, onWriteAnother }) {
  const firstName = recipient.name.split(/\s+/)[0];
  return (
    <div role="status" className="ct-success flex flex-col items-center px-3 py-8 text-center sm:py-12">
      <div aria-hidden="true" className="relative mb-6 grid h-20 w-20 place-items-center">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`ct-confetti ${CONFETTI[i % CONFETTI.length]}`} style={{ "--a": `${i * 36}deg` }} />
        ))}
        <span className="ct-ring absolute inset-0 rounded-full border-2 border-success" />
        <span className="ct-badge grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success ring-1 ring-success/30">
          <svg viewBox="0 0 24 24" className="h-10 w-10">
            <path
              className="ct-check"
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className="ct-rise flex w-full flex-col items-center">
        <h2 id="ct-letter-title" ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">
          Message sent!
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted sm:text-base">
          Thanks{firstName ? `, ${firstName}` : ""}. We’ll reply within 24–48 hours on weekdays.
        </p>
        {recipient.email && (
          <p className="ct-well mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-sm text-ink">
            <Mail size={14} className="shrink-0 text-ink-muted" aria-hidden="true" />
            <span className="sr-only">Reply to</span>
            <span className="truncate font-medium">{recipient.email}</span>
          </p>
        )}
        <button
          type="button"
          onClick={onWriteAnother}
          className={`${GLASS_PILL} mt-6 w-full sm:w-auto`}
        >
          <Mail size={16} aria-hidden="true" />
          Write another message
        </button>
      </div>
    </div>
  );
}

export default function Contact() {
  const formOpenedAtRef = useRef(Date.now());
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const successHeadingRef = useRef(null);
  const focusAfterErrorRef = useRef(null);
  const timersRef = useRef([]);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [trimmed, setTrimmed] = useState(false);
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [recipient, setRecipient] = useState({ name: "", email: "", subject: "" });
  const [emailTouched, setEmailTouched] = useState(false);

  const busy = status === "sending" || status === "launching";
  const emailSuggestion = emailTouched ? suggestEmail(formData.email.trim()) : null;
  const chars = formData.message.length;
  const countTone = chars >= MAX_CHARS ? "danger" : chars >= MAX_CHARS * 0.9 ? "warning" : "muted";

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (status === "sent") successHeadingRef.current?.focus();
    // The form is inert until this commit, so focusing earlier would be ignored.
    if (status === "idle" && focusAfterErrorRef.current) {
      focusAfterErrorRef.current.focus();
      focusAfterErrorRef.current = null;
    }
  }, [status]);

  const later = (fn, ms) => {
    timersRef.current.push(setTimeout(fn, ms));
  };
  const wait = (ms) => new Promise((resolve) => (ms > 0 ? later(resolve, ms) : resolve()));
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.length = 0;
  };

  const getRecentSubmissions = () => {
    try {
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      const now = Date.now();
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      return list
        .map((ts) => Number(ts))
        .filter((ts) => Number.isFinite(ts) && now - ts < RATE_LIMIT_WINDOW_MS);
    } catch {
      return [];
    }
  };

  const saveRecentSubmissions = (timestamps) => {
    try {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
    } catch {
      // Ignore storage write errors; submit already succeeded.
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message") {
      const clamped = value.slice(0, MAX_CHARS);
      setTrimmed((prev) => clamped !== value || (prev && clamped.length >= MAX_CHARS));
      setFormData((prev) => ({ ...prev, message: clamped }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // maxLength cuts pasted text silently, so flag it here to explain why the paste was shortened.
  const handleMessagePaste = (e) => {
    const el = e.currentTarget;
    const pasted = e.clipboardData?.getData("text") ?? "";
    const selected = (el.selectionEnd ?? 0) - (el.selectionStart ?? 0);
    if (el.value.length - selected + pasted.length > MAX_CHARS) setTrimmed(true);
  };

  const startSendingAnimation = () => {
    const card = cardRef.current?.getBoundingClientRect();
    const button = buttonRef.current?.getBoundingClientRect();
    if (card && button) {
      setOrigin({
        x: button.left + button.width / 2 - card.left,
        y: button.top + button.height / 2 - card.top,
      });
    }
    setStep(0);
    later(() => setStep(1), 650);
    later(() => setStep(2), 1250);
    setStatus("sending");
    // On phones the card is taller than the screen, so bring the animation (card centre) into view.
    if (card && (card.top < 0 || card.bottom > window.innerHeight)) {
      cardRef.current.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError("");

    if (formData.website) {
      setRecipient({ name: "", email: "", subject: "" });
      setStatus("sent");
      return;
    }

    if (!formData.message.trim()) {
      setError("Write a message before sending.");
      messageRef.current?.focus();
      return;
    }
    if (formData.message.length > MAX_CHARS) {
      setFormData((prev) => ({ ...prev, message: prev.message.slice(0, MAX_CHARS) }));
      setTrimmed(true);
      setError("Your message was trimmed to 1,000 characters. Check the ending, then send it again.");
      messageRef.current?.focus();
      return;
    }

    if (Date.now() - formOpenedAtRef.current < MIN_FILL_TIME_MS) {
      setError("Please wait a moment before submitting the form.");
      return;
    }

    const recentSubmissions = getRecentSubmissions();
    if (recentSubmissions.length >= RATE_LIMIT_MAX) {
      setError("Rate limit reached. You can send up to 2 messages every 24 hours from this browser.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      website: formData.website,
    };

    const reduce = prefersReducedMotion();
    const startedAt = Date.now();
    const holdUntil = (ms) => wait(reduce ? 0 : startedAt + ms - Date.now());
    setRecipient({ name: payload.name, email: payload.email, subject: payload.subject });
    startSendingAnimation();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false" || data.success === false) {
        throw Object.assign(new Error(data.message || "Failed to send message"), { field: data.field });
      }

      saveRecentSubmissions([...recentSubmissions, Date.now()]);
      await holdUntil(MIN_SEND_MS);
      setFormData(EMPTY_FORM);
      setTrimmed(false);
      setStatus("launching");
      await wait(reduce ? 0 : LAUNCH_MS);
      setStatus("sent");
    } catch (err) {
      await holdUntil(MIN_ERROR_MS);
      if (err.field === "email") focusAfterErrorRef.current = emailRef.current;
      setStatus("idle");
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      clearTimers();
    }
  };

  const writeAnother = () => {
    setStatus("idle");
    setError("");
    setTrimmed(false);
    setEmailTouched(false);
    setFormData(EMPTY_FORM);
    requestAnimationFrame(() => nameRef.current?.focus());
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-page pt-8 pb-12 text-ink sm:pb-16">
      <style>{CSS}</style>
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 text-center sm:mb-12">
          <h1 className="fluid-h1 mb-3 font-extrabold sm:mb-4">
            Contact
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-ink-muted sm:text-lg">
            Questions about events, domains, or joining the club? Write to us and we’ll reply on weekdays.
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          <section
            ref={cardRef}
            aria-labelledby="ct-letter-title"
            className="ct-glass overflow-hidden rounded-[2rem] p-2.5 sm:p-3"
          >
            {status === "sent" ? (
              <SentConfirmation headingRef={successHeadingRef} recipient={recipient} onWriteAnother={writeAnother} />
            ) : (
              <>
                <div className="px-3 pt-3 pb-4 sm:px-4 sm:pt-4 sm:pb-5">
                  <h2 id="ct-letter-title" className="text-xl font-bold tracking-tight sm:text-2xl">
                    New Message
                  </h2>
                  <p className="mt-0.5 text-sm text-ink-muted">We’ll reply by email, usually within 24–48 hours.</p>
                </div>

                {error && (
                  <div className="mb-2.5 sm:mb-3">
                    <ErrorBanner onDismiss={() => setError("")}>{error}</ErrorBanner>
                  </div>
                )}

                <form onSubmit={handleSubmit} inert={busy} aria-busy={busy}>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="ct-well divide-y divide-line overflow-hidden rounded-[1.375rem] sm:rounded-[1.25rem]">
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <span className="w-[4.25rem] shrink-0 text-[15px] text-ink-subtle">To</span>
                      <span className="ct-glass ct-pill inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                        AdroIT Team
                      </span>
                    </div>
                    <FieldRow label="Name" htmlFor="name">
                      <input
                        ref={nameRef}
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={ROW_INPUT}
                        placeholder="Your name"
                      />
                    </FieldRow>
                    <FieldRow label="Email" htmlFor="email">
                      <input
                        ref={emailRef}
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => setEmailTouched(true)}
                        aria-describedby="email-hint"
                        className={ROW_INPUT}
                        placeholder="you@example.com"
                      />
                    </FieldRow>
                    <FieldRow label="Subject" htmlFor="subject">
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className={ROW_INPUT}
                        placeholder="Workshop, membership…"
                      />
                    </FieldRow>
                    <div className="relative transition-colors focus-within:bg-ink/[0.04]">
                      <label htmlFor="message" className="sr-only">
                        Message
                      </label>
                      <textarea
                        ref={messageRef}
                        id="message"
                        name="message"
                        rows={6}
                        required
                        maxLength={MAX_CHARS}
                        value={formData.message}
                        onChange={handleChange}
                        onPaste={handleMessagePaste}
                        aria-describedby="message-count message-hint"
                        placeholder="Write your message…"
                        className="block min-h-[10rem] w-full resize-y bg-transparent px-4 pt-3.5 pb-9 text-[15px] leading-relaxed text-ink placeholder:text-ink-subtle outline-none sm:min-h-[13rem]"
                      />
                      <p
                        id="message-count"
                        className={`pointer-events-none absolute right-4 bottom-3 text-xs font-medium tabular-nums ${
                          countTone === "danger" ? "text-danger" : countTone === "warning" ? "text-warning" : "text-ink-subtle"
                        }`}
                      >
                        {formatNumber(chars)} / {formatNumber(MAX_CHARS)}
                        <span className="sr-only"> characters</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 px-4 pt-2 text-xs">
                    <p id="email-hint" aria-live="polite" className="text-ink-muted">
                      {emailSuggestion && (
                        <>
                          Did you mean{" "}
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, email: emailSuggestion }))}
                            className={`break-all rounded font-semibold text-ink underline underline-offset-2 ${FOCUS}`}
                          >
                            {emailSuggestion}
                          </button>
                          ?
                        </>
                      )}
                    </p>
                    <p id="message-hint" role="status" className="font-medium text-warning">
                      {trimmed ? "Trimmed to the 1,000-character limit" : ""}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 px-1.5 pt-3 pb-1.5 sm:flex-row-reverse sm:items-center sm:justify-between sm:px-2 sm:pb-2">
                    <button
                      ref={buttonRef}
                      type="submit"
                      className={`ct-press ct-solid inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-page hover:bg-ink/85 sm:w-auto ${FOCUS}`}
                    >
                      Send
                      <ArrowUp size={16} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <p className="text-center text-xs text-ink-subtle sm:text-left">
                      Up to 2 messages every 24 hours from this browser.
                    </p>
                  </div>
                </form>

                {busy && (
                  <SendingOverlay
                    origin={origin}
                    step={step}
                    launching={status === "launching"}
                    subject={recipient.subject}
                  />
                )}
              </>
            )}
          </section>

          <aside className="space-y-5 sm:space-y-6">
            <div className="ct-glass overflow-hidden rounded-[2rem] p-2">
              <iframe
                src={CAMPUS_MAP}
                title="Map of the RNSIT CSE Department"
                className="block h-44 w-full rounded-[1.5rem] border-0 sm:h-60 dark:[filter:invert(0.9)_hue-rotate(180deg)_saturate(0.7)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.google.com/?q=RNSIT+CSE+Department+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-glass ct-pill ct-press mt-2 flex items-center justify-between gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Open in Maps
                <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>

            <ul className="ct-glass rounded-[2rem] p-2">
              {[
                { icon: <MapPin size={16} strokeWidth={2.25} />, title: "Campus", body: "Department of CSE, RNS Institute of Technology, Bengaluru" },
                { icon: <Mail size={16} strokeWidth={2.25} />, title: "Email", email: "adroit.rnsit@gmail.com" },
                { icon: <Clock size={16} strokeWidth={2.25} />, title: "Reply time", body: "Weekdays, usually within 24–48 hours" },
              ].map(({ icon, title, body, email }, i) => (
                <li key={title} className="flex gap-3 px-3">
                  <span
                    aria-hidden="true"
                    className="ct-tile mt-3.5 grid h-8 w-8 shrink-0 place-items-center rounded-[0.625rem] bg-ink text-page"
                  >
                    {icon}
                  </span>
                  <div className={`min-w-0 flex-1 py-3.5 ${i > 0 ? "border-t border-line" : ""}`}>
                    <p className="text-sm font-semibold">{title}</p>
                    {email ? (
                      <a
                        href={`mailto:${email}`}
                        className={`mt-0.5 inline-block break-all rounded text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline ${FOCUS}`}
                      >
                        {email}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{body}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
