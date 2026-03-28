# contexts/

Phase context files shift AI agent priorities depending on where a project is in the game development lifecycle. Loading a context tells the agent which roles are active, which documents are authoritative, and what to escalate — all specific to that phase.

## What context files do

Without a context, an agent applies generic behavior regardless of the project phase. With a context loaded:

- only the agents relevant to that phase are active
- the correct source-of-truth documents are referenced
- priorities and escalation triggers match the phase's actual concerns
- anti-patterns specific to that phase are avoided

Context files do not replace `CLAUDE.md` or `AGENTS.md`. They refine behavior on top of them.

## Available phases

| File | Phase | When to use |
|------|-------|-------------|
| `ideation.md` | Ideation | Exploring concept, audience, pillars, and references — no engine locked |
| `research.md` | Research | Evaluating engines, plugins, and technical approaches before committing |
| `preproduction.md` | Pre-production | Validating the core loop through a vertical slice |
| `production.md` | Production | Implementing features against a milestone plan |
| `review.md` | Review | Evaluating a milestone, feature, or build against defined exit criteria |
| `performance.md` | Performance | Profiling, root-cause analysis, and optimization against platform budgets |
| `qa.md` | QA | Structured testing, regression, and stability validation |
| `release.md` | Release | Certification, submission, and delivery to platform holders |
| `liveops.md` | Live ops | Post-launch patches, events, telemetry, and incident response |

## How to activate a context

For the context file to take effect, the agent must actually read it. Simply telling the agent "we are in pre-production" activates its generic knowledge of that phase — not the specific priorities, agents, and escalation criteria defined in this repository.

### Option 1 — Explicit at the start of a session

Ask the agent to read the file before starting work:

```
Read contexts/preproduction.md and apply it for this session.
```

### Option 2 — Automatic via your project configuration

Add a directive to your project's AI configuration file (`CLAUDE.md`, `AGENTS.md`, or equivalent) so the context is applied every session without having to ask:

```markdown
## Current Phase

Pre-production. Read `contexts/preproduction.md` at the start of each session and apply its priorities and agent roles.
```

> **Note:** Option 2 is recommended for sustained phases. It ensures the context is never forgotten between sessions and keeps the active phase visible to anyone working in the project.

## Switching phases

When the project moves to a new phase, update the directive in your configuration file to point to the new context file. Do not leave a stale phase active — it will cause the agent to apply the wrong priorities and route work to the wrong roles.

## What each context file contains

Every context file follows the same structure:

- **Purpose** — what this phase achieves and what its primary output is
- **Active Agents** — which agents are active and what their specific role is in this phase
- **Key Commands** — the commands most relevant to this phase
- **Source-of-Truth Documents** — which documents the agent should reference and maintain
- **Priorities** — what matters most, in order
- **Escalate When** — signals that the phase is blocked or at risk
- **What to Avoid** — anti-patterns specific to this phase
