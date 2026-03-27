# Engine Isolation Policy

## Main Rule
Never mix rules or engine-specific skills from different engines within the same active profile.

## How It Is Enforced
- `rules/common/` is neutral
- `rules/unity/`, `rules/unreal/`, `rules/godot/` only extend `common/`
- engine-specific skills live in `skills/unity/`, `skills/unreal/`, `skills/godot/`
- engine-specific commands call agents from the same engine
- installation profiles activate one engine by default

## Exceptions
Comparisons, migrations, or cross-engine studies must live in neutral documents and skills, not in active production rules.
