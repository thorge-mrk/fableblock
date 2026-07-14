/**
 * Single inventory slot: icon, count badge, durability bar, click routing
 * (left / right / shift+click) for the drag-and-drop state machine.
 * Touch: tap = click, long-press (400ms) = quick-move (shift-click).
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

const LONG_PRESS_MS = 400;

export function Slot({ stack, onClickSlot, size = 44, highlight = false }: SlotProps): React.ReactElement {
  const longPress = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const longFired = React.useRef(false);
  const [flash, setFlash] = React.useState(false);

  React.useEffect(
    () => () => {
      if (longPress.current) clearTimeout(longPress.current);
    },
    [],
  );

  // Pointer events fire identically for mouse, touch and pen. Mouse clicks
  // act immediately on pointerdown; touch defers to distinguish tap from
  // long-press (there is no shift key on a phone).
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.pointerType === 'touch') {
      longFired.current = false;
      longPress.current = setTimeout(() => {
        longPress.current = null;
        longFired.current = true;
        setFlash(true);
        setTimeout(() => setFlash(false), 180);
        onClickSlot(0, true); // quick-move
      }, LONG_PRESS_MS);
      return;
    }
    const button = e.button === 2 ? 2 : 0;
    onClickSlot(button, e.shiftKey);
  };

  const finishTouch = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    if (longPress.current) {
      clearTimeout(longPress.current);
      longPress.current = null;
      if (!longFired.current && e.type === 'pointerup') onClickSlot(0, false);
    }
  };

  const def = stack ? itemDef(stack.id) : null;
  const durFrac =
    stack && stack.dur !== undefined && def?.tool
      ? stack.dur / def.tool.durability
      : null;
  return (
    <div
      className={`relative rounded-md border select-none ${
        flash
          ? 'bg-vc-accent/60 border-vc-accent'
          : highlight
            ? 'bg-vc-accent/25 border-vc-accent ring-1 ring-vc-accent/60'
            : 'bg-vc-slot border-vc-slot-edge hover:border-vc-accent/50'
      }`}
      style={{ width: size, height: size, touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerUp={finishTouch}
      onPointerLeave={finishTouch}
      onPointerCancel={finishTouch}
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

/** Item stack glued to the pointer (mouse or finger) while dragging. */
export function CursorStack({ stack }: { stack: ItemStack | null }): React.ReactElement | null {
  const [pos, setPos] = React.useState<[number, number]>([0, 0]);
  React.useEffect(() => {
    // pointer events cover mouse AND touch; capture-phase pointerdown also
    // seats the stack at the tap position (touch has no hover moves).
    const onPointer = (e: PointerEvent) => setPos([e.clientX, e.clientY]);
    window.addEventListener('pointermove', onPointer);
    window.addEventListener('pointerdown', onPointer, true);
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer, true);
    };
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
