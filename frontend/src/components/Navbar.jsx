import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronRight,
  Home,
  Layers,
  Mail,
  Menu,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { useSession, authClient } from "../lib/auth-client";
import BrandMark from "./BrandMark";

const NAV_ICONS = {
  Home,
  "Paradox 2026": Calendar,
  Domains: Layers,
  Members: Users,
  Contact: Mail,
  Profile: User,
};

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // ===== PUBLIC LINKS - Visible to everyone =====
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Paradox 2026", path: "/events" },
    { name: "Domains", path: "/domains" },
    { name: "Members", path: "/members" },
    { name: "Contact", path: "/contact" }
  ];

  // ===== ACCOUNT LINKS - Only visible when logged in =====
  const protectedLinks = [
    { name: "Profile", path: "/profile" }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] h-[var(--nav-height)] pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] transition-all duration-300 ease-in-out ${
          isHomePage
            ? scrolled
              ? "backdrop-blur-xl bg-white/85 border-b border-slate-200/80 shadow-sm"
              : "bg-white/70 backdrop-blur-md border-b border-slate-200/60"
            : scrolled
              ? "backdrop-blur-xl bg-[#f3e8ff]/95 border-b border-slate-900/10 shadow-xl"
              : "bg-[#f3e8ff] border-b border-slate-900/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          
          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <BrandMark size="nav" />
            <div className="hidden lg:block ml-4 h-12 w-64 overflow-hidden relative">
              <img
                src="/ieee_logo.png"
                alt="IEEE RNSIT"
                className="absolute h-[180px] w-auto max-w-none left-0 top-[calc(50%+9px)] -translate-y-1/2"
              />
            </div>
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
                      ? "text-slate-900 bg-sky-500/15 border border-sky-500/30"
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
                          ? "text-slate-900 bg-sky-500/15 border border-sky-500/30"
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
                          ? "text-slate-900 bg-sky-500/15 border border-sky-500/30"
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
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden flex h-10 w-10 items-center justify-center rounded-xl border text-slate-800 transition-colors ${
              mobileMenuOpen
                ? "border-sky-500/40 bg-white text-sky-700 shadow-sm"
                : "border-slate-900/10 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-[var(--nav-height)] z-[999] bg-slate-900/30 backdrop-blur-[2px]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed right-3 z-[1001] top-[calc(var(--nav-height)+0.5rem)] w-[min(20.5rem,calc(100vw-1.5rem))] origin-top-right rounded-2xl border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-200 ${
          mobileMenuOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="pointer-events-none absolute -top-1.5 right-5 h-3 w-3 rotate-45 rounded-[2px] border-l border-t border-white/70 bg-white/90" />
        <div className="max-h-[min(28rem,calc(100dvh-var(--nav-height)-1.5rem))] overflow-y-auto p-2">
          {isLoggedIn && (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 text-sm font-bold text-white">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  session?.user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{session?.user?.name}</p>
                <p className="truncate text-xs text-slate-500">{session?.user?.email}</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-0.5">
            {publicLinks.map((link) => {
              const Icon = NAV_ICONS[link.name] || Home;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-sky-50 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      active ? "bg-sky-500/15 text-sky-600" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="flex-1">
                    {link.name === "Paradox 2026" ? (
                      <span className="font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text">
                        {link.name}
                      </span>
                    ) : (
                      link.name
                    )}
                  </span>
                  <ChevronRight
                    size={16}
                    className={active ? "text-sky-500" : "text-slate-300"}
                    strokeWidth={2}
                  />
                </Link>
              );
            })}
          </nav>

          {isLoggedIn && (
            <>
              <div className="my-2 h-px bg-slate-200" />
              <nav className="flex flex-col gap-0.5">
                {protectedLinks.map((link) => {
                  const Icon = NAV_ICONS[link.name] || User;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-sky-50 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          active ? "bg-sky-500/15 text-sky-600" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <span className="flex-1">{link.name}</span>
                      <ChevronRight
                        size={16}
                        className={active ? "text-sky-500" : "text-slate-300"}
                        strokeWidth={2}
                      />
                    </Link>
                  );
                })}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors ${
                      isActive("/admin")
                        ? "bg-sky-50 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        isActive("/admin")
                          ? "bg-sky-500/15 text-sky-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Settings size={18} strokeWidth={2} />
                    </span>
                    <span className="flex-1">Admin</span>
                    <ChevronRight
                      size={16}
                      className={isActive("/admin") ? "text-sky-500" : "text-slate-300"}
                      strokeWidth={2}
                    />
                  </Link>
                )}
              </nav>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
