# VoxelCraft

A production-grade, multi-threaded 3D voxel engine (Minecraft clone) that runs
entirely in the browser at a target of 60 FPS. Built with React, TypeScript,
Three.js (WebGL), Zustand and a four-thread Web Worker topology — no external
game assets (every texture is procedurally painted at runtime).

## Quick start

```bash
npm install
npm run dev        # vite dev server at http://localhost:5173
npm run build      # type-check + production bundle into dist/
npm run preview    # serve the production build
npm test           # vitest unit suite (41 tests)
node scripts/smoke.mjs   # headless Playwright runtime smoke test
```

Open the page, type a world seed (or leave it blank for a random one) and click
**Create World**.

### Controls

| Action | Key |
| --- | --- |
| Move | `W` `A` `S` `D` |
| Jump / swim up | `Space` |
| Sneak (ledge-safe) | `Left Shift` |
| Sprint | `Left Ctrl` |
| Mine / attack | Left mouse (hold) |
| Place / interact | Right mouse |
| Hotbar | `1`–`9` or scroll wheel |
| Inventory | `E` |
| Drop item | `Q` (`Ctrl+Q` whole stack) |
| Toggle 1st/3rd person | `F5` |
| Fullscreen | `F` / `F11` |
| Debug overlay | `F3` |
| Pause / settings | `Esc` |

On touch devices a virtual joystick, vector-icon action buttons (jump, sneak,
mine, place) and free-look drag are rendered automatically, plus on-screen
inventory / fullscreen / settings buttons. Inventory and crafting use unified
pointer events so drag-and-drop works identically with mouse and touch.

Empty buckets fill from water/lava sources (right-click) and place them back
elsewhere, so the cellular-automata fluid simulation is fully player-driven.

## Thread topology (Module 1)

| Thread | File | Responsibility |
| --- | --- | --- |
| **A** Main / Renderer | `src/engine/Game.ts` | React UI, input, Three.js render loop, player prediction, lighting |
| **B** Logic (20 TPS) | `src/workers/logic.worker.ts` | Physics, fluids, mob AI, A*, hoppers, furnaces, spawning |
| **C** World Gen | `src/workers/gen.worker.ts` | Seeded noise terrain, caves, structures, decoration |
| **D** Greedy Mesher | `src/workers/mesh.worker.ts` | Greedy meshing, AO baking, fluid/plant geometry |

### Memory layout

Each 16×256×16 chunk is one contiguous `Uint16Array(65536)`:

```
index = x + (z * 16) + (y * 256)
bits  0-7  : block id  (0-255)
bits  8-11 : sunlight  (0-15)
bits 12-15 : blocklight (0-15)
```

## Architecture map

```
src/
  core/         Pure, dependency-free engine logic (shared by all threads)
    coords.ts     Bit-packed voxel format + chunk indexing
    prng.ts       Mulberry32 PRNG, coordinate hashing, seed derivation
    noise.ts      Seeded Simplex + multi-octave fBm samplers
    blocks.ts     Block registry, render types, fluid helpers
    items.ts      Item registry (tools, food, fuel, block-items)
    recipes.ts    2x2/3x3 recipe matrix validator + smelting/fuel tables
    inventory.ts  Slot arithmetic + click state machine
    aabb.ts       Swept-AABB collision, step-up, sneak ledge guard
    world.ts      Chunk store + flood-fill lighting (add/remove BFS)
    entities.ts   Entity defs (hitboxes, health, drops)
    config.ts     Global tuning constants
  workers/      The three off-thread workers (B, C, D)
  engine/       Main-thread systems (renderer, chunks, player, camera, AI render)
    TextureAtlas.ts   Procedural 1024² atlas painter
    materials.ts      Custom GLSL terrain + water shaders
    ChunkManager.ts   Chunk lifecycle, padded snapshots, geometry upload
    DayNight.ts       Day/night cycle, sky/fog interpolation
    Player.ts         Client-side player physics + fluid push
    Raycast.ts        DDA voxel raycast (block picking)
    Input.ts          Keyboard/mouse + touch input state
    EntityRenderer.ts Interpolated mob models + attack raycast
    CharacterModel.ts 3rd-person model + 1st-person held item
  net/messages.ts   Typed cross-thread message protocol
  state/        Zustand store + engine↔UI bridge
  ui/           React/Tailwind overlays (HUD, inventory, menus, touch)
  test/         Vitest unit tests
```

## Feature coverage

- **Module 1** — 4-thread topology, `Uint16Array` chunk format, transferable message pipeline.
- **Module 2** — Greedy meshing, procedural texture atlas + custom UV/AO GLSL shader (no texture bleeding via half-texel clamp), smooth vertex AO, dynamic day/night with rotating sun/moon and interpolated sky/fog.
- **Module 3** — Mulberry32 seed determinism, multi-octave continentalness/erosion/peaks noise → 5 biomes, 3D worm caves + cheese caverns + ravines down to bedrock, blueprint-matrix villages (incl. desert sandstone huts), spawner dungeons with loot, oak/birch trees with leaf decay.
- **Module 4** — Swept-AABB continuous collision (anti-tunneling), spatial hash grid, cellular-automata water (7) & lava (3) with entity push vectors, sneak ledge guard.
- **Module 5** — Voxel A* pathfinding, full AI state machines (sheep grazing, villager panic + line-of-sight, zombie sun-burning, skeleton strafing/arrows, silent creeper detonation), hopper item transport every 4 ticks, iron-golem cluster spawning.
- **Module 6** — 36-slot Zustand inventory with split/merge/shift-click state machine, 2x2 + 3x3 recipe validation, furnace smelting state machine with live fuel/progress bars.
- **Module 7** — Pause/settings overlay (render distance, FOV, quality, day length, sensitivity), PointerLock + virtual touch controls, first/third-person camera with animated character model.

## Testing

`npm test` runs 41 unit tests covering the voxel bit-format, PRNG/noise
determinism, recipe matching, inventory state machine, swept-AABB anti-tunneling
& step-up, the lighting BFS, greedy-mesher face counts/winding, and
world-generation determinism. `node scripts/smoke.mjs` drives the built app in
headless Chromium (SwiftShader) and asserts the engine boots, generates chunks,
renders, and is interactive. `npm run ghpages:check` builds and serves `dist/`
under a `/minecraft/` sub-path to prove the production bundle deploys to a
GitHub Pages project site with zero broken asset/worker paths.

## Deployment (GitHub Pages)

The build is configured for static hosting with `base: './'` in
`vite.config.ts`, so all asset and module-worker URLs are **relative** to the
bundle and resolve correctly whether the site is served from a domain root or a
project sub-path (`https://<user>.github.io/<repo>/`). A `public/.nojekyll`
file is copied into `dist/` so GitHub Pages serves the `assets/` folder
verbatim.

CI/CD is handled by `.github/workflows/deploy.yml` using the **native GitHub
Actions Pages deployment**: on every push to `main` (or `master`) it checks out
the repo, installs Node 22 LTS, runs `npm ci`, builds with `npm run build`,
uploads `dist/` via `actions/upload-pages-artifact`, and deploys it with
`actions/deploy-pages`.

**One-time setup:** in the repo under **Settings → Pages → Build and
deployment → Source**, select **_GitHub Actions_** (not "Deploy from a
branch"). The workflow must live on the repository's **default branch**
(`main`/`master`) — the `github-pages` environment only permits deployments
from the default branch. After it runs, the site is live at
`https://<user>.github.io/<repo>/`.
