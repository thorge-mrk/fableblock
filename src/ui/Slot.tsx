/**
 * Single inventory slot: icon, count badge, durability bar, click routing
 * (left / right / shift+click) for the drag-and-drop state machine.
 */
import React from 'react';
import { ItemStack, itemDef } from '../core/items';
import { bridge } from '../state/bridge';

interface SlotProps {
  stack: ItemStack | null;
  onClickSlot: (button: 0 | 2, shift: boolean) => void;
  size?: number;
  highlight?: boolean;
}

export function Slot({ stack, onClickSlot, size = 44, highlight = false }: SlotProps): React.ReactElement {
  // Pointer events fire identically for mouse, touch and pen, so a single
  // handler makes inventory/crafting work on PC and mobile alike.
  const handlePointer = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Touch/pen report button -1 on contact; treat as left click.
    const button = e.button === 2 ? 2 : 0;
    onClickSlot(button, e.shiftKey);
  };
  const def = stack ? itemDef(stack.id) : null;
  const durFrac =
    stack && stack.dur !== undefined && def?.tool
      ? stack.dur / def.tool.durability
      : null;
  return (
    <div
      className={`relative border-2 select-none ${
        highlight ? 'bg-white/40 border-white/70' : 'bg-black/25 border-t-mc-slot-dark border-l-mc-slot-dark border-b-white/60 border-r-white/60'
      }`}
      style={{ width: size, height: size, touchAction: 'none' }}
      onPointerDown={handlePointer}
      onContextMenu={(e) => e.preventDefault()}
    >
      {stack && def && (
        <>
          <img
            src={bridge().iconFor(stack.id)}
            alt={def.name}
            title={def.name}
            className="absolute inset-0 m-auto pointer-events-none"
            style={{ width: size - 10, height: size - 10, imageRendering: 'pixelated' }}
            draggable={false}
          />
          {stack.count > 1 && (
            <span
              className="absolute bottom-0 right-0.5 text-white font-bold pointer-events-none"
              style={{ fontSize: size * 0.38, textShadow: '1px 1px 0 #3f3f3f' }}
            >
              {stack.count}
            </span>
          )}
          {durFrac !== null && durFrac < 1 && (
            <div className="absolute bottom-0.5 left-1 right-1 h-1 bg-black/70 pointer-events-none">
              <div
                className="h-full"
                style={{
                  width: `${Math.max(3, durFrac * 100)}%`,
                  background: durFrac > 0.5 ? '#3ddb3d' : durFrac > 0.2 ? '#dbc63d' : '#db3d3d',
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Item stack glued to the mouse cursor while dragging. */
export function CursorStack({ stack }: { stack: ItemStack | null }): React.ReactElement | null {
  const [pos, setPos] = React.useState<[number, number]>([0, 0]);
  React.useEffect(() => {
    const onMove = (e: MouseEvent) => setPos([e.clientX, e.clientY]);
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  if (!stack) return null;
  return (
    <div
      className="fixed pointer-events-none z-[100]"
      style={{ left: pos[0] - 18, top: pos[1] - 18 }}
    >
      <img
        src={bridge().iconFor(stack.id)}
        alt=""
        style={{ width: 36, height: 36, imageRendering: 'pixelated' }}
        draggable={false}
      />
      {stack.count > 1 && (
        <span
          className="absolute bottom-0 right-0 text-white font-bold"
          style={{ fontSize: 15, textShadow: '1px 1px 0 #3f3f3f' }}
        >
          {stack.count}
        </span>
      )}
    </div>
  );
}
