# research

Structured investigation of engines, plugins, technical approaches, competitors, and feasibility risks before committing to pre-production direction.

## Purpose
Reduce decision uncertainty. Produce validated answers to the questions that would otherwise block or derail pre-production. Research output feeds directly into engine selection, TDD, and risk register.

## Active Agents
- `planner` — frames research questions and tracks what needs answers before proceeding
- `architect` — evaluates technical feasibility and architectural trade-offs
- `technical-design-lead` — assesses engine and plugin compatibility with design requirements
- `performance-reviewer` — flags performance or memory risks in candidate approaches
- `security-reviewer` — vets third-party plugins and SDK integrations for risk

## Key Commands
- `/plan` — define the research scope and success criteria before starting
- `/tech-design` — document findings and constraints that will shape the TDD
- `/perf-budget` — establish preliminary performance targets based on platform and genre
- `/memory-budget` — establish preliminary memory constraints

## Source-of-Truth Documents
- Research notes — engine evaluation, plugin audit, competitor teardowns
- TDD (draft sections) — capture decisions that emerge from research
- Risk register — list assumptions that research does not yet confirm

## Priorities
1. Answer the specific questions blocking engine or architecture selection.
2. Evaluate 2–3 candidate approaches per open question — do not over-research settled decisions.
3. Document what was ruled out and why, not only what was chosen.
4. Validate that the engine supports the core gameplay requirements at target platform performance.
5. Vet any third-party plugins or SDKs for licensing, support quality, and integration risk.
6. Produce clear go/no-go criteria for each research question.

## What Counts as Done
Research is complete when the key decisions blocked by uncertainty can now be made with confidence. If a decision is still blocked after the research window, escalate rather than extending indefinitely.

## Escalate When
- A core gameplay requirement cannot be met by any evaluated engine or approach
- Plugin licensing or support quality introduces unacceptable risk
- Performance targets are incompatible with the design as currently scoped
- Research is expanding without converging on decisions

## What to Avoid
- Researching questions that do not affect any near-term decision
- Producing research summaries without explicit recommendations or decision outputs
- Treating research as a delay strategy rather than a risk-reduction activity
- Committing to engine or architecture before the design requirements are stable enough to evaluate against
