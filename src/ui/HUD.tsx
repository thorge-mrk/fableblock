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
 * FableBlock status pip: a faceted diamond (own visual identity, not the
 * Minecraft heart/drumstick). full / half (left side lit) / empty.
 */
function Pip({ fill, lit, litHi }: { fill: 'full' | 'half' | 'empty'; lit: string; litHi: string }): React.ReactElement {
  const dim = '#2c3b4e';
  const showL = fill !== 'empty';
  const showR = fill === 'full';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ filter: 'drop-shadow(1px 1px 0 #000000a0)' }}>
      {/* left facet */}
      <polygon points="8,1 8,15 1,8" fill={showL ? lit : dim} />
      {/* right facet */}
      <polygon points="8,1 15,8 8,15" fill={showR ? lit : dim} />
      {/* top gleam */}
      {showL && <polygon points="8,1 8,6 4.5,4.5" fill={litHi} />}
      <polygon points="8,1 15,8 8,15 1,8" fill="none" stroke="#0c1218" strokeWidth="1" />
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

      {/* Status pips: HP (red) left, hunger (amber) right, armor (steel) above */}
      <div className="absolute bottom-[92px] left-1/2 -translate-x-1/2 flex flex-col items-start gap-0.5">
        {armorPts > 0 && (
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }, (_, i) => (
              <Pip key={i} fill={pipFill(armorPts, i)} lit="#9fb6cc" litHi="#e2eefb" />
            ))}
          </div>
        )}
        <div className="flex gap-5">
          <div className="flex gap-0.5">
            {Array.from({ length: PLAYER_MAX_HP / 2 }, (_, i) => (
              <Pip key={i} fill={pipFill(health, i)} lit="#ef4655" litHi="#ff8091" />
            ))}
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: PLAYER_MAX_FOOD / 2 }, (_, i) => (
              <Pip key={i} fill={pipFill(food, i)} lit="#e8963c" litHi="#ffc46e" />
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
