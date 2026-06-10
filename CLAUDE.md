# CLAUDE.md

This repository is a scaffold for structured AI-assisted game development.

## Repository Identity
This is not a single-engine template and not only a prompt collection.
It is a layered workflow system for:
- design
- technical design
- gameplay implementation
- QA
- release
- live ops
- harness portability

## Primary Intent
Use this repository to coordinate work across shared game-development standards while preserving strict isolation between the Unity, Unreal, Godot, and web (HTML5) execution layers.

## How To Read The Repository
- Start with `README.md` for repository purpose.
- Use `AGENTS.md` for role behavior.
- Use `rules/common/` for shared policy
- Use `rules/unity/` for Unity-specific execution
- Use `rules/unreal/` for Unreal-specific execution
- Use `rules/godot/` for Godot-specific execution
- Use `rules/web/` for web (HTML5)-specific execution
- Use `commands/` as the preferred task entry points.
- Use `skills/` for execution depth.
- Use `contexts/` to adapt to project phase.
- Use `hooks/` to enforce workflow safety.

## Claude-Specific Guidance
When working in this repository:
- prefer structured outputs over free-form improvisation
- keep engine-specific advice isolated
- update source-of-truth docs when decisions change
- use planner-first behavior for non-trivial work
- route review work to the correct specialized role
- preserve the scaffold’s naming and folder conventions

## Decision Rules
When uncertain:
- prefer the common layer for standards
- prefer the engine layer for implementation detail
- prefer a command if one exists
- prefer a reusable skill over one-off instructions
- prefer explicit documentation over hidden reasoning

## What To Avoid
- creating duplicate sources of truth
- silently inventing new repository structure without justification
- mixing Unity, Unreal, Godot, and web implementation guidance
- replacing structured process with ad hoc chat outputs

## Repository Maintenance Rule
Any new scaffold block should align with the existing conventions:
- flat `agents/`
- flat `commands/`
- grouped `skills/` with `SKILL.md`
- layered `rules/`
- harness adapters that point back to shared repository logic
