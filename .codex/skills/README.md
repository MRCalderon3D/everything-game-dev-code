# Codex Skills Adapter

Codex should resolve reusable workflows to the shared `skills/` tree.

## How to use repo skills
- Use command `Required Skills` sections to decide which `skills/**/SKILL.md` files to read.
- Load only the skill files needed for the current task.
- Follow the skill body after it is selected; do not bulk-load the entire skills tree.
- Keep generated or installed Codex skills synchronized with the shared repo skill source.

## Codex skill compatibility
The repo skill format already uses `SKILL.md`, so it can be adapted into Codex skills or plugins. The shared `skills/` tree remains the source of truth; generated Codex skill/plugin packaging should point back here or be regenerated from it.
