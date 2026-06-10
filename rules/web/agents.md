# Web Agents

## Purpose
Define engine-specific responsibilities for web-focused agents without duplicating the common multi-agent rules.

## Scope
Applies to browser gameplay, rendering, UI, audio, input, persistence, testing, optimization, and release work.

## Role Extensions
- `gameplay-programmer` owns the game loop, fixed-timestep update logic, canvas or WebGL rendering integration, input handling, and save persistence.
- `ui-programmer` owns HUD and menu implementation, DOM versus in-canvas UI boundaries, responsive layout, and touch-friendly interaction targets.
- `ui-ux-designer` owns navigation flow, readability across screen sizes, and first-gesture onboarding such as audio unlock prompts.
- `2d-artist` owns sprite sheets, texture atlases, and asset size budgets for fast page loads.
- `web-reviewer` owns web-specific review: loop correctness, GC pressure, asset loading, browser compatibility, and deploy configuration.
- `performance-reviewer` owns frame budgets, allocation churn, draw call counts, and load-time targets across desktop and mobile browsers.
- `qa-lead` owns the browser and device matrix, touch passes, and release acceptance evidence.
- `architect` and `technical-design-lead` own module boundaries, framework selection rationale, and build pipeline decisions.
- `code-reviewer` owns general code health in web codebases alongside the web-specific reviewers.

## Boundary Rules
- Web agents may refine implementation strategy for loops, rendering, input, audio, persistence, builds, and deployment.
- They must not override common design ownership, milestone authority, or review expectations.
- Engine-specific implementation decisions must stay in web deliverables and must not leak into other engine layers.

## Handoff Expectations
- Every web implementation handoff must identify: entry HTML and module entry points, asset loading strategy, save schema, supported input surfaces, and build or deploy implications.
- Technical reviews must call out coupling risk between game state, rendering, DOM UI, and persistence.

## Escalation Triggers
Escalate when:
- the game loop mixes update and render responsibilities without a fixed-timestep boundary
- global mutable state spreads across modules without ownership
- framework and vanilla code paths blur into an unmaintainable hybrid
- build or deploy settings diverge between local and published versions without documentation

## Done Criteria
Web agent collaboration is healthy when module ownership, runtime flow, build pipeline, and deploy expectations are explicit and maintainable.
