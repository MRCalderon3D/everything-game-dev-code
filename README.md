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

## Quickstart

```bash
git clone https://github.com/MRCalderon3D/everything-game-dev-code.git
cd everything-game-dev-code
```

Open the folder in your AI coding assistant (Claude Code, Cursor, Codex, OpenCode, or Kiro). The scaffold is loaded from the assistant's adapter plus the shared `AGENTS.md`, `rules/`, `commands/`, `agents/`, and `skills/` layers.

Then type commands in the chat:

| Command | What it does |
|---------|-------------|
| `/plan` | Outline your project before coding |
| `/gdd` | Generate a Game Design Document |
| `/tdd` | Generate a Technical Design Document |
| `/scene-bootstrap` | Scaffold a new scene |
| `/unity-setup` | Bootstrap a Unity project with conventions |
| `/unity-build-fix` | Diagnose and fix Unity build errors |
| `/godot-setup` | Bootstrap a Godot project |
| `/unreal-setup` | Bootstrap an Unreal project |
| `/full-game` | Orchestrate an entire game from scratch (experimental) |

You don't have to follow a specific order. Pick whatever command fits your current need — start a new project, generate a GDD for an existing one, run a QA review, or fix a build error.

### Step-by-step guide

The `guides/Dash & Collect/` folder contains a full tutorial that walks through building a game using the scaffold's commands, agents, skills, and contexts across all project phases.

### Example project

The `PirateInvaders/` folder contains a complete HTML game built with the `/full-game` command in a single pass. For real projects, we recommend going step by step.

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

## Supported Harnesses
- Claude Code
- Codex
- Cursor
- OpenCode
- Kiro

Each harness adapter points back to the same shared scaffold rather than becoming a second source of truth.

### Codex usage
Codex should start from `AGENTS.md` and `.codex/README.md`. Slash-style commands such as `/plan`, `/gdd`, and `/unity-review` map to `commands/<name>.md`; if the Codex client does not execute slash commands natively, type the command name in chat and ask Codex to run the matching scaffold command.

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
