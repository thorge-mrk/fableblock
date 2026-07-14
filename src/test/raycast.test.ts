/**
 * Per-block selection hitbox tests: flowers/torches only catch the ray
 * inside their small box, partial blocks (doors, plates) match their
 * panels, and misses let the ray continue to blocks behind.
 */
import { describe, it, expect } from 'vitest';
import { World } from '../core/world';
import { B, hitBox, FULL_BOX } from '../core/blocks';
import { CHUNK_VOLUME, packVoxel } from '../core/coords';
import { raycastBlocks } from '../engine/Raycast';

function makeWorld(): World {
  const w = new World();
  for (let cx = -1; cx <= 1; cx++) {
    for (let cz = -1; cz <= 1; cz++) {
      w.addChunk(cx, cz, new Uint16Array(CHUNK_VOLUME));
    }
  }
  return w;
}
const set = (w: World, x: number, y: number, z: number, id: number) =>
  w.setRaw(x, y, z, packVoxel(id, 0, 0));

describe('per-block selection hitboxes', () => {
  it('classifies boxes: stone full, flower small, door panel thin', () => {
    expect(hitBox(B.STONE)).toBe(FULL_BOX);
    const flower = hitBox(B.FLOWER_RED);
    expect(flower[3] - flower[0]).toBeLessThan(0.6);
    expect(flower[4]).toBeLessThan(0.7);
    const door = hitBox(B.DOOR_BOTTOM);
    expect(door[5]).toBeCloseTo(0.19, 5);
    // Piston head envelope spans the whole cell along its axis.
    const head = hitBox(B.PISTON_HEAD_N);
    expect(head[5] - head[2]).toBeCloseTo(1, 5);
  });

  it('hits a flower only through its small box', () => {
    const w = makeWorld();
    set(w, 5, 10, 5, B.FLOWER_RED);
    // Straight ray through the cell center at flower height.
    const mid = raycastBlocks(w, 0.5, 10.3, 5.5, 1, 0, 0, 10);
    expect(mid?.id).toBe(B.FLOWER_RED);
    // Ray through the top corner of the cell (above the 0.62 box): miss.
    const high = raycastBlocks(w, 0.5, 10.9, 5.5, 1, 0, 0, 10);
    expect(high).toBeNull();
    // Ray hugging the cell edge (outside the 0.26..0.74 footprint): miss.
    const edge = raycastBlocks(w, 0.5, 10.3, 5.05, 1, 0, 0, 10);
    expect(edge).toBeNull();
  });

  it('lets a missed ray continue to the block behind', () => {
    const w = makeWorld();
    set(w, 5, 10, 5, B.FLOWER_YELLOW);
    set(w, 8, 10, 5, B.STONE);
    const hit = raycastBlocks(w, 0.5, 10.9, 5.5, 1, 0, 0, 16);
    expect(hit?.id).toBe(B.STONE);
    expect(hit?.x).toBe(8);
    // Entry normal faces the ray.
    expect(hit?.nx).toBe(-1);
  });

  it('hits a closed door only on its panel slice', () => {
    const w = makeWorld();
    set(w, 5, 10, 5, B.DOOR_BOTTOM); // panel z 5.0..5.19
    const front = raycastBlocks(w, 5.5, 10.5, 3.5, 0, 0, 1, 10);
    expect(front?.id).toBe(B.DOOR_BOTTOM);
    expect(front?.nz).toBe(-1);
    // Ray along x at z=5.6 passes through the open part of the cell.
    const throughGap = raycastBlocks(w, 3.5, 10.5, 5.6, 1, 0, 0, 10);
    expect(throughGap).toBeNull();
  });

  it('reports the sub-box entry face for placement (top of a plate)', () => {
    const w = makeWorld();
    set(w, 5, 10, 5, B.PRESSURE_PLATE);
    const down = raycastBlocks(w, 5.5, 12, 5.5, 0, -1, 0, 10);
    expect(down?.id).toBe(B.PRESSURE_PLATE);
    expect(down?.ny).toBe(1);
    expect(down?.dist).toBeCloseTo(2 - 0.05, 3);
  });
});
