/**
 * Main-thread game orchestrator: Three.js pipeline, worker wiring
 * (gen / mesh / logic), player simulation + camera rigs, mining & placement,
 * container sessions, inventory/crafting state machines and the UI bridge.
 */
import * as THREE from 'three';
import { TextureAtlas } from './TextureAtlas';
import { createEnvUniforms, createTerrainMaterial, createWaterMaterial, EnvUniforms } from './materials';
import { ChunkManager } from './ChunkManager';
import { DayNightCycle } from './DayNight';
import { PlayerController } from './Player';
import { EntityRenderer, remapBoxToTiles } from './EntityRenderer';
import { CharacterModel, HeldItemView } from './CharacterModel';
import { raycastBlocks, RayHit } from './Raycast';
import { attachKeyboard, detachKeyboard, input, setJoystick, setTouchButton, addTouchLook } from './Input';
import { gameStore, useGameStore } from '../state/store';
import { registerBridge } from '../state/bridge';
import { World } from '../core/world';
import { hashSeed } from '../core/prng';
import {
  B, blockDef, isChest, isFurnace, isInteractive, TILE, isWater,
} from '../core/blocks';
import { ITEM, itemDef, isPlaceable, makeStack, ItemStack } from '../core/items';
import { clickSlot, insertStack, cloneStack, Slots, decrementSlot } from '../core/inventory';
import { matchRecipe } from '../core/recipes';
import {
  PLAYER_REACH, PLAYER_MAX_HP, SEA_LEVEL, TICK_MS, PLAYER_WIDTH,
} from '../core/config';
import type { FromLogicMsg, ToLogicMsg, GenChunkMsg } from '../net/messages';

const QUALITY_SCALE = [0.6, 1.0, 0];

export class Game {
  private canvas: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private atlas!: TextureAtlas;
  private env!: EnvUniforms;
  private chunks!: ChunkManager;
  private world!: World;
  private dayNight!: DayNightCycle;
  private player = new PlayerController();
  private entityRenderer!: EntityRenderer;
  private character!: CharacterModel;
  private heldView!: HeldItemView;
  private genWorker!: Worker;
  private meshWorker!: Worker;
  private logicWorker!: Worker;

  private outline!: THREE.LineSegments;
  private crackMesh!: THREE.Mesh;
  private crackGeos: THREE.BufferGeometry[] = [];

  private running = false;
  private lastFrame = 0;
  private fpsEMA = 60;
  private tickAccum = 0;
  private statsAccum = 0;
  private patchOut: number[] = [];

  // Interaction state
  private mineTarget: RayHit | null = null;
  private mineProgress = 0;
  private useRepeat = 0;
  private attackCooldown = 0;
  private eatCooldown = 0;
  private prevMineHeld = false;
  private lavaTimer = 0;
  private fireTicks = 0;
  private regenTimer = 0;
  private shake = 0;

  private spawn: [number, number, number] | null = null;
  private spawnChunkSearched = false;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private workerStats = { entities: 0, tickMs: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    registerBridge({
      startWorld: (seedText) => this.start(seedText),
      respawn: () => this.respawn(),
      quitToTitle: () => window.location.reload(),
      openScreen: (s) => this.openScreen(s),
      closeScreen: () => this.closeScreen(),
      invClick: (slot, button, shift) => this.invClick(slot, button, shift),
      craftGridClick: (slot, button, shift) => this.craftGridClick(slot, button, shift),
      craftResultClick: (shift) => this.craftResultClick(shift),
      containerClick: (area, slot, button, shift) => this.sendLogic({ t: 'click', area, slot, button, shift }),
      selectHotbar: (i) => gameStore.set({ hotbarIndex: i }),
      dropHeldItem: (all) => this.dropHeldItem(all),
      setPaused: (p) => this.setPaused(p),
      applySettings: () => this.applySettings(),
      toggleFullscreen: () => this.toggleFullscreen(),
      touchMove: (x, z) => setJoystick(x, z),
      touchLook: (dx, dy) => addTouchLook(dx, dy),
      touchButton: (btn, down) => setTouchButton(btn, down),
      iconFor: (itemId) => this.atlas.icon(itemDef(itemId).icon),
    });
  }

  // -------------------------------------------------------------------------
  // Bootstrapping
  // -------------------------------------------------------------------------
  start(seedText: string): void {
    const seed = /^-?\d+$/.test(seedText.trim())
      ? Number(seedText.trim()) >>> 0
      : hashSeed(seedText.trim() === '' ? String(Date.now()) : seedText.trim());

    gameStore.set({ phase: 'loading', loadProgress: 0 });

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87b5e5);
    const settings = gameStore.get().settings;
    this.camera = new THREE.PerspectiveCamera(settings.fov, window.innerWidth / window.innerHeight, 0.06, 600);
    this.scene.add(this.camera);

    this.atlas = new TextureAtlas(seed);
    this.env = createEnvUniforms();
    const terrainMat = createTerrainMaterial(this.atlas.texture, this.env);
    const waterMat = createWaterMaterial(this.atlas.texture, this.env);

    this.genWorker = new Worker(new URL('../workers/gen.worker.ts', import.meta.url), { type: 'module' });
    this.meshWorker = new Worker(new URL('../workers/mesh.worker.ts', import.meta.url), { type: 'module' });
    this.logicWorker = new Worker(new URL('../workers/logic.worker.ts', import.meta.url), { type: 'module' });

    this.genWorker.postMessage({ t: 'init', seed });
    this.logicWorker.postMessage({ t: 'init', seed } satisfies ToLogicMsg);
    this.logicWorker.onmessage = (e: MessageEvent<FromLogicMsg>) => this.handleLogic(e.data);

    this.chunks = new ChunkManager(this.scene, terrainMat, waterMat, this.genWorker, this.meshWorker);
    this.world = this.chunks.world;
    this.world.onCellChanged = (x, y, z, v) => {
      this.patchOut.push(x, y, z, v);
    };
    this.chunks.onChunkReady = (msg: GenChunkMsg, copy: ArrayBuffer) => {
      this.logicWorker.postMessage(
        {
          t: 'chunk', cx: msg.cx, cz: msg.cz, data: copy,
          blockEntities: msg.blockEntities, mobs: msg.mobs, village: msg.village,
        } satisfies ToLogicMsg,
        [copy],
      );
    };
    this.chunks.onChunkRemoved = (cx, cz) => {
      this.sendLogic({ t: 'unchunk', cx, cz });
    };
    this.chunks.renderDistance = settings.renderDistance;

    this.dayNight = new DayNightCycle(settings.dayLengthSec);
    this.scene.add(this.dayNight.sun);
    this.scene.add(this.dayNight.sun.target);
    this.scene.add(this.dayNight.ambient);

    this.entityRenderer = new EntityRenderer(this.atlas);
    this.scene.add(this.entityRenderer.group);
    this.character = new CharacterModel(this.atlas);
    this.character.group.visible = false;
    this.scene.add(this.character.group);
    this.heldView = new HeldItemView(this.atlas, this.camera);

    // Selection outline + crack overlay
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002));
    this.outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x111111 }));
    this.outline.visible = false;
    this.scene.add(this.outline);
    for (let s = 0; s < 4; s++) {
      const g = new THREE.BoxGeometry(1.004, 1.004, 1.004);
      const t = [TILE.CRACK_0, TILE.CRACK_1, TILE.CRACK_2, TILE.CRACK_3][s];
      remapBoxToTiles(g, [t, t, t, t, t, t]);
      this.crackGeos.push(g);
    }
    this.crackMesh = new THREE.Mesh(
      this.crackGeos[0],
      new THREE.MeshBasicMaterial({
        map: this.atlas.texture, transparent: true, depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: -1,
      }),
    );
    this.crackMesh.visible = false;
    this.scene.add(this.crackMesh);

    this.player.teleport(8.5, 120, 8.5);
    this.player.onFallDamage = (blocks) => this.damagePlayer(Math.floor(blocks), 0, 0, 'fall');

    this.attachDOM();
    this.applySettings();
    this.giveStarterItems();

    this.running = true;
    this.lastFrame = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  private giveStarterItems(): void {
    const inv: Slots = new Array(36).fill(null);
    inv[0] = makeStack(ITEM.WOOD_PICKAXE, 1);
    inv[1] = makeStack(ITEM.WOOD_SWORD, 1);
    inv[2] = makeStack(B.TORCH, 16);
    inv[3] = makeStack(B.OAK_PLANKS, 24);
    gameStore.set({ inventory: inv });
  }

  private attachDOM(): void {
    attachKeyboard({
      onHotbar: (i) => gameStore.set({ hotbarIndex: i }),
      onHotbarScroll: (d) => {
        const s = gameStore.get();
        if (s.screen !== 'none') return;
        gameStore.set({ hotbarIndex: (s.hotbarIndex + d + 9) % 9 });
      },
      onInventory: () => {
        const s = gameStore.get();
        if (s.phase !== 'playing') return;
        if (s.screen === 'none') this.openScreen('inventory');
        else this.closeScreen();
      },
      onDrop: (all) => this.dropHeldItem(all),
      onToggleCamera: () => {
        const s = gameStore.get();
        s.setSettings({ thirdPerson: !s.settings.thirdPerson });
      },
      onToggleDebug: () => {
        const s = gameStore.get();
        s.setSettings({ showDebug: !s.settings.showDebug });
      },
      onFullscreen: () => this.toggleFullscreen(),
      onEscape: () => {
        const s = gameStore.get();
        if (s.phase !== 'playing') return;
        if (s.screen === 'none') this.openScreen('pause');
        else this.closeScreen();
      },
      isUIOpen: () => gameStore.get().screen !== 'none',
    });

    this.canvas.addEventListener('mousedown', (e) => {
      const s = gameStore.get();
      if (s.phase !== 'playing' || s.screen !== 'none') return;
      if (s.settings.touchMode) return;
      if (document.pointerLockElement !== this.canvas) {
        this.canvas.requestPointerLock();
        return;
      }
      if (e.button === 0) input.mineHeld = true;
      if (e.button === 2) {
        input.useHeld = true;
        input.useClicked = true;
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) input.mineHeld = false;
      if (e.button === 2) input.useHeld = false;
    });
    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== this.canvas) return;
      const sens = gameStore.get().settings.sensitivity * 0.0023;
      this.player.yaw -= e.movementX * sens;
      this.player.pitch -= e.movementY * sens;
      this.player.pitch = Math.max(-1.55, Math.min(1.55, this.player.pitch));
    });
    document.addEventListener('pointerlockchange', () => {
      const s = gameStore.get();
      if (document.pointerLockElement !== this.canvas && s.phase === 'playing' && s.screen === 'none' && !s.settings.touchMode) {
        this.openScreen('pause');
      }
    });
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // -------------------------------------------------------------------------
  // Main loop
  // -------------------------------------------------------------------------
  private loop(now: number): void {
    if (!this.running) return;
    requestAnimationFrame((t) => this.loop(t));
    const dt = Math.min(0.1, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.fpsEMA = this.fpsEMA * 0.95 + (dt > 0 ? 1 / dt : 60) * 0.05;

    const store = gameStore.get();
    this.chunks.update(Math.floor(this.player.x), Math.floor(this.player.z));

    if (store.phase === 'loading') {
      this.updateLoading();
    } else if (store.phase === 'playing' || store.phase === 'dead') {
      this.updatePlaying(dt, store.phase === 'playing');
    }

    // Day/night + env uniforms
    this.dayNight.dayLengthSec = store.settings.dayLengthSec;
    this.dayNight.update(dt, this.env, this.scene, this.camera, this.chunks.renderDistance);
    this.env.uTime.value = now / 1000;
    if (this.player.headInFluid) {
      this.env.uFogNear.value = 2;
      this.env.uFogFar.value = this.player.inLava ? 6 : 24;
      this.env.uFogColor.value.setHex(this.player.inLava ? 0xc04808 : 0x1840a0);
    }

    // Entities
    this.entityRenderer.update(this.world, this.dayNight.sunLevel, this.player.yaw, dt);

    // 20 Hz uplink to the logic worker
    this.tickAccum += dt * 1000;
    while (this.tickAccum >= TICK_MS) {
      this.tickAccum -= TICK_MS;
      this.sendLogic({
        t: 'player',
        x: this.player.x, y: this.player.y, z: this.player.z,
        yaw: this.player.yaw, sneak: this.player.sneaking,
        time: this.dayNight.time, health: gameStore.get().health,
      });
    }
    this.flushPatches();

    // Debug stats — frame-rate-independent throttle (~5 Hz) to keep React
    // store churn off the hot path regardless of FPS.
    this.statsAccum += dt;
    if (this.statsAccum >= 0.2) {
      this.statsAccum = 0;
      const cs = this.chunks.stats();
      gameStore.set({
        timeOfDay: this.dayNight.time,
        debug: {
          fps: Math.round(this.fpsEMA),
          chunks: cs.chunks,
          pending: cs.pending,
          entities: this.workerStats.entities,
          tickMs: this.workerStats.tickMs,
          x: Math.round(this.player.x * 10) / 10,
          y: Math.round(this.player.y * 10) / 10,
          z: Math.round(this.player.z * 10) / 10,
        },
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  private updateLoading(): void {
    if (!this.spawnChunkSearched && this.chunks.isReady(0, 0)) {
      this.spawnChunkSearched = true;
      this.spawn = this.findSpawn();
      this.player.teleport(this.spawn[0], this.spawn[1], this.spawn[2]);
    }
    if (this.spawn) {
      const progress = this.chunks.spawnProgress(Math.floor(this.spawn[0]) >> 4, Math.floor(this.spawn[2]) >> 4, 2);
      gameStore.set({ loadProgress: progress });
      if (progress >= 1) {
        gameStore.set({ phase: 'playing', loadProgress: 1 });
      }
    } else {
      gameStore.set({ loadProgress: this.chunks.isReady(0, 0) ? 0.4 : 0.1 });
    }
  }

  private findSpawn(): [number, number, number] {
    for (let r = 0; r < 4; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          if (!this.chunks.isReady(dx, dz)) continue;
          const x = dx * 16 + 8;
          const z = dz * 16 + 8;
          const h = this.world.highestSolid(x, z);
          const top = this.world.getBlockId(x, h, z);
          if (h > SEA_LEVEL && !isWater(top) && blockDef(top).solid) {
            return [x + 0.5, h + 1.05, z + 0.5];
          }
        }
      }
    }
    return [8.5, this.world.highestSolid(8, 8) + 1.05, 8.5];
  }

  private updatePlaying(dt: number, alive: boolean): void {
    const store = gameStore.get();
    const uiOpen = store.screen !== 'none';

    // Look (touch deltas / pointer-lock handled in event; touch via input)
    if (input.lookDX !== 0 || input.lookDY !== 0) {
      const sens = store.settings.sensitivity * 0.003;
      this.player.yaw -= input.lookDX * sens;
      this.player.pitch -= input.lookDY * sens;
      this.player.pitch = Math.max(-1.55, Math.min(1.55, this.player.pitch));
      input.lookDX = 0;
      input.lookDY = 0;
    }

    // Physics (frozen input while UI open / dead)
    const effInput = uiOpen || !alive
      ? { ...input, moveX: 0, moveZ: 0, jump: false, sneak: false, sprint: false }
      : input;
    this.player.update(dt, this.world, effInput);

    // Environmental damage
    this.updateHazards(dt, alive);

    // Interactions
    if (alive && !uiOpen) {
      this.updateMining(dt);
      this.updateUse(dt);
    } else {
      this.stopMining();
    }
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    this.eatCooldown = Math.max(0, this.eatCooldown - dt);
    this.prevMineHeld = input.mineHeld;

    // Camera rig
    this.updateCamera(dt);
  }

  private updateHazards(dt: number, alive: boolean): void {
    if (!alive) return;
    if (this.player.inLava) {
      this.lavaTimer += dt;
      this.fireTicks = 3;
      if (this.lavaTimer >= 0.5) {
        this.lavaTimer = 0;
        this.damagePlayer(4, 0, 0, 'fire');
      }
    } else {
      this.lavaTimer = 0;
      if (this.fireTicks > 0) {
        if (this.player.inWater) this.fireTicks = 0;
        else {
          const before = Math.ceil(this.fireTicks);
          this.fireTicks -= dt;
          if (Math.ceil(this.fireTicks) < before) this.damagePlayer(1, 0, 0, 'fire');
        }
      }
    }
    // Slow natural regen
    const hp = gameStore.get().health;
    if (hp > 0 && hp < PLAYER_MAX_HP) {
      this.regenTimer += dt;
      if (this.regenTimer >= 4) {
        this.regenTimer = 0;
        gameStore.set({ health: Math.min(PLAYER_MAX_HP, hp + 1) });
      }
    }
  }

  // -------------------------------------------------------------------------
  // Mining / attacking
  // -------------------------------------------------------------------------
  private eyePos(): [number, number, number] {
    return [this.player.x, this.player.y + this.player.eyeHeight(), this.player.z];
  }

  private updateMining(dt: number): void {
    const [ox, oy, oz] = this.eyePos();
    const [dx, dy, dz] = this.player.lookDir();
    const hit = raycastBlocks(this.world, ox, oy, oz, dx, dy, dz, PLAYER_REACH);

    // Selection outline
    if (hit) {
      this.outline.visible = true;
      this.outline.position.set(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5);
    } else {
      this.outline.visible = false;
    }

    // Attack on press (entity closer than block)
    if (input.mineHeld && !this.prevMineHeld) {
      const target = this.entityRenderer.pick(ox, oy, oz, dx, dy, dz, 3.6);
      if (target && (!hit || target.dist < hit.dist) && this.attackCooldown <= 0) {
        this.attackEntity(target.id);
        return;
      }
    }

    if (!input.mineHeld || !hit) {
      this.stopMining();
      return;
    }

    if (!this.mineTarget || this.mineTarget.x !== hit.x || this.mineTarget.y !== hit.y || this.mineTarget.z !== hit.z) {
      this.mineTarget = hit;
      this.mineProgress = 0;
    }

    const def = blockDef(hit.id);
    if (def.hardness < 0) {
      gameStore.set({ breakProgress: 0 });
      return; // bedrock
    }

    const held = this.heldStack();
    const tool = held ? itemDef(held.id).tool : undefined;
    const toolMatches = tool && def.tool === tool.type;
    const canHarvest = def.minTier === 0 || (tool?.type === 'pickaxe' && tool.tier >= def.minTier);
    let breakTime = def.hardness * 1.5;
    if (toolMatches) breakTime /= tool.speed;
    if (!canHarvest) breakTime *= 3.3;
    breakTime = Math.max(0.05, breakTime);

    this.mineProgress += dt / breakTime;
    gameStore.set({ breakProgress: Math.min(1, this.mineProgress) });

    const stage = Math.min(3, Math.floor(this.mineProgress * 4));
    this.crackMesh.visible = true;
    this.crackMesh.geometry = this.crackGeos[stage];
    this.crackMesh.position.set(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5);
    if (Math.random() < dt * 8) this.heldView.swing();

    if (this.mineProgress >= 1) {
      this.breakBlock(hit, canHarvest);
      this.stopMining();
    }
  }

  private stopMining(): void {
    this.mineTarget = null;
    this.mineProgress = 0;
    this.crackMesh.visible = false;
    if (gameStore.get().breakProgress !== 0) gameStore.set({ breakProgress: 0 });
  }

  private breakBlock(hit: RayHit, canHarvest: boolean): void {
    const def = blockDef(hit.id);
    if (isChest(hit.id) || isFurnace(hit.id) || hit.id === B.HOPPER || hit.id === B.SPAWNER) {
      this.sendLogic({ t: 'breakBE', x: hit.x, y: hit.y, z: hit.z });
    }
    this.world.setBlock(hit.x, hit.y, hit.z, B.AIR);
    if (canHarvest && def.drop !== -1) {
      const dropId = def.drop ?? hit.id;
      this.sendLogic({
        t: 'spawnItem',
        x: hit.x + 0.5, y: hit.y + 0.3, z: hit.z + 0.5,
        stack: makeStack(dropId, 1),
        vx: (Math.random() - 0.5) * 1.5, vy: 2.4, vz: (Math.random() - 0.5) * 1.5,
      });
    }
    this.useTool(1);
    this.heldView.swing();
    this.character.swing();
  }

  private attackEntity(id: number): void {
    this.attackCooldown = 0.4;
    const held = this.heldStack();
    const tool = held ? itemDef(held.id).tool : undefined;
    const damage = tool ? tool.damage : 1;
    const [dx, , dz] = this.player.lookDir();
    const len = Math.hypot(dx, dz) || 1;
    this.sendLogic({ t: 'attack', entityId: id, damage, kx: (dx / len) * 7, kz: (dz / len) * 7 });
    if (tool?.type === 'sword') this.useTool(1);
    this.heldView.swing();
    this.character.swing();
  }

  /** Apply durability loss to the held tool. */
  private useTool(amount: number): void {
    const s = gameStore.get();
    const inv = s.inventory.map(cloneStack);
    const held = inv[s.hotbarIndex];
    if (!held || held.dur === undefined) return;
    held.dur -= amount;
    if (held.dur <= 0) {
      inv[s.hotbarIndex] = null;
      this.toast(`${itemDef(held.id).name} broke!`);
    }
    gameStore.set({ inventory: inv });
  }

  // -------------------------------------------------------------------------
  // Use / placement / interaction
  // -------------------------------------------------------------------------
  private updateUse(dt: number): void {
    this.useRepeat -= dt;
    const fire = input.useClicked || (input.useHeld && this.useRepeat <= 0);
    input.useClicked = false;
    if (!fire) return;
    this.useRepeat = 0.24;

    const [ox, oy, oz] = this.eyePos();
    const [dx, dy, dz] = this.player.lookDir();
    const hit = raycastBlocks(this.world, ox, oy, oz, dx, dy, dz, PLAYER_REACH);

    // Interactive blocks (unless sneaking)
    if (hit && !this.player.sneaking && isInteractive(hit.id)) {
      this.interactWith(hit);
      return;
    }

    const held = this.heldStack();
    if (!held) return;
    const def = itemDef(held.id);

    if (def.food && this.eatCooldown <= 0 && gameStore.get().health < PLAYER_MAX_HP) {
      this.eatCooldown = 1;
      gameStore.set({ health: Math.min(PLAYER_MAX_HP, gameStore.get().health + def.food) });
      this.consumeHeld();
      this.heldView.swing();
      return;
    }

    if (hit && isPlaceable(held.id)) {
      this.tryPlace(hit, held.id);
    }
  }

  private interactWith(hit: RayHit): void {
    if (hit.id === B.CRAFTING_TABLE) {
      this.openScreen('crafting');
      return;
    }
    // Chest / furnace / hopper: worker-owned container session.
    const s = gameStore.get();
    this.sendLogic({
      t: 'open', x: hit.x, y: hit.y, z: hit.z,
      inv: s.inventory.map(cloneStack),
    });
    // Screen flips to 'container' when the first containerSync arrives.
  }

  private tryPlace(hit: RayHit, blockId: number): void {
    const px = hit.x + hit.nx;
    const py = hit.y + hit.ny;
    const pz = hit.z + hit.nz;
    if (py < 0 || py >= 255) return;
    const existing = this.world.getBlockId(px, py, pz);
    if (!blockDef(existing).replaceable) return;

    let placeId = blockId;
    const def = blockDef(blockId);

    // Support requirements
    if (def.renderType === 3 /* CROSS */) {
      const below = this.world.getBlockId(px, py - 1, pz);
      if (blockId === B.TORCH) {
        const hasSupport =
          blockDef(below).solid ||
          blockDef(this.world.getBlockId(px + 1, py, pz)).solid ||
          blockDef(this.world.getBlockId(px - 1, py, pz)).solid ||
          blockDef(this.world.getBlockId(px, py, pz + 1)).solid ||
          blockDef(this.world.getBlockId(px, py, pz - 1)).solid;
        if (!hasSupport) return;
      } else if (below !== B.GRASS && below !== B.DIRT && below !== B.SNOW_GRASS) {
        return;
      }
    }

    // Solid blocks cannot intersect the player.
    if (def.solid) {
      const w = PLAYER_WIDTH / 2;
      const ph = this.player.height;
      if (
        px + 1 > this.player.x - w && px < this.player.x + w &&
        pz + 1 > this.player.z - w && pz < this.player.z + w &&
        py + 1 > this.player.y && py < this.player.y + ph
      ) {
        return;
      }
    }

    // Facing variants: furnace/chest face the player.
    if (blockId === B.FURNACE_N || isChest(blockId)) {
      const yaw = ((this.player.yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      // Player look cardinal: front of block = toward player (opposite look).
      const look = Math.round(yaw / (Math.PI / 2)) % 4; // 0:-Z 1:-X 2:+Z 3:+X
      const facing = ['s', 'e', 'n', 'w'][look] as 's' | 'e' | 'n' | 'w';
      const base = isChest(blockId) ? B.CHEST_N : B.FURNACE_N;
      placeId = base + { n: 0, s: 1, e: 2, w: 3 }[facing];
    }

    this.world.setBlock(px, py, pz, placeId);
    if (isChest(placeId) || isFurnace(placeId) || placeId === B.HOPPER) {
      this.sendLogic({ t: 'placeBE', x: px, y: py, z: pz, blockId: placeId });
    }
    this.consumeHeld();
    this.heldView.swing();
    this.character.swing();
  }

  private consumeHeld(): void {
    const s = gameStore.get();
    const inv = s.inventory.map(cloneStack);
    decrementSlot(inv, s.hotbarIndex);
    gameStore.set({ inventory: inv });
  }

  private heldStack(): ItemStack | null {
    const s = gameStore.get();
    return s.inventory[s.hotbarIndex];
  }

  // -------------------------------------------------------------------------
  // Camera
  // -------------------------------------------------------------------------
  private updateCamera(dt: number): void {
    const store = gameStore.get();
    const eye = this.player.y + this.player.eyeHeight();
    this.shake = Math.max(0, this.shake - dt * 3);
    const shakeX = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 0.3 : 0;
    const shakeY = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 0.3 : 0;

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(this.player.pitch + shakeY, this.player.yaw + shakeX, 0);

    if (store.settings.thirdPerson) {
      const [lx, ly, lz] = this.player.lookDir();
      let dist = 4;
      // Pull the boom in when blocks occlude it.
      const back = raycastBlocks(this.world, this.player.x, eye, this.player.z, -lx, -ly, -lz, 4.2);
      if (back) dist = Math.max(0.5, back.dist - 0.3);
      this.camera.position.set(
        this.player.x - lx * dist,
        eye - ly * dist,
        this.player.z - lz * dist,
      );
      this.character.group.visible = true;
      const speed = Math.hypot(this.player.vx, this.player.vz);
      const v = this.world.getVoxel(Math.floor(this.player.x), Math.floor(this.player.y + 1), Math.floor(this.player.z));
      const bright = Math.max(
        0.12,
        Math.max((((v >> 8) & 0xf) / 15) * this.dayNight.sunLevel, ((v >> 12) & 0xf) / 15),
      );
      this.character.update(
        dt, this.player.x, this.player.y, this.player.z,
        this.player.yaw, this.player.pitch, speed, bright,
        this.heldStack()?.id ?? 0,
      );
      this.heldView.group.visible = false;
    } else {
      this.camera.position.set(this.player.x + shakeX, eye, this.player.z + shakeY);
      this.character.group.visible = false;
      this.heldView.group.visible = true;
      const v = this.world.getVoxel(Math.floor(this.player.x), Math.floor(eye), Math.floor(this.player.z));
      const bright = Math.max(
        0.15,
        Math.max((((v >> 8) & 0xf) / 15) * this.dayNight.sunLevel, ((v >> 12) & 0xf) / 15),
      );
      this.heldView.update(dt, this.heldStack()?.id ?? 0, Math.hypot(this.player.vx, this.player.vz), bright);
    }
  }

  // -------------------------------------------------------------------------
  // Logic worker downlink
  // -------------------------------------------------------------------------
  private handleLogic(msg: FromLogicMsg): void {
    switch (msg.t) {
      case 'snap':
        this.entityRenderer.applySnapshot(new Float32Array(msg.buf), msg.count);
        break;
      case 'blocks': {
        const cells = new Int32Array(msg.cells);
        for (let i = 0; i < cells.length; i += 4) {
          this.world.setBlock(cells[i], cells[i + 1], cells[i + 2], cells[i + 3]);
        }
        break;
      }
      case 'give': {
        const s = gameStore.get();
        if (s.container) break; // worker owns the inventory while a container is open
        const inv = s.inventory.map(cloneStack);
        const rest = insertStack(inv, msg.stack);
        gameStore.set({ inventory: inv });
        if (rest) {
          this.sendLogic({
            t: 'spawnItem', x: this.player.x, y: this.player.y + 0.5, z: this.player.z,
            stack: rest, vx: 0, vy: 0.5, vz: 0,
          });
        }
        break;
      }
      case 'damage':
        this.damagePlayer(msg.amount, msg.kx, msg.kz, msg.cause);
        break;
      case 'containerSync': {
        gameStore.set({
          container: {
            kind: msg.kind, x: msg.x, y: msg.y, z: msg.z,
            slots: msg.slots, fuel: msg.fuel, cook: msg.cook,
          },
          inventory: msg.inv,
          cursor: msg.cursor,
          screen: 'container',
        });
        document.exitPointerLock?.();
        break;
      }
      case 'containerClosed': {
        const inv = msg.inv.map(cloneStack);
        const cursor = cloneStack(msg.cursor);
        if (cursor) {
          const rest = insertStack(inv, cursor);
          if (rest) {
            this.sendLogic({
              t: 'spawnItem', x: this.player.x, y: this.player.y + 0.5, z: this.player.z,
              stack: rest, vx: 0, vy: 1, vz: 0,
            });
          }
        }
        gameStore.set({ inventory: inv, cursor: null, container: null });
        break;
      }
      case 'explosion': {
        const d = Math.hypot(msg.x - this.player.x, msg.y - this.player.y, msg.z - this.player.z);
        this.shake = Math.max(this.shake, Math.min(1.5, (msg.radius * 3) / Math.max(2, d)));
        break;
      }
      case 'stats':
        this.workerStats = { entities: msg.entities, tickMs: msg.tickMs };
        break;
    }
  }

  damagePlayer(amount: number, kx: number, kz: number, cause: string): void {
    if (amount <= 0) return;
    const s = gameStore.get();
    if (s.phase !== 'playing') return;
    const hp = Math.max(0, s.health - amount);
    gameStore.set({ health: hp });
    this.player.vx += kx;
    this.player.vz += kz;
    if (kx !== 0 || kz !== 0) this.player.vy += 3;
    this.shake = Math.max(this.shake, 0.5);
    if (hp <= 0) this.die();
    void cause;
  }

  private die(): void {
    const s = gameStore.get();
    // Drop the whole inventory at the death position.
    for (const stack of [...s.inventory, s.cursor]) {
      if (stack) {
        this.sendLogic({
          t: 'spawnItem', x: this.player.x, y: this.player.y + 0.8, z: this.player.z,
          stack,
          vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 2, vz: (Math.random() - 0.5) * 4,
        });
      }
    }
    gameStore.set({
      phase: 'dead',
      inventory: new Array(36).fill(null),
      cursor: null,
      screen: 'none',
    });
    document.exitPointerLock?.();
  }

  private respawn(): void {
    const sp = this.spawn ?? [8.5, 90, 8.5];
    this.player.teleport(sp[0], sp[1], sp[2]);
    this.fireTicks = 0;
    gameStore.set({ phase: 'playing', health: PLAYER_MAX_HP });
  }

  private sendLogic(msg: ToLogicMsg): void {
    this.logicWorker.postMessage(msg);
  }

  private flushPatches(): void {
    if (this.patchOut.length === 0) return;
    const arr = new Int32Array(this.patchOut);
    this.patchOut.length = 0;
    this.logicWorker.postMessage({ t: 'patch', cells: arr.buffer } satisfies ToLogicMsg, [arr.buffer]);
  }

  // -------------------------------------------------------------------------
  // Screens / inventory state machines (main-thread owned)
  // -------------------------------------------------------------------------
  private openScreen(screen: 'inventory' | 'pause' | 'crafting'): void {
    const s = gameStore.get();
    if (s.phase !== 'playing') return;
    const size = screen === 'crafting' ? 3 : 2;
    gameStore.set({
      screen,
      craftSize: size as 2 | 3,
      craftGrid: new Array(9).fill(null),
      craftResult: null,
    });
    document.exitPointerLock?.();
    this.stopMining();
  }

  private closeScreen(): void {
    const s = gameStore.get();
    if (s.screen === 'container') {
      this.sendLogic({ t: 'close' });
      gameStore.set({ screen: 'none', container: null });
    } else {
      // Return crafting grid + cursor to the inventory (or drop overflow).
      const inv = s.inventory.map(cloneStack);
      const giveBack = (stack: ItemStack | null) => {
        if (!stack) return;
        const rest = insertStack(inv, stack);
        if (rest) {
          this.sendLogic({
            t: 'spawnItem', x: this.player.x, y: this.player.y + 0.5, z: this.player.z,
            stack: rest, vx: 0, vy: 1, vz: 0,
          });
        }
      };
      for (const g of s.craftGrid) giveBack(g);
      giveBack(s.cursor);
      gameStore.set({
        screen: 'none',
        inventory: inv,
        cursor: null,
        craftGrid: new Array(9).fill(null),
        craftResult: null,
      });
    }
    if (!gameStore.get().settings.touchMode && gameStore.get().phase === 'playing') {
      this.canvas.requestPointerLock();
    }
  }

  private setPaused(paused: boolean): void {
    if (paused) this.openScreen('pause');
    else this.closeScreen();
  }

  private invClick(slot: number, button: 0 | 2, shift: boolean): void {
    const s = gameStore.get();
    if (s.screen === 'container') {
      this.sendLogic({ t: 'click', area: 1, slot, button, shift });
      return;
    }
    const inv = s.inventory.map(cloneStack);
    let cursor = cloneStack(s.cursor);
    if (shift && inv[slot]) {
      // Shift-click: hotbar <-> main storage
      const stack = inv[slot]!;
      inv[slot] = null;
      const rest = slot < 9 ? insertStack(inv, stack, 9, 36) : insertStack(inv, stack, 0, 9);
      if (rest) inv[slot] = rest;
    } else {
      cursor = clickSlot(inv, slot, cursor, button);
    }
    gameStore.set({ inventory: inv, cursor });
  }

  private craftGridClick(slot: number, button: 0 | 2, shift: boolean): void {
    const s = gameStore.get();
    const size = s.craftSize;
    if (slot >= size * size) return;
    const grid = s.craftGrid.map(cloneStack);
    let cursor = cloneStack(s.cursor);
    if (shift && grid[slot]) {
      const inv = s.inventory.map(cloneStack);
      const rest = insertStack(inv, grid[slot]!);
      grid[slot] = rest;
      gameStore.set({ inventory: inv });
    } else {
      cursor = clickSlot(grid, slot, cursor, button);
    }
    gameStore.set({ craftGrid: grid, cursor, craftResult: this.computeCraft(grid, size) });
  }

  private computeCraft(grid: Slots, size: 2 | 3): ItemStack | null {
    const ids = new Array(size * size).fill(0);
    for (let i = 0; i < size * size; i++) ids[i] = grid[i]?.id ?? 0;
    const recipe = matchRecipe(ids, size);
    return recipe ? makeStack(recipe.result, recipe.count) : null;
  }

  private craftResultClick(shift: boolean): void {
    const s = gameStore.get();
    const size = s.craftSize;
    let grid = s.craftGrid.map(cloneStack);
    let result = this.computeCraft(grid, size);
    if (!result) return;
    const inv = s.inventory.map(cloneStack);
    let cursor = cloneStack(s.cursor);

    const consumeOnce = () => {
      for (let i = 0; i < size * size; i++) {
        if (grid[i]) decrementSlot(grid, i);
      }
    };

    if (shift) {
      // Craft repeatedly into the inventory.
      let safety = 256;
      while (result && safety-- > 0) {
        const rest = insertStack(inv, { ...result });
        if (rest) break;
        consumeOnce();
        result = this.computeCraft(grid, size);
      }
    } else {
      const max = itemDef(result.id).maxStack;
      if (cursor && (cursor.id !== result.id || cursor.count + result.count > max || cursor.dur !== undefined)) return;
      if (!cursor) cursor = { ...result };
      else cursor.count += result.count;
      consumeOnce();
    }
    grid = grid.map(cloneStack);
    gameStore.set({
      inventory: inv,
      cursor,
      craftGrid: grid,
      craftResult: this.computeCraft(grid, size),
    });
  }

  private dropHeldItem(all: boolean): void {
    const s = gameStore.get();
    if (s.phase !== 'playing' || s.screen !== 'none') return;
    const inv = s.inventory.map(cloneStack);
    const held = inv[s.hotbarIndex];
    if (!held) return;
    const count = all ? held.count : 1;
    held.count -= count;
    if (held.count <= 0) inv[s.hotbarIndex] = null;
    const [dx, dy, dz] = this.player.lookDir();
    const stack: ItemStack = { id: held.id, count };
    if (held.dur !== undefined) stack.dur = held.dur;
    this.sendLogic({
      t: 'spawnItem',
      x: this.player.x + dx, y: this.player.y + 1.3, z: this.player.z + dz,
      stack,
      vx: dx * 5, vy: dy * 5 + 1.5, vz: dz * 5,
    });
    gameStore.set({ inventory: inv });
  }

  private applySettings(): void {
    const s = gameStore.get().settings;
    this.chunks.renderDistance = s.renderDistance;
    this.camera.fov = s.fov;
    this.camera.updateProjectionMatrix();
    const scale = QUALITY_SCALE[s.quality] || window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(Math.min(scale === 0 ? window.devicePixelRatio : scale, 2.5));
    this.dayNight.dayLengthSec = s.dayLengthSec;
  }

  toggleFullscreen(): void {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {
        /* user gesture required / unsupported — ignore */
      });
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  private toast(text: string): void {
    gameStore.set({ toast: text });
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => gameStore.set({ toast: null }), 2500);
  }

  dispose(): void {
    this.running = false;
    detachKeyboard();
    this.genWorker?.terminate();
    this.meshWorker?.terminate();
    this.logicWorker?.terminate();
    this.chunks?.dispose();
    this.entityRenderer?.dispose();
    this.renderer?.dispose();
  }
}

/** Convenience hook for App bootstrap. */
export function createGame(canvas: HTMLCanvasElement): Game {
  const game = new Game(canvas);
  void useGameStore; // store side effects loaded with the engine
  return game;
}
