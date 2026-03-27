# Everything Game Dev Code

Initial structure inspired by `everything-claude-code`, but focused on game development and separated by engine to avoid interference between Unity, Unreal, and Godot.

## Goal
This repository defines a system of:
- specialized agents by discipline
- reusable skills
- rules by layer and by engine
- commands oriented toward game production
- hooks for automation and quality control
- manifests and installation profiles for selective setup
- documentation templates (GDD, technical TDD, QA, release, etc.)

## Architecture Principles
1. `common/` contains engine-neutral rules and skills.
2. `unity/`, `unreal/`, and `godot/` extend the common layer and must never mix patterns from another engine.
3. Agents use skills; commands invoke agents; rules define the standard.
4. Orchestration is documented in `docs/orchestration/`.
5. The structure is created; detailed content will be filled in later.

## Main Layers
- `.claude-plugin/` plugin and installation metadata
- `agents/` specialized roles
- `skills/` operational knowledge by domain and engine
- `commands/` slash commands
- `rules/` base rules + engine overrides
- `hooks/` automations
- `contexts/` system contexts by phase or mode
- `docs/templates/` document templates
- `docs/orchestration/` relationships between roles, skills, and commands
- `manifests/` installation components, modules, and profiles
- `schemas/` validation for manifests and hooks
- `examples/` example projects by engine
- `tests/` scaffold tests and validations

## Status
Scaffold created. Pending: fill in the operational content of each file.
