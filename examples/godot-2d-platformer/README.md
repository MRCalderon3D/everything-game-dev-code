# Godot 2D Platformer Example

## Purpose
This example shows how the scaffold could be installed for a small-to-medium Godot 2D project with tight gameplay loops, authored levels, and moderate tooling needs.

## Example Product
**Project Name:** Clockspring
**Genre:** 2D precision platformer
**Engine:** Godot
**Project Size:** Indie / small team

## Recommended Installed Packs
- baseline rules
- baseline agents
- baseline commands
- baseline hooks
- baseline docs
- engine: godot
- capability: design
- capability: engineering
- capability: qa
- capability: production

## Primary Agents
- planner
- level-designer
- gameplay-programmer
- godot-reviewer
- qa-lead
- doc-updater

## Primary Commands
- `/plan`
- `/vertical-slice`
- `/godot-setup`
- `/godot-review`
- `/godot-scene-audit`
- `/verify`

## High-Value Skills
- `godot-project-structure`
- `godot-scene-architecture`
- `godot-gdscript-standards`
- `godot-performance`
- `level-design`
- `onboarding-tutorial-design`
- `qa-test-matrix`

## Example Folder Intent
- scenes for world and level composition
- scripts for gameplay and tools
- resources for shared data
- ui for menus and HUD
- tests for gameplay-critical validation
- docs for GDD, TDD, playtest, and milestone tracking

## Typical Workflow
1. Use `/plan` for the next gameplay feature.
2. Update the GDD if the player-facing behavior changes.
3. Use `godot-scene-architecture` before creating new scene hierarchies.
4. Validate input, checkpoints, level reset flow, and UI navigation through `/verify`.
5. Capture learnings into reusable skills only after the pattern stabilizes.

## Risks to Watch
- scene sprawl
- signal misuse
- save/load state inconsistency
- physics feel drifting between levels
- editor-only assumptions leaking into export builds

## Included Example Files
- `install-profile.example.json` — recommended scaffold setup for this example
- `docs/playtest-report.md` — sample playtest output for iteration work
- `docs/qa-test-matrix.md` — example verification focus for a level-driven platformer
