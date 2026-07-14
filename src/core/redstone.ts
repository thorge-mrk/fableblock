/**
 * Redstone-lite signal simulation (Phase 4).
 *
 * The whole signal state lives in ordinary block IDs (wire/lever/plate/lamp
 * ON-OFF variants), so recomputation is a pure function of the voxel world:
 * collect the connected component around changed cells, run a decaying
 * multi-source BFS through the wire graph (power 15 at sources, -1 per wire
 * step, staircase slopes allowed) and rewrite device blocks to match.
 *
 * Doors and trapdoors are EDGE-triggered against the `prev` state map so
 * manual right-click toggling coexists with wiring; lamps, wire visuals and
 * pistons follow the power level directly. Runs inside the logic worker but
 * is kept free of worker state for unit tests and the vite-node harness.
 */
import { World } from './world';
import {
  B, blockDef, RenderType, isWire, isDoor, isPistonBase, isPistonHead, pistonDir,
} from './blocks';

export type SetBlock = (x: number, y: number, z: number, id: number) => void;
export type CanPush = (x: number, y: number, z: number, id: number) => boolean;

const MAX_COMPONENT = 4096; // safety cap on cells visited per recompute
const SOURCE_POWER = 15;
const MAX_PUSH = 8;

export function isSource(id: number): boolean {
  return id === B.LEVER_ON || id === B.PRESSURE_PLATE_ON || id === B.REDSTONE_BLOCK;
}

export function isPlate(id: number): boolean {
  return id === B.PRESSURE_PLATE || id === B.PRESSURE_PLATE_ON;
}

function isDevice(id: number): boolean {
  return (
    id === B.REDSTONE_LAMP || id === B.REDSTONE_LAMP_ON ||
    isDoor(id) ||
    id === B.TRAPDOOR || id === B.TRAPDOOR_OPEN ||
    isPistonBase(id)
  );
}

export function isRedstoneComponent(id: number): boolean {
  return (
    isSource(id) || id === B.LEVER || isPlate(id) || isWire(id) ||
    isDevice(id) || isPistonHead(id)
  );
}

/** Blocks a piston can shove: plain solid/cutout cubes without inventories. */
export function defaultCanPush(id: number): boolean {
  const d = blockDef(id);
  if (d.hardness < 0) return false;
  if (isPistonBase(id) || isPistonHead(id)) return false;
  if (d.renderType !== RenderType.SOLID && d.renderType !== RenderType.CUTOUT) return false;
  return d.solid;
}

// Wire-to-wire steps: same level plus one-block staircase slopes.
const WIRE_STEPS: ReadonlyArray<readonly [number, number, number]> = [
  [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1],
  [1, 1, 0], [-1, 1, 0], [0, 1, 1], [0, 1, -1],
  [1, -1, 0], [-1, -1, 0], [0, -1, 1], [0, -1, -1],
];
const N6: ReadonlyArray<readonly [number, number, number]> = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
];

function key(x: number, y: number, z: number): string {
  return x + ',' + y + ',' + z;
}

/**
 * Recompute all circuits reachable from `dirty` and apply the results
 * through `setBlock`. `prev` persists door/trapdoor powered-edges between
 * calls (one map per world).
 */
export function runRedstone(
  world: World,
  dirty: ReadonlyArray<readonly [number, number, number]>,
  setBlock: SetBlock,
  prev: Map<string, boolean>,
  canPush: CanPush = (_x, _y, _z, id) => defaultCanPush(id),
): void {
  if (dirty.length === 0) return;

  // --- Collect the connected component(s) around the dirty cells ---
  const visited = new Set<string>();
  const wires: Array<[number, number, number]> = [];
  const sources: Array<[number, number, number]> = [];
  const devices: Array<[number, number, number, number]> = [];
  const queue: Array<[number, number, number]> = [];

  const push = (x: number, y: number, z: number): void => {
    const k = key(x, y, z);
    if (visited.has(k)) return;
    visited.add(k);
    queue.push([x, y, z]);
  };
  for (const [x, y, z] of dirty) {
    push(x, y, z);
    for (const [dx, dy, dz] of N6) push(x + dx, y + dy, z + dz);
  }

  let head = 0;
  while (head < queue.length && visited.size < MAX_COMPONENT) {
    const [x, y, z] = queue[head++];
    const id = world.getBlockId(x, y, z);
    if (!isRedstoneComponent(id)) continue;
    if (isWire(id)) {
      wires.push([x, y, z]);
      // Wires stitch the graph together across distance.
      for (const [dx, dy, dz] of WIRE_STEPS) push(x + dx, y + dy, z + dz);
      for (const [dx, dy, dz] of N6) push(x + dx, y + dy, z + dz);
    } else {
      if (isSource(id)) sources.push([x, y, z]);
      if (isDevice(id)) devices.push([x, y, z, id]);
      // Non-wire parts only see their direct neighbors.
      for (const [dx, dy, dz] of N6) push(x + dx, y + dy, z + dz);
    }
  }

  // --- Wire power: decaying multi-source BFS over the wire set ---
  const power = new Map<string, number>();
  const wireSet = new Set<string>();
  for (const [x, y, z] of wires) wireSet.add(key(x, y, z));
  const pq: Array<[number, number, number, number]> = [];
  for (const [x, y, z] of sources) {
    for (const [dx, dy, dz] of N6) {
      const k = key(x + dx, y + dy, z + dz);
      if (wireSet.has(k) && (power.get(k) ?? 0) < SOURCE_POWER) {
        power.set(k, SOURCE_POWER);
        pq.push([x + dx, y + dy, z + dz, SOURCE_POWER]);
      }
    }
  }
  let ph = 0;
  while (ph < pq.length) {
    const [x, y, z, lv] = pq[ph++];
    if ((power.get(key(x, y, z)) ?? 0) > lv) continue; // superseded entry
    const next = lv - 1;
    if (next <= 0) continue;
    for (const [dx, dy, dz] of WIRE_STEPS) {
      const k = key(x + dx, y + dy, z + dz);
      if (!wireSet.has(k)) continue;
      if ((power.get(k) ?? 0) >= next) continue;
      power.set(k, next);
      pq.push([x + dx, y + dy, z + dz, next]);
    }
  }

  // --- Wire visuals follow the level ---
  for (const [x, y, z] of wires) {
    const want = (power.get(key(x, y, z)) ?? 0) > 0 ? B.REDSTONE_WIRE_ON : B.REDSTONE_WIRE;
    if (world.getBlockId(x, y, z) !== want) setBlock(x, y, z, want);
  }

  const poweredAt = (x: number, y: number, z: number): boolean => {
    for (const [dx, dy, dz] of N6) {
      const nid = world.getBlockId(x + dx, y + dy, z + dz);
      if (isSource(nid)) return true;
      if (isWire(nid) && (power.get(key(x + dx, y + dy, z + dz)) ?? 0) > 0) return true;
    }
    return false;
  };

  // --- Devices ---
  const seenDoors = new Set<string>();
  for (const [x, y, z, id] of devices) {
    if (id === B.REDSTONE_LAMP || id === B.REDSTONE_LAMP_ON) {
      const want = poweredAt(x, y, z) ? B.REDSTONE_LAMP_ON : B.REDSTONE_LAMP;
      if (world.getBlockId(x, y, z) !== want) setBlock(x, y, z, want);
    } else if (isDoor(id)) {
      const by = id === B.DOOR_TOP || id === B.DOOR_TOP_OPEN ? y - 1 : y;
      const dk = key(x, by, z);
      if (seenDoors.has(dk)) continue;
      seenDoors.add(dk);
      const pow = poweredAt(x, by, z) || poweredAt(x, by + 1, z);
      const old = prev.get(dk);
      prev.set(dk, pow);
      // Edge-triggered: an unchanged level never fights manual toggling,
      // and the first sighting only records the level.
      if (old === undefined || old === pow) continue;
      if (isDoor(world.getBlockId(x, by, z))) {
        setBlock(x, by, z, pow ? B.DOOR_BOTTOM_OPEN : B.DOOR_BOTTOM);
        if (isDoor(world.getBlockId(x, by + 1, z))) {
          setBlock(x, by + 1, z, pow ? B.DOOR_TOP_OPEN : B.DOOR_TOP);
        }
      }
    } else if (id === B.TRAPDOOR || id === B.TRAPDOOR_OPEN) {
      const dk = key(x, y, z);
      const pow = poweredAt(x, y, z);
      const old = prev.get(dk);
      prev.set(dk, pow);
      if (old === undefined || old === pow) continue;
      setBlock(x, y, z, pow ? B.TRAPDOOR_OPEN : B.TRAPDOOR);
    } else if (isPistonBase(id)) {
      const pow = poweredAt(x, y, z);
      const extended = id >= B.PISTON_EXT_N;
      if (pow && !extended) extendPiston(world, x, y, z, id, setBlock, canPush);
      else if (!pow && extended) retractPiston(world, x, y, z, id, setBlock);
    }
  }
}

/**
 * Push up to MAX_PUSH plain blocks one cell forward and emit the head.
 * Replaceables and cross-plants at the end of the line are crushed.
 */
function extendPiston(
  world: World,
  x: number, y: number, z: number,
  id: number,
  setBlock: SetBlock,
  canPush: CanPush,
): void {
  const [dx, dz] = pistonDir(id);
  const face = (id - B.PISTON_N) % 4;
  const line: number[] = [];
  let clear = false;
  for (let i = 1; i <= MAX_PUSH + 1; i++) {
    const bx = x + dx * i;
    const bz = z + dz * i;
    const bid = world.getBlockId(bx, y, bz);
    const d = blockDef(bid);
    if (d.replaceable || d.renderType === RenderType.CROSS) {
      clear = true;
      break;
    }
    if (line.length >= MAX_PUSH || !canPush(bx, y, bz, bid)) return; // blocked
    line.push(bid);
  }
  if (!clear) return;
  for (let i = line.length - 1; i >= 0; i--) {
    setBlock(x + dx * (i + 2), y, z + dz * (i + 2), line[i]);
  }
  setBlock(x + dx, y, z + dz, B.PISTON_HEAD_N + face);
  setBlock(x, y, z, B.PISTON_EXT_N + face);
}

function retractPiston(
  world: World,
  x: number, y: number, z: number,
  id: number,
  setBlock: SetBlock,
): void {
  const face = (id - B.PISTON_EXT_N) % 4;
  const [dx, dz] = pistonDir(id);
  if (isPistonHead(world.getBlockId(x + dx, y, z + dz))) {
    setBlock(x + dx, y, z + dz, B.AIR);
  }
  setBlock(x, y, z, B.PISTON_N + face);
}
