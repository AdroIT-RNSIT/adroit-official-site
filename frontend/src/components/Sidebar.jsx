import React from 'react';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  // ONLY show on homepage - strict check
  if (location.pathname !== '/') {
    return null;
  }

  const socialLinks = [
    {
      name: 'Instagram',
      id: 'instagram',
      brand: 'social-instagram-stroke',
      url: 'https://www.instagram.com/AdroIT_RNSIT',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      id: 'github',
      brand: 'social-github',
      url: 'https://github.com/AdroIT-RNSIT',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      id: 'linkedin',
      brand: 'social-linkedin',
      url: 'https://www.linkedin.com/company/adroit-rnsit',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Desktop Sidebar - original line + icon circles */}
      <div data-shell="rail" className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center gap-8">
          <div className="relative" aria-hidden="true">
            <div data-part="glow" className="absolute -inset-1 w-[3px] h-40 blur-[3px] animate-pulse-glow"></div>
            <div data-part="line" className="relative w-px h-40">
              <div data-part="dot" className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-pulse motion-reduce:animate-none"></div>
              <div data-part="dot" data-size="sm" className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"></div>
              <div data-part="dot" data-size="sm" className="absolute top-2/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"></div>
              <div data-part="dot" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-pulse motion-reduce:animate-none" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                data-brand={link.id}
                className={`group relative w-10 h-10 flex items-center justify-center ${link.brand}`}
              >
                <div className="ui-pill relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300">
                  <div data-part="glyph" className="text-ink-muted transition-all duration-300 motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:scale-110">
                    {link.icon}
                  </div>
                </div>
                <span className="ui-tooltip absolute left-full ml-4 px-3 py-2 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 motion-safe:translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                  {link.name}
                  <span data-part="arrow" className="absolute right-full top-1/2 -translate-y-1/2 border-4"></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div data-shell="dock" className="lg:hidden fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50">
        <div className="ui-card relative flex items-center gap-[0.575rem] px-[0.72rem] py-[0.575rem] rounded-full">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              data-brand={link.id}
              className={`group relative flex h-[3.15rem] w-[3.15rem] items-center justify-center ${link.brand}`}
            >
              <div className="ui-pill relative flex h-[3.15rem] w-[3.15rem] items-center justify-center rounded-full transition-all duration-300">
                <span className="transition-transform duration-300 motion-safe:group-hover:scale-110">
                  {link.icon}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
