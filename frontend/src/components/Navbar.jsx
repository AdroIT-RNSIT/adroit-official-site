import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Why Join', href: '#why-join' },
    { name: 'Events', href: '#events' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] h-16 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'backdrop-blur-xl bg-[#0d1117]/95 border-b border-white/10 shadow-xl'
            : 'bg-[#0d1117] border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl overflow-hidden group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/ADROIT-logo.webp"
                  alt="AdroIT"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
              AdroIT
            </span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="relative text-gray-300 hover:text-white font-medium text-[15px] tracking-wide py-1 transition-colors duration-200 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 group-hover:w-full transition-all duration-200 ease-out shadow-lg shadow-cyan-400/50"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 relative z-50 hover:bg-white/10"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 w-80 h-full z-[1000] bg-[#0d1117] shadow-2xl transform transition-all duration-500 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-colors duration-300"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <ul className="p-6 space-y-2">
          {navLinks.map((link, index) => (
            <li key={index} className="transform transition-all duration-300" style={{transitionDelay: `${index * 50}ms`}}>
              <a
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 px-6 py-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 text-lg font-medium transition-all duration-300 hover:translate-x-2 hover:border-cyan-500/30 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-sm font-bold text-cyan-400">{index + 1}</span>
                </div>
                <span>{link.name}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  className="ml-auto text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300"
                >
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </li>
          ))}
          
          {/* Join Button in Mobile Menu */}
          <li className="mt-8 px-6">
            <button className="w-full group px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:scale-105 transition-all duration-300">
              <span className="relative z-10">Join AdroIT</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </li>
        </ul>

        {/* Social Links */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="border-t border-white/10 pt-6">
            <p className="text-gray-500 text-sm text-center mb-4">Connect with us</p>
            <div className="flex justify-center gap-4">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;