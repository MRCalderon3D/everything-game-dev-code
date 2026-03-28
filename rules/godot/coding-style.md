# Godot Coding Style

## Purpose
Define consistency rules for Godot code so teams can collaborate effectively across gameplay, tools, UI, and platform layers.

## Scope
Applies to GDScript, C# used in Godot, shader code, and project-specific scripting conventions.

## Style Principles
- Prefer readability and predictable structure over clever shortcuts.
- Names should communicate ownership, domain meaning, and lifecycle intent.
- Keep engine glue, domain logic, and presentation concerns understandable at a glance.

## GDScript Rules
- Keep scripts focused and purpose-built.
- Prefer explicit exported properties and typed APIs when they improve tooling and clarity.
- Avoid overloading a single script with editor logic, runtime orchestration, and feature behavior.

## C# Rules
- Keep C# usage aligned with Godot lifecycle expectations.
- Avoid introducing architecture patterns that fight the engine unless there is a clear payoff.
- Interop expectations between GDScript and C# must be documented where both are used.

## Maintainability Rules
- Scene entry points, signal handlers, and public methods should be easy to identify.
- Error handling and fallback behavior should be obvious in critical systems.
- Comments should explain intent, constraints, or non-obvious engine behavior rather than restating code.

## Done Criteria
Coding style is healthy when code is readable, discoverable, and consistent with Godot-native workflows.
