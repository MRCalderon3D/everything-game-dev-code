# Unity Version Control

## Purpose
Define Unity-specific source control rules for assets, meta files, merge risk, and binary content.

## Scope
Applies to Unity project files, generated artifacts, and collaboration workflows.

## Core Rules
- Meta files are required and must stay in source control.
- Ignore generated folders and caches according to project policy.
- Binary assets, large scenes, and high-churn prefabs require change discipline because merge cost is real.

## Collaboration Rules
- Coordinate work on broad shared scenes, prefabs, and project settings to reduce conflict churn.
- Large refactors involving folder moves, prefab nesting changes, or package layout changes should be announced and time-boxed.
- Avoid unnecessary reserialization churn in unrelated files.

## Review Rules
- Reviewers should pay attention to `.meta`, `.unity`, `.prefab`, `.asset`, and project-setting diffs, not only `.cs` files.
- Asset changes with no clear intent should be questioned before merge.

## Done Criteria
Unity version-control hygiene is healthy when merges are predictable, meta integrity is preserved, and asset churn stays intentional.
