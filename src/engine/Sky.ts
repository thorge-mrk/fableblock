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

/**
 * Volumetric block-cloud field: a grid of extruded cloud cells with shared
 * faces culled (so cells fuse into masses and you see the cloud's SIDES, giving
 * real height), per-face shading baked into vertex colors, and a radial alpha
 * fade so the field has no visible edge. The occupancy pattern is periodic over
 * TILE cells so the drift in update() can wrap seamlessly.
 */
const CLOUD_CELL = 20;
const CLOUD_TILE = 13; // periodic tile (cells) — drift wraps by CLOUD_TILE*CELL
function buildCloudField(seed: number): THREE.BufferGeometry {
  const SPAN = 16; // cells each way; distance fog swallows the rim (no hard edge)
  const H = 6; // cloud thickness in blocks
  const rand = mulberry32(seed ^ 0xc10d);
  const pat: boolean[] = [];
  for (let i = 0; i < CLOUD_TILE * CLOUD_TILE; i++) pat.push(rand() < 0.34);
  const cell = (cx: number, cz: number): boolean => {
    const px = ((cx % CLOUD_TILE) + CLOUD_TILE) % CLOUD_TILE;
    const pz = ((cz % CLOUD_TILE) + CLOUD_TILE) % CLOUD_TILE;
    return pat[pz * CLOUD_TILE + px];
  };
  const pos: number[] = [];
  const col: number[] = [];
  const quad = (v: number[][], shade: number): void => {
    for (const i of [0, 1, 2, 0, 2, 3]) {
      pos.push(v[i][0], v[i][1], v[i][2]);
      col.push(shade, shade, shade, 1);
    }
  };
  for (let cz = -SPAN; cz <= SPAN; cz++) {
    for (let cx = -SPAN; cx <= SPAN; cx++) {
      if (!cell(cx, cz)) continue;
      const x0 = cx * CLOUD_CELL;
      const x1 = x0 + CLOUD_CELL;
      const z0 = cz * CLOUD_CELL;
      const z1 = z0 + CLOUD_CELL;
      const y0 = 0;
      const y1 = H;
      // Top (bright) + bottom (dark) always; sides only at cloud edges so the
      // cells fuse into masses and you see the cloud's height at the edges.
      quad([[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], 1.0);
      quad([[x0, y0, z1], [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]], 0.72);
      if (!cell(cx + 1, cz)) quad([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], 0.86);
      if (!cell(cx - 1, cz)) quad([[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], 0.86);
      if (!cell(cx, cz + 1)) quad([[x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [x0, y0, z1]], 0.80);
      if (!cell(cx, cz - 1)) quad([[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], 0.80);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 4));
  return geo;
}

export class Sky {
  readonly group = new THREE.Group();
  private sun: THREE.Sprite;
  private moon: THREE.Sprite;
  private stars: THREE.Points;
  private starMat: THREE.PointsMaterial;
  private clouds: THREE.Mesh;
  private cloudMat: THREE.MeshBasicMaterial;
  private dome: THREE.Mesh;
  private domeMat: THREE.ShaderMaterial;

  constructor(seed: number) {
    // Gradient sky dome: an inward-facing sphere painted horizon->zenith so the
    // sky reads as a 3D vault. Drawn first (renderOrder -1, no depth) as a pure
    // backdrop; radius sits behind sun/moon/stars but well inside the far plane.
    this.domeMat = new THREE.ShaderMaterial({
      uniforms: {
        uHorizon: { value: new THREE.Color(0x8ec2ee) },
        uZenith: { value: new THREE.Color(0x3a7bd5) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uHorizon;
        uniform vec3 uZenith;
        varying vec3 vDir;
        void main() {
          float h = clamp(normalize(vDir).y, 0.0, 1.0);
          float t = pow(h, 0.55); // compress the gradient toward the horizon band
          gl_FragColor = vec4(mix(uHorizon, uZenith, t), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false,
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(480, 32, 16), this.domeMat);
    this.dome.renderOrder = -1; // draws first; nothing else uses a negative order
    this.dome.frustumCulled = false;
    this.group.add(this.dome);

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

    // Volumetric block clouds: a grid of extruded cloud cells (you see their
    // sides → real height, not a flat sheet). Shared faces are culled so cells
    // fuse into rounded masses; the rim fades to alpha 0 so there is no edge.
    this.cloudMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      fog: true, // distance fog swallows the rim → no visible edge, seamless drift
      side: THREE.DoubleSide,
      vertexColors: true,
    });
    this.clouds = new THREE.Mesh(buildCloudField(seed), this.cloudMat);
    this.clouds.frustumCulled = false;
    this.clouds.renderOrder = 5;
    this.group.add(this.clouds);
  }

  /** Push the current horizon/zenith colors into the dome gradient. */
  setColors(horizon: THREE.Color, zenith: THREE.Color): void {
    (this.domeMat.uniforms.uHorizon.value as THREE.Color).copy(horizon);
    (this.domeMat.uniforms.uZenith.value as THREE.Color).copy(zenith);
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
    // Block clouds sit at an absolute height and drift. The occupancy pattern
    // is periodic over CLOUD_TILE cells, so wrapping the x-offset by one tile is
    // seamless (no jump); distance fog fades the rim. Dimmer at night.
    const period = CLOUD_TILE * CLOUD_CELL;
    // Cloud deck well above the highest peaks, so it reads as sky rather than
    // a ceiling hanging over the player's head.
    this.clouds.position.set(((t * 4) % 1) * period, 196 - camY, 0);
    this.cloudMat.opacity = 0.4 + 0.5 * THREE.MathUtils.clamp(alt + 0.3, 0, 1);
  }

  dispose(): void {
    (this.sun.material as THREE.SpriteMaterial).map?.dispose();
    (this.moon.material as THREE.SpriteMaterial).map?.dispose();
    this.stars.geometry.dispose();
    this.starMat.dispose();
    this.dome.geometry.dispose();
    this.domeMat.dispose();
    this.clouds.geometry.dispose();
    this.cloudMat.map?.dispose();
    this.cloudMat.dispose();
  }
}
