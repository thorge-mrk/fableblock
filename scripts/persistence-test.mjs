/**
 * Persistence regression harness (no DOM/IndexedDB needed):
 *   - block-index journal encoding round-trips (idx <-> x/y/z)
 *   - a journal replayed onto a regenerated chunk reproduces the edits
 *   - onBlockChanged fires once per real ID change, not for light rewrites
 * Run: npx vite-node scripts/persistence-test.mjs
 */
globalThis.self = globalThis;
globalThis.postMessage = () => {};

const { World } = await import('../src/core/world.ts');
const { blockIndex, chunkKeyNum } = await import('../src/core/coords.ts');
const { B } = await import('../src/core/blocks.ts');
const gen = await import('../src/workers/gen.worker.ts');

let ok = true;
const check = (cond, label) => {
  console.log((cond ? 'ok  ' : 'FAIL') + ' ' + label);
  if (!cond) ok = false;
};

// 1) Index encoding round-trip (must match replayEdits() in Game.ts).
let encOk = true;
for (const [x, y, z] of [[0, 0, 0], [15, 255, 15], [7, 64, 9], [3, 128, 12]]) {
  const idx = blockIndex(x, y, z);
  const rx = idx & 15;
  const rz = (idx >> 4) & 15;
  const ry = idx >> 8;
  if (rx !== x || ry !== y || rz !== z) encOk = false;
}
check(encOk, 'blockIndex round-trips through the journal encoding');

// 2) Deterministic regeneration + journal replay.
gen.initGenerator(424242);
const chunkA = new Uint16Array(gen.generateChunk(3, -2).data);
gen.initGenerator(424242);
const chunkB = new Uint16Array(gen.generateChunk(3, -2).data);
check(chunkA.every((v, i) => v === chunkB[i]), 'same seed regenerates identical chunk');

const world = new World();
world.addChunk(3, -2, chunkB);

// Record edits via onBlockChanged like Game does.
const journal = new Map();
let fires = 0;
world.onBlockChanged = (x, y, z, id) => {
  fires++;
  const ck = chunkKeyNum(x >> 4, z >> 4);
  let m = journal.get(ck);
  if (!m) journal.set(ck, (m = new Map()));
  m.set(blockIndex(x & 15, y, z & 15), id);
};
world.setBlock(3 * 16 + 4, 80, -2 * 16 + 4, B.GLOWSTONE); // light-heavy edit
world.setBlock(3 * 16 + 5, 80, -2 * 16 + 4, B.COBBLESTONE);
world.setBlock(3 * 16 + 5, 80, -2 * 16 + 4, B.COBBLESTONE); // no-op (same id)
check(fires === 2, `onBlockChanged fired per ID change only (got ${fires})`);

// 3) Replay onto a fresh copy reproduces the edits.
gen.initGenerator(424242);
const fresh = new World();
fresh.addChunk(3, -2, new Uint16Array(gen.generateChunk(3, -2).data));
const m = journal.get(chunkKeyNum(3, -2));
check(m && m.size === 2, 'journal holds 2 edits for the chunk');
for (const [idx, id] of m) {
  const x = 3 * 16 + (idx & 15);
  const z = -2 * 16 + ((idx >> 4) & 15);
  const y = idx >> 8;
  fresh.setBlock(x, y, z, id);
}
check(
  fresh.getBlockId(3 * 16 + 4, 80, -2 * 16 + 4) === B.GLOWSTONE &&
    fresh.getBlockId(3 * 16 + 5, 80, -2 * 16 + 4) === B.COBBLESTONE,
  'replayed journal reproduces the edited blocks',
);

console.log(ok ? 'PERSISTENCE PASS' : 'PERSISTENCE FAIL');
process.exit(ok ? 0 : 1);
