# Unity Packages and Dependencies

## Purpose
Define package governance for Unity packages, third-party SDKs, plugins, and external dependencies.

## Scope
Applies to packages from Unity, Git sources, scoped registries, asset-store imports, and manually integrated SDKs.

## Core Rules
- Every dependency must have a reason to exist, an owner, and a review trail.
- Prefer fewer, well-understood dependencies over overlapping toolkits.
- Dependency choices must consider platform coverage, maintenance risk, licensing, and upgrade burden.

## Version Rules
- Package versions must be explicit and reproducible.
- Upgrade decisions should be bundled with compatibility notes and regression plans.
- Avoid opportunistic upgrades during late production unless risk is accepted.

## Integration Rules
- Third-party code should be isolated from gameplay code through wrappers or adapters when future replacement risk is non-trivial.
- Store-bought packages must be evaluated for source control impact, namespace hygiene, update strategy, and code quality.
- External SDK initialization must be controlled and testable.

## Risk Triggers
- Unity major/minor upgrades
- render pipeline changes
- input system changes
- mobile services and platform SDK updates
- analytics, ads, commerce, or online-service package changes

## Documentation
- Maintain a dependency inventory with owner, purpose, source, version, and risk notes.
- Record package-specific setup steps and known platform caveats.

## Done Criteria
Unity dependencies are healthy when they are justified, owned, reproducible, and isolated enough to manage change safely.
