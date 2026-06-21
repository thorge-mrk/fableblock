/**
 * Verifies client-side boat physics (PlayerController.inBoat):
 *   - a boat dropped above water floats UP to rest at the water surface
 *   - paddling forward glides the boat across the water (momentum)
 *   - the boat does not sink to the bottom or fly off
 * Run: npx vite-node scripts/boat-test.mjs
 */
globalThis.self = globalThis;

const { World } = await import('../src/core/world.ts');
const { CHUNK_VOLUME, blockIndex, packVoxel } = await import('../src/core/coords.ts');
const { B } = await import('../src/core/blocks.ts');
const { PlayerController } = await import('../src/engine/Player.ts');

const WATER_TOP = 40; // water fills y=38..40, air above
const world = new World();
function chunk() {
  const d = new Uint16Array(CHUNK_VOLUME);
  for (let y = 0; y <= WATER_TOP; y++)
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        if (y < 38) d[blockIndex(x, y, z)] = packVoxel(B.STONE, 0, 0);
        else d[blockIndex(x, y, z)] = packVoxel(B.WATER_SRC, 13, 0);
      }
  // open lit sky above
  for (let y = WATER_TOP + 1; y < 60; y++)
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) d[blockIndex(x, y, z)] = packVoxel(B.AIR, 15, 0);
  return d;
}
for (let cx = -4; cx <= 4; cx++) for (let cz = -4; cz <= 4; cz++) world.addChunk(cx, cz, chunk());

const p = new PlayerController();
p.inBoat = true;
p.teleport(8.5, 45, 8.5); // dropped above the water
p.yaw = 0; // forward = -Z

const inp = { moveX: 0, moveZ: 1, jump: false, sneak: false, sprint: false, lookDX: 0, lookDY: 0 };
const dt = 1 / 60;
const startZ = p.z;
let minY = Infinity;
let maxY = -Infinity;
for (let i = 0; i < 360; i++) {
  p.update(dt, world, inp);
  if (i > 120) { // after it has settled
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
}
const surface = WATER_TOP + 0.875; // ~40.875
const traveled = Math.abs(p.z - startZ);

console.log('final pos y:', p.y.toFixed(2), 'z:', p.z.toFixed(2));
console.log('settled y range:', minY.toFixed(2), '..', maxY.toFixed(2), '(surface ~', surface.toFixed(2), ')');
console.log('distance paddled:', traveled.toFixed(2), 'blocks');

const floats = minY > WATER_TOP - 0.6 && maxY < surface + 0.6; // near the surface, not sunk/flying
const glides = traveled > 4; // boat moved forward
const ok = floats && glides && Number.isFinite(p.y);
console.log(ok ? 'BOAT PASS' : 'BOAT FAIL');
process.exit(ok ? 0 : 1);
