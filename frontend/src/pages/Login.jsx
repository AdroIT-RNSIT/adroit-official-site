import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      navigate("/resources");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name || !email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }

      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "Sign up failed.");
        setLoading(false);
        return;
      }

      // After successful signup, auto sign in
      const signInResult = await authClient.signIn.email({
        email,
        password,
      });

      if (signInResult.error) {
        setError("Account created but auto-login failed. Please sign in.");
        setLoading(false);
        return;
      }

      navigate("/resources");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = isSignUp ? handleSignUp : handleSignIn;

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white font-sans overflow-hidden flex items-center justify-center">
      
      {/* ===== BACKGROUND EFFECTS - AdroIT Theme ===== */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/2 via-purple-500/2 to-pink-500/2 rounded-full blur-[150px]"></div>
        
        {/* Grid overlay - FIXED */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(34,211,238,0.03)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* ===== MAIN CONTAINER ===== */}
      <div className="relative z-10 w-full max-w-md mx-4">
        
        {/* ===== LOGO - Top Center ===== */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/ADROIT-logo.webp"
                alt="AdroIT"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              AdroIT
            </span>
          </Link>
        </div>

        {/* ===== LOGIN CARD ===== */}
        <div className="relative group">
          {/* Animated border glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
          
          {/* Card */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
            
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-purple-500/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-pink-500/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30 rounded-br-3xl"></div>

            {/* ===== HEADER ===== */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl border border-white/10 mb-4 backdrop-blur-sm">
                <svg
                  className="w-10 h-10 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                {isSignUp ? "Join AdroIT" : "Welcome Back"}
              </h1>
              <p className="text-gray-400 mt-2">
                {isSignUp 
                  ? "Create an account to access the AdroIT platform" 
                  : "Sign in to access the AdroIT platform"}
              </p>
            </div>

            {/* ===== TAB TOGGLE ===== */}
            <div className="mb-6 flex gap-2 bg-white/5 backdrop-blur-sm p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError("");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  !isSignUp
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError("");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  isSignUp
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* ===== ERROR MESSAGE ===== */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3 backdrop-blur-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* ===== GOOGLE SIGN IN (Sign In Only) ===== */}
            {!isSignUp && (
            <button
              onClick={() => {
                setError("");
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: window.location.origin + "/resources",
                });
              }}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-gray-300 hover:text-white hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 hover:scale-[1.02] mb-6 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
              <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            )}

            {/* ===== DIVIDER (Sign In Only) ===== */}
            {!isSignUp && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/40 backdrop-blur-sm text-gray-500">
                  or continue with email
                </span>
              </div>
            </div>
            )}

            {/* ===== EMAIL FORM ===== */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link (Sign In Only) */}
              {!isSignUp && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isSignUp ? "Creating account..." : "Signing in..."}
                    </>
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Sign In"}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* ===== FOOTER ===== */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-500">
                Only pre-registered users can sign in.{' '}
                <button
                  onClick={() => window.location.href = 'mailto:adroit.rnsit@gmail.com'}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Contact admin
                </button>
              </p>
              
              {/* Back to Home Link */}
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* ===== FEATURES BAR ===== */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Secure Login
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Protected Access
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-pink-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant Access
          </span>
        </div>
      </div>

      {/* ===== GLOBAL STYLES ===== */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
        .animate-float-particle {
          animation: float-particle 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
