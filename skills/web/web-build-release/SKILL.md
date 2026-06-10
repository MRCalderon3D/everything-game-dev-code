---
name: web-build-release
description: Configure build tooling and ship browser game builds to static hosts with repeatable release hygiene.
origin: everything-game-dev-code
category: web
---

# Web Build and Release

## Purpose
Configure build tooling and ship browser game builds to static hosts with repeatable release hygiene.

## Use When
- choosing or normalizing the build setup for a browser game
- preparing a release for a static host such as itch.io or GitHub Pages
- builds work locally but break after upload

## Inputs
- toolchain decision (vite-style bundler or no-build ES modules)
- target hosts and their constraints (zip upload, subpath serving, file size limits)
- asset inventory and total payload size
- versioning and changelog conventions

## Process
1. decide the toolchain by need: a bundler when the project wants TypeScript, hashed assets, and minification; no-build ES modules when simplicity wins — and serve both through a local static server in development
2. configure the base path for the target host: relative or subpath-aware asset URLs so the build works when not served from the domain root
3. produce a clean production build: minified code, hashed asset filenames for cache busting, source maps kept out of the player payload but archived for debugging
4. package per host: a zip with the entry HTML at its root for itch.io-style uploads, or a published branch or workflow for GitHub Pages-style hosting
5. stamp the build with a version visible in-game or in the console, tag the release, update the changelog, and smoke-test the uploaded build in a fresh browser profile before announcing

## Outputs
- toolchain decision record
- build configuration with base-path notes
- per-host packaging checklist
- release log entry with version, tag, and smoke-test result

## Quality Bar
- the production build loads from a subpath host with zero 404s on assets or modules
- total payload is known and justified; oversized assets are compressed or split before upload
- every release is reproducible from a tag: same source, same config, same output
- the uploaded build — not the local one — is smoke-tested on at least one desktop and one mobile browser
- players receive updated files after a release; stale caching is defeated by hashed filenames or explicit cache-control

## Common Failure Modes
- absolute root-relative URLs that pass locally and 404 on a subpath host
- zipping a parent folder so the entry HTML is nested and the host cannot find it
- shipping unminified development builds with source maps and debug flags to players
- releasing without testing the actual uploaded artifact, then discovering a missing case-sensitive asset path
- no version stamp anywhere, making player bug reports impossible to map to a build

## Related Agents
- build-engineer
- web-reviewer
- qa-lead

## Related Commands
- web-setup
- web-build-fix
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- Case sensitivity differs between development machines and static hosts; treat asset path casing as load-bearing.
