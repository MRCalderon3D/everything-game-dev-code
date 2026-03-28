# Cursor Hooks Adapter

Cursor hooks should forward to the shared `scripts/hooks/` implementations where possible.

## Intent
- pre-edit warning when design or docs drift is likely
- engine profile guard before risky shell commands
- post-action capture for build, scene, or asset issues
- session summary on stop

## Rule
Keep Cursor hooks thin. Shared logic belongs in `scripts/hooks/`.
