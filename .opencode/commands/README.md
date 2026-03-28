# OpenCode Commands Adapter

OpenCode custom commands should stay thin and route into the shared `commands/` layer.

## Recommended commands
- `/plan`
- `/verify`
- `/engine-review`

## Rule
Do not fork workflow definitions here unless OpenCode requires a truly different command UX.
