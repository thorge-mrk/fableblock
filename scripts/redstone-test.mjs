/**
 * Redstone-lite regression harness (Phase 4):
 *   - lever -> 5-wire run -> lamp turns ON within one settle, OFF on toggle
 *   - 15-block wire decay limit
 *   - pressure-plate id powers the same circuit as a lever
 *   - piston extends (pushes 2 blocks), retracts, refuses 9-block columns
 * Run: npx vite-node scripts/redstone-test.mjs
 */
globalThis.self = globalThis;
globalThis.postMessage = () => {};

const { B } = await import('../src/core/blocks.ts');
const { World } = await import('../src/core/world.ts');
const { CHUNK_VOLUME, packVoxel } = await import('../src/core/coords.ts');
const { runRedstone } = await import('../src/core/redstone.ts');

let ok = true;
const check = (cond, label) => {
  console.log((cond ? 'ok  ' : 'FAIL') + ' ' + label);
  if (!cond) ok = false;
};

const world = new World();
for (let cx = -1; cx <= 2; cx++) {
  for (let cz = -1; cz <= 1; cz++) {
    const data = new Uint16Array(CHUNK_VOLUME);
    for (let i = 0; i < 256; i++) data[(9 << 8) + i] = packVoxel(B.STONE, 0, 0);
    world.addChunk(cx, cz, data);
  }
}
const set = (x, y, z, id) => world.setRaw(x, y, z, packVoxel(id, 0, 0));
const prev = new Map();
const settle = (dirty) => {
  let batch = dirty;
  for (let pass = 0; pass < 6 && batch.length > 0; pass++) {
    const next = [];
    runRedstone(world, batch, (x, y, z, id) => {
      set(x, y, z, id);
      next.push([x, y, z]);
    }, prev);
    batch = next;
  }
};

// --- Lever -> wire -> lamp ---
set(0, 10, 0, B.LEVER_ON);
for (let i = 1; i <= 5; i++) set(i, 10, 0, B.REDSTONE_WIRE);
set(6, 10, 0, B.REDSTONE_LAMP);
settle([[0, 10, 0]]);
check(world.getBlockId(3, 10, 0) === B.REDSTONE_WIRE_ON, 'wire carries power');
check(world.getBlockId(6, 10, 0) === B.REDSTONE_LAMP_ON, 'lamp turns on via 5-wire run');

set(0, 10, 0, B.LEVER);
settle([[0, 10, 0]]);
check(world.getBlockId(6, 10, 0) === B.REDSTONE_LAMP, 'lamp turns off when lever flips');
check(world.getBlockId(3, 10, 0) === B.REDSTONE_WIRE, 'wire de-powers');

// --- Decay limit ---
set(0, 12, 5, B.REDSTONE_BLOCK);
for (let i = 1; i <= 18; i++) set(i, 12, 5, B.REDSTONE_WIRE);
settle([[0, 12, 5]]);
check(world.getBlockId(15, 12, 5) === B.REDSTONE_WIRE_ON, 'wire #15 still powered');
check(world.getBlockId(16, 12, 5) === B.REDSTONE_WIRE, 'wire #16 beyond the 15-range');

// --- Pressure plate as source ---
set(0, 14, 8, B.PRESSURE_PLATE_ON);
set(1, 14, 8, B.REDSTONE_WIRE);
set(2, 14, 8, B.REDSTONE_LAMP);
settle([[0, 14, 8]]);
check(world.getBlockId(2, 14, 8) === B.REDSTONE_LAMP_ON, 'pressure plate powers a lamp');

// --- Piston push / retract ---
set(10, 10, 8, B.LEVER);
set(11, 10, 8, B.REDSTONE_WIRE);
set(12, 10, 8, B.PISTON_E);
set(13, 10, 8, B.STONE);
set(14, 10, 8, B.SAND);
settle([[10, 10, 8]]);
set(10, 10, 8, B.LEVER_ON);
settle([[10, 10, 8]]);
check(world.getBlockId(12, 10, 8) === B.PISTON_EXT_E, 'piston base extends');
check(world.getBlockId(13, 10, 8) === B.PISTON_HEAD_E, 'piston head appears');
check(
  world.getBlockId(14, 10, 8) === B.STONE && world.getBlockId(15, 10, 8) === B.SAND,
  'two-block column pushed forward',
);
set(10, 10, 8, B.LEVER);
settle([[10, 10, 8]]);
check(world.getBlockId(12, 10, 8) === B.PISTON_E, 'piston retracts');
check(world.getBlockId(13, 10, 8) === B.AIR, 'head removed on retract');

// --- Push limit ---
set(10, 10, 12, B.PISTON_E);
for (let i = 0; i < 9; i++) set(11 + i, 10, 12, B.STONE);
set(9, 10, 12, B.REDSTONE_BLOCK);
settle([[9, 10, 12]]);
check(world.getBlockId(10, 10, 12) === B.PISTON_E, '9-block column refuses to move');

console.log(ok ? 'REDSTONE PASS' : 'REDSTONE FAIL');
process.exit(ok ? 0 : 1);
