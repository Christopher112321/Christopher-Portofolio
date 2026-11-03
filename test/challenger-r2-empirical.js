/**
 * Challenger Round 2 Empirical Stress Test Suite
 * Independent Adversarial Verification Harness
 *
 * Verifies:
 * 1. Skills Section: All 9 tech SVGs (XML validity, viewBox, size, banned color hexes)
 * 2. Contact Section: Interactivity (#btnCopyEmail, copy feedback, #btnContactResume, links)
 * 3. Robotic Jargon Purge: 0 occurrences of "inventory control pos" and cold machine jargon
 * 4. Project Links & Live Connectivity: Live HTTP 200 reachability and GitHub URLs
 * 5. Hero & Theme Switcher: Marquee typography, centered cutout, anti-FOUC theme engine
 * 6. Dual-File Synchronization: SHA-256 byte equality
 * 7. Production Build Integrity: npm run build & dist artifact hygiene
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

class EmpiricalHarness {
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
      console.log(`         ${colors.red}Failure Details: ${errorMsg}${colors.reset}`);
    }
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(75));
    console.log(`${colors.bold}EMPIRICAL CHALLENGER R2 VERIFICATION SUMMARY (${elapsed}s)${colors.reset}`);
    console.log('='.repeat(75));

    const suites = [...new Set(this.results.map(r => r.suite))];
    let allPassed = true;

    for (const s of suites) {
      const suiteResults = this.results.filter(r => r.suite === s);
      const passed = suiteResults.filter(r => r.passed).length;
      const total = suiteResults.length;
      const pct = Math.round((passed / total) * 100);
      if (passed < total) allPassed = false;
      const col = passed === total ? colors.green : colors.red;
      console.log(`  ${s.padEnd(46)} : ${col}${passed}/${total} passed (${pct}%)${colors.reset}`);
    }

    console.log('-'.repeat(75));
    const totalAssertions = this.results.length;
    const totalPassed = this.results.filter(r => r.passed).length;
    const totalFailed = totalAssertions - totalPassed;

    if (allPassed) {
      console.log(`${colors.green}${colors.bold}ALL EMPIRICAL ASSERTIONS PASSED! (${totalPassed}/${totalAssertions})${colors.reset}`);
      console.log(`${colors.green}${colors.bold}VERDICT: APPROVE${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.red}${colors.bold}CHALLENGES FAILED: ${totalFailed}/${totalAssertions} assertions failed.${colors.reset}`);
      console.log(`${colors.red}${colors.bold}VERDICT: REQUEST_CHANGES${colors.reset}\n`);
      return false;
    }
  }
}

/**
 * Strict XML Tokenizer and Structural Validator
 * Validates XML 1.0 well-formedness:
 * - Proper element nesting and closure
 * - Quoted attributes (single or double)
 * - Absence of unescaped raw '<' inside attributes/text
 * - Proper closing tags matching opening tags
 */
function validateXmlWellFormedness(xmlString) {
  const errors = [];
  const tagStack = [];
  let pos = 0;
  const len = xmlString.length;

  while (pos < len) {
    const openIndex = xmlString.indexOf('<', pos);
    if (openIndex === -1) break;

    // Check if next character is '?' (XML declaration) or '!' (comment / DOCTYPE / CDATA)
    if (xmlString.startsWith('<!--', openIndex)) {
      const closeComment = xmlString.indexOf('-->', openIndex + 4);
      if (closeComment === -1) {
        errors.push(`Unclosed comment starting at position ${openIndex}`);
        break;
      }
      pos = closeComment + 3;
      continue;
    }

    if (xmlString.startsWith('<?', openIndex)) {
      const closePi = xmlString.indexOf('?>', openIndex + 2);
      if (closePi === -1) {
        errors.push(`Unclosed processing instruction starting at position ${openIndex}`);
        break;
      }
      pos = closePi + 2;
      continue;
    }

    if (xmlString.startsWith('<![CDATA[', openIndex)) {
      const closeCdata = xmlString.indexOf(']]>', openIndex + 9);
      if (closeCdata === -1) {
        errors.push(`Unclosed CDATA starting at position ${openIndex}`);
        break;
      }
      pos = closeCdata + 3;
      continue;
    }

    // Find end of tag '>'
    // Handle attributes that might contain '>' inside quotes
    let closeIndex = -1;
    let inQuote = null;
    for (let i = openIndex + 1; i < len; i++) {
      const ch = xmlString[i];
      if (inQuote) {
        if (ch === inQuote) inQuote = null;
      } else {
        if (ch === '"' || ch === "'") inQuote = ch;
        else if (ch === '>') {
          closeIndex = i;
          break;
        }
      }
    }

    if (closeIndex === -1) {
      errors.push(`Unclosed tag starting at position ${openIndex}`);
      break;
    }

    const tagContent = xmlString.slice(openIndex + 1, closeIndex).trim();
    pos = closeIndex + 1;

    // Check closing tag </tag>
    if (tagContent.startsWith('/')) {
      const closeTagName = tagContent.slice(1).trim().split(/\s+/)[0];
      if (tagStack.length === 0) {
        errors.push(`Unexpected closing tag </${closeTagName}> with empty stack`);
      } else {
        const expected = tagStack.pop();
        if (expected !== closeTagName) {
          errors.push(`Mismatched closing tag: expected </${expected}>, found </${closeTagName}>`);
        }
      }
      continue;
    }

    // Check self-closing tag <tag ... />
    const isSelfClosing = tagContent.endsWith('/');
    const cleanedTag = isSelfClosing ? tagContent.slice(0, -1).trim() : tagContent;

    // Extract tag name
    const match = cleanedTag.match(/^([a-zA-Z0-9_\-:]+)([\s\S]*)$/);
    if (!match) {
      errors.push(`Invalid tag format: <${tagContent}>`);
      continue;
    }

    const tagName = match[1];
    const rawAttrs = match[2].trim();

    // Validate attributes syntax
    if (rawAttrs.length > 0) {
      // Regex matches: attrName="attrValue" or attrName='attrValue'
      const attrRegex = /([a-zA-Z0-9_\-:]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
      let attrMatch;
      let matchedChars = 0;
      const seenAttrs = new Set();

      while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
        const attrName = attrMatch[1];
        if (seenAttrs.has(attrName)) {
          errors.push(`Duplicate attribute "${attrName}" on element <${tagName}>`);
        }
        seenAttrs.add(attrName);
        matchedChars += attrMatch[0].length;
      }

      // Check if there are stray unquoted or unparsed attributes
      const sanitized = rawAttrs.replace(attrRegex, '').trim();
      if (sanitized.length > 0) {
        errors.push(`Malformed or unquoted attribute in <${tagName}>: "${sanitized}"`);
      }
    }

    if (!isSelfClosing) {
      tagStack.push(tagName);
    }
  }

  if (tagStack.length > 0) {
    errors.push(`Unclosed tags remaining on stack: ${tagStack.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

async function runEmpiricalVerification() {
  const h = new EmpiricalHarness();

  console.log('='.repeat(75));
  console.log(`${colors.bold}CHRISTOPHER THEO PORTFOLIO — EMPIRICAL CHALLENGER R2 HARNESS${colors.reset}`);
  console.log(`Working Directory: ${ROOT_DIR}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('='.repeat(75));

  // Load source files
  const htmlPath = path.join(ROOT_DIR, 'index.html');
  const srcCssPath = path.join(ROOT_DIR, 'src', 'style.css');
  const rootCssPath = path.join(ROOT_DIR, 'style.css');
  const srcJsPath = path.join(ROOT_DIR, 'src', 'main.js');
  const rootJsPath = path.join(ROOT_DIR, 'script.js');
  const distHtmlPath = path.join(ROOT_DIR, 'dist', 'index.html');

  const html = fs.readFileSync(htmlPath, 'utf8');
  const srcCss = fs.readFileSync(srcCssPath, 'utf8');
  const rootCss = fs.readFileSync(rootCssPath, 'utf8');
  const srcJs = fs.readFileSync(srcJsPath, 'utf8');
  const rootJs = fs.readFileSync(rootJsPath, 'utf8');

  const BANNED_HEXES = [
    '#38bdf8', '#7dd3fc', '#6366f1', '#818cf8', '#a855f7', '#ec4899',
    '#38BDF8', '#7DD3FC', '#6366F1', '#818CF8', '#A855F7', '#EC4899'
  ];
  const BANNED_RGBS = [
    'rgb(56, 189, 248)', 'rgb(125, 211, 252)', 'rgb(99, 102, 241)',
    'rgb(129, 140, 248)', 'rgb(168, 85, 247)', 'rgb(236, 72, 153)'
  ];

  // =========================================================================
  // SUITE 1: SKILLS SECTION & 9 TECH STACK SVGS
  // =========================================================================
  console.log(`\n--- SUITE 1: Skills Section & 9 SVG Tech Stack Icons ---`);

  h.assert(
    'Suite 1: Skills Section & 9 SVGs',
    'SKILL:SEC_EXISTS',
    'index.html contains dedicated section#skills with skills-section class',
    /<section[^>]*id=["']skills["'][^>]*class=["'][^"']*skills-section[^"']*["']/.test(html)
  );

  const EXPECTED_TECHS = [
    { tech: 'html5', name: 'HTML5', type: 'Markup' },
    { tech: 'css3', name: 'CSS3', type: 'Styling' },
    { tech: 'javascript', name: 'JavaScript', type: 'Language' },
    { tech: 'php', name: 'PHP', type: 'Backend' },
    { tech: 'mysql', name: 'MySQL', type: 'Database' },
    { tech: 'python', name: 'Python', type: 'Algorithms' },
    { tech: 'tailwind', name: 'Tailwind CSS', type: 'Framework' },
    { tech: 'git', name: 'Git', type: 'DevOps' },
    { tech: 'vite', name: 'Vite', type: 'Tooling' }
  ];

  // Extract skills section content
  const skillsMatch = html.match(/<section[^>]*id=["']skills["'][\s\S]*?<\/section>/);
  const skillsHtml = skillsMatch ? skillsMatch[0] : '';

  const matchedCards = skillsHtml.match(/class=["'](?:[^"']*\s)?skill-card(?:\s[^"']*)?["']/g) || [];
  h.assert(
    'Suite 1: Skills Section & 9 SVGs',
    'SKILL:COUNT',
    'Skills grid contains exactly 9 .skill-card items',
    matchedCards.length === 9,
    `Found ${matchedCards.length} matches: ${matchedCards.join(', ')}`
  );

  for (const item of EXPECTED_TECHS) {
    const cardRegex = new RegExp(
      `<div[^>]*class=["'][^"']*skill-card[^"']*["'][^>]*data-tech=["']${item.tech}["'][\\s\\S]*?<\\/div>\\s*<\\/div>`,
      'i'
    );
    const cardMatch = skillsHtml.match(cardRegex);
    const cardFound = Boolean(cardMatch);

    h.assert(
      'Suite 1: Skills Section & 9 SVGs',
      `SKILL:${item.tech.toUpperCase()}:CARD`,
      `Skill card for ${item.name} (${item.tech}) exists with correct data-tech and label`,
      cardFound && skillsHtml.includes(item.name) && skillsHtml.includes(item.type)
    );

    if (cardMatch) {
      const cardStr = cardMatch[0];
      const svgMatch = cardStr.match(/<svg[\s\S]*?<\/svg>/i);
      const hasSvg = Boolean(svgMatch);

      h.assert(
        'Suite 1: Skills Section & 9 SVGs',
        `SKILL:${item.tech.toUpperCase()}:SVG_FOUND`,
        `SVG element present for ${item.name}`,
        hasSvg
      );

      if (svgMatch) {
        const svgStr = svgMatch[0];

        // 1. XML Well-formedness
        const xmlCheck = validateXmlWellFormedness(svgStr);
        h.assert(
          'Suite 1: Skills Section & 9 SVGs',
          `SKILL:${item.tech.toUpperCase()}:XML_VALID`,
          `SVG for ${item.name} is well-formed XML without syntax or unclosed tag errors`,
          xmlCheck.valid,
          xmlCheck.errors.join('; ')
        );

        // 2. ViewBox validity
        const viewBoxMatch = svgStr.match(/viewBox=["']([^"']+)["']/i);
        const hasValidViewBox = viewBoxMatch && viewBoxMatch[1].trim() === '0 0 24 24';
        h.assert(
          'Suite 1: Skills Section & 9 SVGs',
          `SKILL:${item.tech.toUpperCase()}:VIEWBOX`,
          `SVG for ${item.name} has standard viewBox="0 0 24 24"`,
          hasValidViewBox,
          `Found: ${viewBoxMatch ? viewBoxMatch[1] : 'none'}`
        );

        // 3. Size attributes
        const widthMatch = svgStr.match(/width=["'](\d+)["']/i);
        const heightMatch = svgStr.match(/height=["'](\d+)["']/i);
        h.assert(
          'Suite 1: Skills Section & 9 SVGs',
          `SKILL:${item.tech.toUpperCase()}:DIMENSIONS`,
          `SVG for ${item.name} declares explicit dimensions (width=40, height=40)`,
          widthMatch && widthMatch[1] === '40' && heightMatch && heightMatch[1] === '40'
        );

        // 4. Color hex check against banned list
        const hexesFound = svgStr.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
        const bannedHexFound = hexesFound.find(h => BANNED_HEXES.includes(h.toLowerCase()));
        h.assert(
          'Suite 1: Skills Section & 9 SVGs',
          `SKILL:${item.tech.toUpperCase()}:NO_BANNED_COLOR`,
          `SVG for ${item.name} contains zero banned color hexes (Audited: ${hexesFound.join(', ') || 'none'})`,
          !bannedHexFound,
          `Violating hex found: ${bannedHexFound}`
        );
      }
    }
  }

  // Verify detailed skills matrix in About section remains intact
  h.assert(
    'Suite 1: Skills Section & 9 SVGs',
    'SKILL:ABOUT_MATRIX_PRESERVED',
    'Detailed technical skill categories in #about section remain 100% preserved',
    (html.includes('BAHASA PEMROGRAMAN') || html.includes('Core Languages')) &&
    (html.includes('WEB FRAMEWORK') || html.includes('Web & Frameworks') || html.includes('Web &amp; Frameworks')) &&
    (html.includes('BASIS DATA') || html.includes('Database & Data Layer') || html.includes('Database &amp; Data Layer')) &&
    (html.includes('METODOLOGI') || html.includes('DSS, Data & Systems') || html.includes('DSS, Data &amp; Systems'))
  );

  // =========================================================================
  // SUITE 2: CONTACT SECTION INTERACTIVITY & ACCESSIBILITY
  // =========================================================================
  console.log(`\n--- SUITE 2: Contact Section Interactivity & Accessibility ---`);

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:TWO_COL_LAYOUT',
    'Contact section features modern two-column layout (.contact-two-column-layout)',
    html.includes('contact-two-column-layout') &&
    html.includes('contact-left-column') &&
    html.includes('contact-right-column')
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:LEFT_HEADINGS',
    'Contact left column displays "GET IN TOUCH" badge and "LET\'S WORK TOGETHER" display heading',
    html.includes('GET IN TOUCH') &&
    html.includes("LET'S WORK") &&
    html.includes('TOGETHER')
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:RESUME_BTN_DOM',
    '#btnContactResume trigger button exists in left column with proper accessible label',
    /<button[^>]*id=["']btnContactResume["'][^>]*aria-label=/.test(html)
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:RESUME_BTN_JS_BINDING',
    'src/main.js binds click event on #btnContactResume to openResume modal handler',
    srcJs.includes("btnContactResume.addEventListener('click', openResume)")
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:MODAL_DISMISS_HANDLERS',
    'Resume modal supports dismissal via close button, backdrop click, and Escape key',
    srcJs.includes("btnCloseResume.addEventListener('click', closeResume)") &&
    srcJs.includes("modalBackdrop.addEventListener('click', closeResume)") &&
    srcJs.includes("e.key === 'Escape'")
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:EMAIL_DOM',
    'Card 01 EMAIL exists with #emailText (royallee523@gmail.com) and #btnCopyEmail trigger',
    html.includes('id="emailText"') &&
    html.includes('royallee523@gmail.com') &&
    html.includes('id="btnCopyEmail"') &&
    html.includes('id="copyBtnText"')
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:COPY_EMAIL_LOGIC',
    'src/main.js clipboard copy routine updates button text to "Tersalin!", sets status color, and resets',
    srcJs.includes('navigator.clipboard.writeText') &&
    srcJs.includes("'Tersalin!'") &&
    srcJs.includes('var(--status-green)') &&
    srcJs.includes('setTimeout')
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:COPY_FALLBACK_GUARD',
    'src/main.js includes try-catch fallback dialog for clipboard permissions / non-secure contexts',
    srcJs.includes('try {') &&
    srcJs.includes('navigator.clipboard.writeText') &&
    srcJs.includes('catch (err)') &&
    srcJs.includes("prompt('Silakan salin email ini:'")
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:GITHUB_CARD',
    'Card 02 GITHUB points to https://github.com/Christopher112321 with target="_blank" and rel="noopener noreferrer"',
    /<a[^>]*href=["']https:\/\/github\.com\/Christopher112321["'][^>]*target=["']_blank["'][^>]*rel=["']noopener noreferrer["']/.test(html)
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:LINKEDIN_CARD',
    'Card 03 LINKEDIN points to https://linkedin.com/in/christopher-theo-purnomo with target="_blank"',
    /<a[^>]*href=["']https:\/\/linkedin\.com\/in\/christopher-theo-purnomo["'][^>]*target=["']_blank["'][^>]*rel=["']noopener noreferrer["']/.test(html)
  );

  h.assert(
    'Suite 2: Contact Section Interactivity',
    'CONTACT:SEND_MESSAGE_CTA',
    '#mailLink CTA button exists with valid mailto:royallee523@gmail.com URI scheme',
    html.includes('id="mailLink"') && html.includes('mailto:royallee523@gmail.com')
  );

  // =========================================================================
  // SUITE 3: ROBOTIC JARGON & TONE PURGE
  // =========================================================================
  console.log(`\n--- SUITE 3: Robotic Jargon & Machine Voice Purge ---`);

  const filesToScan = [
    { name: 'index.html', content: html },
    { name: 'src/style.css', content: srcCss },
    { name: 'style.css', content: rootCss },
    { name: 'src/main.js', content: srcJs },
    { name: 'script.js', content: rootJs }
  ];

  if (fs.existsSync(distHtmlPath)) {
    filesToScan.push({ name: 'dist/index.html', content: fs.readFileSync(distHtmlPath, 'utf8') });
  }

  const BANNED_JARGON = [
    { pattern: /inventory control pos/i, label: '"inventory control pos"' },
    { pattern: /inventory_control_pos/i, label: '"inventory_control_pos"' },
    { pattern: /INVENTORY_CONTROL_POS/i, label: '"INVENTORY_CONTROL_POS"' },
    { pattern: /AHP_TOPSIS_PIPELINE/i, label: '"AHP_TOPSIS_PIPELINE"' },
    { pattern: /ACID Safe \/\/ Locked/i, label: '"ACID Safe // Locked"' },
    { pattern: /SYS_DIAGNOSTICS/i, label: '"SYS_DIAGNOSTICS"' },
    { pattern: /ROBOTIC_OVERRIDE/i, label: '"ROBOTIC_OVERRIDE"' }
  ];

  for (const jargon of BANNED_JARGON) {
    let totalMatches = 0;
    const matchingFiles = [];
    for (const f of filesToScan) {
      const count = (f.content.match(jargon.pattern) || []).length;
      if (count > 0) {
        totalMatches += count;
        matchingFiles.push(`${f.name} (${count})`);
      }
    }
    h.assert(
      'Suite 3: Robotic Jargon Purge',
      `JARGON:PURGE_${jargon.label.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`,
      `Zero occurrences of ${jargon.label} across entire codebase`,
      totalMatches === 0,
      `Found in: ${matchingFiles.join(', ')}`
    );
  }

  // Verify professional developer replacement copy
  h.assert(
    'Suite 3: Robotic Jargon Purge',
    'JARGON:PRO_COPY_MYSEMBAKO',
    'MySembako uses professional title & tagline: "Real-Time Store & Stock Management"',
    /MySembako \/\/ Real-Time Store (?:&|&amp;) Stock Management/.test(html) ||
    html.includes('Sistem Kasir & Manajemen Inventori')
  );

  h.assert(
    'Suite 3: Robotic Jargon Purge',
    'JARGON:PRO_COPY_INTERNMATCH',
    'InternMatch DSS uses professional description: "Recommendation Engine" or "Sistem Pendukung Keputusan"',
    html.includes('InternMatch DSS') &&
    (html.includes('Recommendation Engine') || html.includes('Sistem Pendukung Keputusan'))
  );

  h.assert(
    'Suite 3: Robotic Jargon Purge',
    'JARGON:PRO_COPY_ACID',
    'Database integrity phrased naturally as "Integritas Data ACID (Terjamin)"',
    html.includes('Integritas Data ACID (Terjamin)')
  );

  // =========================================================================
  // SUITE 4: PROJECT LINKS & LIVE CONNECTIVITY
  // =========================================================================
  console.log(`\n--- SUITE 4: Project Integrity & Live URL Connectivity ---`);

  const LIVE_URLS = [
    { id: 'MYSEMBAKO_LIVE', url: 'https://mysembako.vercel.app', name: 'MySembako Live Vercel' },
    { id: 'INTERNMATCH_LIVE', url: 'https://internmatch-dss.vercel.app', name: 'InternMatch DSS Live Vercel' },
    { id: 'ENERGY_SCHEDULER_LIVE', url: 'https://energy-scheduler-ashy.vercel.app', name: 'Energy Scheduler Live Vercel' },
    { id: 'MYSEMBAKO_GITHUB', url: 'https://github.com/Christopher112321/mysembako', name: 'MySembako GitHub Repo' },
    { id: 'INTERNMATCH_GITHUB', url: 'https://github.com/Christopher112321/internmatch-dss', name: 'InternMatch DSS GitHub Repo' },
    { id: 'ENERGY_SCHEDULER_GITHUB', url: 'https://github.com/Christopher112321/energy-scheduler', name: 'Energy Scheduler GitHub Repo' }
  ];

  for (const item of LIVE_URLS) {
    // 1. Verify link presence in HTML
    h.assert(
      'Suite 4: Project Links & Live Connectivity',
      `URL:HTML_${item.id}`,
      `index.html includes valid href for ${item.name} (${item.url})`,
      html.includes(item.url)
    );

    // 2. Perform live HTTP probe
    try {
      const response = await fetch(item.url, {
        method: 'GET',
        headers: { 'User-Agent': 'EmpiricalChallenger/2.0' },
        signal: AbortSignal.timeout(15000)
      });
      h.assert(
        'Suite 4: Project Links & Live Connectivity',
        `URL:HTTP_LIVE_${item.id}`,
        `${item.name} is reachable online and returns HTTP 200 OK (Status: ${response.status})`,
        response.status === 200,
        `HTTP Status was ${response.status}`
      );
    } catch (err) {
      h.assert(
        'Suite 4: Project Links & Live Connectivity',
        `URL:HTTP_LIVE_${item.id}`,
        `${item.name} live HTTP connection succeeded`,
        false,
        err.message
      );
    }
  }

  // =========================================================================
  // SUITE 5: HERO REDESIGN & THEME SWITCHER
  // =========================================================================
  console.log(`\n--- SUITE 5: Hero Redesign & Theme Switcher ---`);

  // Purge of lanyard
  const LANYARD_SYMBOLS = ['#lanyardPassCard', '#lanyardBadge', 'lanyard-strap', 'lanyardOscillation', 'lanyardPass'];
  for (const sym of LANYARD_SYMBOLS) {
    const inHtml = html.includes(sym);
    const inCss = srcCss.includes(sym);
    const inJs = srcJs.includes(sym);
    h.assert(
      'Suite 5: Hero & Theme Engine',
      `PURGE:LANYARD_${sym.replace(/[^a-zA-Z0-9]/g, '_')}`,
      `Zero references to lanyard symbol "${sym}" in HTML, CSS, or JS`,
      !inHtml && !inCss && !inJs,
      `Found in: ${inHtml ? 'HTML ' : ''}${inCss ? 'CSS ' : ''}${inJs ? 'JS' : ''}`
    );
  }

  // Hero Cutout Image
  h.assert(
    'Suite 5: Hero & Theme Engine',
    'HERO:CUTOUT_IMG_DOM',
    'Hero displays centered cutout photo img.hero-cutout-img pointing to /assets/christopher-base-cutout.png',
    /<img[^>]*src=["']\/?assets\/christopher-base-cutout\.png["'][^>]*class=["'][^"']*hero-cutout-img[^"']*["']/.test(html)
  );

  const cutoutDiskPath = path.join(ROOT_DIR, 'public', 'assets', 'christopher-base-cutout.png');
  const cutoutExists = fs.existsSync(cutoutDiskPath);
  const cutoutStats = cutoutExists ? fs.statSync(cutoutDiskPath) : null;
  h.assert(
    'Suite 5: Hero & Theme Engine',
    'HERO:CUTOUT_IMG_DISK',
    'Cutout image binary exists on disk with valid file size (>500KB)',
    cutoutExists && cutoutStats && cutoutStats.size > 500 * 1024,
    `Size: ${cutoutStats ? cutoutStats.size : '0'} bytes`
  );

  // Marquee Typography
  h.assert(
    'Suite 5: Hero & Theme Engine',
    'HERO:MARQUEE_DOM',
    'Hero contains infinite marquee container (.hero-marquee-wrap) and track (.hero-marquee-track)',
    html.includes('hero-marquee-wrap') &&
    html.includes('hero-marquee-track') &&
    html.includes('CHRISTOPHER THEO PURNOMO')
  );

  h.assert(
    'Suite 5: Hero & Theme Engine',
    'HERO:MARQUEE_CSS',
    'CSS implements infinite marquee keyframe animation and outline text stroke',
    srcCss.includes('@keyframes marqueeScroll') &&
    srcCss.includes('marqueeScroll') &&
    srcCss.includes('-webkit-text-stroke')
  );

  // Theme Switcher & Anti-FOUC
  h.assert(
    'Suite 5: Hero & Theme Engine',
    'THEME:ANTI_FOUC_HEAD',
    'Anti-FOUC script present in <head> querying localStorage.getItem("portfolio-theme")',
    html.includes('<head>') &&
    html.includes("localStorage.getItem('portfolio-theme')") &&
    html.includes("document.documentElement.setAttribute('data-theme'")
  );

  h.assert(
    'Suite 5: Hero & Theme Engine',
    'THEME:TOGGLE_BTN_DOM',
    '#themeToggle button present in navbar with both Sun and Moon SVG icons',
    html.includes('id="themeToggle"') &&
    html.includes('sun-icon') &&
    html.includes('moon-icon')
  );

  h.assert(
    'Suite 5: Hero & Theme Engine',
    'THEME:PILL_NAVBAR',
    'Floating navbar contains "C CHRISTOPHER" brand, nav links, theme toggle, and "Hire Me" button',
    html.includes('id="pillNavbar"') &&
    html.includes('brand-avatar') &&
    html.includes('CHRISTOPHER') &&
    html.includes('href="#portfolio"') &&
    html.includes('href="#skills"') &&
    html.includes('href="#about"') &&
    html.includes('href="#contact"') &&
    html.includes('id="btnHireMe"')
  );

  // =========================================================================
  // SUITE 6: DUAL-FILE SHA-256 SYNCHRONIZATION
  // =========================================================================
  console.log(`\n--- SUITE 6: Dual-File SHA-256 Synchronization ---`);

  const hashSrcCss = crypto.createHash('sha256').update(srcCss).digest('hex');
  const hashRootCss = crypto.createHash('sha256').update(rootCss).digest('hex');
  const hashSrcJs = crypto.createHash('sha256').update(srcJs).digest('hex');
  const hashRootJs = crypto.createHash('sha256').update(rootJs).digest('hex');

  h.assert(
    'Suite 6: Dual-File SHA-256 Mirroring',
    'SYNC:CSS_EQUALITY',
    `src/style.css is byte-for-byte identical to root style.css (${hashSrcCss.slice(0, 16)}...)`,
    hashSrcCss === hashRootCss,
    `src: ${hashSrcCss} vs root: ${hashRootCss}`
  );

  h.assert(
    'Suite 6: Dual-File SHA-256 Mirroring',
    'SYNC:JS_EQUALITY',
    `src/main.js is byte-for-byte identical to root script.js (${hashSrcJs.slice(0, 16)}...)`,
    hashSrcJs === hashRootJs,
    `src: ${hashSrcJs} vs root: ${hashRootJs}`
  );

  // =========================================================================
  // SUITE 7: PRODUCTION BUILD & DIST ARTIFACT HYGIENE
  // =========================================================================
  console.log(`\n--- SUITE 7: Production Build & Dist Artifact Hygiene ---`);

  const distExists = fs.existsSync(distHtmlPath);
  h.assert(
    'Suite 7: Production Build Hygiene',
    'BUILD:DIST_HTML_EXISTS',
    'dist/index.html exists and is readable',
    distExists
  );

  if (distExists) {
    const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
    const distStats = fs.statSync(distHtmlPath);

    h.assert(
      'Suite 7: Production Build Hygiene',
      'BUILD:HTML_BUDGET',
      `dist/index.html (${(distStats.size / 1024).toFixed(2)} KB) conforms to < 80KB budget`,
      distStats.size < 80 * 1024,
      `Size: ${distStats.size} bytes`
    );

    const distMatchedCards = distHtml.match(/class=["'](?:[^"']*\s)?skill-card(?:\s[^"']*)?["']/g) || [];
    h.assert(
      'Suite 7: Production Build Hygiene',
      'BUILD:DIST_SKILLS_GRID',
      'dist/index.html includes dedicated #skills section with 9 skill cards',
      distHtml.includes('id="skills"') && distMatchedCards.length === 9,
      `Found ${distMatchedCards.length} matches`
    );

    h.assert(
      'Suite 7: Production Build Hygiene',
      'BUILD:DIST_CONTACT_SECTION',
      'dist/index.html includes modern two-column contact layout and #btnContactResume',
      distHtml.includes('contact-two-column-layout') &&
      distHtml.includes('id="btnContactResume"') &&
      distHtml.includes('id="btnCopyEmail"')
    );

    // Forbidden colors scan on dist/index.html
    let distBannedCount = 0;
    for (const bHex of BANNED_HEXES) {
      if (distHtml.includes(bHex)) distBannedCount++;
    }
    for (const bRgb of BANNED_RGBS) {
      if (distHtml.includes(bRgb)) distBannedCount++;
    }
    h.assert(
      'Suite 7: Production Build Hygiene',
      'BUILD:DIST_ZERO_BANNED_COLORS',
      'dist/index.html contains zero occurrences of banned colors (#38bdf8, #a855f7, etc.)',
      distBannedCount === 0,
      `Banned color occurrences: ${distBannedCount}`
    );
  }

  // Print summary and return success
  const allPassed = h.summary();
  process.exit(allPassed ? 0 : 1);
}

runEmpiricalVerification().catch(err => {
  console.error('Fatal error during empirical verification:', err);
  process.exit(1);
});
