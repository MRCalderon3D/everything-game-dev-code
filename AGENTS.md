# AGENTS.md

This file defines the root operating guidance for AI agents working in this repository.

## Purpose

Agents in this repository are expected to behave like **specialized collaborators**, not generic assistants.
They should route work through the correct role, use the correct skills, respect engine isolation, and keep documentation synchronized with implementation decisions.

## Primary Responsibilities

Agents should:

- respect the layered rules model
- keep Unity, Unreal, and Godot guidance isolated
- route work to the correct role or command
- use templates for high-value deliverables
- preserve source-of-truth discipline across GDD, TDD, QA, telemetry, and release docs
- surface risks early when quality, scope, performance, or platform constraints are threatened

## Behavioral Rules

### 1. Do not skip planning for non-trivial work
For anything involving multiple steps, multiple roles, design ambiguity, or architectural impact:

- plan before implementation
- define the expected deliverable
- identify dependencies and risks
- make the next responsible role explicit

### 2. Keep common and engine-specific guidance separate
Agents must not:

- put Unity implementation details into common documents
- suggest Unreal framework-specific patterns inside Godot or Unity work
- mix engine-specific runtime assumptions across packs

Shared design intent belongs in common layers.
Engine execution belongs in engine-specific layers.

### 3. Use the right layer for the right job
- `rules/` define standards
- `skills/` define reusable execution patterns
- `agents/` define ownership
- `commands/` define workflow entry points
- `docs/templates/` define deliverable structure
- `docs/orchestration/` define routing and sequencing

### 4. Treat commands as portable workflow contracts
When a user invokes a slash-style command such as `/plan`, `/gdd`, or `/unity-review`, agents should:

- resolve the command to `commands/<name>.md`
- read the command before acting
- follow its declared agents, skills, expected output, and notes
- use adapter-specific command wrappers only as routing hints

Harnesses that do not provide native slash-command execution should still treat these command names as workflow entry points.

### 5. Prefer explicit ownership
Every substantial task should identify:

- owning agent or role
- source-of-truth document
- expected output
- quality bar
- validation path

### 6. Keep documents alive
Agents must update or recommend updating the relevant documents when:

- design intent changes
- technical architecture changes
- testing expectations change
- telemetry requirements change
- release criteria change

## Quality Expectations

Agents should aim for outputs that are:

- actionable
- structured
- aligned with project constraints
- testable
- reviewable
- appropriate to the active engine profile

## Escalation Rules

Agents should escalate when they detect:

- design intent conflicting with implementation reality
- milestone scope drift
- performance budget risk
- save/load or serialization risk
- engine upgrade or package/plugin instability
- multiplayer authority ambiguity
- documentation conflicts
- unclear ownership between design, engineering, QA, or release

## Multi-Agent Coordination

The default orchestration pattern is:

1. planner or command routes the task
2. design or technical lead defines intent
3. implementation role executes
4. reviewer or QA validates
5. documentation and release state are updated

Use `docs/orchestration/` as the source for routing and handoff expectations.

## Engine Routing Rules

- Unity tasks should route through Unity rules and Unity-specialized roles when implementation is engine-specific.
- Unreal tasks should route through Unreal rules and Unreal-specialized roles when implementation is engine-specific.
- Godot tasks should route through Godot rules and Godot-specialized roles when implementation is engine-specific.

If the work is engine-neutral, stay in common layers.

## Deliverable Discipline

Prefer structured outputs such as:

- plans
- design docs
- technical docs
- review checklists
- test plans
- release checklists
- telemetry plans
- patch notes

Avoid vague advice when a template-backed deliverable is expected.

## Anti-Patterns

Agents must avoid:

- improvising architecture without source-of-truth updates
- giving engine-specific advice in common layers
- answering design problems with only code-level solutions
- treating QA as a final step rather than part of the workflow
- producing polished-looking outputs that are operationally vague

## Final Rule

If a task touches multiple domains, the agent should optimize for **clarity of ownership and decision traceability**, not just speed of completion.
