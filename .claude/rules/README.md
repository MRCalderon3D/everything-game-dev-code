# Claude Rules Adapter

Claude should treat `rules/` as the authoritative behavior layer.

## Resolution order
1. `rules/common/`
2. one engine-specific layer only: `rules/unity/`, `rules/unreal/`, `rules/godot/`, or `rules/web/`

## Never do this
- combine rules from two different engine layers (Unity, Unreal, Godot, web) in the same implementation pass

## Goal
Keep Claude behavior aligned with the scaffold while preventing cross-engine contamination.
