/**
 * In-game HUD: crosshair, hotbar, hearts, break-progress ring, toast,
 * underwater/damage vignettes.
 */
import React from 'react';
import { useGameStore } from '../state/store';
import { bridge } from '../state/bridge';
import { itemDef } from '../core/items';
import { PLAYER_MAX_HP } from '../core/config';

/** Pixel-art heart (Minecraft-style) as inline SVG: full / half / empty. */
function Heart({ fill }: { fill: 'full' | 'half' | 'empty' }): React.ReactElement {
  // 9x9 pixel heart shape drawn as SVG rects for a crisp blocky look.
  const rows = [
    '011011110',
    '111111111',
    '111111111',
    '111111111',
    '011111110',
    '001111100',
    '000111000',
    '000010000',
  ];
  const px = 2;
  const red = '#e2222a';
  const redHi = '#ff5560';
  const empty = '#5a5a5a';
  const cells: React.ReactElement[] = [];
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < 9; x++) {
      if (rows[y][x] !== '1') continue;
      let color: string;
      if (fill === 'empty') color = empty;
      else if (fill === 'half') color = x < 4.5 ? (y < 2 && x > 0 ? redHi : red) : empty;
      else color = y < 2 && (x === 1 || x === 5) ? redHi : red;
      cells.push(<rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill={color} />);
    }
  }
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" style={{ filter: 'drop-shadow(1px 1px 0 #00000080)' }}>
      {cells}
    </svg>
  );
}

export function HUD(): React.ReactElement {
  const inventory = useGameStore((s) => s.inventory);
  const hotbarIndex = useGameStore((s) => s.hotbarIndex);
  const health = useGameStore((s) => s.health);
  const breakProgress = useGameStore((s) => s.breakProgress);
  const toast = useGameStore((s) => s.toast);
  const screen = useGameStore((s) => s.screen);

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

      {/* Hearts — real pixel-art graphic, updates reactively with health */}
      <div className="absolute bottom-[76px] left-1/2 -translate-x-1/2 flex gap-0.5">
        {Array.from({ length: PLAYER_MAX_HP / 2 }, (_, i) => {
          const v = health - i * 2;
          const fill = v >= 2 ? 'full' : v >= 1 ? 'half' : 'empty';
          return <Heart key={i} fill={fill} />;
        })}
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

      {/* Hotbar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex pointer-events-auto bg-black/40 p-1 rounded">
        {inventory.slice(0, 9).map((stack, i) => (
          <div
            key={i}
            className={`relative w-12 h-12 m-0.5 border-2 ${
              i === hotbarIndex ? 'border-white bg-white/20' : 'border-gray-600 bg-black/30'
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
