# Godot Autoloads and Singletons

## Purpose
Define safe usage of autoloads and other global-access patterns in Godot.

## Scope
Applies to project autoloads, service singletons, persistent managers, and cross-scene global state.

## Usage Principles
- Autoloads should exist only when a project-wide lifetime or global coordination need is real.
- Every autoload must have a narrow, documented responsibility.
- Autoloads must not become a default dumping ground for unrelated systems.

## Ownership Rules
- Input remapping, save services, progression state, analytics dispatch, and platform integration may justify autoload ownership when lifecycle requirements demand it.
- Feature-specific runtime state should remain closer to scene-local or system-local ownership whenever possible.

## Risk Controls
- Document initialization order assumptions.
- Avoid hidden dependencies where many scenes implicitly require autoload side effects.
- Prefer explicit APIs and signals over broad mutable global state.
- Test scene startup paths both with and without expected autoload interactions where feasible.

## Review Triggers
Escalate when:
- multiple autoloads overlap in responsibility
- autoload state is mutated by many unrelated features
- testing requires fragile global reset logic
- scene behavior cannot be understood without searching global singletons

## Done Criteria
Autoload usage is acceptable when lifetime, responsibility, dependencies, and reset behavior are explicit and controlled.
