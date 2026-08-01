/**
 * Unified input state (Module 7 spec): keyboard/mouse pipeline with
 * PointerLock, plus write-through fields the virtual touch overlay drives.
 * The Game engine consumes this once per frame.
 */

export interface InputState {
  // Movement (analog: -1..1 so the joystick can feed partial vectors)
  moveX: number;
  moveZ: number;
  jump: boolean;
  sneak: boolean;
  sprint: boolean;
  // Accumulated look deltas (consumed each frame)
  lookDX: number;
  lookDY: number;
  // Held mouse buttons
  mineHeld: boolean;
  useHeld: boolean;
  // One-shot action queue
  useClicked: boolean;
}

export const input: InputState = {
  moveX: 0,
  moveZ: 0,
  jump: false,
  sneak: false,
  sprint: false,
  lookDX: 0,
  lookDY: 0,
  mineHeld: false,
  useHeld: false,
  useClicked: false,
};

interface KeyFlags {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

const keys: KeyFlags = { w: false, a: false, s: false, d: false };
// Touch joystick contribution (kept separate so keys and stick can mix).
let stickX = 0;
let stickZ = 0;
let touchSneak = false;
let touchJump = false;
// Sprint sources: held Ctrl OR double-tapped forward (cleared on W release).
let ctrlSprint = false;
let tapSprint = false;
let lastForwardTap = 0;

function recomputeMove(): void {
  input.sprint = ctrlSprint || tapSprint;
  let x = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
  let z = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
  x += stickX;
  z += stickZ;
  const len = Math.hypot(x, z);
  if (len > 1) {
    x /= len;
    z /= len;
  }
  input.moveX = x;
  input.moveZ = z;
}

export function setJoystick(x: number, z: number): void {
  stickX = x;
  stickZ = z;
  recomputeMove();
}

export function setTouchButton(btn: 'jump' | 'sneak' | 'attack' | 'use', down: boolean): void {
  switch (btn) {
    case 'jump':
      touchJump = down;
      input.jump = touchJump;
      break;
    case 'sneak':
      touchSneak = down;
      input.sneak = touchSneak;
      break;
    case 'attack':
      input.mineHeld = down;
      break;
    case 'use':
      input.useHeld = down;
      if (down) input.useClicked = true;
      break;
  }
}

export function addTouchLook(dx: number, dy: number): void {
  input.lookDX += dx;
  input.lookDY += dy;
}

export interface InputHooks {
  onOpenChat(prefill: string): void;
  onHotbar(index: number): void;
  onHotbarScroll(delta: number): void;
  onInventory(): void;
  onDrop(all: boolean): void;
  onToggleCamera(): void;
  onToggleDebug(): void;
  onFullscreen(): void;
  onEscape(): void;
  isUIOpen(): boolean;
}

let detach: (() => void) | null = null;

export function attachKeyboard(hooks: InputHooks): void {
  detachKeyboard();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) {
      if (e.code.startsWith('F')) e.preventDefault();
      return;
    }
    switch (e.code) {
      case 'KeyW': {
        // Double-tap forward = sprint (like the original), held until released.
        const now = performance.now();
        if (!keys.w && now - lastForwardTap < 280) tapSprint = true;
        lastForwardTap = now;
        keys.w = true;
        break;
      }
      case 'KeyA': keys.a = true; break;
      case 'KeyS': keys.s = true; break;
      case 'KeyD': keys.d = true; break;
      case 'Space':
        if (!hooks.isUIOpen()) e.preventDefault();
        input.jump = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        input.sneak = true;
        break;
      case 'ControlLeft':
      case 'ControlRight':
        ctrlSprint = true;
        break;
      case 'KeyE': hooks.onInventory(); break;
      case 'KeyT':
        if (!hooks.isUIOpen()) {
          e.preventDefault();
          hooks.onOpenChat('');
        }
        break;
      case 'Slash':
        // "/" opens the chat pre-filled with the command prefix.
        if (!hooks.isUIOpen()) {
          e.preventDefault();
          hooks.onOpenChat('/');
        }
        break;
      case 'KeyQ': hooks.onDrop(e.ctrlKey); break;
      case 'F5':
        e.preventDefault();
        hooks.onToggleCamera();
        break;
      case 'F3':
        e.preventDefault();
        hooks.onToggleDebug();
        break;
      case 'F11':
      case 'KeyF':
        e.preventDefault();
        hooks.onFullscreen();
        break;
      case 'Escape': hooks.onEscape(); break;
      default: {
        if (e.code.startsWith('Digit')) {
          const n = Number(e.code.slice(5));
          if (n >= 1 && n <= 9) hooks.onHotbar(n - 1);
        }
      }
    }
    recomputeMove();
  };

  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
        keys.w = false;
        tapSprint = false;
        break;
      case 'KeyA': keys.a = false; break;
      case 'KeyS': keys.s = false; break;
      case 'KeyD': keys.d = false; break;
      case 'Space': input.jump = touchJump; break;
      case 'ShiftLeft':
      case 'ShiftRight':
        input.sneak = touchSneak;
        break;
      case 'ControlLeft':
      case 'ControlRight':
        ctrlSprint = false;
        break;
    }
    recomputeMove();
  };

  const onWheel = (e: WheelEvent) => {
    if (hooks.isUIOpen()) return;
    hooks.onHotbarScroll(Math.sign(e.deltaY));
  };

  const onBlur = () => {
    keys.w = keys.a = keys.s = keys.d = false;
    input.jump = false;
    input.sneak = false;
    ctrlSprint = false;
    tapSprint = false;
    input.mineHeld = false;
    input.useHeld = false;
    recomputeMove();
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('blur', onBlur);

  detach = () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('blur', onBlur);
  };
}

export function detachKeyboard(): void {
  if (detach) {
    detach();
    detach = null;
  }
}
