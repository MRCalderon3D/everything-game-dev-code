# Godot Editor Tooling

## Purpose
Define when and how to build editor tooling in Godot to improve content creation and reduce manual error.

## Scope
Applies to editor plugins, tool scripts, custom inspectors, validation helpers, import automation, and authoring workflows.

## Tooling Principles
- Build tooling where it meaningfully reduces repetitive manual setup, content mistakes, or onboarding friction.
- Tooling should improve authoring reliability without obscuring project structure or ownership.

## Implementation Rules
- Editor-only code must be clearly separated from runtime behavior.
- Tool scripts and plugins must document side effects, expected usage, and rollback or recovery steps where they modify project data.
- Validation tools should prefer actionable reporting over silent mutation.

## Safety Rules
- Destructive bulk actions require clear intent and safe defaults.
- Generated content must be deterministic and traceable.
- Tooling must be tested against common authoring scenarios, not only ideal inputs.

## Done Criteria
Godot editor tooling is acceptable when it reduces risk and friction without making project state harder to reason about.
