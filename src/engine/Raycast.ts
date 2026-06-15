/**
 * Amanatides & Woo voxel DDA raycast used for block picking (mining,
 * placement, mob line-of-sight on the main thread).
 */
import { World } from '../core/world';
import { blockDef, isFluid } from '../core/blocks';

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
      return { x, y, z, nx, ny, nz, dist: t, id };
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
