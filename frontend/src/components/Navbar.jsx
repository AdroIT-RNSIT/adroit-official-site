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
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../lib/theme";

const NAV_ICONS = {
  Home,
  Events: Calendar,
  Domains: Layers,
  Members: Users,
  Contact: Mail,
  Profile: User,
  Admin: Settings,
};

const LINK_CLASS =
  "relative z-10 px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors duration-300 ease-out hover:text-ink aria-[current=page]:text-ink motion-reduce:transition-none";

function MenuRow({ name, path, active, onSelect }) {
  const Icon = NAV_ICONS[name] || Home;
  return (
    <Link
      to={path}
      onClick={onSelect}
      aria-current={active ? "page" : undefined}
      className="ui-chip flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-sm font-medium transition-colors duration-300 ease-out"
    >
      <span data-part="icon" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className="flex-1 pr-2">{name}</span>
      <ChevronRight data-part="chev" size={14} strokeWidth={2} />
    </Link>
  );
}

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pill, setPill] = useState({ x: 0, w: 0, state: "hidden" });
  const navListRef = useRef(null);
  const { data: session, isPending } = useSession();

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "admin";
  const glassy = pathname === "/events/skill-up-bootcamp";

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

  const placePill = (el, state) => {
    const parent = navListRef.current;
    if (!parent || !el) return;
    const parentBox = parent.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    setPill({
      x: box.left - parentBox.left - parent.clientLeft,
      w: box.width,
      state,
    });
  };

  const hoverPill = (e) => {
    const el = e.currentTarget;
    placePill(el, el.dataset.navActive === "true" ? "rest" : "hover");
  };

  const restPillToActive = () => {
    const parent = navListRef.current;
    if (!parent) return;
    const activeEl = parent.querySelector("[data-nav-active='true']");
    if (activeEl) placePill(activeEl, "rest");
    else setPill((prev) => ({ ...prev, state: "hidden" }));
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => restPillToActive());
    const onResize = () => restPillToActive();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname, isLoggedIn, isAdmin, isDark]);

  // ===== PUBLIC LINKS - Visible to everyone =====
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Domains", path: "/domains" },
    { name: "Members", path: "/members" },
    { name: "Contact", path: "/contact" }
  ];

  // ===== ACCOUNT LINKS - Only visible when logged in =====
  const protectedLinks = [
    { name: "Profile", path: "/profile" },
    ...(isAdmin ? [{ name: "Admin", path: "/admin" }] : []),
  ];

  const navLink = (link) => {
    const active = isActive(link.path);
    return (
      <Link
        key={link.path}
        to={link.path}
        aria-current={active ? "page" : undefined}
        data-nav-active={active ? "true" : undefined}
        onMouseEnter={hoverPill}
        className={LINK_CLASS}
      >
        {link.name}
      </Link>
    );
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        data-shell="nav"
        data-scrolled={scrolled ? "true" : undefined}
        data-surface={glassy ? "grid" : undefined}
        className="ui-nav fixed top-0 left-0 right-0 z-[1000] h-[var(--nav-height)] pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] md:transition-[background-color,border-color,box-shadow] md:duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          
          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <BrandMark size="nav" onDark={isDark} />
          </Link>

          {/* ===== DESKTOP NAVIGATION ===== */}
          <div className="hidden md:flex items-center gap-3">
            <div
              ref={navListRef}
              className="ui-track relative flex items-center"
              onMouseLeave={restPillToActive}
            >
              <span
                aria-hidden
                data-state={pill.state}
                className="ui-thumb pointer-events-none absolute left-0 top-1/2 h-8 rounded-full transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  width: pill.w,
                  transform: `translate3d(${pill.x}px, -50%, 0)`,
                }}
              />

              {publicLinks.map(navLink)}

              {isLoggedIn && (
                <>
                  <span data-part="divider" className="mx-1 h-5 w-px bg-line" />
                  {protectedLinks.map(navLink)}
                </>
              )}
            </div>

            <ThemeToggle />
          </div>

          {/* ===== MOBILE ACTIONS ===== */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ui-pill md:hidden flex h-10 w-10 items-center justify-center transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      {mobileMenuOpen && (
        <>
          <div
            data-shell="scrim"
            className="fixed inset-0 top-[var(--nav-height)] z-[999] md:hidden"
            onClick={closeMenu}
          />
          <div
            id="mobile-menu"
            data-shell="menu"
            className="ui-dialog fixed right-3 top-[calc(var(--nav-height)+0.5rem)] z-[1001] w-44 max-w-[calc(100vw-1.5rem)] origin-top-right md:hidden"
          >
            <div
              data-part="caret"
              className="pointer-events-none absolute -top-1.5 right-5 h-3 w-3 rotate-45 rounded-[2px] border-l border-t"
            />
            <div data-part="scroll" className="max-h-[min(28rem,calc(100dvh-var(--nav-height)-1.5rem))] overflow-y-auto p-1.5">
          {isLoggedIn && (
            <div className="ui-well mb-1 flex items-center gap-2.5 rounded-xl px-2 py-2">
              <div data-part="avatar" className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-sm font-bold">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  session?.user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0 max-w-[11rem]">
                <p data-part="name" className="truncate text-sm font-medium text-ink">{session?.user?.name}</p>
                <p data-part="email" className="truncate text-xs text-ink-muted">{session?.user?.email}</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col">
            {publicLinks.map((link) => (
              <MenuRow key={link.path} {...link} active={isActive(link.path)} onSelect={closeMenu} />
            ))}
          </nav>

          {isLoggedIn && (
            <>
              <div data-part="divider" className="my-1.5 h-px bg-line" />
              <nav className="flex flex-col">
                {protectedLinks.map((link) => (
                  <MenuRow key={link.path} {...link} active={isActive(link.path)} onSelect={closeMenu} />
                ))}
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
