# Godot Project Structure

## Purpose
Define how Godot projects should organize scenes, scripts, resources, plugins, tests, and export configuration.

## Scope
Applies to repository layout, feature folders, shared systems, tools, content, and build configuration.

## Structure Principles
- Organize around maintainability and ownership, not convenience for a single contributor.
- The layout must make it obvious where scenes, scripts, resources, UI, audio, tools, and tests belong.
- Shared systems must be distinguishable from feature-specific content.

## Layout Rules
- Keep runtime code, editor tooling, tests, third-party add-ons, and generated artifacts clearly separated.
- Feature-oriented grouping is preferred when it improves ownership and reduces cross-folder coupling.
- Autoloads, plugins, and export configuration must live in predictable locations.

## Naming Rules
- Scene, script, and resource names must be consistent and searchable.
- Avoid vague folder names that mix prototypes, production content, and deprecated work.

## Done Criteria
Godot project structure is sound when contributors can locate ownership, dependencies, and feature entry points quickly and safely.
