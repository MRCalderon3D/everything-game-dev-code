# Unity Editor Tooling

## Purpose
Define how custom inspectors, windows, validation tools, import automation, and editor workflows are built and maintained.

## Scope
Applies to all Unity editor extensions and internal production tooling.

## Tooling Principles
- Editor tooling should reduce repeated manual work, not create hidden workflows that only one developer understands.
- Tools must improve reliability, consistency, or iteration speed.
- Tool UX matters; internal tools should still be understandable and safe.

## Implementation Rules
- Editor tooling belongs in editor-only assemblies and folders.
- High-impact tools should validate input and fail safely.
- Avoid destructive operations without confirmation, backup strategy, or dry-run support where appropriate.
- Tools that modify large numbers of assets should produce clear summaries of what changed.

## Workflow Rules
- Tooling that becomes part of the production pipeline must be documented.
- If content creation depends on a custom tool, onboarding docs must explain the minimum path to use it safely.
- Tool versioning and compatibility expectations should be clear when Unity upgrades occur.

## Validation Rules
- Prefer proactive validation over relying on tribal knowledge.
- Important validation should be easy to run locally and in CI where possible.
- Validation failures must explain how to fix the issue, not only that something is wrong.

## Ownership
- Every non-trivial tool needs an owner.
- Abandoned tools should be retired or marked obsolete rather than silently left in production menus.

## Done Criteria
Unity tooling is ready when it is discoverable, safe, documented, and clearly worth the maintenance cost.
