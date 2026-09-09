import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const [pill, setPill] = useState({ x: 0, w: 0, visible: false });
  const navListRef = useRef(null);
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

  const placePill = (el) => {
    const parent = navListRef.current;
    if (!parent || !el) return;
    const parentBox = parent.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    setPill({
      x: box.left - parentBox.left,
      w: box.width,
      visible: true,
    });
  };

  const restPillToActive = () => {
    const parent = navListRef.current;
    if (!parent) return;
    const activeEl = parent.querySelector("[data-nav-active='true']");
    if (activeEl) placePill(activeEl);
    else setPill((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => restPillToActive());
    const onResize = () => restPillToActive();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname, isLoggedIn, isAdmin]);

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
        className={`fixed top-0 left-0 right-0 z-[1000] h-[var(--nav-height)] pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] bg-white border-b border-slate-200/80 md:transition-[background-color,border-color,box-shadow] md:duration-300 ${
          isHomePage
            ? scrolled
              ? "md:backdrop-blur-xl md:bg-white/85 md:border-slate-200/80 md:shadow-sm"
              : "md:bg-white/70 md:backdrop-blur-md md:border-slate-200/60"
            : scrolled
              ? "md:backdrop-blur-xl md:bg-[#f3e8ff]/95 md:border-slate-900/10 md:shadow-xl"
              : "md:bg-[#f3e8ff] md:border-slate-900/5"
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
            <div
              ref={navListRef}
              className="relative flex items-center"
              onMouseLeave={restPillToActive}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-1/2 h-8 rounded-lg bg-sky-500/15 ring-1 ring-sky-500/25 transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  width: pill.w,
                  opacity: pill.visible ? 1 : 0,
                  transform: `translate3d(${pill.x}px, -50%, 0)`,
                }}
              />

              {publicLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-nav-active={active ? "true" : undefined}
                    onMouseEnter={(e) => placePill(e.currentTarget)}
                    className={`relative z-10 px-3 py-1.5 text-sm font-medium transition-colors duration-300 ease-out motion-reduce:transition-none ${
                      active ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
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
                );
              })}

              {isLoggedIn && (
                <>
                  <span className="mx-1 h-5 w-px bg-slate-900/10" />
                  {protectedLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        data-nav-active={active ? "true" : undefined}
                        onMouseEnter={(e) => placePill(e.currentTarget)}
                        className={`relative z-10 px-3 py-1.5 text-sm font-medium transition-colors duration-300 ease-out motion-reduce:transition-none ${
                          active ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      data-nav-active={isActive("/admin") ? "true" : undefined}
                      onMouseEnter={(e) => placePill(e.currentTarget)}
                      className={`relative z-10 px-3 py-1.5 text-sm font-medium transition-colors duration-300 ease-out motion-reduce:transition-none ${
                        isActive("/admin") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
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
        <>
          <div
            className="md:hidden fixed inset-0 top-[var(--nav-height)] z-[999] bg-slate-900/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="md:hidden fixed right-3 z-[1001] top-[calc(var(--nav-height)+0.5rem)] w-[min(20.5rem,calc(100vw-1.5rem))] origin-top-right rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
            aria-hidden={!mobileMenuOpen}
          >
            <div className="pointer-events-none absolute -top-1.5 right-5 h-3 w-3 rotate-45 rounded-[2px] border-l border-t border-slate-200 bg-white" />
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
                  className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
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
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
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
                    className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
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
      )}
    </>
  );
};

export default Navbar;
