# AdroIT Website — Tabs & UI Design Guide

This document explains every tab (page) of the AdroIT club website, what each one contains, and the
visual design system they share. It is written for anyone who needs to change the UI and wants to keep
it consistent.

- **Stack:** React 19, React Router, Vite 7, Tailwind CSS v4, Three.js (particle effects), lucide-react icons.
- **Frontend code:** `frontend/src/` — pages in `pages/`, shared pieces in `components/`, global styles in `index.css`.
- **Hosting:** Vercel (`vercel.json` at the repo root), with serverless functions in `api/`.

---

## 1. Site map

The navbar shows five tabs. A few other routes exist but are reached from inside pages.

| Tab / route | File | In navbar? | Purpose |
|---|---|---|---|
| Home `/` | `pages/Home.jsx` | Yes | Club introduction, domains showcase, events overview |
| Events `/events` | `pages/Events.jsx` | Yes | Upcoming and completed events |
| Event detail `/events/:slug` | `pages/EventDetail.jsx` | No (opened from Events/Home) | One event: boot camp, Paradox fest, or generic layout |
| Domains `/domains` | `pages/Domains.jsx` | Yes | Deep dive into each domain (skills, projects, roadmap) |
| Members `/members` | `pages/Members.jsx` | Yes | Club roster, grouped by domain |
| Contact `/contact` | `pages/Contact.jsx` | Yes | Message form, campus map, contact details |
| Domain registration `/register/:domain` | `pages/DomainRegister.jsx` | No (opened from the boot camp page) | Sign-up form for a boot camp session |
| Resources `/resources/:domain?` | `pages/Resources.jsx` | No (nothing links to it) | Learning-resource library backed by an API |
| Profile `/profile` | `pages/Profile.jsx` | Only when signed in | Account settings (login-protected) |
| Admin `/admin/*` | `pages/AdminDashboard.jsx` | Only for admins | Legacy admin panel (login-protected) |
| Admin69 `/dashboard/admin69` | `src/admin69/` | No | Separate password-protected admin app |
| Anything else | inline in `App.jsx` | — | 404 page with "Return Home" / "Explore Domains" |

`/login` redirects to `/`. Every route change scrolls the window back to the top (`App.jsx`).

---

## 2. Global layout (on every tab)

Every page is wrapped by `layout/MainLayout.jsx`, which renders, top to bottom:

1. **Navbar** (`components/Navbar.jsx`)
2. **Social dock** (`components/Sidebar.jsx`, Home only)
3. **Page content** inside `<main>`, padded by `--nav-height` so it starts below the fixed navbar
4. **Footer** (`components/Footer.jsx`)

The first-visit **intro splash** sits above all of this.

### 2.1 Navbar

- **Bar:** fixed to the top, `z-[1000]`, height `--nav-height` (4rem plus the phone's safe-area inset).
  - It is translucent glass: white at ~74% in light mode, black at ~70% in dark mode.
  - After 20px of scrolling it becomes more opaque and the blur gets stronger.
- **Logo:** `BrandMark` swaps between the dark logo (light mode) and the white/blue logo (dark mode).
- **Desktop (≥ `md`):**
  - Links: Home, Events, Domains, Members, Contact, then Profile/Admin when relevant, then the theme toggle.
  - A **sliding glass pill** sits behind the links. It follows the link under the mouse and glides back to the active tab when the mouse leaves (300 ms, `cubic-bezier(0.22,1,0.36,1)`).
- **Mobile (< `md`):**
  - The bar shows the theme toggle and a menu button (`aria-expanded`, "Open menu"/"Close menu").
  - The menu is a small right-aligned glass dropdown with an arrow caret. Each row has an icon tile and a chevron; the active row is tinted sky blue.
  - Tapping the dimmed backdrop, or navigating, closes it.

### 2.2 Theme (light / dark)

- **Toggle:** `components/ThemeToggle.jsx`, a round button showing a moon icon in light mode and a sun icon in dark mode.
- **State:** `lib/theme.jsx` (`useTheme()` gives `{ theme, isDark, toggleTheme }`).
  - Dark mode adds the class `dark` to `<html>`. Tailwind's `dark:` variant is wired to that class in `index.css`: `@custom-variant dark (&:where(.dark, .dark *))`.
  - The choice is saved in localStorage under `adroit-theme`.
  - The default is **light**; the OS setting is not consulted.
  - An inline script in `index.html` applies the saved theme before React loads, so there is no flash on load.
- **Page backgrounds:** white (`#ffffff`) in light mode, pure black (`#000000`) in dark mode. Raised surfaces are `#111111` in dark mode.

### 2.3 Footer

- **Desktop:** a 12-column grid with these columns:
  - **Contact:** email and campus.
  - **The Club:** Founded 2020, 50+ Members, 30+ Projects, 20+ Events.
  - **Our Domains:** links that slide right on hover.
  - **Connect:** GitHub, LinkedIn and Instagram buttons that light up in brand colours on hover. This column is hidden on Home, where the social dock is used instead.
- **Mobile:** the columns stack into one.
- **Home only:** an embedded Google Map ("Find Our Campus") with an "Open in Maps" chip.
- **Bottom bar:** © year and a "Back to Top" button.

### 2.4 Social dock (Home only)

`components/Sidebar.jsx` returns nothing except on `/`.

- **Desktop (≥ `lg`):** a vertical rail on the left edge, with a glowing sky-blue line, pulsing dots and three round outlined icons (Instagram, GitHub, LinkedIn). Hovering shows a glass tooltip.
- **Mobile/tablet:** a floating glass pill centred at the bottom of the screen with three round icon buttons. Home adds bottom padding so the dock never covers content.
- **Glass style (`.social-glass-bar`):** blur 28px plus saturation. Under `prefers-reduced-transparency` it falls back to a solid background.

### 2.5 Intro splash (first visit)

`components/IntroSplash.jsx` is a full-screen WebGL animation lasting about 5 seconds.

- **Animation:**
  1. Particles fly in and form the AdroIT logo.
  2. The logo extrudes into 3D.
  3. A blue ring pulses out, a light sweeps across, and the camera pushes in.
  4. The splash fades out.
- **Loading UI:** status text ("Initializing domains" → "Ready"), a cyan→indigo progress bar, and a **Skip** button. Escape also skips.
- **When it shows:** only once per browser (localStorage `adroit-intro-seen`). It is skipped completely when the user prefers reduced motion.
- **Performance:** quality drops automatically on slow devices.

---

## 3. Design system

The public site supports several **UI designs**. Today there are two: **Liquid Glass** (`glass`, the
default) and **Soft Tactile** (`neu`). Pages never hardcode a look. They use a fixed set of semantic
classes and colour tokens, and the active **theme pack** decides what those look like. Light and dark
mode are separate from the design: every design styles both.

To add a design, see [ADDING_A_UI_DESIGN.md](./ADDING_A_UI_DESIGN.md).

### 3.1 How it fits together

| Piece | File | Job |
|---|---|---|
| Registry | `ui-designs/registry.js` | `DESIGNS`: id, label, description, admin preview colours and a lazy CSS `loader` for each design. Also `DEFAULT_DESIGN` (`glass`) and the preview helpers. |
| Theme packs | `ui-designs/<id>/<id>.css` | All CSS for one design, scoped to `html[data-ui='<id>']`. Loaded on demand, so visitors only download the active design. |
| Fallbacks | `ui-designs/base.css` (imported by `index.css`) | Flat, readable defaults for every semantic class and hook, used until a pack's CSS has loaded and by packs that are still stubs. |
| Provider | `ui-designs/UiDesignProvider.jsx` | Loads the active pack and sets `data-ui` on `<html>`. `useUiDesign()` (in `ui-designs/useUiDesign.js`) gives `{ design, setDesign, loading, preview }`. |
| First paint | inline script and `<style>` in `index.html` | Sets `data-ui` from localStorage (or a preview) before React loads, and paints that design's page colour, so the page doesn't flash the wrong design. In production builds, `preloadDesignCss()` in `vite.config.js` also injects a preload for that design's CSS, so it downloads alongside the JS. |
| Live design API | `api/_lib/ui-design.js`, `api/ui-design.js`, `api/admin69/ui-design.js` | `GET /api/ui-design` returns the live design (stored in MongoDB, CDN-cached for about a minute). Admins change it with `POST /api/admin69/ui-design`. Unknown ids are rejected. |
| Admin control | `admin69/Appearance.jsx` | The Appearance tab (section 5). |
| UI kit | `pages/dev/UiKit.jsx` at `/dev/ui-kit` | Dev-only page showing every semantic class in light and dark, for any design (`?ui=<id>`). |
| Scripts | `scripts/new-ui-design.mjs`, `scripts/check-ui-designs.mjs` | `npm run new:ui` scaffolds a design; `npm run check:ui` fails on incomplete packs and also runs before every frontend build. |

**How a visitor gets a design:**

1. The inline script in `index.html` applies the last design this browser saw (localStorage `adroit-ui-design`), or `glass`.
2. The provider loads that pack's CSS, then asks `GET /api/ui-design` for the live design. If it differs, it loads the new pack, switches, and remembers it.
3. A preview link (`?previewUi=<id>`) overrides both for that browser tab only (sessionStorage), but only for a signed-in admin: before applying it, the site checks `GET /api/admin69/session`, and everyone else gets the live design. It never changes the saved design, and a "Previewing: <label>" badge with an Exit link stays on screen.

Design ids appear in three places that must agree: `DESIGNS` in `registry.js`, `UI_DESIGN_IDS` in
`api/_lib/ui-design.js`, and `var designs` in `index.html`. `npm run new:ui` updates all three, and
`npm run check:ui` fails if they drift apart.

### 3.2 The designs

- **Liquid Glass (`glass`):** translucent panels that blur what is behind them, with a bright rim, a top sheen and a soft drop shadow. Pick-one-of-N controls use a glass pill that slides and stretches slightly as it moves. Dark mode uses a darker tint, a dimmer rim and stronger shadows. Its private variables are `--lg-*`.
- **Soft Tactile (`neu`):** one matte material lit from the top-left. Cards are raised, wells and inputs are recessed, pressed controls sink in, and the slider thumb is a raised knob in a groove. There is no blur. Its private variables are `--neu-*`, and it also styles the `/dev/ui-kit` light and dark columns.

Under `prefers-reduced-transparency: reduce`, any blur or see-through surface becomes solid. Under
`prefers-reduced-motion: reduce`, slides, presses and other transitions are instant.

### 3.3 Colour tokens

Semantic colours live in `index.css` under `@theme static`, with dark-mode values on `html.dark`.
Tailwind turns each token into utilities (`bg-page`, `text-ink`, `border-line`, …), so markup written
with tokens works in every design and both modes. Packs may override the neutral and primary tokens
(Soft Tactile does, for its grey-blue page); status colours are fixed. The full contract is in
[ADDING_A_UI_DESIGN.md](./ADDING_A_UI_DESIGN.md#3-token-contract).

| Token | Default light | Default dark | Used for |
|---|---|---|---|
| `page` | white | `#000000` | Page background |
| `surface` | white | `#111111` | Raised surfaces |
| `ink` | slate-900 | slate-100 | Main text, solid buttons |
| `ink-muted` / `ink-subtle` | slate-600 / slate-500 | slate-400 | Secondary text, labels |
| `line` / `line-strong` | slate-200 / slate-300 | white 12% / 24% | Dividers and borders |
| `primary` / `primary-ink` | sky-700 / sky-800 | sky-400 / sky-300 | Brand accent (links, eyebrows, focus rings) |
| `on-primary` | white | slate-950 | Text on a primary fill |
| `secondary` | indigo-500 | indigo-400 | Secondary accent |
| `success` / `warning` / `danger` | emerald / amber / red -700 | the -400 shades | Status messages |

Regions marked `data-scheme="dark"` (the Home terminal, event posters, the Paradox hero, the image
lightbox) use the dark values in every theme.

### 3.4 Semantic classes

These 13 classes are the only design-specific classes pages may use. Each pack styles all of them.

| Class | Used for |
|---|---|
| `ui-card` | Main panels: event cards, content blocks, member cards, the Contact compose window |
| `ui-well` | Recessed areas inside cards: stat boxes, date and venue chips, form wells |
| `ui-solid` | The primary action button |
| `ui-pill` | Pick-one-of-N buttons and secondary buttons (selected via `aria-pressed` or `aria-selected`) |
| `ui-input` | Text inputs, selects, textareas |
| `ui-track` / `ui-thumb` | Segmented controls: the container and its sliding indicator |
| `ui-switch` | On/off toggles, such as the theme switch |
| `ui-chip` | Small badges, status labels and compact filter chips |
| `ui-tooltip` | Floating hints |
| `ui-dialog` | Modals, inspectors, bottom sheets |
| `ui-nav` | Navigation and sticky filter bars |
| `ui-heading` | Headings (always ink: black in light mode, white in dark) |

For finer control, the shell exposes `data-shell` hooks (navbar, menu, footer, social rail and dock,
theme switch, splash) and pages expose `data-part` and `data-page` hooks. Packs style those too.

### 3.5 Colour language

- **Headings are black & white:** `ui-heading text-ink`, with no gradients. Every page title follows this rule in every design.
- **Sky blue is the brand accent:** eyebrow labels, taglines, links, focus rings and the `$` prompts.
- **Each domain has its own accent colour,** the same in every design:

  | Domain | Key | Accent (Domains & Members pages) |
  |---|---|---|
  | Machine Learning | `ml` | `#22d3ee` cyan |
  | Cloud Computing | `cc` | `#c084fc` purple |
  | Cybersecurity | `cy` | `#f472b6` pink |
  | Data Analytics | `da` | `#34d399` emerald |
  | Non-Tech | `nt` | `#fbbf24` amber |

  The Home showcase and the boot camp page use a separate palette from `DomainParticleStage.jsx`: emerald, indigo, sky, rose and amber.
- **Selected vs unselected domain icons:** on the Domains and Members filters, the selected domain's icon is shown in its accent colour. Unselected icons are greyed out (`opacity-60 grayscale`) and regain colour when picked, with a 300 ms filter transition.

### 3.6 Typography

- **Fonts:** no web font is loaded. Text uses Tailwind's system UI stack (`font-sans`). `font-mono` is used for "techy" details: eyebrow labels, `$` prompts, counters, the Members "nodes" wording.
- **Fluid heading utilities** (`index.css`, `@layer utilities`) scale with the viewport:
  - `.fluid-h1`: `clamp(1.75rem, 7vw, 3.75rem)`. Page titles on Events, Domains, Members and Contact.
  - `.fluid-h2`: `clamp(1.5rem, 5vw, 3rem)`. Large Home statements.
  - `.fluid-lead`: `clamp(1rem, 3.2vw, 1.5rem)`. Intro paragraphs.
- **Eyebrows:** small uppercase sky text with wide letter-spacing (`text-xs uppercase tracking-[0.22em]`), used above section titles.
- **Mobile inputs** are forced to 16px so iOS Safari doesn't zoom in on focus.

### 3.7 Sliding selector (track and thumb)

Members, Domains, the event pages and the navbar share one interaction for picking between options: a
`ui-thumb` that slides to the chosen button inside a `ui-track` (or `ui-nav`).

- **How it moves:** the thumb measures the target button's position and size, then moves there with `transform`. Each design decides how that looks: Liquid Glass stretches the pill slightly in proportion to the distance; Soft Tactile slides a raised knob along a groove.
- **Hover preview:** on desktop, hovering another option previews the move; leaving returns the thumb to the active option.
- **Re-measuring:** it re-measures on resize, when web fonts finish loading, and when the row scrolls horizontally on mobile.
- **Reduced motion:** the thumb jumps instead of sliding.

### 3.8 Shape, spacing & layout conventions

- **Corner radii** come from the pack. In markup, large containers use `rounded-3xl` or `rounded-[2rem]`, cards `rounded-2xl`, and chips and buttons `rounded-full`; packs may refine them.
- **Content widths:** `max-w-6xl` or `max-w-7xl`, with side padding `px-4 sm:px-6 lg:px-8`.
- **Breakpoints:** `sm` 640px, `md` 768px, `lg` 1024px. Most pages switch from one stacked column to a multi-column layout at `lg`.
- **Sticky filter bars** (Domains selector, Members filters) stick directly under the navbar using `top-[var(--nav-height)]`.

### 3.9 Motion

- **Entrance animations:**
  - Home hero: fade and rise.
  - Members header and cards: a staggered `members-rise` reveal.
  - Domain text on the Home showcase: rises in (`domRise`).
- **Auto-advancing tabs:** the Home showcase and the boot camp page advance every 6 seconds. A thin accent bar fills across the active tab to show the countdown, and the timer pauses while the mouse is over the card.
- **Particle shapes** (`DomainParticleStage.jsx`, Three.js):
  - About 4–5k particles morph between five shapes: a bar chart, a cloud, a neural network, a shield and a megaphone.
  - Their colour blends to the active accent.
  - They spin slowly, tilt with the mouse, and can be dragged to rotate.
  - Rendering pauses when the effect is off-screen or the tab is hidden.
- **Marquees:** the event photo gallery scrolls in two opposite directions and pauses on hover (mouse devices only).
- **Reduced motion:** when the user prefers reduced motion, auto-advance, particle spin, the splash, the paper-plane flight, entrance animations and design transitions are switched off or replaced with instant changes.

### 3.10 Accessibility patterns

- Every icon-only button has an `aria-label`: social links, close buttons, theme toggle, menu.
- **Tabs:**
  - The Home showcase and the boot camp tab bar use `role="tablist"`/`role="tab"`/`aria-selected`.
  - Filter chips and pills use `aria-pressed`.
  - The admin69 tabs are full ARIA tabs with `aria-controls` and tab panels.
- **Live regions** announce changing text: the Members "N of M nodes matched" count, the Contact sending steps and email suggestions, and the splash progress.
- **Focus:** every interactive semantic class keeps a visible `focus-visible` ring in the primary colour, in every design.
- **Dialogs** (Members details on mobile, registration modal) use `role="dialog"` and `aria-modal`, and close with Escape where supported.
- **Tap targets** are at least 40px.

---

## 4. Tab by tab

### 4.1 Home (`/`)

The landing page. Its background is `bg-page`: white in light mode, black in dark mode. From top to bottom:

1. **College strip:** the RNSIT logo (white-text version in dark mode) and the "25 Years" badge.
   - On mobile they form a small row above the hero.
   - On desktop they float over the top edge of the page, on the left and right of the navbar.
2. **Hero:**
   - A "Recruiting soon" glass chip (`lg-well`, monospace, uppercase).
   - The AdroIT logo, which swaps to the white/blue version in dark mode.
   - The heading "Department of **Computer Science & Engineering**", in black & white.
   - The tagline "The Premier Technical Club *Empowering Tomorrow's Innovators*", with the italic part in sky blue.
   - The **event carousel** (`components/EventCarousel.jsx`): a strip of `lg-card` domain cards for the boot camp. Each card opens `/events/skill-up-bootcamp?domain=…`.
3. **"Learn it. Build it. Show it.":** a short paragraph next to a **terminal** window. The terminal is always black, with a `$` prompt, and types out `adroit learn`, `adroit build --team` and `adroit demo` with their outputs. It starts typing when scrolled into view; under reduced motion it shows the full text at once.
4. **"What you could build"** (domain showcase), one large `lg-card`:
   - **Left:** the active domain's tools (in its accent colour), its name and a description.
   - **Right/background:** the 3D particle shape for that domain. Drag it to rotate.
   - **Bottom:** a tab bar with Data Analytics, Cloud Computing, Machine Learning, Cybersecurity and Non-Tech. It has 2 columns on mobile and 5 on desktop. The active tab is a brighter glass cell with a filling accent bar along its top edge.
   - Tabs auto-advance every 6 s and pause on hover. A soft radial glow in the accent colour cross-fades behind the card.
5. **Statement:** "Learn from seniors. Build with your peers. Then become the senior who helps someone else get started."
6. **"Events through the year":** a numbered (01, 02, …) list inside an `lg-card`. It lists Paradox, Skill Up Boot Camp, Peptalks, Tech Escape, Internship Program and Online sessions. Rows with a page show an arrow and a hover tint.
7. **Call to action:** an `lg-card` titled "Skill Up Boot Camp" with an "Explore the boot camp" button, a black/white `lg-solid` pill.
8. **Footer** with the campus map, plus the floating **social dock**.

### 4.2 Events (`/events`)

- **Header:** an "Events" title (black & white) and the subtitle "Upcoming sessions and recaps from AdroIT."
- **Sections:** **Upcoming** and **Completed**, each under a sky eyebrow label. Events are sorted into the two sections by date in Indian time (`data/events.js` → `partitionEvents`).
- **Event cards** (`FeaturedEvent`), each an `lg-card` with `rounded-[2rem]`:
  - **Layout:** a poster column (desktop) or banner (mobile), then a content column.
  - **Poster:** a full-bleed image with a dark gradient and a status pill ("Upcoming", "Live", "Completed"). Posters marked `posterFit: "contain"` are letterboxed on black instead.
  - **Content:** eyebrow, title, sky tagline, glass `lg-well` chips for date and venue, a two-line description, overlapping thumbnails of up to three event photos, a **Share** button, and "View and register" / "View recap".
  - **Hover:** the card lifts 4px and the poster zooms slightly. Both are disabled under reduced motion.
- **Empty state:** an `lg-card` reading "No past events yet".

### 4.3 Event detail (`/events/:slug`)

One route, three layouts chosen by slug:

- **Skill Up Boot Camp** (`skill-up-bootcamp`), the most designed event page:
  - **Card:** one large rounded card with a masked square-grid background and an accent-coloured glow that follows the active day.
    - The page itself gets an **interactive canvas grid** behind it (`InteractiveGrid.jsx`): grid cells near the pointer light up in sky blue.
  - **Top row:** a "← Events" pill, Share (the shared link remembers the selected domain), and a status pill with a pulsing green dot while the event is live.
  - **Body:**
    - The 3D particle shape, which can be dragged to rotate.
    - A large accent-coloured day number.
    - The session title and details.
    - A "Register for X ↗" pill, or "registration closed".
  - **Tab bar:** four domain/day tabs (2×2 on mobile, 4 across on desktop) with a 6-second filling progress bar. Tabs auto-advance, and stop doing so when a domain was opened via `?domain=`.
  - **Completed stamp:** after 7 pm IST on a session's day, a rotated "COMPLETED · ADROIT" stamp appears on that day.
  - **About:** a separate About card follows.
- **Paradox 2026** (`paradox-2026`), the inter-college fest:
  - **Hero:** an always-dark hero with sky/indigo glows, a large black-weight title, and pills for date, venue and total prize pool, with the poster beside them.
  - **"Three competitions":** CTF, Tech Auction and AI Film Making, each as a poster card with date, prize and team-size chips.
  - **Glimpses:** a photo gallery that opens a lightbox.
- **Generic layout** (any other event):
  - Hero poster, back pill, title, Share, and "Register now".
  - Date/Venue/Status cards.
  - About, Domains (sessions with Register links), Competitions, Glimpses.
  - A keyboard-navigable lightbox: ← → to move, Esc to close.

**Glimpses gallery** (`GlimpseGallery.jsx`):
- A rounded container with two marquee rows of photos moving in opposite directions, with faded edges.
- Tiles cycle through five sizes and aspect ratios.
- Hovering pauses the rows; clicking a photo opens the lightbox.

**Share button** (`ShareEventButton.jsx`):
- A rounded pill that uses the phone's native share sheet when available, otherwise copies the link.
- After a successful share or copy it shows "Link copied" with a check for 2 seconds.

### 4.4 Domains (`/domains`)

- **Hero:** a black & white "Domains" title and an intro line with sky-blue highlights. On desktop, three `lg-card` stat pills follow: domain count, "10+ Projects" and "100+ Members in community".
- **Domain selector:** a glass `lg-card` capsule holding the **sliding liquid pill**.
  - **Desktop:** full names, centred. Hovering an unselected domain shows a dark tooltip with member and project counts.
  - **Mobile:** short names (ML / Cloud / Cyber / DA / Non-Tech) **with icons**. It scrolls horizontally and sticks under the navbar.
  - **Icons** are in the domain's accent colour when selected and greyscale otherwise.
- **Domain banner:** an `lg-card` with a sky icon tile, the domain name, a short-name pill, the description, and `lg-well` stat boxes for Members, Projects and Resources.
- **Content grid** (3 columns on desktop):
  - Column 1: About This Domain, Career Paths, Domain Lead.
  - Column 2: Skills to Master, Popular Tools.
  - Column 3: Sample Projects, Learning Roadmap, Recommended Resources.

  Every block is an `lg-card` (`CARD = "lg-card rounded-3xl p-4 md:p-6"`), and inner rows are `lg-well`.
- **Mobile section switcher:** on phones only one group is shown at a time, picked with a second sliding-pill bar: **Overview / Skills / Projects / Path**. Tabs with no content are hidden.
- **Domain comparison table** (tablet and desktop only): one row per domain with members, projects, resources and lead. Clicking a row selects that domain.
- **Data:** the domain lead and member counts come from the live member list (`lib/memberGroups.js`), the same source as the Members page.

### 4.5 Members (`/members`)

The page has a light "developer console" theme: domains are "nodes", search says "grep", and the details panel looks like a terminal window.

- **Header:** "AdroIT Members", "Explore members by domain.", "Click a name to see their details.", over a faint dot grid that fades out downward.
- **Sticky filter bar** (white/black at 95% with blur, pinned under the navbar):
  - **Domain filters:** All, Machine Learning, Cloud, Cybersecurity, Data Analytics and Non-Tech, with the **sliding liquid pill** (`am-liquid`). Icons are coloured when selected and greyscale otherwise; short labels are used on mobile.
  - **Search box** ("grep name…"): a glass input. Pressing Enter opens the first match. Matching updates a live "N of M nodes matched" line.
  - **Scrolling:** choosing a domain scrolls up to the start of the list only when needed. It never scrolls the page header away.
- **Member sections:** one per domain.
  - **Section header:** a tinted icon tile in the domain's accent colour, the domain name, a hairline, and "N nodes".
  - **Member cards** (`am-glass`, 1/2/3 columns): avatar (photo or initials), name, a black "👑 LEAD" tag for domain leads, and a LinkedIn icon. Non-matching cards dim to 40% while searching. The selected card gets a darker border and a shadow.
- **Member details ("inspector"):**
  - **Desktop:** a sticky right-hand panel styled as a terminal window, with red/yellow/green dots, a dotted border, a large photo, and `name / role / domain / year` rows in monospace.
  - **Idle state:** "$ select a node" with a blinking cursor.
  - **Mobile:** the same panel opens as a centred dialog over a blurred backdrop.
- **Data:** the roster in `data/members.js` renders immediately, then is replaced by the live list from `/api/members` (edited in admin69).

### 4.6 Contact (`/contact`)

The background is `bg-page` (white in light mode, black in dark mode) with no decorations. The page is designed like a mail app.

- **Header:** "Contact" and "Questions about events, domains, or joining the club? …".
- **Message card** (`ct-glass`, `rounded-[2rem]`), 3/5 width on desktop. It is styled as a **"New Message"** compose window:
  - The fields sit in a recessed `ct-well`, separated by hairlines: To (an "AdroIT Team" glass pill), Name, Email, Subject, and the Message area.
  - The message has a live `0 / 1,000` counter that turns amber, then red, near the limit. Pasted text over the limit is trimmed with a notice.
  - **Email typo help:** for example, "Did you mean …@gmail.com?" as a clickable suggestion.
  - **Send** is a black/white `ct-solid` pill with an up-arrow and a press animation.
  - Fine print: "Up to 2 messages every 24 hours from this browser."
  - A hidden honeypot field catches spam bots.
- **Sending animation:** the form fades out and a letter is packed into an envelope. The envelope folds into a **paper plane**, which hovers and then launches along a trail. Captions cycle: "Packing your message" → "Folding it into a paper plane" → "Flying to Adroit" → "Sent!". It takes about 2.3 s.
- **Success state:** a check badge with a confetti burst and an expanding ring, "Message sent!", the reply-to email in a pill, and "Write another message".
- **Errors:** a dismissible banner at the top of the card.
- **Side column:**
  - A glass card with the campus Google Map. In dark mode the map is colour-inverted to match. Below it is an "Open in Maps" pill.
  - A glass list of Campus, Email and Reply time, each with a solid black/white icon tile.
- **Behind the scenes:** messages go to `api/contact.js`. Fake or throwaway email domains are rejected, a rate limit is applied, and messages are stored for the admin inbox, which deletes them automatically after 7 days.

### 4.7 Domain registration (`/register/:domain`)

Reached from the "Register" buttons on the boot camp page.

- **Layout:** a single narrow column with a back pill, a Technical/Non-Tech label, the session title and day, and a "What We'll Cover" card.
- **Form:**
  - **Name.**
  - **USN:** converted to uppercase as you type.
  - **Semester:** fixed to 3 and read-only.
  - **Section:** a single letter.
  - **Mobile:** 10 digits; non-digits are removed.
  - Every field has a visible label. The submit button is a full-width sky button that shows "Saving…" while sending.
- **States:**
  - **Registration closed:** controlled from admin69.
  - **Success:** an emerald card, "You're registered", with a "Join WhatsApp Group" button when available.
  - **Error:** a red alert.
- **Styling:** white rounded cards; dark mode comes from the global overrides.

### 4.8 Resources, Profile, Admin (`/resources`, `/profile`, `/admin`)

These are older pages from an earlier version of the site. They depend on a separate backend (`VITE_API_URL`) and a login system. When that backend isn't configured, protected pages redirect to Home.

- **Resources:**
  - Domain cards (All / ML / CC / CY / DA).
  - A glass filter bar with search, type and level filters, and Clear.
  - Resource cards showing type and difficulty badges, tags and view counts, with an "Access" button.
  - Nothing in the navigation links here.
- **Profile** (signed-in, approved users), with five tabs:
  1. Profile Information
  2. Security (change password)
  3. Settings (notification toggles, profile visibility)
  4. Activity (placeholder data)
  5. AI Settings
- **Admin dashboard** (admins only):
  - Four stat cards, then tabs for **Resources** (create), **Events** (create with image upload), **Users** (approve or revoke Google sign-ins) and **Members** (add or remove).
  - The `/admin/members`, `/admin/resources`, `/admin/events` and `/admin/users` routes just open the matching tab.
- **Pending approval screen:** signed-in users who are not yet approved see a "Pending Approval" card with an amber clock.

---

## 5. Admin69 dashboard (`/dashboard/admin69`)

This is the admin app actually in use. It is a separate single-page app (`src/admin69/`) with its own HTML entry point (`vite.config.js` and the `vercel.json` rewrite). Search engines are told not to index it, and it is served with `no-store`, `X-Frame-Options: DENY` and no-referrer headers.

- **Look:** always dark (`#000` page, `#0b0b0b` panels, `white/10` borders) and deliberately flat and functional, with no glass. Primary buttons are sky-500 with black text. Emerald means open or OK, rose means delete or error, amber means warning.
- **Login:** a centred "Restricted area" card with a password field and a show/hide toggle. It shows attempts left, a lockout countdown, and a "not configured" message.
- **Header:** the logo, "AdroIT Admin", "Session ends at HH:MM" and Sign out. The app locks itself when the session expires.
- **Tabs** (accessible ARIA tabs; panels stay mounted so unsaved edits survive switching):
  1. **Registrations:** on/off switches for each Skill Up Boot Camp session, plus Open all / Close all. These control the "registration closed" states on the boot camp and registration pages.
  2. **Members:**
     - Sub-tabs per domain with counts.
     - Rows with avatar, Lead badge and LinkedIn, plus move up/down, edit and remove buttons.
     - An add/edit form with name, role, LinkedIn and photo. Photos are shrunk in the browser and uploaded to Cloudinary with a face-centred crop.
     - Save/Discard, with conflict detection and a warning before leaving with unsaved changes.
  3. **Inbox:**
     - Contact-form messages with an unread badge on the tab.
     - All/Unread filter, Mark all read and refresh.
     - Expandable rows show the sender and an auto-delete countdown, with Reply (opens email), Mark read/unread and Delete.
  4. **Appearance:**
     - One card per design in `registry.js`, with a light/dark preview swatch, the description, and a "Live now" badge on the live design. New designs appear automatically.
     - Picking a card marks it "Selected"; a sticky bar offers Apply and Discard, and leaving the tab with an unapplied pick asks first.
     - Preview opens the public site in a new tab with `?previewUi=<id>`, for that tab only. The link only works while signed in to admin69.
     - Reset to default applies Liquid Glass after a confirm. Changes reach all visitors within about a minute.
- **"Coming later":** placeholder cards for Events and Resources.

---

## 6. Data sources (where the content comes from)

| File | Feeds |
|---|---|
| `data/events.js` | All events: boot camp sessions, Paradox competitions, the internship, photo galleries. Also the date helpers that decide upcoming, live and completed, and the 7 pm IST "completed" cutoff |
| `data/domainRegistration.js` | Registration domains (slug, title, WhatsApp link, default closed flag) |
| `data/members.js` | Bundled roster, used as the fallback for Members and Domains |
| `lib/memberGroups.js` | `useMemberGroups()`: bundled roster first, then the live `/api/members` list |
| `lib/registrationStatus.js` | `useRegistrationClosed()`: live open/closed state from `/api/registration-status` |
| `lib/cloudinaryUrl.js` | Builds optimised Cloudinary image URLs |
| `lib/theme.jsx` | Light/dark theme state |

---

## 7. Rules of thumb for new UI

1. **Never hardcode a design.** Glass, blur, shadows, radii, motion and colours belong in the theme packs (`ui-designs/<id>/<id>.css`), not in pages or components. New UI must look right in every design without page changes.
2. **Use the semantic classes** (section 3.4): `ui-card` for panels, `ui-well` for chips and stat boxes inside them, `ui-solid` for the main button, `ui-pill` for secondary and pick-one buttons, `ui-input` for fields, `ui-dialog` for modals, `ui-heading` for headings.
3. **Use the theme tokens** (`bg-page`, `text-ink`, `text-ink-muted`, `border-line`) instead of raw colours (`bg-white`, `text-slate-900`, hex), so markup works in both modes and every design without `dark:` classes.
4. **Keep headings black & white** (`ui-heading text-ink`). Use sky blue only for small accents (eyebrows, links, taglines, focus rings) and domain accent colours only for domain-specific details.
5. **Use `ui-pill`, or a `ui-track` with a `ui-thumb`,** for any "pick one of N" control, to match Domains, Members and the navbar.
6. **Need a page-specific look?** Add a `data-part="…"` hook in the markup and style it in each pack, scoped to `html[data-ui='<id>']`. Don't add page `<style>` blocks for design.
7. **Mobile first:** stack into one column below `lg`, keep tap targets at least 40px, keep icons visible on mobile chips, and stick filter bars under the navbar with `top-[var(--nav-height)]`.
8. **Respect user settings:** handle `prefers-reduced-motion` (no auto-advance, spin or long animations) and `prefers-reduced-transparency` (solid surfaces instead of blur), in markup and in every pack. Hover lifts, zooms and slides in markup are written `motion-safe:hover:…` / `motion-safe:group-hover:…`.
9. **Accent-coloured text uses `accent-ink`:** set the colour with `style={{ "--accent": color }}`. It darkens the accent in light mode so the text passes WCAG AA, and uses it unchanged in dark mode.
10. **Label everything:** add `aria-label` to icon-only buttons, `aria-pressed` or `aria-selected` to toggles and tabs, and `aria-live` to text that changes. Keep `focus-visible` rings.
11. **Check every design:** look at new UI in each design (`?previewUi=<id>`) in light and dark, and in `/dev/ui-kit`. Run `npm run build` in `frontend/`; its `prebuild` step runs `npm run check:ui`.
12. **Adding a design?** Run `npm run new:ui -- <id> "<Label>"` and follow [ADDING_A_UI_DESIGN.md](./ADDING_A_UI_DESIGN.md).
13. **Admin69 is the exception:** it stays flat and dark and never uses the semantic classes or `data-ui` styles.

---

## 8. Known quirks & unused pieces

These were noticed while writing this guide; they don't affect the live tabs, but are worth knowing.

- **Unused components:** `EventDetailsModal.jsx`, `InteractiveRings.jsx`, `ChatBot.jsx` (commented out in `App.jsx`) and `home/ThreeScene.jsx` are never rendered.
- **Unused CSS:** `.glass`, `.fluid-hero` and `.event-page-enter` in `index.css` are not used by any component.
- **Unreachable modal:** `RegistrationModal.jsx` only appears for team-registration events that are still open. No current event in `data/events.js` qualifies.
- **Missing animation class:** the Home social dock's glow line uses `animate-pulse-glow`, which isn't defined, so it doesn't animate.
- **Unreadable chip in light mode:** the Footer's "Open in Maps" chip has dark text on a dark background. Dark mode is fine.
- **Missing announcements and names:**
  - The Share button's "Link copied" message isn't announced to screen readers.
  - Gallery photo buttons have no accessible name.
- **Unconfigured backend:** Resources, Profile and the legacy Admin pages need the separate backend (`VITE_API_URL`). Without it, Profile and Admin always redirect to Home.
