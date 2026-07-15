/**
 * Swept AABB continuous collision engine (Module 4 spec).
 *
 * Entities move with `collideAndSlide`: per iteration we find the earliest
 * time-of-impact against every solid voxel inside the swept broadphase
 * volume, advance to it, cancel the velocity component along the hit normal
 * and continue with the remainder. Because impact time is computed
 * analytically, fast entities can never tunnel through thin walls.
 */
import { blockDef, FULL_BOX, BlockBox } from './blocks';

export interface AABB {
  x: number; // min corner
  y: number;
  z: number;
  w: number; // half-width on x/z handled by caller; here w,h,d are full sizes
  h: number;
  d: number;
}

export interface VoxelSampler {
  /** Returns block id at integer world coords. Out-of-world = solid below 0, air above. */
  getBlockId(x: number, y: number, z: number): number;
}

export interface MoveResult {
  x: number;
  y: number;
  z: number;
  onGround: boolean;
  hitX: boolean;
  hitY: boolean;
  hitZ: boolean;
}

const EPS = 1e-7;
const SKIN = 0.0005;

const FULL_ONLY: readonly BlockBox[] = [FULL_BOX];

/**
 * Collision boxes for a cell in block-local 0..1 coords, or null when the cell
 * is not solid. Ordinary solids collide as the unit cube; RenderType.BOX solids
 * (closed doors, closed trapdoors, piston bodies) collide as their partial
 * cuboids so you can stand in a doorway / under a trapdoor. Reduces exactly to
 * the old unit-cube behavior for every normal block.
 */
function cellBoxes(world: VoxelSampler, x: number, y: number, z: number): readonly BlockBox[] | null {
  if (y < 0) return FULL_ONLY;
  if (y >= 256) return null;
  const def = blockDef(world.getBlockId(x, y, z));
  if (!def.solid) return null;
  return def.boxes && def.boxes.length > 0 ? def.boxes : FULL_ONLY;
}

/**
 * Sweep a moving AABB against one static box spanning [bx0,by0,bz0]..[bx1,by1,bz1]
 * (world coords). Returns entry time in [0,1] and the hit axis, or null.
 */
function sweepBox(
  px: number, py: number, pz: number,
  w: number, h: number, d: number,
  vx: number, vy: number, vz: number,
  bx0: number, by0: number, bz0: number,
  bx1: number, by1: number, bz1: number,
): { t: number; axis: 0 | 1 | 2; sign: number } | null {
  // Entry / exit distances per axis.
  let xEntry: number;
  let xExit: number;
  if (vx > 0) {
    xEntry = bx0 - (px + w);
    xExit = bx1 - px;
  } else {
    xEntry = bx1 - px;
    xExit = bx0 - (px + w);
  }
  let yEntry: number;
  let yExit: number;
  if (vy > 0) {
    yEntry = by0 - (py + h);
    yExit = by1 - py;
  } else {
    yEntry = by1 - py;
    yExit = by0 - (py + h);
  }
  let zEntry: number;
  let zExit: number;
  if (vz > 0) {
    zEntry = bz0 - (pz + d);
    zExit = bz1 - pz;
  } else {
    zEntry = bz1 - pz;
    zExit = bz0 - (pz + d);
  }

  const txEntry = vx === 0 ? -Infinity : xEntry / vx;
  const txExit = vx === 0 ? Infinity : xExit / vx;
  const tyEntry = vy === 0 ? -Infinity : yEntry / vy;
  const tyExit = vy === 0 ? Infinity : yExit / vy;
  const tzEntry = vz === 0 ? -Infinity : zEntry / vz;
  const tzExit = vz === 0 ? Infinity : zExit / vz;

  // Overlap check on axes with no velocity (otherwise -Infinity entry wins incorrectly).
  if (vx === 0 && (px + w <= bx0 + EPS || px >= bx1 - EPS)) return null;
  if (vy === 0 && (py + h <= by0 + EPS || py >= by1 - EPS)) return null;
  if (vz === 0 && (pz + d <= bz0 + EPS || pz >= bz1 - EPS)) return null;

  const entry = Math.max(txEntry, tyEntry, tzEntry);
  const exit = Math.min(txExit, tyExit, tzExit);
  if (entry > exit || entry >= 1 || entry < -EPS) return null;

  let axis: 0 | 1 | 2;
  let sign: number;
  if (txEntry >= tyEntry && txEntry >= tzEntry) {
    axis = 0;
    sign = vx > 0 ? -1 : 1;
  } else if (tyEntry >= tzEntry) {
    axis = 1;
    sign = vy > 0 ? -1 : 1;
  } else {
    axis = 2;
    sign = vz > 0 ? -1 : 1;
  }
  return { t: Math.max(0, entry), axis, sign };
}

/**
 * Move an AABB (origin = min corner) through the voxel world with
 * collide-and-slide. Mutates nothing; returns final position + contact flags.
 */
export function collideAndSlide(
  world: VoxelSampler,
  px: number, py: number, pz: number,
  w: number, h: number, d: number,
  dx: number, dy: number, dz: number,
): MoveResult {
  let x = px;
  let y = py;
  let z = pz;
  let vx = dx;
  let vy = dy;
  let vz = dz;
  let onGround = false;
  let hitX = false;
  let hitY = false;
  let hitZ = false;

  for (let iter = 0; iter < 3; iter++) {
    if (vx === 0 && vy === 0 && vz === 0) break;

    // Broadphase: every voxel the swept volume can touch.
    const minX = Math.floor(Math.min(x, x + vx) - 0.001);
    const maxX = Math.floor(Math.max(x + w, x + w + vx) + 0.001);
    const minY = Math.floor(Math.min(y, y + vy) - 0.001);
    const maxY = Math.floor(Math.max(y + h, y + h + vy) + 0.001);
    const minZ = Math.floor(Math.min(z, z + vz) - 0.001);
    const maxZ = Math.floor(Math.max(z + d, z + d + vz) + 0.001);

    let best: { t: number; axis: 0 | 1 | 2; sign: number } | null = null;
    for (let by = minY; by <= maxY; by++) {
      for (let bz = minZ; bz <= maxZ; bz++) {
        for (let bx = minX; bx <= maxX; bx++) {
          const boxes = cellBoxes(world, bx, by, bz);
          if (!boxes) continue;
          for (const b of boxes) {
            const hit = sweepBox(
              x, y, z, w, h, d, vx, vy, vz,
              bx + b[0], by + b[1], bz + b[2], bx + b[3], by + b[4], bz + b[5],
            );
            if (hit && (!best || hit.t < best.t)) best = hit;
          }
        }
      }
    }

    if (!best) {
      x += vx;
      y += vy;
      z += vz;
      break;
    }

    // Advance to just before impact.
    const t = Math.max(0, best.t - SKIN);
    x += vx * t;
    y += vy * t;
    z += vz * t;
    const remain = 1 - t;
    vx *= remain;
    vy *= remain;
    vz *= remain;

    if (best.axis === 0) {
      vx = 0;
      hitX = true;
    } else if (best.axis === 1) {
      if (best.sign === 1 && dy < 0) onGround = true;
      vy = 0;
      hitY = true;
    } else {
      vz = 0;
      hitZ = true;
    }
  }

  return { x, y, z, onGround, hitX, hitY, hitZ };
}

/** Does the AABB overlap any solid voxel? */
export function boxIntersectsSolid(
  world: VoxelSampler,
  x: number, y: number, z: number,
  w: number, h: number, d: number,
): boolean {
  const minX = Math.floor(x);
  const maxX = Math.floor(x + w - EPS);
  const minY = Math.floor(y);
  const maxY = Math.floor(y + h - EPS);
  const minZ = Math.floor(z);
  const maxZ = Math.floor(z + d - EPS);
  for (let by = minY; by <= maxY; by++) {
    for (let bz = minZ; bz <= maxZ; bz++) {
      for (let bx = minX; bx <= maxX; bx++) {
        const boxes = cellBoxes(world, bx, by, bz);
        if (!boxes) continue;
        for (const b of boxes) {
          if (
            x < bx + b[3] - EPS && x + w > bx + b[0] + EPS &&
            y < by + b[4] - EPS && y + h > by + b[1] + EPS &&
            z < bz + b[5] - EPS && z + d > bz + b[2] + EPS
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/** Is there solid ground within `depth` below the AABB? (sneak edge guard) */
export function hasGroundBelow(
  world: VoxelSampler,
  x: number, y: number, z: number,
  w: number, d: number,
  depth: number,
): boolean {
  return boxIntersectsSolid(world, x, y - depth, z, w, depth, d);
}

/**
 * Full entity step: gravity-integrated move with optional auto step-up and
 * sneak ledge guard. Positions use the entity FEET center convention:
 * box spans [cx-w/2, cx+w/2] x [y, y+h] x [cz-d/2, cz+d/2].
 */
export interface StepOptions {
  stepHeight: number; // auto-step (0.6 player-like)
  sneak: boolean; // clamp axes that would leave a ledge
}

export interface EntityMoveResult {
  cx: number;
  y: number;
  cz: number;
  onGround: boolean;
  hitX: boolean;
  hitY: boolean;
  hitZ: boolean;
}

export function moveEntity(
  world: VoxelSampler,
  cx: number, y: number, cz: number,
  width: number, height: number,
  dx: number, dy: number, dz: number,
  opts: StepOptions,
): EntityMoveResult {
  const w = width;
  const d = width;
  let ox = cx - w / 2;
  let oz = cz - d / 2;

  // Sneak ledge guard: shrink horizontal movement so the box never leaves
  // its supporting block while sneaking on ground (Module 4 spec).
  if (opts.sneak && dy <= 0 && hasGroundBelow(world, ox, y, oz, w, d, 0.05)) {
    const GUARD_DEPTH = 0.6;
    if (dx !== 0 && !hasGroundBelow(world, ox + dx, y, oz, w, d, GUARD_DEPTH)) {
      // Binary search the largest safe dx (5 iterations = 1/32 precision).
      let lo = 0;
      let hi = dx;
      for (let i = 0; i < 5; i++) {
        const mid = (lo + hi) / 2;
        if (hasGroundBelow(world, ox + mid, y, oz, w, d, GUARD_DEPTH)) lo = mid;
        else hi = mid;
      }
      dx = lo;
    }
    if (dz !== 0 && !hasGroundBelow(world, ox + dx, y, oz + dz, w, d, GUARD_DEPTH)) {
      let lo = 0;
      let hi = dz;
      for (let i = 0; i < 5; i++) {
        const mid = (lo + hi) / 2;
        if (hasGroundBelow(world, ox + dx, y, oz + mid, w, d, GUARD_DEPTH)) lo = mid;
        else hi = mid;
      }
      dz = lo;
    }
  }

  let res = collideAndSlide(world, ox, y, oz, w, height, d, dx, dy, dz);

  // Auto step-up: if we hit a wall while on the ground, retry from a raised
  // position and keep the result when it gains more horizontal distance.
  if (opts.stepHeight > 0 && (res.hitX || res.hitZ) && (res.onGround || hasGroundBelow(world, ox, y, oz, w, d, 0.05))) {
    const up = collideAndSlide(world, ox, y, oz, w, height, d, 0, opts.stepHeight, 0);
    const lift = up.y - y;
    if (lift > 0.001) {
      const fwd = collideAndSlide(world, up.x, up.y, up.z, w, height, d, dx, 0, dz);
      const down = collideAndSlide(world, fwd.x, fwd.y, fwd.z, w, height, d, 0, -lift, 0);
      const gainStep = (fwd.x - ox) * (fwd.x - ox) + (fwd.z - oz) * (fwd.z - oz);
      const gainFlat = (res.x - ox) * (res.x - ox) + (res.z - oz) * (res.z - oz);
      if (gainStep > gainFlat + 1e-8) {
        res = {
          x: down.x,
          y: down.y,
          z: down.z,
          onGround: down.onGround || down.hitY,
          hitX: fwd.hitX,
          hitY: res.hitY,
          hitZ: fwd.hitZ,
        };
      }
    }
  }

  ox = res.x;
  oz = res.z;
  return {
    cx: ox + w / 2,
    y: res.y,
    cz: oz + d / 2,
    onGround: res.onGround,
    hitX: res.hitX,
    hitY: res.hitY,
    hitZ: res.hitZ,
  };
}
