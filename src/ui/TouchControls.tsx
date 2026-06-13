/**
 * Mobile touch control canvas overlay (Module 7 spec): virtual joystick in
 * the bottom-left quadrant, action buttons bottom-right, and free-look drag
 * on the remaining screen space. Multi-touch aware via touch identifiers.
 */
import React from 'react';
import { bridge } from '../state/bridge';
import { useGameStore } from '../state/store';

const JOY_RADIUS = 64;

export function TouchControls(): React.ReactElement {
  const sneak = React.useRef(false);
  const [sneakOn, setSneakOn] = React.useState(false);
  const joyTouch = React.useRef<number | null>(null);
  const lookTouch = React.useRef<number | null>(null);
  const joyOrigin = React.useRef<[number, number]>([0, 0]);
  const lookLast = React.useRef<[number, number]>([0, 0]);
  const [joyPos, setJoyPos] = React.useState<[number, number] | null>(null);
  const [knob, setKnob] = React.useState<[number, number]>([0, 0]);

  const onTouchStart = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const isLeftBottom = t.clientX < window.innerWidth * 0.45 && t.clientY > window.innerHeight * 0.4;
      if (isLeftBottom && joyTouch.current === null) {
        joyTouch.current = t.identifier;
        joyOrigin.current = [t.clientX, t.clientY];
        setJoyPos([t.clientX, t.clientY]);
        setKnob([0, 0]);
      } else if (lookTouch.current === null) {
        lookTouch.current = t.identifier;
        lookLast.current = [t.clientX, t.clientY];
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === joyTouch.current) {
        let dx = t.clientX - joyOrigin.current[0];
        let dy = t.clientY - joyOrigin.current[1];
        const len = Math.hypot(dx, dy);
        if (len > JOY_RADIUS) {
          dx = (dx / len) * JOY_RADIUS;
          dy = (dy / len) * JOY_RADIUS;
        }
        setKnob([dx, dy]);
        bridge().touchMove(dx / JOY_RADIUS, -dy / JOY_RADIUS);
      } else if (t.identifier === lookTouch.current) {
        const dx = t.clientX - lookLast.current[0];
        const dy = t.clientY - lookLast.current[1];
        lookLast.current = [t.clientX, t.clientY];
        bridge().touchLook(dx * 2.4, dy * 2.4);
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === joyTouch.current) {
        joyTouch.current = null;
        setJoyPos(null);
        bridge().touchMove(0, 0);
      } else if (t.identifier === lookTouch.current) {
        lookTouch.current = null;
      }
    }
  };

  const holdButton = (btn: 'jump' | 'attack' | 'use') => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.stopPropagation();
      bridge().touchButton(btn, true);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.stopPropagation();
      bridge().touchButton(btn, false);
    },
  });

  const BTN_CLS =
    'absolute w-16 h-16 rounded-full bg-white/25 border-2 border-white/50 text-white text-xl ' +
    'flex items-center justify-center select-none active:bg-white/50 pointer-events-auto';

  return (
    <div
      className="absolute inset-0 pointer-events-auto touch-none select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/* Joystick */}
      {joyPos && (
        <div
          className="absolute rounded-full border-2 border-white/40 bg-white/10 pointer-events-none"
          style={{
            left: joyPos[0] - JOY_RADIUS,
            top: joyPos[1] - JOY_RADIUS,
            width: JOY_RADIUS * 2,
            height: JOY_RADIUS * 2,
          }}
        >
          <div
            className="absolute w-12 h-12 rounded-full bg-white/50"
            style={{ left: JOY_RADIUS - 24 + knob[0], top: JOY_RADIUS - 24 + knob[1] }}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className={BTN_CLS} style={{ right: 24, bottom: 120 }} {...holdButton('jump')}>
        ⬆
      </div>
      <div
        className={`${BTN_CLS} ${sneakOn ? 'bg-green-500/60' : ''}`}
        style={{ right: 104, bottom: 70 }}
        onTouchStart={(e) => {
          e.stopPropagation();
          sneak.current = !sneak.current;
          setSneakOn(sneak.current);
          bridge().touchButton('sneak', sneak.current);
        }}
      >
        🐢
      </div>
      <div className={BTN_CLS} style={{ right: 24, bottom: 220 }} {...holdButton('attack')}>
        ⛏
      </div>
      <div className={BTN_CLS} style={{ right: 104, bottom: 170 }} {...holdButton('use')}>
        🧱
      </div>

      {/* Top corner shortcuts */}
      <button
        className="absolute top-3 right-3 w-12 h-12 rounded bg-white/25 border-2 border-white/50 text-white text-xl pointer-events-auto"
        onTouchStart={(e) => {
          e.stopPropagation();
          bridge().openScreen('inventory');
        }}
      >
        🎒
      </button>
      <button
        className="absolute top-3 right-[68px] w-12 h-12 rounded bg-white/25 border-2 border-white/50 text-white text-xl pointer-events-auto"
        onTouchStart={(e) => {
          e.stopPropagation();
          bridge().openScreen('pause');
        }}
      >
        ⚙
      </button>
      {/* keep store subscription so overlay re-renders with screen */}
      <ScreenWatcher />
    </div>
  );
}

function ScreenWatcher(): null {
  useGameStore((s) => s.screen);
  return null;
}
