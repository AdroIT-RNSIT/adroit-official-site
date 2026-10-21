// Usage: npm run check:ui [-- --strict]
// Fails when a registered design is incomplete: a missing semantic class, an unscoped rule,
// no dark mode, no reduced-motion block, or a registry/server/index.html mismatch.
// --strict also fails on leftover TODO(ui-design) markers (use it before merging a new pack).
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { HTML_IDS, parseIdList, PATHS, ROOT, SEMANTIC_CLASSES, SERVER_IDS, TODO_MARK } from "./ui-design-contract.mjs";

const strict = process.argv.includes("--strict");
const errors = [];
const warnings = [];
const file = (rel) => path.join(ROOT, rel);

// Returns every style-rule selector (outside @keyframes), ignoring comments and braces inside strings.
function selectorsOf(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors = [];
  const stack = [];
  let start = 0;
  for (let i = 0; i < clean.length; i += 1) {
    const ch = clean[i];
    if (ch === '"' || ch === "'") {
      const end = clean.indexOf(ch, i + 1);
      i = end === -1 ? clean.length : end;
    } else if (ch === ";") start = i + 1;
    else if (ch === "}") {
      stack.pop();
      start = i + 1;
    } else if (ch === "{") {
      const prelude = clean.slice(start, i).trim();
      start = i + 1;
      if (prelude.startsWith("@")) {
        stack.push(/^@(-webkit-)?keyframes/.test(prelude) ? "keyframes" : "at");
      } else {
        if (!stack.includes("keyframes") && !stack.includes("rule")) {
          selectors.push(...splitSelectorList(prelude));
        }
        stack.push("rule");
      }
    }
  }
  return selectors;
}

// Splits on top-level commas only, so :is(a, b) stays whole.
function splitSelectorList(list) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i += 1) {
    if (list[i] === "(") depth += 1;
    else if (list[i] === ")") depth -= 1;
    else if (list[i] === "," && depth === 0) {
      parts.push(list.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(list.slice(start));
  return parts.map((s) => s.trim().replace(/\s+/g, " ")).filter(Boolean);
}

// A selector may wrap its scope in :where()/:is() to keep specificity low.
const scopeOf = (id) => new RegExp(`^(?::(?:where|is)\\()?html\\[data-ui=(['"])${id}\\1\\]`);
const hasClass = (selector, name) => new RegExp(`\\.${name}(?![\\w-])`).test(selector);

const { DESIGNS, DEFAULT_DESIGN } = await import(pathToFileURL(file(PATHS.registry)).href);
const ids = DESIGNS.map((d) => d.id);

if (new Set(ids).size !== ids.length) errors.push(`registry.js: duplicate design ids (${ids.join(", ")}).`);
if (!ids.includes(DEFAULT_DESIGN)) errors.push(`registry.js: DEFAULT_DESIGN "${DEFAULT_DESIGN}" isn't registered.`);

for (const [rel, pattern, what] of [
  [PATHS.server, SERVER_IDS, "server allowlist (UI_DESIGN_IDS)"],
  [PATHS.indexHtml, HTML_IDS, "first-paint list (var designs)"],
]) {
  const listed = parseIdList(await readFile(file(rel), "utf8"), pattern);
  if (!listed) {
    errors.push(`${rel}: couldn't find the ${what}.`);
    continue;
  }
  const missing = ids.filter((id) => !listed.includes(id));
  const extra = listed.filter((id) => !ids.includes(id));
  if (missing.length) errors.push(`${rel}: ${what} is missing ${missing.join(", ")}.`);
  if (extra.length) errors.push(`${rel}: ${what} lists ${extra.join(", ")}, which registry.js doesn't have.`);
}

for (const design of DESIGNS) {
  const { id } = design;
  const where = `design "${id}"`;

  if (!design.label) errors.push(`${where}: no label.`);
  for (const mode of ["light", "dark"]) {
    const colours = design.preview?.[mode];
    if (!Array.isArray(colours) || colours.length !== 3 || !colours.every((c) => /^#[0-9a-f]{3,8}$/i.test(c))) {
      errors.push(`${where}: preview.${mode} must be three hex colours [page, surface, accent].`);
    }
  }
  if (`${design.description}`.includes(TODO_MARK) || JSON.stringify(design.preview).includes(TODO_MARK)) {
    (strict ? errors : warnings).push(`${where}: registry entry still has placeholder text.`);
  }

  const cssImport = design.loader?.toString().match(/import\(\s*["'](.+?)["']\s*\)/)?.[1];
  if (!cssImport) {
    errors.push(`${where}: loader must be () => import("./${id}/${id}.css").`);
    continue;
  }
  const cssRel = path.posix.join(PATHS.designs, cssImport);
  if (!existsSync(file(cssRel))) {
    errors.push(`${where}: ${cssRel} doesn't exist.`);
    continue;
  }

  const css = await readFile(file(cssRel), "utf8");
  const selectors = selectorsOf(css);
  const scope = scopeOf(id);

  const unscoped = selectors.filter((s) => !scope.test(s));
  for (const s of unscoped.slice(0, 5)) errors.push(`${cssRel}: unscoped selector "${s}". Start it with html[data-ui='${id}'].`);
  if (unscoped.length > 5) errors.push(`${cssRel}: ${unscoped.length - 5} more unscoped selectors.`);

  const missing = SEMANTIC_CLASSES.map((c) => c.name).filter(
    (name) => !selectors.some((s) => scope.test(s) && hasClass(s, name)),
  );
  if (missing.length) errors.push(`${cssRel}: no rule for ${missing.map((n) => `.${n}`).join(", ")}.`);

  if (!selectors.some((s) => new RegExp(`${scope.source}\\.dark\\b`).test(s))) {
    errors.push(`${cssRel}: no dark-mode rule (html[data-ui='${id}'].dark …).`);
  }
  if (!/@media[^{]*prefers-reduced-motion/.test(css)) {
    errors.push(`${cssRel}: no @media (prefers-reduced-motion: reduce) block.`);
  }
  if (/backdrop-filter:\s*(?!none\b)\S/.test(css) && !/@media[^{]*prefers-reduced-transparency/.test(css)) {
    errors.push(`${cssRel}: uses backdrop-filter but has no @media (prefers-reduced-transparency: reduce) block.`);
  }

  const todos = css.split(TODO_MARK).length - 1;
  if (todos) (strict ? errors : warnings).push(`${cssRel}: ${todos} ${TODO_MARK} marker${todos === 1 ? "" : "s"} left.`);
}

for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  error ${e}`);

if (errors.length) {
  console.error(`\n  check:ui failed with ${errors.length} error${errors.length === 1 ? "" : "s"}. See docs/ADDING_A_UI_DESIGN.md.\n`);
  process.exit(1);
}
console.log(`  check:ui ok: ${ids.join(", ")}${warnings.length ? ` (${warnings.length} warning${warnings.length === 1 ? "" : "s"})` : ""}`);
