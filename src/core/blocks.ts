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
  STONE_BRICKS: 69,
  CRACKED_STONE_BRICKS: 70,
  CHISELED_STONE_BRICKS: 71,
  GRANITE: 72,
  DIORITE: 73,
  ANDESITE: 74,
  BIRCH_PLANKS: 75,
  OBSIDIAN: 76,
  COAL_BLOCK: 77,
  GOLD_BLOCK: 78,
  DIAMOND_BLOCK: 79,
  ITEM_BUCKET: 80,
  ITEM_WATER_BUCKET: 81,
  ITEM_LAVA_BUCKET: 82,
  ITEM_PICK_STONE: 83,
  ITEM_SWORD_STONE: 84,
  ITEM_AXE_WOOD: 85,
  ITEM_AXE_STONE: 86,
  ITEM_AXE_IRON: 87,
  ITEM_AXE_DIAMOND: 88,
  ITEM_SHOVEL_WOOD: 89,
  ITEM_SHOVEL_STONE: 90,
  ITEM_SHOVEL_IRON: 91,
  ITEM_SHOVEL_DIAMOND: 92,
  ITEM_BOAT: 93,
  BED_TOP: 94,
  BED_SIDE: 95,
  ITEM_BEEF: 96,
  ITEM_BEEF_COOKED: 97,
  ITEM_PORKCHOP: 98,
  ITEM_PORKCHOP_COOKED: 99,
  ITEM_CHICKEN_RAW: 100,
  ITEM_CHICKEN_COOKED: 101,
  ITEM_LEATHER: 102,
  ITEM_FEATHER: 103,
  ITEM_HELMET_LEATHER: 104,
  ITEM_CHEST_LEATHER: 105,
  ITEM_LEGS_LEATHER: 106,
  ITEM_BOOTS_LEATHER: 107,
  ITEM_HELMET_IRON: 108,
  ITEM_CHEST_IRON: 109,
  ITEM_LEGS_IRON: 110,
  ITEM_BOOTS_IRON: 111,
  ITEM_HELMET_DIAMOND: 112,
  ITEM_CHEST_DIAMOND: 113,
  ITEM_LEGS_DIAMOND: 114,
  ITEM_BOOTS_DIAMOND: 115,
  ENCHANT_TOP: 116,
  ENCHANT_SIDE: 117,
  REDSTONE_ORE: 118,
  REDSTONE_WIRE_T: 119,
  REDSTONE_WIRE_ON_T: 120,
  LEVER_T: 121,
  LEVER_ON_T: 122,
  PLATE_T: 123,
  REDSTONE_LAMP_T: 124,
  REDSTONE_LAMP_ON_T: 125,
  REDSTONE_BLOCK_T: 126,
  DOOR_BOTTOM_T: 127,
  DOOR_TOP_T: 128,
  TRAPDOOR_T: 129,
  PISTON_SIDE: 130,
  PISTON_BACK: 131,
  PISTON_FRONT: 132,
  PISTON_OPEN: 133,
  ITEM_REDSTONE: 134,
  ITEM_DOOR: 135,
  NETHERRACK_T: 136,
  SOUL_SAND_T: 137,
  PORTAL_T: 138,
  MAGMA_T: 139,
  ITEM_FLINT: 140,
  ITEM_FLINT_STEEL: 141,
  // Biome blocks (V3): swamp / cherry / jungle / spruce / ice / lily.
  SWAMP_GRASS_TOP: 142,
  SWAMP_GRASS_SIDE: 143,
  CHERRY_LOG_SIDE: 144,
  CHERRY_LOG_TOP: 145,
  CHERRY_LEAVES: 146,
  CHERRY_PLANKS: 147,
  JUNGLE_LOG_SIDE: 148,
  JUNGLE_LOG_TOP: 149,
  JUNGLE_LEAVES: 150,
  JUNGLE_PLANKS: 151,
  SPRUCE_LOG_SIDE: 152,
  SPRUCE_LOG_TOP: 153,
  SPRUCE_LEAVES: 154,
  SPRUCE_PLANKS: 155,
  ICE: 156,
  LILY_PAD: 157,
  // Biome blocks (V4): savanna / dark forest / badlands / taiga / mushroom.
  ACACIA_LOG_SIDE: 158,
  ACACIA_LOG_TOP: 159,
  ACACIA_LEAVES: 160,
  ACACIA_PLANKS: 161,
  DARK_OAK_LOG_SIDE: 162,
  DARK_OAK_LOG_TOP: 163,
  DARK_OAK_LEAVES: 164,
  DARK_OAK_PLANKS: 165,
  RED_SAND: 166,
  TERRACOTTA: 167,
  TERRACOTTA_ORANGE: 168,
  TERRACOTTA_RED: 169,
  TERRACOTTA_WHITE: 170,
  TERRACOTTA_YELLOW: 171,
  PODZOL_TOP: 172,
  PODZOL_SIDE: 173,
  MYCELIUM_TOP: 174,
  MYCELIUM_SIDE: 175,
  PACKED_ICE: 176,
  MUSHROOM_STEM: 177,
  MUSHROOM_CAP_RED: 178,
  MUSHROOM_CAP_BROWN: 179,
  RED_MUSHROOM: 180,
  BROWN_MUSHROOM: 181,
  DEAD_BUSH: 182,
  FERN: 183,
  FLOWER_BLUE: 184,
  FLOWER_WHITE: 185,
  EMERALD_ORE: 186,
  ITEM_EMERALD: 187,
  COARSE_DIRT: 188,
} as const;

export const ATLAS_TILES = 32; // 32x32 grid of tiles
export const TILE_PX = 16; // painted tile resolution (authentic 16x16)
export const TILE_GUTTER = 8; // replicated-edge padding around each tile (mipmap-safe)
export const CELL_PX = TILE_PX + TILE_GUTTER * 2; // 32px atlas cell
export const ATLAS_SIZE = ATLAS_TILES * CELL_PX; // 1024px (power-of-two for mipmaps)

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
  // Additional building/decorative blocks.
  STONE_BRICKS: 56,
  CRACKED_STONE_BRICKS: 57,
  CHISELED_STONE_BRICKS: 58,
  GRANITE: 59,
  DIORITE: 60,
  ANDESITE: 61,
  BIRCH_PLANKS: 62,
  OBSIDIAN: 63,
  COAL_BLOCK: 64,
  GOLD_BLOCK: 65,
  DIAMOND_BLOCK: 66,
  BED: 67,
  ENCHANTING_TABLE: 68,
  // Redstone-lite (Phase 4). ON/OFF variants are distinct ids so the whole
  // signal state flows through the ordinary block pipeline (mesh + light +
  // persistence journal) with zero extra metadata.
  REDSTONE_ORE: 69,
  REDSTONE_WIRE: 70,
  REDSTONE_WIRE_ON: 71,
  LEVER: 72,
  LEVER_ON: 73,
  PRESSURE_PLATE: 74,
  PRESSURE_PLATE_ON: 75,
  REDSTONE_LAMP: 76,
  REDSTONE_LAMP_ON: 77,
  REDSTONE_BLOCK: 78,
  DOOR_BOTTOM: 79,
  DOOR_TOP: 80,
  DOOR_BOTTOM_OPEN: 81,
  DOOR_TOP_OPEN: 82,
  TRAPDOOR: 83,
  TRAPDOOR_OPEN: 84,
  // Pistons: 4 horizontal facings (N,S,E,W like furnaces), plus the extended
  // base and the pushed-out head as separate blocks.
  PISTON_N: 85,
  PISTON_S: 86,
  PISTON_E: 87,
  PISTON_W: 88,
  PISTON_EXT_N: 89,
  PISTON_EXT_S: 90,
  PISTON_EXT_E: 91,
  PISTON_EXT_W: 92,
  PISTON_HEAD_N: 93,
  PISTON_HEAD_S: 94,
  PISTON_HEAD_E: 95,
  PISTON_HEAD_W: 96,
  // Nether dimension (Phase 4)
  NETHERRACK: 97,
  SOUL_SAND: 98,
  NETHER_PORTAL: 99,
  MAGMA: 100,
  // Biome blocks (V3): swamp / cherry / jungle / spruce woods, ice, snow, lily.
  SWAMP_GRASS: 101,
  CHERRY_LOG: 102,
  CHERRY_LEAVES: 103,
  CHERRY_PLANKS: 104,
  JUNGLE_LOG: 105,
  JUNGLE_LEAVES: 106,
  JUNGLE_PLANKS: 107,
  SPRUCE_LOG: 108,
  SPRUCE_LEAVES: 109,
  SPRUCE_PLANKS: 110,
  ICE: 111,
  SNOW_BLOCK: 112,
  LILY_PAD: 113,
  // Biome blocks (V4): savanna / dark forest / badlands / taiga / mushroom.
  ACACIA_LOG: 114,
  ACACIA_LEAVES: 115,
  ACACIA_PLANKS: 116,
  DARK_OAK_LOG: 117,
  DARK_OAK_LEAVES: 118,
  DARK_OAK_PLANKS: 119,
  RED_SAND: 120,
  TERRACOTTA: 121,
  TERRACOTTA_ORANGE: 122,
  TERRACOTTA_RED: 123,
  TERRACOTTA_WHITE: 124,
  TERRACOTTA_YELLOW: 125,
  PODZOL: 126,
  MYCELIUM: 127,
  PACKED_ICE: 128,
  MUSHROOM_STEM: 129,
  MUSHROOM_CAP_RED: 130,
  MUSHROOM_CAP_BROWN: 131,
  RED_MUSHROOM: 132,
  BROWN_MUSHROOM: 133,
  DEAD_BUSH: 134,
  FERN: 135,
  FLOWER_BLUE: 136,
  FLOWER_WHITE: 137,
  EMERALD_ORE: 138,
  COARSE_DIRT: 139,
} as const;

export type BlockId = number;

export const enum RenderType {
  NONE = 0,
  SOLID = 1, // opaque cube
  CUTOUT = 2, // cube with alpha-tested holes (leaves, glass)
  CROSS = 3, // X-shaped pair of quads (plants, torch)
  FLUID = 4, // water / lava with level-based height
  BOX = 5, // one or more partial cuboids (doors, plates, piston heads, wire)
}

/** Partial cuboid in block-local coords: [x0, y0, z0, x1, y1, z1] in 0..1. */
export type BlockBox = readonly [number, number, number, number, number, number];

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
  tool: 'pickaxe' | 'sword' | 'axe' | 'shovel' | 'hoe' | 'none';
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
  /** Partial cuboids for RenderType.BOX blocks. */
  boxes?: ReadonlyArray<BlockBox>;
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
def(B.GRASS, 'Grass Block', tileTSB(TILE.GRASS_TOP, TILE.GRASS_SIDE, TILE.DIRT), { hardness: 0.6, tool: 'shovel', drop: B.DIRT, randomTicks: true });
def(B.DIRT, 'Dirt', tile6(TILE.DIRT), { hardness: 0.5, tool: 'shovel' });
def(B.COBBLESTONE, 'Cobblestone', tile6(TILE.COBBLESTONE), { hardness: 2, tool: 'pickaxe', minTier: 1 });
def(B.OAK_PLANKS, 'Oak Planks', tile6(TILE.OAK_PLANKS), { hardness: 2, tool: 'axe' });
def(B.BEDROCK, 'Bedrock', tile6(TILE.BEDROCK), { hardness: -1 });
def(B.SAND, 'Sand', tile6(TILE.SAND), { hardness: 0.5, tool: 'shovel' });
def(B.GRAVEL, 'Gravel', tile6(TILE.GRAVEL), { hardness: 0.6, tool: 'shovel' });
def(B.OAK_LOG, 'Oak Log', tileTSB(TILE.OAK_LOG_TOP, TILE.OAK_LOG_SIDE, TILE.OAK_LOG_TOP), { hardness: 2, tool: 'axe' });
def(B.OAK_LEAVES, 'Oak Leaves', tile6(TILE.OAK_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.BIRCH_LOG, 'Birch Log', tileTSB(TILE.OAK_LOG_TOP, TILE.BIRCH_LOG_SIDE, TILE.OAK_LOG_TOP), { hardness: 2, tool: 'axe' });
def(B.BIRCH_LEAVES, 'Birch Leaves', tile6(TILE.BIRCH_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.COAL_ORE, 'Coal Ore', tile6(TILE.COAL_ORE), { hardness: 3, tool: 'pickaxe', minTier: 1, drop: 256 + 1 /* ITEM.COAL */ });
def(B.IRON_ORE, 'Iron Ore', tile6(TILE.IRON_ORE), { hardness: 3, tool: 'pickaxe', minTier: 1, drop: 256 + 3 /* ITEM.RAW_IRON */ });
def(B.GOLD_ORE, 'Gold Ore', tile6(TILE.GOLD_ORE), { hardness: 3, tool: 'pickaxe', minTier: 3, drop: B.GOLD_ORE });
def(B.DIAMOND_ORE, 'Diamond Ore', tile6(TILE.DIAMOND_ORE), { hardness: 3, tool: 'pickaxe', minTier: 3, drop: 256 + 6 /* ITEM.DIAMOND */ });
def(B.SANDSTONE, 'Sandstone', tileTSB(TILE.SANDSTONE_TOP, TILE.SANDSTONE_SIDE, TILE.SANDSTONE_TOP), { hardness: 0.8, tool: 'pickaxe', minTier: 1 });
def(B.MOSSY_COBBLESTONE, 'Mossy Cobblestone', tile6(TILE.MOSSY_COBBLESTONE), { hardness: 2, tool: 'pickaxe', minTier: 1 });
def(B.GLASS, 'Glass', tile6(TILE.GLASS), { opaque: false, renderType: RenderType.CUTOUT, hardness: 0.3, drop: -1, lightFilter: 0 });
def(B.SNOW_GRASS, 'Snowy Grass', tileTSB(TILE.SNOW_TOP, TILE.SNOW_SIDE, TILE.DIRT), { hardness: 0.6, tool: 'shovel', drop: B.DIRT });
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
], { hardness: 2.5, tool: 'axe' });

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
def(B.CHEST_N, 'Chest', chestTiles('n'), { hardness: 2.5, tool: 'axe' });
def(B.CHEST_S, 'Chest', chestTiles('s'), { hardness: 2.5, tool: 'axe', drop: B.CHEST_N });
def(B.CHEST_E, 'Chest', chestTiles('e'), { hardness: 2.5, tool: 'axe', drop: B.CHEST_N });
def(B.CHEST_W, 'Chest', chestTiles('w'), { hardness: 2.5, tool: 'axe', drop: B.CHEST_N });

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
def(B.STONE_BRICKS, 'Stone Bricks', tile6(TILE.STONE_BRICKS), { hardness: 1.5, tool: 'pickaxe', minTier: 1 });
def(B.CRACKED_STONE_BRICKS, 'Cracked Stone Bricks', tile6(TILE.CRACKED_STONE_BRICKS), { hardness: 1.5, tool: 'pickaxe', minTier: 1 });
def(B.CHISELED_STONE_BRICKS, 'Chiseled Stone Bricks', tile6(TILE.CHISELED_STONE_BRICKS), { hardness: 1.5, tool: 'pickaxe', minTier: 1 });
def(B.GRANITE, 'Granite', tile6(TILE.GRANITE), { hardness: 1.5, tool: 'pickaxe', minTier: 1, drop: B.GRANITE });
def(B.DIORITE, 'Diorite', tile6(TILE.DIORITE), { hardness: 1.5, tool: 'pickaxe', minTier: 1, drop: B.DIORITE });
def(B.ANDESITE, 'Andesite', tile6(TILE.ANDESITE), { hardness: 1.5, tool: 'pickaxe', minTier: 1, drop: B.ANDESITE });
def(B.BIRCH_PLANKS, 'Birch Planks', tile6(TILE.BIRCH_PLANKS), { hardness: 2, tool: 'axe' });
def(B.OBSIDIAN, 'Obsidian', tile6(TILE.OBSIDIAN), { hardness: 25, tool: 'pickaxe', minTier: 4 });
def(B.COAL_BLOCK, 'Block of Coal', tile6(TILE.COAL_BLOCK), { hardness: 2.5, tool: 'pickaxe', minTier: 1 });
def(B.GOLD_BLOCK, 'Block of Gold', tile6(TILE.GOLD_BLOCK), { hardness: 3, tool: 'pickaxe', minTier: 3 });
def(B.DIAMOND_BLOCK, 'Block of Diamond', tile6(TILE.DIAMOND_BLOCK), { hardness: 5, tool: 'pickaxe', minTier: 3 });
def(B.BED, 'Bed', tileTSB(TILE.BED_TOP, TILE.BED_SIDE, TILE.OAK_PLANKS), { hardness: 0.4, tool: 'axe' });
def(B.ENCHANTING_TABLE, 'Enchanting Table', tileTSB(TILE.ENCHANT_TOP, TILE.ENCHANT_SIDE, TILE.OBSIDIAN), {
  hardness: 4, tool: 'pickaxe', minTier: 1, lightEmit: 7,
});

// --- Redstone-lite ----------------------------------------------------------
def(B.REDSTONE_ORE, 'Redstone Ore', tile6(TILE.REDSTONE_ORE), {
  hardness: 3, tool: 'pickaxe', minTier: 2, drop: 256 + 50 /* ITEM.REDSTONE */, dropCount: [1, 4],
});
const wireDef = {
  solid: false, opaque: false, renderType: RenderType.BOX as RenderType,
  hardness: 0.02, drop: 256 + 50 /* ITEM.REDSTONE */, lightFilter: 0,
  boxes: [[0, 0, 0, 1, 0.04, 1]] as BlockBox[],
};
def(B.REDSTONE_WIRE, 'Redstone Dust', tile6(TILE.REDSTONE_WIRE_T), wireDef);
def(B.REDSTONE_WIRE_ON, 'Redstone Dust', tile6(TILE.REDSTONE_WIRE_ON_T), { ...wireDef, lightEmit: 3 });
def(B.LEVER, 'Lever', tile6(TILE.LEVER_T), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.1, lightFilter: 0,
});
def(B.LEVER_ON, 'Lever', tile6(TILE.LEVER_ON_T), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.1, drop: B.LEVER, lightFilter: 0,
});
const plateDef = {
  solid: false, opaque: false, renderType: RenderType.BOX as RenderType,
  hardness: 0.4, tool: 'axe' as const, drop: B.PRESSURE_PLATE, lightFilter: 0,
};
def(B.PRESSURE_PLATE, 'Pressure Plate', tile6(TILE.PLATE_T), {
  ...plateDef, boxes: [[0.0625, 0, 0.0625, 0.9375, 0.05, 0.9375]],
});
def(B.PRESSURE_PLATE_ON, 'Pressure Plate', tile6(TILE.PLATE_T), {
  ...plateDef, boxes: [[0.0625, 0, 0.0625, 0.9375, 0.025, 0.9375]],
});
def(B.REDSTONE_LAMP, 'Redstone Lamp', tile6(TILE.REDSTONE_LAMP_T), { hardness: 0.6 });
def(B.REDSTONE_LAMP_ON, 'Redstone Lamp', tile6(TILE.REDSTONE_LAMP_ON_T), {
  hardness: 0.6, drop: B.REDSTONE_LAMP, lightEmit: 15,
});
def(B.REDSTONE_BLOCK, 'Block of Redstone', tile6(TILE.REDSTONE_BLOCK_T), { hardness: 2.5, tool: 'pickaxe', minTier: 1 });

// Doors are two stacked BOX panels; the open variants swing the panel onto
// the X axis and stop colliding. Both halves drop a single door item.
const doorDef = {
  opaque: false, renderType: RenderType.BOX as RenderType,
  hardness: 2, tool: 'axe' as const, drop: 256 + 51 /* ITEM.DOOR */, lightFilter: 0,
};
const DOOR_CLOSED: BlockBox[] = [[0, 0, 0, 1, 1, 0.19]];
const DOOR_OPEN: BlockBox[] = [[0, 0, 0, 0.19, 1, 1]];
def(B.DOOR_BOTTOM, 'Door', tile6(TILE.DOOR_BOTTOM_T), { ...doorDef, boxes: DOOR_CLOSED });
def(B.DOOR_TOP, 'Door', tile6(TILE.DOOR_TOP_T), { ...doorDef, drop: -1, boxes: DOOR_CLOSED });
def(B.DOOR_BOTTOM_OPEN, 'Door', tile6(TILE.DOOR_BOTTOM_T), { ...doorDef, solid: false, boxes: DOOR_OPEN });
def(B.DOOR_TOP_OPEN, 'Door', tile6(TILE.DOOR_TOP_T), { ...doorDef, solid: false, drop: -1, boxes: DOOR_OPEN });
def(B.TRAPDOOR, 'Trapdoor', tile6(TILE.TRAPDOOR_T), {
  opaque: false, renderType: RenderType.BOX, hardness: 2, tool: 'axe', lightFilter: 0,
  boxes: [[0, 0.84, 0, 1, 1, 1]],
});
def(B.TRAPDOOR_OPEN, 'Trapdoor', tile6(TILE.TRAPDOOR_T), {
  solid: false, opaque: false, renderType: RenderType.BOX, hardness: 2, tool: 'axe',
  drop: B.TRAPDOOR, lightFilter: 0, boxes: [[0, 0, 0.84, 1, 1, 1]],
});

// Pistons. Tile order per face: [+X(E), -X(W), top, bottom, +Z(S), -Z(N)].
function pistonTiles(face: 'n' | 's' | 'e' | 'w', front: number): [number, number, number, number, number, number] {
  const S = TILE.PISTON_SIDE;
  const K = TILE.PISTON_BACK;
  if (face === 'n') return [S, S, S, S, K, front];
  if (face === 's') return [S, S, S, S, front, K];
  if (face === 'e') return [front, K, S, S, S, S];
  return [K, front, S, S, S, S];
}
const FACES4 = ['n', 's', 'e', 'w'] as const;
// Extended base body: the front quarter is vacated for the head's arm.
const EXT_BODY: Record<(typeof FACES4)[number], BlockBox[]> = {
  n: [[0, 0, 0.25, 1, 1, 1]],
  s: [[0, 0, 0, 1, 1, 0.75]],
  e: [[0, 0, 0, 0.75, 1, 1]],
  w: [[0.25, 0, 0, 1, 1, 1]],
};
// Head: face plate at the far side + arm reaching back into the base.
const HEAD_BODY: Record<(typeof FACES4)[number], BlockBox[]> = {
  n: [[0, 0, 0, 1, 1, 0.25], [0.375, 0.375, 0.25, 0.625, 0.625, 1]],
  s: [[0, 0, 0.75, 1, 1, 1], [0.375, 0.375, 0, 0.625, 0.625, 0.75]],
  e: [[0.75, 0, 0, 1, 1, 1], [0, 0.375, 0.375, 0.75, 0.625, 0.625]],
  w: [[0, 0, 0, 0.25, 1, 1], [0.25, 0.375, 0.375, 1, 0.625, 0.625]],
};
for (let i = 0; i < 4; i++) {
  const face = FACES4[i];
  def(B.PISTON_N + i, 'Piston', pistonTiles(face, TILE.PISTON_FRONT), {
    hardness: 1.5, drop: B.PISTON_N,
  });
  def(B.PISTON_EXT_N + i, 'Piston', pistonTiles(face, TILE.PISTON_OPEN), {
    opaque: false, renderType: RenderType.BOX, hardness: 1.5, drop: B.PISTON_N,
    lightFilter: 0, boxes: EXT_BODY[face],
  });
  def(B.PISTON_HEAD_N + i, 'Piston Head', pistonTiles(face, TILE.PISTON_FRONT), {
    opaque: false, renderType: RenderType.BOX, hardness: 1.5, drop: -1,
    lightFilter: 0, boxes: HEAD_BODY[face],
  });
}

// --- Nether -------------------------------------------------------------
def(B.NETHERRACK, 'Netherrack', tile6(TILE.NETHERRACK_T), { hardness: 0.4, tool: 'pickaxe', minTier: 1 });
def(B.SOUL_SAND, 'Soul Sand', tile6(TILE.SOUL_SAND_T), { hardness: 0.5, tool: 'shovel' });
def(B.NETHER_PORTAL, 'Nether Portal', tile6(TILE.PORTAL_T), {
  solid: false, opaque: false, renderType: RenderType.BOX, hardness: 0.1, drop: -1,
  lightEmit: 11, lightFilter: 0, boxes: [[0.25, 0, 0.25, 0.75, 1, 0.75]],
});
def(B.MAGMA, 'Magma Block', tile6(TILE.MAGMA_T), {
  hardness: 0.5, tool: 'pickaxe', minTier: 1, lightEmit: 3,
});

// --- Biome blocks (V3) ------------------------------------------------------
def(B.SWAMP_GRASS, 'Swamp Grass', tileTSB(TILE.SWAMP_GRASS_TOP, TILE.SWAMP_GRASS_SIDE, TILE.DIRT), {
  hardness: 0.6, tool: 'shovel', drop: B.DIRT, randomTicks: true,
});
def(B.CHERRY_LOG, 'Cherry Log', tileTSB(TILE.CHERRY_LOG_TOP, TILE.CHERRY_LOG_SIDE, TILE.CHERRY_LOG_TOP), { hardness: 2, tool: 'axe' });
def(B.CHERRY_LEAVES, 'Cherry Leaves', tile6(TILE.CHERRY_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.CHERRY_PLANKS, 'Cherry Planks', tile6(TILE.CHERRY_PLANKS), { hardness: 2, tool: 'axe' });
def(B.JUNGLE_LOG, 'Jungle Log', tileTSB(TILE.JUNGLE_LOG_TOP, TILE.JUNGLE_LOG_SIDE, TILE.JUNGLE_LOG_TOP), { hardness: 2, tool: 'axe' });
def(B.JUNGLE_LEAVES, 'Jungle Leaves', tile6(TILE.JUNGLE_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.JUNGLE_PLANKS, 'Jungle Planks', tile6(TILE.JUNGLE_PLANKS), { hardness: 2, tool: 'axe' });
def(B.SPRUCE_LOG, 'Spruce Log', tileTSB(TILE.SPRUCE_LOG_TOP, TILE.SPRUCE_LOG_SIDE, TILE.SPRUCE_LOG_TOP), { hardness: 2, tool: 'axe' });
def(B.SPRUCE_LEAVES, 'Spruce Leaves', tile6(TILE.SPRUCE_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.SPRUCE_PLANKS, 'Spruce Planks', tile6(TILE.SPRUCE_PLANKS), { hardness: 2, tool: 'axe' });
def(B.ICE, 'Ice', tile6(TILE.ICE), { hardness: 0.5, tool: 'pickaxe', drop: -1 });
def(B.SNOW_BLOCK, 'Snow Block', tile6(TILE.SNOW_TOP), { hardness: 0.6, tool: 'shovel' });
def(B.LILY_PAD, 'Lily Pad', tile6(TILE.LILY_PAD), {
  solid: false, opaque: false, renderType: RenderType.BOX, hardness: 0.05, lightFilter: 0,
  boxes: [[0, 0, 0, 1, 0.0625, 1]],
});

// --- Biome blocks (V4) ------------------------------------------------------
def(B.ACACIA_LOG, 'Acacia Log', tileTSB(TILE.ACACIA_LOG_TOP, TILE.ACACIA_LOG_SIDE, TILE.ACACIA_LOG_TOP), { hardness: 2, tool: 'axe' });
def(B.ACACIA_LEAVES, 'Acacia Leaves', tile6(TILE.ACACIA_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.ACACIA_PLANKS, 'Acacia Planks', tile6(TILE.ACACIA_PLANKS), { hardness: 2, tool: 'axe' });
def(B.DARK_OAK_LOG, 'Dark Oak Log', tileTSB(TILE.DARK_OAK_LOG_TOP, TILE.DARK_OAK_LOG_SIDE, TILE.DARK_OAK_LOG_TOP), { hardness: 2, tool: 'axe' });
def(B.DARK_OAK_LEAVES, 'Dark Oak Leaves', tile6(TILE.DARK_OAK_LEAVES), {
  opaque: false, renderType: RenderType.CUTOUT, hardness: 0.2, drop: -1, lightFilter: 1, randomTicks: true,
});
def(B.DARK_OAK_PLANKS, 'Dark Oak Planks', tile6(TILE.DARK_OAK_PLANKS), { hardness: 2, tool: 'axe' });
def(B.RED_SAND, 'Red Sand', tile6(TILE.RED_SAND), { hardness: 0.5, tool: 'shovel' });
def(B.TERRACOTTA, 'Terracotta', tile6(TILE.TERRACOTTA), { hardness: 1.25, tool: 'pickaxe', minTier: 1 });
def(B.TERRACOTTA_ORANGE, 'Orange Terracotta', tile6(TILE.TERRACOTTA_ORANGE), { hardness: 1.25, tool: 'pickaxe', minTier: 1 });
def(B.TERRACOTTA_RED, 'Red Terracotta', tile6(TILE.TERRACOTTA_RED), { hardness: 1.25, tool: 'pickaxe', minTier: 1 });
def(B.TERRACOTTA_WHITE, 'White Terracotta', tile6(TILE.TERRACOTTA_WHITE), { hardness: 1.25, tool: 'pickaxe', minTier: 1 });
def(B.TERRACOTTA_YELLOW, 'Yellow Terracotta', tile6(TILE.TERRACOTTA_YELLOW), { hardness: 1.25, tool: 'pickaxe', minTier: 1 });
def(B.PODZOL, 'Podzol', tileTSB(TILE.PODZOL_TOP, TILE.PODZOL_SIDE, TILE.DIRT), { hardness: 0.5, tool: 'shovel', drop: B.DIRT });
def(B.MYCELIUM, 'Mycelium', tileTSB(TILE.MYCELIUM_TOP, TILE.MYCELIUM_SIDE, TILE.DIRT), { hardness: 0.6, tool: 'shovel', drop: B.DIRT });
def(B.PACKED_ICE, 'Packed Ice', tile6(TILE.PACKED_ICE), { hardness: 0.5, tool: 'pickaxe' });
def(B.MUSHROOM_STEM, 'Mushroom Stem', tile6(TILE.MUSHROOM_STEM), { hardness: 0.2, tool: 'axe' });
def(B.MUSHROOM_CAP_RED, 'Red Mushroom Block', tile6(TILE.MUSHROOM_CAP_RED), { hardness: 0.2, tool: 'axe', drop: B.RED_MUSHROOM });
def(B.MUSHROOM_CAP_BROWN, 'Brown Mushroom Block', tile6(TILE.MUSHROOM_CAP_BROWN), { hardness: 0.2, tool: 'axe', drop: B.BROWN_MUSHROOM });
def(B.RED_MUSHROOM, 'Red Mushroom', tile6(TILE.RED_MUSHROOM), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, lightFilter: 0,
});
def(B.BROWN_MUSHROOM, 'Brown Mushroom', tile6(TILE.BROWN_MUSHROOM), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, lightFilter: 0,
});
def(B.DEAD_BUSH, 'Dead Bush', tile6(TILE.DEAD_BUSH), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, drop: 256 /* ITEM.STICK */, lightFilter: 0, replaceable: true,
});
def(B.FERN, 'Fern', tile6(TILE.FERN), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, drop: -1, lightFilter: 0, replaceable: true,
});
def(B.FLOWER_BLUE, 'Cornflower', tile6(TILE.FLOWER_BLUE), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, lightFilter: 0,
});
def(B.FLOWER_WHITE, 'Oxeye Daisy', tile6(TILE.FLOWER_WHITE), {
  solid: false, opaque: false, renderType: RenderType.CROSS, hardness: 0.05, lightFilter: 0,
});
def(B.EMERALD_ORE, 'Emerald Ore', tile6(TILE.EMERALD_ORE), { hardness: 3, tool: 'pickaxe', minTier: 2, drop: 256 + 54 /* ITEM.EMERALD */ });
def(B.COARSE_DIRT, 'Coarse Dirt', tile6(TILE.COARSE_DIRT), { hardness: 0.5, tool: 'shovel' });

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
  return isContainer(id) || id === B.CRAFTING_TABLE || id === B.BED || id === B.ENCHANTING_TABLE;
}

// ---------------------------------------------------------------------------
// Redstone helpers
// ---------------------------------------------------------------------------
export function isDoor(id: number): boolean {
  return id >= B.DOOR_BOTTOM && id <= B.DOOR_TOP_OPEN;
}

export function isWire(id: number): boolean {
  return id === B.REDSTONE_WIRE || id === B.REDSTONE_WIRE_ON;
}

/** Right-click toggles these directly (no screen). */
export function isToggleable(id: number): boolean {
  return (
    id === B.LEVER || id === B.LEVER_ON ||
    isDoor(id) ||
    id === B.TRAPDOOR || id === B.TRAPDOOR_OPEN
  );
}

export function isPistonBase(id: number): boolean {
  return id >= B.PISTON_N && id <= B.PISTON_EXT_W;
}

export function isPistonHead(id: number): boolean {
  return id >= B.PISTON_HEAD_N && id <= B.PISTON_HEAD_W;
}

/** Facing unit vector for any piston base/ext/head id (N,S,E,W order). */
export function pistonDir(id: number): [number, number] {
  const face = (id - B.PISTON_N) % 4;
  // [dx, dz] for n(-Z), s(+Z), e(+X), w(-X)
  return face === 0 ? [0, -1] : face === 1 ? [0, 1] : face === 2 ? [1, 0] : [-1, 0];
}

/** Needs a solid block below; pops off otherwise (wire, plates, levers). */
export function needsFloorSupport(id: number): boolean {
  return isWire(id) || id === B.PRESSURE_PLATE || id === B.PRESSURE_PLATE_ON ||
    id === B.LEVER || id === B.LEVER_ON || id === B.DOOR_BOTTOM || id === B.DOOR_BOTTOM_OPEN;
}

export function blockDef(id: number): BlockDef {
  return BLOCKS[id & 0xff];
}

// ---------------------------------------------------------------------------
// Selection hitboxes: what the crosshair ray actually tests against.
// Plants, torches and partial blocks get boxes matching their visual size
// instead of the whole voxel cell.
// ---------------------------------------------------------------------------
export const FULL_BOX: BlockBox = [0, 0, 0, 1, 1, 1];

const SELECTION_OVERRIDE: Record<number, BlockBox> = {
  [B.TALL_GRASS]: [0.14, 0, 0.14, 0.86, 0.72, 0.86],
  [B.FLOWER_RED]: [0.26, 0, 0.26, 0.74, 0.62, 0.74],
  [B.FLOWER_YELLOW]: [0.26, 0, 0.26, 0.74, 0.62, 0.74],
  [B.TORCH]: [0.34, 0, 0.34, 0.66, 0.72, 0.66],
  [B.LEVER]: [0.26, 0, 0.26, 0.74, 0.62, 0.74],
  [B.LEVER_ON]: [0.26, 0, 0.26, 0.74, 0.62, 0.74],
  [B.CACTUS]: [0.06, 0, 0.06, 0.94, 1, 0.94],
};

/**
 * Cross-shaped blocks (torches, flowers, grass, levers) are 2D sprites when
 * held, dropped or carried — never little cubes.
 */
export function rendersAsSprite(id: number): boolean {
  return id > 0 && id < 256 && blockDef(id).renderType === RenderType.CROSS;
}

/** Ray-selection bounds for a block id (block-local 0..1 coords). */
export function hitBox(id: number): BlockBox {
  const over = SELECTION_OVERRIDE[id];
  if (over) return over;
  const d = blockDef(id);
  if (d.boxes && d.boxes.length > 0) {
    if (d.boxes.length === 1) return d.boxes[0];
    // Envelope of all partial boxes (piston head plate + arm).
    let [x0, y0, z0, x1, y1, z1] = d.boxes[0];
    for (let i = 1; i < d.boxes.length; i++) {
      const b = d.boxes[i];
      x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); z0 = Math.min(z0, b[2]);
      x1 = Math.max(x1, b[3]); y1 = Math.max(y1, b[4]); z1 = Math.max(z1, b[5]);
    }
    return [x0, y0, z0, x1, y1, z1];
  }
  return FULL_BOX;
}
