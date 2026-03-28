# Engine Isolation Policy

This file defines how the scaffold prevents Unity, Unreal, and Godot practices from contaminating each other while still allowing shared game development standards.

## Core Rule
Keep shared policy common and implementation policy engine-specific.

## Why This Exists
Different engines encourage different architecture, content workflows, debugging habits, build pipelines, and authoring patterns. If those patterns leak into shared policy, the repository becomes contradictory and harder to trust.

## Isolation Model
- `rules/common/` contains engine-neutral policy.
- `rules/unity/`, `rules/unreal/`, and `rules/godot/` extend common policy with engine-specific implementation guidance.
- `skills/workflow`, `skills/design`, `skills/engineering-common`, `skills/art-audio-content`, and `skills/qa-release` remain engine-neutral.
- `skills/unity`, `skills/unreal`, and `skills/godot` contain only engine-specific execution knowledge.
- engine-specific commands route to engine-specific agents when the task is implementation-bound.

## What May Be Shared
The following may live in common layers:
- product pillars
- GDD content
- feature goals
- system rules and success metrics
- milestone planning
- QA strategy
- telemetry intent
- release criteria that do not depend on one engine's tooling

## What Must Stay Engine-Specific
The following must stay inside the relevant engine pack:
- class and framework choices
- scene, prefab, map, or node composition practices
- editor and tooling conventions
- asset import specifics
- build pipeline details
- package, plugin, or addon governance
- engine lifecycle and initialization patterns
- engine-specific performance guidance

## Agent Routing Rules
- A common agent may define goals, acceptance criteria, and trade-offs.
- An engine agent may define only the engine-specific way to implement those goals.
- If a task compares engines, route through `planner`, `architect`, or `technical-design-lead` and keep the result in neutral documentation unless a final engine choice has already been made.

## Documentation Rules
- Shared docs must not silently embed Unity, Unreal, or Godot assumptions.
- Engine implementation notes must live in engine-specific rules, skills, technical design docs, or review outputs.
- Migration or comparison docs may mention multiple engines, but they must be clearly marked as comparison work rather than active implementation policy.

## Command Rules
- `/unity-*`, `/unreal-*`, and `/godot-*` commands should only be used when the task is already known to belong to that engine.
- General commands such as `/plan`, `/gdd`, `/tech-design`, and `/verify` must remain safe to use before engine-specific choices are locked.

## Exception Handling
Cross-engine discussion is acceptable when:
- evaluating engines before committing
- planning migrations
- documenting trade-offs for architecture decisions
- comparing production risks or feature feasibility

Even then, the result should not overwrite active engine-specific rules unless the project has deliberately changed direction.

## Warning Signs of Contamination
- common docs prescribing one engine's object model
- commands that route to the wrong engine reviewer
- skills teaching Unity-only, Unreal-only, or Godot-only workflow inside common domains
- architecture docs that assume engine-specific lifecycle behavior without saying so

## Success Criteria
Engine isolation is working when:
- shared policy remains reusable across engines
- engine-specific work stays explicit and local
- contributors can tell which rules apply without guessing
