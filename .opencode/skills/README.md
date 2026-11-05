# OpenCode Skills Adapter

OpenCode should resolve reusable workflows to the shared `skills/` tree.

## How to use repo skills
- Use command `Required Skills` sections to decide which `skills/**/SKILL.md` files to read.
- Load only the skill files needed for the current task.
- Follow the skill body after it is selected; do not bulk-load the entire skills tree.
- Keep generated or installed OpenCode skills synchronized with the shared repo skill source.

## OpenCode skill compatibility
The repo skill format already uses `SKILL.md`, so it can be adapted into OpenCode skills or plugins. The shared `skills/` tree remains the source of truth; generated OpenCode skill/plugin packaging should point back here or be regenerated from it.

## Engine isolation
When loading skills, prefer engine-neutral skills first. Add exactly one of `skills/unity/`, `skills/unreal/`, or `skills/godot/` when implementation is engine-specific.
