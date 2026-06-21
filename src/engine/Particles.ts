/**
 * Lightweight block-break particle system: a pooled set of small textured
 * cubes that burst out when a block is mined, fall under gravity, bounce off
 * the ground and fade. Kept tiny and capped so it never costs frame budget.
 */
import * as THREE from 'three';
import { World } from '../core/world';
import { blockDef } from '../core/blocks';

interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  active: boolean;
}

const MAX_PARTICLES = 160;
const GRAVITY = -22;

export class Particles {
  readonly group = new THREE.Group();
  private pool: Particle[] = [];
  private geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(this.geo, mat);
      mesh.visible = false;
      mesh.matrixAutoUpdate = true;
      this.group.add(mesh);
      this.pool.push({ mesh, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 1, active: false });
    }
  }

  /** Burst of fragments coloured from a block's texture. */
  burst(x: number, y: number, z: number, color: THREE.Color, count = 14): void {
    let spawned = 0;
    for (const p of this.pool) {
      if (p.active) continue;
      const mat = p.mesh.material as THREE.MeshLambertMaterial;
      mat.color.copy(color);
      const s = 0.5 + Math.random() * 0.7;
      p.mesh.scale.setScalar(s);
      p.mesh.position.set(x + (Math.random() - 0.5) * 0.7, y + Math.random() * 0.6, z + (Math.random() - 0.5) * 0.7);
      p.vx = (Math.random() - 0.5) * 4;
      p.vy = 2 + Math.random() * 3;
      p.vz = (Math.random() - 0.5) * 4;
      p.maxLife = 0.5 + Math.random() * 0.4;
      p.life = p.maxLife;
      p.active = true;
      p.mesh.visible = true;
      if (++spawned >= count) break;
    }
  }

  update(dt: number, world: World): void {
    for (const p of this.pool) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }
      p.vy += GRAVITY * dt;
      const m = p.mesh;
      let nx = m.position.x + p.vx * dt;
      let ny = m.position.y + p.vy * dt;
      let nz = m.position.z + p.vz * dt;
      // Cheap ground collision: stop falling on a solid block.
      if (p.vy < 0 && blockDef(world.getBlockId(Math.floor(nx), Math.floor(ny), Math.floor(nz))).solid) {
        ny = Math.floor(ny) + 1.001;
        p.vy = 0;
        p.vx *= 0.5;
        p.vz *= 0.5;
      }
      m.position.set(nx, ny, nz);
      m.rotation.x += dt * 4;
      m.rotation.y += dt * 3;
      // Shrink as it expires.
      const f = Math.min(1, p.life / p.maxLife);
      m.scale.setScalar(0.2 + f * 0.7);
      void nx;
      void nz;
    }
  }

  dispose(): void {
    this.geo.dispose();
    for (const p of this.pool) (p.mesh.material as THREE.Material).dispose();
  }
}
