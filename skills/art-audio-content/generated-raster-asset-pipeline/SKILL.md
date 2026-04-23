---
name: generated-raster-asset-pipeline
description: Define acceptance, validation, and runtime integration rules for raster assets generated with image models before they become real project content.
origin: everything-game-dev-code
category: art-audio-content
---

# Generated Raster Asset Pipeline

## Purpose
Define acceptance, validation, and runtime integration rules for raster assets generated with image models so they are safe to adopt as real project content without breaking transparency, layout, readability, or gameplay collisions.

## Use When
- Codex `$imagegen` or another image model is used to create sprites, UI skins, backgrounds, icons, or source art
- generated PNG or WEBP files are being imported into the workspace as real project assets
- placeholder assets are being upgraded to generated raster art
- runtime integration needs explicit display size, anchor, crop, or collision-envelope rules

## Inputs
- art bible or visual direction document
- asset inventory with intended use for each generated asset
- background policy per asset family (`transparent`, `opaque`, or `full-bleed`)
- intended runtime display size per asset
- intended physics or interaction envelope per asset where relevant
- naming and folder conventions from the project pipeline

## Process
1. classify each asset by runtime role: decorative background, sprite, projectile, pickup, UI skin, icon, or concept-only
2. define the acceptance contract before generation:
   - background policy
   - nominal canvas expectation
   - intended runtime display size
   - collision or interaction envelope if gameplay-relevant
   - anchor or pivot expectation
   - trim policy
3. generate the candidate images
4. review the candidates visually before import:
   - no baked checkerboard or mock transparency patterns
   - no accidental text or watermark
   - readable silhouette at target gameplay scale
   - composition matches the intended runtime usage
5. move accepted outputs into the workspace with stable names and paths
6. record the accepted assets in a `generated-assets.json` manifest next to the project or sample
7. integrate them in runtime with explicit display sizing and explicit body sizing where physics applies
8. run `node scripts/validate-generated-assets.js` and the relevant art review command before treating the assets as accepted

## Outputs
- accepted raster assets stored in the workspace
- `generated-assets.json` manifest describing acceptance and integration rules
- explicit runtime mapping for display size, body size, and anchor/pivot where relevant
- validation notes for any manual cleanup or exceptions

## Quality Bar
- transparent assets have real alpha, not baked checkerboard backgrounds
- isolated assets are cropped or trimmed intentionally; accidental padding is documented
- runtime display size is defined separately from source image dimensions
- gameplay body size is defined separately from display size for collidable or projectile assets
- generated assets follow the same naming, review, and replacement rules as hand-authored assets

## Common Failure Modes
- checkerboard or flat background baked into an asset that was supposed to be transparent
- source image dimensions being treated as gameplay size, breaking collisions or layout
- decorative art being reused as a physics shape without an explicit body envelope
- generated buttons or panels accepted without validating corner alpha, 9-slice suitability, or text-safe space
- accepted assets left only in a tool cache rather than copied into the workspace

## Related Agents
- 2d-artist
- technical-artist
- ui-ux-designer
- ui-programmer

## Related Commands
- art-2d-pass
- ui-asset-pass
- verify

## Notes
- Treat generated raster assets as authored content, not as a special exemption from normal pipeline review.
- The acceptance gate is two-part: visual acceptance and runtime integration acceptance.
- Visual acceptance answers "does this look correct?" Runtime integration acceptance answers "can this be used safely at the intended size, pivot, and collision envelope?"
- If the project needs deterministic placeholders rather than final art, use the placeholder pipeline instead.
