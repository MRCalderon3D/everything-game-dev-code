# Placeholder Drop-In Replacement Checklist — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Owner:** technical-artist / 2d-artist
- **Contributors:** gameplay-programmer, performance-reviewer
- **Version:** 0.1
- **Status:** Draft
- **Last Updated:** 2026-03-31
- **Related Docs:** `design/SPRITE-PIPELINE.md`, `design/MEMORY-BUDGET.md` (§4), `design/GDD.md` (§5.2, §6, §9)
- **Skill:** `skills/art-audio-content/placeholder-asset-pipeline/SKILL.md`

---

## How To Use This Checklist

1. **For each row:** create the final asset at the exact file path shown in the "Required File" column.
2. **Delete** the old placeholder file listed in "Current File" (do not rename it).
3. **Update prefab references** — any prefab that referenced the old GUID must be re-linked to the new sprite.
4. **Validate** import settings match SPRITE-PIPELINE.md §4 (16 PPU, Point filter, no compression, mips off).
5. **Run the game** — confirm no missing references, no visual offset, colliders still correct.

Zero code changes should be required. If a swap requires a code change, flag it as a pipeline bug.

---

## 1. Existing Sprite Placeholders

These files exist today and must be replaced with final art.

### PH-01 — Player Character

| Field | Value |
|---|---|
| **Current File** | `Assets/Art/Sprites/Player/Player.png` |
| **Current Dimensions** | 32x64 px |
| **Current PPU** | 32 |
| **Current Pivot** | Center (0.5, 0.5) |
| **GUID** | `6672b6e0c29e1684784f885110328b11` |
| **Referenced By** | `Prefabs/Player/Player.prefab` (SpriteRenderer) |
| | |
| **Required File** | `Assets/Art/Sprites/Player/player-default-idle.png` |
| **Required Dimensions** | 16x32 px |
| **Required PPU** | 16 |
| **Required Pivot** | Bottom-center (0.5, 0) |
| **Atlas** | `Atlas_Player` |
| **Notes** | Pivot change from center to bottom-center — feet must align with ground plane. Player.prefab's BoxCollider2D offset may need adjustment after pivot change. Verify collider still covers full character height. |

### PH-02 — Hazard (Block Obstacle)

| Field | Value |
|---|---|
| **Current File** | `Assets/Art/Sprites/Obstacles/Hazard.png` |
| **Current Dimensions** | 32x64 px |
| **Current PPU** | 32 |
| **Current Pivot** | Center (0.5, 0.5) |
| **GUID** | `8cff435f7a4d03245a01b7f254b47ff6` |
| **Referenced By** | `Prefabs/Chunks/ChunkDense.prefab` (2 children: Hazard_L0, Hazard_L2) |
| | `Prefabs/Chunks/ChunkDense2.prefab` |
| | `Prefabs/Chunks/ChunkSparse.prefab` |
| | `Prefabs/Chunks/ChunkSparse2.prefab` |
| | |
| **Required File** | `Assets/Art/Sprites/Obstacles/hazard-block-idle.png` |
| **Required Dimensions** | 16x32 px |
| **Required PPU** | 16 |
| **Required Pivot** | Bottom-center (0.5, 0) |
| **Atlas** | `Atlas_Obstacles` |
| **Notes** | Pivot change from center to bottom-center. Used across 4 chunk prefabs — all must be re-linked. After replacement, run SpawnManager safety-pass test to confirm no layout regression. |

### PH-03 — Coin (Meta Currency)

| Field | Value |
|---|---|
| **Current File** | `Assets/Art/Sprites/Collectibles/Coin.png` |
| **Current Dimensions** | 16x16 px |
| **Current PPU** | 32 |
| **Current Pivot** | Center (0.5, 0.5) |
| **GUID** | `fde4b7222aeec2a498227a319f64040b` |
| **Referenced By** | `Prefabs/Chunks/ChunkDense.prefab` (child: Coin_L1) |
| | `Prefabs/Chunks/ChunkDense2.prefab` |
| | `Prefabs/Chunks/ChunkSparse.prefab` |
| | `Prefabs/Chunks/ChunkSparse2.prefab` |
| | `Prefabs/Chunks/ChunkSafe.prefab` (children: Coin_L0, Coin_L1, Coin_L2) |
| | |
| **Required File** | `Assets/Art/Sprites/Collectibles/coin-default-idle.png` |
| **Required Dimensions** | 16x16 px |
| **Required PPU** | 16 |
| **Required Pivot** | Center (0.5, 0.5) |
| **Atlas** | `Atlas_Collectibles` |
| **Notes** | Dimensions stay the same. PPU changes from 32 to 16 — sprite will render at 2x its current world size (from 0.5x0.5 units to 1x1 units). Chunk child positions may need halving to compensate if the coin is now visually too large. Verify in-game after swap. Currently also used for Dash/Shield/Surge collectible children in chunks — see PH-04 through PH-06 below. |

---

## 2. Missing Sprite Placeholders

These entities exist in the GDD and are needed for M4 but have **no placeholder sprite yet**. Currently they reuse `Coin.png` or have no visual.

### PH-04 — Collectible: Dash

| Field | Value |
|---|---|
| **Current File** | None — chunks use `Coin.png` for all collectible types |
| **Current Visual** | Yellow circle (Coin.png), differentiated only by `Collectible.Type = Dash` in code |
| | |
| **Required File** | `Assets/Art/Sprites/Collectibles/collectible-dash-idle.png` |
| **Required Dimensions** | 16x16 px |
| **Required PPU** | 16 |
| **Required Pivot** | Center (0.5, 0.5) |
| **Atlas** | `Atlas_Collectibles` |
| **Notes** | Must have a unique silhouette distinct from Shield, Surge, and Coin (GDD §7.3 — shape AND colour). Colour: blue/cyan per GDD §5.2. Chunk prefab children with `Collectible.Type = Dash` must reference this sprite instead of Coin.png. |

### PH-05 — Collectible: Shield

| Field | Value |
|---|---|
| **Current File** | None — chunks use `Coin.png` |
| **Current Visual** | Yellow circle (Coin.png), differentiated only by `Collectible.Type = Shield` |
| | |
| **Required File** | `Assets/Art/Sprites/Collectibles/collectible-shield-idle.png` |
| **Required Dimensions** | 16x16 px |
| **Required PPU** | 16 |
| **Required Pivot** | Center (0.5, 0.5) |
| **Atlas** | `Atlas_Collectibles` |
| **Notes** | Unique silhouette. Colour: gold per GDD §5.2. Shield shape recommended for instant readability. |

### PH-06 — Collectible: Surge

| Field | Value |
|---|---|
| **Current File** | None — chunks use `Coin.png` |
| **Current Visual** | Yellow circle (Coin.png), differentiated only by `Collectible.Type = Surge` |
| | |
| **Required File** | `Assets/Art/Sprites/Collectibles/collectible-surge-idle.png` |
| **Required Dimensions** | 16x16 px |
| **Required PPU** | 16 |
| **Required Pivot** | Center (0.5, 0.5) |
| **Atlas** | `Atlas_Collectibles` |
| **Notes** | Unique silhouette. Colour: red per GDD §5.2. Lightning/arrow shape recommended for speed association. |

### PH-07 — Ground Tile (Biome 1)

| Field | Value |
|---|---|
| **Current File** | None — no ground visual exists; scene has no ground plane sprites |
| | |
| **Required File** | `Assets/Art/Sprites/Environment/ground-coastal-idle.png` |
| **Required Dimensions** | 16x16 px |
| **Required PPU** | 16 |
| **Required Pivot** | Bottom-left (0, 0) |
| **Atlas** | `Atlas_Environment` |
| **Notes** | Tileable horizontally. Must tile seamlessly when repeated. Biome 1 is "Coastal Highway" per ART-BIBLE.md §4.4. Road surface with lane markings. Needs a new GameObject or Tilemap in the scene to display. |

### PH-08 — Background Layer: Far (Biome 1)

| Field | Value |
|---|---|
| **Current File** | None — no background visual exists |
| | |
| **Required File** | `Assets/Art/Sprites/Background/bg-coastal-far.png` |
| **Required Dimensions** | 320x180 px |
| **Required PPU** | 16 |
| **Required Pivot** | Bottom-left (0, 0) |
| **Atlas** | `Atlas_Background` |
| **Notes** | Farthest parallax layer — slowest scroll rate. Coastal Highway biome: ocean horizon, distant sky gradient. Needs a parallax scroll script and scene GameObject. Tileable horizontally or wide enough to never reveal edges during a run. |

### PH-09 — Background Layer: Mid (Biome 1)

| Field | Value |
|---|---|
| **Current File** | None |
| | |
| **Required File** | `Assets/Art/Sprites/Background/bg-coastal-mid.png` |
| **Required Dimensions** | 320x180 px |
| **Required PPU** | 16 |
| **Required Pivot** | Bottom-left (0, 0) |
| **Atlas** | `Atlas_Background` |
| **Notes** | Middle parallax layer — medium scroll rate. Coastal Highway biome: palm trees, roadside scenery. Same tiling requirement as PH-08. |

### PH-10 — Background Layer: Near (Biome 1)

| Field | Value |
|---|---|
| **Current File** | None |
| | |
| **Required File** | `Assets/Art/Sprites/Background/bg-coastal-near.png` |
| **Required Dimensions** | 320x180 px |
| **Required PPU** | 16 |
| **Required Pivot** | Bottom-left (0, 0) |
| **Atlas** | `Atlas_Background` |
| **Notes** | Nearest parallax layer — fastest scroll rate. Coastal Highway biome: guardrails, sand shoulder. Must not obscure gameplay lane area. |

### PH-11 — Modifier Icon: Dash (Near Character)

| Field | Value |
|---|---|
| **Current File** | None — `ModifierLabel` uses TextMeshPro text ("SPARSE") with no icon |
| | |
| **Required File** | `Assets/Art/Sprites/Player/modifier-dash-idle.png` |
| **Required Dimensions** | 16x16 px |
| **Required PPU** | 16 |
| **Required Pivot** | Center (0.5, 0.5) |
| **Atlas** | `Atlas_Player` |
| **Notes** | Small icon displayed near the character when Dash modifier is active (GDD §9.4: "pulsing outline on character model"). May need `ModifierLabel.cs` update to show icon instead of/alongside text. |

### PH-12 — Modifier Icon: Shield (Near Character)

| Field | Value |
|---|---|
| **Current File** | None |
| | |
| **Required File** | `Assets/Art/Sprites/Player/modifier-shield-idle.png` |
| **Required Dimensions** | 16x16 px |
| **Required PPU** | 16 |
| **Required Pivot** | Center (0.5, 0.5) |
| **Atlas** | `Atlas_Player` |
| **Notes** | Shield modifier icon. Same display rules as PH-11. |

### PH-13 — Modifier Icon: Surge (Near Character)

| Field | Value |
|---|---|
| **Current File** | None |
| | |
| **Required File** | `Assets/Art/Sprites/Player/modifier-surge-idle.png` |
| **Required Dimensions** | 16x16 px |
| **Required PPU** | 16 |
| **Required Pivot** | Center (0.5, 0.5) |
| **Atlas** | `Atlas_Player` |
| **Notes** | Surge modifier icon. Same display rules as PH-11. |

---

## 3. Existing Audio Placeholders

Audio stubs exist from M2. These are referenced by `AudioManager.cs`. Replacement follows the same drop-in principle.

### PH-A1 — Background Music

| Field | Value |
|---|---|
| **Current File** | `Assets/Audio/Music/BGM.wav` |
| **Required File** | `Assets/Audio/Music/BGM.wav` (same name, replace in-place) |
| **Notes** | Looping adaptive track per GDD §8.2. Must stream (not load into memory) per MEMORY-BUDGET §5. Keep file name or update `AudioManager` serialized reference. |

### PH-A2 — Collect SFX

| Field | Value |
|---|---|
| **Current File** | `Assets/Audio/SFX/Collect.wav` |
| **Required File** | `Assets/Audio/SFX/Collect.wav` (same name; consider splitting per type for M5) |
| **Notes** | GDD §8.2 specifies distinct audio signature per collectible type. For M4: single SFX acceptable. For M5: split into `collect-dash.wav`, `collect-shield.wav`, `collect-surge.wav`, `collect-coin.wav`. |

### PH-A3 — Dash SFX

| Field | Value |
|---|---|
| **Current File** | `Assets/Audio/SFX/Dash.wav` |
| **Required File** | `Assets/Audio/SFX/Dash.wav` (same name, replace in-place) |
| **Notes** | GDD §5.1: "Dash has a visual snap and audio click." |

### PH-A4 — Game Over SFX

| Field | Value |
|---|---|
| **Current File** | `Assets/Audio/SFX/GameOver.wav` |
| **Required File** | `Assets/Audio/SFX/GameOver.wav` (same name, replace in-place) |
| **Notes** | GDD §8.2: "brief, non-punishing audio cue — not a failure fanfare." |

### PH-A5 — Chain Complete SFX (Missing)

| Field | Value |
|---|---|
| **Current File** | None — `ChainFlash` has no SFX clip assigned (M3 status: "SFX clip not yet assigned") |
| **Required File** | `Assets/Audio/SFX/ChainComplete.wav` |
| **Notes** | GDD §8.2: "satisfying resolution sound" on chain completion. Must be wired to `ChainFlash` or `ModifierSystem` event. This is an M3 carry-over gap. |

### PH-A6 — Modifier Expiry Warning SFX (Missing)

| Field | Value |
|---|---|
| **Current File** | None |
| **Required File** | `Assets/Audio/SFX/ModifierExpiry.wav` |
| **Notes** | GDD §5.3: "Modifier expiry warned with audio cue 2 seconds before." Not yet implemented. Needs code hook in `ModifierSystem`. |

---

## 4. UI Placeholders

UI elements in `Game.unity` currently have `m_Sprite: {fileID: 0}` (no sprite assigned). These are functional but visually empty.

### PH-U1 — Chain Counter Dots (x3)

| Field | Value |
|---|---|
| **Current Visual** | Unity UI `Image` components with flat colour fill, no sprite |
| **Script** | `ChainCounterDisplay.cs` — drives `_dot0`, `_dot1`, `_dot2` |
| **Required File** | `Assets/Art/Sprites/Player/chain-dot-default-idle.png` |
| **Required Dimensions** | 8x8 px (or 16x16 with padding) |
| **Required PPU** | 16 |
| **Notes** | Optional — current flat-colour dots work and passed P7 in playtest. Replace only if art bible defines a styled dot. If replaced, assign to all 3 Image components in the HUD prefab. |

### PH-U2 — HUD Elements (Distance, Score)

| Field | Value |
|---|---|
| **Current Visual** | TextMeshPro text only, no background panel or icon |
| **Required Files** | None required for M4 — text-only HUD is acceptable per GDD §7.2 |
| **Notes** | HUD polish is an M4 deliverable. If styled panels are added, create `Assets/Art/Sprites/UI/hud-panel-default-idle.png` and add to `Atlas_UI`. |

---

## 5. Summary Matrix

| ID | Entity | Exists? | Current Size | Required Size | PPU Change | Pivot Change | Prefab Relink |
|---|---|---|---|---|---|---|---|
| PH-01 | Player | Yes | 32x64 | 16x32 | 32→16 | Center→Bottom | Player.prefab |
| PH-02 | Hazard | Yes | 32x64 | 16x32 | 32→16 | Center→Bottom | 4 chunk prefabs |
| PH-03 | Coin | Yes | 16x16 | 16x16 | 32→16 | No change | 5 chunk prefabs |
| PH-04 | Dash collectible | **No** | — | 16x16 | — | Center | Chunk children |
| PH-05 | Shield collectible | **No** | — | 16x16 | — | Center | Chunk children |
| PH-06 | Surge collectible | **No** | — | 16x16 | — | Center | Chunk children |
| PH-07 | Ground tile | **No** | — | 16x16 | — | Bottom-left | New scene object |
| PH-08 | BG far | **No** | — | 320x180 | — | Bottom-left | New scene object |
| PH-09 | BG mid | **No** | — | 320x180 | — | Bottom-left | New scene object |
| PH-10 | BG near | **No** | — | 320x180 | — | Bottom-left | New scene object |
| PH-11 | Modifier icon: Dash | **No** | — | 16x16 | — | Center | ModifierLabel |
| PH-12 | Modifier icon: Shield | **No** | — | 16x16 | — | Center | ModifierLabel |
| PH-13 | Modifier icon: Surge | **No** | — | 16x16 | — | Center | ModifierLabel |
| PH-A1 | BGM | Yes | — | — | — | — | In-place |
| PH-A2 | Collect SFX | Yes | — | — | — | — | In-place |
| PH-A3 | Dash SFX | Yes | — | — | — | — | In-place |
| PH-A4 | Game Over SFX | Yes | — | — | — | — | In-place |
| PH-A5 | Chain Complete SFX | **No** | — | — | — | — | New wire |
| PH-A6 | Modifier Expiry SFX | **No** | — | — | — | — | New wire + code |
| PH-U1 | Chain dots | Optional | 0x0 | 8x8 or 16x16 | — | — | HUD Image refs |

---

## 6. Replacement Validation Steps

After each replacement batch, run this validation sequence:

1. **No missing references:** Open `Game.unity` in editor — console must show zero `MissingReferenceException` or `null sprite` warnings.
2. **Visual check:** Enter play mode — every entity is visible, correctly sized, and in the right lane position.
3. **Collider check:** Player, hazards, and collectibles trigger correctly — play a full run to death.
4. **PPU consistency:** Select all sprites in `Assets/Art/Sprites/` — inspector must show PPU = 16 for every file.
5. **Pivot alignment:** Player and obstacles rest on the ground plane (no floating, no sinking).
6. **Atlas fit:** Open Sprite Atlas inspector — no atlas exceeds its working size (SPRITE-PIPELINE.md §5.1).
7. **Test suite:** Run `DashAndCollect.Tests.Runtime` — all tests pass. (Tests reference types and behaviour, not sprites, so they should pass regardless.)
8. **Performance spot check:** Profiler quick run — frame time and draw calls within budget.

---

## 7. Change Log

| Date | Change | Owner | Rationale |
|---|---|---|---|
| 2026-03-31 | v0.1 created | technical-artist | Initial placeholder inventory and replacement checklist for M4 art production |
