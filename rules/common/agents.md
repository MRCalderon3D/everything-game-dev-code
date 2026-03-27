# Agents

## Purpose
Define how planner, design, engineering, content, QA, production, and release agents collaborate without overlapping responsibilities or mixing engine-specific concerns.

## Scope
These rules govern all agent interactions in the repository. They apply to common agents and to engine-specific agents unless an engine rule explicitly extends them.

## Operating Model
- Agents are specialized roles, not interchangeable personas.
- The planner coordinates work decomposition, dependency ordering, and handoffs.
- Domain agents own outputs in their specialty area.
- Review agents challenge assumptions, quality, risk, and completeness.
- Engine agents implement engine-specific tactics only inside their engine boundary.

## Authority and Boundaries
- `planner` owns sequencing, task decomposition, and role routing.
- `producer` owns milestones, scope pressure, dependency tracking, and delivery risk.
- `gdd-designer` owns player-facing design intent, feature framing, and experience goals.
- `technical-design-lead` owns technical feasibility, interfaces, constraints, and implementation strategy.
- Design agents define behavior and outcomes; engineering agents define implementation details.
- QA agents own verification strategy and release quality signals, not feature design.
- Reviewers may block low-quality outputs but must provide actionable remediation.

## Handoff Rules
- Every handoff must include: objective, context, constraints, dependencies, deliverable format, and done criteria.
- Every handoff must identify which source document is authoritative.
- Every handoff must separate facts, assumptions, decisions, and open questions.
- If a downstream agent must make assumptions, those assumptions must be surfaced back to the planner or owning role.

## Engine Isolation
- Common agents may reference cross-engine principles but must not prescribe Unity, Unreal, or Godot implementation details in common outputs.
- Engine-specific work must be delegated to the corresponding engine role or engine-specific skill.
- Shared design intent may be common; implementation patterns must stay inside the relevant engine pack.

## Output Contracts
- Plans must include milestones, dependencies, risks, and acceptance criteria.
- Design outputs must include player goal, system rules, edge cases, and telemetry implications.
- Technical outputs must include interfaces, constraints, failure modes, and testing strategy.
- QA outputs must include scope, coverage, reproduction steps, and exit criteria.
- Production outputs must include owners, status, blockers, and decision deadlines.

## Escalation Rules
- Escalate when design intent conflicts with schedule, technical feasibility, platform rules, or performance budgets.
- Escalate when two agents produce incompatible source-of-truth decisions.
- Escalate when scope grows without milestone impact analysis.
- Escalate when a feature lacks a single accountable owner.

## Review Rules
- Reviews must focus on correctness, risk, clarity, and downstream usability.
- Reviews must not rewrite ownership boundaries unless the planner or producer reassigns responsibility.
- Criticism must identify what is wrong, why it matters, and how to fix it.

## Documentation Rules
- Decisions made across agents must be reflected in the relevant GDD, TDD, ADR, backlog item, or milestone plan.
- The current source of truth must be explicit after every major planning or design pass.

## Anti-Patterns
- Do not let implementation details silently redefine design intent.
- Do not let narrative, UI, gameplay, and engineering teams maintain conflicting versions of feature behavior.
- Do not assign testing only after implementation is complete.
- Do not allow engine-specific advice to leak into neutral shared documents.

## Done Criteria
A multi-agent workflow is complete only when ownership, outputs, assumptions, and acceptance criteria are all explicit and traceable.
