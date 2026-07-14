/**
 * Bed feature regression harness:
 *   - bed block def + recipe (3 wool over 3 planks) resolve
 *   - beds are stamped into generated villages
 *   - bed is interactive (right-click routes to sleep, not placement)
 * Run: npx vite-node scripts/bed-test.mjs
 */
globalThis.self = globalThis;
globalThis.postMessage = () => {};

const { B, blockDef, isInteractive } = await import('../src/core/blocks.ts');
const { matchRecipe } = await import('../src/core/recipes.ts');
const { voxelId } = await import('../src/core/coords.ts');
const gen = await import('../src/workers/gen.worker.ts');

let ok = true;
const check = (cond, label) => {
  console.log((cond ? 'ok  ' : 'FAIL') + ' ' + label);
  if (!cond) ok = false;
};

check(blockDef(B.BED)?.name === 'Bed', 'bed block registered');
check(isInteractive(B.BED), 'bed is interactive (right-click = sleep)');

// Recipe: top row wool, middle row planks in a 3x3 grid (ids, 0 = empty).
const grid = [
  B.WOOL, B.WOOL, B.WOOL,
  B.OAK_PLANKS, B.OAK_PLANKS, B.OAK_PLANKS,
  0, 0, 0,
];
const result = matchRecipe(grid, 3);
check(result !== null && result.result === B.BED, 'bed recipe matches (3 wool / 3 planks)');

// Villages contain beds.
gen.initGenerator(20260621);
let beds = 0;
const R = 26;
for (let cx = -R; cx <= R; cx++) {
  for (let cz = -R; cz <= R; cz++) {
    const msg = gen.generateChunk(cx, cz);
    const data = new Uint16Array(msg.data);
    for (let i = 0; i < data.length; i++) if (voxelId(data[i]) === B.BED) beds++;
  }
}
console.log('beds stamped in villages:', beds);
check(beds > 0, 'village houses contain beds');

console.log(ok ? 'BED PASS' : 'BED FAIL');
process.exit(ok ? 0 : 1);
