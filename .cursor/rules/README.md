# Cursor Rules Adapter

Cursor uses `.cursor/rules/` as a project rules location. This adapter keeps the active Cursor rules thin and points back to the shared scaffold.

## Active rule files
- `00-project-context.mdc`
- `01-engine-isolation.mdc`
- `02-workflow.mdc`
- `03-doc-sync.mdc`

## Rule
Do not duplicate the whole scaffold into Cursor rules. Use Cursor rules to route behavior into the shared layers.
