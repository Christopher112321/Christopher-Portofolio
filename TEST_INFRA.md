# Test Infrastructure & Automated Verification Harness: RUSHES Cinematic Editorial

**Target Project**: Christopher Theo Purnomo Portfolio — RUSHES Cinematic Editorial Redesign  
**Test Harness Version**: 3.0.0 (RUSHES Generation)  
**Execution Command**: `npm test` or `node test/e2e-verify.js`  
**Runtime**: Pure Node.js (v18+ compatible, tested on Node v22) with zero external test runtime dependencies.

---

## 1. Overview & Architecture

The test harness provides an automated, forensic, end-to-end verification system acting as an independent authoritative oracle for all functional, aesthetic, interactive, and deployment requirements specified in `ORIGINAL_REQUEST.md` and `PROJECT.md`.

### Core Verification Principles
1. **100% Content Preservation**: Verifies that every single string of personal data, bio narrative, Unika Soegijapranata affiliation, Semarang location, 3 focus area cards, 4 skills categories & 17 tech tags, 12 case study blocks, contact links, and CV modal content remain intact verbatim.
2. **RUSHES Cinematic Aesthetic & Tokens**: Verifies that `src/style.css` and `index.html` implement RUSHES design tokens: Obsidian (`#0a0a0a`), Pitch Black (`#050505`), Cine Amber (`#e2612f`), Tactical Red (`#c22e1f`), and Hairline Slate borders (`rgba(154, 154, 158, 0.2)` / `rgba(255, 255, 255, 0.12)`).
3. **Tri-Stack Typography Hierarchy**: Verifies integration and application of `Space Grotesk` (display & headings), `Inter` (editorial body copy), and `JetBrains Mono` / monospace (cinematic HUD metadata, timecodes, coordinates, telemetry).
4. **Cinematic HUD Overlays**: Verifies presence of viewfinder corner brackets (`┌ ┐ └ ┘`), crosshairs (`+`), live timecodes, recording pulse (`REC ●`), and telemetry tags.
5. **Camera Boot Loading Screen HUD**: Verifies that the intro loading screen operates with cinematic HUD styling while strictly preserving the existing timing and sequence logic (2400ms duration, ease-out-cubic RAF, 300ms terminal hold, 850ms shutter release).
6. **Featured Projects Showcase**: Verifies prominent showcase of `MySembako` (`https://mysembako.vercel.app`, `https://github.com/Christopher112321/mysembako`) and `InternMatch DSS` (`https://internmatch-dss.vercel.app`, `https://github.com/Christopher112321/internmatch-dss`) with functional links and 12 case study blocks.
7. **Photo Integration**: Verifies integration of Christopher Theo's photos from `assets/` (`christopher-base.jpg`, `christopher-base-cutout.png`, `profile-augmented.jpg`, `profile.jpg`).
8. **Dual-File Mirroring Contract**: Verifies byte-for-byte SHA256 parity between `src/style.css` ↔ `style.css` and `src/main.js` ↔ `script.js`.
9. **Production Build Compatibility**: Verifies `npm run build` exits 0 and produces valid production bundles for Vercel root-domain deployment.

---

## 2. Tier Coverage Summary

| Tier | Name | Target Assertions | Description |
|:---:|:---|:---:|:---|
| **Tier 1** | Content Preservation | 24+ | Verifies 100% verbatim retention of all portfolio copy, bio, skills, case studies, links |
| **Tier 2** | Aesthetic & Design System | 15+ | Verifies RUSHES design tokens, Space Grotesk / Inter / Mono fonts, Cine Amber, HUD brackets |
| **Tier 3** | Interactivity & HUD Mechanics | 12+ | Verifies camera boot loader, pill navbar, side rail counter, modal, photo integration |
| **Tier 4** | Build & Deployment Verification | 6+ | Verifies `npm run build` exits 0, Vercel root compatibility, zero broken asset links |

---

## 3. How to Run the Tests

```bash
# Run all automated tests
npm test

# Run Challenger stress suites
node test/challenger-gate2.js
node test/adversarial-stress.js
```
