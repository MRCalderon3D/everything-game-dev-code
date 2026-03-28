# Claude Team Adapter

Use the shared `agents/` folder as the specialist-role source of truth.

## Routing guidance
- planning and decomposition -> `planner`, `producer`
- player-facing design -> `gdd-designer`, `systems-designer`, `combat-designer`, `level-designer`, `narrative-designer`, `ui-ux-designer`
- engineering -> `technical-design-lead`, `architect`, engine programmers, review roles
- quality/release -> `qa-lead`, `performance-reviewer`, `release-manager`, `console-compliance-reviewer`

## Constraint
Claude-specific delegation must preserve the same ownership boundaries defined in `agents/`.
