# Codex Commands Adapter

This folder maps Codex-facing command use to the shared `commands/` layer.

## Rule
Do not redefine commands here unless Codex-specific prompt structure is truly required.

Each command wrapper should only say:

```markdown
Read `commands/<name>.md` and execute it as instructed.
```

## How Codex should execute commands
When a user types `/plan`, `/gdd`, `/unity-review`, or another scaffold command:

1. Resolve the name to `commands/<name>.md`.
2. Read the shared command file.
3. Follow its invoked agents, required skills, expected output, and notes.
4. If a matching wrapper exists here, treat it as a thin routing hint, not the source of truth.
