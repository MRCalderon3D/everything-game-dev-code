# Unity Action RPG Example

## Purpose
This example shows how the scaffold could be installed for a Unity action RPG with combat, progression, authored content, and release-oriented production workflows.

## Example Product
**Project Name:** Ashen Veil  
**Genre:** Action RPG  
**Engine:** Unity  
**Project Size:** Small-to-mid team

## Recommended Installed Packs
- baseline rules
- baseline agents
- baseline commands
- baseline hooks
- baseline docs
- engine: unity
- capability: design
- capability: engineering
- capability: qa
- capability: production
- capability: audio-art

## Primary Agents
- planner
- systems-designer
- combat-designer
- gameplay-programmer
- unity-reviewer
- qa-lead
- technical-artist
- release-manager

## Primary Commands
- `/plan`
- `/gdd`
- `/tech-design`
- `/combat-design`
- `/unity-setup`
- `/unity-review`
- `/perf-budget`
- `/release-check`

## High-Value Skills
- `unity-project-structure`
- `unity-gameplay-patterns`
- `unity-performance`
- `unity-addressables`
- `combat-design`
- `progression-design`
- `qa-test-matrix`

## Example Production Setup
- authored combat encounters
- ability unlock progression
- inventory and save/load systems
- UI/HUD with controller support
- performance budgets for gameplay and town hub
- repeatable build pipeline for milestone candidates

## Typical Workflow
1. Use `/gdd` to define player-facing systems before implementation.
2. Use `/tech-design` before save/load, inventory, or ability-system architecture changes.
3. Use `/unity-scene-audit` and `/unity-review` before milestone cuts.
4. Keep combat tuning, telemetry questions, and playtest findings synchronized.
5. Use `/release-check` before any external demo or storefront build.

## Risks to Watch
- prefab sprawl
- ScriptableObject misuse as mutable runtime state
- Addressables configuration drift
- scene initialization order bugs
- memory spikes during hub-to-combat transitions
