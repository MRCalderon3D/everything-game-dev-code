# PirateInvadersImagesGen

`PirateInvadersImagesGen` is a Codex-focused variant of `samples/PirateInvaders`.

It keeps the original Phaser gameplay and structure, but replaces the runtime-generated
placeholder textures with raster assets generated through Codex `$imagegen` and copied into
the sample workspace.

## What this sample proves

- Codex-generated PNG assets can replace procedural placeholder graphics in a real scaffold sample.
- The accepted outputs can move from `$CODEX_HOME/generated_images/...` into the repository and become project assets.
- The game can preserve the same texture keys and almost all gameplay code while swapping the visual pipeline.

## Asset workflow used

1. Start from the existing `PirateInvaders` sample.
2. Clone it into `PirateInvadersImagesGen`.
3. Generate raster assets with Codex `$imagegen`.
4. Copy the accepted images into `public/assets/images/`.
5. Preload those assets in `BootScene`.
6. Preserve the original texture keys (`player`, `sloop`, `button`, etc.) so the rest of the game logic stays stable.
7. Apply fixed display sizes in code so gameplay does not depend on the generated image dimensions.

## Included generated assets

- `player.png`
- `sloop.png`
- `brigantine.png`
- `galleon.png`
- `player-bullet.png`
- `enemy-bullet.png`
- `powerup.png`
- `life-icon.png`
- `button.png`
- `button-hover.png`
- `menu-background.png`
- `battle-background.png`
- `ui-bar-frame.png`
- `ui-bar-fill.png`

## Run

```bash
cd samples/PirateInvadersImagesGen
npm install
npm run dev
```

## Build

```bash
cd samples/PirateInvadersImagesGen
npm run build
```

## Notes

- `src/utils/GeneratedAssetConfig.js` is the small integration layer for image-based assets.
- `src/utils/AssetGenerator.js` remains from the original sample as historical context, but this variant does not use it at runtime.
- This is intentionally a sample-sized workflow: it demonstrates how `$imagegen` integrates into the scaffold without introducing engine-specific editor tooling.
