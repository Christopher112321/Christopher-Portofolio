/**
 * E2E Verification Test Harness & Runner
 * Christopher Theo Purnomo Portfolio Retheming & Vercel Deployment
 *
 * Tiers:
 *   Tier 1: 100% Content Preservation
 *   Tier 2: Boundary & Aesthetic Constraints (Reyna De-theming)
 *   Tier 3: Cross-Feature & State Interactivity
 *   Tier 4: Real-World Deployment & Build Verification
 *
 * Usage:
 *   node test/e2e-verify.js
 *   node test/e2e-verify.js --tier=1
 *   node test/e2e-verify.js --no-build
 *   npm test
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Command line arguments
const args = process.argv.slice(2);
const targetTierArg = args.find(a => a.startsWith('--tier='));
const targetTier = targetTierArg ? parseInt(targetTierArg.split('=')[1], 10) : null;
const skipBuild = args.includes('--no-build');
const verbose = args.includes('--verbose') || args.includes('-v');

// Color helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

class TestReporter {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  record(tier, id, description, passed, error = null, details = null) {
    this.results.push({ tier, id, description, passed, error, details });
    const mark = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
    console.log(`  ${mark} ${colors.gray}[T${tier}:${id}]${colors.reset} ${description}`);
    if (!passed && error) {
      console.log(`         ${colors.red}Error: ${error}${colors.reset}`);
      if (details) {
        console.log(`         ${colors.yellow}Details: ${details}${colors.reset}`);
      }
    }
  }

  printSummary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const tiers = [1, 2, 3, 4];
    console.log('\n' + '='.repeat(70));
    console.log(`${colors.bold}E2E TEST VERIFICATION SUMMARY${colors.reset} (${elapsed}s)`);
    console.log('='.repeat(70));

    let allPassed = true;
    for (const t of tiers) {
      const tierResults = this.results.filter(r => r.tier === t);
      if (tierResults.length === 0) continue;
      const passed = tierResults.filter(r => r.passed).length;
      const total = tierResults.length;
      const pct = Math.round((passed / total) * 100);
      const statusColor = passed === total ? colors.green : colors.red;
      if (passed !== total) allPassed = false;
      const tierNames = [
        '',
        'Tier 1: 100% Content Preservation',
        'Tier 2: Boundary & Reyna De-theming',
        'Tier 3: Interactivity & State Components',
        'Tier 4: Build & Vercel Deployment'
      ];
      console.log(
        `  ${statusColor}${tierNames[t].padEnd(45)}: ${passed}/${total} passed (${pct}%)${colors.reset}`
      );
    }

    const totalPassed = this.results.filter(r => r.passed).length;
    const totalCount = this.results.length;
    console.log('-'.repeat(70));
    if (allPassed) {
      console.log(
        `${colors.bold}${colors.green}ALL TESTS PASSED! (${totalPassed}/${totalCount}) - Production Ready${colors.reset}\n`
      );
    } else {
      const failedCount = totalCount - totalPassed;
      console.log(
        `${colors.bold}${colors.red}TEST SUITE FAILED: ${failedCount} of ${totalCount} tests failed.${colors.reset}`
      );
      console.log(`${colors.yellow}See details above for failed assertions to escalate or resolve.${colors.reset}\n`);
    }

    return allPassed;
  }
}

const reporter = new TestReporter();

// Utility helpers for reading files
function readText(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT_DIR, relPath));
}

function normalize(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsText(content, text) {
  if (!content) return false;
  return normalize(content).toLowerCase().includes(normalize(text).toLowerCase());
}

function hasExactText(content, text) {
  if (!content) return false;
  return normalize(content).includes(normalize(text));
}

// =============================================================================
// TIER 1: 100% CONTENT PRESERVATION
// =============================================================================
function runTier1() {
  console.log(`\n${colors.bold}${colors.cyan}--- TIER 1: 100% Content Preservation ---${colors.reset}`);
  const html = readText('index.html');
  if (!html) {
    reporter.record(1, 'T1.0', 'Read index.html', false, 'index.html not found');
    return;
  }

  // 1.1 Document Metadata
  const hasDocTitle = /<title>[^<]*Christopher\s+Theo\s+Purnomo[^<]*<\/title>/i.test(html);
  reporter.record(1, 'T1.1', 'Document title contains "Christopher Theo Purnomo"', hasDocTitle);

  const metaDescMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1] : '';
  const descValid = containsText(metaDesc, 'Christopher Theo Purnomo') &&
                    containsText(metaDesc, 'Unika Soegijapranata') &&
                    containsText(metaDesc, 'Decision Support System');
  reporter.record(1, 'T1.2', 'Meta description preserves author, university, and DSS focus', descValid,
    descValid ? null : `Meta description content: "${metaDesc}"`);

  const hasAuthorMeta = /<meta\s+name="author"\s+content="Christopher\s+Theo\s+Purnomo"/i.test(html);
  reporter.record(1, 'T1.3', 'Meta author preserves "Christopher Theo Purnomo"', hasAuthorMeta);

  const hasOgTitle = /<meta\s+property="og:title"\s+content="[^"]*Christopher\s+Theo\s+Purnomo[^"]*"/i.test(html);
  const hasOgDesc = /<meta\s+property="og:description"\s+content="[^"]*InternMatch\s+DSS[^"]*MySembako[^"]*"/i.test(html);
  reporter.record(1, 'T1.4', 'OpenGraph metadata preserves title and projects (InternMatch, MySembako)', hasOgTitle && hasOgDesc,
    hasOgTitle && hasOgDesc ? null : `OG Title: ${hasOgTitle}, OG Desc: ${hasOgDesc}`);

  // 1.2 Core Layout Sections
  const hasHome = /<section[^>]*id=["']home["']/i.test(html);
  const hasAbout = /<section[^>]*id=["']about["']/i.test(html);
  const hasPortfolio = /<section[^>]*id=["']portfolio["']/i.test(html);
  const hasContact = /<section[^>]*id=["']contact["']/i.test(html);
  const hasFooter = /<footer[^>]*>/i.test(html);
  const sectionsOk = hasHome && hasAbout && hasPortfolio && hasContact && hasFooter;
  reporter.record(1, 'T1.5', 'Core DOM sections exist (#home, #about, #portfolio, #contact, footer)', sectionsOk,
    sectionsOk ? null : `Missing: home=${hasHome}, about=${hasAbout}, portfolio=${hasPortfolio}, contact=${hasContact}, footer=${hasFooter}`);

  // 1.3 Hero Content
  const hasAffiliation = containsText(html, 'Unika Soegijapranata') && containsText(html, 'Semarang');
  reporter.record(1, 'T1.6', 'Hero affiliation badge preserves "Unika Soegijapranata — Semarang"', hasAffiliation);

  const hasDisplayName = containsText(html, 'Christopher') && containsText(html, 'Theo Purnomo');
  reporter.record(1, 'T1.7', 'Hero display heading preserves "Christopher Theo Purnomo"', hasDisplayName);

  const hasRole = containsText(html, 'Informatics Student') && containsText(html, 'Software Builder');
  reporter.record(1, 'T1.8', 'Hero role subheading preserves "Informatics Student & Software Builder"', hasRole);

  const heroBioString = 'Berfokus pada pengembangan sistem web end-to-end, pemodelan Decision Support System (DSS)';
  reporter.record(1, 'T1.9', 'Hero narrative bio paragraph preserved', containsText(html, heroBioString));

  const hasHeroCta1 = containsText(html, 'Lihat Proyek') && /href=["']#portfolio["']/i.test(html);
  const hasHeroCta2 = containsText(html, 'Ringkasan Resume') && /id=["']btnOpenResume["']/i.test(html);
  reporter.record(1, 'T1.10', 'Hero CTA buttons ("Lihat Proyek" & "Ringkasan Resume") preserved', hasHeroCta1 && hasHeroCta2);

  const hasMetric1 = containsText(html, 'DOMISILI & KAMPUS') && containsText(html, 'Semarang / Unika Soegijapranata');
  const hasMetric2 = containsText(html, 'BIDANG FOKUS') && containsText(html, 'DSS, Web Systems, Databases, AI/ML');
  reporter.record(1, 'T1.11', 'Hero quick metrics strip preserved (Campus & Focus Areas)', hasMetric1 && hasMetric2);

  // 1.4 Navigation Systems
  const hasNavLinks = /href=["']#home["']/i.test(html) &&
                     /href=["']#about["']/i.test(html) &&
                     /href=["']#portfolio["']/i.test(html) &&
                     /href=["']#contact["']/i.test(html);
  reporter.record(1, 'T1.12', 'Pill navbar preserves navigation links to #home, #about, #portfolio, #contact', hasNavLinks);

  const hasSideRail = /id=["']sideNavRail["']/i.test(html) &&
                      /id=["']sideNavPrev["']/i.test(html) &&
                      /id=["']sideNavNext["']/i.test(html);
  reporter.record(1, 'T1.13', 'Side navigation rail and navigation controls preserved', hasSideRail);

  // 1.5 About Section Content
  const hasAboutHeader = containsText(html, '01 // ABOUT ME') && containsText(html, 'Rekayasa Berbasis Logika, Keputusan Berbasis Data.');
  reporter.record(1, 'T1.14', 'About section header and tagline preserved', hasAboutHeader);

  const aboutPara1 = 'Saya adalah mahasiswa Teknik Informatika di Universitas Katolik Soegijapranata (Unika Soegijapranata) Semarang';
  const aboutPara2 = 'Bagi saya, perangkat lunak yang bernilai bukan tentang tumpukan buzzword atau antarmuka yang dibuat-buat';
  reporter.record(1, 'T1.15', 'About section narrative paragraphs 1 and 2 preserved verbatim', containsText(html, aboutPara1) && containsText(html, aboutPara2));

  // Focus Area Cards
  const hasFocus1 = containsText(html, 'Decision Support Systems') && containsText(html, 'Merancang engine analitis multi-kriteria');
  const hasFocus2 = containsText(html, 'Full-Stack & Web Systems') && containsText(html, 'Membangun arsitektur web fungsional');
  const hasFocus3 = containsText(html, 'Applied AI/ML & IoT') && containsText(html, 'Mengintegrasikan model pembelajaran mesin terapan');
  reporter.record(1, 'T1.16', 'About focus area cards (01 DSS, 02 Web Systems, 03 AI/ML & IoT) preserved', hasFocus1 && hasFocus2 && hasFocus3);

  // Skills Matrix
  const skillsLanguages = containsText(html, 'JavaScript (ES6+)') && containsText(html, 'PHP') && containsText(html, 'Python') && containsText(html, 'SQL');
  const skillsFrameworks = containsText(html, 'Node.js') && containsText(html, 'Vite') && containsText(html, 'RESTful API');
  const skillsDatabase = containsText(html, 'MySQL') && containsText(html, 'Relational Schema Design') && containsText(html, 'ACID Transactions');
  const skillsDSS = containsText(html, 'Multi-Criteria Decision Making') && containsText(html, 'AHP') && containsText(html, 'TOPSIS');
  reporter.record(1, 'T1.17', 'Skills matrix Category 1 & 2 (Languages & Web Frameworks) preserved', skillsLanguages && skillsFrameworks);
  reporter.record(1, 'T1.18', 'Skills matrix Category 3 & 4 (Database Layer & DSS Methodology) preserved', skillsDatabase && skillsDSS);

  // 1.6 Portfolio Case Studies
  const hasPortfolioHeader = containsText(html, '02 // SELECTED ENGINEERING PROJECTS') && containsText(html, 'Studi Kasus Proyek & Implementasi Sistem');
  reporter.record(1, 'T1.19', 'Portfolio section heading and subtitle preserved', hasPortfolioHeader);

  // Project 01: InternMatch DSS
  const hasInternMatchTitle = containsText(html, 'InternMatch DSS');
  const hasInternMatchTagline = containsText(html, 'Sistem Pendukung Keputusan Multi-Kriteria untuk Rekomendasi Penempatan Magang');
  const hasInternMatchProblem = containsText(html, 'Proses pencocokan antara kompetensi mahasiswa dengan kriteria spesifikasi mitra industri');
  const hasInternMatchMethod = containsText(html, 'AHP') && containsText(html, 'TOPSIS');
  const hasInternMatchStack = containsText(html, 'Python / PHP') && containsText(html, 'MCDM Matrix Computation');
  const hasInternMatchResults = containsText(html, 'white-box decision') || containsText(html, 'mereduksi ambiguitas seleksi');
  const internMatchOk = hasInternMatchTitle && hasInternMatchTagline && hasInternMatchProblem && hasInternMatchMethod && hasInternMatchStack && hasInternMatchResults;
  reporter.record(1, 'T1.20', 'Case Study 1 (InternMatch DSS) content, methodology, and tech stack preserved', internMatchOk);

  // Project 02: MySembako
  const hasMySembakoTitle = containsText(html, 'MySembako');
  const hasMySembakoTagline = containsText(html, 'Platform Terpadu Manajemen Stok, Distribusi, dan Transaksi Komoditas Sembilan Bahan Pokok');
  const hasMySembakoProblem = containsText(html, 'Pengelolaan pasokan sembako pada toko fisik konvensional rentan terhadap pencatatan ganda');
  const hasMySembakoStack = containsText(html, 'MySQL Relational DB') && containsText(html, 'Transaction ACID Safe');
  const hasMySembakoResults = containsText(html, 'rekonsiliasi stok harian') || containsText(html, 'menghilangkan selisih stok manual');
  const mySembakoOk = hasMySembakoTitle && hasMySembakoTagline && hasMySembakoProblem && hasMySembakoStack && hasMySembakoResults;
  reporter.record(1, 'T1.21', 'Case Study 2 (MySembako) content, database schema, and operational features preserved', mySembakoOk);

  // 1.7 Contact Section
  const hasContactHeader = containsText(html, '03 // DIRECT CHANNELS') && containsText(html, 'Mari Terhubung dan Berdiskusi');
  const hasEmail = containsText(html, 'chris.theo.purnomo@gmail.com') && /id=["']btnCopyEmail["']/i.test(html);
  const hasGithub = containsText(html, 'github.com/christophertheop');
  const hasLinkedin = containsText(html, 'linkedin.com/in/christopher-theo-purnomo');
  const hasInstagram = containsText(html, '@chris_theo.p');
  const contactOk = hasContactHeader && hasEmail && hasGithub && hasLinkedin && hasInstagram;
  reporter.record(1, 'T1.22', 'Contact section preserves 4 direct channels (Email, GitHub, LinkedIn, Instagram)', contactOk);

  // 1.8 Footer
  const hasFooterAuthor = containsText(html, 'Christopher Theo Purnomo') && containsText(html, 'Unika Soegijapranata');
  const hasFooterStamp = containsText(html, 'Semarang, ID') && containsText(html, 'Vite + Vanilla JS');
  reporter.record(1, 'T1.23', 'Footer preserves author name, affiliation, and engineering stamp', hasFooterAuthor && hasFooterStamp);

  // 1.9 CV Modal Content
  const hasModalTitle = containsText(html, 'CURRICULUM VITAE OVERVIEW');
  const hasModalEdu = containsText(html, 'Pendidikan') && containsText(html, 'Universitas Katolik Soegijapranata');
  const hasModalProjects = containsText(html, 'InternMatch DSS') && containsText(html, 'MySembako');
  const hasModalSkills = containsText(html, 'Keahlian Teknis') && containsText(html, 'JavaScript, PHP, Python, SQL');
  const hasModalCta = containsText(html, 'Minta Berkas CV Lengkap (.PDF)') && /href=["']mailto:chris\.theo\.purnomo@gmail\.com[^"']*["']/i.test(html);
  const modalOk = hasModalTitle && hasModalEdu && hasModalProjects && hasModalSkills && hasModalCta;
  reporter.record(1, 'T1.24', 'Curriculum Vitae modal preserves education, projects, skills, and PDF mailto CTA', modalOk);

  // 1.10 Project Deployment & Repository Links
  const hasInternMatchVercel = /href=["']https:\/\/internmatch-dss\.vercel\.app\/?["']/i.test(html);
  const hasInternMatchGithub = /href=["']https:\/\/github\.com\/Christopher112321\/internmatch-dss\/?["']/i.test(html);
  const hasMySembakoVercel = /href=["']https:\/\/mysembako\.vercel\.app\/?["']/i.test(html);
  const hasMySembakoGithub = /href=["']https:\/\/github\.com\/Christopher112321\/mysembako\/?["']/i.test(html);
  const projectLinksOk = hasInternMatchVercel && hasInternMatchGithub && hasMySembakoVercel && hasMySembakoGithub;
  reporter.record(1, 'T1.25', 'Case studies include explicit live Vercel deployments and GitHub repository links', projectLinksOk,
    projectLinksOk ? null : `Vercel: IM=${hasInternMatchVercel}, MS=${hasMySembakoVercel}; GitHub: IM=${hasInternMatchGithub}, MS=${hasMySembakoGithub}`);

  // 1.11 External Link Security Attributes
  const projectLinkRegex = /<a\s+[^>]*href=["']https:\/\/(?:internmatch-dss\.vercel\.app|mysembako\.vercel\.app|github\.com\/Christopher112321\/[^"']+)["'][^>]*>/gi;
  const projectLinkMatches = [...html.matchAll(projectLinkRegex)];
  const allSecureExternal = projectLinkMatches.length >= 4 && projectLinkMatches.every(m => {
    const tag = m[0];
    return /target=["']_blank["']/i.test(tag) && /rel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/i.test(tag);
  });
  reporter.record(1, 'T1.26', 'All external project links specify target="_blank" and rel="noopener noreferrer"', allSecureExternal,
    allSecureExternal ? null : `Matched ${projectLinkMatches.length} links; security flags verification failed`);
}

// =============================================================================
// TIER 2: BOUNDARY & AESTHETIC CONSTRAINTS (REYNA DE-THEMING)
// =============================================================================
function runTier2() {
  console.log(`\n${colors.bold}${colors.cyan}--- TIER 2: Boundary & Aesthetic Constraints (Reyna De-theming) ---${colors.reset}`);
  const html = readText('index.html') || '';
  const css = readText('src/style.css') || '';
  const js = readText('src/main.js') || '';
  const viteConfig = readText('vite.config.js') || '';

  // 2.1 File System Asset Cleanup
  const publicReynaCutout = fileExists('public/assets/reyna-official-cutout.png');
  const publicReynaRaw = fileExists('public/assets/reyna-official-raw.png');
  const assetsReynaCutout = fileExists('assets/reyna-official-cutout.png');
  const assetsReynaRaw = fileExists('assets/reyna-official-raw.png');
  const officialAssetsDeleted = !publicReynaCutout && !publicReynaRaw && !assetsReynaCutout && !assetsReynaRaw;
  reporter.record(2, 'T2.1', 'Riot Games official Reyna character assets deleted from disk', officialAssetsDeleted,
    officialAssetsDeleted ? null : `Remaining files: publicCutout=${publicReynaCutout}, publicRaw=${publicReynaRaw}, assetsCutout=${assetsReynaCutout}, assetsRaw=${assetsReynaRaw}`);

  // 2.2 Reyna Assets Unreferenced in HTML
  const hasReynaCutoutRef = /christopher-reyna-cutout\.png/i.test(html);
  const hasReynaJpgRef = /christopher-reyna\.jpg/i.test(html);
  const htmlAssetsClean = !hasReynaCutoutRef && !hasReynaJpgRef;
  reporter.record(2, 'T2.2', 'index.html has zero references to christopher-reyna assets', htmlAssetsClean,
    htmlAssetsClean ? null : `Found references: cutout=${hasReynaCutoutRef}, jpg=${hasReynaJpgRef}`);

  // 2.3 Reyna CSS Classes in HTML
  const reynaClasses = [
    'reyna-intro',
    'reyna-particle-canvas',
    'reyna-shadow-hands',
    'shadow-hand',
    'reyna-vignette',
    'reyna-eye-icon',
    'val-dot',
    'reyna-aura-backdrop',
    'about-reyna-reveal-wrapper',
    'about-reyna-img'
  ];
  const foundReynaClassesInHtml = reynaClasses.filter(cls => new RegExp(`\\b${cls}\\b`, 'i').test(html));
  reporter.record(2, 'T2.3', 'index.html has zero Reyna-specific CSS classes', foundReynaClassesInHtml.length === 0,
    foundReynaClassesInHtml.length === 0 ? null : `Detected classes: ${foundReynaClassesInHtml.join(', ')}`);

  // 2.4 Reyna Lore & Text in HTML
  // Check for VALORANT in visible content or metadata
  const hasValorantInHtml = /VALORANT/i.test(html);
  const hasDieForYou = /Die\s+For\s+You/i.test(html);
  const hasReynaWordInHtml = />[^<]*\bReyna\b[^<]*</i.test(html);
  const loreAbsent = !hasValorantInHtml && !hasDieForYou && !hasReynaWordInHtml;
  reporter.record(2, 'T2.4', 'index.html has zero Valorant / Reyna lore texts (Spotify widget & metadata rethemed)', loreAbsent,
    loreAbsent ? null : `Found lore: VALORANT=${hasValorantInHtml}, Die For You=${hasDieForYou}, Reyna text=${hasReynaWordInHtml}`);

  // 2.5 OpenGraph Image Points to Clean Portrait
  const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const ogImage = ogImageMatch ? ogImageMatch[1] : '';
  const ogImageClean = ogImage && !ogImage.includes('reyna') && (ogImage.includes('base') || ogImage.includes('profile'));
  reporter.record(2, 'T2.5', 'og:image metadata points to clean personal portrait, not Reyna artwork', !!ogImageClean,
    ogImageClean ? null : `Current og:image: "${ogImage}"`);

  // 2.6 Reyna Design Tokens in src/style.css
  const hasMagentaVar = /--accent-magenta\b/.test(css);
  const hasReynaFlameVar = /--reyna-flame\b/.test(css);
  const hasBorderReynaVar = /--border-reyna\b/.test(css);
  const tokensClean = !hasMagentaVar && !hasReynaFlameVar && !hasBorderReynaVar;
  reporter.record(2, 'T2.6', 'src/style.css has zero Reyna/magenta design token variables', tokensClean,
    tokensClean ? null : `Found tokens: --accent-magenta=${hasMagentaVar}, --reyna-flame=${hasReynaFlameVar}, --border-reyna=${hasBorderReynaVar}`);

  // 2.7 Magenta / Flame Hex and Violet/Magenta RGB Values in CSS
  // Allow comments, but active CSS declarations should not use magenta #d946ef or flame #e879f9 or violet/magenta RGB math
  const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const hasMagentaHex = /#d946ef\b/i.test(cssWithoutComments);
  const hasFlameHex = /#e879f9\b/i.test(cssWithoutComments);
  const hasMagentaRgb = /217,\s*70,\s*239/.test(cssWithoutComments);
  const hasVioletRgb = /168,\s*85,\s*247/.test(cssWithoutComments);
  const cssColorsClean = !hasMagentaHex && !hasFlameHex && !hasMagentaRgb && !hasVioletRgb;
  reporter.record(2, 'T2.7', 'src/style.css declarations contain no magenta/violet hex codes or RGB strings', cssColorsClean,
    cssColorsClean ? null : `Found forbidden colors: #d946ef=${hasMagentaHex}, #e879f9=${hasFlameHex}, rgb(217,70,239)=${hasMagentaRgb}, rgb(168,85,247)=${hasVioletRgb}`);

  // 2.8 Primary Accent Color in CSS is Modern Palette
  // Root accent should be electric sky/cyan/blue, not violet #a855f7
  const accentMatch = cssWithoutComments.match(/--accent:\s*([^;]+);/);
  const accentVal = accentMatch ? accentMatch[1].trim() : '';
  const accentNotViolet = accentVal && !/#a855f7\b/i.test(accentVal) && !accentVal.includes('280');
  reporter.record(2, 'T2.8', 'src/style.css :root --accent is modernized (not Empress violet #a855f7)', !!accentNotViolet,
    accentNotViolet ? null : `Current --accent value: "${accentVal}"`);

  // 2.9 JavaScript Particle Classes & Radianite References
  const hasSoulOrb = /\bclass\s+SoulOrb\b/.test(js) || /\bnew\s+SoulOrb\b/.test(js);
  const hasEnergyWisp = /\bclass\s+EnergyWisp\b/.test(js) || /\bnew\s+EnergyWisp\b/.test(js);
  const hasRadianiteMote = /\bRadianiteMote\b/.test(js);
  const jsParticlesClean = !hasSoulOrb && !hasEnergyWisp && !hasRadianiteMote;
  reporter.record(2, 'T2.9', 'src/main.js has zero SoulOrb, EnergyWisp, or Radianite particle classes', jsParticlesClean,
    jsParticlesClean ? null : `Found in JS: SoulOrb=${hasSoulOrb}, EnergyWisp=${hasEnergyWisp}, RadianiteMote=${hasRadianiteMote}`);

  // 2.10 JavaScript Color Math
  // Check for magenta RGB (217, 70, 239) or violet RGB (168, 85, 247) in active JS logic
  const jsWithoutComments = js.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  const hasJsMagentaRgb = /217,\s*70,\s*239/.test(jsWithoutComments);
  const hasJsVioletRgb = /168,\s*85,\s*247/.test(jsWithoutComments);
  const jsColorsClean = !hasJsMagentaRgb && !hasJsVioletRgb;
  reporter.record(2, 'T2.10', 'src/main.js particle & canvas routines contain no magenta/violet RGB math', jsColorsClean,
    jsColorsClean ? null : `Found RGB math: magenta(217,70,239)=${hasJsMagentaRgb}, violet(168,85,247)=${hasJsVioletRgb}`);

  // 2.11 Vite Config Base is '/'
  const baseMatch = viteConfig.match(/base:\s*['"]([^'"]+)['"]/);
  const baseValue = baseMatch ? baseMatch[1] : '';
  const baseIsRoot = baseValue === '/';
  reporter.record(2, 'T2.11', 'vite.config.js base is configured to "/" for root domain deployment', baseIsRoot,
    baseIsRoot ? null : `Current base setting: "${baseValue}" (expected "/")`);
}

// =============================================================================
// TIER 3: CROSS-FEATURE & STATE INTERACTIVITY
// =============================================================================
function runTier3() {
  console.log(`\n${colors.bold}${colors.cyan}--- TIER 3: Cross-Feature & State Interactivity ---${colors.reset}`);
  const html = readText('index.html') || '';
  const js = readText('src/main.js') || '';
  const css = readText('src/style.css') || '';

  // 3.1 Intro Loading Screen Elements
  const hasIntroScreen = /id=["']introScreen["']/i.test(html);
  const hasLoadingPercent = /id=["']loadingPercent["']/i.test(html);
  const hasLoadingBarFill = /id=["']loadingBarFill["']/i.test(html);
  const hasShutters = /intro-shutter-top/i.test(html) && /intro-shutter-bottom/i.test(html);
  const introOk = hasIntroScreen && hasLoadingPercent && hasLoadingBarFill && hasShutters;
  reporter.record(3, 'T3.1', 'Intro loading screen structure intact (#introScreen, #loadingPercent, #loadingBarFill, shutters)', introOk,
    introOk ? null : `Found: screen=${hasIntroScreen}, percent=${hasLoadingPercent}, bar=${hasLoadingBarFill}, shutters=${hasShutters}`);

  // 3.2 Intro Screen Canvas Particle Element
  const hasIntroCanvas = /id=["']introParticleCanvas["']/i.test(html) || /id=["']bgCanvas["']/i.test(html);
  reporter.record(3, 'T3.2', 'Ambient particle canvas element present for intro loading animation', hasIntroCanvas);

  // 3.3 Creeping Shadow Hands & Eye Icon Removed from Intro
  const hasShadowHands = /id=["']reynaShadowHands["']/i.test(html) || /class=["'][^"']*shadow-hand/i.test(html);
  const hasEyeIcon = /id=["']reynaEyeIcon["']/i.test(html) || /reyna-eye-icon/i.test(html);
  const introDeReynaOk = !hasShadowHands && !hasEyeIcon;
  reporter.record(3, 'T3.3', 'Intro loading screen has shadow claws (#reynaShadowHands) and eye icon removed', introDeReynaOk,
    introDeReynaOk ? null : `Found: shadowHands=${hasShadowHands}, eyeIcon=${hasEyeIcon}`);

  // 3.4 Precision Custom Cursor
  const hasCursorDot = /id=["']cursorDot["']/i.test(html);
  const hasCursorRing = /id=["']cursorRing["']/i.test(html);
  reporter.record(3, 'T3.4', 'Custom precision cursor follower elements (#cursorDot, #cursorRing) exist', hasCursorDot && hasCursorRing);

  // 3.5 Interactive Background Canvas
  const hasBgCanvas = /id=["']bgCanvas["']/i.test(html);
  reporter.record(3, 'T3.5', 'Interactive background particle/grid canvas (#bgCanvas) exists', hasBgCanvas);

  // 3.6 Spotify Card Interactive Elements
  const hasSpotifyCard = /id=["']spotifyCard["']/i.test(html);
  const hasVinylDisc = /id=["']vinylDisc["']/i.test(html);
  const hasPlayPause = /id=["']btnPlayPause["']/i.test(html);
  const hasTimeCurrent = /id=["']timeCurrent["']/i.test(html);
  const hasTimeDuration = /id=["'](timeDuration|timeTotal)["']/i.test(html);
  const hasProgressBarBg = /id=["']progressBarBg["']/i.test(html);
  const hasProgressBarFill = /id=["']progressBarFill["']/i.test(html);
  const spotifyOk = hasSpotifyCard && hasVinylDisc && hasPlayPause && hasTimeCurrent && hasTimeDuration && hasProgressBarBg && hasProgressBarFill;
  reporter.record(3, 'T3.6', 'Spotify interactive widget controls intact (play/pause, vinyl disc, timeline, progress bar)', spotifyOk,
    spotifyOk ? null : `Missing spotify elements in HTML`);

  // 3.7 About Section Spotlight Container
  const hasSpotlightContainer = /id=["']aboutSpotlightContainer["']/i.test(html);
  const hasAboutBaseImg = /class=["'][^"']*about-base-img[^"']*["']/i.test(html) || /christopher-base/i.test(html);
  reporter.record(3, 'T3.7', 'About section spotlight photo container and clean base portrait present', hasSpotlightContainer && hasAboutBaseImg);

  // 3.8 Dual Synchronized Navigation
  const hasPillNav = /id=["']pillNavbar["']/i.test(html);
  const hasNavIndicator = /id=["']navIndicator["']/i.test(html);
  const hasSideRail = /id=["']sideNavRail["']/i.test(html);
  const hasSidePrev = /id=["']sideNavPrev["']/i.test(html);
  const hasSideNext = /id=["']sideNavNext["']/i.test(html);
  const navOk = hasPillNav && hasNavIndicator && hasSideRail && hasSidePrev && hasSideNext;
  reporter.record(3, 'T3.8', 'Dual navigation systems intact (#pillNavbar, #navIndicator, #sideNavRail, controls)', navOk);

  // 3.9 Curriculum Vitae Modal Accessibility Attributes
  const hasResumeModal = /id=["']resumeModal["']/i.test(html);
  const hasRoleDialog = /<div[^>]*id=["']resumeModal["'][^>]*role=["']dialog["']/i.test(html) ||
                        /<div[^>]*role=["']dialog["'][^>]*id=["']resumeModal["']/i.test(html);
  const hasAriaModal = /<div[^>]*id=["']resumeModal["'][^>]*aria-modal=["']true["']/i.test(html) ||
                       /<div[^>]*aria-modal=["']true["'][^>]*id=["']resumeModal["']/i.test(html);
  const modalA11yOk = hasResumeModal && hasRoleDialog && hasAriaModal;
  reporter.record(3, 'T3.9', 'Resume modal possesses valid accessibility attributes (role="dialog", aria-modal="true")', modalA11yOk,
    modalA11yOk ? null : `hasResumeModal=${hasResumeModal}, hasRoleDialog=${hasRoleDialog}, hasAriaModal=${hasAriaModal}`);

  // 3.10 Modal & Interactive Control Triggers
  const hasBtnCopyEmail = /id=["']btnCopyEmail["']/i.test(html);
  const hasBtnOpenResume = /id=["']btnOpenResume["']/i.test(html);
  const hasBtnCloseResume = /id=["']btnCloseResume["']/i.test(html);
  const hasBtnModalCloseSec = /id=["']btnModalCloseSecondary["']/i.test(html);
  const triggersOk = hasBtnCopyEmail && hasBtnOpenResume && hasBtnCloseResume && hasBtnModalCloseSec;
  reporter.record(3, 'T3.10', 'Interactive control triggers present (#btnCopyEmail, #btnOpenResume, #btnCloseResume, #btnModalCloseSecondary)', triggersOk,
    triggersOk ? null : `Missing trigger elements in HTML`);

  // 3.11 JavaScript DOM Binding Contract
  // Inspect getElementById calls in src/main.js to verify none are missing in index.html
  const idMatches = [...js.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
  const uniqueIds = [...new Set(idMatches)];
  const missingIds = uniqueIds.filter(id => !new RegExp(`id=["']${id}["']`, 'i').test(html));
  reporter.record(3, 'T3.11', 'src/main.js DOM references match index.html elements (no undefined element crashes)', missingIds.length === 0,
    missingIds.length === 0 ? null : `Missing IDs in HTML queried by JS: ${missingIds.join(', ')}`);

  // 3.12 Project Card Interactive Attributes
  const internMatchCard = html.match(/<article[^>]*id=["']project-internmatch["'][^>]*>/i);
  const mySembakoCard = html.match(/<article[^>]*id=["']project-mysembako["'][^>]*>/i);
  const imCardTag = internMatchCard ? internMatchCard[0] : '';
  const msCardTag = mySembakoCard ? mySembakoCard[0] : '';

  const imInteractive = /data-href=["']https:\/\/internmatch-dss\.vercel\.app\/?["']/i.test(imCardTag) &&
                        /tabindex=["']0["']/i.test(imCardTag);
  const msInteractive = /data-href=["']https:\/\/mysembako\.vercel\.app\/?["']/i.test(msCardTag) &&
                        /tabindex=["']0["']/i.test(msCardTag);
  reporter.record(3, 'T3.12', 'Project cards configure data-href and tabindex="0" for keyboard/click accessibility', imInteractive && msInteractive,
    imInteractive && msInteractive ? null : `IM card: ${imCardTag}, MS card: ${msCardTag}`);

  // 3.13 Project Card Navigation & Event Isolation Logic in JS
  const hasCardNavigation = js.includes('project-internmatch') &&
                            js.includes('project-mysembako') &&
                            js.includes('https://internmatch-dss.vercel.app') &&
                            js.includes('https://mysembako.vercel.app') &&
                            js.includes('window.open(');
  const hasEventIsolation = js.includes("e.target.closest('a, button')") &&
                            js.includes('e.stopPropagation()');
  const hasKeyboardActivation = js.includes("e.key === 'Enter'");
  const cardLogicOk = hasCardNavigation && hasEventIsolation && hasKeyboardActivation;
  reporter.record(3, 'T3.13', 'src/main.js implements card click navigation, Enter key activation, and nested link event isolation', cardLogicOk,
    cardLogicOk ? null : `hasNav=${hasCardNavigation}, hasIsolation=${hasEventIsolation}, hasKey=${hasKeyboardActivation}`);

  // 3.14 Project Card Edge Case Resilience & Visual Ambient Glow
  const hasSelectionGuard = js.includes('window.getSelection') && js.includes('selection.toString()');
  const hasAuxClick = js.includes('auxclick') && js.includes('e.button === 1');
  const hasAmbientGlow = css.includes('case-study-card:hover::before') && css.includes('opacity: 1');
  const edgeResilienceOk = hasSelectionGuard && hasAuxClick && hasAmbientGlow;
  reporter.record(3, 'T3.14', 'Project cards guard against text selection drag, support auxclick, and illuminate ambient glow', edgeResilienceOk,
    edgeResilienceOk ? null : `hasSelectionGuard=${hasSelectionGuard}, hasAuxClick=${hasAuxClick}, hasAmbientGlow=${hasAmbientGlow}`);
}

// =============================================================================
// TIER 4: REAL-WORLD DEPLOYMENT & BUILD
// =============================================================================
function runTier4() {
  console.log(`\n${colors.bold}${colors.cyan}--- TIER 4: Real-World Deployment & Build ---${colors.reset}`);

  // 4.1 Vercel Configuration (vercel.json)
  const vercelText = readText('vercel.json');
  let vercelJson = null;
  let parseError = null;
  if (vercelText) {
    try {
      vercelJson = JSON.parse(vercelText);
    } catch (e) {
      parseError = e.message;
    }
  }

  const vercelExists = !!vercelText && !parseError;
  const hasRewrite = vercelJson && Array.isArray(vercelJson.rewrites) &&
    vercelJson.rewrites.some(r => r.source === '/(.*)' && r.destination === '/index.html');
  const hasHeader = vercelJson && Array.isArray(vercelJson.headers) &&
    vercelJson.headers.some(h => h.source === '/assets/(.*)' &&
      Array.isArray(h.headers) &&
      h.headers.some(hdr => hdr.key === 'Cache-Control' && hdr.value.includes('immutable')));
  const vercelOk = vercelExists && hasRewrite && hasHeader;
  reporter.record(4, 'T4.1', 'vercel.json exists with valid SPA rewrite rule and immutable cache headers', vercelOk,
    vercelOk ? null : `vercelExists=${vercelExists}, hasRewrite=${hasRewrite}, hasHeader=${hasHeader}, parseError=${parseError}`);

  // 4.2 Git Configuration (.gitignore)
  const gitignoreText = readText('.gitignore') || '';
  const ignoresModules = /node_modules/.test(gitignoreText);
  const ignoresDist = /dist/.test(gitignoreText);
  const gitignoreOk = ignoresModules && ignoresDist;
  reporter.record(4, 'T4.2', '.gitignore properly excludes node_modules and dist artifacts', gitignoreOk,
    gitignoreOk ? null : `ignoresModules=${ignoresModules}, ignoresDist=${ignoresDist}`);

  // 4.3 Build Execution (npm run build)
  if (skipBuild) {
    console.log(`  ${colors.yellow}Skipping npm run build (--no-build specified)${colors.reset}`);
    return;
  }

  console.log(`  ${colors.gray}Executing: npm run build...${colors.reset}`);
  const buildResult = spawnSync('npm', ['run', 'build'], {
    cwd: ROOT_DIR,
    shell: true,
    encoding: 'utf8'
  });

  const buildExitCode = buildResult.status;
  const buildSucceeded = buildExitCode === 0;
  reporter.record(4, 'T4.3', 'Vite production build (npm run build) completes with exit code 0', buildSucceeded,
    buildSucceeded ? null : `Build failed with exit code ${buildExitCode}\n${buildResult.stderr || buildResult.stdout}`);

  // 4.4 Build Output Verification
  const distHtmlExists = fileExists('dist/index.html');
  const distAssetsExists = fileExists('dist/assets');
  reporter.record(4, 'T4.4', 'Build produces dist/index.html and dist/assets directory', distHtmlExists && distAssetsExists,
    distHtmlExists && distAssetsExists ? null : `distHtmlExists=${distHtmlExists}, distAssetsExists=${distAssetsExists}`);

  // 4.5 Dist Asset Files Generated
  let assetFiles = [];
  if (distAssetsExists) {
    try {
      assetFiles = fs.readdirSync(path.join(ROOT_DIR, 'dist/assets'));
    } catch {}
  }
  const hasJsAsset = assetFiles.some(f => f.endsWith('.js'));
  const hasCssAsset = assetFiles.some(f => f.endsWith('.css'));
  const bundleOk = hasJsAsset && hasCssAsset;
  reporter.record(4, 'T4.5', 'Production bundles created in dist/assets/ (.js and .css files)', bundleOk,
    bundleOk ? null : `Found files: ${assetFiles.join(', ')}`);

  // 4.6 Root Domain Path Resolution (No /portof/ in dist/index.html)
  const distHtml = readText('dist/index.html') || '';
  const hasBrokenPortofPaths = /\/portof\//i.test(distHtml);
  reporter.record(4, 'T4.6', 'dist/index.html asset URLs resolve from root domain (no /portof/ prefixes)', !hasBrokenPortofPaths,
    !hasBrokenPortofPaths ? null : 'dist/index.html contains /portof/ path prefix which causes 404 on Vercel root hosting');
}

// =============================================================================
// MAIN RUNNER
// =============================================================================
console.log('='.repeat(70));
console.log(`${colors.bold}CHRISTOPHER THEO PURNOMO PORTFOLIO — E2E TEST RUNNER${colors.reset}`);
console.log(`Working Directory: ${ROOT_DIR}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('='.repeat(70));

if (targetTier === null || targetTier === 1) runTier1();
if (targetTier === null || targetTier === 2) runTier2();
if (targetTier === null || targetTier === 3) runTier3();
if (targetTier === null || targetTier === 4) runTier4();

const success = reporter.printSummary();
process.exit(success ? 0 : 1);
