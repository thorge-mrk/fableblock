/**
 * Single inventory slot: icon, count badge, durability bar, click routing
 * (left / right / shift+click) for the drag-and-drop state machine.
 *
 * Drag manager: every routed slot registers its click action in a module
 * registry and tags its DOM node with `data-dnd`. A window-level pointerup
 * (in CursorStack) resolves the slot under the release point, so users can
 * press on one slot and RELEASE over another to move a stack in one gesture
 * (mouse and touch). Tap-tap and shift-click keep working unchanged.
 * Touch: tap = click, long-press (400ms) = quick-move. Double-click while
 * holding a stack collects all matching items onto the cursor.
 */
import React from 'react';
import { createPortal } from 'react-dom';
import { ItemStack, itemDef } from '../core/items';
import { bridge } from '../state/bridge';
import { gameStore } from '../state/store';

interface SlotProps {
  stack: ItemStack | null;
  onClickSlot: (button: 0 | 2, shift: boolean) => void;
  size?: number;
  highlight?: boolean;
  /** Unique drop-target id (e.g. "inv:5"); undefined = not a drop target. */
  route?: string;
  /** Double-click / double-tap action (collect-all). */
  onDouble?: () => void;
}

const LONG_PRESS_MS = 400;
const DRAG_MIN_PX = 12;
const DOUBLE_TAP_MS = 300;

/** Route id -> live click action of the mounted slot. */
const slotActions = new Map<string, (button: 0 | 2, shift: boolean) => void>();

export function Slot({ stack, onClickSlot, size = 44, highlight = false, route, onDouble }: SlotProps): React.ReactElement {
  const longPress = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const longFired = React.useRef(false);
  const lastTap = React.useRef(0);
  const [flash, setFlash] = React.useState(false);

  // Keep the registry pointing at this render's closure.
  React.useEffect(() => {
    if (!route) return;
    slotActions.set(route, onClickSlot);
    return () => {
      slotActions.delete(route);
    };
  });

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
    // Second click of a double-click gathers matching stacks onto the cursor.
    if (e.button === 0 && e.detail >= 2 && onDouble) {
      onDouble();
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
      if (!longFired.current && e.type === 'pointerup') {
        const now = performance.now();
        if (onDouble && now - lastTap.current < DOUBLE_TAP_MS) onDouble();
        else onClickSlot(0, false);
        lastTap.current = now;
      }
    }
  };

  const def = stack ? itemDef(stack.id) : null;
  const durFrac =
    stack && stack.dur !== undefined && def?.tool
      ? stack.dur / def.tool.durability
      : null;
  return (
    <div
      data-dnd={route}
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

/**
 * Item stack glued to the pointer (mouse or finger) while dragging — and the
 * window-level half of the drag manager: releasing the pointer over another
 * routed slot drops the cursor stack there.
 */
// Last known pointer position (module-level so a freshly mounted cursor
// stack seats itself instantly instead of flashing at 0,0).
let lastPX = 0;
let lastPY = 0;

export function CursorStack({ stack }: { stack: ItemStack | null }): React.ReactElement | null {
  const boxRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let downRoute: string | null = null;
    let downX = 0;
    let downY = 0;
    const routeAt = (x: number, y: number): string | null => {
      const el = document.elementFromPoint(x, y);
      return (el?.closest('[data-dnd]') as HTMLElement | null)?.dataset.dnd ?? null;
    };
    // The dragged icon is moved by writing the transform directly — zero
    // React re-renders per pointermove, so it glides at full frame rate.
    const seat = (x: number, y: number) => {
      lastPX = x;
      lastPY = y;
      const el = boxRef.current;
      if (el) el.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0)`;
    };
    const onMove = (e: PointerEvent) => seat(e.clientX, e.clientY);
    const onDown = (e: PointerEvent) => {
      seat(e.clientX, e.clientY);
      downRoute = routeAt(e.clientX, e.clientY);
      downX = e.clientX;
      downY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      // The slot's own handlers write the store synchronously, so by the
      // time this bubbles here the picked-up stack is already on the cursor.
      if (!gameStore.get().cursor) return;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) < DRAG_MIN_PX) return;
      const target = routeAt(e.clientX, e.clientY);
      if (target && target !== downRoute) slotActions.get(target)?.(0, false);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown, true);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  // Flag the document while an item rides the cursor so CSS can light up
  // potential drop targets under the pointer.
  const dragging = stack !== null;
  React.useEffect(() => {
    if (dragging) document.body.setAttribute('data-dragging', '1');
    else document.body.removeAttribute('data-dragging');
    return () => document.body.removeAttribute('data-dragging');
  }, [dragging]);

  if (!stack) return null;
  // Portal to <body>: the inventory panel uses backdrop-filter, which makes a
  // position:fixed child anchor to the PANEL instead of the viewport — that was
  // the ~constant offset that pushed the dragged icon off the pointer. Rendered
  // on body, `fixed` resolves to the viewport so the icon sits under the finger.
  return createPortal(
    <div
      ref={boxRef}
      className="fixed left-0 top-0 pointer-events-none z-[100]"
      style={{ transform: `translate3d(${lastPX - 18}px, ${lastPY - 18}px, 0)`, willChange: 'transform' }}
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
    </div>,
    document.body,
  );
}
