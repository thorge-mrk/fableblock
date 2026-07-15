/**
 * Full-window inventory UIs (Module 6 spec): player inventory with 2x2
 * crafting, the 3x3 crafting-table screen, chest / furnace / hopper container
 * screens with live progress bars. All drag-and-drop runs through the bridge
 * so the engine / logic worker stay authoritative.
 */
import React from 'react';
import { useGameStore } from '../state/store';
import { bridge } from '../state/bridge';
import { Slot, CursorStack } from './Slot';
import { Slots } from '../core/inventory';
import { itemDef, CREATIVE_ITEMS } from '../core/items';

function Panel({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
  return (
    <div
      className="absolute inset-0 flex items-start sm:items-center justify-center overflow-y-auto bg-black/55 pointer-events-auto py-5"
      style={{
        // pan-y lets a finger scroll the dialog on short phone screens; the
        // slots inside opt out (touch-action: none) so drags on them still work.
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        paddingTop: 'max(1.25rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
      }}
      // Close on a genuine tap of the backdrop — onClick never fires from a
      // scroll drag, so scrolling the dialog no longer dismisses it.
      onClick={(e) => {
        if (e.target === e.currentTarget) bridge().closeScreen();
      }}
    >
      <div
        className="bg-vc-panel/90 border border-vc-accent/40 p-4 rounded-xl shadow-2xl my-auto"
        style={{ backdropFilter: 'blur(6px)', boxShadow: '0 0 0 1px #00000066, 0 18px 50px #000000aa' }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-vc-accent font-bold tracking-wide uppercase text-sm">{title}</h2>
          <button
            className="text-vc-text-dim font-bold text-xl w-11 h-11 -my-2 -mr-2 flex items-center justify-center hover:text-vc-amber"
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              bridge().closeScreen();
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InventoryGrid({
  slots,
  area,
  container,
}: {
  slots: Slots;
  area: 0 | 1;
  container: boolean;
}): React.ReactElement {
  const click = (slot: number) => (button: 0 | 2, shift: boolean) => {
    if (container) bridge().containerClick(area, slot, button, shift);
    else bridge().invClick(slot, button, shift);
  };
  const collect = container ? undefined : () => bridge().collectAll();
  return (
    <div>
      {/* Main storage 9..35 */}
      <div className="grid grid-cols-9 gap-0.5">
        {Array.from({ length: 27 }, (_, i) => {
          const idx = i + 9;
          return <Slot key={idx} stack={slots[idx]} onClickSlot={click(idx)} route={`inv:${idx}`} onDouble={collect} />;
        })}
      </div>
      {/* Hotbar 0..8 */}
      <div className="grid grid-cols-9 gap-0.5 mt-2">
        {Array.from({ length: 9 }, (_, i) => (
          <Slot key={i} stack={slots[i]} onClickSlot={click(i)} route={`inv:${i}`} onDouble={collect} />
        ))}
      </div>
    </div>
  );
}

function CraftArea({ size }: { size: 2 | 3 }): React.ReactElement {
  const craftGrid = useGameStore((s) => s.craftGrid);
  const craftResult = useGameStore((s) => s.craftResult);
  return (
    <div className="flex items-center gap-3 mb-3 justify-center">
      <div className={`grid gap-0.5 ${size === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {Array.from({ length: size * size }, (_, i) => (
          <Slot
            key={i}
            stack={craftGrid[i]}
            onClickSlot={(b, s) => bridge().craftGridClick(i, b, s)}
            route={`craft:${i}`}
            onDouble={() => bridge().collectAll()}
          />
        ))}
      </div>
      <span className="text-2xl text-vc-accent font-bold">→</span>
      <Slot
        stack={craftResult}
        highlight={craftResult !== null}
        onClickSlot={(_b, s) => bridge().craftResultClick(s)}
        size={52}
      />
    </div>
  );
}

/**
 * Empty-armor-slot ghosts: hand-pixelled helmet / chestplate / leggings / boots
 * silhouettes (own designs, no emoji) drawn as faint steel SVG pixel maps so the
 * slot reads at a glance without relying on the OS emoji font.
 */
const ARMOR_ICON_MAPS: string[][] = [
  // Helmet
  [
    '..OOOOO..',
    '.OFFFFFO.',
    'OFFFFFFFO',
    'OFFFFFFFO',
    'OFO...OFO',
    'OFFFFFFFO',
    '.OFFFFFO.',
    '..OOOOO..',
  ],
  // Chestplate
  [
    'OO.....OO',
    'OFOOOOOFO',
    'OFFFFFFFO',
    'OFFFFFFFO',
    'OFFFFFFFO',
    '.OFFFFFO.',
    '.OFFFFFO.',
    '..OOOOO..',
  ],
  // Leggings
  [
    'OFFFFFFFO',
    'OFFFFFFFO',
    'OFFFFFFFO',
    'OFFO.OFFO',
    'OFO...OFO',
    'OFO...OFO',
    'OFO...OFO',
    'OOO...OOO',
  ],
  // Boots
  [
    '.........',
    'OOO..OOO.',
    'OFFO.OFFO',
    'OFFO.OFFO',
    'OFFO.OFFO',
    'OFFOOOFFO',
    'OFFFFFFFO',
    'OOOOOOOOO',
  ],
];

function ArmorGhost({ index }: { index: number }): React.ReactElement {
  const map = ARMOR_ICON_MAPS[index];
  const w = map[0].length;
  const h = map.length;
  const rects: React.ReactElement[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const ch = map[y][x];
      if (ch === '.') continue;
      rects.push(
        <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={ch === 'O' ? '#39465a' : '#586b84'} />,
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0 m-auto pointer-events-none"
      width="62%"
      height="62%"
      shapeRendering="crispEdges"
      style={{ opacity: 0.55 }}
    >
      {rects}
    </svg>
  );
}

function ArmorColumn(): React.ReactElement {
  const armor = useGameStore((s) => s.armor);
  return (
    <div className="flex flex-col gap-0.5 mr-3">
      {armor.map((piece, i) => (
        <div key={i} className="relative">
          <Slot stack={piece} onClickSlot={() => bridge().armorClick(i)} route={`armor:${i}`} />
          {!piece && <ArmorGhost index={i} />}
        </div>
      ))}
    </div>
  );
}

/** Creative catalogue: click any entry to put a full stack on the cursor. */
function CreativePalette(): React.ReactElement {
  return (
    <div
      className="max-h-44 overflow-y-auto mb-2 p-1 rounded-lg border border-vc-slot-edge bg-vc-bg/60"
      style={{ touchAction: 'pan-y', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
    >
      <div className="grid grid-cols-9 gap-0.5">
        {CREATIVE_ITEMS.map((id) => (
          <div
            key={id}
            className="relative w-[38px] h-[38px] rounded border border-vc-slot-edge bg-vc-slot hover:border-vc-accent cursor-pointer"
            style={{ touchAction: 'none' }}
            title={itemDef(id).name}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              bridge().creativeTake(id);
            }}
          >
            <img
              src={bridge().iconFor(id)}
              alt={itemDef(id).name}
              className="absolute inset-0 m-auto w-7 h-7 pointer-events-none"
              style={{ imageRendering: 'pixelated' }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InventoryScreen(): React.ReactElement {
  const inventory = useGameStore((s) => s.inventory);
  const cursor = useGameStore((s) => s.cursor);
  const gameMode = useGameStore((s) => s.gameMode);
  return (
    <Panel title={gameMode === 'creative' ? 'Inventory — Creative' : 'Inventory'}>
      {gameMode === 'creative' && <CreativePalette />}
      <div className="flex items-start justify-center">
        <ArmorColumn />
        <CraftArea size={2} />
      </div>
      <InventoryGrid slots={inventory} area={1} container={false} />
      <CursorStack stack={cursor} />
    </Panel>
  );
}

export function CraftingScreen(): React.ReactElement {
  const inventory = useGameStore((s) => s.inventory);
  const cursor = useGameStore((s) => s.cursor);
  return (
    <Panel title="Crafting Table">
      <CraftArea size={3} />
      <InventoryGrid slots={inventory} area={1} container={false} />
      <CursorStack stack={cursor} />
    </Panel>
  );
}

const ENCH_INFO = [
  { kind: 'eff' as const, name: 'Efficiency', desc: '+30% mining speed per level' },
  { kind: 'unb' as const, name: 'Unbreaking', desc: 'tool wears far slower' },
  { kind: 'sharp' as const, name: 'Sharpness', desc: '+2 damage per level' },
];

export function EnchantScreen(): React.ReactElement {
  const inventory = useGameStore((s) => s.inventory);
  const hotbarIndex = useGameStore((s) => s.hotbarIndex);
  const xpLevel = useGameStore((s) => s.xpLevel);
  const held = inventory[hotbarIndex];
  const ench = held?.ench ?? { eff: 0, unb: 0, sharp: 0 };
  return (
    <Panel title="Enchanting Table">
      <div className="text-white text-sm mb-3 text-center">
        {held ? (
          <>
            Held: <span className="text-vc-amber">{itemDef(held.id).name}</span> · Your level:{' '}
            <span className="text-vc-accent font-bold">{xpLevel}</span>
          </>
        ) : (
          'Hold a tool in your hotbar to enchant it.'
        )}
      </div>
      <div className="flex flex-col gap-2">
        {ENCH_INFO.map(({ kind, name, desc }) => {
          const lvl = ench[kind];
          const cost = 2 + lvl * 2;
          const maxed = lvl >= 3;
          return (
            <button
              key={kind}
              className={`w-72 text-left px-3 py-2 rounded-lg border ${
                maxed
                  ? 'border-vc-slot-edge bg-vc-slot/50 text-vc-text-dim'
                  : 'border-vc-accent/50 bg-vc-slot hover:bg-vc-accent-soft text-white'
              }`}
              onClick={() => bridge().enchantHeld(kind)}
            >
              <div className="flex justify-between font-bold">
                <span>
                  {name} {lvl > 0 && ['I', 'II', 'III'][lvl - 1]}
                </span>
                <span className="text-vc-accent">{maxed ? 'MAX' : `${cost} lvl`}</span>
              </div>
              <div className="text-xs text-vc-text-dim">{desc}</div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

export function ContainerScreen(): React.ReactElement | null {
  const container = useGameStore((s) => s.container);
  const inventory = useGameStore((s) => s.inventory);
  const cursor = useGameStore((s) => s.cursor);
  if (!container) return null;

  let title = 'Chest';
  if (container.kind === 'furnace') title = 'Furnace';
  if (container.kind === 'hopper') title = 'Hopper';

  return (
    <Panel title={title}>
      {container.kind === 'chest' && (
        <div className="grid grid-cols-9 gap-0.5 mb-3">
          {container.slots.map((s, i) => (
            <Slot key={i} stack={s} onClickSlot={(b, sh) => bridge().containerClick(0, i, b, sh)} />
          ))}
        </div>
      )}
      {container.kind === 'hopper' && (
        <div className="flex justify-center gap-0.5 mb-3">
          {container.slots.map((s, i) => (
            <Slot key={i} stack={s} onClickSlot={(b, sh) => bridge().containerClick(0, i, b, sh)} />
          ))}
        </div>
      )}
      {container.kind === 'furnace' && (
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="flex flex-col items-center gap-1">
            <Slot stack={container.slots[0]} onClickSlot={(b, sh) => bridge().containerClick(0, 0, b, sh)} />
            {/* Fuel flame bar */}
            <div className="w-8 h-8 relative flex items-end justify-center">
              <div
                className="w-6 bg-gradient-to-t from-orange-600 to-yellow-300"
                style={{ height: `${Math.round(container.fuel * 100)}%` }}
              />
              <span className="absolute inset-0 text-center text-lg pointer-events-none">🔥</span>
            </div>
            <Slot stack={container.slots[1]} onClickSlot={(b, sh) => bridge().containerClick(0, 1, b, sh)} />
          </div>
          {/* Cook progress arrow */}
          <div className="w-20 h-5 bg-black/30 relative rounded">
            <div
              className="h-full bg-white/80 rounded"
              style={{ width: `${Math.round(container.cook * 100)}%` }}
            />
            <span className="absolute inset-0 text-center text-vc-amber text-sm leading-5 pointer-events-none">
              ▶▶
            </span>
          </div>
          <Slot
            stack={container.slots[2]}
            size={56}
            onClickSlot={(b, sh) => bridge().containerClick(0, 2, b, sh)}
          />
        </div>
      )}
      <InventoryGrid slots={inventory} area={1} container={true} />
      <CursorStack stack={cursor} />
    </Panel>
  );
}
