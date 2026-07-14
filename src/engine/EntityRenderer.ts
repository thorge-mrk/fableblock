/**
 * Main-thread entity presentation: builds box-part mob models, interpolates
 * 20 TPS logic-worker snapshots up to render rate, animates limbs, tints
 * models by local voxel light and runs the attack ray vs entity AABBs.
 */
import * as THREE from 'three';
import { SNAP_STRIDE } from '../net/messages';
import { EntityType, ENTITY_DEFS, AnimFlag } from '../core/entities';
import { World } from '../core/world';
import { itemDef, isPlaceable } from '../core/items';
import { blockDef, TILE_PX, CELL_PX, TILE_GUTTER, ATLAS_SIZE } from '../core/blocks';
import { TextureAtlas } from './TextureAtlas';

interface RenderEntity {
  id: number;
  type: EntityType;
  group: THREE.Group;
  parts: Partial<Record<'head' | 'body' | 'armL' | 'armR' | 'legL' | 'legR' | 'extra', THREE.Object3D>>;
  materials: THREE.MeshLambertMaterial[];
  baseColors: THREE.Color[];
  fire: THREE.Mesh | null;
  // Interpolation state
  px: number; py: number; pz: number; pyaw: number;
  cx: number; cy: number; cz: number; cyaw: number;
  hp: number;
  hurt: number;
  anim: number;
  a: number;
  b: number;
  pitch: number;
  limbPhase: number;
  seen: boolean;
  itemId: number;
}

const FACE_TEX_CACHE = new Map<string, THREE.Texture>();

function faceTexture(kind: string): THREE.Texture {
  let tex = FACE_TEX_CACHE.get(kind);
  if (tex) return tex;
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const g = c.getContext('2d')!;
  const fill = (color: string) => {
    g.fillStyle = color;
    g.fillRect(0, 0, 16, 16);
  };
  const px = (x: number, y: number, w: number, h: number, color: string) => {
    g.fillStyle = color;
    g.fillRect(x, y, w, h);
  };
  switch (kind) {
    case 'zombie':
      fill('#44a044');
      px(3, 6, 3, 2, '#1c2c1c');
      px(10, 6, 3, 2, '#1c2c1c');
      px(6, 10, 4, 3, '#2a4a2a');
      break;
    case 'skeleton':
      fill('#bdbdbd');
      px(3, 6, 3, 2, '#3a3a3a');
      px(10, 6, 3, 2, '#3a3a3a');
      px(5, 11, 6, 2, '#7a7a7a');
      for (let i = 5; i < 11; i += 2) px(i, 11, 1, 2, '#3a3a3a');
      break;
    case 'creeper':
      fill('#54c454');
      px(3, 5, 4, 4, '#101810');
      px(9, 5, 4, 4, '#101810');
      px(6, 8, 4, 5, '#101810');
      px(5, 11, 2, 4, '#101810');
      px(9, 11, 2, 4, '#101810');
      break;
    case 'sheep':
      fill('#e8d8d0');
      px(3, 7, 3, 2, '#1c1c2c');
      px(10, 7, 3, 2, '#1c1c2c');
      px(6, 12, 4, 2, '#caa');
      break;
    case 'villager':
      fill('#c8a078');
      px(3, 6, 3, 2, '#2c4c2c');
      px(10, 6, 3, 2, '#2c4c2c');
      px(6, 8, 4, 6, '#a07850'); // big nose
      break;
    case 'golem':
      fill('#cfc6b8');
      px(3, 6, 3, 3, '#503830');
      px(10, 6, 3, 3, '#503830');
      px(6, 9, 4, 6, '#8a7a6a');
      break;
    case 'cow':
      fill('#5a4436');
      px(3, 6, 3, 2, '#1c1410');
      px(10, 6, 3, 2, '#1c1410');
      px(5, 10, 6, 5, '#d8c8bc'); // muzzle
      px(6, 11, 1, 2, '#3c2c22');
      px(9, 11, 1, 2, '#3c2c22');
      px(0, 2, 3, 2, '#d8c8bc'); // horns
      px(13, 2, 3, 2, '#d8c8bc');
      break;
    case 'pig':
      fill('#eea4a4');
      px(3, 6, 3, 2, '#28181c');
      px(10, 6, 3, 2, '#28181c');
      px(5, 9, 6, 4, '#d97f7f'); // snout
      px(6, 10, 1, 2, '#69333c');
      px(9, 10, 1, 2, '#69333c');
      break;
    case 'chicken':
      fill('#e8e4dc');
      px(4, 6, 2, 2, '#181818');
      px(10, 6, 2, 2, '#181818');
      px(6, 9, 4, 3, '#e8b83c'); // beak
      px(6, 12, 4, 3, '#c84040'); // wattle
      break;
    case 'player':
      fill('#d8a888');
      px(3, 6, 3, 2, '#3858c8');
      px(10, 6, 3, 2, '#3858c8');
      px(6, 11, 4, 2, '#a87858');
      px(0, 0, 16, 4, '#5a3a22'); // hair
      px(0, 4, 2, 3, '#5a3a22');
      px(14, 4, 2, 3, '#5a3a22');
      break;
    default:
      fill('#c88');
  }
  tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  FACE_TEX_CACHE.set(kind, tex);
  return tex;
}

let FIRE_TEX: THREE.Texture | null = null;
/** Procedural tileable flame texture (vertical) shared by all burning mobs. */
function fireTexture(): THREE.Texture {
  if (FIRE_TEX) return FIRE_TEX;
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const g = c.getContext('2d')!;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      // Flame tongues: brightest at the bottom centre, fading up and outward.
      const cx = Math.abs(x - 7.5) / 8;
      const up = y / 15;
      const flame = (1 - up) * (1 - cx * cx) + Math.sin(x * 1.7 + y) * 0.06;
      let r = 0;
      let gr = 0;
      let b = 0;
      let a = 0;
      if (flame > 0.18) {
        a = Math.min(1, flame * 1.6);
        r = 255;
        gr = flame > 0.6 ? 230 : 140;
        b = flame > 0.8 ? 120 : 20;
      }
      const i = (y * 16 + x) * 4;
      g.fillStyle = `rgba(${r},${gr},${b},${a})`;
      g.fillRect(x, y, 1, 1);
      void i;
    }
  }
  FIRE_TEX = new THREE.CanvasTexture(c);
  FIRE_TEX.magFilter = THREE.NearestFilter;
  FIRE_TEX.minFilter = THREE.NearestFilter;
  FIRE_TEX.wrapT = THREE.RepeatWrapping;
  return FIRE_TEX;
}

export class EntityRenderer {
  readonly group = new THREE.Group();
  private entities = new Map<number, RenderEntity>();
  private dying: Array<{ e: RenderEntity; t: number }> = [];
  private camX = 0;
  private camZ = 0;
  private lastSnapAt = 0;
  private atlas: TextureAtlas;
  private blockGeoCache = new Map<number, THREE.BufferGeometry>();
  private iconGeoCache = new Map<number, THREE.BufferGeometry>();

  constructor(atlas: TextureAtlas) {
    this.atlas = atlas;
  }

  count(): number {
    return this.entities.size;
  }

  applySnapshot(buf: Float32Array, count: number): void {
    this.lastSnapAt = performance.now();
    for (const e of this.entities.values()) e.seen = false;
    for (let i = 0; i < count; i++) {
      const o = i * SNAP_STRIDE;
      const id = buf[o];
      const type = buf[o + 1] as EntityType;
      // Final death frame (hp <= 0): hand the model to the fall-over anim.
      if (buf[o + 7] <= 0 && type !== EntityType.ITEM && type !== EntityType.ARROW) {
        const victim = this.entities.get(id);
        if (victim) {
          this.entities.delete(id);
          this.startDying(victim);
        }
        continue;
      }
      let e = this.entities.get(id);
      if (!e || e.type !== type) {
        if (e) this.remove(e);
        e = this.create(id, type, buf[o + 2], buf[o + 3], buf[o + 4], buf[o + 5], buf[o + 10]);
        this.entities.set(id, e);
      }
      // Previous interpolation target becomes the new start.
      e.px = e.cx; e.py = e.cy; e.pz = e.cz; e.pyaw = e.cyaw;
      e.cx = buf[o + 2];
      e.cy = buf[o + 3];
      e.cz = buf[o + 4];
      e.cyaw = buf[o + 5];
      e.pitch = buf[o + 6];
      e.hp = buf[o + 7];
      e.hurt = buf[o + 8];
      e.anim = buf[o + 9];
      e.a = buf[o + 10];
      e.b = buf[o + 11];
      e.seen = true;
    }
    for (const e of [...this.entities.values()]) {
      if (!e.seen) {
        this.remove(e);
        this.entities.delete(e.id);
      }
    }
  }

  /** Per-frame interpolation + animation + light tinting. */
  update(
    world: World,
    sunLevel: number,
    cameraYaw: number,
    dt: number,
    camX = 0,
    camZ = 0,
    fogFar = Infinity,
    gamma = 1,
  ): void {
    const alpha = Math.min(1.2, (performance.now() - this.lastSnapAt) / 50);
    const cullDist = fogFar + 8;
    const cullSq = cullDist * cullDist;
    this.camX = camX;
    this.camZ = camZ;

    // Fall-over + fade for freshly killed mobs, then dispose.
    for (let i = this.dying.length - 1; i >= 0; i--) {
      const d = this.dying[i];
      d.t += dt;
      const f = Math.min(1, d.t / 0.45);
      d.e.group.rotation.z = f * Math.PI * 0.5;
      d.e.group.position.y += dt * -0.2;
      for (const m of d.e.materials) m.opacity = 1 - f * 0.9;
      if (d.t >= 0.5) {
        this.remove(d.e);
        this.dying.splice(i, 1);
      }
    }

    for (const e of this.entities.values()) {
      const x = e.px + (e.cx - e.px) * alpha;
      const y = e.py + (e.cy - e.py) * alpha;
      const z = e.pz + (e.cz - e.pz) * alpha;
      // Beyond the fog wall: skip animation work and hide entirely.
      const ddx = x - camX;
      const ddz = z - camZ;
      const visible = ddx * ddx + ddz * ddz < cullSq;
      e.group.visible = visible;
      if (!visible) continue;
      let dyaw = e.cyaw - e.pyaw;
      if (dyaw > Math.PI) dyaw -= Math.PI * 2;
      if (dyaw < -Math.PI) dyaw += Math.PI * 2;
      const yaw = e.pyaw + dyaw * alpha;
      e.group.position.set(x, y, z);
      e.group.rotation.y = yaw;

      // Light tint.
      const v = world.getVoxel(Math.floor(x), Math.floor(y + 0.5), Math.floor(z));
      const sun = ((v >> 8) & 0xf) / 15;
      const bl = ((v >> 12) & 0xf) / 15;
      let bright = Math.max(0.14, Math.pow(Math.max(sun * sunLevel, bl), 1.15));
      bright = Math.pow(Math.min(1, bright), 1 / gamma);
      const hurtF = e.hurt > 0 ? 1 : 0;
      const flash =
        e.type === EntityType.CREEPER && e.a > 0
          ? (Math.sin(performance.now() / 60) * 0.5 + 0.5) * e.a
          : 0;
      for (let i = 0; i < e.materials.length; i++) {
        const m = e.materials[i];
        const c = e.baseColors[i];
        m.color.setRGB(
          Math.min(1, c.r * bright + flash),
          Math.min(1, c.g * bright + flash),
          Math.min(1, c.b * bright + flash),
        );
        m.emissive.setRGB(hurtF * 0.45, 0, 0);
        if ((e.anim & AnimFlag.BURNING) !== 0) {
          m.emissive.setRGB(0.7, 0.3, 0.05);
        }
      }

      // Fire animation overlay for burning mobs (daytime zombie/skeleton burn).
      this.updateFire(e, (e.anim & AnimFlag.BURNING) !== 0, cameraYaw);

      this.animate(e, x, z, yaw, cameraYaw, dt, alpha);
    }
  }

  /** Show/animate flickering flame quads on a burning mob. */
  private updateFire(e: RenderEntity, burning: boolean, cameraYaw: number): void {
    if (!burning) {
      if (e.fire) e.fire.visible = false;
      return;
    }
    const def = ENTITY_DEFS[e.type];
    if (!e.fire) {
      const geo = new THREE.PlaneGeometry(def.width * 1.9, def.height * 1.25);
      const mat = new THREE.MeshBasicMaterial({
        map: fireTexture(),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      e.fire = new THREE.Mesh(geo, mat);
      e.fire.position.y = def.height * 0.55;
      e.fire.renderOrder = 20;
      e.group.add(e.fire);
    }
    e.fire.visible = true;
    // Counter-rotate so the billboard faces the camera (group is yaw-rotated).
    e.fire.rotation.y = -e.group.rotation.y + cameraYaw;
    // Flicker via UV scroll on the texture + slight vertical scale wobble.
    const t = performance.now() / 1000;
    const mat = e.fire.material as THREE.MeshBasicMaterial;
    if (mat.map) {
      mat.map.offset.y = (t * 2.2) % 1;
      mat.map.needsUpdate = false;
    }
    e.fire.scale.y = 1 + Math.sin(t * 18 + e.id) * 0.12;
    mat.opacity = 0.82 + Math.sin(t * 26 + e.id) * 0.12;
  }

  private animate(e: RenderEntity, x: number, z: number, yaw: number, cameraYaw: number, dt: number, alpha: number): void {
    void alpha;
    const speed = Math.hypot(e.cx - e.px, e.cz - e.pz) / 0.05; // blocks/sec
    e.limbPhase += speed * dt * 2.2;
    const speedF = Math.min(1, speed / 3);
    const swing = Math.sin(e.limbPhase) * speedF * 0.7;
    const p = e.parts;
    const isWalker = e.type !== EntityType.ITEM && e.type !== EntityType.ARROW;
    if (isWalker) {
      // Gait bob + subtle torso roll instead of gliding rigidly.
      e.group.position.y += Math.abs(Math.sin(e.limbPhase)) * speedF * 0.045;
      e.group.rotation.z = Math.sin(e.limbPhase) * speedF * 0.03;
    }
    if (p.legL) p.legL.rotation.x = swing;
    if (p.legR) p.legR.rotation.x = -swing;
    if (e.type === EntityType.ZOMBIE) {
      if (p.armL) p.armL.rotation.x = -Math.PI / 2 + Math.sin(e.limbPhase * 0.7) * 0.1;
      if (p.armR) p.armR.rotation.x = -Math.PI / 2 - Math.sin(e.limbPhase * 0.7) * 0.1;
    } else if (e.type === EntityType.SKELETON) {
      // Bow drawn: both arms raised toward the look direction.
      if (p.armL) p.armL.rotation.x = -1.25 + Math.sin(e.limbPhase * 0.5) * 0.05;
      if (p.armR) p.armR.rotation.x = -1.35;
    } else if (e.type === EntityType.VILLAGER) {
      // Hands folded across the belly.
      if (p.armL) p.armL.rotation.x = -1.35;
      if (p.armR) p.armR.rotation.x = -1.35;
    } else if (e.type === EntityType.IRON_GOLEM && (e.anim & AnimFlag.ATTACKING) !== 0) {
      if (p.armL) p.armL.rotation.x = -Math.PI * 0.8;
      if (p.armR) p.armR.rotation.x = -Math.PI * 0.8;
    } else {
      if (p.armL) p.armL.rotation.x = -swing;
      if (p.armR) p.armR.rotation.x = swing;
    }

    // Sheep wool coat follows the sheared flag.
    if (e.type === EntityType.SHEEP && p.extra) {
      p.extra.visible = (e.anim & AnimFlag.SHEARED) === 0;
    }

    // Creeper: swelling pulse while the fuse burns.
    if (e.type === EntityType.CREEPER) {
      const s = e.a > 0 ? 1 + e.a * 0.1 * (0.5 + 0.5 * Math.sin(performance.now() / 45)) : 1;
      e.group.scale.setScalar(s);
    } else {
      // Babies render at ~half size.
      e.group.scale.setScalar((e.anim & AnimFlag.BABY) !== 0 ? 0.55 : 1);
    }

    if (e.type === EntityType.SHEEP && (e.anim & AnimFlag.ATTACKING) !== 0 && p.head) {
      p.head.rotation.x = 0.9; // grazing
    } else if (p.head) {
      p.head.rotation.x = e.pitch * 0.6 + (e.type === EntityType.ZOMBIE ? 0.2 : 0);
      // Villagers turn their head toward a nearby player.
      if (e.type === EntityType.VILLAGER) {
        const dx = this.camX - x;
        const dz = this.camZ - z;
        let target = 0;
        if (dx * dx + dz * dz < 36) {
          let rel = Math.atan2(-dx, -dz) - yaw;
          while (rel > Math.PI) rel -= Math.PI * 2;
          while (rel < -Math.PI) rel += Math.PI * 2;
          target = Math.max(-0.8, Math.min(0.8, rel));
        }
        p.head.rotation.y += (target - p.head.rotation.y) * Math.min(1, dt * 8);
      }
    }
    if (e.type === EntityType.ITEM) {
      // Bob + spin; billboard icons toward the camera.
      e.group.rotation.y = e.itemId >= 256 ? cameraYaw : performance.now() / 900;
      e.group.position.y += 0.12 + Math.sin(performance.now() / 420 + e.id) * 0.06;
    }
    if (e.type === EntityType.ARROW) {
      e.group.rotation.order = 'YXZ';
      e.group.rotation.y = yaw;
      e.group.rotation.x = e.pitch;
    }
  }

  /** Any hostile mob within r blocks (horizontal) of the point? */
  hostileNear(x: number, z: number, r: number): boolean {
    for (const e of this.entities.values()) {
      if (!ENTITY_DEFS[e.type].hostile) continue;
      const dx = e.cx - x;
      const dz = e.cz - z;
      if (dx * dx + dz * dz < r * r) return true;
    }
    return false;
  }

  /** Nearest mob hit by the attack ray, or null. */
  pick(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number):
    { id: number; dist: number; type: EntityType } | null {
    let best: { id: number; dist: number; type: EntityType } | null = null;
    for (const e of this.entities.values()) {
      if (e.type === EntityType.ITEM || e.type === EntityType.ARROW) continue;
      const def = ENTITY_DEFS[e.type];
      const hw = def.width / 2 + 0.1;
      const t = rayAABB(
        ox, oy, oz, dx, dy, dz,
        e.cx - hw, e.cy - 0.1, e.cz - hw,
        e.cx + hw, e.cy + def.height + 0.1, e.cz + hw,
      );
      if (t !== null && t <= maxDist && (!best || t < best.dist)) {
        best = { id: e.id, dist: t, type: e.type };
      }
    }
    return best;
  }

  // -------------------------------------------------------------------------
  // Model factories
  // -------------------------------------------------------------------------
  private create(id: number, type: EntityType, x: number, y: number, z: number, yaw: number, a: number): RenderEntity {
    const group = new THREE.Group();
    const e: RenderEntity = {
      id, type, group, parts: {}, materials: [], baseColors: [], fire: null,
      px: x, py: y, pz: z, pyaw: yaw,
      cx: x, cy: y, cz: z, cyaw: yaw,
      hp: 0, hurt: 0, anim: 0, a, b: 0, pitch: 0, limbPhase: Math.random() * 10, seen: true,
      itemId: a,
    };
    switch (type) {
      case EntityType.ZOMBIE: {
        buildHumanoid(e, { skin: 0x44a044, shirt: 0x2c6c8c, pants: 0x3c5c8c, face: 'zombie' });
        // Tattered rags: darker patches hanging off the torso and one leg.
        const body = e.parts.body as THREE.Mesh;
        const rag1 = partBox(e, 0.2, 0.22, 0.06, 0x1e4a60);
        rag1.position.set(-0.14, -0.46, -0.14);
        body.add(rag1);
        const rag2 = partBox(e, 0.16, 0.3, 0.06, 0x24384a);
        rag2.position.set(0.16, -0.5, 0.14);
        body.add(rag2);
        const legR = e.parts.legR as THREE.Group;
        const rag3 = partBox(e, 0.24, 0.14, 0.24, 0x2c4468);
        rag3.position.set(0, -0.68, 0);
        legR.add(rag3);
        break;
      }
      case EntityType.SKELETON: {
        buildHumanoid(e, { skin: 0xbdbdbd, shirt: 0x9a9a9a, pants: 0x8a8a8a, face: 'skeleton', thin: true });
        // Simple bow held in the right hand: an arc of three slats + string.
        const bow = new THREE.Group();
        const mid = partBox(e, 0.05, 0.3, 0.05, 0x7a5a32);
        bow.add(mid);
        const top = partBox(e, 0.05, 0.18, 0.05, 0x6a4c28);
        top.position.set(0, 0.21, 0.06);
        top.rotation.x = 0.6;
        bow.add(top);
        const bottom = partBox(e, 0.05, 0.18, 0.05, 0x6a4c28);
        bottom.position.set(0, -0.21, 0.06);
        bottom.rotation.x = -0.6;
        bow.add(bottom);
        const string = partBox(e, 0.015, 0.52, 0.015, 0xe8e8e0);
        string.position.z = 0.1;
        bow.add(string);
        bow.position.set(0, -0.62, -0.06);
        (e.parts.armR as THREE.Group).add(bow);
        break;
      }
      case EntityType.VILLAGER: {
        buildHumanoid(e, { skin: 0xc8a078, shirt: 0x7a5c44, pants: 0x5c4434, face: 'villager', robe: true });
        // Iconic protruding nose.
        const head = e.parts.head as THREE.Group;
        const nose = partBox(e, 0.14, 0.26, 0.16, 0xb78a64);
        nose.position.set(0, 0.2, -0.3);
        head.add(nose);
        break;
      }
      case EntityType.CREEPER:
        buildCreeper(e);
        break;
      case EntityType.SHEEP:
        buildSheep(e);
        break;
      case EntityType.COW:
        buildQuadruped(e, {
          body: 0x5a4436, legs: 0x4a3830, headColor: 0x5a4436, face: 'cow',
          bodyW: 0.9, bodyH: 0.75, bodyL: 1.3, legH: 0.65, headSize: 0.5,
          extras: (g, ee) => {
            // White belly patch + udder.
            const patch = partBox(ee, 0.7, 0.2, 0.9, 0xe4d8cc);
            patch.position.set(0, 0.62, 0.05);
            g.add(patch);
          },
        });
        break;
      case EntityType.PIG:
        buildQuadruped(e, {
          body: 0xeea4a4, legs: 0xd98f8f, headColor: 0xeea4a4, face: 'pig',
          bodyW: 0.8, bodyH: 0.6, bodyL: 1.1, legH: 0.35, headSize: 0.45,
        });
        break;
      case EntityType.CHICKEN:
        buildChicken(e);
        break;
      case EntityType.IRON_GOLEM:
        buildGolem(e);
        break;
      case EntityType.ARROW:
        buildArrow(e);
        break;
      case EntityType.ITEM:
        this.buildItem(e, a);
        break;
    }
    group.position.set(x, y, z);
    this.group.add(group);
    return e;
  }

  private buildItem(e: RenderEntity, itemId: number): void {
    const def = itemDef(itemId);
    if (isPlaceable(itemId)) {
      let geo = this.blockGeoCache.get(itemId);
      if (!geo) {
        geo = blockItemGeometry(itemId);
        this.blockGeoCache.set(itemId, geo);
      }
      const mat = new THREE.MeshLambertMaterial({ map: this.atlas.texture, alphaTest: 0.4 });
      const mesh = new THREE.Mesh(geo, mat);
      e.group.add(mesh);
      e.materials.push(mat);
      e.baseColors.push(new THREE.Color(1, 1, 1));
    } else {
      let geo = this.iconGeoCache.get(def.icon);
      if (!geo) {
        geo = iconQuadGeometry(def.icon);
        this.iconGeoCache.set(def.icon, geo);
      }
      const mat = new THREE.MeshLambertMaterial({
        map: this.atlas.texture,
        alphaTest: 0.3,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      e.group.add(mesh);
      e.materials.push(mat);
      e.baseColors.push(new THREE.Color(1, 1, 1));
    }
  }

  private startDying(e: RenderEntity): void {
    if (e.fire) e.fire.visible = false;
    for (const m of e.materials) {
      m.transparent = true;
      m.depthWrite = false;
      m.emissive.setRGB(0.35, 0, 0);
    }
    this.dying.push({ e, t: 0 });
  }

  private remove(e: RenderEntity): void {
    this.group.remove(e.group);
    for (const m of e.materials) m.dispose();
    if (e.fire) (e.fire.material as THREE.Material).dispose();
    e.group.traverse((o) => {
      if (o instanceof THREE.Mesh && !this.isCachedGeo(o.geometry)) o.geometry.dispose();
    });
  }

  private isCachedGeo(geo: THREE.BufferGeometry): boolean {
    for (const g of this.blockGeoCache.values()) if (g === geo) return true;
    for (const g of this.iconGeoCache.values()) if (g === geo) return true;
    return false;
  }

  dispose(): void {
    for (const e of [...this.entities.values()]) this.remove(e);
    this.entities.clear();
    for (const d of this.dying) this.remove(d.e);
    this.dying.length = 0;
    for (const g of this.blockGeoCache.values()) g.dispose();
    for (const g of this.iconGeoCache.values()) g.dispose();
  }
}

// ---------------------------------------------------------------------------
// Shared part helpers
// ---------------------------------------------------------------------------
export interface HumanoidSkin {
  skin: number;
  shirt: number;
  pants: number;
  face: string;
  thin?: boolean;
  robe?: boolean;
}

function partBox(
  e: { materials: THREE.MeshLambertMaterial[]; baseColors: THREE.Color[] },
  w: number, h: number, d: number,
  color: number,
  faceTex?: THREE.Texture,
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  let mats: THREE.MeshLambertMaterial | THREE.MeshLambertMaterial[];
  if (faceTex) {
    const side = new THREE.MeshLambertMaterial({ color });
    const front = new THREE.MeshLambertMaterial({ map: faceTex });
    // BoxGeometry order: +x,-x,+y,-y,+z,-z — model faces -Z.
    mats = [side, side, side, side, side, front];
    e.materials.push(side, front);
    e.baseColors.push(new THREE.Color(color), new THREE.Color(1, 1, 1));
  } else {
    mats = new THREE.MeshLambertMaterial({ color });
    e.materials.push(mats);
    e.baseColors.push(new THREE.Color(color));
  }
  return new THREE.Mesh(geo, mats);
}

export function buildHumanoid(e: RenderEntity | { group: THREE.Group; parts: Record<string, THREE.Object3D>; materials: THREE.MeshLambertMaterial[]; baseColors: THREE.Color[] }, skin: HumanoidSkin): void {
  const armW = skin.thin ? 0.12 : 0.25;
  const g = e.group;
  const head = new THREE.Group();
  const headBox = partBox(e, 0.5, 0.5, 0.5, skin.skin, faceTexture(skin.face));
  headBox.position.y = 0.25;
  head.add(headBox);
  head.position.y = 1.5;
  g.add(head);

  const body = partBox(e, skin.robe ? 0.56 : 0.5, 0.75, 0.3, skin.shirt);
  body.position.y = 1.5 - 0.375;
  g.add(body);

  const mkArm = (sign: number) => {
    const pivot = new THREE.Group();
    const arm = partBox(e, armW, 0.75, armW, skin.robe ? skin.shirt : skin.skin);
    arm.position.y = -0.3;
    pivot.add(arm);
    pivot.position.set(sign * (0.25 + armW / 2 + 0.02), 1.45, 0);
    g.add(pivot);
    return pivot;
  };
  const mkLeg = (sign: number) => {
    const pivot = new THREE.Group();
    const leg = partBox(e, 0.22, 0.75, 0.22, skin.pants);
    leg.position.y = -0.375;
    pivot.add(leg);
    pivot.position.set(sign * 0.13, 0.75, 0);
    g.add(pivot);
    return pivot;
  };
  (e.parts as Record<string, THREE.Object3D>).head = head;
  (e.parts as Record<string, THREE.Object3D>).body = body;
  (e.parts as Record<string, THREE.Object3D>).armL = mkArm(-1);
  (e.parts as Record<string, THREE.Object3D>).armR = mkArm(1);
  (e.parts as Record<string, THREE.Object3D>).legL = mkLeg(-1);
  (e.parts as Record<string, THREE.Object3D>).legR = mkLeg(1);
}

function buildCreeper(e: RenderEntity): void {
  const g = e.group;
  const head = new THREE.Group();
  const hb = partBox(e, 0.5, 0.5, 0.5, 0x54c454, faceTexture('creeper'));
  hb.position.y = 0.25;
  head.add(hb);
  head.position.y = 1.2;
  g.add(head);
  const body = partBox(e, 0.5, 0.9, 0.3, 0x46a846);
  body.position.y = 0.75;
  g.add(body);
  for (const [sx, sz] of [[-0.13, 0.18], [0.13, 0.18], [-0.13, -0.18], [0.13, -0.18]] as const) {
    const pivot = new THREE.Group();
    const leg = partBox(e, 0.22, 0.3, 0.24, 0x3c903c);
    leg.position.y = -0.15;
    pivot.add(leg);
    pivot.position.set(sx, 0.3, sz);
    g.add(pivot);
    if (!e.parts.legL) e.parts.legL = pivot;
    else if (!e.parts.legR) e.parts.legR = pivot;
  }
  e.parts.head = head;
}

function buildSheep(e: RenderEntity): void {
  const g = e.group;
  const body = partBox(e, 0.8, 0.7, 1.2, 0xd8b8a0);
  body.position.y = 0.85;
  g.add(body);
  // Fluffy wool coat (hidden while sheared; visibility follows the anim flag).
  const wool = partBox(e, 0.95, 0.85, 1.35, 0xefece2);
  wool.position.y = 0.88;
  g.add(wool);
  e.parts.extra = wool;
  const head = new THREE.Group();
  const hb = partBox(e, 0.4, 0.4, 0.45, 0xd8c8c0, faceTexture('sheep'));
  hb.position.set(0, 0, -0.2);
  head.add(hb);
  head.position.set(0, 1.15, -0.62);
  g.add(head);
  for (const [sx, sz] of [[-0.22, 0.4], [0.22, 0.4], [-0.22, -0.4], [0.22, -0.4]] as const) {
    const pivot = new THREE.Group();
    const leg = partBox(e, 0.18, 0.5, 0.18, 0xc8b8b0);
    leg.position.y = -0.25;
    pivot.add(leg);
    pivot.position.set(sx, 0.5, sz);
    g.add(pivot);
    if (!e.parts.legL) e.parts.legL = pivot;
    else if (!e.parts.legR) e.parts.legR = pivot;
  }
  e.parts.head = head;
  e.parts.body = body;
}

function buildGolem(e: RenderEntity): void {
  const g = e.group;
  const head = new THREE.Group();
  const hb = partBox(e, 0.55, 0.6, 0.5, 0xcfc6b8, faceTexture('golem'));
  hb.position.y = 0.3;
  head.add(hb);
  head.position.y = 2.05;
  g.add(head);
  const body = partBox(e, 1.1, 1.1, 0.65, 0xbcb2a4);
  body.position.y = 1.5;
  g.add(body);
  const mkArm = (sign: number) => {
    const pivot = new THREE.Group();
    const arm = partBox(e, 0.3, 1.3, 0.3, 0xc4baa8);
    arm.position.y = -0.55;
    pivot.add(arm);
    pivot.position.set(sign * 0.75, 1.95, 0);
    g.add(pivot);
    return pivot;
  };
  const mkLeg = (sign: number) => {
    const pivot = new THREE.Group();
    const leg = partBox(e, 0.35, 1.0, 0.35, 0xaaa094);
    leg.position.y = -0.5;
    pivot.add(leg);
    pivot.position.set(sign * 0.28, 1.0, 0);
    g.add(pivot);
    return pivot;
  };
  e.parts.head = head;
  e.parts.armL = mkArm(-1);
  e.parts.armR = mkArm(1);
  e.parts.legL = mkLeg(-1);
  e.parts.legR = mkLeg(1);
}

interface QuadrupedSpec {
  body: number;
  legs: number;
  headColor: number;
  face: string;
  bodyW: number;
  bodyH: number;
  bodyL: number;
  legH: number;
  headSize: number;
  extras?: (g: THREE.Group, e: RenderEntity) => void;
}

/** Shared four-legged body plan (cow, pig — sheep keeps its wool build). */
function buildQuadruped(e: RenderEntity, s: QuadrupedSpec): void {
  const g = e.group;
  const bodyY = s.legH + s.bodyH / 2;
  const body = partBox(e, s.bodyW, s.bodyH, s.bodyL, s.body);
  body.position.y = bodyY;
  g.add(body);
  const head = new THREE.Group();
  const hb = partBox(e, s.headSize, s.headSize, s.headSize * 0.9, s.headColor, faceTexture(s.face));
  hb.position.set(0, 0, -s.headSize * 0.3);
  head.add(hb);
  head.position.set(0, bodyY + s.bodyH * 0.35, -s.bodyL / 2 - 0.05);
  g.add(head);
  const lx = s.bodyW / 2 - 0.12;
  const lz = s.bodyL / 2 - 0.14;
  for (const [sx, sz] of [[-lx, lz], [lx, lz], [-lx, -lz], [lx, -lz]] as const) {
    const pivot = new THREE.Group();
    const leg = partBox(e, 0.2, s.legH, 0.2, s.legs);
    leg.position.y = -s.legH / 2;
    pivot.add(leg);
    pivot.position.set(sx, s.legH, sz);
    g.add(pivot);
    if (!e.parts.legL) e.parts.legL = pivot;
    else if (!e.parts.legR) e.parts.legR = pivot;
  }
  e.parts.head = head;
  e.parts.body = body;
  s.extras?.(g, e);
}

function buildChicken(e: RenderEntity): void {
  const g = e.group;
  const body = partBox(e, 0.4, 0.4, 0.55, 0xe8e4dc);
  body.position.y = 0.42;
  g.add(body);
  const head = new THREE.Group();
  const hb = partBox(e, 0.28, 0.32, 0.26, 0xe8e4dc, faceTexture('chicken'));
  hb.position.y = 0.1;
  head.add(hb);
  head.position.set(0, 0.62, -0.26);
  g.add(head);
  // Wings.
  for (const sign of [-1, 1] as const) {
    const wing = partBox(e, 0.06, 0.28, 0.4, 0xd8d4c8);
    wing.position.set(sign * 0.24, 0.46, 0.02);
    g.add(wing);
  }
  // Legs.
  for (const sign of [-1, 1] as const) {
    const pivot = new THREE.Group();
    const leg = partBox(e, 0.06, 0.24, 0.06, 0xe8b83c);
    leg.position.y = -0.12;
    pivot.add(leg);
    pivot.position.set(sign * 0.1, 0.24, 0.05);
    g.add(pivot);
    if (!e.parts.legL) e.parts.legL = pivot;
    else e.parts.legR = pivot;
  }
  e.parts.head = head;
  e.parts.body = body;
}

function buildArrow(e: RenderEntity): void {
  const shaft = partBox(e, 0.04, 0.04, 0.5, 0x9a7a4a);
  e.group.add(shaft);
  const tip = partBox(e, 0.07, 0.07, 0.08, 0xcccccc);
  tip.position.z = -0.27;
  e.group.add(tip);
}

/** Mini block cube (0.3) with correct per-face atlas tiles. */
export function blockItemGeometry(blockId: number): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  remapBoxToTiles(geo, blockDef(blockId).tiles);
  return geo;
}

/** Flat textured quad (0.4) showing an item icon tile. */
export function iconQuadGeometry(tile: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(0.4, 0.4);
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  applyTileUV(uv, 0, tile);
  return geo;
}

/** Remap BoxGeometry UVs so each face samples its atlas tile. */
export function remapBoxToTiles(geo: THREE.BufferGeometry, tiles: readonly number[]): void {
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  // BoxGeometry face order: +x,-x,+y,-y,+z,-z with 4 verts each.
  for (let f = 0; f < 6; f++) applyTileUV(uv, f * 4, tiles[f]);
  uv.needsUpdate = true;
}

function applyTileUV(uv: THREE.BufferAttribute, offset: number, tile: number): void {
  // Map to the 16px interior of the tile's gutter-padded atlas cell.
  const ox = (tile % 32) * CELL_PX + TILE_GUTTER;
  const oy = Math.floor(tile / 32) * CELL_PX + TILE_GUTTER;
  const pad = 0.5; // half a texel, in px
  const u0 = (ox + pad) / ATLAS_SIZE;
  const u1 = (ox + TILE_PX - pad) / ATLAS_SIZE;
  // Atlas texture v=1 at top row.
  const v1 = 1 - (oy + pad) / ATLAS_SIZE;
  const v0 = 1 - (oy + TILE_PX - pad) / ATLAS_SIZE;
  // PlaneGeometry/BoxGeometry UV layout per face: (0,1),(1,1),(0,0),(1,0).
  uv.setXY(offset, u0, v1);
  uv.setXY(offset + 1, u1, v1);
  uv.setXY(offset + 2, u0, v0);
  uv.setXY(offset + 3, u1, v0);
}

function rayAABB(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  minX: number, minY: number, minZ: number,
  maxX: number, maxY: number, maxZ: number,
): number | null {
  let tmin = 0;
  let tmax = Infinity;
  const o = [ox, oy, oz];
  const d = [dx, dy, dz];
  const mn = [minX, minY, minZ];
  const mx = [maxX, maxY, maxZ];
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < mn[i] || o[i] > mx[i]) return null;
    } else {
      let t1 = (mn[i] - o[i]) / d[i];
      let t2 = (mx[i] - o[i]) / d[i];
      if (t1 > t2) {
        const t = t1;
        t1 = t2;
        t2 = t;
      }
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return null;
    }
  }
  return tmin;
}

export { faceTexture };
