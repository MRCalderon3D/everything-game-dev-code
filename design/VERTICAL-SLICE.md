# Vertical Slice — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Owner:** planner / producer
- **Contributors:** gdd-designer, technical-design-lead
- **Version:** 0.1
- **Status:** Draft
- **Last Updated:** 2026-03-30
- **Related Docs:** `design/GDD.md` (v0.1), `design/TDD.md` (v0.1)

---

## 1. Scope

### 1.1 Purpose
Prove that the core experience of Dash & Collect is fun and buildable before production begins. The slice must be playable, not merely documented.

### 1.2 Minimum Scope
The smallest playable build that demonstrates:
- The player can auto-run and **dash left/right between lanes**
- Collecting a specific item type produces a visible, legible change to what spawns next
- One chain completion triggers one modifier effect
- Hazard collision ends the run
- Instant restart works with no loading screen
- Speed escalates meaningfully within a single 90-second run

This scope is deliberately narrow — art is placeholder, audio is placeholder, meta progression is absent. The slice proves the **differentiator** (collect-modifies-world), not the full game.

### 1.3 Movement Mechanic — Decided

The movement mechanic is **left/right 3-lane snap dash**, as defined in GDD §3.2 and §5.1. Confirmed 2026-03-30.

The "jump mechanic" referenced in the original command arguments was inconsistent with the GDD and has been rejected. The core differentiator — that the player *chooses which lane to intercept* in order to modify upcoming obstacles — requires lateral positioning, not vertical evasion.

| Proof point argument | Resolution |
|---|---|
| Player auto-run | Confirmed — character runs automatically (GDD §5.1) |
| ~~Jump mechanic~~ | **Rejected** — mechanic is left/right 3-lane snap dash |
| One obstacle type | Grey-box scope reduction — acceptable for prototype |
| One coin type | Grey-box scope reduction — Dash collectible (blue) for prototype |
| Speed ramp | Confirmed — every 250m (GDD §6.3) |
| Game over + instant retry | Confirmed — GDD §4.3 |

---

## 2. Proof Points

Each proof point is a testable question the slice must answer. The slice is not done until all answers are affirmative.

| # | Proof Point | Pass Condition |
|---|---|---|
| P1 | Auto-run feels controlled, not helpless | 4/5 first-time players say they feel in control during a 60-second run |
| P2 | Left/right dash input is responsive on both keyboard and touch | No player reports input delay or missed input in grey-box test |
| P3 | Collecting a Dash collectible visibly reduces obstacle density within 2 beats | 4/5 players notice the change without being told |
| P4 | The core loop is understandable without a tutorial | 4/5 players understand "collect to change what comes next" within 60 seconds of play (GDD §13.2 threshold) |
| P5 | Death is clear and motivates retry | 4/5 players immediately press restart; no players report confusion about why they died |
| P6 | Speed escalation is felt but not unfair at 500m | New players reach 500m within 3 attempts on average |
| P7 | Chain counter is readable without text | 4/5 players can describe the chain system after one run without explanation |
| P8 | Frame rate holds at 60fps on mobile target hardware | Profiler shows < 16ms frame time on iPhone 12 equivalent during 60s run |

---

## 3. What Must Be Real vs. What Can Be Stubbed

### Must be real (non-negotiable for the slice)
- Left/right dash input on keyboard and touch
- 3-lane position model with snap movement
- At least 1 collectible type (Dash/blue) that triggers a visible modifier
- At least 1 obstacle type in at least 2 lane configurations
- Spawn system producing readable patterns (not random per-tile)
- Collision detection triggering death state
- Death screen showing distance and score
- Instant restart returning to identical run-start state
- Speed escalation over time
- Chain counter (even if visual is placeholder)

### Can be stubbed or faked
- Art: coloured rectangles and circles acceptable
- Audio: single placeholder SFX per event acceptable
- Chain modifier for Shield and Surge types (Dash modifier only required for slice)
- Meta progression, currency, unlocks
- Daily missions
- Personal best persistence (may use in-session memory only)
- Second and third biome visual themes
- HUD polish (distance counter + score in debug text is sufficient)

---

## 4. Quality Bar

The slice exits when all of the following are true:

### Gameplay
- [ ] P1–P7 proof points above are met in a 5-player playtest session
- [ ] No impossible obstacle layouts (all 3 lanes blocked simultaneously) occur in any observed run
- [ ] Dash modifier effect is correctly linked to Dash chain completion — not random

### Technical
- [ ] P8 (60fps on mobile target) verified in player build, not editor
- [ ] No null reference exceptions in a complete 90-second run
- [ ] Restart cycle completes in < 1 second (no visible loading)
- [ ] Input works on both keyboard and touch in the same build

### Scope
- [ ] No production systems have been built to achieve this slice (no meta UI, no save system, no Addressables)
- [ ] All placeholder assets are clearly labelled in-scene so they are not mistaken for final content

---

## 5. Risks the Slice Must Retire

| Risk | Why it must be retired now | Retire condition |
|---|---|---|
| Collect-modifies-world is not legible | Highest design risk per GDD §12.3 — if players don't read the connection, the differentiator fails | P3 + P4 pass in playtest |
| Cross-platform input parity | Art lock depends on this; can't finalize collectible icons until interaction model is confirmed | P2 pass on both platforms in same build |
| Lane-based movement is fun for 90 seconds | If the lane model feels monotonous before speed escalates, the loop needs adjustment before production | P1 pass; internal "one more run" test |
| Speed escalation timing | If speed escalates too fast, new players churn at 100m; too slow, the game is boring | P6 pass with casual-audience playtesters, not devs |

### Not in scope to retire in this slice
- Daily challenge feasibility (deferred per GDD §4.1)
- Art style direction (art direction workshop is separate pre-production gate)
- Monetization model (out of scope for v1 per GDD §12.1)

---

## 6. Slice Milestones

### Milestone 1 — Grey-box playable (target: ~1 week)
**Goal:** Core loop running in Unity, no art required.

Deliverables:
- `GameManager` state machine: Idle → Running → Dead → Restart
- `PlayerController`: 3-lane snap dash, keyboard + touch input
- `SpawnManager`: at least 3 authored chunk prefabs (coloured rects), Dash modifier bias wired
- `CollisionHandler`: pickup + death dispatch
- `ScoreManager`: score, chain counter (debug display)
- Death screen: distance + score in placeholder UI
- Speed escalation every 250m

Exit criteria: Any team member can play a complete run from start to death to restart with no editor intervention.

### Milestone 2 — Modifier loop closed (target: ~3 days after M1)
**Goal:** The collect-modifies-world loop is playable and observable.

Deliverables:
- Dash chain completion triggers `SpawnManager.SetModifierBias(Dash)` — reduced obstacle density for 5s
- Chain counter visual near character (even if placeholder)
- Chain completion feedback (screen-edge flash, single SFX)
- At least 5 authored chunk prefabs covering Sparse and Dense tags

Exit criteria: Playtesters can observe that grabbing Dash items changes what comes next.

### Milestone 3 — Slice playtest (target: ~2 days after M2)
**Goal:** Run structured 5-person playtest against proof points P1–P7.

Deliverables:
- Playtest build deployed on both PC and mobile (same build)
- Playtest protocol (5 tasks, observation notes sheet)
- Playtest report (use `/playtest-report`)

Exit criteria: All P1–P8 proof points evaluated; go/no-go recorded.

---

## 7. Out of Scope for the Slice

- Shield and Surge modifier chains (Dash only)
- Meta progression, coins, unlock shop
- Daily missions
- Any UI beyond death screen + score display
- Biome visual changes
- Final art or audio
- Save/load persistence beyond in-session memory
- Platform certification, app store builds

---

## 8. Open Questions

| Question | Owner | Blocking? | Next Step |
|---|---|---|---|
| ~~Jump vs. dash mechanic~~ | Design | **Resolved 2026-03-30** | Dash lateral confirmed |
| ~~Lane-based (3 lanes) or continuous horizontal? (GDD §14)~~ | Design | **Resolved 2026-03-30** | 3 discrete lanes, snap dash confirmed |
| What is the first biome visual direction? | Art | No — grey-box is fine for slice | Art direction workshop post-slice |
| Is Shield modifier playable in slice or deferred? | Producer | No | Deferred to production; Dash modifier only in slice |

---

## 9. Go / No-Go Record

| Date | Decision | Owner | Conditions |
|---|---|---|---|
| 2026-03-31 | **CONDITIONAL GO** | producer | P4 (modifier legibility) failed. Fix: add modifier activation feedback before M4 begins. Full 5-person playtest to be scheduled during M4 to formally retire R1. See `design/PLAYTEST-REPORT-M3.md`. |

---

## 10. Change Log

| Date | Change | Owner | Rationale |
|---|---|---|---|
| 2026-03-30 | v0.1 created | planner / producer | Initial vertical slice from `/vertical-slice` command |
| 2026-03-30 | §1.3 updated, §8 resolved | design | Jump mechanic rejected; dash lateral confirmed as the movement mechanic |
| 2026-03-31 | §9 go/no-go recorded | producer | Self-assessment playtest (1 tester). Conditional GO. P4 fix required before M4. |
