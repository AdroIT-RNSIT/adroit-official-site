import { useEffect, useRef } from "react";

const COPIES = 3;

const EventCarousel = ({ events, onSelect, paused = false }) => {
  const n = events.length;
  const copies = Array.from({ length: COPIES }, (_, copy) =>
    events.map((event) => ({ event, copy }))
  ).flat();

  const viewportRef = useRef(null);
  const cardRefs = useRef([]);
  const progressRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const didDragRef = useRef(false);
  const pausedRef = useRef(paused);
  const onSelectRef = useRef(onSelect);
  const eventsRef = useRef(events);
  pausedRef.current = paused;
  onSelectRef.current = onSelect;
  eventsRef.current = events;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || n === 0) return;

    const metrics = () => {
      const card = cardRefs.current[0];
      const cardW = card?.offsetWidth || Math.min(viewport.clientWidth * 0.72, 352);
      const gap = viewport.clientWidth >= 640 ? 20 : 12;
      return { cardW, pitch: cardW + gap };
    };

    const apply = () => {
      const { cardW, pitch } = metrics();
      const mid = viewport.clientWidth / 2;
      const p = ((progressRef.current % n) + n) % n;

      cardRefs.current.forEach((el, k) => {
        if (!el) return;
        const copy = Math.floor(k / n);
        const i = k % n;
        const d = copy * n + i - n - p;
        const x = mid - cardW / 2 + d * pitch;
        const t = Math.min(Math.abs(d), 1);
        el.style.transform = `translate3d(${x}px, 0, 0) scale(${1.06 - t * 0.28})`;
        el.style.opacity = String(Math.abs(d) > 2.2 ? 0 : 1 - t * 0.28);
        el.style.zIndex = String(Math.round((2.2 - Math.abs(d)) * 10));
        el.style.pointerEvents = Math.abs(d) > 1.6 ? "none" : "auto";
      });
    };

    apply();

    let raf = 0;
    let last = performance.now();
    const cardsPerSec = 0.28;

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!draggingRef.current && !pausedRef.current) {
        progressRef.current += cardsPerSec * dt;
      }
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      draggingRef.current = true;
      didDragRef.current = false;
      lastXRef.current = e.clientX;
    };
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      if (!didDragRef.current) {
        if (Math.abs(dx) < 10) return;
        didDragRef.current = true;
        viewport.setPointerCapture(e.pointerId);
      }
      progressRef.current -= dx / metrics().pitch;
      lastXRef.current = e.clientX;
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    const onClick = (e) => {
      if (didDragRef.current) {
        e.preventDefault();
        e.stopPropagation();
        didDragRef.current = false;
        return;
      }
      const btn = e.target.closest("button");
      const idx = btn ? cardRefs.current.indexOf(btn) : -1;
      if (idx < 0) return;
      const event = eventsRef.current[idx % n];
      if (event) onSelectRef.current?.(event);
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("click", onClick);
    const ro = new ResizeObserver(apply);
    ro.observe(viewport);

    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("click", onClick);
      ro.disconnect();
    };
  }, [n]);

  return (
    <div className="my-8 sm:my-10 w-[100vw] relative left-1/2 -translate-x-1/2 z-20">
      <div
        ref={viewportRef}
        className="event-strip relative overflow-hidden h-[15.5rem] sm:h-[17rem] cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      >
        {copies.map(({ event, copy }, k) => (
          <button
            key={`${event._id}-${copy}`}
            ref={(el) => {
              cardRefs.current[k] = el;
            }}
            type="button"
            draggable={false}
            className="event-strip-card absolute top-6 left-0 w-[72vw] max-w-[22rem] sm:w-[24rem] h-[13.5rem] sm:h-[15rem] rounded-3xl border border-cyan-500/35 bg-gradient-to-br from-cyan-100/70 via-sky-50/90 to-blue-100/70 p-5 sm:p-6 text-left whitespace-normal will-change-transform cursor-pointer"
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
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;
