/**
 * Dev tool: render an ASCII vertical cross-section of a generated chunk so
 * cave/terrain shape can be inspected and tuned. Run: node scripts/cave-viz.mjs
 */
globalThis.self = globalThis;
const { generateChunk, initGenerator } = await import('../src/workers/gen.worker.ts');
import { blockIndex } from '../src/core/coords.ts';
import { B, isFluid } from '../src/core/blocks.ts';

const seed = Number(process.argv[2] ?? 12345);
const cx = Number(process.argv[3] ?? 0);
const cz = Number(process.argv[4] ?? 0);
const zSlice = Number(process.argv[5] ?? 8);

initGenerator(seed);
const data = new Uint16Array(generateChunk(cx, cz).data);

const glyph = (id) => {
  if (id === B.AIR) return ' ';
  if (id === B.BEDROCK) return '#';
  if (isFluid(id)) return '~';
  if (id === B.WATER_SRC) return '~';
  if (id === B.STONE) return '.';
  if (id === B.DIRT || id === B.GRASS) return ':';
  if (id === B.SAND || id === B.SANDSTONE) return 's';
  return 'o';
};

// Print y from 100 down to 0 (rows), x 0..15 (cols) at z=zSlice.
const yTop = 100;
let airAtLevel = new Array(yTop + 1).fill(0);
let total = 0;
let air = 0;
for (let y = 0; y <= yTop; y++) {
  let row = String(y).padStart(3, ' ') + ' ';
  for (let x = 0; x < 16; x++) {
    const id = data[blockIndex(x, y, zSlice)] & 0xff;
    row += glyph(id);
  }
  console.log(row);
}

// Cave openness metric: fraction of underground stone-region cells that are air.
for (let y = 5; y < 60; y++) {
  for (let z = 0; z < 16; z++) {
    for (let x = 0; x < 16; x++) {
      const id = data[blockIndex(x, y, z)] & 0xff;
      total++;
      if (id === B.AIR) air++;
      void airAtLevel;
    }
  }
}
console.log(`\nUnderground air fraction (y5-60): ${((air / total) * 100).toFixed(1)}%`);
