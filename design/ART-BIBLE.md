# Art Bible — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Owner:** 2d-artist / technical-artist
- **Contributors:** gdd-designer, technical-design-lead, performance-reviewer
- **Version:** 0.1
- **Status:** Draft
- **Last Updated:** 2026-03-31
- **Related Docs:** `design/GDD.md` (§9), `design/SPRITE-PIPELINE.md`, `design/MEMORY-BUDGET.md` (§4), `design/PERF-BUDGET.md`

---

## 1. Visual Vision

- **Visual fantasy:** A retro arcade top-down racer — the player is behind the wheel of a sports car tearing down an endless highway, dodging traffic and grabbing pickups at speed. The feeling is Saturday morning in the arcade, coins on the cabinet, one more credit.
- **Emotional tone:** Nostalgic, warm, inviting. Not gritty or realistic. The world is a memory of how those games *felt*, not a pixel-accurate recreation.
- **Readability goals:** Every object on the road is understood in under one second. Cars read as cars, pickups read as pickups, the road reads as a road. Silhouette clarity beats visual detail at every decision point.
- **Differentiation goals:** The collect-modifies-world mechanic must be visually obvious. When a modifier activates, the road ahead must *look different* — fewer cars, a shield glow on the player, a speed-line effect. The player should see the consequence of their collection choice without any text.

---

## 2. Style Pillars

### Pillar 1 — Retro Warmth
Warm saturated colours, limited palettes, and chunky pixel forms that evoke late-80s / early-90s arcade hardware. Reference: Turbo Out Run colour grading — sunset oranges, deep sky blues, vivid greens against dark asphalt. Avoid modern flat-design pastels.

### Pillar 2 — Readable at Speed
Every gameplay element must be identifiable at full scroll speed within a single frame of attention. Silhouettes are exaggerated. Colour coding is strict: player car always stands out from traffic. Collectibles never blend with road surface. Hazard cars use a distinct colour family from the player.

### Pillar 3 — Friendly Geometry
Round, friendly, approachable forms. Cars have soft curves, not angular wedges. Obstacles feel like playful barriers, not aggressive threats. The world invites replays — death is a "whoops" not a punishment.

---

## 3. Reference Direction

### Key References
| Reference | What to Take | What to Leave |
|---|---|---|
| **Turbo Out Run** (Sega, 1989) | Colour grading (sunset highways, saturated skies), sense of speed, road perspective | Pseudo-3D scaling — we are pure top-down pixel art |
| **Road Fighter** (Konami, 1984) | Top-down car gameplay, 3-lane highway feel, enemy car silhouettes | Harsh colour palette, single-colour sprites |
| **Spy Hunter** (Bally Midway, 1983) | Vertical scrolling road structure, roadside scenery rhythm | Military theme, weapon mechanics |
| **Rally-X** (Namco, 1980) | Pickup placement on road, clean tile-based world | Maze structure, flag mechanic |
| **Modern pixel art racers** (e.g., Super Arcade Racing) | Clean pixel art with modern colour depth, readable UI | Over-detailed sprites that lose clarity at small sizes |

### What to Emulate
- Turbo Out Run's colour temperature: warm foreground (road, cars) against cooler background (sky, horizon)
- The arcade feel of "I can read everything at a glance"
- Chunky, confident pixel work — no anti-aliasing, no sub-pixel trickery
- Colour palettes that shift per biome but keep a warm base

### What to Avoid
- Realistic car proportions — top-down cars should read as friendly shapes, not engineering diagrams
- Dark/muted palettes — this is an arcade game, not a noir thriller
- Visual noise — no dithering patterns on road surface, no complex tiling that competes with gameplay objects
- Pseudo-3D or perspective tricks — the camera is fixed top-down, commit fully to that angle

---

## 4. World and Environment Rules

### 4.1 Camera and Perspective
- **Fixed top-down camera.** The player car is positioned at approximately 30% from the bottom of the screen. The road scrolls vertically downward (world moves toward the camera).
- No rotation, no zoom, no camera shake on normal gameplay. Screen shake reserved for death only.

> **NOTE:** GDD §9.2 currently reads "fixed side-scroll camera." This art bible establishes the visual direction as top-down. The GDD should be updated to reflect this decision. See Change Log.

### 4.2 Road Structure
- The road occupies the centre of the screen with 3 clearly marked lanes.
- **Lane markings:** Dashed white centre lines between lanes, solid white edge lines. Lane markings are part of the ground tile, not separate sprites.
- **Road surface:** Dark asphalt grey with subtle warm undertone. Never pure black — pixel art reads better with a tinted base.
- **Road shoulder:** 1–2 tiles of gravel/dirt on each side before the roadside scenery.

### 4.3 Roadside Scenery (per biome)
Roadside scenery scrolls at road speed on the immediate edge, with parallax layers behind. Scenery must never overlap the 3-lane play area.

### 4.4 Biome Themes

The world is a continuous highway that passes through 3 biome environments at distance milestones (GDD §6.1). Biome transitions are visual only — no gameplay rule changes.

| Biome | Theme | Colour Temperature | Key Roadside Elements | Sky Colour |
|---|---|---|---|---|
| **Biome 1 — Coastal Highway** | Sun-drenched seaside road, palm trees, ocean glimpses | Warm — sunset oranges, golden yellows, turquoise water | Palm trees, guardrails, beach sand, distant ocean | Gradient: warm orange → soft blue |
| **Biome 2 — City Night** | Neon-lit urban highway, buildings, signage | Warm-cool contrast — neon pinks/cyans against dark buildings | Street lights, building silhouettes, neon signs, overpasses | Deep navy → purple gradient |
| **Biome 3 — Desert Stretch** | Open desert highway, rock formations, heat haze | Hot — burnt orange, terracotta, dusty yellows | Cacti, rock formations, sand dunes, distant mesas | Pale hot blue → white horizon |

### 4.5 Shape Language
- **Round and friendly.** Corners are rounded on everything — cars, obstacles, UI panels, collectibles.
- **Exaggerated proportions.** Cars are wider and stubbier than real proportions. This aids top-down readability at small pixel sizes.
- **No sharp aggressive angles** on gameplay elements. The world should feel inviting, not hostile.

### 4.6 Colour Logic
- **Collectible colours are globally reserved** and never appear on road surface, traffic cars, or scenery:
  - **Dash:** Blue / Cyan (`#4FC3F7` family)
  - **Shield:** Gold / Amber (`#FFD54F` family)
  - **Surge:** Red / Crimson (`#EF5350` family)
  - **Coin (meta currency):** Bright yellow (`#FFEE58` family) — distinct from Shield gold by saturation and shape
- **Player car:** A unique colour that stands out in every biome. Recommended: **white with accent stripe** — white reads against both warm and cool backgrounds.
- **Traffic / hazard cars:** Use the biome's secondary palette. Never use collectible-reserved colours. Each biome has 2–3 traffic car colour variants.
- **Road surface:** Neutral dark warm grey — consistent across all biomes. Only roadside scenery and sky change per biome.

### 4.7 Focal Point Rules
- The 3-lane road area is the primary focal zone. Nothing outside the road should compete for attention during gameplay.
- Roadside scenery uses lower saturation and less detail than gameplay objects.
- Collectibles are the brightest elements on screen after the player car.

---

## 5. Character Rules (Player Car)

### 5.1 Silhouette
- The player car is a **retro sports car seen from directly above** — think rounded fenders, visible windshield shape, and a compact body.
- The silhouette must be instantly distinguishable from every traffic/hazard car. Player car is slightly smaller and has a unique outline.
- Sprite size: **16x32 px** (1 lane wide, 2 tiles long) per SPRITE-PIPELINE.md §3.2.

### 5.2 Colour and Variants
- **Default skin:** White body with a single colour accent stripe (player's choice unlockable).
- **Unlockable skins (M5):** Colour variants and cosmetic differences (racing stripes, decals). All skins must maintain the same silhouette for gameplay readability.
- The player car must read clearly against all 3 biome road surfaces.

### 5.3 States and Animation
| State | Visual | Notes |
|---|---|---|
| `idle` (running) | Default top-down sprite, slight exhaust pixel trail | Base state during normal gameplay |
| `dash` | Brief lateral lean (1–2px body shift in dash direction) | Emphasises the snap-dash input. 2–3 frame animation. |
| `hit` / `death` | Freeze-frame + colour flash (white overlay 1 frame) | Then cut to death screen. No explosion — keeps it friendly. |
| `shield-active` | Gold outline / glow border around car (1px) | Visible at a glance that shield is protecting. Overlay, not a sprite swap. |
| `surge-active` | Red tint + speed lines behind car | Speed lines are VFX, not part of the car sprite. |

### 5.4 Modifier Feedback on Player
- Active modifier is shown as a **pulsing coloured outline** on the player car (GDD §9.4), matching the modifier colour.
- Modifier expiry warning: outline blinks faster 2 seconds before expiry.
- Only one modifier outline active at a time (one-modifier-at-a-time rule, GDD §5.3).

---

## 6. Traffic & Obstacle Rules

### 6.1 Traffic Cars (Hazards)
- Traffic cars are the primary obstacle. They occupy full lane width (16x32 px), same dimensions as the player car.
- **Visual distinction from player:** Traffic cars use darker, more saturated biome colours. They should feel like "part of the road world" while the player feels like "the hero."
- Each biome has 2–3 traffic car colour variants to avoid visual monotony.
- Traffic cars have simpler silhouettes than the player car — boxy sedans, trucks, vans. No sports car shapes (reserved for player).

### 6.2 Static Obstacles
- Road barriers, cones, construction signs — smaller sprites (16x16 px).
- Use warm warning colours (orange, yellow) that don't conflict with collectible reserved colours.
- Shape language: round-topped, friendly. A traffic cone is not a spike.

### 6.3 Readability Rules
- Hazards always occupy full lane width — never partially lane-blocking.
- Hazards never visually blend with road surface. Minimum contrast ratio: hazard body vs road must be clearly distinct.
- No obstacle uses blue, gold/amber, or red as its primary colour (reserved for collectibles).

---

## 7. Collectible Rules

### 7.1 General Rules
- All collectibles float on the road surface (elevated 0 visual offset in top-down, but rendered above road/lane markings in sort order).
- Each collectible type has a **unique silhouette** distinguishable by shape alone (GDD §7.3 — accessible without colour).
- Collectibles are the brightest non-player elements on screen.
- Size: 16x16 px for all types.

### 7.2 Type Visual Design

| Type | Colour Family | Shape (Silhouette) | Accessibility Shape | Glow/Idle Anim |
|---|---|---|---|---|
| **Dash** | Blue / Cyan | Arrow pointing forward (chevron) | Chevron — directional, implies speed/movement | Gentle pulse (alpha cycle) |
| **Shield** | Gold / Amber | Shield / hexagon | Hexagonal outline — defensive, protective shape | Gentle pulse (alpha cycle) |
| **Surge** | Red / Crimson | Lightning bolt / star burst | Spiky radial — energy, intensity shape | Gentle pulse (alpha cycle) |
| **Coin** | Bright Yellow | Circle with inner detail (dollar/star) | Circle — distinct from all chain collectibles | Slow rotation (2-frame flip) |

### 7.3 Chain Counter (Near Player)
- 3 dots displayed near the player car (below or to the side), colour-matched to the current chain type.
- Dots fill as chain progresses (1/3, 2/3, 3/3).
- On chain completion: all 3 dots flash and dissolve. Modifier outline appears on player car.

---

## 8. FX and Feedback

### 8.1 Collection Pickup
- Brief **particle burst** (3–5 pixels scattering outward), colour-matched to collectible type.
- Duration: 4–6 frames. No lingering particles.

### 8.2 Chain Completion
- **Screen-edge colour pulse** (1-frame flash, colour-matched to chain type). Already implemented as `ChainFlash`.
- Modifier label appears briefly near chain dots: "DASH" / "SHIELD" / "SURGE" in pixel font, then fades.

### 8.3 Modifier Active
- Player car outline pulses in modifier colour (see §5.4).
- **Dash modifier:** Road ahead visually "opens up" — fewer traffic cars is the gameplay effect; roadside scenery may brighten subtly.
- **Shield modifier:** Gold shimmer overlay on player car. On hit-absorb: shield shatters into gold pixel particles.
- **Surge modifier:** Speed lines stream behind the player car. Road lane markings scroll faster. Subtle red vignette at screen edges.

### 8.4 Modifier Expiry
- Outline blink accelerates 2 seconds before expiry.
- On expiry: outline dissolves outward (pixel scatter, 4 frames).

### 8.5 Death
- Player car **freeze-frame** (all animation stops for 6 frames).
- **Screen shake** (2px amplitude, 8 frames, fast decay).
- Brief white flash overlay (1 frame).
- Cut to death screen. No explosion, no debris — keep it light and retry-friendly.

### 8.6 UI/World-Space Feedback Relationship
- All modifier and chain feedback is **world-space** (near the player car), not HUD-corner.
- HUD displays only: distance (top-centre), score (top-right). Minimal, out of the way.
- Death screen is full-screen UI overlay — not world-space.

---

## 9. UI Style Guide

This section is the authoritative reference for all UI visual work. It extends the gameplay art direction into menus, HUD, overlays, and meta screens. All colours reference the global palette in §12; no per-element colour overrides are permitted.

### 9.1 UI Palette

Derived from the gameplay palette (§12.1) with adjusted contrast for UI readability on semi-transparent panels and varied biome backgrounds.

| Role | Hex | Opacity | Usage |
|---|---|---|---|
| **Panel background** | `#1A1A1A` | 85% | Primary surface for all UI panels and overlays |
| **Panel border** | `#E0E0E0` | 100% | 1px solid border on panels, dialogs, tooltips |
| **Button fill (normal)** | `#3E3E3E` | 100% | Default button background — matches road surface grey |
| **Button fill (hover)** | `#5A5A5A` | 100% | Lightened on hover/focus — discrete step, not a gradient |
| **Button fill (pressed)** | `#2A2A2A` | 100% | Darkened on press — button depresses visually |
| **Button fill (disabled)** | `#3E3E3E` | 40% | Same base grey at reduced opacity — reads as inactive |
| **Text primary** | `#FAFAFA` | 100% | All body text, HUD counters, labels |
| **Text secondary** | `#BDBDBD` | 100% | Descriptions, subtitles, inactive labels |
| **Text disabled** | `#757575` | 100% | Greyed-out labels on disabled controls |
| **Accent — Dash** | `#4FC3F7` | 100% | Dash-related UI highlights (matches collectible) |
| **Accent — Shield** | `#FFD54F` | 100% | Shield-related UI highlights |
| **Accent — Surge** | `#EF5350` | 100% | Surge-related UI highlights |
| **Accent — Coin** | `#FFEE58` | 100% | Currency displays, reward callouts |
| **Accent — Confirm** | `#66BB6A` | 100% | Positive actions: play, confirm, success |
| **Accent — Danger** | `#EF5350` | 100% | Destructive actions: quit, delete (shares Surge red) |
| **Overlay dim** | `#000000` | 50% | Full-screen dim behind death screen, pause, dialogs |
| **Drop shadow** | `#000000` | 80% | 1px text drop shadow on all in-game and HUD text |

**Rules:**
- Never use a colour that is not listed here or in §12. If a new UI colour is needed, add it to this table first.
- Accent colours are always the gameplay-reserved colours — UI does not introduce competing hues.
- Button fills use neutral greys only. Accent colours appear on button text or icon tint, not on button backgrounds.

### 9.2 Typography

- **Font family:** Pixel / bitmap font, grid-aligned. No anti-aliased or vector fonts. If the chosen font does not support all 4 size tiers below, use a separate bitmap font per tier.
- **Rendering:** Point-filtered (no interpolation). Font textures use the same import settings as gameplay sprites (§10.1).

| Tier | Size | Line Height | Use | Case |
|---|---|---|---|---|
| **Title** | 32px (2× base grid) | 40px | Screen titles, game-over header, main menu title | Uppercase |
| **Subtitle** | 24px (1.5× base grid) | 32px | Section headers, dialog titles, milestone labels | Uppercase |
| **Body** | 16px (1× base grid) | 24px | Descriptions, dialog text, death screen stats | Mixed case |
| **Label** | 12px (0.75× base grid) | 16px | HUD counters, button labels, tooltips, small captions | Uppercase for HUD; mixed case elsewhere |

**Rules:**
- All sizes are multiples of 4px to stay on the spacing sub-grid.
- White (`#FAFAFA`) with 1px dark drop shadow (`#000000` 80%) is the default for all text. Use `Text secondary` or `Text disabled` colours only where explicitly specified above.
- Uppercase for HUD counters and titles. Mixed case for body text and meta screens.
- No font sizes outside these 4 tiers. If a size doesn't fit, use the nearest tier.

### 9.3 Spacing System

All spacing derives from a **4px base unit**. UI elements snap to this grid.

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px | Minimum gap — icon-to-label, dot spacing in chain counter |
| `space-sm` | 8px | Inner padding — button content inset, icon margins within a row |
| `space-md` | 16px | Standard padding — panel content inset, margins between sibling elements |
| `space-lg` | 24px | Section separation — gap between panel groups, screen-edge safe margin |
| `space-xl` | 32px | Major separation — gap between screen sections, title-to-content |

**Rules:**
- **Padding (inside elements):** Buttons use `space-sm` (8px) horizontal, `space-xs` (4px) vertical. Panels use `space-md` (16px) on all sides.
- **Margins (between elements):** Default inter-element margin is `space-md` (16px). Tighter groupings (e.g., chain dots) use `space-xs` (4px).
- **Screen-edge safe area:** `space-md` (16px) minimum from any screen edge on all platforms. Mobile may increase to `space-lg` (24px) for notch/rounded-corner avoidance.
- All spacing values are multiples of 4px. No arbitrary pixel offsets.

### 9.4 Border Radius

Pixel art border radius is achieved by cutting corner pixels, not by anti-aliased curves.

| Element | Radius | Pixel Effect |
|---|---|---|
| **Buttons** | 4px | 1px corner cut — removes the outermost corner pixel on each side |
| **Panels / Dialogs** | 8px | 2px corner cut — visibly rounded rectangle, friendly shape language |
| **Icons** | 0px | No rounding — icons are square pixel art on the 16×16 grid |
| **Progress bars** | 4px | 1px corner cut — matches button rounding |
| **Tooltips** | 4px | 1px corner cut — small, unobtrusive |

**Rules:**
- All corner cuts are symmetric (same on all 4 corners).
- No anti-aliased corner smoothing. Corners are hard pixel steps.
- 9-slice sprites must place the corner cut entirely within the border region so slicing doesn't distort the curve.

### 9.5 Button States

Buttons transition between discrete visual states. No smooth interpolation — state changes are instant (1-frame swap), consistent with the pixel art aesthetic.

| State | Fill | Border | Text Colour | Offset | Notes |
|---|---|---|---|---|---|
| **Normal** | `#3E3E3E` 100% | 1px `#E0E0E0` | `#FAFAFA` | 0px | Default resting state |
| **Hover / Focus** | `#5A5A5A` 100% | 1px `#FAFAFA` | `#FAFAFA` | 0px | Brighter fill, brighter border. Keyboard focus uses the same style as hover. |
| **Pressed** | `#2A2A2A` 100% | 1px `#BDBDBD` | `#BDBDBD` | +1px Y | Darkened fill, 1px downward offset to simulate depth. Border and text dim slightly. |
| **Disabled** | `#3E3E3E` 40% | 1px `#757575` | `#757575` | 0px | Reduced opacity fill, greyed border and text. No interaction response. |

**Accent buttons** (e.g., Play, Confirm): replace the fill colour with the relevant accent at the same lightness steps:
- Normal: accent colour at full saturation
- Hover: accent lightened 15%
- Pressed: accent darkened 20%, +1px Y offset
- Disabled: accent at 40% opacity

**Rules:**
- Button click/tap areas extend at least 4px beyond the visible sprite on all sides (touch target padding) for mobile usability.
- Icon-only buttons (e.g., close, mute) follow the same state colours but use a 16×16 icon in place of text.
- No gradients, glows, or animation between states. Instant swap only.

### 9.6 Panel Style

- **Background:** `#1A1A1A` at 85% opacity — darker than road surface to separate UI from world.
- **Border:** 1px solid `#E0E0E0` (warm off-white). Biome-tinted borders are permitted for flavour panels (e.g., biome unlock screen) but default is neutral.
- **Corner radius:** 8px (2px pixel corner cut) — see §9.4.
- **Inner padding:** `space-md` (16px) on all sides.
- **No gradients, no glass, no drop shadows on panels.** Flat pixel art only.
- **Nesting:** Panels may nest one level deep (e.g., a settings panel containing a key-bindings sub-panel). Nested panels use the same background colour but with 1px inset border in `#757575` to distinguish depth.
- **Full-screen overlays** (death screen, pause): use `Overlay dim` (`#000000` 50%) behind the panel, then the panel renders on top at standard style.

### 9.7 Icon Style

- **Size:** 16×16 px, matching the gameplay sprite grid. No other icon sizes.
- **Pixel grid:** Same base grid and PPU (16) as gameplay sprites. Point-filtered, no anti-aliasing.
- **Colour:** Icons are tinted at runtime using the UI palette accent colours. Source icon sprites are **white silhouettes on transparent background** — the tint system applies colour.
- **Modifier icons** reuse the collectible silhouettes: chevron (Dash), hexagon (Shield), lightning bolt (Surge).
- **Gameplay icons** (coin, distance, score) use distinct silhouettes from modifier icons.
- **Accessibility:** Every icon that conveys meaning must also have an adjacent text label (§9.2 Label tier). Icons are never the sole indicator of state.

### 9.8 Contrast and Readability

- All HUD text must be legible over every biome's sky/road combination at the smallest supported resolution (720p portrait equivalent).
- **Drop shadow on all in-game text is mandatory** — 1px offset, `#000000` at 80%.
- **Death screen / pause:** full-screen dim overlay (`#000000` 50%) renders before any UI panel — ensures contrast regardless of world state behind.
- **Minimum text-on-panel contrast:** `#FAFAFA` text on `#1A1A1A` panel background provides ~14:1 contrast ratio. Never use text colours darker than `#BDBDBD` on panel backgrounds.
- **Accent text on dark backgrounds:** all accent colours (§9.1) are selected to maintain ≥4.5:1 contrast against `#1A1A1A`. Do not use accent colours on light or mid-tone backgrounds without testing.
- **Mobile:** Test all UI screens at 720p portrait and 1080p landscape. HUD labels at 12px (Label tier) must remain pixel-sharp — if a target device cannot render 12px cleanly, scale to 16px (Body tier).

---

## 10. Technical Constraints

### 10.1 Sprite Specifications
All specifications per `SPRITE-PIPELINE.md`:
- **Base grid:** 16x16 px, PPU = 16
- **Player car:** 16x32 px, pivot bottom-centre (0.5, 0)
- **Hazard car:** 16x32 px, pivot bottom-centre (0.5, 0)
- **Collectible:** 16x16 px, pivot centre (0.5, 0.5)
- **Road tile:** 16x16 px, pivot bottom-left (0, 0)
- **Background layer:** 320x180 px, pivot bottom-left (0, 0)
- **Filter Mode:** Point (no interpolation) — mandatory for pixel art
- **Compression:** None at source; ETC2 on Android via atlas platform override

### 10.2 Atlas Budgets
Per SPRITE-PIPELINE.md §5 and MEMORY-BUDGET.md §4:
- Max 1024x1024 per atlas (hard ceiling)
- Working sizes: 512x512 for gameplay atlases, 1024x1024 for environment/background
- Max 2 environment atlases loaded simultaneously (one biome at a time)

### 10.3 Draw Call / Overdraw
Per PERF-BUDGET.md:
- Draw calls: ≤50 PC / ≤30 Android during gameplay
- Overdraw: ≤3 layers (road + gameplay objects + HUD)

### 10.4 Colour Depth
- All sprites are RGBA32 at source, delivered as `.png` with transparency.
- **No indexed-colour palette enforcement at file level** — the palette is a design constraint, not a technical one. Artists use the approved palette; import settings handle the rest.

### 10.5 Platform Caveats
- **Android ETC2:** Lossy compression can shift hues on low-saturation sprites. Test all collectible sprites on-device to confirm colour-coding survives compression.
- **Mobile screen size:** All gameplay-critical elements (player, hazards, collectibles, chain dots) must be legible at 720p portrait equivalent. Test at minimum supported resolution.

---

## 11. Asset Review Criteria

Every art asset submitted for the game must pass these criteria before merge:

### 11.1 Style Fit
- [ ] Matches the retro-warm-friendly tone — no realistic, dark, or overly detailed sprites
- [ ] Uses only approved palette colours (§4.6 reserved colours respected)
- [ ] Consistent pixel density with existing assets (no mixed resolutions)
- [ ] Round/friendly shape language — no sharp aggressive geometry

### 11.2 Readability
- [ ] Identifiable at full scroll speed in a single frame of attention
- [ ] Silhouette distinct from all other entities in the same category
- [ ] Collectibles distinguishable by shape alone (colourblind safe, GDD §7.3)
- [ ] Sufficient contrast against road surface in all 3 biomes

### 11.3 Technical Suitability
- [ ] Passes all checks in SPRITE-PIPELINE.md §6 (naming, dimensions, import settings, atlas fit)
- [ ] Dimensions are multiples of 16px
- [ ] No anti-aliased edges (clean pixel boundaries only)
- [ ] No sub-pixel detail that disappears at native resolution

### 11.4 Reuse Potential
- [ ] Biome-specific assets use the `variant` naming token — same entity structure, different colour/detail
- [ ] Traffic car silhouettes are reusable across biomes with palette swap
- [ ] Roadside scenery elements are modular (individual trees, signs, not baked strips)

---

## 12. Palette Reference

### 12.1 Reserved Gameplay Colours (Global — All Biomes)

| Role | Primary Hex | Family | Usage |
|---|---|---|---|
| Dash collectible | `#4FC3F7` | Blue / Cyan | Dash pickup, dash chain dots, dash modifier outline |
| Shield collectible | `#FFD54F` | Gold / Amber | Shield pickup, shield chain dots, shield modifier outline |
| Surge collectible | `#EF5350` | Red / Crimson | Surge pickup, surge chain dots, surge modifier outline |
| Coin (meta) | `#FFEE58` | Bright Yellow | Coin pickup, currency display |
| Player car body | `#FAFAFA` | White | Default player skin — stands out in every biome |
| Road surface | `#3E3E3E` | Warm dark grey | Consistent across biomes; never pure black |
| Lane markings | `#E0E0E0` | Off-white | Dashed centre, solid edge |

### 12.2 Biome 1 — Coastal Highway Palette

| Role | Hex | Notes |
|---|---|---|
| Sky gradient top | `#FF8A65` | Warm sunset orange |
| Sky gradient bottom | `#4DD0E1` | Soft turquoise |
| Palm tree trunk | `#8D6E63` | Warm brown |
| Palm tree foliage | `#66BB6A` | Vivid green |
| Sand/shoulder | `#FFCC80` | Golden sand |
| Ocean glimpse | `#26C6DA` | Bright cyan (distant, low saturation) |
| Traffic car 1 | `#7E57C2` | Purple sedan |
| Traffic car 2 | `#26A69A` | Teal van |
| Traffic car 3 | `#FF7043` | Orange truck |

### 12.3 Biome 2 — City Night Palette

| Role | Hex | Notes |
|---|---|---|
| Sky gradient top | `#1A237E` | Deep navy |
| Sky gradient bottom | `#6A1B9A` | Dark purple |
| Building silhouettes | `#212121` | Near-black, flat shapes |
| Neon accent 1 | `#F06292` | Pink neon signs |
| Neon accent 2 | `#4DD0E1` | Cyan neon signs |
| Street light glow | `#FFF9C4` | Warm yellow haloes |
| Traffic car 1 | `#AB47BC` | Purple |
| Traffic car 2 | `#78909C` | Cool grey |
| Traffic car 3 | `#FFA726` | Warm amber |

### 12.4 Biome 3 — Desert Stretch Palette

| Role | Hex | Notes |
|---|---|---|
| Sky gradient top | `#90CAF9` | Pale hot blue |
| Sky gradient bottom | `#FFF8E1` | White-hot horizon |
| Rock formations | `#A1887F` | Terracotta/sandstone |
| Cacti | `#558B2F` | Deep olive green |
| Sand dunes | `#FFAB91` | Dusty peach |
| Mesa (distant) | `#BCAAA4` | Faded warm grey |
| Traffic car 1 | `#5C6BC0` | Indigo |
| Traffic car 2 | `#D4E157` | Lime (high contrast against desert) |
| Traffic car 3 | `#8D6E63` | Dusty brown |

---

## 13. Open Questions

| Question | Owner | Status |
|---|---|---|
| Exact top-down angle: pure 90° overhead or slight tilt (5–10°) for depth? | 2d-artist / design | **Open** — pure overhead assumed; slight tilt adds depth but complicates sprite alignment |
| Should traffic cars have a 1-frame "brake light" flash as they enter screen? | design / engineer | Open — adds life but is a new VFX element |
| Biome transition: hard cut or gradient scroll between roadside sceneries? | engineer / technical-artist | Open — hard cut assumed; gradient requires loading two biome atlas sets |
| Player car exhaust trail: persistent pixel particles or static sprite? | 2d-artist / engineer | Open — static 2-frame flip assumed for performance |
| Neon signs in City Night biome: static sprites or simple animation (2-frame flicker)? | 2d-artist | Open — static assumed; flicker is low-cost but adds sprite variants |

---

## 14. Change Log

| Date | Change | Owner | Rationale |
|---|---|---|---|
| 2026-03-31 | v0.1 created | 2d-artist / technical-artist | Initial art bible from creative direction session. Establishes retro top-down racer identity, 3 biome palettes, and review criteria. |
| 2026-03-31 | Camera direction: top-down (not side-scroll) | design | User creative decision — game is a top-down car racer on a highway, not a side-scrolling runner. GDD §9.2 needs update. |
| 2026-03-31 | §9 expanded to full UI Style Guide | ui-ux-designer / 2d-artist | Replaces brief §9 with comprehensive UI palette, typography scale (32/24/16/12px), spacing system (4px base), border radius, button states, panel style, icon rules, and contrast requirements. All colours reference §12 palette. |
