# web/documentation

Extends `../common/documentation.md` with web-specific content.

## Required Web Notes
- framework and build tool versions, or an explicit no-build ES-module setup
- module entry points and game loop ownership
- save schema and storage backend (localStorage or IndexedDB)
- audio unlock flow and autoplay assumptions
- supported input surfaces (keyboard, touch, gamepad)
- deploy targets and host-specific caveats
- browser-specific workarounds

## Documentation Rules
- Web implementation details belong in web docs, not in engine-neutral shared documents.
- Any architecture that depends on loop structure, rendering mode, asset loading order, storage schema, or host configuration must be documented clearly enough for another web developer to maintain it.
- Framework and dependency upgrades require migration notes when they create risk.

## Done Criteria
Web documentation is acceptable when browser-specific behavior is explicit, maintainable, and separated from common project policy.
