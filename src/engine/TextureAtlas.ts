/**
 * Procedural 512x512 texture atlas: a 32x32 grid of authentic 16x16px tiles
 * painted at startup with seeded pixel noise (no external assets). All painter
 * coordinates are expressed relative to TILE_PX so the art is resolution-correct.
 * Also exports per-tile PNG data-URLs for the React inventory UI.
 */
import * as THREE from 'three';
import { ATLAS_SIZE, TILE, TILE_PX, CELL_PX, TILE_GUTTER } from '../core/blocks';
import { mulberry32 } from '../core/prng';

type RGB = [number, number, number];
const N = TILE_PX; // 16

/**
 * Replicate a freshly painted tile's edge pixels outward into its gutter so
 * mipmap downsampling never pulls colour from neighbouring tiles.
 * (ix,iy) = top-left of the 16px interior inside its 32px cell.
 */
function extrudeCell(img: ImageData, ix: number, iy: number): void {
  const d = img.data;
  const w = ATLAS_SIZE;
  const cellX = ix - TILE_GUTTER;
  const cellY = iy - TILE_GUTTER;
  for (let y = 0; y < CELL_PX; y++) {
    for (let x = 0; x < CELL_PX; x++) {
      const inside = x >= TILE_GUTTER && x < TILE_GUTTER + TILE_PX && y >= TILE_GUTTER && y < TILE_GUTTER + TILE_PX;
      if (inside) continue;
      const sx = Math.min(TILE_PX - 1, Math.max(0, x - TILE_GUTTER));
      const sy = Math.min(TILE_PX - 1, Math.max(0, y - TILE_GUTTER));
      const si = ((iy + sy) * w + ix + sx) * 4;
      const di = ((cellY + y) * w + cellX + x) * 4;
      d[di] = d[si];
      d[di + 1] = d[si + 1];
      d[di + 2] = d[si + 2];
      d[di + 3] = d[si + 3];
    }
  }
}

/**
 * Flood the RGB of a tile's fully transparent texels with the average color
 * of their opaque neighbours (alpha stays 0). Mipmap generation averages RGB
 * unweighted by alpha, so without this, cutout tiles (painted on black
 * transparency) darken toward black at distance and any relaxed alpha
 * threshold exposes near-black fringes instead of foliage-coloured pixels.
 */
function dilateTransparent(img: ImageData, ix: number, iy: number): void {
  const d = img.data;
  const w = ATLAS_SIZE;
  for (let pass = 0; pass < TILE_PX; pass++) {
    let changed = false;
    for (let y = 0; y < TILE_PX; y++) {
      for (let x = 0; x < TILE_PX; x++) {
        const i = ((iy + y) * w + ix + x) * 4;
        if (d[i + 3] !== 0) continue;
        // Skip texels already colored by a previous pass (non-black RGB).
        if (d[i] !== 0 || d[i + 1] !== 0 || d[i + 2] !== 0) continue;
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || nx >= TILE_PX || ny < 0 || ny >= TILE_PX) continue;
          const ni = ((iy + ny) * w + ix + nx) * 4;
          const filled = d[ni + 3] !== 0 || d[ni] !== 0 || d[ni + 1] !== 0 || d[ni + 2] !== 0;
          if (!filled) continue;
          r += d[ni];
          g += d[ni + 1];
          b += d[ni + 2];
          n++;
        }
        if (n > 0) {
          d[i] = Math.max(1, Math.round(r / n));
          d[i + 1] = Math.max(1, Math.round(g / n));
          d[i + 2] = Math.max(1, Math.round(b / n));
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
}

class TilePainter {
  constructor(
    private img: ImageData,
    private ox: number,
    private oy: number,
    public rand: () => number,
  ) {}

  px(x: number, y: number, r: number, g: number, b: number, a = 255): void {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= N || y < 0 || y >= N) return;
    const i = ((this.oy + y) * ATLAS_SIZE + this.ox + x) * 4;
    const d = this.img.data;
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = a;
  }

  /** Base fill with per-pixel brightness jitter. */
  noiseFill(c: RGB, jitter: number): void {
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const f = 1 + (this.rand() - 0.5) * jitter;
        this.px(x, y, c[0] * f, c[1] * f, c[2] * f);
      }
    }
  }

  /**
   * Two-scale material grain: broad tonal patches (cell-sized, low contrast)
   * PLUS fine per-pixel detail. The patches keep the surface from reading as
   * TV static at distance; the fine layer keeps it from looking like a
   * hand-painted 4x4 checkerboard up close. Mipmaps + anisotropy average the
   * fine layer away naturally, so it costs nothing in the distance.
   */
  grain(c: RGB, patch: number, fine: number, cell = 8): void {
    const cells = Math.ceil(N / cell) + 1;
    const vals: number[] = [];
    for (let i = 0; i < cells * cells; i++) vals.push((this.rand() - 0.5) * patch);
    // Bilinear-interpolated patch field → smooth blotches, no hard cell edges.
    const at = (cx: number, cy: number): number => vals[Math.min(cells - 1, cy) * cells + Math.min(cells - 1, cx)];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const fx = x / cell;
        const fy = y / cell;
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const tx = fx - x0;
        const ty = fy - y0;
        const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx;
        const bot = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
        const f = 1 + (top * (1 - ty) + bot * ty) + (this.rand() - 0.5) * fine;
        this.px(x, y, c[0] * f, c[1] * f, c[2] * f);
      }
    }
  }

  /** Blocky low-frequency noise for stone-like materials (cell in px). */
  cellNoise(c: RGB, jitter: number, cell = 2): void {
    const cells = Math.ceil(N / cell);
    const vals: number[] = [];
    for (let i = 0; i < cells * cells; i++) vals.push(1 + (this.rand() - 0.5) * jitter);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const f =
          vals[Math.floor(y / cell) * cells + Math.floor(x / cell)] *
          (1 + (this.rand() - 0.5) * jitter * 0.4);
        this.px(x, y, c[0] * f, c[1] * f, c[2] * f);
      }
    }
  }

  speckle(c: RGB, count: number, size = 1): void {
    for (let i = 0; i < count; i++) {
      const x = Math.floor(this.rand() * (N - size));
      const y = Math.floor(this.rand() * (N - size));
      for (let dy = 0; dy < size; dy++) {
        for (let dx = 0; dx < size; dx++) {
          const f = 1 + (this.rand() - 0.5) * 0.25;
          this.px(x + dx, y + dy, c[0] * f, c[1] * f, c[2] * f);
        }
      }
    }
  }

  border(c: RGB, width = 1): void {
    for (let i = 0; i < N; i++) {
      for (let w = 0; w < width; w++) {
        this.px(i, w, c[0], c[1], c[2]);
        this.px(i, N - 1 - w, c[0], c[1], c[2]);
        this.px(w, i, c[0], c[1], c[2]);
        this.px(N - 1 - w, i, c[0], c[1], c[2]);
      }
    }
  }

  /** Vertical streaks (wood grain / log bark). */
  grainV(base: RGB, dark: RGB, streaks: number): void {
    this.noiseFill(base, 0.15);
    for (let s = 0; s < streaks; s++) {
      let x = Math.floor(this.rand() * N);
      for (let y = 0; y < N; y++) {
        if (this.rand() < 0.18) x += this.rand() < 0.5 ? -1 : 1;
        const f = 1 + (this.rand() - 0.5) * 0.2;
        this.px((x + N) % N, y, dark[0] * f, dark[1] * f, dark[2] * f);
      }
    }
  }

  line(x0: number, y0: number, x1: number, y1: number, c: RGB): void {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= steps; i++) {
      this.px(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c[0], c[1], c[2]);
    }
  }

  rect(x: number, y: number, w: number, h: number, c: RGB, a = 255): void {
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) this.px(x + dx, y + dy, c[0], c[1], c[2], a);
  }

  disc(cx: number, cy: number, r: number, c: RGB, jitter = 0): void {
    for (let y = Math.floor(cy - r); y <= cy + r; y++) {
      for (let x = Math.floor(cx - r); x <= cx + r; x++) {
        if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r + 0.3) {
          const f = 1 + (this.rand() - 0.5) * jitter;
          this.px(x, y, c[0] * f, c[1] * f, c[2] * f);
        }
      }
    }
  }

  /** Multiply existing pixels by f (relative shading, keeps texture). */
  shade(x: number, y: number, w: number, h: number, f: number): void {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || xx >= N || yy < 0 || yy >= N) continue;
        const i = ((this.oy + yy) * ATLAS_SIZE + this.ox + xx) * 4;
        const d = this.img.data;
        d[i] = Math.min(255, d[i] * f);
        d[i + 1] = Math.min(255, d[i + 1] * f);
        d[i + 2] = Math.min(255, d[i + 2] * f);
      }
    }
  }

  /** 2x2 checkerboard of two colours (soft material transitions). */
  dither(x: number, y: number, w: number, h: number, c1: RGB, c2: RGB): void {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const c = ((x + dx) + (y + dy)) % 2 === 0 ? c1 : c2;
        const f = 1 + (this.rand() - 0.5) * 0.08;
        this.px(x + dx, y + dy, c[0] * f, c[1] * f, c[2] * f);
      }
    }
  }

  /** 1px light top/left + dark bottom/right edge (consistent TL light). */
  bevel(strength = 0.18): void {
    this.shade(0, 0, N, 1, 1 + strength);
    this.shade(0, 1, 1, N - 1, 1 + strength * 0.7);
    this.shade(0, N - 1, N, 1, 1 - strength);
    this.shade(N - 1, 1, 1, N - 2, 1 - strength * 0.7);
  }

  clear(): void {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) this.px(x, y, 0, 0, 0, 0);
  }

  alphaAt(x: number, y: number): number {
    if (x < 0 || x >= N || y < 0 || y >= N) return 0;
    return this.img.data[((this.oy + y) * ATLAS_SIZE + this.ox + x) * 4 + 3];
  }

  /**
   * 1px dark contour around every opaque region (P5-6 unified icon style):
   * transparent pixels bordering opaque ones become the outline color, so
   * icons read crisply on light AND dark slot backgrounds.
   */
  outline(c: RGB = [24, 16, 14], alpha = 235): void {
    const solid: boolean[] = new Array(N * N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) solid[y * N + x] = this.alphaAt(x, y) > 60;
    }
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (solid[y * N + x]) continue;
        const nb =
          (x > 0 && solid[y * N + x - 1]) ||
          (x < N - 1 && solid[y * N + x + 1]) ||
          (y > 0 && solid[(y - 1) * N + x]) ||
          (y < N - 1 && solid[(y + 1) * N + x]);
        if (nb) this.px(x, y, c[0], c[1], c[2], alpha);
      }
    }
  }
}

type Painter = (p: TilePainter) => void;

const GRASS_GREEN: RGB = [121, 172, 66];
const DIRT_BROWN: RGB = [134, 96, 67];
const STONE_GRAY: RGB = [128, 128, 128];
const SAND_YELLOW: RGB = [219, 207, 163];
const WOOD: RGB = [156, 127, 78];
const WOOD_DK: RGB = [110, 86, 50];
const LEAF_GREEN: RGB = [72, 130, 50];
const HANDLE: RGB = [120, 90, 50];

function plankPainter(p: TilePainter): void {
  p.noiseFill(WOOD, 0.12);
  // Horizontal plank seams every 4px + staggered vertical ends.
  for (const y of [3, 7, 11, 15]) for (let x = 0; x < N; x++) p.px(x, y, WOOD_DK[0], WOOD_DK[1], WOOD_DK[2]);
  for (const [x, y0] of [[7, 0], [3, 4], [11, 8], [5, 12]] as const) {
    for (let y = y0; y < y0 + 4; y++) p.px(x, y, WOOD_DK[0], WOOD_DK[1], WOOD_DK[2]);
  }
}

function cobblePainter(mossy: boolean): Painter {
  return (p) => {
    // Deep mortar base so the gaps between stones read as recessed shadow.
    const mortar: RGB = mossy ? [50, 54, 44] : [54, 55, 60];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const f = 1 + (p.rand() - 0.5) * 0.3;
        p.px(x, y, mortar[0] * f, mortar[1] * f, mortar[2] * f);
      }
    }
    // Irregular rounded cobbles on a jittered, row-staggered grid. Each stone
    // is an ellipse with its own gray tone; pixels claim the nearest stone
    // (elliptical Voronoi) so the untouched space between them stays mortar.
    type Lump = { cx: number; cy: number; rx: number; ry: number; tone: number };
    const lumps: Lump[] = [];
    const cols = 3;
    const rows = 3;
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const cw = N / cols;
        const ch = N / rows;
        const cx = (gx + (gy % 2 ? 0.5 : 0)) * cw + cw / 2 + (p.rand() - 0.5) * 2.2;
        const cy = gy * ch + ch / 2 + (p.rand() - 0.5) * 1.8;
        lumps.push({
          cx,
          cy,
          rx: cw / 2 + 0.3 + p.rand() * 1.1,
          ry: ch / 2 + 0.1 + p.rand() * 0.9,
          tone: 0.78 + p.rand() * 0.5,
        });
      }
    }
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let best = -1;
        let bd = 1e9;
        for (let i = 0; i < lumps.length; i++) {
          const L = lumps[i];
          const nx = (x + 0.5 - L.cx) / L.rx;
          const ny = (y + 0.5 - L.cy) / L.ry;
          const d = nx * nx + ny * ny;
          if (d < bd) {
            bd = d;
            best = i;
          }
        }
        if (bd > 1.0 || best < 0) continue; // outside every stone → mortar gap
        const L = lumps[best];
        const nx = (x + 0.5 - L.cx) / L.rx;
        const ny = (y + 0.5 - L.cy) / L.ry;
        const rim = Math.sqrt(bd);
        // Light from the top-left: brighter that way, dark shaded rim.
        const lit = 1 - (nx + ny) * 0.16;
        const edge = rim > 0.8 ? 0.66 : rim > 0.6 ? 0.86 : 1;
        const grain = 1 + (p.rand() - 0.5) * 0.14;
        const g = STONE_GRAY[1] * L.tone * lit * edge * grain;
        p.px(x, y, g * 0.98, g, g * 1.03); // faint cool cast
      }
    }
    if (mossy) {
      // Moss pools in the crevices and creeps up the lower stones.
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const bias = (y / N) * 0.5; // greener toward the bottom
          if (p.rand() < 0.12 + bias) {
            const f = 0.65 + p.rand() * 0.55;
            p.px(x, y, 44 * f, 92 * f, 40 * f);
          }
        }
      }
      for (let i = 0; i < 8; i++) {
        p.px(Math.floor(p.rand() * N), Math.floor(p.rand() * N), 108, 150, 66);
      }
    }
  };
}

/**
 * Ores get a per-material signature (P5-4) instead of generic squares:
 * coal = matte chunks, iron = rough nuggets, gold = diagonal veins,
 * diamond = faceted rhombs with a gleam.
 */
function orePainter(ore: RGB, kind: 'coal' | 'iron' | 'gold' | 'diamond' = 'iron'): Painter {
  return (p) => {
    p.cellNoise(STONE_GRAY, 0.16, 3);
    if (kind === 'diamond') {
      for (const [cx, cy] of [[4, 5], [11, 4], [7, 10], [12, 12]] as const) {
        // Rhombus facets: left face lit, right face shaded, white sparkle.
        for (let d = -2; d <= 2; d++) {
          const w = 2 - Math.abs(d);
          for (let k = -w; k <= w; k++) {
            const shade = k < 0 ? 1.15 : 0.8;
            p.px(cx + k, cy + d, ore[0] * shade, ore[1] * shade, ore[2] * shade);
          }
        }
        p.px(cx, cy - 1, 235, 255, 253);
      }
      return;
    }
    if (kind === 'gold') {
      for (let v = 0; v < 3; v++) {
        let x = 1 + Math.floor(p.rand() * 6);
        let y = 2 + Math.floor(p.rand() * 10);
        for (let i = 0; i < 6 + Math.floor(p.rand() * 4); i++) {
          const f = 1 + (p.rand() - 0.5) * 0.25;
          p.px(x, y, ore[0] * f, ore[1] * f, ore[2] * f);
          p.px(x, y + 1, ore[0] * 0.7, ore[1] * 0.7, ore[2] * 0.7);
          x++;
          if (p.rand() < 0.45) y += p.rand() < 0.5 ? -1 : 1;
        }
      }
      return;
    }
    const chunks = kind === 'coal' ? 6 : 5;
    for (let i = 0; i < chunks; i++) {
      const x = 2 + Math.floor(p.rand() * (N - 5));
      const y = 2 + Math.floor(p.rand() * (N - 5));
      const s = 2 + Math.floor(p.rand() * 2);
      for (let dy = 0; dy < s; dy++) {
        for (let dx = 0; dx < s - (dy === 0 ? 1 : 0); dx++) {
          const f = 1 + (p.rand() - 0.5) * (kind === 'coal' ? 0.2 : 0.3);
          p.px(x + dx, y + dy, ore[0] * f, ore[1] * f, ore[2] * f);
        }
      }
      // Top-left glint on metallic nuggets.
      if (kind === 'iron') p.px(x, y, Math.min(255, ore[0] * 1.3), Math.min(255, ore[1] * 1.3), Math.min(255, ore[2] * 1.3));
    }
  };
}

/**
 * Tool icons (P5-6 pass): 2px handles, chunky material heads with a fixed
 * top-left gleam and darker underside so every tier reads at hotbar size.
 */
function toolPainter(head: RGB, kind: 'pick' | 'sword' | 'axe' | 'shovel'): Painter {
  return (p) => {
    p.clear();
    const hd: RGB = [head[0] * 0.7, head[1] * 0.7, head[2] * 0.7];
    const hi: RGB = [Math.min(255, head[0] * 1.3), Math.min(255, head[1] * 1.3), Math.min(255, head[2] * 1.3)];
    const stick = (x0: number, y0: number, len: number) => {
      for (let i = 0; i < len; i++) {
        p.px(x0 + i, y0 - i, HANDLE[0], HANDLE[1], HANDLE[2]);
        p.px(x0 + i + 1, y0 - i, HANDLE[0] * 0.76, HANDLE[1] * 0.76, HANDLE[2] * 0.76);
      }
      // Leather grip wrap near the base.
      p.px(x0 + 1, y0 - 1, 86, 60, 34);
      p.px(x0 + 2, y0 - 1, 86, 60, 34);
      p.px(x0 + 2, y0 - 2, 86, 60, 34);
    };
    if (kind === 'pick') {
      stick(2, 13, 9);
      // Curved 2px-thick head arcing across the top, tips drooping down.
      for (let i = 0; i <= 11; i++) {
        const x = 2 + i;
        const y = 5 - Math.round(Math.sin((i / 11) * Math.PI) * 3.2);
        p.px(x, y, head[0], head[1], head[2]);
        p.px(x, y + 1, i < 6 ? head[0] : hd[0], i < 6 ? head[1] : hd[1], i < 6 ? head[2] : hd[2]);
      }
      for (const [tx, ty] of [[2, 6], [2, 7], [13, 6], [13, 7]] as const) p.px(tx, ty, hd[0], hd[1], hd[2]);
      p.px(4, 2, hi[0], hi[1], hi[2]);
      p.px(5, 2, hi[0], hi[1], hi[2]);
      p.px(6, 1, hi[0], hi[1], hi[2]);
    } else if (kind === 'axe') {
      stick(2, 13, 9);
      // Bearded blade hanging off the top-right of the handle.
      const widths = [
        [8, 12], [7, 13], [7, 14], [7, 14], [8, 14], [9, 14], [10, 13],
      ] as const;
      for (let r = 0; r < widths.length; r++) {
        const [x0, x1] = widths[r];
        for (let x = x0; x <= x1; x++) p.px(x, 1 + r, head[0], head[1], head[2]);
        p.px(x0, 1 + r, hi[0], hi[1], hi[2]); // lit leading edge
        p.px(x1, 1 + r, hd[0], hd[1], hd[2]); // dark back
      }
      for (let x = 9; x <= 12; x++) p.px(x, 8, hd[0], hd[1], hd[2]); // beard underside
    } else if (kind === 'shovel') {
      stick(2, 13, 8);
      // Pointed spade blade, tip up-right (clearly not an axe).
      const rows = [
        [11, 11], [10, 12], [9, 13], [9, 13], [10, 12], [11, 11],
      ] as const;
      for (let r = 0; r < rows.length; r++) {
        const [x0, x1] = rows[r];
        for (let x = x0; x <= x1; x++) p.px(x, r, head[0], head[1], head[2]);
      }
      p.px(11, 0, hi[0], hi[1], hi[2]);
      p.px(10, 1, hi[0], hi[1], hi[2]);
      p.px(9, 2, hi[0], hi[1], hi[2]);
      p.px(12, 3, hd[0], hd[1], hd[2]);
      p.px(12, 4, hd[0], hd[1], hd[2]);
      p.px(11, 5, hd[0], hd[1], hd[2]); // socket joint to the handle
    } else {
      // Sword: broad 2px blade with a bright edge, crossguard, pommel.
      for (let i = 0; i < 8; i++) {
        const x = 5 + i;
        const y = 10 - i;
        p.px(x, y, head[0], head[1], head[2]);
        p.px(x + 1, y, hi[0], hi[1], hi[2]); // honed edge
        p.px(x, y + 1, hd[0], hd[1], hd[2]); // spine shadow
      }
      p.px(13, 2, hi[0], hi[1], hi[2]); // tip
      p.px(12, 1, hi[0], hi[1], hi[2]);
      // Crossguard perpendicular to the blade.
      p.px(3, 10, 96, 70, 38);
      p.px(4, 11, 96, 70, 38);
      p.px(5, 12, 96, 70, 38);
      p.px(6, 11, 118, 88, 48);
      // Grip + pommel.
      p.px(3, 12, HANDLE[0], HANDLE[1], HANDLE[2]);
      p.px(2, 13, HANDLE[0], HANDLE[1], HANDLE[2]);
      p.px(1, 14, 96, 70, 38);
    }
  };
}

const MAT_WOOD: RGB = [140, 110, 70];
const MAT_STONE: RGB = [128, 128, 128];
const MAT_IRON: RGB = [216, 216, 216];
const MAT_DIAMOND: RGB = [93, 236, 245];

function crackPainter(stage: number): Painter {
  return (p) => {
    p.clear();
    const cracks = 2 + stage * 2;
    for (let c = 0; c < cracks; c++) {
      let x = Math.floor(p.rand() * N);
      let y = Math.floor(p.rand() * N);
      const len = 3 + stage * 3;
      for (let i = 0; i < len; i++) {
        p.px(x, y, 20, 16, 12, 210);
        x += Math.floor(p.rand() * 3) - 1;
        y += Math.floor(p.rand() * 3) - 1;
        if (x < 0 || x >= N || y < 0 || y >= N) break;
      }
    }
  };
}

function ingotPainter(p: TilePainter, c: RGB): void {
  p.clear();
  const hi: RGB = [Math.min(255, c[0] * 1.25), Math.min(255, c[1] * 1.25), Math.min(255, c[2] * 1.25)];
  const dk: RGB = [c[0] * 0.62, c[1] * 0.62, c[2] * 0.62];
  // Cast bar in 3/4 view: lit top face, body, shaded right end.
  for (let x = 4; x <= 12; x++) p.px(x, 5, hi[0], hi[1], hi[2]);
  for (let x = 3; x <= 13; x++) p.px(x, 6, c[0], c[1], c[2]);
  for (let y = 7; y <= 9; y++) {
    for (let x = 2; x <= 13; x++) {
      const f = 1 - (y - 7) * 0.07;
      p.px(x, y, c[0] * f, c[1] * f, c[2] * f);
    }
  }
  for (let x = 3; x <= 13; x++) p.px(x, 10, dk[0], dk[1], dk[2]);
  for (let y = 6; y <= 10; y++) p.px(13, y, dk[0], dk[1], dk[2]);
  // Mirror-polish diagonal gleam.
  p.px(5, 6, 255, 255, 252);
  p.px(4, 7, hi[0], hi[1], hi[2]);
  p.px(6, 7, hi[0], hi[1], hi[2]);
}

function muttonPainter(p: TilePainter, meat: RGB, edge: RGB): void {
  p.clear();
  p.disc(7, 7, 4.5, meat, 0.2);
  for (let i = 0; i < 4; i++) p.px(10 + i, 11 + Math.floor(i / 2), edge[0], edge[1], edge[2]);
}

/** Parametric plank painter (same layout as oak, any color). */
function coloredPlanks(base: RGB, seam: RGB): Painter {
  return (p) => {
    p.noiseFill(base, 0.1);
    for (const y of [3, 7, 11, 15]) for (let x = 0; x < N; x++) p.px(x, y, seam[0], seam[1], seam[2]);
    for (const [x, y0] of [[7, 0], [3, 4], [11, 8], [5, 12]] as const) {
      for (let y = y0; y < y0 + 4; y++) p.px(x, y, seam[0], seam[1], seam[2]);
    }
  };
}

/** Baked-clay painter: soft banded strata with fine grit (badlands family). */
function terracottaPainter(base: RGB): Painter {
  return (p) => {
    p.noiseFill(base, 0.07);
    for (const y of [4, 9, 13]) {
      for (let x = 0; x < N; x++) {
        const f = 0.86 + (p.rand() - 0.5) * 0.06;
        p.px(x, y, base[0] * f, base[1] * f, base[2] * f);
      }
    }
    p.speckle([base[0] * 1.14, base[1] * 1.14, base[2] * 1.14], 6, 1);
    p.bevel(0.05);
  };
}

/** Parametric leaf painter (oak recipe: shadow bed + bright clumps + holes). */
function coloredLeaves(base: RGB, bright: RGB, dark: RGB, density: number): Painter {
  return (p) => {
    p.clear();
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (p.rand() < density) {
          const f = 0.88 + p.rand() * 0.28;
          p.px(x, y, base[0] * f, base[1] * f, base[2] * f);
        }
      }
    }
    for (let i = 0; i < 32; i++) {
      const x = Math.floor(p.rand() * N);
      const y = Math.floor(p.rand() * N);
      const c: RGB = p.rand() < 0.5 ? bright : dark;
      p.px(x, y, c[0], c[1], c[2]);
      p.px(x + 1, y, c[0] * 0.9, c[1] * 0.9, c[2] * 0.9);
      p.px(x, y + 1, c[0] * 0.82, c[1] * 0.82, c[2] * 0.82);
    }
  };
}

/** Parametric log-side painter (vertical grain + dark grooves). */
function coloredLogSide(bark: RGB, groove: RGB, cols: number[], streaks: number): Painter {
  return (p) => {
    p.grainV(bark, groove, streaks);
    for (const x of cols) {
      for (let y = 0; y < N; y++) if (p.rand() < 0.85) p.px(x, y, groove[0], groove[1], groove[2]);
      p.shade(x + 1, 0, 1, N, 1.15);
    }
  };
}

/** Parametric log-end painter (bark rim + concentric rings + heart). */
function coloredLogTop(fill: RGB, rim: RGB, ring: RGB, heart: RGB): Painter {
  return (p) => {
    p.noiseFill(fill, 0.08);
    p.border(rim, 2);
    for (let r = 1.5; r < 6; r += 1.7) {
      for (let a = 0; a < 360; a += 6) {
        p.px(8 + Math.cos((a * Math.PI) / 180) * r, 8 + Math.sin((a * Math.PI) / 180) * r * 0.9, ring[0], ring[1], ring[2]);
      }
    }
    p.px(8, 8, heart[0], heart[1], heart[2]);
  };
}

const PAINTERS: Record<number, Painter> = {
  [TILE.GRASS_TOP]: (p) => {
    // Turf reads as real grass: soft tonal patches for shape at distance,
    // fine per-pixel grain for crispness up close, blade tufts on top.
    p.grain(GRASS_GREEN, 0.05, 0.16, 8);
    for (let i = 0; i < 18; i++) {
      const x = Math.floor(p.rand() * N);
      const y = Math.floor(p.rand() * N);
      p.px(x, y, 140, 192, 80);
      p.px(x, y - 1, 150, 202, 88);
    }
    for (let i = 0; i < 12; i++) {
      const x = Math.floor(p.rand() * N);
      const y = Math.floor(p.rand() * N);
      p.px(x, y, 98, 146, 52);
      p.px(x + 1, y + 1, 92, 138, 48);
    }
    p.bevel(0.06);
  },
  [TILE.GRASS_SIDE]: (p) => {
    // Dirt body under a gently uneven turf lip.
    p.grain(DIRT_BROWN, 0.05, 0.2, 8);
    p.speckle([106, 74, 50], 7, 1);
    p.speckle([150, 112, 80], 5, 1);
    for (let x = 0; x < N; x++) {
      const depth = 3 + ((x * 7 + 3) % 5 === 0 ? 1 : 0) - (x % 6 === 2 ? 1 : 0);
      for (let y = 0; y < depth; y++) {
        const f = 1 + (p.rand() - 0.5) * 0.1 - y * 0.04;
        p.px(x, y, GRASS_GREEN[0] * f, GRASS_GREEN[1] * f, GRASS_GREEN[2] * f);
      }
      if (x % 6 === 0) p.px(x, depth, 104, 152, 58);
    }
    for (let x = 0; x < N; x++) p.px(x, 0, 132, 184, 74);
  },
  [TILE.DIRT]: (p) => {
    // Earth with embedded pebbles and root flecks.
    p.grain(DIRT_BROWN, 0.055, 0.22, 8);
    for (let i = 0; i < 6; i++) {
      const x = Math.floor(p.rand() * (N - 2));
      const y = Math.floor(p.rand() * (N - 2));
      p.rect(x, y, 2, 1, [158, 120, 88]);
      p.px(x, y + 1, 100, 72, 48);
    }
    p.speckle([110, 78, 52], 9, 1);
    p.speckle([148, 112, 80], 5, 1);
  },
  [TILE.STONE]: (p) => {
    // Rock: broad tonal patches for silhouette + fine mineral grain, a few
    // shadowed blotches and short cracks. (Full-height fissures used to alias
    // into vertical stripes at distance, so cracks stay short.)
    p.grain(STONE_GRAY, 0.045, 0.17, 8);
    for (let i = 0; i < 3; i++) {
      p.disc(2 + p.rand() * 12, 2 + p.rand() * 12, 1.6 + p.rand(), [114, 114, 118], 0.1);
    }
    p.speckle([152, 152, 156], 7, 1);
    p.speckle([104, 104, 108], 6, 1);
    for (let c = 0; c < 3; c++) {
      let x = Math.floor(p.rand() * N);
      let y = Math.floor(p.rand() * 10);
      const len = 4 + Math.floor(p.rand() * 4);
      for (let i = 0; i < len && y < N; i++) {
        p.px(x, y, 100, 100, 104);
        if (p.rand() < 0.4) x += p.rand() < 0.5 ? -1 : 1;
        y++;
      }
    }
    p.speckle([146, 146, 150], 5, 1);
    p.bevel(0.05);
  },
  [TILE.COBBLESTONE]: cobblePainter(false),
  [TILE.MOSSY_COBBLESTONE]: cobblePainter(true),
  [TILE.BEDROCK]: (p) => {
    p.cellNoise([58, 58, 62], 0.55, 3);
    p.speckle([28, 28, 32], 14, 2);
  },
  [TILE.SAND]: (p) => {
    // Wind-rippled dunes: soft horizontal waves.
    p.noiseFill(SAND_YELLOW, 0.07);
    for (let y = 1; y < N; y += 4) {
      for (let x = 0; x < N; x++) {
        const yy = y + Math.round(Math.sin((x / N) * Math.PI * 2 + y) * 1.2);
        p.px(x, yy, 201, 188, 142);
        p.px(x, yy + 1, 233, 222, 180);
      }
    }
  },
  [TILE.GRAVEL]: (p) => {
    // Distinct rounded pebbles over grit instead of pure noise.
    p.cellNoise([116, 110, 104], 0.2, 2);
    for (let i = 0; i < 7; i++) {
      const x = 1 + Math.floor(p.rand() * (N - 4));
      const y = 1 + Math.floor(p.rand() * (N - 4));
      const shade = 0.75 + p.rand() * 0.5;
      p.disc(x + 1, y + 1, 1.6, [122 * shade, 116 * shade, 110 * shade], 0.1);
      p.px(x, y, 152, 148, 142);
    }
  },
  [TILE.SANDSTONE_TOP]: (p) => {
    // Smooth-cut slab: framed face with faint tool marks.
    p.noiseFill([216, 203, 155], 0.06);
    p.border([196, 183, 135]);
    p.speckle([228, 216, 170], 5, 1);
    p.speckle([200, 186, 138], 4, 1);
    p.bevel(0.06);
  },
  [TILE.SANDSTONE_SIDE]: (p) => {
    // Layered sediment bands with embedded grit and a darker footing.
    p.noiseFill([216, 203, 155], 0.07);
    for (const y of [4, 9, 13]) {
      for (let x = 0; x < N; x++) {
        const f = 0.9 + (p.rand() - 0.5) * 0.05;
        p.px(x, y, 196 * f, 182 * f, 134 * f);
      }
    }
    p.speckle([190, 172, 120], 6, 1);
    p.speckle([230, 218, 174], 5, 1);
    for (let x = 0; x < N; x++) p.px(x, 15, 188, 174, 126);
  },
  [TILE.OAK_LOG_SIDE]: (p) => {
    // Bark with deep ridge grooves and a knot.
    p.grainV([104, 82, 49], [78, 60, 35], 3);
    for (const x of [2, 6, 11, 14]) {
      for (let y = 0; y < N; y++) {
        if (p.rand() < 0.85) p.px(x, y, 66, 50, 30);
      }
      p.shade(x + 1, 0, 1, N, 1.18);
    }
    const ky = 4 + Math.floor(p.rand() * 8);
    p.disc(8, ky, 1.6, [70, 52, 30]);
    p.px(8, ky, 52, 38, 22);
  },
  [TILE.OAK_LOG_TOP]: (p) => {
    // End grain: bark rim + concentric rings around an off-center heart.
    p.noiseFill([156, 127, 78], 0.08);
    p.border([88, 68, 40], 2);
    for (let r = 1.5; r < 6; r += 1.7) {
      for (let a = 0; a < 360; a += 5) {
        p.px(
          8 + Math.cos((a * Math.PI) / 180) * r,
          8 + Math.sin((a * Math.PI) / 180) * r * 0.9,
          118, 93, 56,
        );
      }
    }
    p.px(8, 8, 92, 70, 42);
  },
  [TILE.OAK_LEAVES]: (p) => {
    // Clustered foliage: denser bed with softer clump contrast — fewer
    // see-through pinholes so far canopies stay solid instead of sparkling.
    p.clear();
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (p.rand() < 0.78) {
          const f = 0.88 + p.rand() * 0.26;
          p.px(x, y, LEAF_GREEN[0] * f, LEAF_GREEN[1] * f, LEAF_GREEN[2] * f);
        }
      }
    }
    for (let i = 0; i < 26; i++) {
      const x = Math.floor(p.rand() * N);
      const y = Math.floor(p.rand() * N);
      const bright = p.rand() < 0.4;
      const c: RGB = bright ? [104, 172, 74] : [88, 152, 62];
      p.px(x, y, c[0], c[1], c[2]);
      p.px(x + 1, y, c[0] * 0.92, c[1] * 0.92, c[2] * 0.92);
      p.px(x, y + 1, c[0] * 0.85, c[1] * 0.85, c[2] * 0.85);
    }
  },
  [TILE.BIRCH_LOG_SIDE]: (p) => {
    p.grainV([214, 210, 200], [192, 188, 178], 3);
    for (let i = 0; i < 4; i++) {
      const x = Math.floor(p.rand() * 13);
      const y = Math.floor(p.rand() * 15);
      p.rect(x, y, 2, 1, [44, 42, 38]);
    }
  },
  [TILE.BIRCH_LEAVES]: (p) => {
    p.clear();
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (p.rand() < 0.82) {
          const f = 1 + (p.rand() - 0.5) * 0.4;
          p.px(x, y, 96 * f, 150 * f, 70 * f);
        }
      }
    }
  },
  [TILE.OAK_PLANKS]: plankPainter,
  [TILE.COAL_ORE]: orePainter([38, 38, 38], 'coal'),
  [TILE.IRON_ORE]: orePainter([216, 175, 147], 'iron'),
  [TILE.GOLD_ORE]: orePainter([252, 222, 112], 'gold'),
  [TILE.DIAMOND_ORE]: orePainter([93, 236, 245], 'diamond'),
  [TILE.GLASS]: (p) => {
    // Framed pane: steel-blue frame, corner rivets, one diagonal streak.
    p.clear();
    p.border([176, 208, 218], 1);
    for (const [x, y] of [[1, 1], [14, 1], [1, 14], [14, 14]] as const) p.px(x, y, 132, 162, 174);
    for (let i = 0; i < 6; i++) p.px(9 - i, 3 + i, 226, 244, 250, 170);
    for (let i = 0; i < 4; i++) p.px(12 - i, 8 + i, 214, 236, 244, 120);
  },
  [TILE.SNOW_TOP]: (p) => {
    // Fresh powder with a few glinting crystals and soft drift shadows.
    p.noiseFill([240, 246, 250], 0.05);
    for (let i = 0; i < 6; i++) {
      p.px(Math.floor(p.rand() * N), Math.floor(p.rand() * N), 255, 255, 255);
    }
    for (let i = 0; i < 4; i++) {
      const x = Math.floor(p.rand() * (N - 3));
      const y = Math.floor(p.rand() * N);
      p.rect(x, y, 3, 1, [224, 232, 240]);
    }
  },
  [TILE.SNOW_SIDE]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.2);
    for (let x = 0; x < N; x++) for (let y = 0; y < 4; y++) p.px(x, y, 240, 246, 250);
  },
  [TILE.CACTUS_SIDE]: (p) => {
    p.noiseFill([58, 124, 48], 0.15);
    for (let x = 1; x < N; x += 4) for (let y = 0; y < N; y++) p.px(x, y, 38, 90, 32);
    p.speckle([150, 180, 120], 4, 1);
  },
  [TILE.CACTUS_TOP]: (p) => {
    p.noiseFill([70, 140, 58], 0.12);
    p.border([48, 104, 40], 1);
  },
  [TILE.TALL_GRASS]: (p) => {
    p.clear();
    for (let b = 0; b < 6; b++) {
      let x = 2 + b * 2.4;
      for (let y = 15; y > 5 + Math.floor(p.rand() * 4); y--) {
        const f = 1 + (p.rand() - 0.5) * 0.3;
        p.px(x, y, 92 * f, 158 * f, 60 * f);
        if (p.rand() < 0.25) x += p.rand() < 0.5 ? -1 : 1;
      }
    }
  },
  [TILE.FLOWER_RED]: (p) => {
    p.clear();
    for (let y = 7; y < N; y++) p.px(7, y, 58, 110, 40);
    p.px(6, 10, 58, 110, 40);
    p.disc(7, 5, 2.4, [214, 48, 40]);
    p.px(7, 5, 50, 30, 20);
  },
  [TILE.FLOWER_YELLOW]: (p) => {
    p.clear();
    for (let y = 7; y < N; y++) p.px(8, y, 58, 110, 40);
    p.disc(8, 5, 2.4, [240, 214, 70]);
    p.px(8, 5, 180, 140, 30);
  },
  [TILE.TORCH]: (p) => {
    // Wrapped stick with a hot coal head and a soft halo (P5-5 glow pass).
    p.clear();
    for (let y = 6; y < N; y++) {
      p.px(7, y, 128, 96, 52);
      p.px(8, y, 102, 76, 42);
    }
    p.px(7, 9, 84, 60, 34); // wrap band
    p.px(8, 9, 84, 60, 34);
    // Halo, then head, then white-hot core.
    for (const [hx, hy] of [[6, 2], [9, 2], [6, 5], [9, 5], [7, 1], [8, 1], [7, 6], [8, 6]] as const) {
      p.px(hx, hy, 255, 180, 60, 90);
    }
    p.rect(7, 2, 2, 4, [255, 170, 40]);
    p.rect(7, 2, 2, 2, [255, 224, 120]);
    p.px(7, 2, 255, 250, 200);
    p.px(8, 3, 255, 240, 170);
  },
  [TILE.CRAFTING_TABLE_TOP]: (p) => {
    // Wood base with the iconic recessed 3x3 crafting grid.
    p.noiseFill([150, 120, 74], 0.08);
    for (const cy of [2, 7, 12]) for (const cx of [2, 7, 12]) p.rect(cx, cy, 3, 3, [126, 100, 60]);
    const line: RGB = [58, 43, 26];
    for (const c of [0, 5, 10, 15]) {
      for (let i = 0; i < N; i++) {
        p.px(c, i, line[0], line[1], line[2]);
        p.px(i, c, line[0], line[1], line[2]);
      }
    }
  },
  [TILE.CRAFTING_TABLE_SIDE]: (p) => {
    plankPainter(p);
    p.border([74, 56, 32], 1);
    // A handsaw hung on the cabinet side.
    for (let x = 2; x <= 11; x++) p.px(x, 5, 152, 152, 160);
    for (let x = 2; x <= 11; x += 2) p.px(x, 6, 120, 120, 130); // teeth
    p.rect(11, 4, 3, 3, [96, 70, 38]); // handle
  },
  [TILE.CRAFTING_TABLE_FRONT]: (p) => {
    plankPainter(p);
    p.border([74, 56, 32], 1);
    // 2x2 grid emblem framed in the panel.
    p.rect(4, 4, 8, 8, [122, 94, 56]);
    const ln: RGB = [58, 43, 26];
    for (const c of [4, 7, 11]) {
      for (let i = 4; i <= 11; i++) {
        p.px(c, i, ln[0], ln[1], ln[2]);
        p.px(i, c, ln[0], ln[1], ln[2]);
      }
    }
  },
  [TILE.FURNACE_FRONT]: (p) => {
    p.cellNoise([122, 122, 124], 0.16, 4);
    p.border([84, 84, 86], 1);
    // Recessed stone-framed mouth with a hearth floor.
    p.rect(4, 7, 8, 7, [60, 60, 62]);
    p.rect(5, 8, 6, 5, [26, 26, 28]);
    p.rect(5, 12, 6, 1, [46, 42, 40]);
  },
  [TILE.FURNACE_FRONT_LIT]: (p) => {
    p.cellNoise([122, 122, 124], 0.16, 4);
    p.border([84, 84, 86], 1);
    p.rect(4, 7, 8, 7, [60, 60, 62]);
    p.rect(5, 8, 6, 5, [26, 16, 10]);
    // Glowing embers, hotter toward the hearth floor.
    for (let y = 9; y < 13; y++) {
      const heat = (13 - y) / 4;
      for (let x = 5; x < 11; x++) {
        if (p.rand() < 0.45 + heat * 0.4) p.px(x, y, 255, 120 + p.rand() * 110, 20 + p.rand() * 40);
      }
    }
    p.rect(5, 12, 6, 1, [150, 60, 20]);
  },
  [TILE.FURNACE_SIDE]: (p) => {
    p.cellNoise([120, 120, 122], 0.16, 4);
    p.border([90, 90, 92], 1);
  },
  [TILE.FURNACE_TOP]: (p) => {
    p.cellNoise([124, 124, 126], 0.14, 4);
    p.border([92, 92, 94], 1);
    // Chimney hole.
    p.disc(8, 8, 3, [44, 44, 46], 0.12);
    p.disc(8, 8, 1.6, [22, 22, 24]);
  },
  [TILE.CHEST_FRONT]: (p) => {
    chestBody(p);
    // Riveted iron hasp with a keyhole.
    p.rect(6, 5, 4, 5, [88, 92, 98]);
    p.rect(7, 6, 2, 3, [168, 172, 180]);
    p.px(7, 7, 40, 42, 46);
    p.px(8, 8, 40, 42, 46);
    p.px(6, 5, 200, 204, 210);
  },
  [TILE.CHEST_SIDE]: (p) => chestBody(p),
  [TILE.CHEST_TOP]: (p) => {
    p.grainV([176, 130, 66], [140, 104, 52], 3);
    p.border([104, 74, 36], 1);
    // Iron corner caps.
    for (const [x, y] of [[1, 1], [13, 1], [1, 13], [13, 13]] as const) {
      p.rect(x, y, 2, 2, [128, 132, 140]);
    }
    p.shade(0, 0, N, 2, 1.12);
  },
  [TILE.HOPPER_TOP]: (p) => {
    p.cellNoise([78, 78, 82], 0.1, 2);
    p.border([48, 48, 52], 1);
    p.rect(3, 3, 10, 10, [52, 52, 56]);
    p.rect(5, 5, 6, 6, [30, 30, 34]);
    p.rect(6, 6, 4, 4, [16, 16, 18]);
    p.shade(0, 0, N, 2, 1.15);
  },
  [TILE.HOPPER_SIDE]: (p) => {
    p.cellNoise([88, 88, 92], 0.1, 2);
    for (let y = 0; y < N; y++) {
      const inset = Math.floor(y / 3);
      for (let x = 0; x < inset; x++) {
        p.px(x, y, 0, 0, 0, 0);
        p.px(N - 1 - x, y, 0, 0, 0, 0);
      }
      if (inset > 0 && inset < 8) {
        p.px(inset, y, 46, 46, 50);
        p.px(N - 1 - inset, y, 46, 46, 50);
      }
    }
    p.shade(0, 0, N, 3, 1.14);
  },
  [TILE.SPAWNER]: (p) => {
    // Obsidian-dark lattice cage with ember glow burning inside.
    p.clear();
    p.noiseFill([30, 36, 46], 0.22);
    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) {
        if (x % 3 === 2 && y % 3 === 2 && x > 1 && x < 14 && y > 1 && y < 14) {
          // Window into the fire: hotter toward the center.
          const d = Math.hypot(x - 7.5, y - 7.5);
          if (d < 4) p.px(x, y, 255, 150 + p.rand() * 60, 40, 220);
          else p.px(x, y, 120, 60, 30, 200);
        }
      }
    }
    p.border([20, 24, 32], 1);
    p.speckle([52, 62, 76], 6, 1);
  },
  [TILE.WOOL]: (p) => {
    // Woven fleece: soft rows of curls instead of flat noise.
    p.noiseFill([230, 228, 224], 0.06);
    for (let y = 1; y < N; y += 3) {
      for (let x = 0; x < N; x++) {
        const yy = y + ((x >> 2) % 2);
        p.px(x, yy, 210, 206, 200);
        if (x % 4 === 1) p.px(x, yy + 1, 244, 242, 238);
      }
    }
    p.border([214, 210, 204], 1);
  },
  [TILE.GLOWSTONE]: (p) => {
    // Crystalline cells: bright cores in amber webbing.
    p.cellNoise([196, 148, 66], 0.24, 3);
    for (const [cx, cy] of [[3, 4], [10, 3], [5, 10], [12, 11], [8, 7]] as const) {
      p.rect(cx, cy, 3, 3, [255, 214, 110]);
      p.px(cx + 1, cy + 1, 255, 244, 180);
    }
    p.speckle([140, 96, 40], 6, 1);
  },
  [TILE.WATER]: (p) => {
    // Seamlessly tileable wave field (periodic over N, NO per-pixel rand):
    // the water shader scrolls fract(uv) across cells, so the tile MUST wrap
    // exactly or a moving seam appears at every block edge.
    const TAU = Math.PI * 2;
    const DEEP: RGB = [38, 88, 168];
    const LITE: RGB = [104, 162, 224];
    const wave = (x: number, y: number): number => {
      const u = (TAU * x) / N;
      const v = (TAU * y) / N;
      const w =
        Math.sin(u + 0.7 * Math.sin(v)) +
        Math.sin(v + 0.7 * Math.sin(u)) +
        0.6 * Math.sin(u * 2 - v) +
        0.5 * Math.sin(u + v * 2);
      return w / 2.8; // ~[-1, 1]
    };
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const t = wave(x, y) * 0.5 + 0.5;
        const s = t * t * (3 - 2 * t); // smoothstep
        p.px(
          x, y,
          DEEP[0] + (LITE[0] - DEEP[0]) * s,
          DEEP[1] + (LITE[1] - DEEP[1]) * s,
          DEEP[2] + (LITE[2] - DEEP[2]) * s,
          255,
        );
      }
    }
    // Deterministic crest glints (same field → still seamless).
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (wave(x, y) > 0.82) p.px(x, y, 176, 208, 238, 255);
      }
    }
  },
  [TILE.LAVA]: (p) => {
    p.cellNoise([207, 90, 25], 0.4, 2);
    p.speckle([255, 200, 60], 7, 1);
    p.speckle([120, 30, 10], 5, 1);
  },
  [TILE.IRON_BLOCK]: (p) => {
    p.noiseFill([216, 216, 216], 0.05);
    p.border([180, 180, 180], 1);
  },
  [TILE.CRACK_0]: crackPainter(0),
  [TILE.CRACK_1]: crackPainter(1),
  [TILE.CRACK_2]: crackPainter(2),
  [TILE.CRACK_3]: crackPainter(3),
  [TILE.ITEM_STICK]: (p) => {
    p.clear();
    // 2px branch with a bark notch and a snapped twig stub.
    for (let i = 0; i < 9; i++) {
      p.px(3 + i, 12 - i, 136, 102, 56);
      p.px(4 + i, 12 - i, 104, 76, 42);
    }
    p.px(6, 9, 86, 62, 34);
    p.px(9, 6, 86, 62, 34);
    p.px(8, 6, 156, 120, 68); // twig stub
    p.px(8, 5, 156, 120, 68);
  },
  [TILE.ITEM_COAL]: (p) => {
    p.clear();
    // Faceted lump with a cold blue sheen.
    p.disc(8, 8, 4.6, [40, 40, 46], 0.3);
    p.shade(3, 3, 6, 5, 1.5);
    p.shade(8, 9, 5, 4, 0.7);
    p.px(6, 5, 118, 128, 148);
    p.px(7, 6, 90, 98, 116);
    p.px(10, 10, 20, 20, 24);
  },
  [TILE.ITEM_CHARCOAL]: (p) => {
    p.clear();
    // Burnt wood chunk with glowing ember cracks.
    p.disc(8, 8, 4.6, [50, 40, 34], 0.3);
    p.shade(3, 3, 6, 5, 1.35);
    p.px(6, 8, 255, 120, 40);
    p.px(7, 9, 220, 80, 24);
    p.px(10, 6, 255, 150, 60);
  },
  [TILE.ITEM_RAW_IRON]: (p) => {
    p.clear();
    // Rough ochre nugget with metallic flecks.
    p.disc(8, 8, 4.6, [198, 152, 118], 0.22);
    p.shade(3, 3, 6, 5, 1.2);
    p.shade(8, 9, 5, 4, 0.82);
    p.px(6, 6, 236, 220, 206);
    p.px(9, 8, 226, 208, 192);
    p.px(7, 10, 150, 104, 74);
  },
  [TILE.ITEM_IRON_INGOT]: (p) => ingotPainter(p, [222, 222, 226]),
  [TILE.ITEM_GOLD_INGOT]: (p) => ingotPainter(p, [250, 210, 84]),
  [TILE.ITEM_DIAMOND]: (p) => {
    p.clear();
    // Brilliant cut: flat crown table + tapered pavilion, split facets.
    for (let x = 5; x <= 10; x++) p.px(x, 3, 196, 252, 252);
    for (let x = 3; x <= 12; x++) p.px(x, 4, 130, 240, 246);
    for (let y = 5; y <= 11; y++) {
      const inset = y - 4;
      for (let x = 3 + inset; x <= 12 - inset; x++) {
        const left = x < 8;
        const f = left ? 1.08 : 0.82;
        p.px(x, y, 93 * f, 236 * f, 245 * f);
      }
    }
    p.px(5, 4, 240, 255, 255); // sparkle
    p.px(6, 5, 214, 252, 252);
    p.px(8, 12, 40, 150, 160); // culet shadow tip
  },
  [TILE.ITEM_PICK_WOOD]: toolPainter([140, 110, 70], 'pick'),
  [TILE.ITEM_PICK_IRON]: toolPainter([216, 216, 216], 'pick'),
  [TILE.ITEM_PICK_DIAMOND]: toolPainter([93, 236, 245], 'pick'),
  [TILE.ITEM_SWORD_WOOD]: toolPainter([140, 110, 70], 'sword'),
  [TILE.ITEM_SWORD_IRON]: toolPainter([216, 216, 216], 'sword'),
  [TILE.ITEM_SWORD_DIAMOND]: toolPainter([93, 236, 245], 'sword'),
  [TILE.ITEM_PICK_STONE]: toolPainter(MAT_STONE, 'pick'),
  [TILE.ITEM_SWORD_STONE]: toolPainter(MAT_STONE, 'sword'),
  [TILE.ITEM_AXE_WOOD]: toolPainter(MAT_WOOD, 'axe'),
  [TILE.ITEM_AXE_STONE]: toolPainter(MAT_STONE, 'axe'),
  [TILE.ITEM_AXE_IRON]: toolPainter(MAT_IRON, 'axe'),
  [TILE.ITEM_AXE_DIAMOND]: toolPainter(MAT_DIAMOND, 'axe'),
  [TILE.ITEM_SHOVEL_WOOD]: toolPainter(MAT_WOOD, 'shovel'),
  [TILE.ITEM_SHOVEL_STONE]: toolPainter(MAT_STONE, 'shovel'),
  [TILE.ITEM_SHOVEL_IRON]: toolPainter(MAT_IRON, 'shovel'),
  [TILE.ITEM_SHOVEL_DIAMOND]: toolPainter(MAT_DIAMOND, 'shovel'),
  [TILE.ITEM_MUTTON_RAW]: (p) => muttonPainter(p, [226, 100, 90], [240, 226, 220]),
  [TILE.ITEM_MUTTON_COOKED]: (p) => muttonPainter(p, [160, 100, 60], [120, 70, 40]),
  [TILE.ITEM_ARROW]: (p) => {
    p.clear();
    // 2px shaft, triangular flint head, stepped feather fletching.
    p.line(3, 13, 11, 5, HANDLE);
    p.line(4, 13, 12, 5, [104, 76, 42]);
    p.px(12, 3, 168, 176, 186);
    p.px(13, 2, 208, 214, 222);
    p.px(11, 4, 168, 176, 186);
    p.px(12, 4, 130, 138, 148);
    for (let s = 0; s < 3; s++) {
      p.px(2 + s, 13 - s, 238, 238, 234);
      p.px(2 + s, 14 - s, 210, 210, 206);
      p.px(3 + s, 14 - s, 186, 188, 186);
    }
  },
  [TILE.ITEM_WHEAT]: (p) => {
    p.clear();
    for (let b = 0; b < 3; b++) {
      const x = 4 + b * 3;
      for (let y = 14; y > 5; y--) p.px(x, y, 178, 152, 66);
      for (let y = 5; y < 8; y++) {
        p.px(x - 1, y, 210, 186, 88);
        p.px(x + 1, y, 210, 186, 88);
      }
    }
  },
  [TILE.STONE_BRICKS]: stoneBrickPainter(false, false),
  [TILE.CRACKED_STONE_BRICKS]: stoneBrickPainter(true, false),
  [TILE.CHISELED_STONE_BRICKS]: (p) => {
    p.cellNoise([118, 118, 118], 0.14, 4);
    p.border([86, 86, 86], 1);
    // Engraved frame + central pillar motif.
    p.rect(3, 3, 10, 10, [104, 104, 104]);
    for (let y = 3; y < 13; y++) {
      p.px(7, y, 80, 80, 80);
      p.px(8, y, 80, 80, 80);
    }
    p.px(5, 5, 80, 80, 80);
    p.px(10, 10, 80, 80, 80);
  },
  [TILE.GRANITE]: (p) => {
    p.noiseFill([156, 104, 86], 0.16);
    p.speckle([186, 138, 120], 14, 1);
    p.speckle([120, 76, 64], 8, 1);
  },
  [TILE.DIORITE]: (p) => {
    p.noiseFill([214, 214, 214], 0.12);
    p.speckle([120, 120, 120], 16, 1);
    p.speckle([245, 245, 245], 8, 1);
  },
  [TILE.ANDESITE]: (p) => {
    p.noiseFill([136, 138, 138], 0.12);
    p.speckle([110, 112, 114], 14, 1);
    p.speckle([162, 164, 166], 8, 1);
  },
  [TILE.BIRCH_PLANKS]: (p) => {
    p.noiseFill([196, 180, 138], 0.1);
    const seam: RGB = [150, 134, 96];
    for (const y of [3, 7, 11, 15]) for (let x = 0; x < N; x++) p.px(x, y, seam[0], seam[1], seam[2]);
    for (const [x, y0] of [[7, 0], [3, 4], [11, 8], [5, 12]] as const) {
      for (let y = y0; y < y0 + 4; y++) p.px(x, y, seam[0], seam[1], seam[2]);
    }
  },
  [TILE.OBSIDIAN]: (p) => {
    p.noiseFill([22, 18, 32], 0.5);
    p.speckle([60, 40, 92], 10, 1);
    p.speckle([10, 8, 16], 12, 1);
  },
  [TILE.COAL_BLOCK]: (p) => {
    p.cellNoise([34, 34, 36], 0.4, 3);
    p.speckle([60, 60, 64], 10, 1);
    p.speckle([12, 12, 14], 8, 1);
  },
  [TILE.GOLD_BLOCK]: (p) => {
    p.noiseFill([250, 215, 90], 0.08);
    p.border([214, 176, 60], 1);
    p.speckle([255, 240, 160], 6, 1);
  },
  [TILE.DIAMOND_BLOCK]: (p) => {
    p.noiseFill([110, 230, 232], 0.08);
    p.border([78, 196, 200], 1);
    for (const [x, y] of [[4, 4], [11, 5], [6, 10], [12, 11]] as const) {
      p.px(x, y, 220, 252, 255);
      p.px(x + 1, y, 180, 240, 244);
    }
  },
  [TILE.ITEM_BUCKET]: (p) => bucketPainter(p, null),
  [TILE.ITEM_WATER_BUCKET]: (p) => bucketPainter(p, [60, 110, 210]),
  [TILE.ITEM_LAVA_BUCKET]: (p) => bucketPainter(p, [220, 110, 30]),
  [TILE.ITEM_BOAT]: boatPainter,
  [TILE.ITEM_HELMET_LEATHER]: (p) => armorPainter(p, 'helm', LEATHER_PAL),
  [TILE.ITEM_CHEST_LEATHER]: (p) => armorPainter(p, 'chest', LEATHER_PAL),
  [TILE.ITEM_LEGS_LEATHER]: (p) => armorPainter(p, 'legs', LEATHER_PAL),
  [TILE.ITEM_BOOTS_LEATHER]: (p) => armorPainter(p, 'boots', LEATHER_PAL),
  [TILE.ITEM_HELMET_IRON]: (p) => armorPainter(p, 'helm', IRON_PAL),
  [TILE.ITEM_CHEST_IRON]: (p) => armorPainter(p, 'chest', IRON_PAL),
  [TILE.ITEM_LEGS_IRON]: (p) => armorPainter(p, 'legs', IRON_PAL),
  [TILE.ITEM_BOOTS_IRON]: (p) => armorPainter(p, 'boots', IRON_PAL),
  [TILE.ITEM_HELMET_DIAMOND]: (p) => armorPainter(p, 'helm', DIAMOND_PAL),
  [TILE.ITEM_CHEST_DIAMOND]: (p) => armorPainter(p, 'chest', DIAMOND_PAL),
  [TILE.ITEM_LEGS_DIAMOND]: (p) => armorPainter(p, 'legs', DIAMOND_PAL),
  [TILE.ITEM_BOOTS_DIAMOND]: (p) => armorPainter(p, 'boots', DIAMOND_PAL),
  [TILE.ENCHANT_TOP]: (p) => {
    // Obsidian slab with a glowing teal rune ring.
    p.noiseFill([24, 18, 34], 0.18);
    p.border([46, 36, 62]);
    for (const [x, y] of [[8, 3], [12, 8], [8, 13], [3, 8], [5, 5], [11, 5], [11, 11], [5, 11]] as const) {
      p.px(x, y, 64, 226, 210);
      p.px(x - 1, y, 34, 140, 132);
      p.px(x + 1, y, 34, 140, 132);
    }
    p.disc(8, 8, 1.8, [110, 250, 236]);
  },
  [TILE.ENCHANT_SIDE]: (p) => {
    // Obsidian body with a diamond band.
    p.noiseFill([28, 22, 40], 0.16);
    for (let x = 0; x < 16; x++) p.px(x, 3, 70, 210, 196);
    p.rect(6, 7, 4, 4, [50, 168, 158]);
    p.border([46, 36, 62]);
  },
  [TILE.BED_TOP]: (p) => {
    // Wood frame border, white pillow (top quarter), red blanket below.
    p.noiseFill([150, 110, 60], 0.08);
    for (let y = 1; y < 15; y++) {
      for (let x = 1; x < 15; x++) {
        if (y <= 4) {
          const f = 1 + (p.rand() - 0.5) * 0.06;
          p.px(x, y, 235 * f, 232 * f, 224 * f); // pillow
        } else {
          const f = 1 + (p.rand() - 0.5) * 0.1;
          p.px(x, y, 178 * f, 40 * f, 46 * f); // blanket
        }
      }
    }
    // Blanket fold line + pillow shadow.
    for (let x = 1; x < 15; x++) {
      p.px(x, 5, 140, 28, 34);
      p.px(x, 4, 205, 200, 190);
    }
    p.border([110, 78, 42]);
  },
  [TILE.ITEM_BEEF]: (p) => meatPainter(p, [196, 60, 60], [230, 120, 110], false),
  [TILE.ITEM_BEEF_COOKED]: (p) => meatPainter(p, [140, 84, 48], [180, 120, 76], false),
  [TILE.ITEM_PORKCHOP]: (p) => meatPainter(p, [232, 140, 140], [244, 190, 180], true),
  [TILE.ITEM_PORKCHOP_COOKED]: (p) => meatPainter(p, [176, 116, 68], [210, 160, 104], true),
  [TILE.ITEM_CHICKEN_RAW]: (p) => drumstickPainter(p, [228, 178, 160], [244, 226, 214]),
  [TILE.ITEM_CHICKEN_COOKED]: (p) => drumstickPainter(p, [186, 122, 62], [226, 178, 120]),
  [TILE.ITEM_LEATHER]: (p) => {
    p.clear();
    // Hide with a wavy edge + stitch marks.
    for (let y = 3; y <= 12; y++) {
      const inset = y === 3 || y === 12 ? 2 : y === 4 || y === 11 ? 1 : 0;
      for (let x = 2 + inset; x < 14 - inset; x++) {
        const f = 1 + (p.rand() - 0.5) * 0.14;
        p.px(x, y, 168 * f, 108 * f, 62 * f);
      }
    }
    for (const [x, y] of [[4, 5], [11, 5], [4, 10], [11, 10]] as const) p.px(x, y, 96, 60, 34);
  },
  [TILE.ITEM_FEATHER]: (p) => {
    p.clear();
    // Quill diagonal + soft vane.
    p.line(4, 13, 11, 3, [240, 240, 236]);
    p.line(5, 13, 12, 4, [222, 224, 222]);
    p.line(4, 12, 10, 4, [250, 250, 248]);
    p.line(3, 14, 6, 11, [170, 150, 120]); // quill tip
  },
  [TILE.BED_SIDE]: (p) => {
    // Plank base with a red blanket band on the upper half.
    p.noiseFill([150, 110, 60], 0.1);
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 16; x++) {
        const f = 1 + (p.rand() - 0.5) * 0.1;
        p.px(x, y, 172 * f, 38 * f, 44 * f);
      }
    }
    for (let x = 0; x < 16; x++) p.px(x, 7, 130, 26, 32);
    // Frame legs.
    p.rect(0, 12, 2, 4, [96, 66, 36]);
    p.rect(14, 12, 2, 4, [96, 66, 36]);
    p.border([110, 78, 42]);
  },

  // --- Redstone-lite (Phase 4) ----------------------------------------------
  [TILE.REDSTONE_ORE]: (p) => {
    // Glowing ruby shards embedded in stone.
    p.cellNoise(STONE_GRAY, 0.16, 3);
    for (const [cx, cy] of [[4, 4], [11, 6], [6, 11], [12, 12]] as const) {
      p.px(cx, cy, 255, 60, 50);
      p.px(cx + 1, cy, 200, 30, 26);
      p.px(cx, cy + 1, 200, 30, 26);
      p.px(cx + 1, cy + 1, 150, 20, 18);
      p.px(cx - 1, cy, 120, 24, 20);
    }
  },
  [TILE.REDSTONE_WIRE_T]: wirePainter([132, 26, 20]),
  [TILE.REDSTONE_WIRE_ON_T]: wirePainter([255, 60, 40]),
  [TILE.LEVER_T]: leverPainter(false),
  [TILE.LEVER_ON_T]: leverPainter(true),
  [TILE.PLATE_T]: (p) => {
    // Worn plank plate with a beveled rim.
    p.noiseFill([158, 126, 78], 0.1);
    p.border([120, 92, 54]);
    p.shade(1, 1, 14, 14, 1.06);
    p.shade(3, 3, 10, 10, 0.94);
  },
  [TILE.REDSTONE_LAMP_T]: (p) => {
    // Dormant lamp: dark amber cells in an obsidian-ish frame.
    p.cellNoise([52, 36, 26], 0.12, 2);
    for (let y = 2; y < 14; y += 4) {
      for (let x = 2; x < 14; x += 4) {
        p.rect(x, y, 3, 3, [96, 58, 30]);
        p.px(x + 1, y + 1, 128, 76, 36);
      }
    }
    p.border([40, 28, 22]);
  },
  [TILE.REDSTONE_LAMP_ON_T]: (p) => {
    // Lit lamp: hot glowing cells.
    p.cellNoise([120, 70, 34], 0.1, 2);
    for (let y = 2; y < 14; y += 4) {
      for (let x = 2; x < 14; x += 4) {
        p.rect(x, y, 3, 3, [255, 196, 92]);
        p.px(x + 1, y + 1, 255, 240, 180);
      }
    }
    p.border([150, 90, 40]);
  },
  [TILE.REDSTONE_BLOCK_T]: (p) => {
    p.cellNoise([168, 28, 22], 0.14, 2);
    p.speckle([255, 90, 70], 6, 1);
    p.border([110, 18, 14]);
    p.bevel(0.14);
  },
  [TILE.DOOR_BOTTOM_T]: (p) => {
    doorBase(p);
    // Handle knob on the right edge.
    p.px(12, 2, 210, 178, 92);
    p.px(12, 3, 160, 130, 60);
  },
  [TILE.DOOR_TOP_T]: (p) => {
    doorBase(p);
    // Window: 2x2 panes.
    p.rect(5, 4, 6, 6, [40, 34, 30]);
    p.rect(6, 5, 2, 2, [168, 214, 232]);
    p.rect(9, 5, 2, 2, [150, 196, 216]);
    p.rect(6, 8, 2, 1, [150, 196, 216]);
    p.rect(9, 8, 2, 1, [136, 180, 200]);
  },
  [TILE.TRAPDOOR_T]: (p) => {
    // Plank lattice with a dark cross brace and hinge dots.
    p.grainV([150, 116, 68], [118, 88, 50], 4);
    p.border([104, 78, 44]);
    for (let i = 1; i < 15; i++) {
      p.px(i, i, 112, 84, 48);
      p.px(i, 15 - i, 112, 84, 48);
    }
    p.px(2, 7, 70, 70, 74);
    p.px(2, 8, 70, 70, 74);
    p.px(13, 7, 70, 70, 74);
    p.px(13, 8, 70, 70, 74);
  },
  [TILE.PISTON_SIDE]: (p) => {
    // Cobble body with a plank cap strip at the top (the sliding face).
    p.cellNoise([118, 118, 122], 0.14, 3);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < N; x++) {
        const f = 1 + (p.rand() - 0.5) * 0.12;
        p.px(x, y, 156 * f, 122 * f, 72 * f);
      }
    }
    for (let x = 0; x < N; x++) p.px(x, 4, 104, 80, 46);
    p.border([92, 92, 96]);
  },
  [TILE.PISTON_BACK]: (p) => {
    p.cellNoise([118, 118, 122], 0.14, 3);
    p.rect(5, 5, 6, 6, [92, 92, 96]);
    p.rect(6, 6, 4, 4, [74, 74, 78]);
    p.border([92, 92, 96]);
  },
  [TILE.PISTON_FRONT]: (p) => {
    // Full plank face with cross grooves.
    p.grainV([160, 126, 74], [126, 96, 54], 4);
    for (let i = 0; i < N; i++) {
      p.px(i, 7, 118, 88, 50);
      p.px(7, i, 118, 88, 50);
    }
    p.border([110, 84, 48]);
  },
  [TILE.PISTON_OPEN]: (p) => {
    // Vacated socket: dark hole with an iron arm stub in the center.
    p.cellNoise([84, 84, 88], 0.14, 2);
    p.rect(3, 3, 10, 10, [46, 46, 50]);
    p.rect(6, 6, 4, 4, [140, 140, 148]);
    p.border([92, 92, 96]);
  },
  [TILE.ITEM_REDSTONE]: (p) => {
    p.clear();
    // A poured pile of glowing dust.
    p.disc(8, 10, 4, [190, 40, 30], 0.25);
    p.disc(7, 9, 2.5, [235, 70, 50], 0.2);
    p.px(6, 7, 255, 120, 90);
    p.px(10, 8, 255, 120, 90);
    p.px(5, 12, 130, 24, 18);
    p.px(11, 12, 130, 24, 18);
  },
  [TILE.ITEM_DOOR]: (p) => {
    p.clear();
    // Upright door with window + knob, 1px outline.
    p.rect(4, 1, 8, 14, [150, 116, 68]);
    p.rect(5, 2, 6, 12, [166, 130, 76]);
    p.rect(6, 3, 4, 3, [168, 214, 232]);
    p.px(10, 8, 210, 178, 92);
    for (let y = 1; y < 15; y++) {
      p.px(4, y, 96, 70, 40);
      p.px(11, y, 96, 70, 40);
    }
    for (let x = 4; x < 12; x++) {
      p.px(x, 1, 96, 70, 40);
      p.px(x, 14, 96, 70, 40);
    }
  },

  // --- Nether (Phase 4) -------------------------------------------------------
  [TILE.NETHERRACK_T]: (p) => {
    // Fleshy dark-red rock with sinewy pores.
    p.cellNoise([108, 40, 36], 0.22, 2);
    for (let i = 0; i < 5; i++) {
      let x = Math.floor(p.rand() * N);
      let y = Math.floor(p.rand() * N);
      for (let k = 0; k < 5; k++) {
        p.px(x, y, 66, 22, 22);
        x += Math.floor(p.rand() * 3) - 1;
        y++;
        if (x < 0 || x >= N || y >= N) break;
      }
    }
    p.speckle([150, 66, 54], 6, 1);
  },
  [TILE.SOUL_SAND_T]: (p) => {
    // Murky brown sand with trapped hollow "faces".
    p.cellNoise([82, 62, 48], 0.16, 2);
    for (const [x, y] of [[3, 4], [10, 3], [6, 10], [12, 11]] as const) {
      p.px(x, y, 44, 32, 26);
      p.px(x + 2, y, 44, 32, 26);
      p.rect(x, y + 2, 3, 1, [40, 30, 24]);
    }
    p.speckle([104, 82, 62], 5, 1);
  },
  [TILE.PORTAL_T]: (p) => {
    // Swirling violet energy.
    p.noiseFill([98, 32, 168], 0.25);
    for (let i = 0; i < N; i++) {
      const y = Math.round(7.5 + Math.sin((i / N) * Math.PI * 2) * 4);
      p.px(i, y, 186, 110, 255);
      p.px(i, y + 1, 150, 70, 230);
      const y2 = Math.round(7.5 + Math.cos((i / N) * Math.PI * 2 + 1.3) * 5);
      p.px(i, y2, 214, 160, 255);
    }
    p.speckle([238, 210, 255], 6, 1);
  },
  [TILE.MAGMA_T]: (p) => {
    // Dark crust plates over glowing seams.
    p.cellNoise([46, 24, 20], 0.2, 3);
    for (let i = 0; i < 4; i++) {
      let x = Math.floor(p.rand() * N);
      let y = Math.floor(p.rand() * N);
      const horiz = p.rand() < 0.5;
      for (let k = 0; k < 6; k++) {
        p.px(x, y, 244, 120, 30);
        p.px(x + (horiz ? 0 : 1), y + (horiz ? 1 : 0), 190, 70, 20);
        if (horiz) x++;
        else y++;
        if (p.rand() < 0.3) {
          if (horiz) y += p.rand() < 0.5 ? -1 : 1;
          else x += p.rand() < 0.5 ? -1 : 1;
        }
        if (x < 0 || x >= N || y < 0 || y >= N) break;
      }
    }
  },
  [TILE.ITEM_FLINT]: (p) => {
    p.clear();
    // Chipped dark shard.
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 9 - y; x++) {
        const f = 1 + (p.rand() - 0.5) * 0.2;
        p.px(4 + x + (y >> 1), 5 + y, 58 * f, 60 * f, 66 * f);
      }
    }
    p.px(5, 5, 100, 104, 112);
    p.px(6, 6, 88, 92, 100);
  },
  [TILE.ITEM_FLINT_STEEL]: (p) => {
    p.clear();
    // Steel striker arc + flint chip + spark.
    for (let i = 0; i < 6; i++) {
      p.px(9 + Math.round(Math.sin(i / 5 * Math.PI) * 3), 5 + i, 206, 208, 214);
      p.px(10 + Math.round(Math.sin(i / 5 * Math.PI) * 3), 5 + i, 160, 162, 170);
    }
    p.rect(3, 9, 4, 3, [58, 60, 66]);
    p.px(3, 9, 92, 96, 104);
    p.px(7, 6, 255, 200, 80);
    p.px(8, 5, 255, 240, 160);
  },
  // --- Biome blocks (V3) ----------------------------------------------------
  [TILE.SWAMP_GRASS_TOP]: (p) => {
    // Olive-gray murky turf (no green) — mirrors GRASS_TOP tone-shifted.
    p.noiseFill([96, 108, 70], 0.14);
    p.speckle([78, 88, 56], 12, 1); // murky pools
    p.speckle([120, 130, 86], 8, 1); // blade tufts
    for (let i = 0; i < 4; i++) p.px(Math.floor(p.rand() * N), Math.floor(p.rand() * N), 110, 96, 60);
    p.bevel(0.06);
  },
  [TILE.SWAMP_GRASS_SIDE]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.18);
    p.speckle([106, 74, 50], 6, 1);
    for (let x = 0; x < N; x++) {
      const lip = 2 + Math.floor(p.rand() * 3);
      for (let y = 0; y < lip; y++) {
        const f = 1 - y * 0.12;
        p.px(x, y, 96 * f, 108 * f, 70 * f);
      }
      p.px(x, 0, 120, 130, 86);
    }
  },
  [TILE.CHERRY_LOG_SIDE]: (p) => {
    p.grainV([92, 72, 76], [66, 50, 54], 3);
    for (const x of [3, 8, 12]) {
      for (let y = 0; y < N; y++) if (p.rand() < 0.85) p.px(x, y, 66, 50, 54);
      p.shade(x + 1, 0, 1, N, 1.15);
    }
    // Grayish-mauve lenticel dashes.
    for (let i = 0; i < 4; i++) {
      p.rect(1 + Math.floor(p.rand() * 12), 2 + Math.floor(p.rand() * 12), 2, 1, [150, 110, 120]);
    }
  },
  [TILE.CHERRY_LOG_TOP]: coloredLogTop([150, 120, 120], [96, 74, 78], [128, 98, 102], [150, 110, 120]),
  [TILE.CHERRY_LEAVES]: coloredLeaves([230, 150, 185], [246, 190, 214], [252, 224, 238], 0.72),
  [TILE.CHERRY_PLANKS]: coloredPlanks([206, 158, 158], [158, 116, 118]),
  [TILE.JUNGLE_LOG_SIDE]: coloredLogSide([98, 74, 44], [70, 50, 28], [2, 6, 11, 14], 4),
  [TILE.JUNGLE_LOG_TOP]: coloredLogTop([150, 128, 86], [78, 60, 36], [120, 100, 64], [96, 78, 46]),
  [TILE.JUNGLE_LEAVES]: coloredLeaves([82, 152, 62], [112, 186, 82], [62, 122, 48], 0.78),
  [TILE.JUNGLE_PLANKS]: coloredPlanks([168, 116, 82], [128, 84, 56]),
  [TILE.SPRUCE_LOG_SIDE]: coloredLogSide([74, 54, 36], [50, 34, 20], [3, 8, 13], 4),
  [TILE.SPRUCE_LOG_TOP]: coloredLogTop([104, 80, 52], [54, 38, 24], [80, 58, 36], [58, 40, 26]),
  [TILE.SPRUCE_LEAVES]: coloredLeaves([84, 142, 96], [108, 170, 118], [64, 112, 76], 0.78),
  [TILE.SPRUCE_PLANKS]: coloredPlanks([120, 88, 56], [86, 62, 38]),
  [TILE.ICE]: (p) => {
    p.noiseFill([168, 208, 240], 0.06);
    // Wandering hairline cracks.
    for (let c = 0; c < 3; c++) {
      let x = 2 + Math.floor(p.rand() * 12);
      for (let y = 0; y < N; y++) {
        p.px(x, y, 122, 170, 214);
        if (p.rand() < 0.4) x += p.rand() < 0.5 ? -1 : 1;
      }
    }
    p.line(2, 12, 12, 2, [222, 240, 252]); // sheen streak
    p.border([140, 186, 224]);
    p.bevel(0.08);
  },
  [TILE.LILY_PAD]: (p) => {
    p.clear();
    p.disc(8, 8, 6, [54, 110, 54], 0.1);
    for (let a = 0; a < 360; a += 20) {
      p.px(8 + Math.cos((a * Math.PI) / 180) * 6, 8 + Math.sin((a * Math.PI) / 180) * 6, 40, 86, 42);
    }
    // Wedge notch cut from center to one edge.
    for (let x = 8; x < 15; x++) p.px(x, 8, 0, 0, 0, 0);
    for (let a = 0; a < 5; a++) p.line(8, 8, 8 + Math.cos(a) * 6, 8 + Math.sin(a) * 6, [72, 132, 66]);
    p.px(8, 8, 240, 232, 200); // flower bud
  },
  // --- Biome blocks (V4) ----------------------------------------------------
  [TILE.ACACIA_LOG_SIDE]: coloredLogSide([116, 100, 88], [82, 68, 58], [3, 9, 13], 4),
  [TILE.ACACIA_LOG_TOP]: coloredLogTop([176, 96, 58], [96, 80, 70], [148, 78, 46], [118, 60, 36]),
  [TILE.ACACIA_LEAVES]: coloredLeaves([96, 130, 40], [128, 160, 60], [70, 100, 30], 0.72),
  [TILE.ACACIA_PLANKS]: coloredPlanks([168, 92, 50], [126, 66, 36]),
  [TILE.DARK_OAK_LOG_SIDE]: coloredLogSide([56, 42, 26], [36, 26, 16], [2, 7, 12], 5),
  [TILE.DARK_OAK_LOG_TOP]: coloredLogTop([88, 64, 40], [42, 30, 18], [66, 48, 30], [48, 34, 20]),
  [TILE.DARK_OAK_LEAVES]: coloredLeaves([76, 126, 52], [102, 156, 70], [58, 100, 40], 0.82),
  [TILE.DARK_OAK_PLANKS]: coloredPlanks([76, 56, 34], [52, 38, 22]),
  [TILE.RED_SAND]: (p) => {
    // Same wind-rippled dune recipe as sand, in badlands orange.
    p.noiseFill([190, 106, 52], 0.08);
    for (let y = 1; y < N; y += 4) {
      for (let x = 0; x < N; x++) {
        const yy = y + Math.round(Math.sin((x / N) * Math.PI * 2 + y) * 1.2);
        p.px(x, yy, 164, 88, 42);
        p.px(x, yy + 1, 212, 128, 66);
      }
    }
  },
  [TILE.TERRACOTTA]: terracottaPainter([152, 94, 68]),
  [TILE.TERRACOTTA_ORANGE]: terracottaPainter([164, 84, 38]),
  [TILE.TERRACOTTA_RED]: terracottaPainter([143, 61, 47]),
  [TILE.TERRACOTTA_WHITE]: terracottaPainter([206, 176, 158]),
  [TILE.TERRACOTTA_YELLOW]: terracottaPainter([184, 132, 50]),
  [TILE.PODZOL_TOP]: (p) => {
    // Fallen-needle litter: rusty base with darker duff patches and twigs.
    p.noiseFill([108, 68, 32], 0.2);
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(p.rand() * (N - 3));
      const y = Math.floor(p.rand() * N);
      p.rect(x, y, 2 + Math.floor(p.rand() * 2), 1, [82, 52, 24]);
    }
    p.speckle([140, 96, 48], 10, 1);
    p.speckle([60, 40, 20], 6, 1);
  },
  [TILE.PODZOL_SIDE]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.18);
    p.speckle([104, 72, 48], 6, 1);
    for (let x = 0; x < N; x++) {
      const depth = 2 + Math.floor(p.rand() * 2);
      for (let y = 0; y < depth; y++) p.px(x, y, 108 * (1 - y * 0.08), 68 * (1 - y * 0.08), 32);
    }
  },
  [TILE.MYCELIUM_TOP]: (p) => {
    // Grey-violet fungal mat with pale spore dots.
    p.noiseFill([120, 102, 114], 0.14);
    p.speckle([150, 130, 146], 12, 1);
    p.speckle([94, 78, 92], 8, 1);
    for (let i = 0; i < 5; i++) {
      p.px(Math.floor(p.rand() * N), Math.floor(p.rand() * N), 196, 178, 196);
    }
  },
  [TILE.MYCELIUM_SIDE]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.18);
    p.speckle([104, 72, 48], 6, 1);
    for (let x = 0; x < N; x++) {
      const depth = 2 + Math.floor(p.rand() * 2);
      for (let y = 0; y < depth; y++) p.px(x, y, 120, 102, 114);
      if (x % 4 === 1) p.px(x, 0, 150, 130, 146);
    }
  },
  [TILE.PACKED_ICE]: (p) => {
    // Denser, colder ice: compressed slab facets, no see-through cracks.
    p.cellNoise([142, 180, 222], 0.1, 4);
    p.line(3, 13, 13, 3, [188, 216, 244]);
    p.line(2, 8, 8, 2, [170, 202, 236]);
    p.border([116, 154, 200]);
    p.bevel(0.08);
  },
  [TILE.MUSHROOM_STEM]: (p) => {
    // Pale fibrous stem: vertical strands with subtle shading.
    p.noiseFill([202, 194, 180], 0.06);
    for (const x of [2, 5, 9, 13]) {
      for (let y = 0; y < N; y++) if (p.rand() < 0.8) p.px(x, y, 178, 170, 156);
    }
    p.bevel(0.06);
  },
  [TILE.MUSHROOM_CAP_RED]: (p) => {
    p.noiseFill([176, 42, 38], 0.12);
    for (const [cx, cy, r] of [[4, 4, 1.8], [11, 8, 2.1], [6, 12, 1.5]] as const) {
      p.disc(cx, cy, r, [238, 230, 222], 0.08);
    }
    p.bevel(0.08);
  },
  [TILE.MUSHROOM_CAP_BROWN]: (p) => {
    p.noiseFill([142, 104, 76], 0.1);
    p.speckle([118, 84, 58], 8, 1);
    p.speckle([166, 128, 96], 6, 1);
    p.bevel(0.08);
  },
  [TILE.RED_MUSHROOM]: (p) => {
    p.clear();
    for (let y = 9; y < 15; y++) p.px(7, y, 214, 202, 186);
    for (let y = 9; y < 15; y++) p.px(8, y, 190, 178, 162);
    // Domed red cap with white spots.
    p.disc(7.5, 7, 3.4, [196, 44, 38], 0.08);
    p.rect(4, 8, 8, 1, [160, 34, 30]);
    p.px(6, 6, 238, 230, 222);
    p.px(9, 7, 238, 230, 222);
  },
  [TILE.BROWN_MUSHROOM]: (p) => {
    p.clear();
    for (let y = 8; y < 15; y++) p.px(7, y, 208, 196, 178);
    // Flat tan cap.
    p.rect(3, 6, 9, 2, [150, 110, 80]);
    p.rect(4, 5, 7, 1, [166, 126, 94]);
    p.rect(5, 8, 5, 1, [122, 88, 62]);
  },
  [TILE.DEAD_BUSH]: (p) => {
    p.clear();
    // Dry forked twigs rising from a root point.
    for (const [tx, ty] of [[3, 3], [7, 2], [12, 4], [5, 6], [10, 6]] as const) {
      p.line(7, 15, tx, ty, [124, 88, 48]);
    }
    p.line(7, 15, 8, 9, [104, 72, 38]);
    p.px(7, 15, 88, 60, 32);
    p.px(8, 15, 88, 60, 32);
  },
  [TILE.FERN]: (p) => {
    p.clear();
    // Arching fronds with paired leaflets.
    for (const [dir, len] of [[-1, 6], [1, 6], [-1, 4], [1, 4], [0, 7]] as const) {
      let x = 7.5;
      for (let i = 0; i <= len; i++) {
        const y = 14 - i * 1.6;
        x += dir * 0.9;
        const f = 1 + (p.rand() - 0.5) * 0.25;
        p.px(x, y, 66 * f, 128 * f, 52 * f);
        p.px(x - dir, y + 0.5, 82 * f, 148 * f, 62 * f);
      }
    }
  },
  [TILE.FLOWER_BLUE]: (p) => {
    p.clear();
    for (let y = 7; y < N; y++) p.px(7, y, 58, 110, 40);
    p.px(8, 11, 58, 110, 40);
    p.disc(7, 5, 2.2, [72, 100, 214]);
    p.px(6, 4, 108, 136, 236);
    p.px(7, 5, 40, 56, 150);
  },
  [TILE.FLOWER_WHITE]: (p) => {
    p.clear();
    for (let y = 8; y < N; y++) p.px(8, y, 58, 110, 40);
    for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, 1], [-1, 1], [1, -1]] as const) {
      p.px(8 + dx, 5 + dy, 238, 238, 232);
    }
    p.disc(8, 5, 1.1, [222, 190, 82]);
  },
  [TILE.EMERALD_ORE]: orePainter([62, 208, 112], 'diamond'),
  [TILE.ITEM_EMERALD]: (p) => {
    p.clear();
    // Upright hexagonal-cut gem: lit left facet, shaded right, white sparkle.
    for (let d = -4; d <= 4; d++) {
      const w = 3 - Math.floor(Math.abs(d) / 2);
      for (let k = -w; k <= w; k++) {
        const shade = k < 0 ? 1.2 : k === 0 ? 1 : 0.75;
        p.px(8 + k, 8 + d, 52 * shade, 196 * shade, 100 * shade);
      }
    }
    p.px(7, 5, 224, 255, 236);
    p.px(8, 12, 20, 110, 52);
    p.outline([12, 44, 24]);
  },
  [TILE.SUNFLOWER]: (p) => {
    p.clear();
    // Tall stem with paired leaves and a big seed-disc bloom.
    for (let y = 6; y < N; y++) p.px(7, y, 62, 116, 44);
    p.px(5, 11, 74, 132, 52);
    p.px(6, 11, 74, 132, 52);
    p.px(9, 12, 74, 132, 52);
    p.px(8, 12, 74, 132, 52);
    p.disc(7, 4, 3.2, [232, 190, 48]);
    p.disc(7, 4, 1.6, [124, 84, 32], 0.15);
    for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3]] as const) {
      p.px(7 + dx, 4 + dy, 246, 210, 74);
    }
  },
  [TILE.MANGROVE_LOG_SIDE]: coloredLogSide([94, 58, 48], [64, 38, 30], [3, 8, 13], 4),
  [TILE.MANGROVE_LOG_TOP]: coloredLogTop([150, 84, 74], [70, 42, 34], [124, 66, 56], [96, 50, 42]),
  [TILE.MANGROVE_LEAVES]: coloredLeaves([80, 146, 60], [108, 180, 80], [60, 116, 46], 0.78),
  [TILE.MANGROVE_PLANKS]: coloredPlanks([158, 82, 74], [118, 58, 50]),
  [TILE.MUD]: (p) => {
    // Wet packed sludge: dark base, glossy damp patches, tiny bubbles.
    p.cellNoise([84, 78, 82], 0.14, 3);
    p.speckle([104, 98, 104], 6, 2);
    p.speckle([62, 58, 64], 8, 1);
    for (let i = 0; i < 4; i++) {
      p.px(Math.floor(p.rand() * N), Math.floor(p.rand() * N), 128, 122, 128);
    }
  },
  [TILE.COARSE_DIRT]: (p) => {
    // Dirt packed with grit and small stones — never grows grass.
    p.noiseFill(DIRT_BROWN, 0.22);
    p.speckle([104, 72, 48], 8, 1);
    for (let i = 0; i < 6; i++) {
      const x = Math.floor(p.rand() * (N - 2));
      const y = Math.floor(p.rand() * (N - 2));
      p.rect(x, y, 2, 1, [138, 132, 126]);
      p.px(x, y + 1, 96, 92, 88);
    }
  },
};

/** Redstone wire: a dust cross on a transparent tile (BOX top face). */
function wirePainter(c: RGB): Painter {
  return (p) => {
    p.clear();
    for (let i = 0; i < N; i++) {
      for (let k = 6; k <= 9; k++) {
        const f = 1 + (p.rand() - 0.5) * 0.3;
        if (k === 6 || k === 9 ? p.rand() < 0.55 : true) {
          p.px(i, k, c[0] * f, c[1] * f, c[2] * f);
          p.px(k, i, c[0] * f, c[1] * f, c[2] * f);
        }
      }
    }
    // Bright core line when powered look is wanted (brighter base color).
    for (let i = 0; i < N; i++) {
      p.px(i, 7, Math.min(255, c[0] * 1.2), c[1], c[2]);
      p.px(7, i, Math.min(255, c[0] * 1.2), c[1], c[2]);
    }
  };
}

/** Lever as a CROSS texture: cobble base + tilted handle (red tip when on). */
function leverPainter(on: boolean): Painter {
  return (p) => {
    p.clear();
    // Base plate.
    p.rect(5, 12, 6, 3, [110, 110, 114]);
    p.rect(6, 11, 4, 1, [130, 130, 134]);
    // Handle: tilts left when off, right when on.
    for (let i = 0; i < 7; i++) {
      const x = on ? 8 + Math.floor(i * 0.5) : 8 - Math.floor(i * 0.5);
      p.px(x, 11 - i, 140, 106, 62);
      p.px(x + 1, 11 - i, 108, 82, 48);
    }
    const tipX = on ? 11 : 5;
    if (on) {
      p.px(tipX, 4, 255, 80, 60);
      p.px(tipX + 1, 4, 255, 120, 90);
      p.px(tipX, 3, 255, 160, 120);
    } else {
      p.px(tipX, 4, 150, 60, 50);
      p.px(tipX - 1, 4, 120, 50, 42);
    }
  };
}

/** Chest body: banded planks with iron edge strips (front + sides). */
function chestBody(p: TilePainter): void {
  p.grainV([168, 122, 60], [136, 100, 50], 3);
  p.border([104, 74, 36], 1);
  // Lid seam + iron bands down both edges.
  for (let x = 0; x < N; x++) p.px(x, 6, 96, 68, 34);
  for (let x = 0; x < N; x++) p.px(x, 7, 122, 90, 46);
  for (let y = 1; y < 15; y++) {
    p.px(2, y, 128, 132, 140);
    p.px(13, y, 108, 112, 120);
  }
  p.px(2, 1, 188, 192, 200);
  p.shade(0, 0, N, 3, 1.1);
}

/** Shared plank door face (panel grooves + frame). */
function doorBase(p: TilePainter): void {
  p.grainV([158, 122, 70], [128, 98, 56], 4);
  p.border([104, 78, 44]);
  p.rect(3, 3, 10, 1, [118, 90, 52]);
  p.rect(3, 12, 10, 1, [118, 90, 52]);
  p.rect(3, 3, 1, 10, [118, 90, 52]);
  p.rect(12, 3, 1, 10, [118, 90, 52]);
}

const LEATHER_PAL: [RGB, RGB] = [[168, 108, 62], [204, 146, 92]];
const IRON_PAL: [RGB, RGB] = [[198, 202, 212], [240, 242, 248]];
const DIAMOND_PAL: [RGB, RGB] = [[70, 200, 190], [140, 244, 232]];

/** Armor piece icons sharing one silhouette set per slot. */
function armorPainter(p: TilePainter, kind: 'helm' | 'chest' | 'legs' | 'boots', pal: [RGB, RGB]): void {
  p.clear();
  const [base, hi] = pal;
  const fill = (x: number, y: number, w: number, h: number, c: RGB = base) => {
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++) {
        const f = 1 + (p.rand() - 0.5) * 0.1;
        p.px(xx, yy, c[0] * f, c[1] * f, c[2] * f);
      }
  };
  if (kind === 'helm') {
    fill(3, 4, 10, 4);
    fill(3, 8, 2, 3);
    fill(11, 8, 2, 3);
    fill(4, 3, 8, 1, hi);
  } else if (kind === 'chest') {
    fill(3, 3, 3, 3); // shoulders
    fill(10, 3, 3, 3);
    fill(4, 5, 8, 8);
    fill(4, 5, 8, 1, hi);
  } else if (kind === 'legs') {
    fill(4, 3, 8, 3);
    fill(4, 6, 3, 8);
    fill(9, 6, 3, 8);
    fill(4, 3, 8, 1, hi);
  } else {
    fill(3, 8, 3, 4);
    fill(10, 8, 3, 4);
    fill(2, 11, 5, 2);
    fill(9, 11, 5, 2);
    fill(3, 8, 3, 1, hi);
    fill(10, 8, 3, 1, hi);
  }
}

/** Meat slab icon: rounded steak/chop with fat marbling, optional bone. */
function meatPainter(p: TilePainter, meat: RGB, fat: RGB, bone: boolean): void {
  p.clear();
  for (let y = 4; y <= 12; y++) {
    const inset = y === 4 || y === 12 ? 2 : y === 5 || y === 11 ? 1 : 0;
    for (let x = 2 + inset; x < 14 - inset; x++) {
      const f = 1 + (p.rand() - 0.5) * 0.12;
      p.px(x, y, meat[0] * f, meat[1] * f, meat[2] * f);
    }
  }
  // Fat marbling streaks.
  p.line(4, 6, 11, 7, fat);
  p.line(5, 9, 10, 10, fat);
  if (bone) {
    p.rect(1, 7, 3, 3, [236, 232, 220]);
    p.px(1, 7, 210, 205, 190);
  }
}

/** Drumstick icon: meat lobe + white bone handle. */
function drumstickPainter(p: TilePainter, meat: RGB, boneEnd: RGB): void {
  p.clear();
  p.disc(6, 6, 4, meat);
  p.disc(8, 8, 3, meat);
  p.line(9, 9, 13, 13, [235, 230, 220]);
  p.disc(13, 13, 1.6, boneEnd);
}

/** Side view of a small wooden rowboat with a paddle. */
function boatPainter(p: TilePainter): void {
  p.clear();
  const wood: RGB = [150, 110, 60];
  const dark: RGB = [110, 78, 42];
  const light: RGB = [178, 136, 80];
  // Hull: a shallow curved trough.
  for (let y = 8; y <= 12; y++) {
    const inset = Math.max(0, y - 9);
    for (let x = 2 + inset; x < 14 - inset; x++) {
      const f = 1 + (p.rand() - 0.5) * 0.12;
      p.px(x, y, wood[0] * f, wood[1] * f, wood[2] * f);
    }
  }
  // Top rim plank + bow/stern posts.
  for (let x = 2; x < 14; x++) p.px(x, 8, light[0], light[1], light[2]);
  for (let y = 5; y <= 8; y++) {
    p.px(2, y, dark[0], dark[1], dark[2]);
    p.px(13, y, dark[0], dark[1], dark[2]);
  }
  // Interior shadow line.
  for (let x = 4; x < 12; x++) p.px(x, 9, dark[0], dark[1], dark[2]);
  // Paddle.
  p.line(9, 9, 13, 3, [120, 90, 50]);
  p.rect(12, 2, 3, 2, [150, 110, 60]);
}

/** Brick-bond stone texture; optional cracks; optional mossy tint. */
function stoneBrickPainter(cracked: boolean, mossy: boolean): Painter {
  return (p) => {
    p.cellNoise([122, 122, 122], 0.12, 4);
    const mortar: RGB = [88, 88, 88];
    // Horizontal courses every 4px.
    for (const y of [3, 7, 11, 15]) for (let x = 0; x < N; x++) p.px(x, y, mortar[0], mortar[1], mortar[2]);
    // Vertical joints, offset (running bond) per course.
    for (let row = 0; row < 4; row++) {
      const off = row % 2 === 0 ? 7 : 3;
      for (let y = row * 4; y < row * 4 + 4; y++) {
        p.px(off, y, mortar[0], mortar[1], mortar[2]);
        p.px((off + 8) % N, y, mortar[0], mortar[1], mortar[2]);
      }
    }
    if (cracked) {
      for (let c = 0; c < 3; c++) {
        let x = 2 + Math.floor(p.rand() * 12);
        let y = 2 + Math.floor(p.rand() * 12);
        for (let i = 0; i < 6; i++) {
          p.px(x, y, 70, 70, 70);
          x += Math.floor(p.rand() * 3) - 1;
          y += Math.floor(p.rand() * 3) - 1;
        }
      }
    }
    if (mossy) for (let i = 0; i < 18; i++) p.px(Math.floor(p.rand() * N), Math.floor(p.rand() * N), 80, 120, 50);
  };
}

/** Steel bucket; when `fluid` is set the cup is filled with that colour. */
function bucketPainter(p: TilePainter, fluid: RGB | null): void {
  p.clear();
  const steel: RGB = [170, 170, 178];
  const dark: RGB = [110, 110, 120];
  // Trapezoidal pail.
  for (let y = 5; y < 14; y++) {
    const inset = Math.round((y - 5) * 0.35);
    for (let x = 3 + inset; x < 13 - inset; x++) {
      const edge = x === 3 + inset || x === 12 - inset;
      p.px(x, y, edge ? dark[0] : steel[0], edge ? dark[1] : steel[1], edge ? dark[2] : steel[2]);
    }
  }
  // Rim + handle.
  for (let x = 3; x < 13; x++) p.px(x, 5, dark[0], dark[1], dark[2]);
  p.line(3, 5, 5, 2, dark);
  p.line(12, 5, 10, 2, dark);
  for (let x = 5; x < 11; x++) p.px(x, 2, dark[0], dark[1], dark[2]);
  if (fluid) {
    for (let y = 6; y < 9; y++) for (let x = 5; x < 11; x++) {
      const f = 1 + (p.rand() - 0.5) * 0.2;
      p.px(x, y, fluid[0] * f, fluid[1] * f, fluid[2] * f);
    }
  }
}

export class TextureAtlas {
  readonly canvas: HTMLCanvasElement;
  readonly texture: THREE.CanvasTexture;
  private iconCache = new Map<number, string>();

  constructor(seed: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = ATLAS_SIZE;
    this.canvas.height = ATLAS_SIZE;
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    const img = ctx.createImageData(ATLAS_SIZE, ATLAS_SIZE);

    // Every ITEM_* tile gets the shared 1px contour after painting (P5-6),
    // so all icons share one readable outline style.
    const itemTiles = new Set<number>(
      Object.entries(TILE)
        .filter(([name]) => name.startsWith('ITEM_'))
        .map(([, t]) => t as number),
    );
    for (const [tileStr, painter] of Object.entries(PAINTERS)) {
      const tile = Number(tileStr);
      // Paint the 16px art into the interior of a gutter-padded cell.
      const ix = (tile % 32) * CELL_PX + TILE_GUTTER;
      const iy = Math.floor(tile / 32) * CELL_PX + TILE_GUTTER;
      const p = new TilePainter(img, ix, iy, mulberry32(seed ^ (tile * 7919 + 17)));
      painter(p);
      if (itemTiles.has(tile)) p.outline();
      dilateTransparent(img, ix, iy);
      extrudeCell(img, ix, iy);
    }
    ctx.putImageData(img, 0, 0);

    this.texture = new THREE.CanvasTexture(this.canvas);
    // Crisp up close (nearest mag), smooth far (trilinear mipmaps). The gutter
    // around every tile keeps mip levels from bleeding across tile borders.
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.generateMipmaps = true;
    this.texture.anisotropy = 4;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.needsUpdate = true;
  }

  /** Average RGB (0..1) of a tile, for block-break particle colouring. */
  sampleColor(tile: number): [number, number, number] {
    const ctx = this.canvas.getContext('2d')!;
    const tx = (tile % 32) * CELL_PX + TILE_GUTTER;
    const ty = Math.floor(tile / 32) * CELL_PX + TILE_GUTTER;
    const data = ctx.getImageData(tx, ty, TILE_PX, TILE_PX).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n++;
    }
    if (n === 0) return [1, 1, 1];
    return [r / n / 255, g / n / 255, b / n / 255];
  }

  /** PNG data-URL for a tile, upscaled to 32px for crisp UI icons. */
  icon(tile: number): string {
    let url = this.iconCache.get(tile);
    if (!url) {
      const out = 32;
      const c = document.createElement('canvas');
      c.width = out;
      c.height = out;
      const cctx = c.getContext('2d')!;
      cctx.imageSmoothingEnabled = false;
      cctx.drawImage(
        this.canvas,
        (tile % 32) * CELL_PX + TILE_GUTTER,
        Math.floor(tile / 32) * CELL_PX + TILE_GUTTER,
        TILE_PX,
        TILE_PX,
        0,
        0,
        out,
        out,
      );
      url = c.toDataURL();
      this.iconCache.set(tile, url);
    }
    return url;
  }
}
