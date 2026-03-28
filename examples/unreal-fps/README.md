# Unreal FPS Example

## Purpose
This example shows how the scaffold could be installed for an Unreal first-person shooter with networked gameplay, packaged builds, and strong separation between design intent and engine implementation.

## Example Product
**Project Name:** Shardline Zero
**Genre:** First-person shooter
**Engine:** Unreal
**Project Size:** Mid-size team

## Recommended Installed Packs
- baseline rules
- baseline agents
- baseline commands
- baseline hooks
- baseline docs
- engine: unreal
- capability: design
- capability: engineering
- capability: qa
- capability: production
- capability: multiplayer

## Primary Agents
- planner
- combat-designer
- network-programmer
- unreal-reviewer
- unreal-build-resolver
- qa-lead
- release-manager

## Primary Commands
- `/plan`
- `/combat-design`
- `/tech-design`
- `/multiplayer-review`
- `/unreal-review`
- `/unreal-blueprint-audit`
- `/release-check`

## High-Value Skills
- `unreal-project-structure`
- `unreal-blueprint-patterns`
- `unreal-gameplay-framework`
- `unreal-replication`
- `multiplayer-netcode-patterns`
- `performance-budgeting`
- `release-readiness`

## Example Architecture Concerns
- authority boundaries between server and client
- replication ownership
- map flow and spawn flow
- weapon state and hit validation
- menu-to-match-to-postmatch transitions
- packaged build diagnostics

## Typical Workflow
1. Define player-facing weapon and movement goals in the GDD.
2. Create a technical design for replication, ownership, and rollback/prediction assumptions if needed.
3. Use `/multiplayer-review` before major network architecture changes.
4. Run `/unreal-review` before milestone branches or platform packaging pushes.
5. Track packaged-build regressions separately from editor-only observations.

## Risks to Watch
- Blueprint logic hiding authority boundaries
- packaged build issues not visible in editor
- replication cost scaling with encounter density
- map and asset organization drift
- plugin or engine upgrade instability
