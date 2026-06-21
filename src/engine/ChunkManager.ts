/**
 * Chunk lifecycle orchestration on the main thread:
 *   spiral load order -> gen worker requests -> world store + light
 *   reconciliation -> padded-region snapshots -> mesh worker -> THREE
 *   geometry upload, with per-frame budgets so the render thread never hitches.
 */
import * as THREE from 'three';
import { World } from '../core/world';
import {
  CHUNK_HEIGHT,
  chunkKeyNum,
  chunkKeyNumX,
  chunkKeyNumZ,
  blockIndex,
  packVoxel,
} from '../core/coords';
import type { FromGenMsg, FromMeshMsg, GenChunkMsg, MeshBuffers } from '../net/messages';

const PAD_X = 18;
const PAD_XZ = 18 * 18;
const PAD_LEN = 18 * 18 * 258;

interface ChunkRecord {
  cx: number;
  cz: number;
  state: 'pending' | 'ready';
  rev: number;
  appliedRev: number;
  opaqueMesh: THREE.Mesh | null;
  waterMesh: THREE.Mesh | null;
  meshed: boolean;
}

export class ChunkManager {
  readonly world = new World();
  private records = new Map<number, ChunkRecord>();
  private genQueue: number[] = [];
  private genInFlight = new Set<number>();
  private meshQueue = new Set<number>();
  private meshInFlight = 0;
  private scene: THREE.Scene;
  private opaqueMaterial: THREE.Material;
  private waterMaterial: THREE.Material;
  private genWorker: Worker;
  private meshWorker: Worker;
  /** Called when a generated chunk (with metadata) is integrated. */
  onChunkReady: ((msg: GenChunkMsg, copy: ArrayBuffer) => void) | null = null;
  onChunkRemoved: ((cx: number, cz: number) => void) | null = null;

  centerX = 0;
  centerZ = 0;
  renderDistance = 6;

  constructor(
    scene: THREE.Scene,
    opaqueMaterial: THREE.Material,
    waterMaterial: THREE.Material,
    genWorker: Worker,
    meshWorker: Worker,
  ) {
    this.scene = scene;
    this.opaqueMaterial = opaqueMaterial;
    this.waterMaterial = waterMaterial;
    this.genWorker = genWorker;
    this.meshWorker = meshWorker;
    this.genWorker.onmessage = (e: MessageEvent<FromGenMsg>) => this.handleGen(e.data);
    this.meshWorker.onmessage = (e: MessageEvent<FromMeshMsg>) => this.handleMesh(e.data);
  }

  stats(): { chunks: number; pending: number } {
    return { chunks: this.records.size, pending: this.genQueue.length + this.genInFlight.size + this.meshQueue.size };
  }

  /** Is the data (not necessarily the mesh) for this chunk available? */
  isReady(cx: number, cz: number): boolean {
    return this.records.get(chunkKeyNum(cx, cz))?.state === 'ready';
  }

  isMeshed(cx: number, cz: number): boolean {
    return this.records.get(chunkKeyNum(cx, cz))?.meshed === true;
  }

  /** Fraction of the spawn area that is meshed (loading screen). */
  spawnProgress(cx: number, cz: number, r: number): number {
    let total = 0;
    let done = 0;
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        total++;
        if (this.isMeshed(cx + dx, cz + dz)) done++;
      }
    }
    return total === 0 ? 1 : done / total;
  }

  update(centerX: number, centerZ: number): void {
    this.centerX = centerX;
    this.centerZ = centerZ;
    const pcx = centerX >> 4;
    const pcz = centerZ >> 4;
    const rd = this.renderDistance;
    const dataR = rd + 1;

    // --- Request missing chunk data in spiral order ---
    this.genQueue.length = 0;
    for (let r = 0; r <= dataR; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const key = chunkKeyNum(pcx + dx, pcz + dz);
          if (!this.records.has(key) && !this.genInFlight.has(key)) {
            this.genQueue.push(key);
          }
        }
      }
    }
    while (this.genInFlight.size < 8 && this.genQueue.length > 0) {
      const key = this.genQueue.shift()!;
      this.genInFlight.add(key);
      this.genWorker.postMessage({ t: 'gen', cx: chunkKeyNumX(key), cz: chunkKeyNumZ(key) });
    }

    // --- Absorb world dirty set into the mesh queue ---
    for (const key of this.world.dirty) {
      if (this.records.get(key)?.state === 'ready') this.meshQueue.add(key);
    }
    this.world.dirty.clear();

    // --- Dispatch mesh jobs (closest first, neighbor data required) ---
    if (this.meshInFlight < 4 && this.meshQueue.size > 0) {
      const sorted = [...this.meshQueue].sort((a, b) => {
        const da = Math.max(Math.abs(chunkKeyNumX(a) - pcx), Math.abs(chunkKeyNumZ(a) - pcz));
        const db = Math.max(Math.abs(chunkKeyNumX(b) - pcx), Math.abs(chunkKeyNumZ(b) - pcz));
        return da - db;
      });
      for (const key of sorted) {
        if (this.meshInFlight >= 4) break;
        const cx = chunkKeyNumX(key);
        const cz = chunkKeyNumZ(key);
        if (Math.max(Math.abs(cx - pcx), Math.abs(cz - pcz)) > rd) {
          this.meshQueue.delete(key); // out of render range; drop silently
          continue;
        }
        if (!this.neighborsReady(cx, cz)) continue;
        const rec = this.records.get(key);
        if (!rec) {
          this.meshQueue.delete(key);
          continue;
        }
        this.meshQueue.delete(key);
        rec.rev++;
        const padded = this.buildPadded(cx, cz);
        this.meshWorker.postMessage({ t: 'mesh', cx, cz, rev: rec.rev, data: padded.buffer }, [padded.buffer]);
        this.meshInFlight++;
      }
    }

    // --- Unload far chunks ---
    for (const [key, rec] of this.records) {
      const d = Math.max(Math.abs(rec.cx - pcx), Math.abs(rec.cz - pcz));
      if (d > dataR + 1) {
        this.disposeMeshes(rec);
        this.records.delete(key);
        this.world.removeChunk(rec.cx, rec.cz);
        this.meshQueue.delete(key);
        if (this.onChunkRemoved) this.onChunkRemoved(rec.cx, rec.cz);
      }
    }
  }

  private neighborsReady(cx: number, cz: number): boolean {
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (this.records.get(chunkKeyNum(cx + dx, cz + dz))?.state !== 'ready') return false;
      }
    }
    return true;
  }

  private handleGen(msg: FromGenMsg): void {
    if (msg.t !== 'chunk') return;
    const key = chunkKeyNum(msg.cx, msg.cz);
    this.genInFlight.delete(key);
    const data = new Uint16Array(msg.data);
    this.world.addChunk(msg.cx, msg.cz, data);
    this.world.reconcileChunkLight(msg.cx, msg.cz);
    this.records.set(key, {
      cx: msg.cx,
      cz: msg.cz,
      state: 'ready',
      rev: 0,
      appliedRev: 0,
      opaqueMesh: null,
      waterMesh: null,
      meshed: false,
    });
    // Light reconciliation marks dirty chunks; ensure self + neighbors remesh.
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nk = chunkKeyNum(msg.cx + dx, msg.cz + dz);
        if (this.records.get(nk)?.state === 'ready') this.meshQueue.add(nk);
      }
    }
    if (this.onChunkReady) {
      // Mirror copy for the logic worker (transferred there).
      const copy = data.slice().buffer;
      this.onChunkReady(msg, copy);
    }
  }

  private handleMesh(msg: FromMeshMsg): void {
    this.meshInFlight--;
    const key = chunkKeyNum(msg.cx, msg.cz);
    const rec = this.records.get(key);
    if (!rec || msg.rev < rec.appliedRev) return;
    rec.appliedRev = msg.rev;
    this.disposeMeshes(rec);
    rec.opaqueMesh = this.buildMesh(msg.cx, msg.cz, msg.opaque, this.opaqueMaterial, false);
    rec.waterMesh = this.buildMesh(msg.cx, msg.cz, msg.water, this.waterMaterial, true);
    rec.meshed = true;
  }

  private buildMesh(
    cx: number,
    cz: number,
    buffers: MeshBuffers,
    material: THREE.Material,
    transparent: boolean,
  ): THREE.Mesh | null {
    if (buffers.count === 0) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffers.pos), 3));
    geo.setAttribute('aUv', new THREE.BufferAttribute(new Float32Array(buffers.uv), 2));
    geo.setAttribute('aTile', new THREE.BufferAttribute(new Uint16Array(buffers.tile), 1));
    const shade = new THREE.BufferAttribute(new Uint8Array(buffers.shade), 1);
    shade.normalized = true;
    geo.setAttribute('aShade', shade);
    geo.setAttribute('aLight', new THREE.BufferAttribute(new Uint8Array(buffers.light), 2));
    geo.setIndex(new THREE.BufferAttribute(new Uint32Array(buffers.index), 1));
    geo.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(8, CHUNK_HEIGHT / 2, 8),
      Math.sqrt(8 * 8 + (CHUNK_HEIGHT / 2) * (CHUNK_HEIGHT / 2) + 8 * 8),
    );
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(cx * 16, 0, cz * 16);
    mesh.frustumCulled = true;
    mesh.renderOrder = transparent ? 10 : 0;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    this.scene.add(mesh);
    return mesh;
  }

  private disposeMeshes(rec: ChunkRecord): void {
    for (const m of [rec.opaqueMesh, rec.waterMesh]) {
      if (m) {
        this.scene.remove(m);
        m.geometry.dispose();
      }
    }
    rec.opaqueMesh = null;
    rec.waterMesh = null;
  }

  /** Snapshot the chunk + 1-block apron into a padded array for the mesher. */
  private buildPadded(cx: number, cz: number): Uint16Array {
    const out = new Uint16Array(PAD_LEN);
    // y = 256 plane: open sky (sun 15) so top faces of tall builds stay lit.
    const skyVal = packVoxel(0, 15, 0);
    const topBase = 257 * PAD_XZ;
    for (let i = 0; i < PAD_XZ; i++) out[topBase + i] = skyVal;

    // Cache the 3x3 neighborhood.
    const hood: (Uint16Array | undefined)[] = [];
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        hood.push(this.world.getChunk(cx + dx, cz + dz));
      }
    }
    for (let y = 0; y < CHUNK_HEIGHT; y++) {
      const yBase = (y + 1) * PAD_XZ;
      for (let z = -1; z <= 16; z++) {
        const hz = z < 0 ? 0 : z > 15 ? 2 : 1;
        const lz = z & 15;
        const rowBase = yBase + (z + 1) * PAD_X;
        for (let x = -1; x <= 16; x++) {
          const hx = x < 0 ? 0 : x > 15 ? 2 : 1;
          const chunk = hood[hz * 3 + hx];
          out[rowBase + x + 1] = chunk ? chunk[blockIndex(x & 15, y, lz)] : 0;
        }
      }
    }
    return out;
  }

  dispose(): void {
    for (const rec of this.records.values()) this.disposeMeshes(rec);
    this.records.clear();
  }
}
