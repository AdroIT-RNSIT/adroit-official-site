import React from 'react';

const Footer = ({ showSocial = false }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#team' },
      { name: 'Events', href: '#events' },
      { name: 'Contact', href: '#contact' }
    ],
    resources: [
      { name: 'Blog', href: '#blog' },
      { name: 'Workshops', href: '#workshops' },
      { name: 'Projects', href: '#projects' },
      { name: 'Gallery', href: '#gallery' }
    ]
  };

  return (
    <footer className="relative bg-[#0d1117] border-t border-white/10 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute -bottom-48 -left-24 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] animate-float-reverse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content with Map on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Brand & Contact Section */}
          <div className="lg:col-span-5 px-4">
            <div className="flex items-center gap-3 mb-6">
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
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Empowering the next generation of developers through low-code innovation and hands-on skill development.
            </p>
            
            {/* Minimal Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400 mt-1 flex-shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a 
                  href="mailto:adroit@college.edu" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  adroit@college.edu
                </a>
              </div>

              <div className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400 mt-1 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-gray-400 text-sm">
                  Computer Science Department<br />
                  College Campus, City
                </p>
              </div>
            </div>

            {/* Social Icons - Conditionally rendered */}
            {showSocial && (
              <div className="flex items-center gap-4">
                {['github', 'linkedin', 'twitter', 'instagram'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-cyan-500/30 hover:scale-110 transition-all duration-300"
                    aria-label={`Follow on ${platform}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {platform === 'github' && (
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                      )}
                      {platform === 'linkedin' && (
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                      )}
                      {platform === 'twitter' && (
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      )}
                      {platform === 'instagram' && (
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      )}
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links & Map Section - Right Side */}
          <div className="lg:col-span-7 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-base font-semibold text-white mb-5 tracking-wide">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center text-gray-400 hover:text-cyan-400 transition-all duration-300 relative pb-1"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                        <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-300"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="text-base font-semibold text-white mb-5 tracking-wide">
                  Resources
                </h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center text-gray-400 hover:text-cyan-400 transition-all duration-300 relative pb-1"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                        <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-300"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Map Section - Below Links */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h4 className="text-white font-semibold text-sm">Find Our Campus</h4>
              </div>
              
              <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                {/* Replace with your actual Google Maps embed URL */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3519.4201134668556!2d77.51600707454556!3d12.902195416397204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fa747acf84b%3A0x97a5cf1952c2fe3a!2sRNSIT%20CSE%20Department!5e1!3m2!1sen!2sin!4v1770548920832!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="College Location Map"
                ></iframe>
                
                {/* Map Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                
                {/* Map Controls */}
                <a 
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg hover:bg-black/90 transition-colors duration-300 flex items-center gap-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Open Maps
                </a>
              </div>
              
              <p className="text-gray-500 text-xs mt-2">
                Visit us in the Computer Science Department building, Room 205
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 mx-4"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 px-4">
          <p>
            © {currentYear} <span className="text-gray-400">AdroIT Club</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="#privacy" 
              className="hover:text-cyan-400 transition-colors duration-300 text-sm"
            >
              Privacy Policy
            </a>
            <span className="opacity-50">•</span>
            <a 
              href="#terms" 
              className="hover:text-cyan-400 transition-colors duration-300 text-sm"
            >
              Terms of Service
            </a>
            <span className="opacity-50">•</span>
            <a 
              href="#sitemap" 
              className="hover:text-cyan-400 transition-colors duration-300 text-sm"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
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
        
        .animate-float {
          animation: float 25s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 30s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;