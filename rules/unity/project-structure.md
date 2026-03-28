# unity/project-structure

Extends `../common/project-structure.md` with Unity-specific content.

## Folder Boundaries
- Keep `Assets`, `Packages`, and `ProjectSettings` clearly separated in responsibility.
- Separate runtime code, editor code, tests, art content, audio content, UI content, and third-party integrations.
- Reflect asmdef boundaries in folder layout where practical.

## Source Control Hygiene
- `.meta` files are part of the source of truth and must remain stable.
- Large folder moves, prefab restructures, and package changes require coordination because they create merge risk.

## Authoring Areas
- Use predictable locations for scenes, prefabs, ScriptableObjects, localization content, and build assets.
- Do not mix generated content, source content, and shipping runtime assets without explicit justification.

## Done Criteria
The Unity project structure is healthy when contributors can predict where code, content, tools, and tests belong.
