// Usage: npm run new:ui -- <id> "<Label>"
// Scaffolds a theme pack, registers it, and allows it on the server. See docs/ADDING_A_UI_DESIGN.md.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  formatIdList,
  HTML_IDS,
  ID_PATTERN,
  PACK_TOKENS,
  parseIdList,
  PATHS,
  ROOT,
  SEMANTIC_CLASSES,
  SERVER_IDS,
  TODO_MARK,
} from "./ui-design-contract.mjs";

// Flat, token-only starters so a fresh pack shows selection and keeps track labels above the thumb.
const STARTERS = {
  "ui-solid:active": "transform: translateY(1px);",
  "ui-solid:disabled": "opacity: 0.5;\n    cursor: not-allowed;",
  "ui-pill:hover": "background: color-mix(in srgb, var(--color-ink) 6%, transparent);",
  "ui-pill[aria-pressed='true']": "background: var(--color-ink);\n    color: var(--color-page);",
  "ui-pill[aria-selected='true']": "background: var(--color-ink);\n    color: var(--color-page);",
  "ui-input::placeholder": "color: var(--color-ink-muted);",
  "ui-track > button": "position: relative;\n    z-index: 1;",
  "ui-switch[aria-checked='true']": "background: color-mix(in srgb, var(--color-primary) 25%, transparent);",
  "ui-chip[aria-pressed='true']": "background: var(--color-ink);\n    color: var(--color-page);",
  "ui-nav > a[aria-current='page']": "color: var(--color-primary);\n    font-weight: 600;",
};

function fail(message) {
  console.error(`\n  new:ui: ${message}\n`);
  console.error('  Usage: npm run new:ui -- <id> "<Label>"   e.g. npm run new:ui -- aurora "Aurora"\n');
  process.exit(1);
}

const [id, ...labelParts] = process.argv.slice(2);
const label = labelParts.join(" ").trim();

if (!id) fail("missing the design id.");
if (!ID_PATTERN.test(id)) fail(`"${id}" is not a valid id. Use 2-24 lowercase letters, digits or dashes, starting with a letter.`);
if (!label) fail("missing the label shown in the admin Appearance tab.");

const file = (rel) => path.join(ROOT, rel);
const cssRel = `${PATHS.designs}/${id}/${id}.css`;

const [registry, server, indexHtml] = await Promise.all([
  readFile(file(PATHS.registry), "utf8"),
  readFile(file(PATHS.server), "utf8"),
  readFile(file(PATHS.indexHtml), "utf8"),
]);

if (existsSync(file(`${PATHS.designs}/${id}`))) fail(`${PATHS.designs}/${id}/ already exists.`);
if (new RegExp(`id:\\s*["']${id}["']`).test(registry)) fail(`"${id}" is already in registry.js.`);

const serverIds = parseIdList(server, SERVER_IDS);
const htmlIds = parseIdList(indexHtml, HTML_IDS);
if (!serverIds) fail(`couldn't find UI_DESIGN_IDS in ${PATHS.server}.`);
if (!htmlIds) fail(`couldn't find the designs list in ${PATHS.indexHtml}.`);

const listStart = registry.indexOf("export const DESIGNS = [");
const listEnd = listStart === -1 ? -1 : registry.indexOf("\n];", listStart);
if (listEnd === -1) fail("couldn't find the end of the DESIGNS array in registry.js.");

const entry = `  {
    id: ${JSON.stringify(id)},
    label: ${JSON.stringify(label)},
    description: "${TODO_MARK}: one line shown in the admin Appearance tab.",
    preview: {
      // ${TODO_MARK}: [page, surface, accent] for each mode, and sample: "glass" | "raised" (or leave it out for flat).
      light: ["#ffffff", "#ffffff", "#0369a1"],
      dark: ["#000000", "#111111", "#38bdf8"],
    },
    loader: () => import("./${id}/${id}.css"),
  },`;

const nextRegistry = `${registry.slice(0, listEnd)}\n${entry}${registry.slice(listEnd)}`;
const nextServer = serverIds.includes(id)
  ? server
  : server.replace(SERVER_IDS, `const UI_DESIGN_IDS = [${formatIdList([...serverIds, id])}];`);
const nextHtml = htmlIds.includes(id)
  ? indexHtml
  : indexHtml.replace(HTML_IDS, `var designs = [${formatIdList([...htmlIds, id])}];`);
const css = packCss(id, label);

await mkdir(file(`${PATHS.designs}/${id}`), { recursive: true });
await writeFile(file(cssRel), css);
await writeFile(file(PATHS.registry), nextRegistry);
await writeFile(file(PATHS.server), nextServer);
await writeFile(file(PATHS.indexHtml), nextHtml);

const width = Math.max(cssRel.length, PATHS.registry.length, PATHS.server.length, PATHS.indexHtml.length) + 2;
console.log(`
  Created the "${label}" design (${id}).

    + ${cssRel.padEnd(width)}(new pack)
    ~ ${PATHS.registry.padEnd(width)}(registry entry)
    ~ ${PATHS.server.padEnd(width)}(server allowlist)
    ~ ${PATHS.indexHtml.padEnd(width)}(first-paint list)

  Remaining manual steps:
    1. Fill in every ${TODO_MARK} in ${cssRel}, light and dark.
       Start with the tokens, then the 13 semantic classes.
    2. Replace the placeholder description and preview colours in registry.js.
       If the page colour is not white / black, add first-paint colours for
       html[data-ui="${id}"] (light and .dark) to the <style> in index.html.
    3. Style the shell (navbar, menu, footer, dock, theme switch) and page hooks;
       copy the selector list from neu/neu.css as a checklist.
    4. npm run dev, then open /dev/ui-kit?ui=${id}, and /?previewUi=${id} (sign in to /dashboard/admin69 first)
       in light and dark, at 375px and 1280px.
    5. npm run check:ui -- --strict   (fails while TODOs remain)
    6. npm run build in frontend/, then follow the pre-merge checklist in
       docs/ADDING_A_UI_DESIGN.md. Admins can then pick it in /dashboard/admin69 > Appearance.
`);

function packCss(packId, packLabel) {
  const scope = `html[data-ui='${packId}']`;
  const darkScopes = (sel) =>
    [`${scope}.dark ${sel}`, `${scope} .ui-kit-dark ${sel}`, `${scope} [data-scheme='dark'] ${sel}`].join(",\n  ");
  const tokenLines = (mode) =>
    [
      `/* ${TODO_MARK}: ${mode} tokens. Unset tokens fall back to index.css.`,
      "   Keep --color-primary in the sky-blue brand family; --grid-* colour the InteractiveGrid canvas. */",
      ...PACK_TOKENS.map((token) => `/* ${token}: ; */`),
    ]
      .map((line) => `  ${line}`)
      .join("\n");

  const classBlocks = SEMANTIC_CLASSES.map(({ name, role, states }) => {
    const sel = `.${name}`;
    const stateRules = states
      .map((state) => {
        const starter = STARTERS[`${name}${state}`];
        const body = starter
          ? `/* ${TODO_MARK}: ${state.trim()} (flat starter, replace with this design's look) */\n    ${starter}`
          : `/* ${TODO_MARK}: ${state.trim()} */`;
        return `
  ${scope} ${sel}${state} {
    ${body}
  }`;
      })
      .join("");
    return `
  /* ----- ${name} -----
     ${role} */
  ${scope} ${sel} {
    /* ${TODO_MARK}: light look */
  }
  ${darkScopes(sel)} {
    /* ${TODO_MARK}: dark look */
  }${stateRules}`;
  }).join("\n");

  return `/* ${packLabel}. Every rule is scoped to ${scope}.
   Generated by \`npm run new:ui\`. Replace every ${TODO_MARK} stub, then run
   \`npm run check:ui -- --strict\`. Contract and checklist: docs/ADDING_A_UI_DESIGN.md.

   Light rules use ${scope} <selector>.
   Dark rules also match .dark on <html>, the /dev/ui-kit dark column (.ui-kit-dark),
   and regions that are always dark ([data-scheme='dark']).
   Until a stub is filled in, base.css draws a flat, readable fallback. */

/* ===== 1. Tokens ===== */
${scope},
${scope} .ui-kit-light {
${tokenLines("light")}
}

${scope}.dark,
${scope} .ui-kit-dark {
${tokenLines("dark")}
}

/* ===== 2. Semantic classes =====
   In the components layer, like base.css: this pack beats the fallbacks,
   and Tailwind utilities in the markup still win for spacing and position. */
@layer components {${classBlocks}

  /* ----- Focus: every interactive class keeps a visible ring ----- */
  ${scope} .ui-solid:focus-visible,
  ${scope} .ui-pill:focus-visible,
  ${scope} .ui-chip:focus-visible,
  ${scope} .ui-input:focus-visible,
  ${scope} .ui-switch:focus-visible,
  ${scope} .ui-track > button:focus-visible,
  ${scope} .ui-nav > a:focus-visible {
    /* ${TODO_MARK}: focus ring, e.g. outline: 2px solid var(--color-primary); outline-offset: 2px; */
  }
}

/* ===== 3. Shell and page hooks =====
   ${TODO_MARK}: the navbar, mobile menu, footer, social rail and dock, theme switch and splash
   are styled through [data-shell='nav' | 'menu' | 'footer' | 'rail' | 'dock' | 'theme' | 'scrim' | 'splash'],
   and page details through [data-part='…'] and [data-page='…']. neu/neu.css lists every hook. */

/* ===== 4. User preferences ===== */
@media (prefers-reduced-motion: reduce) {
  ${scope} .ui-thumb,
  ${scope} .ui-pill,
  ${scope} .ui-solid,
  ${scope} .ui-switch {
    /* ${TODO_MARK}: drop any extra motion this pack adds */
    transition: none;
    animation: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  ${scope} .ui-card,
  ${scope} .ui-nav,
  ${scope} .ui-dialog,
  ${scope} .ui-tooltip {
    /* ${TODO_MARK}: solid surfaces only, no blur or see-through fills */
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
`;
}
