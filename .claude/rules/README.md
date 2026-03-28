# Claude Rules Adapter

Claude should treat `rules/` as the authoritative behavior layer.

## Resolution order
1. `rules/common/`
2. one engine-specific layer only: `rules/unity/` or `rules/unreal/` or `rules/godot/`

## Never do this
- combine Unity and Unreal rules in the same implementation pass
- combine Unity and Godot rules in the same implementation pass
- combine Unreal and Godot rules in the same implementation pass

## Goal
Keep Claude behavior aligned with the scaffold while preventing cross-engine contamination.
