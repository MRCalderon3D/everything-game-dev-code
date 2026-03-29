# docs/templates/

Templates provide structured starting points for the documents that serve as the source of truth in a game development project. Each template defines the sections a document must contain, the decisions it must capture, and the open questions it must resolve before work proceeds.

## What templates do

Source-of-truth documents only work if they are complete. An incomplete GDD produces inconsistent design. An incomplete TDD produces integration surprises. An incomplete QA plan produces missed coverage.

Templates enforce completeness by making the required sections explicit. They do not prescribe the answers — they prescribe the questions that must be answered before the document is considered done.

## Available templates

### Design documents

| Template | Purpose | Primary author |
|----------|---------|----------------|
| `game-design-document.md` | Define the game's concept, core experience, systems, and content scope | `gdd-designer` |
| `technical-design-document.md` | Define the architecture, data design, integration points, and performance contract for a system | `technical-design-lead` |
| `art-bible.md` | Define the visual direction that artists, technical art, and marketing execute against | `technical-artist` |
| `audio-bible.md` | Define the audio direction, sound palette, and mixing philosophy | `audio-designer` |

### Planning documents

| Template | Purpose | Primary author |
|----------|---------|----------------|
| `milestone-plan.md` | Define milestone scope, sequencing, exit criteria, and risk assumptions | `producer` |
| `vertical-slice-plan.md` | Scope and validate the core loop proof before full production | `planner` + `producer` |

### Quality and testing

| Template | Purpose | Primary author |
|----------|---------|----------------|
| `qa-test-plan.md` | Define test coverage, focus areas, regression scope, and platform matrix | `qa-lead` |
| `playtest-report.md` | Synthesize playtest observations into prioritized findings with player evidence | `playtest-analyst` |

### Release and live operations

| Template | Purpose | Primary author |
|----------|---------|----------------|
| `release-checklist.md` | Validate build readiness against all exit criteria before submission | `release-manager` |
| `telemetry-plan.md` | Define instrumentation strategy, event taxonomy, and success metrics | `telemetry-analyst` |

## How to use a template

Templates are starting points, not final documents. When an agent creates a new document:

1. Copy the template to the appropriate location in the project (e.g., `docs/game-design-document.md`).
2. Fill in every section — do not delete sections you have not answered yet; mark them `TBD` with a note.
3. Open questions go in the **Open Questions** section at the bottom. Questions that block production must be resolved before the document is marked complete.
4. Update the document when decisions change. A stale document is worse than no document.

The `doc-updater` agent and `/update-docs` command exist specifically to keep these documents in sync with implementation.

## Document structure

Most templates follow a consistent section pattern:

1. **Overview** — what the document covers and its current status
2. **Core decisions** — the non-negotiable choices the document captures
3. **Detailed content** — the bulk of the document, organized by domain
4. **Risks and assumptions** — what could invalidate the document's decisions
5. **Open questions** — decisions not yet made, with owners and target resolution dates
6. **Changelog** — a brief history of significant changes to the document

## Relationship to other folders

- **agents/** — each template is owned by a specific agent role responsible for keeping it current
- **commands/** — `/gdd`, `/tech-design`, `/qa-plan`, `/playtest-report`, `/milestone-plan`, and `/release-check` use these templates as their output format
- **skills/workflow/** — `gdd-writing`, `technical-design-document`, `milestone-planning`, and `playtest-analysis` use these templates as part of their process
- **examples/** — each example project includes one or more completed template instances showing the template in use
- **docs/orchestration/role-handoffs.md** — defines the minimum content a document must contain before it can be handed off between roles
