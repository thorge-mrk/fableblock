/**
 * Procedural 512x512 texture atlas: a 32x32 grid of authentic 16x16px tiles
 * painted at startup with seeded pixel noise (no external assets). All painter
 * coordinates are expressed relative to TILE_PX so the art is resolution-correct.
 * Also exports per-tile PNG data-URLs for the React inventory UI.
 */
import * as THREE from 'three';
import { ATLAS_SIZE, TILE, TILE_PX } from '../core/blocks';
import { mulberry32 } from '../core/prng';

type RGB = [number, number, number];
const N = TILE_PX; // 16

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

  clear(): void {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) this.px(x, y, 0, 0, 0, 0);
  }
}

type Painter = (p: TilePainter) => void;

const GRASS_GREEN: RGB = [106, 170, 64];
const DIRT_BROWN: RGB = [134, 96, 67];
const STONE_GRAY: RGB = [128, 128, 128];
const SAND_YELLOW: RGB = [219, 207, 163];
const WOOD: RGB = [156, 127, 78];
const WOOD_DK: RGB = [110, 86, 50];
const LEAF_GREEN: RGB = [60, 118, 42];
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
    p.cellNoise(STONE_GRAY, 0.35, 4);
    // Cobble lumps with dark mortar outlines (3x2 layout).
    const mortar: RGB = [70, 70, 70];
    for (let i = 0; i < 6; i++) {
      const cx = (i % 3) * 5 + 2 + Math.floor(p.rand() * 2);
      const cy = Math.floor(i / 3) * 7 + 3 + Math.floor(p.rand() * 2);
      const r = 2 + p.rand();
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const d = Math.hypot(x - cx, y - cy);
          if (d > r - 0.6 && d < r + 0.4) p.px(x, y, mortar[0], mortar[1], mortar[2]);
        }
      }
    }
    if (mossy) {
      for (let i = 0; i < 22; i++) {
        const x = Math.floor(p.rand() * N);
        const y = Math.floor(p.rand() * N);
        p.px(x, y, 80, 120, 50);
      }
    }
  };
}

function orePainter(ore: RGB): Painter {
  return (p) => {
    p.cellNoise(STONE_GRAY, 0.3, 2);
    for (let i = 0; i < 5; i++) {
      const x = 2 + Math.floor(p.rand() * (N - 4));
      const y = 2 + Math.floor(p.rand() * (N - 4));
      const s = 1 + Math.floor(p.rand() * 2);
      for (let dy = 0; dy < s; dy++) {
        for (let dx = 0; dx < s; dx++) {
          const f = 1 + (p.rand() - 0.5) * 0.3;
          p.px(x + dx, y + dy, ore[0] * f, ore[1] * f, ore[2] * f);
        }
      }
    }
  };
}

function toolPainter(head: RGB, kind: 'pick' | 'sword'): Painter {
  return (p) => {
    p.clear();
    const hd: RGB = [head[0] * 0.8, head[1] * 0.8, head[2] * 0.8];
    if (kind === 'pick') {
      // Diagonal handle bottom-left -> upper-right.
      for (let i = 2; i < 12; i++) {
        p.px(i, 13 - i, HANDLE[0], HANDLE[1], HANDLE[2]);
        p.px(i + 1, 13 - i, HANDLE[0] * 0.8, HANDLE[1] * 0.8, HANDLE[2] * 0.8);
      }
      // Curved pick head across the top.
      p.line(3, 4, 7, 2, head);
      p.line(7, 2, 12, 4, head);
      p.line(3, 5, 7, 3, hd);
      p.line(7, 3, 12, 5, hd);
    } else {
      // Blade diagonal.
      for (let i = 0; i < 9; i++) {
        const x = 5 + i;
        const y = 10 - i;
        p.px(x, y, head[0], head[1], head[2]);
        p.px(x + 1, y, Math.min(255, head[0] * 1.15), Math.min(255, head[1] * 1.15), Math.min(255, head[2] * 1.15));
        p.px(x, y - 1, hd[0], hd[1], hd[2]);
      }
      // Cross-guard.
      p.px(4, 11, 90, 66, 36);
      p.px(5, 12, 90, 66, 36);
      p.px(3, 12, 90, 66, 36);
      // Handle.
      for (let i = 0; i < 3; i++) p.px(4 - i, 12 + i, HANDLE[0], HANDLE[1], HANDLE[2]);
    }
  };
}

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
  // Trapezoid ingot.
  for (let y = 0; y < 5; y++) {
    const inset = Math.round(y * 0.7);
    for (let x = 0; x < 9 - y; x++) {
      const f = 1 - y * 0.05;
      p.px(4 + x + inset, 7 + y, c[0] * f, c[1] * f, c[2] * f);
    }
  }
  for (let x = 0; x < 9; x++) p.px(4 + x, 6, Math.min(255, c[0] * 1.1), Math.min(255, c[1] * 1.1), Math.min(255, c[2] * 1.1));
}

function muttonPainter(p: TilePainter, meat: RGB, edge: RGB): void {
  p.clear();
  p.disc(7, 7, 4.5, meat, 0.2);
  for (let i = 0; i < 4; i++) p.px(10 + i, 11 + Math.floor(i / 2), edge[0], edge[1], edge[2]);
}

const PAINTERS: Record<number, Painter> = {
  [TILE.GRASS_TOP]: (p) => {
    p.noiseFill(GRASS_GREEN, 0.22);
    p.speckle([90, 150, 50], 12, 1);
  },
  [TILE.GRASS_SIDE]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.2);
    for (let x = 0; x < N; x++) {
      const depth = 2 + Math.floor(p.rand() * 3);
      for (let y = 0; y < depth; y++) {
        const f = 1 + (p.rand() - 0.5) * 0.2;
        p.px(x, y, GRASS_GREEN[0] * f, GRASS_GREEN[1] * f, GRASS_GREEN[2] * f);
      }
    }
  },
  [TILE.DIRT]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.25);
    p.speckle([110, 78, 52], 8, 1);
  },
  [TILE.STONE]: (p) => p.cellNoise(STONE_GRAY, 0.22, 2),
  [TILE.COBBLESTONE]: cobblePainter(false),
  [TILE.MOSSY_COBBLESTONE]: cobblePainter(true),
  [TILE.BEDROCK]: (p) => p.cellNoise([62, 62, 62], 0.7, 2),
  [TILE.SAND]: (p) => {
    p.noiseFill(SAND_YELLOW, 0.12);
    p.speckle([200, 188, 142], 10, 1);
  },
  [TILE.GRAVEL]: (p) => p.cellNoise([118, 110, 105], 0.42, 2),
  [TILE.SANDSTONE_TOP]: (p) => {
    p.noiseFill([216, 203, 155], 0.08);
    p.border([196, 183, 135]);
  },
  [TILE.SANDSTONE_SIDE]: (p) => {
    p.noiseFill([216, 203, 155], 0.08);
    for (const y of [5, 10]) for (let x = 0; x < N; x++) p.px(x, y, 190, 176, 128);
  },
  [TILE.OAK_LOG_SIDE]: (p) => p.grainV([104, 82, 49], [80, 62, 36], 4),
  [TILE.OAK_LOG_TOP]: (p) => {
    p.noiseFill([104, 82, 49], 0.12);
    for (let r = 2; r < 8; r += 2) {
      for (let a = 0; a < 360; a += 8) {
        p.px(7.5 + Math.cos((a * Math.PI) / 180) * r, 7.5 + Math.sin((a * Math.PI) / 180) * r, 156, 127, 78);
      }
    }
  },
  [TILE.OAK_LEAVES]: (p) => {
    p.clear();
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (p.rand() < 0.84) {
          const f = 1 + (p.rand() - 0.5) * 0.45;
          p.px(x, y, LEAF_GREEN[0] * f, LEAF_GREEN[1] * f, LEAF_GREEN[2] * f);
        }
      }
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
  [TILE.COAL_ORE]: orePainter([38, 38, 38]),
  [TILE.IRON_ORE]: orePainter([216, 175, 147]),
  [TILE.GOLD_ORE]: orePainter([252, 222, 112]),
  [TILE.DIAMOND_ORE]: orePainter([93, 236, 245]),
  [TILE.GLASS]: (p) => {
    p.clear();
    p.border([205, 232, 238], 1);
    for (const [x, y] of [[3, 3], [4, 4], [11, 10], [12, 11]] as const) p.px(x, y, 230, 245, 250, 150);
  },
  [TILE.SNOW_TOP]: (p) => p.noiseFill([240, 246, 250], 0.05),
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
    p.clear();
    for (let y = 6; y < N; y++) {
      p.px(7, y, 120, 90, 50);
      p.px(8, y, 100, 75, 40);
    }
    p.rect(7, 3, 2, 3, [255, 190, 60]);
    p.px(7, 2, 255, 240, 160);
    p.px(8, 2, 255, 240, 160);
  },
  [TILE.CRAFTING_TABLE_TOP]: (p) => {
    plankPainter(p);
    p.border([60, 45, 28], 1);
    for (let i = 4; i < 12; i++) {
      p.px(i, 7, 60, 45, 28);
      p.px(i, 8, 60, 45, 28);
      p.px(7, i, 60, 45, 28);
      p.px(8, i, 60, 45, 28);
    }
  },
  [TILE.CRAFTING_TABLE_SIDE]: (p) => {
    plankPainter(p);
    for (let y = 0; y < 2; y++) for (let x = 0; x < N; x++) p.px(x, y, 92, 70, 40);
  },
  [TILE.CRAFTING_TABLE_FRONT]: (p) => {
    plankPainter(p);
    p.line(4, 9, 9, 4, [60, 45, 28]);
    p.line(10, 5, 12, 11, [70, 50, 30]);
  },
  [TILE.FURNACE_FRONT]: (p) => {
    p.cellNoise(STONE_GRAY, 0.2, 4);
    p.rect(5, 9, 6, 5, [30, 30, 30]);
  },
  [TILE.FURNACE_FRONT_LIT]: (p) => {
    p.cellNoise(STONE_GRAY, 0.2, 4);
    for (let y = 9; y < 14; y++) {
      for (let x = 5; x < 11; x++) {
        if (p.rand() < 0.5) p.px(x, y, 255, 140 + p.rand() * 60, 30);
        else p.px(x, y, 60, 30, 15);
      }
    }
  },
  [TILE.FURNACE_SIDE]: (p) => p.cellNoise(STONE_GRAY, 0.2, 4),
  [TILE.FURNACE_TOP]: (p) => {
    p.cellNoise(STONE_GRAY, 0.18, 4);
    p.border([95, 95, 95], 1);
  },
  [TILE.CHEST_FRONT]: (p) => {
    p.noiseFill([162, 116, 56], 0.1);
    p.border([110, 78, 38], 1);
    for (let x = 0; x < N; x++) p.px(x, 7, 110, 78, 38);
    p.rect(7, 6, 2, 3, [150, 150, 150]);
  },
  [TILE.CHEST_SIDE]: (p) => {
    p.noiseFill([162, 116, 56], 0.1);
    p.border([110, 78, 38], 1);
    for (let x = 0; x < N; x++) p.px(x, 7, 110, 78, 38);
  },
  [TILE.CHEST_TOP]: (p) => {
    p.noiseFill([170, 124, 62], 0.1);
    p.border([110, 78, 38], 1);
  },
  [TILE.HOPPER_TOP]: (p) => {
    p.noiseFill([72, 72, 72], 0.12);
    p.border([50, 50, 50], 1);
    p.rect(6, 6, 4, 4, [25, 25, 25]);
  },
  [TILE.HOPPER_SIDE]: (p) => {
    p.noiseFill([85, 85, 85], 0.12);
    for (let y = 0; y < N; y++) {
      const inset = Math.floor(y / 3);
      for (let x = 0; x < inset; x++) {
        p.px(x, y, 40, 40, 40);
        p.px(N - 1 - x, y, 40, 40, 40);
      }
    }
  },
  [TILE.SPAWNER]: (p) => {
    p.clear();
    p.noiseFill([28, 38, 48], 0.3);
    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) {
        if (x % 3 >= 2 && y % 3 >= 2 && x > 1 && x < 14 && y > 1 && y < 14) p.px(x, y, 0, 0, 0, 0);
      }
    }
  },
  [TILE.WOOL]: (p) => {
    p.noiseFill([228, 228, 228], 0.1);
    for (let i = 0; i < 12; i++) p.px(Math.floor(p.rand() * N), Math.floor(p.rand() * N), 208, 208, 208);
  },
  [TILE.GLOWSTONE]: (p) => {
    p.cellNoise([220, 180, 90], 0.3, 2);
    p.speckle([255, 230, 150], 8, 1);
  },
  [TILE.WATER]: (p) => {
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const f = 1 + (p.rand() - 0.5) * 0.18;
        p.px(x, y, 50 * f, 95 * f, 195 * f, 235);
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
    for (let i = 0; i < 9; i++) {
      p.px(4 + i, 12 - i, 120, 90, 50);
      p.px(5 + i, 12 - i, 100, 75, 40);
    }
  },
  [TILE.ITEM_COAL]: (p) => {
    p.clear();
    p.disc(8, 8, 5, [40, 40, 42], 0.5);
  },
  [TILE.ITEM_CHARCOAL]: (p) => {
    p.clear();
    p.disc(8, 8, 5, [54, 44, 38], 0.5);
  },
  [TILE.ITEM_RAW_IRON]: (p) => {
    p.clear();
    p.disc(8, 8, 4.5, [216, 175, 147], 0.3);
  },
  [TILE.ITEM_IRON_INGOT]: (p) => ingotPainter(p, [222, 222, 222]),
  [TILE.ITEM_GOLD_INGOT]: (p) => ingotPainter(p, [250, 215, 90]),
  [TILE.ITEM_DIAMOND]: (p) => {
    p.clear();
    for (let dy = -4; dy <= 4; dy++) {
      const half = 4 - Math.abs(dy);
      for (let dx = -half; dx <= half; dx++) {
        const f = 1 + (p.rand() - 0.5) * 0.25;
        p.px(8 + dx, 8 + dy, 93 * f, 236 * f, 245 * f);
      }
    }
  },
  [TILE.ITEM_PICK_WOOD]: toolPainter([140, 110, 70], 'pick'),
  [TILE.ITEM_PICK_IRON]: toolPainter([216, 216, 216], 'pick'),
  [TILE.ITEM_PICK_DIAMOND]: toolPainter([93, 236, 245], 'pick'),
  [TILE.ITEM_SWORD_WOOD]: toolPainter([140, 110, 70], 'sword'),
  [TILE.ITEM_SWORD_IRON]: toolPainter([216, 216, 216], 'sword'),
  [TILE.ITEM_SWORD_DIAMOND]: toolPainter([93, 236, 245], 'sword'),
  [TILE.ITEM_MUTTON_RAW]: (p) => muttonPainter(p, [226, 100, 90], [240, 226, 220]),
  [TILE.ITEM_MUTTON_COOKED]: (p) => muttonPainter(p, [160, 100, 60], [120, 70, 40]),
  [TILE.ITEM_ARROW]: (p) => {
    p.clear();
    p.line(3, 13, 12, 4, HANDLE);
    // Head.
    p.px(12, 3, 200, 200, 200);
    p.px(13, 3, 200, 200, 200);
    p.px(12, 4, 200, 200, 200);
    p.px(11, 3, 200, 200, 200);
    // Fletching.
    p.px(3, 13, 230, 230, 230);
    p.px(2, 13, 230, 230, 230);
    p.px(3, 12, 230, 230, 230);
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
};

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

    for (const [tileStr, painter] of Object.entries(PAINTERS)) {
      const tile = Number(tileStr);
      const tx = (tile % 32) * TILE_PX;
      const ty = Math.floor(tile / 32) * TILE_PX;
      const p = new TilePainter(img, tx, ty, mulberry32(seed ^ (tile * 7919 + 17)));
      painter(p);
    }
    ctx.putImageData(img, 0, 0);

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.generateMipmaps = false;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.needsUpdate = true;
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
        (tile % 32) * TILE_PX,
        Math.floor(tile / 32) * TILE_PX,
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
