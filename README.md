# Everything Game Dev Code

A scaffold for building AI-assisted game development workflows with shared rules, specialized agents, reusable skills, installation profiles, validation schemas, and harness adapters.

This repository is designed for **game development teams** working across **Unity**, **Unreal**, and **Godot** without letting engine-specific rules contaminate one another.

## What This Repository Is

This is not just a prompt pack.
It is a structured operating system for AI-assisted game production that includes:

- engine-neutral rules in `rules/common/`
- engine-specific extensions in `rules/unity/`, `rules/unreal/`, and `rules/godot/`
- specialized role files in `agents/`
- reusable execution knowledge in `skills/`
- slash-command style entry points in `commands/`
- documentation templates in `docs/templates/`
- orchestration and routing docs in `docs/orchestration/`
- installation logic in `manifests/`
- validation schemas in `schemas/`
- automated checks in `tests/`
- example usage patterns in `examples/`
- optional harness and MCP integration layers

## Core Goals

1. Keep **shared game-development policy** separate from **engine-specific implementation rules**.
2. Support **multi-role collaboration** between design, engineering, QA, production, analytics, liveops, and release.
3. Make AI outputs more reliable by grounding them in **rules, templates, workflows, and reusable skills**.
4. Keep the system installable by profile so teams can activate only what they need.
5. Preserve strict engine isolation between Unity, Unreal, and Godot.

## Supported Engines

- Unity
- Unreal
- Godot

## Repository Structure

```text
rules/                 Shared and engine-specific policy
agents/                Role definitions
commands/              Task entry points
skills/                Reusable operational knowledge
docs/templates/        GDD, TDD, QA, telemetry, release templates
docs/orchestration/    Routing, handoffs, workflow sequencing
manifests/             Install components, modules, and profiles
schemas/               Validation for manifests, hooks, and related config
tests/                 Validation and integrity checks
examples/              Example installs and usage patterns
hooks/                 Optional automation hooks
mcp-configs/           MCP server recommendations and profiles
```

## Engine Isolation Model

The repository uses a layered model:

- `rules/common/` defines engine-neutral standards.
- `rules/unity/` extends common rules for Unity.
- `rules/unreal/` extends common rules for Unreal.
- `rules/godot/` extends common rules for Godot.

The same principle applies to skills, commands, examples, and installation profiles.
Shared design intent can live in common documents.
Engine execution details must remain inside the relevant engine pack.

## How to Use It

### 1. Pick the profile you need
Use `manifests/install-profiles.json` to choose a baseline installation strategy such as:

- Unity production project
- Unreal networked project
- Godot indie project
- preproduction-only design setup
- liveops- or multiplayer-oriented configuration

### 2. Start from commands
Common entry points include:

- `/plan`
- `/gdd`
- `/tech-design`
- `/vertical-slice`
- `/verify`
- `/release-check`
- engine-specific review or setup commands

### 3. Route through agents
The command layer should delegate to the right specialists:

- planning and production
- game design and technical design
- gameplay and engine programming
- QA and review
- liveops, telemetry, and release

### 4. Ground execution in skills
Skills define reusable, repeatable operating knowledge for:

- workflow and planning
- game design
- engineering
- content production
- QA and release
- engine-specific implementation patterns

## Recommended Adoption Order

If you are installing the scaffold progressively, a strong default order is:

1. `rules/`
2. `agents/`
3. `commands/`
4. `skills/`
5. `docs/templates/`
6. `docs/orchestration/`
7. `manifests/`
8. `schemas/`
9. `tests/`
10. `examples/`
11. adapters, MCP configs, and scripts

## Who This Is For

This scaffold is useful for:

- solo developers who want strong structure
- small teams who need repeatable AI-assisted workflows
- technical leads building internal agent systems
- studios experimenting with role-based AI routing
- multi-engine teams who need strict separation between engine practices

## Design Principles

- rules say **what good looks like**
- skills say **how to execute well**
- agents say **who should own the work**
- commands say **how work is initiated**
- templates say **what good deliverables look like**
- manifests say **what to install together**
- schemas and tests keep the system from drifting

## Current Status

The scaffold includes the major structural layers needed for real use.
It is intended to be extended, customized, and adapted by project and studio.

## Next Recommended Customizations

- tune install profiles to your team size and engine mix
- adapt MCP server configs to your internal tools
- tighten schemas if your pipeline requires stricter validation
- add studio-specific hooks and automation
- add more examples for your target genres and platforms

## License

Use the repository license defined at the root of the project.
