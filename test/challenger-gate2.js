/**
 * Challenger Gate 2 Verification Harness
 * Adversarial Audit for Christopher Theo Portfolio Capability Revamp
 *
 * Verifies:
 * 1. Forbidden Colors Scan (Zero occurrences in src/style.css, style.css, src/main.js, script.js, index.html)
 * 2. Cabinet Grotesk Font Import & CSS Declaration (Fontshare CDN + var(--font-display))
 * 3. Spotify DOM & Logic Complete Purge (Zero occurrences of obsolete selectors)
 * 4. Dual-File SHA256 Byte-for-Byte Synchronization (src/ ↔ root)
 * 5. Verbatim Content Preservation Across All Sections (Home, About, Focus, Skills, Projects, Contact, Modal)
 * 6. Production Build & Asset Verification
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

class ChallengerHarness {
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
      console.log(`         ${colors.red}Assertion Failure: ${errorMsg}${colors.reset}`);
    }
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(75));
    console.log(`${colors.bold}CHALLENGER GATE 2: EMPIRICAL VERIFICATION SUMMARY (${elapsed}s)${colors.reset}`);
    console.log('='.repeat(75));

    const suites = [...new Set(this.results.map(r => r.suite))];
    let allPassed = true;

    for (const s of suites) {
      const suiteResults = this.results.filter(r => r.suite === s);
      const passed = suiteResults.filter(r => r.passed).length;
      const total = suiteResults.length;
      const pct = Math.round((passed / total) * 100);
      const statusColor = passed === total ? colors.green : colors.red;
      if (passed !== total) allPassed = false;
      console.log(`  ${statusColor}${s.padEnd(52)}: ${passed}/${total} passed (${pct}%)${colors.reset}`);
    }

    const totalPassed = this.results.filter(r => r.passed).length;
    const totalCount = this.results.length;
    console.log('-'.repeat(75));

    if (allPassed) {
      console.log(`${colors.bold}${colors.green}ALL EMPIRICAL CHALLENGER ASSERTIONS PASSED! (${totalPassed}/${totalCount})${colors.reset}`);
      console.log(`${colors.bold}${colors.green}GATE 2 VERDICT: APPROVE${colors.reset}\n`);
    } else {
      const failed = totalCount - totalPassed;
      console.log(`${colors.bold}${colors.red}GATE 2 CHALLENGE FAILED: ${failed} assertion(s) failed out of ${totalCount}.${colors.reset}`);
      console.log(`${colors.bold}${colors.red}GATE 2 VERDICT: REJECT${colors.reset}\n`);
    }

    return allPassed;
  }
}

const harness = new ChallengerHarness();

function readFile(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

function getSha256(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex');
}

function normalize(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function textContains(haystack, needle) {
  if (!haystack || !needle) return false;
  return normalize(haystack).toLowerCase().includes(normalize(needle).toLowerCase());
}

// =============================================================================
// AUDIT 1: ADVERSARIAL FORBIDDEN COLOR SCAN
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- AUDIT 1: Adversarial Color Integrity Scan ---${colors.reset}`);

const forbiddenColors = [
  { name: '#38bdf8 (Sky blue)', regex: /#38bdf8\b/i },
  { name: '#7dd3fc (Light sky)', regex: /#7dd3fc\b/i },
  { name: '#6366f1 (Indigo)', regex: /#6366f1\b/i },
  { name: '#818cf8 (Light indigo)', regex: /#818cf8\b/i },
  { name: '#a855f7 (Purple)', regex: /#a855f7\b/i },
  { name: '#ec4899 (Pink)', regex: /#ec4899\b/i },
  { name: 'rgb(56, 189, 248) (Sky RGB)', regex: /rgba?\(\s*56\s*,\s*189\s*,\s*248/i },
  { name: 'rgb(99, 102, 241) (Indigo RGB)', regex: /rgba?\(\s*99\s*,\s*102\s*,\s*241/i },
  { name: 'rgb(125, 211, 252) (#7dd3fc RGB)', regex: /rgba?\(\s*125\s*,\s*211\s*,\s*252/i },
  { name: 'rgb(129, 140, 248) (#818cf8 RGB)', regex: /rgba?\(\s*129\s*,\s*140\s*,\s*248/i },
  { name: 'rgb(168, 85, 247) (#a855f7 RGB)', regex: /rgba?\(\s*168\s*,\s*85\s*,\s*247/i },
  { name: 'rgb(236, 72, 153) (#ec4899 RGB)', regex: /rgba?\(\s*236\s*,\s*72\s*,\s*153/i },
];

const scanFiles = [
  'src/style.css',
  'style.css',
  'src/main.js',
  'script.js',
  'index.html'
];

for (const relPath of scanFiles) {
  const content = readFile(relPath);
  harness.assert('Audit 1: Forbidden Colors', `COLOR:FILE:${relPath}`, `File ${relPath} exists and readable`, content !== null);
  if (!content) continue;

  for (const { name, regex } of forbiddenColors) {
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    harness.assert(
      'Audit 1: Forbidden Colors',
      `COLOR:${path.basename(relPath)}:${name}`,
      `Zero occurrences of ${name} in ${relPath}`,
      count === 0,
      `Found ${count} occurrence(s) in ${relPath}`
    );
  }
}

// =============================================================================
// AUDIT 2: CABINET GROTESK TYPOGRAPHY & FONTSHARE CDN
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- AUDIT 2: Cabinet Grotesk & Fontshare CDN Audit ---${colors.reset}`);

const htmlContent = readFile('index.html') || '';
const srcCssContent = readFile('src/style.css') || '';
const rootCssContent = readFile('style.css') || '';

// 2.1 Fontshare CDN link in HTML
const htmlFontshareLink = /<link[^>]*href=["']https:\/\/api\.fontshare\.com\/v2\/css\?f\[\]=cabinet-grotesk[^"']*["'][^>]*>/i.test(htmlContent);
harness.assert(
  'Audit 2: Typography & Fontshare CDN',
  'FONT:HTML:CDN',
  'index.html imports Cabinet Grotesk via Fontshare CDN <link>',
  htmlFontshareLink,
  'Missing Fontshare CDN stylesheet link in index.html'
);

// 2.2 Fontshare CDN @import in src/style.css
const srcCssFontshareImport = /@import\s+url\(["']https:\/\/api\.fontshare\.com\/v2\/css\?f\[\]=cabinet-grotesk[^"']*["']\);/i.test(srcCssContent);
harness.assert(
  'Audit 2: Typography & Fontshare CDN',
  'FONT:CSS:IMPORT',
  'src/style.css imports Cabinet Grotesk via @import url(...)',
  srcCssFontshareImport,
  'Missing Fontshare CDN @import in src/style.css'
);

// 2.3 Fontshare CDN @import in root style.css
const rootCssFontshareImport = /@import\s+url\(["']https:\/\/api\.fontshare\.com\/v2\/css\?f\[\]=cabinet-grotesk[^"']*["']\);/i.test(rootCssContent);
harness.assert(
  'Audit 2: Typography & Fontshare CDN',
  'FONT:ROOT_CSS:IMPORT',
  'style.css mirrors Fontshare CDN @import',
  rootCssFontshareImport,
  'Missing Fontshare CDN @import in style.css'
);

// 2.4 CSS --font-display token declared with 'Cabinet Grotesk'
const srcCssFontDisplayDecl = /--font-display:\s*['"]Cabinet Grotesk['"]/i.test(srcCssContent);
harness.assert(
  'Audit 2: Typography & Fontshare CDN',
  'FONT:CSS:TOKEN_DISPLAY',
  'src/style.css declares --font-display token with "Cabinet Grotesk"',
  srcCssFontDisplayDecl,
  '--font-display declaration missing or does not specify Cabinet Grotesk'
);

// 2.5 Headings & display selectors styled with var(--font-display)
const srcCssHeadingsDisplay = /h1,\s*h2,\s*h3[\s\S]*?font-family:\s*var\(--font-display\)/i.test(srcCssContent);
harness.assert(
  'Audit 2: Typography & Fontshare CDN',
  'FONT:CSS:HEADINGS',
  'Headings (h1-h6) and display titles styled with var(--font-display)',
  srcCssHeadingsDisplay,
  'Headings or display selectors not using var(--font-display)'
);

// 2.6 Preconnect to Fontshare CDN in index.html for performance
const htmlPreconnectFontshare = /<link[^>]*rel=["']preconnect["'][^>]*href=["']https:\/\/api\.fontshare\.com["'][^>]*>/i.test(htmlContent);
harness.assert(
  'Audit 2: Typography & Fontshare CDN',
  'FONT:HTML:PRECONNECT',
  'index.html includes preconnect to https://api.fontshare.com',
  htmlPreconnectFontshare,
  'Preconnect link to Fontshare CDN missing in index.html'
);

// =============================================================================
// AUDIT 3: SPOTIFY DOM & LOGIC COMPLETE PURGE
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- AUDIT 3: Spotify Widget Complete Purge Audit ---${colors.reset}`);

const spotifyForbiddenSelectors = [
  { name: '#spotifyCard ID', regex: /id=["']spotifyCard["']|#spotifyCard\b/i },
  { name: '#vinylDisc ID', regex: /id=["']vinylDisc["']|#vinylDisc\b/i },
  { name: '#btnPlayPause ID', regex: /id=["']btnPlayPause["']|#btnPlayPause\b/i },
  { name: '#progressBarBg ID', regex: /id=["']progressBarBg["']|#progressBarBg\b/i },
  { name: 'vinyl-disc class', regex: /\.vinyl-disc\b/i },
  { name: 'spotify-card class', regex: /\.spotify-card\b/i },
  { name: 'spotify-controls class', regex: /\.spotify-controls\b/i },
];

const spotifyFiles = [
  'index.html',
  'src/style.css',
  'style.css',
  'src/main.js',
  'script.js'
];

for (const relPath of spotifyFiles) {
  const content = readFile(relPath);
  if (!content) continue;

  for (const { name, regex } of spotifyForbiddenSelectors) {
    const hasMatch = regex.test(content);
    harness.assert(
      'Audit 3: Spotify Widget Purge',
      `SPOTIFY:${path.basename(relPath)}:${name.replace(/[^a-zA-Z0-9]/g, '_')}`,
      `Zero references to ${name} in ${relPath}`,
      !hasMatch,
      `Found forbidden Spotify element/class "${name}" in ${relPath}`
    );
  }
}

// =============================================================================
// AUDIT 4: SHA256 DUAL-FILE BYTE-FOR-BYTE SYNCHRONIZATION
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- AUDIT 4: Dual-File SHA256 Synchronization ---${colors.reset}`);

const shaSrcCss = getSha256('src/style.css');
const shaRootCss = getSha256('style.css');
const shaSrcJs = getSha256('src/main.js');
const shaRootJs = getSha256('script.js');

harness.assert(
  'Audit 4: SHA256 Synchronization',
  'SHA:CSS:EQUAL',
  `src/style.css ↔ style.css byte-for-byte match (${shaSrcCss})`,
  shaSrcCss !== null && shaSrcCss === shaRootCss,
  `CSS SHA mismatch: src=${shaSrcCss} vs root=${shaRootCss}`
);

harness.assert(
  'Audit 4: SHA256 Synchronization',
  'SHA:JS:EQUAL',
  `src/main.js ↔ script.js byte-for-byte match (${shaSrcJs})`,
  shaSrcJs !== null && shaSrcJs === shaRootJs,
  `JS SHA mismatch: src=${shaSrcJs} vs root=${shaRootJs}`
);

// Verify file sizes are greater than 0
const srcCssSize = fs.statSync(path.join(ROOT_DIR, 'src/style.css')).size;
const srcJsSize = fs.statSync(path.join(ROOT_DIR, 'src/main.js')).size;
harness.assert('Audit 4: SHA256 Synchronization', 'SIZE:CSS:VALID', `src/style.css size is substantial (${srcCssSize} bytes)`, srcCssSize > 10000);
harness.assert('Audit 4: SHA256 Synchronization', 'SIZE:JS:VALID', `src/main.js size is substantial (${srcJsSize} bytes)`, srcJsSize > 10000);

// =============================================================================
// AUDIT 5: VERBATIM CONTENT PRESERVATION STRESS TEST
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- AUDIT 5: Verbatim Content Preservation Stress Test ---${colors.reset}`);

const contentChecks = [
  // SECTION 1: HOME / HERO
  { id: 'CONT:HOME:NAME', desc: 'Hero name "Christopher Theo Purnomo"', check: () => textContains(htmlContent, 'Christopher Theo Purnomo') },
  { id: 'CONT:HOME:AFFIL', desc: 'Hero affiliation "Unika Soegijapranata — Semarang"', check: () => textContains(htmlContent, 'Unika Soegijapranata — Semarang') },
  { id: 'CONT:HOME:ROLE', desc: 'Hero role "Informatics Student & Software Builder"', check: () => textContains(htmlContent, 'Informatics Student & Software Builder') },
  { id: 'CONT:HOME:BIO', desc: 'Hero narrative bio paragraph', check: () => textContains(htmlContent, 'Berfokus pada pengembangan sistem web end-to-end, pemodelan Decision Support System (DSS)') },
  { id: 'CONT:HOME:CTA_PROJ', desc: 'Hero CTA button "Lihat Proyek" pointing to #portfolio', check: () => textContains(htmlContent, 'Lihat Proyek') && /href=["']#portfolio["']/i.test(htmlContent) },
  { id: 'CONT:HOME:CTA_RES', desc: 'Hero CTA button "Ringkasan Resume" triggering modal', check: () => textContains(htmlContent, 'Ringkasan Resume') && /id=["']btnOpenResume["']/i.test(htmlContent) },
  { id: 'CONT:HOME:METRIC_DOM', desc: 'Hero metric "DOMISILI & KAMPUS: Semarang / Unika Soegijapranata"', check: () => textContains(htmlContent, 'DOMISILI & KAMPUS') && textContains(htmlContent, 'Semarang / Unika Soegijapranata') },
  { id: 'CONT:HOME:METRIC_FOK', desc: 'Hero metric "BIDANG FOKUS" cleanly removed from hero', check: () => !/class="hero-stats"[\s\S]*?BIDANG FOKUS/i.test(htmlContent) },

  // SECTION 2: ABOUT ME
  { id: 'CONT:ABOUT:HEAD', desc: 'About section header "01 // ABOUT ME"', check: () => textContains(htmlContent, '01 // ABOUT ME') },
  { id: 'CONT:ABOUT:TAGLINE', desc: 'About tagline "Rekayasa Berbasis Logika, Keputusan Berbasis Data."', check: () => textContains(htmlContent, 'Rekayasa Berbasis Logika, Keputusan Berbasis Data.') },
  { id: 'CONT:ABOUT:P1', desc: 'About narrative paragraph 1 verbatim text', check: () => textContains(htmlContent, 'Saya adalah mahasiswa Teknik Informatika di Universitas Katolik Soegijapranata (Unika Soegijapranata) Semarang') },
  { id: 'CONT:ABOUT:P2', desc: 'About narrative paragraph 2 verbatim text', check: () => textContains(htmlContent, 'Bagi saya, perangkat lunak yang bernilai bukan tentang tumpukan buzzword atau antarmuka yang dibuat-buat') },

  // SECTION 3: FOCUS AREAS
  { id: 'CONT:FOCUS:DSS', desc: 'Focus Area 01 "Decision Support Systems"', check: () => textContains(htmlContent, '01') && textContains(htmlContent, 'Decision Support Systems') && textContains(htmlContent, 'Merancang engine analitis multi-kriteria') },
  { id: 'CONT:FOCUS:WEB', desc: 'Focus Area 02 "Full-Stack & Web Systems"', check: () => textContains(htmlContent, '02') && textContains(htmlContent, 'Full-Stack & Web Systems') && textContains(htmlContent, 'Membangun arsitektur web fungsional') },
  { id: 'CONT:FOCUS:AIML', desc: 'Focus Area 03 "Applied AI/ML & IoT"', check: () => textContains(htmlContent, '03') && textContains(htmlContent, 'Applied AI/ML & IoT') && textContains(htmlContent, 'Mengintegrasikan model pembelajaran mesin terapan') },

  // SECTION 4: SKILLS MATRIX
  { id: 'CONT:SKILL:LANG', desc: 'Skills Matrix: Languages (JavaScript, PHP, Python, SQL)', check: () => textContains(htmlContent, 'JavaScript (ES6+)') && textContains(htmlContent, 'PHP') && textContains(htmlContent, 'Python') && textContains(htmlContent, 'SQL') },
  { id: 'CONT:SKILL:FRAME', desc: 'Skills Matrix: Frameworks (Node.js, Vite, RESTful API, Tailwind CSS, Bootstrap)', check: () => textContains(htmlContent, 'Node.js') && textContains(htmlContent, 'Vite') && textContains(htmlContent, 'RESTful API') },
  { id: 'CONT:SKILL:DB', desc: 'Skills Matrix: Database (MySQL, Relational Schema Design, ACID Transactions)', check: () => textContains(htmlContent, 'MySQL') && textContains(htmlContent, 'Relational Schema Design') && textContains(htmlContent, 'ACID Transactions') },
  { id: 'CONT:SKILL:MCDM', desc: 'Skills Matrix: DSS (Multi-Criteria Decision Making, AHP, TOPSIS)', check: () => textContains(htmlContent, 'Multi-Criteria Decision Making (MCDM)') && textContains(htmlContent, 'AHP (Analytic Hierarchy Process)') && textContains(htmlContent, 'TOPSIS') },

  // SECTION 5: INTERNMATCH DSS CASE STUDY
  { id: 'CONT:IM:ID', desc: 'InternMatch DSS container maintains ID #project-internmatch', check: () => /id=["']project-internmatch["']/i.test(htmlContent) },
  { id: 'CONT:IM:TITLE', desc: 'InternMatch DSS title preserved verbatim', check: () => textContains(htmlContent, 'InternMatch DSS') },
  { id: 'CONT:IM:TAGLINE', desc: 'InternMatch DSS subtitle/tagline preserved', check: () => textContains(htmlContent, 'Sistem Pendukung Keputusan Multi-Kriteria untuk Rekomendasi Penempatan Magang Mahasiswa') },
  { id: 'CONT:IM:CONTEXT', desc: 'InternMatch DSS problem context preserved', check: () => textContains(htmlContent, 'Proses pencocokan antara kompetensi mahasiswa dengan kriteria spesifikasi mitra industri magang sering kali terbentur bias subjektif') },
  { id: 'CONT:IM:CONTRIB', desc: 'InternMatch DSS engineering contributions preserved', check: () => textContains(htmlContent, 'formulasi logika sistem pendukung keputusan (DSS), perancangan matriks pembobotan kriteria') },
  { id: 'CONT:IM:METHOD', desc: 'InternMatch DSS methodology preserved (AHP & TOPSIS)', check: () => textContains(htmlContent, 'AHP (Analytic Hierarchy Process)') && textContains(htmlContent, 'TOPSIS / Profile Matching') },
  { id: 'CONT:IM:CHALLENGE', desc: 'InternMatch DSS challenges & technical solutions preserved', check: () => textContains(htmlContent, 'konsistensi matriks perbandingan berpasangan (Pairwise Comparison Consistency Ratio < 0.1)') },
  { id: 'CONT:IM:LIVE_URL', desc: 'InternMatch DSS live deployment URL (https://internmatch-dss.vercel.app)', check: () => /href=["']https:\/\/internmatch-dss\.vercel\.app\/?["']/i.test(htmlContent) },
  { id: 'CONT:IM:GITHUB_URL', desc: 'InternMatch DSS GitHub repo URL (https://github.com/Christopher112321/internmatch-dss)', check: () => /href=["']https:\/\/github\.com\/Christopher112321\/internmatch-dss\/?["']/i.test(htmlContent) },

  // SECTION 6: MYSEMBAKO CASE STUDY
  { id: 'CONT:MS:ID', desc: 'MySembako container maintains ID #project-mysembako', check: () => /id=["']project-mysembako["']/i.test(htmlContent) },
  { id: 'CONT:MS:TITLE', desc: 'MySembako title preserved verbatim', check: () => textContains(htmlContent, 'MySembako') },
  { id: 'CONT:MS:TAGLINE', desc: 'MySembako subtitle/tagline preserved', check: () => textContains(htmlContent, 'Platform Terpadu Manajemen Stok, Distribusi, dan Transaksi Komoditas Sembilan Bahan Pokok') },
  { id: 'CONT:MS:CONTEXT', desc: 'MySembako problem context preserved', check: () => textContains(htmlContent, 'Pengelolaan pasokan sembako pada toko fisik konvensional rentan terhadap pencatatan ganda') },
  { id: 'CONT:MS:CONTRIB', desc: 'MySembako engineering contributions preserved', check: () => textContains(htmlContent, 'merancang skema database relasional untuk entitas barang, satuan multi-kemasan, log pergerakan stok') },
  { id: 'CONT:MS:CHALLENGE', desc: 'MySembako challenges & technical solutions preserved', check: () => textContains(htmlContent, 'Menjaga integritas data saat transaksi penjualan berlangsung serentak (concurrency control)') },
  { id: 'CONT:MS:LIVE_URL', desc: 'MySembako live deployment URL (https://mysembako.vercel.app)', check: () => /href=["']https:\/\/mysembako\.vercel\.app\/?["']/i.test(htmlContent) },
  { id: 'CONT:MS:GITHUB_URL', desc: 'MySembako GitHub repo URL (https://github.com/Christopher112321/mysembako)', check: () => /href=["']https:\/\/github\.com\/Christopher112321\/mysembako\/?["']/i.test(htmlContent) },

// SECTION 6b: ENERGY SCHEDULER CASE STUDY
  { id: 'CONT:ES:ID', desc: 'Energy Scheduler container maintains ID #project-energy-scheduler', check: () => /id=["']project-energy-scheduler["']/i.test(htmlContent) },
  { id: 'CONT:ES:TITLE', desc: 'Energy Scheduler title preserved verbatim', check: () => textContains(htmlContent, 'Energy Scheduler') },
  { id: 'CONT:ES:TAGLINE', desc: 'Energy Scheduler subtitle/tagline preserved', check: () => textContains(htmlContent, 'Sistem Penjadwalan Mingguan Otomatis Berbasis Genetic Algorithm') },
  { id: 'CONT:ES:LIVE_URL', desc: 'Energy Scheduler live deployment URL (https://energy-scheduler-ashy.vercel.app)', check: () => /href=["']https:\/\/energy-scheduler-ashy\.vercel\.app\/?["']/i.test(htmlContent) },
  { id: 'CONT:ES:GITHUB_URL', desc: 'Energy Scheduler GitHub repo URL (https://github.com/Christopher112321/energy-scheduler)', check: () => /href=["']https:\/\/github\.com\/Christopher112321\/energy-scheduler\/?["']/i.test(htmlContent) },

  // SECTION 7: CONTACT CHANNELS
  { id: 'CONT:CONTACT:HEAD', desc: 'Contact section header "03 // DIRECT CHANNELS"', check: () => textContains(htmlContent, '03 // DIRECT CHANNELS') && textContains(htmlContent, 'Mari Terhubung dan Berdiskusi') },
  { id: 'CONT:CONTACT:EMAIL', desc: 'Contact channel 1: Email (chris.theo.purnomo@gmail.com) with copy button', check: () => textContains(htmlContent, 'chris.theo.purnomo@gmail.com') && /id=["']btnCopyEmail["']/i.test(htmlContent) },
  { id: 'CONT:CONTACT:GITHUB', desc: 'Contact channel 2: GitHub (github.com/christophertheop)', check: () => textContains(htmlContent, 'github.com/christophertheop') },
  { id: 'CONT:CONTACT:LINKEDIN', desc: 'Contact channel 3: LinkedIn (linkedin.com/in/christopher-theo-purnomo)', check: () => textContains(htmlContent, 'linkedin.com/in/christopher-theo-purnomo') },
  { id: 'CONT:CONTACT:IG', desc: 'Contact channel 4: Instagram (@chris_theo.p)', check: () => textContains(htmlContent, '@chris_theo.p') && /href=["']https:\/\/instagram\.com\/chris_theo\.p\/?["']/i.test(htmlContent) },

  // SECTION 8: CV MODAL
  { id: 'CONT:MODAL:ID', desc: 'CV modal maintains ID #resumeModal and accessibility attributes', check: () => /id=["']resumeModal["'][^>]*role=["']dialog["']/i.test(htmlContent) && /aria-modal=["']true["']/i.test(htmlContent) },
  { id: 'CONT:MODAL:TITLE', desc: 'CV modal title "CURRICULUM VITAE OVERVIEW"', check: () => textContains(htmlContent, 'CURRICULUM VITAE OVERVIEW') },
  { id: 'CONT:MODAL:EDU', desc: 'CV modal education: Universitas Katolik Soegijapranata, Teknik Informatika', check: () => textContains(htmlContent, 'Universitas Katolik Soegijapranata') && textContains(htmlContent, 'Teknik Informatika') },
  { id: 'CONT:MODAL:PROJ', desc: 'CV modal projects: InternMatch DSS, MySembako, and Energy Scheduler featured', check: () => textContains(htmlContent, 'InternMatch DSS') && textContains(htmlContent, 'MySembako') && textContains(htmlContent, 'Energy Scheduler') },
  { id: 'CONT:MODAL:CTA', desc: 'CV modal PDF request CTA via mailto', check: () => textContains(htmlContent, 'Minta Berkas CV Lengkap (.PDF)') && /href=["']mailto:chris\.theo\.purnomo@gmail\.com[^"']*["']/i.test(htmlContent) },
];

for (const { id, desc, check } of contentChecks) {
  harness.assert('Audit 5: Content Preservation', id, desc, check());
}

// =============================================================================
// AUDIT 6: PRODUCTION BUILD & DIST VERIFICATION
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- AUDIT 6: Production Build & Dist Artifacts ---${colors.reset}`);

const distHtml = readFile('dist/index.html');
harness.assert('Audit 6: Dist Artifacts', 'DIST:HTML:EXISTS', 'dist/index.html exists and is readable', distHtml !== null);

if (distHtml) {
  // Check dist/index.html has zero forbidden colors
  for (const { name, regex } of forbiddenColors) {
    const hasMatch = regex.test(distHtml);
    harness.assert(
      'Audit 6: Dist Artifacts',
      `DIST:COLOR:${name}`,
      `Zero occurrences of ${name} in dist/index.html`,
      !hasMatch,
      `Found forbidden color in production build dist/index.html`
    );
  }

  // Check dist/index.html has zero Spotify selectors
  for (const { name, regex } of spotifyForbiddenSelectors) {
    const hasMatch = regex.test(distHtml);
    harness.assert(
      'Audit 6: Dist Artifacts',
      `DIST:SPOTIFY:${name.replace(/[^a-zA-Z0-9]/g, '_')}`,
      `Zero references to ${name} in dist/index.html`,
      !hasMatch,
      `Found forbidden Spotify element in dist/index.html`
    );
  }

  // Check dist/index.html preserves core DOM sections and title
  const hasHomeId = /id=["']home["']/i.test(distHtml);
  const hasAboutId = /id=["']about["']/i.test(distHtml);
  const hasPortfolioId = /id=["']portfolio["']/i.test(distHtml);
  const hasContactId = /id=["']contact["']/i.test(distHtml);
  const hasSkillsId = /id=["']skills["']/i.test(distHtml);
  const hasMarquee = /class=["'][^"']*hero-marquee-wrap[^"']*["']/i.test(distHtml);
  const hasResumeModalId = /id=["']resumeModal["']/i.test(distHtml);

  harness.assert(
    'Audit 6: Dist Artifacts',
    'DIST:DOM:SECTIONS',
    'dist/index.html preserves #home, #skills, #about, #portfolio, #contact, #resumeModal',
    hasHomeId && hasAboutId && hasPortfolioId && hasContactId && hasSkillsId && hasMarquee && hasResumeModalId,
    `Missing in dist/index.html: home=${hasHomeId}, skills=${hasSkillsId}, marquee=${hasMarquee}, about=${hasAboutId}, portfolio=${hasPortfolioId}, contact=${hasContactId}, modal=${hasResumeModalId}`
  );

  // Check that root-relative paths in dist/index.html do not use /portof/
  harness.assert(
    'Audit 6: Dist Artifacts',
    'DIST:PATH:ROOT',
    'dist/index.html asset references resolve from root "/" without /portof/ subpath',
    !/\/portof\//i.test(distHtml)
  );
}

// Print complete summary
const passed = harness.summary();
process.exit(passed ? 0 : 1);
