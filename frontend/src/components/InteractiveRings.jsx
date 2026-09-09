export default function InteractiveRings({ className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,70vmin)] max-w-[650px]" }) {
  return (
    <div className={`hero-ring-container aspect-square pointer-events-none z-0 px-4 ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 w-full h-full rounded-full bg-sky-600/5 blur-[20px] animate-pulse-glow"></div>
        <div className="absolute w-full h-full border border-sky-600/20 rounded-full animate-spin-slow shadow-[0_0_30px_5px_rgba(2,132,199,0.08)]"></div>
        <div className="absolute w-[70%] h-[70%] top-[15%] left-[15%] border border-slate-400/25 rounded-full animate-spin-slower-reverse"></div>
        <div className="absolute w-[40%] h-[40%] top-[30%] left-[30%] border border-sky-600/15 rounded-full animate-spin-slowest"></div>

        <div className="absolute inset-0 animate-move-spiral">
          <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600 shadow-[0_0_15px_5px_rgba(2,132,199,0.25)]">
            <div className="absolute inset-0 rounded-full bg-white animate-ping"></div>
          </div>
        </div>

        <div className="absolute inset-0 animate-move-spiral-trail-1">
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/50"></div>
        </div>
        <div className="absolute inset-0 animate-move-spiral-trail-2">
          <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500/40"></div>
        </div>
        <div className="absolute inset-0 animate-move-spiral-trail-3">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600/30"></div>
        </div>
      </div>
    </div>
  );
}
