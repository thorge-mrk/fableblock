/**
 * Mobile touch control canvas overlay (Module 7 spec): virtual joystick in
 * the bottom-left quadrant, action buttons bottom-right, and free-look drag
 * on the remaining screen space. Multi-touch aware via touch identifiers.
 */
import React from 'react';
import { bridge } from '../state/bridge';
import { useGameStore } from '../state/store';

const JOY_RADIUS = 64;

// --- Real vector icons (no emojis) for the touch controls -----------------
const S = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#fff', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function IconJump(): React.ReactElement {
  return (<svg {...S}><path d="M12 19V6" /><path d="M6 12l6-6 6 6" /></svg>);
}
function IconSneak(): React.ReactElement {
  return (<svg {...S}><path d="M6 8l6 6 6-6" /><path d="M6 14l6 6 6-6" /></svg>);
}
function IconMine(): React.ReactElement {
  // Pickaxe.
  return (<svg {...S}><path d="M4 20l9-9" /><path d="M5 8c4-3 10-3 14 0" /><path d="M12 4c-2 1.5-3.5 3-4 4" /><path d="M19 8c-1.5-1-3-1.5-4-1.5" /></svg>);
}
function IconPlace(): React.ReactElement {
  // Cube.
  return (<svg {...S}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" /></svg>);
}
function IconBag(): React.ReactElement {
  return (<svg {...S}><rect x="4" y="8" width="16" height="12" rx="1.5" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></svg>);
}
function IconGear(): React.ReactElement {
  return (<svg {...S}><circle cx="12" cy="12" r="3.2" /><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6 6l1.5 1.5M16.5 16.5L18 18M18 6l-1.5 1.5M7.5 16.5L6 18" /></svg>);
}
function IconFullscreen(): React.ReactElement {
  return (<svg {...S}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>);
}

export function TouchControls(): React.ReactElement {
  const sneak = React.useRef(false);
  const [sneakOn, setSneakOn] = React.useState(false);
  const joyTouch = React.useRef<number | null>(null);
  const lookTouch = React.useRef<number | null>(null);
  const joyOrigin = React.useRef<[number, number]>([0, 0]);
  const lookLast = React.useRef<[number, number]>([0, 0]);
  const [joyPos, setJoyPos] = React.useState<[number, number] | null>(null);
  const [knob, setKnob] = React.useState<[number, number]>([0, 0]);

  // The overlay unmounts when a screen opens — often BEFORE the finger lifts,
  // so touchend never reaches our handlers. Release everything on unmount or
  // the player keeps walking/mining/using behind the open menu.
  React.useEffect(
    () => () => {
      const b = bridge();
      b.touchMove(0, 0);
      (['jump', 'sneak', 'attack', 'use'] as const).forEach((k) => b.touchButton(k, false));
    },
    [],
  );

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
        <IconJump />
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
        <IconSneak />
      </div>
      <div className={BTN_CLS} style={{ right: 24, bottom: 220 }} {...holdButton('attack')}>
        <IconMine />
      </div>
      <div className={BTN_CLS} style={{ right: 104, bottom: 170 }} {...holdButton('use')}>
        <IconPlace />
      </div>

      {/* Top corner shortcuts */}
      <button
        className="absolute top-3 right-3 w-12 h-12 rounded bg-white/25 border-2 border-white/50 flex items-center justify-center pointer-events-auto"
        onTouchStart={(e) => {
          e.stopPropagation();
          bridge().openScreen('inventory');
        }}
      >
        <IconBag />
      </button>
      <button
        className="absolute top-3 right-[68px] w-12 h-12 rounded bg-white/25 border-2 border-white/50 flex items-center justify-center pointer-events-auto"
        onTouchStart={(e) => {
          e.stopPropagation();
          bridge().toggleFullscreen();
        }}
      >
        <IconFullscreen />
      </button>
      <button
        className="absolute top-3 right-[124px] w-12 h-12 rounded bg-white/25 border-2 border-white/50 flex items-center justify-center pointer-events-auto"
        onTouchStart={(e) => {
          e.stopPropagation();
          bridge().openScreen('pause');
        }}
      >
        <IconGear />
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
