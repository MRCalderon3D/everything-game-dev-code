---
name: web-project-structure
description: Organize a web game project so the entry point, modules, assets, configuration, and tests stay predictable.
origin: everything-game-dev-code
category: web
---

# Web Project Structure

## Purpose
Organize a web game project so the entry point, modules, assets, configuration, and tests stay predictable.

## Use When
- starting a new browser game or normalizing an existing one
- a single main script is accumulating unrelated systems
- asset paths or build configuration are drifting between dev and deploy

## Inputs
- current layout and entry HTML
- chosen toolchain (vite-style bundler or no-build ES modules)
- asset inventory (sprites, atlases, audio, fonts, data)
- test and deploy targets

## Process
1. keep a single entry HTML plus a bootstrap module that wires systems, separate from gameplay code
2. split source into modules by system or feature (loop, input, rendering, audio, scenes, save) rather than one monolithic file
3. separate source art and working files from runtime-ready assets, and group runtime assets by type with stable relative paths
4. make the toolchain explicit: commit bundler config, or document the no-build setup including the local static server used for development
5. place tests for pure logic where they can run without a browser, and document naming and ownership rules for each folder

## Outputs
- project structure map
- folder and naming rules
- toolchain and local-server notes
- migration cautions for moves and renames

## Quality Bar
- the entry HTML, bootstrap module, and gameplay systems are distinguishable at a glance
- runtime assets are separated from source art and referenced through stable, relative paths
- the project runs from a local static server in development, never from direct file opening
- asset and module paths survive both dev serving and a static-host deploy base path
- pure game logic is importable by tests without a DOM

## Common Failure Modes
- a monolithic main script that mixes loop, rendering, input, and state until nothing is reusable
- absolute root paths that work in dev but break on subpath static hosts
- source art, exports, and runtime atlases mixed in one folder so nobody knows what ships
- bundler-only assumptions (import aliases, asset transforms) baked into code that was meant to stay no-build
- tests that cannot run because logic modules import browser globals at load time

## Related Agents
- architect
- gameplay-programmer
- web-reviewer

## Related Commands
- web-setup
- web-review
- web-scene-audit

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If a framework such as Phaser materially changes the layout, record the framework-specific deviation explicitly instead of letting it silently override these conventions.
