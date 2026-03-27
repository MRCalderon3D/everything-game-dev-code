# Memory

## Purpose
Define how project memory, decisions, assumptions, and context are retained so work remains coherent across roles and over time.

## Scope
Applies to all documents, plans, feature work, and reviews.

## Memory Principles
- Important decisions must be externalized; they must not live only in chat history or individual memory.
- A project should be explainable from its artifacts.
- Repeated rediscovery is a process smell.
- Historical context is valuable only if it remains searchable and tied to current reality.

## What Must Be Remembered
- Product pillars and target audience assumptions.
- Major design decisions and reversals.
- Architecture decisions and constraints.
- Milestone commitments and scope cuts.
- Known technical debt and accepted risks.
- Testing gaps, accessibility exceptions, and release waivers.
- Third-party dependencies and licensing constraints.

## Storage Rules
- Persistent decisions belong in docs, ADRs, milestone plans, change logs, issue trackers, or decision registers.
- Temporary working notes must either graduate into source-of-truth docs or be discarded.
- Every important note should point back to the owning artifact where possible.

## Traceability Rules
- Each significant decision should include context, owner, date, rationale, and impact.
- Superseded decisions must be marked as replaced instead of silently disappearing.
- Open questions must have an owner and next action.

## Handoff Rules
- Handoffs must include current status, prior decisions, assumptions, blockers, and unresolved risks.
- Do not ask downstream roles to rediscover information that already exists in project memory.

## Anti-Patterns
- Conflicting decision notes with no source-of-truth pointer.
- Feature implementation that depends on undocumented tribal knowledge.
- Large stale summaries that hide which parts are still valid.

## Deliverables
- Decision log or ADR index.
- Milestone memory summaries.
- Open questions register.
- Risk and debt register.

## Done Criteria
Project memory is healthy when a new contributor can reconstruct current intent, constraints, and open risks from maintained artifacts.
