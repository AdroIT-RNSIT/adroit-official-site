import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSession, authClient } from "../lib/auth-client";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const isActive = (path) => pathname === path;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "admin";
  const isHomePage = pathname === "/";

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== PUBLIC LINKS - Visible to everyone =====
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Paradox 2026", path: "/events" },

    { name: "Domains", path: "/domains" },
    { name: "Contact", path: "/contact" }
  ];

  // ===== PROTECTED LINKS - Only visible when logged in =====
  const protectedLinks = [
    { name: "Resources", path: "/resources" },
    { name: "Members", path: "/members" },
    { name: "Profile", path: "/profile" }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] h-16 transition-all duration-300 ease-in-out ${
          scrolled
            ? "backdrop-blur-xl bg-[#f3e8ff]/95 border-b border-slate-900/10 shadow-xl"
            : "bg-[#f3e8ff] border-b border-slate-900/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          
          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg overflow-hidden">
                <img
                  src="/ADROIT-logo.webp"
                  alt="AdroIT"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              AdroIT
            </span>
            <img
              src="/ieee_logo.png"
              alt="IEEE"
              className="ml-2 h-[240px] w-auto object-contain self-end"
            />
          </Link>

          {/* ===== DESKTOP NAVIGATION ===== */}
          <div className="hidden md:flex items-center gap-1">
            
            {/* PUBLIC LINKS */}
            <div className="flex items-center">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-slate-900 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-900/5"
                  }`}
                >
                  {link.name === "Paradox 2026" ? (
                    <span className="font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] filter">
                      {link.name}
                    </span>
                  ) : (
                    link.name
                  )}
                </Link>
              ))}
            </div>

            {/* PROTECTED LINKS - Only when logged in */}
            {isLoggedIn && (
              <>
                <span className="w-px h-5 bg-slate-900/10 mx-1"></span>
                <div className="flex items-center">
                  {protectedLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? "text-slate-900 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-900/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {/* Admin Link */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive("/admin")
                          ? "text-slate-900 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-900/5"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </div>
              </>
            )}

            {/* ===== AUTH SECTION REMOVED ===== */}
            <div className="ml-3 pl-3 border-l border-slate-900/10">
            </div>
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-slate-900/5 rounded-lg border border-slate-900/10 hover:bg-slate-900/10 transition-all duration-200"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
            <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
            <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 right-0 w-80 h-full z-[1000] bg-[#f3e8ff] border-l border-slate-900/10 shadow-2xl transform transition-all duration-500 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-900/10">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg overflow-hidden">
              <img src="/ADROIT-logo.webp" alt="AdroIT" className="w-full h-full object-cover opacity-60" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              AdroIT
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center bg-slate-900/5 rounded-lg border border-slate-900/10 hover:bg-slate-900/10 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          
          {/* User Info - Only when logged in */}
          {isLoggedIn && (
            <div className="mb-6 p-4 bg-slate-900/5 rounded-xl border border-slate-900/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-slate-900 text-lg font-bold">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    session?.user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <p className="text-slate-900 font-medium">{session?.user?.name}</p>
                  <p className="text-slate-500 text-xs">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Public Links */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-600 px-3 mb-2">Public</p>
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-slate-900 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5"
                }`}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {link.name === "Home" && "🏠"}
                  {link.name === "Paradox 2026" && "📅"}
                  {link.name === "Team" && "👥"}
                  {link.name === "Domains" && "🎯"}
                  {link.name === "Contact" && "📞"}
                </span>
                {link.name === "Paradox 2026" ? (
                  <span className="font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] filter text-base">
                    {link.name}
                  </span>
                ) : (
                  link.name
                )}
              </Link>
            ))}
          </div>

          {/* Protected Links - Only when logged in */}
          {isLoggedIn && (
            <>
              <div className="my-4 border-t border-slate-900/10"></div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-gray-600 px-3 mb-2">Member</p>
                {protectedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-slate-900 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5"
                    }`}
                  >
                    <span className="w-6 h-6 flex items-center justify-center">
                      {link.name === "Resources" && "📚"}
                      {link.name === "Members" && "👥"}
                      {link.name === "Profile" && "👤"}
                    </span>
                    {link.name}
                  </Link>
                ))}
                
                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/admin")
                        ? "text-slate-900 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5"
                    }`}
                  >
                    <span className="w-6 h-6 flex items-center justify-center">⚙️</span>
                    Admin
                  </Link>
                )}
              </div>
            </>
          )}

          {/* Mobile Auth Button Removed */}
        </div>
      </div>
    </>
  );
};

export default Navbar;