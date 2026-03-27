# Documentation

## Purpose
Define the minimum documentation system required to keep design, engineering, production, QA, content, and release work aligned.

## Scope
Applies to all shared documents and to all engine-specific extensions.

## Documentation Principles
- Every important decision needs a durable home.
- Documents exist to support execution, not documentation theater.
- The source of truth must be explicit for each topic.
- Short, current, decision-oriented documentation is better than large stale documents.
- A missing document is less dangerous than two conflicting source-of-truth documents.

## Required Document Types
- Vision or product brief.
- Game Design Document for player-facing intent.
- Technical Design Document for implementation strategy and constraints.
- Milestone or production plan.
- Feature specs for non-trivial systems.
- ADRs for architectural decisions with meaningful trade-offs.
- QA plans and release checklists.
- Asset, localization, telemetry, and live-ops docs where relevant.

## Ownership Rules
- Each document must have an owner.
- Shared documents may have contributors, but ownership must remain singular.
- Owners are responsible for freshness, unresolved questions, and archival decisions.

## Freshness Rules
- Update documents when behavior, scope, interface, pipeline, or milestone commitments change.
- Documents that no longer reflect reality must be marked stale, archived, or replaced.
- Every milestone review should include a documentation freshness check.

## Writing Rules
- Write for downstream execution.
- Separate facts, assumptions, decisions, risks, and open questions.
- Use concrete acceptance criteria, examples, and edge cases.
- Avoid vague language such as `maybe`, `likely`, or `simple` without context.

## Cross-Document Rules
- GDD defines player-facing intent.
- TDD defines implementation approach.
- ADRs capture trade-offs that should not be hidden inside feature specs.
- Production plans define sequencing, dependencies, and owners.
- Test plans verify what the design and technical documents claim.

## Review Rules
- Documents that drive implementation must be reviewable before execution begins.
- Contradictions between documents must be resolved, not worked around informally.
- Review feedback should target clarity, completeness, feasibility, and downstream usefulness.

## Archival Rules
- Replace obsolete docs with a pointer to the active source.
- Preserve historical decisions when they explain current constraints or prevent repeated debates.

## Deliverables
- Template set for GDD, TDD, ADR, milestone plan, QA plan, and release notes.
- Documentation ownership map.
- Source-of-truth index.

## Done Criteria
Documentation is healthy when every critical domain has a current owner, a clear source of truth, and enough detail to unblock downstream work.
