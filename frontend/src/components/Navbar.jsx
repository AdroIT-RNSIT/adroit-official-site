import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Using a slightly higher threshold or requestAnimationFrame can help
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ease-in-out ${
        scrolled
          ? 'bg-white/5 backdrop-blur-xl h-16'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform duration-200">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="text-black">
              <path d="M16 4L4 10L16 16L28 10L16 4Z" fill="currentColor" opacity="0.6"/>
              <path d="M4 16L16 22L28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 22L16 28L28 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
                className="relative text-gray-400 hover:text-blue-400 font-medium text-[15px] tracking-wide py-1 transition-colors duration-200 group"
              >
                {link.name}
                {/* The "HR" Line - Reduced duration to 200ms for snappiness */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 group-hover:w-full transition-all duration-200 ease-out shadow-lg shadow-cyan-400/50"></span>
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button - unchanged logic, optimized transitions */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl transition-colors duration-200 relative z-50"
        >
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu - optimized max-height timing */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 pt-[70px] bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <ul className="p-8 space-y-1">
          {navLinks.map((link, index) => (
            <li key={index} className="transform transition-all">
              <a
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg border-b border-white/5 text-lg font-medium transition-all"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;