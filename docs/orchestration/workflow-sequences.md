# Workflow Sequences

These are the default execution sequences for the most important game development workflows in this scaffold. They define order, ownership, review points, and when to escalate.

## How to Use This File
- Use these sequences as the default path unless the project has a better documented alternative.
- Skip steps only when the task is genuinely small and the omission does not create downstream ambiguity.
- Add engine-specific review where implementation is Unity, Unreal, or Godot-specific.

## 1. New Feature Workflow
Goal: move a feature from idea to validated implementation.

Sequence:
1. `/plan`
2. `/gdd` or `/tech-design` depending on whether the uncertainty is player-facing, technical, or both
3. `/tdd` if the system has meaningful technical complexity or regression risk
4. implementation by the owning design and engineering agents
5. `/verify`
6. `/update-docs`

Default owners:
- planning: `planner`
- player-facing intent: `gdd-designer`
- technical structure: `technical-design-lead`
- implementation: owning engineering or design agent
- validation: `qa-lead`
- final documentation sync: `doc-updater`

## 2. Vertical Slice Workflow
Goal: prove the intended quality bar, feasibility, and production direction.

Sequence:
1. `/vertical-slice`
2. `/milestone-plan`
3. design and technical design refinement
4. implementation and content authoring
5. `/qa-plan`
6. `/playtest-report`
7. `/perf-budget`
8. `/release-check` if it is being used for external review or investor/demo delivery

Escalate when:
- the slice keeps absorbing roadmap scope
- quality expectations are not explicit
- the slice cannot prove technical risk retirement

## 3. Gameplay Iteration Workflow
Goal: refine a system that already exists.

Sequence:
1. review latest design intent, telemetry, or playtest findings
2. `/combat-design`, `/economy-balance`, `/level-beat`, or other domain command as appropriate
3. implementation change
4. `/verify`
5. `/playtest-report` if player-facing behavior changed materially
6. `/update-docs`

## 4. Technical Systems Workflow
Goal: design or change a system with architecture, persistence, networking, or tooling impact.

Sequence:
1. `/plan`
2. `/tech-design`
3. `/tdd` if regression risk or implementation complexity is meaningful
4. implementation
5. `/save-system-review`, `/multiplayer-review`, `/tools-pass`, or other targeted review as needed
6. `/verify`
7. `/update-docs`

## 5. QA and Stabilization Workflow
Goal: move a milestone or build toward quality confidence.

Sequence:
1. `/qa-plan`
2. target test passes and exploratory testing
3. `/bug-triage`
4. fix or defer decisions by owners
5. `/verify`
6. `/release-check` when the build is candidate quality

Rules:
- severity must reflect player impact and milestone risk
- repeated issue classes should trigger root-cause review, not only ticket closure

## 6. Release Workflow
Goal: ship a build or approve it for submission.

Sequence:
1. `/release-check`
2. `/cert-check` when platform certification applies
3. final bug triage and waiver review
4. build and package verification
5. `/patch-notes`
6. go/no-go decision by `release-manager`, `producer`, `qa-lead`, and required reviewers

Release is blocked when:
- there are unresolved crashes, progression blockers, save corruption risks, or compliance failures without explicit waiver
- the build cannot be reproduced or diagnosed

## 7. LiveOps Workflow
Goal: prepare and validate an event, offer, or post-launch content change.

Sequence:
1. `/liveops-brief`
2. `/telemetry-plan`
3. design and implementation changes
4. `/qa-plan`
5. validation of economy, UX, entitlement, and rollback readiness
6. `/release-check`
7. `/patch-notes` if player-facing communication is needed

## 8. Engine-Specific Setup Workflow
Goal: bootstrap or normalize a project inside one engine.

Sequence:
- Unity: `/unity-setup` → `/unity-review` → `/unity-placeholders` → `/scene-bootstrap` → `/unity-scene-audit` or `/unity-build-fix` as needed
- Unreal: `/unreal-setup` → `/unreal-review` → `/unreal-blueprint-audit` or `/unreal-build-fix` as needed
- Godot: `/godot-setup` → `/godot-review` → `/godot-scene-audit` or `/godot-build-fix` as needed

## 9. Learning and System Improvement Workflow
Goal: turn repeated project experience into reusable process and skills.

Sequence:
1. `/learn`
2. consolidate repeated findings and anti-patterns
3. `/evolve`
4. `/skill-create-game` when a reusable operational pattern is stable enough to formalize
5. `/update-docs`

## General Escalation Rules
Escalate to `planner`, `producer`, or the relevant lead when:
- ownership is unclear
- design and implementation disagree
- milestone scope shifts materially
- engine-specific constraints threaten common planning assumptions
