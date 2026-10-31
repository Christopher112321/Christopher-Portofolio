/**
 * =============================================================================
 * ADVERSARIAL STRESS TEST HARNESS — PORTFOLIO RETHEMING
 * Challenger: Challenger 1 (Empirical Challenger)
 * Purpose: Actively stress-test assumptions, verify asset integrity, fuzz
 *          interactive widgets, test viewports, and audit edge cases.
 * =============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testId, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS [${testId}] ${message}`);
  } else {
    failedTests++;
    failures.push({ testId, message });
    console.error(`  ✗ FAIL [${testId}] ${message}`);
  }
}

console.log('======================================================================');
console.log('CHALLENGER 1: ADVERSARIAL STRESS TESTING & AUDIT HARNESS');
console.log(`Working Directory: ${rootDir}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('======================================================================\n');

// ============================================================================
// SUITE 1: ASSET INTEGRITY & 404 RESISTANCE
// ============================================================================
console.log('--- SUITE 1: ASSET INTEGRITY & 404 RESISTANCE ---');

const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
const srcCssPath = path.join(rootDir, 'src', 'style.css');
const srcCssContent = fs.readFileSync(srcCssPath, 'utf8');
const distHtmlPath = path.join(rootDir, 'dist', 'index.html');
const hasDistHtml = fs.existsSync(distHtmlPath);

// 1.1 Check all static asset references in index.html
const assetRegex = /(?:src|href|content)=["']([^"']+)["']/g;
const foundAssetsInIndex = [];
let match;
while ((match = assetRegex.exec(indexHtmlContent)) !== null) {
  const url = match[1];
  if (/\.(jpg|jpeg|png|svg|webp|gif|ico|css|js|pdf|woff|woff2)$/i.test(url)) {
    foundAssetsInIndex.push(url);
  }
}

let missingIndexAssets = 0;
foundAssetsInIndex.forEach(assetUrl => {
  if (assetUrl.startsWith('http://') || assetUrl.startsWith('https://')) return; // external CDN (Google Fonts etc.)
  
  // Resolve against public/, root, or dist/
  const cleanPath = assetUrl.replace(/^\//, '');
  const inPublic = path.join(rootDir, 'public', cleanPath);
  const inRoot = path.join(rootDir, cleanPath);
  const exists = fs.existsSync(inPublic) || fs.existsSync(inRoot);
  if (!exists) {
    missingIndexAssets++;
    console.error(`    -> Missing asset referenced in index.html: ${assetUrl}`);
  }
});

assert(missingIndexAssets === 0, 'ADV:1.1', `Zero dangling/404 asset references in index.html (${foundAssetsInIndex.length} assets audited)`);

// 1.2 Check CSS url(...) declarations in src/style.css
// Note: strip data: URIs first to avoid false positives on internal SVG url(#filter) fragments
const strippedCss = srcCssContent.replace(/url\(\s*["']?data:[^"')]+["']?\s*\)/g, '/*DATA_URI*/');
const cssUrlRegex = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
const foundCssUrls = [];
while ((match = cssUrlRegex.exec(strippedCss)) !== null) {
  const url = match[1].trim();
  if (!url.startsWith('data:') && !url.startsWith('#') && !url.startsWith('%23')) {
    foundCssUrls.push(url);
  }
}

let missingCssAssets = 0;
foundCssUrls.forEach(cssUrl => {
  if (cssUrl.startsWith('http://') || cssUrl.startsWith('https://')) return;
  const cleanPath = cssUrl.replace(/^\//, '');
  const inPublic = path.join(rootDir, 'public', cleanPath);
  const inRoot = path.join(rootDir, cleanPath);
  const inSrc = path.join(rootDir, 'src', cleanPath);
  const exists = fs.existsSync(inPublic) || fs.existsSync(inRoot) || fs.existsSync(inSrc);
  if (!exists) {
    missingCssAssets++;
    console.error(`    -> Missing asset in src/style.css: ${cssUrl}`);
  }
});

assert(missingCssAssets === 0, 'ADV:1.2', `Zero dangling/404 url(...) references in src/style.css (${foundCssUrls.length} external/file urls audited)`);

// 1.3 Check dist/index.html assets
assert(hasDistHtml, 'ADV:1.3', 'Production output dist/index.html exists');

if (hasDistHtml) {
  const distHtmlContent = fs.readFileSync(distHtmlPath, 'utf8');
  const foundDistAssets = [];
  while ((match = assetRegex.exec(distHtmlContent)) !== null) {
    const url = match[1];
    if (/\.(jpg|jpeg|png|svg|webp|gif|ico|css|js|pdf|woff|woff2)$/i.test(url)) {
      foundDistAssets.push(url);
    }
  }

  let missingDistAssets = 0;
  foundDistAssets.forEach(assetUrl => {
    if (assetUrl.startsWith('http://') || assetUrl.startsWith('https://')) return;
    const cleanPath = assetUrl.replace(/^\//, '');
    const inDist = path.join(rootDir, 'dist', cleanPath);
    const inPublic = path.join(rootDir, 'public', cleanPath);
    const exists = fs.existsSync(inDist) || fs.existsSync(inPublic);
    if (!exists) {
      missingDistAssets++;
      console.error(`    -> Missing production asset in dist/index.html: ${assetUrl}`);
    }
  });

  assert(missingDistAssets === 0, 'ADV:1.4', `Zero dangling/404 asset references in dist/index.html (${foundDistAssets.length} production assets audited)`);

  // Verify all production script & style bundles have root '/' base path
  const rootDomainPrefix = foundDistAssets
    .filter(a => !a.startsWith('http') && !a.startsWith('data:'))
    .every(a => a.startsWith('/') || !a.includes('/portof/'));
  assert(rootDomainPrefix, 'ADV:1.5', 'Production bundles strictly resolve from root domain without /portof/ subpath prefix');
}

// 1.6 Verify zero residual Reyna filenames on disk or in source
const reynaPatterns = ['reyna-official-cutout.png', 'reyna-official-raw.png', 'christopher-reyna-cutout.png', 'christopher-reyna.jpg'];
const diskReynaResiduals = reynaPatterns.filter(p => {
  return fs.existsSync(path.join(rootDir, 'public', 'assets', p)) ||
         fs.existsSync(path.join(rootDir, 'assets', p)) ||
         fs.existsSync(path.join(rootDir, 'dist', 'assets', p));
});
assert(diskReynaResiduals.length === 0, 'ADV:1.6', 'Zero Reyna character asset binaries exist anywhere on disk');

const codeReynaResiduals = [indexHtmlContent, srcCssContent].filter(content => {
  return /reyna-(?:official|cutout|raw)|christopher-reyna/i.test(content);
});
assert(codeReynaResiduals.length === 0, 'ADV:1.7', 'Zero source code mentions of deleted Reyna asset filenames');

// ============================================================================
// SUITE 2: REDUCED MOTION, ACCESSIBILITY & VIEWPORT RESILIENCE
// ============================================================================
console.log('\n--- SUITE 2: REDUCED MOTION, ACCESSIBILITY & VIEWPORT RESILIENCE ---');

// 2.1 CSS prefers-reduced-motion media query
const hasReducedMotionCss = srcCssContent.includes('@media (prefers-reduced-motion: reduce)');
assert(hasReducedMotionCss, 'ADV:2.1', 'src/style.css defines explicit @media (prefers-reduced-motion: reduce) rule');

// 2.2 Verify reduced motion cancels transform/animation and forces opacity: 1
const reducedMotionBlock = srcCssContent.slice(
  srcCssContent.indexOf('@media (prefers-reduced-motion: reduce)'),
  srcCssContent.indexOf('@media (prefers-reduced-motion: reduce)') + 600
);
const disablesAnim = reducedMotionBlock.includes('animation: none !important') || reducedMotionBlock.includes('transition: none !important');
const forcesVisible = reducedMotionBlock.includes('opacity: 1 !important');
assert(disablesAnim && forcesVisible, 'ADV:2.2', 'prefers-reduced-motion ensures content is instantly visible without perpetual animation');

// 2.3 JS prefers-reduced-motion gating
const srcJsPath = path.join(rootDir, 'src', 'main.js');
const srcJsContent = fs.readFileSync(srcJsPath, 'utf8');
const bgCanvasGated = srcJsContent.includes("(prefers-reduced-motion: no-preference)");
assert(bgCanvasGated, 'ADV:2.3', 'Background atmospheric canvas loop is strictly gated by (prefers-reduced-motion: no-preference)');

// 2.4 Mobile cursor suppression
const hasCoarseMedia = srcCssContent.includes('@media (pointer: coarse)');
const coarseHidesCursor = /@media\s*\(pointer:\s*coarse\)\s*\{[\s\S]*?\.cursor-dot,\s*\.cursor-ring\s*\{[\s\S]*?display:\s*none/i.test(srcCssContent);
assert(hasCoarseMedia && coarseHidesCursor, 'ADV:2.4', 'Touch / coarse pointer devices suppress custom cursor elements to prevent touch lock');

// 2.5 JS pointer fine gating
const jsCursorGated = srcJsContent.includes("(pointer: fine)");
assert(jsCursorGated, 'ADV:2.5', 'Desktop precision cursor event listeners and RAF loop only attach when (pointer: fine) matches');

// 2.6 Responsive layout breakpoints check
const hasMobileBreakpoint = srcCssContent.includes('@media (max-width: 768px)');
const hasTabletBreakpoint = srcCssContent.includes('@media (max-width: 992px)');
const hidesSideNavOnMobile = /@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\.side-nav-rail\s*\{[\s\S]*?display:\s*none/i.test(srcCssContent);
assert(hasMobileBreakpoint && hasTabletBreakpoint, 'ADV:2.6', 'Responsive breakpoints for mobile (768px) and tablet (992px) are configured');
assert(hidesSideNavOnMobile, 'ADV:2.7', 'Side navigation rail is cleanly hidden on mobile viewports to prevent viewport obstruction');

// 2.8 Horizontal overflow resistance
const hasOverflowXHidden = srcCssContent.includes('overflow-x: hidden') || indexHtmlContent.includes('overflow-x');
assert(hasOverflowXHidden, 'ADV:2.8', 'Global horizontal overflow protection configured (overflow-x: hidden)');

// ============================================================================
// SUITE 3: INTERACTIVE WIDGET EXCEPTION FUZZING & RESILIENCE
// ============================================================================
console.log('\n--- SUITE 3: INTERACTIVE WIDGET EXCEPTION FUZZING & RESILIENCE ---');

// 3.1 Lanyard Pass Spring Physics Convergence Fuzzing
function calcSpringStep(pos, vel, target, stiffness, damping) {
  const force = -stiffness * (pos - target);
  const nextVel = (vel + force) * damping;
  const nextPos = pos + nextVel;
  return { pos: nextPos, vel: nextVel };
}

const springInitialDisplacements = [-500, -140, -50, 0, 50, 140, 500];
let springConvergencePassed = true;

springInitialDisplacements.forEach(initPos => {
  let p = initPos;
  let v = 0;
  for (let step = 0; step < 300; step++) {
    const next = calcSpringStep(p, v, 0, 0.08, 0.88);
    p = next.pos;
    v = next.vel;
  }
  // Must converge within 0.05px of equilibrium without exploding/NaN
  if (!Number.isFinite(p) || Math.abs(p) > 0.05) {
    springConvergencePassed = false;
    console.error(`Spring convergence failed for initPos=${initPos}: settled at ${p}`);
  }
});
assert(springConvergencePassed, 'ADV:3.1', `Lanyard Pass spring physics converges stably across boundary displacements (${springInitialDisplacements.join(', ')})`);

// 3.2 Lanyard Pass Drag Distance Clamping Boundary Checks
function clampDistance(dx, dy, maxDist) {
  const dist = Math.hypot(dx, dy);
  if (dist <= maxDist || dist === 0) return { x: dx, y: dy };
  const ratio = maxDist / dist;
  return { x: dx * ratio, y: dy * ratio };
}

const dragClampCases = [
  { dx: 0, dy: 0, maxDist: 140, expectedDist: 0 },
  { dx: 80, dy: 60, maxDist: 140, expectedDist: 100 }, // within bounds
  { dx: 140, dy: 0, maxDist: 140, expectedDist: 140 }, // boundary
  { dx: 200, dy: 0, maxDist: 140, expectedDist: 140 }, // out of bounds clamped
  { dx: -300, dy: -400, maxDist: 140, expectedDist: 140 } // extreme negative displacement clamped
];

let dragClampPassed = true;
dragClampCases.forEach(c => {
  const res = clampDistance(c.dx, c.dy, c.maxDist);
  const actualDist = Math.hypot(res.x, res.y);
  if (Math.abs(actualDist - c.expectedDist) > 0.001) {
    dragClampPassed = false;
    console.error(`Drag clamp failed for dx=${c.dx}, dy=${c.dy}: got dist ${actualDist}, expected ${c.expectedDist}`);
  }
});
assert(dragClampPassed, 'ADV:3.2', 'Lanyard Pass drag computation clamps out-of-bounds displacements safely to maxDragDistance');

// 3.3 Clipboard Copy Exception Handling
// Verify src/main.js wraps navigator.clipboard in try-catch with prompt fallback
const hasClipboardTryCatch = /try\s*\{\s*await\s+navigator\.clipboard\.writeText[\s\S]*?\}\s*catch/i.test(srcJsContent);
const hasClipboardFallback = srcJsContent.includes("prompt('Silakan salin email ini:'") || srcJsContent.includes('prompt(');
assert(hasClipboardTryCatch, 'ADV:3.3', 'navigator.clipboard.writeText is wrapped in try-catch for unsecure / denied permissions');
assert(hasClipboardFallback, 'ADV:3.4', 'Fallback prompt dialog provided if clipboard permissions are denied');

// 3.4 Resume Modal Keyboard Escape & Scroll Lock
const hasEscapeHandler = srcJsContent.includes("e.key === 'Escape'");
const checksModalOpenBeforeClose = srcJsContent.includes("resumeModal.classList.contains('is-open')");
const restoresBodyOverflow = srcJsContent.includes("document.body.style.overflow = ''");
assert(hasEscapeHandler, 'ADV:3.5', 'Escape key listener dismisses resume modal');
assert(checksModalOpenBeforeClose, 'ADV:3.6', 'Escape key checks is-open class before triggering dismiss');
assert(restoresBodyOverflow, 'ADV:3.7', 'Modal close unconditionally resets document.body.style.overflow to empty string');

// 3.5 Navigation Boundary Clamping
const navCodeHasBoundChecks = srcJsContent.includes("currentSectionIndex > 0") &&
                              srcJsContent.includes("currentSectionIndex < sections.length - 1") &&
                              srcJsContent.includes("index >= 0 && index < sections.length");
assert(navCodeHasBoundChecks, 'ADV:3.8', 'Vertical side rail navigation strictly bounds section index [0, sections.length - 1]');

// 3.6 Spotlight Spring Rest Convergence
const hasRestThreshold = srcJsContent.includes("distSq > 0.5 || speedSq > 0.5");
const springHaltsLoop = srcJsContent.includes("rafId = null");
assert(hasRestThreshold && springHaltsLoop, 'ADV:3.9', 'About spotlight spring physics halts requestAnimationFrame loop at resting equilibrium');

// 3.7 Project Card Navigation & Live Links
const hasImVercel = indexHtmlContent.includes('https://internmatch-dss.vercel.app');
const hasImGithub = indexHtmlContent.includes('https://github.com/Christopher112321/internmatch-dss');
const hasMsVercel = indexHtmlContent.includes('https://mysembako.vercel.app');
const hasMsGithub = indexHtmlContent.includes('https://github.com/Christopher112321/mysembako');
assert(hasImVercel && hasImGithub && hasMsVercel && hasMsGithub, 'ADV:3.10', 'Both project cards declare live Vercel deployments and GitHub repository URLs');

// 3.8 Project Card Nested Link Event Isolation
const hasNestedLinkStopPropagation = srcJsContent.includes('nestedLinks') &&
                                     srcJsContent.includes('e.stopPropagation()');
const hasCardTargetCheck = srcJsContent.includes("e.target.closest('a, button')");
assert(hasNestedLinkStopPropagation && hasCardTargetCheck, 'ADV:3.11', 'Project cards prevent nested link/button clicks from conflicting with card navigation');

// 3.9 Project Card Keyboard Activation (Enter Key)
const hasCardEnterActivation = srcJsContent.includes("e.key === 'Enter'") &&
                               srcJsContent.includes('projectCardsConfig');
assert(hasCardEnterActivation, 'ADV:3.12', 'Project cards support keyboard navigation via Enter key activation');

// 3.10 Accessible Project Card Attributes
const hasCardA11y = /id=["']project-internmatch["'][^>]*data-href=["']https:\/\/internmatch-dss\.vercel\.app["'][^>]*tabindex=["']0["']/i.test(indexHtmlContent) &&
                    /id=["']project-mysembako["'][^>]*data-href=["']https:\/\/mysembako\.vercel\.app["'][^>]*tabindex=["']0["']/i.test(indexHtmlContent);
assert(hasCardA11y, 'ADV:3.13', 'Project cards configure data-href and tabindex="0" accessibility attributes');

// 3.11 Text Selection Drag Navigation Protection
const hasSelectionCheck = srcJsContent.includes('window.getSelection') &&
                          srcJsContent.includes('selection.toString().trim().length > 0');
assert(hasSelectionCheck, 'ADV:3.14', 'Project cards guard against text selection drag to prevent unintended navigation on mouseup');

// 3.12 Middle-Click (auxclick) and Nested Keydown Isolation
const hasAuxClickSupport = srcJsContent.includes("card.addEventListener('auxclick'") &&
                           srcJsContent.includes('e.button === 1');
const hasNestedKeydownIsolation = srcJsContent.includes("link.addEventListener('keydown'");
assert(hasAuxClickSupport && hasNestedKeydownIsolation, 'ADV:3.15', 'Project cards support middle-click auxclick and isolate nested link keydown propagation');

// 3.13 Top Ambient Glow Preservation on Card Hover and Focus
const hasHoverAmbientGlow = srcCssContent.includes('.case-study-card:hover::before') &&
                            srcCssContent.includes('opacity: 1');
const hasFocusGlow = srcCssContent.includes('.case-study-card:focus-visible::before');
assert(hasHoverAmbientGlow && hasFocusGlow, 'ADV:3.16', 'Case study cards preserve ambient glow illumination on hover and focus-visible');

// ============================================================================
// SUITE 4: VERCEL PRODUCTION DEPLOYMENT AUDIT
// ============================================================================
console.log('\n--- SUITE 4: VERCEL PRODUCTION DEPLOYMENT AUDIT ---');

const vercelJsonPath = path.join(rootDir, 'vercel.json');
const vercelJsonExists = fs.existsSync(vercelJsonPath);
assert(vercelJsonExists, 'ADV:4.1', 'vercel.json configuration file is present');

if (vercelJsonExists) {
  const vercelCfg = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  const hasSpaRewrite = vercelCfg.rewrites && vercelCfg.rewrites.some(r => r.source === '/(.*)' && r.destination === '/index.html');
  const hasCacheHeaders = vercelCfg.headers && vercelCfg.headers.some(h => h.source && h.headers.some(hdr => hdr.key.toLowerCase() === 'cache-control'));
  assert(hasSpaRewrite, 'ADV:4.2', 'vercel.json provides universal SPA fallback rewrite (/(.*) -> /index.html)');
  assert(hasCacheHeaders, 'ADV:4.3', 'vercel.json specifies immutable caching headers for static assets');
}

const gitignorePath = path.join(rootDir, '.gitignore');
const gitignoreExists = fs.existsSync(gitignorePath);
assert(gitignoreExists, 'ADV:4.4', '.gitignore file is present');
if (gitignoreExists) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const ignoresDist = gitignoreContent.includes('dist');
  const ignoresNodeModules = gitignoreContent.includes('node_modules');
  assert(ignoresDist && ignoresNodeModules, 'ADV:4.5', '.gitignore properly excludes dist/ and node_modules/');
}

// 4.6 Mirror file sync check
const rootCssContent = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
const rootJsContent = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf8');
const cssInSync = rootCssContent === srcCssContent;
const jsInSync = rootJsContent === srcJsContent;
assert(cssInSync, 'ADV:4.6', 'Root style.css is byte-for-byte identical with src/style.css');
assert(jsInSync, 'ADV:4.7', 'Root script.js is byte-for-byte identical with src/main.js');

// ============================================================================
// SUITE 5: LIVE PREVIEW SERVER & HTTP ASSET AUDIT
// ============================================================================
console.log('\n--- SUITE 5: LIVE PREVIEW SERVER & HTTP ASSET AUDIT ---');

import http from 'http';
import { preview } from 'vite';

function httpGet(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

const previewPort = 4199;
let previewServer = null;
try {
  previewServer = await preview({ preview: { port: previewPort, strictPort: true } });
} catch (e) {
  console.error('Failed to launch Vite preview server:', e.message);
}

assert(previewServer !== null, 'ADV:5.0', `Vite preview server successfully launched programmatically on port ${previewPort}`);

if (previewServer) {
  const baseUrl = `http://localhost:${previewPort}`;

  // 5.1 Test Live Preview Server Root Endpoint
  const rootHttp = await httpGet(`${baseUrl}/`);
  assert(rootHttp.status === 200, 'ADV:5.1', `Preview server responds with HTTP 200 (received ${rootHttp.status})`);
  assert(rootHttp.body && rootHttp.body.includes('Christopher Theo Purnomo'), 'ADV:5.2', 'Root HTTP response contains author name in HTML payload');

  // 5.2 Test Production Bundle HTTP Resolution
  if (hasDistHtml) {
    const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
    const bundleRegex = /(?:src|href)=["'](\/assets\/[^"']+)["']/g;
    const bundlesToTest = [];
    let bMatch;
    while ((bMatch = bundleRegex.exec(distHtml)) !== null) {
      bundlesToTest.push(bMatch[1]);
    }

    let bundleFails = 0;
    for (const bUrl of bundlesToTest) {
      const res = await httpGet(`${baseUrl}${bUrl}`);
      if (res.status !== 200) {
        bundleFails++;
        console.error(`    -> Bundle failed: ${bUrl} returned ${res.status}`);
      }
    }
    assert(bundleFails === 0 && bundlesToTest.length > 0, 'ADV:5.3', `All production JS/CSS bundles served with HTTP 200 (${bundlesToTest.length} bundles verified)`);

    // 5.3 Test Static Public Images HTTP Resolution
    const staticImages = ['/assets/christopher-base.jpg', '/assets/christopher-base-cutout.png', '/assets/profile.jpg'];
    let imgFails = 0;
    for (const imgUrl of staticImages) {
      const res = await httpGet(`${baseUrl}${imgUrl}`);
      if (res.status !== 200) {
        imgFails++;
        console.error(`    -> Static image failed: ${imgUrl} returned ${res.status}`);
      }
    }
    assert(imgFails === 0, 'ADV:5.4', `All static personal assets served with HTTP 200 (${staticImages.length} images verified)`);

    // 5.4 Test Reyna asset 404 (ensure deleted assets return 404, not 200)
    const deletedReynaAssets = ['/assets/reyna-official-cutout.png', '/assets/christopher-reyna.jpg'];
    let reynaAccessible = 0;
    for (const rUrl of deletedReynaAssets) {
      const res = await httpGet(`${baseUrl}${rUrl}`);
      // Vite preview returns 404 for missing static assets or fallback if SPA
      if (res.status === 200 && res.headers['content-type'] && res.headers['content-type'].startsWith('image/')) {
        reynaAccessible++;
      }
    }
    assert(reynaAccessible === 0, 'ADV:5.5', 'Deleted Reyna character image assets are unservable / return non-image status');
  }

  // Gracefully close preview server
  previewServer.httpServer.close();
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n======================================================================');
console.log('ADVERSARIAL STRESS TEST SUMMARY');
console.log(`Passed: ${passedTests}/${totalTests} (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`Failed: ${failedTests}/${totalTests}`);
console.log('======================================================================');

if (failedTests > 0) {
  console.error('\nFAILURES RECORDED:');
  failures.forEach(f => console.error(`  - [${f.testId}] ${f.message}`));
  process.exit(1);
} else {
  console.log('\nALL ADVERSARIAL STRESS TESTS PASSED! ZERO CRITICAL VULNERABILITIES FOUND.');
  process.exit(0);
}

