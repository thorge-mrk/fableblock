/**
 * World persistence (v1): a single IndexedDB save slot holding the seed,
 * time of day, player state, inventory and a block-edit journal
 * (chunkKey -> [blockIndex, blockId, ...]). On load the world regenerates
 * from the seed and the journal is replayed as each chunk arrives.
 * Deliberately NOT saved in v1: container contents, mobs, fluids in flight.
 */
import type { ItemStack } from '../core/items';

export interface SaveData {
  version: 1;
  seed: number;
  time: number;
  player: { x: number; y: number; z: number; yaw: number; pitch: number; health: number };
  spawnPoint: [number, number, number] | null;
  inventory: (ItemStack | null)[];
  hotbarIndex: number;
  /** chunkKeyNum (as string) -> flat [blockIndex, blockId, ...] pairs. */
  edits: Record<string, number[]>;
  savedAt: number;
}

const DB_NAME = 'fableblock';
const STORE = 'saves';
const KEY = 'world';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveWorld(data: SaveData): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(data, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Private mode / quota — the game must keep running without saves.
  }
}

export async function loadWorld(): Promise<SaveData | null> {
  try {
    const db = await openDB();
    const data = await new Promise<SaveData | null>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve((req.result as SaveData) ?? null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (data && data.version === 1 && typeof data.seed === 'number') return data;
    return null;
  } catch {
    return null;
  }
}

export async function clearWorld(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // ignore
  }
}
