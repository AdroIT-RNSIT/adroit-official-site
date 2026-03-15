import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";

const imageModules = import.meta.glob("../assets/*.png", { eager: true });

const PHOTOS = [
  { id: 1, src: imageModules["../assets/image1.png"]?.default,       label: "Workshop '25"        },
  { id: 2, src: imageModules["../assets/Hackathon.png"]?.default,    label: "Hackathon winner '26" },
  { id: 3, src: imageModules["../assets/AdroIT-team.png"]?.default,  label: "Team AdroIT"          },
  { id: 4, src: imageModules["../assets/image2.png"]?.default,       label: "Tech Talk"            },
  { id: 5, src: imageModules["../assets/PresentTeam.png"]?.default,  label: "Recruitment Time"     },
];

function PhotoCard({ photo, className = "" }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden border border-white/15
      shadow-xl shadow-black/60 cursor-default
      transition-all duration-300 hover:scale-[1.03] hover:z-10 hover:border-white/25
      ${className}`}>
      {photo.src ? (
        <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-white/8 via-white/3 to-transparent
          flex flex-col items-center justify-center gap-2">
          <svg className="w-7 h-7 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[9px] text-white/15 font-medium tracking-wide">Your Photo</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute bottom-2 left-2">
        <span className="inline-block bg-black/50 backdrop-blur-sm border border-white/10
          text-white/70 text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full">
          {photo.label}
        </span>
      </div>
    </div>
  );
}

// ── Email validation ──────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getEmailError(email) {
  if (!email) return "";
  if (!emailRegex.test(email)) return "Enter a valid email address";
  return "";
}

function getPasswordErrors(password) {
  const errs = [];
  if (password.length < 8)        errs.push("At least 8 characters");
  if (!/[A-Z]/.test(password))    errs.push("One uppercase letter");
  if (!/[0-9]/.test(password))    errs.push("One number");
  return errs;
}

// ── Eye icon ─────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp]       = useState(false);
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [name, setName]               = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [pwTouched, setPwTouched]     = useState(false);

  // Forgot password states
  const [forgotMode, setForgotMode]         = useState(false);
  const [forgotEmail, setForgotEmail]       = useState("");
  const [forgotLoading, setForgotLoading]   = useState(false);
  const [forgotSuccess, setForgotSuccess]   = useState(false);
  const [forgotError, setForgotError]       = useState("");

  const resetForm = () => {
    setError(""); setName(""); setEmail(""); setPassword("");
    setEmailTouched(false); setPwTouched(false);
    setForgotMode(false); setForgotSuccess(false); setForgotError("");
  };

  const emailErr = emailTouched ? getEmailError(email) : "";
  const pwErrs   = pwTouched && isSignUp ? getPasswordErrors(password) : [];

  const handleSignIn = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) setError(result.error.message || "Invalid email or password.");
      else navigate("/resources");
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); setError("");
    if (getPasswordErrors(password).length > 0) {
      setError("Please fix password requirements before continuing.");
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.signUp.email({ email, password, name });
      if (result.error) { setError(result.error.message || "Sign up failed."); setLoading(false); return; }
      const signInResult = await authClient.signIn.email({ email, password });
      if (signInResult.error) setError("Account created but auto-login failed. Please sign in.");
      else navigate("/resources");
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setForgotError("");
    if (!emailRegex.test(forgotEmail)) { setForgotError("Enter a valid email address"); return; }
    setForgotLoading(true);
    try {
      const result = await authClient.forgetPassword({ email: forgotEmail, redirectTo: "/reset-password" });
      if (result.error) setForgotError(result.error.message || "Failed to send reset email.");
      else setForgotSuccess(true);
    } catch { setForgotError("Something went wrong. Please try again."); }
    setForgotLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-[#0d1117] text-white font-sans flex overflow-hidden">

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-[55%] h-full relative flex-col overflow-hidden bg-[#080c12]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(34,211,238,0.06)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,12,18,0.7) 100%)' }} />

        <div className="relative z-10 flex flex-col h-full p-8 gap-4">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-xs font-bold text-white/50 tracking-widest uppercase">AdroIT</span>
          </div>

          <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-3 min-h-0">
            <div className="row-span-2 -rotate-1"><PhotoCard photo={PHOTOS[0]} className="w-full h-full" /></div>
            <div className="rotate-1"><PhotoCard photo={PHOTOS[1]} className="w-full h-full" /></div>
            <div className="-rotate-1"><PhotoCard photo={PHOTOS[2]} className="w-full h-full" /></div>
            <div className="rotate-1"><PhotoCard photo={PHOTOS[3]} className="w-full h-full" /></div>
            <div className="-rotate-1"><PhotoCard photo={PHOTOS[4]} className="w-full h-full" /></div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-between">
            <p className="text-[11px] text-white/25 italic">"Building the next generation of tech leaders."</p>
            <div className="flex gap-1">
              <span className="w-4 h-0.5 rounded-full bg-cyan-500/40" />
              <span className="w-2 h-0.5 rounded-full bg-purple-500/40" />
              <span className="w-1 h-0.5 rounded-full bg-pink-500/30" />
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent" />
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="w-full lg:w-[45%] h-full flex flex-col relative overflow-hidden">

        {/* Glows */}
        <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Scrollable inner */}
        <div className="relative z-10 flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-6">

          {/* Mobile brand */}
          <div className="lg:hidden mb-6 text-center">
            <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">AdroIT</span>
          </div>

          <div className="w-full max-w-sm">

            {/* ── FORGOT PASSWORD VIEW ── */}
            {forgotMode ? (
              <div className="w-full">
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
                        </svg>
                        {forgotError}
                      </div>
                    )}

                    <div className="space-y-1.5 mb-6">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <input type="email" placeholder="you@example.com"
                          value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"/>
                      </div>
                    </div>

                    <button onClick={handleForgotPassword} disabled={forgotLoading || !forgotEmail}
                      className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600
                        text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25
                        hover:scale-[1.02] transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                        group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
                      <span className="relative flex items-center justify-center gap-2">
                        {forgotLoading ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending...</>
                        ) : "Send Reset Link"}
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
                    <p className="text-gray-500 text-sm mb-6">A reset link has been sent to <span className="text-gray-300">{forgotEmail}</span>.</p>
                    <button onClick={() => { setForgotMode(false); setForgotSuccess(false); setForgotEmail(""); }}
                      className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors font-medium">
                      Back to sign in →
                    </button>
                  </div>
                )}
              </div>

            ) : (
              /* ── MAIN SIGN IN / SIGN UP VIEW ── */
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {isSignUp ? "Create account" : "Sign in"}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {isSignUp ? "Join the AdroIT community today" : "Welcome back — good to see you"}
                  </p>
                </div>

                {/* Tab Toggle */}
                <div className="mb-5 flex w-full bg-white/5 border border-white/10 rounded-xl p-1">
                  {[{ label: "Sign In", value: false }, { label: "Sign Up", value: true }].map(({ label, value }) => (
                    <button key={label} type="button"
                      onClick={() => { setIsSignUp(value); resetForm(); }}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300
                        ${isSignUp === value
                          ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20"
                          : "text-gray-500 hover:text-gray-300"}`}
                    >{label}</button>
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* Google */}
                {!isSignUp && (
                  <>
                    <button
                      onClick={() => authClient.signIn.social({ provider: "google", callbackURL: window.location.origin + "/resources" })}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4
                        bg-white/5 border border-white/10 rounded-xl text-sm font-medium
                        text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20
                        transition-all duration-200 mb-4">
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
                      <div className="relative flex justify-center">
                        <span className="px-3 bg-[#0d1117] text-xs text-gray-600">or with email</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Form */}
                <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-3">

                  {/* Name */}
                  {isSignUp && (
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <input id="name" type="text" placeholder="John Doe" required
                          value={name} onChange={(e) => setName(e.target.value)} disabled={loading}
                          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"/>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${emailErr ? "text-red-500/60" : email && !emailErr ? "text-cyan-600/60" : "text-gray-600"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <input id="email" type="email" placeholder="you@example.com" required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                        disabled={loading}
                        className={`w-full pl-9 pr-9 py-2.5 bg-white/5 border rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all disabled:opacity-50
                          ${emailErr
                            ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
                            : email && !emailErr && emailTouched
                              ? "border-green-500/40 focus:border-green-500/50 focus:ring-green-500/15"
                              : "border-white/10 focus:border-cyan-500/60 focus:ring-cyan-500/20"}`}/>
                      {/* Valid checkmark */}
                      {email && !emailErr && emailTouched && (
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    {emailErr && <p className="text-red-400 text-[11px] pl-1">{emailErr}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                      <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setPwTouched(true)}
                        disabled={loading}
                        className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"/>
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                        <EyeIcon open={showPassword}/>
                      </button>
                    </div>

                    {/* Password strength hints — sign up only */}
                    {isSignUp && pwTouched && password && (
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {[
                          { label: "8+ chars",   pass: password.length >= 8 },
                          { label: "Uppercase",  pass: /[A-Z]/.test(password) },
                          { label: "Number",     pass: /[0-9]/.test(password) },
                        ].map(({ label, pass }) => (
                          <div key={label} className={`flex items-center gap-1 text-[10px] font-medium
                            ${pass ? "text-green-400" : "text-gray-600"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                              ${pass ? "bg-green-400" : "bg-gray-700"}`}/>
                            {label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Forgot password link */}
                  {!isSignUp && (
                    <div className="flex justify-end pt-0.5">
                      <button type="button"
                        onClick={() => { setForgotEmail(email); setForgotMode(true); setForgotError(""); setForgotSuccess(false); }}
                        className="text-[11px] text-gray-500 hover:text-cyan-400 transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="pt-1">
                    <button type="submit" disabled={loading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600
                        text-white text-sm font-semibold rounded-xl
                        shadow-lg shadow-cyan-500/25 hover:shadow-purple-500/30
                        hover:scale-[1.02] transition-all duration-300
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                        group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                          {isSignUp ? "Creating account..." : "Signing in..."}</>
                        ) : (
                          <>{isSignUp ? "Create Account" : "Sign In"}
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                          </svg></>
                        )}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="mt-5 pt-5 border-t border-white/5 space-y-3 text-center">
                  <p className="text-xs text-gray-600">
                    Only pre-registered users can sign in.{" "}
                    <button onClick={() => window.location.href = "mailto:adroit.rnsit@gmail.com"}
                      className="text-cyan-500 hover:text-cyan-400 transition-colors font-medium">
                      Contact admin
                    </button>
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