# Project: Modern Clean Minimalist Dark Portfolio Retheming & Vercel Deployment

## Architecture
- **Framework & Stack**: Pure Vanilla HTML5, Modern CSS3 (Custom Properties), and Modular ES6 JavaScript bundled via Vite 6.2.0. No runtime UI libraries (no React, no Vue).
- **Component & DOM Structure**: Single Page Application structure in `index.html` composed of:
  - Global Overlays: Precision Cursor (`#cursorDot`, `#cursorRing`), Ambient Particle Canvas (`#bgCanvas`), Intro Loading Screen (`#introScreen`), and CV Modal (`#resumeModal`).
  - Navigation Systems: Floating Top Glassmorphism Pill Navbar (`#pillNavbar`) and Vertical Side Rail Navigation (`#sideNavRail`).
  - Core Content Sections: Hero (`#home`), About Me (`#about`), Portfolio Case Studies (`#portfolio`), Contact Channels (`#contact`), and Footer.
- **Data Flow & State Management**:
  - Content is 100% statically embedded in `index.html` ensuring zero data loss and maximum SEO performance.
  - Interactive state (loading progression, audio playback simulation, spring spotlight physics, active section scroll-spying, modal visibility, and clipboard operations) is managed in `src/main.js`.
  - Design tokens and component theming are centralized in `src/style.css`.
- **Deployment Architecture**:
  - Build System: Vite Bundler (`npm run build`) compiling to `dist/`.
  - Hosting Target: Vercel Static Hosting at root domain `/`.
  - Configuration: `vite.config.js` (`base: '/'`), `vercel.json` (SPA rewrites and immutable asset headers), and `.gitignore`.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Document Metadata & SEO | HTML meta tags, title, theme-color `#09090b`, OG tags pointing to clean base photo `/assets/christopher-base.jpg` | M1 | Survey 1, 2 |
| 2 | Modern Clean Design Tokens | Complete `:root` palette based on Zinc/Obsidian neutrals (`#09090b`, `#141418`), Slate typography (`#f8fafc`, `#94a3b8`), and Electric Sky accent (`#38bdf8`), banishing all magenta/violet tokens | M1 | Survey 2 |
| 3 | Minimalist Intro Loading Screen | Retain 0-100% counter, sleek progress bar, canvas ambient particles, and shutter exit; remove Reyna shadow hands, eye icon, and purple vignette | M2 | Survey 1, 2, 3 |
| 4 | Precision Cursor Follower | Spring lerp follower dot and ring (`#cursorDot`, `#cursorRing`) rethemed from magenta to crisp cyan/white | M2 | Survey 2, 3 |
| 5 | Background Particle Canvas | `#bgCanvas` dual layer (mouse proximity crosshairs + floating motes + scroll warp streaks) rethemed from magenta/purple to monochrome silver/cyan | M2 | Survey 2, 3 |
| 6 | Navigation Systems | Floating pill navbar with sliding indicator and vertical side rail with section dots and counter (`01 / 04`) rethemed to cyan/indigo accent | M1 | Survey 1, 2, 3 |
| 7 | Hero Section & Metrics | Affiliation badge, large display name, role, bio paragraph, 2 CTA buttons, and 2 quick metrics cards preserved 100% | M1 | Survey 1 |
| 8 | Spotify Player Card Widget | Interactive simulated player (vinyl spin, equalizer bars, timeline, play/pause); update track to ambient coding track and album art to `christopher-base.jpg` | M2 | Survey 1, 2, 3 |
| 9 | About Me Narrative & Spotlight | Two complete narrative paragraphs preserved; spring-physics spotlight reveal rethemed to grayscale-to-vivid genuine portrait `christopher-base-cutout.png` (zero Reyna art) | M2 | Survey 1, 2 |
| 10 | Focus Areas Grid | 3 indexed cards (01 Decision Support Systems, 02 Full-Stack & Web Systems, 03 Applied AI/ML & IoT) preserved 100% | M1 | Survey 1 |
| 11 | Skills & Tech Stack Matrix | 4 category skill clouds (Core Languages, Web & Frameworks, Database & Data Layer, DSS & Systems) preserved 100% | M1 | Survey 1 |
| 12 | Case Study 1: InternMatch DSS | Full case study with Problem Context, Role, Methodology, Tech Tags, Engineering Challenges, and Key Insights preserved 100% | M1 | Survey 1 |
| 13 | Case Study 2: MySembako | Full case study with Problem Context, Role, Features, Tech Tags, Engineering Challenges, and Key Insights preserved 100% | M1 | Survey 1 |
| 14 | Contact Channels Grid | 4-channel direct grid (Email with 1-click clipboard copy, GitHub, LinkedIn, Instagram) preserved 100% | M1 | Survey 1, 3 |
| 15 | Site Footer | Author name, Unika Soegijapranata affiliation, and tech signature preserved 100% | M1 | Survey 1 |
| 16 | Curriculum Vitae Modal | Accessible modal with Education, Projects, Technical Skills, mailto CTA, and full keyboard/click close handlers preserved 100% | M1 | Survey 1, 3 |
| 17 | Reyna Asset Cleanup | Delete official game cutouts (`reyna-official-cutout.png`, `reyna-official-raw.png`) and replace references to Reyna cutouts/portraits | M2 | Survey 2 |
| 18 | Vercel Deployment Config | Change `base: '/'` in `vite.config.js`, create `vercel.json` with SPA rewrites & cache headers, add `.gitignore` | M3 | Survey 1, 2, 3 |
| 19 | Build & Preview Verification | Execute `npm run build` (exit 0) and verify `npm run preview` runs with zero console errors and clean root asset resolution | M4 | Survey 1, 2, 3 |
| 20 | Forensic Audit & Integrity Verification | Independent verification of zero Reyna assets, 100% content preservation, accessibility contrast, and functional integrity | M4 | Survey 1, 2, 3 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Design System & Content Styling | Update `:root` design tokens in `src/style.css` (zinc/obsidian neutrals, electric sky accent, zero magenta), retheme all UI components, buttons, badges, and ensure 100% content preservation across all sections | none | DONE |
| M2 | Interactive Features & Reyna De-theming | Retheme intro loading screen (remove shadow hands, eye icon, vignette; keep 0-100% counter & canvas dust), retheme `#bgCanvas` and cursor follower to monochrome/cyan, adapt Spotify widget & About spotlight reveal, delete Reyna game assets | M1 | DONE |
| M3 | Vercel Deployment Configuration | Configure `vite.config.js` (`base: '/'`), create `vercel.json` with SPA routing and asset caching headers, create `.gitignore` | M1, M2 | DONE |
| M4 | Verification, Testing & Forensic Audit | Run production build & preview, execute review rounds, challenger testing, and independent forensic audit | M1, M2, M3 | DONE |

---

## Interface Contracts
### `src/style.css` ↔ `index.html`
- **Class Selectors**:
  - `.intro-screen`: Root container for loading animation. Shutter elements `.intro-shutter-top`, `.intro-shutter-bottom`.
  - `.loading-card`: Holds `.loading-label`, `.loading-location`, `.intro-title`, `.loading-percent`, `.loading-bar-track`, `.loading-bar-fill`.
  - `.cursor-dot`, `.cursor-ring`: Desktop custom cursor elements.
  - `.bg-canvas`: Fullscreen interactive canvas.
  - `.spotify-card`: Interactive music widget with `#vinylDisc`, `#equalizerBars`, `#progressBarFill`, `#btnPlayPause`.
  - `.about-spotlight-container`: Spotlight photo wrapper with `.about-base-img` and `.about-photo-reveal-wrapper`.
- **CSS Custom Properties**:
  - `--bg-primary` (#09090b), `--bg-surface` (#141418), `--bg-surface-elevated` (#1b1b22).
  - `--text-primary` (#f8fafc), `--text-secondary` (#94a3b8), `--text-muted` (#64748b).
  - `--accent` (#38bdf8), `--accent-hover` (#7dd3fc), `--accent-secondary` (#6366f1).
  - Zero reference to `--reyna-*`, `--accent-magenta`, or violet glow variables.

### `src/main.js` ↔ `index.html`
- **DOM IDs**:
  - `#introScreen`, `#introParticleCanvas`, `#loadingPercent`, `#loadingBarFill`.
  - `#cursorDot`, `#cursorRing`, `#bgCanvas`.
  - `#spotifyCard`, `#vinylDisc`, `#btnPlayPause`, `#timeCurrent`, `#timeDuration`, `#progressBarBg`, `#progressBarFill`.
  - `#aboutSpotlightContainer`, `#aboutPhotoReveal`.
  - `#pillNavbar`, `#navIndicator`, `#sideNavRail`, `#sideNavPrev`, `#sideNavNext`.
  - `#btnCopyEmail`, `#btnOpenResume`, `#resumeModal`, `#btnCloseResume`, `#btnModalCloseSecondary`.
- **Safety Guarantee**: Every DOM reference in `src/main.js` has a verified element in `index.html`.

### Vite Bundler ↔ Vercel
- **Base URL**: `base: '/'` in `vite.config.js`.
- **Build Output**: `dist/` containing `dist/index.html` and `dist/assets/*`.
- **Headers & Routing (`vercel.json`)**:
  - Rewrites: `source: "/(.*)"`, `destination: "/index.html"`.
  - Cache Control: `public, max-age=31536000, immutable` for `/assets/(.*)`.

---

## Code Layout
- `c:\laragon\www\projekmandiri\portof\index.html` — Authoritative single-page markup & 100% content.
- `c:\laragon\www\projekmandiri\portof\src\style.css` (and mirror `style.css`) — Authoritative styles and design tokens.
- `c:\laragon\www\projekmandiri\portof\src\main.js` (and mirror `script.js`) — Authoritative interactive logic & canvas rendering.
- `c:\laragon\www\projekmandiri\portof\vite.config.js` — Vite configuration.
- `c:\laragon\www\projekmandiri\portof\vercel.json` — Vercel configuration.
- `c:\laragon\www\projekmandiri\portof\.gitignore` — Git ignore configuration.
- `c:\laragon\www\projekmandiri\portof\public\assets\` — Clean assets (`christopher-base-cutout.png`, `christopher-base.jpg`, `profile.jpg`). Deprecated Reyna assets purged.
