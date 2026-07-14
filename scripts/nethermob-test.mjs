/**
 * Nether mob harness (Phase 4): drives the real logic worker in dimension 1.
 *   - piglins stay neutral until one is struck, then the group retaliates
 *   - magma cubes hop (vertical oscillation) and deal contact damage
 *   - nether natives are lava-proof while overworld animals burn
 * Run: npx vite-node scripts/nethermob-test.mjs
 */
globalThis.self = globalThis;
const posted = [];
globalThis.postMessage = (m) => posted.push(m);

const { CHUNK_VOLUME, blockIndex, packVoxel } = await import('../src/core/coords.ts');
const { B } = await import('../src/core/blocks.ts');
const { EntityType } = await import('../src/core/entities.ts');
const { SNAP_STRIDE } = await import('../src/net/messages.ts');

await import('../src/workers/logic.worker.ts');
const send = (m) => globalThis.onmessage({ data: m });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = true;
const check = (cond, label) => {
  console.log((cond ? 'ok  ' : 'FAIL') + ' ' + label);
  if (!cond) ok = false;
};

/** Flat netherrack slab at y=40, dark, with an optional lava pool. */
function netherChunk(lavaPool = false) {
  const d = new Uint16Array(CHUNK_VOLUME);
  for (let y = 0; y < 256; y++)
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        if (y < 40) d[blockIndex(x, y, z)] = packVoxel(B.NETHERRACK, 0, 0);
        else if (y === 40) d[blockIndex(x, y, z)] = packVoxel(B.NETHERRACK, 0, 0);
        else d[blockIndex(x, y, z)] = packVoxel(B.AIR, 0, 0);
      }
  if (lavaPool) {
    // 4x4 lava pool, one block deep, in the chunk center.
    for (let z = 6; z < 10; z++)
      for (let x = 6; x < 10; x++) d[blockIndex(x, 41, z)] = packVoxel(B.LAVA_SRC, 0, 0);
  }
  return d;
}

send({ t: 'init', seed: 42 });
send({ t: 'dim', dim: 1 });

// Home chunk with two piglins near the player.
send({
  t: 'chunk', cx: 0, cz: 0, data: netherChunk().buffer, blockEntities: [],
  mobs: [
    { type: EntityType.PIGLIN, x: 6.5, y: 41, z: 8.5 },
    { type: EntityType.PIGLIN, x: 10.5, y: 41, z: 8.5 },
  ],
  village: null,
});
for (const [cx, cz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
  send({ t: 'chunk', cx, cz, data: netherChunk().buffer, blockEntities: [], mobs: [], village: null });
}

const playerAt = (x, y, z) =>
  send({ t: 'player', x, y, z, yaw: 0, sneak: false, time: 0.3, health: 20 });

function lastSnap() {
  let last = null;
  for (const m of posted) if (m.t === 'snap') last = m;
  if (!last) return [];
  const out = [];
  const buf = new Float32Array(last.buf);
  for (let i = 0; i < last.count; i++) {
    const o = i * SNAP_STRIDE;
    out.push({ id: buf[o], type: buf[o + 1], x: buf[o + 2], y: buf[o + 3], z: buf[o + 4], hp: buf[o + 7], anim: buf[o + 9] });
  }
  return out;
}
const damageCount = () => posted.filter((m) => m.t === 'damage' && m.cause === 'mob').length;

// --- Phase A: peace ---
playerAt(8.5, 41, 8.5);
await sleep(1500);
playerAt(8.5, 41, 8.5);
// Natural nether spawning may add piglins beyond the two scripted ones.
const piglins = lastSnap().filter((e) => e.type === EntityType.PIGLIN && Math.abs(e.x - 8.5) < 6);
check(piglins.length >= 2, 'piglins spawned from the chunk');
check(damageCount() === 0, 'piglins stay neutral around the player');

// --- Phase B: grudge ---
const victim = piglins[0];
send({ t: 'attack', entityId: victim.id, damage: 1, kx: 0, kz: 0 });
const before = damageCount();
for (let i = 0; i < 40; i++) {
  playerAt(8.5, 41, 8.5);
  await sleep(100);
  if (damageCount() > before) break;
}
check(damageCount() > before, 'struck piglin group retaliates (melee lands)');

// --- Phase C: magma cube hops + contact damage ---
send({
  t: 'chunk', cx: 5, cz: 5, data: netherChunk().buffer, blockEntities: [],
  mobs: [{ type: EntityType.MAGMA_CUBE, x: 88.5, y: 41, z: 88.5 }],
  village: null,
});
for (const [cx, cz] of [[4, 5], [6, 5], [5, 4], [5, 6], [4, 4], [6, 6], [4, 6], [6, 4]]) {
  send({ t: 'chunk', cx, cz, data: netherChunk().buffer, blockEntities: [], mobs: [], village: null });
}
const dmgBeforeCube = damageCount();
let minY = 999;
let maxY = 0;
for (let i = 0; i < 45; i++) {
  playerAt(86.5, 41, 88.5);
  await sleep(100);
  const cube = lastSnap().find((e) => e.type === EntityType.MAGMA_CUBE);
  if (cube) {
    minY = Math.min(minY, cube.y);
    maxY = Math.max(maxY, cube.y);
  }
}
check(maxY - minY > 0.5, `magma cube hops (y span ${(maxY - minY).toFixed(2)})`);
check(damageCount() > dmgBeforeCube, 'magma cube lands contact damage');

// --- Phase D: lava immunity ---
send({
  t: 'chunk', cx: 8, cz: 8, data: netherChunk(true).buffer, blockEntities: [],
  mobs: [
    { type: EntityType.PIGLIN, x: 136.5, y: 42, z: 136.5 }, // inside the pool
    { type: EntityType.COW, x: 137.5, y: 42, z: 137.5 }, // poor control subject
  ],
  village: null,
});
playerAt(140.5, 41, 140.5);
await sleep(2400);
playerAt(140.5, 41, 140.5);
const inPool = lastSnap().filter((e) => e.x > 134 && e.x < 140 && e.z > 134 && e.z < 140);
const poolPiglin = inPool.find((e) => e.type === EntityType.PIGLIN);
const poolCow = inPool.find((e) => e.type === EntityType.COW);
check(poolPiglin !== undefined && poolPiglin.hp >= 16, 'piglin shrugs off lava');
check(poolCow === undefined || poolCow.hp < 10, 'overworld animal burns in the same pool');

console.log(ok ? 'NETHERMOB PASS' : 'NETHERMOB FAIL');
process.exit(ok ? 0 : 1);
