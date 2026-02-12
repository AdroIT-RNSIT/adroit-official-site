import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ showMap = false }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0d1117] border-t border-white/10 overflow-hidden">
      
      {/* ===== BACKGROUND DECORATIONS ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute -bottom-48 -left-24 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] animate-float-reverse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ===== MAIN FOOTER CONTENT ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* ===== COLUMN 1: BRAND & CONTACT (5 cols) ===== */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl overflow-hidden group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/ADROIT-logo.webp"
                  alt="AdroIT"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
                AdroIT
              </span>
            </Link>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              Department of Computer Science & Engineering
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400 mt-1 flex-shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a 
                  href="mailto:adroit.rnsit@gmail.com" 
                  className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  adroit.rnsit@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400 mt-1 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-gray-500 text-sm">
                  RNSIT, Bangalore
                </p>
              </div>
            </div>
          </div>

          {/* ===== COLUMN 2: THE CLUB (2 cols) ===== */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              The Club
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-500 text-sm flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                Founded 2020
              </li>
              <li className="text-gray-500 text-sm flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                50+ Members
              </li>
              <li className="text-gray-500 text-sm flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                30+ Projects
              </li>
              <li className="text-gray-500 text-sm flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                20+ Events
              </li>
            </ul>
          </div>

          {/* ===== COLUMN 3: DOMAINS (2 cols) ===== */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Our Domains
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-cyan-400">🤖</span> Machine Learning
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-purple-400">☁️</span> Cloud Computing
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-pink-400">🔒</span> Cybersecurity
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-green-400">📊</span> Data Analytics
              </li>
            </ul>
          </div>

          {/* ===== COLUMN 4: CONNECT (3 cols) - CONDITIONAL ===== */}
          {!showMap && (
            <div className="lg:col-span-3">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Connect
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/AdroIT-RNSIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-cyan-400 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.098 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/adroit-rnsit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-cyan-400 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/adroit_rnsit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-pink-400 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-600 text-xs mt-4">
                Follow us for updates and events
              </p>
            </div>
          )}
        </div>

        {/* ===== MAP SECTION - ONLY ON HOMEPAGE (ORIGINAL SIZE) ===== */}
        {showMap && (
          <div className="lg:col-span-12 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h4 className="text-white font-semibold text-sm">Find Our Campus</h4>
            </div>
            
            {/* ===== MAP - RESTORED TO ORIGINAL SIZE ===== */}
            <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden border border-white/10 shadow-lg">
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
              ></iframe>
              
              <a 
                href="https://maps.google.com/?q=RNSIT+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg hover:bg-black/90 transition-colors duration-300 flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Open in Maps
              </a>
            </div>
            
            <p className="text-gray-600 text-xs mt-2">
              Visit us in the Computer Science Department building
            </p>
          </div>
        )}

        {/* ===== BOTTOM BAR ===== */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {currentYear} AdroIT Club. All rights reserved.
          </p>
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-cyan-400 transition-colors duration-300"
            aria-label="Back to top"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to Top
          </button>
        </div>
      </div>

      {/* ===== CUSTOM ANIMATIONS ===== */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-30px, 30px) rotate(240deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-120deg); }
          66% { transform: translate(30px, -30px) rotate(-240deg); }
        }
        
        .animate-float { animation: float 25s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 30s ease-in-out infinite; }
      `}</style>
    </footer>
  );
};

export default Footer;