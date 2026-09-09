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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/AdroIT-RNSIT',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
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
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute -inset-1 w-[3px] h-40 bg-gradient-to-b from-transparent via-sky-500/40 to-transparent blur-[3px] animate-pulse-glow"></div>
            <div className="relative w-px h-40 bg-gradient-to-b from-transparent via-sky-500/50 to-transparent">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-500/80 shadow-[0_0_8px_2px_rgba(2,132,199,0.5)] animate-pulse"></div>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-500/60 shadow-[0_0_6px_1px_rgba(2,132,199,0.3)]"></div>
              <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-500/60 shadow-[0_0_6px_1px_rgba(2,132,199,0.3)]"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-500/80 shadow-[0_0_8px_2px_rgba(2,132,199,0.5)] animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="group relative w-10 h-10 flex items-center justify-center"
              >
                <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-transparent group-hover:bg-sky-600/15 border border-gray-700/50 group-hover:border-sky-600/40 group-hover:shadow-[0_0_15px_3px_rgba(2,132,199,0.3)] transition-all duration-300">
                  <div className="text-slate-500 group-hover:text-sky-600 group-hover:scale-110 transition-all duration-300">
                    {link.icon}
                  </div>
                </div>
                <span className="absolute left-full ml-4 px-3 py-2 bg-slate-900/10 backdrop-blur-xl border border-slate-900/10 rounded-lg text-slate-900 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-lg shadow-sky-600/20">
                  {link.name}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white/10"></span>
                </span>
              </a>
            ))}
          </div>
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
              <div className="social-glass-icon relative flex h-[3.15rem] w-[3.15rem] items-center justify-center rounded-full text-slate-700 transition-all duration-300 group-active:bg-white/60 group-hover:bg-white/55 group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white dark:group-hover:bg-white/10 dark:group-active:bg-white/10">
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
        html.dark .social-glass-bar {
          background: rgba(8, 12, 22, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 14px 40px rgba(0, 0, 0, 0.35);
        }
        html.dark .social-glass-bar::before {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 48%);
        }
        html.dark .social-glass-icon {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
