# Adding a UI design

The public site can wear several **UI designs** (Liquid Glass, Soft Tactile, …). Pages never style
themselves: they use a small set of semantic classes and colour tokens, and the active **theme pack**
decides what those look like. Adding a design means writing one CSS file. No page code changes.

How the system fits together is in [UI-DESIGN.md](./UI-DESIGN.md), section 3.

---

## 1. Quick start

From `adroit-official-site/`:

```bash
npm run new:ui -- aurora "Aurora"
```

This:

- creates `frontend/src/ui-designs/aurora/aurora.css`, with a stub for every semantic class in light and dark, marked `TODO(ui-design)`;
- adds an entry to `DESIGNS` in `frontend/src/ui-designs/registry.js`, with a placeholder description, placeholder preview colours and a lazy `loader`;
- adds the id to the server allowlist (`UI_DESIGN_IDS` in `api/_lib/ui-design.js`);
- adds the id to the first-paint list (`var designs` in `frontend/index.html`);
- prints the remaining manual steps.

The new design builds straight away and appears in **Admin69 → Appearance**. Until you fill it in, it
renders with the flat fallbacks from `base.css`, plus starter values for the selected states. Ids are
2–24 characters: lowercase letters, digits and dashes, starting with a letter.

Then:

1. Fill in the tokens (section 3), then each semantic class (section 2), light and dark.
2. Replace the description and the `preview` colours in `registry.js`. `preview.light` and
   `preview.dark` are `[page, surface, accent]`. Set `preview.sample` to `"glass"` or `"raised"` if
   the admin swatch should draw that kind of mini card; leave it out for flat.
   If the design's page colour isn't plain white (light) and black (dark), add matching
   `html[data-ui="<id>"]` and `html[data-ui="<id>"].dark` background and text colours to the
   `<style>` in `frontend/index.html`, so the first paint and overscroll match the design.
3. Style the shell and page hooks (section 4).
4. Test it (section 6), run `npm run check:ui -- --strict`, and go through the checklist (section 7).

To undo a scaffold, delete the pack folder and remove the id from the three lists above.

---

## 2. Semantic classes

Every pack must style all 13 classes, scoped to `html[data-ui='<id>']`, in both light and dark mode.
`npm run check:ui` fails if one is missing.

| Class | What it is | What it should look like |
|---|---|---|
| `ui-card` | Main content panel: event cards, content blocks, the Contact compose window, member cards | The design's signature surface. Clearly separated from the page; text on it meets contrast. |
| `ui-well` | Recessed area inside a card: stat boxes, date and venue chips, form wells, list rows | Reads as sunk into, or quieter than, the card around it. |
| `ui-solid` | Primary action button | The highest-contrast element on the page; ink-on-page colours by default. At least 40 × 40px. Needs `:hover`, `:active` and `:disabled`. |
| `ui-pill` | Pick-one-of-N buttons and secondary buttons | Rounded. The selected state (`aria-pressed="true"` or `aria-selected="true"`) must be obvious without colour alone, e.g. inset, filled or outlined. |
| `ui-input` | Text inputs, selects, textareas | Looks editable. Placeholder is readable (muted ink); `:focus-visible` shows a clear ring. |
| `ui-track` | Segmented-control container that holds option buttons and one `ui-thumb` | A groove or tray. Its `> button` children must sit above the thumb (`position: relative; z-index: 1`). |
| `ui-thumb` | Sliding indicator inside `ui-track` | A knob or highlight. JavaScript sets `transform`, `width` and `height`; only animate those. |
| `ui-switch` | The on/off toggle (theme switch), `role="switch"` with `aria-checked` | Off and on are clearly different. `base.css` already swaps the sun and moon glyphs. |
| `ui-chip` | Small badges and status labels, and compact filter chips | Smaller and quieter than a pill. Pressed chips (`aria-pressed="true"`) look selected. |
| `ui-tooltip` | Small floating hint | Readable over any content, so solid or nearly solid. |
| `ui-dialog` | Modals, inspectors, bottom sheets | Opaque enough to read over the page, and above everything else visually. |
| `ui-nav` | Bars that hold navigation or filters, including sticky filter bars | Calm and readable over scrolling content. A direct-child link with `aria-current="page"` is highlighted. |
| `ui-heading` | Headings | Ink colour only: black in light mode, white in dark. No gradients or tints. |

`ui-led` (the small coloured dots in `/dev/ui-kit` and on Soft Tactile) is optional.

### Selectors to use

```css
@layer components {
  html[data-ui='aurora'] .ui-card { /* light */ }

  html[data-ui='aurora'].dark .ui-card,
  html[data-ui='aurora'] .ui-kit-dark .ui-card,
  html[data-ui='aurora'] [data-scheme='dark'] .ui-card { /* dark */ }
}
```

- `.dark` on `<html>` is the visitor's theme (`lib/theme.jsx`).
- `[data-scheme='dark']` marks regions that are dark in every theme (the Home terminal, event posters, the Paradox hero, the image lightbox). Dark rules must cover it too.
- `.ui-kit-light` and `.ui-kit-dark` are the two columns of `/dev/ui-kit`. Supporting them is optional but lets you see both modes side by side.
- Put class rules inside `@layer components`, like `base.css`. That beats the fallbacks and still lets Tailwind utilities in the markup control spacing and position. Shell and page hooks may stay unlayered when they need to win over utilities.
- A selector may wrap its scope in `:where()` to keep specificity low, e.g. `:where(html[data-ui='aurora'] [data-shell='footer']) .ui-pill`.

---

## 3. Token contract

Tokens are CSS variables defined in `frontend/src/index.css` (`@theme static`, with an `html.dark`
block). Tailwind turns them into utilities such as `bg-page` and `text-ink`, so pages pick up whatever
the pack sets. Set them on `html[data-ui='<id>']` for light and on `html[data-ui='<id>'].dark` for dark
(and on `.ui-kit-light` and `.ui-kit-dark` if you support the kit). Unset tokens keep the defaults.

**A pack may set:**

| Variable | Meaning |
|---|---|
| `--color-page` | Page background |
| `--color-surface` | Raised surfaces |
| `--color-ink` | Main text, solid buttons |
| `--color-ink-muted`, `--color-ink-subtle` | Secondary text, labels, placeholders |
| `--color-line`, `--color-line-strong` | Dividers and borders |
| `--color-primary`, `--color-primary-ink` | Brand accent (links, eyebrows, focus rings). Keep it in the sky-blue family. |
| `--color-on-primary` | Text on a primary fill |
| `--grid-line`, `--grid-cell`, `--grid-cell-edge` | The InteractiveGrid canvas behind Home |
| `--splash-bg`, `--splash-track`, `--splash-accent` | The intro splash; set them on `html[data-ui='<id>'] [data-shell='splash']` |
| `--<id>-*` | Anything private to the pack (glass uses `--lg-*`, Soft Tactile uses `--neu-*`) |

**A pack must not change:**

- `--color-secondary`, `--color-success`, `--color-warning`, `--color-danger`, `--color-on-accent`. Status colours mean the same thing in every design.
- The domain accents: ML `#22d3ee`, Cloud `#c084fc`, Cyber `#f472b6`, Data Analytics `#34d399`, Non-Tech `#fbbf24`.
- `--nav-height`. Layout depends on it.
- Another pack's variables, or anything outside `html[data-ui='<id>']`.

Check contrast for every pair you set: ink on page and on surface, ink-muted on both, and on-primary on
primary. Aim for WCAG AA (4.5:1 for body text).

---

## 4. Shell and page hooks

The semantic classes cover most of the site. A few places expose hooks for finer control:

- `[data-shell='nav' | 'menu' | 'scrim' | 'footer' | 'rail' | 'dock' | 'theme' | 'splash']`: the navbar, mobile menu and its backdrop, footer, Home social rail and dock, theme switch, and intro splash.
- `[data-part='…']`: named details inside pages, such as `preview-badge`, `poster-scrim`, `hero-fade`, `share` and `back`.
- `[data-page='…']`: page roots, for the rare page-specific tweak (for example `data-page="resources"`).

`base.css` gives each hook a working default. `neu/neu.css` and `glass/glass.css` style all of them; use
their selector lists as a checklist. Always scope hooks to your pack too.

---

## 5. Do and don't

**Do**

- Scope every selector to `html[data-ui='<id>']`.
- Style light and dark, including `[data-scheme='dark']` regions.
- Keep a visible `:focus-visible` ring on every interactive class.
- Keep tap targets at least 40px.
- Add `@media (prefers-reduced-motion: reduce)`, with no long transitions, spins or auto-animation.
- Add `@media (prefers-reduced-transparency: reduce)` if you use blur or see-through fills; it must give solid surfaces.
- Keep headings black and white, and keep sky blue for small accents.

**Don't**

- Edit pages or components to get a look. If a page needs a hook, add a `data-part` attribute and style that from the pack.
- Use raw colours in markup (`bg-white`, `text-slate-900`, hex). Tokens and pack CSS only.
- Put design CSS anywhere except the pack file: no page `<style>` blocks, no edits to `index.css`.
- Write unscoped selectors. They leak into every other design. `check:ui` fails on them.
- Theme Admin69. `/dashboard/admin69` is always flat and dark.

---

## 6. Testing

Run `npm run dev` in `frontend/`.

- **`/dev/ui-kit?ui=<id>`** (dev only): every semantic class in a light and a dark column. Use the
  picker to compare against the other designs. Check focus rings with Tab, the track, the switch, and
  pressed and selected states.
- **`/?previewUi=<id>`**: the real site in your design, for this browser tab only. It only works
  while this browser is signed in to `/dashboard/admin69` (locally too); anyone else gets the live
  design. The id is validated against the registry and nothing is saved; a "Previewing" badge has an Exit link. The
  preview persists while you navigate, so walk through every tab: Home, Events, an event page,
  Domains, Members, Contact, the 404 page.
- Check both themes with the theme switch, at 375px and 1280px wide.
- Turn on **reduce motion** and **reduce transparency** in the OS or browser dev tools and look again.
- **Admin69 → Appearance** shows a card for every registry entry. Its Preview button opens the
  `?previewUi=` link. Applying a design changes the live site for every visitor, so only apply when
  the design is ready.

`npm run check:ui` checks every registered pack:

- the pack file exists and every semantic class has a scoped rule;
- no selector is unscoped;
- there is a dark-mode rule and a reduced-motion block;
- packs that use `backdrop-filter` have a reduced-transparency block;
- the registry, server allowlist and `index.html` lists match;
- preview colours are valid hex.

`TODO(ui-design)` markers are warnings; `npm run check:ui -- --strict` turns them into errors. The
frontend `prebuild` runs the check, so an incomplete pack fails `npm run build` and the Vercel deploy.

---

## 7. Pre-merge checklist

- [ ] `npm run check:ui -- --strict` passes (no TODOs left).
- [ ] `npm run build` in `frontend/` passes.
- [ ] The registry entry has a real description and preview colours, and the admin swatch looks like the design.
- [ ] All 13 semantic classes look right in `/dev/ui-kit?ui=<id>`, light and dark.
- [ ] Every public tab looks right through `?previewUi=<id>`, light and dark, at 375px and 1280px.
- [ ] Headings are black and white; accents are sky blue or the domain colours only.
- [ ] Text contrast meets WCAG AA in both modes, including on cards, wells, pills and the navbar.
- [ ] Focus rings are visible on every control; tap targets are at least 40px.
- [ ] Reduced motion and reduced transparency both look right.
- [ ] Glass and Soft Tactile look unchanged (spot-check Home and one other tab in each).
- [ ] No edits outside the pack folder, apart from the three id lists and `registry.js`.
- [ ] Admin69 is unchanged and still flat dark.
