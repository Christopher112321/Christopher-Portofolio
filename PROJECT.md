# Project: Portfolio Pure B&W Monochrome Revamp, 3D Flip Cards & Lanyard Badge

## Architecture
- **Framework & Stack**: Pure Vanilla HTML5, Modern CSS3 with 3D Transforms (`preserve-3d`, `perspective`), and Modular ES6 JavaScript bundled via Vite 6.2.0. No heavy frontend framework dependencies.
- **Component & DOM Structure**: Single Page Application structure in `index.html`:
  - Global Overlays: Precision Cursor (`#cursorDot`, `#cursorRing`), Ambient Monochrome Canvas (`#bgCanvas`), Intro Loading Screen (`#introScreen`), and CV Modal (`#resumeModal`).
  - Navigation Systems: Floating Top Monochrome Glass Navbar (`#pillNavbar`) and Vertical Side Rail Navigation (`#sideNavRail`).
  - Core Content Sections:
    - Hero (`#home`): Bio narrative, CTAs, and Interactive 3D Physics Lanyard Pass Badge (`#lanyardPassCard`) replacing the obsolete Spotify player widget.
    - About Me (`#about`): Developer narrative and monochrome spotlight reveal.
    - Portfolio Showcase (`#portfolio`): 3D Liquid Glass Flip Cards (`#project-internmatch` and `#project-mysembako`) featuring dual faces (Front: preview image, title, tags, direct live app button, flip button; Back: full case study text, technical contributions, challenges, GitHub repo links, back flip button).
    - Contact Channels (`#contact`): 4 direct channels (Email copy, GitHub, LinkedIn, Instagram).
    - Footer & Accessible CV Modal.
- **Data Flow & State Management**:
  - Content statically maintained in `index.html` ensuring 100% preservation.
  - Interactive state (loading progression, 3D card flipping, lanyard pass physics, active section scroll-spying, modal dialog, and clipboard operations) handled in `src/main.js`.
  - Design tokens and component theming centralized in `src/style.css` (mirrored to root `style.css` for static compatibility).
- **Deployment Architecture**:
  - Build System: Vite Bundler (`npm run build`) compiling to `dist/`.
  - Hosting: Vercel Static Hosting (`base: '/'` in `vite.config.js`, `vercel.json` rewrites and cache headers).

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Pure Monochrome B&W Theme | High-contrast black & white palette across backgrounds, text, borders, glass cards, and controls | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Cabinet Grotesk Typography | Import Cabinet Grotesk font and apply to headings and display elements | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Monochrome Canvas & Cursor | Retheme `#bgCanvas` particles/grid and `#cursorDot`/`#cursorRing` to pure monochrome silver/white/gray | M1 | ORIGINAL_REQUEST §R1 |
| 4 | 3D Liquid Glass Flip Cards | Convert `#project-internmatch` and `#project-mysembako` to 3D liquid glass flip cards | M2 | ORIGINAL_REQUEST §R2 |
| 5 | Direct Live App Buttons | Direct link on front card face to open live Vercel deployments in new tab | M2 | ORIGINAL_REQUEST §R2 |
| 6 | 3D Flip Trigger & Case Study Back Face | Smooth 3D flip button revealing complete preserved case study text and GitHub links | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Spotify Widget Removal | Remove obsolete Spotify player markup (`#spotifyCard`, `#vinylDisc`, `#btnPlayPause`, `#progressBarBg`) and script logic | M3 | ORIGINAL_REQUEST §R3 |
| 8 | Interactive 3D Physics Lanyard Pass | Interactive 3D physics-enabled Christopher Theo ID lanyard badge with drag/tilt dynamics | M3 | ORIGINAL_REQUEST §R3 |
| 9 | 100% Content Preservation | Preserve all case study content, affiliations, skills, links, and structure verbatim | M4 | ORIGINAL_REQUEST §R4 |
| 10 | Automated Test Suite Update | Update `test/e2e-verify.js`, `test/challenger-suite.js`, `test/adversarial-stress.js` for new features | M4 | ORIGINAL_REQUEST §R5 |
| 11 | Build & Test Zero-Error Verification | Verify `npm run build` exits 0 and `npm test` passes 100% with zero failures | M4 | ORIGINAL_REQUEST §R4, R5 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Monochrome B&W Theme & Cabinet Grotesk | Pure black & white `:root` palette, Cabinet Grotesk font integration, monochrome canvas & cursor | none | DONE |
| M2 | 3D Liquid Glass Flip Cards | Card 3D flip markup, front/back faces, direct live links, flip animations, 100% content | M1 | DONE |
| M3 | Interactive 3D Physics Lanyard Pass Badge | Remove Spotify widget, integrate Christopher Theo 3D physics lanyard pass badge | M1, M2 | DONE |
| M4 | Automated Test Suites & Regression Verification | Comprehensive multi-suite verification, build verification, and full gate review | M1, M2, M3 | DONE |

---

## Interface Contracts
### `src/style.css` ↔ `index.html`
- Typography: `@import` and `<link>` for Cabinet Grotesk; applied via `var(--font-display)` to headings and display elements.
- Palette Tokens: Pure high-contrast monochrome (pitch black `#000000`, white `#ffffff`, neutral grays).
- Flip Card Classes: `.flip-card-wrapper`, `.flip-card-inner`, `.flip-card-front`, `.flip-card-back`, `.btn-flip-trigger`, `.btn-flip-back`, `.btn-live-project`.
- Lanyard Badge Classes: `.lanyard-pass-container`, `.lanyard-strap`, `.lanyard-badge`, `.lanyard-badge-inner`, `.lanyard-hologram`.

### `src/main.js` ↔ `index.html`
- Flip Card Interactions: Event listeners for `.btn-flip-trigger` and `.btn-flip-back` toggling `.is-flipped` state on the respective card container, supporting both click and keyboard triggers.
- Lanyard Physics: Inertia / spring / tilt physics responding to mouse movement or drag interaction on `#lanyardPassCard`.
- Removal of dead Spotify selectors: No references to `#spotifyCard`, `#vinylDisc`, `#btnPlayPause`, `#progressBarBg` in JavaScript.

---

## Code Layout
- `c:\laragon\www\projekmandiri\portof\index.html` — Authoritative single-page HTML.
- `c:\laragon\www\projekmandiri\portof\src\style.css` (and mirror `style.css`) — Authoritative styles and design tokens.
- `c:\laragon\www\projekmandiri\portof\src\main.js` (and mirror `script.js`) — Authoritative interactive script logic.
- `c:\laragon\www\projekmandiri\portof\test\e2e-verify.js` — E2E verification test suite.
- `c:\laragon\www\projekmandiri\portof\test\challenger-suite.js` — Empirical challenger test suite.
- `c:\laragon\www\projekmandiri\portof\test\adversarial-stress.js` — Adversarial stress test suite.
- `c:\laragon\www\projekmandiri\portof\test\m1-verify.js` — Milestone 1 verification suite.
- `c:\laragon\www\projekmandiri\portof\test\m2-verify.js` — Milestone 2 verification suite.
- `c:\laragon\www\projekmandiri\portof\test\m3-verify.js` — Milestone 3 verification suite.
- `c:\laragon\www\projekmandiri\portof\test\challenger-gate1.js` — Challenger Gate 1 adversarial suite.
- `c:\laragon\www\projekmandiri\portof\test\challenger-gate2.js` — Challenger Gate 2 adversarial suite.
- `c:\laragon\www\projekmandiri\portof\vite.config.js` — Vite configuration.
