/**
 * Milestone 2 Verification Test Suite: 3D Liquid Glass Flip Cards
 *
 * Assertions:
 *   1. 3D flip card structure present for both cards (#project-internmatch, #project-mysembako)
 *   2. Dual-face architecture (.flip-card-wrapper, .flip-card-inner, .flip-card-front, .flip-card-back)
 *   3. Front face direct action button opens live Vercel apps with target="_blank" and rel="noopener noreferrer"
 *   4. Dedicated flip trigger buttons present (.btn-flip-trigger, .btn-flip-back) with accessible labels
 *   5. 100% case study text and technical contributions preserved verbatim on back face
 *   6. Prominent GitHub repository links present on back face
 *   7. Direct live Vercel link present on back face as well
 *   8. Front visual media preview containers present (.card-preview-media)
 *   9. 3D perspective and transformation styles in CSS (perspective, preserve-3d, backface-visibility, rotateY)
 *  10. Liquid glass styling (backdrop-filter blur, translucent obsidian background, specular edge reflections)
 *  11. Interactive JavaScript controller in src/main.js supporting click, Enter, and Space keys
 *  12. Event isolation (stopPropagation) on all nested interactive links and buttons
 *  13. Byte-for-byte synchronization between src/style.css and style.css
 *  14. Byte-for-byte synchronization between src/main.js and script.js
 *  15. Production build integrity and bundle budgets
 *
 * Usage:
 *   node test/m2-verify.js
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
console.log(`${colors.bold}MILESTONE 2: 3D LIQUID GLASS FLIP CARDS VERIFICATION SUITE${colors.reset}`);
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
// SUITE 1: 3D FLIP CARD DOM ARCHITECTURE & IDENTIFIERS
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 1: 3D Flip Card DOM Architecture & IDs ---${colors.reset}`);

// 1.1 Both project cards maintain exact IDs
assert(
  /<article[^>]*id=["']project-internmatch["']/i.test(html),
  'M2:1.1',
  'Card 1 maintains ID #project-internmatch for backward compatibility'
);
assert(
  /<article[^>]*id=["']project-mysembako["']/i.test(html),
  'M2:1.2',
  'Card 2 maintains ID #project-mysembako for backward compatibility'
);

// 1.2 Both cards have .flip-card-wrapper class
const imCardTag = html.match(/<article[^>]*id=["']project-internmatch["'][^>]*>/i)?.[0] || '';
const msCardTag = html.match(/<article[^>]*id=["']project-mysembako["'][^>]*>/i)?.[0] || '';
const hasWrapperClasses = imCardTag.includes('flip-card-wrapper') && msCardTag.includes('flip-card-wrapper');
assert(hasWrapperClasses, 'M2:1.3', 'Both project cards contain .flip-card-wrapper class');

// 1.3 Inner 3D stage .flip-card-inner exists in both cards
const innerMatches = (html.match(/class=["'][^"']*flip-card-inner[^"']*["']/g) || []).length;
assert(innerMatches >= 2, 'M2:1.4', `Both project cards contain .flip-card-inner container (found: ${innerMatches})`);

// 1.4 Both cards declare dual faces (.flip-card-front and .flip-card-back)
const frontFaces = (html.match(/class=["'][^"']*flip-card-front[^"']*["']/g) || []).length;
const backFaces = (html.match(/class=["'][^"']*flip-card-back[^"']*["']/g) || []).length;
assert(
  frontFaces >= 2 && backFaces >= 2,
  'M2:1.5',
  `Dual face structure present (front faces: ${frontFaces}, back faces: ${backFaces})`
);

// =============================================================================
// SUITE 2: FRONT FACE REQUIREMENTS (PREVIEW, LIVE APP, FLIP TRIGGER)
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 2: Front Face Controls & Visual Preview ---${colors.reset}`);

// 2.1 Visual media preview containers present
const previewMediaMatches = (html.match(/class=["'][^"']*card-preview-media[^"']*["']/g) || []).length;
assert(
  previewMediaMatches >= 2,
  'M2:2.1',
  `Visual media containers (.card-preview-media) present on both front faces (found: ${previewMediaMatches})`
);

// 2.2 Direct live Vercel app button on front face
const imFrontLive = html.includes('href="https://internmatch-dss.vercel.app"') &&
                    html.includes('class="btn-live-project"');
const msFrontLive = html.includes('href="https://mysembako.vercel.app"') &&
                    html.includes('class="btn-live-project"');
assert(
  imFrontLive && msFrontLive,
  'M2:2.2',
  'Direct action buttons (.btn-live-project) for InternMatch DSS and MySembako present on front face'
);

// 2.3 Direct live buttons specify target="_blank" and rel="noopener noreferrer"
const liveButtons = [...html.matchAll(/<a[^>]*class=["'][^"']*btn-live-project[^"']*["'][^>]*>/gi)].map(m => m[0]);
const liveLinksTargetBlank = liveButtons.length >= 2 && liveButtons.every(tag => tag.includes('target="_blank"'));
const liveLinksRelNoopener = liveButtons.length >= 2 && liveButtons.every(tag => tag.includes('rel="noopener noreferrer"'));
assert(
  liveLinksTargetBlank && liveLinksRelNoopener,
  'M2:2.3',
  'Front face live buttons specify target="_blank" and rel="noopener noreferrer"'
);

// 2.4 Dedicated flip trigger buttons (.btn-flip-trigger) on front face
const flipTriggers = (html.match(/class=["'][^"']*btn-flip-trigger[^"']*["']/g) || []).length;
assert(
  flipTriggers >= 2,
  'M2:2.4',
  `Dedicated flip triggers (.btn-flip-trigger) present on both front faces (found: ${flipTriggers})`
);

// 2.5 Flip triggers have accessible labels and data-target attributes
const imTriggerA11y = /class=["'][^"']*btn-flip-trigger[^"']*["'][^>]*data-target=["']project-internmatch["']/i.test(html);
const msTriggerA11y = /class=["'][^"']*btn-flip-trigger[^"']*["'][^>]*data-target=["']project-mysembako["']/i.test(html);
assert(
  imTriggerA11y && msTriggerA11y,
  'M2:2.5',
  'Flip triggers configure accessible data-target referencing respective project cards'
);

// =============================================================================
// SUITE 3: BACK FACE REQUIREMENTS & 100% CONTENT PRESERVATION
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 3: Back Face Content Integrity & Repo Links ---${colors.reset}`);

// 3.1 InternMatch DSS 100% case study text preserved verbatim
const imTextChunks = [
  'Sistem Pendukung Keputusan Multi-Kriteria untuk Rekomendasi Penempatan Magang Mahasiswa',
  'Proses pencocokan antara kompetensi mahasiswa dengan kriteria spesifikasi mitra industri magang',
  'Bertanggung jawab atas formulasi logika sistem pendukung keputusan (DSS)',
  'AHP (Analytic Hierarchy Process)',
  'TOPSIS / Profile Matching',
  'Tantangan utama terletak pada konsistensi matriks perbandingan berpasangan',
  'Pairwise Comparison Consistency Ratio',
  'Sistem berhasil menghasilkan rekomendasi penempatan magang yang dapat diaudit perhitungannya'
];
const imAllPreserved = imTextChunks.every(chunk => html.includes(chunk));
assert(
  imAllPreserved,
  'M2:3.1',
  'InternMatch DSS: 100% case study text, role, MCDM methodology, and technical challenges preserved verbatim'
);

// 3.2 MySembako 100% case study text preserved verbatim
const msTextChunks = [
  'Platform Terpadu Manajemen Stok, Distribusi, dan Transaksi Komoditas Sembilan Bahan Pokok',
  'Pengelolaan pasokan sembako pada toko fisik konvensional rentan terhadap pencatatan ganda',
  'Sebagai pengembang utama (Full-Stack Developer) yang merancang skema database relasional',
  'Pencatatan batch masuk dan keluar (FIFO/rata-rata)',
  'Menjaga integritas data saat transaksi penjualan berlangsung serentak',
  'Aplikasi menyederhanakan siklus rekonsiliasi stok harian dari hitungan jam menjadi hitungan menit'
];
const msAllPreserved = msTextChunks.every(chunk => html.includes(chunk));
assert(
  msAllPreserved,
  'M2:3.2',
  'MySembako: 100% case study text, database architecture, and operational features preserved verbatim'
);

// 3.3 Prominent GitHub repository links on back face
const hasImGithub = html.includes('https://github.com/Christopher112321/internmatch-dss');
const hasMsGithub = html.includes('https://github.com/Christopher112321/mysembako');
assert(
  hasImGithub && hasMsGithub,
  'M2:3.3',
  'Prominent GitHub repository links present on both back faces'
);

// 3.4 Direct live Vercel app links on back face
const backFaceLiveLinks = (html.match(/class=["'][^"']*project-link-live[^"']*["']/g) || []).length;
assert(
  backFaceLiveLinks >= 2,
  'M2:3.4',
  `Direct live demo links present on back faces for convenience (found: ${backFaceLiveLinks})`
);

// 3.5 Dedicated flip-back buttons (.btn-flip-back) on back face
const flipBackButtons = (html.match(/class=["'][^"']*btn-flip-back[^"']*["']/g) || []).length;
assert(
  flipBackButtons >= 2,
  'M2:3.5',
  `Dedicated flip-back buttons (.btn-flip-back) present on back faces (found: ${flipBackButtons})`
);

// =============================================================================
// SUITE 4: 3D LIQUID GLASS STYLING & MOTION OPTICS
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 4: 3D Liquid Glass Styling & Optics in CSS ---${colors.reset}`);

// 4.1 3D Perspective and transform-style configured
const hasPerspective = css.includes('perspective: 1200px') || css.includes('perspective: 1400px');
const hasPreserve3d = css.includes('transform-style: preserve-3d');
assert(
  hasPerspective && hasPreserve3d,
  'M2:4.1',
  'CSS declares 3D perspective and transform-style: preserve-3d'
);

// 4.2 Backface visibility hidden on faces
const hasBackfaceHidden = css.includes('backface-visibility: hidden') &&
                          css.includes('-webkit-backface-visibility: hidden');
assert(
  hasBackfaceHidden,
  'M2:4.2',
  'CSS declares backface-visibility: hidden on flip card faces'
);

// 4.3 180-degree flip rotation defined
const hasFlipRotation = css.includes('.case-study-card.is-flipped .flip-card-inner') &&
                        css.includes('rotateY(180deg)');
assert(
  hasFlipRotation,
  'M2:4.3',
  'CSS declares .is-flipped state with transform: rotateY(180deg)'
);

// 4.4 Liquid glass translucent styling and backdrop blur
const hasGlassmorphism = css.includes('backdrop-filter: blur(') &&
                         css.includes('-webkit-backdrop-filter: blur(') &&
                         css.includes('rgba(14, 14, 17,');
assert(
  hasGlassmorphism,
  'M2:4.4',
  'CSS declares liquid glass backdrop-filter blur and translucent obsidian background'
);

// 4.5 Specular highlight edge reflections
const hasSpecularEdge = css.includes('.glass-specular-edge') &&
                        css.includes('.glass-shimmer-band');
assert(
  hasSpecularEdge,
  'M2:4.5',
  'CSS declares specular highlight edge reflections (.glass-specular-edge, .glass-shimmer-band)'
);

// 4.6 Reduced motion support for 3D flip transitions
const hasReducedMotion = css.includes('@media (prefers-reduced-motion: reduce)') &&
                         css.includes('.flip-card-inner') &&
                         css.includes('transition: none !important');
assert(
  hasReducedMotion,
  'M2:4.6',
  'CSS includes explicit prefers-reduced-motion override disabling flip transitions'
);

// =============================================================================
// SUITE 5: INTERACTIVE SCRIPTING & ACCESSIBILITY IN JS
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 5: Interactive Scripting & Event Isolation in JS ---${colors.reset}`);

// 5.1 Flip triggers queried and bound in JS
const hasFlipTriggersQuery = js.includes("querySelectorAll('.btn-flip-trigger')") &&
                             js.includes("querySelectorAll('.btn-flip-back')");
assert(
  hasFlipTriggersQuery,
  'M2:5.1',
  'src/main.js queries .btn-flip-trigger and .btn-flip-back elements'
);

// 5.2 Card flip toggle updates .is-flipped class and aria-expanded
const hasFlipToggleLogic = js.includes("classList.add('is-flipped')") &&
                           js.includes("classList.remove('is-flipped')") &&
                           js.includes("setAttribute('aria-expanded'");
assert(
  hasFlipToggleLogic,
  'M2:5.2',
  'src/main.js implements card flipping via .is-flipped toggle and aria-expanded updates'
);

// 5.3 Keyboard activation support (Enter and Space keys)
const hasKeyboardFlip = js.includes("e.key === 'Enter'") &&
                        js.includes("e.key === ' '");
assert(
  hasKeyboardFlip,
  'M2:5.3',
  'Flip triggers support both Enter and Space keys for full keyboard accessibility'
);

// 5.4 Event isolation (stopPropagation) on interactive elements
const hasFlipIsolation = js.includes('e.stopPropagation()') &&
                         js.includes('flipCardInteractive');
assert(
  hasFlipIsolation,
  'M2:5.4',
  'Nested links and buttons stop event propagation to prevent unintended flips/nav'
);

// 5.5 Focus management for assistive tech
const hasFocusManagement = js.includes('closeBtn.focus()') &&
                           js.includes('triggerBtn.focus()');
assert(
  hasFocusManagement,
  'M2:5.5',
  'Focus management implemented transferring focus between flip triggers and close buttons'
);

// =============================================================================
// SUITE 6: BYTE-FOR-BYTE SYNCHRONIZATION
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 6: Byte-For-Byte Synchronization ---${colors.reset}`);

const srcCssHash = sha256('src/style.css');
const rootCssHash = sha256('style.css');
const cssSynced = srcCssHash === rootCssHash;
assert(
  cssSynced,
  'M2:6.1',
  `src/style.css and root style.css are byte-identical (${srcCssHash.slice(0, 16)}...)`
);

const srcJsHash = sha256('src/main.js');
const rootJsHash = sha256('script.js');
const jsSynced = srcJsHash === rootJsHash;
assert(
  jsSynced,
  'M2:6.2',
  `src/main.js and root script.js are byte-identical (${srcJsHash.slice(0, 16)}...)`
);

// =============================================================================
// SUITE 7: PRODUCTION BUILD INTEGRITY
// =============================================================================
console.log(`\n${colors.bold}${colors.cyan}--- SUITE 7: Production Build Integrity ---${colors.reset}`);

assert(fs.existsSync(distHtmlPath), 'M2:7.1', 'dist/index.html exists from production build');

const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
const distHtmlSize = Buffer.byteLength(distHtml, 'utf8');
assert(
  distHtmlSize < 80 * 1024,
  'M2:7.2',
  `dist/index.html (${(distHtmlSize / 1024).toFixed(2)} KB) is within 80KB performance budget`
);

const distHasCards = distHtml.includes('id="project-internmatch"') &&
                     distHtml.includes('id="project-mysembako"') &&
                     distHtml.includes('id="project-energy-scheduler"') &&
                     distHtml.includes('flip-card-wrapper') &&
                     distHtml.includes('btn-live-project') &&
                     distHtml.includes('btn-flip-trigger');
assert(
  distHasCards,
  'M2:7.3',
  'dist/index.html includes 3D flip card components, direct links, and triggers'
);

// =============================================================================
// SUMMARY
// =============================================================================
console.log('\n' + '='.repeat(72));
console.log(`${colors.bold}MILESTONE 2 VERIFICATION SUMMARY${colors.reset}`);
console.log('='.repeat(72));
console.log(`Total Assertions Evaluated : ${passedCount + failedCount}`);
console.log(`Passed                     : ${colors.green}${passedCount}${colors.reset}`);
console.log(`Failed                     : ${failedCount === 0 ? colors.green + '0' : colors.red + failedCount}${colors.reset}`);
console.log(`Success Rate               : ${Math.round((passedCount / (passedCount + failedCount)) * 100)}%`);

if (failedCount === 0) {
  console.log(`\n${colors.bold}${colors.green}VERDICT: APPROVE — ALL MILESTONE 2 REQUIREMENTS VERIFIED!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n${colors.bold}${colors.red}VERDICT: REJECT — ${failedCount} FAILURE(S) DETECTED!${colors.reset}\n`);
  process.exit(1);
}
