/**
 * Visible celestial bodies: a warm sun disc and a pale cratered moon that
 * travel the day/night arc, plus a seeded star dome that fades in at night
 * and slowly wheels overhead. All textures are procedural canvases and all
 * materials ignore fog (they live far beyond the fog wall by design).
 */
import * as THREE from 'three';
import { mulberry32 } from '../core/prng';

const DIST = 420; // inside the 600 far plane, far beyond the fog

function discTexture(kind: 'sun' | 'moon'): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 4, 32, 32, 30);
  if (kind === 'sun') {
    grad.addColorStop(0, 'rgba(255,244,214,1)');
    grad.addColorStop(0.55, 'rgba(255,214,120,0.95)');
    grad.addColorStop(1, 'rgba(255,170,60,0)');
  } else {
    grad.addColorStop(0, 'rgba(226,232,244,1)');
    grad.addColorStop(0.7, 'rgba(190,200,220,0.9)');
    grad.addColorStop(1, 'rgba(160,170,196,0)');
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  if (kind === 'moon') {
    // Craters.
    g.fillStyle = 'rgba(150,160,186,0.55)';
    for (const [x, y, r] of [[24, 22, 5], [40, 34, 4], [30, 42, 3], [42, 18, 2.5]] as const) {
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function cloudTexture(seed: number): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  const rand = mulberry32(seed ^ 0xc10d);
  g.clearRect(0, 0, 256, 256);
  // Blobby cumulus patches out of overlapping soft discs.
  for (let i = 0; i < 26; i++) {
    const cx = rand() * 256;
    const cy = rand() * 256;
    const puffs = 4 + Math.floor(rand() * 5);
    for (let p = 0; p < puffs; p++) {
      const r = 10 + rand() * 16;
      const grad = g.createRadialGradient(0, 0, 1, 0, 0, r);
      grad.addColorStop(0, 'rgba(255,255,255,0.55)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.save();
      g.translate(cx + (rand() - 0.5) * 34, cy + (rand() - 0.5) * 18);
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, r, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export class Sky {
  readonly group = new THREE.Group();
  private sun: THREE.Sprite;
  private moon: THREE.Sprite;
  private stars: THREE.Points;
  private starMat: THREE.PointsMaterial;
  private clouds: THREE.Mesh;
  private cloudMat: THREE.MeshBasicMaterial;

  constructor(seed: number) {
    const sunMat = new THREE.SpriteMaterial({
      map: discTexture('sun'),
      transparent: true,
      depthWrite: false,
      fog: false,
    });
    this.sun = new THREE.Sprite(sunMat);
    this.sun.scale.setScalar(70);
    this.group.add(this.sun);

    const moonMat = new THREE.SpriteMaterial({
      map: discTexture('moon'),
      transparent: true,
      depthWrite: false,
      fog: false,
    });
    this.moon = new THREE.Sprite(moonMat);
    this.moon.scale.setScalar(44);
    this.group.add(this.moon);

    // Seeded star dome.
    const rand = mulberry32(seed ^ 0x5157a9);
    const COUNT = 420;
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // Uniform-ish points on the upper hemisphere (plus a little below
      // the horizon so stars ring the whole sky as it rotates).
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 1.15 - 0.15);
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * DIST * 1.05;
      pos[i * 3 + 1] = Math.cos(phi) * DIST * 1.05;
      pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * DIST * 1.05;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.starMat = new THREE.PointsMaterial({
      color: 0xdfe8ff,
      size: 1.6,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: false,
    });
    this.stars = new THREE.Points(geo, this.starMat);
    this.stars.frustumCulled = false;
    this.group.add(this.stars);

    // Drifting cloud sheet high above the world (absolute height).
    this.cloudMat = new THREE.MeshBasicMaterial({
      map: cloudTexture(seed),
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      fog: false,
      side: THREE.DoubleSide,
    });
    this.cloudMat.map!.repeat.set(3, 3);
    this.clouds = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), this.cloudMat);
    this.clouds.rotation.x = -Math.PI / 2;
    this.clouds.renderOrder = 5;
    this.group.add(this.clouds);
  }

  /** Follow the camera and place sun/moon/stars for time t in [0,1). */
  update(t: number, camX: number, camY: number, camZ: number): void {
    this.group.position.set(camX, camY, camZ);
    const ang = t * Math.PI * 2;
    // Sun rises at t=0 in the +X sky, sets at 0.5; moon opposite.
    this.sun.position.set(Math.cos(ang) * DIST, Math.sin(ang) * DIST, Math.sin(ang * 0.5) * 60);
    this.moon.position.set(-Math.cos(ang) * DIST, -Math.sin(ang) * DIST, -Math.sin(ang * 0.5) * 60);
    const alt = Math.sin(ang);
    (this.sun.material as THREE.SpriteMaterial).opacity = THREE.MathUtils.clamp((alt + 0.14) * 5, 0, 1);
    (this.moon.material as THREE.SpriteMaterial).opacity = THREE.MathUtils.clamp((-alt + 0.1) * 4, 0, 0.95);
    // Stars: fade in at night, wheel slowly around the sky axis.
    this.starMat.opacity = THREE.MathUtils.clamp(-alt * 2.2, 0, 0.9);
    this.stars.rotation.z = ang * 0.5;
    // Clouds sit at an absolute height and drift with time; dimmer at night.
    this.clouds.position.y = 150 - camY;
    if (this.cloudMat.map) {
      this.cloudMat.map.offset.x = (t * 40) % 1;
      this.cloudMat.map.offset.y = (t * 12) % 1;
    }
    this.cloudMat.opacity = 0.22 + 0.3 * THREE.MathUtils.clamp(alt + 0.3, 0, 1);
  }

  dispose(): void {
    (this.sun.material as THREE.SpriteMaterial).map?.dispose();
    (this.moon.material as THREE.SpriteMaterial).map?.dispose();
    this.stars.geometry.dispose();
    this.starMat.dispose();
  }
}
