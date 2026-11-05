# Web Project Structure

## Purpose
Define how web game projects organize entry points, runtime modules, static assets, tooling, and build output.

## Scope
Applies to repository layout, source modules, public assets, configuration files, tests, and generated artifacts.

## Structure Principles
- Organize around maintainability and ownership, not convenience for a single contributor.
- Keep a single `index.html` entry point, runtime code under `src/`, and static content under `public/assets/`.
- Shared systems must be distinguishable from feature-specific content.

## Layout Rules
- Keep runtime code, build tooling, tests, third-party dependencies, and generated artifacts clearly separated.
- Feature-oriented grouping is preferred when it improves ownership and reduces cross-folder coupling.
- Bundler, lint, and test configuration must live at the project root in predictable locations.
- Support both bundler-based and no-build ES-module setups; document which one the project uses.
- Build output and generated assets must never be hand-edited or mixed with source.

## Naming Rules
- File and folder names must be consistent, searchable, and kebab-case.
- Avoid vague folder names that mix prototypes, production content, and deprecated work.

## Done Criteria
Web project structure is sound when contributors can locate ownership, dependencies, and feature entry points quickly and safely.
