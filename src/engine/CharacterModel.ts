/**
 * Player character presentation (Module 7 spec): third-person modular box
 * model with velocity-driven leg swing and mining arm swing, plus the
 * first-person held-item viewmodel with swing animation.
 */
import * as THREE from 'three';
import { buildHumanoid } from './EntityRenderer';
import { blockItemGeometry, iconQuadGeometry } from './EntityRenderer';
import { itemDef, isPlaceable } from '../core/items';
import { TextureAtlas } from './TextureAtlas';

export class CharacterModel {
  readonly group = new THREE.Group();
  private parts: Record<string, THREE.Object3D> = {};
  private materials: THREE.MeshLambertMaterial[] = [];
  private baseColors: THREE.Color[] = [];
  private limbPhase = 0;
  private swingT = 1; // 0..1 swing animation progress (1 = idle)
  private heldMesh: THREE.Mesh | null = null;
  private heldItemId = -1;
  private atlas: TextureAtlas;

  constructor(atlas: TextureAtlas) {
    this.atlas = atlas;
    buildHumanoid(
      { group: this.group, parts: this.parts, materials: this.materials, baseColors: this.baseColors },
      { skin: 0xd8a888, shirt: 0x2ca8a8, pants: 0x3c4c9c, face: 'player' },
    );
  }

  swing(): void {
    this.swingT = 0;
  }

  update(
    dt: number,
    x: number, y: number, z: number,
    yaw: number, pitch: number,
    speed: number,
    brightness: number,
    heldItemId: number,
  ): void {
    this.group.position.set(x, y, z);
    this.group.rotation.y = yaw + Math.PI;
    this.limbPhase += speed * dt * 2.2;
    this.swingT = Math.min(1, this.swingT + dt * 2.8);
    const swing = Math.sin(this.limbPhase) * Math.min(1, speed / 3) * 0.7;
    if (this.parts.legL) this.parts.legL.rotation.x = swing;
    if (this.parts.legR) this.parts.legR.rotation.x = -swing;
    if (this.parts.armL) this.parts.armL.rotation.x = -swing * 0.8;
    if (this.parts.armR) {
      const mineSwing = this.swingT < 1 ? -Math.sin(this.swingT * Math.PI) * 1.8 : 0;
      this.parts.armR.rotation.x = swing * 0.8 + mineSwing;
    }
    if (this.parts.head) this.parts.head.rotation.x = -pitch * 0.8;

    for (let i = 0; i < this.materials.length; i++) {
      const m = this.materials[i];
      const c = this.baseColors[i];
      m.color.setRGB(c.r * brightness, c.g * brightness, c.b * brightness);
    }
    this.updateHeld(heldItemId);
  }

  private updateHeld(itemId: number): void {
    if (itemId === this.heldItemId) return;
    this.heldItemId = itemId;
    if (this.heldMesh) {
      (this.parts.armR as THREE.Group).remove(this.heldMesh);
      this.heldMesh.geometry.dispose();
      (this.heldMesh.material as THREE.Material).dispose();
      this.heldMesh = null;
    }
    if (itemId <= 0) return;
    const mat = new THREE.MeshLambertMaterial({ map: this.atlas.texture, alphaTest: 0.3, side: THREE.DoubleSide });
    const geo = isPlaceable(itemId) ? blockItemGeometry(itemId) : iconQuadGeometry(itemDef(itemId).icon);
    this.heldMesh = new THREE.Mesh(geo, mat);
    this.heldMesh.position.set(0, -0.65, -0.15);
    (this.parts.armR as THREE.Group).add(this.heldMesh);
  }

  dispose(): void {
    for (const m of this.materials) m.dispose();
  }
}

/** First-person viewmodel: held block/tool anchored to the camera. */
export class HeldItemView {
  readonly group = new THREE.Group();
  private mesh: THREE.Mesh | null = null;
  private itemId = -1;
  private swingT = 1;
  private bobPhase = 0;
  private atlas: TextureAtlas;
  private light: { value: number } = { value: 1 };

  constructor(atlas: TextureAtlas, camera: THREE.Camera) {
    this.atlas = atlas;
    camera.add(this.group);
    this.group.position.set(0.42, -0.42, -0.7);
  }

  swing(): void {
    this.swingT = 0;
  }

  update(dt: number, itemId: number, moveSpeed: number, brightness: number): void {
    this.light.value = brightness;
    if (itemId !== this.itemId) {
      this.itemId = itemId;
      if (this.mesh) {
        this.group.remove(this.mesh);
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
        this.mesh = null;
      }
      if (itemId > 0) {
        const mat = new THREE.MeshLambertMaterial({ map: this.atlas.texture, alphaTest: 0.3, side: THREE.DoubleSide });
        const geo = isPlaceable(itemId) ? blockItemGeometry(itemId) : iconQuadGeometry(itemDef(itemId).icon);
        this.mesh = new THREE.Mesh(geo, mat);
        if (isPlaceable(itemId)) {
          this.mesh.scale.setScalar(1.4);
          this.mesh.rotation.y = Math.PI / 5;
        } else {
          this.mesh.rotation.y = Math.PI / 7;
          this.mesh.rotation.z = -0.25;
          this.mesh.scale.setScalar(1.5);
        }
        this.group.add(this.mesh);
      }
    }
    if (!this.mesh) return;
    this.swingT = Math.min(1, this.swingT + dt * 3);
    this.bobPhase += dt * Math.min(10, 4 + moveSpeed * 1.4);
    const bobY = Math.abs(Math.sin(this.bobPhase)) * 0.02 * Math.min(1, moveSpeed / 3);
    const sw = this.swingT < 1 ? Math.sin(this.swingT * Math.PI) : 0;
    this.group.position.set(0.42 - sw * 0.25, -0.42 + bobY - sw * 0.28, -0.7 - sw * 0.12);
    this.group.rotation.set(-sw * 1.1, sw * 0.6, 0);
    const m = this.mesh.material as THREE.MeshLambertMaterial;
    m.color.setScalar(Math.max(0.15, brightness));
  }
}
