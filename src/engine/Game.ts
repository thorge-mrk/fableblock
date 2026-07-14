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
import { BoatModel } from './BoatModel';
import { Particles } from './Particles';
import { raycastBlocks, RayHit } from './Raycast';
import { attachKeyboard, detachKeyboard, input, setJoystick, setTouchButton, addTouchLook } from './Input';
import { gameStore, useGameStore } from '../state/store';
import { registerBridge } from '../state/bridge';
import { World } from '../core/world';
import { hashSeed } from '../core/prng';
import { chunkKeyNum, blockIndex } from '../core/coords';
import { saveWorld, loadWorld, SaveData } from './persistence';
import { SoundEngine } from './Sound';
import {
  B, blockDef, isChest, isFurnace, isInteractive, TILE, isWater,
} from '../core/blocks';
import { ITEM, itemDef, isPlaceable, makeStack, ItemStack } from '../core/items';
import { isFarmAnimal } from '../core/entities';
import { clickSlot, insertStack, cloneStack, Slots, decrementSlot } from '../core/inventory';
import { matchRecipe } from '../core/recipes';
import {
  PLAYER_REACH, PLAYER_MAX_HP, PLAYER_MAX_FOOD, SEA_LEVEL, TICK_MS, PLAYER_WIDTH,
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
  private boat!: BoatModel;
  private heldView!: HeldItemView;
  private particles!: Particles;
  private particleColor = new THREE.Color();
  readonly sound = new SoundEngine();
  private wasInWater = false;
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
  private prevSneak = false;
  private lavaTimer = 0;
  private fireTicks = 0;
  private regenTimer = 0;
  private starveTimer = 0;
  private exhaustion = 0;
  private prevJump = false;
  private shake = 0;

  private spawn: [number, number, number] | null = null;
  private spawnPoint: [number, number, number] | null = null; // bed respawn
  // World persistence: journal of every block-ID change, replayed on resume.
  private editJournal = new Map<number, Map<number, number>>();
  private worldSeed = 0;
  private resumeData: SaveData | null = null;
  private resumeApplied = false;
  private autosaveAccum = 0;
  private spawnChunkSearched = false;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private workerStats = { entities: 0, tickMs: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    registerBridge({
      startWorld: (seedText) => this.start(seedText),
      continueWorld: () => {
        loadWorld().then((d) => {
          if (d) this.start(String(d.seed), d);
        });
      },
      respawn: () => this.respawn(),
      quitToTitle: () => {
        this.saveNow().finally(() => window.location.reload());
      },
      openScreen: (s) => this.openScreen(s),
      closeScreen: () => this.closeScreen(),
      invClick: (slot, button, shift) => this.invClick(slot, button, shift),
      armorClick: (slot) => this.armorClick(slot),
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
  start(seedText: string, resume: SaveData | null = null): void {
    const seed = /^-?\d+$/.test(seedText.trim())
      ? Number(seedText.trim()) >>> 0
      : hashSeed(seedText.trim() === '' ? String(Date.now()) : seedText.trim());
    this.worldSeed = seed;
    this.resumeData = resume;
    this.resumeApplied = false;
    this.editJournal.clear();
    if (resume) {
      for (const [key, flat] of Object.entries(resume.edits)) {
        const m = new Map<number, number>();
        for (let i = 0; i < flat.length; i += 2) m.set(flat[i], flat[i + 1]);
        this.editJournal.set(Number(key), m);
      }
    }

    gameStore.set({ phase: 'loading', loadProgress: 0 });

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87b5e5);
    // Scene fog covers Lambert-lit objects (mobs/boat/character); the terrain
    // shader has its own matching uFog uniforms. Kept in sync every frame.
    this.scene.fog = new THREE.Fog(0x87b5e5, 60, 120);
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
    // Journal every real block change for the save file.
    this.world.onBlockChanged = (x, y, z, id) => {
      const ck = chunkKeyNum(x >> 4, z >> 4);
      let m = this.editJournal.get(ck);
      if (!m) {
        m = new Map();
        this.editJournal.set(ck, m);
      }
      m.set(blockIndex(x & 15, y, z & 15), id);
    };
    this.chunks.onChunkReady = (msg: GenChunkMsg, copy: ArrayBuffer) => {
      this.logicWorker.postMessage(
        {
          t: 'chunk', cx: msg.cx, cz: msg.cz, data: copy,
          blockEntities: msg.blockEntities, mobs: msg.mobs, village: msg.village,
        } satisfies ToLogicMsg,
        [copy],
      );
      this.replayEdits(msg.cx, msg.cz);
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
    this.boat = new BoatModel();
    this.scene.add(this.boat.group);
    this.heldView = new HeldItemView(this.atlas, this.camera);
    this.particles = new Particles(this.scene);

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
    inv[1] = makeStack(ITEM.STONE_AXE, 1);
    inv[2] = makeStack(ITEM.STONE_SHOVEL, 1);
    inv[3] = makeStack(ITEM.WOOD_SWORD, 1);
    inv[4] = makeStack(B.TORCH, 16);
    inv[5] = makeStack(B.OAK_PLANKS, 24);
    inv[6] = makeStack(ITEM.BUCKET, 1);
    inv[7] = makeStack(ITEM.BOAT, 1);
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
    // Browsers only allow audio after a user gesture.
    const unlockAudio = () => this.sound.unlock();
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('pagehide', () => void this.saveNow());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') void this.saveNow();
    });
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
    this.env.uGamma.value = store.settings.brightness;
    if (this.player.headInFluid) {
      this.env.uFogNear.value = 2;
      this.env.uFogFar.value = this.player.inLava ? 6 : 24;
      this.env.uFogColor.value.setHex(this.player.inLava ? 0xc04808 : 0x1840a0);
    }
    if (this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.copy(this.env.uFogColor.value);
      this.scene.fog.near = this.env.uFogNear.value;
      this.scene.fog.far = this.env.uFogFar.value;
    }

    // Entities
    this.entityRenderer.update(
      this.world,
      this.dayNight.sunLevel,
      this.player.yaw,
      dt,
      this.player.x,
      this.player.z,
      this.env.uFogFar.value,
      store.settings.brightness,
    );
    this.particles.update(dt, this.world);

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

    // Autosave every 10 s of play.
    if (store.phase === 'playing') {
      this.autosaveAccum += dt;
      if (this.autosaveAccum >= 10) {
        this.autosaveAccum = 0;
        void this.saveNow();
      }
    }

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
        this.applyResume();
        gameStore.set({ phase: 'playing', loadProgress: 1 });
      }
    } else {
      gameStore.set({ loadProgress: this.chunks.isReady(0, 0) ? 0.4 : 0.1 });
    }
  }

  /** Restore player state from a save once the spawn area is meshed. */
  private applyResume(): void {
    if (!this.resumeData || this.resumeApplied) return;
    this.resumeApplied = true;
    const d = this.resumeData;
    this.player.teleport(d.player.x, d.player.y + 0.1, d.player.z);
    this.player.yaw = d.player.yaw;
    this.player.pitch = d.player.pitch;
    this.dayNight.time = d.time;
    this.spawnPoint = d.spawnPoint;
    gameStore.set({
      inventory: d.inventory.map(cloneStack),
      armor: (d.armor ?? new Array(4).fill(null)).map(cloneStack),
      hotbarIndex: d.hotbarIndex,
      health: d.player.health,
      food: d.player.food ?? PLAYER_MAX_FOOD,
    });
    this.sendLogic({ t: 'time', time: d.time });
    this.toast('Welcome back!');
  }

  /** Replay journaled edits onto a freshly generated chunk. */
  private replayEdits(cx: number, cz: number): void {
    const m = this.editJournal.get(chunkKeyNum(cx, cz));
    if (!m) return;
    const bx = cx * 16;
    const bz = cz * 16;
    for (const [idx, id] of m) {
      const x = bx + (idx & 15);
      const z = bz + ((idx >> 4) & 15);
      const y = idx >> 8;
      if (this.world.getBlockId(x, y, z) !== id) this.world.setBlock(x, y, z, id);
    }
  }

  /** Serialize the world state and write it to IndexedDB. */
  saveNow(): Promise<void> {
    const s = gameStore.get();
    if (s.phase !== 'playing' && s.phase !== 'dead') return Promise.resolve();
    const edits: Record<string, number[]> = {};
    for (const [key, m] of this.editJournal) {
      const flat: number[] = [];
      for (const [idx, id] of m) flat.push(idx, id);
      if (flat.length > 0) edits[String(key)] = flat;
    }
    return saveWorld({
      version: 1,
      seed: this.worldSeed,
      time: this.dayNight.time,
      player: {
        x: this.player.x, y: this.player.y, z: this.player.z,
        yaw: this.player.yaw, pitch: this.player.pitch,
        health: s.health, food: s.food,
      },
      spawnPoint: this.spawnPoint,
      inventory: s.inventory.map(cloneStack),
      armor: s.armor.map(cloneStack),
      hotbarIndex: s.hotbarIndex,
      edits,
      savedAt: Date.now(),
    });
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
    // Sneak dismounts the boat (edge-triggered so it doesn't immediately re-fire).
    if (this.player.inBoat && alive && !uiOpen && effInput.sneak && !this.prevSneak) {
      this.dismountBoat();
    }
    this.prevSneak = effInput.sneak;
    // Freeze physics while the chunk underfoot has no data yet — otherwise a
    // missing chunk reads as air and the player falls through unloaded terrain
    // (slow devices, fast boats). Look input above still applies.
    if (this.chunks.isReady(Math.floor(this.player.x) >> 4, Math.floor(this.player.z) >> 4)) {
      this.player.update(dt, this.world, effInput);
    }

    // Environmental damage
    this.updateHazards(dt, alive);

    // Interactions
    if (alive && !uiOpen) {
      if (this.player.inBoat) {
        // Boating: only steering + sneak-to-dismount; no mining / placement.
        this.outline.visible = false;
        this.stopMining();
      } else {
        this.updateMining(dt);
        this.updateUse(dt);
      }
    } else {
      this.stopMining();
    }
    this.updateBoatModel(dt);
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    this.eatCooldown = Math.max(0, this.eatCooldown - dt);
    this.prevMineHeld = input.mineHeld;

    // Exertion feeds the hunger drain: sprinting, swimming, jumping.
    if (alive && !uiOpen) {
      const moving = effInput.moveX !== 0 || effInput.moveZ !== 0;
      if (moving && effInput.sprint) this.exhaustion += dt * 0.5;
      else if (moving && this.player.inWater) this.exhaustion += dt * 0.25;
      else if (moving) this.exhaustion += dt * 0.06;
      if (effInput.jump && !this.prevJump && this.player.onGround) this.exhaustion += 0.2;
      this.prevJump = effInput.jump;
    }

    // Footsteps + sparse day/night ambience; splash on entering water.
    if (this.player.inWater && !this.wasInWater) this.sound.splash();
    this.wasInWater = this.player.inWater;
    const under = blockDef(
      this.world.getBlockId(Math.floor(this.player.x), Math.floor(this.player.y) - 1, Math.floor(this.player.z)),
    );
    this.sound.update(
      dt,
      this.dayNight.sunLevel > 0.6,
      alive && !uiOpen && !this.player.inBoat && (effInput.moveX !== 0 || effInput.moveZ !== 0),
      this.player.onGround,
      this.player.inWater,
      under.tool === 'pickaxe',
    );

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
    // Hunger drain: exhaustion accumulates from exertion, 4 points = 1 food.
    const s = gameStore.get();
    if (this.exhaustion >= 4) {
      this.exhaustion -= 4;
      if (s.food > 0) gameStore.set({ food: s.food - 1 });
    }
    const food = gameStore.get().food;
    const hp = gameStore.get().health;
    if (food >= 18 && hp > 0 && hp < PLAYER_MAX_HP) {
      // Well fed: regenerate quickly (costs a little hunger).
      this.regenTimer += dt;
      if (this.regenTimer >= 2) {
        this.regenTimer = 0;
        this.exhaustion += 1.5;
        gameStore.set({ health: Math.min(PLAYER_MAX_HP, hp + 1) });
      }
    } else if (food <= 0 && hp > 1) {
      // Starvation gnaws down to half a heart, never kills outright.
      this.starveTimer += dt;
      if (this.starveTimer >= 4) {
        this.starveTimer = 0;
        this.damagePlayer(1, 0, 0, 'starve');
      }
    } else {
      this.regenTimer = 0;
      this.starveTimer = 0;
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
    // Trickle a few fragments off the block face while mining.
    if (Math.random() < dt * 14) {
      const [pr, pg, pb] = this.atlas.sampleColor(def.tiles[4]);
      this.particleColor.setRGB(pr, pg, pb);
      this.particles.burst(
        hit.x + 0.5 + hit.nx * 0.5,
        hit.y + 0.5 + hit.ny * 0.5,
        hit.z + 0.5 + hit.nz * 0.5,
        this.particleColor,
        2,
      );
    }

    // Rhythmic dig thunks while mining.
    if (Math.random() < dt * 5) this.sound.dig(def.tool === 'pickaxe');

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
    // Break-particle burst coloured from the block's side texture.
    const [pr, pg, pb] = this.atlas.sampleColor(def.tiles[4]);
    this.particleColor.setRGB(pr, pg, pb);
    this.particles.burst(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5, this.particleColor);
    if (isChest(hit.id) || isFurnace(hit.id) || hit.id === B.HOPPER || hit.id === B.SPAWNER) {
      this.sendLogic({ t: 'breakBE', x: hit.x, y: hit.y, z: hit.z });
    }
    this.world.setBlock(hit.x, hit.y, hit.z, B.AIR);
    this.sound.breakBlock();
    this.exhaustion += 0.03;
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
    this.exhaustion += 0.1;
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

    // Feeding an animal (breeding) wins over eating when aiming at one.
    if (def.food) {
      const target = this.entityRenderer.pick(ox, oy, oz, dx, dy, dz, 3.2);
      if (target && isFarmAnimal(target.type) && (!hit || target.dist < hit.dist)) {
        this.sendLogic({ t: 'interactEntity', entityId: target.id, itemId: held.id });
        this.consumeHeld();
        this.sound.eat();
        this.heldView.swing();
        return;
      }
    }

    if (def.food && this.eatCooldown <= 0 && gameStore.get().food < PLAYER_MAX_FOOD) {
      this.eatCooldown = 1;
      gameStore.set({ food: Math.min(PLAYER_MAX_FOOD, gameStore.get().food + def.food) });
      this.consumeHeld();
      this.sound.eat();
      this.heldView.swing();
      return;
    }

    if (held.id === ITEM.BOAT) {
      this.mountBoat();
      return;
    }

    if (held.id === ITEM.BUCKET || held.id === ITEM.WATER_BUCKET || held.id === ITEM.LAVA_BUCKET) {
      if (this.useBucket(held.id, ox, oy, oz, dx, dy, dz)) return;
    }

    if (hit && isPlaceable(held.id)) {
      this.tryPlace(hit, held.id);
    }
  }

  /** Fill an empty bucket from a fluid source, or place a fluid source. */
  private useBucket(id: number, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number): boolean {
    if (id === ITEM.BUCKET) {
      // Fill: ray must hit a fluid SOURCE block.
      const hit = raycastBlocks(this.world, ox, oy, oz, dx, dy, dz, PLAYER_REACH, true);
      if (!hit) return false;
      let filled = -1;
      if (hit.id === B.WATER_SRC) filled = ITEM.WATER_BUCKET;
      else if (hit.id === B.LAVA_SRC) filled = ITEM.LAVA_BUCKET;
      if (filled < 0) return false;
      this.world.setBlock(hit.x, hit.y, hit.z, B.AIR);
      this.replaceHeld(makeStack(filled, 1));
      this.heldView.swing();
      return true;
    }
    // Place a source at the first empty/replaceable cell along the ray.
    const hit = raycastBlocks(this.world, ox, oy, oz, dx, dy, dz, PLAYER_REACH, true);
    if (!hit) return false;
    let px = hit.x;
    let py = hit.y;
    let pz = hit.z;
    if (!blockDef(this.world.getBlockId(px, py, pz)).replaceable) {
      px += hit.nx;
      py += hit.ny;
      pz += hit.nz;
    }
    if (py < 0 || py >= 256) return false;
    if (!blockDef(this.world.getBlockId(px, py, pz)).replaceable) return false;
    const src = id === ITEM.WATER_BUCKET ? B.WATER_SRC : B.LAVA_SRC;
    // setBlock emits a cell-change patch to the logic worker, which wakes the
    // fluid simulation at the new source so it starts flowing.
    this.world.setBlock(px, py, pz, src);
    this.replaceHeld(makeStack(ITEM.BUCKET, 1));
    this.heldView.swing();
    return true;
  }

  /** Enter boat mode: consume one boat, render the hull around the player. */
  private mountBoat(): void {
    if (this.player.inBoat) return;
    this.player.inBoat = true;
    this.boat.group.visible = true;
    this.consumeHeld();
    this.stopMining();
    this.toast('Boat — sneak to disembark');
  }

  /** Leave the boat: hop out and return the boat item to the inventory. */
  private dismountBoat(): void {
    if (!this.player.inBoat) return;
    this.player.inBoat = false;
    this.boat.group.visible = false;
    this.player.y += 0.25;
    this.player.vy = 2.4;
    const inv = gameStore.get().inventory.map(cloneStack);
    const rest = insertStack(inv, makeStack(ITEM.BOAT, 1));
    gameStore.set({ inventory: inv });
    if (rest) {
      this.sendLogic({
        t: 'spawnItem', x: this.player.x, y: this.player.y + 0.5, z: this.player.z,
        stack: rest, vx: 0, vy: 0.5, vz: 0,
      });
    }
  }

  /** Position + light the boat hull each frame while riding. */
  private updateBoatModel(dt: number): void {
    if (!this.player.inBoat) {
      this.boat.group.visible = false;
      return;
    }
    this.boat.group.visible = true;
    const speed = Math.hypot(this.player.vx, this.player.vz);
    const v = this.world.getVoxel(
      Math.floor(this.player.x),
      Math.floor(this.player.y + 0.5),
      Math.floor(this.player.z),
    );
    const bright = Math.max(
      0.12,
      Math.max((((v >> 8) & 0xf) / 15) * this.dayNight.sunLevel, ((v >> 12) & 0xf) / 15),
    );
    this.boat.update(this.player.x, this.player.y - 0.05, this.player.z, this.player.yaw, speed, bright, dt);
  }

  /** Replace the held stack (decrement one, give a replacement item). */
  private replaceHeld(replacement: ItemStack): void {
    const s = gameStore.get();
    const inv = s.inventory.map(cloneStack);
    const held = inv[s.hotbarIndex];
    if (!held) return;
    if (held.count <= 1) {
      inv[s.hotbarIndex] = replacement;
    } else {
      held.count--;
      const rest = insertStack(inv, replacement);
      if (rest) {
        this.sendLogic({
          t: 'spawnItem', x: this.player.x, y: this.player.y + 0.5, z: this.player.z,
          stack: rest, vx: 0, vy: 0.5, vz: 0,
        });
      }
    }
    gameStore.set({ inventory: inv });
  }

  private interactWith(hit: RayHit): void {
    if (hit.id === B.CRAFTING_TABLE) {
      this.openScreen('crafting');
      return;
    }
    if (hit.id === B.BED) {
      this.trySleep(hit);
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
    this.sound.place();
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
        this.sound.explosion();
        break;
      }
      case 'stats':
        this.workerStats = { entities: msg.entities, tickMs: msg.tickMs };
        break;
    }
  }

  /** Total protection points from worn armor (0..20). */
  private armorPoints(): number {
    let pts = 0;
    for (const piece of gameStore.get().armor) {
      if (piece) pts += itemDef(piece.id).armor?.points ?? 0;
    }
    return Math.min(20, pts);
  }

  damagePlayer(amount: number, kx: number, kz: number, cause: string): void {
    if (amount <= 0) return;
    const s = gameStore.get();
    if (s.phase !== 'playing') return;
    // Armor absorbs physical damage (4% per point); starving/drowning bypass.
    if (cause !== 'starve' && cause !== 'drown') {
      amount = Math.max(1, Math.round(amount * (1 - this.armorPoints() * 0.04)));
    }
    const hp = Math.max(0, s.health - amount);
    gameStore.set({ health: hp });
    this.sound.hurt();
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
    const sp = this.spawnPoint ?? this.spawn ?? [8.5, 90, 8.5];
    this.player.inBoat = false;
    this.boat.group.visible = false;
    this.player.teleport(sp[0], sp[1], sp[2]);
    this.fireTicks = 0;
    this.exhaustion = 0;
    gameStore.set({ phase: 'playing', health: PLAYER_MAX_HP, food: PLAYER_MAX_FOOD });
  }

  /** Bed interaction: at night, skip to dawn and set the respawn point. */
  private trySleep(hit: RayHit): void {
    const alt = Math.sin(this.dayNight.time * Math.PI * 2);
    if (alt > -0.04) {
      this.toast('You can only sleep at night');
      return;
    }
    if (this.entityRenderer.hostileNear(this.player.x, this.player.z, 10)) {
      this.toast('You may not rest now — monsters are nearby!');
      return;
    }
    this.spawnPoint = [hit.x + 0.5, hit.y + 1.1, hit.z + 0.5];
    this.sound.sleep();
    gameStore.set({ sleeping: true });
    window.setTimeout(() => {
      if (gameStore.get().phase !== 'playing') {
        gameStore.set({ sleeping: false });
        return;
      }
      this.dayNight.time = 0.02; // just after dawn
      this.sendLogic({ t: 'time', time: this.dayNight.time });
      gameStore.set({ sleeping: false });
      this.toast('Rise and shine!');
    }, 900);
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
    this.sound.click();
    // Clear held-action state: on touch the overlay unmounts before its
    // touchend fires, which would otherwise leave use/mine latched and
    // instantly re-open the screen after closing it.
    input.useHeld = false;
    input.useClicked = false;
    input.mineHeld = false;
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
    // Grace period so any stale use-press can't re-open a screen this frame.
    input.useHeld = false;
    input.useClicked = false;
    this.useRepeat = 0.3;
  }

  private setPaused(paused: boolean): void {
    if (paused) this.openScreen('pause');
    else this.closeScreen();
  }

  /** Armor slot click: swap with the cursor when the piece fits the slot. */
  private armorClick(slot: number): void {
    const s = gameStore.get();
    if (slot < 0 || slot > 3) return;
    const armor = s.armor.map(cloneStack);
    const cur = cloneStack(s.cursor);
    const worn = armor[slot];
    if (cur) {
      const def = itemDef(cur.id);
      if (def.armor?.slot !== slot) return; // wrong piece for this slot
      armor[slot] = cur;
      gameStore.set({ armor, cursor: worn ?? null });
    } else if (worn) {
      armor[slot] = null;
      gameStore.set({ armor, cursor: worn });
    }
    this.sound.click();
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
      const stack = inv[slot]!;
      // Shift-click armor: equip straight into its slot when free.
      const armorDef = itemDef(stack.id).armor;
      if (armorDef && !s.armor[armorDef.slot]) {
        const armor = s.armor.map(cloneStack);
        armor[armorDef.slot] = stack;
        inv[slot] = null;
        gameStore.set({ inventory: inv, armor });
        return;
      }
      // Shift-click: hotbar <-> main storage
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
    this.sound.setVolume(s.soundVolume);
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
    this.particles?.dispose();
    this.renderer?.dispose();
  }
}

/** Convenience hook for App bootstrap. */
export function createGame(canvas: HTMLCanvasElement): Game {
  const game = new Game(canvas);
  void useGameStore; // store side effects loaded with the engine
  return game;
}
