# Godot Version Control

## Purpose
Define version control expectations for Godot repositories, scenes, resources, generated data, and third-party add-ons.

## Scope
Applies to repository hygiene, merge conflict strategy, large assets, submodules or vendor code, and collaboration workflow.

## Repository Rules
- Source-controlled files must be sufficient to reproduce project configuration and supported exports.
- Generated or machine-specific files should not be committed unless they are required for deterministic workflows.
- Third-party add-ons and custom plugins must have clear ownership and upgrade strategy.

## Merge and Review Rules
- Scene, resource, and project setting changes must be reviewed for hidden side effects.
- Large refactors should be split to reduce merge pain around shared scenes and settings.
- Branches that modify core autoloads, input maps, export settings, or shared resources require extra coordination.

## Done Criteria
Version control practices are healthy when merges remain manageable, project settings are reproducible, and shared Godot assets are changed intentionally.
