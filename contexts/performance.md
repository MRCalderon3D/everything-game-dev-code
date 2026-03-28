# performance

Focus on optimization and budgets. Profiling, root-cause analysis, and targeted fixes to bring the build within platform-specific frame time, memory, and load time targets.

## Purpose
Identify, quantify, and eliminate performance violations before they compound. Performance work is most effective when it is continuous throughout production, not deferred to a post-alpha crunch.

## Active Agents
- `performance-reviewer` — owns profiling sessions, root-cause analysis, and optimization recommendations
- `gameplay-programmer` — implements fixes for CPU-bound game logic and system-level bottlenecks
- `technical-design-lead` — evaluates whether performance issues reveal architectural problems that require structural fixes
- `planner` — tracks open performance issues and ensures fixes are scoped into milestones
- `qa-lead` — verifies that performance fixes hold across regression and do not introduce new failures

## Key Commands
- `/perf-budget` — define or review frame time, CPU, GPU, and load time targets per platform
- `/memory-budget` — define or review texture, audio, mesh, and runtime memory targets per platform
- `/plan` — scope performance work into the current milestone or create a dedicated performance sprint
- `/tech-design` — document architectural changes made in response to profiling findings

## Source-of-Truth Documents
- `Performance budget` — locked targets per platform and build configuration
- `Memory budget` — locked targets per platform and asset category
- `Profiling logs` — session-by-session profiling records with root-cause notes
- `TDD` — updated when performance fixes require architectural changes

## Priorities
1. Profile before optimizing — never guess at bottlenecks, always measure.
2. Fix the worst violation first — address budget overruns in priority order, not convenience order.
3. Distinguish CPU, GPU, memory, and load time problems — each requires different investigation and different fixes.
4. Validate every fix with a before/after profile under the same conditions.
5. Treat recurring performance regressions as a systemic problem, not a series of unrelated incidents.
6. Ensure performance budgets are enforced per platform — do not allow PC headroom to mask console violations.

## Escalate When
- A performance violation cannot be fixed without a structural change that affects the TDD
- A budget target cannot be met on a target platform without cutting content or features
- Profiling reveals a third-party plugin or middleware as the bottleneck with no available fix
- Performance regressions keep reappearing after fixes — the root cause is systemic, not local
- The team cannot agree on what the authoritative performance target is for a given platform

## What to Avoid
- Optimizing without profiling data — premature optimization creates maintenance debt
- Accepting "it's fast enough on my machine" — always measure on the target platform
- Deferring all performance work to a dedicated sprint after alpha — late fixes are more expensive
- Making performance fixes that break functionality without documenting the trade-off
- Treating GPU, CPU, and memory problems interchangeably — they have different root causes and fixes
