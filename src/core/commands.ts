/**
 * Chat command language: parsing, argument coercion and name lookup.
 *
 * Deliberately free of engine and UI imports so the whole surface is unit
 * testable. The engine supplies a CommandContext with the few side-effecting
 * hooks (teleport, give, locate...) and this module decides what to call.
 */
import { B, blockDef } from './blocks';
import { ITEM, itemDef } from './items';

export interface ChatLine {
  text: string;
  kind: 'info' | 'error' | 'ok' | 'echo';
}

/** Everything a command may do to the running game. */
export interface CommandContext {
  playerPos(): { x: number; y: number; z: number };
  teleport(x: number, y: number, z: number): void;
  give(itemId: number, count: number): boolean;
  setTime(t: number): void;
  getTime(): number;
  setGameMode(mode: 'survival' | 'creative'): void;
  getGameMode(): 'survival' | 'creative';
  heal(): void;
  kill(): void;
  clearInventory(): void;
  seed(): number;
  setRenderDistance(n: number): void;
  setWeather(rain: boolean): void;
  /** Async world scan; resolves with the found spot or null. */
  locate(kind: 'biome' | 'structure', target: string): Promise<{ x: number; z: number } | null>;
  print(line: ChatLine): void;
}

export interface CommandSpec {
  name: string;
  usage: string;
  help: string;
  /** Completion candidates per argument position (0-based). */
  args?: Array<() => string[]>;
  run(ctx: CommandContext, args: string[]): void | Promise<void>;
}

// ---------------------------------------------------------------------------
// Name tables
// ---------------------------------------------------------------------------

/** Biome names accepted by /locate biome, in worker enum order. */
export const BIOME_NAMES: ReadonlyArray<string> = [
  'ocean', 'plains', 'forest', 'desert', 'mountains', 'swamp', 'cherry_grove',
  'jungle', 'snowy_plains', 'beach', 'river', 'taiga', 'snowy_taiga', 'savanna',
  'badlands', 'birch_forest', 'dark_forest', 'flower_forest', 'mushroom_fields',
  'ice_spikes', 'stony_peaks', 'meadow', 'sunflower_plains', 'old_growth_taiga',
  'gravelly_hills', 'mangrove_swamp', 'frozen_ocean',
];

export const STRUCTURE_NAMES: ReadonlyArray<string> = [
  'village', 'pyramid', 'temple', 'igloo', 'witch_hut',
];

/** snake_case key for an item/block id, e.g. "oak_planks". */
export function itemKey(id: number): string {
  return itemDef(id).name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

let itemIndex: Map<string, number> | null = null;

/** All placeable blocks + real items, keyed by snake_case name. */
export function itemNameIndex(): Map<string, number> {
  if (itemIndex) return itemIndex;
  const m = new Map<string, number>();
  for (let id = 1; id < 256; id++) {
    const d = blockDef(id);
    if (!d || d.name === 'Unknown') continue;
    const key = itemKey(id);
    if (!m.has(key)) m.set(key, id);
  }
  for (const id of Object.values(ITEM)) {
    const key = itemKey(id);
    if (!m.has(key)) m.set(key, id);
  }
  itemIndex = m;
  return m;
}

/** Resolve an item by name or numeric id; null when unknown. */
export function resolveItem(token: string): number | null {
  const t = token.trim().toLowerCase().replace(/^minecraft:/, '');
  if (/^\d+$/.test(t)) {
    const id = Number(t);
    return id > 0 && id <= 400 ? id : null;
  }
  const idx = itemNameIndex();
  const direct = idx.get(t);
  if (direct !== undefined) return direct;
  // Forgiving match: unique prefix wins (e.g. "diamond_pick").
  const hits = [...idx.entries()].filter(([k]) => k.startsWith(t));
  return hits.length === 1 ? hits[0][1] : null;
}

/** Resolve a fuzzy biome/structure name against a table. */
export function resolveName(token: string, table: ReadonlyArray<string>): string | null {
  const t = token.trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (table.includes(t)) return t;
  const hits = table.filter((n) => n.startsWith(t));
  if (hits.length === 1) return hits[0];
  const loose = table.filter((n) => n.includes(t));
  return loose.length === 1 ? loose[0] : null;
}

// ---------------------------------------------------------------------------
// Argument coercion
// ---------------------------------------------------------------------------

/**
 * Coordinate token: absolute ("64"), relative ("~", "~-3").
 * Returns null when the token is not a valid coordinate.
 */
export function coord(token: string, origin: number): number | null {
  if (token === '~') return origin;
  if (token.startsWith('~')) {
    const off = Number(token.slice(1));
    return Number.isFinite(off) ? origin + off : null;
  }
  const v = Number(token);
  return Number.isFinite(v) ? v : null;
}

/** Named time-of-day presets (cycle position 0..1; 0 = dawn, 0.25 = noon). */
export const TIME_PRESETS: Readonly<Record<string, number>> = {
  dawn: 0.0,
  sunrise: 0.02,
  day: 0.15,
  noon: 0.25,
  sunset: 0.48,
  dusk: 0.5,
  night: 0.6,
  midnight: 0.75,
};

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function fmt(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

export const COMMANDS: CommandSpec[] = [
  {
    name: 'help',
    usage: '/help [command]',
    help: 'List commands, or show details for one.',
    run(ctx, args) {
      if (args[0]) {
        const c = COMMANDS.find((x) => x.name === args[0].replace(/^\//, ''));
        if (!c) return ctx.print({ text: `Unknown command: ${args[0]}`, kind: 'error' });
        ctx.print({ text: `${c.usage} — ${c.help}`, kind: 'info' });
        return;
      }
      ctx.print({ text: 'Commands (type /help <name> for details):', kind: 'info' });
      for (const c of COMMANDS) ctx.print({ text: `  ${c.usage}`, kind: 'info' });
    },
  },
  {
    name: 'tp',
    usage: '/tp <x> <y> <z>',
    help: 'Teleport. Coordinates may be relative with ~ (e.g. /tp ~ ~20 ~).',
    run(ctx, args) {
      if (args.length < 3) return ctx.print({ text: 'Usage: /tp <x> <y> <z>', kind: 'error' });
      const p = ctx.playerPos();
      const x = coord(args[0], p.x);
      const y = coord(args[1], p.y);
      const z = coord(args[2], p.z);
      if (x === null || y === null || z === null) {
        return ctx.print({ text: 'Coordinates must be numbers or ~offsets.', kind: 'error' });
      }
      ctx.teleport(x, y, z);
      ctx.print({ text: `Teleported to ${fmt(x)}, ${fmt(y)}, ${fmt(z)}`, kind: 'ok' });
    },
  },
  {
    name: 'locate',
    usage: '/locate <biome|structure> <name>',
    help: 'Find the nearest biome or structure and report its coordinates.',
    args: [() => ['biome', 'structure'], () => [...BIOME_NAMES, ...STRUCTURE_NAMES]],
    async run(ctx, args) {
      const kind = args[0] === 'biome' || args[0] === 'structure' ? args[0] : null;
      if (!kind || !args[1]) {
        return ctx.print({ text: 'Usage: /locate <biome|structure> <name>', kind: 'error' });
      }
      const table = kind === 'biome' ? BIOME_NAMES : STRUCTURE_NAMES;
      const target = resolveName(args[1], table);
      if (!target) {
        ctx.print({ text: `Unknown ${kind}: ${args[1]}`, kind: 'error' });
        ctx.print({ text: `Known: ${table.join(', ')}`, kind: 'info' });
        return;
      }
      ctx.print({ text: `Searching for ${target}...`, kind: 'info' });
      const hit = await ctx.locate(kind, target);
      if (!hit) {
        ctx.print({ text: `No ${target} found nearby. Try again further out.`, kind: 'error' });
        return;
      }
      const p = ctx.playerPos();
      const dist = Math.round(Math.hypot(hit.x - p.x, hit.z - p.z));
      ctx.print({ text: `Nearest ${target}: ${hit.x}, ${hit.z} (${dist} blocks away)`, kind: 'ok' });
    },
  },
  {
    name: 'time',
    usage: '/time set <preset|0-1>',
    help: `Set the time of day. Presets: ${Object.keys(TIME_PRESETS).join(', ')}.`,
    args: [() => ['set'], () => Object.keys(TIME_PRESETS)],
    run(ctx, args) {
      if (args[0] !== 'set' || !args[1]) {
        ctx.print({ text: `Time is ${fmt(ctx.getTime() * 24)}h. Usage: /time set <preset|0-1>`, kind: 'info' });
        return;
      }
      const preset = TIME_PRESETS[args[1].toLowerCase()];
      const t = preset !== undefined ? preset : Number(args[1]);
      if (!Number.isFinite(t) || t < 0 || t > 1) {
        return ctx.print({ text: 'Time must be a preset or a number 0..1.', kind: 'error' });
      }
      ctx.setTime(t);
      ctx.print({ text: `Time set to ${args[1]}`, kind: 'ok' });
    },
  },
  {
    name: 'gamemode',
    usage: '/gamemode <survival|creative>',
    help: 'Switch game mode.',
    args: [() => ['survival', 'creative']],
    run(ctx, args) {
      const m = args[0]?.toLowerCase();
      if (m !== 'survival' && m !== 'creative') {
        return ctx.print({ text: `Mode is ${ctx.getGameMode()}. Usage: /gamemode <survival|creative>`, kind: 'error' });
      }
      ctx.setGameMode(m);
      ctx.print({ text: `Game mode: ${m}`, kind: 'ok' });
    },
  },
  {
    name: 'give',
    usage: '/give <item> [count]',
    help: 'Put an item stack in your inventory.',
    args: [() => [...itemNameIndex().keys()]],
    run(ctx, args) {
      if (!args[0]) return ctx.print({ text: 'Usage: /give <item> [count]', kind: 'error' });
      const id = resolveItem(args[0]);
      if (id === null) return ctx.print({ text: `Unknown item: ${args[0]}`, kind: 'error' });
      const count = args[1] ? Math.max(1, Math.min(999, Math.floor(Number(args[1])) || 1)) : 1;
      const ok = ctx.give(id, count);
      ctx.print(
        ok
          ? { text: `Gave ${count} x ${itemDef(id).name}`, kind: 'ok' }
          : { text: 'Inventory full.', kind: 'error' },
      );
    },
  },
  {
    name: 'spawn',
    usage: '/spawn',
    help: 'Teleport to the world origin.',
    run(ctx) {
      ctx.teleport(0.5, 96, 0.5);
      ctx.print({ text: 'Teleported to spawn.', kind: 'ok' });
    },
  },
  {
    name: 'heal',
    usage: '/heal',
    help: 'Refill health and food.',
    run(ctx) {
      ctx.heal();
      ctx.print({ text: 'Healed.', kind: 'ok' });
    },
  },
  {
    name: 'kill',
    usage: '/kill',
    help: 'Kill yourself (respawn screen).',
    run(ctx) {
      ctx.kill();
    },
  },
  {
    name: 'clear',
    usage: '/clear',
    help: 'Empty your inventory.',
    run(ctx) {
      ctx.clearInventory();
      ctx.print({ text: 'Inventory cleared.', kind: 'ok' });
    },
  },
  {
    name: 'seed',
    usage: '/seed',
    help: 'Show the world seed.',
    run(ctx) {
      ctx.print({ text: `Seed: ${ctx.seed()}`, kind: 'ok' });
    },
  },
  {
    name: 'weather',
    usage: '/weather <clear|rain>',
    help: 'Set the weather.',
    args: [() => ['clear', 'rain']],
    run(ctx, args) {
      const w = args[0]?.toLowerCase();
      if (w !== 'clear' && w !== 'rain') {
        return ctx.print({ text: 'Usage: /weather <clear|rain>', kind: 'error' });
      }
      ctx.setWeather(w === 'rain');
      ctx.print({ text: `Weather: ${w}`, kind: 'ok' });
    },
  },
  {
    name: 'rd',
    usage: '/rd <2-16>',
    help: 'Set the render distance in chunks.',
    run(ctx, args) {
      const n = Math.floor(Number(args[0]));
      if (!Number.isFinite(n) || n < 2 || n > 16) {
        return ctx.print({ text: 'Usage: /rd <2-16>', kind: 'error' });
      }
      ctx.setRenderDistance(n);
      ctx.print({ text: `Render distance: ${n} chunks`, kind: 'ok' });
    },
  },
  {
    name: 'pos',
    usage: '/pos',
    help: 'Show your coordinates.',
    run(ctx) {
      const p = ctx.playerPos();
      ctx.print({ text: `You are at ${fmt(p.x)}, ${fmt(p.y)}, ${fmt(p.z)}`, kind: 'ok' });
    },
  },
];

/** Split a command line into tokens (quoted segments stay together). */
export function tokenize(line: string): string[] {
  const out: string[] = [];
  const re = /"([^"]*)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) out.push(m[1] ?? m[2]);
  return out;
}

/**
 * Execute a chat line. Lines not starting with "/" are plain messages.
 * Returns a promise so async commands (locate) can be awaited in tests.
 */
export async function runChatLine(ctx: CommandContext, raw: string): Promise<void> {
  const line = raw.trim();
  if (line === '') return;
  if (!line.startsWith('/')) {
    ctx.print({ text: line, kind: 'echo' });
    return;
  }
  const tokens = tokenize(line.slice(1));
  if (tokens.length === 0) return;
  const name = tokens[0].toLowerCase();
  const cmd = COMMANDS.find((c) => c.name === name);
  if (!cmd) {
    const near = COMMANDS.map((c) => c.name).filter((n) => n.startsWith(name));
    ctx.print({
      text: near.length
        ? `Unknown command "/${name}". Did you mean /${near[0]}?`
        : `Unknown command "/${name}". Type /help for a list.`,
      kind: 'error',
    });
    return;
  }
  try {
    await cmd.run(ctx, tokens.slice(1));
  } catch (e) {
    ctx.print({ text: `Command failed: ${(e as Error).message}`, kind: 'error' });
  }
}

/**
 * Completion candidates for the current input (used by Tab in the chat box).
 * Returns the full replacement line for each candidate.
 */
export function completions(line: string): string[] {
  if (!line.startsWith('/')) return [];
  const tokens = tokenize(line.slice(1));
  const trailingSpace = /\s$/.test(line);
  const idx = trailingSpace ? tokens.length : Math.max(0, tokens.length - 1);
  const partial = trailingSpace ? '' : (tokens[tokens.length - 1] ?? '').toLowerCase();

  if (idx === 0) {
    return COMMANDS.filter((c) => c.name.startsWith(partial)).map((c) => `/${c.name} `);
  }
  const cmd = COMMANDS.find((c) => c.name === tokens[0].toLowerCase());
  const provider = cmd?.args?.[idx - 1];
  if (!provider) return [];
  const head = '/' + tokens.slice(0, idx).join(' ');
  return provider()
    .filter((v) => v.toLowerCase().startsWith(partial))
    .slice(0, 40)
    .map((v) => `${head} ${v} `);
}

void B; // block table is loaded for its side effects (name registry)
