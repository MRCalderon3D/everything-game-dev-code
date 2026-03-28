# TROUBLESHOOTING.md

This guide helps diagnose common issues when using the scaffold.

## 1. The AI keeps mixing Unity, Unreal, and Godot guidance

### Likely cause
The active context or install profile is unclear, or the task is being handled from common layers when it should be routed through an engine-specific pack.

### What to check
- confirm the active engine profile in `manifests/install-profiles.json`
- confirm the task is using the correct engine rules pack
- confirm the relevant command or agent is engine-specific when implementation details are involved
- review `docs/orchestration/engine-isolation.md`

### Fix
- restate the active engine explicitly
- route implementation work through the relevant engine rules and skills
- keep common layers limited to engine-neutral design and policy

## 2. Outputs are too generic

### Likely cause
The workflow is skipping commands, agents, or templates and jumping directly to freeform advice.

### What to check
- was the task routed through the right command?
- was the correct specialist agent used?
- is there a template-backed deliverable available?

### Fix
- start from `/plan`, `/gdd`, `/tech-design`, `/verify`, or another appropriate command
- use the relevant template from `docs/templates/`
- pull in the matching skills for the task domain

## 3. Skills are not being used consistently

### Likely cause
Routing is too loose, or the agent definition does not clearly point to the relevant skills.

### What to check
- `docs/orchestration/agent-skill-matrix.md`
- the relevant agent file
- the command-to-agent mapping

### Fix
- tighten the command routing
- update the agent or orchestration docs if the mapping is unclear
- avoid relying on memory when the skill already exists

## 4. Documentation drifts away from implementation

### Likely cause
The workflow updates code or design decisions without updating the source-of-truth documents.

### What to check
- `README.md`
- `AGENTS.md`
- the GDD, TDD, QA plan, telemetry plan, or release checklist tied to the work

### Fix
- make documentation updates part of the definition of done
- use `doc-updater` or `/update-docs` in the workflow
- clarify which document is authoritative for the feature

## 5. Install profiles feel too broad or too narrow

### Likely cause
The profile definitions in `manifests/` do not match your studio or project shape yet.

### What to check
- `install-components.json`
- `install-modules.json`
- `install-profiles.json`

### Fix
- add or refine profiles for your project types
- separate preproduction-only, production, multiplayer, liveops, or mobile-F2P workflows when needed
- keep engine isolation strict while adjusting capabilities

## 6. Tests fail after changing manifests or schemas

### Likely cause
The install logic, schemas, and tests have drifted apart.

### What to check
- schema files in `schemas/`
- test files in `tests/`
- any new keys or IDs introduced in manifests

### Fix
- update schemas and tests together
- keep naming consistent across components, modules, and profiles
- avoid introducing undeclared config structure

## 7. A command exists, but no one knows when to use it

### Likely cause
The command is underspecified or not clearly mapped in orchestration docs.

### What to check
- the command file in `commands/`
- `docs/orchestration/command-agent-map.md`
- `docs/orchestration/workflow-sequences.md`

### Fix
- clarify the command purpose, expected outputs, and agent routing
- reduce overlap with similar commands if confusion remains

## 8. Agent outputs conflict with each other

### Likely cause
Ownership or source-of-truth discipline is unclear.

### What to check
- `AGENTS.md`
- `docs/orchestration/role-handoffs.md`
- the relevant design and technical documents

### Fix
- identify the owning role
- identify the authoritative document
- escalate conflicts early rather than letting both versions continue

## 9. The scaffold feels too heavy for a small project

### Likely cause
Too many layers are being used at once.

### Fix
For smaller projects, start with:
- `rules/`
- `agents/`
- `commands/`
- `skills/`
- `docs/templates/`
- one lightweight install profile

Then add schemas, tests, examples, MCP configs, and adapters only where they create clear value.

## 10. The scaffold feels too light for a large studio workflow

### Likely cause
The base scaffold is intentionally generic and needs studio-specific extension.

### Fix
Add:
- stricter schemas
- richer install profiles
- more examples
- internal MCP configs
- adapter-specific docs
- studio-specific hooks and scripts
- platform- or genre-specific skills

## 11. The harness adapter layers feel disconnected from the root scaffold

### Likely cause
The root docs and adapter docs are not yet synchronized.

### Fix
Update:
- root docs
- adapter instructions
- MCP configs
- manifest assumptions
- any scripts relied on by the adapters

## 12. Nobody knows what to customize first

### Recommended order
1. install profiles
2. root docs
3. engine-specific rules
4. high-value skills
5. orchestration docs
6. schemas and tests
7. adapters and MCP configs

## Final Advice

When the scaffold feels confusing, the problem is usually one of these:

- the wrong layer is being used
- engine separation is weak
- ownership is unclear
- documentation is stale
- validation has not caught up with structure

Fix those first before adding more files.
