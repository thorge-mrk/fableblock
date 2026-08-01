/**
 * Dynamic day/night cycle (Module 2 spec): rotates the sun/moon directional
 * light, interpolates sky + fog colors and drives the terrain shader's
 * sun-level uniform. Time-of-day t in [0,1): 0 dawn, 0.25 noon, 0.5 dusk,
 * 0.75 midnight.
 */
import * as THREE from 'three';
import { EnvUniforms } from './materials';

const DAY_SKY = new THREE.Color(0x8ec2ee);
const NIGHT_SKY = new THREE.Color(0x070b18);
const DUSK_SKY = new THREE.Color(0xe2884e);
const DAY_TINT = new THREE.Color(1, 1, 1);
const DUSK_TINT = new THREE.Color(1.0, 0.78, 0.62);
const NIGHT_TINT = new THREE.Color(0.66, 0.72, 1.0);
// Zenith (straight-up) colors for the gradient sky dome — deeper than the
// horizon so the sky reads as a 3D vault instead of a flat wall.
const DAY_ZENITH = new THREE.Color(0x3a7bd5);
const NIGHT_ZENITH = new THREE.Color(0x03040c);
const DUSK_ZENITH = new THREE.Color(0x2a3f74);

export class DayNightCycle {
  time: number; // 0..1
  dayLengthSec: number;
  readonly sun: THREE.DirectionalLight;
  readonly ambient: THREE.AmbientLight;
  readonly skyColor = new THREE.Color(); // horizon color
  readonly zenithColor = new THREE.Color(); // straight-up color for the dome
  sunLevel = 1;

  private tmp = new THREE.Color();
  private lightWorld = new THREE.Vector3();
  private lightView = new THREE.Vector3();

  constructor(dayLengthSec: number) {
    this.time = 0.05; // shortly after dawn
    this.dayLengthSec = dayLengthSec;
    this.sun = new THREE.DirectionalLight(0xffffff, 1.6);
    this.ambient = new THREE.AmbientLight(0xb9c8ff, 0.9);
  }

  update(dt: number, env: EnvUniforms, scene: THREE.Scene, camera: THREE.Camera, renderDistance: number): void {
    this.time = (this.time + dt / this.dayLengthSec) % 1;
    const ang = this.time * Math.PI * 2;
    const alt = Math.sin(ang); // sun altitude: + day, - night

    // Sun-level for voxel sunlight: full at day, moonlit floor at night.
    const dayF = THREE.MathUtils.smoothstep(alt, -0.12, 0.18);
    this.sunLevel = 0.3 + 0.7 * dayF;
    env.uSunLevel.value = this.sunLevel;

    // Sky color: night -> dusk band -> day.
    const duskBand = Math.max(0, 1 - Math.abs(alt) * 5); // peaks at horizon
    this.skyColor.copy(NIGHT_SKY).lerp(DAY_SKY, dayF);
    this.tmp.copy(this.skyColor).lerp(DUSK_SKY, duskBand * 0.7);
    this.skyColor.copy(this.tmp);
    (scene.background as THREE.Color).copy(this.skyColor);
    env.uFogColor.value.copy(this.skyColor);

    // Zenith color for the sky dome (horizon stays == background == fog).
    this.zenithColor.copy(NIGHT_ZENITH).lerp(DAY_ZENITH, dayF);
    this.zenithColor.lerp(DUSK_ZENITH, duskBand * 0.4);
    env.uZenith.value.copy(this.zenithColor);

    // Sky tint for sunlight color in the terrain shader.
    env.uSkyTint.value.copy(NIGHT_TINT).lerp(DAY_TINT, dayF).lerp(DUSK_TINT, duskBand * 0.6);

    // Fog distances track render distance. The haze starts far out so the
    // view reads as open landscape — it exists to hide the chunk edge, not to
    // wall the player in at arm's length.
    const far = renderDistance * 16;
    env.uFogFar.value = far * (1.0 - 0.06 * (1 - dayF));
    env.uFogNear.value = env.uFogFar.value * 0.78;
    // Mirror into scene.fog so Lambert-lit objects (mobs, boat, character)
    // fade out with the terrain instead of staying visible past the fog wall.
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(this.skyColor);
      scene.fog.near = env.uFogNear.value;
      scene.fog.far = env.uFogFar.value;
    }

    // Directional light: sun by day, dim moon by night (opposite side).
    const isDay = alt > -0.04;
    const lightAng = isDay ? ang : ang + Math.PI;
    const cx = (camera as THREE.PerspectiveCamera).position;
    this.sun.position.set(
      cx.x + Math.cos(lightAng) * 120,
      Math.max(12, Math.sin(lightAng) * 160) + cx.y,
      cx.z + Math.sin(this.time * Math.PI * 2 * 0.5) * 40,
    );
    this.sun.target.position.copy(cx);
    this.sun.target.updateMatrixWorld();
    this.sun.intensity = isDay ? 0.6 + 1.2 * dayF : 0.25;
    this.sun.color.setHex(isDay ? 0xfff4e0 : 0x8898c8);
    this.ambient.intensity = 0.35 + 0.75 * dayF;

    // Light direction for the terrain shader, in VIEW space (the shader
    // reconstructs normals in view space, so the light must live there too).
    this.lightWorld.set(
      Math.cos(lightAng),
      Math.max(0.22, Math.sin(lightAng)),
      Math.sin(this.time * Math.PI * 2 * 0.5) * 0.3,
    ).normalize();
    // Rotate world -> view: the view matrix's upper 3x3 (no translation, the
    // direction is positional-invariant).
    this.lightView.copy(this.lightWorld).transformDirection(camera.matrixWorldInverse);
    env.uSunDir.value.copy(this.lightView).normalize();
  }
}
