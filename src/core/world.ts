/**
 * Chunk-map world store + voxel flood-fill lighting engine.
 *
 * Used by BOTH the main thread (authoritative copy: raycasts, player physics,
 * lighting) and the logic worker (mirrored copy: mob AI, fluids).
 * All lighting BFS runs on the main thread only; the worker receives raw
 * voxel patches (see net protocol in src/net/messages.ts).
 */
import {
  CHUNK_HEIGHT,
  blockIndex,
  chunkKeyNum,
  voxelId,
  voxelSun,
  voxelBlockLight,
  withSun,
  withBlockLight,
  MAX_LIGHT,
} from './coords';
import { blockDef } from './blocks';
import { VoxelSampler } from './aabb';

export type CellChangeSink = (x: number, y: number, z: number, value: number) => void;

const DX = [1, -1, 0, 0, 0, 0];
const DY = [0, 0, 1, -1, 0, 0];
const DZ = [0, 0, 0, 0, 1, -1];

export class World implements VoxelSampler {
  readonly chunks = new Map<number, Uint16Array>();
  /** Chunk keys whose meshes are stale. */
  readonly dirty = new Set<number>();
  /** Cell change sink (main thread: batches patches to the logic worker). */
  onCellChanged: CellChangeSink | null = null;
  /** Fired once per actual block-ID change (never for light-only rewrites). */
  onBlockChanged: ((x: number, y: number, z: number, id: number) => void) | null = null;

  // Reusable BFS queues (x,y,z triplets; removal queues add a 4th = old light).
  private addQ: number[] = [];
  private remQ: number[] = [];

  hasChunk(cx: number, cz: number): boolean {
    return this.chunks.has(chunkKeyNum(cx, cz));
  }

  addChunk(cx: number, cz: number, data: Uint16Array): void {
    this.chunks.set(chunkKeyNum(cx, cz), data);
  }

  removeChunk(cx: number, cz: number): void {
    this.chunks.delete(chunkKeyNum(cx, cz));
  }

  getChunk(cx: number, cz: number): Uint16Array | undefined {
    return this.chunks.get(chunkKeyNum(cx, cz));
  }

  getVoxel(x: number, y: number, z: number): number {
    if (y < 0 || y >= CHUNK_HEIGHT) return 0;
    const chunk = this.chunks.get(chunkKeyNum(x >> 4, z >> 4));
    if (!chunk) return 0;
    return chunk[blockIndex(x & 15, y, z & 15)];
  }

  getBlockId(x: number, y: number, z: number): number {
    return voxelId(this.getVoxel(x, y, z));
  }

  getSun(x: number, y: number, z: number): number {
    if (y >= CHUNK_HEIGHT) return MAX_LIGHT;
    return voxelSun(this.getVoxel(x, y, z));
  }

  getBlockLight(x: number, y: number, z: number): number {
    return voxelBlockLight(this.getVoxel(x, y, z));
  }

  /** Combined light used for spawn checks: max(sun*sunFactor, blocklight). */
  lightAt(x: number, y: number, z: number, sunLevel: number): number {
    const v = this.getVoxel(x, y, z);
    return Math.max(Math.floor((voxelSun(v) * sunLevel) / 15), voxelBlockLight(v));
  }

  /** Raw voxel write with dirty marking. Used for mirror sync patches. */
  setRaw(x: number, y: number, z: number, value: number): void {
    if (y < 0 || y >= CHUNK_HEIGHT) return;
    const cx = x >> 4;
    const cz = z >> 4;
    const chunk = this.chunks.get(chunkKeyNum(cx, cz));
    if (!chunk) return;
    chunk[blockIndex(x & 15, y, z & 15)] = value;
    this.markDirtyAround(x, y, z, cx, cz);
  }

  private write(x: number, y: number, z: number, value: number): void {
    const cx = x >> 4;
    const cz = z >> 4;
    const chunk = this.chunks.get(chunkKeyNum(cx, cz));
    if (!chunk) return;
    chunk[blockIndex(x & 15, y, z & 15)] = value;
    this.markDirtyAround(x, y, z, cx, cz);
    if (this.onCellChanged) this.onCellChanged(x, y, z, value);
  }

  /** Mark the containing chunk dirty plus neighbors when on a border. */
  private markDirtyAround(x: number, y: number, z: number, cx: number, cz: number): void {
    this.dirty.add(chunkKeyNum(cx, cz));
    const lx = x & 15;
    const lz = z & 15;
    if (lx === 0) this.dirty.add(chunkKeyNum(cx - 1, cz));
    else if (lx === 15) this.dirty.add(chunkKeyNum(cx + 1, cz));
    if (lz === 0) this.dirty.add(chunkKeyNum(cx, cz - 1));
    else if (lz === 15) this.dirty.add(chunkKeyNum(cx, cz + 1));
    void y;
  }

  /** True if nothing above (x, y) blocks or filters skylight. */
  skyVisible(x: number, y: number, z: number): boolean {
    for (let yy = y + 1; yy < CHUNK_HEIGHT; yy++) {
      const d = blockDef(voxelId(this.getVoxel(x, yy, z)));
      if (d.opaque || d.lightFilter > 0) return false;
    }
    return true;
  }

  highestSolid(x: number, z: number): number {
    for (let y = CHUNK_HEIGHT - 1; y >= 0; y--) {
      if (blockDef(voxelId(this.getVoxel(x, y, z))).solid) return y;
    }
    return 0;
  }

  // -------------------------------------------------------------------------
  // Block mutation with full lighting pipeline (main thread).
  // -------------------------------------------------------------------------
  setBlock(x: number, y: number, z: number, id: number): boolean {
    if (y < 0 || y >= CHUNK_HEIGHT) return false;
    const chunk = this.chunks.get(chunkKeyNum(x >> 4, z >> 4));
    if (!chunk) return false;
    const idx = blockIndex(x & 15, y, z & 15);
    const oldV = chunk[idx];
    const oldId = voxelId(oldV);
    if (oldId === id) return false;

    const oldSun = voxelSun(oldV);
    const oldBL = voxelBlockLight(oldV);
    const newDef = blockDef(id);

    // Write the id with cleared light; BFS rebuilds it.
    this.write(x, y, z, id);
    if (this.onBlockChanged) this.onBlockChanged(x, y, z, id);

    // --- Blocklight ---
    if (oldBL > 0) this.removeLight(x, y, z, oldBL, false);
    if (newDef.lightEmit > 0) {
      this.write(x, y, z, withBlockLight(this.getVoxel(x, y, z), newDef.lightEmit));
      this.addQ.push(x, y, z);
      this.spreadLight(false);
    }
    if (!newDef.opaque) {
      for (let i = 0; i < 6; i++) this.addQ.push(x + DX[i], y + DY[i], z + DZ[i]);
      this.spreadLight(false);
    }

    // --- Sunlight ---
    if (oldSun > 0) this.removeLight(x, y, z, oldSun, true);
    if (!newDef.opaque) {
      if (newDef.lightFilter === 0 && this.skyVisible(x, y, z)) {
        this.write(x, y, z, withSun(this.getVoxel(x, y, z), MAX_LIGHT));
        this.addQ.push(x, y, z);
      }
      for (let i = 0; i < 6; i++) this.addQ.push(x + DX[i], y + DY[i], z + DZ[i]);
      this.spreadLight(true);
    }
    return true;
  }

  /**
   * Light removal BFS. Cells holding light derived from the removed source
   * are zeroed and their brighter neighbors are queued for re-spreading.
   */
  private removeLight(sx: number, sy: number, sz: number, oldLight: number, sun: boolean): void {
    const rem = this.remQ;
    rem.push(sx, sy, sz, oldLight);
    let head = 0;
    while (head < rem.length) {
      const x = rem[head++];
      const y = rem[head++];
      const z = rem[head++];
      const cur = rem[head++];
      for (let i = 0; i < 6; i++) {
        const nx = x + DX[i];
        const ny = y + DY[i];
        const nz = z + DZ[i];
        if (ny < 0 || ny >= CHUNK_HEIGHT) continue;
        const nv = this.getVoxel(nx, ny, nz);
        const nl = sun ? voxelSun(nv) : voxelBlockLight(nv);
        if (nl === 0) continue;
        // Downward full sunlight is removed unconditionally (column light).
        const isColumn = sun && cur === MAX_LIGHT && DY[i] === -1 && nl === MAX_LIGHT;
        if (nl < cur || isColumn) {
          this.write(nx, ny, nz, sun ? withSun(nv, 0) : withBlockLight(nv, 0));
          rem.push(nx, ny, nz, isColumn ? MAX_LIGHT : nl);
        } else {
          this.addQ.push(nx, ny, nz);
        }
      }
    }
    rem.length = 0;
    this.spreadLight(sun);
  }

  /** Light addition BFS over this.addQ. */
  private spreadLight(sun: boolean): void {
    const q = this.addQ;
    let head = 0;
    while (head < q.length) {
      const x = q[head++];
      const y = q[head++];
      const z = q[head++];
      if (y < 0 || y >= CHUNK_HEIGHT) continue;
      const v = this.getVoxel(x, y, z);
      const cur = sun ? voxelSun(v) : voxelBlockLight(v);
      if (cur <= 1) continue;
      for (let i = 0; i < 6; i++) {
        const nx = x + DX[i];
        const ny = y + DY[i];
        const nz = z + DZ[i];
        if (ny < 0 || ny >= CHUNK_HEIGHT) continue;
        if (!this.chunks.has(chunkKeyNum(nx >> 4, nz >> 4))) continue;
        const nv = this.getVoxel(nx, ny, nz);
        const nd = blockDef(voxelId(nv));
        if (nd.opaque) continue;
        let target: number;
        if (sun && cur === MAX_LIGHT && DY[i] === -1 && nd.lightFilter === 0) {
          target = MAX_LIGHT; // full sun travels down for free
        } else {
          target = cur - 1 - nd.lightFilter;
        }
        const nl = sun ? voxelSun(nv) : voxelBlockLight(nv);
        if (target > nl) {
          this.write(nx, ny, nz, sun ? withSun(nv, target) : withBlockLight(nv, target));
          q.push(nx, ny, nz);
        }
      }
    }
    q.length = 0;
  }

  /**
   * Cross-chunk light reconciliation when a freshly generated chunk arrives.
   * Generation-time light never over-estimates (borders were assumed dark),
   * so an addition-only BFS seeded from both sides of every border is exact.
   */
  reconcileChunkLight(cx: number, cz: number): void {
    const x0 = cx << 4;
    const z0 = cz << 4;
    const seed = (x: number, y: number, z: number) => {
      const v = this.getVoxel(x, y, z);
      if (voxelSun(v) > 1) this.addQ.push(x, y, z);
    };
    const seedB = (x: number, y: number, z: number) => {
      const v = this.getVoxel(x, y, z);
      if (voxelBlockLight(v) > 1) this.addQ.push(x, y, z);
    };
    for (const pass of [0, 1]) {
      const fn = pass === 0 ? seed : seedB;
      for (let y = 0; y < CHUNK_HEIGHT; y++) {
        for (let i = 0; i < 16; i++) {
          // This chunk's border cells + the adjacent cells of loaded neighbors.
          fn(x0 + i, y, z0);
          fn(x0 + i, y, z0 - 1);
          fn(x0 + i, y, z0 + 15);
          fn(x0 + i, y, z0 + 16);
          fn(x0, y, z0 + i);
          fn(x0 - 1, y, z0 + i);
          fn(x0 + 15, y, z0 + i);
          fn(x0 + 16, y, z0 + i);
        }
      }
      this.spreadLight(pass === 0);
    }
  }
}
