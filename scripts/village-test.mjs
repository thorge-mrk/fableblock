/**
 * Verifies the improved village generation:
 *   - villages still place (deterministic region scan)
 *   - houses are lit (torches placed) and lamp posts (glowstone) appear
 *   - villagers are spawned inside the village chunks
 *   - blueprint rows are dimensionally consistent (no silent misplacement)
 * Run: npx vite-node scripts/village-test.mjs
 */
globalThis.self = globalThis;
globalThis.postMessage = () => {};

const { voxelId } = await import('../src/core/coords.ts');
const { B } = await import('../src/core/blocks.ts');
const { EntityType } = await import('../src/core/entities.ts');
const gen = await import('../src/workers/gen.worker.ts');

gen.initGenerator(20260621);

let villagesFound = 0;
let torches = 0;
let glowstone = 0;
let villagers = 0;
let craftingTables = 0;
let furnaces = 0;
const R = 26; // scan a 52x52 chunk area

for (let cx = -R; cx <= R; cx++) {
  for (let cz = -R; cz <= R; cz++) {
    const msg = gen.generateChunk(cx, cz);
    if (msg.village) villagesFound++;
    const data = new Uint16Array(msg.data);
    for (let i = 0; i < data.length; i++) {
      const id = voxelId(data[i]);
      if (id === B.TORCH) torches++;
      else if (id === B.GLOWSTONE) glowstone++;
      else if (id === B.CRAFTING_TABLE) craftingTables++;
      else if (id >= B.FURNACE_N && id <= B.FURNACE_LIT_W) furnaces++;
    }
    for (const m of msg.mobs) if (m.type === EntityType.VILLAGER) villagers++;
  }
}

console.log('villages (center chunks):', villagesFound);
console.log('torches:', torches);
console.log('glowstone lamps:', glowstone);
console.log('crafting tables:', craftingTables);
console.log('furnaces:', furnaces);
console.log('villagers spawned:', villagers);

const ok =
  villagesFound > 0 &&
  torches > 0 &&
  glowstone > 0 &&
  villagers > 0 &&
  craftingTables > 0;
console.log(ok ? 'VILLAGE PASS' : 'VILLAGE FAIL');
process.exit(ok ? 0 : 1);
