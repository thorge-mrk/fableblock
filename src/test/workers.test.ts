/**
 * Unit tests against the worker internals: greedy mesher correctness
 * (face counts, merging, outward winding) and world-generator determinism.
 * Workers reference `self`, so it is shimmed before dynamic import.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { CHUNK_VOLUME, CHUNK_HEIGHT, blockIndex, packVoxel } from '../core/coords';
import { B } from '../core/blocks';
import type { MeshResultMsg } from '../net/messages';

(globalThis as Record<string, unknown>).self = globalThis;

let meshChunk: (msg: { t: 'mesh'; cx: number; cz: number; rev: number; data: ArrayBuffer }) => MeshResultMsg;
let generateChunk: (cx: number, cz: number) => { data: ArrayBuffer };
let initGenerator: (seed: number) => void;

beforeAll(async () => {
  const mesh = await import('../workers/mesh.worker');
  meshChunk = mesh.meshChunk;
  const gen = await import('../workers/gen.worker');
  generateChunk = gen.generateChunk;
  initGenerator = gen.initGenerator;
});

const PAD_X = 18;
const PAD_XZ = 18 * 18;

/** Build a padded mesher input from a plain chunk array (dark, sky above). */
function pad(chunk: Uint16Array): Uint16Array {
  const out = new Uint16Array(PAD_X * PAD_X * (CHUNK_HEIGHT + 2));
  for (let y = 0; y < CHUNK_HEIGHT; y++) {
    for (let z = 0; z < 16; z++) {
      for (let x = 0; x < 16; x++) {
        out[x + 1 + (z + 1) * PAD_X + (y + 1) * PAD_XZ] = chunk[blockIndex(x, y, z)];
      }
    }
  }
  return out;
}

function emptyChunk(): Uint16Array {
  const c = new Uint16Array(CHUNK_VOLUME);
  for (let i = 0; i < CHUNK_VOLUME; i++) c[i] = packVoxel(B.AIR, 15, 0);
  return c;
}

function mesh(chunk: Uint16Array): MeshResultMsg {
  return meshChunk({ t: 'mesh', cx: 0, cz: 0, rev: 1, data: pad(chunk).buffer });
}

describe('greedy mesher (Module 2)', () => {
  it('meshes a single cube as exactly 6 quads with outward normals', () => {
    const chunk = emptyChunk();
    chunk[blockIndex(8, 50, 8)] = packVoxel(B.STONE, 0, 0);
    const res = mesh(chunk);
    expect(res.opaque.count).toBe(36); // 6 faces * 2 tris * 3 idx
    const pos = new Float32Array(res.opaque.pos);
    const idx = new Uint32Array(res.opaque.index);
    // Every triangle's normal must point away from the cube center.
    const cx = 8.5;
    const cy = 50.5;
    const cz = 8.5;
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t] * 3;
      const b = idx[t + 1] * 3;
      const c = idx[t + 2] * 3;
      const e1 = [pos[b] - pos[a], pos[b + 1] - pos[a + 1], pos[b + 2] - pos[a + 2]];
      const e2 = [pos[c] - pos[a], pos[c + 1] - pos[a + 1], pos[c + 2] - pos[a + 2]];
      const n = [
        e1[1] * e2[2] - e1[2] * e2[1],
        e1[2] * e2[0] - e1[0] * e2[2],
        e1[0] * e2[1] - e1[1] * e2[0],
      ];
      const toCenter = [pos[a] - cx, pos[a + 1] - cy, pos[a + 2] - cz];
      const dot = n[0] * toCenter[0] + n[1] * toCenter[1] + n[2] * toCenter[2];
      expect(dot).toBeGreaterThan(0);
    }
  });

  it('merges coplanar identical faces (greedy)', () => {
    const chunk = emptyChunk();
    // 4x1x4 stone slab: naive = 4 top + 4 bottom + 16 sides... merged = 6 quads.
    for (let z = 4; z < 8; z++) {
      for (let x = 4; x < 8; x++) {
        chunk[blockIndex(x, 50, z)] = packVoxel(B.STONE, 0, 0);
      }
    }
    const res = mesh(chunk);
    expect(res.opaque.count).toBe(36);
  });

  it('does not merge faces with different light values', () => {
    const chunk = emptyChunk();
    chunk[blockIndex(4, 50, 4)] = packVoxel(B.STONE, 0, 0);
    chunk[blockIndex(5, 50, 4)] = packVoxel(B.STONE, 0, 0);
    // Different light in the cells above the two blocks.
    chunk[blockIndex(4, 51, 4)] = packVoxel(B.AIR, 15, 0);
    chunk[blockIndex(5, 51, 4)] = packVoxel(B.AIR, 7, 0);
    const res = mesh(chunk);
    // 2-block bar fully merged would be 36; the split top adds one quad.
    expect(res.opaque.count).toBe(42);
  });

  it('culls hidden interior faces completely', () => {
    const chunk = emptyChunk();
    for (let y = 40; y < 44; y++) {
      for (let z = 4; z < 8; z++) {
        for (let x = 4; x < 8; x++) {
          chunk[blockIndex(x, y, z)] = packVoxel(B.STONE, 0, 0);
        }
      }
    }
    const res = mesh(chunk);
    expect(res.opaque.count).toBe(36); // solid 4x4x4 box = 6 merged quads
  });

  it('puts water into the translucent pass with a lowered surface', () => {
    const chunk = emptyChunk();
    chunk[blockIndex(8, 30, 8)] = packVoxel(B.STONE, 0, 0);
    chunk[blockIndex(8, 31, 8)] = packVoxel(B.WATER_SRC, 12, 0);
    const res = mesh(chunk);
    expect(res.water.count).toBeGreaterThan(0);
    const pos = new Float32Array(res.water.pos);
    let maxY = 0;
    for (let i = 1; i < pos.length; i += 3) maxY = Math.max(maxY, pos[i]);
    expect(maxY).toBeCloseTo(31.875, 3); // source surface at 14/16
  });

  it('renders cross plants as 4 double-sided quads', () => {
    const chunk = emptyChunk();
    chunk[blockIndex(8, 30, 8)] = packVoxel(B.TALL_GRASS, 15, 0);
    const res = mesh(chunk);
    expect(res.opaque.count).toBe(4 * 6);
  });
});

describe('world generator determinism (Module 3)', () => {
  it('same seed produces bit-identical chunks', () => {
    initGenerator(1337);
    const a = new Uint16Array(generateChunk(3, -2).data.slice(0));
    initGenerator(1337);
    const b = new Uint16Array(generateChunk(3, -2).data.slice(0));
    expect(a.length).toBe(CHUNK_VOLUME);
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    expect(diff).toBe(0);
  });

  it('different seeds produce different terrain', () => {
    initGenerator(1);
    const a = new Uint16Array(generateChunk(0, 0).data.slice(0));
    initGenerator(2);
    const b = new Uint16Array(generateChunk(0, 0).data.slice(0));
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    expect(diff).toBeGreaterThan(1000);
  });

  it('places bedrock at y=0 and breathable air at the surface', () => {
    initGenerator(42);
    const chunk = new Uint16Array(generateChunk(0, 0).data.slice(0));
    for (let z = 0; z < 16; z++) {
      for (let x = 0; x < 16; x++) {
        expect(chunk[blockIndex(x, 0, z)] & 0xff).toBe(B.BEDROCK);
        expect(chunk[blockIndex(x, CHUNK_HEIGHT - 1, z)] & 0xff).toBe(B.AIR);
      }
    }
  });

  it('computes initial sunlight: full sky light at the top of the world', () => {
    initGenerator(42);
    const chunk = new Uint16Array(generateChunk(5, 5).data.slice(0));
    for (let z = 0; z < 16; z++) {
      for (let x = 0; x < 16; x++) {
        const v = chunk[blockIndex(x, CHUNK_HEIGHT - 1, z)];
        expect((v >> 8) & 0xf).toBe(15);
      }
    }
  });
});
