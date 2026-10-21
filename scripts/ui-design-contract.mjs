// Shared by new-ui-design.mjs and check-ui-designs.mjs. docs/ADDING_A_UI_DESIGN.md describes the same contract.
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));

export const PATHS = {
  designs: "frontend/src/ui-designs",
  registry: "frontend/src/ui-designs/registry.js",
  server: "api/_lib/ui-design.js",
  indexHtml: "frontend/index.html",
};

// Every pack must style each of these under html[data-ui='<id>'].
export const SEMANTIC_CLASSES = [
  {
    name: "ui-card",
    role: "Main content panel: event cards, content blocks, the Contact compose window, member cards.",
    states: [],
  },
  {
    name: "ui-well",
    role: "Recessed area inside a card: stat boxes, date and venue chips, form wells, list rows.",
    states: [],
  },
  {
    name: "ui-solid",
    role: "Primary action button. Highest contrast on the page, at least 40px tall and wide.",
    states: [":hover", ":active", ":disabled"],
  },
  {
    name: "ui-pill",
    role: "Pick-one-of-N buttons and secondary buttons. Selected state comes from aria-pressed or aria-selected.",
    states: [":hover", "[aria-pressed='true']", "[aria-selected='true']"],
  },
  {
    name: "ui-input",
    role: "Text inputs, selects and textareas. Readable placeholder and a clear focus ring.",
    states: ["::placeholder", ":focus-visible"],
  },
  {
    name: "ui-track",
    role: "Segmented-control container. Holds the option buttons and one ui-thumb.",
    states: [" > button"],
  },
  {
    name: "ui-thumb",
    role: "Sliding indicator inside ui-track. JS sets transform, width and height; animate only those.",
    states: [],
  },
  {
    name: "ui-switch",
    role: "On/off toggle (the theme switch). role=switch with aria-checked.",
    states: ["[aria-checked='true']"],
  },
  {
    name: "ui-chip",
    role: "Small badge or status label, and compact filter chips (aria-pressed).",
    states: ["[aria-pressed='true']"],
  },
  {
    name: "ui-tooltip",
    role: "Small floating hint. Must stay readable over any content.",
    states: [],
  },
  {
    name: "ui-dialog",
    role: "Modal panel, inspector or bottom sheet. Opaque enough to read over the page.",
    states: [],
  },
  {
    name: "ui-nav",
    role: "Bars that hold navigation or filters (sticky filter bars). Direct child links may carry aria-current.",
    states: [" > a[aria-current='page']"],
  },
  {
    name: "ui-heading",
    role: "Headings. Stay black and white (ink colour), no gradients.",
    states: [],
  },
];

// Tokens a pack may set. Anything else a pack needs goes in its own --<id>-* variables.
export const PACK_TOKENS = [
  "--color-page",
  "--color-surface",
  "--color-ink",
  "--color-ink-muted",
  "--color-ink-subtle",
  "--color-line",
  "--color-line-strong",
  "--color-primary",
  "--color-primary-ink",
  "--color-on-primary",
  "--grid-line",
  "--grid-cell",
  "--grid-cell-edge",
];

export const TODO_MARK = "TODO(ui-design)";

export const ID_PATTERN = /^[a-z][a-z0-9-]{1,23}$/;

// Matches `const UI_DESIGN_IDS = ["glass", "neu"];` in the server and `var designs = [...]` in index.html.
export const SERVER_IDS = /const UI_DESIGN_IDS = \[([^\]]*)\];/;
export const HTML_IDS = /var designs = \[([^\]]*)\];/;

export function parseIdList(source, pattern) {
  const match = source.match(pattern);
  if (!match) return null;
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

export function formatIdList(ids) {
  return ids.map((id) => JSON.stringify(id)).join(", ");
}
