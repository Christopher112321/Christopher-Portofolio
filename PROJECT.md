# Project: RUSHES Cinematic Editorial Portfolio Redesign

## Architecture
- **Tech Stack**: Vanilla HTML5, Modern CSS3 with Three-Layer Design Tokens, ES6 JavaScript, bundled via Vite 6.2.0+.
- **Design Reference**: RUSHES by Marta Koziarz on Framer (`https://www.framer.com/marketplace/templates/rushes/`, `https://rushes.framer.website/`).
- **Core Principles**:
  - Dark Cinematic Editorial Aesthetic: Deep Obsidian canvas (`#0a0a0a`), Pitch Black base (`#050505`), Warm Ivory typography (`#f4f2ed`), Cine Amber primary accent (`#e2612f`), Tactical Red recording indicators (`#c22e1f`), and Hairline Slate borders (`rgba(154, 154, 158, 0.2)` / `rgba(255, 255, 255, 0.12)`).
  - Tri-Stack Typography: Space Grotesk (display titles and section headings), Inter (humanist editorial body copy), and JetBrains Mono / Space Mono (cinematic HUD metadata, timecodes, coordinates, telemetry).
  - Cinematic HUD Elements: Viewfinder corner brackets (`┌ ┐ └ ┘`), crosshairs (`+`), live timecodes (`[00:00:00:00]`), recording pulse (`REC ●`), lens metadata (`24FPS`, `ISO 800`, `SHUTTER 180°`), and geographical coordinate tags (`SEMARANG, ID // LAT: -7.0051, LON: 110.4381`).
  - Camera Boot Loading Screen HUD: Rethemes intro loading screen to an optical camera boot & HUD calibration sequence while preserving the exact 2400ms duration, ease-out-cubic RAF, 300ms hold, and 850ms shutter release.
  - Featured Projects Showcase: Prominently showcases **MySembako** (`https://mysembako.vercel.app`, `https://github.com/Christopher112321/mysembako`) and **InternMatch DSS** (`https://internmatch-dss.vercel.app`, `https://github.com/Christopher112321/internmatch-dss`) with widescreen editorial cards and all 12 case study blocks.
  - Photo Integration: Christopher Theo's photos from `assets/` (`christopher-base.jpg`, `christopher-base-cutout.png`, `profile-augmented.jpg`, `profile.jpg`) integrated into hero badge, about spotlight HUD frame, and CV modal.
  - 100% Verbatim Content Retention: All personal details, bio narrative, focus areas, 4 skills matrix categories, 17 tech tags, metrics, and external links strictly preserved.
  - Dual-File Mirroring Contract: `src/style.css` ↔ `style.css` and `src/main.js` ↔ `script.js` must remain byte-for-byte identical (verified by SHA256).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | RUSHES Three-Layer CSS Tokens | Primitive, semantic, and component tokens for Obsidian `#0a0a0a`, Ivory `#f4f2ed`, Cine Amber `#e2612f`, Tactical Red `#c22e1f`, and hairline borders | M1 | Survey 2 |
| 2 | Tri-Stack Typography Hierarchy | Space Grotesk (headings), Inter (body), JetBrains Mono (HUD/timecodes/metadata) | M1 | Survey 2 |
| 3 | Camera Boot Loading Screen HUD | Rethemed optical camera boot sequence preserving exact 2400ms timing, ease-out-cubic RAF, 300ms hold, and 850ms shutter release | M1 | R2, Survey 1, Survey 2 |
| 4 | Cinematic Navigation Rails | Floating pill navbar blur(54px) with hairline border, active indicator, and vertical side rail with section counter (`01 / 04`) | M1 | Survey 1, Survey 2 |
| 5 | Cinematic Hero Section | Large display typography, affiliation badge, status telemetry (`REC ●`, `24FPS`), bio narrative, action CTAs, and quick metrics strip | M1 | R1, Survey 1, Survey 3 |
| 6 | Hero Cinematic Pass Badge | Interactive badge using `assets/christopher-base.jpg`, DEV PASS 2026 branding, barcode, and optical telemetry | M1 | R4, Survey 3 |
| 7 | About Section Cinematic Bento & Spotlight | Narrative bio blocks, focus areas (01 DSS, 02 Web Systems, 03 AI/ML & IoT), and interactive HUD frame using `assets/christopher-base-cutout.png` & `assets/profile-augmented.jpg` | M1 | R1, R4, Survey 3 |
| 8 | Technical Skills Matrix HUD Pills | 4 categorized skills groups with technical tags styled in HUD telemetry pill badges | M1 | R1, Survey 3 |
| 9 | InternMatch DSS Featured Showcase Card | Widescreen editorial card with live link, repo link, AHP/TOPSIS visual matrix, and 6 case study blocks | M1 | R1, R3, Survey 3 |
| 10 | MySembako Featured Showcase Card | Widescreen editorial card with live link, repo link, FIFO inventory preview, and 6 case study blocks | M1 | R1, R3, Survey 3 |
| 11 | Contact Channels & Minimalist Footer | 4-channel contact grid (Email with 1-click clipboard copy, GitHub, LinkedIn, Instagram) and cinematic footer | M1 | R1, Survey 3 |
| 12 | CV Modal Cinematic HUD Restyle | Accessible modal with `assets/profile.jpg`, education, projects, skills, and close triggers | M1 | R1, R4, Survey 3 |
| 13 | Dual-File Synchronization | Byte-for-byte SHA256 mirroring between `src/` and root files (`src/style.css` ↔ `style.css`, `src/main.js` ↔ `script.js`) | M1 | Survey 1 |
| 14 | E2E Test Suite Hardening & Alignment | Update/harden test suites in `test/` to verify RUSHES tokens, typography, HUD elements, photo assets, project links, and content retention | M2 | R5, Survey 1 |
| 15 | Multi-Agent Swarm Verification & Forensic Audit | Production build exit code 0, 100% pass across Reviewers, Challengers, and Forensic Auditor CLEAN verdict | M2 | R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | RUSHES Cinematic Editorial Implementation | Core tokens, typography, HUD elements, hero, about, skills, featured project showcases (MySembako & InternMatch DSS), camera boot loading screen HUD, photo integration, and dual-file sync | Survey Phase | DONE |
| M2 | Test Hardening, Swarm Verification & Forensic Audit | Test suite alignment, Vite production build, 2 Reviewers, 2 Challengers, and Forensic Auditor verification | M1 | DONE |

## Key Verification Results
- **Gate Result**: PASS (Unanimous APPROVE by Reviewer 1, Reviewer 2, Challenger 1, Challenger 2; CLEAN verdict by Forensic Auditor).
- **Automated Test Results**: Over 400 assertions passed (100% pass rate) across 8 test suites.
- **Production Build**: Vite 6.4.3 exit code 0 (`dist/index.html` 45.13 kB, `dist/assets/*.css` 58.94 kB, `dist/assets/*.js` 16.94 kB).
- **Dual-File SHA256 Mirroring**:
  - `src/style.css` = `style.css` (`657D2CE1831F196ACDC67CDCDABDEEFEFBC7F0AD14F3F118678EF316FB35F055`)
  - `src/main.js` = `script.js` (`3059DE955C1BE77DA20FF6FED59218FF066C8CB7E42044855DF95D2AA9DA9115`)
- **Content Preservation**: 100% verbatim retention of all personal info, technical skills, 12 case study blocks, and external links.
- **Intro Loading Screen**: 2400ms duration, 300ms hold, 850ms shutter unmount strictly preserved.
- **Featured Projects**: Verified live Vercel deployments and GitHub repos for MySembako and InternMatch DSS.
- **Photo Assets**: Integrated `christopher-base.jpg`, `christopher-base-cutout.png`, `profile-augmented.jpg`, and `profile.jpg`.

## Interface Contracts
### DOM Structure & Section IDs
- Section anchors `#home`, `#about`, `#portfolio`, `#contact` remain strictly intact.
- Intro loading screen elements `#introScreen`, `#loadingPercent`, `#loadingBarFill`, and shutter elements remain intact.
- Action buttons `#btnViewProjects`, `#btnOpenResume`, modal `#resumeModal` and close triggers remain intact.
- Featured project IDs `#project-internmatch` and `#project-mysembako` remain intact.

### Dual-File Mirroring Contract
- `src/style.css` ↔ `style.css` byte-for-byte identical (SHA256: `657D2CE1831F196ACDC67CDCDABDEEFEFBC7F0AD14F3F118678EF316FB35F055`).
- `src/main.js` ↔ `script.js` byte-for-byte identical (SHA256: `3059DE955C1BE77DA20FF6FED59218FF066C8CB7E42044855DF95D2AA9DA9115`).

### Timing & Sequence Contract
- Intro loading duration: 2400ms duration, ease-out-cubic counter progression.
- Terminal hold: 300ms hold at 100%.
- Shutter unmount: 850ms transition before DOM removal.

## Code Layout
- `index.html`: Main HTML entry point containing all section DOM elements, HUD markup, and metadata.
- `src/style.css`: Primary CSS file containing design tokens, HUD styles, and responsive breakpoints.
- `style.css`: Mirrored copy of `src/style.css` (enforced identical SHA256).
- `src/main.js`: Main JavaScript application logic (camera boot HUD, navigation, interactive badges, modal).
- `script.js`: Mirrored copy of `src/main.js` (enforced identical SHA256).
- `assets/`: Image assets (`profile.jpg`, `christopher-base.jpg`, `profile-augmented.jpg`, `christopher-base-cutout.png`).
- `public/assets/`: Public distribution mirror of image assets.
- `test/`: Verification test suites (`e2e-verify.js`, `challenger-gate2.js`, `adversarial-stress.js`, `challenger-suite.js`, etc.).
