const GALLERY_SIZES = [
  "w-[13.5rem] sm:w-[17rem] aspect-[16/10]",
  "w-[11rem] sm:w-[13.5rem] aspect-square",
  "w-[16rem] sm:w-[21rem] aspect-[5/3]",
  "w-[10.5rem] sm:w-[13rem] aspect-[4/5]",
  "w-[14.5rem] sm:w-[18.5rem] aspect-[4/3]",
];

function fillMarqueeTrack(images, period = GALLERY_SIZES.length) {
  if (!images.length) return [];
  const base = [...images];
  const min = Math.max(period * 2, 8);
  while (base.length < min || base.length % period !== 0) {
    base.push(images[base.length % images.length]);
  }
  return [...base, ...base];
}

export default function GlimpseGallery({ images, onSelect, hint = "Hover to pause · Click to open" }) {
  const unique = [...new Set(images.filter(Boolean))];
  if (unique.length === 0) return null;

  const rowB = unique.length > 1 ? [...unique.slice(1), unique[0]] : unique;
  const trackA = fillMarqueeTrack(unique);
  const trackB = fillMarqueeTrack(rowB);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
          Glimpses
        </h2>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>

      <div className="glimpse-gallery relative mt-5 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950/[0.03] py-4 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.03] sm:py-5">
        <div className="glimpse-gallery-track space-y-3 sm:space-y-4">
          <MarqueeRow
            track={trackA}
            originals={unique}
            onSelect={onSelect}
            className="animate-marquee"
          />
          {unique.length > 1 && (
            <MarqueeRow
              track={trackB}
              originals={unique}
              onSelect={onSelect}
              className="animate-marquee-reverse animate-marquee-slow"
              sizeOffset={2}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({ track, originals, onSelect, className, sizeOffset = 0 }) {
  return (
    <div className={`flex w-max gap-3 px-3 sm:gap-4 ${className}`}>
      {track.map((src, idx) => (
        <button
          key={`${src}-${idx}`}
          type="button"
          onClick={() => onSelect?.(originals.indexOf(src))}
          className={`group relative shrink-0 overflow-hidden rounded-2xl border border-white/40 bg-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.12)] dark:border-white/10 ${GALLERY_SIZES[(idx + sizeOffset) % GALLERY_SIZES.length]}`}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-40" />
        </button>
      ))}
    </div>
  );
}
