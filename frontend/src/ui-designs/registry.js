export const UI_DESIGN_KEY = "adroit-ui-design";
export const PREVIEW_PARAM = "previewUi";
const PREVIEW_KEY = "adroit-ui-preview";

// preview.light / preview.dark are [page, surface, accent].
// preview.sample ("glass" | "raised" | "sketch" | "swiss" | "blueprint" | "brutal" | "futuristic") picks the mini sample drawn in the admin swatch; anything else draws a flat panel.
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
  {
    id: "pencil",
    label: "Pencil Sketch",
    description: "Notebook paper, graphite outlines, and handwritten headings.",
    preview: {
      light: ["#f7f4ec", "#fffdf7", "#476b91"],
      dark: ["#1c1b19", "#262421", "#7ea0c4"],
      sample: "sketch",
    },
    loader: () => import("./pencil/pencil.css"),
  },
  {
    id: "swiss",
    label: "Swiss Editorial",
    description: "Swiss typography, hairline grids, and modern tech-studio restraint.",
    preview: {
      light: ["#f7f7f5", "#ffffff", "#245bdb"],
      dark: ["#111214", "#191b20", "#6d91ff"],
      sample: "swiss",
    },
    loader: () => import("./swiss/swiss.css"),
  },
  {
    id: "blueprint",
    label: "Blueprint Tech",
    description: "Navy engineering grids, cyan CAD outlines, and technical documentation layout.",
    preview: {
      light: ["#f4f8fc", "#ffffff", "#0b7ea8"],
      dark: ["#071b33", "#0d2948", "#42d9f5"],
      sample: "blueprint",
    },
    loader: () => import("./blueprint/blueprint.css"),
  },
  {
    id: "neo-brutalism",
    label: "Neo-Brutalism",
    description: "Thick outlines, hard shadows, and bold color-block layouts.",
    preview: {
      light: ["#f8f5ec", "#ffe44d", "#3155e7"],
      dark: ["#121212", "#1c1c1c", "#ffe44d"],
      sample: "brutal",
    },
    loader: () => import("./neo-brutalism/neo-brutalism.css"),
  },
  {
    id: "futuristic-dark",
    label: "Futuristic Dark",
    description: "Midnight navy, cyan–violet accents, and an immersive AI-lab layout.",
    preview: {
      light: ["#eef2f8", "#ffffff", "#0891b2"],
      dark: ["#05070f", "#0b1220", "#22d3ee"],
      sample: "futuristic",
    },
    loader: () => import("./futuristic-dark/futuristic-dark.css"),
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
