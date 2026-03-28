---
inclusion: always
---

# Project Structure

## Root source of truth
- `rules/common/` for engine-neutral policy
- one engine-specific rules layer for implementation
- `agents/` for role ownership
- `commands/` for entry points
- `skills/` for repeatable execution
- `hooks/` for automation and summaries

## Structure rule
Do not duplicate the scaffold into Kiro steering files. Use steering files to point to the scaffold.
