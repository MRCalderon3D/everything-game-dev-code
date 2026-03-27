# Technical Design

## Purpose
Define shared rules for architecture, interfaces, system boundaries, data ownership, integration planning, and technical decision quality.

## Scope
Applies to gameplay systems, tools, pipelines, services integrations, save systems, networking, UI systems, and content runtime frameworks.

## Technical Design Principles
- Technical design exists to make implementation safer, faster, and more predictable.
- Prefer clear boundaries and stable contracts over broad implicit coupling.
- Every significant system should state its responsibilities, dependencies, and failure modes.
- Design for iteration, observability, and migration.

## Required Sections for Non-Trivial Systems
- Problem statement and goals.
- Out-of-scope boundaries.
- Constraints and assumptions.
- Runtime architecture and data flow.
- Ownership of state, persistence, and authority.
- External interfaces and events.
- Failure modes and recovery paths.
- Testing strategy.
- Telemetry, accessibility, and performance impact.

## Interface Rules
- Interfaces should model domain intent, not implementation leakage.
- Event contracts, schemas, and save formats must be version-aware where change risk exists.
- Shared systems need clear lifecycle and ownership rules.

## Data Rules
- State ownership must be explicit.
- Persistence formats need migration thinking before release.
- Authoring data, runtime data, and analytics data should not be conflated.

## Change Rules
- Breaking changes require migration or transition planning.
- Architecture decisions with broad impact should be captured as ADRs.
- Temporary technical shortcuts must have retirement criteria.

## Collaboration Rules
- Technical design should be reviewed by design, QA, production, and affected integration owners when cross-discipline impact exists.
- Common docs describe the approach; engine docs describe the exact engine implementation.

## Deliverables
- Technical Design Document.
- ADRs.
- Interface contracts.
- Risk and debt notes.
- Test strategy attachment.

## Done Criteria
Technical design is ready when implementers know what to build, reviewers understand the trade-offs, and downstream teams can validate the result.
