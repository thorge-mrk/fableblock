/**
 * Integration harness for mob spawning + day burning.
 * Loads a grid of flat lit land chunks, drives the logic worker, and checks:
 *   - daytime surface: (almost) no hostiles spawn
 *   - night surface: hostiles spawn, on land (y on the grass, never in water)
 *   - switching to day makes spawned hostiles catch fire (BURNING flag)
 * Run: npx vite-node scripts/mob-test.mjs
 */
globalThis.self = globalThis;
const posted = [];
globalThis.postMessage = (m) => posted.push(m);

const { CHUNK_VOLUME, blockIndex, packVoxel } = await import('../src/core/coords.ts');
const { B } = await import('../src/core/blocks.ts');
const { EntityType, AnimFlag } = await import('../src/core/entities.ts');
const { SNAP_STRIDE } = await import('../src/net/messages.ts');

await import('../src/workers/logic.worker.ts');
const send = (m) => globalThis.onmessage({ data: m });

function flatChunk() {
  const d = new Uint16Array(CHUNK_VOLUME);
  for (let y = 0; y < 256; y++)
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        if (y < 40) d[blockIndex(x, y, z)] = packVoxel(B.STONE, 0, 0);
        else if (y === 40) d[blockIndex(x, y, z)] = packVoxel(B.GRASS, 0, 0);
        else d[blockIndex(x, y, z)] = packVoxel(B.AIR, 15, 0); // open sky
      }
  return d;
}

send({ t: 'init', seed: 1 });
for (let cx = -3; cx <= 3; cx++)
  for (let cz = -3; cz <= 3; cz++)
    send({ t: 'chunk', cx, cz, data: flatChunk().buffer.slice(0), blockEntities: [], mobs: [], village: null });

const HOSTILE = new Set([EntityType.ZOMBIE, EntityType.SKELETON, EntityType.CREEPER]);

function snapshotStats() {
  let last = null;
  for (const m of posted) if (m.t === 'snap') last = m;
  if (!last) return { hostiles: 0, burning: 0, inWater: 0, minY: 99, maxY: 0 };
  const buf = new Float32Array(last.buf);
  let hostiles = 0, burning = 0, inWater = 0, minY = 99, maxY = 0;
  for (let i = 0; i < last.count; i++) {
    const o = i * SNAP_STRIDE;
    const type = buf[o + 1];
    if (!HOSTILE.has(type)) continue;
    hostiles++;
    const y = buf[o + 3];
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    if ((buf[o + 9] & AnimFlag.BURNING) !== 0) burning++;
    if (y < 40) inWater++; // below the grass = inside terrain/water (shouldn't happen)
  }
  return { hostiles, burning, inWater, minY, maxY };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Daytime: expect ~no surface hostiles ---
send({ t: 'player', x: 8, y: 42, z: 8, yaw: 0, sneak: false, time: 0.25, health: 20 });
await sleep(2500);
const day = snapshotStats();

// --- Night: expect hostiles to spawn on land ---
for (let i = 0; i < 80; i++) {
  send({ t: 'time', time: 0.75 });
  send({ t: 'player', x: 8, y: 42, z: 8, yaw: 0, sneak: false, time: 0.75, health: 20 });
  await sleep(50);
}
const night = snapshotStats();

// --- Back to day: spawned hostiles should catch fire ---
for (let i = 0; i < 50; i++) {
  send({ t: 'time', time: 0.3 });
  send({ t: 'player', x: 8, y: 42, z: 8, yaw: 0, sneak: false, time: 0.3, health: 20 });
  await sleep(50);
}
const burned = snapshotStats();

console.log('daytime hostiles:', day.hostiles, '(expect low)');
console.log('night hostiles:', night.hostiles, 'minY', night.minY.toFixed(1), 'belowGround', night.inWater);
console.log('after sunrise burning:', burned.burning, '/', burned.hostiles);

const ok =
  day.hostiles <= 2 &&
  night.hostiles >= 3 &&
  night.inWater === 0 &&
  night.minY >= 40 &&
  burned.burning >= 1;
console.log(ok ? '\nMOB SPAWN/BURN OK' : '\nMOB SPAWN/BURN FAIL');
process.exit(ok ? 0 : 1);
