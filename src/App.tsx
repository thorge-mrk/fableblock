/**
 * React shell: full-screen WebGL canvas + Tailwind UI overlays routed by
 * game phase / open screen from the Zustand store.
 */
import React from 'react';
import { createGame, Game } from './engine/Game';
import { useGameStore } from './state/store';
import { HUD, DebugOverlay } from './ui/HUD';
import { InventoryScreen, CraftingScreen, ContainerScreen } from './ui/InventoryScreens';
import { TitleScreen, LoadingScreen, PauseScreen, DeathScreen } from './ui/Menus';
import { TouchControls } from './ui/TouchControls';

export default function App(): React.ReactElement {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const gameRef = React.useRef<Game | null>(null);
  const phase = useGameStore((s) => s.phase);
  const screen = useGameStore((s) => s.screen);
  const touchMode = useGameStore((s) => s.settings.touchMode);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (canvasRef.current && !gameRef.current) {
      gameRef.current = createGame(canvasRef.current);
      setReady(true);
    }
    return () => {
      gameRef.current?.dispose();
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-mc-dark">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {ready && (
        <>
          {phase === 'title' && <TitleScreen />}
          {phase === 'loading' && <LoadingScreen />}
          {(phase === 'playing' || phase === 'dead') && (
            <>
              {/* Touch layer first: HUD renders above it so hotbar taps hit
                  the slots instead of spawning the joystick / look drag. */}
              {phase === 'playing' && screen === 'none' && touchMode && <TouchControls />}
              <HUD />
              <DebugOverlay />
              {screen === 'inventory' && <InventoryScreen />}
              {screen === 'crafting' && <CraftingScreen />}
              {screen === 'container' && <ContainerScreen />}
              {screen === 'pause' && <PauseScreen />}
              {phase === 'dead' && <DeathScreen />}
            </>
          )}
        </>
      )}
    </div>
  );
}
