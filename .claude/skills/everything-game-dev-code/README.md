# Claude Skills Adapter

Claude should resolve reusable workflows to the shared `skills/` tree.

## Lookup order
- pick the domain skill first (`workflow`, `design`, `engineering-common`, `qa-release`, etc.)
- then, when required, use the engine-specific skill set (`unity`, `unreal`, or `godot`)

## Rule
Prefer the smallest matching skill set that completes the task without pulling in unrelated engine assumptions.
