/**
 * Central block registry. Block IDs occupy bits 0-7 of the chunk voxel
 * format (max 255). Tiles reference 32x32px cells inside the procedurally
 * generated 1024x1024 texture atlas (32x32 grid of tiles).
 */

// ---------------------------------------------------------------------------
// Atlas tile indices (atlas painter in src/engine/TextureAtlas.ts must
// implement a painter for every tile listed here).
// ---------------------------------------------------------------------------
export const TILE = {
  GRASS_TOP: 0,
  GRASS_SIDE: 1,
  DIRT: 2,
  STONE: 3,
  COBBLESTONE: 4,
  MOSSY_COBBLESTONE: 5,
  BEDROCK: 6,
  SAND: 7,
  GRAVEL: 8,
  SANDSTONE_TOP: 9,
  SANDSTONE_SIDE: 10,
  OAK_LOG_SIDE: 11,
  OAK_LOG_TOP: 12,
  OAK_LEAVES: 13,
  BIRCH_LOG_SIDE: 14,
  BIRCH_LEAVES: 15,
  OAK_PLANKS: 16,
  COAL_ORE: 17,
  IRON_ORE: 18,
  GOLD_ORE: 19,
  DIAMOND_ORE: 20,
  GLASS: 21,
  SNOW_TOP: 22,
  SNOW_SIDE: 23,
  CACTUS_SIDE: 24,
  CACTUS_TOP: 25,
  TALL_GRASS: 26,
  FLOWER_RED: 27,
  FLOWER_YELLOW: 28,
  TORCH: 29,
  CRAFTING_TABLE_TOP: 30,
  CRAFTING_TABLE_SIDE: 31,
  CRAFTING_TABLE_FRONT: 32,
  FURNACE_FRONT: 33,
  FURNACE_FRONT_LIT: 34,
  FURNACE_SIDE: 35,
  FURNACE_TOP: 36,
  CHEST_FRONT: 37,
  CHEST_SIDE: 38,
  CHEST_TOP: 39,
  HOPPER_TOP: 40,
  HOPPER_SIDE: 41,
  SPAWNER: 42,
  WOOL: 43,
  GLOWSTONE: 44,
  WATER: 45,
  LAVA: 46,
  IRON_BLOCK: 47,
  CRACK_0: 48,
  CRACK_1: 49,
  CRACK_2: 50,
  CRACK_3: 51,
  // Item icons (UI / held items, never meshed as blocks)
  ITEM_STICK: 52,
  ITEM_COAL: 53,
  ITEM_CHARCOAL: 54,
  ITEM_RAW_IRON: 55,
  ITEM_IRON_INGOT: 56,
  ITEM_GOLD_INGOT: 57,
  ITEM_DIAMOND: 58,
  ITEM_PICK_WOOD: 59,
  ITEM_PICK_IRON: 60,
  ITEM_PICK_DIAMOND: 61,
  ITEM_SWORD_WOOD: 62,
  ITEM_SWORD_IRON: 63,
  ITEM_SWORD_DIAMOND: 64,
  ITEM_MUTTON_RAW: 65,
  ITEM_MUTTON_COOKED: 66,
  ITEM_ARROW: 67,
  ITEM_WHEAT: 68,
} as const;

export const ATLAS_TILES = 32; // 32x32 grid of 16px tiles = 512px atlas
export const ATLAS_SIZE = 512;
export const TILE_PX = 16;

// ---------------------------------------------------------------------------
// Block IDs
// ---------------------------------------------------------------------------
export const B = {
  AIR: 0,
  STONE: 1,
  GRASS: 2,
  DIRT: 3,
  COBBLESTONE: 4,
  OAK_PLANKS: 5,
  BEDROCK: 6,
  SAND: 7,
  GRAVEL: 8,
  OAK_LOG: 9,
  OAK_LEAVES: 10,
  BIRCH_LOG: 11,
  BIRCH_LEAVES: 12,
  COAL_ORE: 13,
  IRON_ORE: 14,
  GOLD_ORE: 15,
  DIAMOND_ORE: 16,
  SANDSTONE: 17,
  MOSSY_COBBLESTONE: 18,
  GLASS: 19,
  SNOW_GRASS: 20,
  CACTUS: 21,
  TALL_GRASS: 22,
  FLOWER_RED: 23,
  FLOWER_YELLOW: 24,
  TORCH: 25,
  CRAFTING_TABLE: 26,
  CHEST_N: 27,
  CHEST_S: 28,
  CHEST_E: 29,
  CHEST_W: 30,
  FURNACE_N: 31,
  FURNACE_S: 32,
  FURNACE_E: 33,
  FURNACE_W: 34,
  FURNACE_LIT_N: 35,
  FURNACE_LIT_S: 36,
  FURNACE_LIT_E: 37,
  FURNACE_LIT_W: 38,
  HOPPER: 39,
  SPAWNER: 40,
  WOOL: 41,
  GLOWSTONE: 42,
  IRON_BLOCK: 43,
  WATER_SRC: 44,
  // Flowing water levels 7..1 -> ids 45..51
  WATER_FLOW_7: 45,
  WATER_FLOW_1: 51,
  LAVA_SRC: 52,
  // Flowing lava levels 3..1 -> ids 53..55  (decay limit 3, Module 4 spec)
  LAVA_FLOW_3: 53,
  LAVA_FLOW_1: 55,
} as const;

export type BlockId = number;

export const enum RenderType {
  NONE = 0,
  SOLID = 1, // opaque cube
  CUTOUT = 2, // cube with alpha-tested holes (leaves, glass)
  CROSS = 3, // X-shaped pair of quads (plants, torch)
  FLUID = 4, // water / lava with level-based height
}

export interface BlockDef {
  id: number;
  name: string;
  /** Entity collision. */
  solid: boolean;
  /** Blocks all light + culls neighbor faces. */
  opaque: boolean;
  renderType: RenderType;
  /** Atlas tiles per face: [+X, -X, +Y(top), -Y(bottom), +Z, -Z]. */
  tiles: [number, number, number, number, number, number];
  /** Seconds to break bare-handed (hardness*1.5); <0 = unbreakable. */
  hardness: number;
  /** Effective tool category. */
  tool: 'pickaxe' | 'sword' | 'none';
  /** Minimum pickaxe tier required for drops (0 hand, 1 wood, 2 iron, 3 diamond). */
  minTier: number;
  /** Item id dropped (-1 = nothing, undefined = itself). */
  drop?: number;
  dropCount?: [number, number];
  /** Emitted block light 0..15. */
  lightEmit: number;
  /** Light attenuation for non-opaque blocks (water dims sunlight). */
  lightFilter: number;
  /** Can be replaced by placement / fluids (air, grass, water...). */
  replaceable: boolean;
  /** Random-tick behavior participates (grass spread, leaf decay). */
  randomTicks: boolean;
}

function tile6(t: number): [number, number, number, number, number, number] {
  return [t, t, t, t, t, t];
}

function tileTSB(top: number, side: number, bottom: number): [number, number, number, number, number, number] {
  return [side, side, top, bottom, side, side];
}

const defaults = {
  solid: true,
  opaque: true,
  renderType: RenderType.SOLID as RenderType,
  hardness: 1,
  tool: 'none' as const,
  minTier: 0,
  lightEmit: 0,
  lightFilter: 15,
  replaceable: false,
  randomTicks: false,
};

export const BLOCKS: BlockDef[] = new Array(256);

function def(id: number, name: string, tiles: [number, number, number, number, number, number], over: Partial<BlockDef> = {}): void {
  BLOCKS[id] = { ...defaults, id, name, tiles, ...over };
}

def(B.AIR, 'Air', tile6(0), {
  solid: false, opaque: false, renderType: RenderType.NONE, hardness: -1,
  lightFilter: 0, replaceable: true,
});
def(B.STONE, 'Stone', tile6(TILE.STONE), { hardness: 1.5, tool: 'pickaxe', minTier: 1, drop: B.COBBLESTONE });
def(B.GRASS, 'Grass Block', tileTSB(TILE.GRASS_TOP, TILE.GRASS_SIDE, TILE.DIRT), { hardness: 0.6, drop: B.DIRT, randomTicks: true });
def(B.DIRT, 'Dirt', tile6(TILE.DIRT), { hardness: 0.5 });
def(B.COBBLESTONE, 'Cobblestone', tile6(TILE.COBBLESTONE), { hardness: 2, tool: 'pickaxe', minTier: 1 });
def(B.OAK_PLANKS, 'Oak Planks', tile6(TILE.OAK_PLANKS), { hardness: 2 });
def(B.BEDROCK, 'Bedrock', tile6(TILE.BEDROCK), { hardness: -1 });
def(B.SAND, 'Sand', tile6(TILE.SAND), { hardness: 0.5 });
def(B.GRAVEL, 'Gravel', tile6(TILE.GRAVEL), { hardness: 0.6 });
def(B.OAK_LOG, 'Oak Log', tileTSB(TILE.OAK_LOG_TOP, TILE.OAK_LOG_SIDE, TILE.OAK_LOG_TOP), { hardness: 2 });
def(B.OAK_LEAVES, 'Oak Leaves', tile6(TILE.OAK_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.BIRCH_LOG, 'Birch Log', tileTSB(TILE.OAK_LOG_TOP, TILE.BIRCH_LOG_SIDE, TILE.OAK_LOG_TOP), { hardness: 2 });
def(B.BIRCH_LEAVES, 'Birch Leaves', tile6(TILE.BIRCH_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.COAL_ORE, 'Coal Ore', tile6(TILE.COAL_ORE), { hardness: 3, tool: 'pickaxe', minTier: 1, drop: 256 + 1 /* ITEM.COAL */ });
def(B.IRON_ORE, 'Iron Ore', tile6(TILE.IRON_ORE), { hardness: 3, tool: 'pickaxe', minTier: 1, drop: 256 + 3 /* ITEM.RAW_IRON */ });
def(B.GOLD_ORE, 'Gold Ore', tile6(TILE.GOLD_ORE), { hardness: 3, tool: 'pickaxe', minTier: 2, drop: B.GOLD_ORE });
def(B.DIAMOND_ORE, 'Diamond Ore', tile6(TILE.DIAMOND_ORE), { hardness: 3, tool: 'pickaxe', minTier: 2, drop: 256 + 6 /* ITEM.DIAMOND */ });
def(B.SANDSTONE, 'Sandstone', tileTSB(TILE.SANDSTONE_TOP, TILE.SANDSTONE_SIDE, TILE.SANDSTONE_TOP), { hardness: 0.8, tool: 'pickaxe', minTier: 1 });
def(B.MOSSY_COBBLESTONE, 'Mossy Cobblestone', tile6(TILE.MOSSY_COBBLESTONE), { hardness: 2, tool: 'pickaxe', minTier: 1 });
def(B.GLASS, 'Glass', tile6(TILE.GLASS), { opaque: false, renderType: RenderType.CUTOUT, hardness: 0.3, drop: -1, lightFilter: 0 });
def(B.SNOW_GRASS, 'Snowy Grass', tileTSB(TILE.SNOW_TOP, TILE.SNOW_SIDE, TILE.DIRT), { hardness: 0.6, drop: B.DIRT });
def(B.CACTUS, 'Cactus', tileTSB(TILE.CACTUS_TOP, TILE.CACTUS_SIDE, TILE.CACTUS_TOP), { hardness: 0.4, opaque: false, renderType: RenderType.CUTOUT });
def(B.TALL_GRASS, 'Tall Grass', tile6(TILE.TALL_GRASS), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, drop: -1, lightFilter: 0, replaceable: true,
});
def(B.FLOWER_RED, 'Poppy', tile6(TILE.FLOWER_RED), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, lightFilter: 0,
});
def(B.FLOWER_YELLOW, 'Dandelion', tile6(TILE.FLOWER_YELLOW), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, lightFilter: 0,
});
def(B.TORCH, 'Torch', tile6(TILE.TORCH), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, lightEmit: 14, lightFilter: 0,
});
def(B.CRAFTING_TABLE, 'Crafting Table', [
  TILE.CRAFTING_TABLE_SIDE, TILE.CRAFTING_TABLE_SIDE, TILE.CRAFTING_TABLE_TOP,
  TILE.OAK_PLANKS, TILE.CRAFTING_TABLE_FRONT, TILE.CRAFTING_TABLE_FRONT,
], { hardness: 2.5 });

function chestTiles(face: 'n' | 's' | 'e' | 'w'): [number, number, number, number, number, number] {
  const F = TILE.CHEST_FRONT;
  const S = TILE.CHEST_SIDE;
  const T = TILE.CHEST_TOP;
  // [+X(E), -X(W), top, bottom, +Z(S), -Z(N)]
  if (face === 'n') return [S, S, T, T, S, F];
  if (face === 's') return [S, S, T, T, F, S];
  if (face === 'e') return [F, S, T, T, S, S];
  return [S, F, T, T, S, S];
}
def(B.CHEST_N, 'Chest', chestTiles('n'), { hardness: 2.5 });
def(B.CHEST_S, 'Chest', chestTiles('s'), { hardness: 2.5, drop: B.CHEST_N });
def(B.CHEST_E, 'Chest', chestTiles('e'), { hardness: 2.5, drop: B.CHEST_N });
def(B.CHEST_W, 'Chest', chestTiles('w'), { hardness: 2.5, drop: B.CHEST_N });

function furnaceTiles(face: 'n' | 's' | 'e' | 'w', lit: boolean): [number, number, number, number, number, number] {
  const F = lit ? TILE.FURNACE_FRONT_LIT : TILE.FURNACE_FRONT;
  const S = TILE.FURNACE_SIDE;
  const T = TILE.FURNACE_TOP;
  if (face === 'n') return [S, S, T, T, S, F];
  if (face === 's') return [S, S, T, T, F, S];
  if (face === 'e') return [F, S, T, T, S, S];
  return [S, F, T, T, S, S];
}
def(B.FURNACE_N, 'Furnace', furnaceTiles('n', false), { hardness: 3.5, tool: 'pickaxe', minTier: 1, drop: B.FURNACE_N });
def(B.FURNACE_S, 'Furnace', furnaceTiles('s', false), { hardness: 3.5, tool: 'pickaxe', minTier: 1, drop: B.FURNACE_N });
def(B.FURNACE_E, 'Furnace', furnaceTiles('e', false), { hardness: 3.5, tool: 'pickaxe', minTier: 1, drop: B.FURNACE_N });
def(B.FURNACE_W, 'Furnace', furnaceTiles('w', false), { hardness: 3.5, tool: 'pickaxe', minTier: 1, drop: B.FURNACE_N });
def(B.FURNACE_LIT_N, 'Furnace', furnaceTiles('n', true), { hardness: 3.5, tool: 'pickaxe', minTier: 1, drop: B.FURNACE_N, lightEmit: 13 });
def(B.FURNACE_LIT_S, 'Furnace', furnaceTiles('s', true), { hardness: 3.5, tool: 'pickaxe', minTier: 1, drop: B.FURNACE_N, lightEmit: 13 });
def(B.FURNACE_LIT_E, 'Furnace', furnaceTiles('e', true), { hardness: 3.5, tool: 'pickaxe', minTier: 1, drop: B.FURNACE_N, lightEmit: 13 });
def(B.FURNACE_LIT_W, 'Furnace', furnaceTiles('w', true), { hardness: 3.5, tool: 'pickaxe', minTier: 1, drop: B.FURNACE_N, lightEmit: 13 });
def(B.HOPPER, 'Hopper', tileTSB(TILE.HOPPER_TOP, TILE.HOPPER_SIDE, TILE.HOPPER_SIDE), { hardness: 3, tool: 'pickaxe', minTier: 1 });
def(B.SPAWNER, 'Monster Spawner', tile6(TILE.SPAWNER), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 5, tool: 'pickaxe', minTier: 1, drop: -1, lightFilter: 0,
});
def(B.WOOL, 'Wool', tile6(TILE.WOOL), { hardness: 0.8 });
def(B.GLOWSTONE, 'Glowstone', tile6(TILE.GLOWSTONE), { hardness: 0.3, lightEmit: 15 });
def(B.IRON_BLOCK, 'Iron Block', tile6(TILE.IRON_BLOCK), { hardness: 5, tool: 'pickaxe', minTier: 1 });

const fluidDefaults = {
  solid: false,
  opaque: false,
  renderType: RenderType.FLUID as RenderType,
  hardness: -1,
  drop: -1,
  replaceable: true,
};
def(B.WATER_SRC, 'Water', tile6(TILE.WATER), { ...fluidDefaults, lightFilter: 2 });
for (let i = 0; i < 7; i++) {
  def(B.WATER_FLOW_7 + i, 'Flowing Water', tile6(TILE.WATER), { ...fluidDefaults, lightFilter: 2 });
}
def(B.LAVA_SRC, 'Lava', tile6(TILE.LAVA), { ...fluidDefaults, lightEmit: 15, lightFilter: 15 });
for (let i = 0; i < 3; i++) {
  def(B.LAVA_FLOW_3 + i, 'Flowing Lava', tile6(TILE.LAVA), { ...fluidDefaults, lightEmit: 15, lightFilter: 15 });
}

// Fill remaining ids with air-like placeholders so lookups never crash on
// corrupted data.
for (let i = 0; i < 256; i++) {
  if (!BLOCKS[i]) {
    BLOCKS[i] = { ...defaults, id: i, name: 'Unknown', tiles: tile6(TILE.STONE), solid: false, opaque: false, renderType: RenderType.NONE, lightFilter: 0, replaceable: true };
  }
}

// ---------------------------------------------------------------------------
// Fluid helpers
// ---------------------------------------------------------------------------
export function isWater(id: number): boolean {
  return id >= B.WATER_SRC && id <= B.WATER_FLOW_1;
}

export function isLava(id: number): boolean {
  return id >= B.LAVA_SRC && id <= B.LAVA_FLOW_1;
}

export function isFluid(id: number): boolean {
  return id >= B.WATER_SRC && id <= B.LAVA_FLOW_1;
}

/** Fluid level 8 (source) .. 1 (thinnest). 0 for non-fluids. */
export function fluidLevel(id: number): number {
  if (id === B.WATER_SRC || id === B.LAVA_SRC) return 8;
  if (id >= B.WATER_FLOW_7 && id <= B.WATER_FLOW_1) return 7 - (id - B.WATER_FLOW_7);
  if (id >= B.LAVA_FLOW_3 && id <= B.LAVA_FLOW_1) return 3 - (id - B.LAVA_FLOW_3);
  return 0;
}

export function waterWithLevel(level: number): number {
  if (level >= 8) return B.WATER_SRC;
  return B.WATER_FLOW_7 + (7 - Math.max(1, Math.min(7, level)));
}

export function lavaWithLevel(level: number): number {
  if (level >= 8) return B.LAVA_SRC;
  return B.LAVA_FLOW_3 + (3 - Math.max(1, Math.min(3, level)));
}

/** Visual surface height of a fluid cell in [0,1]. */
export function fluidHeight(id: number): number {
  const lv = fluidLevel(id);
  if (lv >= 8) return 0.875;
  return Math.max(0.125, (lv * 2) / 16);
}

export function isChest(id: number): boolean {
  return id >= B.CHEST_N && id <= B.CHEST_W;
}

export function isFurnace(id: number): boolean {
  return id >= B.FURNACE_N && id <= B.FURNACE_LIT_W;
}

export function furnaceLitVariant(id: number, lit: boolean): number {
  if (!isFurnace(id)) return id;
  const face = (id - B.FURNACE_N) % 4;
  return (lit ? B.FURNACE_LIT_N : B.FURNACE_N) + face;
}

/** Is this block a container that opens a UI / accepts hopper transfers? */
export function isContainer(id: number): boolean {
  return isChest(id) || isFurnace(id) || id === B.HOPPER;
}

export function isInteractive(id: number): boolean {
  return isContainer(id) || id === B.CRAFTING_TABLE;
}

export function blockDef(id: number): BlockDef {
  return BLOCKS[id & 0xff];
}
