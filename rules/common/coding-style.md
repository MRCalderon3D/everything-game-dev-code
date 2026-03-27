# Coding Style

## Purpose
Define shared code quality rules that apply across gameplay, tools, UI, backend-adjacent game systems, automation, and test code.

## Scope
These rules are engine-agnostic and language-neutral. Language-specific syntax rules and engine idioms belong in engine or language-specific packs.

## Core Principles
- Code should optimize for correctness, clarity, maintainability, and safe iteration.
- Prefer explicit intent over cleverness.
- Favor simple, composable systems over fragile abstraction layers.
- Data-driven approaches are preferred when they reduce duplication and improve iteration speed.
- Systems should be designed for debugging and testing, not only for ideal-path execution.

## Structure Rules
- Organize code by domain responsibility and runtime boundary, not by arbitrary technical layers alone.
- Public interfaces should be small, intentional, and documented.
- Hide implementation details behind stable interfaces where change risk is high.
- Avoid monolithic classes, god objects, and tightly coupled feature bundles.

## State and Logic Rules
- Keep state ownership explicit.
- Minimize hidden side effects, implicit globals, and order-dependent behavior.
- Time, randomness, persistence, and networking effects should be injectable or isolatable where feasible.
- Failures should be handled deliberately, not silently swallowed.

## Readability Rules
- Names must explain purpose, not just type.
- Comments should explain why, invariant assumptions, or non-obvious behavior.
- Remove commented-out dead code instead of preserving it in source files.
- Prefer smaller functions with clear contracts over long multi-purpose routines.

## Gameplay and Runtime Rules
- Gameplay code should separate authoring data, runtime state, and presentation concerns where practical.
- Avoid hard-coding content values that belong in design-authored data.
- High-frequency runtime paths must avoid unnecessary allocations, lookups, and synchronization overhead.
- Debug-only helpers must be clearly separated from shipping behavior.

## Safety Rules
- External data, save data, user input, and networked input must be validated.
- Experimental code paths should be gated behind clear flags or isolated branches.
- Dependency changes require compatibility review, especially for engine plugins and SDKs.

## Testing Rules
- New systems should be designed with a reasonable testing seam.
- Complex logic should have deterministic tests where possible.
- Bug fixes should include regression protection when the issue is likely to recur.

## Review Rules
- Code review should assess correctness, maintainability, naming, architecture fit, and runtime risk.
- Reviewers should reject changes that trade long-term clarity for short-term speed without explicit approval.

## Deliverables
- Project coding conventions.
- Module boundaries.
- Review checklist.
- Static analysis and linting configuration.

## Done Criteria
Code is ready when it is understandable, testable, appropriately decoupled, and aligned with project architecture and runtime constraints.
