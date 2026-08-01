import { describe, it, expect } from 'vitest';
import {
  coord,
  completions,
  resolveItem,
  resolveName,
  runChatLine,
  tokenize,
  BIOME_NAMES,
  STRUCTURE_NAMES,
  ChatLine,
  CommandContext,
} from '../core/commands';
import { B } from '../core/blocks';
import { ITEM } from '../core/items';

/** Recording context so command effects can be asserted. */
function ctx(over: Partial<CommandContext> = {}): CommandContext & { lines: ChatLine[]; calls: string[] } {
  const lines: ChatLine[] = [];
  const calls: string[] = [];
  const base: CommandContext = {
    playerPos: () => ({ x: 10, y: 64, z: -20 }),
    teleport: (x, y, z) => calls.push(`tp:${x},${y},${z}`),
    give: (id, n) => {
      calls.push(`give:${id}x${n}`);
      return true;
    },
    setTime: (t) => calls.push(`time:${t}`),
    getTime: () => 0.25,
    setGameMode: (m) => calls.push(`mode:${m}`),
    getGameMode: () => 'survival',
    heal: () => calls.push('heal'),
    kill: () => calls.push('kill'),
    clearInventory: () => calls.push('clear'),
    seed: () => 12345,
    setRenderDistance: (n) => calls.push(`rd:${n}`),
    setWeather: (r) => calls.push(`weather:${r}`),
    locate: async () => ({ x: 128, z: -256 }),
    print: (l) => lines.push(l),
    ...over,
  };
  return Object.assign(base, { lines, calls });
}

describe('command tokenizer', () => {
  it('splits on whitespace and keeps quoted segments', () => {
    expect(tokenize('tp 1 2 3')).toEqual(['tp', '1', '2', '3']);
    expect(tokenize('give "oak planks" 4')).toEqual(['give', 'oak planks', '4']);
  });
});

describe('coordinate parsing', () => {
  it('handles absolute, relative and offset forms', () => {
    expect(coord('64', 10)).toBe(64);
    expect(coord('~', 10)).toBe(10);
    expect(coord('~5', 10)).toBe(15);
    expect(coord('~-4', 10)).toBe(6);
    expect(coord('abc', 10)).toBeNull();
  });
});

describe('name resolution', () => {
  it('resolves items by exact name, id and unique prefix', () => {
    expect(resolveItem('oak_planks')).toBe(B.OAK_PLANKS);
    expect(resolveItem('diamond')).toBe(ITEM.DIAMOND);
    expect(resolveItem(String(B.STONE))).toBe(B.STONE);
    expect(resolveItem('definitely_not_a_thing')).toBeNull();
  });

  it('resolves biome and structure names fuzzily', () => {
    expect(resolveName('mangrove_swamp', BIOME_NAMES)).toBe('mangrove_swamp');
    expect(resolveName('mushroom', BIOME_NAMES)).toBe('mushroom_fields');
    expect(resolveName('igl', STRUCTURE_NAMES)).toBe('igloo');
    expect(resolveName('nope', BIOME_NAMES)).toBeNull();
  });
});

describe('command execution', () => {
  it('teleports with absolute and relative coordinates', async () => {
    const c = ctx();
    await runChatLine(c, '/tp 1 2 3');
    expect(c.calls).toContain('tp:1,2,3');
    await runChatLine(c, '/tp ~ ~10 ~');
    expect(c.calls).toContain('tp:10,74,-20');
  });

  it('rejects malformed teleports without calling the engine', async () => {
    const c = ctx();
    await runChatLine(c, '/tp 1 2');
    expect(c.calls).toHaveLength(0);
    expect(c.lines.some((l) => l.kind === 'error')).toBe(true);
  });

  it('gives items with a default count of one', async () => {
    const c = ctx();
    await runChatLine(c, '/give oak_planks');
    expect(c.calls).toContain(`give:${B.OAK_PLANKS}x1`);
    await runChatLine(c, '/give diamond 12');
    expect(c.calls).toContain(`give:${ITEM.DIAMOND}x12`);
  });

  it('reports inventory-full as an error', async () => {
    const c = ctx({ give: () => false });
    await runChatLine(c, '/give stone 64');
    expect(c.lines.at(-1)?.kind).toBe('error');
  });

  it('sets time from presets and raw values', async () => {
    const c = ctx();
    await runChatLine(c, '/time set noon');
    expect(c.calls).toContain('time:0.25');
    await runChatLine(c, '/time set 0.5');
    expect(c.calls).toContain('time:0.5');
    await runChatLine(c, '/time set later');
    expect(c.lines.at(-1)?.kind).toBe('error');
  });

  it('locates a biome and reports the distance', async () => {
    const c = ctx();
    await runChatLine(c, '/locate biome mangrove_swamp');
    const last = c.lines.at(-1)!;
    expect(last.kind).toBe('ok');
    expect(last.text).toContain('128');
  });

  it('reports a failed locate without throwing', async () => {
    const c = ctx({ locate: async () => null });
    await runChatLine(c, '/locate structure village');
    expect(c.lines.at(-1)?.kind).toBe('error');
  });

  it('validates render distance bounds', async () => {
    const c = ctx();
    await runChatLine(c, '/rd 12');
    expect(c.calls).toContain('rd:12');
    await runChatLine(c, '/rd 99');
    expect(c.lines.at(-1)?.kind).toBe('error');
  });

  it('treats non-slash lines as chat messages', async () => {
    const c = ctx();
    await runChatLine(c, 'hello world');
    expect(c.calls).toHaveLength(0);
    expect(c.lines.at(-1)).toEqual({ text: 'hello world', kind: 'echo' });
  });

  it('suggests a near match for an unknown command', async () => {
    const c = ctx();
    await runChatLine(c, '/gamemod creative');
    expect(c.lines.at(-1)?.text).toContain('/gamemode');
  });

  it('surfaces a thrown command error instead of crashing', async () => {
    const c = ctx({
      teleport: () => {
        throw new Error('boom');
      },
    });
    await runChatLine(c, '/tp 0 0 0');
    expect(c.lines.at(-1)?.text).toContain('boom');
  });
});

describe('tab completion', () => {
  it('completes command names', () => {
    expect(completions('/loc')).toEqual(['/locate ']);
  });

  it('completes argument values per position', () => {
    expect(completions('/locate ')).toContain('/locate biome ');
    expect(completions('/locate biome man')).toContain('/locate biome mangrove_swamp ');
  });

  it('returns nothing for plain messages', () => {
    expect(completions('hello')).toEqual([]);
  });
});
