import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSession, authClient } from "../lib/auth-client";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isActive = (path) => pathname === path;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "admin";

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/");
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Paradox 2026", path: "/events" },
    { name: "Domains", path: "/domains" },
    { name: "Contact", path: "/contact" }
  ];

  const protectedLinks = [
    { name: "Resources", path: "/resources" },
    { name: "Members", path: "/members" },
    { name: "Profile", path: "/profile" }
  ];

  const linkClass = (path) =>
    `nav-link inline-flex items-center min-h-11 px-3 rounded-lg text-sm font-medium ${
      isActive(path)
        ? "text-accent-primary bg-accent-primary-tint"
        : "text-text-body hover:text-text-primary hover:bg-bg-base"
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-bg-surface/95 border-b border-border-subtle">
        <div className="page-wrap flex items-center justify-between h-full gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-2 min-h-11 min-w-0 shrink-0">
            <img
              src="/ADROIT-logo.webp"
              alt="AdroIT"
              width={36}
              height={36}
              className="brand-mark brand-nav-adroit rounded-lg"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-text-primary truncate">
              AdroIT
            </span>
          </Link>

          <div className="nav-desktop">
            {publicLinks.map((link) => (
              <Link key={link.path} to={link.path} className={linkClass(link.path)}>
                {link.name}
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <span className="w-px h-5 bg-border-subtle mx-2" aria-hidden="true" />
                {protectedLinks.map((link) => (
                  <Link key={link.path} to={link.path} className={linkClass(link.path)}>
                    {link.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" className={linkClass("/admin")}>
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-toggle"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden fixed inset-0 z-40 bg-text-primary/40 mobile-overlay ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-nav"
        className={`md:hidden fixed top-16 right-0 bottom-0 z-50 w-[min(20rem,100%)] bg-bg-surface border-l border-border-subtle mobile-drawer ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="h-full overflow-y-auto p-5 pb-10" data-lenis-prevent>
          {isLoggedIn && (
            <div className="mb-5 p-3 rounded-xl border border-border-subtle bg-bg-base">
              <p className="text-sm font-semibold text-text-primary truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
            </div>
          )}

          <p className="section-kicker mb-2">Public</p>
          <div className="flex flex-col gap-1 mb-6">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`${linkClass(link.path)} w-full justify-start`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {isLoggedIn && (
            <>
              <p className="section-kicker mb-2">Member</p>
              <div className="flex flex-col gap-1">
                {protectedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${linkClass(link.path)} w-full justify-start`}
                  >
                    {link.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${linkClass("/admin")} w-full justify-start`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
