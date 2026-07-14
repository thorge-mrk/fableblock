/**
 * Redstone-lite simulation tests (Phase 4): wire power decay, lamp
 * level-following, edge-triggered doors and piston push/retract mechanics —
 * all against a real World instance.
 */
import { describe, it, expect } from 'vitest';
import { World } from '../core/world';
import { B } from '../core/blocks';
import { CHUNK_VOLUME, packVoxel } from '../core/coords';
import { runRedstone, defaultCanPush } from '../core/redstone';

/** Flat test world: one 16x16 chunk column grid, stone floor at y=9. */
function makeWorld(): World {
  const w = new World();
  for (let cx = -2; cx <= 2; cx++) {
    for (let cz = -2; cz <= 2; cz++) {
      const data = new Uint16Array(CHUNK_VOLUME);
      for (let i = 0; i < 256; i++) data[(9 << 8) + i] = packVoxel(B.STONE, 0, 0);
      w.addChunk(cx, cz, data);
    }
  }
  return w;
}

function set(w: World, x: number, y: number, z: number, id: number): void {
  w.setRaw(x, y, z, packVoxel(id, 0, 0));
}

/** Run the sim until it settles (each pass re-runs cells it just changed). */
function settle(w: World, dirty: Array<[number, number, number]>, prev = new Map<string, boolean>()): void {
  let batch = dirty;
  for (let pass = 0; pass < 6 && batch.length > 0; pass++) {
    const next: Array<[number, number, number]> = [];
    runRedstone(w, batch, (x, y, z, id) => {
      set(w, x, y, z, id);
      next.push([x, y, z]);
    }, prev);
    batch = next;
  }
}

describe('redstone-lite simulation (Phase 4)', () => {
  it('powers a wire run from a lever with 15-block decay', () => {
    const w = makeWorld();
    set(w, 0, 10, 0, B.LEVER_ON);
    for (let i = 1; i <= 20; i++) set(w, i, 10, 0, B.REDSTONE_WIRE);
    settle(w, [[0, 10, 0]]);
    // Wire 1 gets 15, wire 15 gets 1, wire 16+ stays off.
    expect(w.getBlockId(1, 10, 0)).toBe(B.REDSTONE_WIRE_ON);
    expect(w.getBlockId(15, 10, 0)).toBe(B.REDSTONE_WIRE_ON);
    expect(w.getBlockId(16, 10, 0)).toBe(B.REDSTONE_WIRE);
    expect(w.getBlockId(20, 10, 0)).toBe(B.REDSTONE_WIRE);
  });

  it('turns a lamp on and off with the lever', () => {
    const w = makeWorld();
    set(w, 0, 10, 0, B.LEVER_ON);
    for (let i = 1; i <= 4; i++) set(w, i, 10, 0, B.REDSTONE_WIRE);
    set(w, 5, 10, 0, B.REDSTONE_LAMP);
    settle(w, [[0, 10, 0]]);
    expect(w.getBlockId(5, 10, 0)).toBe(B.REDSTONE_LAMP_ON);
    // Flip the lever off.
    set(w, 0, 10, 0, B.LEVER);
    settle(w, [[0, 10, 0]]);
    expect(w.getBlockId(5, 10, 0)).toBe(B.REDSTONE_LAMP);
    expect(w.getBlockId(1, 10, 0)).toBe(B.REDSTONE_WIRE);
  });

  it('climbs staircase slopes', () => {
    const w = makeWorld();
    set(w, 0, 10, 0, B.REDSTONE_BLOCK);
    set(w, 1, 10, 0, B.REDSTONE_WIRE);
    set(w, 2, 10, 0, B.STONE);
    set(w, 2, 11, 0, B.REDSTONE_WIRE); // one step up
    set(w, 3, 11, 0, B.REDSTONE_LAMP);
    settle(w, [[0, 10, 0]]);
    expect(w.getBlockId(2, 11, 0)).toBe(B.REDSTONE_WIRE_ON);
    expect(w.getBlockId(3, 11, 0)).toBe(B.REDSTONE_LAMP_ON);
  });

  it('opens doors on the rising edge and respects manual toggles', () => {
    const w = makeWorld();
    const prev = new Map<string, boolean>();
    set(w, 0, 10, 0, B.LEVER);
    set(w, 1, 10, 0, B.REDSTONE_WIRE);
    set(w, 2, 10, 0, B.DOOR_BOTTOM);
    set(w, 2, 11, 0, B.DOOR_TOP);
    // First evaluation records the unpowered baseline.
    settle(w, [[0, 10, 0]], prev);
    expect(w.getBlockId(2, 10, 0)).toBe(B.DOOR_BOTTOM);
    // Rising edge opens both halves.
    set(w, 0, 10, 0, B.LEVER_ON);
    settle(w, [[0, 10, 0]], prev);
    expect(w.getBlockId(2, 10, 0)).toBe(B.DOOR_BOTTOM_OPEN);
    expect(w.getBlockId(2, 11, 0)).toBe(B.DOOR_TOP_OPEN);
    // Falling edge closes.
    set(w, 0, 10, 0, B.LEVER);
    settle(w, [[0, 10, 0]], prev);
    expect(w.getBlockId(2, 10, 0)).toBe(B.DOOR_BOTTOM);
    // Manual open while unpowered: a recompute must NOT slam it shut.
    set(w, 2, 10, 0, B.DOOR_BOTTOM_OPEN);
    set(w, 2, 11, 0, B.DOOR_TOP_OPEN);
    settle(w, [[2, 10, 0]], prev);
    expect(w.getBlockId(2, 10, 0)).toBe(B.DOOR_BOTTOM_OPEN);
  });

  it('extends a piston, pushing a block column, and retracts it', () => {
    const w = makeWorld();
    const prev = new Map<string, boolean>();
    set(w, 0, 10, 0, B.LEVER);
    set(w, 1, 10, 0, B.REDSTONE_WIRE);
    set(w, 2, 10, 0, B.PISTON_E); // faces +X
    set(w, 3, 10, 0, B.STONE);
    set(w, 4, 10, 0, B.SAND);
    settle(w, [[0, 10, 0]], prev);
    expect(w.getBlockId(2, 10, 0)).toBe(B.PISTON_E);

    set(w, 0, 10, 0, B.LEVER_ON);
    settle(w, [[0, 10, 0]], prev);
    expect(w.getBlockId(2, 10, 0)).toBe(B.PISTON_EXT_E);
    expect(w.getBlockId(3, 10, 0)).toBe(B.PISTON_HEAD_E);
    expect(w.getBlockId(4, 10, 0)).toBe(B.STONE);
    expect(w.getBlockId(5, 10, 0)).toBe(B.SAND);

    set(w, 0, 10, 0, B.LEVER);
    settle(w, [[0, 10, 0]], prev);
    expect(w.getBlockId(2, 10, 0)).toBe(B.PISTON_E);
    expect(w.getBlockId(3, 10, 0)).toBe(B.AIR);
    expect(w.getBlockId(4, 10, 0)).toBe(B.STONE); // pushed blocks stay
  });

  it('refuses to push more than 8 blocks or unmovable blocks', () => {
    const w = makeWorld();
    const prev = new Map<string, boolean>();
    set(w, 2, 10, 0, B.PISTON_E);
    for (let i = 0; i < 9; i++) set(w, 3 + i, 10, 0, B.STONE);
    set(w, 1, 10, 0, B.REDSTONE_BLOCK);
    settle(w, [[1, 10, 0]], prev);
    expect(w.getBlockId(2, 10, 0)).toBe(B.PISTON_E); // 9 blocks: blocked

    // Bedrock wall directly in front.
    set(w, 2, 10, 5, B.PISTON_E);
    set(w, 3, 10, 5, B.BEDROCK);
    set(w, 1, 10, 5, B.REDSTONE_BLOCK);
    settle(w, [[1, 10, 5]], prev);
    expect(w.getBlockId(2, 10, 5)).toBe(B.PISTON_E);
  });

  it('classifies pushable blocks sensibly', () => {
    expect(defaultCanPush(B.STONE)).toBe(true);
    expect(defaultCanPush(B.GLASS)).toBe(true);
    expect(defaultCanPush(B.BEDROCK)).toBe(false);
    expect(defaultCanPush(B.PISTON_N)).toBe(false);
    expect(defaultCanPush(B.WATER_SRC)).toBe(false);
    expect(defaultCanPush(B.DOOR_BOTTOM)).toBe(false);
  });
});
