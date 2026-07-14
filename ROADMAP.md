# VoxelCraft — Bugfix- & Ausbau-Roadmap

Stand: Commit `c87a7a8` (2026-07-11). Diese Datei ist der Arbeitsplan für Coding-Agents:
**ein Arbeitspaket = ein Agent-Lauf = ein Commit.** Reihenfolge einhalten — die Pakete
sind nach Nutzer-Sichtbarkeit und Abhängigkeiten sortiert. Jedes Paket enthält
Root-Cause, konkrete Schritte und Abnahmekriterien.

Verifikation nach jedem Paket (Pflicht):
```bash
npx tsc --noEmit && npm test && npm run build && node scripts/smoke.mjs
```
Für neue Systeme zusätzlich einen `scripts/<feature>-test.mjs` im Stil von
`scripts/boat-test.mjs` / `scripts/village-test.mjs` anlegen (vite-node, PASS/FAIL, exit code).

---

## Bestätigte Bugs (Analyse-Ergebnis)

| # | Symptom (Nutzer-Report) | Root Cause | Paket |
|---|---|---|---|
| B1 | Mobil: Hotbar-Slots lassen sich nicht antippen | `TouchControls` wird in `App.tsx` NACH `HUD` gerendert; sein Root-Div ist `absolute inset-0 pointer-events-auto` und liegt damit ÜBER der Hotbar — jeder Tap startet Joystick/Look statt Slot-Auswahl | P0-1 |
| B2 | Mobil: Crafting-Table geht einmal, danach öffnet sich das Menü sofort wieder / lässt sich nicht mehr schließen | `TouchControls` unmountet beim Öffnen des Screens, BEVOR das `touchend` des Use-Buttons ankommt → `input.useHeld` bleibt `true`. `Game.updateUse()` (Game.ts:623) feuert mit `useHeld` alle 0,24 s neu → beim Schließen steht man noch vor dem Tisch → sofortiges Re-Open | P0-1 |
| B3 | Mobil: Spieler läuft/gräbt nach Menü-Öffnen von selbst weiter | Gleiche Ursache wie B2: Joystick (`stickX/stickZ`) und `mineHeld` werden beim Unmount nie zurückgesetzt | P0-1 |
| B4 | Mobs sind über riesige Entfernung sichtbar („durch den Nebel", über ungeladenen Chunks) | Nebel existiert NUR im Terrain-Shader (`uFogNear/Far`); es gibt kein `scene.fog` → `MeshLambertMaterial`-Mobs werden nie vernebelt. Mobs leben bis `DESPAWN_RADIUS = 72` Blöcke; Nebelwand liegt bei RD 6 nachts bei ~79 m, bei kleineren Render-Distanzen weit davor | P0-2 |
| B5 | Nacht ist zu dunkel | `sunLevel`-Nachtboden = 0,16 (DayNight.ts:41), Entity-Minimum = 0,06 mit `pow(x,1.3)` (EntityRenderer.ts:218) → effektiv ~6–9 % Resthelligkeit; Vanilla-Mondlicht entspricht eher ~25–30 % | P0-3 |
| B6 | Mobil: aufgenommener Item-Stack ist beim Draggen unsichtbar | `CursorStack` (Slot.tsx:79) hört nur auf `mousemove` — bei Touch bleibt das Item an der letzten Maus-Position (0,0) kleben | P1-1 |
| B7 | Mob-Optik „flach" (Zombie & Co.) | Nur Basis-Boxen, kein Körper-Bob, keine Todes-Animation (Mobs poppen weg), Skeleton ohne Bogen, Sheep ohne Woll-Volumen, einfarbige Flächen ohne Struktur | P2-1 |
| B8 | GUI ist optisch ein Mojang-Klon | `Panel` nutzt `bg-mc-panel` + weiß/dunkle Bevel-Borders (klassischer MC-Look), Herzen/Hotbar 1:1 MC-Stil | P2-2 |
| — | Kein Bett / Nacht nicht überspringbar | Feature existiert nicht (Grep bestätigt) | P3-1 |
| — | Welt geht bei Reload verloren | Keinerlei Persistenz — nur Settings in localStorage (store.ts:91) | P3-2 |

### Status-Update (2. Analyse-Runde, selbst gefunden & sofort behoben)

| # | Bug | Root Cause | Status |
|---|---|---|---|
| N1 | Items werden manchmal nicht aufgehoben/gemergt, Pfeile fliegen durch Mobs, Hopper saugen unzuverlässig | `queryRange()` (logic.worker) sprang in Roh-Koordinaten um 4 statt zellen-ausgerichtet → ganze Spatial-Hash-Zellen wurden übersprungen | ✅ behoben |
| N2 | Spieler fällt durch die Welt, wenn der Chunk unter ihm noch nicht geladen ist (langsame Geräte, schnelles Boot) | Kein Ready-Check vor der Physik; ungeladene Chunks lesen sich als Luft | ✅ behoben (Physik friert ein, bis Chunk-Daten da sind) |
| N3 | Creeper zünden durch Wände/Böden | Zünd-Branch prüfte nur Distanz ≤ 3, keine Sichtlinie | ✅ behoben (hasLOS-Gate) |
| N4 | Brennende Zombies/Skelette brennen im Wasser weiter | Burn-Check ignorierte Wasser | ✅ behoben |
| N5 | Item-Drops überleben ewig in Lava | Lava-Schaden schloss Items explizit aus | ✅ behoben (Items verbrennen) |

**Neu gefunden, noch offen (Backlog, klein):**
- Explosionsschaden ignoriert Wände (nur Distanz-Falloff) — Sichtlinien-Dämpfung ergänzen (S, in P2-1 oder eigenes Mini-Paket).
- Blöcke lassen sich in Mobs hinein platzieren (`tryPlace` prüft nur den Spieler-AABB) — Entity-AABB-Check ergänzen (S).
- Villager-Pfadfindung wertet Wasser als begehbar → Dorfbewohner waten in Teiche (S: `walkable()` Wasser nur für Nicht-Villager).
- Chunk-Rand-Fluid-Wake sampelt nur jede 4./8. Zelle → selten stehende Wasserwände an Ozean-Höhlen (M, niedrige Prio).

**Unklar — bitte vom Projektinhaber präzisieren:**
1. „mobil geht auch Shake" — Gemeint: Kamera wackelt? Gerät-Schütteln als Geste? Bitte 1 Satz Repro.
2. „Blöcke manchmal nicht sichtbar" (alter Report) — Meshing-Pipeline geprüft und korrekt
   (Nachbar-Gating ChunkManager.ts:171). Durchsatz wurde bereits erhöht. Falls es wieder
   auftritt: Screenshot + was direkt davor passierte (Chunk-Grenze? Glas? Wasser?).

---

## Phase 0 — Kritische Bugfixes (zuerst, in dieser Reihenfolge)

### ✅ P0-1 · ERLEDIGT — Touch-Input reparieren: Hotbar, Menü-Reopen-Loop, Geister-Eingaben (S)
**Dateien:** `src/App.tsx`, `src/ui/TouchControls.tsx`, `src/engine/Game.ts`
1. `App.tsx`: `<TouchControls />` VOR `<HUD />` rendern (DOM-Reihenfolge = Stapelreihenfolge).
   HUD-Root ist `pointer-events-none`, nur Hotbar-Slots sind `auto` → Slots fangen dann ihre
   Taps, alles andere fällt auf die Touch-Ebene durch. Fixt B1.
2. `TouchControls.tsx`: Unmount-Cleanup ergänzen:
   ```tsx
   React.useEffect(() => () => {
     const b = bridge();
     b.touchMove(0, 0);
     (['jump','sneak','attack','use'] as const).forEach((k) => b.touchButton(k, false));
   }, []);
   ```
   Fixt B3 und die halbe B2.
3. `Game.ts` `openScreen()` (Zeile ~1034): zusätzlich `input.useHeld = false;
   input.useClicked = false; input.mineHeld = false;` setzen und in `closeScreen()`
   `this.useRepeat = 0.3;` (Schließ-Karenz) — damit kann kein staler Zustand das Menü
   re-openen, auch nicht auf Desktop (Rechtsklick gehalten + E). Fixt B2 vollständig.
**Abnahme:** Chrome DevTools Device-Mode (Touch): (a) jeden Hotbar-Slot antippen → Auswahl
wechselt; (b) Crafting-Table per Place-Button öffnen, per ✕ schließen → bleibt zu;
(c) Joystick halten + Inventar öffnen + schließen → Spieler steht still.

### ✅ P0-2 · ERLEDIGT — Entity-Nebel & Distanz-Culling (S)
**Dateien:** `src/engine/Game.ts` (Szenen-Setup), `src/engine/DayNight.ts`, `src/engine/EntityRenderer.ts`
1. Beim Szenen-Setup `scene.fog = new THREE.Fog(0x8ec2ee, 1, 100)` setzen.
2. `DayNightCycle.update()`: `scene.fog.color.copy(this.skyColor)`,
   `scene.fog.near = env.uFogNear.value`, `scene.fog.far = env.uFogFar.value` — identisch zum
   Terrain-Shader. (Unterwasser-Zweig in Game.ts:316 ebenfalls spiegeln.) Lambert-Materialien
   (Mobs, Boot, Charakter) nehmen `scene.fog` automatisch mit.
3. `EntityRenderer.update()`: Signatur um `camX/camZ, fogFar` erweitern;
   `e.group.visible = (dx*dx+dz*dz) < (fogFar+8)**2` pro Entity — spart zusätzlich Drawcalls.
**Abnahme:** Smoke-Test läuft; visuell (Screenshot, Render-Distanz 3): kein Mob vor/hinter
der Nebelwand frei schwebend sichtbar.

### ✅ P0-3 · ERLEDIGT — Nacht heller + Helligkeitsregler (S)
**Dateien:** `src/engine/DayNight.ts`, `src/engine/EntityRenderer.ts`, `src/state/store.ts`, `src/ui/Menus.tsx`, `src/engine/materials.ts`
1. `DayNight.ts:41`: `this.sunLevel = 0.16 + 0.84 * dayF` → `0.30 + 0.70 * dayF`.
2. `EntityRenderer.ts:218`: Minimum `0.06` → `0.14`, Exponent `1.3` → `1.15`.
3. Settings-Eintrag `brightness` (0.5–1.5, Default 1.0) + Slider in `PauseScreen`;
   als Uniform `uGamma` in den Terrain-Shader (`materials.ts`) geben:
   `color.rgb = pow(color.rgb, vec3(1.0/uGamma))` am Ende des Fragment-Shaders,
   und in EntityRenderer `bright *= brightness` einmultiplizieren.
**Abnahme:** Um Mitternacht (F3-Zeit ~0,75) sind Terrainformen ohne Fackel erkennbar;
Slider verändert die Szene sichtbar; Tag sieht unverändert aus.

---

## ✅ STATUS (nach Umsetzungs-Session)

**Komplett erledigt:** Phase 0 (P0-1..3), Phase 1 (P1-1..3), Phase 2 (P2-1, P2-2),
Phase 3 (P3-1 Bett, P3-2 Speicherung, P3-3 Sound, P3-4 Hunger, P3-5 Tiere+Zucht,
P3-6 Rüstung, P3-7 Wetter, P3-8 XP+Verzauberung).
**Phase 4 komplett erledigt:**
- P4-1 Redstone-Blöcke: BOX-Mesher (Teilquader), Redstone-Erz/-Kabel/-Block, Hebel,
  Druckplatte, Lampe, Türen (2 Blöcke, manuell + Signal), Falltüren, Kolben (4 Richtungen).
- P4-2 Redstone-Sim: `src/core/redstone.ts` (Power-BFS 15er-Decay, Treppen-Slopes),
  flankengetriggerte Türen, Kolben schieben bis 8 Blöcke; Platten lesen Entity-Gewicht.
  Harness: `scripts/redstone-test.mjs`.
- P4-3 Nether: Portal (Obsidianrahmen + Feuerzeug aus Flint(Kies-Drop)+Eisen), 1,2s-Reise
  mit Rückportal-Bau, Höllen-Generator (Kavernen/Lava-Ozean/Glowstone/Seelensand/Magma),
  rote Atmosphäre, Persistenz v2 (Journal je Dimension). Harness: `scripts/nether-test.mjs`.
- P4-4 Nether-Mobs: Piglin (neutral, Gruppen-Aggro, Gold-Drops) + Magma Cube (hüpfend,
  Kontaktschaden, Squash&Stretch), beide lavafest; eigene Spawn-Tabelle.
  Harness: `scripts/nethermob-test.mjs`.
- Bewusst offen gelassen (lite): Soul-Sand-Verlangsamung, Redstone-Fackel/Repeater,
  klebrige Kolben, Piglin-Tauschhandel, 8:1-Koordinaten-Skalierung (Portale mappen 1:1).
**Phase 5 komplett erledigt:**
- P5-1 Painter-Toolkit, P5-2 Terrain, P5-3/4 Holz/Laub + Erz-Signaturen,
  P5-7 Himmel (Sonne/Mond/Sterne/Wolken).
- P5-5 Funktionsblöcke: Truhe (Bänder + Schloss), Spawner (Gitter + Innenglut),
  Fackel (Glüh-Halo), Glas (Rahmen + Nieten), Wolle (Web-Muster), Glowstone (Zellkerne), Hopper.
- P5-6 Item-Icons: zentraler 1px-Outline-Pass für ALLE Items + neu gezeichnete
  Werkzeuge/Barren/Kohle/Diamant/Pfeil/Stock — jedes Item auf 44px erkennbar.
- P5-8 Wasser & Effekte: Doppel-Wellen-Shimmer + Funkeln + Tiefen-Alpha,
  aufsteigende Unterwasser-Blasen, Treffer-Funken am Einschlagpunkt.
- P5-9 Mob-Körpertexturen: Zombie-Fetzen, Skelett-Rippen, Creeper-Muster,
  Kuh-Flecken, Schweins-Sprenkel, Woll-Locken, Villager-Robe, Piglin-Weste, Golem-Risse.
- P5-10 HUD & Titel: eigene Pixel-Herzen/Essens-Keulen/Rüstungsschilde
  (voll/halb/leer als SVG-Pixel-Maps) + animiertes Voxel-Panorama hinterm Titel.

**Zusätzlich (User-Wünsche):**
- Drag&Drop-Manager: echtes Ziehen-und-Loslassen in einer Geste (Maus + Touch),
  Teal-Highlight des Ziel-Slots, Doppelklick sammelt gleiche Items; per Smoke-Test
  mit echten Maus-Events verifiziert (window.__fableStore-Hook).
- Blockspezifische Hitboxen: Blumen/Gras/Fackeln/Hebel klein, Türen/Platten/Kabel
  exakt; Fehlschüsse fliegen zum Block dahinter weiter; Outline + Crack skalieren mit.

## Phase 1 — Mobile-UX

### P1-1 · Cursor-Stack folgt dem Finger (S)
`src/ui/Slot.tsx`: `CursorStack` von `mousemove` auf `pointermove` umstellen (window-Listener,
deckt Maus + Touch ab). Bei Touch zusätzlich: nach `pointerdown` auf einem Slot Position sofort
auf die Tap-Koordinate setzen, damit der aufgenommene Stack am Finger erscheint.
**Abnahme:** Device-Mode: Stack aufnehmen → Icon sitzt am Finger/Tap-Punkt, nicht oben links.

### P1-2 · Quick-Move per Long-Press (M)
`src/ui/Slot.tsx`: Long-Press (≥ 400 ms) auf einem Slot = Shift-Klick (Quick-Transfer
Hotbar ↔ Inventar ↔ Container). Timer bei `pointerup`/`pointerleave` abbrechen; bei
Auslösung kurzes visuelles Feedback (Slot blinkt). Touch-only nötig, Maus behält echtes Shift.
**Abnahme:** Device-Mode: Long-Press verschiebt Stack in die andere Inventar-Hälfte;
kurzer Tap macht weiterhin normalen Pick-up.

### P1-3 · Menü-Ergonomie mobil (S)
`src/ui/InventoryScreens.tsx`, `src/ui/Menus.tsx`: ✕-Button auf min. 44×44 px Tap-Fläche
vergrößern; Panel mit `max-h-[92vh] overflow-y-auto`; `env(safe-area-inset-*)`-Padding
für Notch-Geräte; PauseScreen-Buttons `onClick` → zusätzlich `onPointerUp` schadet nicht.
**Abnahme:** iPhone-SE-Viewport (375×667): alle Screens vollständig bedienbar, nichts abgeschnitten.

---

## Phase 2 — Sichtbare Grafik-Politur

### P2-1 · Mob-Modelle & Animationen aufwerten (M)
**Datei:** `src/engine/EntityRenderer.ts`
- **Alle Läufer:** vertikaler Körper-Bob (`group.position.y += |sin(limbPhase)| * 0.03 * speedF`),
  leichtes Torso-Rollen beim Gehen.
- **Zombie:** zerrissene Kleidung (2–3 dunklere Overlay-Boxen an Torso/Beinen), Kopf leicht
  vornüber geneigt (`head.rotation.x += 0.15`).
- **Skeleton:** gehaltener Bogen (gebogene Box-Gruppe an `armR`), beide Arme beim Zielen
  horizontal (AnimFlag.ATTACKING).
- **Sheep:** Woll-Overlay-Box (größer, off-white, bei SHEARED versteckt), Gesicht behalten.
- **Creeper:** Grün-Gradient über 2 Materialtöne, beim Zünden (a>0) zusätzlich Scale-Puls
  (`group.scale.setScalar(1 + a*0.08*sin(t*40))`).
- **Villager:** Kopf dreht sich zum Spieler, wenn < 6 Blöcke entfernt (yaw-Offset klemmen ±0.7).
- **Todes-Animation:** statt Sofort-Despawn beim Verschwinden mit hp≤0: 0,4 s umkippen
  (`rotation.z → π/2`) + Material-Fade, dann entfernen. (Snapshot-Protokoll: Entity beim Tod
  einen Tick mit hp=0 senden oder client-seitig beim Despawn animieren.)
**Abnahme:** Screenshot-Vergleich je Mob; `npm test` unverändert grün.

### P2-2 · Eigene GUI-Identität (kein Mojang-Look) (M)
**Dateien:** `tailwind.config.js`, `src/ui/*.tsx`
Ziel: klar eigenes Design-System „VoxelCraft Dark Glass":
1. Neue Tokens in `tailwind.config.js`: `vc-bg` (#101418ee), `vc-border` (#2dd4bf, Teal-Akzent),
   `vc-slot` (#1b222a), `vc-slot-hover` (#243040), `vc-accent` (#38bdf8), `vc-warn` (#f59e0b).
2. `Panel` (InventoryScreens.tsx): halbtransparentes dunkles Glas (`backdrop-blur-sm`),
   1-px-Teal-Rahmen, `rounded-xl`, weicher Schatten — statt grauem Bevel-Kasten.
3. Slots: dunkle abgerundete Kacheln, Auswahl = Teal-Glow (`ring-2 ring-vc-accent`),
   statt Weiß-Bevel. Hotbar (HUD.tsx) gleiche Sprache; aktiver Slot Teal statt weiß.
4. Herzen bleiben Pixel-Art, aber eigene Form (z. B. Hex-/Rauten-HP-Pips) — Heart-Komponente
   in HUD.tsx ersetzen.
5. Buttons (Menus.tsx `BTN`): flat dark + Teal-Hover statt grauem MC-Bevel.
6. Schrift: eine eigene, frei lizenzierte Pixel-/Sans-Kombination lokal einbetten
   (keine externen Requests; als base64-@font-face oder System-Stack `font-mono`-Variante).
**Abnahme:** Screenshots Titel/HUD/Inventar/Pause — nebeneinander klar unterscheidbar von
Minecraft; Kontrast (Text auf Panel) ≥ WCAG AA.

---

## Phase 3 — Gameplay-Features (je Paket eigenständig)

### P3-1 · Bett & Schlafen (M)
**Dateien:** `src/core/blocks.ts`, `src/core/items.ts`, `src/core/recipes.ts`,
`src/engine/TextureAtlas.ts`, `src/engine/Game.ts`, `src/workers/gen.worker.ts` (optional: Betten in Dorfhäusern)
1. Block `B.BED` (ein Block, rote Decke/weißes Kissen als Textur oben, Seiten Holz) +
   Item + Rezept (3× Wolle über 3× Bretter — Wolle droppt von Schafen; prüfen ob
   `B.WOOL`/Drop existiert, sonst Sheep-Drop ergänzen).
2. `interactWith()` in Game.ts: Bett + Nacht (`dayNight.time` in [0.45, 0.95]) →
   Fade-to-black-Overlay (0,8 s), `this.dayNight.time = 0.02` (Morgen), Zeit-Sync an
   Logic-Worker senden (Message `t:'time'` existiert bereits, Game.ts nutzt sie beim Start),
   Spawnpunkt auf Bett-Position setzen (`respawn()` liest ihn). Tags: Toast „Du kannst nur
   nachts schlafen."; Hostiles im Umkreis 8 → Toast „Es sind Monster in der Nähe!".
3. Dorfhäuser: je 1 Bett stampen (`gen.worker.ts`-Blueprint-Zeichen `'b'`).
**Abnahme:** neuer `scripts/bed-test.mjs` prüft Rezept + Zeit-Sprung-Logik als Unit;
manuell: schlafen → Morgen, Respawn am Bett.

### P3-2 · Welt-Speicherung (IndexedDB) (L)
**Neu:** `src/engine/persistence.ts`; Änderungen in `Game.ts`, `src/state/store.ts`, Titel-Screen.
Pragmatische v1 (bewusst ohne Container-/Mob-Zustand):
1. Edit-Journal: jede Blockänderung des Spielers/Logic-Workers auf dem Main-Thread
   (`world.setBlock`-Pfad in Game.ts + Block-Update-Messages) als `(x,y,z,id)` in eine
   `Map<chunkKey, Map<blockIndex, id>>` schreiben.
2. Alle 10 s + bei `visibilitychange/pagehide`: Journal + Spielerposition + Inventar +
   `dayNight.time` + Seed nach IndexedDB (`idb`-freier Mini-Wrapper, ~60 Zeilen).
3. Titel-Screen: „Weiter spielen (Seed X)"-Button, wenn ein Save existiert; beim Laden Seed
   generieren lassen und Journal nach jedem `handleGen` auf den Chunk anwenden (vor dem Meshing).
4. „Neue Welt" löscht das Save nach Bestätigung.
**Abnahme:** `scripts/persistence-test.mjs`: Journal anwenden = deterministisch; manuell:
Block bauen → Reload → Block ist da, Inventar/Position erhalten.

### P3-3 · Sound-Engine, prozedural (M/L)
**Neu:** `src/engine/Sound.ts` (WebAudio, KEINE externen Assets — Projektregel):
Rausch-/Oszillator-Synthese für: Schritte (materialabhängig gefiltertes Noise-Burst),
Block brechen/setzen, Schaden, Essen, Explosion (Brown-Noise + Lowpass-Sweep), Bogen,
Wasser-Platschen, Tag-Vögel/Nacht-Grillen-Ambient (leise Loops), UI-Klick.
Lautstärke-Slider (Master/Ambient) im PauseScreen. AudioContext erst nach erster
User-Geste starten (Browser-Policy).
**Abnahme:** Smoke-Test bleibt grün (Audio darf headless nicht crashen — try/catch um
AudioContext); manuell hörbar.

### P3-4 · Hunger-System (M)
`PLAYER_MAX_FOOD = 20`; Drumstick-Leiste im HUD (eigenes Pip-Design analog P2-2).
Drain: Sprint/Springen/Graben erhöhen Erschöpfung → Food sinkt; Regen (Game.ts:470) nur
bei Food ≥ 18 aktiv (dafür schneller, 1 HP/2 s); Food = 0 → Verhungern-Schaden bis 1 HP.
Essen (bestehende `eatCooldown`-Mechanik) füllt Food statt direkt HP.
**Abnahme:** Unit-Test für Drain/Regen-Schwellen; manuell: Sprinten leert Leiste, Essen füllt.

### P3-5 · Mehr Tiere: Kuh, Schwein, Huhn + einfache Zucht (L)
`entities.ts` + `logic.worker.ts` (Spawn-Gewichte, Drops: Leder/Rindfleisch, Kotelett,
Feder/Ei), `EntityRenderer.ts`-Modelle (Quadruped-Basis von Sheep wiederverwenden).
Zucht v1: zwei gleiche Tiere mit Weizen füttern → Baby (Skalierung 0,5, wächst in 5 min).
**Abnahme:** `scripts/mob-test.mjs` erweitern (neue Typen spawnen tags auf Gras).

### P3-6 · Rüstung (M)
4 Rüstungs-Slots im Inventar-Screen, Leder-/Eisen-/Diamant-Sets (Rezepte),
Schadensreduktion im Logic-Worker-Damage-Pfad (`t:'attack'`/Hazards): `dmg * (1 - armor*0.04)`,
Rüstungs-Pips über der Herzleiste. Icons prozedural in `TextureAtlas.ts`.
**Abnahme:** Unit-Test Reduktionsformel; manuell: Zombie-Hit mit/ohne Rüstung vergleichen.

### P3-7 · Wetter (M)
Regen-/Schnee-Partikelvorhang um die Kamera (instanziert, ~800 Quads), Himmel/`sunLevel`
gedämpft, Regen nur in warmen Biomen / Schnee in kalten; Zyklus per Seed-PRNG (10–20 min).
**Abnahme:** visuell + kein FPS-Einbruch < 55 im Smoke-Test.

### P3-8 · XP & einfache Verzauberung (L)
XP-Orbs (Kill/Erz-Abbau) → Balken + Level; Verzauberungstisch-Block: gegen Level
Werkzeug-Upgrades (Effizienz/Haltbarkeit/Schärfe als flache Multiplikatoren auf `tool`).
**Abnahme:** Unit-Tests für XP-Kurve + Multiplikatoren.

---

## Phase 4 — Groß / optional (nach allem oben)
- **Redstone-lite** (Hebel, Druckplatte, Redstone-Leitung, Tür/Falltür, Kolben) — XL.
- **Nether-Dimension** (Portal, eigenes Gen-Preset, 2 Mobs) — XL.
- **Multiplayer** — strukturell nicht vorgesehen (4-Thread-Worker-Topologie, kein Netcode);
  nur mit eigener Server-Architektur sinnvoll. Bewusst NICHT eingeplant.

---

## Phase 5 — Grafik-Generalüberholung („FableBlock-Look")

Ziel: ALLE Grafiken überarbeiten, sodass FableBlock einen eigenen, konsistenten Stil hat —
weiterhin 100 % prozedural (Projektregel: keine externen Assets). Ein Paket = ein Commit.
Vor Phase 5 zuerst P2-2 (GUI-Theme) abschließen, damit die Stilrichtung feststeht.

**Stil-Leitplanken (für alle Pakete verbindlich):**
- 16×16-Pixel-Tiles behalten, aber je Material eine 3–4-stufige eigene Palette
  (Basis / Schatten / Licht / Akzent) statt Zufallsrauschen über einer Farbe.
- Erkennbare Silhouetten & Muster, die NICHT Mojang-Texturen nachzeichnen
  (z. B. Diamant-Erz als facettierte Rauten-Cluster statt MC-Punktmuster).
- Einheitliche Lichtrichtung in allen Tiles (oben-links), einheitliche Sättigung.
- Jede Änderung per Vorher/Nachher-Screenshot dokumentieren (scripts/smoke.mjs macht Screenshots).

### P5-1 · TilePainter-Werkzeugkasten erweitern (S)
`src/engine/TextureAtlas.ts`: Hilfsfunktionen ergänzen — `shade(x,y,w,h,amt)` (relatives
Abdunkeln/Aufhellen statt Festfarbe), `dither(x,y,w,h,c1,c2)` (2×2-Checker),
`bevel(x,y,w,h)` (1-px-Licht/Schattenkante), `palette(name)` (zentrale Material-Paletten).
Basis für alle folgenden Pakete. **Abnahme:** tsc/tests grün, Atlas-Dump-Screenshot.

### P5-2 · Terrain-Blöcke: Erde/Gras/Stein/Sand/Kies (M)
Neue Painter für DIRT, GRASS (Top/Side), STONE, COBBLE, SAND, GRAVEL, SNOW, CLAY:
Gras mit gezacktem Übergang + Grashalm-Pixeln, Stein mit Bruchkanten-Clustern,
Sand mit Wellen-Dithering. **Abnahme:** Screenshot einer Hügellandschaft — keine sichtbare
Kachel-Wiederholung auf 8×8 Blöcken (Painter darf Koordinaten-Hash für Varianz nutzen,
siehe cellNoise).

### P5-3 · Holz & Pflanzen (M)
OAK/BIRCH (Log-Seiten mit Rinden-Riefen, Ring-Top), PLANKS (Brettfugen + Astlöcher),
LEAVES (dichteres Blattmuster, 2 Grüntöne + Löcher), Setzling, Blumen, Gras-Cross,
Zuckerrohr. **Abnahme:** Wald-Screenshot Tag + Nacht.

### P5-4 · Erze & Wertblöcke (S)
COAL/IRON/GOLD/DIAMOND-Erz: je eigene Kristall-/Ader-Signatur (Facetten, Nuggets,
Adern) + Erz-Blöcke (IRON_BLOCK usw.), GLOWSTONE (leuchtende Zellstruktur),
OBSIDIAN (violette Splitter). **Abnahme:** Mine-Screenshot mit allen Erzen nebeneinander
(Creative-Platzierung im Test-Save oder gestampfte Testwand über scripts).

### P5-5 · Funktionsblöcke (M)
CHEST (Bänder + Schloss neu), FURNACE (bereits poliert — nur Palette angleichen), TNT,
BOOKSHELF, SPAWNER (Gitter mit Innenglut), TORCH (klareres Kopf-Glühen), Türen/Glas
(eigenes Rahmen-Muster). **Abnahme:** Screenshot Dorf-Interieur.

### P5-6 · Item-Icons komplett (M)
Alle Werkzeug-/Waffen-Icons (Stiel-Winkel, Materialglanz je Tier), Essen, Eimer, Boot —
einheitlicher 1-px-Dunkel-Outline-Stil (lesbar auf hellem UND dunklem Slot-Hintergrund).
**Abnahme:** Inventar-Screenshot mit allen Items; jedes Icon auf 44 px klar erkennbar.

### P5-7 · Himmel & Atmosphäre (L)
`src/engine/DayNight.ts` + neues `src/engine/Sky.ts`: sichtbare Sonne/Mond als texturierte
Sprites (statt nur Licht), Sternenfeld nachts (Instanced Points, seeded), 2–3 driftende
prozedurale Wolkenebenen (Perlin-Alpha-Quads ~y=128), Horizont-Gradient (Skydome statt
Flat-Color). **Abnahme:** Screenshots Dämmerung/Mitternacht/Mittag; FPS-Verlust < 3.

### P5-8 · Wasser & Effekte (M)
Wasser: animierte Normal-Wellen im Shader (uTime-basiertes UV-Warping verfeinern),
Ufer-Schaumkante (Fresnel-Aufhellung flacher Blickwinkel); Partikel: Blasen unter Wasser,
Blatt-Partikel im Wald, Feuerfunken; Treffer-Marker beim Schlagen von Mobs.
**Abnahme:** See-Screenshot + Unterwasser-Screenshot.

### P5-9 · Mob-Texturen statt Flat-Color (L)
`EntityRenderer.ts`: `partBox` um optionale prozedurale Canvas-Texturen je Körperteil
erweitern (analog faceTexture) — Zombie-Fetzen, Skelett-Rippen, Schaf-Wollstruktur,
Creeper-Tarnmuster, Villager-Robe mit Gürtel, Golem-Ranken. Baut auf P2-1 auf.
**Abnahme:** Mob-Lineup-Screenshot (alle Typen nebeneinander, Tag).

### P5-10 · HUD-/GUI-Grafiken finalisieren (S)
Eigene Pip-Grafiken (HP/Hunger/Rüstung) im FableBlock-Stil, Crosshair-Varianten
(Standard/Interagierbar), Break-Ring durch Pixel-Riss-Overlay auf dem Block ersetzen
(crackGeos-Texturen neu zeichnen), Titel-Screen mit animiertem Voxel-Panorama-Hintergrund
(langsame Kamerafahrt über Beispiel-Seed). **Abnahme:** Titel- + HUD-Screenshot.

## Merkregeln für jeden Agent-Lauf
1. Vor dem Commit: `npx tsc --noEmit && npm test && npm run build && node scripts/smoke.mjs`.
2. Kein Paket anfangen, solange ein P0 offen ist.
3. Neue Systeme bekommen einen `scripts/*-test.mjs`-Harness (Muster: boat/village-Tests).
4. Push auf `claude/hopeful-faraday-ufz6i6` deployt automatisch auf GitHub Pages.
