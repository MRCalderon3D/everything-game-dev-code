# godot/documentation

Extends `../common/documentation.md` with Godot-specific content.

## Required Godot Notes
- Godot version and important addon versions
- scene and script ownership
- autoload and singleton impact
- save/load or resource serialization impact
- export preset implications
- platform-specific caveats
- tooling or addon changes

## Documentation Rules
- Godot implementation details belong in Godot docs, not in engine-neutral shared documents.
- Any architecture that depends on scene setup, node hierarchy assumptions, resource configuration, addon behavior, or export settings must be documented clearly enough for another Godot engineer to maintain it.
- Engine upgrades and addon upgrades require migration notes when they create risk.

## Done Criteria
Godot documentation is acceptable when engine-specific behavior is explicit, maintainable, and separated from common project policy.
