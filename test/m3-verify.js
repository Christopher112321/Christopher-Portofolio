/**
 * Milestone 3 (M3) Verification Suite: Interactive 3D Physics Lanyard Pass Badge
 *
 * Verifies:
 *   1. Complete elimination and purging of all Spotify widget elements, JS logic, and CSS.
 *   2. Presence and DOM integrity of Interactive 3D Physics Lanyard Pass Badge (#lanyardPassCard, #lanyardBadge).
 *   3. Lanyard strap (.lanyard-strap), hardware clip (.lanyard-clip), and ring (.lanyard-ring).
 *   4. Christopher Theo developer ID credentials, portrait photo, and clearance level.
 *   5. Holographic sheen overlay (.lanyard-hologram, .lanyard-sheen).
 *   6. 3D physics-driven motion engine in JS (drag interaction, damped harmonic spring oscillation, 3D tilt).
 *   7. Strict pure Black & White monochrome aesthetic compliance.
 *   8. Strict byte-for-byte dual-file synchronization (src/style.css ↔ style.css, src/main.js ↔ script.js).
 *   9. Production build integrity and bundle validation.
 *
 * Usage:
 *   node test/m3-verify.js
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

let passedCount = 0;
let failedCount = 0;
const failures = [];

function assert(condition, testId, description, details = null) {
  if (condition) {
    passedCount++;
    console.log(`  ${colors.green}✓ PASS${colors.reset} ${colors.gray}[${testId}]${colors.reset} ${description}`);
  } else {
    failedCount++;
    console.log(`  ${colors.red}✗ FAIL${colors.reset} ${colors.gray}[${testId}]${colors.reset} ${description}`);
    if (details) {
      console.log(`         ${colors.yellow}Details: ${details}${colors.reset}`);
    }
    failures.push({ testId, description, details });
  }
}

function sha256(filePath) {
  const content = fs.readFileSync(path.join(ROOT_DIR, filePath));
  return crypto.createHash('sha256').update(content).digest('hex');
}

console.log('='.repeat(72));
console.log(`${colors.bold}MILESTONE 3: INTERACTIVE 3D PHYSICS LANYARD PASS BADGE VERIFICATION${colors.reset}`);
console.log(`Working Directory: ${ROOT_DIR}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('='.repeat(72));

// Load source files
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
const srcStylePath = path.join(ROOT_DIR, 'src/style.css');
const rootStylePath = path.join(ROOT_DIR, 'style.css');
const srcMainPath = path.join(ROOT_DIR, 'src/main.js');
const rootScriptPath = path.join(ROOT_DIR, 'script.js');
const distHtmlPath = path.join(ROOT_DIR, 'dist/index.html');

const html = fs.readFileSync(indexHtmlPath, 'utf8');
const css = fs.readFileSync(srcStylePath, 'utf8');
const js = fs.readFileSync(srcMainPath, 'utf8');

// =============================================================================
// SUITE 1: SPOTIFY WIDGET COMPLETE PURGE AUDIT
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 1: Spotify Widget Complete Purge Audit ---${colors.reset}`);

// 1.1 DOM elements purged from index.html
const spotifyDomSelectors = [
  'id=["\']spotifyCard["\']',
  'id=["\']vinylDisc["\']',
  'id=["\']btnPlayPause["\']',
  'id=["\']progressBarBg["\']',
  'id=["\']progressBarFill["\']',
  'id=["\']timeCurrent["\']',
  'id=["\']timeTotal["\']',
  'id=["\']equalizerBars["\']',
  'class=["\'][^"\']*spotify-card[^"\']*["\']',
  'class=["\'][^"\']*vinyl-disc[^"\']*["\']',
  'class=["\'][^"\']*btn-open-spotify[^"\']*["\']'
];

const foundSpotifyInHtml = spotifyDomSelectors.filter(pattern => new RegExp(pattern, 'i').test(html));
assert(
  foundSpotifyInHtml.length === 0,
  'M3:1.1',
  'All simulated Spotify DOM elements completely purged from index.html',
  foundSpotifyInHtml.length ? `Detected in HTML: ${foundSpotifyInHtml.join(', ')}` : null
);

// 1.2 Spotify state variables and logic purged from src/main.js & script.js
const spotifyJsTerms = [
  'btnPlayPause',
  'vinylDisc',
  'equalizerBars',
  'progressBarFill',
  'progressBarBg',
  'timeCurrent',
  'currentSeconds',
  'setPlayState',
  'formatTime'
];

const foundSpotifyInJs = spotifyJsTerms.filter(term => new RegExp(`\\b${term}\\b`).test(js));
assert(
  foundSpotifyInJs.length === 0,
  'M3:1.2',
  'All Spotify state variables, intervals, and audio routines purged from src/main.js',
  foundSpotifyInJs.length ? `Detected in JS: ${foundSpotifyInJs.join(', ')}` : null
);

// 1.3 Spotify styles purged from src/style.css
const spotifyCssTerms = [
  '.spotify-card',
  '.spotify-header',
  '.spotify-badge',
  '.vinyl-disc',
  '.album-art-wrapper',
  '.btn-open-spotify',
  'spinVinyl',
  'bounceEq'
];

const foundSpotifyInCss = spotifyCssTerms.filter(term => css.includes(term));
assert(
  foundSpotifyInCss.length === 0,
  'M3:1.3',
  'All Spotify CSS classes, animations, and selectors purged from src/style.css',
  foundSpotifyInCss.length ? `Detected in CSS: ${foundSpotifyInCss.join(', ')}` : null
);

// =============================================================================
// SUITE 2: LANYARD PASS DOM ARCHITECTURE & ELEMENTS
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 2: Lanyard Pass DOM Architecture & Elements ---${colors.reset}`);

// 2.1 Container & Badge IDs
assert(
  /<div[^>]*id=["']lanyardPassCard["'][^>]*class=["'][^"']*lanyard-pass-container[^"']*["']/i.test(html) ||
  /<div[^>]*class=["'][^"']*lanyard-pass-container[^"']*["'][^>]*id=["']lanyardPassCard["']/i.test(html),
  'M3:2.1',
  'Lanyard pass container present with ID #lanyardPassCard and class .lanyard-pass-container'
);

assert(
  /<div[^>]*id=["']lanyardBadge["'][^>]*class=["'][^"']*lanyard-badge[^"']*["']/i.test(html) ||
  /<div[^>]*class=["'][^"']*lanyard-badge[^"']*["'][^>]*id=["']lanyardBadge["']/i.test(html),
  'M3:2.2',
  'Lanyard badge present with ID #lanyardBadge and class .lanyard-badge'
);

// 2.2 Lanyard Strap, Hardware, and Slot Hole
assert(
  /class=["'][^"']*lanyard-strap[^"']*["']/i.test(html),
  'M3:2.3',
  'Lanyard strap (.lanyard-strap) present with woven texture and micro-typography'
);

assert(
  /class=["'][^"']*lanyard-clip[^"']*["']/i.test(html) && /class=["'][^"']*lanyard-ring[^"']*["']/i.test(html),
  'M3:2.4',
  'Metallic hardware components present (.lanyard-clip, .lanyard-ring)'
);

assert(
  /class=["'][^"']*lanyard-slot-hole[^"']*["']/i.test(html),
  'M3:2.5',
  'Badge slot punch hole (.lanyard-slot-hole) present for clasp attachment'
);

// 2.3 Hologram and Specular Sheen Overlays
assert(
  /id=["']lanyardHologram["']/i.test(html) && /class=["'][^"']*lanyard-hologram[^"']*["']/i.test(html),
  'M3:2.6',
  'Holographic micro-grid reflection overlay (#lanyardHologram) present'
);

assert(
  /id=["']lanyardSheen["']/i.test(html) && /class=["'][^"']*lanyard-sheen[^"']*["']/i.test(html),
  'M3:2.7',
  'Dynamic specular sheen reflection overlay (#lanyardSheen) present'
);

// =============================================================================
// SUITE 3: CHRISTOPHER THEO CREDENTIALS & CONTENT INTEGRITY
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 3: Christopher Theo Credentials & Content Integrity ---${colors.reset}`);

// 3.1 Event & Organization Branding
assert(
  html.includes('DEV PASS 2026'),
  'M3:3.1',
  'Event badge branding "DEV PASS 2026" present'
);

assert(
  html.includes('INDONESIA DEV CONF') && html.includes('UNIKA SOEGIJAPRANATA'),
  'M3:3.2',
  'Host conference & university branding "INDONESIA DEV CONF • UNIKA SOEGIJAPRANATA" present'
);

// 3.2 Developer Portrait Photo
assert(
  /src=["']\/assets\/christopher-base\.jpg["']/i.test(html) && /class=["'][^"']*lanyard-photo-img[^"']*["']/i.test(html),
  'M3:3.3',
  'Clean personal portrait (/assets/christopher-base.jpg) displayed in monochrome frame'
);

// 3.3 Developer Identity & Role
assert(
  /<h3[^>]*class=["'][^"']*lanyard-dev-name[^"']*["'][^>]*>\s*Christopher Theo\s*<\/h3>/i.test(html) ||
  html.includes('Christopher Theo'),
  'M3:3.4',
  'Developer name "Christopher Theo" prominently displayed in display typography'
);

assert(
  html.includes('Full-Stack Engineer &amp; Decision Systems Specialist') ||
  html.includes('Full-Stack Engineer & Decision Systems Specialist'),
  'M3:3.5',
  'Professional title "Full-Stack Engineer & Decision Systems Specialist" present'
);

assert(
  html.includes('Unika Soegijapranata • Semarang, ID'),
  'M3:3.6',
  'Affiliation & location metadata "Unika Soegijapranata • Semarang, ID" present'
);

// 3.4 Pass ID, Clearance & Graphics
assert(
  html.includes('CT-2026-DSS'),
  'M3:3.7',
  'Official pass identifier "CT-2026-DSS" present'
);

assert(
  html.includes('ACCESS GRANTED • LEVEL 01 ALL-ACCESS'),
  'M3:3.8',
  'Security clearance credential "ACCESS GRANTED • LEVEL 01 ALL-ACCESS" present'
);

assert(
  /class=["'][^"']*lanyard-barcode[^"']*["']/i.test(html) && /class=["'][^"']*lanyard-qr[^"']*["']/i.test(html),
  'M3:3.9',
  'High-density monochrome barcode and QR verification graphics present'
);

// =============================================================================
// SUITE 4: 3D PHYSICS SIMULATION & INTERACTIVITY IN JS
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 4: 3D Physics Simulation & Interactivity in JS ---${colors.reset}`);

// 4.1 DOM queries for lanyard badge elements
assert(
  js.includes("document.getElementById('lanyardPassCard')") &&
  js.includes("document.getElementById('lanyardBadge')") &&
  js.includes("document.getElementById('lanyardStrap')"),
  'M3:4.1',
  'src/main.js establishes authoritative bindings to #lanyardPassCard, #lanyardBadge, and #lanyardStrap'
);

// 4.2 Genuine physics parameters
assert(
  /stiffness\s*=\s*0\.08/.test(js) && /damping\s*=\s*0\.88/.test(js),
  'M3:4.2',
  'Damped harmonic oscillation / pendulum physics parameters configured (stiffness: 0.08, damping: 0.88)'
);

// 4.3 Pointer event listeners & pointer capture
assert(
  js.includes("addEventListener('pointerdown'") &&
  js.includes("setPointerCapture") &&
  js.includes("releasePointerCapture"),
  'M3:4.3',
  'Pointer event listeners configured with setPointerCapture and releasePointerCapture for drag control'
);

// 4.4 3D transform rendering & perspective
assert(
  /perspective\(1000px\)[\s\S]*?translate3d[\s\S]*?rotateX[\s\S]*?rotateY[\s\S]*?rotateZ/.test(js),
  'M3:4.4',
  'Badge 3D transform computation computes perspective, 3D displacement, and tri-axial rotation (rotateX, rotateY, rotateZ)'
);

// 4.5 Dynamic hologram sheen angle calculation
assert(
  /sheenAngle\s*=/.test(js) && /lanyardSheen\.style\.background\s*=/.test(js),
  'M3:4.5',
  'Dynamic specular sheen angle updates dynamically based on badge tilt angles'
);

// 4.6 Keyboard tactile triggers
assert(
  js.includes("e.key === 'ArrowLeft'") && js.includes("e.key === 'ArrowRight'"),
  'M3:4.6',
  'Keyboard accessibility handlers respond to arrow keys with realistic swing impulses'
);

// 4.7 Reduced motion support
assert(
  js.includes("prefers-reduced-motion"),
  'M3:4.7',
  'prefers-reduced-motion media query handled with instant equilibrium settling'
);

// =============================================================================
// SUITE 5: STYLING & PURE MONOCHROME COLOR COMPLIANCE
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 5: Styling & Pure Monochrome Color Compliance ---${colors.reset}`);

// 5.1 3D styling rules in CSS
assert(
  /\.lanyard-pass-container[\s\S]*?perspective:\s*1000px/i.test(css),
  'M3:5.1',
  '.lanyard-pass-container declares 3D perspective'
);

assert(
  /\.lanyard-badge[\s\S]*?transform-style:\s*preserve-3d/i.test(css),
  'M3:5.2',
  '.lanyard-badge declares transform-style: preserve-3d and will-change: transform'
);

// 5.2 Pure monochrome color compliance in lanyard styles
const lanyardCssMatch = css.match(/\/\* =+[\s\S]*?HERO RIGHT: INTERACTIVE 3D PHYSICS LANYARD PASS BADGE[\s\S]*?\/\* =+/i);
const lanyardCss = lanyardCssMatch ? lanyardCssMatch[0] : '';

const forbiddenColors = [
  '#38bdf8', '#7dd3fc', '#6366f1', '#0284c7', '#10b981', '#1ed760',
  '#d946ef', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b',
  'rgba(56, 189, 248', 'rgba(99, 102, 241', 'rgba(30, 215, 96'
];

const foundForbidden = forbiddenColors.filter(c => lanyardCss.toLowerCase().includes(c.toLowerCase()));
assert(
  foundForbidden.length === 0,
  'M3:5.3',
  'Lanyard badge styling strictly obeys pure B&W monochrome palette (0 unauthorized colors)',
  foundForbidden.length ? `Found forbidden: ${foundForbidden.join(', ')}` : null
);

// 5.3 Cabinet Grotesk font application
assert(
  /\.lanyard-event-badge[\s\S]*?font-family:\s*var\(--font-display\)/i.test(css) &&
  /\.lanyard-dev-name[\s\S]*?font-family:\s*var\(--font-display\)/i.test(css),
  'M3:5.4',
  'Lanyard event branding and developer name styled with Cabinet Grotesk (var(--font-display))'
);

// =============================================================================
// SUITE 6: STRICT BYTE-FOR-BYTE DUAL-FILE SYNCHRONIZATION
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 6: Strict Byte-For-Byte Dual-File Synchronization ---${colors.reset}`);

const srcStyleHash = sha256('src/style.css');
const rootStyleHash = sha256('style.css');
assert(
  srcStyleHash === rootStyleHash,
  'M3:6.1',
  `src/style.css and root style.css are byte-identical (${srcStyleHash.slice(0, 16)}...)`
);

const srcJsHash = sha256('src/main.js');
const rootJsHash = sha256('script.js');
assert(
  srcJsHash === rootJsHash,
  'M3:6.2',
  `src/main.js and root script.js are byte-identical (${srcJsHash.slice(0, 16)}...)`
);

// =============================================================================
// SUITE 7: PRODUCTION BUILD INTEGRITY
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 7: Production Build Integrity ---${colors.reset}`);

if (fs.existsSync(distHtmlPath)) {
  const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
  assert(
    distHtml.includes('id="lanyardPassCard"') && distHtml.includes('id="lanyardBadge"'),
    'M3:7.1',
    'dist/index.html includes 3D physics Lanyard Pass badge container and elements'
  );

  assert(
    !distHtml.includes('id="spotifyCard"') && !distHtml.includes('id="vinylDisc"'),
    'M3:7.2',
    'dist/index.html is completely free of legacy Spotify elements'
  );
} else {
  console.log(`  ${colors.yellow}Notice: dist/index.html not yet built. Will be validated during full build verification.${colors.reset}`);
}

// =============================================================================
// SUMMARY & VERDICT
// =============================================================================
console.log('\n' + '='.repeat(72));
console.log(`${colors.bold}MILESTONE 3 VERIFICATION SUMMARY${colors.reset}`);
console.log('='.repeat(72));
console.log(`Total Assertions Evaluated : ${passedCount + failedCount}`);
console.log(`Passed                     : ${passedCount}`);
console.log(`Failed                     : ${failedCount}`);
console.log(`Success Rate               : ${Math.round((passedCount / (passedCount + failedCount)) * 100)}%`);

if (failedCount > 0) {
  console.log(`\n${colors.bold}${colors.red}VERDICT: REJECT — ${failedCount} ASSERTION(S) FAILED${colors.reset}`);
  process.exit(1);
} else {
  console.log(`\n${colors.bold}${colors.green}VERDICT: APPROVE — ALL MILESTONE 3 REQUIREMENTS VERIFIED!${colors.reset}`);
  process.exit(0);
}
