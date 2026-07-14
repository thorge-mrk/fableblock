/**
 * Amanatides & Woo voxel DDA raycast used for block picking (mining,
 * placement, mob line-of-sight on the main thread). Blocks with a partial
 * selection hitbox (flowers, torches, doors, plates, wire…) are tested
 * against their actual sub-box; a miss lets the ray keep travelling.
 */
import { World } from '../core/world';
import { blockDef, isFluid, hitBox, FULL_BOX } from '../core/blocks';

export interface RayHit {
  x: number;
  y: number;
  z: number;
  /** Face normal of the hit (placement direction). */
  nx: number;
  ny: number;
  nz: number;
  dist: number;
  id: number;
}

/**
 * Ray vs AABB slab test. Returns the entry distance + entry-face normal,
 * or null on a miss. `inside` marks rays starting within the box.
 */
function rayBox(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  x0: number, y0: number, z0: number,
  x1: number, y1: number, z1: number,
): { t: number; nx: number; ny: number; nz: number; inside: boolean } | null {
  let tMin = -Infinity;
  let tMax = Infinity;
  let nx = 0;
  let ny = 0;
  let nz = 0;
  const axes: Array<[number, number, number, number, number]> = [
    [ox, dx, x0, x1, 1],
    [oy, dy, y0, y1, 2],
    [oz, dz, z0, z1, 3],
  ];
  for (const [o, d, lo, hi, axis] of axes) {
    if (Math.abs(d) < 1e-9) {
      if (o < lo || o > hi) return null;
      continue;
    }
    let t0 = (lo - o) / d;
    let t1 = (hi - o) / d;
    if (t0 > t1) {
      const tmp = t0;
      t0 = t1;
      t1 = tmp;
    }
    // You always enter a slab travelling against its outward normal.
    const sign = -Math.sign(d);
    if (t0 > tMin) {
      tMin = t0;
      nx = axis === 1 ? sign : 0;
      ny = axis === 2 ? sign : 0;
      nz = axis === 3 ? sign : 0;
    }
    tMax = Math.min(tMax, t1);
    if (tMin > tMax) return null;
  }
  if (tMax < 0) return null; // box entirely behind the ray
  if (tMin < 0) return { t: 0, nx, ny, nz, inside: true };
  return { t: tMin, nx, ny, nz, inside: false };
}

export function raycastBlocks(
  world: World,
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  maxDist: number,
  includeFluids = false,
): RayHit | null {
  const len = Math.hypot(dx, dy, dz);
  if (len === 0) return null;
  dx /= len;
  dy /= len;
  dz /= len;

  let x = Math.floor(ox);
  let y = Math.floor(oy);
  let z = Math.floor(oz);

  const stepX = dx > 0 ? 1 : -1;
  const stepY = dy > 0 ? 1 : -1;
  const stepZ = dz > 0 ? 1 : -1;

  const tDeltaX = dx !== 0 ? Math.abs(1 / dx) : Infinity;
  const tDeltaY = dy !== 0 ? Math.abs(1 / dy) : Infinity;
  const tDeltaZ = dz !== 0 ? Math.abs(1 / dz) : Infinity;

  let tMaxX = dx !== 0 ? (dx > 0 ? (x + 1 - ox) : (ox - x)) * tDeltaX : Infinity;
  let tMaxY = dy !== 0 ? (dy > 0 ? (y + 1 - oy) : (oy - y)) * tDeltaY : Infinity;
  let tMaxZ = dz !== 0 ? (dz > 0 ? (z + 1 - oz) : (oz - z)) * tDeltaZ : Infinity;

  let nx = 0;
  let ny = 0;
  let nz = 0;
  let t = 0;

  for (let i = 0; i < 256; i++) {
    if (t > maxDist) return null;
    const id = world.getBlockId(x, y, z);
    const fluid = isFluid(id);
    const hittable =
      id !== 0 && t > 0 && (fluid ? includeFluids : blockDef(id).hardness >= 0);
    if (hittable) {
      const box = fluid ? FULL_BOX : hitBox(id);
      if (box === FULL_BOX) {
        return { x, y, z, nx, ny, nz, dist: t, id };
      }
      // Slab test against the sub-box in world space.
      const sub = rayBox(
        ox, oy, oz, dx, dy, dz,
        x + box[0], y + box[1], z + box[2],
        x + box[3], y + box[4], z + box[5],
      );
      if (sub && sub.t <= maxDist) {
        return {
          x, y, z,
          // Ray started inside the box: fall back to the cell-entry normal.
          nx: sub.inside ? nx : sub.nx,
          ny: sub.inside ? ny : sub.ny,
          nz: sub.inside ? nz : sub.nz,
          dist: sub.t,
          id,
        };
      }
      // Missed the small box — the ray continues through this cell.
    }
    if (tMaxX < tMaxY && tMaxX < tMaxZ) {
      t = tMaxX;
      tMaxX += tDeltaX;
      x += stepX;
      nx = -stepX; ny = 0; nz = 0;
    } else if (tMaxY < tMaxZ) {
      t = tMaxY;
      tMaxY += tDeltaY;
      y += stepY;
      nx = 0; ny = -stepY; nz = 0;
    } else {
      t = tMaxZ;
      tMaxZ += tDeltaZ;
      z += stepZ;
      nx = 0; ny = 0; nz = -stepZ;
    }
  }
  return null;
}
