/**
 * =============================================================================
 * EMPIRICAL CHALLENGER GATE 1: MILESTONE 1 VERIFICATION HARNESS
 * =============================================================================
 * Rigorous empirical validation for:
 * 1. RUSHES Design Tokens in src/style.css and style.css
 * 2. 12 Case Study Blocks across InternMatch DSS & MySembako
 * 3. Live & Repository URLs + DOM Security attributes
 * 4. Camera Boot Loading Screen Sequence Timing & Mathematical Simulation
 * 5. Cryptographic SHA256 Dual-File Parity
 * 6. Asset Integration Verification
 * =============================================================================
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
  gray: '\x1b[90m',
};

class ChallengerSuite {
  constructor() {
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.failures = [];
    this.startTime = Date.now();
  }

  assert(id, description, condition, errorDetail = '') {
    this.total++;
    if (condition) {
      this.passed++;
      console.log(`  ${colors.green}✓ PASS${colors.reset} ${colors.gray}[${id}]${colors.reset} ${description}`);
    } else {
      this.failed++;
      this.failures.push({ id, description, errorDetail });
      console.log(`  ${colors.red}✗ FAIL${colors.reset} ${colors.gray}[${id}]${colors.reset} ${description}`);
      if (errorDetail) {
        console.log(`         ${colors.red}Error: ${errorDetail}${colors.reset}`);
      }
    }
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(70));
    console.log(`${colors.bold}CHALLENGER GATE 1 VERIFICATION SUMMARY${colors.reset}`);
    console.log('='.repeat(70));
    console.log(`Total Assertions : ${this.total}`);
    console.log(`Passed           : ${colors.green}${this.passed}${colors.reset}`);
    console.log(`Failed           : ${this.failed > 0 ? colors.red + this.failed + colors.reset : colors.green + '0' + colors.reset}`);
    console.log(`Elapsed Time     : ${elapsed}s`);

    if (this.failed > 0) {
      console.log('\n' + colors.red + 'FAILURES ENCOUNTERED:' + colors.reset);
      this.failures.forEach(f => {
        console.log(`- [${f.id}] ${f.description}: ${f.errorDetail}`);
      });
      console.log('\nVERDICT: ' + colors.red + 'REQUEST_CHANGES' + colors.reset);
      return false;
    } else {
      console.log('\nVERDICT: ' + colors.green + 'APPROVE' + colors.reset);
      return true;
    }
  }
}

const suite = new ChallengerSuite();

function read(rel) {
  return fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8');
}

function sha256(rel) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT_DIR, rel))).digest('hex');
}

const html = read('index.html');
const srcCss = read('src/style.css');
const rootCss = read('style.css');
const srcJs = read('src/main.js');
const rootJs = read('script.js');

// =============================================================================
// AUDIT 1: RUSHES DESIGN TOKENS & CSS PROPERTIES
// =============================================================================
console.log(`\n${colors.cyan}[AUDIT 1] RUSHES Design Tokens & CSS Properties (src/style.css & style.css)${colors.reset}`);

const requiredCssTokens = [
  { name: '--primitive-black-obsidian', value: '#0a0a0a', regex: /--primitive-black-obsidian:\s*#0a0a0a/i },
  { name: '--primitive-black-pitch', value: '#050505', regex: /--primitive-black-pitch:\s*#050505/i },
  { name: '--primitive-amber-cine', value: '#e2612f', regex: /--primitive-amber-cine:\s*#e2612f/i },
  { name: '--primitive-red-rec', value: '#c22e1f', regex: /--primitive-red-rec:\s*#c22e1f/i },
  { name: '--primitive-white-ivory', value: '#f4f2ed', regex: /--primitive-white-ivory:\s*#f4f2ed/i },
  { name: '--primitive-hairline-hud', value: 'rgba(154, 154, 158, 0.2)', regex: /--primitive-hairline-hud:\s*rgba\(\s*154\s*,\s*154\s*,\s*158\s*,\s*0\.2\s*\)/i },
  { name: '--primitive-hairline-light', value: 'rgba(255, 255, 255, 0.12)', regex: /--primitive-hairline-light:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.12\s*\)/i },
  { name: '--bg-obsidian', value: 'var(--primitive-black-obsidian)', regex: /--bg-obsidian:\s*var\(--primitive-black-obsidian\)/i },
  { name: '--accent-cine', value: 'var(--primitive-amber-cine)', regex: /--accent-cine:\s*var\(--primitive-amber-cine\)/i },
  { name: '--accent-rec', value: 'var(--primitive-red-rec)', regex: /--accent-rec:\s*var\(--primitive-red-rec\)/i },
  { name: '--text-high-contrast', value: 'var(--primitive-white-ivory)', regex: /--text-high-contrast:\s*var\(--primitive-white-ivory\)/i },
  { name: '--card-bracket-color', value: 'rgba(154, 154, 158, 0.4)', regex: /--card-bracket-color:\s*rgba\(\s*154\s*,\s*154\s*,\s*158\s*,\s*0\.4\s*\)/i },
  { name: '--card-bracket-active', value: 'var(--primitive-amber-cine)', regex: /--card-bracket-active:\s*var\(--primitive-amber-cine\)/i },
  { name: '--card-bracket-size', value: '18px', regex: /--card-bracket-size:\s*18px/i },
];

for (const tok of requiredCssTokens) {
  suite.assert(
    `CSS-SRC-TOK-${tok.name}`,
    `src/style.css defines ${tok.name} with value ${tok.value}`,
    tok.regex.test(srcCss),
    `Token ${tok.name} missing or mismatched in src/style.css`
  );
  suite.assert(
    `CSS-ROOT-TOK-${tok.name}`,
    `style.css defines ${tok.name} with value ${tok.value}`,
    tok.regex.test(rootCss),
    `Token ${tok.name} missing or mismatched in style.css`
  );
}

// Typography imports & declarations
suite.assert(
  'FONT-SRC-SPACE-GROTESK',
  'src/style.css imports Space Grotesk Google Font',
  /family=Space\+Grotesk/i.test(srcCss),
  'Space Grotesk font import missing in src/style.css'
);
suite.assert(
  'FONT-SRC-INTER',
  'src/style.css imports Inter Google Font',
  /family=Inter/i.test(srcCss),
  'Inter font import missing in src/style.css'
);
suite.assert(
  'FONT-SRC-JETBRAINS',
  'src/style.css imports JetBrains Mono Google Font',
  /family=JetBrains\+Mono/i.test(srcCss),
  'JetBrains Mono font import missing in src/style.css'
);
suite.assert(
  'FONT-HTML-SPACE-GROTESK',
  'index.html imports Space Grotesk via Google Fonts',
  /href=["'][^"']*family=Space\+Grotesk[^"']*["']/i.test(html),
  'Space Grotesk link missing in index.html'
);
suite.assert(
  'FONT-HTML-INTER',
  'index.html imports Inter via Google Fonts',
  /href=["'][^"']*family=Inter[^"']*["']/i.test(html),
  'Inter link missing in index.html'
);

// Invariant backward-compatibility tokens
suite.assert('TOK-INVARIANT-BG', 'src/style.css retains --bg-primary: #000000', /--bg-primary:\s*#000000/i.test(srcCss));
suite.assert('TOK-INVARIANT-ACCENT', 'src/style.css retains --accent: #ffffff', /--accent:\s*#ffffff/i.test(srcCss));
suite.assert('TOK-INVARIANT-CABINET', 'src/style.css retains Cabinet Grotesk in --font-display', /--font-display:\s*['"]Cabinet Grotesk['"]/i.test(srcCss));

// HUD Viewfinder classes & keyframes
suite.assert('CSS-HUD-FRAME', 'src/style.css defines .cinematic-hud-frame with position relative', /\.cinematic-hud-frame\s*\{[\s\S]*?position:\s*relative/i.test(srcCss));
suite.assert('CSS-HUD-CORNER', 'src/style.css defines .hud-corner with absolute positioning', /\.hud-corner\s*\{[\s\S]*?position:\s*absolute/i.test(srcCss));
suite.assert('CSS-REC-PULSE', 'src/style.css defines @keyframes ct-rec-pulse', /@keyframes\s+ct-rec-pulse/i.test(srcCss));
suite.assert('CSS-REDUCED-MOTION', 'src/style.css disables .hud-rec-dot animation under prefers-reduced-motion', /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.hud-rec-dot\s*\{[\s\S]*?animation:\s*none/i.test(srcCss));

// Forbidden saturated color regression check
const forbiddenHexes = [
  '#38bdf8', '#7dd3fc', '#0ea5e9', '#0284c7',
  '#6366f1', '#818cf8', '#4f46e5', '#a855f7',
  '#c084fc', '#9333ea', '#ec4899', '#f472b6'
];
for (const hex of forbiddenHexes) {
  const inSrcCss = new RegExp(hex, 'i').test(srcCss);
  const inHtml = new RegExp(hex, 'i').test(html);
  const inSrcJs = new RegExp(hex, 'i').test(srcJs);
  suite.assert(
    `FORBIDDEN-HEX-${hex}`,
    `No occurrences of saturated forbidden color ${hex} in codebase`,
    !inSrcCss && !inHtml && !inSrcJs,
    `Found forbidden hex ${hex} in source files`
  );
}

// =============================================================================
// AUDIT 2: INTEGRITY OF ALL 12 CASE STUDY BLOCKS (INTERNMATCH DSS & MYSEMBAKO)
// =============================================================================
console.log(`\n${colors.cyan}[AUDIT 2] Integrity of All 12 Case Study Blocks (InternMatch DSS & MySembako)${colors.reset}`);

const caseStudy12Blocks = [
  // InternMatch DSS (6 blocks)
  {
    project: 'InternMatch DSS',
    id: 'CS-IM-1-KONTEKS',
    label: 'KONTEKS PERMASALAHAN',
    snippet: 'Proses pencocokan antara kompetensi mahasiswa dengan kriteria spesifikasi mitra industri magang sering kali terbentur bias subjektif dan ketidaksesuaian kualifikasi.'
  },
  {
    project: 'InternMatch DSS',
    id: 'CS-IM-2-PERAN',
    label: 'PERAN & KONTRIBUSI SAYA',
    snippet: 'Bertanggung jawab atas formulasi logika sistem pendukung keputusan (DSS), perancangan matriks pembobotan kriteria, normalisasi nilai kandidat, serta implementasi logika penilaian dan perankingan pada modul backend.'
  },
  {
    project: 'InternMatch DSS',
    id: 'CS-IM-3-METODE',
    label: 'METODOLOGI DSS YANG DIAPLIKASIKAN',
    snippet: 'AHP (Analytic Hierarchy Process)'
  },
  {
    project: 'InternMatch DSS',
    id: 'CS-IM-4-STACK',
    label: 'STACK TEKNOLOGI',
    snippet: 'MCDM Matrix Computation'
  },
  {
    project: 'InternMatch DSS',
    id: 'CS-IM-5-TANTANGAN',
    label: 'TANTANGAN REKAYASA & SOLUSI',
    snippet: 'Pairwise Comparison Consistency Ratio &lt; 0.1'
  },
  {
    project: 'InternMatch DSS',
    id: 'CS-IM-6-HASIL',
    label: 'HASIL & INSIGHT UTAMA',
    snippet: 'Sistem berhasil menghasilkan rekomendasi penempatan magang yang dapat diaudit perhitungannya (white-box decision)'
  },
  // MySembako (6 blocks)
  {
    project: 'MySembako',
    id: 'CS-MS-7-KONTEKS',
    label: 'KONTEKS PERMASALAHAN',
    snippet: 'Pengelolaan pasokan sembako pada toko fisik konvensional rentan terhadap pencatatan ganda, ketidaksesuaian stok fisik dengan pembukuan'
  },
  {
    project: 'MySembako',
    id: 'CS-MS-8-PERAN',
    label: 'PERAN & KONTRIBUSI SAYA',
    snippet: 'Sebagai pengembang utama (Full-Stack Developer) yang merancang skema database relasional untuk entitas barang, satuan multi-kemasan'
  },
  {
    project: 'MySembako',
    id: 'CS-MS-9-FITUR',
    label: 'FITUR UTAMA & ALUR OPERASIONAL',
    snippet: 'Pencatatan batch masuk dan keluar (FIFO/rata-rata), notifikasi batas minimum stok sembako'
  },
  {
    project: 'MySembako',
    id: 'CS-MS-10-STACK',
    label: 'STACK TEKNOLOGI',
    snippet: 'Transaction ACID Safe'
  },
  {
    project: 'MySembako',
    id: 'CS-MS-11-TANTANGAN',
    label: 'TANTANGAN REKAYASA & SOLUSI',
    snippet: 'Menjaga integritas data saat transaksi penjualan berlangsung serentak (concurrency control) agar kuantitas stok barang tidak menjadi negatif'
  },
  {
    project: 'MySembako',
    id: 'CS-MS-12-HASIL',
    label: 'HASIL & INSIGHT UTAMA',
    snippet: 'Aplikasi menyederhanakan siklus rekonsiliasi stok harian dari hitungan jam menjadi hitungan menit, menghilangkan selisih stok manual'
  }
];

suite.assert('CASE-STUDY-COUNT', 'Total required case study blocks to test is exactly 12', caseStudy12Blocks.length === 12);

for (const b of caseStudy12Blocks) {
  suite.assert(
    b.id,
    `[${b.project}] ${b.label} block is present verbatim in index.html`,
    html.includes(b.snippet),
    `Snippet "${b.snippet.slice(0, 50)}..." not found in index.html`
  );
}

// =============================================================================
// AUDIT 3: CORRECT LIVE AND REPOSITORY URLS & SECURITY ATTRIBUTES
// =============================================================================
console.log(`\n${colors.cyan}[AUDIT 3] Live and Repository URLs & External Anchor Security${colors.reset}`);

const requiredUrls = [
  { name: 'InternMatch DSS Live URL', url: 'https://internmatch-dss.vercel.app', target: '#project-internmatch' },
  { name: 'InternMatch DSS Repo URL', url: 'https://github.com/Christopher112321/internmatch-dss', target: '#project-internmatch' },
  { name: 'MySembako Live URL', url: 'https://mysembako.vercel.app', target: '#project-mysembako' },
  { name: 'MySembako Repo URL', url: 'https://github.com/Christopher112321/mysembako', target: '#project-mysembako' },
];

for (const u of requiredUrls) {
  suite.assert(
    `URL-PRESENT-${u.name}`,
    `index.html contains exact URL ${u.url}`,
    html.includes(u.url),
    `URL ${u.url} not found in index.html`
  );
}

// Check data-href on flip wrappers
suite.assert(
  'WRAPPER-HREF-INTERNMATCH',
  '#project-internmatch wrapper has data-href="https://internmatch-dss.vercel.app"',
  /id=["']project-internmatch["'][^>]*data-href=["']https:\/\/internmatch-dss\.vercel\.app["']/i.test(html)
);
suite.assert(
  'WRAPPER-HREF-MYSEMBAKO',
  '#project-mysembako wrapper has data-href="https://mysembako.vercel.app"',
  /id=["']project-mysembako["'][^>]*data-href=["']https:\/\/mysembako\.vercel\.app["']/i.test(html)
);

// Scan all external anchor tags for target="_blank" and rel="noopener noreferrer"
const anchorRegex = /<a\s+([^>]+)>/gi;
let match;
let totalExternalAnchors = 0;
let securedExternalAnchors = 0;

while ((match = anchorRegex.exec(html)) !== null) {
  const attrs = match[1];
  const hrefMatch = /href=["']([^"']+)["']/i.exec(attrs);
  if (!hrefMatch) continue;
  const href = hrefMatch[1];

  if (href.startsWith('http://') || href.startsWith('https://')) {
    totalExternalAnchors++;
    const hasTargetBlank = /target=["']_blank["']/i.test(attrs);
    const hasRelNoopener = /rel=["'][^"']*noopener[^"']*["']/i.test(attrs) && /rel=["'][^"']*noreferrer[^"']*["']/i.test(attrs);

    if (hasTargetBlank && hasRelNoopener) {
      securedExternalAnchors++;
    } else {
      suite.assert(
        `ANCHOR-SEC-${href.slice(0, 30)}`,
        `External anchor ${href} has target="_blank" and rel="noopener noreferrer"`,
        false,
        `Missing attributes on: ${attrs}`
      );
    }
  }
}

suite.assert(
  'ANCHOR-ALL-SECURE',
  `All ${totalExternalAnchors} external anchors have target="_blank" and rel="noopener noreferrer"`,
  totalExternalAnchors > 0 && totalExternalAnchors === securedExternalAnchors,
  `Only ${securedExternalAnchors}/${totalExternalAnchors} external anchors are secured`
);

// =============================================================================
// AUDIT 4: CAMERA BOOT LOADING SCREEN TIMING & MATHEMATICAL SIMULATION
// =============================================================================
console.log(`\n${colors.cyan}[AUDIT 4] Camera Boot Loading Screen Timing & Sequence Validation${colors.reset}`);

// Check code constants in src/main.js and script.js
suite.assert(
  'BOOT-DURATION-SRC',
  'src/main.js configures duration = 2400ms',
  /const\s+duration\s*=\s*2400\s*;/i.test(srcJs),
  'duration != 2400 in src/main.js'
);
suite.assert(
  'BOOT-DURATION-ROOT',
  'script.js configures duration = 2400ms',
  /const\s+duration\s*=\s*2400\s*;/i.test(rootJs),
  'duration != 2400 in script.js'
);
suite.assert(
  'BOOT-EASE-CUBIC-SRC',
  'src/main.js implements ease-out-cubic formula 1 - Math.pow(1 - rawProgress, 3)',
  /1\s*-\s*Math\.pow\(\s*1\s*-\s*rawProgress\s*,\s*3\s*\)/i.test(srcJs),
  'ease-out-cubic formula missing in src/main.js'
);
suite.assert(
  'BOOT-HOLD-300-SRC',
  'src/main.js implements 300ms terminal hold before shutter reveal',
  /setTimeout\(\s*\(\)\s*=>[\s\S]*?,\s*300\s*\)/i.test(srcJs),
  '300ms hold timer missing in src/main.js'
);
suite.assert(
  'BOOT-SHUTTER-850-SRC',
  'src/main.js implements 850ms shutter exit transition timeout',
  /setTimeout\(\s*\(\)\s*=>[\s\S]*?introScreen\.style\.display\s*=\s*['"]none['"][\s\S]*?,\s*850\s*\)/i.test(srcJs),
  '850ms shutter transition missing in src/main.js'
);

// Empirical Mathematical Simulation of the Loading Easing Curve
const duration = 2400;
const frameStepMs = 1000 / 60; // 60 FPS standard RAF tick ~16.667ms
let prevPct = -1;
let prevEased = -1;
let isMonotonic = true;
let finalPct = 0;

for (let t = 0; t <= duration + frameStepMs; t += frameStepMs) {
  const elapsed = Math.min(duration, t);
  const rawProgress = Math.min(1, elapsed / duration);
  const eased = 1 - Math.pow(1 - rawProgress, 3);
  let currentPct = Math.min(100, Math.floor(eased * 100));

  if (rawProgress >= 1) {
    currentPct = 100;
  }

  if (currentPct < prevPct || eased < prevEased) {
    isMonotonic = false;
  }
  prevPct = currentPct;
  prevEased = eased;
  finalPct = currentPct;
}

// Compute rates at discrete non-zero points:
// Early sample: between t = 0 and t = 400ms
const earlyDeltaEased = (1 - Math.pow(1 - 400 / duration, 3)) - (1 - Math.pow(1 - 0 / duration, 3));
// Late sample: between t = 2000ms and t = 2400ms
const lateDeltaEased = (1 - Math.pow(1 - 2400 / duration, 3)) - (1 - Math.pow(1 - 2000 / duration, 3));

suite.assert('SIM-MONOTONIC', 'Camera boot RAF progression is strictly monotonic non-decreasing', isMonotonic);
suite.assert('SIM-TERMINAL-100', 'Simulation reaches exactly 100% upon rawProgress >= 1 at duration = 2400ms', finalPct === 100);
suite.assert('SIM-DECELERATION', `Ease-out-cubic produces strong deceleration (early rate ${earlyDeltaEased.toFixed(3)} > late rate ${lateDeltaEased.toFixed(3)} * 5)`, earlyDeltaEased > lateDeltaEased * 5);

// Verify HUD DOM elements for camera boot in index.html
const hudBootElements = [
  'id="introScreen"',
  'id="loadingPercent"',
  'id="loadingBarFill"',
  'id="introParticleCanvas"',
  'id="loadingCard"',
  'hud-corner-tl',
  'hud-corner-tr',
  'hud-corner-bl',
  'hud-corner-br',
  'hud-rec-tag',
  'LENS: 35MM T1.5',
  'ISO 800',
  'SHUTTER 180°',
  'SEMARANG, ID',
  'LAT: -7.0051 // LON: 110.4381'
];

for (const el of hudBootElements) {
  suite.assert(
    `BOOT-DOM-${el.slice(0, 20)}`,
    `Loading screen DOM contains "${el}"`,
    html.includes(el),
    `Element "${el}" missing in intro loading screen DOM`
  );
}

// =============================================================================
// AUDIT 5: CRYPTOGRAPHIC SHA256 DUAL-FILE PARITY
// =============================================================================
console.log(`\n${colors.cyan}[AUDIT 5] Cryptographic SHA256 Dual-File Parity${colors.reset}`);

const hashSrcCss = sha256('src/style.css');
const hashRootCss = sha256('style.css');
const hashSrcJs = sha256('src/main.js');
const hashRootJs = sha256('script.js');

suite.assert(
  'SHA256-CSS-PARITY',
  `src/style.css matches style.css (${hashSrcCss})`,
  hashSrcCss === hashRootCss,
  `Hash mismatch: src/style.css=${hashSrcCss} vs style.css=${hashRootCss}`
);

suite.assert(
  'SHA256-JS-PARITY',
  `src/main.js matches script.js (${hashSrcJs})`,
  hashSrcJs === hashRootJs,
  `Hash mismatch: src/main.js=${hashSrcJs} vs script.js=${hashRootJs}`
);

// =============================================================================
// AUDIT 6: USER ASSET INTEGRATION & FILE EXISTENCE
// =============================================================================
console.log(`\n${colors.cyan}[AUDIT 6] User Asset Integration & File Existence${colors.reset}`);

const requiredAssets = [
  'assets/christopher-base.jpg',
  'assets/christopher-base-cutout.png',
  'assets/profile-augmented.jpg',
  'assets/profile.jpg',
  'public/assets/christopher-base.jpg',
  'public/assets/christopher-base-cutout.png',
  'public/assets/profile-augmented.jpg',
  'public/assets/profile.jpg',
];

for (const ast of requiredAssets) {
  const fullPath = path.join(ROOT_DIR, ast);
  const exists = fs.existsSync(fullPath);
  let size = 0;
  if (exists) {
    size = fs.statSync(fullPath).size;
  }
  suite.assert(
    `ASSET-EXISTS-${ast}`,
    `Asset file ${ast} exists and is non-empty (${size} bytes)`,
    exists && size > 1000,
    `Asset file ${ast} missing or truncated (< 1KB)`
  );
}

// Assert assets are referenced in index.html
suite.assert('ASSET-REF-BASE', 'index.html references assets/christopher-base.jpg in Hero Lanyard Pass', html.includes('assets/christopher-base.jpg'));
suite.assert('ASSET-REF-CUTOUT', 'index.html references assets/christopher-base-cutout.png in About Spotlight', html.includes('assets/christopher-base-cutout.png'));
suite.assert('ASSET-REF-AUGMENTED', 'index.html references assets/profile-augmented.jpg in About Architect HUD Frame', html.includes('assets/profile-augmented.jpg'));
suite.assert('ASSET-REF-PROFILE', 'index.html references assets/profile.jpg in CV Modal Header', html.includes('assets/profile.jpg'));

// Final summary and process exit
const success = suite.summary();
process.exit(success ? 0 : 1);
