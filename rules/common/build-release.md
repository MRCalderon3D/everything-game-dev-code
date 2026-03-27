# Build and Release

## Purpose
Define common rules for build stability, versioning, release readiness, distribution, rollback, and post-release discipline.

## Scope
Applies to all game projects. Engine-specific build commands and CI details belong in engine packs and project scripts.

## Build Rules
- Every target platform must have an explicit build matrix, owner, and smoke-test path.
- Build commands must be repeatable, scriptable, and environment-aware.
- Manual build steps should be minimized and documented when unavoidable.
- Build failures must surface actionable logs and ownership.

## Branch and Version Rules
- Release branches, version numbers, and tagging conventions must be documented before external testing or store submission.
- Versioning must distinguish internal iteration, QA candidate, release candidate, and public release.
- Changelog generation must be part of the release process.

## Release Gates
- No release candidate without updated release notes, known-issues list, and sign-off owners.
- No release candidate with unresolved crash, data-loss, progression-blocking, or certification-critical issues unless explicitly waived.
- Performance, save/load, onboarding, input, entitlement, and startup flows must be part of release smoke tests.
- Store metadata, screenshots, age ratings, localization coverage, and legal requirements must be checked before submission.

## Quality Gates
- The release pipeline must define blocking severity thresholds.
- Test passes must cover regression, platform-specific checks, and major progression paths.
- Live-service or online products require environment validation, dependency checks, and rollback readiness.

## Rollback and Recovery
- Every release plan must define rollback or hotfix strategy.
- Save data compatibility and migration risk must be assessed before schema or progression changes ship.
- Operational playbooks must exist for outage, broken patch, or corrupted content scenarios where relevant.

## Documentation Rules
- Release checklists must be versioned and owned.
- Every release must document included changes, known issues, risk areas, and go/no-go decision records.
- Post-release incidents must produce corrective actions, not only patch notes.

## Coordination Rules
- Producer, QA lead, technical lead, and release owner must agree on release status.
- Marketing, community, localization, support, and analytics dependencies must be surfaced before final release approval when applicable.

## Deliverables
- Build matrix.
- Release checklist.
- Versioning policy.
- Changelog template.
- Rollback or hotfix playbook.

## Done Criteria
A release process is ready when builds are repeatable, quality gates are explicit, rollback is planned, and go/no-go decisions are traceable.
