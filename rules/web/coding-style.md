# Web Coding Style

## Purpose
Define consistency rules for web game code so teams can collaborate across gameplay, rendering, UI, and tooling layers.

## Scope
Applies to JavaScript, TypeScript, shader strings, markup, and styles used in browser-delivered games.

## Style Principles
- Prefer readability and predictable structure over clever shortcuts.
- Use ES modules exclusively; avoid script-tag globals and implicit load-order dependencies.
- Names should communicate ownership, domain meaning, and lifecycle intent.

## Language Rules
- Use `const` by default and `let` only where reassignment is intentional; never `var`.
- Use kebab-case for file names, PascalCase for classes, and camelCase for functions and variables.
- Prefer TypeScript or typed annotations when they improve tooling and clarity, applied consistently within a project.

## Maintainability Rules
- Keep modules small and purpose-built; one system or feature concern per module.
- Avoid global mutable state; pass dependencies explicitly or own them in a clearly scoped system.
- Comments should explain intent, constraints, or non-obvious browser behavior rather than restating code.

## Done Criteria
Coding style is healthy when code is readable, discoverable, and consistent with modern browser-native workflows.
