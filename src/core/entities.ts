/**
 * Shared entity type table (hitboxes, health, speeds, drops) used by the
 * logic worker simulation and the main-thread renderer.
 */
import { ITEM } from './items';
import { B } from './blocks';

export const enum EntityType {
  ITEM = 0,
  ZOMBIE = 1,
  SKELETON = 2,
  CREEPER = 3,
  SHEEP = 4,
  VILLAGER = 5,
  IRON_GOLEM = 6,
  ARROW = 7,
  COW = 8,
  PIG = 9,
  CHICKEN = 10,
  PIGLIN = 11,
  MAGMA_CUBE = 12,
}

/** Passive farm animals that wander, can be fed and bred. */
export function isFarmAnimal(type: EntityType): boolean {
  return (
    type === EntityType.SHEEP ||
    type === EntityType.COW ||
    type === EntityType.PIG ||
    type === EntityType.CHICKEN
  );
}

export interface EntityDef {
  width: number;
  height: number;
  maxHp: number;
  speed: number; // blocks/sec
  hostile: boolean;
  attackDamage: number;
  attackRange: number;
  /** [itemId, min, max][] */
  drops: ReadonlyArray<readonly [number, number, number]>;
  /** Eye height for line-of-sight raycasts. */
  eye: number;
}

export const ENTITY_DEFS: Record<EntityType, EntityDef> = {
  [EntityType.ITEM]: {
    width: 0.25, height: 0.25, maxHp: 5, speed: 0, hostile: false,
    attackDamage: 0, attackRange: 0, drops: [], eye: 0.125,
  },
  [EntityType.ZOMBIE]: {
    width: 0.6, height: 1.95, maxHp: 20, speed: 2.7, hostile: true,
    attackDamage: 4, attackRange: 1.5, drops: [[B.DIRT, 0, 0]], eye: 1.74,
  },
  [EntityType.SKELETON]: {
    width: 0.6, height: 1.99, maxHp: 20, speed: 3.0, hostile: true,
    attackDamage: 4, attackRange: 12, drops: [[ITEM.ARROW, 0, 2]], eye: 1.74,
  },
  [EntityType.CREEPER]: {
    width: 0.6, height: 1.7, maxHp: 20, speed: 2.6, hostile: true,
    attackDamage: 0, attackRange: 3, drops: [[ITEM.COAL, 0, 2]], eye: 1.45,
  },
  [EntityType.SHEEP]: {
    width: 0.9, height: 1.3, maxHp: 8, speed: 1.6, hostile: false,
    attackDamage: 0, attackRange: 0,
    drops: [[B.WOOL, 1, 1], [ITEM.RAW_MUTTON, 1, 2]], eye: 1.1,
  },
  [EntityType.VILLAGER]: {
    width: 0.6, height: 1.95, maxHp: 20, speed: 2.0, hostile: false,
    attackDamage: 0, attackRange: 0, drops: [], eye: 1.62,
  },
  [EntityType.IRON_GOLEM]: {
    width: 1.4, height: 2.7, maxHp: 100, speed: 2.5, hostile: false,
    attackDamage: 12, attackRange: 2.2,
    drops: [[ITEM.IRON_INGOT, 3, 5], [B.FLOWER_RED, 0, 2]], eye: 2.4,
  },
  [EntityType.ARROW]: {
    width: 0.25, height: 0.25, maxHp: 1, speed: 28, hostile: false,
    attackDamage: 4, attackRange: 0, drops: [], eye: 0.125,
  },
  [EntityType.COW]: {
    width: 0.9, height: 1.4, maxHp: 10, speed: 1.5, hostile: false,
    attackDamage: 0, attackRange: 0,
    drops: [[ITEM.LEATHER, 0, 2], [ITEM.RAW_BEEF, 1, 3]], eye: 1.2,
  },
  [EntityType.PIG]: {
    width: 0.9, height: 0.9, maxHp: 10, speed: 1.7, hostile: false,
    attackDamage: 0, attackRange: 0,
    drops: [[ITEM.RAW_PORKCHOP, 1, 3]], eye: 0.7,
  },
  [EntityType.CHICKEN]: {
    width: 0.4, height: 0.7, maxHp: 4, speed: 1.4, hostile: false,
    attackDamage: 0, attackRange: 0,
    drops: [[ITEM.FEATHER, 0, 2], [ITEM.RAW_CHICKEN, 1, 1]], eye: 0.55,
  },
  // Neutral nether dweller: attacks only when a group member is struck.
  [EntityType.PIGLIN]: {
    width: 0.6, height: 1.95, maxHp: 16, speed: 2.9, hostile: false,
    attackDamage: 5, attackRange: 1.6,
    drops: [[ITEM.RAW_PORKCHOP, 1, 2], [ITEM.GOLD_INGOT, 0, 1]], eye: 1.74,
  },
  // Bouncing lava slime; immune to fire, hits on contact.
  [EntityType.MAGMA_CUBE]: {
    width: 1.0, height: 1.0, maxHp: 16, speed: 1.8, hostile: true,
    attackDamage: 4, attackRange: 1.4,
    drops: [[B.MAGMA, 0, 1]], eye: 0.6,
  },
};

/** Snapshot `anim` bit flags (float-encoded small ints). */
export const enum AnimFlag {
  NONE = 0,
  BURNING = 1,
  PANIC = 2,
  ATTACKING = 4,
  SHEARED = 8,
  BABY = 16,
}
