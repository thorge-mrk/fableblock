/**
 * Title screen (seed entry), loading screen, pause/settings overlay with
 * render-distance / FOV / quality / day-length sliders, and the death screen.
 */
import React from 'react';
import { useGameStore } from '../state/store';
import { bridge } from '../state/bridge';
import {
  MIN_RENDER_DISTANCE, MAX_RENDER_DISTANCE,
} from '../core/config';

const BTN =
  'block w-72 mx-auto my-2 py-2.5 px-4 bg-vc-slot hover:bg-vc-accent-soft text-white font-bold ' +
  'rounded-lg border border-vc-slot-edge hover:border-vc-accent ' +
  'active:translate-y-px transition-colors select-none';

/**
 * Animated voxel panorama behind the title (P5-10): low-res 2D canvas with
 * a dusk gradient, sun, drifting pixel clouds and three parallax layers of
 * blocky hills — scaled up with pixelated rendering for the retro look.
 */
function TitlePanorama(): React.ReactElement {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const W = 320;
    const H = 180;
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext('2d')!;
    // Deterministic blocky hill heightfields per layer.
    const layer = (seed: number, amp: number, base: number): number[] => {
      let s = seed;
      const rnd = () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 0xffffffff;
      };
      const hs: number[] = [];
      let h = base;
      for (let i = 0; i < 96; i++) {
        h += (rnd() - 0.5) * amp;
        h = Math.max(base - amp * 1.6, Math.min(base + amp * 1.6, h));
        hs.push(Math.round(h / 4) * 4); // quantized voxel steps
      }
      return hs;
    };
    const hills = [
      { hs: layer(11, 8, 46), color: '#14343c', speed: 3 },
      { hs: layer(23, 10, 60), color: '#1b4a44', speed: 7 },
      { hs: layer(47, 12, 76), color: '#215a4a', speed: 14 },
    ];
    const clouds = Array.from({ length: 6 }, (_, i) => ({
      x: (i * 61) % W,
      y: 14 + ((i * 29) % 46),
      w: 26 + ((i * 13) % 22),
      speed: 2.5 + (i % 3),
    }));
    let raf = 0;
    const draw = (nowMs: number) => {
      const t = nowMs / 1000;
      // Dusk sky gradient.
      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#0c1a26');
      sky.addColorStop(0.55, '#17384a');
      sky.addColorStop(1, '#c26a3a');
      g.fillStyle = sky;
      g.fillRect(0, 0, W, H);
      // Low sun with a soft glow.
      const sunX = W * 0.84;
      const sunY = H * 0.2 + Math.sin(t * 0.1) * 3;
      const glow = g.createRadialGradient(sunX, sunY, 2, sunX, sunY, 34);
      glow.addColorStop(0, 'rgba(255,214,140,0.9)');
      glow.addColorStop(1, 'rgba(255,150,60,0)');
      g.fillStyle = glow;
      g.fillRect(sunX - 36, sunY - 36, 72, 72);
      g.fillStyle = '#ffe9b0';
      g.fillRect(sunX - 7, sunY - 7, 14, 14);
      // Pixel clouds.
      g.fillStyle = 'rgba(226,238,246,0.8)';
      for (const c of clouds) {
        const cx = (c.x - t * c.speed) % (W + c.w);
        const x = cx < -c.w ? cx + W + c.w : cx;
        g.fillRect(Math.round(x), c.y, c.w, 5);
        g.fillRect(Math.round(x) + 4, c.y - 4, c.w - 10, 4);
      }
      // Parallax voxel hills, back to front.
      for (const { hs, color, speed } of hills) {
        g.fillStyle = color;
        const off = Math.floor(t * speed);
        for (let x = 0; x < W; x += 4) {
          const h = hs[(((x + off) >> 2) + 960) % hs.length];
          g.fillRect(x, H - h, 4, h);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export function TitleScreen(): React.ReactElement {
  const seedText = useGameStore((s) => s.seedText);
  const saveSeed = useGameStore((s) => s.saveSeed);
  const set = useGameStore((s) => s.set);
  React.useEffect(() => {
    // Probe IndexedDB for an existing world (enables the Continue button).
    import('../engine/persistence').then(({ loadWorld }) =>
      loadWorld().then((d) => {
        if (d) set({ saveSeed: d.seed });
      }),
    );
  }, [set]);
  return (
    <div className="absolute inset-0 bg-[#0c1a26] flex flex-col items-center justify-center pointer-events-auto font-game overflow-hidden">
      <TitlePanorama />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#0c121860] to-[#0c1218cc]" />
      <div className="relative flex flex-col items-center">
        <h1
          className="text-6xl font-extrabold mb-1 tracking-wider"
          style={{
            color: '#eafffa',
            textShadow: '0 0 24px #2dd4bf88, 3px 3px 0 #0c1218',
          }}
        >
          FableBlock
        </h1>
        <p className="text-vc-amber mb-10 italic" style={{ textShadow: '2px 2px 0 #0c1218' }}>
          100% browser-native voxel engine
        </p>
        <input
          className="w-72 px-3 py-2 mb-2 bg-vc-slot/90 text-white rounded-lg border border-vc-slot-edge focus:border-vc-accent outline-none text-center"
          placeholder="World seed (blank = random)"
          value={seedText}
          onChange={(e) => set({ seedText: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') bridge().startWorld(seedText);
          }}
        />
        {saveSeed !== null && (
          <button
            className={BTN + ' border-vc-accent text-vc-accent'}
            onClick={() => bridge().continueWorld()}
          >
            Continue World (seed {saveSeed})
          </button>
        )}
        <button className={BTN} onClick={() => bridge().startWorld(seedText)}>
          Create World
        </button>
        <div className="mt-8 text-gray-300 text-xs text-center leading-5 max-w-md" style={{ textShadow: '1px 1px 0 #0c1218' }}>
          WASD move · Space jump · Shift sneak · Ctrl sprint · E inventory · Q drop
          <br />
          Left-click mine / attack · Right-click place / interact · F5 camera · F fullscreen · F3 debug
        </div>
      </div>
    </div>
  );
}

export function LoadingScreen(): React.ReactElement {
  const progress = useGameStore((s) => s.loadProgress);
  return (
    <div className="absolute inset-0 bg-[#10131f] flex flex-col items-center justify-center pointer-events-auto font-game">
      <h2 className="text-2xl text-white mb-6" style={{ textShadow: '2px 2px 0 #3f3f3f' }}>
        Generating world…
      </h2>
      <div className="w-80 h-4 bg-vc-slot rounded-full border border-vc-slot-edge overflow-hidden">
        <div
          className="h-full bg-vc-accent transition-all duration-200"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <p className="text-gray-400 text-sm mt-3">
        Carving caves, planting villages, waking up mobs…
      </p>
    </div>
  );
}

function SettingSlider({
  label, value, min, max, step, format, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}): React.ReactElement {
  return (
    <label className="block w-72 mx-auto my-3 text-white text-sm">
      <span className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="text-vc-amber">{format(value)}</span>
      </span>
      <input
        type="range"
        className="w-full accent-[#2dd4bf]"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function PauseScreen(): React.ReactElement {
  const settings = useGameStore((s) => s.settings);
  const setSettings = useGameStore((s) => s.setSettings);
  const apply = (partial: Parameters<typeof setSettings>[0]) => {
    setSettings(partial);
    bridge().applySettings();
  };
  return (
    <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center pointer-events-auto font-game overflow-y-auto py-6">
      <h2 className="text-3xl text-white font-bold mb-4" style={{ textShadow: '2px 2px 0 #3f3f3f' }}>
        Game Paused
      </h2>
      <button className={BTN} onClick={() => bridge().closeScreen()}>
        Back to Game
      </button>
      <button className={BTN} onClick={() => bridge().toggleFullscreen()}>
        Toggle Fullscreen
      </button>
      <div className="bg-vc-panel/80 rounded-xl border border-vc-slot-edge p-4 mt-4">
        <SettingSlider
          label="Render Distance"
          value={settings.renderDistance}
          min={MIN_RENDER_DISTANCE}
          max={MAX_RENDER_DISTANCE}
          step={1}
          format={(v) => `${v} chunks`}
          onChange={(v) => apply({ renderDistance: v })}
        />
        <SettingSlider
          label="Field of View"
          value={settings.fov}
          min={50}
          max={110}
          step={1}
          format={(v) => `${v}°`}
          onChange={(v) => apply({ fov: v })}
        />
        <SettingSlider
          label="Graphics Quality"
          value={settings.quality}
          min={0}
          max={2}
          step={1}
          format={(v) => ['Fast', 'Balanced', 'Fancy'][v]}
          onChange={(v) => apply({ quality: v as 0 | 1 | 2 })}
        />
        <SettingSlider
          label="Day Length"
          value={settings.dayLengthSec}
          min={120}
          max={1800}
          step={60}
          format={(v) => `${Math.round(v / 60)} min`}
          onChange={(v) => apply({ dayLengthSec: v })}
        />
        <SettingSlider
          label="Mouse Sensitivity"
          value={settings.sensitivity}
          min={0.2}
          max={2.5}
          step={0.1}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => apply({ sensitivity: v })}
        />
        <SettingSlider
          label="Brightness"
          value={settings.brightness}
          min={0.6}
          max={1.8}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => apply({ brightness: v })}
        />
        <SettingSlider
          label="Sound Volume"
          value={settings.soundVolume}
          min={0}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => apply({ soundVolume: v })}
        />
        <label className="flex w-72 mx-auto my-3 text-white text-sm justify-between items-center">
          <span>Touch Controls</span>
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#2dd4bf]"
            checked={settings.touchMode}
            onChange={(e) => apply({ touchMode: e.target.checked })}
          />
        </label>
      </div>
      <button className={BTN} onClick={() => bridge().quitToTitle()}>
        Quit to Title
      </button>
    </div>
  );
}

export function DeathScreen(): React.ReactElement {
  return (
    <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center pointer-events-auto font-game">
      <h2 className="text-5xl text-white font-bold mb-8" style={{ textShadow: '3px 3px 0 #3f1010' }}>
        You died!
      </h2>
      <button className={BTN} onClick={() => bridge().respawn()}>
        Respawn
      </button>
      <button className={BTN} onClick={() => bridge().quitToTitle()}>
        Quit to Title
      </button>
    </div>
  );
}
