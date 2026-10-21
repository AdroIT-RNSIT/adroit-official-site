import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DESIGNS, getDesign, isValidDesign, loadDesignCss } from "../../ui-designs/registry";
import { useUiDesign } from "../../ui-designs/useUiDesign";

const DOMAINS = [
  { name: "Machine Learning", color: "#22d3ee" },
  { name: "Cloud", color: "#c084fc" },
  { name: "Cyber", color: "#f472b6" },
  { name: "Data Analytics", color: "#34d399" },
  { name: "Non-Tech", color: "#fbbf24" },
];

function TrackDemo() {
  const trackRef = useRef(null);
  const [key, setKey] = useState("one");
  const [pose, setPose] = useState(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const measure = () => {
      const button = track.querySelector(`[data-key="${key}"]`);
      if (!button) return;
      const trackRect = track.getBoundingClientRect();
      const rect = button.getBoundingClientRect();
      setPose({
        x: rect.left - trackRect.left + track.scrollLeft,
        y: rect.top - trackRect.top + track.scrollTop,
        w: rect.width,
        h: rect.height,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [key]);

  return (
    <div ref={trackRef} className="ui-track" role="group" aria-label="Pick one">
      {pose && (
        <span
          className="ui-thumb"
          aria-hidden="true"
          style={{
            width: pose.w,
            height: pose.h,
            transform: `translate(${pose.x}px, ${pose.y}px)`,
          }}
        />
      )}
      {[
        ["one", "One"],
        ["two", "Two"],
        ["three", "Three"],
      ].map(([id, label]) => (
        <button key={id} type="button" data-key={id} aria-pressed={key === id} onClick={() => setKey(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function SwitchDemo({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      className="ui-switch"
      role="switch"
      aria-checked={on}
      aria-label={on ? "On" : "Off"}
      onClick={() => setOn((value) => !value)}
    />
  );
}

function Specimen({ label, children }) {
  return (
    <section className="grid gap-2">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">{label}</p>
      {children}
    </section>
  );
}

function Samples() {
  return (
    <div className="grid gap-6">
      <Specimen label="Heading">
        <h2 className="ui-heading text-2xl">Black and white heading</h2>
        <p className="text-sm text-ink-muted">Body copy stays readable against the page.</p>
      </Specimen>

      <Specimen label="Card">
        <div className="ui-card p-5">
          <p className="text-sm text-ink">A raised panel moulded from the page.</p>
        </div>
      </Specimen>

      <Specimen label="Well">
        <div className="ui-well px-4 py-3 text-sm text-ink">Recessed stat or form field</div>
      </Specimen>

      <Specimen label="Solid button">
        <button type="button" className="ui-solid w-fit">
          Primary key
        </button>
      </Specimen>

      <Specimen label="Pills and chips">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="ui-pill" aria-pressed="false">
            Pill
          </button>
          <button type="button" className="ui-pill" aria-pressed="true">
            Selected
          </button>
          <button type="button" className="ui-chip" aria-pressed="false">
            Chip
          </button>
          <button type="button" className="ui-chip" aria-pressed="true">
            Pressed
          </button>
        </div>
      </Specimen>

      <Specimen label="Input">
        <label className="grid gap-2 text-sm text-ink">
          Name
          <input className="ui-input" placeholder="Your name" />
        </label>
      </Specimen>

      <Specimen label="Track and thumb">
        <TrackDemo />
      </Specimen>

      <Specimen label="Switch">
        <div className="flex items-center gap-4">
          <SwitchDemo />
          <SwitchDemo defaultOn />
        </div>
      </Specimen>

      <Specimen label="Nav">
        <nav className="ui-nav" aria-label="Sample">
          <a href="#kit" aria-current="page">
            Home
          </a>
          <a href="#kit">Events</a>
          <a href="#kit">Domains</a>
        </nav>
      </Specimen>

      <Specimen label="Tooltip and dialog">
        <div className="flex flex-wrap gap-3">
          <div className="ui-tooltip px-3 py-2 text-sm" role="tooltip">
            Raised tooltip
          </div>
          <div className="ui-dialog max-w-xs p-4" role="dialog" aria-label="Sample dialog">
            <p className="text-sm text-ink">Raised dialog, no blur.</p>
          </div>
        </div>
      </Specimen>

      <Specimen label="Domain lights">
        <ul className="flex flex-wrap gap-3">
          {DOMAINS.map((domain) => (
            <li key={domain.name} className="inline-flex items-center gap-2 text-sm text-ink">
              <i className="ui-led" style={{ background: domain.color, color: domain.color }} aria-hidden="true" />
              {domain.name}
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen label="Scrollbar">
        <div className="ui-well h-24 overflow-auto px-3 py-2 text-sm text-ink">
          {Array.from({ length: 8 }, (_, index) => (
            <p key={index}>Inset track, raised thumb, line {index + 1}.</p>
          ))}
        </div>
      </Specimen>
    </div>
  );
}

export default function UiKit() {
  const { design } = useUiDesign();
  const [params, setParams] = useSearchParams();
  const shown = isValidDesign(params.get("ui")) ? params.get("ui") : design;
  const designRef = useRef(design);

  useEffect(() => {
    designRef.current = design;
  }, [design]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.uiLock = "1";
    return () => {
      delete root.dataset.uiLock;
      root.dataset.ui = designRef.current;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadDesignCss(shown).then(() => {
      if (!cancelled) document.documentElement.dataset.ui = shown;
    });
    return () => {
      cancelled = true;
    };
  }, [shown]);

  const label = getDesign(shown)?.label ?? shown;

  return (
    <main id="kit" className="mx-auto grid max-w-6xl gap-8 px-4 py-8">
      <header className="grid gap-4">
        <div className="grid gap-2">
          <h1 className="ui-heading text-3xl">UI kit</h1>
          <p className="max-w-2xl text-sm text-ink-muted" aria-live="polite">
            {label} in light and dark. The live design is {getDesign(design)?.label ?? design}. Pick a design below
            or open /dev/ui-kit?ui=&lt;id&gt;. Packs that don't style .ui-kit-light follow the page theme in the left
            column.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Design">
          {DESIGNS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="ui-pill min-h-10"
              aria-pressed={entry.id === shown}
              onClick={() => setParams({ ui: entry.id }, { replace: true })}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="ui-kit-light rounded-3xl bg-page p-5 text-ink" aria-label="Light mode">
          <h2 className="ui-heading mb-5 text-xl">Light</h2>
          <Samples />
        </section>
        <section className="ui-kit-dark rounded-3xl bg-page p-5 text-ink" data-scheme="dark" aria-label="Dark mode">
          <h2 className="ui-heading mb-5 text-xl">Dark</h2>
          <Samples />
        </section>
      </div>
    </main>
  );
}
