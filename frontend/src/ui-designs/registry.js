export const UI_DESIGN_KEY = "adroit-ui-design";
export const PREVIEW_PARAM = "previewUi";
const PREVIEW_KEY = "adroit-ui-preview";

// preview.light / preview.dark are [page, surface, accent].
// preview.sample ("glass" | "raised") picks the mini sample drawn in the admin swatch; anything else draws a flat panel.
export const DESIGNS = [
  {
    id: "glass",
    label: "Liquid Glass",
    description: "Translucent panels, a bright rim, and a sliding liquid pill.",
    preview: {
      light: ["#ffffff", "#ffffff", "#0369a1"],
      dark: ["#000000", "#111111", "#38bdf8"],
      sample: "glass",
    },
    loader: () => import("./glass/glass.css"),
  },
  {
    id: "neu",
    label: "Soft Tactile",
    description: "Soft moulded surfaces, raised knobs, and recessed grooves.",
    preview: {
      light: ["#e3e8ef", "#e3e8ef", "#0369a1"],
      dark: ["#1b1e25", "#1b1e25", "#38bdf8"],
      sample: "raised",
    },
    loader: () => import("./neu/neu.css"),
  },
];

export const DEFAULT_DESIGN = "glass";

const ids = new Set(DESIGNS.map((design) => design.id));

export function isValidDesign(id) {
  return typeof id === "string" && ids.has(id);
}

export function readStoredDesign() {
  try {
    const stored = localStorage.getItem(UI_DESIGN_KEY);
    if (isValidDesign(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_DESIGN;
}

export function getDesign(id) {
  return DESIGNS.find((design) => design.id === id) || null;
}

// A ?previewUi=<id> link previews a design in this tab only, and only for a signed-in admin.
// It is kept in sessionStorage and never saved as the visitor's design.
export function readPreviewRequest() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has(PREVIEW_PARAM)) {
      const id = params.get(PREVIEW_PARAM);
      params.delete(PREVIEW_PARAM);
      const query = params.toString();
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      );
      sessionStorage.removeItem(PREVIEW_KEY);
      return isValidDesign(id) ? id : null;
    }
    return readPreviewDesign();
  } catch {
    return null;
  }
}

export function readPreviewDesign() {
  try {
    const stored = sessionStorage.getItem(PREVIEW_KEY);
    return isValidDesign(stored) ? stored : null;
  } catch {
    return null;
  }
}

export async function confirmPreviewDesign(id) {
  if (!isValidDesign(id)) return null;
  try {
    const res = await fetch("/api/admin69/session", { cache: "no-store", credentials: "same-origin" });
    if (!res.ok) throw new Error("not an admin");
    sessionStorage.setItem(PREVIEW_KEY, id);
    return id;
  } catch {
    clearPreviewDesign();
    return null;
  }
}

export function clearPreviewDesign() {
  try {
    sessionStorage.removeItem(PREVIEW_KEY);
  } catch {
    /* ignore */
  }
}

const pending = new Map();

export function loadDesignCss(id) {
  const design = getDesign(id);
  if (!design) return Promise.resolve();
  if (!pending.has(id)) pending.set(id, Promise.resolve(design.loader()));
  return pending.get(id);
}
