/**
 * Thread C — World Generation Worker.
 *
 * Deterministic, seed-driven generation pipeline per chunk:
 *   terrain (multi-octave simplex: continentalness / erosion / peaks-valleys)
 *   -> 3D cave worms + cheese caverns + surface ravines
 *   -> ore veins -> dungeons -> villages (blueprint matrices) -> trees
 *   -> decoration -> bedrock -> initial in-chunk lighting (sun + lava).
 */
import {
  CHUNK_HEIGHT,
  CHUNK_VOLUME,
  blockIndex,
  packVoxel,
  voxelId,
  withSun,
  withBlockLight,
  voxelSun,
  voxelBlockLight,
  MAX_LIGHT,
} from '../core/coords';
import { B, blockDef } from '../core/blocks';
import { ITEM, ItemStack, makeStack } from '../core/items';
import { FBM2D, FBM3D, SimplexNoise, splineLerp } from '../core/noise';
import { Random, deriveSeed, hash2D } from '../core/prng';
import { SEA_LEVEL } from '../core/config';
import { EntityType } from '../core/entities';
import type { BlockEntitySpawn, GenChunkMsg, MobSpawnDef, ToGenMsg, VillageDef } from '../net/messages';

// ---------------------------------------------------------------------------
// Generator state
// ---------------------------------------------------------------------------
let seed = 0;
let contNoise!: FBM2D;
let eroNoise!: FBM2D;
let pvNoise!: FBM2D;
let tempNoise!: FBM2D;
let moistNoise!: FBM2D;
let caveA!: FBM3D;
let caveB!: FBM3D;
let cheese!: FBM3D;
let ravineNoise!: SimplexNoise;
let ravineDepthNoise!: SimplexNoise;

function initNoise(): void {
  contNoise = new FBM2D(deriveSeed(seed, 'continental'), 4, 1 / 700, 0.5, 2.1);
  eroNoise = new FBM2D(deriveSeed(seed, 'erosion'), 4, 1 / 900, 0.5, 2.0);
  pvNoise = new FBM2D(deriveSeed(seed, 'peaks'), 4, 1 / 280, 0.55, 2.0);
  tempNoise = new FBM2D(deriveSeed(seed, 'temp'), 3, 1 / 1100, 0.5, 2.0);
  moistNoise = new FBM2D(deriveSeed(seed, 'moist'), 3, 1 / 800, 0.5, 2.0);
  caveA = new FBM3D(deriveSeed(seed, 'caveA'), 2, 1 / 90, 0.5, 2.2);
  caveB = new FBM3D(deriveSeed(seed, 'caveB'), 2, 1 / 90, 0.5, 2.2);
  cheese = new FBM3D(deriveSeed(seed, 'cheese'), 2, 1 / 140, 0.5, 2.0);
  ravineNoise = new SimplexNoise(deriveSeed(seed, 'ravine'));
  ravineDepthNoise = new SimplexNoise(deriveSeed(seed, 'ravineDepth'));
}

// ---------------------------------------------------------------------------
// Biomes & terrain shape
// ---------------------------------------------------------------------------
export const enum Biome {
  OCEAN = 0,
  PLAINS = 1,
  FOREST = 2,
  DESERT = 3,
  MOUNTAINS = 4,
}

interface ColumnInfo {
  height: number;
  biome: Biome;
}

const BASE_SPLINE: ReadonlyArray<readonly [number, number]> = [
  [-1.0, 32],
  [-0.5, 46],
  [-0.22, 54],
  [-0.1, SEA_LEVEL - 1],
  [0.02, SEA_LEVEL + 3],
  [0.3, 72],
  [0.7, 84],
  [1.0, 96],
];

const PEAK_SPLINE: ReadonlyArray<readonly [number, number]> = [
  [-1.0, 0],
  [0.1, 0],
  [0.45, 18],
  [0.75, 44],
  [1.0, 64],
];

function columnInfo(x: number, z: number): ColumnInfo {
  const cont = contNoise.sample(x, z);
  const ero = eroNoise.sample(x, z);
  const pv = pvNoise.sample(x, z);
  const temp = tempNoise.sample(x, z);
  const moist = moistNoise.sample(x, z);

  const base = splineLerp(BASE_SPLINE, cont);
  // Erosion flattens peaks; only above-sea land rises into mountains.
  const eroFactor = splineLerp(
    [
      [-1, 1.25],
      [0, 0.7],
      [1, 0.12],
    ],
    ero,
  );
  let height = base;
  if (cont > -0.05) {
    height += splineLerp(PEAK_SPLINE, pv) * eroFactor;
  }
  height = Math.max(8, Math.min(CHUNK_HEIGHT - 24, Math.floor(height)));

  let biome: Biome;
  if (height < SEA_LEVEL - 1) biome = Biome.OCEAN;
  else if (height > 92) biome = Biome.MOUNTAINS;
  else if (temp > 0.32 && moist < 0.1) biome = Biome.DESERT;
  else if (moist > 0.08) biome = Biome.FOREST;
  else biome = Biome.PLAINS;
  return { height, biome };
}

// ---------------------------------------------------------------------------
// Carving
// ---------------------------------------------------------------------------
function isCave(x: number, y: number, z: number, surface: number): boolean {
  if (y <= 2) return false; // keep bedrock; caves reach down to y=3 (Module 3)

  // --- Spaghetti tunnels --------------------------------------------------
  // Carve a rounded TUBE around the curve where two noise fields both cross
  // zero (a^2 + b^2 < r^2), instead of the intersection of two thin bands.
  // The tube formula yields connected, walkable tunnels rather than slits.
  const yScale = 1.15; // mild vertical stretch (was 1.6 -> caused thin slits)
  const a = caveA.sample(x, y * yScale, z);
  const b = caveB.sample(x, y * yScale, z);
  const tube = a * a + b * b;
  // Wider deep down, pinch toward the surface so entrances stay small.
  const depth = surface - y;
  const width = depth < 8 ? 0.011 : depth < 16 ? 0.018 : 0.024;
  if (tube < width) return true;

  // Cheese caverns: occasional larger rooms in the deep slice. A high
  // threshold keeps them bounded (avoids hollowing out whole regions).
  if (y < surface - 16 && y > 6) {
    const c = cheese.sample(x, y * 0.85, z);
    if (c > 0.52) return true;
  }
  return false;
}

interface RavineInfo {
  depth: number;
  halfWidth: number;
}

function ravineAt(x: number, z: number): RavineInfo | null {
  const r = ravineNoise.noise2D(x / 290, z / 290);
  const band = Math.abs(r);
  if (band > 0.024) return null;
  const d = ravineDepthNoise.noise2D(x / 130, z / 130);
  if (d < 0.18) return null; // ravines only exist along part of the band
  const depth = 28 + Math.floor((d - 0.18) * 46);
  return { depth, halfWidth: 1 - band / 0.024 };
}

// ---------------------------------------------------------------------------
// Trees (with cross-chunk canopy support)
// ---------------------------------------------------------------------------
interface TreePlan {
  x: number;
  z: number;
  y: number;
  height: number;
  birch: boolean;
}

function treesForChunk(cx: number, cz: number): TreePlan[] {
  const rand = new Random(deriveSeed(seed, 'trees:' + cx + ',' + cz));
  const trees: TreePlan[] = [];
  const centerInfo = columnInfo(cx * 16 + 8, cz * 16 + 8);
  let count: number;
  switch (centerInfo.biome) {
    case Biome.FOREST: count = rand.range(6, 10); break;
    case Biome.PLAINS: count = rand.chance(0.4) ? 1 : 0; break;
    case Biome.MOUNTAINS: count = rand.chance(0.5) ? rand.range(1, 2) : 0; break;
    default: count = 0;
  }
  for (let i = 0; i < count; i++) {
    const x = cx * 16 + rand.int(16);
    const z = cz * 16 + rand.int(16);
    const info = columnInfo(x, z);
    if (info.biome === Biome.OCEAN || info.biome === Biome.DESERT) continue;
    if (info.height <= SEA_LEVEL || info.height > 140) continue;
    // Skip trees inside villages so houses stay clear.
    const vil = villageForRegion(regionOf(x >> 4), regionOf(z >> 4));
    if (vil && (x - vil.x) * (x - vil.x) + (z - vil.z) * (z - vil.z) < vil.radius * vil.radius) continue;
    trees.push({
      x,
      z,
      y: info.height + 1,
      height: rand.range(4, 6),
      birch: centerInfo.biome === Biome.FOREST && rand.chance(0.3),
    });
  }
  return trees;
}

function stampTree(data: Uint16Array, cx: number, cz: number, tree: TreePlan): void {
  const logId = tree.birch ? B.BIRCH_LOG : B.OAK_LOG;
  const leafId = tree.birch ? B.BIRCH_LEAVES : B.OAK_LEAVES;
  const topY = tree.y + tree.height - 1;
  // Leaves: two 5x5 layers below top, two 3x3/cross layers on top.
  for (let ly = topY - 2; ly <= topY + 1; ly++) {
    const r = ly >= topY ? 1 : 2;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (dx === 0 && dz === 0 && ly <= topY) continue; // trunk space
        if (Math.abs(dx) === r && Math.abs(dz) === r) {
          // Trim corners pseudo-randomly for organic shape.
          if (hash2D(seed, tree.x * 31 + dx + ly * 7, tree.z * 17 + dz) < 0.5) continue;
        }
        setIfInside(data, cx, cz, tree.x + dx, ly, tree.z + dz, leafId, true);
      }
    }
  }
  for (let i = 0; i < tree.height; i++) {
    setIfInside(data, cx, cz, tree.x, tree.y + i, tree.z, logId, false);
  }
}

/** Write a world-coord block into this chunk's array if it falls inside. */
function setIfInside(
  data: Uint16Array,
  cx: number,
  cz: number,
  x: number,
  y: number,
  z: number,
  id: number,
  onlyReplaceable: boolean,
): void {
  if (y < 0 || y >= CHUNK_HEIGHT) return;
  const lx = x - cx * 16;
  const lz = z - cz * 16;
  if (lx < 0 || lx > 15 || lz < 0 || lz > 15) return;
  const idx = blockIndex(lx, y, lz);
  if (onlyReplaceable && !blockDef(voxelId(data[idx])).replaceable) return;
  data[idx] = packVoxel(id, 0, 0);
}

// ---------------------------------------------------------------------------
// Villages — structural layout blueprint matrices (Module 3 spec)
// ---------------------------------------------------------------------------
const VILLAGE_REGION = 12; // chunks per village region cell
const villageCache = new Map<string, VillagePlan | null>();

interface Building {
  x: number; // origin (min corner)
  y: number;
  z: number;
  blueprint: string[][];
  rot: 0 | 1 | 2 | 3;
  desert: boolean;
}

interface VillagePlan {
  x: number;
  z: number;
  radius: number;
  desert: boolean;
  buildings: Building[];
  paths: Array<{ x: number; z: number }>;
}

function regionOf(c: number): number {
  return Math.floor(c / VILLAGE_REGION);
}

/**
 * Blueprint matrices: layers bottom->top, each layer rows (z) of chars (x).
 *  # wall   C cobble   L log    G glass   D doorway(air)   . interior air
 *  T crafting table    F furnace    H chest    P planks/roof   (space) skip
 */
const HOUSE_SMALL: string[][] = [
  ['CCCCC', 'CCCCC', 'CCCCC', 'CCCCC', 'CCCCC'],
  ['L###L', '#...#', '#...#', '#.T.#', 'L#D#L'],
  ['L#G#L', 'G...G', 'G...G', '#...#', 'L#.#L'],
  ['L###L', '#...#', '#...#', '#...#', 'L###L'],
  ['PPPPP', 'PPPPP', 'PPPPP', 'PPPPP', 'PPPPP'],
];

const HOUSE_LARGE: string[][] = [
  ['CCCCCCC', 'CCCCCCC', 'CCCCCCC', 'CCCCCCC', 'CCCCCCC', 'CCCCCCC'],
  ['L#####L', '#.....#', '#..H..#', '#.....#', '#..F..#', 'L##D##L'],
  ['L#G#G#L', 'G.....G', '#.....#', 'G.....G', '#.....#', 'L##.##L'],
  ['L#####L', '#.....#', '#.....#', '#.....#', '#.....#', 'L#####L'],
  ['PPPPPPP', 'PPPPPPP', 'PPPPPPP', 'PPPPPPP', 'PPPPPPP', 'PPPPPPP'],
];

const DESERT_HUT: string[][] = [
  ['#####', '#####', '#####', '#####', '#####'],
  ['##.##', '#...#', '#.T.#', '#...#', '##D##'],
  ['##G##', 'G...G', '#...#', 'G...G', '##.##'],
  ['#####', '#####', '#####', '#####', '#####'],
];

const WELL: string[][] = [
  ['CCCC', 'CWWC', 'CWWC', 'CCCC'],
  ['C..C', '....', '....', 'C..C'],
  ['C..C', '....', '....', 'C..C'],
  ['CCCC', 'CCCC', 'CCCC', 'CCCC'],
];

function villageForRegion(rx: number, rz: number): VillagePlan | null {
  const key = rx + ',' + rz;
  const cached = villageCache.get(key);
  if (cached !== undefined) return cached;

  const rand = new Random(deriveSeed(seed, 'village:' + key));
  let plan: VillagePlan | null = null;
  if (rand.chance(0.42)) {
    // Jittered center inside the region (away from edges for path room).
    const ccx = rx * VILLAGE_REGION + 2 + rand.int(VILLAGE_REGION - 4);
    const ccz = rz * VILLAGE_REGION + 2 + rand.int(VILLAGE_REGION - 4);
    const wx = ccx * 16 + 8;
    const wz = ccz * 16 + 8;
    const center = columnInfo(wx, wz);
    if (center.biome === Biome.PLAINS || center.biome === Biome.DESERT) {
      // Require reasonably flat, above-sea terrain.
      let minH = center.height;
      let maxH = center.height;
      for (const [ox, oz] of [[-14, 0], [14, 0], [0, -14], [0, 14], [10, 10], [-10, -10]]) {
        const h = columnInfo(wx + ox, wz + oz).height;
        if (h < minH) minH = h;
        if (h > maxH) maxH = h;
      }
      if (minH > SEA_LEVEL && maxH - minH <= 7) {
        const desert = center.biome === Biome.DESERT;
        const buildings: Building[] = [];
        const paths: Array<{ x: number; z: number }> = [];
        const count = rand.range(4, 7);
        const wellY = center.height;
        buildings.push({ x: wx - 2, y: wellY, z: wz - 2, blueprint: WELL, rot: 0, desert });
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + rand.float() * 0.7;
          const dist = rand.range(10, 22);
          const bxC = Math.round(wx + Math.cos(angle) * dist);
          const bzC = Math.round(wz + Math.sin(angle) * dist);
          const ground = columnInfo(bxC, bzC).height;
          const bp = desert ? DESERT_HUT : rand.chance(0.35) ? HOUSE_LARGE : HOUSE_SMALL;
          const bw = bp[0][0].length;
          const bd = bp[0].length;
          buildings.push({
            x: bxC - (bw >> 1),
            y: ground,
            z: bzC - (bd >> 1),
            blueprint: bp,
            rot: rand.int(4) as 0 | 1 | 2 | 3,
            desert,
          });
          // L-shaped path from house to well.
          let px = bxC;
          let pz = bzC;
          while (px !== wx) {
            px += Math.sign(wx - px);
            paths.push({ x: px, z: pz });
          }
          while (pz !== wz) {
            pz += Math.sign(wz - pz);
            paths.push({ x: px, z: pz });
          }
        }
        plan = { x: wx, z: wz, radius: 36, desert, buildings, paths };
      }
    }
  }
  villageCache.set(key, plan);
  if (villageCache.size > 128) {
    const first = villageCache.keys().next().value as string;
    villageCache.delete(first);
  }
  return plan;
}

/** Rotate local blueprint coords (bw x bd footprint) by 90deg steps. */
function rotCoord(lx: number, lz: number, bw: number, bd: number, rot: number): [number, number] {
  switch (rot & 3) {
    case 1: return [bd - 1 - lz, lx];
    case 2: return [bw - 1 - lx, bd - 1 - lz];
    case 3: return [lz, bw - 1 - lx];
    default: return [lx, lz];
  }
}

function blueprintChar(
  ch: string,
  desert: boolean,
): number {
  switch (ch) {
    case '#': return desert ? B.SANDSTONE : B.OAK_PLANKS;
    case 'C': return desert ? B.SANDSTONE : B.COBBLESTONE;
    case 'L': return desert ? B.SANDSTONE : B.OAK_LOG;
    case 'G': return B.GLASS;
    case 'P': return desert ? B.SANDSTONE : B.OAK_PLANKS;
    case 'T': return B.CRAFTING_TABLE;
    case 'F': return B.FURNACE_S;
    case 'H': return B.CHEST_S;
    case 'W': return B.WATER_SRC;
    case 'D':
    case '.': return B.AIR;
    default: return -1;
  }
}

function stampVillage(
  data: Uint16Array,
  cx: number,
  cz: number,
  plan: VillagePlan,
  blockEntities: BlockEntitySpawn[],
  mobs: MobSpawnDef[],
  rand: Random,
): void {
  const minX = cx * 16;
  const minZ = cz * 16;

  // Paths: stamp gravel/sandstone at the terrain surface.
  for (const p of plan.paths) {
    if (p.x < minX || p.x > minX + 15 || p.z < minZ || p.z > minZ + 15) continue;
    const h = columnInfo(p.x, p.z).height;
    const idx = blockIndex(p.x - minX, h, p.z - minZ);
    const cur = voxelId(data[idx]);
    if (cur === B.GRASS || cur === B.SAND || cur === B.DIRT || cur === B.SNOW_GRASS) {
      data[idx] = packVoxel(plan.desert ? B.SANDSTONE : B.GRAVEL, 0, 0);
      // Clear plants above paths.
      const above = blockIndex(p.x - minX, h + 1, p.z - minZ);
      if (blockDef(voxelId(data[above])).replaceable) data[above] = packVoxel(B.AIR, 0, 0);
    }
  }

  for (const b of plan.buildings) {
    const bp = b.blueprint;
    const rotOdd = (b.rot & 1) === 1;
    const bw0 = bp[0][0].length;
    const bd0 = bp[0].length;
    const bw = rotOdd ? bd0 : bw0;
    const bd = rotOdd ? bw0 : bd0;
    // Skip buildings that cannot intersect this chunk.
    if (b.x + bw < minX - 1 || b.x > minX + 16 || b.z + bd < minZ - 1 || b.z > minZ + 16) continue;

    let spawnedVillager = false;
    for (let ly = 0; ly < bp.length; ly++) {
      const layer = bp[ly];
      for (let lz = 0; lz < bd; lz++) {
        for (let lx = 0; lx < bw; lx++) {
          const [sx, sz] = rotCoord(lx, lz, bw0, bd0, (4 - b.rot) & 3);
          const ch = layer[sz]?.[sx] ?? ' ';
          if (ch === ' ') continue;
          const id = blueprintChar(ch, b.desert);
          if (id < 0) continue;
          const x = b.x + lx;
          const y = b.y + ly;
          const z = b.z + lz;
          if (x < minX || x > minX + 15 || z < minZ || z > minZ + 15) continue;
          if (y < 0 || y >= CHUNK_HEIGHT) continue;
          data[blockIndex(x - minX, y, z - minZ)] = packVoxel(id, 0, 0);
          if (ch === 'F' || ch === 'H') {
            blockEntities.push({ x, y, z, blockId: id, loot: ch === 'H' ? rollVillageLoot(rand) : undefined });
          }
          // Clear two blocks above the roof footprint of terrain bumps.
          if (ly === bp.length - 1) {
            for (let cy = 1; cy <= 8 && y + cy < CHUNK_HEIGHT; cy++) {
              const ai = blockIndex(x - minX, y + cy, z - minZ);
              const aid = voxelId(data[ai]);
              if (aid !== B.AIR && blockDef(aid).renderType !== 0) data[ai] = packVoxel(B.AIR, 0, 0);
            }
          }
          // Foundation columns under walls.
          if (ly === 0) {
            for (let fy = y - 1; fy > 0; fy--) {
              const fi = blockIndex(x - minX, fy, z - minZ);
              const fid = voxelId(data[fi]);
              if (fid !== B.AIR && fid !== B.WATER_SRC && !blockDef(fid).replaceable && fid !== B.TALL_GRASS) break;
              data[fi] = packVoxel(b.desert ? B.SANDSTONE : B.COBBLESTONE, 0, 0);
            }
          }
        }
      }
    }
    // One villager per house interior (skip the well).
    if (bp !== WELL) {
      const vx = b.x + (bw >> 1);
      const vz = b.z + (bd >> 1);
      if (vx >= minX && vx <= minX + 15 && vz >= minZ && vz <= minZ + 15 && !spawnedVillager) {
        mobs.push({ type: EntityType.VILLAGER, x: vx + 0.5, y: b.y + 1, z: vz + 0.5 });
        spawnedVillager = true;
      }
    }
  }
}

function rollVillageLoot(rand: Random): ItemStack[] {
  const loot: ItemStack[] = [];
  if (rand.chance(0.8)) loot.push(makeStack(B.OAK_PLANKS, rand.range(2, 8)));
  if (rand.chance(0.6)) loot.push(makeStack(ITEM.COAL, rand.range(1, 5)));
  if (rand.chance(0.5)) loot.push(makeStack(ITEM.IRON_INGOT, rand.range(1, 3)));
  if (rand.chance(0.4)) loot.push(makeStack(B.TORCH, rand.range(2, 6)));
  if (rand.chance(0.25)) loot.push(makeStack(ITEM.COOKED_MUTTON, rand.range(1, 3)));
  return loot;
}

// ---------------------------------------------------------------------------
// Dungeons
// ---------------------------------------------------------------------------
function genDungeon(
  data: Uint16Array,
  cx: number,
  cz: number,
  blockEntities: BlockEntitySpawn[],
  rand: Random,
): void {
  if (!rand.chance(0.08)) return;
  const lx = rand.range(3, 12);
  const lz = rand.range(3, 12);
  const y = rand.range(8, 38);
  const halfW = rand.range(2, 3);
  const halfD = rand.range(2, 3);
  // Hollow room with mossy/cobble shell.
  for (let dy = 0; dy <= 5; dy++) {
    for (let dx = -halfW - 1; dx <= halfW + 1; dx++) {
      for (let dz = -halfD - 1; dz <= halfD + 1; dz++) {
        const x = lx + dx;
        const z = lz + dz;
        if (x < 0 || x > 15 || z < 0 || z > 15 || y + dy >= CHUNK_HEIGHT) continue;
        const idx = blockIndex(x, y + dy, z);
        const isShell =
          dx === -halfW - 1 || dx === halfW + 1 || dz === -halfD - 1 || dz === halfD + 1 || dy === 0 || dy === 5;
        if (isShell) {
          if (voxelId(data[idx]) !== B.AIR) {
            data[idx] = packVoxel(rand.chance(0.45) ? B.MOSSY_COBBLESTONE : B.COBBLESTONE, 0, 0);
          }
        } else {
          data[idx] = packVoxel(B.AIR, 0, 0);
        }
      }
    }
  }
  const wx = cx * 16 + lx;
  const wz = cz * 16 + lz;
  data[blockIndex(lx, y + 1, lz)] = packVoxel(B.SPAWNER, 0, 0);
  blockEntities.push({ x: wx, y: y + 1, z: wz, blockId: B.SPAWNER });
  // Loot chests in the corners.
  const chestCount = rand.range(1, 2);
  for (let i = 0; i < chestCount; i++) {
    const ox = (i === 0 ? -halfW : halfW) * 1;
    const x = lx + ox;
    const z = lz - halfD;
    if (x < 0 || x > 15 || z < 0 || z > 15) continue;
    data[blockIndex(x, y + 1, z)] = packVoxel(B.CHEST_S, 0, 0);
    blockEntities.push({ x: cx * 16 + x, y: y + 1, z: cz * 16 + z, blockId: B.CHEST_S, loot: rollDungeonLoot(rand) });
  }
}

function rollDungeonLoot(rand: Random): ItemStack[] {
  const loot: ItemStack[] = [];
  loot.push(makeStack(ITEM.IRON_INGOT, rand.range(1, 4)));
  if (rand.chance(0.7)) loot.push(makeStack(ITEM.COAL, rand.range(2, 6)));
  if (rand.chance(0.5)) loot.push(makeStack(B.TORCH, rand.range(2, 5)));
  if (rand.chance(0.4)) loot.push(makeStack(ITEM.RAW_IRON, rand.range(1, 3)));
  if (rand.chance(0.12)) loot.push(makeStack(ITEM.DIAMOND, rand.range(1, 2)));
  if (rand.chance(0.3)) loot.push(makeStack(ITEM.ARROW, rand.range(2, 8)));
  return loot;
}

// ---------------------------------------------------------------------------
// Ores
// ---------------------------------------------------------------------------
function genOres(data: Uint16Array, rand: Random): void {
  const veins: Array<[number, number, number, number, number]> = [
    // [blockId, attempts, minY, maxY, size]
    [B.COAL_ORE, 14, 6, 100, 8],
    [B.IRON_ORE, 9, 4, 56, 6],
    [B.GOLD_ORE, 3, 4, 30, 5],
    [B.DIAMOND_ORE, 2, 2, 14, 4],
  ];
  for (const [id, attempts, minY, maxY, size] of veins) {
    for (let i = 0; i < attempts; i++) {
      let x = rand.int(16);
      let y = rand.range(minY, maxY);
      let z = rand.int(16);
      for (let n = 0; n < size; n++) {
        if (x >= 0 && x < 16 && z >= 0 && z < 16 && y > 0 && y < CHUNK_HEIGHT) {
          const idx = blockIndex(x, y, z);
          if (voxelId(data[idx]) === B.STONE) data[idx] = packVoxel(id, 0, 0);
        }
        x += rand.range(-1, 1);
        y += rand.range(-1, 1);
        z += rand.range(-1, 1);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Initial in-chunk lighting (sun column scan + lateral BFS, lava blocklight)
// ---------------------------------------------------------------------------
function initialLight(data: Uint16Array): void {
  const sunQ: number[] = [];
  const blockQ: number[] = [];

  for (let z = 0; z < 16; z++) {
    for (let x = 0; x < 16; x++) {
      let light = MAX_LIGHT;
      for (let y = CHUNK_HEIGHT - 1; y >= 0 && light > 0; y--) {
        const idx = blockIndex(x, y, z);
        const v = data[idx];
        const d = blockDef(voxelId(v));
        if (d.opaque) break;
        data[idx] = withSun(v, light);
        sunQ.push(x, y, z);
        // Vertical propagation rule must match the main-thread BFS.
        light = light === MAX_LIGHT && d.lightFilter === 0 ? MAX_LIGHT : Math.max(0, light - 1 - d.lightFilter);
      }
    }
  }

  // Blocklight emitters placed during generation (lava, glowstone, torches).
  for (let i = 0; i < CHUNK_VOLUME; i++) {
    const emit = blockDef(voxelId(data[i])).lightEmit;
    if (emit > 0) {
      data[i] = withBlockLight(data[i], emit);
      blockQ.push(i & 15, i >> 8, (i >> 4) & 15);
    }
  }

  spreadLocal(data, sunQ, true);
  spreadLocal(data, blockQ, false);
}

/** In-chunk light BFS (borders treated as dark; reconciled on main thread). */
function spreadLocal(data: Uint16Array, q: number[], sun: boolean): void {
  let head = 0;
  while (head < q.length) {
    const x = q[head++];
    const y = q[head++];
    const z = q[head++];
    const v = data[blockIndex(x, y, z)];
    const cur = sun ? voxelSun(v) : voxelBlockLight(v);
    if (cur <= 1) continue;
    for (let i = 0; i < 6; i++) {
      const nx = x + DX6[i];
      const ny = y + DY6[i];
      const nz = z + DZ6[i];
      if (nx < 0 || nx > 15 || nz < 0 || nz > 15 || ny < 0 || ny >= CHUNK_HEIGHT) continue;
      const nidx = blockIndex(nx, ny, nz);
      const nv = data[nidx];
      const nd = blockDef(voxelId(nv));
      if (nd.opaque) continue;
      let target: number;
      if (sun && cur === MAX_LIGHT && DY6[i] === -1 && nd.lightFilter === 0) target = MAX_LIGHT;
      else target = cur - 1 - nd.lightFilter;
      const nl = sun ? voxelSun(nv) : voxelBlockLight(nv);
      if (target > nl) {
        data[nidx] = sun ? withSun(nv, target) : withBlockLight(nv, target);
        q.push(nx, ny, nz);
      }
    }
  }
}

const DX6 = [1, -1, 0, 0, 0, 0];
const DY6 = [0, 0, 1, -1, 0, 0];
const DZ6 = [0, 0, 0, 0, 1, -1];

/** Test hook: (re)initialize the generator with a seed. */
export function initGenerator(s: number): void {
  seed = s;
  villageCache.clear();
  initNoise();
}

// ---------------------------------------------------------------------------
// Chunk assembly
// ---------------------------------------------------------------------------
export function generateChunk(cx: number, cz: number): GenChunkMsg {
  const data = new Uint16Array(CHUNK_VOLUME);
  const blockEntities: BlockEntitySpawn[] = [];
  const mobs: MobSpawnDef[] = [];
  const rand = new Random(deriveSeed(seed, 'chunk:' + cx + ',' + cz));

  const heights = new Int16Array(256);
  const biomes = new Uint8Array(256);

  // --- Terrain columns ---
  for (let z = 0; z < 16; z++) {
    for (let x = 0; x < 16; x++) {
      const wx = cx * 16 + x;
      const wz = cz * 16 + z;
      const info = columnInfo(wx, wz);
      heights[z * 16 + x] = info.height;
      biomes[z * 16 + x] = info.biome;
      const h = info.height;
      const snow = h > 108;

      for (let y = 0; y <= h; y++) {
        let id: number;
        if (y === 0) id = B.BEDROCK;
        else if (y < h - 3) id = B.STONE;
        else if (info.biome === Biome.DESERT) id = y >= h - 1 ? B.SAND : B.SANDSTONE;
        else if (info.biome === Biome.OCEAN) id = y === h ? (hash2D(seed, wx, wz) < 0.5 ? B.SAND : B.GRAVEL) : B.DIRT;
        else if (y === h) {
          if (h <= SEA_LEVEL + 1) id = B.SAND; // beaches
          else if (snow) id = B.SNOW_GRASS;
          else if (info.biome === Biome.MOUNTAINS && h > 84) id = B.STONE;
          else id = B.GRASS;
        } else id = B.DIRT;
        data[blockIndex(x, y, z)] = packVoxel(id, 0, 0);
      }
      // Ocean / lake water fill.
      for (let y = h + 1; y <= SEA_LEVEL; y++) {
        data[blockIndex(x, y, z)] = packVoxel(B.WATER_SRC, 0, 0);
      }
    }
  }

  // --- Caves & ravines ---
  for (let z = 0; z < 16; z++) {
    for (let x = 0; x < 16; x++) {
      const wx = cx * 16 + x;
      const wz = cz * 16 + z;
      const h = heights[z * 16 + x];
      const underOcean = h <= SEA_LEVEL;

      const ravine = ravineAt(wx, wz);
      const carveTop = underOcean ? h - 10 : Math.min(h + 1, CHUNK_HEIGHT - 1);
      for (let y = 1; y <= carveTop; y++) {
        const idx = blockIndex(x, y, z);
        const cur = voxelId(data[idx]);
        if (cur === B.AIR || cur === B.WATER_SRC || cur === B.BEDROCK) continue;
        let carve = false;
        if (ravine && !underOcean) {
          const bottom = Math.max(8, h - ravine.depth);
          // V-shaped chasm: full width near surface, tapering down.
          const frac = (y - bottom) / Math.max(1, h - bottom);
          if (y >= bottom && frac > 1 - ravine.halfWidth) carve = true;
        }
        if (!carve && isCave(wx, y, wz, h)) carve = true;
        if (carve) {
          data[idx] = packVoxel(y <= 10 ? B.LAVA_SRC : B.AIR, 0, 0);
        }
      }
      // Grass under carved-open columns turns exposed dirt into grass later
      // via random ticks; acceptable at generation time.
    }
  }

  genOres(data, rand);
  genDungeon(data, cx, cz, blockEntities, rand);

  // --- Village (region-deterministic; any chunk stamps its intersection) ---
  let village: VillageDef | null = null;
  const planSet = new Set<VillagePlan>();
  for (let rx = regionOf(cx) - 1; rx <= regionOf(cx) + 1; rx++) {
    for (let rz = regionOf(cz) - 1; rz <= regionOf(cz) + 1; rz++) {
      const plan = villageForRegion(rx, rz);
      if (plan) planSet.add(plan);
    }
  }
  for (const plan of planSet) {
    stampVillage(data, cx, cz, plan, blockEntities, mobs, rand);
    const centerCx = plan.x >> 4;
    const centerCz = plan.z >> 4;
    if (centerCx === cx && centerCz === cz) {
      village = { x: plan.x, z: plan.z, radius: plan.radius };
    }
  }

  // --- Trees (this chunk + neighbors for canopy overlap) ---
  for (let ncx = cx - 1; ncx <= cx + 1; ncx++) {
    for (let ncz = cz - 1; ncz <= cz + 1; ncz++) {
      for (const tree of treesForChunk(ncx, ncz)) {
        stampTree(data, cx, cz, tree);
      }
    }
  }

  // --- Decoration: tall grass, flowers, cacti ---
  for (let z = 0; z < 16; z++) {
    for (let x = 0; x < 16; x++) {
      const wx = cx * 16 + x;
      const wz = cz * 16 + z;
      const h = heights[z * 16 + x];
      const biome = biomes[z * 16 + x] as Biome;
      if (h + 1 >= CHUNK_HEIGHT) continue;
      const groundIdx = blockIndex(x, h, z);
      const aboveIdx = blockIndex(x, h + 1, z);
      const ground = voxelId(data[groundIdx]);
      if (voxelId(data[aboveIdx]) !== B.AIR) continue;
      const r = hash2D(deriveSeed(seed, 'deco'), wx, wz);
      if (biome === Biome.DESERT && ground === B.SAND && r < 0.012) {
        const ch = 1 + Math.floor(r * 250) % 3;
        for (let i = 0; i < ch && h + 1 + i < CHUNK_HEIGHT; i++) {
          data[blockIndex(x, h + 1 + i, z)] = packVoxel(B.CACTUS, 0, 0);
        }
      } else if (ground === B.GRASS) {
        if (r < 0.18) data[aboveIdx] = packVoxel(B.TALL_GRASS, 0, 0);
        else if (r < 0.197) {
          data[aboveIdx] = packVoxel(r < 0.189 ? B.FLOWER_YELLOW : B.FLOWER_RED, 0, 0);
        }
      }
    }
  }

  // --- Passive mob spawns (sheep clusters on grass) ---
  if (rand.chance(0.22)) {
    const sx = rand.int(13) + 1;
    const sz = rand.int(13) + 1;
    const biome = biomes[sz * 16 + sx] as Biome;
    if (biome === Biome.PLAINS || biome === Biome.FOREST) {
      const n = rand.range(2, 4);
      for (let i = 0; i < n; i++) {
        const ox = Math.min(15, Math.max(0, sx + rand.range(-2, 2)));
        const oz = Math.min(15, Math.max(0, sz + rand.range(-2, 2)));
        const h = heights[oz * 16 + ox];
        if (voxelId(data[blockIndex(ox, h, oz)]) === B.GRASS) {
          mobs.push({ type: EntityType.SHEEP, x: cx * 16 + ox + 0.5, y: h + 1, z: cz * 16 + oz + 0.5 });
        }
      }
    }
  }

  initialLight(data);

  return {
    t: 'chunk',
    cx,
    cz,
    data: data.buffer,
    blockEntities,
    mobs,
    village,
  };
}

// ---------------------------------------------------------------------------
// Worker entry
// ---------------------------------------------------------------------------
const ctx = self as unknown as Worker;

ctx.onmessage = (e: MessageEvent<ToGenMsg>) => {
  const msg = e.data;
  if (msg.t === 'init') {
    initGenerator(msg.seed);
    return;
  }
  if (msg.t === 'gen') {
    const result = generateChunk(msg.cx, msg.cz);
    ctx.postMessage(result, [result.data]);
  }
};
