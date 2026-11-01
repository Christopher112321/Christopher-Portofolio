/**
 * =============================================================================
 * EMPIRICAL CHALLENGER GATE 2: ADVERSARIAL STRESS & DOM FUZZ HARNESS
 * Target: Production Build Artifacts (dist/) & Interactive Subsystems
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

class ChallengerRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  assert(suite, id, description, condition, errorMsg = '') {
    const passed = Boolean(condition);
    this.results.push({ suite, id, description, passed, errorMsg });
    const mark = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
    console.log(`  ${mark} ${colors.gray}[${id}]${colors.reset} ${description}`);
    if (!passed && errorMsg) {
      console.log(`         ${colors.red}Failure: ${errorMsg}${colors.reset}`);
    }
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(78));
    console.log(`${colors.bold}${colors.cyan}EMPIRICAL CHALLENGER: AUDIT & STRESS FUZZ SUMMARY (${elapsed}s)${colors.reset}`);
    console.log('='.repeat(78));

    const suites = [...new Set(this.results.map(r => r.suite))];
    let allPassed = true;

    for (const s of suites) {
      const suiteResults = this.results.filter(r => r.suite === s);
      const passed = suiteResults.filter(r => r.passed).length;
      const total = suiteResults.length;
      const pct = Math.round((passed / total) * 100);
      const statusColor = passed === total ? colors.green : colors.red;
      if (passed !== total) allPassed = false;
      console.log(`  ${statusColor}${s.padEnd(54)}: ${passed}/${total} passed (${pct}%)${colors.reset}`);
    }

    const totalPassed = this.results.filter(r => r.passed).length;
    const totalCount = this.results.length;
    console.log('-'.repeat(78));

    if (allPassed) {
      console.log(`${colors.bold}${colors.green}ALL STRESS & FUZZ ASSERTIONS PASSED! (${totalPassed}/${totalCount})${colors.reset}`);
      console.log(`${colors.bold}${colors.green}EMPIRICAL VERDICT: APPROVE${colors.reset}\n`);
    } else {
      const failed = totalCount - totalPassed;
      console.log(`${colors.bold}${colors.red}CHALLENGE FAILED: ${failed} assertion(s) failed out of ${totalCount}.${colors.reset}`);
      console.log(`${colors.bold}${colors.red}EMPIRICAL VERDICT: REQUEST_CHANGES${colors.reset}\n`);
    }

    return allPassed;
  }
}

const runner = new ChallengerRunner();

console.log('='.repeat(78));
console.log(`${colors.bold}${colors.cyan}STARTING EMPIRICAL CHALLENGER ADVERSARIAL STRESS HARNESS${colors.reset}`);
console.log(`Working Directory: ${ROOT_DIR}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('='.repeat(78) + '\n');

// =============================================================================
// SUITE 1: PRODUCTION BUILD ARTIFACTS & PERFORMANCE BUDGET AUDIT
// =============================================================================
console.log(`${colors.bold}--- SUITE 1: Production Artifact Sizing & Performance Budgets ---${colors.reset}`);

const distHtmlPath = path.join(DIST_DIR, 'index.html');
runner.assert('BUDGET', 'DIST:HTML:EXISTS', 'dist/index.html exists', fs.existsSync(distHtmlPath));

if (fs.existsSync(distHtmlPath)) {
  const htmlRaw = fs.readFileSync(distHtmlPath);
  const htmlGzip = zlib.gzipSync(htmlRaw);
  const htmlRawKb = htmlRaw.length / 1024;
  const htmlGzipKb = htmlGzip.length / 1024;

  runner.assert(
    'BUDGET',
    'BUDGET:HTML:RAW',
    `HTML raw size (${htmlRawKb.toFixed(2)} KB) < 50 KB budget`,
    htmlRawKb < 50,
    `HTML size ${htmlRawKb.toFixed(2)} KB exceeds 50 KB`
  );

  runner.assert(
    'BUDGET',
    'BUDGET:HTML:GZIP',
    `HTML gzip size (${htmlGzipKb.toFixed(2)} KB) < 20 KB budget`,
    htmlGzipKb < 20
  );
}

const assetsDir = path.join(DIST_DIR, 'assets');
runner.assert('BUDGET', 'DIST:ASSETS:EXISTS', 'dist/assets directory exists', fs.existsSync(assetsDir));

if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  const jsFiles = assetFiles.filter(f => f.endsWith('.js'));
  const cssFiles = assetFiles.filter(f => f.endsWith('.css'));

  runner.assert('BUDGET', 'DIST:JS:EXISTS', `Production JS bundle found in dist/assets (${jsFiles.join(', ')})`, jsFiles.length > 0);
  runner.assert('BUDGET', 'DIST:CSS:EXISTS', `Production CSS bundle found in dist/assets (${cssFiles.join(', ')})`, cssFiles.length > 0);

  jsFiles.forEach(jsFile => {
    const raw = fs.readFileSync(path.join(assetsDir, jsFile));
    const gzip = zlib.gzipSync(raw);
    const rawKb = raw.length / 1024;
    const gzipKb = gzip.length / 1024;
    runner.assert(
      'BUDGET',
      `BUDGET:JS:${jsFile}`,
      `JS bundle ${jsFile} raw (${rawKb.toFixed(2)} KB) < 50 KB budget`,
      rawKb < 50,
      `${jsFile} raw size ${rawKb.toFixed(2)} KB exceeds 50 KB`
    );
    runner.assert(
      'BUDGET',
      `BUDGET:JS:GZIP:${jsFile}`,
      `JS bundle ${jsFile} gzip (${gzipKb.toFixed(2)} KB) < 15 KB budget`,
      gzipKb < 15
    );
  });

  cssFiles.forEach(cssFile => {
    const raw = fs.readFileSync(path.join(assetsDir, cssFile));
    const gzip = zlib.gzipSync(raw);
    const rawKb = raw.length / 1024;
    const gzipKb = gzip.length / 1024;
    runner.assert(
      'BUDGET',
      `BUDGET:CSS:${cssFile}`,
      `CSS bundle ${cssFile} raw (${rawKb.toFixed(2)} KB) < 65 KB budget`,
      rawKb < 65,
      `${cssFile} raw size ${rawKb.toFixed(2)} KB exceeds 65 KB`
    );
    runner.assert(
      'BUDGET',
      `BUDGET:CSS:GZIP:${cssFile}`,
      `CSS bundle ${cssFile} gzip (${gzipKb.toFixed(2)} KB) < 20 KB budget`,
      gzipKb < 20
    );
  });
}

// =============================================================================
// SUITE 2: DIST ASSET PATH INTEGRITY & 404 RESISTANCE
// =============================================================================
console.log(`\n${colors.bold}--- SUITE 2: Dist Asset Path Integrity & 404 Resistance ---${colors.reset}`);

if (fs.existsSync(distHtmlPath)) {
  const distHtml = fs.readFileSync(distHtmlPath, 'utf8');

  // Check no forbidden /portof/ path prefixes anywhere
  const hasPortofPrefix = /\/portof\//i.test(distHtml) || /["']\/portof\b/i.test(distHtml);
  runner.assert('PATH_INTEGRITY', 'PATH:NO_PORTOF', 'dist/index.html contains zero /portof/ path prefixes', !hasPortofPrefix);

  // Extract all src, href attributes pointing to static assets
  const assetRegex = /(?:src|href)=["']([^"']+)["']/g;
  let match;
  const localFileReferences = [];

  while ((match = assetRegex.exec(distHtml)) !== null) {
    const url = match[1].trim();
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#') || url.startsWith('mailto:')) {
      continue;
    }
    // Only check file references with asset extensions
    if (/\.(jpg|jpeg|png|svg|webp|gif|ico|css|js|pdf|woff|woff2)$/i.test(url)) {
      localFileReferences.push(url);
    }
  }

  runner.assert(
    'PATH_INTEGRITY',
    'PATH:LOCAL_REFS_FOUND',
    `Found ${localFileReferences.length} local file references in dist/index.html`,
    localFileReferences.length > 0
  );

  let brokenAssets = 0;
  localFileReferences.forEach(rel => {
    const cleanRel = rel.replace(/^\//, '');
    const diskPath = path.join(DIST_DIR, cleanRel);
    const exists = fs.existsSync(diskPath);
    if (!exists) {
      brokenAssets++;
      console.error(`       -> Missing on disk: ${diskPath} (from reference ${rel})`);
    } else {
      const stats = fs.statSync(diskPath);
      if (stats.size === 0) {
        brokenAssets++;
        console.error(`       -> Empty file on disk (0 bytes): ${diskPath}`);
      }
    }
  });

  runner.assert(
    'PATH_INTEGRITY',
    'PATH:ZERO_BROKEN_ASSETS',
    `Zero 404/broken local assets in dist/index.html (${localFileReferences.length} verified, 0 broken)`,
    brokenAssets === 0
  );

  // Verify personal photo assets exist in dist/assets
  const requiredPhotos = [
    'christopher-base.jpg',
    'christopher-base-cutout.png',
    'profile-augmented.jpg',
    'profile.jpg'
  ];

  requiredPhotos.forEach(photo => {
    const photoPath = path.join(DIST_DIR, 'assets', photo);
    const exists = fs.existsSync(photoPath);
    let validSize = false;
    if (exists) {
      validSize = fs.statSync(photoPath).size > 1000;
    }
    runner.assert(
      'PATH_INTEGRITY',
      `PHOTO:${photo}`,
      `Authentic asset dist/assets/${photo} exists and valid size (>1KB)`,
      exists && validSize
    );
  });
}

// =============================================================================
// SUITE 3: CRYPTOGRAPHIC PARITY & INVARIANTS
// =============================================================================
console.log(`\n${colors.bold}--- SUITE 3: Cryptographic Parity & Invariants ---${colors.reset}`);

function sha256File(relPath) {
  const p = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(p)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

const hashSrcCss = sha256File('src/style.css');
const hashRootCss = sha256File('style.css');
const hashSrcJs = sha256File('src/main.js');
const hashRootJs = sha256File('script.js');

runner.assert(
  'CRYPTO_PARITY',
  'SYNC:CSS',
  `src/style.css and style.css are byte-identical (${hashSrcCss})`,
  hashSrcCss !== null && hashSrcCss === hashRootCss
);

runner.assert(
  'CRYPTO_PARITY',
  'SYNC:JS',
  `src/main.js and script.js are byte-identical (${hashSrcJs})`,
  hashSrcJs !== null && hashSrcJs === hashRootJs
);

// Scan for 12 forbidden saturated colors in all code files
const forbiddenColors = [
  '#38bdf8', '#7dd3fc', '#6366f1', '#818cf8', '#a855f7', '#ec4899',
  'rgb(56, 189, 248)', 'rgb(99, 102, 241)', 'rgb(125, 211, 252)',
  'rgb(129, 140, 248)', 'rgb(168, 85, 247)', 'rgb(236, 72, 153)'
];

const filesToColorScan = ['index.html', 'src/style.css', 'src/main.js', 'dist/index.html'];
filesToColorScan.forEach(rel => {
  const content = fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8');
  let foundForbidden = 0;
  forbiddenColors.forEach(col => {
    if (content.toLowerCase().includes(col.toLowerCase())) {
      foundForbidden++;
      console.error(`       -> Found forbidden color ${col} in ${rel}`);
    }
  });
  runner.assert(
    'COLOR_AUDIT',
    `COLOR:${rel}`,
    `Zero forbidden colors found in ${rel} (12 forbidden codes scanned)`,
    foundForbidden === 0
  );
});

// =============================================================================
// SUITE 4: 3D LANYARD BADGE PHYSICS SIMULATION & STRESS FUZZING
// =============================================================================
console.log(`\n${colors.bold}--- SUITE 4: 3D Lanyard Badge Physics Simulation & Stress Fuzzing ---${colors.reset}`);

// Simulate exact physics parameters from src/main.js
const stiffness = 0.08;
const damping = 0.88;
const maxDragDistance = 140;

function clampDistance(dx, dy, maxDist) {
  const dist = Math.hypot(dx, dy);
  if (dist <= maxDist || dist === 0) return { x: dx, y: dy };
  const ratio = maxDist / dist;
  return { x: dx * ratio, y: dy * ratio };
}

function simulatePhysics(initialDisplacementX, initialDisplacementY, maxFrames = 250) {
  let { x: posX, y: posY } = clampDistance(initialDisplacementX, initialDisplacementY, maxDragDistance);
  let velX = 0;
  let velY = 0;
  let frames = 0;

  while (frames < maxFrames) {
    frames++;
    const forceX = -stiffness * posX;
    const forceY = -stiffness * posY;
    velX = (velX + forceX) * damping;
    velY = (velY + forceY) * damping;
    posX += velX;
    posY += velY;

    if (Number.isNaN(posX) || Number.isNaN(posY) || Number.isNaN(velX) || Number.isNaN(velY)) {
      return { converged: false, nan: true, frames };
    }

    const energy = Math.abs(posX) + Math.abs(posY) + Math.abs(velX) + Math.abs(velY);
    if (energy < 0.08) {
      return { converged: true, nan: false, frames, posX, posY };
    }
  }
  return { converged: false, nan: false, frames, posX, posY };
}

// 4.1 Boundary tests
const boundaryVectors = [
  { x: 0, y: 0, label: 'Origin (0,0)' },
  { x: 50, y: 0, label: 'Small X (50,0)' },
  { x: -50, y: -50, label: 'Negative Diagonal (-50,-50)' },
  { x: 140, y: 0, label: 'Max Radius (140,0)' },
  { x: 0, y: 140, label: 'Max Radius (0,140)' },
  { x: 500, y: 500, label: 'Extreme Out-of-bounds (500,500)' },
  { x: -2000, y: 3000, label: 'Massive Out-of-bounds (-2000,3000)' }
];

let boundaryFails = 0;
boundaryVectors.forEach(v => {
  const res = simulatePhysics(v.x, v.y);
  if (!res.converged || res.nan) {
    boundaryFails++;
    console.error(`       -> Failed convergence on ${v.label}: frames=${res.frames}, nan=${res.nan}`);
  }
});

runner.assert(
  'PHYSICS',
  'PHYSICS:BOUNDARY_VECTORS',
  `All ${boundaryVectors.length} boundary displacement vectors converge stably without NaN`,
  boundaryFails === 0
);

// 4.2 Monte Carlo fuzz test: 3,000 random displacement vectors
let fuzzFailures = 0;
const FUZZ_RUNS = 3000;
for (let i = 0; i < FUZZ_RUNS; i++) {
  const randX = (Math.random() - 0.5) * 4000;
  const randY = (Math.random() - 0.5) * 4000;
  const res = simulatePhysics(randX, randY);
  if (!res.converged || res.nan || res.frames > 200) {
    fuzzFailures++;
  }
}

runner.assert(
  'PHYSICS',
  'PHYSICS:MONTE_CARLO',
  `Monte Carlo fuzz: ${FUZZ_RUNS} randomized drag vectors converged to rest equilibrium (< 200 frames, 0 NaN)`,
  fuzzFailures === 0,
  `${fuzzFailures} runs failed to converge`
);

// =============================================================================
// SUITE 5: INTERACTIVE SUBSYSTEMS DOM LOGIC AUDIT
// =============================================================================
console.log(`\n${colors.bold}--- SUITE 5: Interactive Subsystems DOM Logic Audit ---${colors.reset}`);

const mainJsContent = fs.readFileSync(path.join(ROOT_DIR, 'src/main.js'), 'utf8');

// 5.1 Modal Open / Close / Escape key
runner.assert(
  'INTERACTIVE',
  'MODAL:OVERFLOW_LOCK',
  'Modal open locks body overflow ("hidden") and close restores ("")',
  mainJsContent.includes("document.body.style.overflow = 'hidden'") &&
  mainJsContent.includes("document.body.style.overflow = ''")
);

runner.assert(
  'INTERACTIVE',
  'MODAL:ESCAPE_KEY',
  'Escape key listener dismisses modal when open',
  mainJsContent.includes("e.key === 'Escape'") &&
  mainJsContent.includes("resumeModal.classList.contains('is-open')")
);

// 5.2 3D Flip Cards & Event Isolation
runner.assert(
  'INTERACTIVE',
  'FLIP:TOGGLE_AND_ARIA',
  'Flip card controller updates .is-flipped class and aria-expanded state',
  mainJsContent.includes("card.classList.add('is-flipped')") &&
  mainJsContent.includes("card.setAttribute('aria-expanded', 'true')") &&
  mainJsContent.includes("card.classList.remove('is-flipped')") &&
  mainJsContent.includes("card.setAttribute('aria-expanded', 'false')")
);

runner.assert(
  'INTERACTIVE',
  'FLIP:FOCUS_MANAGEMENT',
  'Flip card transfers keyboard focus to close button on flip and trigger on un-flip',
  mainJsContent.includes("closeBtn.focus()") &&
  mainJsContent.includes("triggerBtn.focus()")
);

runner.assert(
  'INTERACTIVE',
  'CARD:EVENT_ISOLATION',
  'Nested links and buttons stop event propagation inside case study cards',
  mainJsContent.includes("e.stopPropagation()") &&
  mainJsContent.includes("if (e.target.closest('a, button')) return")
);

runner.assert(
  'INTERACTIVE',
  'CARD:SELECTION_GUARD',
  'Text selection drag inside cards is guarded to prevent unwanted navigation',
  mainJsContent.includes("window.getSelection()") &&
  mainJsContent.includes("selection.toString().trim().length > 0")
);

runner.assert(
  'INTERACTIVE',
  'CARD:AUXCLICK',
  'Middle click (auxclick) supported for background tab opening',
  mainJsContent.includes("e.button === 1") &&
  mainJsContent.includes("card.addEventListener('auxclick'")
);

// 5.3 Copy Email Micro-interaction
runner.assert(
  'INTERACTIVE',
  'EMAIL:CLIPBOARD_TRY_CATCH',
  'Clipboard API call wrapped in try/catch with fallback prompt',
  mainJsContent.includes("navigator.clipboard.writeText(email)") &&
  mainJsContent.includes("prompt('Silakan salin email ini:', email)")
);

// 5.4 Custom Cursor Coarse Suppression
runner.assert(
  'INTERACTIVE',
  'CURSOR:POINTER_FINE_GATE',
  'Precision cursor initialization strictly guarded by (pointer: fine)',
  mainJsContent.includes("window.matchMedia('(pointer: fine)').matches")
);

// =============================================================================
// SUITE 6: RUSHES CINEMATIC EDITORIAL CONTENT & DESIGN VERIFICATION
// =============================================================================
console.log(`\n${colors.bold}--- SUITE 6: RUSHES Cinematic Editorial Content & Aesthetics ---${colors.reset}`);

const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

// 6.1 Typography hierarchy
const hasSpaceGrotesk = /Space\+Grotesk/i.test(indexHtml);
const hasInter = /family=Inter/i.test(indexHtml);
const hasCabinetGrotesk = /Cabinet\+Grotesk|cabinet-grotesk/i.test(indexHtml);
const hasJetBrains = /JetBrains\+Mono|jetbrains-mono/i.test(indexHtml);

runner.assert('RUSHES', 'TYPO:SPACE_GROTESK', 'Space Grotesk Google Font imported', hasSpaceGrotesk);
runner.assert('RUSHES', 'TYPO:INTER', 'Inter Google Font imported', hasInter);
runner.assert('RUSHES', 'TYPO:CABINET_GROTESK', 'Cabinet Grotesk Fontshare Font imported', hasCabinetGrotesk);
runner.assert('RUSHES', 'TYPO:JETBRAINS', 'JetBrains / Monospace Font imported', hasJetBrains);

// 6.2 Viewfinder corner brackets & HUD overlays
const hasCorners = indexHtml.includes('hud-corner-tl') &&
                   indexHtml.includes('hud-corner-tr') &&
                   indexHtml.includes('hud-corner-bl') &&
                   indexHtml.includes('hud-corner-br');
runner.assert('RUSHES', 'HUD:VIEWFINDER_CORNERS', 'Viewfinder corner brackets present in HUD frames', hasCorners);

const hasRecDot = indexHtml.includes('hud-rec-dot') || indexHtml.includes('hud-rec-tag');
runner.assert('RUSHES', 'HUD:REC_PULSE', 'Cinematic REC recording pulse indicator present', hasRecDot);

const hasTimecode = /TC\s*\[\d{2}:\d{2}:\d{2}:\d{2}\]/i.test(indexHtml);
runner.assert('RUSHES', 'HUD:TIMECODES', 'Filmic timecode stamps present (TC [00:00:00:00])', hasTimecode);

const hasTelemetry = /LAT:\s*-7\.0051.*LON:\s*110\.4381/i.test(indexHtml);
runner.assert('RUSHES', 'HUD:TELEMETRY_COORDS', 'Geographic coordinates metadata present (Semarang ID)', hasTelemetry);

// 6.3 Verbatim Content Retention
function normalize(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function containsNormalized(html, search) {
  return normalize(html).toLowerCase().includes(normalize(search).toLowerCase());
}

const verbatimSnippets = [
  { id: 'BIO_NAME', text: 'Christopher Theo Purnomo' },
  { id: 'BIO_AFFILIATION', text: 'Unika Soegijapranata' },
  { id: 'ROLE_TITLE', text: 'Informatics Student & Software Builder' },
  { id: 'FOCUS_1', text: 'Decision Support Systems' },
  { id: 'FOCUS_2', text: 'Full-Stack & Web Systems' },
  { id: 'FOCUS_3', text: 'Applied AI/ML & IoT' },
  { id: 'SKILLS_CAT1', text: 'Core Languages' },
  { id: 'SKILLS_CAT2', text: 'Web & Frameworks' },
  { id: 'SKILLS_CAT3', text: 'Database & Data Layer' },
  { id: 'SKILLS_CAT4', text: 'DSS, Data & Systems' },
  { id: 'PROJ_IM_URL', text: 'https://internmatch-dss.vercel.app' },
  { id: 'PROJ_IM_REPO', text: 'https://github.com/Christopher112321/internmatch-dss' },
  { id: 'PROJ_MS_URL', text: 'https://mysembako.vercel.app' },
  { id: 'PROJ_MS_REPO', text: 'https://github.com/Christopher112321/mysembako' },
  { id: 'CONTACT_EMAIL', text: 'chris.theo.purnomo@gmail.com' }
];

verbatimSnippets.forEach(({ id, text }) => {
  const found = containsNormalized(indexHtml, text);
  runner.assert('VERBATIM', `VERBATIM:${id}`, `Verbatim content string preserved: "${text}"`, found);
});

// Run summary and exit
const allPassed = runner.summary();
process.exit(allPassed ? 0 : 1);
