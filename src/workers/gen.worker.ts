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
let weirdNoise!: FBM2D; // splits climate bands into biome variants
let ridgeNoise!: FBM2D; // sharp alpine crest lines
let riverNoise!: FBM2D; // winding river channels
let mushNoise!: FBM2D; // rare mushroom-island cells in deep ocean
let strataNoise!: FBM2D; // badlands terracotta band waviness
let warpXNoise!: FBM2D;
let warpZNoise!: FBM2D;
let detailNoise!: FBM2D; // high-freq roll so plains aren't dead flat
let forestDensity!: FBM2D; // clumps trees into groves + clearings
let caveA!: FBM3D;
let caveB!: FBM3D;
let cheese!: FBM3D;
let ravineNoise!: SimplexNoise;
let ravineDepthNoise!: SimplexNoise;
let ditherSeed = 0; // per-block climate jitter -> interlocking biome borders
let surfSeed = 0; // per-block surface-material variation (podzol patches...)

function initNoise(): void {
  contNoise = new FBM2D(deriveSeed(seed, 'continental'), 4, 1 / 700, 0.5, 2.1);
  eroNoise = new FBM2D(deriveSeed(seed, 'erosion'), 4, 1 / 900, 0.5, 2.0);
  pvNoise = new FBM2D(deriveSeed(seed, 'peaks'), 4, 1 / 280, 0.55, 2.0);
  tempNoise = new FBM2D(deriveSeed(seed, 'temp'), 3, 1 / 1100, 0.5, 2.0);
  moistNoise = new FBM2D(deriveSeed(seed, 'moist'), 3, 1 / 800, 0.5, 2.0);
  weirdNoise = new FBM2D(deriveSeed(seed, 'weird'), 3, 1 / 620, 0.5, 2.0);
  ridgeNoise = new FBM2D(deriveSeed(seed, 'ridge'), 3, 1 / 210, 0.5, 2.0);
  riverNoise = new FBM2D(deriveSeed(seed, 'river'), 2, 1 / 460, 0.5, 2.0);
  mushNoise = new FBM2D(deriveSeed(seed, 'mushroom'), 2, 1 / 950, 0.5, 2.0);
  strataNoise = new FBM2D(deriveSeed(seed, 'strata'), 2, 1 / 130, 0.5, 2.0);
  // Domain warp: bends every terrain lookup so coastlines, ridges and biome
  // borders meander organically instead of following the noise lattice.
  warpXNoise = new FBM2D(deriveSeed(seed, 'warpX'), 2, 1 / 350, 0.5, 2.0);
  warpZNoise = new FBM2D(deriveSeed(seed, 'warpZ'), 2, 1 / 350, 0.5, 2.0);
  detailNoise = new FBM2D(deriveSeed(seed, 'detail'), 3, 1 / 55, 0.5, 2.0);
  forestDensity = new FBM2D(deriveSeed(seed, 'forest'), 3, 1 / 120, 0.5, 2.0);
  caveA = new FBM3D(deriveSeed(seed, 'caveA'), 2, 1 / 90, 0.5, 2.2);
  caveB = new FBM3D(deriveSeed(seed, 'caveB'), 2, 1 / 90, 0.5, 2.2);
  cheese = new FBM3D(deriveSeed(seed, 'cheese'), 2, 1 / 140, 0.5, 2.0);
  ravineNoise = new SimplexNoise(deriveSeed(seed, 'ravine'));
  ravineDepthNoise = new SimplexNoise(deriveSeed(seed, 'ravineDepth'));
  ditherSeed = deriveSeed(seed, 'bdither');
  surfSeed = deriveSeed(seed, 'surface');
}

/** Clamped smoothstep of t into [0,1]. */
function smooth01(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
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
  SWAMP = 5,
  CHERRY = 6,
  JUNGLE = 7,
  SNOWY = 8,
  // V4 biome pass — the remaining major overworld families.
  BEACH = 9,
  RIVER = 10,
  TAIGA = 11,
  SNOWY_TAIGA = 12,
  SAVANNA = 13,
  BADLANDS = 14,
  BIRCH_FOREST = 15,
  DARK_FOREST = 16,
  FLOWER_FOREST = 17,
  MUSHROOM = 18,
  ICE_SPIKES = 19,
  STONY_PEAKS = 20,
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
  [0.08, 0],
  [0.4, 22],
  [0.65, 52],
  [0.9, 92],
  [1.0, 110],
];

function columnInfo(x: number, z: number): ColumnInfo {
  // Warped sampling coordinates (up to ~36 blocks of lateral bend).
  const wx = x + warpXNoise.sample(x, z) * 36;
  const wz = z + warpZNoise.sample(x, z) * 36;
  const cont = contNoise.sample(wx, wz);
  const ero = eroNoise.sample(wx, wz);
  const pv = pvNoise.sample(wx, wz);
  // Per-block climate dither (±0.02): biome borders interlock in ragged
  // patches over a few blocks instead of following hard threshold curves.
  const dj = (hash2D(ditherSeed, x, z) - 0.5) * 0.04;
  const dj2 = (hash2D(ditherSeed, x + 40507, z - 92821) - 0.5) * 0.04;
  const temp = tempNoise.sample(wx, wz) + dj;
  const moist = moistNoise.sample(wx, wz) + dj2;
  const weird = weirdNoise.sample(wx, wz);

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
    // Ridged crest factor turns round mountain blobs into sharp ridgelines
    // with dramatic faces; valleys between crests stay walkable.
    const ridge = 1 - Math.abs(ridgeNoise.sample(wx, wz));
    height += splineLerp(PEAK_SPLINE, pv) * (0.5 + 0.5 * ridge * ridge) * eroFactor;
  }
  // Gentle rolling detail so plains stop reading as a dead-flat plane; more on
  // higher ground. Only above sea so ocean floors stay smooth.
  if (cont > -0.1) height += detailNoise.sample(wx, wz) * (cont > 0.35 ? 5 : 2.5);

  // Badlands mask: very hot + very dry. Fades in smoothly so mesa plateaus
  // blend into the surrounding desert instead of snapping.
  const bad = smooth01((temp - 0.36) / 0.08) * smooth01((0.0 - moist) / 0.12);
  if (bad > 0 && height > SEA_LEVEL) {
    // Stepped mesas: quantize to 10-block plateau tiers, blended by mask.
    const tier = SEA_LEVEL + 2 + Math.round((height - SEA_LEVEL) / 10) * 10;
    height = height * (1 - bad) + Math.max(SEA_LEVEL + 2, tier) * bad;
  }

  // Mushroom islands: rare cells far out in deep ocean rise above the waves.
  let mushMask = 0;
  if (cont < -0.18) {
    mushMask = smooth01((mushNoise.sample(wx, wz) - 0.52) / 0.14);
    if (mushMask > 0) {
      const isl = SEA_LEVEL + 3 + mushMask * 9 + detailNoise.sample(wx, wz) * 3;
      height = height * (1 - mushMask) + isl * mushMask;
    }
  }

  // Rivers: a winding channel wherever the river field crosses zero. The
  // inner band carves to a bed below sea level; the outer band eases the
  // banks back up to the terrain so valleys get natural slopes.
  let river = false;
  if (cont > -0.16 && mushMask <= 0) {
    const r = Math.abs(riverNoise.sample(wx, wz));
    const RW = 0.05;
    if (r < RW && height > SEA_LEVEL - 6) {
      const t = r / RW; // 0 = channel centre .. 1 = outer bank
      const bed = SEA_LEVEL - 2.5 - 1.5 * (1 - t);
      const bank = smooth01((t - 0.55) / 0.45);
      const carved = bed * (1 - bank) + height * bank;
      if (carved < height) height = carved;
      river = height < SEA_LEVEL;
    }
  }
  height = Math.max(8, Math.min(CHUNK_HEIGHT - 24, Math.floor(height)));

  // --- Biome classification (first match wins) ------------------------------
  // Continuous climate (temp/moist/weird) + the derived masks pick the biome;
  // height only gates shores, peaks and lowland swamps. Because height never
  // depends on the *chosen* biome, terrain is seamless across every border.
  const cold = temp < -0.34;
  let biome: Biome;
  if (mushMask > 0.45) biome = Biome.MUSHROOM;
  else if (height < SEA_LEVEL - 1) biome = river ? Biome.RIVER : Biome.OCEAN;
  else if (height > 112) biome = Biome.STONY_PEAKS;
  else if (height > 92) biome = Biome.MOUNTAINS;
  else if (height <= SEA_LEVEL + 1) {
    biome = moist > 0.26 && !cold && temp <= 0.26 ? Biome.SWAMP : Biome.BEACH;
  } else if (bad > 0.5) biome = Biome.BADLANDS;
  else if (cold) {
    if (moist > 0.14) biome = Biome.SNOWY_TAIGA;
    else if (weird > 0.5 && moist < -0.08) biome = Biome.ICE_SPIKES;
    else biome = Biome.SNOWY;
  } else if (temp < -0.1) biome = moist > 0.05 ? Biome.TAIGA : Biome.PLAINS;
  else if (temp > 0.32 && moist < 0.08) biome = Biome.DESERT;
  else if (temp > 0.26 && moist > 0.28) biome = Biome.JUNGLE;
  else if (temp > 0.24 && moist < 0.24) biome = Biome.SAVANNA;
  else if (moist > 0.28 && height <= SEA_LEVEL + 4) biome = Biome.SWAMP;
  else if (temp > 0.02 && temp < 0.24 && moist > 0.06 && moist < 0.28 && height > SEA_LEVEL + 6 && weird > 0.22) {
    biome = Biome.CHERRY;
  } else if (moist > 0.06) {
    // Forest family, split by the weirdness field.
    if (weird < -0.42) biome = Biome.BIRCH_FOREST;
    else if (weird > 0.42 && moist > 0.2) biome = Biome.DARK_FOREST;
    else if (weird > 0.32) biome = Biome.FLOWER_FOREST;
    else biome = Biome.FOREST;
  } else biome = Biome.PLAINS;
  return { height, biome };
}

// Repeating badlands strata palette; the band index is offset by a wavy
// low-frequency noise so layers undulate like real sedimentary rock.
const MESA_STRATA: number[] = [
  B.TERRACOTTA_ORANGE, B.TERRACOTTA, B.TERRACOTTA_ORANGE, B.TERRACOTTA_RED,
  B.TERRACOTTA_ORANGE, B.TERRACOTTA, B.TERRACOTTA_WHITE, B.TERRACOTTA_ORANGE,
  B.TERRACOTTA_YELLOW, B.TERRACOTTA, B.TERRACOTTA_ORANGE, B.TERRACOTTA_RED,
  B.TERRACOTTA_ORANGE, B.TERRACOTTA_WHITE, B.TERRACOTTA, B.TERRACOTTA_ORANGE,
];

function mesaStrata(y: number, wx: number, wz: number): number {
  const off = Math.round(strataNoise.sample(wx, wz) * 5);
  return MESA_STRATA[(((y + off) % 16) + 16) % 16];
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
  // The sum field (free — no extra samples) modulates width along the
  // tunnel, so passages breathe between crawls and halls.
  const depth = surface - y;
  let width = depth < 8 ? 0.011 : depth < 16 ? 0.018 : 0.026;
  width *= 0.7 + Math.abs(a + b) * 0.9;
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
type TreeType = 'oak' | 'birch' | 'cherry' | 'jungle' | 'spruce' | 'acacia' | 'dark_oak';

interface TreePlan {
  x: number;
  z: number;
  y: number;
  height: number;
  type: TreeType;
}

const TREE_LOG: Record<TreeType, number> = {
  oak: B.OAK_LOG, birch: B.BIRCH_LOG, cherry: B.CHERRY_LOG, jungle: B.JUNGLE_LOG, spruce: B.SPRUCE_LOG,
  acacia: B.ACACIA_LOG, dark_oak: B.DARK_OAK_LOG,
};
const TREE_LEAF: Record<TreeType, number> = {
  oak: B.OAK_LEAVES, birch: B.BIRCH_LEAVES, cherry: B.CHERRY_LEAVES, jungle: B.JUNGLE_LEAVES, spruce: B.SPRUCE_LEAVES,
  acacia: B.ACACIA_LEAVES, dark_oak: B.DARK_OAK_LEAVES,
};

const NO_TREE_BIOMES = new Set<Biome>([
  Biome.OCEAN, Biome.RIVER, Biome.BEACH, Biome.DESERT, Biome.BADLANDS,
  Biome.MUSHROOM, Biome.ICE_SPIKES, Biome.STONY_PEAKS,
]);

function treesForChunk(cx: number, cz: number): TreePlan[] {
  const rand = new Random(deriveSeed(seed, 'trees:' + cx + ',' + cz));
  const trees: TreePlan[] = [];
  const centerInfo = columnInfo(cx * 16 + 8, cz * 16 + 8);
  // Density noise clumps trees into groves and leaves open clearings.
  const dens = Math.max(0, forestDensity.sample(cx * 16 + 8, cz * 16 + 8));
  let count: number;
  let type: TreeType = 'oak';
  switch (centerInfo.biome) {
    case Biome.FOREST: count = rand.range(6, 10); break;
    case Biome.BIRCH_FOREST: count = rand.range(6, 10); type = 'birch'; break;
    case Biome.DARK_FOREST: count = rand.range(8, 12); type = 'dark_oak'; break;
    case Biome.FLOWER_FOREST: count = rand.range(2, 4); break;
    case Biome.JUNGLE: count = rand.range(6, 11); type = 'jungle'; break;
    case Biome.CHERRY: count = rand.range(2, 4); type = 'cherry'; break;
    case Biome.SNOWY: count = rand.range(1, 3); type = 'spruce'; break;
    case Biome.TAIGA: count = rand.range(5, 9); type = 'spruce'; break;
    case Biome.SNOWY_TAIGA: count = rand.range(4, 7); type = 'spruce'; break;
    case Biome.SAVANNA: count = rand.chance(0.75) ? rand.range(1, 2) : 0; type = 'acacia'; break;
    case Biome.SWAMP: count = rand.range(0, 2); break;
    case Biome.PLAINS: count = rand.chance(0.4) ? 1 : 0; break;
    case Biome.MOUNTAINS: count = rand.chance(0.5) ? rand.range(1, 2) : 0; break;
    default: count = 0;
  }
  count = Math.round(count * (0.4 + dens * 1.2));
  const placed: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    const x = cx * 16 + rand.int(16);
    const z = cz * 16 + rand.int(16);
    // Minimum trunk spacing so canopies don't fuse into a wall.
    let tooClose = false;
    for (const [px, pz] of placed) {
      if ((px - x) * (px - x) + (pz - z) * (pz - z) < 4) { tooClose = true; break; }
    }
    if (tooClose) continue;
    const info = columnInfo(x, z);
    if (NO_TREE_BIOMES.has(info.biome)) continue;
    if (info.height < SEA_LEVEL || info.height > 140) continue;
    // Skip trees inside villages so houses stay clear.
    const vil = villageForRegion(regionOf(x >> 4), regionOf(z >> 4));
    if (vil && (x - vil.x) * (x - vil.x) + (z - vil.z) * (z - vil.z) < vil.radius * vil.radius) continue;
    placed.push([x, z]);
    let th: number;
    if (type === 'jungle') th = rand.range(8, 14);
    else if (type === 'spruce') th = rand.range(6, 10);
    else if (type === 'acacia') th = rand.range(5, 7);
    else if (type === 'dark_oak') th = rand.range(5, 8);
    else th = rand.range(4, 6);
    // Forests keep their birch mix; every other biome uses its signature tree.
    const treeType: TreeType = centerInfo.biome === Biome.FOREST && rand.chance(0.3) ? 'birch' : type;
    trees.push({ x, z, y: info.height + 1, height: th, type: treeType });
  }
  return trees;
}

function stampTree(data: Uint16Array, cx: number, cz: number, tree: TreePlan): void {
  const logId = TREE_LOG[tree.type];
  const leafId = TREE_LEAF[tree.type];
  const topY = tree.y + tree.height - 1;

  if (tree.type === 'acacia') {
    // Savanna umbrella: the trunk kinks diagonally partway up, then a wide
    // flat leaf disc caps it — the iconic silhouette against the horizon.
    const lean = hash2D(seed, tree.x * 7, tree.z * 13) < 0.5 ? 1 : -1;
    const leanZ = hash2D(seed, tree.x * 3, tree.z * 11) < 0.5 ? 1 : -1;
    let tx = tree.x;
    let tz = tree.z;
    for (let i = 0; i < tree.height; i++) {
      if (i >= tree.height - 3) {
        if (i % 2 === 1) tx += lean;
        else tz += leanZ;
      }
      setIfInside(data, cx, cz, tx, tree.y + i, tz, logId, false);
    }
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        const d = Math.abs(dx) + Math.abs(dz);
        if (d > 4) continue;
        setIfInside(data, cx, cz, tx + dx, topY + 1, tz + dz, leafId, true);
        if (d <= 1) setIfInside(data, cx, cz, tx + dx, topY + 2, tz + dz, leafId, true);
      }
    }
    return;
  }

  // Trunk.
  for (let i = 0; i < tree.height; i++) {
    setIfInside(data, cx, cz, tree.x, tree.y + i, tree.z, logId, false);
  }

  if (tree.type === 'dark_oak') {
    // Broad, dense roofed-forest canopy: two thick 7x7-ish layers that fuse
    // with neighbouring crowns into a nearly closed leaf roof.
    for (let ly = topY - 1; ly <= topY + 1; ly++) {
      const r = ly === topY + 1 ? 2 : 3;
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          if (dx === 0 && dz === 0 && ly <= topY) continue;
          if (Math.abs(dx) === r && Math.abs(dz) === r && hash2D(seed, tree.x * 31 + dx + ly * 7, tree.z * 17 + dz) < 0.6) continue;
          setIfInside(data, cx, cz, tree.x + dx, ly, tree.z + dz, leafId, true);
        }
      }
    }
    return;
  }

  if (tree.type === 'spruce') {
    // Conical layered crown: shrinking square rings up the trunk with the
    // topmost tiers narrowing to a single-leaf tip — a pointed spruce.
    let r = 2;
    for (let ly = tree.y + Math.max(2, tree.height - 6); ly <= topY + 1; ly++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          if (dx === 0 && dz === 0 && ly <= topY) continue;
          if (r > 1 && Math.abs(dx) === r && Math.abs(dz) === r) continue; // trim corners
          setIfInside(data, cx, cz, tree.x + dx, ly, tree.z + dz, leafId, true);
        }
      }
      if (r > 0 && (ly - tree.y) % 2 === 1) r -= 1; // shrink every other tier
    }
    setIfInside(data, cx, cz, tree.x, topY + 2, tree.z, leafId, true); // tip
    return;
  }

  if (tree.type === 'jungle') {
    // Tall trunk, canopy concentrated in a big crown.
    for (let ly = topY - 1; ly <= topY + 1; ly++) {
      const r = ly >= topY + 1 ? 1 : 2;
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          if (dx === 0 && dz === 0 && ly <= topY) continue;
          if (Math.abs(dx) === r && Math.abs(dz) === r && hash2D(seed, tree.x * 31 + dx + ly * 7, tree.z * 17 + dz) < 0.5) continue;
          setIfInside(data, cx, cz, tree.x + dx, ly, tree.z + dz, leafId, true);
        }
      }
    }
    // Sparse leaf tufts down the upper trunk.
    for (const off of [3, 5]) {
      const ly = topY - off;
      if (ly <= tree.y) continue;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        if (hash2D(seed, tree.x + dx * 13, tree.z + dz * 7 + ly) < 0.4) {
          setIfInside(data, cx, cz, tree.x + dx, ly, tree.z + dz, leafId, true);
        }
      }
    }
    return;
  }

  // Broadleaf crown (oak / birch / swamp-oak / cherry). Cherry gets a bigger,
  // rounder pink ball.
  const rBase = tree.type === 'cherry' ? 3 : 2;
  for (let ly = topY - 2; ly <= topY + 1; ly++) {
    const r = ly >= topY ? (tree.type === 'cherry' ? 2 : 1) : rBase;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (dx === 0 && dz === 0 && ly <= topY) continue;
        if (Math.abs(dx) === r && Math.abs(dz) === r) {
          if (hash2D(seed, tree.x * 31 + dx + ly * 7, tree.z * 17 + dz) < 0.5) continue;
        }
        setIfInside(data, cx, cz, tree.x + dx, ly, tree.z + dz, leafId, true);
      }
    }
  }
}

/**
 * Giant mushroom: pale stem topped by a red dome or a flat brown platter.
 * Only stamped when it fits fully inside the owning chunk (decoration is
 * per-chunk, so a border mushroom would otherwise be sliced in half).
 */
function stampGiantMushroom(
  data: Uint16Array,
  cx: number,
  cz: number,
  x: number,
  y: number,
  z: number,
  red: boolean,
): void {
  const lx = x - cx * 16;
  const lz = z - cz * 16;
  if (lx < 3 || lx > 12 || lz < 3 || lz > 12) return;
  const sh = 4 + Math.floor(hash2D(seed, x * 5, z * 3) * 3);
  if (y + sh + 1 >= CHUNK_HEIGHT) return;
  for (let i = 0; i < sh; i++) {
    setIfInside(data, cx, cz, x, y + i, z, B.MUSHROOM_STEM, false);
  }
  const capId = red ? B.MUSHROOM_CAP_RED : B.MUSHROOM_CAP_BROWN;
  if (red) {
    // Dome: skirt ring around the stem, solid 3x3 lid on top.
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
        if (Math.abs(dx) < 2 && Math.abs(dz) < 2) continue;
        setIfInside(data, cx, cz, x + dx, y + sh - 1, z + dz, capId, true);
      }
    }
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        setIfInside(data, cx, cz, x + dx, y + sh, z + dz, capId, true);
      }
    }
  } else {
    // Flat platter: broad disc resting on the stem tip.
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        if (Math.abs(dx) + Math.abs(dz) > 5) continue;
        setIfInside(data, cx, cz, x + dx, y + sh, z + dz, capId, true);
      }
    }
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
  lamps: Array<{ x: number; z: number }>;
}

function regionOf(c: number): number {
  return Math.floor(c / VILLAGE_REGION);
}

function regionOf2(c: number, size: number): number {
  return Math.floor(c / size);
}

/**
 * Blueprint matrices: layers bottom->top, each layer rows (z) of chars (x).
 *  # wall   C cobble   L log    G glass   D doorway(air)   . interior air
 *  T crafting table    F furnace    H chest    P planks/roof   (space) skip
 */
//  o = torch (interior lighting), R = roof plank, L = log frame.
const HOUSE_SMALL: string[][] = [
  ['CCCCC', 'CCCCC', 'CCCCC', 'CCCCC', 'CCCCC'], // floor
  ['L###L', '#o.b#', '#...#', '#.T.#', 'L#D#L'], // walls + torch + bed + table + door
  ['L#G#L', 'G...G', 'G...G', '#...#', 'L#.#L'], // windows
  ['L###L', '#...#', '#...#', '#...#', 'L###L'], // upper wall
  ['LLLLL', 'LRRRL', 'LRRRL', 'LRRRL', 'LLLLL'], // framed eaves
  ['     ', ' RRR ', ' RRR ', ' RRR ', '     '], // peaked cap
];

const HOUSE_LARGE: string[][] = [
  ['CCCCCCC', 'CCCCCCC', 'CCCCCCC', 'CCCCCCC', 'CCCCCCC', 'CCCCCCC'],
  ['L#####L', '#o.b.o#', '#..H..#', '#.....#', '#..F..#', 'L##D##L'],
  ['L#G#G#L', 'G.....G', '#.....#', 'G.....G', '#.....#', 'L##.##L'],
  ['L#####L', '#.....#', '#.....#', '#.....#', '#.....#', 'L#####L'],
  ['LLLLLLL', 'LRRRRRL', 'LRRRRRL', 'LRRRRRL', 'LRRRRRL', 'LLLLLLL'],
  ['       ', ' RRRRR ', ' RRRRR ', ' RRRRR ', ' RRRRR ', '       '],
];

const DESERT_HUT: string[][] = [
  ['#####', '#####', '#####', '#####', '#####'],
  ['##.##', '#o.b#', '#.T.#', '#...#', '##D##'],
  ['##G##', 'G...G', '#...#', 'G...G', '##.##'],
  ['#####', '#####', '#####', '#####', '#####'],
];

// Bell-towered chapel: tall log-framed nave with a glowstone beacon.
const CHURCH: string[][] = [
  ['CCCCC', 'CCCCC', 'CCCCC', 'CCCCC', 'CCCCC', 'CCCCC'],
  ['L###L', '#...#', '#.T.#', '#...#', '#...#', 'L#D#L'],
  ['L#G#L', 'G...G', '#...#', 'G...G', '#...#', 'L#.#L'],
  ['L###L', '#o..#', '#...#', '#...#', '#...#', 'L###L'],
  ['LLLLL', 'LRRRL', 'LRRRL', 'LRRRL', 'LRRRL', 'LLLLL'],
  ['LL LL', 'L   L', '     ', '     ', '     ', '     '],
  ['LGGLL', 'G   G', '     ', '     ', '     ', '     '],
  ['LLLLL', 'LoooL', '     ', '     ', '     ', '     '],
];

// Fenced field: plank border, water channel, crop rows on dirt.
const FARM: string[][] = [
  ['PPPPPPP', 'PddWddP', 'PddWddP', 'PddWddP', 'PPPPPPP'],
  ['P.....P', '.g.q.g.', '.g...g.', '.g.q.g.', 'P.....P'],
];

// Classic well: stone ring + water, log corner posts, a roof and a torch.
const WELL: string[][] = [
  ['CCCC', 'CWWC', 'CWWC', 'CCCC'],
  ['L..L', '....', '....', 'L..L'],
  ['L..L', '....', '....', 'L..L'],
  ['LRRL', 'RRRR', 'RRRR', 'LRRL'],
  ['    ', ' o  ', '    ', '    '],
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
        const lamps: Array<{ x: number; z: number }> = [];
        const count = rand.range(5, 8);
        const wellY = center.height;
        buildings.push({ x: wx - 2, y: wellY, z: wz - 2, blueprint: WELL, rot: 0, desert });
        let churchPlaced = false;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + rand.float() * 0.7;
          const dist = rand.range(10, 24);
          const bxC = Math.round(wx + Math.cos(angle) * dist);
          const bzC = Math.round(wz + Math.sin(angle) * dist);
          const ground = columnInfo(bxC, bzC).height;
          let bp: string[][];
          if (!desert && !churchPlaced && rand.chance(0.5)) {
            bp = CHURCH;
            churchPlaced = true;
          } else if (rand.chance(0.25)) {
            bp = FARM;
          } else {
            bp = desert ? DESERT_HUT : rand.chance(0.35) ? HOUSE_LARGE : HOUSE_SMALL;
          }
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
          // A lamp post partway along the path lights the street at night.
          lamps.push({ x: Math.round(bxC + (wx - bxC) * 0.4), z: Math.round(bzC + (wz - bzC) * 0.4) });
        }
        plan = { x: wx, z: wz, radius: 36, desert, buildings, paths, lamps };
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
    case 'P':
    case 'R': return desert ? B.SANDSTONE : B.OAK_PLANKS;
    case 'T': return B.CRAFTING_TABLE;
    case 'F': return B.FURNACE_S;
    case 'H': return B.CHEST_S;
    case 'o': return B.TORCH;
    case 'b': return B.BED;
    case 'W': return B.WATER_SRC;
    case 'd': return B.DIRT;
    case 'g': return B.TALL_GRASS;
    case 'q': return B.FLOWER_YELLOW;
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

  // Paths: 2 blocks wide, stamped at the terrain surface.
  for (const p of plan.paths) {
    for (const [ox, oz] of [[0, 0], [1, 0]] as const) {
      const px = p.x + ox;
      const pz = p.z + oz;
      if (px < minX || px > minX + 15 || pz < minZ || pz > minZ + 15) continue;
      const h = columnInfo(px, pz).height;
      const idx = blockIndex(px - minX, h, pz - minZ);
      const cur = voxelId(data[idx]);
      if (cur === B.GRASS || cur === B.SAND || cur === B.DIRT || cur === B.SNOW_GRASS) {
        data[idx] = packVoxel(plan.desert ? B.SANDSTONE : B.GRAVEL, 0, 0);
        // Clear plants above paths.
        const above = blockIndex(px - minX, h + 1, pz - minZ);
        if (blockDef(voxelId(data[above])).replaceable) data[above] = packVoxel(B.AIR, 0, 0);
      }
    }
  }

  // Lamp posts: a short log column topped with glowstone (lit at generation).
  for (const lamp of plan.lamps) {
    if (lamp.x < minX || lamp.x > minX + 15 || lamp.z < minZ || lamp.z > minZ + 15) continue;
    const gh = columnInfo(lamp.x, lamp.z).height;
    if (gh <= SEA_LEVEL) continue;
    const baseId = voxelId(data[blockIndex(lamp.x - minX, gh, lamp.z - minZ)]);
    if (baseId === B.AIR || baseId === B.WATER_SRC) continue;
    const post = plan.desert ? B.SANDSTONE : B.OAK_LOG;
    for (let i = 1; i <= 3 && gh + i < CHUNK_HEIGHT; i++) {
      data[blockIndex(lamp.x - minX, gh + i, lamp.z - minZ)] = packVoxel(post, 0, 0);
    }
    if (gh + 4 < CHUNK_HEIGHT) {
      data[blockIndex(lamp.x - minX, gh + 4, lamp.z - minZ)] = packVoxel(B.GLOWSTONE, 0, 0);
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
    if (bp !== WELL && bp !== FARM) {
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
// Surface structures (PRO-6): desert pyramids, stone ruins, forest boulders,
// cave stalactites. Region-deterministic like villages so every intersecting
// chunk stamps its slice.
// ---------------------------------------------------------------------------
const PYRAMID_REGION = 24; // chunks per pyramid cell (rare landmarks)

interface PyramidPlan {
  x: number;
  z: number;
  y: number;
  size: number; // half-width of the base
}

const pyramidCache = new Map<string, PyramidPlan | null>();

function pyramidForRegion(rx: number, rz: number): PyramidPlan | null {
  const key = rx + ',' + rz;
  const cached = pyramidCache.get(key);
  if (cached !== undefined) return cached;
  const rand = new Random(deriveSeed(seed, 'pyramid:' + key));
  let plan: PyramidPlan | null = null;
  if (rand.chance(0.5)) {
    const ccx = rx * PYRAMID_REGION + 3 + rand.int(PYRAMID_REGION - 6);
    const ccz = rz * PYRAMID_REGION + 3 + rand.int(PYRAMID_REGION - 6);
    const wx = ccx * 16 + 8;
    const wz = ccz * 16 + 8;
    const c = columnInfo(wx, wz);
    if (c.biome === Biome.DESERT) {
      let minH = c.height;
      let maxH = c.height;
      for (const [ox, oz] of [[-9, 0], [9, 0], [0, -9], [0, 9]]) {
        const h = columnInfo(wx + ox, wz + oz).height;
        minH = Math.min(minH, h);
        maxH = Math.max(maxH, h);
      }
      if (maxH - minH <= 5 && minH > SEA_LEVEL) {
        plan = { x: wx, z: wz, y: minH, size: 9 };
      }
    }
  }
  pyramidCache.set(key, plan);
  if (pyramidCache.size > 64) pyramidCache.delete(pyramidCache.keys().next().value as string);
  return plan;
}

/** Step pyramid with a hidden treasure chamber (chests + spawner guard). */
function stampPyramid(
  data: Uint16Array,
  cx: number,
  cz: number,
  p: PyramidPlan,
  blockEntities: BlockEntitySpawn[],
): void {
  const minX = cx * 16;
  const minZ = cz * 16;
  if (p.x + p.size < minX || p.x - p.size > minX + 15 || p.z + p.size < minZ || p.z - p.size > minZ + 15) return;
  const rand = new Random(deriveSeed(seed, 'pyloot:' + p.x + ',' + p.z));
  for (let dz = -p.size; dz <= p.size; dz++) {
    for (let dx = -p.size; dx <= p.size; dx++) {
      const x = p.x + dx;
      const z = p.z + dz;
      if (x < minX || x > minX + 15 || z < minZ || z > minZ + 15) continue;
      const ring = Math.max(Math.abs(dx), Math.abs(dz));
      const top = p.y + (p.size - ring); // steps rise toward the middle
      const inChamber = Math.abs(dx) <= 2 && Math.abs(dz) <= 2;
      for (let y = p.y - 4; y <= top; y++) {
        if (y < 1 || y >= CHUNK_HEIGHT) continue;
        // Hollow 5x5 chamber, 3 tall, at base level.
        if (inChamber && y >= p.y - 3 && y <= p.y - 1) {
          data[blockIndex(x - minX, y, z - minZ)] = packVoxel(B.AIR, 0, 0);
          continue;
        }
        data[blockIndex(x - minX, y, z - minZ)] = packVoxel(B.SANDSTONE, 0, 0);
      }
      // Golden capstone.
      if (ring === 0 && top < CHUNK_HEIGHT) {
        data[blockIndex(x - minX, top, z - minZ)] = packVoxel(B.GOLD_BLOCK, 0, 0);
      }
    }
  }
  // Chamber furniture (only from the chunk owning the center).
  const put = (x: number, y: number, z: number, id: number): boolean => {
    if (x < minX || x > minX + 15 || z < minZ || z > minZ + 15) return false;
    data[blockIndex(x - minX, y, z - minZ)] = packVoxel(id, 0, 0);
    return true;
  };
  if (put(p.x - 1, p.y - 3, p.z - 1, B.CHEST_S)) {
    blockEntities.push({
      x: p.x - 1, y: p.y - 3, z: p.z - 1, blockId: B.CHEST_S,
      loot: [
        makeStack(ITEM.GOLD_INGOT, rand.range(2, 6)),
        makeStack(ITEM.DIAMOND, rand.range(0, 2)),
        makeStack(ITEM.REDSTONE, rand.range(2, 8)),
      ].filter((s) => s.count > 0),
    });
  }
  if (put(p.x + 1, p.y - 3, p.z + 1, B.CHEST_N)) {
    blockEntities.push({
      x: p.x + 1, y: p.y - 3, z: p.z + 1, blockId: B.CHEST_N,
      loot: [makeStack(ITEM.IRON_INGOT, rand.range(1, 5)), makeStack(B.TORCH, rand.range(2, 6))],
    });
  }
  if (put(p.x, p.y - 3, p.z, B.SPAWNER)) {
    blockEntities.push({ x: p.x, y: p.y - 3, z: p.z, blockId: B.SPAWNER });
  }
}

/** Crumbled stone-brick ruins + mossy boulders scattered per chunk. */
function genRuins(data: Uint16Array, cx: number, cz: number, rand: Random): void {
  // Boulder cluster (forest): 30% of chunks.
  const center = columnInfo(cx * 16 + 8, cz * 16 + 8);
  if (center.biome === Biome.FOREST && rand.chance(0.3)) {
    const bx = rand.int(12) + 2;
    const bz = rand.int(12) + 2;
    const h = columnInfo(cx * 16 + bx, cz * 16 + bz).height;
    const r = rand.range(1, 2);
    for (let dy = 0; dy <= r; dy++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy + dz * dz > r * r + 1) continue;
          const x = bx + dx;
          const z = bz + dz;
          if (x < 0 || x > 15 || z < 0 || z > 15 || h + dy >= CHUNK_HEIGHT) continue;
          data[blockIndex(x, h + dy, z)] = packVoxel(rand.chance(0.6) ? B.MOSSY_COBBLESTONE : B.COBBLESTONE, 0, 0);
        }
      }
    }
  }
  // Ruined wall corner (plains): 8% of chunks.
  if (center.biome === Biome.PLAINS && rand.chance(0.08)) {
    const rx = rand.int(9) + 3;
    const rz = rand.int(9) + 3;
    const h = columnInfo(cx * 16 + rx, cz * 16 + rz).height;
    const len = rand.range(3, 6);
    for (let i = 0; i < len; i++) {
      const wallH = 1 + Math.floor(rand.float() * 3);
      for (let y = 1; y <= wallH; y++) {
        if (rx + i > 15 || h + y >= CHUNK_HEIGHT) break;
        data[blockIndex(rx + i, h + y, rz)] = packVoxel(
          rand.chance(0.3) ? B.CRACKED_STONE_BRICKS : rand.chance(0.3) ? B.MOSSY_COBBLESTONE : B.STONE_BRICKS, 0, 0,
        );
      }
      const sideH = 1 + Math.floor(rand.float() * 2);
      for (let y = 1; y <= sideH && i < 3; y++) {
        if (rz + i > 15 || h + y >= CHUNK_HEIGHT) break;
        data[blockIndex(rx, h + y, rz + i)] = packVoxel(B.STONE_BRICKS, 0, 0);
      }
    }
  }
}

/** Hang stalactites / raise stalagmites where caves opened up. */
function genSpeleothems(data: Uint16Array, rand: Random): void {
  for (let n = 0; n < 40; n++) {
    const x = rand.int(16);
    const z = rand.int(16);
    const y = 6 + rand.int(50);
    if (y + 1 >= CHUNK_HEIGHT) continue;
    const idx = blockIndex(x, y, z);
    if (voxelId(data[idx]) !== B.AIR) continue;
    const above = voxelId(data[blockIndex(x, y + 1, z)]);
    const below = y > 1 ? voxelId(data[blockIndex(x, y - 1, z)]) : B.BEDROCK;
    if (above === B.STONE && rand.chance(0.6)) {
      data[idx] = packVoxel(B.COBBLESTONE, 0, 0);
      if (y > 1 && voxelId(data[blockIndex(x, y - 1, z)]) === B.AIR && rand.chance(0.4)) {
        data[blockIndex(x, y - 1, z)] = packVoxel(B.COBBLESTONE, 0, 0);
      }
    } else if (below === B.STONE && rand.chance(0.4)) {
      data[idx] = packVoxel(B.COBBLESTONE, 0, 0);
    }
  }
}

// ---------------------------------------------------------------------------
// Ores
// ---------------------------------------------------------------------------
function genOres(data: Uint16Array, rand: Random): void {
  const veins: Array<[number, number, number, number, number]> = [
    // [blockId, attempts, minY, maxY, size]
    // Stone variants as large blobs.
    [B.GRANITE, 2, 4, 70, 18],
    [B.DIORITE, 2, 4, 70, 18],
    [B.ANDESITE, 2, 4, 70, 18],
    [B.COAL_ORE, 14, 6, 100, 8],
    [B.IRON_ORE, 9, 4, 56, 6],
    [B.GOLD_ORE, 3, 4, 30, 5],
    [B.REDSTONE_ORE, 6, 2, 18, 6],
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
  pyramidCache.clear();
  netherCarve = null;
  initNoise();
}

// ---------------------------------------------------------------------------
// Nether generation (Phase 4): one giant cavern system between two bedrock
// plates, a lava ocean at the bottom, soul-sand shores, magma seams and
// glowstone clusters hanging from the ceiling.
// ---------------------------------------------------------------------------
const NETHER_CEIL = 127; // bedrock ceiling; above is void

let netherCarve: FBM3D | null = null;

export function generateNetherChunk(cx: number, cz: number): GenChunkMsg {
  if (!netherCarve) netherCarve = new FBM3D(deriveSeed(seed, 'nether'), 3, 1 / 70, 0.5, 2.1);
  const data = new Uint16Array(CHUNK_VOLUME);
  const rand = new Random(deriveSeed(seed, 'nchunk:' + cx + ',' + cz));

  const LAVA_LEVEL = 31;
  for (let z = 0; z < 16; z++) {
    for (let x = 0; x < 16; x++) {
      const wx = cx * 16 + x;
      const wz = cz * 16 + z;
      for (let y = 0; y <= NETHER_CEIL; y++) {
        let id: number;
        if (y === 0 || y === NETHER_CEIL) {
          id = B.BEDROCK;
        } else {
          // Carve caverns: widest in the middle band, pinched at the plates.
          const shape = Math.abs(y - 64) / 64; // 0 center .. 1 at plates
          const t = 0.1 + shape * 0.28;
          const n = netherCarve.sample(wx, y * 1.35, wz);
          const open = n > t;
          if (open) id = y <= LAVA_LEVEL ? B.LAVA_SRC : B.AIR;
          else id = B.NETHERRACK;
        }
        data[blockIndex(x, y, z)] = packVoxel(id, 0, 0);
      }
    }
  }

  // Surface dressing: soul sand shores, magma seams near lava, glowstone
  // clusters under ceiling overhangs.
  for (let z = 0; z < 16; z++) {
    for (let x = 0; x < 16; x++) {
      const wx = cx * 16 + x;
      const wz = cz * 16 + z;
      for (let y = 2; y < NETHER_CEIL - 1; y++) {
        const idx = blockIndex(x, y, z);
        if (voxelId(data[idx]) !== B.NETHERRACK) continue;
        const above = voxelId(data[blockIndex(x, y + 1, z)]);
        const below = voxelId(data[blockIndex(x, y - 1, z)]);
        if (above === B.AIR) {
          const r = hash2D(deriveSeed(seed, 'ndeco'), wx * 3 + y, wz * 5);
          if (y <= LAVA_LEVEL + 4 && r < 0.3) data[idx] = packVoxel(B.MAGMA, 0, 0);
          else if (r < 0.16) data[idx] = packVoxel(B.SOUL_SAND, 0, 0);
        } else if (below === B.AIR && y > 80) {
          // Hanging glowstone buds.
          if (hash2D(deriveSeed(seed, 'nglow'), wx, wz * 7 + y) < 0.045) {
            data[blockIndex(x, y - 1, z)] = packVoxel(B.GLOWSTONE, 0, 0);
            if (y > 3 && rand.chance(0.5)) data[blockIndex(x, y - 2, z)] = packVoxel(B.GLOWSTONE, 0, 0);
          }
        }
      }
    }
  }

  initialLight(data);

  return {
    t: 'chunk',
    cx,
    cz,
    dim: 1,
    data: data.buffer,
    blockEntities: [],
    mobs: [],
    village: null,
  };
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
      const biome = info.biome;
      const sr = hash2D(surfSeed, wx, wz); // per-column surface variation
      const snow = h > 104 || biome === Biome.SNOWY || biome === Biome.SNOWY_TAIGA;

      for (let y = 0; y <= h; y++) {
        let id: number;
        if (y === 0) id = B.BEDROCK;
        else if (biome === Biome.BADLANDS && y >= h - 12 && y > SEA_LEVEL - 6) {
          // Painted mesa walls: wavy terracotta strata; loose red sand caps
          // the low ground between plateaus.
          id = y === h && h <= SEA_LEVEL + 5 ? B.RED_SAND : mesaStrata(y, wx, wz);
        } else if (y < h - 3) id = B.STONE;
        else if (biome === Biome.DESERT) id = y >= h - 1 ? B.SAND : B.SANDSTONE;
        else if (biome === Biome.BEACH) id = y >= h - 2 ? B.SAND : B.DIRT;
        else if (biome === Biome.OCEAN) id = y === h ? (sr < 0.5 ? B.SAND : B.GRAVEL) : B.DIRT;
        else if (biome === Biome.RIVER) id = y === h ? (sr < 0.55 ? B.SAND : B.GRAVEL) : B.DIRT;
        else if (y === h) {
          if (biome === Biome.MUSHROOM) id = B.MYCELIUM;
          else if (biome === Biome.ICE_SPIKES) id = B.SNOW_BLOCK;
          else if (biome === Biome.STONY_PEAKS) id = snow && sr < 0.75 ? B.SNOW_BLOCK : sr < 0.88 ? B.STONE : B.GRAVEL;
          else if (biome === Biome.MOUNTAINS && h > 96) id = snow ? B.SNOW_GRASS : B.STONE;
          else if (snow) id = B.SNOW_GRASS;
          else if (biome === Biome.TAIGA) id = sr < 0.4 ? B.PODZOL : sr < 0.48 ? B.COARSE_DIRT : B.GRASS;
          else if (biome === Biome.SAVANNA) id = sr < 0.12 ? B.COARSE_DIRT : B.GRASS;
          else if (biome === Biome.SWAMP) id = B.SWAMP_GRASS;
          else id = B.GRASS;
        } else id = biome === Biome.STONY_PEAKS ? B.STONE : B.DIRT;
        data[blockIndex(x, y, z)] = packVoxel(id, 0, 0);
      }
      // Ocean / lake / river water fill.
      for (let y = h + 1; y <= SEA_LEVEL; y++) {
        data[blockIndex(x, y, z)] = packVoxel(B.WATER_SRC, 0, 0);
      }
      // Cold biomes freeze the top water cell into an ice sheet.
      const freezing =
        biome === Biome.SNOWY || biome === Biome.SNOWY_TAIGA || biome === Biome.ICE_SPIKES;
      if (freezing && h < SEA_LEVEL) {
        data[blockIndex(x, SEA_LEVEL, z)] = packVoxel(B.ICE, 0, 0);
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
  genSpeleothems(data, rand);
  genRuins(data, cx, cz, rand);

  // Desert pyramids (region-deterministic landmarks).
  for (let rx = regionOf2(cx, PYRAMID_REGION) - 1; rx <= regionOf2(cx, PYRAMID_REGION) + 1; rx++) {
    for (let rz = regionOf2(cz, PYRAMID_REGION) - 1; rz <= regionOf2(cz, PYRAMID_REGION) + 1; rz++) {
      const plan = pyramidForRegion(rx, rz);
      if (plan) stampPyramid(data, cx, cz, plan, blockEntities);
    }
  }

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

  // --- Decoration: tall grass, flowers, cacti, mushrooms, ice spikes ---
  const decoSeed = deriveSeed(seed, 'deco');
  const decoSeed2 = deriveSeed(seed, 'deco2');
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
      const r = hash2D(decoSeed, wx, wz);
      const r2 = hash2D(decoSeed2, wx, wz);
      // Lily pads float on swamp water (in the air cell above the surface).
      if (biome === Biome.SWAMP) {
        const surfIdx = blockIndex(x, SEA_LEVEL, z);
        const overIdx = blockIndex(x, SEA_LEVEL + 1, z);
        if (voxelId(data[surfIdx]) === B.WATER_SRC && voxelId(data[overIdx]) === B.AIR && r < 0.12) {
          data[overIdx] = packVoxel(B.LILY_PAD, 0, 0);
        }
      }
      if (voxelId(data[aboveIdx]) !== B.AIR) continue;
      if ((biome === Biome.DESERT && ground === B.SAND) || (biome === Biome.BADLANDS && ground === B.RED_SAND)) {
        // Cacti + dry dead bushes; badlands lean heavily toward dead bushes.
        const cactusP = biome === Biome.DESERT ? 0.012 : 0.005;
        const bushP = biome === Biome.DESERT ? 0.01 : 0.035;
        if (r < cactusP) {
          const ch = 1 + Math.floor(r * 2500) % 3;
          for (let i = 0; i < ch && h + 1 + i < CHUNK_HEIGHT; i++) {
            data[blockIndex(x, h + 1 + i, z)] = packVoxel(B.CACTUS, 0, 0);
          }
        } else if (r2 < bushP) {
          data[aboveIdx] = packVoxel(B.DEAD_BUSH, 0, 0);
        }
      } else if (biome === Biome.ICE_SPIKES && ground === B.SNOW_BLOCK && r < 0.014) {
        // Packed-ice spires: mostly short spikes, the odd towering one.
        const tall = r2 < 0.18;
        const sh = tall ? 8 + Math.floor(r2 * 40) : 3 + (Math.floor(r * 1000) % 4);
        for (let i = 1; i <= sh && h + i < CHUNK_HEIGHT; i++) {
          data[blockIndex(x, h + i, z)] = packVoxel(B.PACKED_ICE, 0, 0);
        }
        if (tall) {
          for (const [ox, oz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
            const nx = x + ox;
            const nz = z + oz;
            if (nx < 0 || nx > 15 || nz < 0 || nz > 15) continue;
            const nh = heights[nz * 16 + nx];
            for (let i = 1; i <= 2 && nh + i < CHUNK_HEIGHT; i++) {
              const ni = blockIndex(nx, nh + i, nz);
              if (blockDef(voxelId(data[ni])).replaceable) data[ni] = packVoxel(B.PACKED_ICE, 0, 0);
            }
          }
        }
      } else if (biome === Biome.MUSHROOM && ground === B.MYCELIUM) {
        if (r < 0.008) stampGiantMushroom(data, cx, cz, wx, h + 1, wz, r2 < 0.5);
        else if (r < 0.06) data[aboveIdx] = packVoxel(r2 < 0.5 ? B.RED_MUSHROOM : B.BROWN_MUSHROOM, 0, 0);
      } else if (ground === B.SWAMP_GRASS) {
        // Dense reeds, occasional marsh flower or mushroom.
        if (r < 0.32) data[aboveIdx] = packVoxel(B.TALL_GRASS, 0, 0);
        else if (r < 0.335) data[aboveIdx] = packVoxel(B.FLOWER_YELLOW, 0, 0);
        else if (r < 0.35) data[aboveIdx] = packVoxel(B.BROWN_MUSHROOM, 0, 0);
      } else if (ground === B.PODZOL || (ground === B.GRASS && (biome === Biome.TAIGA || biome === Biome.SNOWY_TAIGA))) {
        // Taiga floor: ferns and forest mushrooms between the spruces.
        if (r < 0.16) data[aboveIdx] = packVoxel(B.FERN, 0, 0);
        else if (r < 0.2) data[aboveIdx] = packVoxel(B.TALL_GRASS, 0, 0);
        else if (r < 0.215) data[aboveIdx] = packVoxel(r2 < 0.5 ? B.RED_MUSHROOM : B.BROWN_MUSHROOM, 0, 0);
      } else if (ground === B.GRASS && biome === Biome.FLOWER_FOREST) {
        // Meadow carpet: every flower species mixed through tall grass.
        if (r < 0.22) {
          const pick = Math.floor(r2 * 6);
          const flower =
            pick === 0 ? B.FLOWER_RED : pick === 1 ? B.FLOWER_YELLOW :
            pick === 2 ? B.FLOWER_BLUE : pick === 3 ? B.FLOWER_WHITE :
            pick === 4 ? B.FLOWER_RED : B.FLOWER_YELLOW;
          data[aboveIdx] = packVoxel(flower, 0, 0);
        } else if (r < 0.45) data[aboveIdx] = packVoxel(B.TALL_GRASS, 0, 0);
      } else if (ground === B.GRASS && biome === Biome.DARK_FOREST) {
        if (r < 0.1) data[aboveIdx] = packVoxel(B.TALL_GRASS, 0, 0);
        else if (r < 0.13) data[aboveIdx] = packVoxel(r2 < 0.5 ? B.RED_MUSHROOM : B.BROWN_MUSHROOM, 0, 0);
      } else if (ground === B.GRASS) {
        // Jungle floor is thick, savanna is a sea of dry grass, the rest sparse.
        const grassMax = biome === Biome.JUNGLE ? 0.4 : biome === Biome.SAVANNA ? 0.5 : 0.18;
        if (r < grassMax) {
          data[aboveIdx] = packVoxel(biome === Biome.JUNGLE && r2 < 0.4 ? B.FERN : B.TALL_GRASS, 0, 0);
        } else if (r < grassMax + 0.017 && biome !== Biome.SAVANNA) {
          const flower =
            r2 < 0.35 ? B.FLOWER_YELLOW : r2 < 0.7 ? B.FLOWER_RED :
            r2 < 0.85 ? B.FLOWER_BLUE : B.FLOWER_WHITE;
          data[aboveIdx] = packVoxel(flower, 0, 0);
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
    dim: 0,
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
    const result = msg.dim === 1 ? generateNetherChunk(msg.cx, msg.cz) : generateChunk(msg.cx, msg.cz);
    ctx.postMessage(result, [result.data]);
  }
};
