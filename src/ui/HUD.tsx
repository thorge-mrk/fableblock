/**
 * In-game HUD: crosshair, hotbar, hearts, break-progress ring, toast,
 * underwater/damage vignettes.
 */
import React from 'react';
import { useGameStore } from '../state/store';
import { bridge } from '../state/bridge';
import { itemDef } from '../core/items';
import { PLAYER_MAX_HP, PLAYER_MAX_FOOD } from '../core/config';

/**
 * FableBlock status icons: hand-pixelled hearts, drumsticks and a shield —
 * own 8x8 designs (not Mojang sprites) rendered as crisp SVG pixel maps.
 * Legend: O outline, F fill, H highlight, D dark shade, B bone/extra.
 */
const HEART_MAP = [
  '.OO.OO.',
  'OHFOFDO',
  'OHFFFDO',
  'OFFFFDO',
  '.OFFDO.',
  '..OFO..',
  '...O...',
];
const DRUMSTICK_MAP = [
  '.OOO....',
  'OHFFO...',
  'OFFFFO..',
  'OFFFDO..',
  '.OFDDO..',
  '..OODBO.',
  '....OBBO',
  '.....OO.',
];
const SHIELD_MAP = [
  'OOOOOOO',
  'OHFFFDO',
  'OHFAFDO',
  'OFAFADO',
  '.OFAFO.',
  '.OFFDO.',
  '..OFO..',
  '...O...',
];

type PipPalette = { F: string; H: string; D: string; B?: string; A?: string };

const HEART_PAL: PipPalette = { F: '#e8404e', H: '#ff97a0', D: '#a5202c' };
const FOOD_PAL: PipPalette = { F: '#c2712e', H: '#e8a860', D: '#8a4a20', B: '#f2ead6' };
const ARMOR_PAL: PipPalette = { F: '#aebfd2', H: '#e6f0fa', D: '#7c8ea4', A: '#2dd4bf' };

const OUTLINE = '#120a0c';
const EMPTY_FILL = '#212e3d';
const EMPTY_OUTLINE = '#0c1218';

function pipRects(map: string[], pal: PipPalette | null, key: string): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const ch = map[y][x];
      if (ch === '.') continue;
      const color = pal
        ? ch === 'O' ? OUTLINE : (pal[ch as keyof PipPalette] ?? pal.F)
        : ch === 'O' ? EMPTY_OUTLINE : EMPTY_FILL;
      out.push(<rect key={`${key}${x},${y}`} x={x} y={y} width="1" height="1" fill={color} />);
    }
  }
  return out;
}

/** One status pip: full / half (left side lit) / empty socket. */
function Pip({ map, pal, fill }: { map: string[]; pal: PipPalette; fill: 'full' | 'half' | 'empty' }): React.ReactElement {
  const w = map[0].length;
  const h = map.length;
  const clipId = React.useId();
  return (
    <svg
      width={w * 2.2}
      height={h * 2.2}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{ filter: 'drop-shadow(1px 1px 0 #000000a0)' }}
    >
      {fill === 'full' ? (
        pipRects(map, pal, 'f')
      ) : (
        <>
          {pipRects(map, null, 'e')}
          {fill === 'half' && (
            <>
              <clipPath id={clipId}>
                <rect x="0" y="0" width={Math.ceil(w / 2)} height={h} />
              </clipPath>
              <g clipPath={`url(#${clipId})`}>{pipRects(map, pal, 'h')}</g>
            </>
          )}
        </>
      )}
    </svg>
  );
}

function pipFill(value: number, i: number): 'full' | 'half' | 'empty' {
  const v = value - i * 2;
  return v >= 2 ? 'full' : v >= 1 ? 'half' : 'empty';
}

export function HUD(): React.ReactElement {
  const inventory = useGameStore((s) => s.inventory);
  const hotbarIndex = useGameStore((s) => s.hotbarIndex);
  const health = useGameStore((s) => s.health);
  const food = useGameStore((s) => s.food);
  const armor = useGameStore((s) => s.armor);
  const armorPts = armor.reduce((acc, p) => acc + (p ? (itemDef(p.id).armor?.points ?? 0) : 0), 0);
  const xpLevel = useGameStore((s) => s.xpLevel);
  const xpPoints = useGameStore((s) => s.xpPoints);
  const xpFrac = Math.min(1, xpPoints / (12 + xpLevel * 6));
  const breakProgress = useGameStore((s) => s.breakProgress);
  const toast = useGameStore((s) => s.toast);
  const screen = useGameStore((s) => s.screen);
  const sleeping = useGameStore((s) => s.sleeping);
  const portalFade = useGameStore((s) => s.portalFade);

  const heldName = inventory[hotbarIndex] ? itemDef(inventory[hotbarIndex]!.id).name : null;

  return (
    <div className="absolute inset-0 pointer-events-none font-game">
      {/* Crosshair */}
      {screen === 'none' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-5 h-5 opacity-80">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white mix-blend-difference" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-white mix-blend-difference" />
          </div>
          {breakProgress > 0 && (
            <svg className="absolute -left-4 -top-4 w-13 h-13" width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="20" fill="none" stroke="#00000060" strokeWidth="5" />
              <circle
                cx="26" cy="26" r="20" fill="none" stroke="#ffffffc0" strokeWidth="5"
                strokeDasharray={`${breakProgress * 125.6} 125.6`}
                transform="rotate(-90 26 26)"
              />
            </svg>
          )}
        </div>
      )}

      {/* Status rows: hearts left, drumsticks right, armor shields above */}
      <div className="absolute bottom-[92px] left-1/2 -translate-x-1/2 flex flex-col items-start gap-0.5">
        {armorPts > 0 && (
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }, (_, i) => (
              <Pip key={i} map={SHIELD_MAP} pal={ARMOR_PAL} fill={pipFill(armorPts, i)} />
            ))}
          </div>
        )}
        <div className="flex gap-5 items-end">
          <div className="flex gap-0.5">
            {Array.from({ length: PLAYER_MAX_HP / 2 }, (_, i) => (
              <Pip key={i} map={HEART_MAP} pal={HEART_PAL} fill={pipFill(health, i)} />
            ))}
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: PLAYER_MAX_FOOD / 2 }, (_, i) => (
              <Pip key={i} map={DRUMSTICK_MAP} pal={FOOD_PAL} fill={pipFill(food, i)} />
            ))}
          </div>
        </div>
      </div>

      {/* Held item name */}
      {heldName && screen === 'none' && (
        <div
          className="absolute bottom-[120px] left-1/2 -translate-x-1/2 text-white text-sm px-2 py-0.5 bg-black/40 rounded"
          style={{ textShadow: '1px 1px 0 #000' }}
        >
          {heldName}
        </div>
      )}

      {/* XP bar with a level badge at its right end */}
      <div className="absolute bottom-[68px] left-1/2 -translate-x-1/2 w-[420px] max-w-[80vw]">
        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-vc-slot-edge/60">
          <div className="h-full bg-vc-accent" style={{ width: `${Math.round(xpFrac * 100)}%` }} />
        </div>
        {xpLevel > 0 && (
          <span
            className="absolute -right-7 -top-2 text-vc-accent font-bold text-sm"
            style={{ textShadow: '1px 1px 0 #000' }}
          >
            {xpLevel}
          </span>
        )}
      </div>

      {/* Hotbar */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex pointer-events-auto bg-vc-bg/70 border border-vc-slot-edge p-1 rounded-lg"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {inventory.slice(0, 9).map((stack, i) => (
          <div
            key={i}
            className={`relative w-12 h-12 m-0.5 rounded-md border ${
              i === hotbarIndex
                ? 'border-vc-accent bg-vc-accent/20 ring-1 ring-vc-accent/60'
                : 'border-vc-slot-edge bg-vc-slot/80'
            }`}
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => {
              e.preventDefault();
              bridge().selectHotbar(i);
            }}
          >
            {stack && (
              <>
                <img
                  src={bridge().iconFor(stack.id)}
                  alt=""
                  className="absolute inset-0 m-auto w-9 h-9 pointer-events-none"
                  style={{ imageRendering: 'pixelated' }}
                  draggable={false}
                />
                {stack.count > 1 && (
                  <span
                    className="absolute bottom-0 right-0.5 text-white text-sm font-bold pointer-events-none"
                    style={{ textShadow: '1px 1px 0 #3f3f3f' }}
                  >
                    {stack.count}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 text-white bg-black/60 px-4 py-2 rounded text-sm"
          style={{ textShadow: '1px 1px 0 #000' }}
        >
          {toast}
        </div>
      )}

      {/* Sleep fade-to-black */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-700 flex items-center justify-center"
        style={{ opacity: sleeping ? 1 : 0, pointerEvents: 'none' }}
      >
        {sleeping && <span className="text-white/80 text-lg">Sleeping…</span>}
      </div>

      {/* Portal charge overlay */}
      {portalFade > 0.01 && (
        <div
          className="absolute inset-0"
          style={{
            opacity: Math.min(1, portalFade),
            background: 'radial-gradient(circle, rgba(120,40,190,0.55) 0%, rgba(60,10,110,0.92) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Low-health vignette */}
      {health <= 6 && health > 0 && (
        <div
          className="absolute inset-0 animate-pulse-fast"
          style={{ boxShadow: 'inset 0 0 120px 40px rgba(200,0,0,0.45)' }}
        />
      )}
    </div>
  );
}

export function DebugOverlay(): React.ReactElement | null {
  const debug = useGameStore((s) => s.debug);
  const show = useGameStore((s) => s.settings.showDebug);
  const time = useGameStore((s) => s.timeOfDay);
  if (!show) return null;
  return (
    <div className="absolute top-2 left-2 text-xs text-white font-mono bg-black/50 p-2 rounded pointer-events-none whitespace-pre leading-relaxed">
      {`FPS ${debug.fps}  tick ${debug.tickMs}ms
XYZ ${debug.x.toFixed(1)} / ${debug.y.toFixed(1)} / ${debug.z.toFixed(1)}
chunks ${debug.chunks} (queued ${debug.pending})
entities ${debug.entities}
time ${(time * 24).toFixed(1)}h`}
    </div>
  );
}
