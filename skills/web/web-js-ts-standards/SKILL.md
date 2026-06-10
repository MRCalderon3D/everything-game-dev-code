---
name: web-js-ts-standards
description: Write readable, maintainable JavaScript or TypeScript game code with consistent modules, typing, and tooling.
origin: everything-game-dev-code
category: web
---

# Web JS/TS Standards

## Purpose
Write readable, maintainable JavaScript or TypeScript game code with consistent modules, typing, and tooling.

## Use When
- establishing coding standards for a browser game codebase
- reviewing game code for consistency, typing, or module hygiene
- migrating script-tag globals or mixed module styles to ES modules

## Inputs
- language choice (TypeScript, or JavaScript with JSDoc type checking)
- toolchain (bundler or no-build ES modules)
- existing code conventions
- lint and format configuration

## Process
1. use ES modules everywhere with explicit imports and exports; include file extensions in import paths when targeting no-build setups
2. declare the typing strategy once — strict TypeScript, or checked JSDoc on plain JavaScript — and apply it to all game state and system interfaces
3. keep configuration, tuning data, and content immutable, while allowing pre-allocated mutable objects in per-frame hot paths
4. enforce one lint and format configuration in CI or a pre-commit step, with rule exceptions justified inline
5. forbid implicit globals; anything attached to the global object for debugging must be explicitly marked and stripped or gated for release

## Outputs
- coding standards summary for the project
- typing strategy decision and scope
- lint and format configuration notes
- list of hot-path mutability exceptions

## Quality Bar
- modules export narrow, explicit interfaces and never communicate through window globals
- the typing strategy covers core game state, system boundaries, and content data without untyped escape hatches
- immutability is the default for data, and every per-frame mutable structure exists for a measured allocation reason
- lint and format pass clean, and disabled rules carry an inline justification

## Common Failure Modes
- mixing ES modules with script-tag globals so load order silently matters
- extensionless imports that work under a bundler but fail in a no-build setup
- applying immutability dogma in per-frame code and creating allocation churn the collector must absorb
- any-typed or unchecked objects around the most important data in the game: its state
- debug helpers on the global object leaking into release builds

## Related Agents
- web-reviewer
- code-reviewer
- gameplay-programmer

## Related Commands
- web-review
- verify
- tdd

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If a framework imposes its own idioms (scene classes, lifecycle hooks), follow them inside framework boundaries and keep pure logic modules framework-free.
