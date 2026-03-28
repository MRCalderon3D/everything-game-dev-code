# Cross-Engine GDD Example

## Purpose
This example shows how to write a Game Design Document that stays engine-neutral and can be implemented in Unity, Unreal, or Godot without leaking engine-specific decisions into shared design documentation.

## Example Product
**Project Name:** Emberfall
**Genre:** Third-person action adventure
**Target Platforms:** PC, console
**Audience:** Players who enjoy exploration, traversal, light combat, and environmental storytelling

## Product Pillars
1. **Readable traversal** — movement should feel responsive and easy to understand.
2. **Compact combat depth** — a small move set should create meaningful decisions.
3. **Environmental narrative** — the world should communicate history and stakes through spaces, objects, and encounters.

## Core Loop
1. Explore a hostile zone
2. Read environmental clues and locate a goal
3. Solve traversal or combat challenges
4. Earn progression resources
5. Unlock a new traversal or combat capability
6. Revisit earlier spaces with expanded mastery

## Player Verbs
- move
- jump
- dash
- climb
- interact
- light attack
- heavy attack
- guard
- use traversal ability

## Progression Model
- Unlocks are ability-based, not stat-only.
- Progression should increase route options and combat expression.
- Early unlocks must meaningfully change how spaces are read.

## Combat Design Notes
- Enemies should pressure position and timing rather than rely only on damage sponge behavior.
- Encounter readability is more important than raw enemy count.
- Telegraphs must be clear in animation, timing, and audio.

## Level Design Notes
- Critical paths must remain legible.
- Optional routes should reward observation, not brute-force wandering.
- Ability gates must be readable before and after the relevant unlock.

## UI and UX Notes
- HUD should stay minimal outside combat.
- Objective communication should be clear without over-explaining.
- Accessibility options must include subtitle controls, contrast-safe indicators, and input rebinding.

## Telemetry Questions
- Where do players fail most often in traversal sequences?
- Which encounters create the highest retry rate?
- How often do players miss optional routes?
- How many players stop before the first major unlock?

## Engine Separation Note
This document intentionally does **not** choose:
- Unity component patterns
- Unreal framework classes
- Godot scene/node patterns
- engine-specific UI or save systems

Those belong in engine-specific technical design.

## Related Documents
- technical-design-document.md
- vertical-slice-plan.md
- telemetry-plan.md
