# Unity Addressables and Content Delivery

## Purpose
Define rules for Addressables, remote content, asset grouping, loading discipline, and content update safety in Unity projects.

## Scope
Applies when the project uses Addressables or equivalent Unity content delivery workflows.

## Usage Rules
- Use Addressables when the project benefits from asynchronous loading, memory-aware content management, content catalogs, or post-build content updates.
- Do not adopt Addressables only because it is available; justify the added complexity.
- The team must define which content is local, which is downloadable, and which is patchable before content scale grows.

## Grouping Rules
- Group content by loading lifetime, dependency behavior, platform needs, and update cadence.
- Avoid grouping unrelated assets together if they will always create unnecessary memory retention or patch churn.
- Labels and addresses must follow a documented naming convention.
- Addressable grouping decisions must be reviewable by engineering, technical art, and production.

## Reference Rules
- Prefer explicit addresses, labels, or authored references through approved wrapper patterns.
- Avoid ad hoc string usage scattered through gameplay code.
- Runtime systems must handle missing content, delayed downloads, and invalid catalogs gracefully.
- Content availability assumptions must be explicit for onboarding, progression, and failover flows.

## Build and Update Rules
- Catalog generation and content build steps must be scriptable.
- Remote content environments must be clearly separated for development, QA, staging, and production where relevant.
- Content update workflows must include validation for bundle duplication, dependency growth, and patch size drift.
- Teams must understand the impact of moving assets between groups after release.

## Performance and Memory
- Loading paths must be profiled on representative hardware.
- Long-lived references must be tracked deliberately.
- Release policies must define when assets are unloaded and who owns those lifetimes.
- Large scenes must not silently pin unused bundles through accidental references.

## QA Rules
- Test offline behavior, slow-download behavior, cache invalidation, and corrupted-content handling where relevant.
- Validate first-install flows separately from patch-update flows.
- High-risk content changes require regression coverage around loading, memory spikes, and fallback behavior.

## Documentation
- Document group strategy, labeling rules, environment setup, and release ownership.
- Record known platform limitations and package-version caveats.

## Done Criteria
Addressables usage is ready when content grouping, loading, updating, and fallback behavior are intentional, testable, and owned.
