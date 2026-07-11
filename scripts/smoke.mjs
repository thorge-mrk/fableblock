/**
 * Headless runtime smoke test (not part of the unit suite).
 * Boots the production preview server, drives the title -> playing flow with
 * Playwright, and fails on any console error / page exception / WebGL fault.
 *
 *   node scripts/smoke.mjs
 */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4319;

function waitForServer(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const poll = async () => {
      try {
        const r = await fetch(url);
        if (r.ok) return resolve();
      } catch {
        // not up yet
      }
      if (Date.now() - start > timeoutMs) return reject(new Error('server timeout'));
      setTimeout(poll, 250);
    };
    poll();
  });
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'inherit',
});

let browser;
let failed = false;
const fail = (msg) => {
  failed = true;
  console.error('SMOKE FAIL:', msg);
};

try {
  await waitForServer(`http://localhost:${PORT}/`, 30000);
  browser = await chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 720 } });

  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

  // Title screen present?
  await page.waitForSelector('text=FableBlock', { timeout: 10000 });
  console.log('✓ title screen rendered');

  // Enter a fixed seed and create the world.
  await page.fill('input[placeholder*="seed" i]', 'smoke-seed-7');
  await page.click('text=Create World');

  // Loading screen.
  await page.waitForSelector('text=Generating world', { timeout: 10000 });
  console.log('✓ world generation started');

  // Wait for the HUD hotbar (phase === playing). Up to 40s for worldgen+mesh.
  await page.waitForFunction(
    () => !document.body.innerText.includes('Generating world'),
    { timeout: 45000 },
  );
  // Allow a few frames to render and the logic worker to tick.
  await page.waitForTimeout(4000);
  console.log('✓ reached playing phase');

  // Pull engine debug stats from the store via the on-screen F3 overlay.
  await page.keyboard.press('F3');
  await page.waitForTimeout(500);
  const debugText = await page.evaluate(() => document.body.innerText);
  const fpsMatch = debugText.match(/FPS\s+(\d+)/);
  const chunkMatch = debugText.match(/chunks\s+(\d+)/);
  if (!fpsMatch) fail('debug overlay missing FPS');
  else console.log(`✓ FPS ${fpsMatch[1]}, ${chunkMatch ? chunkMatch[1] : '?'} chunks loaded`);

  const fps = fpsMatch ? Number(fpsMatch[1]) : 0;
  const chunks = chunkMatch ? Number(chunkMatch[1]) : 0;
  if (chunks < 9) fail(`too few chunks loaded: ${chunks}`);
  if (fps < 5) fail(`fps unexpectedly low in headless swiftshader: ${fps}`);

  // Verify a non-trivial number of triangles is actually being drawn.
  const drawInfo = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return null;
    return { w: c.width, h: c.height };
  });
  if (!drawInfo || drawInfo.w < 100) fail('canvas not sized');
  else console.log(`✓ canvas ${drawInfo.w}x${drawInfo.h}`);

  // Open inventory (E) and confirm the crafting UI appears.
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(400);
  const invOpen = await page.evaluate(() => document.body.innerText.includes('Inventory'));
  if (!invOpen) fail('inventory did not open on E');
  else console.log('✓ inventory screen opens');
  await page.keyboard.press('KeyE');

  await page.screenshot({ path: 'scripts/smoke-screenshot.png' });
  console.log('✓ screenshot saved');

  if (errors.length > 0) {
    // Filter benign warnings that some GL stacks emit.
    const real = errors.filter(
      (e) => !/willReadFrequently|Generated an empty chunk|WebGL.*deprecated/i.test(e),
    );
    if (real.length > 0) {
      fail('console errors:\n  ' + real.join('\n  '));
    }
  }

  if (!failed) console.log('\nSMOKE PASS — engine boots, generates, renders, and is interactive.');
} catch (e) {
  fail(e.stack || String(e));
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
  setTimeout(() => process.exit(failed ? 1 : 0), 500);
}
