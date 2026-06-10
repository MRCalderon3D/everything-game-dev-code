# Web Build and Release

## Purpose
Define build, bundling, packaging, and release quality expectations for web projects.

## Scope
Applies to local builds, no-build ES-module projects, CI builds, release candidates, and published updates.

## Build Rules
- Choose the build approach intentionally: a bundler such as vite for dependency-heavy projects, or no-build ES modules served from a local server for small vanilla projects.
- Single-file versus modular output must be a documented decision driven by the deploy target.
- Release builds must be reproducible from committed configuration and a clean dependency install.
- Built output must be regenerable from source; never hand-edit `dist/` artifacts.

## Release Quality Gates
- Verify startup from the deployed path, not only the dev server, plus asset loading, save compatibility, and audio unlock before release.
- Source maps must be generated; decide explicitly whether they ship publicly or stay internal.
- Confirm debug overlays, cheat hooks, and verbose logging are removed or gated in release output.

## Hotfix Rules
- Hotfix scope must be minimal and traceable.
- Cache-busting strategy must guarantee players receive the fix instead of a stale cached build.

## Done Criteria
Web build and release readiness is reached when builds are reproducible, output decisions are documented, and release blockers are visible before publishing.
