/**
 * Nether portal mechanics (Phase 4): frame validation + ignition, locating
 * existing portals and stamping a return portal at the arrival point.
 * Pure world-in/blocks-out functions so the vite-node harness can drive them.
 */
import { World } from './world';
import { B, blockDef } from './blocks';

export type SetBlock = (x: number, y: number, z: number, id: number) => void;

/** Interior size limits (classic 4x5 outer frame = 2x3 interior). */
const MIN_W = 1;
const MAX_W = 3;
const MIN_H = 2;
const MAX_H = 4;

/**
 * Try to ignite a portal from an interior air cell (the cell in front of the
 * clicked obsidian face). Checks both vertical plane orientations; on a valid
 * obsidian ring the interior fills with portal blocks.
 */
export function ignitePortal(world: World, x: number, y: number, z: number, setBlock: SetBlock): boolean {
  for (const axis of ['x', 'z'] as const) {
    const cells = collectInterior(world, x, y, z, axis);
    if (cells) {
      for (const [cx, cy, cz] of cells) setBlock(cx, cy, cz, B.NETHER_PORTAL);
      return true;
    }
  }
  return false;
}

/**
 * Flood the in-plane air pocket around the start cell and validate it as a
 * rectangle fully ringed by obsidian. Returns the interior cells or null.
 */
function collectInterior(
  world: World,
  sx: number, sy: number, sz: number,
  axis: 'x' | 'z',
): Array<[number, number, number]> | null {
  if (world.getBlockId(sx, sy, sz) !== B.AIR) return null;
  const seen = new Set<string>();
  const cells: Array<[number, number, number]> = [];
  const queue: Array<[number, number, number]> = [[sx, sy, sz]];
  seen.add(sx + ',' + sy + ',' + sz);
  // In-plane steps: vertical always; horizontal along the chosen axis.
  const steps: Array<[number, number, number]> = axis === 'x'
    ? [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]]
    : [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0]];
  let head = 0;
  while (head < queue.length) {
    if (queue.length > MAX_W * MAX_H + 2) return null; // pocket too large
    const [x, y, z] = queue[head++];
    cells.push([x, y, z]);
    for (const [dx, dy, dz] of steps) {
      const nx = x + dx;
      const ny = y + dy;
      const nz = z + dz;
      const k = nx + ',' + ny + ',' + nz;
      if (seen.has(k)) continue;
      const id = world.getBlockId(nx, ny, nz);
      if (id === B.AIR) {
        seen.add(k);
        queue.push([nx, ny, nz]);
      } else if (id !== B.OBSIDIAN) {
        return null; // pocket touches a non-obsidian block
      }
    }
  }
  // Rectangularity + size check.
  let minH = Infinity;
  let maxH = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y, z] of cells) {
    const h = axis === 'x' ? x : z;
    if (h < minH) minH = h;
    if (h > maxH) maxH = h;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const w = maxH - minH + 1;
  const hgt = maxY - minY + 1;
  if (w < MIN_W || w > MAX_W || hgt < MIN_H || hgt > MAX_H) return null;
  if (cells.length !== w * hgt) return null; // not a filled rectangle
  return cells;
}

/** Nearest portal block within `r` of (x, z), or null. */
export function findPortalNear(world: World, x: number, y: number, z: number, r: number): [number, number, number] | null {
  let best: [number, number, number] | null = null;
  let bestD = Infinity;
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  for (let dx = -r; dx <= r; dx++) {
    for (let dz = -r; dz <= r; dz++) {
      for (let yy = Math.max(1, Math.floor(y) - 24); yy < Math.min(126, Math.floor(y) + 24); yy++) {
        if (world.getBlockId(x0 + dx, yy, z0 + dz) !== B.NETHER_PORTAL) continue;
        const d = dx * dx + dz * dz + (yy - y) * (yy - y) * 0.25;
        if (d < bestD) {
          bestD = d;
          best = [x0 + dx, yy, z0 + dz];
        }
      }
    }
  }
  return best;
}

/**
 * Stamp a ready-lit 4x5 return portal (X-plane) with a small obsidian
 * platform and a cleared pocket in front. `px, py, pz` = platform corner;
 * the safe standing spot is directly south (+Z) of the frame.
 */
export function buildReturnPortal(world: World, px: number, py: number, pz: number, setBlock: SetBlock): void {
  // Frame ring (4 wide, 5 tall) in the X/Y plane at z = pz.
  for (let i = 0; i < 4; i++) {
    setBlock(px + i, py, pz, B.OBSIDIAN);
    setBlock(px + i, py + 4, pz, B.OBSIDIAN);
  }
  for (let j = 1; j < 4; j++) {
    setBlock(px, py + j, pz, B.OBSIDIAN);
    setBlock(px + 3, py + j, pz, B.OBSIDIAN);
  }
  // Interior portal fill.
  for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= 3; j++) {
      setBlock(px + i, py + j, pz, B.NETHER_PORTAL);
    }
  }
  // Standing platform + air pocket in front (+Z side).
  for (let i = -1; i <= 4; i++) {
    for (let k = 1; k <= 3; k++) {
      const ground = world.getBlockId(px + i, py - 1, pz + k);
      if (!blockDef(ground).solid) setBlock(px + i, py - 1, pz + k, B.OBSIDIAN);
      for (let j = 0; j < 4; j++) {
        if (world.getBlockId(px + i, py + j, pz + k) !== B.AIR) setBlock(px + i, py + j, pz + k, B.AIR);
      }
    }
  }
}
