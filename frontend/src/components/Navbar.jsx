import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSession } from "../lib/auth-client";
import { prefersReducedMotion } from "../lib/revealObserver";
import { getLenis } from "../lib/scroll";

const DESKTOP_NAV_MQ = "(min-width: 768px)";
const COMPACT_RESTORE_UP_PX = 60;
const TOP_SCROLL_THRESHOLD = 16;

const publicLinks = [
  { name: "Home", path: "/" },
  { name: "Paradox 2026", path: "/events" },
  { name: "Domains", path: "/domains" },
  { name: "Contact", path: "/contact" },
];

const protectedLinks = [
  { name: "Resources", path: "/resources" },
  { name: "Members", path: "/members" },
  { name: "Profile", path: "/profile" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const [navCompact, setNavCompact] = useState(false);
  const scrollUpAccumRef = useRef(0);
  const lastScrollRef = useRef(0);
  const { data: session } = useSession();

  const isActive = (path) => pathname === path;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "admin";
  const isHome = pathname === "/";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setNavReady(true);
      return;
    }
    const timer = window.setTimeout(() => setNavReady(true), 40);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setNavCompact(false);
      return undefined;
    }

    const desktopMq = window.matchMedia(DESKTOP_NAV_MQ);
    const getScrollY = () => getLenis()?.scroll ?? window.scrollY;
    let lenisScrollActive = false;
    let lenisInstance = getLenis();

    lastScrollRef.current = getScrollY();

    const applyCompact = (scrollY, direction) => {
      if (!desktopMq.matches) {
        setNavCompact(false);
        scrollUpAccumRef.current = 0;
        return;
      }

      if (scrollY <= TOP_SCROLL_THRESHOLD) {
        scrollUpAccumRef.current = 0;
        setNavCompact(false);
        return;
      }

      if (direction > 0) {
        scrollUpAccumRef.current = 0;
        setNavCompact(true);
        return;
      }

      if (direction < 0) {
        scrollUpAccumRef.current += lastScrollRef.current - scrollY;
        if (scrollUpAccumRef.current >= COMPACT_RESTORE_UP_PX) {
          scrollUpAccumRef.current = 0;
          setNavCompact(false);
        }
      }
    };

    const handleScroll = () => {
      const scrollY = getScrollY();
      const direction =
        scrollY > lastScrollRef.current ? 1 : scrollY < lastScrollRef.current ? -1 : 0;
      applyCompact(scrollY, direction);
      lastScrollRef.current = scrollY;
    };

    const handleDesktopChange = () => {
      scrollUpAccumRef.current = 0;
      if (!desktopMq.matches) {
        setNavCompact(false);
        return;
      }
      const scrollY = getScrollY();
      lastScrollRef.current = scrollY;
      setNavCompact(scrollY > TOP_SCROLL_THRESHOLD);
    };

    const handleWindowScroll = () => {
      if (lenisScrollActive) return;
      handleScroll();
    };

    const handleLenisScroll = () => {
      handleScroll();
    };

    const bindLenis = () => {
      lenisInstance = getLenis();
      if (!lenisInstance || lenisScrollActive) return lenisScrollActive;
      lenisInstance.on("scroll", handleLenisScroll);
      lenisScrollActive = true;
      handleScroll();
      return true;
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    bindLenis();
    handleScroll();

    const bindRetries = [150, 400, 900, 2000].map((delay) =>
      window.setTimeout(bindLenis, delay)
    );

    desktopMq.addEventListener("change", handleDesktopChange);

    return () => {
      bindRetries.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", handleWindowScroll);
      if (lenisInstance && lenisScrollActive) {
        lenisInstance.off("scroll", handleLenisScroll);
      }
      desktopMq.removeEventListener("change", handleDesktopChange);
      scrollUpAccumRef.current = 0;
      setNavCompact(false);
    };
  }, [isHome]);

  const linkClass = (path) => {
    const active = isActive(path);
    return [
      "nav-link",
      "nav-intro-item",
      active ? "nav-link-active" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <>
      {isHome && <div className="nav-scroll-boundary" aria-hidden="true" />}
      <nav
        className={`nav-shell fixed top-0 left-0 right-0 z-50 ${
          isHome ? "nav-shell--hero-integrated" : "nav-shell--elevated"
        } ${navReady ? "nav-shell--ready" : ""} ${
          isHome && navCompact ? "nav-shell--compact" : ""
        }`}
      >
        <div className="page-wrap nav-inner">
          <Link
            to="/"
            className="nav-brand nav-intro-item"
            style={{ "--nav-index": 0 }}
          >
            <img
              src="/ADROIT-logo.webp"
              alt=""
              width={68}
              height={68}
              className="brand-mark brand-nav-adroit rounded-lg"
              aria-hidden="true"
            />
            <span className="nav-brand-text">
              <span className="nav-brand-name">AdroIT</span>
              <span className="nav-brand-tag">RNSIT Technical Club</span>
            </span>
          </Link>

          <div className="nav-center nav-desktop" role="navigation" aria-label="Primary">
            {publicLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={linkClass(link.path)}
                style={{ "--nav-index": index + 1 }}
                aria-current={isActive(link.path) ? "page" : undefined}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="nav-end">
            {isLoggedIn && (
              <div className="nav-desktop nav-actions-desktop">
                {protectedLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={linkClass(link.path)}
                    style={{ "--nav-index": index + 5 }}
                    aria-current={isActive(link.path) ? "page" : undefined}
                  >
                    {link.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={linkClass("/admin")}
                    style={{ "--nav-index": 8 }}
                    aria-current={isActive("/admin") ? "page" : undefined}
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}

            {isHome && (
              <div
                className="nav-institutional nav-intro-item"
                style={{ "--nav-index": isLoggedIn ? 9 : 5 }}
              >
                <img
                  src="/25_years.png"
                  alt="25 Years of RNSIT"
                  width={52}
                  height={52}
                  className="brand-mark nav-brand-25"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="nav-toggle md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`md:hidden mobile-nav-root ${
          mobileMenuOpen ? "mobile-nav-root--open" : ""
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          id="mobile-nav"
          className="mobile-nav-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-modal__close"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mobile-nav-modal__body" data-lenis-prevent>
            {isLoggedIn && (
              <div className="mb-5 p-3 rounded-xl border border-border-subtle bg-bg-base">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
              </div>
            )}

            <p className="section-kicker mb-3 pr-12">Public</p>
            <div className="mobile-nav-modal__links mb-6">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${linkClass(link.path)} mobile-nav-modal__link`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {isLoggedIn && (
              <>
                <p className="section-kicker mb-3">Member</p>
                <div className="mobile-nav-modal__links mb-2">
                  {protectedLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${linkClass(link.path)} mobile-nav-modal__link`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${linkClass("/admin")} mobile-nav-modal__link`}
                    >
                      Admin
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
