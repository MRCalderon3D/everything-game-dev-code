# Role Handoffs

This file defines how work moves between agents so that planning, design, engineering, QA, release, and live operations stay coherent.

## Handoff Principles
- A handoff is not complete until the receiving role can act without reconstructing missing context.
- Each handoff must preserve ownership, source of truth, assumptions, and open questions.
- Handoffs should reduce ambiguity, not move it downstream.

## Minimum Handoff Packet
Every handoff should include:
- objective
- current status
- source-of-truth document or command output
- constraints and dependencies
- decisions already made
- open questions or known risks
- required deliverable and done criteria

## Standard Handoffs

### planner → producer
Use when:
- a plan is ready to become scheduled milestone work

Must include:
- scope boundaries
- sequencing assumptions
- dependencies
- risk summary
- decision deadlines

### planner → gdd-designer
Use when:
- product or feature intent needs formal design definition

Must include:
- target player outcome
- scope and constraints
- unresolved design questions
- related milestone expectations

### gdd-designer → technical-design-lead
Use when:
- design intent needs technical realization

Must include:
- player-facing rules
- edge cases
- acceptance criteria
- systems affected
- out-of-scope notes

### technical-design-lead → implementation owner
Use when:
- architecture and integration path are ready for implementation

Must include:
- implementation boundaries
- interfaces and dependencies
- testing expectations
- migration or rollout notes
- performance, save/load, and telemetry implications when relevant

### implementation owner → qa-lead
Use when:
- a feature or fix is ready for structured validation

Must include:
- build or branch reference
- expected behavior
- known limitations
- risky areas
- debug notes or reproduction shortcuts if helpful

### qa-lead → producer / release-manager
Use when:
- milestone status or release readiness is affected

Must include:
- test coverage summary
- blocking issues
- severity distribution
- risk to milestone or release
- recommended next decision

### playtest-analyst → design owner
Use when:
- player evidence should change design or tuning

Must include:
- observed behavior patterns
- prioritized findings
- confidence level
- likely player-impact interpretation
- suggested next questions, not just suggested solutions

### telemetry-analyst → economy-designer / systems-designer / producer
Use when:
- instrumented evidence should affect balance, progression, liveops, or roadmap decisions

Must include:
- metric definition
- time window and cohort context
- key pattern observed
- likely limitations of the data
- recommendation or decision options

### build-engineer → release-manager
Use when:
- build output, packaging status, or CI state affects release decisions

Must include:
- build identity
- target platform
- status of packaging and artifacts
- known failures or warnings
- reproducibility notes

## Engine-Specific Handoffs

### technical-design-lead → unity-reviewer / unreal-reviewer / godot-reviewer
Use when:
- common technical design must become engine-specific implementation guidance

Must include:
- engine choice
- architectural intent
- constraints that must remain invariant
- performance or tooling implications

### engine reviewer → build resolver
Use when:
- the project is structurally correct but blocked by engine build or tooling failure

Must include:
- reproduction path
- engine version and package/plugin/addon context
- suspected failure domain
- what has already been ruled out

## Anti-Patterns
Do not hand off work as:
- vague requests without ownership
- raw brainstorming with no decision point
- implementation tasks that lack source-of-truth docs
- QA requests with no expected behavior
- release requests with no risk summary

## Success Criteria
Role handoffs are healthy when receiving agents can execute immediately, key assumptions are explicit, and ownership never becomes ambiguous during transitions.
