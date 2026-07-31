/**
 * Zustand global game store (Module 6/7 spec): player inventory state
 * machine, open-screen management, settings, HUD/debug stats.
 * Mutating game actions are routed through the engine bridge so the
 * renderer/engine and the logic worker stay authoritative.
 */
import { create } from 'zustand';
import { ItemStack } from '../core/items';
import { Slots } from '../core/inventory';
import {
  DEFAULT_DAY_LENGTH_SEC,
  DEFAULT_FOV,
  DEFAULT_RENDER_DISTANCE,
  PLAYER_MAX_HP,
} from '../core/config';

export type GamePhase = 'title' | 'loading' | 'playing' | 'dead';
export type GameMode = 'survival' | 'creative';
export type Screen = 'none' | 'inventory' | 'crafting' | 'container' | 'pause' | 'enchant';
export type ContainerKind = 'chest' | 'furnace' | 'hopper';

export interface ContainerView {
  kind: ContainerKind;
  x: number;
  y: number;
  z: number;
  slots: Slots;
  fuel: number; // 0..1 burn remaining
  cook: number; // 0..1 cook progress
}

export interface Settings {
  renderDistance: number;
  fov: number;
  quality: 0 | 1 | 2;
  dayLengthSec: number;
  sensitivity: number;
  brightness: number; // display gamma, 1 = neutral
  /** Let the engine drop render resolution when frames tank (default off —
   *  image sharpness stays under the player's control). */
  autoResolution: boolean;
  soundVolume: number; // master volume 0..1
  viewBobbing: boolean; // walk bob + sprint FOV kick
  thirdPerson: boolean;
  touchMode: boolean;
  showDebug: boolean;
}

export interface DebugStats {
  fps: number;
  chunks: number;
  pending: number;
  entities: number;
  tickMs: number;
  x: number;
  y: number;
  z: number;
}

interface GameStore {
  phase: GamePhase;
  gameMode: GameMode;
  seedText: string;
  loadProgress: number;
  screen: Screen;
  health: number;
  food: number;
  xpLevel: number;
  xpPoints: number; // progress into the current level
  breathe: number;
  hotbarIndex: number;
  inventory: Slots;
  armor: Slots; // 4 slots: head, chest, legs, feet
  cursor: ItemStack | null;
  craftGrid: Slots;
  craftSize: 2 | 3;
  craftResult: ItemStack | null;
  container: ContainerView | null;
  settings: Settings;
  debug: DebugStats;
  timeOfDay: number;
  toast: string | null;
  breakProgress: number; // 0..1 while mining
  sleeping: boolean; // bed fade-to-black overlay
  portalFade: number; // 0..1 purple overlay while standing in a portal
  saveSeed: number | null; // seed of the stored world (Continue button)

  set: (partial: Partial<GameStore>) => void;
  setSettings: (partial: Partial<Settings>) => void;
}

// v2: render-scale presets became relative to devicePixelRatio and view
// bobbing defaults off — stored v1 values would keep the old blurry/bobbing
// behavior, so the key is bumped to adopt the new defaults once.
const SETTINGS_KEY = 'voxelcraft.settings.v2';

function loadSettings(): Settings {
  const defaults: Settings = {
    renderDistance: DEFAULT_RENDER_DISTANCE,
    fov: DEFAULT_FOV,
    quality: 1,
    dayLengthSec: DEFAULT_DAY_LENGTH_SEC,
    sensitivity: 1,
    brightness: 1,
    autoResolution: false,
    soundVolume: 0.8,
    viewBobbing: false,
    thirdPerson: false,
    touchMode: typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches === true,
    showDebug: false,
  };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    // Corrupt/unavailable storage: fall back to defaults.
  }
  return defaults;
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'title',
  gameMode: 'survival',
  seedText: '',
  loadProgress: 0,
  screen: 'none',
  health: PLAYER_MAX_HP,
  food: 20,
  xpLevel: 0,
  xpPoints: 0,
  breathe: 10,
  hotbarIndex: 0,
  inventory: new Array<ItemStack | null>(36).fill(null),
  armor: new Array<ItemStack | null>(4).fill(null),
  cursor: null,
  craftGrid: new Array<ItemStack | null>(9).fill(null),
  craftSize: 2,
  craftResult: null,
  container: null,
  settings: loadSettings(),
  debug: { fps: 0, chunks: 0, pending: 0, entities: 0, tickMs: 0, x: 0, y: 0, z: 0 },
  timeOfDay: 0.3,
  toast: null,
  breakProgress: 0,
  sleeping: false,
  portalFade: 0,
  saveSeed: null,

  set: (partial) => set(partial),
  setSettings: (partial) => {
    const next = { ...get().settings, ...partial };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // Storage may be unavailable (private mode); settings stay in memory.
    }
    set({ settings: next });
  },
}));

/** Convenience non-hook accessors for engine code. */
export const gameStore = {
  get: useGameStore.getState,
  set: (partial: Parameters<GameStore['set']>[0]) => useGameStore.getState().set(partial),
  subscribe: useGameStore.subscribe,
};

// Read access for the headless smoke harness (scripts/smoke.mjs asserts
// drag-and-drop actually moved stacks).
if (typeof window !== 'undefined') {
  (window as unknown as { __fableStore?: typeof gameStore }).__fableStore = gameStore;
}
