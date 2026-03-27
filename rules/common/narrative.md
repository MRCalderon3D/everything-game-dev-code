# Narrative

## Purpose
Define shared narrative rules for story structure, dialogue, lore consistency, player communication, and narrative production workflows.

## Scope
Applies to story-heavy and story-light games alike whenever text, dialogue, lore, objectives, or character communication influences player understanding.

## Narrative Principles
- Narrative must support the game experience, not compete with it.
- Story, lore, and dialogue should clarify player motivation, stakes, and context.
- Canon must be manageable, searchable, and reviewable.
- Narrative complexity should scale with production capacity and testing reality.

## Canon Rules
- Establish a canon source of truth for world rules, factions, timeline, major characters, and terminology.
- Retcons must be explicit and tracked.
- Placeholder lore must be marked so it does not become accidental canon.

## Dialogue Rules
- Dialogue should reflect character intent, player context, and gameplay pacing.
- Critical objectives, warnings, and tutorial information must remain understandable without relying on flavor-only lines.
- Branching dialogue requires ownership of conditions, consequences, and fallback behavior.
- Barks, tutorials, quest text, and cinematics must use consistent terminology for mechanics and world entities.

## Implementation Rules
- Narrative content must define triggers, conditions, speaker identity, priority, interrupt behavior, and failure fallback where relevant.
- Narrative systems that affect progression require test coverage for branch logic and recovery states.
- Localization requirements must be considered before line volume and formatting patterns scale.

## Collaboration Rules
- Narrative must coordinate with quest design, level design, UI/UX, audio, localization, and engineering.
- Narrative intent belongs in common docs; conversation toolchains and runtime scripting belong in engine-specific packs or project tools.

## Review Rules
- Narrative review should assess clarity, consistency, pacing, character voice, systemic fit, and localization risk.
- High-frequency repeated lines must be reviewed for fatigue and readability.
- Objectives and prompts should be tested with players who lack insider knowledge.

## Deliverables
- Narrative brief or story bible.
- Canon reference.
- Quest or conversation specs.
- Localization notes.
- Voice and subtitle requirements.

## Done Criteria
Narrative content is ready when it is canon-consistent, implementation-aware, localized for production reality, and clear to players in context.
