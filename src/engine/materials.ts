/**
 * Custom GLSL terrain shaders (Module 2 spec): atlas tile UV resolution with
 * half-texel clamping (zero bleeding), baked AO/face shading, voxel light
 * (sun + blocklight) with day/night sun scaling, distance fog, alpha-tested
 * cutouts, and an animated translucent water variant.
 */
import * as THREE from 'three';
import { ATLAS_TILES, TILE_PX, CELL_PX, TILE_GUTTER, ATLAS_SIZE } from '../core/blocks';

export interface EnvUniforms {
  uSunLevel: { value: number };
  uFogColor: { value: THREE.Color };
  uFogNear: { value: number };
  uFogFar: { value: number };
  uTime: { value: number };
  uSkyTint: { value: THREE.Color };
  uGamma: { value: number };
  /** Sun/moon direction in VIEW space (points from surface toward the light). */
  uSunDir: { value: THREE.Vector3 };
  /** Zenith sky color — drives the sky-bounce ambient term. */
  uZenith: { value: THREE.Color };
  /** 0 fast, 1 balanced, 2 fancy — gates the expensive lighting terms. */
  uQuality: { value: number };
  /** 1 while the camera is submerged (adds an underwater cast). */
  uUnderwater: { value: number };
}

export function createEnvUniforms(): EnvUniforms {
  return {
    uSunLevel: { value: 1 },
    uFogColor: { value: new THREE.Color(0x87b5e5) },
    uFogNear: { value: 60 },
    uFogFar: { value: 120 },
    uTime: { value: 0 },
    uSkyTint: { value: new THREE.Color(1, 1, 1) },
    uGamma: { value: 1 },
    uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.45) },
    uZenith: { value: new THREE.Color(0x3a7bd5) },
    uQuality: { value: 2 },
    uUnderwater: { value: 0 },
  };
}

const VERT = /* glsl */ `
attribute vec2 aUv;
attribute float aTile;
attribute float aShade;
attribute vec2 aLight;

varying vec2 vUv;
varying float vTile;
varying float vShade;
varying vec2 vLight;
varying float vDist;
varying vec3 vViewPos;

void main() {
  vUv = aUv;
  vTile = aTile;
  vShade = aShade;
  vLight = aLight;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDist = -mv.z;
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

function frag(water: boolean): string {
  return /* glsl */ `
uniform sampler2D uAtlas;
uniform float uSunLevel;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uTime;
uniform vec3 uSkyTint;
uniform float uGamma;
uniform vec3 uSunDir;
uniform vec3 uZenith;
uniform float uQuality;
uniform float uUnderwater;

varying vec2 vUv;
varying float vTile;
varying float vShade;
varying vec2 vLight;
varying float vDist;
varying vec3 vViewPos;

const float GRID = ${ATLAS_TILES.toFixed(1)};
const float TILEPX = ${TILE_PX.toFixed(1)};
const float CELLPX = ${CELL_PX.toFixed(1)};
const float GUT = ${TILE_GUTTER.toFixed(1)};
const float ATLASPX = ${ATLAS_SIZE.toFixed(1)};
const float HALF_TEXEL = 0.5; // px, clamps inside the tile interior

/**
 * Face normal in view space, reconstructed from screen-space derivatives.
 * Voxel faces are perfectly planar, so this is exact — and it costs nothing
 * in mesh memory (no normal attribute) or worker changes.
 */
vec3 faceNormal(vec3 viewPos) {
  vec3 g = cross(dFdx(viewPos), dFdy(viewPos));
  float m = dot(g, g);
  vec3 V = normalize(-viewPos);
  vec3 nrm = m > 1e-12 ? normalize(g) : V;
  return dot(nrm, V) < 0.0 ? -nrm : nrm; // always face the eye
}

/** Filmic tone curve (ACES approximation) — deeper contrast, no clipping. */
vec3 tonemap(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
${water
    ? `
// Sample the water tile at a scrolled UV. Flow scale is 1.0 (integer) so
// fract() stays continuous across cell boundaries given a seamless tile.
vec3 sampleWater(vec2 cell, vec2 uv, vec2 flow) {
  vec2 inTile = fract(uv + flow);
  inTile.y = 1.0 - inTile.y;
  inTile = clamp(inTile, vec2(HALF_TEXEL / TILEPX), vec2(1.0 - HALF_TEXEL / TILEPX));
  vec2 px = cell * CELLPX + vec2(GUT) + inTile * TILEPX;
  vec2 auv = px / ATLASPX;
  auv.y = 1.0 - auv.y;
  return texture2D(uAtlas, auv).rgb;
}`
    : ''}

void main() {
  float tile = floor(vTile + 0.5);
  vec2 cell = vec2(mod(tile, GRID), floor(tile / GRID));
${water
    ? `  // Two crossing directional-flow layers → gentle roiling motion.
  vec3 w1 = sampleWater(cell, vUv, vec2( uTime * 0.026,  uTime * 0.017));
  vec3 w2 = sampleWater(cell, vUv, vec2(-uTime * 0.021,  uTime * 0.012));
  vec3 base = mix(w1, w2, 0.5);`
    : `  vec2 inTile = fract(vUv);
  inTile.y = 1.0 - inTile.y;
  inTile = clamp(inTile, vec2(HALF_TEXEL / TILEPX), vec2(1.0 - HALF_TEXEL / TILEPX));
  vec2 px = cell * CELLPX + vec2(GUT) + inTile * TILEPX;
  vec2 atlasUv = px / ATLASPX;
  atlasUv.y = 1.0 - atlasUv.y;
  vec4 tex = texture2D(uAtlas, atlasUv);
  // Cutout threshold relaxes with distance: mipmap-averaged alpha would
  // otherwise dissolve far leaves/plants into sparkling dots.
  float aThr = mix(0.5, 0.16, smoothstep(24.0, 90.0, vDist));
  if (tex.a < aThr) discard;`}

  vec3 N = faceNormal(vViewPos);
  vec3 V = normalize(-vViewPos);

  float sun = (vLight.x / 15.0) * uSunLevel;
  float block = vLight.y / 15.0;

  // --- Directional sun term -------------------------------------------------
  // Half-Lambert keeps shadowed faces readable while still swinging the
  // lighting across the day: east walls glow at dawn, west walls at dusk.
  float ndl = dot(N, uSunDir);
  float wrap = ndl * 0.5 + 0.5;
  float direct = wrap * wrap;
  // Sky-bounce ambient: upward faces catch more of the sky dome.
  float skyAmt = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);

  float l = max(sun, block);
  float brightness = pow(l, 1.45) * 0.96 + 0.04;
  // Blocklight carries a warm tint; sunlight follows the sky tint.
  vec3 lightColor = mix(uSkyTint, vec3(1.0, 0.85, 0.6), clamp(block - sun, 0.0, 1.0) * 0.55);
  // Directional modulation applies only to the SUN share of the light, so
  // torch-lit caves keep their look and only daylight sculpts the terrain.
  float sunShare = clamp(sun - block, 0.0, 1.0);
  float shaped = mix(1.0, 0.68 + 0.55 * direct, sunShare * 0.8);

  vec3 col = ${water ? 'base' : 'tex.rgb'} * vShade * brightness * lightColor * shaped;
  // Sky bounce: cool zenith light filling the ambient, strongest on top faces.
  col += ${water ? 'base' : 'tex.rgb'} * uZenith * (skyAmt * 0.11 * sun * vShade);

  if (uQuality > 0.5) {
    // Sun specular sheen: a soft Blinn-Phong highlight that makes surfaces
    // read as lit material instead of flat color swatches.
    vec3 H = normalize(uSunDir + V);
    float spec = pow(max(dot(N, H), 0.0), 24.0);
    col += uSkyTint * spec * ${water ? '0.20' : '0.055'} * sun * sunShare;
    // Grazing-angle sky reflection — the classic modern-renderer rim.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 5.0);
    col = mix(col, uFogColor * 1.05, fres * ${water ? '0.10' : '0.16'} * sun);
  }

  float fogF = smoothstep(uFogNear, uFogFar, vDist);
${water
    ? `  // --- Water surface ------------------------------------------------------
  float day = clamp(uSunLevel, 0.1, 1.0);
  // Ripple normal: two crossing wave trains perturb the flat face normal so
  // the highlight breaks into moving glints instead of one mirror sheet.
  vec2 wv = vUv * 1.6;
  float w1p = sin(wv.x * 3.1 + uTime * 1.7) + sin((wv.x + wv.y) * 2.3 - uTime * 1.1);
  float w2p = sin(wv.y * 2.7 - uTime * 1.3) + sin((wv.x - wv.y) * 3.7 + uTime * 0.9);
  vec3 Nw = normalize(N + vec3(w1p, 0.0, w2p) * 0.055);

  float fres = pow(1.0 - clamp(dot(Nw, V), 0.0, 1.0), 5.0);
  // Reflected sky: horizon tone near grazing, zenith tone looking straight in.
  vec3 sky = mix(uZenith * 1.15, uFogColor * 1.08, clamp(fres + 0.35, 0.0, 1.0));
  col = mix(col, sky, clamp(0.16 + fres * 0.62, 0.0, 0.86) * day);

  // Specular sun glitter on the ripples — the "epic water" signature.
  vec3 Hw = normalize(uSunDir + V);
  float glint = pow(max(dot(Nw, Hw), 0.0), 128.0);
  col += uSkyTint * glint * 1.5 * day * step(0.5, uQuality);
  float sheen = pow(max(dot(Nw, Hw), 0.0), 18.0);
  col += uSkyTint * sheen * 0.22 * day;

  // Foam-ish crest lift on the brightest wave texels.
  float crest = smoothstep(0.60, 0.80, dot(base, vec3(0.299, 0.587, 0.114)));
  col += sky * crest * 0.12 * day;

  col = mix(col, uFogColor, fogF);
  col = mix(col, tonemap(col * 1.3), 0.75);
  col = pow(col, vec3(1.0 / uGamma));
  // Steeper viewing angles look through more water → more opaque.
  float a = clamp(0.56 + fres * 0.38 + smoothstep(8.0, 60.0, vDist) * 0.10, 0.0, 0.94);
  gl_FragColor = vec4(col, a);`
    : `  // Underwater: everything picks up a blue-green cast and closes in.
  vec3 fogCol = mix(uFogColor, vec3(0.10, 0.30, 0.42), uUnderwater);
  col = mix(col, fogCol, uUnderwater > 0.5 ? smoothstep(uFogNear * 0.25, uFogFar * 0.45, vDist) : fogF);
  // Filmic tone curve: richer mid-tones and highlight roll-off instead of
  // flat clipped color. Slight exposure lift keeps daylight punchy.
  col = mix(col, tonemap(col * 1.35), 0.75);
  // User brightness (gamma) — applied after fog so night lift is uniform.
  col = pow(col, vec3(1.0 / uGamma));
  gl_FragColor = vec4(col, 1.0);`}
}
`;
}

export function createTerrainMaterial(atlas: THREE.Texture, env: EnvUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uAtlas: { value: atlas }, ...env },
    vertexShader: VERT,
    fragmentShader: frag(false),
    side: THREE.FrontSide,
  });
}

export function createWaterMaterial(atlas: THREE.Texture, env: EnvUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uAtlas: { value: atlas }, ...env },
    vertexShader: VERT,
    fragmentShader: frag(true),
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}
