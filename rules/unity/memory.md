# unity/memory

Extends `../common/memory.md` with Unity-specific content.

## Asset Lifetime
- Define who loads assets, who keeps references alive, and who releases them.
- Long-lived references must be deliberate, especially for scenes, addressable content, atlases, audio, and large prefabs.

## Data Rules
- Do not let temporary runtime state leak into assets or serialized authoring objects unintentionally.
- Save formats, migration behavior, and serialization changes must be reviewed before release branches.

## Content Rules
- Texture, audio, animation, and mesh memory must be budgeted by platform.
- Shared content should not remain pinned in memory by accidental cross-scene or singleton references.

## Done Criteria
Unity memory management is healthy when residency, ownership, and release behavior are explicit.
