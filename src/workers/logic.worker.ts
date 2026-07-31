/**
 * Thread B — Game Logic Worker, fixed 20 TPS (50ms) loop.
 *
 * Owns: entity simulation (swept-AABB physics + AI state machines + voxel A*),
 * cellular-automata fluids with push vectors, hopper item transport,
 * furnace smelting state machines, chest/furnace/hopper container sessions,
 * mob spawning (incl. spawner blocks + iron-golem summoning), random ticks
 * (grass spread, leaf decay) and the spatial hash grid for entity queries.
 *
 * World state is mirrored from the main thread: voxel patches flow in,
 * worker-initiated block changes flow out as id-edits which the main thread
 * applies with full lighting and echoes back.
 */
import { World } from '../core/world';
import {
  B, blockDef, isWater, isLava, isFluid, fluidLevel, waterWithLevel, lavaWithLevel,
  isChest, isFurnace, furnaceLitVariant,
} from '../core/blocks';
import { voxelId, CHUNK_HEIGHT, chunkKey } from '../core/coords';
import { moveEntity, boxIntersectsSolid } from '../core/aabb';
import { EntityType, ENTITY_DEFS, AnimFlag, isFarmAnimal } from '../core/entities';
import { ItemStack, makeStack, itemDef } from '../core/items';
import { Slots, insertStack, clickSlot, cloneStack, stacksEqualType } from '../core/inventory';
import { smeltResult, stackFuel } from '../core/recipes';
import { runRedstone, isRedstoneComponent, isPlate, defaultCanPush } from '../core/redstone';
import { Random, deriveSeed } from '../core/prng';
import {
  TICK_MS, GRAVITY, TERMINAL_VELOCITY, FLUID_PUSH, WATER_TICK_INTERVAL, LAVA_TICK_INTERVAL,
  HOPPER_INTERVAL, HOSTILE_CAP, PASSIVE_CAP, DESPAWN_RADIUS, SPAWN_MIN_RADIUS, SPAWN_MAX_RADIUS,
  ITEM_DESPAWN_TICKS, ITEM_PICKUP_RADIUS, ITEM_MERGE_RADIUS,
} from '../core/config';
import type {
  ToLogicMsg, FromLogicMsg, BlockEntitySpawn, VillageDef, ContainerSyncMsg,
} from '../net/messages';
import { SNAP_STRIDE } from '../net/messages';

const ctx = self as unknown as Worker;
const DT = TICK_MS / 1000; // 0.05s
// Just enough to clear a 1-block step (v²/2g = 1.01) — mobs used to launch
// visibly higher than the player on every hop.
const MOB_JUMP_SPEED = 7.8;

// ---------------------------------------------------------------------------
// Worker state
// ---------------------------------------------------------------------------
let seed = 0;
let rand = new Random(1);
const world = new World();
let tickCount = 0;
let dim = 0; // 0 overworld, 1 nether

const player = { x: 0, y: 80, z: 0, yaw: 0, sneak: false, health: 20, valid: false, creative: false };
let timeOfDay = 0.05;

function sunFactor(): number {
  const alt = Math.sin(timeOfDay * Math.PI * 2);
  // Matches DayNightCycle smoothstep band.
  const t = Math.max(0, Math.min(1, (alt + 0.12) / 0.3));
  return t * t * (3 - 2 * t);
}

function isNight(): boolean {
  return sunFactor() < 0.2;
}

// ---------------------------------------------------------------------------
// Outgoing block edits (id-only; main thread runs lighting and echoes)
// ---------------------------------------------------------------------------
const outBlocks: number[] = [];

function setBlockLocal(x: number, y: number, z: number, id: number): void {
  if (y < 0 || y >= CHUNK_HEIGHT) return;
  const chunk = world.getChunk(x >> 4, z >> 4);
  if (!chunk) return;
  const v = world.getVoxel(x, y, z);
  if (voxelId(v) === id) return;
  world.setRaw(x, y, z, (v & 0xff00) | (id & 0xff));
  outBlocks.push(x, y, z, id);
  scheduleFluidAround(x, y, z);
  onBlockIdChanged(x, y, z, voxelId(v), id);
}

// ---------------------------------------------------------------------------
// Redstone-lite (Phase 4): dirty tracking + pressure plates
// ---------------------------------------------------------------------------
const redstoneDirty: Array<[number, number, number]> = [];
const redstoneDirtySet = new Set<string>();
const plates = new Map<string, [number, number, number]>();
const devicePrev = new Map<string, boolean>();

// Fast per-id component lookup for the chunk scans.
const RS_LUT = new Uint8Array(256);
for (let i = 0; i < 256; i++) RS_LUT[i] = isRedstoneComponent(i) ? 1 : 0;

function markRedstone(x: number, y: number, z: number): void {
  const k = x + ',' + y + ',' + z;
  if (redstoneDirtySet.has(k)) return;
  redstoneDirtySet.add(k);
  redstoneDirty.push([x, y, z]);
}

/** Track every block-ID transition (own writes + main-thread patches). */
function onBlockIdChanged(x: number, y: number, z: number, before: number, after: number): void {
  if (RS_LUT[before] || RS_LUT[after]) markRedstone(x, y, z);
  else {
    // A plain block appearing/vanishing next to wire still changes the graph.
    for (const [dx, dy, dz] of NEIGHBORS6) {
      if (RS_LUT[world.getBlockId(x + dx, y + dy, z + dz)]) {
        markRedstone(x, y, z);
        break;
      }
    }
  }
  const k = x + ',' + y + ',' + z;
  if (isPlate(after)) plates.set(k, [x, y, z]);
  else if (isPlate(before)) plates.delete(k);
}

function processRedstone(): void {
  if (redstoneDirty.length === 0) return;
  const batch = redstoneDirty.slice();
  redstoneDirty.length = 0;
  redstoneDirtySet.clear();
  runRedstone(
    world, batch, setBlockLocal, devicePrev,
    (x, y, z, id) => defaultCanPush(id) && !blockEntities.has(beKey(x, y, z)),
  );
}

/** Plates read entity + player weight every other tick. */
function tickPlates(): void {
  if (tickCount % 2 !== 0 || plates.size === 0) return;
  for (const [k, [x, y, z]] of plates) {
    if (!chunkLoaded(x, z)) continue;
    const id = world.getBlockId(x, y, z);
    if (!isPlate(id)) {
      plates.delete(k);
      continue;
    }
    let occupied = false;
    if (
      player.valid && player.health > 0 &&
      player.x > x - 0.15 && player.x < x + 1.15 &&
      player.z > z - 0.15 && player.z < z + 1.15 &&
      player.y > y - 0.4 && player.y < y + 0.9
    ) {
      occupied = true;
    }
    if (!occupied) {
      for (const e of queryRange(x + 0.5, y + 0.5, z + 0.5, 1.4)) {
        if (e.dead) continue;
        if (
          e.x > x - 0.1 && e.x < x + 1.1 &&
          e.z > z - 0.1 && e.z < z + 1.1 &&
          e.y > y - 0.5 && e.y < y + 0.8
        ) {
          occupied = true;
          break;
        }
      }
    }
    const want = occupied ? B.PRESSURE_PLATE_ON : B.PRESSURE_PLATE;
    if (id !== want) setBlockLocal(x, y, z, want);
  }
}

// ---------------------------------------------------------------------------
// Fluid automata (Module 4 spec)
// ---------------------------------------------------------------------------
const fluidQueue = new Map<string, number>(); // posKey -> due tick

function fluidKey(x: number, y: number, z: number): string {
  return x + ',' + y + ',' + z;
}

function scheduleFluid(x: number, y: number, z: number, interval: number): void {
  const key = fluidKey(x, y, z);
  const due = tickCount + interval;
  const existing = fluidQueue.get(key);
  if (existing === undefined || existing > due) fluidQueue.set(key, due);
}

function scheduleFluidAround(x: number, y: number, z: number): void {
  for (const [dx, dy, dz] of NEIGHBORS6) {
    const id = world.getBlockId(x + dx, y + dy, z + dz);
    if (isFluid(id)) scheduleFluid(x + dx, y + dy, z + dz, isLava(id) ? LAVA_TICK_INTERVAL : WATER_TICK_INTERVAL);
  }
  const id = world.getBlockId(x, y, z);
  if (isFluid(id)) scheduleFluid(x, y, z, isLava(id) ? LAVA_TICK_INTERVAL : WATER_TICK_INTERVAL);
}

const NEIGHBORS6: ReadonlyArray<readonly [number, number, number]> = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
];
const HORIZ4: ReadonlyArray<readonly [number, number]> = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
];

function processFluids(): void {
  if (fluidQueue.size === 0) return;
  const due: Array<[string, number]> = [];
  for (const [key, t] of fluidQueue) {
    if (t <= tickCount) due.push([key, t]);
  }
  for (const [key] of due) {
    fluidQueue.delete(key);
    const [x, y, z] = key.split(',').map(Number);
    updateFluidCell(x, y, z);
  }
}

function updateFluidCell(x: number, y: number, z: number): void {
  const id = world.getBlockId(x, y, z);
  if (!isFluid(id)) return;
  const lava = isLava(id);
  const same = lava ? isLava : isWater;
  const other = lava ? isWater : isLava;
  const interval = lava ? LAVA_TICK_INTERVAL : WATER_TICK_INTERVAL;
  const maxSpread = lava ? 3 : 7;
  const withLevel = lava ? lavaWithLevel : waterWithLevel;
  let level = fluidLevel(id);

  // Lava + water interaction: solidify.
  for (const [dx, dy, dz] of NEIGHBORS6) {
    const nid = world.getBlockId(x + dx, y + dy, z + dz);
    if (other(nid)) {
      if (lava) {
        // Lava source meeting water hardens to obsidian; flowing -> cobblestone.
        setBlockLocal(x, y, z, level >= 8 ? B.OBSIDIAN : B.COBBLESTONE);
        return;
      }
      // We are water and the neighbor is lava: harden the lava instead.
      const nl = fluidLevel(nid);
      setBlockLocal(x + dx, y + dy, z + dz, nl >= 8 ? B.OBSIDIAN : B.COBBLESTONE);
    }
  }

  // Flow decay for non-sources: recompute supported level.
  if (level < 8) {
    let support = 0;
    const above = world.getBlockId(x, y + 1, z);
    if (same(above)) support = maxSpread;
    for (const [dx, dz] of HORIZ4) {
      const nid = world.getBlockId(x + dx, y, z + dz);
      if (same(nid)) support = Math.max(support, Math.min(maxSpread, fluidLevel(nid) - 1));
    }
    if (support <= 0) {
      setBlockLocal(x, y, z, B.AIR);
      for (const [dx, dz] of HORIZ4) scheduleFluid(x + dx, y, z + dz, interval);
      scheduleFluid(x, y - 1, z, interval);
      return;
    }
    if (support !== level) {
      setBlockLocal(x, y, z, withLevel(support));
      level = support;
      for (const [dx, dz] of HORIZ4) scheduleFluid(x + dx, y, z + dz, interval);
      scheduleFluid(x, y - 1, z, interval);
    }
  }

  // Downward flow.
  const belowId = world.getBlockId(x, y - 1, z);
  const belowDef = blockDef(belowId);
  if (y > 0 && (belowDef.replaceable || same(belowId)) && !blockDef(belowId).solid) {
    if (!same(belowId)) {
      if (!other(belowId)) {
        setBlockLocal(x, y - 1, z, withLevel(maxSpread));
        scheduleFluid(x, y - 1, z, interval);
        return; // falling fluid does not spread sideways
      }
    } else if (fluidLevel(belowId) < 8) {
      // Refresh the falling column.
      scheduleFluid(x, y - 1, z, interval);
      return;
    } else {
      return;
    }
  }

  // Horizontal spread (only when blocked below).
  const target = level >= 8 ? maxSpread : level - 1;
  if (target >= 1) {
    for (const [dx, dz] of HORIZ4) {
      const nx = x + dx;
      const nz = z + dz;
      const nid = world.getBlockId(nx, y, nz);
      if (other(nid)) continue; // handled by interaction above
      const nd = blockDef(nid);
      if (same(nid)) {
        if (fluidLevel(nid) < target) {
          setBlockLocal(nx, y, nz, withLevel(target));
          scheduleFluid(nx, y, nz, interval);
        }
      } else if (nd.replaceable && !nd.solid) {
        setBlockLocal(nx, y, nz, withLevel(target));
        scheduleFluid(nx, y, nz, interval);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Block entities (chests, furnaces, hoppers, spawners)
// ---------------------------------------------------------------------------
type BEKind = 'chest' | 'furnace' | 'hopper' | 'spawner';

interface BlockEntity {
  x: number;
  y: number;
  z: number;
  kind: BEKind;
  slots: Slots;
  fuel: number;
  fuelMax: number;
  cook: number;
  cookMax: number;
  spawnCooldown: number;
}

const blockEntities = new Map<string, BlockEntity>();

function beKey(x: number, y: number, z: number): string {
  return x + ',' + y + ',' + z;
}

function beKindFor(blockId: number): BEKind | null {
  if (isChest(blockId)) return 'chest';
  if (isFurnace(blockId)) return 'furnace';
  if (blockId === B.HOPPER) return 'hopper';
  if (blockId === B.SPAWNER) return 'spawner';
  return null;
}

function createBE(x: number, y: number, z: number, kind: BEKind, loot?: ItemStack[]): BlockEntity {
  const slotCount = kind === 'chest' ? 27 : kind === 'furnace' ? 3 : kind === 'hopper' ? 5 : 0;
  const slots: Slots = new Array(slotCount).fill(null);
  if (loot && kind === 'chest') {
    const r = new Random(deriveSeed(seed, 'loot:' + x + ',' + y + ',' + z));
    for (const stack of loot) {
      let idx = r.int(slotCount);
      for (let tries = 0; tries < slotCount && slots[idx]; tries++) idx = (idx + 1) % slotCount;
      if (!slots[idx]) slots[idx] = stack;
    }
  }
  const be: BlockEntity = {
    x, y, z, kind, slots,
    fuel: 0, fuelMax: 1, cook: 0, cookMax: 200,
    spawnCooldown: 100,
  };
  blockEntities.set(beKey(x, y, z), be);
  return be;
}

function dropBEContents(be: BlockEntity): void {
  for (const s of be.slots) {
    if (s) {
      spawnItem(be.x + 0.5, be.y + 0.5, be.z + 0.5, s, (rand.float() - 0.5) * 2, 2, (rand.float() - 0.5) * 2);
    }
  }
  be.slots.fill(null);
}

// --- Furnace state machine (Module 6 spec) ---
function tickFurnace(be: BlockEntity): boolean {
  let changed = false;
  const input = be.slots[0];
  const fuel = be.slots[1];
  const output = be.slots[2];
  const recipe = input ? smeltResult(input.id) : null;
  const outputOk =
    recipe !== null &&
    (output === null || (output.id === recipe.output && output.count < itemDef(output.id).maxStack));

  if (be.fuel > 0) {
    be.fuel--;
    changed = true;
    if (recipe && outputOk) {
      be.cook++;
      be.cookMax = recipe.ticks;
      if (be.cook >= recipe.ticks) {
        be.cook = 0;
        if (output) output.count++;
        else be.slots[2] = makeStack(recipe.output, 1);
        input!.count--;
        if (input!.count <= 0) be.slots[0] = null;
      }
    } else if (be.cook > 0) {
      be.cook = Math.max(0, be.cook - 2);
    }
  } else if (recipe && outputOk && fuel) {
    const burn = stackFuel(fuel.id);
    if (burn > 0) {
      be.fuel = burn;
      be.fuelMax = burn;
      fuel.count--;
      if (fuel.count <= 0) be.slots[1] = null;
      changed = true;
    }
  } else if (be.cook > 0) {
    be.cook = Math.max(0, be.cook - 2);
    changed = true;
  }

  // Lit/unlit block variant follows burn state.
  const blockId = world.getBlockId(be.x, be.y, be.z);
  if (isFurnace(blockId)) {
    const lit = be.fuel > 0;
    const want = furnaceLitVariant(blockId, lit);
    if (want !== blockId) setBlockLocal(be.x, be.y, be.z, want);
  }
  return changed;
}

// --- Hopper item transport (Module 5 spec: every 4 game ticks) ---
function tickHopper(be: BlockEntity): boolean {
  let changed = false;

  // 1) Vacuum item entities whose box intersects the space directly above.
  for (const e of queryRange(be.x + 0.5, be.y + 1.5, be.z + 0.5, 1.2)) {
    if (e.type !== EntityType.ITEM || e.dead) continue;
    if (
      e.x > be.x - 0.2 && e.x < be.x + 1.2 &&
      e.z > be.z - 0.2 && e.z < be.z + 1.2 &&
      e.y > be.y + 0.4 && e.y < be.y + 2.0
    ) {
      const rest = insertStack(be.slots, e.itemStack!);
      if (!rest) {
        e.dead = true;
        changed = true;
      } else if (rest.count !== e.itemStack!.count) {
        e.itemStack = rest;
        changed = true;
      }
    }
  }

  // 2) Pull one item from a container above (furnace above: output slot only).
  const aboveBE = blockEntities.get(beKey(be.x, be.y + 1, be.z));
  if (aboveBE && aboveBE.kind !== 'spawner') {
    const range = aboveBE.kind === 'furnace' ? [2] : aboveBE.slots.map((_, i) => i);
    for (const i of range) {
      const s = aboveBE.slots[i];
      if (!s) continue;
      const one: ItemStack = { id: s.id, count: 1 };
      if (s.dur !== undefined) one.dur = s.dur;
      const rest = insertStack(be.slots, one);
      if (!rest) {
        s.count--;
        if (s.count <= 0) aboveBE.slots[i] = null;
        changed = true;
      }
      break;
    }
  }

  // 3) Push into the container below (or first adjacent one).
  const targets: Array<[number, number, number]> = [
    [be.x, be.y - 1, be.z],
    [be.x + 1, be.y, be.z], [be.x - 1, be.y, be.z],
    [be.x, be.y, be.z + 1], [be.x, be.y, be.z - 1],
  ];
  outer: for (const [tx, ty, tz] of targets) {
    const target = blockEntities.get(beKey(tx, ty, tz));
    if (!target || target.kind === 'spawner' || target === be) continue;
    for (let i = 0; i < be.slots.length; i++) {
      const s = be.slots[i];
      if (!s) continue;
      const one: ItemStack = { id: s.id, count: 1 };
      if (s.dur !== undefined) one.dur = s.dur;
      let inserted = false;
      if (target.kind === 'furnace') {
        if (smeltResult(s.id)) inserted = insertStack(target.slots, one, 0, 1) === null;
        else if (stackFuel(s.id) > 0) inserted = insertStack(target.slots, one, 1, 2) === null;
      } else {
        inserted = insertStack(target.slots, one) === null;
      }
      if (inserted) {
        s.count--;
        if (s.count <= 0) be.slots[i] = null;
        changed = true;
        break outer;
      }
    }
  }
  return changed;
}

function tickSpawner(be: BlockEntity): void {
  const d2 =
    (be.x + 0.5 - player.x) ** 2 + (be.y + 0.5 - player.y) ** 2 + (be.z + 0.5 - player.z) ** 2;
  if (d2 > 16 * 16) return;
  if (be.spawnCooldown > 0) {
    be.spawnCooldown--;
    return;
  }
  let nearby = 0;
  for (const e of entities.values()) {
    if (e.type === EntityType.ZOMBIE && !e.dead) {
      const dd = (e.x - be.x) ** 2 + (e.y - be.y) ** 2 + (e.z - be.z) ** 2;
      if (dd < 81) nearby++;
    }
  }
  if (nearby >= 4) {
    be.spawnCooldown = 100;
    return;
  }
  for (let attempt = 0; attempt < 6; attempt++) {
    const sx = be.x + 0.5 + (rand.float() - 0.5) * 7;
    const sy = be.y + rand.range(-1, 1);
    const sz = be.z + 0.5 + (rand.float() - 0.5) * 7;
    if (trySpawnAt(EntityType.ZOMBIE, sx, sy, sz, 7)) break;
  }
  be.spawnCooldown = rand.range(200, 400);
}

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------
interface Ent {
  id: number;
  type: EntityType;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  yaw: number;
  pitch: number;
  hp: number;
  hurt: number;
  dead: boolean;
  onGround: boolean;
  // AI
  stateTimer: number;
  attackCooldown: number;
  targetId: number; // 0 none, -1 player, else entity id
  path: number[] | null;
  pathIdx: number;
  repathTimer: number;
  wanderX: number;
  wanderZ: number;
  panic: boolean;
  // Type-specific
  swell: number; // creeper 0..1
  burning: boolean;
  sheared: boolean;
  grazeTimer: number;
  hungerTimer: number;
  homeX: number;
  homeZ: number;
  homeR: number;
  workX: number;
  workY: number;
  workZ: number;
  itemStack: ItemStack | null;
  age: number;
  pickupDelay: number;
  stuck: boolean; // arrows
  love: number; // breeding: ticks of love-mode remaining
  growTicks: number; // > 0 while a baby
  anger: number; // piglins: ticks of group aggro remaining
}

const entities = new Map<number, Ent>();
let nextEntityId = 1;

function makeEntity(type: EntityType, x: number, y: number, z: number): Ent {
  const def = ENTITY_DEFS[type];
  const e: Ent = {
    id: nextEntityId++,
    type, x, y, z,
    vx: 0, vy: 0, vz: 0,
    yaw: rand.float() * Math.PI * 2,
    pitch: 0,
    hp: def.maxHp,
    hurt: 0,
    dead: false,
    onGround: false,
    stateTimer: rand.range(10, 60),
    attackCooldown: 0,
    targetId: 0,
    path: null,
    pathIdx: 0,
    repathTimer: rand.range(0, 20),
    wanderX: x,
    wanderZ: z,
    panic: false,
    swell: 0,
    burning: false,
    sheared: false,
    grazeTimer: 0,
    hungerTimer: rand.range(400, 1200),
    homeX: x,
    homeZ: z,
    homeR: 16,
    workX: 0, workY: -1, workZ: 0,
    itemStack: null,
    age: 0,
    pickupDelay: 10,
    stuck: false,
    love: 0,
    growTicks: 0,
    anger: 0,
  };
  entities.set(e.id, e);
  return e;
}

function spawnItem(x: number, y: number, z: number, stack: ItemStack, vx: number, vy: number, vz: number): Ent {
  const e = makeEntity(EntityType.ITEM, x, y, z);
  e.itemStack = { ...stack };
  e.vx = vx;
  e.vy = vy;
  e.vz = vz;
  e.pickupDelay = 15;
  return e;
}

// --- Spatial hash grid (Module 4 spec) ---
const spatial = new Map<number, Ent[]>();

function hashCell(x: number, y: number, z: number): number {
  return (((x >> 2) & 1023) << 20) | (((y >> 2) & 255) << 10) | ((z >> 2) & 1023);
}

function rebuildSpatial(): void {
  spatial.clear();
  for (const e of entities.values()) {
    if (e.dead) continue;
    const key = hashCell(Math.floor(e.x), Math.floor(e.y), Math.floor(e.z));
    let arr = spatial.get(key);
    if (!arr) {
      arr = [];
      spatial.set(key, arr);
    }
    arr.push(e);
  }
}

function queryRange(x: number, y: number, z: number, r: number): Ent[] {
  const out: Ent[] = [];
  // Align to the 4-block hash cells: stepping by 4 from an unaligned start
  // would skip the cell containing max* whenever the span crosses a boundary.
  const minX = Math.floor(x - r) & ~3;
  const maxX = Math.floor(x + r);
  const minY = Math.floor(Math.max(0, y - r)) & ~3;
  const maxY = Math.floor(Math.min(255, y + r));
  const minZ = Math.floor(z - r) & ~3;
  const maxZ = Math.floor(z + r);
  const seen = new Set<number>();
  for (let by = minY; by <= maxY; by += 4) {
    for (let bz = minZ; bz <= maxZ; bz += 4) {
      for (let bx = minX; bx <= maxX; bx += 4) {
        const arr = spatial.get(hashCell(bx, by, bz));
        if (!arr) continue;
        for (const e of arr) {
          if (seen.has(e.id)) continue;
          seen.add(e.id);
          const dd = (e.x - x) ** 2 + (e.y - y) ** 2 + (e.z - z) ** 2;
          if (dd <= r * r) out.push(e);
        }
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// A* voxel pathfinding (Module 5 spec)
// ---------------------------------------------------------------------------
const PATH_RANGE = 40;

function walkable(x: number, y: number, z: number): boolean {
  if (y < 1 || y >= CHUNK_HEIGHT - 1) return false;
  const feet = world.getBlockId(x, y, z);
  const head = world.getBlockId(x, y + 1, z);
  const floor = world.getBlockId(x, y - 1, z);
  if (blockDef(feet).solid || blockDef(head).solid) return false;
  if (isLava(feet) || isLava(head) || isLava(floor)) return false;
  return blockDef(floor).solid || isWater(feet) || isWater(floor);
}

interface PathNode {
  x: number; y: number; z: number;
  g: number; f: number;
  parent: PathNode | null;
}

function findPath(
  sx: number, sy: number, sz: number,
  tx: number, ty: number, tz: number,
  maxNodes = 500,
): number[] | null {
  sx = Math.floor(sx); sy = Math.floor(sy); sz = Math.floor(sz);
  tx = Math.floor(tx); ty = Math.floor(ty); tz = Math.floor(tz);
  if (Math.abs(tx - sx) > PATH_RANGE || Math.abs(tz - sz) > PATH_RANGE) return null;

  const open: PathNode[] = [];
  const visited = new Map<number, number>(); // key -> best g
  const key = (x: number, y: number, z: number) =>
    (x - sx + 64) + ((z - sz + 64) << 8) + ((y - sy + 64) << 16);
  const h = (x: number, y: number, z: number) =>
    Math.abs(x - tx) + Math.abs(y - ty) * 0.6 + Math.abs(z - tz);

  const push = (n: PathNode) => {
    // Binary heap insert.
    open.push(n);
    let i = open.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (open[p].f <= open[i].f) break;
      const t = open[p];
      open[p] = open[i];
      open[i] = t;
      i = p;
    }
  };
  const pop = (): PathNode => {
    const top = open[0];
    const last = open.pop()!;
    if (open.length > 0) {
      open[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < open.length && open[l].f < open[m].f) m = l;
        if (r < open.length && open[r].f < open[m].f) m = r;
        if (m === i) break;
        const t = open[m];
        open[m] = open[i];
        open[i] = t;
        i = m;
      }
    }
    return top;
  };

  const start: PathNode = { x: sx, y: sy, z: sz, g: 0, f: h(sx, sy, sz), parent: null };
  push(start);
  visited.set(key(sx, sy, sz), 0);
  let best: PathNode = start;
  let bestH = h(sx, sy, sz);
  let expanded = 0;

  while (open.length > 0 && expanded < maxNodes) {
    const node = pop();
    expanded++;
    const hh = h(node.x, node.y, node.z);
    if (hh < bestH) {
      bestH = hh;
      best = node;
    }
    if (node.x === tx && node.z === tz && Math.abs(node.y - ty) <= 1) {
      best = node;
      break;
    }
    for (const [dx, dz] of HORIZ4) {
      const nx = node.x + dx;
      const nz = node.z + dz;
      if (Math.abs(nx - sx) > PATH_RANGE || Math.abs(nz - sz) > PATH_RANGE) continue;
      // Same level, step up 1, or drop up to 3.
      let candidates: Array<[number, number]>; // [y, cost]
      if (walkable(nx, node.y, nz)) {
        candidates = [[node.y, 1]];
      } else if (walkable(nx, node.y + 1, nz) && !blockDef(world.getBlockId(node.x, node.y + 2, node.z)).solid) {
        candidates = [[node.y + 1, 1.6]]; // step/jump over 1-block barrier
      } else {
        candidates = [];
        for (let drop = 1; drop <= 3; drop++) {
          if (blockDef(world.getBlockId(nx, node.y - drop + 1, nz)).solid) break;
          if (walkable(nx, node.y - drop, nz)) {
            candidates = [[node.y - drop, 1 + drop * 0.4]];
            break;
          }
        }
      }
      for (const [ny, cost] of candidates) {
        const k = key(nx, ny, nz);
        const g = node.g + cost;
        const prev = visited.get(k);
        if (prev !== undefined && prev <= g) continue;
        visited.set(k, g);
        push({ x: nx, y: ny, z: nz, g, f: g + h(nx, ny, nz), parent: node });
      }
    }
  }

  if (best === start) return null;
  const path: number[] = [];
  let n: PathNode | null = best;
  while (n) {
    path.push(n.x, n.y, n.z);
    n = n.parent;
  }
  // Reverse triplets in place.
  const out: number[] = [];
  for (let i = path.length - 3; i >= 0; i -= 3) {
    out.push(path[i], path[i + 1], path[i + 2]);
  }
  return out.length > 3 ? out : null;
}

// ---------------------------------------------------------------------------
// Entity physics + steering
// ---------------------------------------------------------------------------
function chunkLoaded(x: number, z: number): boolean {
  return world.getChunk(Math.floor(x) >> 4, Math.floor(z) >> 4) !== undefined;
}

function entityInFluid(e: Ent): { water: boolean; lava: boolean } {
  const def = ENTITY_DEFS[e.type];
  let water = false;
  let lava = false;
  const minY = Math.floor(e.y);
  const maxY = Math.floor(e.y + def.height * 0.6);
  for (let y = minY; y <= maxY; y++) {
    const id = world.getBlockId(Math.floor(e.x), y, Math.floor(e.z));
    if (isWater(id)) water = true;
    else if (isLava(id)) lava = true;
  }
  return { water, lava };
}

function applyEntityFluidPush(e: Ent): void {
  const bx = Math.floor(e.x);
  const by = Math.floor(e.y + 0.2);
  const bz = Math.floor(e.z);
  const id = world.getBlockId(bx, by, bz);
  if (!isFluid(id)) return;
  const lv = fluidLevel(id);
  let px = 0;
  let pz = 0;
  for (const [dx, dz] of HORIZ4) {
    const nid = world.getBlockId(bx + dx, by, bz + dz);
    if (isFluid(nid)) {
      const nlv = fluidLevel(nid);
      if (nlv < lv) {
        px += dx * (lv - nlv);
        pz += dz * (lv - nlv);
      }
    } else if (!blockDef(nid).solid && lv < 8) {
      px += dx * 0.6;
      pz += dz * 0.6;
    }
  }
  const len = Math.hypot(px, pz);
  if (len > 0.01) {
    const f = (FLUID_PUSH * DT) / len;
    e.vx += px * f;
    e.vz += pz * f;
  }
}

function stepEntity(e: Ent, walkX: number, walkZ: number, wantJump: boolean): void {
  const def = ENTITY_DEFS[e.type];
  const fluid = entityInFluid(e);
  const inFluid = fluid.water || fluid.lava;

  if (fluid.lava) {
    if (e.type === EntityType.ITEM) {
      e.dead = true; // dropped items burn up in lava
      return;
    }
    // Nether natives shrug lava off.
    if (e.type !== EntityType.MAGMA_CUBE && e.type !== EntityType.PIGLIN) {
      damageEntity(e, 4, 0, 0);
      e.burning = true;
    }
  }

  // Horizontal steering toward desired velocity.
  const speedScale = e.panic ? 1.5 : 1;
  const accel = e.onGround ? 10 : 4;
  e.vx += (walkX * def.speed * speedScale - e.vx) * Math.min(1, accel * DT);
  e.vz += (walkZ * def.speed * speedScale - e.vz) * Math.min(1, accel * DT);

  if (inFluid) {
    e.vy += GRAVITY * 0.18 * DT;
    e.vy -= e.vy * Math.min(1, 4 * DT);
    if (wantJump || walkX !== 0 || walkZ !== 0) e.vy += 14 * DT; // swim up
    if (e.type === EntityType.ITEM && fluid.water) e.vy += 22 * DT; // items float
  } else {
    if (wantJump && e.onGround) {
      e.vy = MOB_JUMP_SPEED;
      e.onGround = false;
    }
    e.vy += GRAVITY * DT;
    if (e.vy < TERMINAL_VELOCITY) e.vy = TERMINAL_VELOCITY;
  }
  applyEntityFluidPush(e);

  const res = moveEntity(
    world,
    e.x, e.y, e.z,
    def.width, def.height,
    e.vx * DT, e.vy * DT, e.vz * DT,
    { stepHeight: e.type === EntityType.ITEM || e.type === EntityType.ARROW ? 0 : 0.55, sneak: false },
  );
  // Auto-jump assist when running into a wall.
  if ((res.hitX || res.hitZ) && e.onGround && !wantJump && (walkX !== 0 || walkZ !== 0) &&
      e.type !== EntityType.ITEM && e.type !== EntityType.ARROW) {
    e.vy = MOB_JUMP_SPEED;
  }
  if (res.hitY) e.vy = 0;
  e.x = res.cx;
  e.y = res.y;
  e.z = res.cz;
  e.onGround = res.onGround;
  if (e.onGround) {
    e.vx *= 0.6;
    e.vz *= 0.6;
  }
}

// --- Path following ---
function followPath(e: Ent): { x: number; z: number; jump: boolean } {
  if (!e.path || e.pathIdx * 3 >= e.path.length) return { x: 0, z: 0, jump: false };
  const wx = e.path[e.pathIdx * 3] + 0.5;
  const wy = e.path[e.pathIdx * 3 + 1];
  const wz = e.path[e.pathIdx * 3 + 2] + 0.5;
  const dx = wx - e.x;
  const dz = wz - e.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.5 && Math.abs(wy - e.y) < 1.2) {
    e.pathIdx++;
    return followPath(e);
  }
  const jump = wy > e.y + 0.55 && e.onGround && d < 1.6;
  e.yaw = Math.atan2(-dx, -dz);
  return { x: dx / (d || 1), z: dz / (d || 1), jump };
}

function pathTo(e: Ent, tx: number, ty: number, tz: number): void {
  if (e.repathTimer > 0) return;
  e.repathTimer = rand.range(15, 35);
  const p = findPath(e.x, e.y, e.z, tx, ty, tz);
  if (p) {
    e.path = p;
    e.pathIdx = 0;
  } else {
    e.path = null;
  }
}

/** Coarse voxel LOS test between two points. */
function hasLOS(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dz = z1 - z0;
  const dist = Math.hypot(dx, dy, dz);
  const steps = Math.max(1, Math.ceil(dist * 2));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const id = world.getBlockId(
      Math.floor(x0 + dx * t),
      Math.floor(y0 + dy * t),
      Math.floor(z0 + dz * t),
    );
    if (blockDef(id).opaque) return false;
  }
  return true;
}

function damageEntity(e: Ent, amount: number, kx: number, kz: number, byPlayer = false): void {
  if (e.dead || e.hurt > 3) return;
  e.hp -= amount;
  e.hurt = 10;
  e.vx += kx;
  e.vz += kz;
  if (kx !== 0 || kz !== 0) e.vy += 4;
  if (e.hp <= 0) killEntity(e, byPlayer);
}

function killEntity(e: Ent, byPlayer = false): void {
  e.dead = true;
  if (byPlayer && e.type !== EntityType.ITEM && e.type !== EntityType.ARROW) {
    post({ t: 'xp', amount: ENTITY_DEFS[e.type].hostile ? 5 : 2 });
  }
  const def = ENTITY_DEFS[e.type];
  for (const [itemId, min, max] of def.drops) {
    if (e.type === EntityType.SHEEP && itemId === B.WOOL && e.sheared) continue;
    const n = rand.range(min, max);
    if (n > 0) {
      spawnItem(e.x, e.y + 0.5, e.z, makeStack(itemId, n), (rand.float() - 0.5) * 2, 2.5, (rand.float() - 0.5) * 2);
    }
  }
}

// ---------------------------------------------------------------------------
// Mob AI state machines (Module 5 spec)
// ---------------------------------------------------------------------------
function distToPlayer(e: Ent): number {
  return Math.hypot(player.x - e.x, player.y - e.y, player.z - e.z);
}

function tickZombie(e: Ent): void {
  const def = ENTITY_DEFS[e.type];
  // Day burning under open sky (water extinguishes).
  if (
    sunFactor() > 0.5 &&
    world.getSun(Math.floor(e.x), Math.floor(e.y + def.height), Math.floor(e.z)) >= 14 &&
    !entityInFluid(e).water
  ) {
    e.burning = true;
    if (tickCount % 20 === 0) damageEntity(e, 1, 0, 0);
  } else {
    e.burning = false;
  }

  // Acquire target: nearest of player / villagers within 16.
  let tx = 0;
  let ty = 0;
  let tz = 0;
  let found = false;
  const pd = distToPlayer(e);
  let bestD = 16;
  if (pd < bestD && player.health > 0 && player.valid && !player.creative) {
    bestD = pd;
    tx = player.x; ty = player.y; tz = player.z;
    e.targetId = -1;
    found = true;
  }
  for (const v of queryRange(e.x, e.y, e.z, 16)) {
    if (v.type !== EntityType.VILLAGER || v.dead) continue;
    const d = Math.hypot(v.x - e.x, v.y - e.y, v.z - e.z);
    if (d < bestD) {
      bestD = d;
      tx = v.x; ty = v.y; tz = v.z;
      e.targetId = v.id;
      found = true;
    }
  }

  let move = { x: 0, z: 0, jump: false };
  if (found) {
    pathTo(e, tx, ty, tz);
    move = followPath(e);
    if (!e.path) {
      // Direct pursuit fallback.
      const dx = tx - e.x;
      const dz = tz - e.z;
      const d = Math.hypot(dx, dz) || 1;
      move = { x: dx / d, z: dz / d, jump: false };
      e.yaw = Math.atan2(-dx, -dz);
    }
    if (bestD < def.attackRange && e.attackCooldown <= 0) {
      e.attackCooldown = 20;
      const dx = tx - e.x;
      const dz = tz - e.z;
      const d = Math.hypot(dx, dz) || 1;
      if (e.targetId === -1) {
        post({ t: 'damage', amount: def.attackDamage, kx: (dx / d) * 6, kz: (dz / d) * 6, cause: 'mob' });
      } else {
        const v = entities.get(e.targetId);
        if (v) damageEntity(v, def.attackDamage, (dx / d) * 5, (dz / d) * 5);
      }
    }
  } else {
    e.targetId = 0;
    move = wander(e);
  }
  stepEntity(e, move.x, move.z, move.jump);
}

function tickSkeleton(e: Ent): void {
  const def = ENTITY_DEFS[e.type];
  if (
    sunFactor() > 0.5 &&
    world.getSun(Math.floor(e.x), Math.floor(e.y + def.height), Math.floor(e.z)) >= 14 &&
    !entityInFluid(e).water
  ) {
    e.burning = true;
    if (tickCount % 20 === 0) damageEntity(e, 1, 0, 0);
  } else {
    e.burning = false;
  }

  const pd = distToPlayer(e);
  let move = { x: 0, z: 0, jump: false };
  if (pd < 16 && player.valid && player.health > 0 && !player.creative) {
    const eye = e.y + def.eye;
    const los = hasLOS(e.x, eye, e.z, player.x, player.y + 1.6, player.z);
    const dx = player.x - e.x;
    const dz = player.z - e.z;
    const d = Math.hypot(dx, dz) || 1;
    e.yaw = Math.atan2(-dx, -dz);

    // Maintain ~10 blocks: advance, retreat, strafe.
    if (!los || pd > 11) {
      pathTo(e, player.x, player.y, player.z);
      move = followPath(e);
    } else if (pd < 8) {
      move = { x: -dx / d, z: -dz / d, jump: false };
    } else {
      const strafe = Math.sin(tickCount / 18 + e.id) > 0 ? 1 : -1;
      move = { x: (-dz / d) * strafe * 0.6, z: (dx / d) * strafe * 0.6, jump: false };
    }

    if (los && pd <= 14 && e.attackCooldown <= 0) {
      e.attackCooldown = rand.range(40, 60);
      shootArrow(e, player.x, player.y + 1.2, player.z);
    }
  } else {
    move = wander(e);
  }
  stepEntity(e, move.x, move.z, move.jump);
}

function shootArrow(e: Ent, tx: number, ty: number, tz: number): void {
  const def = ENTITY_DEFS[e.type];
  const a = makeEntity(EntityType.ARROW, e.x, e.y + def.eye, e.z);
  const dx = tx - a.x;
  const dy = ty - a.y + Math.hypot(tx - a.x, tz - a.z) * 0.08; // arc compensation
  const dz = tz - a.z;
  const d = Math.hypot(dx, dy, dz) || 1;
  const speed = 22;
  const spread = 0.04;
  a.vx = (dx / d) * speed + (rand.float() - 0.5) * spread * speed;
  a.vy = (dy / d) * speed + (rand.float() - 0.5) * spread * speed;
  a.vz = (dz / d) * speed + (rand.float() - 0.5) * spread * speed;
  a.targetId = e.id; // shooter (no self-hits)
}

function tickCreeper(e: Ent): void {
  const pd = distToPlayer(e);
  let move = { x: 0, z: 0, jump: false };
  if (pd < 16 && player.valid && player.health > 0 && !player.creative) {
    // Fuse only with a clear line of sight — no detonating through walls/floors.
    if (pd <= 3 && hasLOS(e.x, e.y + 1.2, e.z, player.x, player.y + 1.2, player.z)) {
      // Stop and swell (silent fuse).
      e.swell = Math.min(1, e.swell + 1 / 30);
      const dx = player.x - e.x;
      const dz = player.z - e.z;
      e.yaw = Math.atan2(-dx, -dz);
      if (e.swell >= 1) {
        explode(e.x, e.y + 0.8, e.z, 3);
        e.dead = true;
        return;
      }
    } else {
      e.swell = Math.max(0, e.swell - 1 / 20);
      pathTo(e, player.x, player.y, player.z);
      move = followPath(e);
      if (!e.path) {
        const dx = player.x - e.x;
        const dz = player.z - e.z;
        const d = Math.hypot(dx, dz) || 1;
        move = { x: dx / d, z: dz / d, jump: false };
        e.yaw = Math.atan2(-dx, -dz);
      }
    }
  } else {
    e.swell = Math.max(0, e.swell - 1 / 20);
    move = wander(e);
  }
  stepEntity(e, move.x, move.z, move.jump);
}

function explode(x: number, y: number, z: number, radius: number): void {
  // Spherical voxel destruction.
  const r = Math.ceil(radius);
  for (let dy = -r; dy <= r; dy++) {
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        const dd = dx * dx + dy * dy + dz * dz;
        if (dd > radius * radius) continue;
        const bx = Math.floor(x) + dx;
        const by = Math.floor(y) + dy;
        const bz = Math.floor(z) + dz;
        const id = world.getBlockId(bx, by, bz);
        if (id === B.AIR || id === B.BEDROCK) continue;
        const def = blockDef(id);
        if (def.hardness < 0) continue;
        const be = blockEntities.get(beKey(bx, by, bz));
        if (be) {
          dropBEContents(be);
          blockEntities.delete(beKey(bx, by, bz));
        }
        setBlockLocal(bx, by, bz, B.AIR);
        // ~30% of destroyed blocks drop items.
        if (rand.chance(0.3) && def.drop !== -1 && !isFluid(id)) {
          const dropId = def.drop ?? id;
          spawnItem(bx + 0.5, by + 0.5, bz + 0.5, makeStack(dropId, 1), (rand.float() - 0.5) * 3, 2, (rand.float() - 0.5) * 3);
        }
      }
    }
  }
  // Entity + player damage scaled by distance.
  const pd = Math.hypot(player.x - x, player.y + 0.9 - y, player.z - z);
  if (pd < radius * 2.2) {
    const dmg = Math.round(24 * (1 - pd / (radius * 2.2)));
    const kx = ((player.x - x) / (pd || 1)) * 10;
    const kz = ((player.z - z) / (pd || 1)) * 10;
    post({ t: 'damage', amount: dmg, kx, kz, cause: 'explosion' });
  }
  for (const v of queryRange(x, y, z, radius * 2.2)) {
    if (v.dead || v.type === EntityType.ITEM) continue;
    const d = Math.hypot(v.x - x, v.y - y, v.z - z);
    const dmg = Math.round(24 * Math.max(0, 1 - d / (radius * 2.2)));
    if (dmg > 0) damageEntity(v, dmg, ((v.x - x) / (d || 1)) * 8, ((v.z - z) / (d || 1)) * 8);
  }
  post({ t: 'explosion', x, y, z, radius });
}

/**
 * Love-mode steering shared by all farm animals: seek the nearest partner
 * of the same type also in love; touching spawns a baby. Returns a move
 * vector while courting, null otherwise.
 */
function tickLove(e: Ent): { x: number; z: number; jump: boolean } | null {
  if (e.love <= 0) return null;
  e.love--;
  let partner: Ent | null = null;
  let best = 8;
  for (const o of queryRange(e.x, e.y, e.z, 8)) {
    if (o === e || o.dead || o.type !== e.type || o.love <= 0 || o.growTicks > 0) continue;
    const d = Math.hypot(o.x - e.x, o.z - e.z);
    if (d < best) {
      best = d;
      partner = o;
    }
  }
  if (!partner) return { x: 0, z: 0, jump: false };
  if (best < 1.4) {
    e.love = 0;
    partner.love = 0;
    const baby = makeEntity(e.type, (e.x + partner.x) / 2, e.y, (e.z + partner.z) / 2);
    baby.growTicks = 20 * 60 * 3; // grows up in 3 minutes
    return { x: 0, z: 0, jump: false };
  }
  const dx = partner.x - e.x;
  const dz = partner.z - e.z;
  e.yaw = Math.atan2(-dx, -dz);
  return { x: dx / best, z: dz / best, jump: false };
}

/** Generic passive animal: wander, court while in love; chickens flutter. */
function tickAnimal(e: Ent): void {
  let move = tickLove(e) ?? wander(e);
  if (e.type === EntityType.CHICKEN && !e.onGround && e.vy < -2.5) {
    e.vy = -2.5; // wing-flap slow fall
  }
  stepEntity(e, move.x, move.z, move.jump);
}

function tickSheep(e: Ent): void {
  e.grazeTimer = Math.max(0, e.grazeTimer - 1);
  if (e.grazeTimer === 20) {
    // Bite lands: grass -> dirt, wool regrows.
    const bx = Math.floor(e.x);
    const by = Math.floor(e.y) - 1;
    const bz = Math.floor(e.z);
    if (world.getBlockId(bx, by, bz) === B.GRASS) {
      setBlockLocal(bx, by, bz, B.DIRT);
      e.sheared = false;
      e.hp = Math.min(ENTITY_DEFS[e.type].maxHp, e.hp + 2);
    }
  }
  let move = { x: 0, z: 0, jump: false };
  const loveMove = tickLove(e);
  if (loveMove) {
    move = loveMove;
  } else if (e.grazeTimer === 0) {
    e.hungerTimer--;
    if (e.hungerTimer <= 0 && world.getBlockId(Math.floor(e.x), Math.floor(e.y) - 1, Math.floor(e.z)) === B.GRASS) {
      e.grazeTimer = 40;
      e.hungerTimer = rand.range(600, 1600);
    } else {
      move = wander(e);
    }
  }
  stepEntity(e, move.x, move.z, move.jump);
}

function tickVillager(e: Ent): void {
  // Panic: zombie within 8 blocks AND direct line of sight (Module 5 spec).
  e.panic = false;
  for (const z of queryRange(e.x, e.y, e.z, 8)) {
    if (z.type !== EntityType.ZOMBIE || z.dead) continue;
    if (hasLOS(e.x, e.y + 1.6, e.z, z.x, z.y + 1.6, z.z)) {
      e.panic = true;
      // Flee directly away.
      const dx = e.x - z.x;
      const dz = e.z - z.z;
      const d = Math.hypot(dx, dz) || 1;
      e.path = null;
      e.yaw = Math.atan2(-dx, -dz);
      stepEntity(e, dx / d, dz / d, false);
      return;
    }
  }

  e.stateTimer--;
  let move = { x: 0, z: 0, jump: false };
  if (e.stateTimer <= 0) {
    e.stateTimer = rand.range(80, 240);
    if (e.workY >= 0 && rand.chance(0.4)) {
      pathTo(e, e.workX, e.workY, e.workZ);
    } else {
      // Wander within the village boundary.
      const ang = rand.float() * Math.PI * 2;
      const r = rand.float() * e.homeR;
      e.wanderX = e.homeX + Math.cos(ang) * r;
      e.wanderZ = e.homeZ + Math.sin(ang) * r;
      e.path = null;
    }
  }
  if (e.path) {
    move = followPath(e);
  } else {
    const dx = e.wanderX - e.x;
    const dz = e.wanderZ - e.z;
    const d = Math.hypot(dx, dz);
    if (d > 1.2) {
      move = { x: (dx / d) * 0.6, z: (dz / d) * 0.6, jump: false };
      e.yaw = Math.atan2(-dx, -dz);
    }
  }
  stepEntity(e, move.x, move.z, move.jump);
}

function tickGolem(e: Ent): void {
  const def = ENTITY_DEFS[e.type];
  let move = { x: 0, z: 0, jump: false };
  let attacking = false;
  // Hunt hostiles within 16.
  let best: Ent | null = null;
  let bestD = 16;
  for (const m of queryRange(e.x, e.y, e.z, 16)) {
    if (m.dead || !ENTITY_DEFS[m.type].hostile) continue;
    const d = Math.hypot(m.x - e.x, m.y - e.y, m.z - e.z);
    if (d < bestD) {
      bestD = d;
      best = m;
    }
  }
  if (best) {
    pathTo(e, best.x, best.y, best.z);
    move = followPath(e);
    if (!e.path) {
      const dx = best.x - e.x;
      const dz = best.z - e.z;
      const d = Math.hypot(dx, dz) || 1;
      move = { x: dx / d, z: dz / d, jump: false };
      e.yaw = Math.atan2(-dx, -dz);
    }
    if (bestD < def.attackRange && e.attackCooldown <= 0) {
      e.attackCooldown = 30;
      attacking = true;
      const dx = best.x - e.x;
      const dz = best.z - e.z;
      const d = Math.hypot(dx, dz) || 1;
      damageEntity(best, def.attackDamage, (dx / d) * 4, (dz / d) * 4);
      best.vy += 8; // signature golem launch
    }
  } else {
    move = wander(e);
  }
  e.swell = attacking ? 1 : 0; // reuse field for attack anim flag
  stepEntity(e, move.x, move.z, move.jump);
}

/** Piglin: wanders peacefully; striking one angers the whole group. */
function tickPiglin(e: Ent): void {
  const def = ENTITY_DEFS[e.type];
  let move = { x: 0, z: 0, jump: false };
  if (e.anger > 0 && player.valid && player.health > 0 && !player.creative) {
    e.anger--;
    const pd = distToPlayer(e);
    pathTo(e, player.x, player.y, player.z);
    move = followPath(e);
    if (!e.path) {
      const dx = player.x - e.x;
      const dz = player.z - e.z;
      const d = Math.hypot(dx, dz) || 1;
      move = { x: dx / d, z: dz / d, jump: false };
      e.yaw = Math.atan2(-dx, -dz);
    }
    if (pd < def.attackRange && e.attackCooldown <= 0) {
      e.attackCooldown = 22;
      const dx = player.x - e.x;
      const dz = player.z - e.z;
      const d = Math.hypot(dx, dz) || 1;
      post({ t: 'damage', amount: def.attackDamage, kx: (dx / d) * 6, kz: (dz / d) * 6, cause: 'mob' });
    }
  } else {
    e.anger = 0;
    move = wander(e);
  }
  stepEntity(e, move.x, move.z, move.jump);
}

/** Magma cube: springy hops toward the player, contact damage on touch. */
function tickMagmaCube(e: Ent): void {
  const def = ENTITY_DEFS[e.type];
  // Squish factor rides in `swell` for the renderer: 1 grounded, 0 airborne.
  e.swell = e.onGround ? Math.min(1, e.swell + 0.15) : Math.max(0, e.swell - 0.3);
  let move = { x: 0, z: 0, jump: false };
  const pd = distToPlayer(e);
  if (pd < 16 && player.valid && player.health > 0 && !player.creative) {
    const dx = player.x - e.x;
    const dz = player.z - e.z;
    const d = Math.hypot(dx, dz) || 1;
    e.yaw = Math.atan2(-dx, -dz);
    if (e.onGround) {
      e.stateTimer--;
      if (e.stateTimer <= 0) {
        e.stateTimer = rand.range(16, 40);
        e.vy = 7.5;
        e.onGround = false;
      }
    } else {
      move = { x: dx / d, z: dz / d, jump: false }; // steer mid-air
    }
    if (pd < def.attackRange && e.attackCooldown <= 0) {
      e.attackCooldown = 24;
      post({ t: 'damage', amount: def.attackDamage, kx: (dx / d) * 6, kz: (dz / d) * 6, cause: 'mob' });
    }
  } else {
    // Idle bounces in a random direction.
    e.stateTimer--;
    if (e.onGround && e.stateTimer <= 0) {
      e.stateTimer = rand.range(60, 180);
      e.vy = 6;
      const ang = rand.float() * Math.PI * 2;
      e.wanderX = Math.cos(ang);
      e.wanderZ = Math.sin(ang);
      e.yaw = Math.atan2(-e.wanderX, -e.wanderZ);
    }
    if (!e.onGround) move = { x: e.wanderX * 0.7, z: e.wanderZ * 0.7, jump: false };
  }
  stepEntity(e, move.x, move.z, move.jump);
}

function tickItem(e: Ent): void {
  e.age++;
  if (e.age > ITEM_DESPAWN_TICKS) {
    e.dead = true;
    return;
  }
  if (e.pickupDelay > 0) e.pickupDelay--;
  stepEntity(e, 0, 0, false);

  // Merge with nearby identical stacks.
  if (e.age % 10 === 0 && e.itemStack) {
    for (const o of queryRange(e.x, e.y, e.z, ITEM_MERGE_RADIUS)) {
      if (o === e || o.dead || o.type !== EntityType.ITEM || !o.itemStack) continue;
      if (stacksEqualType(e.itemStack, o.itemStack)) {
        const max = itemDef(e.itemStack.id).maxStack;
        if (e.itemStack.count + o.itemStack.count <= max) {
          e.itemStack.count += o.itemStack.count;
          o.dead = true;
        }
      }
    }
  }

  // Player pickup magnet.
  if (e.pickupDelay === 0 && player.valid && player.health > 0) {
    const d = Math.hypot(player.x - e.x, player.y + 0.8 - e.y, player.z - e.z);
    if (d < ITEM_PICKUP_RADIUS) {
      e.dead = true;
      if (e.itemStack) {
        if (session) {
          // Worker owns the player inventory while a container is open.
          const rest = insertStack(session.inv, e.itemStack);
          if (rest) spawnItem(e.x, e.y, e.z, rest, 0, 0.5, 0).pickupDelay = 40;
          session.dirty = true;
        } else {
          post({ t: 'give', stack: e.itemStack });
        }
      }
    } else if (d < 2.4) {
      const f = 4 * DT;
      e.vx += ((player.x - e.x) / d) * f * 8;
      e.vy += ((player.y + 0.6 - e.y) / d) * f * 6;
      e.vz += ((player.z - e.z) / d) * f * 8;
    }
  }
}

function tickArrow(e: Ent): void {
  e.age++;
  if (e.age > 600 || (e.stuck && e.age > 200)) {
    e.dead = true;
    return;
  }
  if (e.stuck) return;

  e.vy += GRAVITY * 0.6 * DT;
  const steps = Math.max(1, Math.ceil((Math.hypot(e.vx, e.vy, e.vz) * DT) / 0.4));
  for (let i = 0; i < steps; i++) {
    const nx = e.x + (e.vx * DT) / steps;
    const ny = e.y + (e.vy * DT) / steps;
    const nz = e.z + (e.vz * DT) / steps;
    // Block hit
    if (blockDef(world.getBlockId(Math.floor(nx), Math.floor(ny), Math.floor(nz))).solid) {
      e.stuck = true;
      e.age = Math.max(e.age, 100);
      return;
    }
    e.x = nx;
    e.y = ny;
    e.z = nz;
    // Player hit
    if (player.valid && player.health > 0) {
      if (
        Math.abs(player.x - e.x) < 0.5 &&
        Math.abs(player.z - e.z) < 0.5 &&
        e.y > player.y && e.y < player.y + 1.9
      ) {
        const d = Math.hypot(e.vx, e.vz) || 1;
        post({ t: 'damage', amount: 4, kx: (e.vx / d) * 5, kz: (e.vz / d) * 5, cause: 'arrow' });
        e.dead = true;
        return;
      }
    }
    // Mob hit (not the shooter)
    for (const m of queryRange(e.x, e.y, e.z, 1.2)) {
      if (m.dead || m.id === e.targetId || m.type === EntityType.ITEM || m.type === EntityType.ARROW) continue;
      const def = ENTITY_DEFS[m.type];
      if (
        Math.abs(m.x - e.x) < def.width / 2 + 0.2 &&
        Math.abs(m.z - e.z) < def.width / 2 + 0.2 &&
        e.y > m.y - 0.2 && e.y < m.y + def.height + 0.2
      ) {
        const d = Math.hypot(e.vx, e.vz) || 1;
        damageEntity(m, 4, (e.vx / d) * 4, (e.vz / d) * 4);
        e.dead = true;
        return;
      }
    }
  }
  e.yaw = Math.atan2(-e.vx, -e.vz);
  e.pitch = Math.atan2(e.vy, Math.hypot(e.vx, e.vz));
}

function wander(e: Ent): { x: number; z: number; jump: boolean } {
  e.stateTimer--;
  if (e.stateTimer <= 0) {
    e.stateTimer = rand.range(60, 200);
    const ang = rand.float() * Math.PI * 2;
    const r = 3 + rand.float() * 7;
    e.wanderX = e.x + Math.cos(ang) * r;
    e.wanderZ = e.z + Math.sin(ang) * r;
  }
  const dx = e.wanderX - e.x;
  const dz = e.wanderZ - e.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.8) return { x: 0, z: 0, jump: false };
  e.yaw = Math.atan2(-dx, -dz);
  return { x: (dx / d) * 0.55, z: (dz / d) * 0.55, jump: false };
}

// ---------------------------------------------------------------------------
// Spawning systems
// ---------------------------------------------------------------------------
const villages: VillageDef[] = [];
const consumedChunks = new Set<string>();
let golemCooldown = 0;

function trySpawnAt(type: EntityType, x: number, y: number, z: number, maxScan: number, ignoreLight = false): boolean {
  // Scan downward for ground.
  const def = ENTITY_DEFS[type];
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  for (let dy = 0; dy < maxScan; dy++) {
    const yy = Math.floor(y) - dy;
    if (yy < 1) return false;
    const floorId = world.getBlockId(ix, yy - 1, iz);
    if (!blockDef(floorId).solid) continue;
    const feet = world.getBlockId(ix, yy, iz);
    const head = world.getBlockId(ix, yy + 1, iz);
    // Land only: never spawn in or under fluids (Module 5 request).
    if (isLava(feet) || isLava(head) || isWater(floorId) || isWater(feet) || isWater(head)) return false;
    if (boxIntersectsSolid(world, x - def.width / 2, yy + 0.01, z - def.width / 2, def.width, def.height, def.width)) {
      continue;
    }
    if (ENTITY_DEFS[type].hostile && !ignoreLight) {
      // Hostiles spawn only in darkness: no block light, AND either it is
      // night (low sun) or the spot has no sky access (a cave). This makes
      // surface zombies/skeletons strictly night-time while caves still spawn.
      if (world.getBlockLight(ix, yy, iz) > 0) return false;
      const sky = world.getSun(ix, yy, iz);
      if (!isNight() && sky >= 8) return false;
    }
    makeEntity(type, x, yy + 0.02, z);
    return true;
  }
  return false;
}

function naturalSpawning(): void {
  if (tickCount % 20 !== 0 || !player.valid) return;
  let hostiles = 0;
  let passives = 0;
  for (const e of entities.values()) {
    if (e.dead) continue;
    if (ENTITY_DEFS[e.type].hostile) hostiles++;
    else if (isFarmAnimal(e.type)) passives++;
  }
  if (dim === 1) {
    // Nether table: magma cubes (hostile) + neutral piglin bands.
    let piglins = 0;
    for (const e of entities.values()) {
      if (!e.dead && e.type === EntityType.PIGLIN) piglins++;
    }
    for (let i = 0; i < 4; i++) {
      const wantPiglin = rand.chance(0.45);
      if (wantPiglin ? piglins >= 8 : hostiles >= HOSTILE_CAP) continue;
      const ang = rand.float() * Math.PI * 2;
      const dist = SPAWN_MIN_RADIUS + rand.float() * (SPAWN_MAX_RADIUS - SPAWN_MIN_RADIUS);
      const x = player.x + Math.cos(ang) * dist;
      const z = player.z + Math.sin(ang) * dist;
      if (!chunkLoaded(x, z)) continue;
      const y = Math.min(120, Math.max(20, player.y + rand.range(-12, 12) + 8));
      // Lava light is everywhere down there: skip the darkness rule.
      if (trySpawnAt(wantPiglin ? EntityType.PIGLIN : EntityType.MAGMA_CUBE, x, y, z, 24, true)) break;
    }
    for (const e of entities.values()) {
      if (e.dead) continue;
      const d = Math.hypot(e.x - player.x, e.z - player.z);
      if (d > DESPAWN_RADIUS && (ENTITY_DEFS[e.type].hostile || e.type === EntityType.PIGLIN || e.type === EntityType.ARROW)) {
        e.dead = true;
      }
    }
    return;
  }
  if (hostiles < HOSTILE_CAP) {
    for (let i = 0; i < 4; i++) {
      const ang = rand.float() * Math.PI * 2;
      const dist = SPAWN_MIN_RADIUS + rand.float() * (SPAWN_MAX_RADIUS - SPAWN_MIN_RADIUS);
      const x = player.x + Math.cos(ang) * dist;
      const z = player.z + Math.sin(ang) * dist;
      if (!chunkLoaded(x, z)) continue;
      const y = Math.min(CHUNK_HEIGHT - 4, player.y + rand.range(-12, 12) + 8);
      const roll = rand.float();
      const type = roll < 0.45 ? EntityType.ZOMBIE : roll < 0.72 ? EntityType.SKELETON : EntityType.CREEPER;
      if (trySpawnAt(type, x, y, z, 24)) break;
    }
  }
  if (passives < PASSIVE_CAP / 2 && tickCount % 400 === 0 && !isNight()) {
    const ang = rand.float() * Math.PI * 2;
    const dist = 24 + rand.float() * 20;
    const x = player.x + Math.cos(ang) * dist;
    const z = player.z + Math.sin(ang) * dist;
    if (chunkLoaded(x, z)) {
      const h = world.highestSolid(Math.floor(x), Math.floor(z));
      if (world.getBlockId(Math.floor(x), h, Math.floor(z)) === B.GRASS) {
        const roll = rand.float();
        const type =
          roll < 0.25 ? EntityType.SHEEP :
          roll < 0.5 ? EntityType.COW :
          roll < 0.75 ? EntityType.PIG : EntityType.CHICKEN;
        trySpawnAt(type, x, h + 2, z, 4);
      }
    }
  }

  // Despawn far hostiles and stale arrows.
  for (const e of entities.values()) {
    if (e.dead) continue;
    const d = Math.hypot(e.x - player.x, e.z - player.z);
    if (d > DESPAWN_RADIUS && (ENTITY_DEFS[e.type].hostile || e.type === EntityType.ARROW)) {
      e.dead = true;
    }
  }
}

/** Iron golem summoning: 3+ panicking villagers inside a 16x13x16 volume. */
function golemSpawning(): void {
  if (tickCount % 40 !== 0) return;
  if (golemCooldown > 0) {
    golemCooldown -= 40;
    return;
  }
  const panicking: Ent[] = [];
  for (const e of entities.values()) {
    if (e.type === EntityType.VILLAGER && e.panic && !e.dead) panicking.push(e);
  }
  if (panicking.length < 3) return;
  for (const center of panicking) {
    let cluster = 0;
    for (const v of panicking) {
      if (
        Math.abs(v.x - center.x) <= 8 &&
        Math.abs(v.y - center.y) <= 6.5 &&
        Math.abs(v.z - center.z) <= 8
      ) {
        cluster++;
      }
    }
    if (cluster >= 3) {
      // Cap golem population near the cluster.
      let golems = 0;
      for (const g of queryRange(center.x, center.y, center.z, 32)) {
        if (g.type === EntityType.IRON_GOLEM && !g.dead) golems++;
      }
      if (golems >= 2) return;
      for (let attempt = 0; attempt < 10; attempt++) {
        const x = center.x + (rand.float() - 0.5) * 10;
        const z = center.z + (rand.float() - 0.5) * 10;
        if (trySpawnAtIgnoreLight(EntityType.IRON_GOLEM, x, center.y + 4, z, 10)) {
          golemCooldown = 1200;
          return;
        }
      }
    }
  }
}

function trySpawnAtIgnoreLight(type: EntityType, x: number, y: number, z: number, maxScan: number): boolean {
  const def = ENTITY_DEFS[type];
  for (let dy = 0; dy < maxScan; dy++) {
    const yy = Math.floor(y) - dy;
    if (yy < 1) return false;
    if (!blockDef(world.getBlockId(Math.floor(x), yy - 1, Math.floor(z))).solid) continue;
    if (boxIntersectsSolid(world, x - def.width / 2, yy + 0.01, z - def.width / 2, def.width, def.height, def.width)) continue;
    const e = makeEntity(type, x, yy + 0.02, z);
    // Golems guard the nearest village.
    const v = nearestVillage(x, z);
    if (v) {
      e.homeX = v.x;
      e.homeZ = v.z;
      e.homeR = v.radius;
    }
    return true;
  }
  return false;
}

function nearestVillage(x: number, z: number): VillageDef | null {
  let best: VillageDef | null = null;
  let bestD = 96;
  for (const v of villages) {
    const d = Math.hypot(v.x - x, v.z - z);
    if (d < bestD) {
      bestD = d;
      best = v;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Random ticks: grass spread, leaf decay (Module 3 tree decay)
// ---------------------------------------------------------------------------
function randomTicks(): void {
  if (!player.valid) return;
  const pcx = Math.floor(player.x) >> 4;
  const pcz = Math.floor(player.z) >> 4;
  for (let dz = -4; dz <= 4; dz++) {
    for (let dx = -4; dx <= 4; dx++) {
      const chunk = world.getChunk(pcx + dx, pcz + dz);
      if (!chunk) continue;
      for (let n = 0; n < 3; n++) {
        const lx = rand.int(16);
        const ly = rand.int(CHUNK_HEIGHT);
        const lz = rand.int(16);
        const x = ((pcx + dx) << 4) + lx;
        const z = ((pcz + dz) << 4) + lz;
        const id = world.getBlockId(x, ly, z);
        if (id === B.GRASS) {
          const above = world.getBlockId(x, ly + 1, z);
          if (blockDef(above).opaque) {
            setBlockLocal(x, ly, z, B.DIRT);
          } else if (rand.chance(0.3)) {
            // Spread to a nearby dirt block with sky access.
            const tx = x + rand.range(-1, 1);
            const ty = ly + rand.range(-1, 1);
            const tz = z + rand.range(-1, 1);
            if (
              world.getBlockId(tx, ty, tz) === B.DIRT &&
              !blockDef(world.getBlockId(tx, ty + 1, tz)).opaque &&
              world.getSun(tx, ty + 1, tz) >= 6
            ) {
              setBlockLocal(tx, ty, tz, B.GRASS);
            }
          }
        } else if (id === B.OAK_LEAVES || id === B.BIRCH_LEAVES) {
          if (!logNearby(x, ly, z)) setBlockLocal(x, ly, z, B.AIR);
        }
      }
    }
  }
}

function logNearby(x: number, y: number, z: number): boolean {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dz = -3; dz <= 3; dz++) {
      for (let dx = -3; dx <= 3; dx++) {
        if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 4) continue;
        const id = world.getBlockId(x + dx, y + dy, z + dz);
        if (id === B.OAK_LOG || id === B.BIRCH_LOG) return true;
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Container sessions (worker-authoritative while open)
// ---------------------------------------------------------------------------
interface Session {
  be: BlockEntity;
  inv: Slots; // mirrored 36-slot player inventory
  cursor: ItemStack | null;
  dirty: boolean;
}

let session: Session | null = null;

function sessionSync(): void {
  if (!session) return;
  const be = session.be;
  const msg: ContainerSyncMsg = {
    t: 'containerSync',
    x: be.x, y: be.y, z: be.z,
    kind: be.kind === 'spawner' ? 'chest' : be.kind,
    slots: be.slots.map(cloneStack),
    inv: session.inv.map(cloneStack),
    cursor: cloneStack(session.cursor),
    fuel: be.fuelMax > 0 ? be.fuel / be.fuelMax : 0,
    cook: be.cookMax > 0 ? be.cook / be.cookMax : 0,
  };
  post(msg);
  session.dirty = false;
}

function sessionClick(area: 0 | 1, slot: number, button: 0 | 2, shift: boolean): void {
  if (!session) return;
  const be = session.be;
  const slots = area === 0 ? be.slots : session.inv;
  if (slot < 0 || slot >= slots.length) return;

  if (shift) {
    const s = slots[slot];
    if (s) {
      slots[slot] = null;
      let rest: ItemStack | null = s;
      if (area === 1) {
        // Into the container with furnace slot routing.
        if (be.kind === 'furnace') {
          if (smeltResult(s.id)) rest = insertStack(be.slots, s, 0, 1);
          else if (stackFuel(s.id) > 0) rest = insertStack(be.slots, s, 1, 2);
          else rest = s;
        } else {
          rest = insertStack(be.slots, s);
        }
      } else {
        rest = insertStack(session.inv, s);
      }
      if (rest) slots[slot] = rest;
    }
  } else {
    // Furnace output slot: take only.
    if (area === 0 && be.kind === 'furnace' && slot === 2 && session.cursor) {
      const out = be.slots[2];
      if (!out || !stacksEqualType(out, session.cursor)) {
        sessionSync();
        return;
      }
    }
    session.cursor = clickSlot(slots, slot, session.cursor, button);
  }
  sessionSync();
}

function closeSession(): void {
  if (!session) return;
  post({
    t: 'containerClosed',
    inv: session.inv.map(cloneStack),
    cursor: cloneStack(session.cursor),
  });
  session = null;
}

// ---------------------------------------------------------------------------
// Snapshot
// ---------------------------------------------------------------------------
function postSnapshot(): void {
  const list: Ent[] = [];
  for (const e of entities.values()) {
    if (e.dead) {
      entities.delete(e.id);
      // Announce the death once (hp <= 0 -> client plays a fall-over anim);
      // despawns/pickups keep hp > 0 and just disappear.
      if (e.type !== EntityType.ITEM && e.type !== EntityType.ARROW) list.push(e);
    } else {
      list.push(e);
    }
  }
  const buf = new Float32Array(list.length * SNAP_STRIDE);
  let o = 0;
  for (const e of list) {
    let anim = 0;
    if (e.burning) anim |= AnimFlag.BURNING;
    if (e.panic) anim |= AnimFlag.PANIC;
    if (e.sheared) anim |= AnimFlag.SHEARED;
    if (e.type === EntityType.SHEEP && e.grazeTimer > 0) anim |= AnimFlag.ATTACKING;
    if (e.type === EntityType.IRON_GOLEM && e.swell > 0) anim |= AnimFlag.ATTACKING;
    if (e.growTicks > 0) anim |= AnimFlag.BABY;
    if (e.love > 0) anim |= AnimFlag.PANIC; // reuse: hearts wiggle client-side
    buf[o] = e.id;
    buf[o + 1] = e.type;
    buf[o + 2] = e.x;
    buf[o + 3] = e.y;
    buf[o + 4] = e.z;
    buf[o + 5] = e.yaw;
    buf[o + 6] = e.pitch;
    buf[o + 7] = e.hp;
    buf[o + 8] = e.hurt;
    buf[o + 9] = anim;
    buf[o + 10] = e.type === EntityType.ITEM ? (e.itemStack?.id ?? 0) : e.swell;
    buf[o + 11] = e.type === EntityType.ITEM ? (e.itemStack?.count ?? 0) : 0;
    o += SNAP_STRIDE;
  }
  ctx.postMessage({ t: 'snap', tick: tickCount, buf: buf.buffer, count: list.length }, [buf.buffer]);
}

function post(msg: FromLogicMsg): void {
  ctx.postMessage(msg);
}

// ---------------------------------------------------------------------------
// Main 20 TPS loop (drift-corrected)
// ---------------------------------------------------------------------------
function tick(): void {
  const t0 = performance.now();
  tickCount++;

  processFluids();
  randomTicks();
  rebuildSpatial();
  tickPlates();
  processRedstone();

  // Block entities
  let sessionBEChanged = false;
  for (const be of blockEntities.values()) {
    if (!chunkLoaded(be.x, be.z)) continue;
    if (be.kind === 'furnace') {
      const changed = tickFurnace(be);
      if (session?.be === be && changed) sessionBEChanged = true;
    } else if (be.kind === 'hopper') {
      if (tickCount % HOPPER_INTERVAL === 0) {
        const changed = tickHopper(be);
        if (session?.be === be && changed) sessionBEChanged = true;
      }
    } else if (be.kind === 'spawner') {
      tickSpawner(be);
    }
  }

  // Entities
  for (const e of entities.values()) {
    if (e.dead) continue;
    if (e.hurt > 0) e.hurt--;
    if (e.attackCooldown > 0) e.attackCooldown--;
    if (e.repathTimer > 0) e.repathTimer--;
    if (!chunkLoaded(e.x, e.z)) continue; // frozen in unloaded space
    if (e.y < -8) {
      e.dead = true;
      continue;
    }
    switch (e.type) {
      case EntityType.ZOMBIE: tickZombie(e); break;
      case EntityType.SKELETON: tickSkeleton(e); break;
      case EntityType.CREEPER: tickCreeper(e); break;
      case EntityType.SHEEP: tickSheep(e); break;
      case EntityType.VILLAGER: tickVillager(e); break;
      case EntityType.IRON_GOLEM: tickGolem(e); break;
      case EntityType.ITEM: tickItem(e); break;
      case EntityType.ARROW: tickArrow(e); break;
      case EntityType.COW:
      case EntityType.PIG:
      case EntityType.CHICKEN:
        tickAnimal(e);
        break;
      case EntityType.PIGLIN: tickPiglin(e); break;
      case EntityType.MAGMA_CUBE: tickMagmaCube(e); break;
    }
    if (e.growTicks > 0) e.growTicks--;
  }

  naturalSpawning();
  golemSpawning();

  // Outgoing block edits
  if (outBlocks.length > 0) {
    const arr = new Int32Array(outBlocks);
    outBlocks.length = 0;
    ctx.postMessage({ t: 'blocks', cells: arr.buffer }, [arr.buffer]);
  }

  // Container session live updates (furnace bars, hopper movement)
  if (session && (sessionBEChanged || session.dirty || (session.be.kind === 'furnace' && tickCount % 4 === 0))) {
    sessionSync();
  }

  postSnapshot();

  if (tickCount % 20 === 0) {
    post({ t: 'stats', entities: entities.size, tickMs: Math.round((performance.now() - t0) * 10) / 10 });
  }
}

let nextTick = 0;

function loop(): void {
  const now = performance.now();
  let safety = 5;
  while (now >= nextTick && safety-- > 0) {
    tick();
    nextTick += TICK_MS;
  }
  if (nextTick < now) nextTick = now + TICK_MS; // fell behind: resync
  setTimeout(loop, Math.max(0, nextTick - performance.now()));
}

// ---------------------------------------------------------------------------
// Message handling
// ---------------------------------------------------------------------------
function handleChunk(cx: number, cz: number, data: ArrayBuffer, bes: BlockEntitySpawn[], mobs: { type: number; x: number; y: number; z: number }[], village: VillageDef | null): void {
  const arr = new Uint16Array(data);
  world.addChunk(cx, cz, arr);
  const ck = chunkKey(cx, cz);

  // Register redstone parts (plates need ticking, circuits need an initial
  // evaluation so journal-replayed states settle).
  for (let i = 0; i < arr.length; i++) {
    const id = arr[i] & 0xff;
    if (!RS_LUT[id]) continue;
    const x = cx * 16 + (i & 15);
    const y = i >> 8;
    const z = cz * 16 + ((i >> 4) & 15);
    markRedstone(x, y, z);
    if (isPlate(id)) plates.set(x + ',' + y + ',' + z, [x, y, z]);
  }

  for (const b of bes) {
    const kind = beKindFor(b.blockId);
    if (kind && !blockEntities.has(beKey(b.x, b.y, b.z))) {
      createBE(b.x, b.y, b.z, kind, b.loot);
    }
  }
  if (village && !villages.some((v) => v.x === village.x && v.z === village.z)) {
    villages.push(village);
  }
  if (!consumedChunks.has(ck)) {
    consumedChunks.add(ck);
    for (const m of mobs) {
      const e = makeEntity(m.type as EntityType, m.x, m.y, m.z);
      if (m.type === EntityType.VILLAGER) {
        const v = nearestVillage(m.x, m.z) ?? village;
        if (v) {
          e.homeX = v.x;
          e.homeZ = v.z;
          e.homeR = v.radius;
        }
        // Link to the nearest workstation (crafting table / furnace).
        const ws = findWorkstation(Math.floor(m.x), Math.floor(m.y), Math.floor(m.z), 24);
        if (ws) {
          e.workX = ws[0];
          e.workY = ws[1];
          e.workZ = ws[2];
        }
      }
    }
  }
  // Wake fluids on chunk borders (ocean edges next to caves, etc.).
  for (let y = 0; y < CHUNK_HEIGHT; y += 8) {
    for (let i = 0; i < 16; i += 4) {
      scheduleFluidAround(cx * 16 + i, y, cz * 16);
      scheduleFluidAround(cx * 16 + i, y, cz * 16 + 15);
      scheduleFluidAround(cx * 16, y, cz * 16 + i);
      scheduleFluidAround(cx * 16 + 15, y, cz * 16 + i);
    }
  }
}

function findWorkstation(x: number, y: number, z: number, r: number): [number, number, number] | null {
  for (let dy = -4; dy <= 4; dy++) {
    for (let dz = -r; dz <= r; dz += 2) {
      for (let dx = -r; dx <= r; dx += 2) {
        const id = world.getBlockId(x + dx, y + dy, z + dz);
        if (id === B.CRAFTING_TABLE || isFurnace(id)) return [x + dx, y + dy, z + dz];
      }
    }
  }
  return null;
}

ctx.onmessage = (e: MessageEvent<ToLogicMsg>) => {
  const msg = e.data;
  switch (msg.t) {
    case 'init':
      seed = msg.seed;
      rand = new Random(deriveSeed(seed, 'logic'));
      nextTick = performance.now() + TICK_MS;
      setTimeout(loop, TICK_MS);
      break;
    case 'chunk':
      handleChunk(msg.cx, msg.cz, msg.data, msg.blockEntities, msg.mobs, msg.village);
      break;
    case 'unchunk':
      world.removeChunk(msg.cx, msg.cz);
      break;
    case 'patch': {
      const cells = new Int32Array(msg.cells);
      for (let i = 0; i < cells.length; i += 4) {
        const x = cells[i];
        const y = cells[i + 1];
        const z = cells[i + 2];
        const before = world.getBlockId(x, y, z);
        world.setRaw(x, y, z, cells[i + 3]);
        const after = voxelId(cells[i + 3]);
        if (before !== after) {
          scheduleFluidAround(x, y, z);
          onBlockIdChanged(x, y, z, before, after);
          // A block entity's block was replaced underneath it: clean up.
          const be = blockEntities.get(beKey(x, y, z));
          if (be && beKindFor(after) !== be.kind) {
            if (session?.be === be) closeSession();
            blockEntities.delete(beKey(x, y, z));
          }
        }
      }
      break;
    }
    case 'player':
      player.x = msg.x;
      player.y = msg.y;
      player.z = msg.z;
      player.yaw = msg.yaw;
      player.sneak = msg.sneak;
      player.health = msg.health;
      player.creative = msg.creative === true;
      player.valid = true;
      timeOfDay = msg.time;
      break;
    case 'attack': {
      const target = entities.get(msg.entityId);
      if (target && !target.dead) {
        damageEntity(target, msg.damage, msg.kx, msg.kz, true);
        // Piglins hold a grudge as a group.
        if (target.type === EntityType.PIGLIN) {
          target.anger = 600;
          for (const p of queryRange(target.x, target.y, target.z, 16)) {
            if (p.type === EntityType.PIGLIN && !p.dead) p.anger = 600;
          }
        }
      }
      break;
    }
    case 'spawnItem':
      spawnItem(msg.x, msg.y, msg.z, msg.stack, msg.vx, msg.vy, msg.vz);
      break;
    case 'placeBE': {
      const kind = beKindFor(msg.blockId);
      if (kind) createBE(msg.x, msg.y, msg.z, kind);
      break;
    }
    case 'breakBE': {
      const be = blockEntities.get(beKey(msg.x, msg.y, msg.z));
      if (be) {
        if (session?.be === be) closeSession();
        dropBEContents(be);
        blockEntities.delete(beKey(msg.x, msg.y, msg.z));
      }
      break;
    }
    case 'open': {
      const id = world.getBlockId(msg.x, msg.y, msg.z);
      const kind = beKindFor(id);
      if (!kind || kind === 'spawner') break;
      let be = blockEntities.get(beKey(msg.x, msg.y, msg.z));
      if (!be) be = createBE(msg.x, msg.y, msg.z, kind);
      session = { be, inv: msg.inv.map(cloneStack), cursor: null, dirty: false };
      sessionSync();
      break;
    }
    case 'close':
      closeSession();
      break;
    case 'click':
      sessionClick(msg.area, msg.slot, msg.button, msg.shift);
      break;
    case 'time':
      timeOfDay = msg.time;
      break;
    case 'dim': {
      // Dimension switch: drop the whole mirrored world + simulation state.
      dim = msg.dim;
      closeSession();
      entities.clear();
      blockEntities.clear();
      fluidQueue.clear();
      plates.clear();
      devicePrev.clear();
      redstoneDirty.length = 0;
      redstoneDirtySet.clear();
      villages.length = 0;
      consumedChunks.clear();
      world.chunks.clear();
      break;
    }
    case 'interactEntity': {
      const e = entities.get(msg.entityId);
      if (
        e && !e.dead && isFarmAnimal(e.type) &&
        e.growTicks <= 0 && e.love <= 0 &&
        (itemDef(msg.itemId).food ?? 0) > 0
      ) {
        e.love = 600; // 30s of courting
        e.hp = Math.min(ENTITY_DEFS[e.type].maxHp, e.hp + 2);
      }
      break;
    }
  }
};
