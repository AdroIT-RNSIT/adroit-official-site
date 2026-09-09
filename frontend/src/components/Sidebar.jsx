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
      url: 'https://www.instagram.com/AdroIT_RNSIT',
      icon: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/AdroIT-RNSIT',
      icon: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/adroit-rnsit',
      icon: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Desktop Sidebar - Left Side */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="social-glass-bar relative flex flex-col items-center gap-[0.86rem] px-[0.72rem] py-[0.86rem] rounded-[2rem]">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="group relative flex h-[3.15rem] w-[3.15rem] items-center justify-center"
            >
              <div className="social-glass-icon relative flex h-[3.15rem] w-[3.15rem] items-center justify-center rounded-full text-slate-700 transition-all duration-300 group-hover:bg-white/55 group-hover:text-slate-900">
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {link.icon}
                </span>
              </div>
              <span className="social-glass-bar pointer-events-none absolute left-full ml-3 rounded-full px-3 py-1.5 text-sm font-medium text-slate-800 whitespace-nowrap opacity-0 translate-x-[-8px] shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50">
        <div className="social-glass-bar relative flex items-center gap-[0.575rem] px-[0.72rem] py-[0.575rem] rounded-full">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="group relative flex h-[3.15rem] w-[3.15rem] items-center justify-center"
            >
              <div className="social-glass-icon relative flex h-[3.15rem] w-[3.15rem] items-center justify-center rounded-full text-slate-700 transition-all duration-300 group-active:bg-white/60 group-hover:bg-white/55 group-hover:text-slate-900">
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {link.icon}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .social-glass-bar {
          isolation: isolate;
          background: rgba(255, 255, 255, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.62);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.78),
            inset 0 -1px 0 rgba(255, 255, 255, 0.12),
            0 14px 40px rgba(15, 23, 42, 0.14);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
        }
        .social-glass-bar::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 48%);
        }
        .social-glass-bar > * {
          position: relative;
          z-index: 1;
        }
        .social-glass-icon {
          background: rgba(255, 255, 255, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }
        @media (prefers-reduced-transparency: reduce) {
          .social-glass-bar,
          .social-glass-icon {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            background: rgba(255, 255, 255, 0.94);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;