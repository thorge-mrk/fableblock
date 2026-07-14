/**
 * Rain weather system: a recycling particle curtain around the camera,
 * a clear/rain cycle with smooth intensity ramps, and hooks that darken
 * the sky/fog while a shower passes. Rendering hides indoors/underground
 * (no sky light at the camera).
 */
import * as THREE from 'three';

const DROPS = 700;
const RADIUS = 18;
const TOP = 14; // spawn height above camera
const BOTTOM = -12;

export class Weather {
  readonly group = new THREE.Group();
  /** 0..1 rain strength (ramped). */
  intensity = 0;
  raining = false;

  private points: THREE.Points;
  private positions: Float32Array;
  private speeds: Float32Array;
  private material: THREE.PointsMaterial;
  private timer: number;

  constructor() {
    this.positions = new Float32Array(DROPS * 3);
    this.speeds = new Float32Array(DROPS);
    for (let i = 0; i < DROPS; i++) {
      this.resetDrop(i, true);
      this.speeds[i] = 18 + Math.random() * 8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), RADIUS + TOP + 4);
    this.material = new THREE.PointsMaterial({
      color: 0x9fc4e8,
      size: 1.6,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.group.add(this.points);
    this.group.visible = false;
    this.timer = 90 + Math.random() * 240; // first shower after 1.5-5.5 min
  }

  private resetDrop(i: number, randomY: boolean): void {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * RADIUS;
    this.positions[i * 3] = Math.cos(ang) * r;
    this.positions[i * 3 + 1] = randomY ? BOTTOM + Math.random() * (TOP - BOTTOM) : TOP;
    this.positions[i * 3 + 2] = Math.sin(ang) * r;
  }

  /** Advance the cycle + particles. skyVisible false hides the curtain. */
  update(dt: number, camX: number, camY: number, camZ: number, skyVisible: boolean): void {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.raining = !this.raining;
      this.timer = this.raining
        ? 90 + Math.random() * 150 // shower: 1.5-4 min
        : 240 + Math.random() * 360; // clear: 4-10 min
    }
    const target = this.raining ? 1 : 0;
    this.intensity += (target - this.intensity) * Math.min(1, dt * 0.5);
    if (this.intensity < 0.02) {
      this.group.visible = false;
      return;
    }
    this.group.visible = skyVisible;
    this.group.position.set(camX, camY, camZ);
    this.material.opacity = 0.55 * this.intensity;
    for (let i = 0; i < DROPS; i++) {
      this.positions[i * 3 + 1] -= this.speeds[i] * dt;
      if (this.positions[i * 3 + 1] < BOTTOM) this.resetDrop(i, false);
    }
    (this.points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }

  dispose(): void {
    this.points.geometry.dispose();
    this.material.dispose();
  }
}
