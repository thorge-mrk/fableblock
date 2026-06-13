/**
 * GitHub Pages deployment simulation.
 *
 * GitHub Pages serves a project site from a sub-path
 * (https://<user>.github.io/<repo>/). The #1 deployment failure is assets or
 * module workers 404-ing because the build hard-coded absolute "/" paths.
 *
 * This script statically serves the built dist/ under "/minecraft/" exactly
 * like GitHub Pages, drives the boot flow with Playwright, and FAILS on any
 * HTTP 4xx/5xx response (a broken asset/worker path) or console error.
 *
 *   node scripts/ghpages-check.mjs
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PORT = 4321;
const BASE = '/minecraft/'; // simulated repo sub-path
const DIST = path.resolve('dist');

if (!existsSync(DIST)) {
  console.error('GHPAGES FAIL: dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Minimal static file server rooted so that BASE maps to dist/.
const server = http.createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (!urlPath.startsWith(BASE)) {
      res.statusCode = 404;
      res.end('not found (outside base)');
      return;
    }
    let rel = urlPath.slice(BASE.length);
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    const file = path.join(DIST, rel);
    if (!file.startsWith(DIST)) {
      res.statusCode = 403;
      res.end('forbidden');
      return;
    }
    const data = await readFile(file);
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
});

let failed = false;
const fail = (m) => {
  failed = true;
  console.error('GHPAGES FAIL:', m);
};

await new Promise((r) => server.listen(PORT, r));

let browser;
try {
  browser = await chromium.launch({
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--no-sandbox',
    ],
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 720 } });

  const consoleErrors = [];
  const badResponses = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  page.on('response', (r) => {
    const u = r.url();
    if (r.status() >= 400 && u.includes(`localhost:${PORT}`)) {
      badResponses.push(`${r.status()} ${u}`);
    }
  });
  page.on('requestfailed', (r) => {
    badResponses.push(`FAILED ${r.failure()?.errorText ?? ''} ${r.url()}`);
  });

  const url = `http://localhost:${PORT}${BASE}`;
  console.log('Serving dist/ at', url, '(simulating GitHub Pages sub-path)');
  await page.goto(url, { waitUntil: 'networkidle' });

  await page.waitForSelector('text=VOXELCRAFT', { timeout: 10000 });
  console.log('✓ title screen loaded under sub-path');

  await page.fill('input[placeholder*="seed" i]', 'ghpages-seed');
  await page.click('text=Create World');
  await page.waitForSelector('text=Generating world', { timeout: 10000 });

  // The workers must load from the sub-path for generation to progress at all.
  await page.waitForFunction(() => !document.body.innerText.includes('Generating world'), {
    timeout: 45000,
  });
  await page.waitForTimeout(3000);
  console.log('✓ workers loaded and world generated from sub-path');

  await page.keyboard.press('F3');
  await page.waitForTimeout(400);
  const text = await page.evaluate(() => document.body.innerText);
  const chunks = Number((text.match(/chunks\s+(\d+)/) || [])[1] || 0);
  if (chunks < 9) fail(`only ${chunks} chunks loaded under sub-path`);
  else console.log(`✓ ${chunks} chunks generated + meshed under sub-path`);

  if (badResponses.length > 0) {
    fail('HTTP errors (broken paths under sub-path):\n  ' + badResponses.join('\n  '));
  } else {
    console.log('✓ zero 4xx/5xx — every asset & worker resolved under the sub-path');
  }

  const realErrors = consoleErrors.filter(
    (e) => !/willReadFrequently|WebGL.*deprecated|SwiftShader/i.test(e),
  );
  if (realErrors.length > 0) fail('console errors:\n  ' + realErrors.join('\n  '));

  if (!failed) {
    console.log('\nGHPAGES PASS — the production build deploys correctly to a GitHub Pages sub-path.');
  }
} catch (e) {
  fail(e.stack || String(e));
} finally {
  if (browser) await browser.close();
  server.close();
  setTimeout(() => process.exit(failed ? 1 : 0), 300);
}
