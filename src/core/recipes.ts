/**
 * Crafting recipe matrix validator (Module 6 spec) plus furnace smelting and
 * fuel tables. Shaped recipes are defined as row-strings against a key map
 * and matched against the 2x2 or 3x3 grid with translation normalization.
 */
import { B } from './blocks';
import { ITEM, itemDef, ItemStack } from './items';

export interface Recipe {
  /** Normalized pattern: width, height and item ids row-major (0 = empty). */
  w: number;
  h: number;
  cells: number[];
  result: number;
  count: number;
  /** Shapeless recipes match by multiset of inputs. */
  shapeless?: boolean;
}

function shaped(pattern: string[], key: Record<string, number>, result: number, count = 1): Recipe {
  const h = pattern.length;
  const w = Math.max(...pattern.map((r) => r.length));
  const cells: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = pattern[y][x] ?? ' ';
      cells.push(ch === ' ' ? 0 : key[ch]);
    }
  }
  return { w, h, cells, result, count };
}

function shapeless(inputs: number[], result: number, count = 1): Recipe {
  return { w: 0, h: 0, cells: inputs.slice().sort((a, b) => a - b), result, count, shapeless: true };
}

export const RECIPES: Recipe[] = [
  // --- 2x2-compatible recipes ---
  shapeless([B.OAK_LOG], B.OAK_PLANKS, 4),
  shapeless([B.BIRCH_LOG], B.BIRCH_PLANKS, 4),
  shaped(['P', 'P'], { P: B.OAK_PLANKS }, ITEM.STICK, 4),
  shaped(['B', 'B'], { B: B.BIRCH_PLANKS }, ITEM.STICK, 4),
  shaped(['PP', 'PP'], { P: B.OAK_PLANKS }, B.CRAFTING_TABLE, 1),
  shaped(['C', 'S'], { C: ITEM.COAL, S: ITEM.STICK }, B.TORCH, 4),
  shaped(['C', 'S'], { C: ITEM.CHARCOAL, S: ITEM.STICK }, B.TORCH, 4),
  shaped(['SS', 'SS'], { S: B.SAND }, B.SANDSTONE, 1),
  shaped(['SS', 'SS'], { S: B.STONE }, B.STONE_BRICKS, 4),
  shapeless([B.IRON_BLOCK], ITEM.IRON_INGOT, 9),
  shapeless([B.COAL_BLOCK], ITEM.COAL, 9),
  shapeless([B.GOLD_BLOCK], ITEM.GOLD_INGOT, 9),
  shapeless([B.DIAMOND_BLOCK], ITEM.DIAMOND, 9),
  // --- 3x3 crafting-table recipes ---
  shaped(['PPP', 'P P', 'PPP'], { P: B.OAK_PLANKS }, B.CHEST_N, 1),
  shaped(['CCC', 'C C', 'CCC'], { C: B.COBBLESTONE }, B.FURNACE_N, 1),
  shaped(['I I', 'ICI', ' I '], { I: ITEM.IRON_INGOT, C: B.CHEST_N }, B.HOPPER, 1),
  shaped(['PPP', ' S ', ' S '], { P: B.OAK_PLANKS, S: ITEM.STICK }, ITEM.WOOD_PICKAXE, 1),
  shaped(['III', ' S ', ' S '], { I: ITEM.IRON_INGOT, S: ITEM.STICK }, ITEM.IRON_PICKAXE, 1),
  shaped(['DDD', ' S ', ' S '], { D: ITEM.DIAMOND, S: ITEM.STICK }, ITEM.DIAMOND_PICKAXE, 1),
  shaped(['P', 'P', 'S'], { P: B.OAK_PLANKS, S: ITEM.STICK }, ITEM.WOOD_SWORD, 1),
  shaped(['I', 'I', 'S'], { I: ITEM.IRON_INGOT, S: ITEM.STICK }, ITEM.IRON_SWORD, 1),
  shaped(['D', 'D', 'S'], { D: ITEM.DIAMOND, S: ITEM.STICK }, ITEM.DIAMOND_SWORD, 1),
  shaped(['III', 'III', 'III'], { I: ITEM.IRON_INGOT }, B.IRON_BLOCK, 1),
  shaped(['CCC', 'CCC', 'CCC'], { C: ITEM.COAL }, B.COAL_BLOCK, 1),
  shaped(['GGG', 'GGG', 'GGG'], { G: ITEM.GOLD_INGOT }, B.GOLD_BLOCK, 1),
  shaped(['DDD', 'DDD', 'DDD'], { D: ITEM.DIAMOND }, B.DIAMOND_BLOCK, 1),
  shaped(['SS', 'SS'], { S: B.STONE_BRICKS }, B.CHISELED_STONE_BRICKS, 4),
  shaped(['I I', ' I '], { I: ITEM.IRON_INGOT }, ITEM.BUCKET, 1),
  // Boat: U-shape of 5 planks (oak or birch both yield an oak boat).
  shaped(['P P', 'PPP'], { P: B.OAK_PLANKS }, ITEM.BOAT, 1),
  shaped(['B B', 'BBB'], { B: B.BIRCH_PLANKS }, ITEM.BOAT, 1),
  // Bed: wool mattress over a plank frame.
  shaped(['WWW', 'PPP'], { W: B.WOOL, P: B.OAK_PLANKS }, B.BED, 1),
  // Stone-tier pickaxe + sword.
  shaped(['CCC', ' S ', ' S '], { C: B.COBBLESTONE, S: ITEM.STICK }, ITEM.STONE_PICKAXE, 1),
  shaped(['C', 'C', 'S'], { C: B.COBBLESTONE, S: ITEM.STICK }, ITEM.STONE_SWORD, 1),
  // Axes (XX / XS / _S).
  shaped(['PP', 'PS', ' S'], { P: B.OAK_PLANKS, S: ITEM.STICK }, ITEM.WOOD_AXE, 1),
  shaped(['CC', 'CS', ' S'], { C: B.COBBLESTONE, S: ITEM.STICK }, ITEM.STONE_AXE, 1),
  shaped(['II', 'IS', ' S'], { I: ITEM.IRON_INGOT, S: ITEM.STICK }, ITEM.IRON_AXE, 1),
  shaped(['DD', 'DS', ' S'], { D: ITEM.DIAMOND, S: ITEM.STICK }, ITEM.DIAMOND_AXE, 1),
  // Shovels (X / S / S).
  shaped(['P', 'S', 'S'], { P: B.OAK_PLANKS, S: ITEM.STICK }, ITEM.WOOD_SHOVEL, 1),
  shaped(['C', 'S', 'S'], { C: B.COBBLESTONE, S: ITEM.STICK }, ITEM.STONE_SHOVEL, 1),
  shaped(['I', 'S', 'S'], { I: ITEM.IRON_INGOT, S: ITEM.STICK }, ITEM.IRON_SHOVEL, 1),
  shaped(['D', 'S', 'S'], { D: ITEM.DIAMOND, S: ITEM.STICK }, ITEM.DIAMOND_SHOVEL, 1),
];

/**
 * Match the crafting grid (size x size, row-major array of item ids, 0=empty)
 * against all recipes. Returns the matched recipe or null.
 */
export function matchRecipe(grid: ReadonlyArray<number>, size: 2 | 3): Recipe | null {
  // Compute occupied bounding box for translation-invariant shaped matching.
  let minX: number = size;
  let minY: number = size;
  let maxX = -1;
  let maxY = -1;
  const present: number[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const id = grid[y * size + x];
      if (id !== 0) {
        present.push(id);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;

  outer: for (const r of RECIPES) {
    if (r.shapeless) {
      if (r.cells.length !== present.length) continue;
      const sorted = present.slice().sort((a, b) => a - b);
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] !== r.cells[i]) continue outer;
      }
      return r;
    }
    if (r.w !== bw || r.h !== bh) continue;
    if (r.w > size || r.h > size) continue;
    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        if (grid[(minY + y) * size + (minX + x)] !== r.cells[y * r.w + x]) continue outer;
      }
    }
    return r;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Smelting (furnace state machine inputs)
// ---------------------------------------------------------------------------
export interface SmeltRecipe {
  input: number;
  output: number;
  /** Game ticks (20/s) to cook one item. */
  ticks: number;
}

export const SMELTING: SmeltRecipe[] = [
  { input: ITEM.RAW_IRON, output: ITEM.IRON_INGOT, ticks: 200 },
  { input: B.IRON_ORE, output: ITEM.IRON_INGOT, ticks: 200 },
  { input: B.GOLD_ORE, output: ITEM.GOLD_INGOT, ticks: 200 },
  { input: B.SAND, output: B.GLASS, ticks: 200 },
  { input: B.COBBLESTONE, output: B.STONE, ticks: 200 },
  { input: B.STONE_BRICKS, output: B.CRACKED_STONE_BRICKS, ticks: 200 },
  { input: B.OAK_LOG, output: ITEM.CHARCOAL, ticks: 200 },
  { input: B.BIRCH_LOG, output: ITEM.CHARCOAL, ticks: 200 },
  { input: ITEM.RAW_MUTTON, output: ITEM.COOKED_MUTTON, ticks: 200 },
];

export function smeltResult(inputId: number): SmeltRecipe | null {
  for (const r of SMELTING) if (r.input === inputId) return r;
  return null;
}

export function stackFuel(id: number): number {
  return itemDef(id).fuelTicks ?? 0;
}

/** Returns burn duration in ticks for a fuel stack, or 0. */
export function fuelTicks(stack: ItemStack | null): number {
  if (!stack) return 0;
  return stackFuel(stack.id);
}
