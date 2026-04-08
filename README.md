<div align="center">

# Everything Game Dev Code

### A universal scaffold for AI-assisted game development.
### Multi-engine. Multi-harness. One coordinated workflow.

<br>

![license](https://img.shields.io/badge/license-MIT-blue)
![agents](https://img.shields.io/badge/agents-42-blueviolet)
![commands](https://img.shields.io/badge/commands-51-orange)
![skills](https://img.shields.io/badge/skills-86-brightgreen)
![rules](https://img.shields.io/badge/rules-92-yellow)
![contexts](https://img.shields.io/badge/contexts-10-cyan)
![harnesses](https://img.shields.io/badge/harnesses-5-red)
![engines](https://img.shields.io/badge/engines-Unity%20%7C%20Unreal%20%7C%20Godot%20%7C%20HTML-8A2BE2)

**Unity** · **Unreal Engine** · **Godot** · **HTML/JS** — strict engine isolation, shared standards.

</div>

---

Not just a prompt collection — a structured operating system for game projects that combines:
- **Rules** for policy and standards
- **Agents** for role specialization
- **Commands** for repeatable entry points
- **Skills** for reusable execution patterns
- **Contexts** for phase-specific behavior
- **Hooks** for workflow automation
- **Harness adapters** for Claude, Codex, Cursor, OpenCode, and Kiro

## Goals
- Keep shared game-development standards engine-neutral.
- Let Unity, Unreal, and Godot each extend the base cleanly without contaminating one another.
- Support real production work across design, engineering, content, QA, release, and live ops.
- Turn repeated solutions into reusable skills and structured workflows.
- Make the repository portable across multiple coding assistants and harnesses.

## Repository Model
This scaffold is organized in layers:

- `rules/` — what good looks like
- `agents/` — who does the work
- `commands/` — how work starts
- `skills/` — how work is executed well
- `contexts/` — how priorities shift by phase
- `hooks/` — how workflow safeguards are enforced
- `manifests/` — how subsets are installed by profile
- `schemas/` — JSON validation for manifests, hooks, and plugins
- `docs/templates/` — structured templates for GDD, TDD, QA plans, and other deliverables
- `docs/orchestration/` — agent routing, role handoffs, and workflow sequences
- `tests/` — how the scaffold verifies itself
- harness adapters — how different AI clients consume the same source of truth

## Engine Isolation Policy
The repository is intentionally split into:
- `rules/common/`
- `rules/unity/`
- `rules/unreal/`
- `rules/godot/`

And equivalent skill / command / review layers where needed.

Shared documents should describe **intent**, **ownership**, and **quality bars**. Engine-specific files should describe **implementation conventions** inside that engine only.

## Intended Use Cases
- New game project setup
- Multi-engine studio workflows
- Internal AI workflow standardization
- GDD and technical design maintenance
- QA and release readiness reviews
- Plugin / content / tooling governance
- Cross-discipline planning and orchestration

## Recommended Start Order
If you are using this repository from scratch:
1. Read `CLAUDE.md` and `AGENTS.md`
2. Choose or create an install profile in `manifests/`
3. Confirm the target engine layer
4. Review `rules/common/` plus the relevant engine rules
5. Use `commands/plan.md` before implementation begins
6. Keep `docs/`, `contexts/`, and `hooks/` aligned as the project evolves

## Supported Harnesses
- Claude Code
- Codex
- Cursor
- OpenCode
- Kiro

Each harness adapter points back to the same shared scaffold rather than becoming a second source of truth.

## Current Status
The scaffold is intentionally modular. Different blocks may be added or replaced over time, but the repository should always preserve:
- flat agent and command structures
- layered rules
- grouped skills
- engine isolation
- harness portability

## Principles
- Design before implementation
- Explicit ownership over implicit assumptions
- Testability over cleverness
- Documentation that supports execution
- Measured performance and release readiness
- Accessibility, QA, and compliance as first-class requirements

## License
This repository is provided under the MIT License unless you replace it with your studio’s internal licensing policy.
