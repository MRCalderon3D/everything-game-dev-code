# Web

Extends `rules/common/` with web-specific conventions.

## Layering
- `rules/common/` defines engine-neutral policy.
- `rules/web/` adds browser and HTML5-only implementation rules.
- Web rules must never prescribe patterns from the other engine layers.

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
