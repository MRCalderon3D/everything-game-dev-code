---
name: tilemap-pipeline
description: Define tileset creation, auto-tile rules, collision shapes, and tilemap configuration for 2D levels.
origin: everything-game-dev-code
category: art-audio-content
---

# Tilemap Pipeline

## Purpose
Define tileset creation, auto-tile rules, collision shapes, and tilemap configuration so 2D levels are buildable, consistent, and performant.

## Use When
- the project uses tile-based level construction
- a new tileset is being created or an existing one extended
- auto-tile or rule-tile behavior needs standardization
- tile collisions or sorting layers need validation

## Inputs
- level design requirements (tile size, grid dimensions, layer count)
- art bible or visual direction for environment tiles
- platform constraints (max tilemap size, draw call budget)
- collision requirements per tile type

## Process
1. define tile size, grid unit, and layer naming convention
2. create or validate tileset layout (rows, columns, padding, tile variants)
3. configure auto-tile or rule-tile adjacency rules
4. assign collision shapes and physics layers per tile type
5. validate tilemap rendering, sorting order, and draw call count

## Outputs
- tileset specification (tile size, layout, variant rules)
- auto-tile adjacency configuration
- collision shape mapping per tile type
- tilemap layer naming and sorting convention

## Quality Bar
- every tile in the set has correct adjacency rules — no visual seams
- collision shapes match the visual tile boundaries
- tilemap draw calls stay within the platform budget
- layer naming and sorting order are documented and enforced

## Common Failure Modes
- tile seams caused by incorrect padding or filtering settings
- auto-tile rules that produce visual artifacts at certain adjacency combinations
- collision shapes that do not match the visual boundary, causing gameplay bugs
- unbounded tilemap size that causes memory or rendering spikes

## Related Agents
- 2d-artist
- level-designer
- performance-reviewer

## Related Commands
- art-2d-pass
- level-beat
- perf-budget

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
