import { Brain, Cloud, ShieldCheck, BarChart3 } from "lucide-react";
import Reveal from "./Reveal";

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/AdroIT-RNSIT",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.098 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/adroit-rnsit",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/adroit_rnsit",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
      </svg>
    ),
  },
];

const Footer = ({ showMap = false }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-surface">
      <Reveal as="div" className="page-wrap py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-sm font-semibold text-text-primary">AdroIT</p>
            <a
              href="mailto:adroit.rnsit@gmail.com"
              className="block text-sm text-text-body hover:text-accent-primary"
            >
              adroit.rnsit@gmail.com
            </a>
            <p className="text-sm text-text-body">RNSIT, Bangalore</p>
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="social-link inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border-subtle text-text-body hover:text-accent-primary hover:border-border-hover"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              The Club
            </h3>
            <ul className="space-y-2 text-sm text-text-body">
              <li>Founded 2020</li>
              <li>50+ Members</li>
              <li>30+ Projects</li>
              <li>20+ Events</li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Our Domains
            </h3>
            <ul className="space-y-2.5 text-sm text-text-body">
              <li className="footer-domain-item flex items-center gap-2">
                <Brain size={16} className="text-accent-primary shrink-0" />
                Machine Learning
              </li>
              <li className="footer-domain-item flex items-center gap-2">
                <Cloud size={16} className="text-accent-primary shrink-0" />
                Cloud Computing
              </li>
              <li className="footer-domain-item flex items-center gap-2">
                <ShieldCheck size={16} className="text-accent-primary shrink-0" />
                Cybersecurity
              </li>
              <li className="footer-domain-item flex items-center gap-2">
                <BarChart3 size={16} className="text-accent-primary shrink-0" />
                Data Analytics
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Connect
            </h3>
            <p className="text-xs text-text-muted">
              Follow us for updates and events
            </p>
          </div>
        </div>

        {showMap && (
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Find Our Campus</h4>
            <div className="relative h-52 sm:h-64 rounded-xl overflow-hidden border border-border-subtle">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3519.4201134668556!2d77.51600707454556!3d12.902195416397204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fa747acf84b%3A0x97a5cf1952c2fe3a!2sRNSIT%20CSE%20Department!5e1!3m2!1sen!2sin!4v1770548920832!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RNSIT CSE Department Location"
                className="absolute inset-0"
              />
              <a
                href="https://maps.google.com/?q=RNSIT+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 btn btn-secondary text-xs min-h-11 px-3"
              >
                Open in Maps
              </a>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Visit us in the Computer Science Department building
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted">
            © {currentYear} AdroIT Club. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn btn-ghost text-xs min-h-11"
            aria-label="Back to top"
          >
            Back to Top
          </button>
        </div>
      </Reveal>
    </footer>
  );
};

export default Footer;
