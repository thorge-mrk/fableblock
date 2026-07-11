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

void main() {
  vUv = aUv;
  vTile = aTile;
  vShade = aShade;
  vLight = aLight;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDist = -mv.z;
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

varying vec2 vUv;
varying float vTile;
varying float vShade;
varying vec2 vLight;
varying float vDist;

const float GRID = ${ATLAS_TILES.toFixed(1)};
const float TILEPX = ${TILE_PX.toFixed(1)};
const float CELLPX = ${CELL_PX.toFixed(1)};
const float GUT = ${TILE_GUTTER.toFixed(1)};
const float ATLASPX = ${ATLAS_SIZE.toFixed(1)};
const float HALF_TEXEL = 0.5; // px, clamps inside the tile interior

void main() {
  float tile = floor(vTile + 0.5);
  vec2 cell = vec2(mod(tile, GRID), floor(tile / GRID));
  ${water
    ? 'vec2 inTile = fract(vUv + vec2(uTime * 0.02, uTime * 0.045));'
    : 'vec2 inTile = fract(vUv);'}
  inTile.y = 1.0 - inTile.y;
  inTile = clamp(inTile, vec2(HALF_TEXEL / TILEPX), vec2(1.0 - HALF_TEXEL / TILEPX));
  // Resolve to absolute atlas pixels inside the gutter-padded cell.
  vec2 px = cell * CELLPX + vec2(GUT) + inTile * TILEPX;
  vec2 atlasUv = px / ATLASPX;
  // Atlas rows grow downward.
  atlasUv.y = 1.0 - atlasUv.y;
  vec4 tex = texture2D(uAtlas, atlasUv);
  ${water ? '' : 'if (tex.a < 0.5) discard;'}

  float sun = (vLight.x / 15.0) * uSunLevel;
  float block = vLight.y / 15.0;
  float l = max(sun, block);
  float brightness = pow(l, 1.45) * 0.96 + 0.04;
  // Blocklight carries a warm tint; sunlight follows the sky tint.
  vec3 lightColor = mix(uSkyTint, vec3(1.0, 0.85, 0.6), clamp(block - sun, 0.0, 1.0) * 0.55);

  vec3 col = tex.rgb * vShade * brightness * lightColor;
  float fogF = smoothstep(uFogNear, uFogFar, vDist);
  col = mix(col, uFogColor, fogF);
  // User brightness (gamma) — applied after fog so night lift is uniform.
  col = pow(col, vec3(1.0 / uGamma));
  ${water
    ? 'float shimmer = 0.92 + 0.08 * sin(uTime * 2.2 + vUv.x * 6.2831 + vUv.y * 4.0);\n  gl_FragColor = vec4(col * shimmer, 0.72);'
    : 'gl_FragColor = vec4(col, 1.0);'}
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
