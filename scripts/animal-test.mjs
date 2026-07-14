/**
 * Farm-animal + breeding harness:
 *   - cows spawned via chunk payload simulate and stay on land
 *   - feeding two cows (interactEntity) makes them court and produce a baby
 *   - the baby carries the BABY anim flag (half-size rendering)
 * Run: npx vite-node scripts/animal-test.mjs
 */
globalThis.self = globalThis;
const posted = [];
globalThis.postMessage = (m) => posted.push(m);

const { CHUNK_VOLUME, blockIndex, packVoxel } = await import('../src/core/coords.ts');
const { B } = await import('../src/core/blocks.ts');
const { EntityType, AnimFlag } = await import('../src/core/entities.ts');
const { ITEM } = await import('../src/core/items.ts');
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
        else d[blockIndex(x, y, z)] = packVoxel(B.AIR, 15, 0);
      }
  return d;
}

send({ t: 'init', seed: 7 });
for (let cx = -1; cx <= 1; cx++)
  for (let cz = -1; cz <= 1; cz++)
    send({
      t: 'chunk', cx, cz, data: flatChunk().buffer.slice(0), blockEntities: [],
      mobs: cx === 0 && cz === 0
        ? [
            { type: EntityType.COW, x: 7.5, y: 41.1, z: 8.5 },
            { type: EntityType.COW, x: 10.5, y: 41.1, z: 8.5 },
          ]
        : [],
      village: null,
    });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cowStats() {
  let last = null;
  for (const m of posted) if (m.t === 'snap') last = m;
  if (!last) return { cows: 0, babies: 0, minY: 99 };
  const buf = new Float32Array(last.buf);
  let cows = 0;
  let babies = 0;
  let minY = 99;
  for (let i = 0; i < last.count; i++) {
    const o = i * SNAP_STRIDE;
    if (buf[o + 1] !== EntityType.COW) continue;
    cows++;
    minY = Math.min(minY, buf[o + 3]);
    if ((buf[o + 9] & AnimFlag.BABY) !== 0) babies++;
  }
  return { cows, babies, minY };
}

send({ t: 'player', x: 9, y: 42, z: 8, yaw: 0, sneak: false, time: 0.25, health: 20 });
await sleep(1200);
const before = cowStats();

// Feed both cows (entity ids 1 and 2 — first spawns).
send({ t: 'interactEntity', entityId: 1, itemId: ITEM.RAW_BEEF });
send({ t: 'interactEntity', entityId: 2, itemId: ITEM.RAW_BEEF });
for (let i = 0; i < 90; i++) {
  send({ t: 'player', x: 9, y: 42, z: 8, yaw: 0, sneak: false, time: 0.25, health: 20 });
  await sleep(50);
}
const after = cowStats();

console.log('cows before feeding:', before.cows, 'minY', before.minY.toFixed(1));
console.log('cows after courting:', after.cows, 'babies:', after.babies);

const ok = before.cows === 2 && before.minY >= 40 && after.cows >= 3 && after.babies >= 1;
console.log(ok ? 'ANIMALS PASS' : 'ANIMALS FAIL');
process.exit(ok ? 0 : 1);
