import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const EventCarousel = ({ events }) => {
  const n = events.length;
  const copies = [...events, ...events, ...events];
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const xRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const didDragRef = useRef(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || n === 0) return;

    const setWidth = () => {
      const a = track.children[n];
      const b = track.children[n * 2];
      if (!a || !b) return 0;
      return b.offsetLeft - a.offsetLeft;
    };

    const wrapX = (value, w) => {
      if (w <= 0) return value;
      return ((value % w) + w) % w;
    };

    const apply = () => {
      const w = setWidth();
      xRef.current = wrapX(xRef.current, w);
      // Draw from the middle copy so both directions have buffer
      track.style.transform = `translate3d(${-xRef.current - (w || 0)}px, 0, 0)`;

      const mid = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
      [...track.children].forEach((el) => {
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - mid) / Math.max(r.width, 1);
        const t = Math.min(dist, 1);
        el.style.transform = `scale(${1.06 - t * 0.32})`;
        el.style.opacity = String(1 - t * 0.38);
      });
    };

    xRef.current = 0;
    apply();

    let raf = 0;
    const tick = () => {
      if (!draggingRef.current) xRef.current += 0.55;
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e) => {
      draggingRef.current = true;
      didDragRef.current = false;
      lastXRef.current = e.clientX;
      viewport.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      if (Math.abs(dx) > 6) didDragRef.current = true;
      xRef.current -= dx;
      lastXRef.current = e.clientX;
    };
    const onUp = () => {
      draggingRef.current = false;
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    const ro = new ResizeObserver(apply);
    ro.observe(viewport);

    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      ro.disconnect();
    };
  }, [n]);

  return (
    <div className="my-8 sm:my-10 w-[100vw] relative left-1/2 -translate-x-1/2">
      <div
        ref={viewportRef}
        className="event-strip overflow-hidden px-0 py-6 cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      >
        <div ref={trackRef} className="flex items-center gap-3 sm:gap-5 w-max will-change-transform">
          {copies.map((event, i) => (
            <Link
              key={`${event._id}-${i}`}
              to="/events"
              draggable={false}
              onClick={(e) => {
                if (didDragRef.current) e.preventDefault();
              }}
              className="event-strip-card shrink-0 w-[72vw] max-w-[22rem] sm:w-[24rem] h-[13.5rem] sm:h-[15rem] rounded-3xl border border-cyan-500/35 bg-gradient-to-br from-cyan-100/70 via-sky-50/90 to-blue-100/70 p-5 sm:p-6 text-left whitespace-normal"
            >
              <div className="flex justify-between items-start gap-2 mb-3">
                <span className="font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text text-xs sm:text-sm">
                  Paradox 2026
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-600 shrink-0">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-2 truncate bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-transparent bg-clip-text">
                {event.title}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-3">{event.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;
