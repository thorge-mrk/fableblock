/**
 * Unit tests: bit-packed voxel format, deterministic PRNG/noise, recipe
 * matrix validation, inventory click state machine.
 */
import { describe, it, expect } from 'vitest';
import {
  blockIndex, packVoxel, voxelId, voxelSun, voxelBlockLight,
  withSun, withBlockLight, chunkKeyNum, chunkKeyNumX, chunkKeyNumZ,
} from '../core/coords';
import { mulberry32, hashSeed, Random, hash2D } from '../core/prng';
import { SimplexNoise, FBM2D } from '../core/noise';
import { matchRecipe, smeltResult, stackFuel } from '../core/recipes';
import { B, fluidLevel, waterWithLevel, lavaWithLevel, furnaceLitVariant } from '../core/blocks';
import { ITEM, makeStack, itemDef } from '../core/items';
import { insertStack, clickSlot, Slots } from '../core/inventory';

describe('chunk memory layout (Module 1)', () => {
  it('uses index = x + z*16 + y*256 exactly', () => {
    expect(blockIndex(0, 0, 0)).toBe(0);
    expect(blockIndex(5, 0, 0)).toBe(5);
    expect(blockIndex(0, 0, 3)).toBe(3 * 16);
    expect(blockIndex(0, 7, 0)).toBe(7 * 256);
    expect(blockIndex(15, 255, 15)).toBe(15 + 15 * 16 + 255 * 256);
    expect(blockIndex(15, 255, 15)).toBe(65535);
  });

  it('packs block id in bits 0-7, sun 8-11, blocklight 12-15', () => {
    const v = packVoxel(0xab, 0x9, 0x6);
    expect(v & 0xff).toBe(0xab);
    expect((v >> 8) & 0xf).toBe(0x9);
    expect((v >> 12) & 0xf).toBe(0x6);
    expect(voxelId(v)).toBe(0xab);
    expect(voxelSun(v)).toBe(9);
    expect(voxelBlockLight(v)).toBe(6);
  });

  it('field updates preserve the other fields', () => {
    let v = packVoxel(42, 15, 3);
    v = withSun(v, 4);
    expect(voxelId(v)).toBe(42);
    expect(voxelSun(v)).toBe(4);
    expect(voxelBlockLight(v)).toBe(3);
    v = withBlockLight(v, 12);
    expect(voxelSun(v)).toBe(4);
    expect(voxelBlockLight(v)).toBe(12);
  });

  it('numeric chunk keys round-trip including negatives', () => {
    for (const [cx, cz] of [[0, 0], [-1, -1], [123, -456], [-32768, 32767]]) {
      const k = chunkKeyNum(cx, cz);
      expect(chunkKeyNumX(k)).toBe(cx);
      expect(chunkKeyNumZ(k)).toBe(cz);
    }
  });
});

describe('seeded PRNG determinism (Module 3)', () => {
  it('mulberry32 reproduces identical sequences per seed', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });

  it('different seeds diverge', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    let same = 0;
    for (let i = 0; i < 50; i++) if (a() === b()) same++;
    expect(same).toBeLessThan(3);
  });

  it('hashSeed is stable for strings', () => {
    expect(hashSeed('hello world')).toBe(hashSeed('hello world'));
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
  });

  it('Random.range stays inclusive within bounds', () => {
    const r = new Random(7);
    for (let i = 0; i < 500; i++) {
      const v = r.range(3, 6);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  it('hash2D deterministic per coordinate', () => {
    expect(hash2D(99, 10, -20)).toBe(hash2D(99, 10, -20));
    expect(hash2D(99, 10, -20)).not.toBe(hash2D(99, 11, -20));
  });
});

describe('simplex noise', () => {
  it('is deterministic and bounded in [-1,1]', () => {
    const n1 = new SimplexNoise(42);
    const n2 = new SimplexNoise(42);
    for (let i = 0; i < 300; i++) {
      const x = i * 0.37 - 50;
      const y = i * 0.11 + 3;
      const v = n1.noise2D(x, y);
      expect(v).toBe(n2.noise2D(x, y));
      expect(Math.abs(v)).toBeLessThanOrEqual(1);
      const v3 = n1.noise3D(x, y, i * 0.21);
      expect(v3).toBe(n2.noise3D(x, y, i * 0.21));
      expect(Math.abs(v3)).toBeLessThanOrEqual(1);
    }
  });

  it('fBm output varies over space', () => {
    const f = new FBM2D(7, 4, 0.01);
    const a = f.sample(0, 0);
    const b = f.sample(500, 500);
    expect(a).not.toBe(b);
  });
});

describe('crafting recipe matrix validator (Module 6)', () => {
  it('matches shapeless log -> planks anywhere in the grid', () => {
    expect(matchRecipe([B.OAK_LOG, 0, 0, 0], 2)?.result).toBe(B.OAK_PLANKS);
    expect(matchRecipe([0, 0, 0, B.OAK_LOG], 2)?.result).toBe(B.OAK_PLANKS);
    expect(matchRecipe([0, 0, 0, 0, B.OAK_LOG, 0, 0, 0, 0], 3)?.result).toBe(B.OAK_PLANKS);
  });

  it('matches shaped sticks with translation invariance', () => {
    const P = B.OAK_PLANKS;
    expect(matchRecipe([P, 0, P, 0], 2)?.result).toBe(ITEM.STICK);
    expect(matchRecipe([0, P, 0, P], 2)?.result).toBe(ITEM.STICK);
    // 3x3 grid, sticks in the right column
    expect(matchRecipe([0, 0, P, 0, 0, P, 0, 0, 0], 3)?.result).toBe(ITEM.STICK);
  });

  it('matches the 3x3 pickaxe and rejects it in 2x2', () => {
    const P = B.OAK_PLANKS;
    const S = ITEM.STICK;
    expect(matchRecipe([P, P, P, 0, S, 0, 0, S, 0], 3)?.result).toBe(ITEM.WOOD_PICKAXE);
    expect(matchRecipe([P, P, S, S], 2)).toBeNull();
  });

  it('matches furnace ring of cobblestone', () => {
    const C = B.COBBLESTONE;
    expect(matchRecipe([C, C, C, C, 0, C, C, C, C], 3)?.result).toBe(B.FURNACE_N);
    // Center filled = no match
    expect(matchRecipe([C, C, C, C, C, C, C, C, C], 3)).toBeNull();
  });

  it('matches the new building-block recipes', () => {
    // 4 stone -> 4 stone bricks (2x2)
    const S = B.STONE;
    expect(matchRecipe([S, S, S, S], 2)?.result).toBe(B.STONE_BRICKS);
    // Birch log -> birch planks (shapeless), giving 4
    const birch = matchRecipe([B.BIRCH_LOG, 0, 0, 0], 2);
    expect(birch?.result).toBe(B.BIRCH_PLANKS);
    expect(birch?.count).toBe(4);
    // 9 coal -> coal block, reversible
    const C = ITEM.COAL;
    expect(matchRecipe([C, C, C, C, C, C, C, C, C], 3)?.result).toBe(B.COAL_BLOCK);
    expect(matchRecipe([B.COAL_BLOCK, 0, 0, 0], 2)?.result).toBe(ITEM.COAL);
    // Bucket: I_I / _I_
    const I = ITEM.IRON_INGOT;
    expect(matchRecipe([I, 0, I, 0, I, 0, 0, 0, 0], 3)?.result).toBe(ITEM.BUCKET);
  });

  it('smelts stone bricks into cracked stone bricks', () => {
    expect(smeltResult(B.STONE_BRICKS)?.output).toBe(B.CRACKED_STONE_BRICKS);
  });

  it('smelting + fuel tables resolve', () => {
    expect(smeltResult(ITEM.RAW_IRON)?.output).toBe(ITEM.IRON_INGOT);
    expect(smeltResult(B.SAND)?.output).toBe(B.GLASS);
    expect(smeltResult(B.GRASS)).toBeNull();
    expect(stackFuel(ITEM.COAL)).toBe(1600);
    expect(stackFuel(B.OAK_PLANKS)).toBe(300);
    expect(stackFuel(ITEM.DIAMOND)).toBe(0);
  });
});

describe('fluid level encoding', () => {
  it('round-trips water levels', () => {
    expect(fluidLevel(B.WATER_SRC)).toBe(8);
    for (let lv = 1; lv <= 7; lv++) {
      expect(fluidLevel(waterWithLevel(lv))).toBe(lv);
    }
    expect(fluidLevel(lavaWithLevel(3))).toBe(3);
    expect(fluidLevel(B.STONE)).toBe(0);
  });

  it('furnace lit variant preserves facing', () => {
    expect(furnaceLitVariant(B.FURNACE_E, true)).toBe(B.FURNACE_LIT_E);
    expect(furnaceLitVariant(B.FURNACE_LIT_E, false)).toBe(B.FURNACE_E);
  });
});

describe('inventory state machine (Module 6)', () => {
  it('insertStack merges then fills empties and reports remainder', () => {
    const slots: Slots = [makeStack(B.DIRT, 60), null];
    const rest = insertStack(slots, makeStack(B.DIRT, 10));
    expect(rest).toBeNull();
    expect(slots[0]?.count).toBe(64);
    expect(slots[1]?.count).toBe(6);

    const tiny: Slots = [makeStack(B.DIRT, 64)];
    const overflow = insertStack(tiny, makeStack(B.DIRT, 5));
    expect(overflow?.count).toBe(5);
  });

  it('tools never stack', () => {
    const slots: Slots = [makeStack(ITEM.WOOD_PICKAXE, 1), null];
    const rest = insertStack(slots, makeStack(ITEM.WOOD_PICKAXE, 1));
    expect(rest).toBeNull();
    expect(slots[0]?.count).toBe(1);
    expect(slots[1]?.count).toBe(1);
  });

  it('left click swaps, right click splits half / places one', () => {
    const slots: Slots = [makeStack(B.STONE, 10)];
    // Right click empty cursor: pick up half (rounded up).
    let cursor = clickSlot(slots, 0, null, 2);
    expect(cursor?.count).toBe(5);
    expect(slots[0]?.count).toBe(5);
    // Right click with cursor: place one.
    cursor = clickSlot(slots, 0, cursor, 2);
    expect(cursor?.count).toBe(4);
    expect(slots[0]?.count).toBe(6);
    // Left click merges all.
    cursor = clickSlot(slots, 0, cursor, 0);
    expect(cursor).toBeNull();
    expect(slots[0]?.count).toBe(10);
    // Left click with different item swaps.
    const c2 = clickSlot(slots, 0, makeStack(B.SAND, 3), 0);
    expect(c2?.id).toBe(B.STONE);
    expect(slots[0]?.id).toBe(B.SAND);
  });

  it('respects max stack size on merge', () => {
    const slots: Slots = [makeStack(B.DIRT, 62)];
    const cursor = clickSlot(slots, 0, makeStack(B.DIRT, 10), 0);
    expect(slots[0]?.count).toBe(64);
    expect(cursor?.count).toBe(8);
    expect(itemDef(B.DIRT).maxStack).toBe(64);
  });
});
