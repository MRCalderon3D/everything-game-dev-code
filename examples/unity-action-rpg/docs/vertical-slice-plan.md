# Ashen Veil Vertical Slice Plan

## Slice Goal

Prove that one combat zone, one town hub, and one first-boss encounter can hit the intended quality bar without breaking memory, load flow, or save continuity.

## Scope

- One traversal loop from hub to combat zone
- Three enemy archetypes with readable combat roles
- One unlockable traversal ability
- Save/load support before and after the boss
- Controller-first HUD and pause menu flow

## Exit Criteria

- Players can complete the slice in 15 to 20 minutes without blockers
- Combat readability is judged acceptable in playtest review
- Hub-to-combat transition stays within the performance budget
- Save/load restores player location, health state, unlocks, and quest progress correctly

## Owners

- Player-facing direction: `gdd-designer`
- Combat tuning: `combat-designer`
- Technical structure: `technical-design-lead`
- Unity implementation review: `unity-reviewer`
- Validation: `qa-lead`

## Major Risks

- Prefab variants drifting from intended combat data ownership
- ScriptableObjects being used as mutable runtime state
- HUD readability collapsing during multi-enemy encounters
- Memory spikes during hub return after boss completion
