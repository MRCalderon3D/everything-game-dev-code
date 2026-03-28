# Cursor Adapter

This adapter keeps Cursor rules thin and routes behavior back to the shared scaffold.

## Structure
- `.cursor/rules/` — thin rule files that orient Cursor toward shared scaffold layers
- `.cursor/hooks.json` — hook routing to shared scripts
- `.cursor/skills/` — skill routing

## Rule
Never duplicate the shared scaffold into Cursor rules.
Route to `rules/`, `agents/`, `skills/`, and `commands/` in the shared scaffold instead.

## Active rules
- `00-project-context.mdc`
- `01-engine-isolation.mdc`
- `02-workflow.mdc`
- `03-doc-sync.mdc`
