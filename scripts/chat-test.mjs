/**
 * End-to-end chat test: opens the chat in the real browser build and drives
 * commands through the UI, asserting the game state actually changed.
 *
 *   node scripts/chat-test.mjs
 */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4322;
let failed = false;
const fail = (m) => {
  failed = true;
  console.error('CHAT FAIL:', m);
};
const ok = (m) => console.log('✓', m);

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

try {
  await waitForServer(`http://localhost:${PORT}/`, 40000);
  browser = await chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 900, height: 560 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=FableBlock', { timeout: 15000 });
  await page.fill('input[placeholder*="seed" i]', 'chat-seed-1');
  await page.click('text=Create World');
  await page.waitForFunction(() => !document.body.innerText.includes('Generating world'), {
    timeout: 60000,
  });
  await page.waitForTimeout(3000);

  const chatInput = 'input[placeholder*="command" i]';

  // --- T opens the chat -----------------------------------------------------
  await page.keyboard.press('KeyT');
  await page.waitForSelector(chatInput, { timeout: 5000 });
  ok('T opens the chat');

  // --- /tp moves the player -------------------------------------------------
  const before = await page.evaluate(() => ({ ...window.__fableGame.player }));
  await page.fill(chatInput, '/tp 100 80 -60');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => ({
    x: window.__fableGame.player.x,
    y: window.__fableGame.player.y,
    z: window.__fableGame.player.z,
  }));
  if (Math.abs(after.x - 100) > 0.001 || Math.abs(after.z - -60) > 0.001) {
    fail(`/tp did not move the player: ${JSON.stringify(after)} (was ${before.x},${before.z})`);
  } else ok('/tp teleports');

  // Chat must close after submitting.
  if (await page.locator(chatInput).count()) fail('chat stayed open after Enter');
  else ok('chat closes on Enter');

  // --- /give puts an item in the inventory ---------------------------------
  await page.keyboard.press('KeyT');
  await page.waitForSelector(chatInput);
  await page.fill(chatInput, '/give diamond 5');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const hasDiamond = await page.evaluate(() =>
    window.__fableStore.get().inventory.some((s) => s && s.count === 5),
  );
  if (!hasDiamond) fail('/give did not add the stack');
  else ok('/give adds items');

  // --- /time changes the day cycle -----------------------------------------
  await page.keyboard.press('KeyT');
  await page.waitForSelector(chatInput);
  await page.fill(chatInput, '/time set midnight');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const t = await page.evaluate(() => window.__fableGame.dayNight.time);
  if (Math.abs(t - 0.75) > 0.02) fail(`/time set midnight -> ${t}`);
  else ok('/time sets the clock');

  // --- /locate reports coordinates -----------------------------------------
  await page.keyboard.press('KeyT');
  await page.waitForSelector(chatInput);
  await page.fill(chatInput, '/locate biome desert');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);
  const locateLine = await page.evaluate(() => {
    const log = window.__fableStore.get().chatLog;
    return log.length ? log[log.length - 1] : null;
  });
  if (!locateLine || !/desert/i.test(locateLine.text) || locateLine.kind === 'error') {
    fail(`/locate produced: ${JSON.stringify(locateLine)}`);
  } else ok(`/locate works — "${locateLine.text}"`);

  // --- Unknown command is reported, not silently swallowed ------------------
  await page.keyboard.press('KeyT');
  await page.waitForSelector(chatInput);
  await page.fill(chatInput, '/nonsense');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const errLine = await page.evaluate(() => {
    const log = window.__fableStore.get().chatLog;
    return log[log.length - 1];
  });
  if (errLine?.kind !== 'error') fail('unknown command did not report an error');
  else ok('unknown commands report an error');

  // --- Typing must not drive the player ------------------------------------
  await page.keyboard.press('KeyT');
  await page.waitForSelector(chatInput);
  const posBefore = await page.evaluate(() => ({
    x: window.__fableGame.player.x,
    z: window.__fableGame.player.z,
  }));
  await page.keyboard.type('wasd www');
  await page.waitForTimeout(900);
  const posAfter = await page.evaluate(() => ({
    x: window.__fableGame.player.x,
    z: window.__fableGame.player.z,
  }));
  if (Math.abs(posAfter.x - posBefore.x) > 0.05 || Math.abs(posAfter.z - posBefore.z) > 0.05) {
    fail('typing in chat moved the player');
  } else ok('typing does not move the player');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  if (await page.locator(chatInput).count()) fail('Escape did not close the chat');
  else ok('Escape closes the chat');

  if (errors.length) fail(`page errors: ${errors.join(' | ')}`);
  console.log(failed ? '\nCHAT TEST FAILED' : '\nCHAT PASS — commands drive the game.');
} catch (e) {
  fail(e.message);
} finally {
  await browser?.close();
  server.kill();
  process.exitCode = failed ? 1 : 0;
}
