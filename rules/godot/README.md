# Godot

Extends `rules/common/` with Godot-specific conventions.

## Layering
- `rules/common/` defines engine-neutral policy.
- `rules/godot/` adds Godot-only implementation rules.
- Godot rules must never prescribe patterns from the other engine layers.

## Coverage
- coding style
- project structure
- testing
- patterns
- performance
- memory
- build and release
- asset pipeline
- tooling
- UI
- networking
- documentation
