# Cursor Skills Adapter

Cursor should treat the shared `skills/` tree as the reusable workflow source.

## Selection guidance
- pick the smallest matching workflow skill first
- add an engine-specific skill only when the task is engine-specific
- keep Cursor rule files small and defer the heavy guidance to `skills/`
