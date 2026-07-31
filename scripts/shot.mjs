/**
 * Headless graphics capture: boots the production build, teleports the camera
 * to a chosen spot / time of day and saves screenshots so rendering changes
 * can actually be reviewed instead of guessed at.
 *
 *   node scripts/shot.mjs [seed] [outDir]
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4321;
const seed = process.argv[2] ?? 'shot-seed-1';
const outDir = process.argv[3] ?? 'scripts/shots';
mkdirSync(outDir, { recursive: true });

function waitForServer(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const poll = async () => {
      try {
        const r = await fetch(url);
        if (r.ok) return resolve();
      } catch {
        /* not up yet */
      }
      if (Date.now() - start > timeoutMs) return reject(new Error('server timeout'));
      setTimeout(poll, 250);
    };
    poll();
  });
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
});
let browser;

/**
 * Views to capture: [name, yaw, pitch, timeOfDay, height above sea level].
 * The camera is lifted well clear of the terrain so each shot frames a
 * landscape — a view pressed against a wall says nothing about the renderer.
 */
const VIEWS = [
  ['noon-vista', 0.6, -0.16, 0.25, 96],
  ['noon-wide', 2.4, -0.22, 0.25, 104],
  ['golden-hour', 1.5, -0.10, 0.487, 96],
  ['night', 3.4, -0.14, 0.78, 96],
];

try {
  await waitForServer(`http://localhost:${PORT}/`, 40000);
  browser = await chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 860, height: 540 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('pageerror:', e.message));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=FableBlock', { timeout: 15000 });
  await page.fill('input[placeholder*="seed" i]', seed);
  await page.click('text=Create World');
  await page.waitForFunction(() => !document.body.innerText.includes('Generating world'), {
    timeout: 60000,
  });
  await page.waitForTimeout(6000);

  // Capture rig: creative flight means no gravity, no fall damage and no
  // death screen photobombing the shot.
  await page.evaluate(() => {
    window.__fableStore.get().set({ gameMode: 'creative', health: 20 });
    window.__fableGame.player.flying = true;
  });


  for (const [name, yaw, pitch, time, height] of VIEWS) {
    await page.evaluate(
      ([yaw, pitch, time, height]) => {
        const g = window.__fableGame;
        if (!g) throw new Error('__fableGame missing');
        g.player.yaw = yaw;
        g.player.pitch = pitch;
        g.player.y = height;
        g.player.vy = 0;
        g.dayNight.time = time;
      },
      [yaw, pitch, time, height],
    );
    // Hold the camera aloft while chunks stream in around the new viewpoint.
    for (let i = 0; i < 8; i++) {
      await page.waitForTimeout(700);
      await page.evaluate((h) => {
        const g = window.__fableGame;
        g.player.flying = true;
        g.player.y = h;
        g.player.vy = 0;
        g.player.setFallPeakForCapture?.(h);
      }, height);
    }
    await page.screenshot({ path: `${outDir}/${name}.png`, timeout: 120000, animations: 'disabled' });
    console.log('saved', `${outDir}/${name}.png`);
  }
  console.log('SHOTS OK');
} catch (e) {
  console.error('SHOT FAIL:', e.message);
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill();
}
