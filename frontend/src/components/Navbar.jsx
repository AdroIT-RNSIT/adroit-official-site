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
    { name: "Events", path: "/events" },
    { name: "Team", path: "/team" },
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
            ? "backdrop-blur-xl bg-[#0d1117]/95 border-b border-white/10 shadow-xl"
            : "bg-[#0d1117] border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          
          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg overflow-hidden">
                <img
                  src="/ADROIT-logo.webp"
                  alt="AdroIT"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              AdroIT
            </span>
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
                      ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* PROTECTED LINKS - Only when logged in */}
            {isLoggedIn && (
              <>
                <span className="w-px h-5 bg-white/10 mx-1"></span>
                <div className="flex items-center">
                  {protectedLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
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
                          ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </div>
              </>
            )}

            {/* ===== AUTH SECTION ===== */}
            <div className="ml-3 pl-3 border-l border-white/10">
              {isPending ? null : isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {/* User Avatar */}
                  <Link
                    to="/profile"
                    className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden group"
                  >
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="group-hover:scale-110 transition-transform">
                        {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="Logout"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              ) : (
                !isHomePage && (
                  <Link
                    to="/login"
                    className="group relative inline-flex items-center gap-2 px-4 py-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    
                    {/* Icon */}
                    <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    
                    {/* Text */}
                    <span className="relative">Sign In</span>
                    
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
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
        className={`md:hidden fixed top-0 right-0 w-80 h-full z-[1000] bg-[#0d1117] border-l border-white/10 shadow-2xl transform transition-all duration-500 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
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
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          
          {/* User Info - Only when logged in */}
          {isLoggedIn && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    session?.user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{session?.user?.name}</p>
                  <p className="text-gray-500 text-xs">{session?.user?.email}</p>
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
                    ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {link.name === "Home" && "🏠"}
                  {link.name === "Events" && "📅"}
                  {link.name === "Team" && "👥"}
                  {link.name === "Domains" && "🎯"}
                  {link.name === "Contact" && "📞"}
                </span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Protected Links - Only when logged in */}
          {isLoggedIn && (
            <>
              <div className="my-4 border-t border-white/10"></div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-gray-600 px-3 mb-2">Member</p>
                {protectedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
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
                        ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="w-6 h-6 flex items-center justify-center">⚙️</span>
                    Admin
                  </Link>
                )}
              </div>
            </>
          )}

          {/* Mobile Auth Button */}
          <div className="mt-6 pt-6 border-t border-white/10">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 text-sm font-medium transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            ) : !isHomePage ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;