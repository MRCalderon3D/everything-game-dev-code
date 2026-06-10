# Web Version Control

## Purpose
Define version control expectations for web repositories, dependencies, built output, and collaboration workflow.

## Scope
Applies to repository hygiene, dependency management, generated artifacts, large assets, and review workflow.

## Repository Rules
- Never commit `node_modules`, package manager caches, or other machine-local directories.
- Commit the lockfile and keep it consistent with one chosen package manager per project.
- The `dist/` commit policy must be explicit per project: ignore it by default, or document why built output is committed, such as branch-based static hosting.
- Source-controlled files plus a clean install must be sufficient to reproduce the build.

## Merge and Review Rules
- Lockfile and dependency changes must be reviewed deliberately, not absorbed silently inside feature diffs.
- Large binary assets such as atlases and audio need a documented strategy before they bloat history.
- Changes to build configuration, entry HTML, or deploy settings require extra review attention.

## Done Criteria
Version control practices are healthy when installs are reproducible, generated output policy is explicit, and dependency changes are intentional.
