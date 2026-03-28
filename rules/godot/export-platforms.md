# Godot Export Platforms

## Purpose
Define platform export expectations for desktop, console, mobile, and web targets in Godot projects.

## Scope
Applies to export presets, platform toggles, feature tags, assets, permissions, signing, and runtime compatibility checks.

## Platform Rules
- Platform support must be explicit rather than assumed.
- Per-platform differences in rendering, input, file access, memory, networking, and permissions must be documented.
- Platform-specific workarounds must be isolated and justified.

## Configuration Rules
- Use export presets and project settings intentionally; avoid undocumented local-only changes.
- Feature tags and platform-specific code paths must be easy to trace and test.
- Store metadata, icons, splash screens, and packaging assets must be versioned and validated.

## Risk Areas
- Web, mobile, and console targets may impose different filesystem, threading, rendering, and packaging constraints.
- Platform conditionals must not silently break save flow, input mappings, or service integration.

## Done Criteria
Platform export support is ready when target differences are documented, configured in source control, and validated before release.
