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
  'block w-72 mx-auto my-2 py-2.5 px-4 bg-[#6f6f6f] hover:bg-[#7f8fb0] text-white font-bold ' +
  'border-2 border-t-[#a8a8a8] border-l-[#a8a8a8] border-b-[#3f3f3f] border-r-[#3f3f3f] ' +
  'active:border-t-[#3f3f3f] active:border-b-[#a8a8a8] select-none';

export function TitleScreen(): React.ReactElement {
  const seedText = useGameStore((s) => s.seedText);
  const set = useGameStore((s) => s.set);
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#10131f] to-[#2c3a26] flex flex-col items-center justify-center pointer-events-auto font-game">
      <h1
        className="text-6xl font-extrabold text-white mb-1 tracking-wider"
        style={{ textShadow: '4px 4px 0 #3f3f3f' }}
      >
        FableBlock
      </h1>
      <p className="text-yellow-300 mb-10 italic" style={{ textShadow: '2px 2px 0 #3f3f3f' }}>
        100% browser-native voxel engine
      </p>
      <input
        className="w-72 px-3 py-2 mb-2 bg-black/60 text-white border-2 border-[#a8a8a8] outline-none text-center"
        placeholder="World seed (blank = random)"
        value={seedText}
        onChange={(e) => set({ seedText: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') bridge().startWorld(seedText);
        }}
      />
      <button className={BTN} onClick={() => bridge().startWorld(seedText)}>
        Create World
      </button>
      <div className="mt-8 text-gray-300 text-xs text-center leading-5 max-w-md">
        WASD move · Space jump · Shift sneak · Ctrl sprint · E inventory · Q drop
        <br />
        Left-click mine / attack · Right-click place / interact · F5 camera · F fullscreen · F3 debug
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
      <div className="w-80 h-4 bg-black/70 border-2 border-[#a8a8a8]">
        <div
          className="h-full bg-green-500 transition-all duration-200"
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
        <span className="text-yellow-300">{format(value)}</span>
      </span>
      <input
        type="range"
        className="w-full accent-green-500"
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
      <div className="bg-black/40 rounded p-4 mt-4">
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
        <label className="flex w-72 mx-auto my-3 text-white text-sm justify-between items-center">
          <span>Touch Controls</span>
          <input
            type="checkbox"
            className="w-5 h-5 accent-green-500"
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
