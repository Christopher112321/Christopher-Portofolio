/**
 * =============================================================================
 * CHALLENGER 1: COMPREHENSIVE ADVERSARIAL DEEP DIVE AUDIT
 * =============================================================================
 * Probes:
 * 1. Link Integrity: Every href, data-href, src, mailto, and anchor target
 * 2. Internal Anchor Resolution: Every '#id' resolves to a real DOM element
 * 3. DOM Selector Stability: Every selector in src/main.js exists in index.html
 * 4. Image Binary Magic Bytes & Asset Completeness
 * 5. Margot Aesthetic Design Tokens & Font Declarations
 * 6. Intro Loading Screen Logic & Timing Boundaries
 * 7. Featured Projects (InternMatch DSS & MySembako) Links & Text
 * 8. Dual-File Mirroring SHA256 Strict Equality
 * 9. Production Build & Cleanliness
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function assert(condition, code, desc) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ [PASS] [${code}] ${desc}`);
  } else {
    failedChecks++;
    failures.push({ code, desc });
    console.error(`  ✗ [FAIL] [${code}] ${desc}`);
  }
}

console.log('======================================================================');
console.log('CHALLENGER 1 — ADVERSARIAL DEEP DIVE AUDIT');
console.log(`Working Directory: ${rootDir}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('======================================================================\n');

// 1. READ RELEVANT SOURCE FILES
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const srcStyleCss = fs.readFileSync(path.join(rootDir, 'src/style.css'), 'utf8');
const rootStyleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
const srcMainJs = fs.readFileSync(path.join(rootDir, 'src/main.js'), 'utf8');
const rootScriptJs = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf8');

// ============================================================================
// AUDIT 1: LINK INTEGRITY & ANCHOR RESOLUTION
// ============================================================================
console.log('--- 1. LINK INTEGRITY & ANCHOR RESOLUTION ---');

// Extract all href and data-href
const hrefRegex = /\b(?:href|data-href)=["']([^"']+)["']/g;
const links = [];
let m;
while ((m = hrefRegex.exec(indexHtml)) !== null) {
  links.push(m[1]);
}

// 1.1 All external http/https links must use https://
const externalLinks = links.filter(l => l.startsWith('http://') || l.startsWith('https://'));
const insecureLinks = externalLinks.filter(l => l.startsWith('http://') && !l.includes('localhost') && !l.includes('127.0.0.1'));
assert(insecureLinks.length === 0, 'LINK:1.1', `Zero insecure http:// links (found ${insecureLinks.length} of ${externalLinks.length})`);

// 1.2 All anchor hash links (#...) must resolve to elements with matching id in index.html
const hashLinks = links.filter(l => l.startsWith('#') && l.length > 1);
const idRegex = /\bid=["']([^"']+)["']/g;
const domIds = new Set();
while ((m = idRegex.exec(indexHtml)) !== null) {
  domIds.add(m[1]);
}

const danglingHashLinks = [];
hashLinks.forEach(h => {
  const targetId = h.slice(1);
  if (!domIds.has(targetId)) {
    danglingHashLinks.push(h);
  }
});
assert(danglingHashLinks.length === 0, 'LINK:1.2', `All anchor links resolve to valid DOM IDs (Dangling: ${danglingHashLinks.join(', ') || 'none'})`);

// 1.3 Ensure all external <a> links have target="_blank" and rel="noopener noreferrer"
const aTagRegex = /<a\s+[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
let unshieldedExternalLinks = 0;
while ((m = aTagRegex.exec(indexHtml)) !== null) {
  const fullTag = m[0];
  const url = m[1];
  const hasBlank = /target=["']_blank["']/i.test(fullTag);
  const hasRel = /rel=["'][^"']*noopener[^"']*["']/i.test(fullTag) && /rel=["'][^"']*noreferrer[^"']*["']/i.test(fullTag);
  if (!hasBlank || !hasRel) {
    unshieldedExternalLinks++;
    console.error(`    -> Unshielded external link tag: ${fullTag}`);
  }
}
assert(unshieldedExternalLinks === 0, 'LINK:1.3', `All external <a> links declare target="_blank" and rel="noopener noreferrer"`);

// 1.4 Specific project URLs
assert(indexHtml.includes('https://mysembako.vercel.app'), 'LINK:1.4A', 'MySembako live deployment URL present');
assert(indexHtml.includes('https://github.com/Christopher112321/mysembako'), 'LINK:1.4B', 'MySembako GitHub repo URL present');
assert(indexHtml.includes('https://internmatch-dss.vercel.app'), 'LINK:1.4C', 'InternMatch DSS live deployment URL present');
assert(indexHtml.includes('https://github.com/Christopher112321/internmatch-dss'), 'LINK:1.4D', 'InternMatch DSS GitHub repo URL present');

// 1.5 Social & Direct Channel URLs and handles
assert(indexHtml.includes('mailto:chris.theo.purnomo@gmail.com'), 'LINK:1.5A', 'Email mailto link present');
assert(indexHtml.includes('github.com/christophertheop'), 'LINK:1.5B', 'Personal GitHub profile handle present');
assert(indexHtml.includes('linkedin.com/in/christopher-theo-purnomo'), 'LINK:1.5C', 'Personal LinkedIn profile handle present');
assert(indexHtml.includes('https://instagram.com/chris_theo.p'), 'LINK:1.5D', 'Personal Instagram profile URL present');

// ============================================================================
// AUDIT 2: DOM SELECTOR STABILITY & RUNTIME INTEGRITY
// ============================================================================
console.log('\n--- 2. DOM SELECTOR STABILITY & RUNTIME INTEGRITY ---');

// 2.1 Check all getElementById calls in src/main.js
const getElemIdRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const jsQueriedIds = new Set();
while ((m = getElemIdRegex.exec(srcMainJs)) !== null) {
  jsQueriedIds.add(m[1]);
}

const missingIds = [];
jsQueriedIds.forEach(id => {
  if (!domIds.has(id)) {
    missingIds.push(id);
  }
});
assert(missingIds.length === 0, 'DOM:2.1', `All document.getElementById calls match DOM elements in index.html (Queried: ${jsQueriedIds.size}, Missing: ${missingIds.join(', ') || 'none'})`);

// 2.2 Check key interactive querySelectors
const criticalSelectors = [
  '#introScreen',
  '#loadingPercent',
  '#loadingBarFill',
  '#loadingCard',
  '#pillNavbar',
  '#navIndicator',
  '#sideNavRail',
  '#resumeModal',
  '#btnOpenResume',
  '#btnCloseResume',
  '#btnModalCloseSecondary',
  '#btnCopyEmail',
  '#lanyardPassCard',
  '#lanyardBadge',
  '#lanyardStrap',
  '#lanyardHologram',
  '#lanyardSheen',
  '#project-internmatch',
  '#project-mysembako',
  '.btn-flip-trigger',
  '.btn-flip-back',
  '.flip-card-inner',
  '.glass-card-face',
  '.about-augmented-card',
  '.modal-avatar-frame'
];

criticalSelectors.forEach(sel => {
  if (sel.startsWith('#')) {
    const id = sel.slice(1);
    assert(domIds.has(id), `DOM:2.2:${id}`, `DOM Element exists for ID selector '${sel}'`);
  } else if (sel.startsWith('.')) {
    const cls = sel.slice(1);
    const hasClass = new RegExp(`class=["'][^"']*\\b${cls}\\b[^"']*["']`).test(indexHtml);
    assert(hasClass, `DOM:2.2:${cls}`, `DOM Element exists for class selector '${sel}'`);
  }
});

// ============================================================================
// AUDIT 3: IMAGE ASSET INTEGRITY & BINARY SIGNATURES
// ============================================================================
console.log('\n--- 3. IMAGE ASSET INTEGRITY & BINARY SIGNATURES ---');

const assetFiles = [
  { relPath: 'assets/christopher-base.jpg', expectedType: 'jpeg', minSize: 100000 },
  { relPath: 'assets/christopher-base-cutout.png', expectedType: 'png', minSize: 500000 },
  { relPath: 'assets/profile.jpg', expectedType: 'jpeg', minSize: 30000 },
  { relPath: 'assets/profile-augmented.jpg', expectedType: 'jpeg', minSize: 50000 }
];

assetFiles.forEach(asset => {
  const rootAsset = path.join(rootDir, asset.relPath);
  const publicAsset = path.join(rootDir, 'public', asset.relPath);

  // Check existence in root assets/
  const existsRoot = fs.existsSync(rootAsset);
  assert(existsRoot, `ASSET:3.1:${path.basename(asset.relPath)}`, `${asset.relPath} exists in workspace root`);

  // Check existence in public/
  const existsPublic = fs.existsSync(publicAsset);
  assert(existsPublic, `ASSET:3.2:${path.basename(asset.relPath)}`, `${asset.relPath} exists in public/ folder`);

  if (existsRoot) {
    const stat = fs.statSync(rootAsset);
    assert(stat.size >= asset.minSize, `ASSET:3.3:${path.basename(asset.relPath)}`, `${asset.relPath} size is substantial (${(stat.size / 1024).toFixed(1)} KB >= ${(asset.minSize / 1024).toFixed(1)} KB)`);

    // Verify magic bytes
    const fd = fs.openSync(rootAsset, 'r');
    const buf = Buffer.alloc(8);
    fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);

    let isMagicValid = false;
    if (asset.expectedType === 'jpeg') {
      isMagicValid = buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;
    } else if (asset.expectedType === 'png') {
      isMagicValid = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
    }
    assert(isMagicValid, `ASSET:3.4:${path.basename(asset.relPath)}`, `${asset.relPath} has valid ${asset.expectedType.toUpperCase()} binary magic bytes`);
  }
});

// ============================================================================
// AUDIT 4: MARGOT DESIGN TOKENS & AESTHETIC COMPLIANCE
// ============================================================================
console.log('\n--- 4. MARGOT DESIGN TOKENS & AESTHETIC COMPLIANCE ---');

const expectedTokens = [
  '--bg-primary',
  '--bg-canvas',
  '--surface-card',
  '--surface-glass-card',
  '--border-hairline',
  '--accent',
  '--text-primary',
  '--text-warm',
  '--text-cream',
  '--text-muted',
  '--text-inverse',
  '--blur-nav',
  '--blur-card',
  '--radius-card',
  '--radius-pill'
];

expectedTokens.forEach(token => {
  const hasToken = srcStyleCss.includes(`${token}:`);
  assert(hasToken, `TOKEN:4.1:${token}`, `Token ${token} defined in :root in src/style.css`);
});

// Hairline border rule
assert(srcStyleCss.includes('rgba(255, 255, 255, 0.14)'), 'TOKEN:4.2', 'Hairline border value rgba(255, 255, 255, 0.14) present');
// Navigation blur 54px
assert(srcStyleCss.includes('blur(54px)'), 'TOKEN:4.3', 'Glassmorphic blur(54px) navigation token present');
// Editorial typography font definitions
assert(srcStyleCss.includes('--font-display') && srcStyleCss.includes('Cabinet Grotesk'), 'TOKEN:4.4', 'Display font family configured with Cabinet Grotesk');
assert(srcStyleCss.includes('--font-mono') && srcStyleCss.includes('JetBrains Mono'), 'TOKEN:4.5', 'Monospace font family configured with JetBrains Mono');

// Margot Editorial glyphs in index.html
const editorialGlyphs = ['✦', '✧', '❤︎'];
editorialGlyphs.forEach(glyph => {
  assert(indexHtml.includes(glyph), `GLYPH:4.6:${glyph}`, `Editorial glyph '${glyph}' present in index.html layout`);
});

// ============================================================================
// AUDIT 5: INTRO LOADING SCREEN LOGIC & TIMING PRESERVATION
// ============================================================================
console.log('\n--- 5. INTRO LOADING SCREEN LOGIC & TIMING PRESERVATION ---');

// Check duration = 2400ms, hold = 300ms, shutter = 850ms in src/main.js
assert(/duration\s*=\s*2400/.test(srcMainJs), 'INTRO:5.1', 'Intro screen duration strictly preserved at 2400ms');
assert(/300\s*\);/.test(srcMainJs), 'INTRO:5.2', 'Intro hold delay strictly preserved at 300ms');
assert(/850\s*\);/.test(srcMainJs), 'INTRO:5.3', 'Intro shutter duration strictly preserved at 850ms');
// Check RAF loop with easeOutCubic
assert(srcMainJs.includes('requestAnimationFrame') && srcMainJs.includes('1 - Math.pow(1 - rawProgress, 3)'), 'INTRO:5.4', 'Intro counter utilizes ease-out-cubic RAF interpolation');
// Check shutter reveal and finish class
assert(srcMainJs.includes('introScreen.classList.add(\'intro-finished\')'), 'INTRO:5.5', 'Intro screen triggers intro-finished class upon completion');

// ============================================================================
// AUDIT 6: FEATURED PROJECT SHOWCASES & 3D FLIP LOGIC
// ============================================================================
console.log('\n--- 6. FEATURED PROJECT SHOWCASES & 3D FLIP LOGIC ---');

// InternMatch DSS details
assert(indexHtml.includes('InternMatch DSS') || indexHtml.includes('INTERNMATCH DSS'), 'PROJ:6.1A', 'InternMatch DSS title present');
assert(indexHtml.includes('AHP') && indexHtml.includes('TOPSIS'), 'PROJ:6.1B', 'InternMatch DSS MCDM methodology (AHP & TOPSIS) preserved');
assert(indexHtml.includes('PERAN &amp; KONTRIBUSI SAYA') || indexHtml.includes('PERAN & KONTRIBUSI SAYA'), 'PROJ:6.1C', 'InternMatch DSS structured case study section preserved');

// MySembako details
assert(indexHtml.includes('MySembako') || indexHtml.includes('MYSEMBAKO'), 'PROJ:6.2A', 'MySembako title present');
assert(indexHtml.includes('Pengelolaan pasokan sembako'), 'PROJ:6.2B', 'MySembako problem context preserved');
assert(indexHtml.includes('skema database relasional'), 'PROJ:6.2C', 'MySembako architectural technical details preserved');

// 3D Liquid Glass Flip CSS
assert(srcStyleCss.includes('transform-style: preserve-3d') || srcStyleCss.includes('transform-style:preserve-3d'), 'FLIP:6.3A', '3D transform-style: preserve-3d enabled');
assert(srcStyleCss.includes('backface-visibility: hidden') || srcStyleCss.includes('backface-visibility:hidden'), 'FLIP:6.3B', 'backface-visibility: hidden configured');
assert(srcStyleCss.includes('.is-flipped') && srcStyleCss.includes('rotateY(180deg)'), 'FLIP:6.3C', '.is-flipped class rotates 180deg on Y axis');

// ============================================================================
// AUDIT 7: DUAL-FILE MIRRORING STRICT SHA256 EQUALITY
// ============================================================================
console.log('\n--- 7. DUAL-FILE MIRRORING STRICT SHA256 EQUALITY ---');

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

const srcCssHash = sha256(srcStyleCss);
const rootCssHash = sha256(rootStyleCss);
assert(srcCssHash === rootCssHash, 'SYNC:7.1', `CSS dual files are byte-for-byte identical (SHA256: ${srcCssHash.slice(0, 16)}...)`);

const srcJsHash = sha256(srcMainJs);
const rootJsHash = sha256(rootScriptJs);
assert(srcJsHash === rootJsHash, 'SYNC:7.2', `JS dual files are byte-for-byte identical (SHA256: ${srcJsHash.slice(0, 16)}...)`);

// ============================================================================
// AUDIT 8: PRODUCTION BUILD AND ASSET BUNDLE INTEGRITY
// ============================================================================
console.log('\n--- 8. PRODUCTION BUILD AND ASSET BUNDLE INTEGRITY ---');

let buildExitCode = -1;
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'pipe' });
  buildExitCode = 0;
} catch (e) {
  buildExitCode = e.status || 1;
}
assert(buildExitCode === 0, 'BUILD:8.1', 'npm run build executes cleanly with exit code 0');

const distHtmlPath = path.join(rootDir, 'dist/index.html');
const distExists = fs.existsSync(distHtmlPath);
assert(distExists, 'BUILD:8.2', 'dist/index.html produced in build');

if (distExists) {
  const distContent = fs.readFileSync(distHtmlPath, 'utf8');
  const distSize = Buffer.byteLength(distContent, 'utf8');
  assert(distSize < 50 * 1024, 'BUILD:8.3', `dist/index.html size (${(distSize / 1024).toFixed(2)} KB) within 50KB budget`);

  // Check dist bundle asset resolution
  const distAssetRegex = /(?:src|href)=["'](\/assets\/[^"']+)["']/g;
  let distMatch;
  let danglingDistAssets = 0;
  while ((distMatch = distAssetRegex.exec(distContent)) !== null) {
    const assetUrl = distMatch[1];
    const assetPath = path.join(rootDir, 'dist', assetUrl.slice(1));
    if (!fs.existsSync(assetPath)) {
      danglingDistAssets++;
      console.error(`    -> Missing production asset in dist: ${assetPath}`);
    }
  }
  assert(danglingDistAssets === 0, 'BUILD:8.4', `All dist asset references physically exist in dist/`);
}

// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n======================================================================');
console.log('CHALLENGER 1 ADVERSARIAL DEEP DIVE AUDIT SUMMARY');
console.log(`Total Checks Evaluated : ${totalChecks}`);
console.log(`Passed Checks          : ${passedChecks}`);
console.log(`Failed Checks          : ${failedChecks}`);
console.log(`Success Rate           : ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);
console.log('======================================================================');

if (failedChecks === 0) {
  console.log('\nFINAL EMPIRICAL VERDICT: APPROVE');
  process.exit(0);
} else {
  console.error(`\nFINAL EMPIRICAL VERDICT: REJECT (${failedChecks} failures found)`);
  process.exit(1);
}
