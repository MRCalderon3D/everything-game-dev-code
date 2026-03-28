# Godot QA

## Purpose
Define Godot-specific QA expectations for scene integrity, runtime behavior, exports, saves, and platform regressions.

## Scope
Applies to functional testing, exploratory testing, regression coverage, bug reporting, and release evaluation.

## QA Priorities
- Cover scene loading, node wiring, signals, save/load, autoload lifecycle, UI navigation, input remapping, and export behavior.
- Focus regression coverage on features with cross-scene dependencies or platform-specific differences.

## Bug Reporting Rules
- Reports must identify scene or feature entry point, setup conditions, expected behavior, actual behavior, and reproduction steps.
- Capture whether failures appear editor-only, export-only, or both.
- Note whether a bug is deterministic, timing-sensitive, or platform-specific.

## Release Checks
- Validate cold boot, resumed play, save migration, localization, controller behavior, and critical content flow on target platforms.
- Verify that project settings and export settings align with release intent.

## Done Criteria
Godot QA is effective when bugs are reproducible, scene-specific risk is visible, and release decisions are grounded in target-platform evidence.
