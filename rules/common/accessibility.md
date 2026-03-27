# Accessibility

## Purpose
Define engine-agnostic accessibility requirements for all game features, content, UI, input, audio, and communication systems.

## Scope
These rules apply to all projects regardless of engine, platform, genre, or team size. Engine-specific implementation details belong in `rules/unity`, `rules/unreal`, or `rules/godot`.

## Core Principles
- Accessibility is a product requirement, not a post-launch enhancement.
- Accessibility options must be planned at concept and prototype stage, not retrofitted at content-complete.
- Equivalent player outcomes matter more than identical implementation.
- Accessibility decisions must be documented, testable, and reviewable.
- When a feature cannot be made fully accessible, the limitation and mitigation path must be explicitly documented.

## Minimum Requirements
- Provide rebindable input support where the game relies on more than a minimal number of actions.
- Avoid single-solution interactions when a feature can reasonably support alternative input methods.
- Ensure critical information is never conveyed only through color, sound, vibration, or timing-sensitive animation.
- Provide subtitle support for spoken dialogue and critical non-verbal audio cues where audio conveys gameplay value.
- Provide text readability controls when the game contains significant text: text size, contrast, subtitle background, and readable timing.
- Avoid flashing, strobing, or rapid full-screen effects without explicit review and user-facing mitigation options.
- Make time-sensitive mechanics adjustable, skippable, or replaceable where feasible.
- Ensure menus and core flows are operable without precision pointing requirements unless the product explicitly depends on them.

## Design Rules
- Define accessibility goals in the GDD and track them as first-class acceptance criteria.
- For each feature spec, document accessibility impact, known barriers, and fallback behaviors.
- Prefer readable, low-cognitive-load interaction patterns for critical progression paths.
- Tutorials must not require inaccessible one-time-only interactions.
- Difficulty must not be used as a substitute for accessibility options.

## UI and UX Rules
- UI hierarchy must remain readable at typical play distance for the intended platform.
- Text overlays must maintain sufficient contrast against dynamic backgrounds.
- HUD and menu states must communicate focus, selection, disabled state, and errors clearly.
- Navigation should support predictable movement, clear focus recovery, and non-ambiguous back behavior.
- Critical prompts must remain visible long enough for average reading speed and allow replay where appropriate.

## Audio Rules
- Spoken critical information should have text or visual backup unless intentionally excluded and documented.
- Important gameplay audio should expose independent volume control where the mix is complex.
- Do not hide fail states, objective changes, or threat warnings in audio alone.
- Subtitle systems must distinguish speakers or audio categories when needed for comprehension.

## Input Rules
- Input actions should be abstracted by intent, not hardwired to device-specific assumptions.
- Support remapping for keyboard/controller where input complexity justifies it.
- Avoid mandatory holds, rapid tapping, or simultaneous multi-button actions without alternatives when feasible.
- Preserve accessibility settings across sessions and devices when the product supports cloud sync or profiles.

## Content Rules
- Puzzle, traversal, rhythm, stealth, and quick-time systems require explicit accessibility review.
- Narrative choices, codex entries, and lore-critical text must remain readable and reviewable after first presentation.
- Color-coded systems must include iconography, labels, patterns, or positional cues.

## Production Rules
- Accessibility review is required at concept, prototype, vertical slice, content complete, and release candidate stages.
- Accessibility issues must be triaged with the same visibility as core UX defects.
- Known accessibility exceptions require documented justification, impact assessment, and owner.

## QA Rules
- Accessibility test cases must exist for menus, onboarding, combat or interaction loops, failure states, and progression-critical screens.
- QA must verify settings persistence, platform compliance requirements, and interaction alternatives.
- Bugs affecting progression or readability for supported accessibility modes are release-blocking unless explicitly waived.

## Deliverables
- Accessibility section in the GDD.
- Accessibility acceptance criteria in feature specs.
- Accessibility test checklist per milestone.
- Known limitations log.

## Done Criteria
A feature is not done until its accessibility acceptance criteria, options, and fallback behavior are documented and tested.
