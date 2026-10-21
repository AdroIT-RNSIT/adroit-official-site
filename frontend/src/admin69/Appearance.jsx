import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Palette, RotateCcw } from "lucide-react";
import { call } from "./api";
import { DEFAULT_DESIGN, DESIGNS, getDesign, PREVIEW_PARAM } from "../ui-designs/registry";

const labelOf = (id) => getDesign(id)?.label || id;
const formatDate = (iso) => new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

function sampleStyle(sample, surface, dark) {
  if (sample === "raised") {
    return {
      background: surface,
      boxShadow: dark
        ? "4px 4px 9px rgb(0 0 0 / 0.6), -3px -3px 8px rgb(255 255 255 / 0.07)"
        : "4px 4px 9px rgb(15 23 42 / 0.2), -4px -4px 9px rgb(255 255 255 / 0.95)",
    };
  }
  if (sample === "glass") {
    return {
      background: `color-mix(in srgb, ${surface} 55%, transparent)`,
      border: `1px solid ${dark ? "rgb(255 255 255 / 0.18)" : "rgb(255 255 255 / 0.9)"}`,
      boxShadow: dark
        ? "inset 0 1px 0 rgb(255 255 255 / 0.15), 0 6px 14px rgb(0 0 0 / 0.5)"
        : "inset 0 1px 0 rgb(255 255 255 / 0.9), 0 6px 14px rgb(15 23 42 / 0.14)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    };
  }
  return { background: surface, border: `1px solid ${dark ? "rgb(255 255 255 / 0.12)" : "rgb(15 23 42 / 0.1)"}` };
}

function SwatchHalf({ colors = [], sample, dark }) {
  const [page = dark ? "#000000" : "#ffffff", surface = page, accent = "#38bdf8"] = colors;
  const ink = dark ? "rgb(255 255 255 / 0.75)" : "rgb(15 23 42 / 0.7)";
  return (
    <div className="relative flex h-24 items-center justify-center overflow-hidden p-4" style={{ background: page }}>
      {sample === "glass" && (
        <span
          className="absolute right-3 top-3 h-10 w-10 rounded-full opacity-60 blur-md"
          style={{ background: accent }}
        />
      )}
      <div className="relative w-full rounded-lg p-2.5" style={sampleStyle(sample, surface, dark)}>
        <div className="h-1.5 w-3/4 rounded-full" style={{ background: ink }} />
        <div className="mt-1.5 h-1.5 w-1/2 rounded-full opacity-50" style={{ background: ink }} />
        <div className="mt-2.5 h-3 w-10 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}

function Swatch({ preview = {} }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/10" aria-hidden="true">
      <SwatchHalf colors={preview.light} sample={preview.sample} />
      <SwatchHalf colors={preview.dark} sample={preview.sample} dark />
    </div>
  );
}

export default function Appearance({ active, onExpired, onDirtyChange }) {
  const [live, setLive] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const dirty = Boolean(selected);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const load = useCallback(async () => {
    try {
      const { status, data } = await call("/ui-design");
      if (status === 401) return onExpired();
      if (status !== 200) return setError(data.message || "Couldn't load the live design.");
      setLive(data.design);
      setUpdatedAt(data.updatedAt || null);
      setError("");
    } catch {
      setError("Couldn't reach the server.");
    }
  }, [onExpired]);

  useEffect(() => {
    if (active) load();
  }, [active, load]);

  const choose = (id) => {
    setNotice("");
    setSelected(id === live ? null : id);
  };

  const apply = async (id) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { status, data } = await call("/ui-design", { method: "POST", body: JSON.stringify({ design: id }) });
      if (status === 401) return onExpired();
      if (status !== 200) return setError(data.message || "Couldn't apply the design.");
      setLive(data.design);
      setUpdatedAt(data.updatedAt || null);
      setSelected(null);
      setNotice(`${labelOf(data.design)} is now live.`);
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    if (!window.confirm(`Switch the live site back to ${labelOf(DEFAULT_DESIGN)}, the default design?`)) return;
    apply(DEFAULT_DESIGN);
  };

  const unknownLive = live && !getDesign(live);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b0b0b]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Palette size={22} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-white">Appearance</h2>
            <p className="mt-1 text-sm text-slate-400">
              {!live
                ? "Loading…"
                : updatedAt
                  ? `${labelOf(live)} is live. Last changed ${formatDate(updatedAt)}.`
                  : `${labelOf(live)} is live (the default).`}
            </p>
            <p className="mt-1 text-sm text-slate-500">Changes apply for all visitors within about a minute.</p>
          </div>
        </div>
        <button
          type="button"
          disabled={!live || busy || live === DEFAULT_DESIGN}
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Reset to default
        </button>
      </div>

      {error && (
        <p role="alert" className="border-b border-white/10 px-5 py-3 text-sm text-rose-400 sm:px-6">
          {error}
        </p>
      )}
      <p role="status" className={notice ? "border-b border-white/10 px-5 py-3 text-sm text-emerald-400 sm:px-6" : "sr-only"}>
        {notice}
      </p>
      {unknownLive && (
        <p className="border-b border-white/10 px-5 py-3 text-sm text-amber-300/90 sm:px-6">
          The saved design “{live}” isn't in this build, so visitors see {labelOf(DEFAULT_DESIGN)}. Pick a design and apply it.
        </p>
      )}

      <ul className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3" aria-label="Designs">
        {DESIGNS.map((d) => {
          const isLive = d.id === live;
          const isSelected = d.id === selected;
          const chosen = (selected || live) === d.id;
          return (
            <li
              key={d.id}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-black transition-colors ${
                isSelected ? "border-sky-400 ring-1 ring-sky-400/40" : isLive ? "border-emerald-500/40" : "border-white/10 hover:border-white/20"
              }`}
            >
              <button
                type="button"
                aria-pressed={chosen}
                disabled={!live || busy}
                onClick={() => choose(d.id)}
                className="flex flex-1 flex-col gap-4 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 disabled:cursor-not-allowed"
              >
                <Swatch preview={d.preview} />
                <span className="block">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{d.label}</span>
                    {isLive && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                        Live now
                      </span>
                    )}
                    {isSelected && (
                      <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-300">
                        Selected
                      </span>
                    )}
                  </span>
                  {d.description && <span className="mt-1 block text-sm text-slate-400">{d.description}</span>}
                </span>
              </button>
              <div className="border-t border-white/10 px-4 py-3">
                <a
                  href={`/?${PREVIEW_PARAM}=${encodeURIComponent(d.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Preview ${d.label} in a new tab`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  Preview
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      {dirty && (
        <div
          role="region"
          aria-label="Unapplied design"
          className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-b-2xl border-t border-white/10 bg-[#0b0b0b] px-5 py-4 sm:px-6"
        >
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-white">{labelOf(selected)}</span> is selected but not live yet.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => choose(live)}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
            >
              Discard
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => apply(selected)}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-black hover:bg-sky-400 disabled:opacity-40"
            >
              {busy ? "Applying…" : "Apply"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
