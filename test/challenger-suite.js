import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import zlib from 'node:zlib';
import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

const results = [];

function record(suite, name, passed, details = null) {
  results.push({ suite, name, passed, details });
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`  ${status} [${suite}] ${name}`);
  if (!passed && details) {
    console.log(`         ${colors.red}${details}${colors.reset}`);
  }
}

function httpGet(urlPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${BASE_URL}${urlPath}`;
    const req = http.get(fullUrl, { timeout: 5000 }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: buffer.toString('utf8'),
          rawBuffer: buffer,
          contentLength: buffer.length
        });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout requesting ${fullUrl}`));
    });
  });
}

async function waitForServer(maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await httpGet('/');
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 250));
    }
  }
  return false;
}

async function runEmpiricalChallenger() {
  console.log('='.repeat(75));
  console.log(`${colors.bold}${colors.cyan}EMPIRICAL CHALLENGER 2: DEEP VERIFICATION SUITE${colors.reset}`);
  console.log(`Root Directory: ${ROOT_DIR}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('='.repeat(75));

  // =========================================================================
  // SUITE 1: DIST & ASSET PATH INTEGRITY AUDIT
  // =========================================================================
  console.log(`\n${colors.bold}--- SUITE 1: Dist & Asset Path Integrity Audit ---${colors.reset}`);
  const distHtmlPath = path.join(ROOT_DIR, 'dist/index.html');
  if (!fs.existsSync(distHtmlPath)) {
    record('DistPath', 'dist/index.html exists', false, 'dist/index.html missing');
    return;
  }
  const distHtmlContent = fs.readFileSync(distHtmlPath, 'utf8');
  const distHtmlLines = distHtmlContent.split(/\r?\n/);

  // Line by line /portof/ check
  const portofLines = [];
  distHtmlLines.forEach((line, idx) => {
    if (/\/portof\//i.test(line) || /["']\/portof\b/i.test(line)) {
      portofLines.push({ lineNum: idx + 1, line: line.trim() });
    }
  });
  record('DistPath', 'Zero /portof/ path prefixes in dist/index.html (line-by-line)', portofLines.length === 0,
    portofLines.length === 0 ? null : `Found ${portofLines.length} occurrences: ${JSON.stringify(portofLines)}`);

  // Extract all src and href references in dist/index.html
  const srcRegex = /src=["']([^"']+)["']/g;
  const hrefRegex = /href=["']([^"']+)["']/g;
  const assetRefs = new Set();
  let match;
  while ((match = srcRegex.exec(distHtmlContent)) !== null) {
    if (match[1].startsWith('/')) assetRefs.add(match[1]);
  }
  while ((match = hrefRegex.exec(distHtmlContent)) !== null) {
    if (match[1].startsWith('/')) assetRefs.add(match[1]);
  }

  const missingAssets = [];
  for (const ref of assetRefs) {
    // Strip leading slash to map to dist
    const relDiskPath = ref.replace(/^\//, '');
    const fullDiskPath = path.join(ROOT_DIR, 'dist', relDiskPath);
    if (!fs.existsSync(fullDiskPath)) {
      missingAssets.push({ ref, fullDiskPath });
    }
  }
  record('DistPath', 'All root-relative assets referenced in dist/index.html exist on disk', missingAssets.length === 0,
    missingAssets.length === 0 ? null : `Missing disk assets: ${JSON.stringify(missingAssets)}`);

  // Check script tags in dist/index.html
  const jsMatch = distHtmlContent.match(/src=["'](\/assets\/index-[^"']+\.js)["']/);
  const cssMatch = distHtmlContent.match(/href=["'](\/assets\/index-[^"']+\.css)["']/);
  record('DistPath', 'Vite bundled JS script tag present in dist/index.html', !!jsMatch, jsMatch ? `Found: ${jsMatch[1]}` : 'Missing JS bundle tag');
  record('DistPath', 'Vite bundled CSS link tag present in dist/index.html', !!cssMatch, cssMatch ? `Found: ${cssMatch[1]}` : 'Missing CSS bundle tag');

  const jsAssetRel = jsMatch ? jsMatch[1] : null;
  const cssAssetRel = cssMatch ? cssMatch[1] : null;

  // =========================================================================
  // SUITE 2: ARTIFACT SIZING & BUDGET PROFILE
  // =========================================================================
  console.log(`\n${colors.bold}--- SUITE 2: Artifact Sizing & Performance Budgets ---${colors.reset}`);
  if (jsAssetRel) {
    const jsPath = path.join(ROOT_DIR, 'dist', jsAssetRel.replace(/^\//, ''));
    const jsBuffer = fs.readFileSync(jsPath);
    const jsGzip = zlib.gzipSync(jsBuffer);
    const jsBudgetOk = jsBuffer.length < 50 * 1024; // < 50KB uncompressed budget
    record('Budget', `Production JS bundle (${(jsBuffer.length / 1024).toFixed(2)} KB, gzip ${(jsGzip.length / 1024).toFixed(2)} KB) under 50KB budget`, jsBudgetOk);
  }

  if (cssAssetRel) {
    const cssPath = path.join(ROOT_DIR, 'dist', cssAssetRel.replace(/^\//, ''));
    const cssBuffer = fs.readFileSync(cssPath);
    const cssGzip = zlib.gzipSync(cssBuffer);
    const cssBudgetOk = cssBuffer.length < 60 * 1024; // < 60KB uncompressed budget
    record('Budget', `Production CSS bundle (${(cssBuffer.length / 1024).toFixed(2)} KB, gzip ${(cssGzip.length / 1024).toFixed(2)} KB) under 60KB budget`, cssBudgetOk);
  }

  const htmlBuffer = fs.readFileSync(distHtmlPath);
  const htmlGzip = zlib.gzipSync(htmlBuffer);
  const htmlBudgetOk = htmlBuffer.length < 80 * 1024; // < 80KB uncompressed budget (3 projects)
  record('Budget', `Production HTML (${(htmlBuffer.length / 1024).toFixed(2)} KB, gzip ${(htmlGzip.length / 1024).toFixed(2)} KB) under 80KB budget`, htmlBudgetOk);

  // Check JS syntax
  let jsSyntaxValid = false;
  let jsSyntaxError = null;
  if (jsAssetRel) {
    const jsPath = path.join(ROOT_DIR, 'dist', jsAssetRel.replace(/^\//, ''));
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    try {
      new vm.Script(jsContent);
      jsSyntaxValid = true;
    } catch (e) {
      jsSyntaxError = e.message;
    }
  }
  record('Syntax', 'Production JavaScript bundle compiles with valid ES syntax', jsSyntaxValid, jsSyntaxError);

  // =========================================================================
  // SUITE 3: STATIC SERVER & PREVIEW HTTP EMPIRICAL TESTS
  // =========================================================================
  console.log(`\n${colors.bold}--- SUITE 3: Static Server & Preview HTTP Tests ---${colors.reset}`);
  console.log(`  ${colors.dim}Spawning 'npx vite preview --port ${PORT}'...${colors.reset}`);

  const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT_DIR,
    shell: true,
    stdio: 'pipe'
  });

  let serverOutput = '';
  previewProcess.stdout?.on('data', data => serverOutput += data.toString());
  previewProcess.stderr?.on('data', data => serverOutput += data.toString());

  try {
    const isReady = await waitForServer(60);
    if (!isReady) {
      throw new Error(`Preview server failed to respond on ${BASE_URL} within 15s. Output:\n${serverOutput}`);
    }
    console.log(`  ${colors.green}Preview server active on ${BASE_URL}${colors.reset}`);

    // Test 1: GET /
    const rootRes = await httpGet('/');
    const rootOk = rootRes.statusCode === 200 &&
                   rootRes.headers['content-type']?.includes('text/html') &&
                   rootRes.body.includes('Christopher Theo Purnomo') &&
                   rootRes.body.includes('id="introScreen"') &&
                   rootRes.body.includes('class="hero-marquee-wrap"') &&
                   rootRes.body.includes('id="skills"') &&
                   rootRes.body.includes('id="aboutSpotlightContainer"');
    record('HTTP', 'GET / returns 200 OK with valid text/html and complete DOM structures', rootOk,
      `Status: ${rootRes.statusCode}, Type: ${rootRes.headers['content-type']}`);

    // Test 2: GET JS Bundle
    if (jsAssetRel) {
      const jsRes = await httpGet(jsAssetRel);
      const jsOk = jsRes.statusCode === 200 &&
                   (jsRes.headers['content-type']?.includes('javascript') || jsRes.headers['content-type']?.includes('application/javascript')) &&
                   jsRes.contentLength > 1000;
      record('HTTP', `GET ${jsAssetRel} returns 200 OK with javascript MIME and valid payload`, jsOk,
        `Status: ${jsRes.statusCode}, Length: ${jsRes.contentLength}`);
    }

    // Test 3: GET CSS Bundle
    if (cssAssetRel) {
      const cssRes = await httpGet(cssAssetRel);
      const cssOk = cssRes.statusCode === 200 &&
                    cssRes.headers['content-type']?.includes('text/css') &&
                    cssRes.contentLength > 1000;
      record('HTTP', `GET ${cssAssetRel} returns 200 OK with text/css MIME and valid payload`, cssOk,
        `Status: ${cssRes.statusCode}, Length: ${cssRes.contentLength}`);
    }

    // Test 4: GET Static Image /assets/christopher-base.jpg
    const img1Res = await httpGet('/assets/christopher-base.jpg');
    const img1Ok = img1Res.statusCode === 200 &&
                   img1Res.headers['content-type']?.includes('image/jpeg') &&
                   img1Res.contentLength === 456120;
    record('HTTP', 'GET /assets/christopher-base.jpg returns 200 OK (image/jpeg, 456,120 bytes)', img1Ok,
      `Status: ${img1Res.statusCode}, Length: ${img1Res.contentLength}, Type: ${img1Res.headers['content-type']}`);

    // Test 5: GET Static Cutout /assets/christopher-base-cutout.png
    const img2Res = await httpGet('/assets/christopher-base-cutout.png');
    const img2Ok = img2Res.statusCode === 200 &&
                   img2Res.headers['content-type']?.includes('image/png') &&
                   img2Res.contentLength === 1070436;
    record('HTTP', 'GET /assets/christopher-base-cutout.png returns 200 OK (image/png, 1,070,436 bytes)', img2Ok,
      `Status: ${img2Res.statusCode}, Length: ${img2Res.contentLength}, Type: ${img2Res.headers['content-type']}`);

    // Test 6: SPA Fallback GET /portfolio
    const spa1Res = await httpGet('/portfolio');
    const spa1Ok = spa1Res.statusCode === 200 &&
                   spa1Res.headers['content-type']?.includes('text/html') &&
                   spa1Res.body.includes('Christopher Theo Purnomo');
    record('HTTP', 'GET /portfolio (SPA route) rewrites to index.html with 200 OK', spa1Ok,
      `Status: ${spa1Res.statusCode}`);

    // Test 7: Deep SPA Fallback GET /deep/sub/path
    const spa2Res = await httpGet('/deep/sub/path');
    const spa2Ok = spa2Res.statusCode === 200 &&
                   spa2Res.headers['content-type']?.includes('text/html') &&
                   spa2Res.body.includes('Christopher Theo Purnomo');
    record('HTTP', 'GET /deep/sub/path (deep route) rewrites to index.html with 200 OK', spa2Ok,
      `Status: ${spa2Res.statusCode}`);

    // Test 8: Non-existent route GET /non-existent-route -> Must rewrite to index.html with 200 OK (verifying SPA rewrite behavior)
    const nonExistentRouteRes = await httpGet('/non-existent-route');
    const nonExistentRewriteOk = nonExistentRouteRes.statusCode === 200 &&
                                 nonExistentRouteRes.headers['content-type']?.includes('text/html') &&
                                 nonExistentRouteRes.body.includes('Christopher Theo Purnomo');
    record('HTTP', 'GET /non-existent-route rewrites to index.html with 200 OK (SPA rewrite behavior)', nonExistentRewriteOk,
      `Status: ${nonExistentRouteRes.statusCode}, Type: ${nonExistentRouteRes.headers['content-type']}`);

  } catch (err) {
    record('HTTP', 'Preview Server Test Harness Execution', false, err.message);
  } finally {
    // Kill preview process tree cleanly
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(previewProcess.pid), '/f', '/t'], { stdio: 'ignore' });
    } else {
      previewProcess.kill('SIGKILL');
    }
    // Give port time to release
    await new Promise(r => setTimeout(r, 500));
  }

  // =========================================================================
  // SUITE 4: ADVERSARIAL STRESS & FORENSIC CONTENT TESTS
  // =========================================================================
  console.log(`\n${colors.bold}--- SUITE 4: Adversarial Stress & Forensic Content Integrity ---${colors.reset}`);

  // Test 4.1: Vercel JSON Specification Conformance
  const vercelPath = path.join(ROOT_DIR, 'vercel.json');
  let vercelConfigValid = false;
  let vercelDetails = null;
  if (fs.existsSync(vercelPath)) {
    try {
      const vJson = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      const hasValidRewrite = vJson.rewrites && vJson.rewrites.some(r => r.source === '/(.*)' && r.destination === '/index.html');
      const hasValidHeader = vJson.headers && vJson.headers.some(h => h.source === '/assets/(.*)' &&
        h.headers.some(hdr => hdr.key === 'Cache-Control' && hdr.value.includes('immutable')));
      vercelConfigValid = hasValidRewrite && hasValidHeader;
      if (!vercelConfigValid) {
        vercelDetails = `Missing rewrite or header: ${JSON.stringify(vJson)}`;
      }
    } catch (e) {
      vercelDetails = `JSON Parse Error: ${e.message}`;
    }
  }
  record('Vercel', 'vercel.json conforms to Vercel static SPA routing & immutable cache specification', vercelConfigValid, vercelDetails);

  // Test 4.2: Zero Reyna / Lore Bleed anywhere in src/ or dist/
  const suspiciousKeywords = [
    'reyna',
    'soul-orb',
    'radianite',
    'empress',
    '#d946ef',
    '#e879f9',
    '#a855f7'
  ];
  const scanDirs = ['dist', 'src', 'public'];
  const violations = [];

  function scanFolder(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        scanFolder(full);
      } else if (ent.isFile() && /\.(html|js|css|json)$/i.test(ent.name)) {
        const content = fs.readFileSync(full, 'utf8');
        // Ignore comments in css/js for strictness testing on active tokens
        for (const kw of suspiciousKeywords) {
          const regex = new RegExp(`\\b${kw}\\b`, 'i');
          if (regex.test(content)) {
            // Check if it's not a comment or file explanation
            violations.push({ file: path.relative(ROOT_DIR, full), keyword: kw });
          }
        }
      }
    }
  }

  for (const dir of scanDirs) {
    const fullDir = path.join(ROOT_DIR, dir);
    if (fs.existsSync(fullDir)) scanFolder(fullDir);
  }

  record('Forensic', 'Zero Reyna/lore/magenta keywords across dist/, src/, and public/ source files', violations.length === 0,
    violations.length === 0 ? null : `Detected keywords in files: ${JSON.stringify(violations)}`);

  // Test 4.3: Verbatim Verification of All Crucial Information
  const requiredInformation = [
    { label: 'Author Name', query: 'Christopher Theo Purnomo' },
    { label: 'Institution', query: 'Unika Soegijapranata' },
    { label: 'Location', query: 'Semarang, Indonesia' },
    { label: 'Role', query: 'Informatics Student & Software Builder' },
    { label: 'Project 1 Title', query: 'InternMatch DSS' },
    { label: 'Project 1 Methodology', query: 'AHP' },
    { label: 'Project 1 Ranking', query: 'TOPSIS' },
    { label: 'Project 2 Title', query: 'MySembako' },
    { label: 'Project 2 Features', query: 'FIFO' },
    { label: 'Contact Email', query: 'chris.theo.purnomo@gmail.com' },
    { label: 'GitHub Handle', query: 'github.com/christophertheop' },
    { label: 'LinkedIn Profile', query: 'linkedin.com/in/christopher-theo-66763a387' },
    { label: 'Instagram Handle', query: '@chris_theo.p' }
  ];

  const normalizedHtml = distHtmlContent.replace(/&amp;/g, '&');
  let allInfoPresent = true;
  const missingInfo = [];
  for (const item of requiredInformation) {
    if (!normalizedHtml.includes(item.query)) {
      allInfoPresent = false;
      missingInfo.push(item);
    }
  }
  record('Forensic', 'All 13 authoritative content and contact channels verified present in dist/index.html', allInfoPresent,
    allInfoPresent ? null : `Missing info: ${JSON.stringify(missingInfo)}`);

  // Test 4.4: Project Cards Interactive & Live Links Verification in dist/index.html
  const imCardMatch = distHtmlContent.match(/<article[^>]*id=["']project-internmatch["'][^>]*>/i);
  const msCardMatch = distHtmlContent.match(/<article[^>]*id=["']project-mysembako["'][^>]*>/i);
  const esCardMatch = distHtmlContent.match(/<article[^>]*id=["']project-energy-scheduler["'][^>]*>/i);
  const imTag = imCardMatch ? imCardMatch[0] : '';
  const msTag = msCardMatch ? msCardMatch[0] : '';
  const esTag = esCardMatch ? esCardMatch[0] : '';

  const hasCardDataHref = imTag.includes('https://internmatch-dss.vercel.app') &&
                          msTag.includes('https://my-sembako.vercel.app') &&
                          esTag.includes('https://energy-scheduler-ashy.vercel.app');
  const hasCardTabindex = imTag.includes('tabindex="0"') && msTag.includes('tabindex="0"') && esTag.includes('tabindex="0"');

  const hasDistVercelLinks = distHtmlContent.includes('https://internmatch-dss.vercel.app') &&
                             distHtmlContent.includes('https://my-sembako.vercel.app') &&
                             distHtmlContent.includes('https://energy-scheduler-ashy.vercel.app');
  const hasDistGithubLinks = distHtmlContent.includes('https://github.com/Christopher112321/internmatch-dss') &&
                             distHtmlContent.includes('https://github.com/Christopher112321/mysembako') &&
                             distHtmlContent.includes('https://github.com/Christopher112321/energy-scheduler');

  const cardIntegrityOk = hasCardDataHref && hasCardTabindex && hasDistVercelLinks && hasDistGithubLinks;
  record('Forensic', 'Interactive project card attributes (data-href, tabindex) and live Vercel/GitHub links verified in dist/index.html', cardIntegrityOk,
    cardIntegrityOk ? null : `dataHref=${hasCardDataHref}, tabindex=${hasCardTabindex}, vercel=${hasDistVercelLinks}, github=${hasDistGithubLinks}`);

  // Test 4.5: Card Cursor Pointer, Hover Glow & Focus Styling in Production CSS
  let cssPointerOk = false;
  let cssDetails = null;
  if (cssAssetRel) {
    const cssPath = path.join(ROOT_DIR, 'dist', cssAssetRel.replace(/^\//, ''));
    if (fs.existsSync(cssPath)) {
      const prodCss = fs.readFileSync(cssPath, 'utf8');
      const hasCardPointer = /\.case-study-card[^{]*\{[^}]*cursor:\s*pointer/i.test(prodCss);
      const hasFocusVisible = prodCss.includes('case-study-card:focus-visible');
      const hasAmbientGlow = prodCss.includes('case-study-card:hover:before') || prodCss.includes('case-study-card:hover::before');
      cssPointerOk = hasCardPointer && hasFocusVisible && hasAmbientGlow;
      if (!cssPointerOk) {
        cssDetails = `hasCardPointer=${hasCardPointer}, hasFocusVisible=${hasFocusVisible}, hasAmbientGlow=${hasAmbientGlow}`;
      }
    }
  }
  record('Forensic', 'Production CSS includes cursor: pointer, ambient glow, and focus-visible styling for case study cards', cssPointerOk, cssDetails);

  // Test 4.6: Production JavaScript Project Navigation & Event Isolation Logic
  let jsNavOk = false;
  let jsNavDetails = null;
  if (jsAssetRel) {
    const jsPath = path.join(ROOT_DIR, 'dist', jsAssetRel.replace(/^\//, ''));
    if (fs.existsSync(jsPath)) {
      const prodJs = fs.readFileSync(jsPath, 'utf8');
      const hasProdCards = prodJs.includes('project-internmatch') && prodJs.includes('project-mysembako') && prodJs.includes('project-energy-scheduler');
      const hasProdUrls = prodJs.includes('https://internmatch-dss.vercel.app') && prodJs.includes('https://my-sembako.vercel.app') && prodJs.includes('https://energy-scheduler-ashy.vercel.app');
      const hasProdIsolation = prodJs.includes('stopPropagation');
      const hasSelectionGuard = prodJs.includes('getSelection');
      const hasAuxClick = prodJs.includes('auxclick');
      jsNavOk = hasProdCards && hasProdUrls && hasProdIsolation && hasSelectionGuard && hasAuxClick;
      if (!jsNavOk) {
        jsNavDetails = `hasCards=${hasProdCards}, hasUrls=${hasProdUrls}, hasIsolation=${hasProdIsolation}, hasSelection=${hasSelectionGuard}, hasAux=${hasAuxClick}`;
      }
    }
  }
  record('Forensic', 'Production JS bundle includes card click navigation, selection guard, auxclick, and event isolation logic', jsNavOk, jsNavDetails);

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n' + '='.repeat(75));
  console.log(`${colors.bold}EMPIRICAL CHALLENGER 2: VERIFICATION SUMMARY${colors.reset}`);
  console.log('='.repeat(75));

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  console.log(`Total Assertions Evaluated : ${total}`);
  console.log(`Passed                     : ${passed}`);
  console.log(`Failed                     : ${failed}`);
  console.log(`Success Rate               : ${Math.round((passed / total) * 100)}%`);

  if (failed === 0) {
    console.log(`\n${colors.bold}${colors.green}VERDICT: APPROVE — ALL EMPIRICAL CHALLENGES PASSED${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.bold}${colors.red}VERDICT: REJECT — ${failed} FAILURE(S) DETECTED${colors.reset}\n`);
    process.exit(1);
  }
}

runEmpiricalChallenger().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
