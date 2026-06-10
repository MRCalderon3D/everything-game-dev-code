# web/tooling

Extends `../common/documentation.md` with web-specific content.

## Tooling Rules
- Every project must run from a local dev server, such as the vite dev server or a simple static server; never rely on opening files directly from disk.
- Formatters and linters must be configured in the repository and runnable with one command locally and in automation.
- Validators, asset packers, and pipeline helpers must reduce manual work or pipeline risk, fail safely, and explain what changed.
- Production-critical tools need documentation and an owner.

## Workflow Rules
- Browser devtools workflows worth standardizing, such as performance profiling, memory snapshots for allocation churn, network throttling, and device emulation, should be documented per project.
- Avoid hidden workflows that depend on one expert remembering local rituals.
- Build tool and dependency upgrades that affect tooling require compatibility review and migration notes.

## Done Criteria
Web tooling is acceptable when it is safe, discoverable, and worth the maintenance cost.
