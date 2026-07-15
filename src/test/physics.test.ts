/**
 * Unit tests: swept AABB continuous collision (anti-tunneling), step-up,
 * sneak ledge guard, and the world lighting BFS engine.
 */
import { describe, it, expect } from 'vitest';
import { collideAndSlide, moveEntity, boxIntersectsSolid, VoxelSampler } from '../core/aabb';
import { World } from '../core/world';
import { B } from '../core/blocks';
import { packVoxel, CHUNK_VOLUME, blockIndex, voxelSun, voxelBlockLight } from '../core/coords';

/** Simple test world: y<10 solid stone; optional extra blocks via set. */
function makeSampler(blocks: Map<string, number> = new Map()): VoxelSampler {
  return {
    getBlockId(x, y, z) {
      const k = `${x},${y},${z}`;
      if (blocks.has(k)) return blocks.get(k)!;
      return y < 10 ? B.STONE : B.AIR;
    },
  };
}

describe('swept AABB engine (Module 4)', () => {
  it('lands exactly on the floor without sinking', () => {
    const w = makeSampler();
    const res = collideAndSlide(w, 0.2, 12, 0.2, 0.6, 1.8, 0.6, 0, -5, 0);
    expect(res.onGround).toBe(true);
    expect(res.y).toBeGreaterThanOrEqual(10);
    expect(res.y).toBeLessThan(10.01);
  });

  it('never tunnels through a thin wall at extreme speed', () => {
    const blocks = new Map<string, number>();
    // 1-block-thick wall at x=5, from y=10..13
    for (let y = 10; y <= 13; y++) {
      for (let z = -2; z <= 2; z++) blocks.set(`5,${y},${z}`, B.STONE);
    }
    const w = makeSampler(blocks);
    // 200 blocks/update straight at the wall.
    const res = collideAndSlide(w, 0.2, 10.5, 0.2, 0.6, 1.8, 0.6, 200, 0, 0);
    expect(res.hitX).toBe(true);
    expect(res.x + 0.6).toBeLessThanOrEqual(5.001);
  });

  it('slides along a wall instead of stopping dead', () => {
    const blocks = new Map<string, number>();
    for (let y = 10; y <= 12; y++) {
      for (let z = -4; z <= 4; z++) blocks.set(`3,${y},${z}`, B.STONE);
    }
    const w = makeSampler(blocks);
    const res = collideAndSlide(w, 1.2, 10, 0.2, 0.6, 1.8, 0.6, 5, 0, 2);
    expect(res.hitX).toBe(true);
    // z movement preserved (slide)
    expect(res.z).toBeGreaterThan(1.0);
  });

  it('auto-steps up a half-ish block barrier', () => {
    const blocks = new Map<string, number>();
    for (let z = -2; z <= 2; z++) blocks.set(`3,10,${z}`, B.STONE); // 1-high ledge top at y=11
    const w = makeSampler(blocks);
    const res = moveEntity(w, 2.0, 10, 0.5, 0.6, 1.8, 0.9, -0.1, 0, {
      stepHeight: 1.05,
      sneak: false,
    });
    expect(res.cx).toBeGreaterThan(2.5);
    expect(res.y).toBeCloseTo(11, 1);
  });

  it('a closed door only blocks its thin panel, not the whole cell', () => {
    // Closed door panel at cell (5, 10, 0) occupies z in [0, 0.19].
    const blocks = new Map<string, number>();
    blocks.set('5,10,0', B.DOOR_BOTTOM);
    blocks.set('5,11,0', B.DOOR_TOP);
    const w = makeSampler(blocks);
    // Standing in the open part of the doorway cell (z past the panel): free.
    expect(boxIntersectsSolid(w, 5.2, 10, 0.35, 0.6, 1.8, 0.6)).toBe(false);
    // Overlapping the panel plane: blocked.
    expect(boxIntersectsSolid(w, 5.2, 10, 0.0, 0.6, 1.8, 0.6)).toBe(true);
    // A full stone block still blocks the whole cell (regression guard).
    blocks.set('5,10,0', B.STONE);
    expect(boxIntersectsSolid(w, 5.2, 10, 0.35, 0.6, 1.8, 0.6)).toBe(true);
  });

  it('sneak guard clamps movement at a ledge edge', () => {
    // Platform only under x < 5.
    const sampler: VoxelSampler = {
      getBlockId(x, y) {
        return y < 10 && x < 5 ? B.STONE : B.AIR;
      },
    };
    const res = moveEntity(sampler, 4.5, 10, 0.5, 0.6, 1.8, 3, 0, 0, {
      stepHeight: 0.55,
      sneak: true,
    });
    // Without the guard the center would reach 7.5; clamped near the edge:
    expect(res.cx).toBeLessThan(5.4);
    // and we must still be standing on the platform.
    expect(
      boxIntersectsSolid(sampler, res.cx - 0.3, res.y - 0.1, res.cz - 0.3, 0.6, 0.1, 0.6),
    ).toBe(true);
  });
});

describe('world lighting engine', () => {
  function makeWorld(): World {
    const w = new World();
    const data = new Uint16Array(CHUNK_VOLUME);
    // Stone floor at y=0..9, air with full sun above.
    for (let y = 0; y < 256; y++) {
      for (let z = 0; z < 16; z++) {
        for (let x = 0; x < 16; x++) {
          data[blockIndex(x, y, z)] = y < 10 ? packVoxel(B.STONE, 0, 0) : packVoxel(B.AIR, 15, 0);
        }
      }
    }
    w.addChunk(0, 0, data);
    return w;
  }

  it('torch placement floods blocklight and removal clears it', () => {
    const w = makeWorld();
    w.setBlock(8, 10, 8, B.TORCH);
    expect(voxelBlockLight(w.getVoxel(8, 10, 8))).toBe(14);
    expect(voxelBlockLight(w.getVoxel(10, 10, 8))).toBe(12);
    expect(voxelBlockLight(w.getVoxel(8, 13, 8))).toBe(11);
    w.setBlock(8, 10, 8, B.AIR);
    expect(voxelBlockLight(w.getVoxel(8, 10, 8))).toBe(0);
    expect(voxelBlockLight(w.getVoxel(10, 10, 8))).toBe(0);
  });

  it('opaque block placement shadows the column below and removal restores sun', () => {
    const w = makeWorld();
    w.setBlock(8, 40, 8, B.STONE);
    // Below the block: no direct skylight (only lateral scatter from neighbors).
    expect(voxelSun(w.getVoxel(8, 39, 8))).toBeLessThan(15);
    expect(voxelSun(w.getVoxel(8, 20, 8))).toBeLessThan(15);
    w.setBlock(8, 40, 8, B.AIR);
    expect(voxelSun(w.getVoxel(8, 39, 8))).toBe(15);
    expect(voxelSun(w.getVoxel(8, 20, 8))).toBe(15);
  });

  it('lava emits full blocklight', () => {
    const w = makeWorld();
    w.setBlock(4, 12, 4, B.LAVA_SRC);
    expect(voxelBlockLight(w.getVoxel(4, 12, 4))).toBe(15);
    expect(voxelBlockLight(w.getVoxel(6, 12, 4))).toBe(13);
  });

  it('marks edited chunks dirty for remeshing', () => {
    const w = makeWorld();
    w.dirty.clear();
    w.setBlock(0, 12, 0, B.STONE);
    expect(w.dirty.size).toBeGreaterThan(0);
  });
});
