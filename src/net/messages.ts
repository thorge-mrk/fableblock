/**
 * Typed structured-clone message protocol between the four threads:
 *  Main (render) <-> Gen worker (Thread C)
 *  Main (render) <-> Mesh worker (Thread D)
 *  Main (render) <-> Logic worker (Thread B, 20 TPS)
 */
import { ItemStack } from '../core/items';

// ---------------------------------------------------------------------------
// World generation worker
// ---------------------------------------------------------------------------
export interface GenInitMsg {
  t: 'init';
  seed: number;
}

export interface GenRequestMsg {
  t: 'gen';
  cx: number;
  cz: number;
  /** Dimension: 0 overworld, 1 nether. */
  dim: number;
}

export type ToGenMsg = GenInitMsg | GenRequestMsg;

export interface BlockEntitySpawn {
  x: number;
  y: number;
  z: number;
  /** Block id (chest/furnace/hopper/spawner variants). */
  blockId: number;
  /** Pre-filled loot for chests. */
  loot?: ItemStack[];
}

export interface MobSpawnDef {
  type: number;
  x: number;
  y: number;
  z: number;
}

export interface VillageDef {
  x: number;
  z: number;
  radius: number;
}

export interface GenChunkMsg {
  t: 'chunk';
  cx: number;
  cz: number;
  /** Dimension the chunk was generated for (echoed from the request). */
  dim: number;
  /** Uint16Array(65536) buffer — transferred. */
  data: ArrayBuffer;
  blockEntities: BlockEntitySpawn[];
  mobs: MobSpawnDef[];
  village: VillageDef | null;
}

export type FromGenMsg = GenChunkMsg;

// ---------------------------------------------------------------------------
// Greedy mesher worker
// ---------------------------------------------------------------------------
export interface MeshRequestMsg {
  t: 'mesh';
  cx: number;
  cz: number;
  rev: number;
  /** Padded Uint16Array((16+2) * (256+2) * (16+2)) — transferred. */
  data: ArrayBuffer;
}

export interface MeshBuffers {
  pos: ArrayBuffer; // Float32Array xyz
  uv: ArrayBuffer; // Float32Array uv (quad extents)
  tile: ArrayBuffer; // Uint16Array tile index
  shade: ArrayBuffer; // Uint8Array baked faceShade*AO (0..255)
  light: ArrayBuffer; // Uint8Array sun,block pairs (0..15)
  index: ArrayBuffer; // Uint32Array
  count: number; // index count
}

export interface MeshResultMsg {
  t: 'mesh';
  cx: number;
  cz: number;
  rev: number;
  opaque: MeshBuffers;
  water: MeshBuffers;
}

export type ToMeshMsg = MeshRequestMsg;
export type FromMeshMsg = MeshResultMsg;

// ---------------------------------------------------------------------------
// Logic worker (20 TPS)
// ---------------------------------------------------------------------------
export interface LogicInitMsg {
  t: 'init';
  seed: number;
}

export interface LogicChunkMsg {
  t: 'chunk';
  cx: number;
  cz: number;
  data: ArrayBuffer; // copy of chunk voxels — transferred
  blockEntities: BlockEntitySpawn[];
  mobs: MobSpawnDef[];
  village: VillageDef | null;
}

export interface LogicUnchunkMsg {
  t: 'unchunk';
  cx: number;
  cz: number;
}

/** Raw voxel patches (id+light) flowing main -> worker. */
export interface LogicPatchMsg {
  t: 'patch';
  /** Int32Array quads: x, y, z, packedVoxelValue. */
  cells: ArrayBuffer;
}

export interface LogicPlayerMsg {
  t: 'player';
  x: number;
  y: number;
  z: number;
  yaw: number;
  sneak: boolean;
  /** World time-of-day in [0,1). */
  time: number;
  health: number;
}

export interface LogicAttackMsg {
  t: 'attack';
  entityId: number;
  damage: number;
  kx: number;
  kz: number;
}

export interface LogicSpawnItemMsg {
  t: 'spawnItem';
  x: number;
  y: number;
  z: number;
  stack: ItemStack;
  vx: number;
  vy: number;
  vz: number;
}

export interface LogicPlaceBlockEntityMsg {
  t: 'placeBE';
  x: number;
  y: number;
  z: number;
  blockId: number;
}

/** Block (with block-entity) broken by the player: worker drops contents. */
export interface LogicBreakBlockMsg {
  t: 'breakBE';
  x: number;
  y: number;
  z: number;
}

export interface LogicOpenContainerMsg {
  t: 'open';
  x: number;
  y: number;
  z: number;
  inv: (ItemStack | null)[];
}

export interface LogicCloseContainerMsg {
  t: 'close';
}

export interface LogicClickMsg {
  t: 'click';
  /** 0 = container slots, 1 = player inventory slots. */
  area: 0 | 1;
  slot: number;
  button: 0 | 2;
  shift: boolean;
}

export interface LogicSetTimeMsg {
  t: 'time';
  time: number;
}

/** Dimension switch: the worker drops all chunks, entities and machines. */
export interface LogicDimMsg {
  t: 'dim';
  dim: number;
}

/** XP grant for a player-attributed kill. */
export interface XpMsg {
  t: 'xp';
  amount: number;
}

/** Player right-clicked an entity while holding an item (feeding/breeding). */
export interface LogicInteractEntityMsg {
  t: 'interactEntity';
  entityId: number;
  itemId: number;
}

export type ToLogicMsg =
  | LogicInitMsg
  | LogicChunkMsg
  | LogicUnchunkMsg
  | LogicPatchMsg
  | LogicPlayerMsg
  | LogicAttackMsg
  | LogicSpawnItemMsg
  | LogicPlaceBlockEntityMsg
  | LogicBreakBlockMsg
  | LogicOpenContainerMsg
  | LogicCloseContainerMsg
  | LogicClickMsg
  | LogicSetTimeMsg
  | LogicDimMsg
  | LogicInteractEntityMsg;

// Entity snapshot: Float32Array with stride 12:
// [id, type, x, y, z, yaw, pitch, hp, hurt, anim, a, b]
export const SNAP_STRIDE = 12;

export interface SnapshotMsg {
  t: 'snap';
  tick: number;
  buf: ArrayBuffer; // Float32Array, SNAP_STRIDE per entity — transferred
  count: number;
}

/** Worker-initiated block id changes (fluids, explosions, mob griefing). */
export interface WorkerBlocksMsg {
  t: 'blocks';
  /** Int32Array quads: x, y, z, blockId. */
  cells: ArrayBuffer;
}

export interface GiveItemMsg {
  t: 'give';
  stack: ItemStack;
}

export interface PlayerDamageMsg {
  t: 'damage';
  amount: number;
  kx: number;
  kz: number;
  cause: 'mob' | 'arrow' | 'explosion' | 'fire';
}

export interface ContainerSyncMsg {
  t: 'containerSync';
  x: number;
  y: number;
  z: number;
  kind: 'chest' | 'furnace' | 'hopper';
  slots: (ItemStack | null)[];
  inv: (ItemStack | null)[];
  cursor: ItemStack | null;
  /** Furnace progress (0..1 each) for the UI bars. */
  fuel: number;
  cook: number;
}

export interface ContainerClosedMsg {
  t: 'containerClosed';
  inv: (ItemStack | null)[];
  cursor: ItemStack | null;
}

export interface ExplosionMsg {
  t: 'explosion';
  x: number;
  y: number;
  z: number;
  radius: number;
}

export interface LogicStatsMsg {
  t: 'stats';
  entities: number;
  tickMs: number;
}

export type FromLogicMsg =
  | SnapshotMsg
  | WorkerBlocksMsg
  | GiveItemMsg
  | PlayerDamageMsg
  | ContainerSyncMsg
  | ContainerClosedMsg
  | ExplosionMsg
  | XpMsg
  | LogicStatsMsg;
