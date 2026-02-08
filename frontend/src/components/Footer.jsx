import React from 'react';

const Footer = () => {
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
    ],
    social: [
      { name: 'Instagram', href: 'https://instagram.com/adroit_club' },
      { name: 'GitHub', href: 'https://github.com/adroit-club' },
      { name: 'LinkedIn', href: 'https://linkedin.com/company/adroit-club' }
    ]
  };

  return (
    <footer className="relative bg-[#12121a] border-t border-white/10 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute -bottom-48 -left-24 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] animate-float-reverse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-black">
                  <path d="M16 4L4 10L16 16L28 10L16 4Z" fill="currentColor" opacity="0.6"/>
                  <path d="M4 16L16 22L28 16" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 22L16 28L28 22" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
                AdroIT
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Empowering the next generation of developers through low-code innovation and hands-on skill development.
            </p>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Company Links */}
            <div>
              <h3 className="text-base font-semibold text-white mb-5 tracking-wide">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center text-gray-400 hover:text-cyan-400 transition-all duration-300"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                      <span className="w-0 group-hover:w-full h-px bg-gradient-to-r from-cyan-400 to-transparent absolute bottom-0 left-0 transition-all duration-300"></span>
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
                      className="group inline-flex items-center text-gray-400 hover:text-cyan-400 transition-all duration-300"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-base font-semibold text-white mb-5 tracking-wide">
                Connect
              </h3>
              <ul className="space-y-3">
                {footerLinks.social.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center text-gray-400 hover:text-cyan-400 transition-all duration-300"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                      <svg 
                        className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            © {currentYear} <span className="text-gray-400">AdroIT Club</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="#privacy" 
              className="hover:text-cyan-400 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <span className="opacity-50">•</span>
            <a 
              href="#terms" 
              className="hover:text-cyan-400 transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 15s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;