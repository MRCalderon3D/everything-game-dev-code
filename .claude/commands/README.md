# Claude Commands Adapter

This folder maps Claude-facing command use to the shared `/commands` layer.

## Rule
Do not redefine commands here unless Claude-specific prompt structure is truly required.

## Command source of truth
- `commands/plan.md`
- `commands/gdd.md`
- `commands/tech-design.md`
- `commands/verify.md`
- engine-specific commands under `commands/`

## Adapter rule
When a Claude workflow mentions a command, resolve it to the shared command file with the same name.
