/**
 * Integration harness for the 20 TPS logic worker's water physics.
 * Shims `self`, drives the worker with init + a chunk + a "place water" patch,
 * lets its real-time tick loop run, and reconstructs the resulting fluid cells
 * from the block-edit messages it posts back.  Run: npx vite-node scripts/fluid-test.mjs
 */
globalThis.self = globalThis;
const posted = [];
globalThis.postMessage = (msg) => posted.push(msg);

const { CHUNK_VOLUME, blockIndex, packVoxel, voxelId } = await import('../src/core/coords.ts');
const { B, isWater, fluidLevel } = await import('../src/core/blocks.ts');

await import('../src/workers/logic.worker.ts'); // sets globalThis.onmessage
const send = (m) => globalThis.onmessage({ data: m });

// Build a chunk: stone floor y<=40, air above. No water yet.
const data = new Uint16Array(CHUNK_VOLUME);
for (let y = 0; y <= 40; y++)
  for (let z = 0; z < 16; z++)
    for (let x = 0; x < 16; x++) data[blockIndex(x, y, z)] = packVoxel(B.STONE, 0, 0);

send({ t: 'init', seed: 1 });
send({ t: 'chunk', cx: 0, cz: 0, data: data.buffer.slice(0), blockEntities: [], mobs: [], village: null });
send({ t: 'player', x: 8, y: 50, z: 8, yaw: 0, sneak: false, time: 0.3, health: 20 });

// Place a water source at (8,45,8) via a patch (as breaking/placing would).
const patch = new Int32Array([8, 45, 8, packVoxel(B.WATER_SRC, 0, 0)]);
send({ t: 'patch', cells: patch.buffer });

// Let the worker's real tick loop run for ~3.5s (water ticks every 5 game ticks).
await new Promise((r) => setTimeout(r, 3500));

// Reconstruct fluid cells from all posted 'blocks' messages.
const cells = new Map();
for (const m of posted) {
  if (m.t !== 'blocks') continue;
  const arr = new Int32Array(m.cells);
  for (let i = 0; i < arr.length; i += 4) cells.set(`${arr[i]},${arr[i + 1]},${arr[i + 2]}`, arr[i + 3]);
}

let waterCells = 0;
let maxFall = 0;
let spread = 0;
for (const [key, id] of cells) {
  if (!isWater(voxelId(id))) continue;
  waterCells++;
  const [x, y, z] = key.split(',').map(Number);
  if (y < 45) maxFall = Math.max(maxFall, 45 - y);
  if (y === 41) spread = Math.max(spread, Math.abs(x - 8) + Math.abs(z - 8)); // on the floor
}

console.log('blocks messages posted:', posted.filter((m) => m.t === 'blocks').length);
console.log('distinct water cells created:', waterCells);
console.log('max fall distance below source:', maxFall, '(expected ~4 to the floor)');
console.log('max horizontal spread on floor:', spread, '(expected >=1 if it pools)');
const ok = waterCells >= 4 && maxFall >= 3 && spread >= 1;
console.log(ok ? '\nWATER PHYSICS OK — water falls and spreads.' : '\nWATER PHYSICS FAIL');
process.exit(ok ? 0 : 1);
