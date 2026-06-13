/**
 * Core voxel coordinate math and bit-level chunk memory layout.
 *
 * Memory layout (Module 1 spec):
 *  - Chunk = 16 x 256 x 16 blocks stored in ONE contiguous Uint16Array(65536).
 *  - index = x + (z * 16) + (y * 16 * 16)
 *  - Uint16 bit allocation:
 *      bits 0-7   : Block ID        (0..255)
 *      bits 8-11  : Sunlight level  (0..15)
 *      bits 12-15 : Blocklight level(0..15)
 */

export const CHUNK_SIZE = 16;
export const CHUNK_HEIGHT = 256;
export const CHUNK_AREA = CHUNK_SIZE * CHUNK_SIZE; // 256
export const CHUNK_VOLUME = CHUNK_AREA * CHUNK_HEIGHT; // 65536

export const ID_MASK = 0x00ff;
export const SUN_SHIFT = 8;
export const SUN_MASK = 0x0f00;
export const BLOCKLIGHT_SHIFT = 12;
export const BLOCKLIGHT_MASK = 0xf000;
export const LIGHT_MASK = SUN_MASK | BLOCKLIGHT_MASK;
export const MAX_LIGHT = 15;

/** Voxel index inside a chunk. x,z in [0,16), y in [0,256). */
export function blockIndex(x: number, y: number, z: number): number {
  return x + (z << 4) + (y << 8);
}

export function packVoxel(id: number, sun: number, blockLight: number): number {
  return (id & 0xff) | ((sun & 0xf) << SUN_SHIFT) | ((blockLight & 0xf) << BLOCKLIGHT_SHIFT);
}

export function voxelId(v: number): number {
  return v & ID_MASK;
}

export function voxelSun(v: number): number {
  return (v & SUN_MASK) >> SUN_SHIFT;
}

export function voxelBlockLight(v: number): number {
  return (v & BLOCKLIGHT_MASK) >> BLOCKLIGHT_SHIFT;
}

export function withId(v: number, id: number): number {
  return (v & ~ID_MASK) | (id & 0xff);
}

export function withSun(v: number, sun: number): number {
  return (v & ~SUN_MASK) | ((sun & 0xf) << SUN_SHIFT);
}

export function withBlockLight(v: number, light: number): number {
  return (v & ~BLOCKLIGHT_MASK) | ((light & 0xf) << BLOCKLIGHT_SHIFT);
}

/** World coordinate -> chunk coordinate (floor division by 16). */
export function worldToChunk(v: number): number {
  return v >> 4;
}

/** World coordinate -> local coordinate inside its chunk [0,16). */
export function worldToLocal(v: number): number {
  return v & 15;
}

/** Stable string key for a chunk column. */
export function chunkKey(cx: number, cz: number): string {
  return cx + ',' + cz;
}

/**
 * Packed numeric chunk key (for Map<number, ...> hot paths).
 * Supports chunk coords in [-32768, 32767].
 */
export function chunkKeyNum(cx: number, cz: number): number {
  return ((cx + 0x8000) << 16) | ((cz + 0x8000) & 0xffff);
}

export function chunkKeyNumX(key: number): number {
  return (key >>> 16) - 0x8000;
}

export function chunkKeyNumZ(key: number): number {
  return (key & 0xffff) - 0x8000;
}

export function floorDiv(a: number, b: number): number {
  return Math.floor(a / b);
}

/** Manhattan-ish chunk distance used for load priority rings. */
export function chunkDist(cx0: number, cz0: number, cx1: number, cz1: number): number {
  return Math.max(Math.abs(cx0 - cx1), Math.abs(cz0 - cz1));
}
