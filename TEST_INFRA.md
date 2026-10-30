# Test Infrastructure & Automated Verification Harness

**Target Project**: Christopher Theo Purnomo Portfolio Retheming & Vercel Deployment  
**Test Harness Version**: 2.0.0 (Generation 2)  
**Execution Command**: `npm test` or `node test/e2e-verify.js`  
**Runtime**: Pure Node.js (v18+ compatible, tested on Node v22.20.0) with zero external test runtime dependencies.

---

## 1. Overview & Architecture

The test harness provides an automated, forensic, end-to-end verification system that acts as an independent authoritative oracle for all functional, aesthetic, interactive, and deployment requirements specified in `ORIGINAL_REQUEST.md` and `PROJECT.md`.

### Core Engineering Principles
1. **Zero External Dependencies**: Operates natively via Node.js built-ins (`node:fs`, `node:path`, `node:child_process`, `node:url`), avoiding flaky headless browser setups, long startup times, or external npm test runner installations.
2. **Oracle-Derived Assertions**: Every expected value is directly derived from `ORIGINAL_REQUEST.md`, `PROJECT.md`, and the authoritative content survey reports (`teamwork_explorer_survey_1` through `3`).
3. **No Facade Testing**: The suite rigorously inspects source DOM structures, active stylesheet design tokens, JavaScript physics and particle routines, and real build output bundles.
4. **Fast Feedback Loop**: Executes 52 granular assertions across all 4 tiers—including a complete Vite production compilation (`npm run build`)—in under 3.5 seconds.
5. **Deterministic Diagnostics**: When a test fails, the runner reports the exact file, line, detected value vs. expected value, and the corresponding remediation guidance.

---

## 2. Directory & File Layout

```text
portof/
├── test/
│   └── e2e-verify.js          # Authoritative test harness & runner
├── TEST_INFRA.md              # Infrastructure specification (this document)
├── TEST_READY.md              # Readiness publication & baseline run metrics
├── package.json               # Configured with "test": "node test/e2e-verify.js"
├── index.html                 # Main SPA entry point (DOM & content)
├── src/
│   ├── style.css              # Centralized stylesheet & design tokens
│   └── main.js                # Interactive logic & canvas physics
├── vite.config.js             # Vite build configuration (base: '/')
└── vercel.json                # Vercel deployment & routing configuration
```

---

## 3. Tier Coverage & Verification Specifications

The test suite evaluates the codebase across 4 strictly isolated tiers:

### Tier 1: 100% Content Preservation (24 Assertions)
Guarantees zero data loss across the portfolio retheming process.
- **T1.1 – T1.4 (Document Metadata & SEO)**: Verifies browser `<title>`, `<meta name="description">`, `<meta name="author">`, and OpenGraph properties (`og:title`, `og:description`).
- **T1.5 (Core DOM Structure)**: Confirms structural presence of `#home`, `#about`, `#portfolio`, `#contact`, and `footer`.
- **T1.6 – T1.11 (Hero Section Content)**: Asserts affiliation badge (`Unika Soegijapranata — Semarang`), display heading `<h1>`, role subheading (`Informatics Student & Software Builder`), full hero bio narrative, primary/secondary CTAs (`Lihat Proyek`, `Ringkasan Resume`), and quick metrics strip (`DOMISILI & KAMPUS`, `BIDANG FOKUS`).
- **T1.12 – T1.13 (Navigation Content)**: Validates navigation links to `#home`, `#about`, `#portfolio`, `#contact`, and side navigation rail structure.
- **T1.14 – T1.18 (About Section Content)**: Validates section label `01 // ABOUT ME`, tagline, narrative paragraphs 1 & 2 verbatim, 3 Focus Area cards (`01 Decision Support Systems`, `02 Full-Stack & Web Systems`, `03 Applied AI/ML & IoT`), and the complete 4-category technical skills matrix (Core Languages, Web & Frameworks, Database Layer, DSS & Systems).
- **T1.19 – T1.21 (Portfolio Section Content)**: Asserts section label and full text blocks for Case Study 1 (`InternMatch DSS` — Problem context, contribution, AHP/TOPSIS/MCDM methodology, tech tags, challenges, insights) and Case Study 2 (`MySembako` — Problem context, contribution, FIFO inventory, ACID transactions, tech tags, challenges, insights).
- **T1.22 (Contact Channels)**: Validates all 4 direct channels: Email (`chris.theo.purnomo@gmail.com`), GitHub (`github.com/christophertheop`), LinkedIn (`linkedin.com/in/christopher-theo-purnomo`), and Instagram (`@chris_theo.p`).
- **T1.23 (Footer Content)**: Asserts author name, university affiliation, and tech stamp (`Semarang, ID // Hand-crafted with Vite + Vanilla JS`).
- **T1.24 (Curriculum Vitae Modal)**: Asserts modal title, education, projects summary, technical skills, and PDF mailto CTA link.

### Tier 2: Boundary & Aesthetic Constraints (Reyna De-Theming) (11 Assertions)
Guarantees complete elimination of Valorant Reyna lore, game assets, and purple/magenta styling tokens.
- **T2.1 (Disk Assets Cleanup)**: Confirms official Riot Games character cutouts (`reyna-official-cutout.png`, `reyna-official-raw.png`) are deleted from `public/assets/` and root `assets/`.
- **T2.2 (HTML Asset References)**: Confirms `index.html` contains zero references to `christopher-reyna-cutout.png` or `christopher-reyna.jpg`.
- **T2.3 (HTML CSS Classes)**: Confirms complete absence of Reyna-specific classes: `.reyna-intro`, `.reyna-particle-canvas`, `.reyna-shadow-hands`, `.shadow-hand`, `.reyna-vignette`, `.reyna-eye-icon`, `.val-dot`, `.reyna-aura-backdrop`, `.about-reyna-reveal-wrapper`, `.about-reyna-img`.
- **T2.4 (Lore & Text Absence)**: Confirms zero occurrences of `VALORANT`, `Die For You`, or `Reyna` text in visible content, Spotify card, or metadata.
- **T2.5 (OpenGraph Image Cleanliness)**: Verifies `og:image` references clean portrait photography, not Reyna artwork.
- **T2.6 – T2.8 (CSS Design Tokens & Hex Values)**: Confirms `src/style.css` contains zero `--accent-magenta`, `--reyna-flame`, or `--border-reyna` variables; verifies zero active magenta (`#d946ef`) or flame (`#e879f9`) hex values; confirms `:root` `--accent` is modernized away from Empress violet (`#a855f7`).
- **T2.9 – T2.10 (JavaScript Particle Logic)**: Confirms `src/main.js` has zero `SoulOrb`, `EnergyWisp`, or `RadianiteMote` particle classes, and contains zero hardcoded magenta `rgb(217, 70, 239)` or violet `rgb(168, 85, 247)` color math.
- **T2.11 (Base Path Configuration)**: Asserts `vite.config.js` configures `base: '/'` for root-domain Vercel deployment.

### Tier 3: Cross-Feature & State Interactivity (11 Assertions)
Guarantees all interactive components, canvas physics, and accessibility features are intact and functional.
- **T3.1 – T3.3 (Intro Loading Screen)**: Confirms `#introScreen`, `#loadingPercent`, `#loadingBarFill`, and shutters (`.intro-shutter-top`, `.intro-shutter-bottom`) exist; verifies ambient particle canvas is present; confirms shadow claws and eye icon are removed.
- **T3.4 – T3.5 (Ambient Canvas & Cursor)**: Confirms desktop precision cursor elements (`#cursorDot`, `#cursorRing`) and interactive background canvas (`#bgCanvas`) exist in DOM.
- **T3.6 (Spotify Card Widget)**: Confirms interactive music widget controls exist (`#spotifyCard`, `#vinylDisc`, `#btnPlayPause`, `#timeCurrent`, `#timeTotal`/`#timeDuration`, `#progressBarBg`, `#progressBarFill`).
- **T3.7 (About Spotlight Container)**: Confirms `#aboutSpotlightContainer` and clean base portrait layer exist.
- **T3.8 (Dual Navigation Systems)**: Confirms top pill navbar (`#pillNavbar`, `#navIndicator`) and vertical side rail (`#sideNavRail`, `#sideNavPrev`, `#sideNavNext`) exist.
- **T3.9 (CV Modal Accessibility)**: Verifies `#resumeModal` has accessibility attributes `role="dialog"` and `aria-modal="true"`.
- **T3.10 (Action Triggers)**: Asserts `#btnCopyEmail`, `#btnOpenResume`, `#btnCloseResume`, and `#btnModalCloseSecondary` buttons exist in markup.
- **T3.11 (DOM Contract Binding Integrity)**: Performs cross-file validation ensuring all `document.getElementById` targets in `src/main.js` exist in `index.html` to eliminate runtime null-pointer crashes.

### Tier 4: Real-World Deployment & Build (6 Assertions)
Guarantees that the repository builds cleanly and conforms to Vercel production hosting standards.
- **T4.1 (Vercel Configuration)**: Asserts `vercel.json` exists, is valid JSON, contains root SPA rewrite (`/(.*) -> /index.html`), and specifies immutable cache headers for `/assets/(.*)`.
- **T4.2 (Git Configuration)**: Asserts `.gitignore` excludes `node_modules` and `dist`.
- **T4.3 (Production Build Execution)**: Executes `npm run build` synchronously; asserts exit code 0 and clean build output.
- **T4.4 – T4.5 (Build Bundle Output)**: Asserts creation of `dist/index.html` and `dist/assets/` containing production `.js` and `.css` bundles.
- **T4.6 (Root Domain Asset Paths)**: Scans `dist/index.html` to guarantee zero broken `/portof/` path prefixes.

---

## 4. How to Run the Tests

### Standard Execution
```bash
# Run all 52 tests across all 4 tiers
npm test

# Alternatively run directly via Node.js
node test/e2e-verify.js
```

### Targeted Execution & Flags
```bash
# Run a specific tier only (e.g., Tier 1 Content Preservation)
node test/e2e-verify.js --tier=1

# Run Tier 2 (Reyna De-theming)
node test/e2e-verify.js --tier=2

# Run without executing the Vite build (fast unit check)
node test/e2e-verify.js --no-build
```

---

## 5. Exit Codes & CI Semantics

- **Exit Code `0`**: All 52 tests passed. The repository satisfies all project requirements and is production-ready for deployment to Vercel.
- **Exit Code `1`**: One or more assertions failed. Detailed failure logs pinpoint the exact file, missing token, or un-rethemed property.
