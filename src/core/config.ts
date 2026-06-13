/**
 * Global gameplay/engine tuning constants shared by all threads.
 */
export const TICK_RATE = 20; // game logic ticks per second (Thread B)
export const TICK_MS = 1000 / TICK_RATE; // exactly 50ms
export const SEA_LEVEL = 62;

// --- Player ---
export const PLAYER_WIDTH = 0.6;
export const PLAYER_HEIGHT = 1.8;
export const PLAYER_SNEAK_HEIGHT = 1.5;
export const PLAYER_EYE = 1.62;
export const PLAYER_SNEAK_EYE = 1.27;
export const PLAYER_WALK_SPEED = 4.32; // blocks/sec
export const PLAYER_SPRINT_SPEED = 5.6;
export const PLAYER_SNEAK_SPEED = 1.3;
export const PLAYER_JUMP_SPEED = 8.6;
export const PLAYER_SWIM_SPEED = 3.2;
export const PLAYER_REACH = 4.8;
export const PLAYER_MAX_HP = 20;

// --- Physics ---
export const GRAVITY = -30;
export const TERMINAL_VELOCITY = -60;
export const AIR_CONTROL = 0.35;
export const GROUND_FRICTION = 12;
export const STEP_HEIGHT = 0.55;
export const FLUID_PUSH = 2.2; // constant fluid acceleration (Module 4 spec)
export const WATER_DRAG = 4.5;
export const FALL_DAMAGE_THRESHOLD = 3.2;

// --- Spawning / despawn ---
export const HOSTILE_CAP = 22;
export const PASSIVE_CAP = 14;
export const DESPAWN_RADIUS = 72;
export const SPAWN_MIN_RADIUS = 20;
export const SPAWN_MAX_RADIUS = 44;
export const ITEM_DESPAWN_TICKS = 20 * 60 * 5; // 5 minutes
export const ITEM_PICKUP_RADIUS = 1.4;
export const ITEM_MERGE_RADIUS = 0.8;

// --- Fluids ---
export const WATER_TICK_INTERVAL = 5; // every 5 game ticks
export const LAVA_TICK_INTERVAL = 15;

// --- Hoppers ---
export const HOPPER_INTERVAL = 4; // every 4 game ticks (Module 5 spec)

// --- Day/night ---
export const DEFAULT_DAY_LENGTH_SEC = 600; // 10 real minutes per full cycle

// --- Render defaults ---
export const DEFAULT_RENDER_DISTANCE = 6;
export const MIN_RENDER_DISTANCE = 2;
export const MAX_RENDER_DISTANCE = 16;
export const DEFAULT_FOV = 75;
