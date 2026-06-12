# Unreal

Extends `rules/common/` with Unreal-specific conventions.

## Layering
- `rules/common/` defines engine-neutral policy.
- `rules/unreal/` adds Unreal-only implementation rules.
- Unreal rules must never prescribe patterns from the other engine layers.

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
