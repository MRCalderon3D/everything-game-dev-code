# Performance

## Purpose
Define shared rules for performance budgeting, profiling, optimization, and cross-discipline accountability.

## Scope
Applies to runtime performance, load times, memory, streaming, networking responsiveness, and content cost.

## Principles
- Performance is a design, content, and engineering responsibility.
- Optimize from measured evidence, not guesswork.
- Establish budgets early and revisit them at milestone checkpoints.
- A feature that meets functional goals but breaks platform budgets is not done.

## Budget Rules
- Set budgets for frame time, memory, load time, install size, patch size, and network cost where applicable.
- Budgets must be platform-aware and milestone-aware.
- Every major system or content class must have an accountable owner for its budget impact.

## Profiling Rules
- Use representative scenarios, not only empty scenes or synthetic cases.
- Profile gameplay hotspots, menu-heavy flows, save/load, startup, traversal, combat, and stress cases as relevant.
- Re-profile after major content additions or systemic changes.

## Optimization Rules
- Fix correctness and architectural waste before micro-optimizing syntax.
- Prefer improvements that reduce systemic cost rather than one-off patches.
- Avoid trading maintainability for negligible gains unless the budget requires it and the decision is documented.
- Establish content constraints that prevent performance debt from scaling silently.

## Cross-Discipline Rules
- Design changes that increase simulation, AI, FX, UI complexity, or content density must include budget review.
- Art and audio integration must consider streaming, memory, batching, and compression implications.
- QA should include performance smoke tests at milestone checkpoints.

## Regression Rules
- Performance baselines should be tracked per milestone.
- Significant regressions require root-cause investigation, not only broad optimization requests.
- Release candidates must be validated against agreed target budgets.

## Deliverables
- Performance budget sheet.
- Profiling plan.
- Milestone benchmark reports.
- Optimization backlog tied to measured issues.

## Done Criteria
Performance work is healthy when budgets exist, profiling is evidence-based, and regressions are caught early enough to influence scope and content decisions.
