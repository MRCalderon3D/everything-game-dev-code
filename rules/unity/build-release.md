# unity/build-release

Extends `../common/build-release.md` with Unity-specific content.

## Build Rules
- Production builds must be scriptable, repeatable, and environment-aware.
- Avoid release-critical manual editor steps.
- Build logs must capture Unity version, target platform, scripting backend, define symbols, and relevant package state.

## Platform Rules
- Treat each target platform as a separate release surface with its own smoke path and risk list.
- Scene lists, Addressables catalogs, localization assets, and platform-specific configuration must be validated before release candidates.

## CI Rules
- Build agents must use approved Unity versions and reproducible package state.
- CI must surface artifacts, logs, version metadata, and ownership for failures.

## Done Criteria
Unity release flow is acceptable when configuration drift is controlled and build failures are diagnosable.
