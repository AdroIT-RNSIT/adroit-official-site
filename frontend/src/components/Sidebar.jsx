import React from 'react';

const Sidebar = ({ showOnHomepage = true }) => {
  // Don't render if not on homepage
  if (!showOnHomepage) return null;

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
      {/* Desktop Sidebar - Left Side - Minimalistic Line Design with Icons */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center gap-8">
          {/* Main vertical line with glow */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 w-[3px] h-40 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent blur-[3px] animate-pulse-glow"></div>
            
            {/* Main line */}
            <div className="relative w-px h-40 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent">
              {/* Animated glowing dots on the line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] animate-pulse"></div>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_6px_1px_rgba(34,211,238,0.3)]"></div>
              <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_6px_1px_rgba(34,211,238,0.3)]"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>

          {/* Social links - larger icons */}
          <div className="flex flex-col items-center gap-8">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="group relative w-10 h-10 flex items-center justify-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon in glowing circle */}
                <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-transparent group-hover:bg-cyan-400/15 border border-gray-700/50 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_15px_3px_rgba(34,211,238,0.3)] transition-all duration-300">
                  <div className="text-gray-500 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300">
                    {link.icon}
                  </div>
                </div>
                
                {/* Tooltip */}
                <span className="absolute left-full ml-4 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg text-white text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-lg shadow-cyan-400/20">
                  {link.name}
                  {/* Tooltip arrow */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white/10"></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile - Simple bottom bar with larger icons */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-10 px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-xl shadow-black/30">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="group relative w-8 h-8 flex items-center justify-center"
            >
              {/* Icon in glowing circle */}
              <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-transparent group-hover:bg-cyan-400/15 border border-gray-700/50 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_15px_3px_rgba(34,211,238,0.3)] transition-all duration-300">
                <div className="text-gray-500 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300">
                  {link.icon}
                </div>
              </div>
              
              {/* Mobile Tooltip - Top */}
              <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none shadow-lg">
                {link.name}
                {/* Tooltip arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/10"></span>
              </span>
            </a>
          ))}
          
          {/* Connecting glowing line between icons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent shadow-[0_0_4px_1px_rgba(34,211,238,0.2)]"></div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Sidebar;


// // Homepage - Shows sidebar
// <Sidebar />

// // Other pages - Doesn't show sidebar
// <Sidebar showOnHomepage={false} />