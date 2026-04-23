# Chapter 5 — 2D Art Assets

**Goal:** Generate final 2D sprites and animations via Claude-authored Editor scripts, replacing the placeholders from Chapter 4, and validate the full art pipeline with `/art-2d-pass`.

**Context:** `contexts/production.md` (continued)

> **Start a new Claude Code session for this chapter.**
> Although this chapter shares the production context with Chapters 3–4, a fresh session
> keeps the art-focused work isolated from the systems implementation that came before.
>
> **Codex note:** the same chapter works in Codex. Replace "Claude" with "Codex" in the prompts below. When you want raster source art, concept sheets, painted backgrounds, or bitmap edits instead of purely code-drawn assets, use `$imagegen` and then move the accepted output into the project workspace using the naming and paths defined by the sprite and placeholder pipelines.

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/production.md` | Keeps `2d-artist` and `technical-artist` as active agents |
| `commands/` | `/art-2d-pass` | Review all 2D art assets against pipeline conventions |
| `commands/` | `/unity-placeholders` | Reference for placeholder naming and paths |
| `commands/` | `/perf-budget` | Validate atlas size and animation memory against budgets |
| `agents/` | `2d-artist`, `technical-artist`, `performance-reviewer` | Art pipeline agents |
| `skills/` | `skills/art-audio-content/sprite-pipeline/SKILL.md` | Sprite import, slicing, atlas packing rules |
| `skills/` | `skills/art-audio-content/tilemap-pipeline/SKILL.md` | Tileset and tilemap configuration |
| `skills/` | `skills/art-audio-content/2d-animation-pipeline/SKILL.md` | Frame-by-frame and skeletal 2D animation rules |
| `skills/` | `skills/art-audio-content/placeholder-asset-pipeline/SKILL.md` | Drop-in replacement validation |
| `skills/` | `skills/art-audio-content/art-bible/SKILL.md` | Visual direction enforcement |
| `rules/` | `rules/common/coding-style.md` | Naming conventions |
| `rules/` | `rules/unity/assets-import.md` | Unity import settings |
| `hooks/` | `asset-size-warning` | Fires when texture assets exceed size budget |

---

## Steps

### 1. Load the production context

In your new Claude Code session, tell Claude to read and apply the production context:

```
Read contexts/production.md and apply it to this session. Also read the art bible — it is likely at design/ART-BIBLE.md or a similar path in your project — and use it as the visual reference for all art work in this chapter.
```

This activates `2d-artist` and `technical-artist` as the lead agents for this phase.

---

## Pre-requisite: Art Bible

Before replacing any placeholders, you need an Art Bible that defines the visual direction.
If you do not have one yet, create a minimal one:

```
/plan Create a minimal Art Bible for "Dash & Collect" using docs/templates/art-bible.md. Save the output to design/ART-BIBLE.md. Style: pixel art, 16x16 base tile size, limited palette (8-12 colors). Entities: player (16x32), obstacle (16x32), coin (16x16), ground tiles (16x16), background (parallax, 320x180).
```

**Art Bible excerpt:**

```
## Visual Identity
Pixel art, clean silhouettes, limited palette. Readability over detail.

## Palette
| Role        | Color    | Hex     |
|-------------|----------|---------|
| Player      | Blue     | #3B82F6 |
| Obstacle    | Red      | #EF4444 |
| Coin        | Yellow   | #EAB308 |
| Ground      | Brown    | #78716C |
| Sky         | Dark     | #1E293B |
| Accent      | White    | #F8FAFC |

## Asset Specifications
| Entity      | Size (px) | Game Units | Format |
|-------------|-----------|------------|--------|
| Player      | 16x32    | 1x2        | PNG    |
| Obstacle    | 16x32    | 1x2        | PNG    |
| Coin        | 16x16    | 0.5x0.5    | PNG    |
| Ground tile | 16x16    | 1x1        | PNG    |
| Background  | 320x180  | 20x12      | PNG    |

## Pixels Per Unit
16 PPU for all gameplay sprites. Background uses native resolution.
```

---

## Codex Option: Generate Raster Source Art with `$imagegen`

If you are using Codex and want source PNGs rather than only `Texture2D.SetPixel` output,
you can use `$imagegen` after the Art Bible exists. This works especially well for concept
sheets, painted/parallax backgrounds, UI-adjacent promo images, or higher-fidelity source art
that will still follow the placeholder replacement path.

Example Codex prompt:

```
$imagegen Create a pixel-art concept sheet for "Dash & Collect" using the Art Bible at design/ART-BIBLE.md as source of truth.
- Asset set: player 16x32, obstacle 16x32, coin 16x16, ground tile 16x16, background sample 320x180
- Style: clean silhouettes, limited palette, readability over detail
- Keep transparent backgrounds for the individual gameplay assets
- Keep each asset visually compatible with the placeholder names and paths from Chapter 4
- No text, no watermark, no mockup framing
```

After approving a result, import or copy the selected PNGs into `Assets/_Project/Art/Sprites/[Category]/`
using the same names and paths that the placeholder pipeline expects.

---

## Step 1: Define the sprite pipeline

Ask Claude to establish the sprite conventions for your project:

```
Using skills/art-audio-content/sprite-pipeline/SKILL.md, define the sprite pipeline for "Dash & Collect":
- Naming convention: [entity]-[variant]-[state].png (e.g. player-default-idle.png)
- Folder structure: Assets/_Project/Art/Sprites/[Category]/
- Categories: Player, Obstacles, Collectibles, Environment, Background
- Import settings: 16 PPU, Point filter, no compression, Sprite mode Single
- Atlas groups: one atlas per category, max 1024x1024
```

**Expected output:** a sprite pipeline document that any contributor can follow to add new sprites without asking questions.

---

## Step 2: Generate final sprites via Editor script

Claude generates the actual sprite assets programmatically — the same approach used for
placeholders in Chapter 4, but now producing pixel art sprites that follow the Art Bible.
Claude writes a Unity Editor script that uses `Texture2D.SetPixel` to draw each sprite
pixel by pixel, saves them as PNG files, and configures their import settings automatically.

Ask Claude to generate the sprite assets:

```
Using skills/art-audio-content/sprite-pipeline/SKILL.md and skills/art-audio-content/placeholder-asset-pipeline/SKILL.md, generate a Unity Editor script that creates final pixel art sprites for "Dash & Collect" following the Art Bible palette and sizes. The script must:

1. Replace all placeholder sprites created in Chapter 4 — same file paths, same names
2. Draw pixel art using Texture2D.SetPixel with the Art Bible palette:
   - Player (16x32): blue character silhouette with white accent details
   - Obstacle (16x32): red spike/crate with darker red shading
   - Coin (16x16): yellow circle with inner highlight
   - Ground tile (16x16): brown tile with surface detail, tileable horizontally
   - Background (320x180): dark sky gradient with subtle star dots
3. Save each sprite as PNG to its Art Bible path in Assets/_Project/Art/Sprites/[Category]/
4. Apply import settings: 16 PPU, Point filter, no compression, correct pivot per entity
5. Update existing prefab sprite references to point to the new assets

Place the script at Assets/_Project/Editor/SpriteAssetGenerator.cs with a menu item at Tools → Generate Sprites.
```

Codex alternative for source PNGs:

```
$imagegen Create final source sprites for "Dash & Collect" from the Art Bible.
Use case: stylized-concept
Asset type: Unity gameplay sprites imported as PNG
Primary request: generate clean pixel-art source images for player, obstacle, coin, ground tile, and background
Scene/backdrop: transparent background for gameplay sprites; separate dark sky scene for the background image
Style/medium: readable pixel art, limited palette, crisp silhouettes
Composition/framing: one asset per output, centered, no mockup framing
Constraints: keep exact gameplay sizes and placeholder replacement compatibility; no text; no watermark
```

Run the generated script in Unity via **Tools → Generate Sprites**. Verify all sprites
appear in the Project window and prefabs display the new art, then delete the script.

**What Claude generates:** simple but recognizable pixel art — enough to make the game
visually readable and distinct from the colored-rectangle placeholders. These are not
placeholder shapes; they are styled sprites drawn pixel by pixel following the Art Bible.

> If you want to replace Claude's generated sprites with hand-drawn art later, you can —
> the drop-in replacement path from the placeholder pipeline still works. The file names
> and paths are the same, so swapping a PNG is all it takes.

---

## Step 3: Generate ground tileset (if applicable)

If your game uses tile-based ground (rather than a single stretched sprite), ask Claude
to generate the tileset via an Editor script using the same pixel-by-pixel approach:

```
Using skills/art-audio-content/tilemap-pipeline/SKILL.md, generate a Unity Editor script that creates a ground tileset for "Dash & Collect":
- Tile size: 16x16 pixels, brown palette from Art Bible
- Tiles to generate: top-left, top-center, top-right, fill (for endless ground strip)
- Draw each tile variant pixel by pixel with surface detail and edge transitions
- Save as a single tileset sprite sheet PNG at Art/Sprites/Environment/ground-tileset.png
- Configure Sprite Mode: Multiple, slice into 16x16 grid
- Create Tile assets and a Tile Palette via EditorScript
- Collision: BoxCollider2D on top-row tiles only
- Auto-tile: Rule Tile with horizontal strip adjacency
```

Run the script in Unity. Verify the Tile Palette appears and tiles paint correctly in the scene.

For a simple endless runner, a single ground sprite may be sufficient. Skip this step if
your ground is a single repeating sprite rather than a tilemap.

---

## Step 4: Generate sprite sheet animations

Ask Claude to generate the animation sprite sheets and configure the Animator — all via
Editor script, no manual asset creation needed:

```
Using skills/art-audio-content/2d-animation-pipeline/SKILL.md, generate a Unity Editor script that creates all animation sprite sheets and configures the Animator for "Dash & Collect":

Sprite sheets to generate (pixel by pixel, following Art Bible palette):
- Player idle: 4 frames at 16x32 (subtle breathing motion), save as player-default-idle-sheet.png
- Player run: 6 frames at 16x32 (leg cycle), save as player-default-run-sheet.png
- Player jump: 2 frames at 16x32 (crouch + airborne), save as player-default-jump-sheet.png
- Player death: 4 frames at 16x32 (tumble), save as player-default-death-sheet.png
- Coin spin: 6 frames at 16x16 (rotation illusion), save as coin-gold-spin-sheet.png

All sheets saved to Art/Sprites/[Category]/ with Sprite Mode: Multiple, sliced per frame.

Animator setup:
- Create AnimatorController at Art/Animations/Player/PlayerAnimator.controller
- States: idle (8fps, loop), run (12fps, loop), jump (8fps, no loop), death (8fps, no loop)
- Parameters: isRunning (bool), isJumping (bool), isDead (trigger)
- Transitions: idle → run (isRunning=true), run → jump (isJumping=true), jump → run (isJumping=false), any → death (isDead)
- Create AnimatorController at Art/Animations/Collectibles/CoinAnimator.controller
- States: spin (10fps, loop)
- Assign controllers to Player and Coin prefabs
```

**Animation state machine:**

```
        GameStart
  idle ──────────→ run
                    │  ↑
              Jump  │  │ Land
                    ↓  │
                   jump
                    │
          GameOver  │  GameOver
          ┌─────────┘  ─────────┐
          ↓                     ↓
        death               death
```

Run the script in Unity via the menu. Verify:
- Player animates through all states in Play mode
- Coin spins in the scene
- No missing sprite references in any Animation Clip

**What Claude generates:** each frame is a variation of the base sprite with pixel
differences that create the illusion of motion — shifted limbs for run, squash for
jump, rotation steps for coin spin. Simple but functional animation.

---

## Step 5: Validate with /art-2d-pass

Run the full 2D art review:

```
/art-2d-pass Review all 2D art assets for "Dash & Collect": validate sprite naming and import settings against the sprite pipeline, check animation frame rates and state machine completeness, verify atlas packing stays within 1024x1024 per group, confirm all placeholders have been replaced.
```

The `2d-artist` agent checks:

**Sprites:**
- [ ] All sprites follow naming convention `[entity]-[variant]-[state].png`
- [ ] Import settings match pipeline: 16 PPU, Point filter, no compression
- [ ] Atlas packing per category does not exceed 1024x1024
- [ ] Pivot points are correct for gameplay (bottom-center for grounded entities, center for floating)

**Animations:**
- [ ] All animation clips use correct frame rate (8fps idle, 12fps run, etc.)
- [ ] State machine has no dead-end states — every state has an exit transition
- [ ] No missing sprite references in animation clips
- [ ] Animation memory footprint is within budget

**Placeholders:**
- [ ] Zero placeholder sprites remain in the project
- [ ] All prefab sprite references point to final assets, not placeholders
- [ ] No null sprite references in any scene or prefab

**Performance:**
- [ ] Total sprite atlas memory is within platform texture budget
- [ ] No single sprite exceeds max texture size for target platform

---

## Step 6: Performance check on art assets

Run a targeted performance check on the new art assets:

```
/perf-budget Check texture memory and atlas sizes for "Dash & Collect" against the performance budget defined in pre-production. Flag any category that exceeds its allocation.
```

The `performance-reviewer` validates that the art assets do not push the project
over the budgets established in Chapter 2.

---

## Milestone Check: Art Complete

After all art assets are in place and validated:

- [ ] All placeholder sprites replaced with final pixel art
- [ ] Sprite pipeline document created and followed
- [ ] All animations configured with correct frame rates and state machine
- [ ] `/art-2d-pass` reports zero issues
- [ ] Atlas memory within budget
- [ ] Game is visually complete and playable end to end

This is **Milestone M5**.

Before moving to the next chapter, ask Claude to validate:

```
Read the milestone plan (design/MILESTONE-PLAN.md or similar) and compare it against the art assets we have now. List any gaps — missing sprites, animations, or configurations that are not yet complete.
```

Do not proceed to Chapter 6 until all M5 criteria are met.

---

## Scaffold Features in Action (Behind the Scenes)

- Claude generates all visual assets via Unity Editor scripts (`Texture2D.SetPixel`) —
  no external art tools needed. The same drop-in replacement path works if you later swap
  Claude-generated art for hand-drawn art
- In Codex, `$imagegen` can supply approved raster source art before the import/configuration
  pass, while the same naming and replacement rules still apply
- `skills/art-audio-content/placeholder-asset-pipeline` ensures zero-friction swap —
  same paths, same names, no code changes whether replacing placeholders or upgrading art
- `skills/art-audio-content/sprite-pipeline` prevents ad-hoc import settings that cause
  visual inconsistencies or performance problems
- `hooks/asset-size-warning` fires when texture assets are added — catches oversized sprites
  before they reach version control
- The `2d-artist` agent is activated for the first time in this chapter — it was not needed
  during systems implementation (Chapters 3–4) because placeholders were sufficient

---

## What You Have After This Chapter

- Claude-generated pixel art for all game entities (replaceable with hand-drawn art at any time)
- Configured sprite pipeline with enforced conventions
- Animated player and coin with Animator Controllers and state machines
- Ground tileset (if applicable)
- All art validated against the art bible and performance budgets
- Zero manual asset creation — everything generated via Editor scripts

---

## Next

[Chapter 6 — UI Art Assets](./chapter-06-ui-art.md)
