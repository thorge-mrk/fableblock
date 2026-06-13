/**
 * Thread D — Greedy Mesher Worker.
 *
 * Consumes a padded voxel region (18 x 258 x 18: chunk + 1-block apron) and
 * emits merged quad geometry:
 *   - 6-direction greedy sweep: faces with identical (blockId, faceLight,
 *     4-corner AO) merge into maximal rectangles.
 *   - Per-vertex ambient occlusion baked together with directional face
 *     shading into a single byte attribute.
 *   - Fluids (water/lava) and CROSS plants emitted per-cell with
 *     level-based surface heights; water goes to a separate translucent pass.
 */
import { CHUNK_HEIGHT, voxelId, voxelSun, voxelBlockLight } from '../core/coords';
import { blockDef, RenderType, isWater, isLava, fluidHeight } from '../core/blocks';
import type { MeshBuffers, MeshRequestMsg, MeshResultMsg } from '../net/messages';

const PX = 18; // padded x size
const PZ = 18;
const PXZ = PX * PZ;

function pIdx(x: number, y: number, z: number): number {
  return x + 1 + (z + 1) * PX + (y + 1) * PXZ;
}

// ---------------------------------------------------------------------------
// Growable typed-array geometry builder
// ---------------------------------------------------------------------------
class GeoBuilder {
  pos = new Float32Array(4096 * 3);
  uv = new Float32Array(4096 * 2);
  tile = new Uint16Array(4096);
  shade = new Uint8Array(4096);
  light = new Uint8Array(4096 * 2);
  index = new Uint32Array(6144);
  vCount = 0;
  iCount = 0;

  private ensure(verts: number, indices: number): void {
    if ((this.vCount + verts) * 3 > this.pos.length) {
      const cap = Math.max(this.pos.length / 3 * 2, this.vCount + verts);
      this.pos = grow(this.pos, cap * 3);
      this.uv = grow(this.uv, cap * 2);
      this.tile = grow(this.tile, cap);
      this.shade = grow(this.shade, cap);
      this.light = grow(this.light, cap * 2);
    }
    if (this.iCount + indices > this.index.length) {
      this.index = grow(this.index, Math.max(this.index.length * 2, this.iCount + indices));
    }
  }

  /**
   * Emit one quad. Vertices: p0=base, p1=base+du*w, p2=base+du*w+dv*h,
   * p3=base+dv*h. `shades` per vertex 0..255. `reverse` flips winding,
   * `flipDiag` rotates triangulation for anisotropy-free AO.
   */
  quad(
    bx: number, by: number, bz: number,
    dux: number, duy: number, duz: number,
    dvx: number, dvy: number, dvz: number,
    w: number, h: number,
    tile: number, sun: number, blockLight: number,
    shades: [number, number, number, number],
    reverse: boolean, flipDiag: boolean,
    uvScaleU = 1, uvScaleV = 1,
  ): void {
    this.ensure(4, 6);
    const v0 = this.vCount;
    const px = [bx, bx + dux * w, bx + dux * w + dvx * h, bx + dvx * h];
    const py = [by, by + duy * w, by + duy * w + dvy * h, by + dvy * h];
    const pz = [bz, bz + duz * w, bz + duz * w + dvz * h, bz + dvz * h];
    const us = [0, w * uvScaleU, w * uvScaleU, 0];
    const vs = [0, 0, h * uvScaleV, h * uvScaleV];
    for (let i = 0; i < 4; i++) {
      const vi = v0 + i;
      this.pos[vi * 3] = px[i];
      this.pos[vi * 3 + 1] = py[i];
      this.pos[vi * 3 + 2] = pz[i];
      this.uv[vi * 2] = us[i];
      this.uv[vi * 2 + 1] = vs[i];
      this.tile[vi] = tile;
      this.shade[vi] = shades[i];
      this.light[vi * 2] = sun;
      this.light[vi * 2 + 1] = blockLight;
    }
    this.vCount += 4;
    const idx = this.index;
    let ic = this.iCount;
    if (!reverse) {
      if (!flipDiag) {
        idx[ic++] = v0; idx[ic++] = v0 + 1; idx[ic++] = v0 + 2;
        idx[ic++] = v0; idx[ic++] = v0 + 2; idx[ic++] = v0 + 3;
      } else {
        idx[ic++] = v0 + 1; idx[ic++] = v0 + 2; idx[ic++] = v0 + 3;
        idx[ic++] = v0 + 1; idx[ic++] = v0 + 3; idx[ic++] = v0;
      }
    } else {
      if (!flipDiag) {
        idx[ic++] = v0; idx[ic++] = v0 + 2; idx[ic++] = v0 + 1;
        idx[ic++] = v0; idx[ic++] = v0 + 3; idx[ic++] = v0 + 2;
      } else {
        idx[ic++] = v0 + 1; idx[ic++] = v0 + 3; idx[ic++] = v0 + 2;
        idx[ic++] = v0 + 1; idx[ic++] = v0; idx[ic++] = v0 + 3;
      }
    }
    this.iCount = ic;
  }

  toBuffers(): MeshBuffers {
    return {
      pos: this.pos.slice(0, this.vCount * 3).buffer,
      uv: this.uv.slice(0, this.vCount * 2).buffer,
      tile: this.tile.slice(0, this.vCount).buffer,
      shade: this.shade.slice(0, this.vCount).buffer,
      light: this.light.slice(0, this.vCount * 2).buffer,
      index: this.index.slice(0, this.iCount).buffer,
      count: this.iCount,
    };
  }
}

function grow<T extends Float32Array | Uint8Array | Uint16Array | Uint32Array>(arr: T, newLen: number): T {
  const out = new (arr.constructor as new (n: number) => T)(newLen);
  (out as Float32Array).set(arr as unknown as Float32Array);
  return out;
}

// ---------------------------------------------------------------------------
// Face tables
// ---------------------------------------------------------------------------
// dir: 0=+X 1=-X 2=+Y 3=-Y 4=+Z 5=-Z
const NORMAL = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
];
// u/v axes per dir (u = mask cols, v = mask rows)
const U_AXIS = [
  [0, 0, 1], [0, 0, 1], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
];
const V_AXIS = [
  [0, 1, 0], [0, 1, 0], [0, 0, 1], [0, 0, 1], [0, 1, 0], [0, 1, 0],
];
// Winding reversal so triangle normals face outward (verified by unit test).
const REVERSE = [true, false, true, false, false, true];
// Minecraft-style directional shading.
const FACE_SHADE = [0.6, 0.6, 1.0, 0.5, 0.8, 0.8];
const AO_CURVE = [0.42, 0.62, 0.82, 1.0];

const FLUID_FACE_SHADE = [0.7, 0.7, 1.0, 0.6, 0.85, 0.85];

let data!: Uint16Array;

function vox(x: number, y: number, z: number): number {
  if (y < -1 || y > CHUNK_HEIGHT) return 0;
  return data[pIdx(x, y, z)];
}

function opaqueAt(x: number, y: number, z: number): boolean {
  return blockDef(voxelId(vox(x, y, z))).opaque;
}

/** AO level (0 dark .. 3 open) for a face vertex. */
function vertexAO(side1: boolean, side2: boolean, corner: boolean): number {
  if (side1 && side2) return 0;
  return 3 - ((side1 ? 1 : 0) + (side2 ? 1 : 0) + (corner ? 1 : 0));
}

// ---------------------------------------------------------------------------
// Core meshing
// ---------------------------------------------------------------------------
const mask = new Int32Array(16 * 256);

/** Exported for unit tests (also the internal entry point). */
export function meshChunk(msg: MeshRequestMsg): MeshResultMsg {
  data = new Uint16Array(msg.data);
  const opaque = new GeoBuilder();
  const water = new GeoBuilder();

  greedyPass(opaque);
  specialPass(opaque, water);

  const result: MeshResultMsg = {
    t: 'mesh',
    cx: msg.cx,
    cz: msg.cz,
    rev: msg.rev,
    opaque: opaque.toBuffers(),
    water: water.toBuffers(),
  };
  return result;
}

function greedyPass(out: GeoBuilder): void {
  for (let dir = 0; dir < 6; dir++) {
    const n = NORMAL[dir];
    const ua = U_AXIS[dir];
    const va = V_AXIS[dir];
    // Slice extents per axis layout.
    const axis = dir >> 1; // 0=x 1=y 2=z
    const sliceCount = axis === 1 ? CHUNK_HEIGHT : 16;
    const uSize = 16; // u axis is always horizontal (z for x-sweeps, x otherwise)
    const vSize = axis === 1 ? 16 : CHUNK_HEIGHT;

    for (let s = 0; s < sliceCount; s++) {
      let any = false;
      // --- Build mask ---
      for (let v = 0; v < vSize; v++) {
        for (let u = 0; u < uSize; u++) {
          const x = axis === 0 ? s : ua[0] * u + va[0] * v;
          const y = axis === 1 ? s : ua[1] * u + va[1] * v;
          const z = axis === 2 ? s : ua[2] * u + va[2] * v;
          const mi = v * uSize + u;
          mask[mi] = 0;

          const cv = data[pIdx(x, y, z)];
          const id = voxelId(cv);
          if (id === 0) continue;
          const d = blockDef(id);
          if (d.renderType !== RenderType.SOLID && d.renderType !== RenderType.CUTOUT) continue;

          const nx = x + n[0];
          const ny = y + n[1];
          const nz = z + n[2];
          const nvx = vox(nx, ny, nz);
          const nid = voxelId(nvx);
          const nd = blockDef(nid);
          if (nd.opaque) continue;
          if (nid === id) continue; // glass/leaves self-culling

          const sun = voxelSun(nvx);
          const bl = voxelBlockLight(nvx);

          // 4-corner AO around the face.
          let ao = 0;
          if (d.renderType === RenderType.SOLID) {
            const s1n = opaqueAt(nx - ua[0], ny - ua[1], nz - ua[2]);
            const s1p = opaqueAt(nx + ua[0], ny + ua[1], nz + ua[2]);
            const s2n = opaqueAt(nx - va[0], ny - va[1], nz - va[2]);
            const s2p = opaqueAt(nx + va[0], ny + va[1], nz + va[2]);
            const cnn = opaqueAt(nx - ua[0] - va[0], ny - ua[1] - va[1], nz - ua[2] - va[2]);
            const cpn = opaqueAt(nx + ua[0] - va[0], ny + ua[1] - va[1], nz + ua[2] - va[2]);
            const cpp = opaqueAt(nx + ua[0] + va[0], ny + ua[1] + va[1], nz + ua[2] + va[2]);
            const cnp = opaqueAt(nx - ua[0] + va[0], ny - ua[1] + va[1], nz - ua[2] + va[2]);
            const a00 = vertexAO(s1n, s2n, cnn);
            const a10 = vertexAO(s1p, s2n, cpn);
            const a11 = vertexAO(s1p, s2p, cpp);
            const a01 = vertexAO(s1n, s2p, cnp);
            ao = a00 | (a10 << 2) | (a11 << 4) | (a01 << 6);
          } else {
            ao = 0xff; // cutouts: full bright corners (3,3,3,3)
          }

          mask[mi] = (1 << 30) | id | (sun << 8) | (bl << 12) | (ao << 16);
          any = true;
        }
      }
      if (!any) continue;

      // --- Greedy merge ---
      for (let v = 0; v < vSize; v++) {
        for (let u = 0; u < uSize; ) {
          const m = mask[v * uSize + u];
          if (m === 0) {
            u++;
            continue;
          }
          let w = 1;
          while (u + w < uSize && mask[v * uSize + u + w] === m) w++;
          let h = 1;
          outer: while (v + h < vSize) {
            for (let k = 0; k < w; k++) {
              if (mask[(v + h) * uSize + u + k] !== m) break outer;
            }
            h++;
          }
          for (let dv2 = 0; dv2 < h; dv2++) {
            for (let du2 = 0; du2 < w; du2++) {
              mask[(v + dv2) * uSize + u + du2] = 0;
            }
          }

          const id = m & 0xff;
          const sun = (m >> 8) & 0xf;
          const bl = (m >> 12) & 0xf;
          const ao = (m >> 16) & 0xff;
          const a00 = ao & 3;
          const a10 = (ao >> 2) & 3;
          const a11 = (ao >> 4) & 3;
          const a01 = (ao >> 6) & 3;

          const d = blockDef(id);
          // Tile per face: tiles[] is ordered [+X,-X,+Y,-Y,+Z,-Z].
          const tile = d.tiles[dir];

          // Base position: slice plane offset for positive dirs.
          const planeOff = dir === 0 || dir === 2 || dir === 4 ? 1 : 0;
          const bx = (dir >> 1 === 0 ? s + planeOff : ua[0] * u + va[0] * v);
          const by = (dir >> 1 === 1 ? s + planeOff : ua[1] * u + va[1] * v);
          const bz = (dir >> 1 === 2 ? s + planeOff : ua[2] * u + va[2] * v);

          const fs = FACE_SHADE[dir];
          const shades: [number, number, number, number] = [
            Math.round(255 * fs * AO_CURVE[a00]),
            Math.round(255 * fs * AO_CURVE[a10]),
            Math.round(255 * fs * AO_CURVE[a11]),
            Math.round(255 * fs * AO_CURVE[a01]),
          ];
          const flip = a00 + a11 > a10 + a01;
          out.quad(
            bx, by, bz,
            ua[0], ua[1], ua[2],
            va[0], va[1], va[2],
            w, h, tile, sun, bl, shades, REVERSE[dir], flip,
          );
          u += w;
        }
      }
    }
  }
}

/** Per-cell pass: CROSS plants + fluids. */
function specialPass(opaque: GeoBuilder, water: GeoBuilder): void {
  for (let y = 0; y < CHUNK_HEIGHT; y++) {
    for (let z = 0; z < 16; z++) {
      for (let x = 0; x < 16; x++) {
        const cv = data[pIdx(x, y, z)];
        const id = voxelId(cv);
        if (id === 0) continue;
        const d = blockDef(id);
        if (d.renderType === RenderType.CROSS) {
          emitCross(opaque, x, y, z, d.tiles[0], voxelSun(cv), voxelBlockLight(cv));
        } else if (d.renderType === RenderType.FLUID) {
          emitFluid(isWater(id) ? water : opaque, x, y, z, id, cv);
        }
      }
    }
  }
}

function emitCross(out: GeoBuilder, x: number, y: number, z: number, tile: number, sun: number, bl: number): void {
  const a = 0.1464; // inset for X-shape across the cell diagonal
  const b = 1 - a;
  const shades: [number, number, number, number] = [255, 255, 255, 255];
  // Diagonal 1 + both windings (double-sided), diagonal 2 + both windings.
  out.quad(x + a, y, z + a, (b - a), 0, (b - a), 0, 1, 0, 1, 1, tile, sun, bl, shades, false, false);
  out.quad(x + a, y, z + a, (b - a), 0, (b - a), 0, 1, 0, 1, 1, tile, sun, bl, shades, true, false);
  out.quad(x + a, y, z + b, (b - a), 0, -(b - a), 0, 1, 0, 1, 1, tile, sun, bl, shades, false, false);
  out.quad(x + a, y, z + b, (b - a), 0, -(b - a), 0, 1, 0, 1, 1, tile, sun, bl, shades, true, false);
}

function emitFluid(out: GeoBuilder, x: number, y: number, z: number, id: number, cv: number): void {
  const lava = isLava(id);
  const sameFluid = (oid: number) => (lava ? isLava(oid) : isWater(oid));
  const sun = voxelSun(cv);
  const bl = voxelBlockLight(cv);

  const above = voxelId(vox(x, y + 1, z));
  const height = sameFluid(above) ? 1 : fluidHeight(id);
  // Wave flag rides in the shade byte (water shader): 255 = surface vertex.
  const surfShade = (s: number) => Math.round(255 * s);

  // Top face
  if (!sameFluid(above) && !blockDef(above).opaque) {
    out.quad(
      x, y + height, z, 1, 0, 0, 0, 0, 1, 1, 1,
      blockDef(id).tiles[2], sun, bl,
      [surfShade(FLUID_FACE_SHADE[2]), surfShade(FLUID_FACE_SHADE[2]), surfShade(FLUID_FACE_SHADE[2]), surfShade(FLUID_FACE_SHADE[2])],
      true, false,
    );
  }
  // Bottom face
  const below = voxelId(vox(x, y - 1, z));
  if (!sameFluid(below) && !blockDef(below).opaque) {
    out.quad(
      x, y, z, 1, 0, 0, 0, 0, 1, 1, 1,
      blockDef(id).tiles[3], sun, bl,
      [surfShade(FLUID_FACE_SHADE[3]), surfShade(FLUID_FACE_SHADE[3]), surfShade(FLUID_FACE_SHADE[3]), surfShade(FLUID_FACE_SHADE[3])],
      false, false,
    );
  }
  // Side faces (full height up to surface level)
  const sides = [
    [1, 0, 0, 0], [-1, 0, 1, 1], [0, 1, 4, 4], [0, -1, 5, 5],
  ];
  for (const [sx, sz, dirIdx] of sides) {
    const nid = voxelId(vox(x + sx, y, z + sz));
    if (sameFluid(nid) || blockDef(nid).opaque) continue;
    const s = surfShade(FLUID_FACE_SHADE[dirIdx]);
    // Quad: u along the horizontal tangent, v along +Y up to `height`.
    let bx: number;
    let bz: number;
    let dux: number;
    let duz: number;
    let reverse: boolean;
    if (sx === 1) {
      bx = x + 1; bz = z; dux = 0; duz = 1; reverse = true;
    } else if (sx === -1) {
      bx = x; bz = z; dux = 0; duz = 1; reverse = false;
    } else if (sz === 1) {
      bx = x; bz = z + 1; dux = 1; duz = 0; reverse = false;
    } else {
      bx = x; bz = z; dux = 1; duz = 0; reverse = true;
    }
    out.quad(
      bx, y, bz, dux, 0, duz, 0, 1, 0, 1, height,
      blockDef(id).tiles[dirIdx], sun, bl,
      [Math.round(s * 0.85), Math.round(s * 0.85), s, s],
      reverse, false,
    );
  }
}

// ---------------------------------------------------------------------------
// Worker entry
// ---------------------------------------------------------------------------
const ctx = self as unknown as Worker;

ctx.onmessage = (e: MessageEvent<MeshRequestMsg>) => {
  const msg = e.data;
  if (msg.t !== 'mesh') return;
  const res = meshChunk(msg);
  ctx.postMessage(res, [
    res.opaque.pos, res.opaque.uv, res.opaque.tile, res.opaque.shade, res.opaque.light, res.opaque.index,
    res.water.pos, res.water.uv, res.water.tile, res.water.shade, res.water.light, res.water.index,
  ]);
};
