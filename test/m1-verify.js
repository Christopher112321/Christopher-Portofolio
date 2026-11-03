/**
 * Milestone 1 (M1) Verification Suite
 * Validates Pure Monochrome Black & White Theme, Cabinet Grotesk Typography,
 * Monochrome Canvas & Cursor, and Strict Dual-File Synchronization.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
}

function hash(relPath) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT_DIR, relPath))).digest('hex');
}

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS [M1] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL [M1] ${testName}`);
    failed++;
  }
}

console.log('======================================================================');
console.log('MILESTONE 1 VERIFICATION: MONOCHROME B&W & CABINET GROTESK TYPOGRAPHY');
console.log('======================================================================\n');

const html = read('index.html');
const css = read('src/style.css');
const rootCss = read('style.css');
const js = read('src/main.js');
const rootJs = read('script.js');

// 1. Cabinet Grotesk Typography
assert(/href=["'][^"']*cabinet-grotesk[^"']*["']/i.test(html), 'index.html imports Cabinet Grotesk via Fontshare CDN');
assert(/@import\s+url\(['"][^'"]*cabinet-grotesk[^'"]*['"]\);/i.test(css), 'src/style.css imports Cabinet Grotesk via @import');
assert(/--font-display:\s*['"]Cabinet Grotesk['"]/i.test(css), 'src/style.css defines --font-display with Cabinet Grotesk');
assert(/h1,\s*h2,\s*h3[\s\S]*?\.section-title[\s\S]*?\.project-card-title[\s\S]*?font-family:\s*var\(--font-display\)/i.test(css), 'Headings & display titles styled with var(--font-display)');

// 2. Pure Black & White Monochrome Palette Tokens
assert(/--bg-primary:\s*#000000\s*;/i.test(css), '--bg-primary set to pitch black #000000');
assert(/--accent:\s*#ffffff\s*;/i.test(css), '--accent set to crisp white #ffffff');
assert(/--text-primary:\s*#ffffff\s*;/i.test(css), '--text-primary set to crisp white #ffffff');
assert(/--text-inverse:\s*#000000\s*;/i.test(css), '--text-inverse set to pitch black #000000');

// Check absence of colored accents in CSS
const forbiddenColors = [
  '#38bdf8', '#7dd3fc', '#6366f1', '#0284c7', '#10b981', '#1ed760',
  'rgba(56, 189, 248', 'rgba(99, 102, 241', 'rgba(125, 211, 252'
];
const foundForbiddenCss = forbiddenColors.filter(c => css.toLowerCase().includes(c.toLowerCase()));
assert(foundForbiddenCss.length === 0, `Zero colored accents in src/style.css (found: ${foundForbiddenCss.join(', ') || 'none'})`);

// 3. Monochrome Canvas & Custom Cursor
const foundForbiddenJs = forbiddenColors.filter(c => js.toLowerCase().includes(c.toLowerCase()));
assert(foundForbiddenJs.length === 0, `Zero colored accents in src/main.js (found: ${foundForbiddenJs.join(', ') || 'none'})`);
assert(/cursor-dot[\s\S]*?background-color:\s*var\(--accent\)/i.test(css), 'cursor-dot uses monochrome --accent');
assert(/cursor-ring\.cursor-active[\s\S]*?background-color:\s*rgba\(255,\s*255,\s*255/i.test(css), 'cursor-ring.cursor-active uses translucent white glow');

// 4. Strict Dual-File Synchronization
const cssHash1 = hash('src/style.css');
const cssHash2 = hash('style.css');
assert(cssHash1 === cssHash2, `src/style.css and style.css are byte-identical (${cssHash1})`);

const jsHash1 = hash('src/main.js');
const jsHash2 = hash('script.js');
assert(jsHash1 === jsHash2, `src/main.js and script.js are byte-identical (${jsHash1})`);

// 5. 100% Content Preservation Spot-Check
assert(html.includes('Christopher Theo Purnomo'), 'Author name preserved in HTML');
assert(html.includes('Unika Soegijapranata'), 'University affiliation preserved');
assert(html.includes('InternMatch DSS'), 'InternMatch DSS project preserved');
assert(html.includes('MySembako'), 'MySembako project preserved');
assert(html.includes('Energy Scheduler'), 'Energy Scheduler project preserved');

console.log('\n----------------------------------------------------------------------');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('----------------------------------------------------------------------');

if (failed > 0) {
  process.exit(1);
}
