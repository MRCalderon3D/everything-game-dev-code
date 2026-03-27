# Game Design

## Purpose
Define the common rules for player-facing design, system framing, balance thinking, iteration, and design validation.

## Scope
Applies to all gameplay and meta systems regardless of genre or engine.

## Design Principles
- Start from player experience goals, not implementation convenience.
- Every feature must serve the core fantasy, target audience, and product pillars.
- Depth should emerge from understandable rules, not avoidable confusion.
- Designers must state intended behavior, edge cases, and failure conditions explicitly.
- Prototype assumptions early when uncertainty is high.

## Required Design Foundations
- Product pillars.
- Target player and market assumptions.
- Core loop and supporting loops.
- Session structure and progression model.
- Success and failure states.
- Retention, mastery, and content longevity assumptions where relevant.

## Feature Spec Rules
- Every non-trivial feature needs a feature spec or equivalent section in the GDD.
- The spec must define player goal, input, rules, resources, feedback, rewards, failure modes, and edge cases.
- Include dependencies on UI, audio, narrative, economy, telemetry, QA, and engineering where applicable.
- State what is intentionally out of scope.

## Balance Rules
- Balance targets must be tied to player outcomes and measurable signals.
- Tune with explicit hypotheses and change tracking.
- Avoid hidden variables that make balancing opaque to the team.
- Do not ship progression, combat, or economy changes without impact review on adjacent systems.

## Prototyping Rules
- Use prototypes to answer uncertainty, not to approximate production polish.
- Every prototype should declare the question being tested and the decision it informs.
- Prototype success criteria must be explicit before implementation begins.

## Vertical Slice Rules
- The vertical slice must demonstrate intended quality bars for gameplay, content, UX, and technical viability.
- Temporary decisions in the vertical slice must be labeled as such to avoid accidental canonization.

## Iteration Rules
- Playtesting is required for risky or player-facing features.
- Major design changes require downstream impact review on tutorials, telemetry, QA, balance, and content scope.
- Preserve decision history for major design pivots.

## Collaboration Rules
- Design must coordinate with engineering on feasibility and cost before committing to milestone scope.
- Design must coordinate with UI/UX, narrative, audio, and analytics for player-facing systems.
- Design intent belongs in common docs; engine execution belongs in engine docs.

## Deliverables
- GDD.
- Feature specs.
- Balance notes and tuning logs.
- Prototype briefs and result summaries.
- Playtest findings.

## Done Criteria
A design output is ready when the intended player experience, system rules, edge cases, and success measures are all clear enough to implement and test.
