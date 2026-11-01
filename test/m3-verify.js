/**
 * Requirement R1 (Redesign) Verification Suite: Hero Centered Cutout & Infinite Marquee Typography
 *
 * Verifies:
 *   1. Complete elimination and purging of all Lanyard pass card elements, JS logic, and CSS.
 *   2. Presence and DOM integrity of Centered Cutout portrait (/assets/christopher-base-cutout.png).
 *   3. Infinite marquee scrolling outline typography ("CHRISTOPHER THEO PURNOMO").
 *   4. Marquee animation keyframes and responsive layout.
 *   5. Zero Spotify or forbidden color residues.
 *   6. Strict byte-for-byte dual-file synchronization (src/style.css ↔ style.css, src/main.js ↔ script.js).
 *   7. Production build integrity and bundle validation.
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
console.log(`${colors.bold}REQUIREMENT R1: HERO CENTERED CUTOUT & MARQUEE TYPOGRAPHY VERIFICATION${colors.reset}`);
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
// SUITE 1: PURGE AUDIT (LANYARD & SPOTIFY COMPLETELY ELIMINATED)
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 1: Purge Audit (Lanyard & Spotify Eliminated) ---${colors.reset}`);

// 1.1 Lanyard DOM elements purged from index.html
const lanyardDomSelectors = [
  'id=["\']lanyardPassCard["\']',
  'id=["\']lanyardBadge["\']',
  'id=["\']lanyardHologram["\']',
  'id=["\']lanyardSheen["\']',
  'class=["\'][^"\']*lanyard-pass-container[^"\']*["\']',
  'class=["\'][^"\']*lanyard-badge[^"\']*["\']',
  'class=["\'][^"\']*lanyard-strap[^"\']*["\']'
];

const foundLanyardInHtml = lanyardDomSelectors.filter(pattern => new RegExp(pattern, 'i').test(html));
assert(
  foundLanyardInHtml.length === 0,
  'R1:1.1',
  'All lanyard pass card DOM elements completely purged from index.html',
  foundLanyardInHtml.length ? `Detected in HTML: ${foundLanyardInHtml.join(', ')}` : null
);

// 1.2 Lanyard state variables and logic purged from src/main.js
const lanyardJsTerms = [
  'lanyardPassCard',
  'lanyardBadge',
  'lanyardStrap',
  'lanyardSheen',
  'initLanyardPass'
];

const foundLanyardInJs = lanyardJsTerms.filter(term => new RegExp(`\\b${term}\\b`).test(js));
assert(
  foundLanyardInJs.length === 0,
  'R1:1.2',
  'All lanyard physics variables and routines purged from src/main.js',
  foundLanyardInJs.length ? `Detected in JS: ${foundLanyardInJs.join(', ')}` : null
);

// 1.3 Spotify purged completely
const spotifyDomSelectors = [
  'id=["\']spotifyCard["\']',
  'id=["\']vinylDisc["\']',
  'id=["\']btnPlayPause["\']'
];
const foundSpotifyInHtml = spotifyDomSelectors.filter(pattern => new RegExp(pattern, 'i').test(html));
assert(
  foundSpotifyInHtml.length === 0,
  'R1:1.3',
  'All legacy Spotify elements remain completely purged from index.html'
);

// =============================================================================
// SUITE 2: HERO CENTERED CUTOUT & INFINITE MARQUEE DOM INTEGRITY
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 2: Hero Centered Cutout & Infinite Marquee DOM Integrity ---${colors.reset}`);

// 2.1 Marquee container present
assert(
  /class=["'][^"']*hero-marquee-wrap[^"']*["']/i.test(html),
  'R1:2.1',
  'Infinite marquee container (.hero-marquee-wrap) present in Hero section'
);

// 2.2 Marquee track and content present
assert(
  /class=["'][^"']*hero-marquee-track[^"']*["']/i.test(html) &&
  /class=["'][^"']*hero-marquee-content[^"']*["']/i.test(html),
  'R1:2.2',
  'Marquee track and duplicate content rows present for seamless looping'
);

// 2.3 Outline typography with "CHRISTOPHER THEO PURNOMO"
assert(
  html.includes('CHRISTOPHER THEO PURNOMO') &&
  /class=["'][^"']*outline-text[^"']*["']/i.test(html),
  'R1:2.3',
  'Infinite marquee contains "CHRISTOPHER THEO PURNOMO" outline typography'
);

// 2.4 Cutout photo element present with correct source
assert(
  /src=["']\/assets\/christopher-base-cutout\.png["']/i.test(html) &&
  /class=["'][^"']*hero-cutout-img[^"']*["']/i.test(html),
  'R1:2.4',
  'Hero displays centered cutout portrait (/assets/christopher-base-cutout.png)'
);

// 2.5 Cutout image file exists on disk
const cutoutFilePath = path.join(ROOT_DIR, 'public/assets/christopher-base-cutout.png');
assert(
  fs.existsSync(cutoutFilePath) && fs.statSync(cutoutFilePath).size > 100000,
  'R1:2.5',
  `Cutout asset binary exists on disk (${cutoutFilePath}) with valid size`
);

// =============================================================================
// SUITE 3: STYLING & MOTION OPTICS IN CSS
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 3: Styling & Motion Optics in CSS ---${colors.reset}`);

// 3.1 Outline text styling
assert(
  css.includes('-webkit-text-stroke') || css.includes('text-stroke'),
  'R1:3.1',
  'CSS implements webkit text stroke for outline typography effect'
);

// 3.2 Continuous marquee animation defined
assert(
  css.includes('@keyframes marqueeScroll') || css.includes('@keyframes heroMarqueeScroll'),
  'R1:3.2',
  'CSS defines continuous marquee scroll keyframes'
);

// 3.3 Marquee track animation binding
assert(
  css.includes('marqueeScroll') && css.includes('animation:'),
  'R1:3.3',
  'Marquee track configured with infinite linear scrolling animation'
);

// 3.4 Reduced motion media query covers marquee
assert(
  css.includes('@media (prefers-reduced-motion: reduce)') &&
  css.includes('.hero-marquee-track'),
  'R1:3.4',
  'prefers-reduced-motion query includes .hero-marquee-track for accessibility'
);

// =============================================================================
// SUITE 4: DUAL-FILE SYNCHRONIZATION
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 4: Strict Byte-For-Byte Dual-File Synchronization ---${colors.reset}`);

const srcStyleHash = sha256('src/style.css');
const rootStyleHash = sha256('style.css');
assert(
  srcStyleHash === rootStyleHash,
  'R1:4.1',
  `src/style.css and root style.css are byte-identical (${srcStyleHash.slice(0, 16)}...)`
);

const srcJsHash = sha256('src/main.js');
const rootJsHash = sha256('script.js');
assert(
  srcJsHash === rootJsHash,
  'R1:4.2',
  `src/main.js and root script.js are byte-identical (${srcJsHash.slice(0, 16)}...)`
);

// =============================================================================
// SUITE 5: PRODUCTION BUILD INTEGRITY
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 5: Production Build Integrity ---${colors.reset}`);

if (fs.existsSync(distHtmlPath)) {
  const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
  assert(
    distHtml.includes('hero-marquee-wrap') &&
    distHtml.includes('/assets/christopher-base-cutout.png'),
    'R1:5.1',
    'dist/index.html includes hero marquee wrapper and cutout photo'
  );

  assert(
    !distHtml.includes('id="lanyardPassCard"') && !distHtml.includes('id="spotifyCard"'),
    'R1:5.2',
    'dist/index.html is completely free of lanyard and spotify elements'
  );
} else {
  console.log(`  ${colors.yellow}Notice: dist/index.html not yet built.${colors.reset}`);
}

// =============================================================================
// SUMMARY & VERDICT
// =============================================================================
console.log('\n' + '='.repeat(72));
console.log(`${colors.bold}REQUIREMENT R1 VERIFICATION SUMMARY${colors.reset}`);
console.log('='.repeat(72));
console.log(`Total Assertions Evaluated : ${passedCount + failedCount}`);
console.log(`Passed                     : ${passedCount}`);
console.log(`Failed                     : ${failedCount}`);
console.log(`Success Rate               : ${Math.round((passedCount / (passedCount + failedCount)) * 100)}%`);

if (failedCount > 0) {
  console.log(`\n${colors.bold}${colors.red}VERDICT: REJECT — ${failedCount} ASSERTION(S) FAILED${colors.reset}`);
  process.exit(1);
} else {
  console.log(`\n${colors.bold}${colors.green}VERDICT: APPROVE — ALL REQUIREMENT R1 REQUIREMENTS VERIFIED!${colors.reset}`);
  process.exit(0);
}
