# docs/orchestration/

Orchestration documents define how work flows between agents. They specify which agent owns which task, what a complete handoff looks like, and what sequence of roles is followed for each type of work. These documents are the scaffold's coordination layer — they prevent roles from overlapping, missing steps, or handing off incomplete work.

## What orchestration documents do

The scaffold has 40+ agents and 60+ commands. Without explicit routing, work either stalls (no one knows who acts next) or duplicates (two agents act on the same problem independently).

Orchestration documents answer three questions:

1. **Who does this task?** — agent-to-command and agent-to-skill mappings
2. **What must they hand off?** — minimum required content for each role transition
3. **In what order?** — the canonical sequence for each workflow type

## Files

### command-agent-map.md

Maps every command to the agent or agents responsible for executing it. Use this when you need to know which agent a specific command activates, or when building a new command and need to assign agent ownership.

### agent-skill-matrix.md

Maps every agent to its primary and secondary skill domains. Use this when you need to know what skills an agent brings to a task, or when an agent needs to route a subtask to a more appropriate role.

### dependency-graph.md

Generated Mermaid visualization of command -> agent and command -> skill edges, grouped by the sections of `command-agent-map.md`, plus an orphaned-skills report. Regenerate with `npm run sync:graph`; `npm run validate` fails when it drifts from its sources. Do not edit by hand.

### role-handoffs.md

Defines the minimum content required for each role transition. Handoffs are structured packets — not chat summaries — that ensure the receiving agent has everything it needs to continue without re-doing work.

Key handoffs defined:

| From | To | Required content |
|------|----|-----------------|
| `planner` | `producer` | Confirmed plan, phase list, risk register, open decisions |
| `gdd-designer` | `technical-design-lead` | Completed GDD with systems section, player verbs, economy overview |
| `technical-design-lead` | `gameplay-programmer` | TDD with architecture overview, interfaces, data design, performance contract |
| `gameplay-programmer` | `qa-lead` | Feature branch, test seams documented, known edge cases listed |
| `qa-lead` | `release-manager` | Completed QA plan, test results, zero P0/P1 bugs open |
| Any role | `doc-updater` | List of decisions that changed since the last doc update |

### workflow-sequences.md

Defines the default execution path for each major workflow type. Sequences specify which agents activate in order and at what point decision gates occur.

Sequences defined:

| Workflow | Typical sequence |
|---------|-----------------|
| New feature | `planner` → `systems-designer` → `gameplay-programmer` → `code-reviewer` → `qa-lead` → `doc-updater` |
| Vertical slice | `planner` → `gdd-designer` → `technical-design-lead` → `gameplay-programmer` → `qa-lead` → `playtest-analyst` |
| Technical system | `architect` → `technical-design-lead` → `gameplay-programmer` → `performance-reviewer` → `code-reviewer` |
| QA and stabilization | `qa-lead` → `gameplay-programmer` (bug fix) → `qa-lead` (regression) → `release-manager` |
| Release | `release-manager` → `build-engineer` → `qa-lead` → `console-compliance-reviewer` → `release-manager` |
| Live ops event | `liveops-manager` → `economy-designer` → `gameplay-programmer` → `qa-lead` → `telemetry-analyst` |
| Engine setup | `build-engineer` → `architect` → `gameplay-programmer` → `doc-updater` |
| Asset generation | `technical-artist` → `2d-artist` / `audio-designer` → engine import → art/audio pass review |

### engine-isolation.md

Documents the strict policy preventing Unity, Unreal, Godot, and web implementation guidance from mixing in the same agent pass. Defines what counts as contamination, when cross-engine work is legitimate (comparison, migration research), and how to detect and correct a contamination incident.

## How to use these documents

These documents are consumed by agents, not by users directly. When an agent executes a command that spans multiple roles:

1. It reads `command-agent-map.md` to confirm which agents are responsible.
2. It reads `workflow-sequences.md` to determine the correct execution order.
3. Before handing off to the next agent, it reads `role-handoffs.md` to confirm the handoff packet is complete.
4. If engine-specific work is involved, it reads `engine-isolation.md` to confirm the correct engine layer is active.

## Relationship to other folders

- **agents/** — orchestration documents define how agents coordinate, not what each agent does internally
- **commands/** — commands initiate sequences; orchestration documents define what those sequences look like
- **skills/workflow/orchestration-patterns** — the skill for implementing multi-agent workflows uses these documents as its reference
- **schemas/** — JSON schemas validate the structured configuration documents that support orchestration (hooks, manifests, MCP registry)
- **contexts/** — active phase contexts reference the relevant workflow sequences for that phase
