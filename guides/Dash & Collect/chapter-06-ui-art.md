# Chapter 6 — UI Art Assets

**Goal:** Generate styled UI visual assets via Claude-authored Editor scripts — buttons, panels, icons, progress bars, and screen transitions — replacing the default Unity UI look with a themed visual layer, and validate with `/ui-asset-pass`.

**Context:** `contexts/production.md` (continued)

> **Start a new Claude Code session for this chapter.**
> Although this chapter shares the production context with Chapters 3–5, a fresh session
> keeps the UI art work isolated from gameplay art and systems implementation.
>
> **Codex note:** the same chapter works in Codex. Replace "Claude" with "Codex" in the prompts below. When you want raster UI source art, HUD mockups, icon sheets, or menu background exploration, use `$imagegen` and then move the accepted output into the project workspace using the UI asset pipeline naming and folder rules.

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/production.md` | Keeps `2d-artist`, `ui-ux-designer`, `ui-programmer` as active agents |
| `commands/` | `/ui-asset-pass` | Review all UI visual assets against pipeline conventions |
| `commands/` | `/ui-flow-review` | Review UX logic and navigation (complements visual review) |
| `commands/` | `/perf-budget` | Validate UI atlas size and animation memory |
| `agents/` | `2d-artist`, `ui-ux-designer`, `ui-programmer`, `accessibility-reviewer` | UI art pipeline agents |
| `skills/` | `skills/art-audio-content/ui-asset-pipeline/SKILL.md` | UI asset import, 9-slice, atlas, theming |
| `skills/` | `skills/art-audio-content/ui-animation-pipeline/SKILL.md` | UI transition and feedback animations |
| `skills/` | `skills/art-audio-content/placeholder-asset-pipeline/SKILL.md` | Drop-in replacement validation |
| `skills/` | `skills/art-audio-content/art-bible/SKILL.md` | Visual direction enforcement |
| `skills/` | `skills/engineering-common/ui-hud-patterns/SKILL.md` | HUD architecture |
| `skills/` | `skills/design/accessibility-design/SKILL.md` | Accessibility compliance |
| `rules/` | `rules/common/ui-ux.md` | HUD clarity, navigation |
| `rules/` | `rules/common/accessibility.md` | Accessibility standards |
| `rules/` | `rules/unity/ui.md` | Unity UI specifics |
| `hooks/` | `asset-size-warning` | Fires when texture assets exceed size budget |

---

## Steps

### 1. Load the production context

In your new Claude Code session, tell Claude to read and apply the production context:

```
Read contexts/production.md and apply it to this session. Also read the art bible — it is likely at design/ART-BIBLE.md or a similar path in your project — and use it as the visual reference for all UI art work in this chapter.
```

This activates `2d-artist`, `ui-ux-designer`, and `ui-programmer` as the lead agents.

---

## Pre-requisite: UI Style Guide

Before generating any UI assets, extend the Art Bible with a UI section. If it does not
have one yet, ask Claude to create it:

```
/plan Extend the Art Bible for "Dash & Collect" with a UI Style Guide section. Save to design/ART-BIBLE.md (append or update). Define:
- UI palette: derived from gameplay palette but with higher contrast for readability
- Typography: font family, sizes for title (32px), subtitle (24px), body (16px), label (12px)
- Spacing: base unit (4px), padding (8px, 16px), margins (16px)
- Border radius: 4px for buttons, 8px for panels
- Button states: normal, hover, pressed, disabled (color shifts per state)
- Panel style: semi-transparent dark background with 1px border
- Icon style: 16x16 pixel art icons matching gameplay palette
```

**UI Style Guide excerpt:**

```
## UI Visual Identity
Clean, readable, pixel-consistent. UI elements use the same pixel grid as gameplay
(16 PPU) but with higher contrast backgrounds for legibility.

## UI Palette
| Role           | Color     | Hex     |
|----------------|-----------|---------|
| Panel BG       | Dark      | #0F172A |
| Panel Border   | Slate     | #334155 |
| Button Normal  | Blue      | #2563EB |
| Button Hover   | Lighter   | #3B82F6 |
| Button Pressed | Darker    | #1D4ED8 |
| Button Disabled| Grey      | #475569 |
| Text Primary   | White     | #F8FAFC |
| Text Secondary | Light     | #94A3B8 |
| Accent         | Yellow    | #EAB308 |
| Danger         | Red       | #EF4444 |

## Typography
| Usage    | Size | Weight |
|----------|------|--------|
| Title    | 32px | Bold   |
| Subtitle | 24px | Bold   |
| Body     | 16px | Normal |
| Label    | 12px | Normal |

## Button Specifications
| State    | BG Color | Text Color | Border |
|----------|----------|------------|--------|
| Normal   | #2563EB  | #F8FAFC    | none   |
| Hover    | #3B82F6  | #F8FAFC    | none   |
| Pressed  | #1D4ED8  | #F8FAFC    | none   |
| Disabled | #475569  | #94A3B8    | none   |

## Spacing
Base unit: 4px. Padding: 8px (small), 16px (normal). Margins: 16px.
Border radius: 4px (buttons), 8px (panels), 0px (pixel-art icons).
```

---

## Codex Option: Generate UI Mockups or Source PNGs with `$imagegen`

If you are using Codex and want UI source art rather than only pixel-by-pixel Editor-script output,
use `$imagegen` after the UI Style Guide exists. This is especially useful for menu backgrounds,
HUD mockups, button/panel skin exploration, or icon source sheets that will later be imported and
validated by the normal UI pipeline.

Example Codex prompt:

```
$imagegen Create a UI concept sheet for "Dash & Collect" using the UI Style Guide in design/ART-BIBLE.md.
- Include: menu background sample, dialog panel, HUD panel, play button states, retry button states, coin icon, pause icon
- Style: pixel-consistent UI, high contrast, same palette family as gameplay art
- Layout: clean concept sheet with each element isolated and readable
- No branding text, no watermark
```

After approving a result, import the selected assets into `Assets/_Project/Art/UI/[Category]/`
with the same names the UI asset pipeline expects.

---

## Step 2: Define the UI asset pipeline

Ask Claude to establish the UI asset conventions:

```
Using skills/art-audio-content/ui-asset-pipeline/SKILL.md, define the UI asset pipeline for "Dash & Collect":
- Naming convention: ui-[category]-[element]-[state].png (e.g. ui-btn-play-normal.png)
- Folder structure: Assets/_Project/Art/UI/[Category]/
- Categories: Buttons, Panels, Icons, Bars, Backgrounds
- Import settings: Point filter, no compression, Sprite mode Single (or Multiple for state sheets)
- 9-slice: enabled for buttons and panels, borders defined per element
- Atlas: single UI atlas, max 1024x1024
- Theme: all colors referenced from UI Style Guide, no hardcoded per-element colors
```

**Expected output:** a UI asset pipeline document with naming, folders, import settings,
9-slice specs, and theme rules.

---

## Step 3: Generate UI visual assets via Editor script

Claude generates all UI assets programmatically — buttons, panels, icons, and bars drawn
pixel by pixel using `Texture2D.SetPixel`, saved as PNG, with import settings and 9-slice
borders configured automatically.

```
Using skills/art-audio-content/ui-asset-pipeline/SKILL.md and the UI Style Guide, generate a Unity Editor script that creates all UI visual assets for "Dash & Collect". The script must:

1. Generate button sprites (4 states each: normal, hover, pressed, disabled):
   - Play button: 64x24 rounded rectangle with UI palette colors per state
   - Retry button: 64x24 same style
   - Main Menu button: 80x24 same style
   - Generic button: 64x24 for reuse
   Each button set saved as separate PNGs: ui-btn-play-normal.png, ui-btn-play-hover.png, etc.

2. Generate panel sprites (9-slice ready):
   - Dialog panel: 96x96 dark semi-transparent with 1px slate border, 8px border radius
   - HUD panel: 128x32 dark semi-transparent with no border radius (pixel-sharp)
   - Tooltip panel: 64x32 dark with 1px border
   Each saved as single PNG with 9-slice borders set in import settings.

3. Generate icon sprites (16x16 pixel art):
   - Coin icon: yellow coin matching gameplay coin style
   - Heart icon: red heart for lives (if applicable)
   - Star icon: yellow star for score/rating
   - Settings gear icon: white gear silhouette
   - Sound on/off icons: speaker with/without waves
   - Pause icon: two vertical bars
   Each saved as individual PNG in Art/UI/Icons/

4. Generate progress bar sprites:
   - Bar background: 128x8 dark rounded rectangle
   - Bar fill: 128x8 matching accent color, 9-slice for variable width
   - Bar border: 128x8 slate border only, 9-slice

5. Generate screen background:
   - Menu background: 320x180 dark gradient matching game background but slightly different for visual separation
   - Game over overlay: 320x180 semi-transparent black (50% opacity)

6. Apply import settings: Point filter, no compression, correct 9-slice borders per element
7. Save all assets to Assets/_Project/Art/UI/[Category]/

Place the script at Assets/_Project/Editor/UIAssetGenerator.cs with a menu item at Tools -> Generate UI Assets.
```

Codex alternative for source PNGs:

```
$imagegen Create final UI source assets for "Dash & Collect".
Use case: ui-mockup
Asset type: Unity UI sprites imported as PNG
Primary request: generate button states, 9-slice-ready panels, HUD icons, progress bar parts, and menu backgrounds
Style/medium: crisp pixel UI, readable at 320x180 base resolution, high-contrast palette from the UI Style Guide
Composition/framing: isolated assets on transparent backgrounds except for menu and overlay backgrounds
Constraints: keep naming and replacement compatibility with the UI asset pipeline; no text baked into reusable components; no watermark
```

Run the script in Unity via **Tools -> Generate UI Assets**. Verify:
- All sprites appear in the Project window under `Art/UI/`
- 9-slice sprites scale correctly when resized in the Scene view
- Button state sprites are visually distinct (color shift per state)
- Icons are crisp at 16x16

---

## Step 4: Wire UI assets to existing UI components

The UI systems (MainMenuController, HUDController, GameOverController) were built in
Chapter 4 with default Unity UI styling. Now wire the generated assets:

```
Generate a Unity Editor script that wires the UI assets to the existing UI components for "Dash & Collect":
1. MainMenu scene:
   - Set Play button Image.sprite to ui-btn-play-normal.png
   - Configure Button component SpriteState (highlighted = hover, pressed = pressed, disabled = disabled)
   - Set background panel Image.sprite to dialog panel with 9-slice
   - Set title text font size to 32px, color to Text Primary
   - Set high score text font size to 16px, color to Text Secondary

2. Gameplay scene HUD:
   - Set score panel Image.sprite to HUD panel with 9-slice
   - Set coin icon Image.sprite to ui-icon-coin.png
   - Set score/coin text color to Text Primary, size 16px

3. GameOver overlay:
   - Set overlay background Image.sprite to game over overlay
   - Set result panel Image.sprite to dialog panel with 9-slice
   - Set Retry and Main Menu buttons with button state sprites
   - Set final score text to 24px, color Accent

Place the script at Assets/_Project/Editor/UIAssetWirer.cs with a menu item at Tools -> Wire UI Assets.
```

Run the script. Verify the UI looks themed and consistent in Play mode.

---

## Step 5: Generate UI animations via code

Claude generates UI animations as code-driven tweens — no sprite sheet animations for UI.
This keeps animations resolution-independent and easy to tune.

```
Using skills/art-audio-content/ui-animation-pipeline/SKILL.md, generate UI animation utilities and screen transitions for "Dash & Collect":

1. UIAnimator utility class with static methods:
   - FadeIn(CanvasGroup, duration, easing) — alpha 0→1
   - FadeOut(CanvasGroup, duration, easing) — alpha 1→0
   - ScaleIn(Transform, duration, easing) — scale 0→1 with overshoot
   - SlideIn(RectTransform, direction, duration, easing) — slide from off-screen
   - PunchScale(Transform, intensity, duration) — quick scale punch for feedback

2. Button feedback:
   - On hover: ScaleIn to 1.05x over 80ms (ease out)
   - On press: PunchScale 0.95x over 60ms
   - On release: return to 1.0x over 100ms

3. Screen transitions:
   - MainMenu → Gameplay: FadeOut menu (200ms) → load scene → FadeIn HUD (200ms)
   - GameOver appear: ScaleIn overlay panel from 0.8 to 1.0 (250ms, ease out back)
   - GameOver → Retry: FadeOut overlay (150ms) → restart

4. HUD feedback:
   - Score change: PunchScale score text (100ms)
   - Coin collect: PunchScale coin icon + brief yellow flash (150ms)

5. Reduced-motion fallback:
   - All animations check a static UIAnimator.ReducedMotion flag
   - When true: skip tween, apply final state instantly (opacity or scale jump)
   - Flag saved in PlayerPrefs alongside other accessibility settings

All animations implemented as coroutines — no external tween library required.
```

**Key rule from `ui-animation-pipeline`:** every animation has a defined duration and
easing, and every animation has a reduced-motion fallback.

---

## Step 6: Validate with /ui-asset-pass

Run the full UI visual asset review:

```
/ui-asset-pass Review all UI visual assets for "Dash & Collect": validate naming and import settings against the UI asset pipeline, check 9-slice borders render correctly at all supported resolutions, verify theme consistency across all screens, check animation timing and reduced-motion fallbacks, confirm no default Unity UI styling remains.
```

The `2d-artist` agent checks:

**UI Assets:**
- [ ] All UI sprites follow naming convention `ui-[category]-[element]-[state].png`
- [ ] Import settings: Point filter, no compression for all UI sprites
- [ ] 9-slice borders are correct — no stretching artifacts at min/max resolution
- [ ] All button states (normal, hover, pressed, disabled) are visually distinct

**Theme:**
- [ ] All colors match the UI Style Guide — no hardcoded one-off values
- [ ] Font sizes match the typography spec (title 32, subtitle 24, body 16, label 12)
- [ ] Spacing follows the base unit grid (multiples of 4px)
- [ ] Panel backgrounds use consistent opacity and border treatment

**Animations:**
- [ ] Button feedback responds in under 100ms
- [ ] Screen transitions do not block input for more than 300ms
- [ ] All animations have reduced-motion fallback
- [ ] No animation leaves elements in a stuck mid-state on interruption

**Accessibility:**
- [ ] Minimum contrast ratio between text and background (4.5:1 for body, 3:1 for large text)
- [ ] Minimum touch target size 44x44pt on mobile
- [ ] Reduced-motion flag is persisted and respected across sessions

---

## Step 7: Run UX flow review

Now that the visual layer is complete, run the UX review to ensure the styled UI
still works correctly as a flow:

```
/ui-flow-review Review all menus, HUD, and navigation for "Dash & Collect" with the new UI styling applied. Verify: focus order is correct, back navigation works, no orphaned screens, all buttons have correct listeners, overlay dismissal works.
```

This complements `/ui-asset-pass` (visual) with `/ui-flow-review` (logic and flow).

---

## Milestone Check: UI Art Complete

After all UI visual assets are in place and validated:

- [ ] All UI elements styled with generated assets — no default Unity UI remaining
- [ ] 9-slice elements scale correctly across all supported resolutions
- [ ] Theme is consistent across all screens (menu, HUD, game over)
- [ ] UI animations implemented with correct timing and easing
- [ ] Reduced-motion accessibility option working
- [ ] `/ui-asset-pass` reports zero issues
- [ ] `/ui-flow-review` reports zero issues
- [ ] Game is fully playable and visually polished end to end

This is **Milestone M6**.

Before moving to the next chapter, ask Claude to validate:

```
Read the milestone plan (design/MILESTONE-PLAN.md or similar) and compare it against the UI art assets we have now. List any gaps — missing UI elements, animations, or theme inconsistencies that are not yet complete.
```

Do not proceed to Chapter 7 until all M6 criteria are met.

---

## Scaffold Features in Action (Behind the Scenes)

- Claude generates all UI visual assets via Unity Editor scripts (`Texture2D.SetPixel`) —
  no external design tools needed. The same drop-in replacement path works if you later
  replace generated assets with hand-designed assets
- In Codex, `$imagegen` can be used for mockups or final raster source sheets before the
  normal import, 9-slice, and validation steps
- `/ui-asset-pass` and `/ui-flow-review` are complementary reviews: one checks visual
  quality, the other checks UX logic — running both ensures the full UI is validated
- `skills/art-audio-content/ui-animation-pipeline` enforces that every animation has a
  reduced-motion fallback — accessibility is built into the pipeline, not bolted on
- `rules/common/accessibility.md` is enforced by `accessibility-reviewer` for contrast
  ratios, touch targets, and text sizes
- The `2d-artist` agent covers both gameplay sprites (Chapter 5) and UI assets
  (this chapter) — it owns the full 2D visual pipeline

---

## What You Have After This Chapter

- Claude-generated UI visual assets for all screens (replaceable with hand-designed assets at any time)
- Themed UI with consistent palette, typography, and spacing
- 9-slice sprites for all scalable elements (buttons, panels, bars)
- Pixel art icons for HUD elements
- Code-driven UI animations with reduced-motion fallback
- Both visual and UX validation complete
- Zero manual asset creation — everything generated via Editor scripts

---

## Next

[Chapter 7 — Code Review & Scene Audit](./chapter-07-review.md)
