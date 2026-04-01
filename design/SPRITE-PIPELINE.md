# Sprite Pipeline — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Owner:** technical-artist / 2d-artist
- **Contributors:** performance-reviewer, gameplay-programmer
- **Version:** 0.1
- **Status:** Draft
- **Last Updated:** 2026-03-31
- **Related Docs:** `design/GDD.md` (§9), `design/ART-BIBLE.md`, `design/MEMORY-BUDGET.md` (§4), `design/PERF-BUDGET.md`
- **Skill:** `skills/art-audio-content/sprite-pipeline/SKILL.md`

---

## 1. Naming Convention

**Pattern:** `[entity]-[variant]-[state].png`

| Token | Description | Examples |
|---|---|---|
| `entity` | The game object type, lowercase | `player`, `hazard`, `coin`, `ground`, `bg` |
| `variant` | Visual variant or biome, lowercase | `default`, `forest`, `city`, `temple`, `dense` |
| `state` | Animation or logical state, lowercase | `idle`, `dash`, `hit`, `death`, `glow` |

### Examples

| File Name | Category | Notes |
|---|---|---|
| `player-default-idle.png` | Player | Default skin, idle frame |
| `player-default-dash.png` | Player | Default skin, dash frame |
| `player-default-death.png` | Player | Default skin, death frame |
| `hazard-block-idle.png` | Obstacles | Static block obstacle |
| `hazard-moving-idle.png` | Obstacles | Moving barrier, base frame |
| `coin-default-idle.png` | Collectibles | Meta currency coin |
| `coin-default-glow.png` | Collectibles | Meta currency coin, pickup flash |
| `collectible-dash-idle.png` | Collectibles | Dash chain collectible (blue) |
| `collectible-shield-idle.png` | Collectibles | Shield chain collectible (gold) |
| `collectible-surge-idle.png` | Collectibles | Surge chain collectible (red) |
| `ground-coastal-idle.png` | Environment | Coastal Highway biome ground tile |
| `ground-citynight-idle.png` | Environment | City Night biome ground tile |
| `ground-desert-idle.png` | Environment | Desert Stretch biome ground tile |
| `bg-coastal-far.png` | Background | Coastal Highway biome, farthest parallax layer |
| `bg-coastal-mid.png` | Background | Coastal Highway biome, middle parallax layer |
| `bg-coastal-near.png` | Background | Coastal Highway biome, nearest parallax layer |

### Rules
- All lowercase, hyphens only (no underscores, no spaces, no camelCase)
- Animated sprites: append frame index before extension only for sheet exports (`player-default-dash-01.png`); single-file sprites omit the index
- Placeholder sprites use variant `placeholder` (e.g. `player-placeholder-idle.png`)
- If an entity has no variant, use `default`
- If an entity has no state, use `idle`

---

## 2. Folder Structure

```
Assets/
  Art/
    Sprites/
      Player/           # Player character sprites and animation frames
      Obstacles/        # Hazards, barriers, gap markers
      Collectibles/     # Dash, Shield, Surge, Coin
      Environment/      # Ground tiles, platform tiles, biome dressing
      Background/       # Parallax background layers (per biome)
    Animations/         # Animation controllers and clips (existing)
    VFX/                # Particle sprites and VFX textures (existing)
```

### Rules
- One category folder per gameplay domain — no nesting beyond category
- Biome-specific assets live in the same category folder, distinguished by the `variant` token in the file name (not by subfolder)
- `.meta` files are committed to version control — never delete or manually edit them
- `.gitkeep` files remain until the folder has at least one real asset

---

## 3. Sprite Specifications

### 3.1 Base Grid

| Property | Value |
|---|---|
| Base tile size | 16x16 pixels |
| Pixels Per Unit (PPU) | 16 |
| 1 Unity unit | = 1 tile = 16px |

All sprite dimensions must be multiples of 16px to align with the tile grid.

### 3.2 Entity Dimensions

| Entity | Pixel Size | Unity Size | Notes |
|---|---|---|---|
| Player character | 16x32 | 1x2 units | Occupies 1 lane width, 2 tiles tall |
| Obstacle (block) | 16x32 | 1x2 units | Full lane width, same height as player |
| Obstacle (half) | 16x16 | 1x1 units | Half-height variant for future use |
| Collectible (Dash, Shield, Surge) | 16x16 | 1x1 units | Each type has a unique silhouette (GDD §7.3) |
| Coin (meta currency) | 16x16 | 1x1 units | Distinct shape from chain collectibles |
| Ground tile | 16x16 | 1x1 units | Tileable horizontally |
| Background layer | 320x180 | 20x11.25 units | One layer per parallax depth; 3 layers per biome |

### 3.3 Pivot Points

| Entity | Pivot | Rationale |
|---|---|---|
| Player | Bottom-center (0.5, 0) | Feet align with ground plane |
| Obstacle | Bottom-center (0.5, 0) | Base aligns with ground plane |
| Collectible | Center (0.5, 0.5) | Floats above ground; no ground snap needed |
| Coin | Center (0.5, 0.5) | Same as collectible |
| Ground tile | Bottom-left (0, 0) | Tiles left-to-right, bottom-up |
| Background | Bottom-left (0, 0) | Scrolls left; anchored at origin |

---

## 4. Import Settings

All sprite assets use identical import settings unless noted. **No manual per-asset overrides.**

### 4.1 Default Import Settings (all categories)

| Setting | Value | Notes |
|---|---|---|
| Texture Type | Sprite (2D and UI) | `textureType: 8` |
| Sprite Mode | Single | `spriteMode: 1` — no multi-sprite sheets in source; atlas packing handles batching |
| Pixels Per Unit | 16 | `spritePixelsToUnits: 16` |
| Filter Mode | Point (no filter) | `filterMode: 0` — pixel art must not be interpolated |
| Compression | None | `textureCompression: 0` — source imports uncompressed; atlas applies platform compression |
| Max Size | 2048 | Safety cap; actual sprites are far smaller |
| Mip Maps | Disabled | `enableMipMap: 0` — sprites render at known screen sizes (MEMORY-BUDGET §4) |
| sRGB | On | `sRGBTexture: 1` — standard colour space for 2D |
| Alpha Is Transparency | On | `alphaIsTransparency: 1` |
| Read/Write | Off | `isReadable: 0` — saves memory; enable only if runtime pixel access is needed |
| Wrap Mode | Clamp | `wrapU: 1, wrapV: 1` |

### 4.2 Platform Overrides

| Platform | Compression | Format | Notes |
|---|---|---|---|
| Standalone (PC) | None | RGBA32 | Uncompressed for pixel-perfect rendering |
| Android | Normal | ETC2 (RGBA) | Mandatory per MEMORY-BUDGET §4; validated at M7 |

### 4.3 Existing Placeholder Migration

The current placeholders (`Player.png` at 32x64 / 32 PPU, `Hazard.png`, `Coin.png`) do not match this pipeline. When final art is imported:

1. New sprites follow the naming convention (`player-default-idle.png`)
2. Old placeholder files are deleted (not renamed)
3. Prefab sprite references are updated to point to the new assets
4. PPU is set to 16 on all new imports

**Do not change existing placeholder import settings mid-milestone.** Replace them atomically when final art drops.

---

## 5. Atlas Configuration

### 5.1 Atlas Groups

| Atlas Name | Contents | Max Size | Working Size | Platform Compression |
|---|---|---|---|---|
| `Atlas_Player` | All `Player/` sprites | 1024x1024 | 512x512 | RGBA32 / ETC2 |
| `Atlas_Collectibles` | All `Collectibles/` sprites | 1024x1024 | 512x512 | RGBA32 / ETC2 |
| `Atlas_Obstacles` | All `Obstacles/` sprites | 1024x1024 | 512x512 | RGBA32 / ETC2 |
| `Atlas_Environment` | All `Environment/` sprites for the active biome | 1024x1024 | 1024x1024 | RGBA32 / ETC2 |
| `Atlas_Background` | All `Background/` sprites for the active biome | 1024x1024 | 1024x1024 | RGBA32 / ETC2 |

**Hard ceiling: 1024x1024 per atlas, no exceptions.**

Working sizes from MEMORY-BUDGET §4 are the target. The 1024x1024 ceiling is the absolute maximum; exceeding it requires a scope review.

### 5.2 Atlas Rules

- **One atlas per category.** No cross-category atlases.
- **Biome-specific atlases:** Environment and Background atlases are per-biome (`Atlas_Environment_City`, `Atlas_Environment_Forest`, etc.). Only one biome atlas is loaded at a time (MEMORY-BUDGET §4 rule: max 2 atlases during gameplay).
- **Padding:** 2px between sprites in atlas to prevent bleed at any scale.
- **Allow Rotation:** Off — pixel art must not be rotated in atlas packing.
- **Tight Packing:** Off — use rectangular packing for predictable layout.
- **Read/Write:** Off on the packed atlas texture.

### 5.3 Runtime Atlas Budget

From MEMORY-BUDGET §4 — max atlases loaded simultaneously during `Running` state:

| Slot | Atlases | Combined Budget (Android) |
|---|---|---|
| Gameplay set | Atlas_Player + Atlas_Collectibles + Atlas_Obstacles + Atlas_VFX | ≤ 96MB total textures |
| Environment set | Atlas_Environment_{biome} + Atlas_Background_{biome} | (shared with above) |
| UI | Atlas_UI (loaded independently) | Separate from gameplay budget |

---

## 6. Validation Checklist

Every sprite submission must pass all checks before merge.

### 6.1 Naming and Structure
- [ ] File name matches `[entity]-[variant]-[state].png` pattern
- [ ] File is in the correct category folder under `Assets/Art/Sprites/`
- [ ] No duplicate file names across categories
- [ ] No spaces, underscores, or uppercase in file name

### 6.2 Dimensions and Grid
- [ ] Pixel dimensions match the entity spec in §3.2
- [ ] Width and height are multiples of 16
- [ ] Canvas is not padded with unnecessary transparent pixels

### 6.3 Import Settings
- [ ] PPU = 16
- [ ] Filter Mode = Point
- [ ] Compression = None (source); platform override set for Android = ETC2
- [ ] Mip Maps = Off
- [ ] Sprite Mode = Single
- [ ] Pivot matches §3.3 for the entity type

### 6.4 Visual Quality
- [ ] Sprite is legible at native resolution (no sub-pixel detail that disappears at 1x)
- [ ] Silhouette is distinct from other entities in the same category (GDD §9.4)
- [ ] Palette uses only the approved colours from the art bible
- [ ] No anti-aliased edges (clean pixel boundaries only)

### 6.5 Atlas Fit
- [ ] Adding this sprite does not push the target atlas past its working size
- [ ] If atlas exceeds working size, flag for review — do not exceed 1024x1024 ceiling

---

## 7. UI Asset Pipeline

UI assets follow the same core import philosophy as gameplay sprites (Point filter, no compression, PPU 16) but have their own naming convention, folder structure, 9-slice rules, and atlas.

**Skill reference:** `skills/art-audio-content/ui-asset-pipeline/SKILL.md`
**Visual reference:** `design/ART-BIBLE.md` §9 (UI Style Guide)

### 7.1 UI Naming Convention

**Pattern:** `ui-[category]-[element]-[state].png`

| Token | Description | Examples |
|---|---|---|
| `ui` | Fixed prefix — all UI assets start with `ui-` | — |
| `category` | Asset category, lowercase | `btn`, `panel`, `icon`, `bar`, `bg` |
| `element` | Specific element name, lowercase | `play`, `pause`, `settings`, `health`, `coin`, `dash` |
| `state` | Visual state, lowercase | `normal`, `hover`, `pressed`, `disabled`, `fill`, `empty` |

#### Examples

| File Name | Category | Notes |
|---|---|---|
| `ui-btn-play-normal.png` | Buttons | Play button, default state |
| `ui-btn-play-hover.png` | Buttons | Play button, hover/focus state |
| `ui-btn-play-pressed.png` | Buttons | Play button, pressed state |
| `ui-btn-play-disabled.png` | Buttons | Play button, disabled state |
| `ui-btn-close-normal.png` | Buttons | Close (X) icon button |
| `ui-panel-dialog-normal.png` | Panels | Standard dialog panel background |
| `ui-panel-hud-normal.png` | Panels | HUD container panel |
| `ui-icon-dash-normal.png` | Icons | Dash modifier icon (white silhouette) |
| `ui-icon-shield-normal.png` | Icons | Shield modifier icon (white silhouette) |
| `ui-icon-surge-normal.png` | Icons | Surge modifier icon (white silhouette) |
| `ui-icon-coin-normal.png` | Icons | Coin currency icon |
| `ui-bar-health-fill.png` | Bars | Health/progress bar fill region |
| `ui-bar-health-empty.png` | Bars | Health/progress bar empty region |
| `ui-bg-death-normal.png` | Backgrounds | Death screen background panel |
| `ui-bg-pause-normal.png` | Backgrounds | Pause overlay background |

#### Rules
- All lowercase, hyphens only (no underscores, no spaces, no camelCase) — same as gameplay sprites
- The `ui-` prefix prevents collision with gameplay sprite names
- State sheets (multiple states in one file) use `sheet` as the state token: `ui-btn-play-sheet.png`
- Placeholder UI assets use element name `placeholder`: `ui-btn-placeholder-normal.png`
- If an element has no meaningful state, use `normal`

### 7.2 UI Folder Structure

```
Assets/
  _Project/
    Art/
      UI/
        Buttons/         # All button sprites (play, pause, settings, close, etc.)
        Panels/          # Panel and dialog backgrounds (9-sliced)
        Icons/           # 16x16 icon sprites (white silhouettes for tinting)
        Bars/            # Progress bars, health bars, timer bars
        Backgrounds/     # Full-screen or large UI backgrounds (death, pause, menu)
```

#### Rules
- UI assets live under `Assets/_Project/Art/UI/`, separate from gameplay sprites in `Assets/Art/Sprites/`
- One subfolder per category — no deeper nesting
- Biome-variant UI assets (if any) are distinguished by the element name token, not by subfolder (e.g., `ui-panel-coastal-normal.png`)
- `.meta` files are committed — never delete or manually edit them
- `.gitkeep` files remain until the folder has at least one real asset

### 7.3 UI Import Settings

All UI assets use these import settings. **No manual per-asset overrides** unless noted.

| Setting | Value | Notes |
|---|---|---|
| Texture Type | Sprite (2D and UI) | `textureType: 8` |
| Sprite Mode | Single | Default; use Multiple for state sheets only (§7.1) |
| Pixels Per Unit | 16 | Matches gameplay PPU |
| Filter Mode | Point (no filter) | `filterMode: 0` — pixel art, no interpolation |
| Compression | None | `textureCompression: 0` — uncompressed at source; atlas handles platform compression |
| Max Size | 2048 | Safety cap |
| Mip Maps | Disabled | `enableMipMap: 0` |
| sRGB | On | `sRGBTexture: 1` |
| Alpha Is Transparency | On | `alphaIsTransparency: 1` |
| Read/Write | Off | `isReadable: 0` |
| Wrap Mode | Clamp | `wrapU: 1, wrapV: 1` |
| Mesh Type | Full Rect | Required for 9-slice to work correctly |

**State sheets:** When button states are packed into a single file (e.g., 4 states in a 1×4 vertical strip), set Sprite Mode to **Multiple** and use the Sprite Editor to define sub-sprites. Name each sub-sprite to match the individual state name (e.g., `ui-btn-play-normal`, `ui-btn-play-hover`).

### 7.4 9-Slice Configuration

9-slice is **enabled for all buttons and panels**. Icons, bars (fill region), and backgrounds do not use 9-slice.

| Element Type | Sprite Size | Border (L, R, T, B) | Notes |
|---|---|---|---|
| **Button (standard)** | 48×16 px | 4, 4, 4, 4 | Corner radius fits within 4px border. Centre stretches for text width. |
| **Button (wide)** | 64×16 px | 4, 4, 4, 4 | Same borders, wider default for longer labels |
| **Button (icon-only)** | 16×16 px | 0, 0, 0, 0 | No 9-slice — fixed size, no stretching |
| **Panel (dialog)** | 96×64 px | 8, 8, 8, 8 | 8px corner radius fits within border. Scales to any dialog size. |
| **Panel (HUD)** | 64×32 px | 8, 8, 8, 8 | Compact HUD container |
| **Panel (full-screen)** | 160×90 px | 8, 8, 8, 8 | Death screen, pause screen panel |
| **Progress bar (track)** | 64×8 px | 4, 4, 2, 2 | Horizontal stretch only; vertical stays fixed |

#### 9-Slice Rules
- **Corner regions** contain the pixel corner cut (border radius) and must never be stretched
- **Border values match ART-BIBLE.md §9.4** — 4px for buttons, 8px for panels
- The centre fill region is a flat colour (no pattern) so stretching produces no visual artifacts
- If an element's minimum content size would compress below the sum of its border widths, the element is too small — use a fixed-size variant instead
- Test all 9-sliced elements at both minimum (1× border sum) and maximum (3× sprite size) scales before merge

### 7.5 UI Atlas Configuration

| Atlas Name | Contents | Max Size | Working Size | Platform Compression |
|---|---|---|---|---|
| `Atlas_UI` | All assets under `Assets/_Project/Art/UI/` | 1024×1024 | 512×512 | RGBA32 / ETC2 |

#### Atlas Rules
- **Single UI atlas.** All UI categories (Buttons, Panels, Icons, Bars, Backgrounds) pack into one atlas.
- **Max 1024×1024** — hard ceiling, same as gameplay atlases. Working target is 512×512.
- **Padding:** 2px between sprites to prevent bleed.
- **Allow Rotation:** Off — pixel art must not be rotated.
- **Tight Packing:** Off — rectangular packing for predictable layout.
- **Read/Write:** Off on packed atlas texture.
- **Platform override:** Android uses ETC2 compression on the packed atlas (same as gameplay atlases, §5).
- The UI atlas is loaded independently of gameplay atlases and does not count against the gameplay texture memory budget (MEMORY-BUDGET §4).

### 7.6 Theme and Colour Rules

All UI colours are defined in **ART-BIBLE.md §9.1 (UI Palette)** and **§12 (Palette Reference)**. The UI asset pipeline enforces these rules:

- **No hardcoded per-element colours.** Button fills, panel backgrounds, and text colours come from the UI palette — never from arbitrary hex values chosen per asset.
- **Icon sprites are white silhouettes** on transparent background. Colour is applied at runtime via Unity's `Image.color` tint. This means one icon sprite serves all accent colour uses.
- **Button state colours** are defined in ART-BIBLE.md §9.5. Each state (normal, hover, pressed, disabled) uses the palette values — sprites do not bake in state-specific colours unless the element requires per-pixel detail that tinting cannot achieve (e.g., a multi-colour illustration button).
- **Panel backgrounds** are flat-fill 9-slice sprites in the panel background colour (`#1A1A1A`). Opacity is applied at runtime — the sprite itself is fully opaque.
- **Accent colours** (Dash blue, Shield gold, Surge red, Coin yellow, Confirm green, Danger red) are applied via tint, not baked into sprites.
- **If a new colour is needed**, it must be added to ART-BIBLE.md §9.1 first, then referenced here. No ad-hoc additions.

### 7.7 UI Asset Validation Checklist

Every UI asset submission must pass all checks before merge.

#### 7.7.1 Naming and Structure
- [ ] File name matches `ui-[category]-[element]-[state].png` pattern
- [ ] File is in the correct category folder under `Assets/_Project/Art/UI/`
- [ ] No duplicate file names across categories
- [ ] No spaces, underscores, or uppercase in file name

#### 7.7.2 Dimensions and Grid
- [ ] Dimensions are multiples of 4px (minimum) — 16px multiples preferred
- [ ] Canvas is not padded with unnecessary transparent pixels
- [ ] 9-slice source sprites are large enough that border regions contain the full corner detail

#### 7.7.3 Import Settings
- [ ] PPU = 16
- [ ] Filter Mode = Point
- [ ] Compression = None (source); platform override for Android = ETC2
- [ ] Mip Maps = Off
- [ ] Sprite Mode = Single (or Multiple for state sheets)
- [ ] Mesh Type = Full Rect (for 9-slice elements)

#### 7.7.4 9-Slice
- [ ] Border values match §7.4 for the element type
- [ ] No stretching artifacts at minimum and maximum supported sizes
- [ ] Corner regions contain the full corner cut — no clipped radius

#### 7.7.5 Visual Quality
- [ ] Colours use only palette values from ART-BIBLE.md §9.1 and §12
- [ ] No anti-aliased edges — clean pixel boundaries only
- [ ] Icons are white silhouettes on transparent background (tint-ready)
- [ ] Element is legible at 720p portrait (smallest supported resolution)

#### 7.7.6 Atlas Fit
- [ ] Adding this asset does not push `Atlas_UI` past its 512×512 working size
- [ ] If atlas exceeds working size, flag for review — do not exceed 1024×1024 ceiling

---

## 8. Open Questions

| Question | Owner | Status |
|---|---|---|
| Should Background layers be separate files or a single wide strip? | technical-artist | Open — 3 separate 320x180 layers per biome assumed |
| Will animated sprites use flip-book sheets or individual frame files? | technical-artist / engineer | Open — individual frames assumed; revisit if animation count grows |
| Biome transition: hard cut or scroll-blend between environment atlases? | engineer / technical-artist | Open — hard cut assumed; blend requires both atlases loaded simultaneously |
| Should button state sprites be individual files or packed state sheets? | technical-artist / ui-programmer | Open — individual files assumed; sheets reduce file count but require Sprite Editor slicing |

---

## 9. Change Log

| Date | Change | Owner | Rationale |
|---|---|---|---|
| 2026-03-31 | v0.1 created | technical-artist | Initial sprite pipeline from `/plan` task; defines naming, folders, import settings, atlas groups |
| 2026-03-31 | §7 UI Asset Pipeline added | technical-artist / ui-ux-designer | Defines UI naming convention (`ui-[cat]-[elem]-[state]`), folder structure, import settings, 9-slice specs, single UI atlas, and theme/colour rules referencing ART-BIBLE §9 |
