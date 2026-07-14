/**
 * Engine <-> UI bridge. The Game engine registers an implementation at
 * startup; React components invoke these actions. Keeping a mutable
 * singleton avoids prop-drilling engine handles through the UI tree.
 */

export interface GameBridge {
  startWorld(seedText: string): void;
  /** Resume the saved world (seed + edits + player state) from IndexedDB. */
  continueWorld(): void;
  respawn(): void;
  quitToTitle(): void;

  openScreen(screen: 'inventory' | 'pause'): void;
  closeScreen(): void;

  /** Click on player inventory slot / crafting grid slot (main-thread owned). */
  invClick(slot: number, button: 0 | 2, shift: boolean): void;
  /** Click one of the 4 armor slots (equip/unequip via cursor). */
  armorClick(slot: number): void;
  /** Double-click: gather all matching stacks onto the cursor. */
  collectAll(): void;
  /** Buy an enchantment level for the held tool (enchanting table UI). */
  enchantHeld(kind: 'eff' | 'unb' | 'sharp'): void;
  craftGridClick(slot: number, button: 0 | 2, shift: boolean): void;
  craftResultClick(shift: boolean): void;
  /** Click while a worker-owned container (chest/furnace/hopper) is open. */
  containerClick(area: 0 | 1, slot: number, button: 0 | 2, shift: boolean): void;

  selectHotbar(index: number): void;
  dropHeldItem(all: boolean): void;

  setPaused(paused: boolean): void;
  applySettings(): void;
  toggleFullscreen(): void;

  /** Touch control inputs (virtual joystick / buttons / look). */
  touchMove(x: number, y: number): void;
  touchLook(dx: number, dy: number): void;
  touchButton(btn: 'jump' | 'sneak' | 'attack' | 'use', down: boolean): void;

  /** Item icon data-URL lookup (texture atlas). */
  iconFor(itemId: number): string;
}

let impl: GameBridge | null = null;

export function registerBridge(bridge: GameBridge): void {
  impl = bridge;
}

export function bridge(): GameBridge {
  if (!impl) throw new Error('Game bridge not registered yet');
  return impl;
}

export function bridgeReady(): boolean {
  return impl !== null;
}
