# unity/documentation

Extends `../common/documentation.md` with Unity-specific content.

## Required Unity Notes
- Unity version and important package versions
- asmdef and module impact
- scene and prefab ownership
- serialization or save/load impact
- build configuration implications
- platform-specific caveats
- editor tooling changes

## Documentation Rules
- Unity implementation details belong in Unity docs, not in engine-neutral shared documents.
- Any architecture that depends on scene setup, prefab composition, package behavior, or inspector configuration must be documented clearly enough for another Unity engineer to maintain it.
- Unity upgrades and package upgrades require migration notes when they create risk.

## Done Criteria
Unity documentation is acceptable when engine-specific behavior is explicit, maintainable, and separated from common project policy.
