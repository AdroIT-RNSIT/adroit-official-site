import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";

const imageModules = import.meta.glob("../assets/*.png", { eager: true });

const PHOTOS = [
  { id: 1, src: imageModules["../assets/image1.png"]?.default,      label: "Workshop '25",        tag: "EVENT"   },
  { id: 2, src: imageModules["../assets/Hackathon.png"]?.default,   label: "Hackathon Winner '26", tag: "WIN"     },
  { id: 3, src: imageModules["../assets/AdroIT-team.png"]?.default, label: "Team AdroIT",          tag: "TEAM"    },
  { id: 4, src: imageModules["../assets/image2.png"]?.default,      label: "Tech Talk",            tag: "TALK"    },
  { id: 5, src: imageModules["../assets/PresentTeam.png"]?.default, label: "Recruitment Time",     tag: "HIRING"  },
  { id: 6, src: imageModules["../assets/Marketing.png"]?.default,      label: "",         tag: "Marketing"    },
  { id: 7, src: imageModules["../assets/Community.png"]?.default, label: "Community Meet",       tag: "MEET"    },
  { id: 8, src: imageModules["../assets/Darshan.png"]?.default , label: "Darshan", tag: "D Boss" },
];

// ── Particle system ───────────────────────────────────────────────────────
function useParticles(count = 40) {
  const ref = useRef(
    Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      speed: 0.02 + Math.random() * 0.04,
      opacity: 0.1 + Math.random() * 0.4,
      hue: Math.random() > 0.5 ? 190 : 270, // cyan or purple
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.015,
    }))
  );
  return ref.current;
}

// ── Card configs: 8 cards spread across the panel ────────────────────────
const CARD_CONFIG = [
  { cx: 24, cy: 18, w: 190, h: 140, depth: 0.8,  ox: 14, oy: 10, spd: 0.28, off: 0,   rot: -5  },
  { cx: 72, cy: 16, w: 162, h: 182, depth: 1.0,  ox: 12, oy: 13, spd: 0.22, off: 1.2, rot: 4   },
  { cx: 20, cy: 50, w: 176, h: 134, depth: 0.5,  ox: 16, oy: 9,  spd: 0.18, off: 2.4, rot: 2   },
  { cx: 68, cy: 51, w: 172, h: 158, depth: 0.7,  ox: 13, oy: 15, spd: 0.32, off: 0.8, rot: -3  },
  { cx: 44, cy: 73, w: 200, h: 130, depth: 0.6,  ox: 10, oy: 11, spd: 0.25, off: 1.8, rot: 1   },
  { cx: 76, cy: 79, w: 155, h: 140, depth: 0.85, ox: 13, oy: 9,  spd: 0.30, off: 3.0, rot: -4  },
  { cx: 18, cy: 82, w: 162, h: 125, depth: 0.55, ox: 11, oy: 12, spd: 0.20, off: 0.5, rot: 3   },
  { cx: 50, cy: 40, w: 170, h: 150, depth: 0.9,  ox: 15, oy: 10, spd: 0.26, off: 1.5, rot: 5   },
];

function FloatingPhotoPanel() {
  const panelRef   = useRef(null);
  const mouseRef   = useRef({ x: 0.5, y: 0.5 });
  const rafRef     = useRef(null);
  const particles  = useParticles(50);
  const canvasRef  = useRef(null);

  const [mouse, setMouse]       = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered]   = useState(null);
  const [time, setTime]         = useState(0);
  const [entered, setEntered]   = useState(false); // stagger entrance

  const onMouseMove = useCallback((e) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    };
  }, []);

  // RAF loop
  useEffect(() => {
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      setTime(t);
      setMouse(prev => ({
        x: prev.x + (mouseRef.current.x - prev.x) * 0.05,
        y: prev.y + (mouseRef.current.y - prev.y) * 0.05,
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    setTimeout(() => setEntered(true), 100);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Canvas: draw particles + connecting lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // Update position
      p.y -= p.speed;
      p.x += p.drift + Math.sin(time * 0.5 + p.phase) * 0.03;
      if (p.y < -2) { p.y = 102; p.x = Math.random() * 100; }
      if (p.x < -2) p.x = 102;
      if (p.x > 102) p.x = -2;

      const px = (p.x / 100) * W;
      const py = (p.y / 100) * H;

      // Draw particle
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity * 0.15})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const qx = (q.x / 100) * W;
        const qy = (q.y / 100) * H;
        const dist = Math.hypot(px - qx, py - qy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(qx, qy);
          ctx.strokeStyle = `hsla(190, 80%, 65%, ${(1 - dist / 80) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
  }, [time, particles]);

  return (
    <div
      ref={panelRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { mouseRef.current = { x: 0.5, y: 0.5 }; }}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-[#04080f]" />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
        }} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

      {/* Perspective horizon ellipses */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" preserveAspectRatio="none">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i}
            cx="50%" cy="30%"
            rx={`${8 + i * 9}%`} ry={`${3 + i * 4}%`}
            fill="none" stroke="rgba(6,182,212,1)" strokeWidth="0.6" />
        ))}
      </svg>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        width={800} height={900}
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      />

      {/* Mouse-tracked dual spotlight */}
      <div className="absolute pointer-events-none z-[3] rounded-full"
        style={{
          width: 500, height: 500,
          left: `${mouse.x * 100}%`,
          top:  `${mouse.y * 100}%`,
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)',
        }} />
      <div className="absolute pointer-events-none z-[3] rounded-full"
        style={{
          width: 300, height: 300,
          left: `${(1 - mouse.x) * 100}%`,
          top:  `${(1 - mouse.y) * 100}%`,
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)',
        }} />

      {/* Rotating ring decoration */}
      <div className="absolute pointer-events-none z-[2]"
        style={{
          width: 420, height: 420,
          left: '50%', top: '42%',
          transform: `translate(-50%,-50%) rotate(${time * 8}deg)`,
          border: '1px solid rgba(6,182,212,0.06)',
          borderRadius: '50%',
        }} />
      <div className="absolute pointer-events-none z-[2]"
        style={{
          width: 280, height: 280,
          left: '50%', top: '42%',
          transform: `translate(-50%,-50%) rotate(${-time * 12}deg)`,
          border: '1px dashed rgba(139,92,246,0.07)',
          borderRadius: '50%',
        }} />

      {/* Horizontal glitch line that occasionally sweeps */}
      <div className="absolute left-0 right-0 h-px pointer-events-none z-[4]"
        style={{
          top: `${((Math.sin(time * 0.3) * 0.5 + 0.5) * 70 + 5)}%`,
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.3) 20%, rgba(6,182,212,0.6) 50%, rgba(6,182,212,0.3) 80%, transparent 100%)',
          opacity: Math.max(0, Math.sin(time * 1.5) * 0.6),
          boxShadow: '0 0 8px rgba(6,182,212,0.4)',
        }} />

      {/* FLOATING CARDS */}
      {PHOTOS.map((photo, i) => {
        const cfg = CARD_CONFIG[i];
        // Orbital float
        const angle   = time * cfg.spd + cfg.off;
        const floatX  = Math.cos(angle) * cfg.ox;
        const floatY  = Math.sin(angle * 1.3) * cfg.oy;
        // Parallax
        const px = (mouse.x - 0.5) * 28 * cfg.depth;
        const py = (mouse.y - 0.5) * 28 * cfg.depth;
        // 3D tilt
        const rotX = (mouse.y - 0.5) * -10 * cfg.depth;
        const rotY = (mouse.x - 0.5) *  10 * cfg.depth;
        const isHov = hovered === i;
        // Entrance stagger
        const delay = i * 0.12;
        const entranceY = entered ? 0 : 40;
        const entranceO = entered ? 1 : 0;

        // clamp so cards don't overflow
        const halfW = (cfg.w / 2);
        const halfH = (cfg.h / 2);
        const panelW = panelRef.current?.clientWidth  || 600;
        const panelH = panelRef.current?.clientHeight || 900;
        const left = Math.max(halfW, Math.min(panelW - halfW, (cfg.cx / 100) * panelW)) - halfW;
        const top  = Math.max(halfH, Math.min(panelH - halfH, (cfg.cy / 100) * panelH)) - halfH;

        return (
          <div
            key={photo.id}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left, top,
              width:  cfg.w,
              height: cfg.h,
              zIndex: isHov ? 30 : (10 + Math.round(cfg.depth * 8)),
              transform: `
                translate(${floatX + px}px, ${floatY + py + entranceY}px)
                rotate(${cfg.rot}deg)
                perspective(800px)
                rotateX(${rotX}deg)
                rotateY(${rotY}deg)
                scale(${isHov ? 1.08 : 1})
              `,
              opacity: entranceO,
              transition: isHov
                ? 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, opacity 0.6s ease'
                : `transform 0.1s linear, opacity 0.6s ease ${delay}s`,
            }}
          >
            {/* Holographic border glow */}
            <div className="absolute -inset-px rounded-2xl pointer-events-none z-10"
              style={{
                background: isHov
                  ? `linear-gradient(${time * 60}deg, rgba(6,182,212,0.8), rgba(139,92,246,0.8), rgba(236,72,153,0.6), rgba(6,182,212,0.8))`
                  : `linear-gradient(${time * 40}deg, rgba(6,182,212,0.25), rgba(139,92,246,0.2), rgba(6,182,212,0.25))`,
                borderRadius: 16,
                padding: 1,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }} />

            {/* Card body */}
            <div className="w-full h-full rounded-2xl overflow-hidden relative"
              style={{
                boxShadow: isHov
                  ? '0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(6,182,212,0.2), 0 0 80px rgba(139,92,246,0.1)'
                  : '0 20px 50px rgba(0,0,0,0.7)',
              }}>

              {photo.src ? (
                <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))' }}>
                  <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span className="text-[9px] text-white/20 font-medium tracking-wide">Your Photo</span>
                </div>
              )}

              {/* Dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Holographic shimmer on hover */}
              {isHov && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(${105 + Math.sin(time * 2) * 15}deg,
                      transparent 30%,
                      rgba(6,182,212,0.08) 45%,
                      rgba(255,255,255,0.06) 50%,
                      rgba(139,92,246,0.08) 55%,
                      transparent 70%)`,
                    animation: 'none',
                  }} />
              )}

              {/* Corner accent dots */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{ background: isHov ? 'rgba(6,182,212,0.9)' : 'rgba(6,182,212,0.3)', boxShadow: isHov ? '0 0 6px rgba(6,182,212,0.8)' : 'none' }} />
              <div className="absolute top-2 left-2 w-4 h-px pointer-events-none"
                style={{ background: isHov ? 'rgba(6,182,212,0.7)' : 'rgba(255,255,255,0.15)' }} />
              <div className="absolute top-2 left-2 w-px h-4 pointer-events-none"
                style={{ background: isHov ? 'rgba(6,182,212,0.7)' : 'rgba(255,255,255,0.15)' }} />

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/90 text-[11px] font-bold leading-tight tracking-wide"
                      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
                      {photo.label}
                    </p>
                  </div>
                  <span className="text-[8px] font-black tracking-[0.2em] px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(6,182,212,0.15)',
                      border: '1px solid rgba(6,182,212,0.4)',
                      color: 'rgba(6,182,212,0.9)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: isHov ? '0 0 10px rgba(6,182,212,0.3)' : 'none',
                    }}>
                    {photo.tag}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* HUD corner elements */}
      {/* Top-left */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.8)' }} />
          <span className="text-[9px] font-black tracking-[0.3em] text-cyan-400/80 uppercase">AdroIT</span>
        </div>
        <div className="flex gap-1">
          <div className="w-8 h-px bg-cyan-500/50" />
          <div className="w-3 h-px bg-purple-500/50" />
          <div className="w-1.5 h-px bg-pink-500/40" />
        </div>
      </div>

      {/* Top-right bracket */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none opacity-30">
        <div className="w-8 h-8 border-t border-r border-cyan-400/60" />
      </div>
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none opacity-30">
        <div className="w-8 h-8 border-b border-l border-purple-400/60" />
      </div>
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none opacity-30">
        <div className="w-8 h-8 border-b border-r border-cyan-400/60" />
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-8 py-4 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(4,8,15,0.95) 0%, transparent 100%)' }}>
        <p className="text-[10px] text-white/20 italic tracking-widest text-center">
          "Building the next generation of tech leaders."
        </p>
      </div>

    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function getEmailError(v) {
  if (!v) return "";
  return emailRegex.test(v) ? "" : "Enter a valid email address";
}
function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp]           = useState(false);
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [name, setName]                   = useState("");
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [emailTouched, setEmailTouched]   = useState(false);
  const [pwTouched, setPwTouched]         = useState(false);
  const [forgotMode, setForgotMode]       = useState(false);
  const [forgotEmail, setForgotEmail]     = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError]     = useState("");

  const resetForm = () => {
    setError(""); setName(""); setEmail(""); setPassword("");
    setEmailTouched(false); setPwTouched(false);
    setForgotMode(false); setForgotSuccess(false); setForgotError("");
  };

  const emailErr = emailTouched ? getEmailError(email) : "";
  const pwRules  = [
    { label: "8+ chars",  pass: password.length >= 8   },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number",    pass: /[0-9]/.test(password) },
  ];

  const handleSignIn = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const r = await authClient.signIn.email({ email, password });
      if (r.error) setError(r.error.message || "Invalid email or password.");
      else navigate("/resources");
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); setError("");
    if (pwRules.some(r => !r.pass)) { setError("Please meet all password requirements."); return; }
    setLoading(true);
    try {
      const r = await authClient.signUp.email({ email, password, name });
      if (r.error) { setError(r.error.message || "Sign up failed."); setLoading(false); return; }
      const s = await authClient.signIn.email({ email, password });
      if (s.error) setError("Account created but auto-login failed. Please sign in.");
      else navigate("/resources");
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const handleForgot = async () => {
    setForgotError("");
    if (!emailRegex.test(forgotEmail)) { setForgotError("Enter a valid email address"); return; }
    setForgotLoading(true);
    try {
      const r = await authClient.forgetPassword({ email: forgotEmail, redirectTo: "/reset-password" });
      if (r.error) setForgotError(r.error.message || "Failed to send reset email.");
      else setForgotSuccess(true);
    } catch { setForgotError("Something went wrong. Please try again."); }
    setForgotLoading(false);
  };

  const InputField = ({ id, type, placeholder, value, onChange, onBlur, disabled, icon, extraClass = "", rightEl = null }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">{icon}</div>
      <input id={id} type={type} placeholder={placeholder} required
        value={value} onChange={onChange} onBlur={onBlur} disabled={disabled}
        className={`w-full pl-9 pr-${rightEl ? '10' : '4'} py-2.5 bg-white/5 border rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${extraClass}`}
      />
      {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#0d1117] text-white font-sans flex overflow-hidden">

      {/* LEFT */}
      <div className="hidden lg:block lg:w-[55%] h-full">
        <FloatingPhotoPanel />
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-[45%] h-full flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-6">
          <div className="lg:hidden mb-6 text-center">
            <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">AdroIT</span>
          </div>

          <div className="w-full max-w-sm">

            {forgotMode ? (
              <>
                {!forgotSuccess ? (
                  <>
                    <button onClick={() => setForgotMode(false)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-6 group">
                      <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                      </svg>
                      Back to sign in
                    </button>
                    <h1 className="text-2xl font-bold text-white mb-1">Reset password</h1>
                    <p className="text-gray-500 text-sm mb-7">We'll send a reset link to your email.</p>
                    {forgotError && (
                      <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2.5">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>{forgotError}
                      </div>
                    )}
                    <div className="space-y-1 mb-6">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <input type="email" placeholder="you@example.com" value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"/>
                      </div>
                    </div>
                    <button onClick={handleForgot} disabled={forgotLoading || !forgotEmail}
                      className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
                      <span className="relative flex items-center justify-center gap-2">
                        {forgotLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending...</>) : "Send Reset Link"}
                      </span>
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-500/15 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                    <p className="text-gray-500 text-sm mb-6">Reset link sent to <span className="text-gray-300">{forgotEmail}</span>.</p>
                    <button onClick={() => { setForgotMode(false); setForgotSuccess(false); setForgotEmail(""); }}
                      className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors font-medium">Back to sign in →</button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">{isSignUp ? "Create account" : "Sign in"}</h1>
                  <p className="text-gray-500 text-sm">{isSignUp ? "Join the AdroIT community today" : "Welcome back — good to see you"}</p>
                </div>

                <div className="mb-5 flex w-full bg-white/5 border border-white/10 rounded-xl p-1">
                  {[{ label: "Sign In", value: false }, { label: "Sign Up", value: true }].map(({ label, value }) => (
                    <button key={label} type="button" onClick={() => { setIsSignUp(value); resetForm(); }}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${isSignUp === value ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                    >{label}</button>
                  ))}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>{error}
                  </div>
                )}

                {!isSignUp && (
                  <>
                    <button onClick={() => authClient.signIn.social({ provider: "google", callbackURL: window.location.origin + "/resources" })}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 mb-4">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8"/></div>
                      <div className="relative flex justify-center"><span className="px-3 bg-[#0d1117] text-xs text-gray-600">or with email</span></div>
                    </div>
                  </>
                )}

                <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-3">
                  {isSignUp && (
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <input id="name" type="text" placeholder="John Doe" required value={name}
                          onChange={(e) => setName(e.target.value)} disabled={loading}
                          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"/>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${emailErr ? "text-red-500/60" : email && !emailErr && emailTouched ? "text-cyan-600/60" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <input id="email" type="email" placeholder="you@example.com" required value={email}
                        onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)} disabled={loading}
                        className={`w-full pl-9 pr-9 py-2.5 bg-white/5 border rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${emailErr ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20" : email && !emailErr && emailTouched ? "border-green-500/40 focus:border-green-500/50 focus:ring-green-500/15" : "border-white/10 focus:border-cyan-500/60 focus:ring-cyan-500/20"}`}/>
                      {email && !emailErr && emailTouched && (
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    {emailErr && <p className="text-red-400 text-[11px] pl-1">{emailErr}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                      <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                        value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setPwTouched(true)} disabled={loading}
                        className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"/>
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                        <EyeIcon open={showPassword}/>
                      </button>
                    </div>
                    {isSignUp && pwTouched && password && (
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {pwRules.map(({ label, pass }) => (
                          <div key={label} className={`flex items-center gap-1 text-[10px] font-medium ${pass ? "text-green-400" : "text-gray-600"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pass ? "bg-green-400" : "bg-gray-700"}`}/>{label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isSignUp && (
                    <div className="flex justify-end pt-0.5">
                      <button type="button" onClick={() => { setForgotEmail(email); setForgotMode(true); setForgotError(""); setForgotSuccess(false); }}
                        className="text-[11px] text-gray-500 hover:text-cyan-400 transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <div className="pt-1">
                    <button type="submit" disabled={loading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>{isSignUp ? "Creating account..." : "Signing in..."}</>) : (
                          <>{isSignUp ? "Create Account" : "Sign In"}<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                        )}
                      </span>
                    </button>
                  </div>
                </form>

                <div className="mt-5 pt-5 border-t border-white/5 space-y-3 text-center">
                  <p className="text-xs text-gray-600">
                    Only pre-registered users can sign in.{" "}
                    <button onClick={() => window.location.href = "mailto:adroit.rnsit@gmail.com"}
                      className="text-cyan-500 hover:text-cyan-400 transition-colors font-medium">Contact admin</button>
                  </p>
                  <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-400 transition-colors group">
                    <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}