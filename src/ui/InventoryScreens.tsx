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

function Panel({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/55 pointer-events-auto"
      style={{
        touchAction: 'none',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) bridge().closeScreen();
      }}
    >
      <div
        className="bg-vc-panel/90 border border-vc-accent/40 p-4 rounded-xl shadow-2xl max-h-[92vh] overflow-y-auto"
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
  return (
    <div>
      {/* Main storage 9..35 */}
      <div className="grid grid-cols-9 gap-0.5">
        {Array.from({ length: 27 }, (_, i) => {
          const idx = i + 9;
          return <Slot key={idx} stack={slots[idx]} onClickSlot={click(idx)} />;
        })}
      </div>
      {/* Hotbar 0..8 */}
      <div className="grid grid-cols-9 gap-0.5 mt-2">
        {Array.from({ length: 9 }, (_, i) => (
          <Slot key={i} stack={slots[i]} onClickSlot={click(i)} />
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

const ARMOR_LABELS = ['⛑', '🛡', '👖', '🥾'];

function ArmorColumn(): React.ReactElement {
  const armor = useGameStore((s) => s.armor);
  return (
    <div className="flex flex-col gap-0.5 mr-3">
      {armor.map((piece, i) => (
        <div key={i} className="relative">
          <Slot stack={piece} onClickSlot={() => bridge().armorClick(i)} />
          {!piece && (
            <span className="absolute inset-0 flex items-center justify-center text-vc-text-dim/50 text-lg pointer-events-none">
              {ARMOR_LABELS[i]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function InventoryScreen(): React.ReactElement {
  const inventory = useGameStore((s) => s.inventory);
  const cursor = useGameStore((s) => s.cursor);
  return (
    <Panel title="Inventory">
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
