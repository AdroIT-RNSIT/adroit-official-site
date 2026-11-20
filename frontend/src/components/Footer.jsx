import { Brain, Cloud, ShieldCheck, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DOMAINS = [
  { id: "ml", label: "Machine Learning", Icon: Brain },
  { id: "cloud", label: "Cloud Computing", Icon: Cloud },
  { id: "cyber", label: "Cybersecurity", Icon: ShieldCheck },
  { id: "data", label: "Data Analytics", Icon: BarChart3 },
];

const SOCIAL = [
  {
    href: "https://github.com/AdroIT-RNSIT",
    brand: "github",
    label: "GitHub",
    path: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.098 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  },
  {
    href: "https://www.linkedin.com/company/adroit-rnsit",
    brand: "linkedin",
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    href: "https://www.instagram.com/adroit.rnsit",
    brand: "instagram",
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z",
  },
];

const Footer = ({ showMap = false }) => {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();
  const onGrid = pathname === "/events/skill-up-bootcamp";

  return (
    <footer
      data-shell="footer"
      data-surface={onGrid ? "grid" : undefined}
      className={`relative z-10 overflow-x-clip pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] ${onGrid ? "" : ""}`}
    >
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div
          data-part="grid"
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 ${showMap ? "mb-8" : "mb-10"}`}
        >
          <div data-part="brand" className="ui-card p-5 sm:p-6 lg:col-span-5">
            <p className="ui-heading text-lg font-bold tracking-tight text-ink sm:text-xl">AdroIT</p>
            <p data-part="faint" className="mt-1 max-w-sm text-sm leading-relaxed text-ink-muted">
              The premier technical club of RNSIT CSE — learn it, build it, show it.
            </p>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  data-part="icon"
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href="mailto:adroit.rnsit@gmail.com"
                  data-part="muted"
                  className="text-sm text-ink-muted transition-colors duration-300 hover:text-primary"
                >
                  adroit.rnsit@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  data-part="icon"
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p data-part="muted" className="text-sm text-ink-muted">
                  RNSIT, Bangalore
                </p>
              </div>
            </div>
          </div>

          <div className="ui-card p-5 sm:p-6 lg:col-span-2">
            <h3 className="ui-heading mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
              The Club
            </h3>
            <ul className="space-y-2.5">
              {["Founded 2020", "50+ Members", "30+ Projects", "20+ Events"].map((item) => (
                <li key={item} data-part="muted" className="flex items-center gap-2 text-sm text-ink-muted">
                  <span data-part="dot" className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="ui-card p-5 sm:p-6 lg:col-span-2">
            <h3 className="ui-heading mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
              Our Domains
            </h3>
            <ul className="space-y-3">
              {DOMAINS.map(({ id, label, Icon }) => (
                <li key={id}>
                  <Link
                    to="/domains"
                    data-part="domain"
                    data-domain={id === "cloud" ? "cloud" : id === "cyber" ? "cyber" : id === "data" ? "data" : "ml"}
                    className="group flex items-center gap-3 text-sm text-ink-muted transition-all duration-300 hover:translate-x-1 hover:text-ink motion-reduce:hover:translate-x-0"
                  >
                    <span
                      data-part="domain-icon"
                      data-domain={id === "cloud" ? "cloud" : id === "cyber" ? "cyber" : id === "data" ? "data" : "ml"}
                      className="ui-well flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition group-hover:scale-110 motion-reduce:group-hover:scale-100"
                    >
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {!showMap && (
            <div className="ui-card p-5 sm:p-6 sm:col-span-2 lg:col-span-3">
              <h3 className="ui-heading mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
                Connect
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {SOCIAL.map((s) => (
                  <a
                    key={s.brand}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-brand={s.brand}
                    className={`social-${s.brand} ui-pill flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors duration-300`}
                    aria-label={s.label}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
              <p data-part="faint" className="mt-4 text-xs text-ink-muted">
                Follow us for updates and events
              </p>
            </div>
          )}
        </div>

        {showMap && (
          <div data-part="map-block" className="ui-card mb-8 p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  data-part="icon"
                  className="text-primary"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h4 className="ui-heading text-sm font-semibold text-ink">Find Our Campus</h4>
              </div>
              <div className="flex items-center gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.brand}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-brand={s.brand}
                    className={`social-${s.brand} ui-pill flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors duration-300`}
                    aria-label={s.label}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div data-part="map" className="ui-well relative h-56 overflow-hidden rounded-lg sm:h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3519.4201134668556!2d77.51600707454556!3d12.902195416397204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fa747acf84b%3A0x97a5cf1952c2fe3a!2sRNSIT%20CSE%20Department!5e1!3m2!1sen!2sin!4v1770548920832!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="RNSIT CSE Department Location"
              />
              <a
                href="https://maps.google.com/?q=RNSIT+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="ui-chip absolute bottom-3 right-3 flex items-center gap-1 px-3 py-2 text-xs transition-colors duration-300"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open in Maps
              </a>
            </div>
            <p data-part="faint" className="mt-2 text-xs text-ink-muted">
              Visit us in the Computer Science Department building
            </p>
          </div>
        )}

        <div
          data-part="bar"
          className="flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row"
        >
          <p data-part="faint" className="text-center text-xs text-ink-muted sm:text-left">
            © {currentYear} AdroIT Club. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-part="faint"
            className="inline-flex min-h-10 items-center gap-1.5 text-xs text-ink-muted transition-colors duration-300 hover:text-primary"
            aria-label="Back to top"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
