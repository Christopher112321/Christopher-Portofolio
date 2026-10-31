/**
 * Challenger Aesthetic Boundaries & Stress Test Suite
 * Created by Challenger 2 (Empirical Challenger)
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
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  yellow: '\x1b[33m'
};

class AestheticAudit {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  assert(category, testId, description, condition, errorDetails = '') {
    const passed = Boolean(condition);
    this.results.push({ category, testId, description, passed, errorDetails });
    const mark = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
    console.log(`  ${mark} ${colors.gray}[${testId}]${colors.reset} ${description}`);
    if (!passed && errorDetails) {
      console.log(`         ${colors.red}Failure: ${errorDetails}${colors.reset}`);
    }
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(75));
    console.log(`${colors.bold}CHALLENGER 2: AESTHETIC BOUNDARY & TIMING AUDIT (${elapsed}s)${colors.reset}`);
    console.log('='.repeat(75));

    const cats = [...new Set(this.results.map(r => r.category))];
    let allPassed = true;

    for (const c of cats) {
      const items = this.results.filter(r => r.category === c);
      const passed = items.filter(r => r.passed).length;
      const total = items.length;
      const pct = Math.round((passed / total) * 100);
      const statusColor = passed === total ? colors.green : colors.red;
      if (passed !== total) allPassed = false;
      console.log(`  ${statusColor}${c.padEnd(50)}: ${passed}/${total} (${pct}%)${colors.reset}`);
    }

    const totalPassed = this.results.filter(r => r.passed).length;
    const totalCount = this.results.length;
    console.log('-'.repeat(75));

    if (allPassed) {
      console.log(`${colors.bold}${colors.green}ALL AESTHETIC & BOUNDARY CHECKS PASSED (${totalPassed}/${totalCount})${colors.reset}`);
      console.log(`${colors.bold}${colors.green}CHALLENGER 2 VERDICT: APPROVE${colors.reset}\n`);
    } else {
      const failed = totalCount - totalPassed;
      console.log(`${colors.bold}${colors.red}AESTHETIC STRESS CHECKS FAILED: ${failed} failed out of ${totalCount}.${colors.reset}`);
      console.log(`${colors.bold}${colors.red}CHALLENGER 2 VERDICT: REJECT${colors.reset}\n`);
    }

    return allPassed;
  }
}

const audit = new AestheticAudit();

function read(rel) {
  const p = path.join(ROOT_DIR, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function sha256(rel) {
  const p = path.join(ROOT_DIR, rel);
  return fs.existsSync(p) ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') : null;
}

const html = read('index.html');
const css = read('src/style.css');
const rootCss = read('style.css');
const js = read('src/main.js');
const rootJs = read('script.js');

// ---------------------------------------------------------------------------
// 1. MARGOT DESIGN TOKENS & AESTHETIC BOUNDARIES
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}--- PART 1: Margot Design Tokens & Aesthetic Boundaries ---${colors.reset}`);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:BG_CANVAS',
  '--bg-canvas is configured with Margot signature obsidian #050505',
  /--bg-canvas:\s*#050505/i.test(css)
);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:BG_PRIMARY',
  '--bg-primary is configured with pitch black #000000',
  /--bg-primary:\s*#000000/i.test(css)
);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:HAIRLINE',
  '--border-hairline is configured with rgba(255, 255, 255, 0.14)',
  /--border-hairline:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.14\s*\)/i.test(css)
);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:WARM_TEXT',
  '--text-warm is configured with Margot ivory #fff5e3',
  /--text-warm:\s*#fff5e3/i.test(css)
);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:CREAM_TEXT',
  '--text-cream is configured with Margot cream #f5d4a4',
  /--text-cream:\s*#f5d4a4/i.test(css)
);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:BLUR_NAV',
  '--blur-nav is configured with Margot 54px blur specification',
  /--blur-nav:\s*blur\(54px\)/i.test(css)
);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:BLUR_CARD',
  '--blur-card is configured with 8px blur specification',
  /--blur-card:\s*blur\(8px\)/i.test(css)
);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:RADIUS_CARD',
  '--radius-card and --radius-sm are configured with 8px radius',
  /--radius-card:\s*8px/i.test(css) && /--radius-sm:\s*8px/i.test(css)
);

audit.assert(
  'Margot Design Tokens',
  'TOKEN:RADIUS_PILL',
  '--radius-pill is configured with 9999px',
  /--radius-pill:\s*9999px/i.test(css)
);

// ---------------------------------------------------------------------------
// 2. EXHAUSTIVE COLOR INTEGRITY & ZERO SATURATION LEAK
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}--- PART 2: Exhaustive Color Integrity Scan ---${colors.reset}`);

// Check all hex colors in src/style.css
const hexRegex = /#([0-9a-fA-F]{3,8})\b/g;
const allCssHexes = [...new Set([...css.matchAll(hexRegex)].map(m => m[0].toLowerCase()))];

function isAcceptableNeutral(hex) {
  let clean = hex.replace('#', '');
  if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
  if (clean.length === 8) clean = clean.slice(0, 6);
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  
  // Grayscale / Zinc neutrals (delta <= 12)
  if (Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12 && Math.abs(r - b) <= 12) return true;
  
  // Specific Margot tones
  if (['#fff5e3', '#f5d4a4'].includes(hex)) return true;
  return false;
}

const badCssHexes = allCssHexes.filter(h => !isAcceptableNeutral(h));
audit.assert(
  'Color Integrity',
  'COLOR:CSS:HEX_NEUTRAL',
  `All CSS hex colors are strictly neutral dark/monochrome or Margot ivory/cream (0 leaks, found ${allCssHexes.length} total)`,
  badCssHexes.length === 0,
  `Unallowed hex colors detected: ${badCssHexes.join(', ')}`
);

// Check all rgb/rgba colors in src/style.css
const rgbaRegex = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/gi;
const allCssRgbas = [...css.matchAll(rgbaRegex)];
const badCssRgbas = allCssRgbas.filter(m => {
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  // Pure monochrome (r == g == b) or dark surface shades (all <= 30 with delta <= 6)
  if (r === g && g === b) return false;
  if (r <= 30 && g <= 30 && b <= 30 && Math.abs(r - g) <= 6 && Math.abs(g - b) <= 6) return false;
  return true;
});

audit.assert(
  'Color Integrity',
  'COLOR:CSS:RGBA_NEUTRAL',
  `All CSS rgb/rgba values are strictly monochrome white/black or obsidian dark surfaces (0 leaks, found ${allCssRgbas.length} total)`,
  badCssRgbas.length === 0,
  `Unallowed rgba colors detected: ${badCssRgbas.map(m => m[0]).join(', ')}`
);

// Check JS colors
const jsHexes = [...new Set([...js.matchAll(hexRegex)].map(m => m[0].toLowerCase()))];
const badJsHexes = jsHexes.filter(h => !isAcceptableNeutral(h));
audit.assert(
  'Color Integrity',
  'COLOR:JS:HEX_NEUTRAL',
  'All JS hex colors are strictly monochrome',
  badJsHexes.length === 0,
  `Unallowed JS hex: ${badJsHexes.join(', ')}`
);

const allJsRgbas = [...js.matchAll(rgbaRegex)];
const badJsRgbas = allJsRgbas.filter(m => {
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  return !(r === g && g === b);
});
audit.assert(
  'Color Integrity',
  'COLOR:JS:RGBA_NEUTRAL',
  'All JS rgb/rgba values are 100% pure monochrome (r === g === b)',
  badJsRgbas.length === 0,
  `Unallowed JS rgba: ${badJsRgbas.map(m => m[0]).join(', ')}`
);

// ---------------------------------------------------------------------------
// 3. INTRO SCREEN TIMING, RAF & UNMOUNT VERIFICATION
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}--- PART 3: Intro Loading Screen Timing & Unmount Audit ---${colors.reset}`);

// Check duration = 2400
audit.assert(
  'Intro Screen Timing & Logic',
  'INTRO:DURATION:2400MS',
  'Intro duration constant is exactly 2400ms for cinematic pacing',
  /const\s+duration\s*=\s*2400\b/.test(js)
);

// Check ease-out-cubic
audit.assert(
  'Intro Screen Timing & Logic',
  'INTRO:EASING:CUBIC',
  'Intro counter easing uses ease-out-cubic formula 1 - Math.pow(1 - rawProgress, 3)',
  /1\s*-\s*Math\.pow\(\s*1\s*-\s*rawProgress\s*,\s*3\s*\)/.test(js)
);

// Check 300ms hold at 100%
audit.assert(
  'Intro Screen Timing & Logic',
  'INTRO:HOLD:300MS',
  'Intro holds for 300ms at 100% before triggering shutter sequence',
  /setTimeout\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?300\s*\)/.test(js)
);

// Check 850ms unmount timeout to display: none
audit.assert(
  'Intro Screen Timing & Logic',
  'INTRO:UNMOUNT:850MS',
  'Intro unmounts with display: "none" after 850ms shutter transition',
  /introScreen\.style\.display\s*=\s*['"]none['"][\s\S]*?850/.test(js) || /setTimeout\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?introScreen\.style\.display\s*=\s*['"]none['"][\s\S]*?850\s*\)/.test(js)
);

// Check RAF stops when rawProgress >= 1
audit.assert(
  'Intro Screen Timing & Logic',
  'INTRO:RAF:CLEAN_STOP',
  'Intro RAF loop stops updating once rawProgress reaches 1 (no CPU leak)',
  /if\s*\(\s*rawProgress\s*<\s*1\s*\)\s*\{\s*requestAnimationFrame\(\s*updateLoading\s*\);\s*\}\s*else/.test(js)
);

// Check intro DOM IDs
const introIds = ['#introScreen', '#loadingPercent', '#loadingBarFill', '#loadingCard', '#introParticleCanvas'];
for (const iId of introIds) {
  const cleanId = iId.slice(1);
  audit.assert(
    'Intro Screen Timing & Logic',
    `INTRO:DOM:${cleanId}`,
    `Intro DOM element ${iId} exists in index.html`,
    new RegExp(`id=["']${cleanId}["']`).test(html)
  );
}

// ---------------------------------------------------------------------------
// 4. PHOTO ASSETS AUDIT & 404 RESISTANCE
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}--- PART 4: Photo Assets & Rendering Audit ---${colors.reset}`);

const requiredAssets = [
  'assets/christopher-base.jpg',
  'assets/christopher-base-cutout.png',
  'assets/profile-augmented.jpg',
  'assets/profile.jpg'
];

for (const relAsset of requiredAssets) {
  const assetRootPath = path.join(ROOT_DIR, relAsset);
  const assetPublicPath = path.join(ROOT_DIR, 'public', relAsset);
  const existsRoot = fs.existsSync(assetRootPath);
  const existsPublic = fs.existsSync(assetPublicPath);
  const size = existsRoot ? fs.statSync(assetRootPath).size : 0;

  audit.assert(
    'Photo Assets Rendering',
    `ASSET:EXISTS:${path.basename(relAsset)}`,
    `Asset ${relAsset} exists on disk (>10KB: ${size} bytes)`,
    existsRoot && size > 10000,
    `Missing or empty asset: ${assetRootPath}`
  );

  audit.assert(
    'Photo Assets Rendering',
    `ASSET:PUBLIC:${path.basename(relAsset)}`,
    `Asset ${relAsset} is replicated in public/ for Vite static copy`,
    existsPublic,
    `Missing in public/: ${assetPublicPath}`
  );
}

// Verify references in index.html
audit.assert(
  'Photo Assets Rendering',
  'ASSET:HTML:LANYARD_PHOTO',
  'Hero lanyard card renders /assets/christopher-base.jpg',
  html.includes('/assets/christopher-base.jpg')
);

audit.assert(
  'Photo Assets Rendering',
  'ASSET:HTML:ABOUT_CUTOUT',
  'About spotlight renders /assets/christopher-base-cutout.png',
  html.includes('/assets/christopher-base-cutout.png')
);

audit.assert(
  'Photo Assets Rendering',
  'ASSET:HTML:ABOUT_AUGMENTED',
  'About bento card renders /assets/profile-augmented.jpg',
  html.includes('/assets/profile-augmented.jpg')
);

audit.assert(
  'Photo Assets Rendering',
  'ASSET:HTML:CV_MODAL_AVATAR',
  'CV modal header branding renders /assets/profile.jpg',
  html.includes('/assets/profile.jpg')
);

// ---------------------------------------------------------------------------
// 5. FEATURED PROJECT SHOWCASE (MYSEMBAKO & INTERNMATCH DSS)
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}--- PART 5: Featured Projects Showcase ---${colors.reset}`);

audit.assert(
  'Featured Projects Showcase',
  'PROJ:IM:LIVE_LINK',
  'InternMatch DSS has working live link to https://internmatch-dss.vercel.app',
  /href=["']https:\/\/internmatch-dss\.vercel\.app\/?["']/.test(html)
);

audit.assert(
  'Featured Projects Showcase',
  'PROJ:IM:REPO_LINK',
  'InternMatch DSS has working repo link to https://github.com/Christopher112321/internmatch-dss',
  /href=["']https:\/\/github\.com\/Christopher112321\/internmatch-dss\/?["']/.test(html)
);

audit.assert(
  'Featured Projects Showcase',
  'PROJ:MS:LIVE_LINK',
  'MySembako has working live link to https://mysembako.vercel.app',
  /href=["']https:\/\/mysembako\.vercel\.app\/?["']/.test(html)
);

audit.assert(
  'Featured Projects Showcase',
  'PROJ:MS:REPO_LINK',
  'MySembako has working repo link to https://github.com/Christopher112321/mysembako',
  /href=["']https:\/\/github\.com\/Christopher112321\/mysembako\/?["']/.test(html)
);

// Check 6 structured case study sections per project
const requiredCaseBlocks = [
  'KONTEKS PERMASALAHAN',
  'PERAN &amp; KONTRIBUSI SAYA',
  'STACK TEKNOLOGI',
  'TANTANGAN REKAYASA &amp; SOLUSI',
  'HASIL &amp; INSIGHT UTAMA'
];

for (const block of requiredCaseBlocks) {
  const matches = (html.match(new RegExp(block, 'g')) || []).length;
  audit.assert(
    'Featured Projects Showcase',
    `CASE:BLOCK:${block.slice(0, 15)}`,
    `Section "${block}" is present in both project deep-dives (count: ${matches})`,
    matches >= 2,
    `Expected at least 2 occurrences of "${block}", found ${matches}`
  );
}

// ---------------------------------------------------------------------------
// 6. DUAL-FILE SHA256 SYNCHRONIZATION
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}--- PART 6: Dual-File SHA256 Synchronization ---${colors.reset}`);

const cssSrcSha = sha256('src/style.css');
const cssRootSha = sha256('style.css');
audit.assert(
  'Dual-File Synchronization',
  'SYNC:CSS:SHA',
  `src/style.css matches style.css (${cssSrcSha})`,
  cssSrcSha && cssSrcSha === cssRootSha,
  `Mismatch: src=${cssSrcSha} root=${cssRootSha}`
);

const jsSrcSha = sha256('src/main.js');
const jsRootSha = sha256('script.js');
audit.assert(
  'Dual-File Synchronization',
  'SYNC:JS:SHA',
  `src/main.js matches script.js (${jsSrcSha})`,
  jsSrcSha && jsSrcSha === jsRootSha,
  `Mismatch: src=${jsSrcSha} root=${jsRootSha}`
);

// ---------------------------------------------------------------------------
// 7. PRODUCTION DIST & ASSET PACKAGING AUDIT
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}--- PART 7: Production Dist & Asset Packaging ---${colors.reset}`);

const distHtml = read('dist/index.html');
audit.assert(
  'Production Dist Verification',
  'DIST:HTML:EXISTS',
  'dist/index.html exists and is non-empty',
  distHtml !== null && distHtml.length > 5000
);

for (const relAsset of requiredAssets) {
  const distAssetPath = path.join(ROOT_DIR, 'dist', relAsset);
  const exists = fs.existsSync(distAssetPath);
  audit.assert(
    'Production Dist Verification',
    `DIST:ASSET:${path.basename(relAsset)}`,
    `dist/${relAsset} packaged properly without 404`,
    exists,
    `Missing in dist: ${distAssetPath}`
  );
}

const allPassed = audit.summary();
process.exit(allPassed ? 0 : 1);
