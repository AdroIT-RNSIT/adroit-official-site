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

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionLinks = [
    { name: "Home", href: "#" },
    { name: "Why Join", href: "#why-join" },
    { name: "Events", href: "/events" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "#contact" },
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl overflow-hidden group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/ADROIT-logo.webp"
                  alt="AdroIT"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
              AdroIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* Section anchor links (visible on home page) */}
            {pathname === "/" && (
              <ul className="flex items-center gap-8 mr-4">
                {sectionLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="relative text-gray-300 hover:text-white font-medium text-[15px] tracking-wide py-1 transition-colors duration-200 group"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 group-hover:w-full transition-all duration-200 ease-out shadow-lg shadow-cyan-400/50"></span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {/* Route-based links (visible when not on home page) */}
            {pathname !== "/" && (
              <ul className="flex items-center gap-2 mr-4">
                <li>
                  <Link
                    to="/"
                    className={`relative px-4 py-2 rounded-lg font-medium text-[15px] tracking-wide transition-all duration-200 ${
                      isActive("/")
                        ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/members"
                    className={`relative px-4 py-2 rounded-lg font-medium text-[15px] tracking-wide transition-all duration-200 ${
                      isActive("/members")
                        ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Members
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className={`relative px-4 py-2 rounded-lg font-medium text-[15px] tracking-wide transition-all duration-200 ${
                      isActive("/events")
                        ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Events
                  </Link>
                </li>
                {isLoggedIn && (
                  <li>
                    <Link
                      to="/resources"
                      className={`relative px-4 py-2 rounded-lg font-medium text-[15px] tracking-wide transition-all duration-200 ${
                        isActive("/resources")
                          ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Resources
                    </Link>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      className={`relative px-4 py-2 rounded-lg font-medium text-[15px] tracking-wide transition-all duration-200 ${
                        isActive("/admin")
                          ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            )}

            {/* App page links on home page */}
            {pathname === "/" && (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
                <Link
                  to="/members"
                  className="text-gray-300 hover:text-white font-medium text-[15px] px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  Members
                </Link>
                <Link
                  to="/events"
                  className="text-gray-300 hover:text-white font-medium text-[15px] px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  Events
                </Link>
                {isLoggedIn && (
                  <Link
                    to="/resources"
                    className="text-gray-300 hover:text-white font-medium text-[15px] px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                  >
                    Resources
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-white font-medium text-[15px] px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}

            {/* Auth button */}
            <div className="ml-2 pl-2 border-l border-white/10">
              {isPending ? null : isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-500/10 font-medium transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-400/20 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 border border-white/10"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 relative z-50 hover:bg-white/10"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 w-80 h-full z-[1000] bg-[#0d1117] shadow-2xl transform transition-all duration-500 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-colors duration-300"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Section links (anchor-based, for landing page) */}
          {pathname === "/" && (
            <>
              <p className="text-gray-500 text-xs uppercase tracking-wider px-6 mb-2">
                Sections
              </p>
              <ul className="space-y-2 mb-4">
                {sectionLinks.map((link, index) => (
                  <li
                    key={index}
                    className="transform transition-all duration-300"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 text-lg font-medium transition-all duration-300 hover:translate-x-2 hover:border-cyan-500/30 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-bold text-cyan-400">
                          {index + 1}
                        </span>
                      </div>
                      <span>{link.name}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="ml-auto text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300"
                      >
                        <path
                          d="M4 10H16M16 10L11 5M16 10L11 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* App page links (route-based) */}
          <p className="text-gray-500 text-xs uppercase tracking-wider px-6 mb-2">
            Pages
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl border text-lg font-medium transition-all duration-300 hover:translate-x-2 group ${
                  isActive("/")
                    ? "text-white bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5 border-white/5 hover:border-cyan-500/30"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/members"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl border text-lg font-medium transition-all duration-300 hover:translate-x-2 group ${
                  isActive("/members")
                    ? "text-white bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5 border-white/5 hover:border-cyan-500/30"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span>Members</span>
              </Link>
            </li>

            <li>
              <Link
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl border text-lg font-medium transition-all duration-300 hover:translate-x-2 group ${
                  isActive("/events")
                    ? "text-white bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5 border-white/5 hover:border-cyan-500/30"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span>Events</span>
              </Link>
            </li>

            {isLoggedIn && (
              <li>
                <Link
                  to="/resources"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl border text-lg font-medium transition-all duration-300 hover:translate-x-2 group ${
                    isActive("/resources")
                      ? "text-white bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5 border-white/5 hover:border-cyan-500/30"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-4 h-4 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <span>Resources</span>
                </Link>
              </li>
            )}

            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl border text-lg font-medium transition-all duration-300 hover:translate-x-2 group ${
                    isActive("/admin")
                      ? "text-white bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5 border-white/5 hover:border-cyan-500/30"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-4 h-4 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span>Admin</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Auth */}
          <div className="mt-4 pt-4 border-t border-white/10">
            {isPending ? null : isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-4 w-full px-6 py-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 font-medium transition-all duration-300 hover:translate-x-2"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-red-500/10 rounded-lg">
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span className="text-lg">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-400/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 border border-white/10"
              >
                <span>Login</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10H16M16 10L11 5M16 10L11 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="border-t border-white/10 pt-6">
            <p className="text-gray-500 text-sm text-center mb-4">
              Connect with us
            </p>
            <div className="flex justify-center gap-4">
              {["github", "linkedin", "twitter", "instagram"].map(
                (platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-cyan-500/30 hover:scale-110 transition-all duration-300"
                    aria-label={`Follow on ${platform}`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      {platform === "github" && (
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                      )}
                      {platform === "linkedin" && (
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      )}
                      {platform === "twitter" && (
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      )}
                      {platform === "instagram" && (
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                      )}
                    </svg>
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
