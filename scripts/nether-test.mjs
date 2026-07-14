/**
 * Nether dimension regression harness (Phase 4):
 *   - nether chunks: bedrock floor AND ceiling, netherrack body, lava ocean,
 *     glowstone present, zero overworld grass, deterministic per seed
 *   - portal ignition: valid 4x5 obsidian frame fills with portal blocks,
 *     broken frames refuse
 *   - return portal stamping produces a lit frame + standing room
 *   - flint & steel recipe resolves
 * Run: npx vite-node scripts/nether-test.mjs
 */
globalThis.self = globalThis;
globalThis.postMessage = () => {};

const { B } = await import('../src/core/blocks.ts');
const { ITEM } = await import('../src/core/items.ts');
const { matchRecipe } = await import('../src/core/recipes.ts');
const { World } = await import('../src/core/world.ts');
const { CHUNK_VOLUME, blockIndex, packVoxel } = await import('../src/core/coords.ts');
const { ignitePortal, findPortalNear, buildReturnPortal } = await import('../src/core/portal.ts');
const gen = await import('../src/workers/gen.worker.ts');

let ok = true;
const check = (cond, label) => {
  console.log((cond ? 'ok  ' : 'FAIL') + ' ' + label);
  if (!cond) ok = false;
};

// --- Nether generation ---
gen.initGenerator(1234);
const counts = new Map();
for (const [cx, cz] of [[0, 0], [3, -2], [-5, 7]]) {
  const chunk = new Uint16Array(gen.generateNetherChunk(cx, cz).data);
  for (let i = 0; i < CHUNK_VOLUME; i++) {
    const id = chunk[i] & 0xff;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
}
check((counts.get(B.NETHERRACK) ?? 0) > 30000, 'netherrack body present');
check((counts.get(B.LAVA_SRC) ?? 0) > 500, 'lava ocean fills the deep caverns');
check((counts.get(B.GLOWSTONE) ?? 0) > 5, 'glowstone buds under the ceiling');
check((counts.get(B.SOUL_SAND) ?? 0) > 20, 'soul sand shores');
check((counts.get(B.GRASS) ?? 0) === 0, 'no overworld grass leaks in');

const a = new Uint16Array(gen.generateNetherChunk(2, 2).data);
{
  let floorOk = true;
  let ceilOk = true;
  for (let z = 0; z < 16; z++) {
    for (let x = 0; x < 16; x++) {
      if ((a[blockIndex(x, 0, z)] & 0xff) !== B.BEDROCK) floorOk = false;
      if ((a[blockIndex(x, 127, z)] & 0xff) !== B.BEDROCK) ceilOk = false;
    }
  }
  check(floorOk, 'bedrock floor at y=0');
  check(ceilOk, 'bedrock ceiling at y=127');
}
const b = new Uint16Array(gen.generateNetherChunk(2, 2).data);
check(a.every((v, i) => v === b[i]), 'nether generation is deterministic');

// --- Portal ignition ---
const world = new World();
world.addChunk(0, 0, new Uint16Array(CHUNK_VOLUME));
world.addChunk(0, -1, new Uint16Array(CHUNK_VOLUME));
world.addChunk(-1, 0, new Uint16Array(CHUNK_VOLUME));
world.addChunk(-1, -1, new Uint16Array(CHUNK_VOLUME));
const set = (x, y, z, id) => world.setRaw(x, y, z, packVoxel(id, 0, 0));

// Classic 4x5 frame in the X plane at z=4: interior x 3..4, y 11..13.
for (let i = 0; i < 4; i++) {
  set(2 + i, 10, 4, B.OBSIDIAN);
  set(2 + i, 14, 4, B.OBSIDIAN);
}
for (let j = 1; j < 4; j++) {
  set(2, 10 + j, 4, B.OBSIDIAN);
  set(5, 10 + j, 4, B.OBSIDIAN);
}
check(ignitePortal(world, 3, 11, 4, set), 'valid frame ignites');
check(world.getBlockId(3, 11, 4) === B.NETHER_PORTAL, 'interior filled with portal');
check(world.getBlockId(4, 13, 4) === B.NETHER_PORTAL, 'top corner filled');
check(findPortalNear(world, 3, 11, 4, 8) !== null, 'findPortalNear locates it');

// Broken frame (missing one ring block) refuses.
for (let i = 0; i < 4; i++) {
  set(8 + i, 10, 8, B.OBSIDIAN);
  set(8 + i, 14, 8, B.OBSIDIAN);
}
for (let j = 1; j < 4; j++) set(8, 10 + j, 8, B.OBSIDIAN);
// right side ring left open
check(!ignitePortal(world, 9, 11, 8, set), 'broken frame refuses to ignite');

// --- Return portal stamping ---
buildReturnPortal(world, 10, 20, 12, set);
check(world.getBlockId(11, 21, 12) === B.NETHER_PORTAL, 'return portal is lit');
check(world.getBlockId(10, 20, 12) === B.OBSIDIAN, 'return frame is obsidian');
check(world.getBlockId(11, 20, 14) === B.AIR, 'standing pocket cleared');

// --- Flint & steel ---
check(
  matchRecipe([ITEM.IRON_INGOT, ITEM.FLINT, 0, 0], 2)?.result === ITEM.FLINT_AND_STEEL,
  'flint & steel recipe resolves',
);

console.log(ok ? 'NETHER PASS' : 'NETHER FAIL');
process.exit(ok ? 0 : 1);
