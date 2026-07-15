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
 * Animated voxel panorama behind the title (P5-10, smoothed for V2): rendered
 * at native device resolution and scrolled with continuous float offsets so the
 * parallax hills glide instead of jumping in block steps. Chunky voxel columns
 * are kept as deliberately sized rectangles rather than an upscaled tiny canvas.
 */
function TitlePanorama(): React.ReactElement {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const g = canvas.getContext('2d')!;
    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      H = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener('resize', resize);

    // Deterministic hill heightfields in [0..1] fractions of screen height.
    const layer = (seed: number, amp: number, base: number): number[] => {
      let s = seed;
      const rnd = () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 0xffffffff;
      };
      const hs: number[] = [];
      let h = base;
      for (let i = 0; i < 128; i++) {
        h += (rnd() - 0.5) * amp;
        h = Math.max(base - amp * 1.6, Math.min(base + amp * 1.6, h));
        hs.push(h);
      }
      return hs;
    };
    // base/amp as fractions of height; speed in fractions of width per second.
    const hills = [
      { hs: layer(11, 0.05, 0.26), color: '#14343c', speed: 0.006, vox: 22 },
      { hs: layer(23, 0.06, 0.34), color: '#1b4a44', speed: 0.014, vox: 26 },
      { hs: layer(47, 0.07, 0.44), color: '#215a4a', speed: 0.03, vox: 30 },
    ];
    const clouds = Array.from({ length: 6 }, (_, i) => ({
      x: (i * 0.19) % 1,
      y: 0.08 + ((i * 0.11) % 0.34),
      w: 0.08 + ((i * 0.017) % 0.06),
      speed: 0.008 + (i % 3) * 0.004,
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
      // Low sun with a soft glow; bobs gently.
      const sunX = W * 0.84;
      const sunY = H * 0.2 + Math.sin(t * 0.1) * 3 * dpr;
      const sr = 40 * dpr;
      const glow = g.createRadialGradient(sunX, sunY, 2, sunX, sunY, sr);
      glow.addColorStop(0, 'rgba(255,214,140,0.9)');
      glow.addColorStop(1, 'rgba(255,150,60,0)');
      g.fillStyle = glow;
      g.fillRect(sunX - sr, sunY - sr, sr * 2, sr * 2);
      g.fillStyle = '#ffe9b0';
      const sd = 9 * dpr;
      g.fillRect(sunX - sd, sunY - sd, sd * 2, sd * 2);
      // Drifting soft clouds (continuous wrap → no stepping).
      g.fillStyle = 'rgba(226,238,246,0.8)';
      for (const c of clouds) {
        const cw = c.w * W;
        let x = ((c.x - t * c.speed) % 1) * (W + cw);
        if (x < -cw) x += W + cw;
        const y = c.y * H;
        g.fillRect(x, y, cw, 6 * dpr);
        g.fillRect(x + 5 * dpr, y - 5 * dpr, cw - 12 * dpr, 5 * dpr);
      }
      // Parallax voxel hills, back to front — continuous scroll, sampled per
      // voxel column so motion is smooth but the silhouette stays blocky.
      for (const { hs, color, speed, vox } of hills) {
        g.fillStyle = color;
        const v = vox * dpr;
        const scroll = t * speed * W;
        const frac = scroll % v;
        const startCol = Math.floor(scroll / v);
        for (let x = -v; x < W + v; x += v) {
          const col = ((Math.floor(x / v) + startCol) % hs.length + hs.length) % hs.length;
          const h = hs[col] * H;
          g.fillRect(x - frac, H - h, v + 1, h);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

export function TitleScreen(): React.ReactElement {
  const seedText = useGameStore((s) => s.seedText);
  const saveSeed = useGameStore((s) => s.saveSeed);
  const set = useGameStore((s) => s.set);
  const [mode, setMode] = React.useState<'survival' | 'creative'>('survival');
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
        {/* Game mode picker, original-style. */}
        <div className="flex w-72 mx-auto mb-1 rounded-lg overflow-hidden border border-vc-slot-edge">
          {(['survival', 'creative'] as const).map((m) => (
            <button
              key={m}
              className={`flex-1 py-2 text-sm font-bold capitalize transition-colors ${
                mode === m ? 'bg-vc-accent-soft text-vc-accent' : 'bg-vc-slot text-vc-text-dim hover:text-white'
              }`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
        {saveSeed !== null && (
          <button
            className={BTN + ' border-vc-accent text-vc-accent'}
            onClick={() => bridge().continueWorld()}
          >
            Continue World (seed {saveSeed})
          </button>
        )}
        <button className={BTN} onClick={() => bridge().startWorld(seedText, mode)}>
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
    <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center pointer-events-auto font-game py-6">
      <h2 className="text-3xl text-white font-bold mb-4" style={{ textShadow: '2px 2px 0 #3f3f3f' }}>
        Game Paused
      </h2>
      {/* Primary actions stay visible above the fold — no scrolling to exit. */}
      <button className={BTN} onClick={() => bridge().closeScreen()}>
        Back to Game
      </button>
      <button className={BTN + ' border-vc-amber/60 text-vc-amber'} onClick={() => bridge().quitToTitle()}>
        Save & Quit to Title
      </button>
      <button className={BTN} onClick={() => bridge().toggleFullscreen()}>
        Toggle Fullscreen
      </button>
      <div className="bg-vc-panel/80 rounded-xl border border-vc-slot-edge p-4 mt-4 max-h-[46vh] overflow-y-auto">
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
          <span>View Bobbing</span>
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#2dd4bf]"
            checked={settings.viewBobbing}
            onChange={(e) => apply({ viewBobbing: e.target.checked })}
          />
        </label>
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
