# Godot Build and Release

## Purpose
Define build, export, packaging, and release quality expectations for Godot projects.

## Scope
Applies to local builds, CI exports, release candidates, store-ready packages, and post-release hotfixes.

## Build Rules
- Export presets must be source-controlled and reviewed.
- Every supported platform must have a documented export path, required templates, signing requirements, and release checklist.
- Release builds must be reproducible from committed configuration.

## Release Quality Gates
- Verify startup flow, save compatibility, input behavior, critical performance metrics, and platform-specific compliance before release.
- Confirm that debug-only tools, cheat paths, development logging, and test data are removed or gated.
- Crash reporting, telemetry, and version metadata must be validated in release candidates where applicable.

## Hotfix Rules
- Hotfix scope must be minimal and traceable.
- Save-data, export preset, plugin, and platform integration changes require explicit risk review.

## Done Criteria
Godot build and release readiness is reached when exports are reproducible, platform requirements are documented, and release blockers are visible before shipment.
