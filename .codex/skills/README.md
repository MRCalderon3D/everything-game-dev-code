# Codex Skills Adapter

Codex should resolve reusable workflows to the shared `skills/` tree.

## How to use repo skills
- Use command `Required Skills` sections to decide which `skills/**/SKILL.md` files to read.
- Load only the skill files needed for the current task.
- Follow the skill body after it is selected; do not bulk-load the entire skills tree.
- Keep generated or installed Codex skills synchronized with the shared repo skill source.

## Codex skill compatibility
The repo skill format already uses `SKILL.md`, so it can be adapted into Codex skills or plugins. The shared `skills/` tree remains the source of truth; generated Codex skill/plugin packaging should point back here or be regenerated from it.

## Pairing repo skills with `$imagegen`
- When Codex needs to generate or edit raster images, pair the built-in `$imagegen` skill with the shared repo skills that define intent and acceptance criteria.
- Start from `art-bible` for visual direction, then use `sprite-pipeline`, `ui-asset-pipeline`, or `placeholder-asset-pipeline` to enforce naming, path, import, and replacement rules.
- Use `$imagegen` for source art, concept sheets, UI mockups, textured backgrounds, and bitmap edits.
- Keep vector/logo-system work, code-generated placeholders, and simple deterministic shapes in the repo-native workflows instead of `$imagegen`.
- Persist any project-bound output inside the workspace rather than leaving it only under `$CODEX_HOME/generated_images/...`.
