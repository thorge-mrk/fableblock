/**
 * Procedural 1024x1024 texture atlas: 32x32 grid of 32px tiles painted at
 * startup with seeded pixel noise (no external assets). Also exports
 * per-tile 32x32 PNG data-URLs for the React inventory UI.
 */
import * as THREE from 'three';
import { ATLAS_SIZE, TILE, TILE_PX } from '../core/blocks';
import { mulberry32 } from '../core/prng';

type RGB = [number, number, number];

class TilePainter {
  constructor(
    private img: ImageData,
    private ox: number,
    private oy: number,
    public rand: () => number,
  ) {}

  px(x: number, y: number, r: number, g: number, b: number, a = 255): void {
    if (x < 0 || x >= TILE_PX || y < 0 || y >= TILE_PX) return;
    const i = ((this.oy + y) * ATLAS_SIZE + this.ox + x) * 4;
    const d = this.img.data;
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = a;
  }

  /** Base fill with per-pixel brightness jitter. */
  noiseFill(c: RGB, jitter: number): void {
    for (let y = 0; y < TILE_PX; y++) {
      for (let x = 0; x < TILE_PX; x++) {
        const f = 1 + (this.rand() - 0.5) * jitter;
        this.px(x, y, c[0] * f, c[1] * f, c[2] * f);
      }
    }
  }

  /** Blocky low-frequency noise (4px cells) for stone-like materials. */
  cellNoise(c: RGB, jitter: number, cell = 4): void {
    const cells = TILE_PX / cell;
    const vals: number[] = [];
    for (let i = 0; i < cells * cells; i++) vals.push(1 + (this.rand() - 0.5) * jitter);
    for (let y = 0; y < TILE_PX; y++) {
      for (let x = 0; x < TILE_PX; x++) {
        const f = vals[Math.floor(y / cell) * cells + Math.floor(x / cell)] * (1 + (this.rand() - 0.5) * jitter * 0.4);
        this.px(x, y, c[0] * f, c[1] * f, c[2] * f);
      }
    }
  }

  speckle(c: RGB, count: number, size = 2): void {
    for (let i = 0; i < count; i++) {
      const x = Math.floor(this.rand() * (TILE_PX - size));
      const y = Math.floor(this.rand() * (TILE_PX - size));
      for (let dy = 0; dy < size; dy++) {
        for (let dx = 0; dx < size; dx++) {
          const f = 1 + (this.rand() - 0.5) * 0.25;
          this.px(x + dx, y + dy, c[0] * f, c[1] * f, c[2] * f);
        }
      }
    }
  }

  border(c: RGB, width = 1): void {
    for (let i = 0; i < TILE_PX; i++) {
      for (let w = 0; w < width; w++) {
        this.px(i, w, c[0], c[1], c[2]);
        this.px(i, TILE_PX - 1 - w, c[0], c[1], c[2]);
        this.px(w, i, c[0], c[1], c[2]);
        this.px(TILE_PX - 1 - w, i, c[0], c[1], c[2]);
      }
    }
  }

  /** Vertical streaks (wood grain / log bark). */
  grainV(base: RGB, dark: RGB, streaks: number): void {
    this.noiseFill(base, 0.15);
    for (let s = 0; s < streaks; s++) {
      let x = Math.floor(this.rand() * TILE_PX);
      for (let y = 0; y < TILE_PX; y++) {
        if (this.rand() < 0.15) x += this.rand() < 0.5 ? -1 : 1;
        const f = 1 + (this.rand() - 0.5) * 0.2;
        this.px((x + TILE_PX) % TILE_PX, y, dark[0] * f, dark[1] * f, dark[2] * f);
      }
    }
  }

  clear(): void {
    for (let y = 0; y < TILE_PX; y++) {
      for (let x = 0; x < TILE_PX; x++) this.px(x, y, 0, 0, 0, 0);
    }
  }
}

type Painter = (p: TilePainter) => void;

const GRASS_GREEN: RGB = [106, 170, 64];
const DIRT_BROWN: RGB = [134, 96, 67];
const STONE_GRAY: RGB = [125, 125, 125];
const SAND_YELLOW: RGB = [219, 207, 163];
const WOOD: RGB = [156, 127, 78];
const LEAF_GREEN: RGB = [58, 121, 39];

function plankPainter(p: TilePainter): void {
  p.noiseFill(WOOD, 0.12);
  // Horizontal plank seams + staggered ends.
  for (const y of [7, 15, 23, 31]) {
    for (let x = 0; x < TILE_PX; x++) p.px(x, y, 92, 70, 40);
  }
  for (const [x, y0] of [[15, 0], [7, 8], [23, 16], [11, 24]] as const) {
    for (let y = y0; y < y0 + 7; y++) p.px(x, y, 92, 70, 40);
  }
}

function cobblePainter(mossy: boolean): Painter {
  return (p) => {
    p.cellNoise(STONE_GRAY, 0.35, 8);
    // Stone lumps with dark mortar outlines.
    for (let i = 0; i < 9; i++) {
      const cx = (i % 3) * 11 + 5 + Math.floor(p.rand() * 3);
      const cy = Math.floor(i / 3) * 11 + 5 + Math.floor(p.rand() * 3);
      const r = 4 + p.rand() * 2;
      for (let y = 0; y < TILE_PX; y++) {
        for (let x = 0; x < TILE_PX; x++) {
          const d = Math.hypot(x - cx, y - cy);
          if (d > r - 1 && d < r + 0.5) p.px(x, y, 70, 70, 70);
        }
      }
    }
    if (mossy) {
      for (let i = 0; i < 60; i++) {
        const x = Math.floor(p.rand() * TILE_PX);
        const y = Math.floor(p.rand() * TILE_PX);
        p.px(x, y, 80, 120, 50);
        p.px(x + 1, y, 70, 110, 45);
      }
    }
  };
}

function orePainter(ore: RGB): Painter {
  return (p) => {
    p.cellNoise(STONE_GRAY, 0.3, 4);
    for (let i = 0; i < 7; i++) {
      const x = 3 + Math.floor(p.rand() * (TILE_PX - 8));
      const y = 3 + Math.floor(p.rand() * (TILE_PX - 8));
      const s = 2 + Math.floor(p.rand() * 2);
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
    const handle: RGB = [120, 90, 50];
    if (kind === 'pick') {
      // Diagonal stick from bottom-left to upper-right.
      for (let i = 4; i < 24; i++) {
        p.px(i, 31 - i, handle[0], handle[1], handle[2]);
        p.px(i + 1, 31 - i, handle[0] * 0.8, handle[1] * 0.8, handle[2] * 0.8);
        p.px(i + 2, 31 - i, 0, 0, 0, 0);
      }
      // Curved pick head.
      for (let t = 0; t <= 28; t++) {
        const ang = Math.PI * 0.25 + (t / 28) * Math.PI * 0.5;
        const x = Math.round(20 + Math.cos(ang) * 11);
        const y = Math.round(12 - Math.sin(ang) * 11 + 4);
        for (let w = 0; w < 3; w++) {
          p.px(x + w, y, head[0], head[1], head[2]);
          p.px(x + w, y + 1, head[0] * 0.8, head[1] * 0.8, head[2] * 0.8);
        }
      }
    } else {
      // Blade diagonal.
      for (let i = 0; i < 18; i++) {
        const x = 10 + i;
        const y = 21 - i;
        p.px(x, y, head[0], head[1], head[2]);
        p.px(x + 1, y, head[0] * 1.1, head[1] * 1.1, head[2] * 1.1);
        p.px(x, y - 1, head[0] * 0.85, head[1] * 0.85, head[2] * 0.85);
      }
      // Guard.
      p.px(9, 20, 80, 60, 30);
      p.px(10, 21, 80, 60, 30);
      p.px(8, 21, 80, 60, 30);
      p.px(9, 22, 80, 60, 30);
      // Handle.
      for (let i = 0; i < 7; i++) {
        p.px(7 - i + 1, 23 + i, handle[0], handle[1], handle[2]);
        p.px(7 - i, 23 + i, handle[0] * 0.8, handle[1] * 0.8, handle[2] * 0.8);
      }
    }
  };
}

function crackPainter(stage: number): Painter {
  return (p) => {
    p.clear();
    const cracks = 3 + stage * 3;
    for (let c = 0; c < cracks; c++) {
      let x = Math.floor(p.rand() * TILE_PX);
      let y = Math.floor(p.rand() * TILE_PX);
      const len = 6 + stage * 5;
      for (let i = 0; i < len; i++) {
        p.px(x, y, 20, 16, 12, 200);
        x += Math.floor(p.rand() * 3) - 1;
        y += Math.floor(p.rand() * 3) - 1;
        if (x < 0 || x >= TILE_PX || y < 0 || y >= TILE_PX) break;
      }
    }
  };
}

const PAINTERS: Record<number, Painter> = {
  [TILE.GRASS_TOP]: (p) => {
    p.noiseFill(GRASS_GREEN, 0.22);
    p.speckle([90, 150, 50], 26, 1);
  },
  [TILE.GRASS_SIDE]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.2);
    for (let x = 0; x < TILE_PX; x++) {
      const depth = 4 + Math.floor(p.rand() * 4);
      for (let y = 0; y < depth; y++) {
        const f = 1 + (p.rand() - 0.5) * 0.2;
        p.px(x, y, GRASS_GREEN[0] * f, GRASS_GREEN[1] * f, GRASS_GREEN[2] * f);
      }
    }
  },
  [TILE.DIRT]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.25);
    p.speckle([110, 78, 52], 18, 2);
  },
  [TILE.STONE]: (p) => p.cellNoise(STONE_GRAY, 0.22, 4),
  [TILE.COBBLESTONE]: cobblePainter(false),
  [TILE.MOSSY_COBBLESTONE]: cobblePainter(true),
  [TILE.BEDROCK]: (p) => p.cellNoise([60, 60, 60], 0.7, 4),
  [TILE.SAND]: (p) => {
    p.noiseFill(SAND_YELLOW, 0.12);
    p.speckle([200, 188, 142], 20, 1);
  },
  [TILE.GRAVEL]: (p) => p.cellNoise([118, 110, 105], 0.42, 3),
  [TILE.SANDSTONE_TOP]: (p) => {
    p.noiseFill([216, 203, 155], 0.08);
    p.border([196, 183, 135]);
  },
  [TILE.SANDSTONE_SIDE]: (p) => {
    p.noiseFill([216, 203, 155], 0.08);
    for (const y of [10, 21]) for (let x = 0; x < TILE_PX; x++) p.px(x, y, 190, 176, 128);
  },
  [TILE.OAK_LOG_SIDE]: (p) => p.grainV([104, 82, 49], [80, 62, 36], 7),
  [TILE.OAK_LOG_TOP]: (p) => {
    p.noiseFill([104, 82, 49], 0.12);
    for (let r = 2; r < 15; r += 3) {
      for (let a = 0; a < 360; a += 4) {
        const x = Math.round(15.5 + Math.cos((a * Math.PI) / 180) * r);
        const y = Math.round(15.5 + Math.sin((a * Math.PI) / 180) * r);
        p.px(x, y, 156, 127, 78);
      }
    }
  },
  [TILE.OAK_LEAVES]: (p) => {
    p.clear();
    for (let y = 0; y < TILE_PX; y++) {
      for (let x = 0; x < TILE_PX; x++) {
        if (p.rand() < 0.82) {
          const f = 1 + (p.rand() - 0.5) * 0.45;
          p.px(x, y, LEAF_GREEN[0] * f, LEAF_GREEN[1] * f, LEAF_GREEN[2] * f);
        }
      }
    }
  },
  [TILE.BIRCH_LOG_SIDE]: (p) => {
    p.grainV([214, 210, 200], [190, 186, 176], 4);
    for (let i = 0; i < 7; i++) {
      const x = Math.floor(p.rand() * 28);
      const y = Math.floor(p.rand() * 30);
      for (let w = 0; w < 4; w++) p.px(x + w, y, 40, 38, 34);
    }
  },
  [TILE.BIRCH_LEAVES]: (p) => {
    p.clear();
    for (let y = 0; y < TILE_PX; y++) {
      for (let x = 0; x < TILE_PX; x++) {
        if (p.rand() < 0.8) {
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
    p.border([210, 235, 240], 1);
    // Sparse glints.
    for (const [x, y] of [[6, 6], [7, 7], [8, 8], [22, 20], [23, 21]] as const) {
      p.px(x, y, 230, 245, 250, 180);
    }
  },
  [TILE.SNOW_TOP]: (p) => p.noiseFill([240, 246, 250], 0.05),
  [TILE.SNOW_SIDE]: (p) => {
    p.noiseFill(DIRT_BROWN, 0.2);
    for (let x = 0; x < TILE_PX; x++) {
      for (let y = 0; y < 8; y++) p.px(x, y, 240, 246, 250);
    }
  },
  [TILE.CACTUS_SIDE]: (p) => {
    p.noiseFill([58, 124, 48], 0.15);
    for (let x = 3; x < TILE_PX; x += 7) {
      for (let y = 0; y < TILE_PX; y++) p.px(x, y, 38, 90, 32);
    }
    p.speckle([150, 180, 120], 8, 1);
  },
  [TILE.CACTUS_TOP]: (p) => {
    p.noiseFill([70, 140, 58], 0.12);
    p.border([48, 104, 40], 2);
  },
  [TILE.TALL_GRASS]: (p) => {
    p.clear();
    for (let b = 0; b < 9; b++) {
      let x = 4 + b * 3;
      for (let y = 31; y > 8 + Math.floor(p.rand() * 8); y--) {
        const f = 1 + (p.rand() - 0.5) * 0.3;
        p.px(x, y, 92 * f, 158 * f, 60 * f);
        if (p.rand() < 0.25) x += p.rand() < 0.5 ? -1 : 1;
      }
    }
  },
  [TILE.FLOWER_RED]: (p) => {
    p.clear();
    for (let y = 14; y < 32; y++) p.px(15, y, 58, 110, 40);
    p.px(14, 20, 58, 110, 40);
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        if (Math.abs(dx) + Math.abs(dy) <= 4) p.px(15 + dx, 10 + dy, 214, 48, 40);
      }
    }
    p.px(15, 10, 40, 30, 20);
  },
  [TILE.FLOWER_YELLOW]: (p) => {
    p.clear();
    for (let y = 14; y < 32; y++) p.px(16, y, 58, 110, 40);
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        if (dx * dx + dy * dy <= 9) p.px(16 + dx, 10 + dy, 240, 214, 70);
      }
    }
    p.px(16, 10, 180, 140, 30);
  },
  [TILE.TORCH]: (p) => {
    p.clear();
    for (let y = 12; y < 32; y++) {
      p.px(15, y, 120, 90, 50);
      p.px(16, y, 100, 75, 40);
    }
    for (let dy = 0; dy < 5; dy++) {
      for (let dx = -1; dx <= 2; dx++) {
        p.px(15 + dx, 7 + dy, 255, 200 - dy * 18, 60);
      }
    }
    p.px(15, 5, 255, 240, 160);
    p.px(16, 5, 255, 240, 160);
  },
  [TILE.CRAFTING_TABLE_TOP]: (p) => {
    plankPainter(p);
    p.border([60, 45, 28], 2);
    for (let i = 8; i < 24; i++) {
      p.px(i, 15, 60, 45, 28);
      p.px(i, 16, 60, 45, 28);
      p.px(15, i, 60, 45, 28);
      p.px(16, i, 60, 45, 28);
    }
  },
  [TILE.CRAFTING_TABLE_SIDE]: (p) => {
    plankPainter(p);
    for (let y = 0; y < 4; y++) for (let x = 0; x < TILE_PX; x++) p.px(x, y, 92, 70, 40);
  },
  [TILE.CRAFTING_TABLE_FRONT]: (p) => {
    plankPainter(p);
    // Tool silhouettes.
    for (let i = 0; i < 10; i++) {
      p.px(8 + i, 18 - i, 60, 45, 28);
      p.px(20 + (i % 3), 12 + i, 70, 50, 30);
    }
  },
  [TILE.FURNACE_FRONT]: (p) => {
    p.cellNoise(STONE_GRAY, 0.2, 8);
    for (let y = 18; y < 28; y++) {
      for (let x = 10; x < 22; x++) p.px(x, y, 30, 30, 30);
    }
  },
  [TILE.FURNACE_FRONT_LIT]: (p) => {
    p.cellNoise(STONE_GRAY, 0.2, 8);
    for (let y = 18; y < 28; y++) {
      for (let x = 10; x < 22; x++) {
        const flame = p.rand();
        if (flame < 0.5) p.px(x, y, 255, 140 + p.rand() * 60, 30);
        else p.px(x, y, 60, 30, 15);
      }
    }
  },
  [TILE.FURNACE_SIDE]: (p) => p.cellNoise(STONE_GRAY, 0.2, 8),
  [TILE.FURNACE_TOP]: (p) => {
    p.cellNoise(STONE_GRAY, 0.18, 8);
    p.border([95, 95, 95], 2);
  },
  [TILE.CHEST_FRONT]: (p) => {
    p.noiseFill([162, 116, 56], 0.1);
    p.border([110, 78, 38], 2);
    for (let x = 0; x < TILE_PX; x++) p.px(x, 14, 110, 78, 38);
    // Latch.
    for (let y = 12; y < 18; y++) {
      for (let x = 14; x < 18; x++) p.px(x, y, 150, 150, 150);
    }
  },
  [TILE.CHEST_SIDE]: (p) => {
    p.noiseFill([162, 116, 56], 0.1);
    p.border([110, 78, 38], 2);
    for (let x = 0; x < TILE_PX; x++) p.px(x, 14, 110, 78, 38);
  },
  [TILE.CHEST_TOP]: (p) => {
    p.noiseFill([170, 124, 62], 0.1);
    p.border([110, 78, 38], 2);
  },
  [TILE.HOPPER_TOP]: (p) => {
    p.noiseFill([72, 72, 72], 0.12);
    p.border([50, 50, 50], 3);
    for (let y = 12; y < 20; y++) {
      for (let x = 12; x < 20; x++) p.px(x, y, 25, 25, 25);
    }
  },
  [TILE.HOPPER_SIDE]: (p) => {
    p.noiseFill([85, 85, 85], 0.12);
    // Funnel silhouette.
    for (let y = 0; y < TILE_PX; y++) {
      const inset = Math.floor(y / 2.5);
      for (let x = 0; x < inset; x++) {
        p.px(x, y, 40, 40, 40, y > 16 ? 255 : 255);
        p.px(TILE_PX - 1 - x, y, 40, 40, 40);
      }
    }
  },
  [TILE.SPAWNER]: (p) => {
    p.clear();
    p.noiseFill([28, 38, 48], 0.3);
    // Cage bars (transparent gaps).
    for (let x = 0; x < TILE_PX; x++) {
      for (let y = 0; y < TILE_PX; y++) {
        if (x % 6 >= 3 && y % 6 >= 3 && x > 2 && x < 29 && y > 2 && y < 29) p.px(x, y, 0, 0, 0, 0);
      }
    }
  },
  [TILE.WOOL]: (p) => {
    p.noiseFill([228, 228, 228], 0.1);
    for (let i = 0; i < 26; i++) {
      const x = Math.floor(p.rand() * 30);
      const y = Math.floor(p.rand() * 30);
      p.px(x, y, 205, 205, 205);
      p.px(x + 1, y + 1, 215, 215, 215);
    }
  },
  [TILE.GLOWSTONE]: (p) => {
    p.cellNoise([220, 180, 90], 0.3, 4);
    p.speckle([255, 230, 150], 16, 2);
  },
  [TILE.WATER]: (p) => {
    for (let y = 0; y < TILE_PX; y++) {
      for (let x = 0; x < TILE_PX; x++) {
        const f = 1 + (p.rand() - 0.5) * 0.18;
        p.px(x, y, 50 * f, 95 * f, 195 * f, 255);
      }
    }
  },
  [TILE.LAVA]: (p) => {
    p.cellNoise([207, 90, 25], 0.4, 4);
    p.speckle([255, 200, 60], 14, 3);
    p.speckle([120, 30, 10], 10, 3);
  },
  [TILE.IRON_BLOCK]: (p) => {
    p.noiseFill([216, 216, 216], 0.05);
    p.border([180, 180, 180], 2);
  },
  [TILE.CRACK_0]: crackPainter(0),
  [TILE.CRACK_1]: crackPainter(1),
  [TILE.CRACK_2]: crackPainter(2),
  [TILE.CRACK_3]: crackPainter(3),
  [TILE.ITEM_STICK]: (p) => {
    p.clear();
    for (let i = 0; i < 18; i++) {
      p.px(8 + i, 24 - i, 120, 90, 50);
      p.px(9 + i, 24 - i, 100, 75, 40);
    }
  },
  [TILE.ITEM_COAL]: (p) => {
    p.clear();
    for (let dy = -7; dy <= 7; dy++) {
      for (let dx = -7; dx <= 7; dx++) {
        if (dx * dx + dy * dy <= 49 + p.rand() * 8 - 4) {
          const f = 1 + (p.rand() - 0.5) * 0.5;
          p.px(16 + dx, 16 + dy, 38 * f, 38 * f, 40 * f);
        }
      }
    }
  },
  [TILE.ITEM_CHARCOAL]: (p) => {
    p.clear();
    for (let dy = -7; dy <= 7; dy++) {
      for (let dx = -7; dx <= 7; dx++) {
        if (dx * dx + dy * dy <= 49 + p.rand() * 8 - 4) {
          const f = 1 + (p.rand() - 0.5) * 0.5;
          p.px(16 + dx, 16 + dy, 52 * f, 42 * f, 36 * f);
        }
      }
    }
  },
  [TILE.ITEM_RAW_IRON]: (p) => {
    p.clear();
    for (let dy = -7; dy <= 7; dy++) {
      for (let dx = -7; dx <= 7; dx++) {
        if (Math.abs(dx) + Math.abs(dy) <= 9) {
          const f = 1 + (p.rand() - 0.5) * 0.3;
          p.px(16 + dx, 16 + dy, 216 * f, 175 * f, 147 * f);
        }
      }
    }
  },
  [TILE.ITEM_IRON_INGOT]: (p) => ingotPainter(p, [222, 222, 222]),
  [TILE.ITEM_GOLD_INGOT]: (p) => ingotPainter(p, [250, 215, 90]),
  [TILE.ITEM_DIAMOND]: (p) => {
    p.clear();
    for (let dy = -8; dy <= 8; dy++) {
      const half = 8 - Math.abs(dy);
      for (let dx = -half; dx <= half; dx++) {
        const f = 1 + (p.rand() - 0.5) * 0.25;
        p.px(16 + dx, 15 + dy, 93 * f, 236 * f, 245 * f);
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
    for (let i = 0; i < 18; i++) {
      p.px(7 + i, 25 - i, 130, 100, 60);
    }
    // Head.
    for (let i = 0; i < 4; i++) {
      p.px(24 + i, 8 - i, 200, 200, 200);
      p.px(24, 8 - i, 200, 200, 200);
      p.px(24 + i, 8, 200, 200, 200);
    }
    // Fletching.
    for (let i = 0; i < 4; i++) {
      p.px(6 + i, 26, 230, 230, 230);
      p.px(6, 26 - i, 230, 230, 230);
    }
  },
  [TILE.ITEM_WHEAT]: (p) => {
    p.clear();
    for (let b = 0; b < 3; b++) {
      const x = 10 + b * 5;
      for (let y = 30; y > 10; y--) p.px(x, y, 178, 152, 66);
      for (let y = 10; y < 16; y++) {
        p.px(x - 1, y, 210, 186, 88);
        p.px(x + 1, y, 210, 186, 88);
      }
    }
  },
};

function ingotPainter(p: TilePainter, c: RGB): void {
  p.clear();
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 18; x++) {
      const f = 1 - y * 0.04;
      p.px(7 + x + (7 - y), 14 + y, c[0] * f, c[1] * f, c[2] * f);
    }
  }
  for (let x = 0; x < 18; x++) p.px(14 + x, 13, c[0] * 1.1, c[1] * 1.1, c[2] * 1.1);
}

function muttonPainter(p: TilePainter, meat: RGB, edge: RGB): void {
  p.clear();
  for (let dy = -8; dy <= 8; dy++) {
    for (let dx = -6; dx <= 6; dx++) {
      if ((dx * dx) / 36 + (dy * dy) / 64 <= 1) {
        const f = 1 + (p.rand() - 0.5) * 0.2;
        p.px(14 + dx, 14 + dy, meat[0] * f, meat[1] * f, meat[2] * f);
      }
    }
  }
  // Bone.
  for (let i = 0; i < 8; i++) p.px(20 + i, 24 + Math.floor(i / 3), edge[0], edge[1], edge[2]);
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

    for (const [tileStr, painter] of Object.entries(PAINTERS)) {
      const tile = Number(tileStr);
      const tx = (tile % 32) * TILE_PX;
      const ty = Math.floor(tile / 32) * TILE_PX;
      const p = new TilePainter(img, tx, ty, mulberry32(seed ^ (tile * 7919 + 17)));
      // Default opaque magenta marker for unpainted pixels inside the tile
      // is avoided by painters always covering or clearing their area.
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

  /** 32x32 PNG data-URL for a tile (React UI item icons). */
  icon(tile: number): string {
    let url = this.iconCache.get(tile);
    if (!url) {
      const c = document.createElement('canvas');
      c.width = TILE_PX;
      c.height = TILE_PX;
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
        TILE_PX,
        TILE_PX,
      );
      url = c.toDataURL();
      this.iconCache.set(tile, url);
    }
    return url;
  }
}
