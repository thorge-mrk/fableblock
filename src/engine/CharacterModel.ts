/**
 * Player character presentation (Module 7 spec): third-person modular box
 * model with velocity-driven leg swing and mining arm swing, plus the
 * first-person held-item viewmodel with swing animation.
 */
import * as THREE from 'three';
import { buildHumanoid, bodyTexture } from './EntityRenderer';
import { blockItemGeometry, iconQuadGeometry } from './EntityRenderer';
import { itemDef, isPlaceable } from '../core/items';
import { rendersAsSprite } from '../core/blocks';
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
      { skin: 0xd8a888, shirt: 0x2ca8a8, pants: 0x3c4c9c, face: 'player', bodyTex: bodyTexture('playerShirt') },
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
    const asCube = isPlaceable(itemId) && !rendersAsSprite(itemId);
    const geo = asCube ? blockItemGeometry(itemId) : iconQuadGeometry(itemDef(itemId).icon);
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
  private arm: THREE.Group;
  private armMats: THREE.MeshLambertMaterial[] = [];
  private armBase: THREE.Color[] = [];

  constructor(atlas: TextureAtlas, camera: THREE.Camera) {
    this.atlas = atlas;
    camera.add(this.group);
    this.group.position.set(0.4, -0.45, -0.7);

    // First-person arm (own player skin): a teal sleeve + skin hand reaching in
    // from the lower-right so held items read as gripped, like the original.
    this.arm = new THREE.Group();
    const sleeveMat = new THREE.MeshLambertMaterial({ color: 0x2ca8a8 });
    const handMat = new THREE.MeshLambertMaterial({ color: 0xd8a888 });
    this.armMats.push(sleeveMat, handMat);
    // Hand sits at the fist (near the item); the forearm/sleeve trails back and
    // drops off the lower-right of the view, so the wrist is what you see.
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.16), handMat);
    hand.position.z = 0.02;
    this.arm.add(hand);
    const sleeve = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.17, 0.5), sleeveMat);
    sleeve.position.z = 0.36;
    this.arm.add(sleeve);
    this.arm.position.set(0.0, -0.02, 0.06);
    this.arm.rotation.set(-0.7, 0.35, 0.3);
    this.group.add(this.arm);
    this.armBase = this.armMats.map((m) => m.color.clone());
  }

  swing(): void {
    this.swingT = 0;
  }

  update(dt: number, itemId: number, moveSpeed: number, brightness: number): void {
    this.light.value = brightness;
    // Dim the arm with the brightness setting while keeping its hue.
    const lit = Math.max(0.18, brightness);
    for (let i = 0; i < this.armMats.length; i++) {
      const b = this.armBase[i];
      this.armMats[i].color.setRGB(b.r * lit, b.g * lit, b.b * lit);
    }
    // Hide the bare arm when nothing is held? No — the arm always shows (you're
    // always holding your hand out); only the item toggles.
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
        const asCube = isPlaceable(itemId) && !rendersAsSprite(itemId);
        const geo = asCube ? blockItemGeometry(itemId) : iconQuadGeometry(itemDef(itemId).icon);
        this.mesh = new THREE.Mesh(geo, mat);
        if (asCube) {
          this.mesh.scale.setScalar(1.3);
          this.mesh.rotation.set(0, Math.PI / 5, 0);
          this.mesh.position.set(0, 0.03, 0);
        } else {
          // Tool sprite tilted so the handle runs down into the fist, held just
          // above the hand — centered more like the original.
          this.mesh.rotation.set(0, -0.15, 0.95);
          this.mesh.scale.setScalar(1.2);
          this.mesh.position.set(-0.05, 0.07, -0.02);
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
