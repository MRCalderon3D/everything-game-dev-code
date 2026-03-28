# Unity Play Mode Architecture

## Purpose
Define runtime architecture rules for game state, scene flow, system ownership, and execution patterns in Unity.

## Scope
Applies to gameplay runtime architecture in Unity projects.

## Architectural Principles
- Runtime state ownership must be explicit.
- Scene composition, system lifetime, and service boundaries must be understandable without reverse-engineering inspector wiring.
- Domain logic should be separable from presentation and engine glue where practical.

## Scene Flow Rules
- Define whether the project uses bootstrap scenes, additive scenes, world streaming, or other composition models.
- Persistent systems must have clear lifetime rules.
- Scene transitions must define what survives, what reloads, and what data is handed off.

## System Ownership
- Input, save/load, progression, UI flow, audio state, and major gameplay orchestration systems must each have a documented owner.
- Avoid duplicate singleton-like managers that overlap responsibilities.
- If service-locator or singleton patterns are used, their scope and testability implications must be documented.

## Async and Coroutine Rules
- Coroutines, async tasks, animation events, and timeline-driven events must have ownership and cancellation strategy.
- Do not let asynchronous work outlive the object or scene assumptions it depends on.

## Data and Presentation
- Keep authoring data, runtime state, and view-layer behavior distinct where project complexity warrants it.
- ScriptableObjects may define data and authoring workflows, but must not silently become mutable global runtime state unless that is an explicit design choice.

## Failure Modes
- Startup, missing references, duplicate system creation, and scene transition failures should have diagnosable behavior.
- Runtime initialization order must be documented for critical systems.

## Done Criteria
Unity play mode architecture is ready when system lifetimes, scene flow, and data ownership are explicit and resilient to iteration.
