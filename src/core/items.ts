/**
 * Item registry. Placeable block items share their block ID (< 256);
 * pure items (tools, materials, food) live at IDs >= 256.
 */
import { B, TILE, blockDef } from './blocks';

export const ITEM = {
  STICK: 256,
  COAL: 257,
  CHARCOAL: 258,
  RAW_IRON: 259,
  IRON_INGOT: 260,
  GOLD_INGOT: 261,
  DIAMOND: 262,
  WOOD_PICKAXE: 263,
  IRON_PICKAXE: 264,
  DIAMOND_PICKAXE: 265,
  WOOD_SWORD: 266,
  IRON_SWORD: 267,
  DIAMOND_SWORD: 268,
  RAW_MUTTON: 269,
  COOKED_MUTTON: 270,
  ARROW: 271,
  BUCKET: 272,
  WATER_BUCKET: 273,
  LAVA_BUCKET: 274,
  STONE_PICKAXE: 275,
  STONE_SWORD: 276,
  WOOD_AXE: 277,
  STONE_AXE: 278,
  IRON_AXE: 279,
  DIAMOND_AXE: 280,
  WOOD_SHOVEL: 281,
  STONE_SHOVEL: 282,
  IRON_SHOVEL: 283,
  DIAMOND_SHOVEL: 284,
} as const;

export interface ItemDef {
  id: number;
  name: string;
  maxStack: number;
  /** Atlas tile used for the UI icon / held sprite. */
  icon: number;
  /** Block placed on right-click (undefined for pure items). */
  block?: number;
  tool?: {
    type: 'pickaxe' | 'sword' | 'axe' | 'shovel' | 'hoe';
    tier: number; // 1 wood, 2 iron, 3 diamond
    speed: number; // mining speed multiplier
    damage: number; // attack damage (hearts*2)
    durability: number;
  };
  /** HP restored when eaten. */
  food?: number;
  /** Furnace fuel burn duration in game ticks. */
  fuelTicks?: number;
}

const REGISTRY = new Map<number, ItemDef>();

function defItem(d: ItemDef): void {
  REGISTRY.set(d.id, d);
}

// --- Pure items -------------------------------------------------------------
defItem({ id: ITEM.STICK, name: 'Stick', maxStack: 64, icon: TILE.ITEM_STICK, fuelTicks: 100 });
defItem({ id: ITEM.COAL, name: 'Coal', maxStack: 64, icon: TILE.ITEM_COAL, fuelTicks: 1600 });
defItem({ id: ITEM.CHARCOAL, name: 'Charcoal', maxStack: 64, icon: TILE.ITEM_CHARCOAL, fuelTicks: 1600 });
defItem({ id: ITEM.RAW_IRON, name: 'Raw Iron', maxStack: 64, icon: TILE.ITEM_RAW_IRON });
defItem({ id: ITEM.IRON_INGOT, name: 'Iron Ingot', maxStack: 64, icon: TILE.ITEM_IRON_INGOT });
defItem({ id: ITEM.GOLD_INGOT, name: 'Gold Ingot', maxStack: 64, icon: TILE.ITEM_GOLD_INGOT });
defItem({ id: ITEM.DIAMOND, name: 'Diamond', maxStack: 64, icon: TILE.ITEM_DIAMOND });
defItem({
  id: ITEM.WOOD_PICKAXE, name: 'Wooden Pickaxe', maxStack: 1, icon: TILE.ITEM_PICK_WOOD,
  tool: { type: 'pickaxe', tier: 1, speed: 2, damage: 2, durability: 60 }, fuelTicks: 200,
});
defItem({
  id: ITEM.IRON_PICKAXE, name: 'Iron Pickaxe', maxStack: 1, icon: TILE.ITEM_PICK_IRON,
  tool: { type: 'pickaxe', tier: 3, speed: 6, damage: 3, durability: 250 },
});
defItem({
  id: ITEM.DIAMOND_PICKAXE, name: 'Diamond Pickaxe', maxStack: 1, icon: TILE.ITEM_PICK_DIAMOND,
  tool: { type: 'pickaxe', tier: 4, speed: 8, damage: 4, durability: 1561 },
});
defItem({
  id: ITEM.WOOD_SWORD, name: 'Wooden Sword', maxStack: 1, icon: TILE.ITEM_SWORD_WOOD,
  tool: { type: 'sword', tier: 1, speed: 1.5, damage: 5, durability: 60 }, fuelTicks: 200,
});
defItem({
  id: ITEM.IRON_SWORD, name: 'Iron Sword', maxStack: 1, icon: TILE.ITEM_SWORD_IRON,
  tool: { type: 'sword', tier: 3, speed: 1.5, damage: 7, durability: 250 },
});
defItem({
  id: ITEM.DIAMOND_SWORD, name: 'Diamond Sword', maxStack: 1, icon: TILE.ITEM_SWORD_DIAMOND,
  tool: { type: 'sword', tier: 4, speed: 1.5, damage: 8, durability: 1561 },
});
defItem({ id: ITEM.RAW_MUTTON, name: 'Raw Mutton', maxStack: 64, icon: TILE.ITEM_MUTTON_RAW, food: 4 });
defItem({ id: ITEM.COOKED_MUTTON, name: 'Cooked Mutton', maxStack: 64, icon: TILE.ITEM_MUTTON_COOKED, food: 12 });
defItem({ id: ITEM.ARROW, name: 'Arrow', maxStack: 64, icon: TILE.ITEM_ARROW });
defItem({ id: ITEM.BUCKET, name: 'Bucket', maxStack: 16, icon: TILE.ITEM_BUCKET });
defItem({ id: ITEM.WATER_BUCKET, name: 'Water Bucket', maxStack: 1, icon: TILE.ITEM_WATER_BUCKET });
defItem({ id: ITEM.LAVA_BUCKET, name: 'Lava Bucket', maxStack: 1, icon: TILE.ITEM_LAVA_BUCKET });

// Stone-tier pick/sword + full axe & shovel sets (tiers 1 wood, 2 stone,
// 3 iron, 4 diamond). speed/damage/durability scale with the tier.
defItem({
  id: ITEM.STONE_PICKAXE, name: 'Stone Pickaxe', maxStack: 1, icon: TILE.ITEM_PICK_STONE,
  tool: { type: 'pickaxe', tier: 2, speed: 4, damage: 3, durability: 132 },
});
defItem({
  id: ITEM.STONE_SWORD, name: 'Stone Sword', maxStack: 1, icon: TILE.ITEM_SWORD_STONE,
  tool: { type: 'sword', tier: 2, speed: 1.5, damage: 6, durability: 132 },
});
const TIER_SPEED = [0, 2, 4, 6, 8];
const TIER_DUR = [0, 60, 132, 250, 1561];
const TIER_NAME = ['', 'Wooden', 'Stone', 'Iron', 'Diamond'];
for (const [type, ids, icons, dmg] of [
  ['axe', [ITEM.WOOD_AXE, ITEM.STONE_AXE, ITEM.IRON_AXE, ITEM.DIAMOND_AXE],
    [TILE.ITEM_AXE_WOOD, TILE.ITEM_AXE_STONE, TILE.ITEM_AXE_IRON, TILE.ITEM_AXE_DIAMOND], [6, 7, 8, 9]],
  ['shovel', [ITEM.WOOD_SHOVEL, ITEM.STONE_SHOVEL, ITEM.IRON_SHOVEL, ITEM.DIAMOND_SHOVEL],
    [TILE.ITEM_SHOVEL_WOOD, TILE.ITEM_SHOVEL_STONE, TILE.ITEM_SHOVEL_IRON, TILE.ITEM_SHOVEL_DIAMOND], [3, 4, 5, 6]],
] as const) {
  for (let t = 1; t <= 4; t++) {
    defItem({
      id: ids[t - 1],
      name: `${TIER_NAME[t]} ${type === 'axe' ? 'Axe' : 'Shovel'}`,
      maxStack: 1,
      icon: icons[t - 1],
      tool: { type, tier: t, speed: TIER_SPEED[t], damage: dmg[t - 1], durability: TIER_DUR[t] },
      fuelTicks: t === 1 ? 200 : undefined,
    });
  }
}

// --- Block items ------------------------------------------------------------
const BLOCK_ITEM_NAMES: Record<number, string | undefined> = {};
const BLOCK_FUEL: Record<number, number> = {
  [B.OAK_PLANKS]: 300,
  [B.BIRCH_PLANKS]: 300,
  [B.OAK_LOG]: 300,
  [B.BIRCH_LOG]: 300,
  [B.CRAFTING_TABLE]: 300,
  [B.CHEST_N]: 300,
  [B.COAL_BLOCK]: 16000,
};

export function itemDef(id: number): ItemDef {
  let d = REGISTRY.get(id);
  if (!d) {
    const bd = blockDef(id);
    d = {
      id,
      name: BLOCK_ITEM_NAMES[id] ?? bd.name,
      maxStack: 64,
      icon: blockIcon(id),
      block: id,
      fuelTicks: BLOCK_FUEL[id],
    };
    REGISTRY.set(id, d);
  }
  return d;
}

function blockIcon(id: number): number {
  const bd = blockDef(id);
  // Use the side (+Z) tile for most blocks, top tile for grass-like looks.
  if (id === B.GRASS || id === B.SNOW_GRASS) return bd.tiles[4];
  return bd.tiles[4];
}

export function isTool(id: number): boolean {
  return itemDef(id).tool !== undefined;
}

export function isPlaceable(id: number): boolean {
  return id > 0 && id < 256;
}

/** Item stack as stored in inventories. `dur` only present on tools. */
export interface ItemStack {
  id: number;
  count: number;
  dur?: number;
}

export function makeStack(id: number, count: number): ItemStack {
  const d = itemDef(id);
  const s: ItemStack = { id, count };
  if (d.tool) s.dur = d.tool.durability;
  return s;
}
