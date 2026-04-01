# Milestone Plan — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Owner:** producer / planner
- **Contributors:** technical-design-lead, gdd-designer, qa-lead
- **Version:** 0.1
- **Status:** Draft
- **Last Updated:** 2026-03-30
- **Related Docs:** `design/GDD.md`, `design/TDD.md`, `design/VERTICAL-SLICE.md`, `design/PERF-BUDGET.md`, `design/MEMORY-BUDGET.md`

---

## 1. Plan Overview

Ten milestones from scaffold to live ops. Each milestone has a single stated goal, explicit entry criteria, deliverables with owners, and exit criteria. No milestone begins until its entry criteria are met.

| Milestone | Name | Phase | Status |
|---|---|---|---|
| M0 | Scaffold & Setup | Pre-production | **Complete** |
| M1 | Concept Lock | Pre-production | **Complete** |
| M2 | Vertical Slice — Grey-box | Pre-production | **Complete** |
| M3 | Vertical Slice — Modifier Loop | Pre-production | **Complete (conditional go)** |
| M4 | Core Systems | Production | **In Progress** |
| M5 | Full Feature | Production | Blocked on M4 |
| M6 | Code Review & Refactor | Production | Blocked on M5 |
| M7 | Performance | Production | Blocked on M6 |
| M8 | QA & Certification | Release | Blocked on M7 |
| M9 | Release & Live Ops | Live | Blocked on M8 |

---

## M0 — Scaffold & Setup

**Goal:** Repository, Unity project, and all pre-production documentation in place. No design or implementation ambiguity about the working environment.

**Phase:** Pre-production
**Status:** Complete

### Entry Criteria
- Repository created
- Engine selected (Unity 6000.3.12f1)

### Deliverables
| Deliverable | Owner | Done? |
|---|---|---|
| Repository scaffold (`agents/`, `commands/`, `skills/`, `rules/`, `hooks/`) | planner | ✓ |
| Unity project created, URP 2D configured | engineer | ✓ |
| `Assets/` folder structure normalised (Scripts, Art, Audio, Prefabs, Data, Tests) | engineer | ✓ |
| Assembly definitions: Runtime, Editor, Tests.Runtime, Tests.Editor | engineer | ✓ |
| `manifest.json` trimmed to relevant packages only | engineer | ✓ |
| `design/GDD.md` v0.1 | gdd-designer | ✓ |
| `design/TDD.md` v0.1 | technical-design-lead | ✓ |
| `design/PERF-BUDGET.md` v0.1 | performance-reviewer | ✓ |
| `design/MEMORY-BUDGET.md` v0.1 | performance-reviewer | ✓ |

### Exit Criteria
- [x] Any contributor can open the Unity project and run `Game.unity` without errors
- [x] All four asmdefs compile cleanly
- [x] GDD, TDD, PERF-BUDGET, MEMORY-BUDGET present and internally consistent
- [x] No open design questions blocking implementation

---

## M1 — Concept Lock

**Goal:** Core design decisions documented and agreed. The differentiator (collect-modifies-world), movement mechanic (3-lane snap dash), and platform targets (PC primary, Android secondary) are locked. Pre-production documents are source-of-truth.

**Phase:** Pre-production
**Status:** Complete

### Entry Criteria
- M0 complete

### Deliverables
| Deliverable | Owner | Done? |
|---|---|---|
| `design/VERTICAL-SLICE.md` v0.1 — scope, proof points, quality bar | producer / planner | ✓ |
| Lane model decision: 3 discrete lanes, snap dash | design | ✓ |
| Movement mechanic decision: dash lateral (jump rejected) | design | ✓ |
| Platform targets confirmed: PC 60fps primary, Android 30fps secondary | producer | ✓ |
| GDD §14 open questions resolved (lane model, movement) | design | ✓ |

### Exit Criteria
- [x] No open design questions that block Milestone 2 implementation
- [x] VERTICAL-SLICE.md status is not "pending conflict resolution"
- [x] TDD §1.3 and §12 reflect confirmed decisions, not assumptions

---

## M2 — Vertical Slice: Grey-box Playable

**Goal:** The complete run loop is playable in Unity with placeholder art. Any team member can play from spawn to death to instant restart with no editor intervention. Performance baselines measured.

**Phase:** Pre-production
**Status:** Complete

### Entry Criteria
- M1 complete (all design questions resolved)
- `InputSystem_Actions.inputactions` contains dash-left / dash-right bindings (not Unity default)

### Deliverables
| Deliverable | Owner | Status |
|---|---|---|
| `InputSystem_Actions.inputactions` updated with DashLeft / DashRight bindings | engineer | ✓ |
| `LaneConfig` + `PlayerConfig` ScriptableObjects authored | engineer | ✓ |
| `PlayerController` — 3-lane snap dash, keyboard + touch, recovery frame, simultaneous-input neutral | engineer | ✓ |
| `GameManager` — state machine: Idle → Running → Dead → Restart; auto-starts in `Start()` for grey-box | engineer | ✓ |
| `ScoreManager` — plain C#, score, chain counter, personal best (in-session), unit tests passing | engineer | ✓ |
| `CollisionHandler` — trigger buffer, pickup + death dispatch, layer matrix configured | engineer | ✓ |
| `SpawnManager` — chunk pool, ≥3 chunk prefabs (coloured rects), speed escalation every 250m | engineer | ✓ |
| Death screen — distance + score (placeholder UI, no polish) | engineer | ✓ |
| `DashAndCollect.Tests.Runtime` — ScoreManager chain logic, SpawnManager safety pass, PlayerController lane clamp | engineer | ✓ |
| `DashAndCollect.Tests.Editor` — SO authoring validation (non-zero required fields) | engineer | ✓ |
| Profiler baseline: S1 (90s run), S3 (spawn stress), S4 (restart loop) on PC | engineer | Pending |

**Bonus deliverables (ahead of M4):**
| Deliverable | Owner | Status |
|---|---|---|
| `AudioManager` singleton — DontDestroyOnLoad, PlayOneShot SFX, looping BGM, 4 events wired | engineer | ✓ |
| `SaveSystem` — PlayerPrefs persistence: high score + onboarding flag, key constants, unit tests | engineer | ✓ |
| `IInputProvider` interface + `UnityInputProvider` + `TestInputProvider` — injected into PlayerController | engineer | ✓ |
| `design/audio-bible.md` — M2 sound event catalogue, mix priorities, ducking rules | engineer | ✓ |

### Exit Criteria
- [x] Complete run cycle playable: spawn → auto-run → death → instant restart, no editor intervention
- [x] All unit tests in `DashAndCollect.Tests.Runtime` pass
- [ ] Restart cycle completes in ≤ 0.5s (PC) as measured in player build
- [ ] S1 GC Alloc column = 0B in `Running` state (PC profiler, player build)
- [x] No NullReferenceException in a complete 90s run
- [ ] Sprint review: engineer demos the grey-box run to at least one other person

### Candidate Descopes
- Touch input (keyboard only for grey-box) — acceptable if Android build is not yet available
- Death screen UI (log output acceptable if canvas is not ready)

---

## M3 — Vertical Slice: Modifier Loop Closed

**Goal:** The collect-modifies-world differentiator is playable and observable. Playtesters can see that grabbing Dash collectibles changes what comes next. Slice playtest conducted. Go/no-go decision recorded.

**Phase:** Pre-production
**Status:** In Progress

### Entry Criteria
- M2 exit criteria all met ✓
- At least 3 chunk prefabs tagged `Sparse` and `Dense` available for bias test ✓ (ChunkSparse=Sparse, ChunkDense=Dense, ChunkSafe=Safe — all in SpawnConfig pool)

### Deliverables
| Deliverable | Owner | Status | Notes |
|---|---|---|---|
| Dash chain completion → `SpawnManager.SetModifierBias(Dash)` — density reduces 5s | engineer | ✓ | `ModifierSystem` wired in `GameManager.Awake`; 5s timer + `SetModifierBias(None)` on expiry. |
| `ModifierSystem` — chain-to-modifier wiring for Dash type; Shield and Surge deferred | engineer | ✓ | 8 unit tests passing. Wired to GameManager OnGameOver / OnGameRestart. |
| Chain counter visual near character (placeholder — colour dots acceptable) | engineer / artist | ✓ | `ChainCounterDisplay` — 3 dot Images, alpha + colour per type. 9 unit tests passing. Wired in scene. |
| Chain completion feedback: screen-edge colour flash + single SFX | engineer / audio | **Partial** | `ChainFlash` full-screen overlay implemented and wired. SFX clip not yet assigned. |
| ≥5 chunk prefabs: Sparse (2), Dense (2), Safe (1) | designer / engineer | ✓ | ChunkSparse, ChunkSparse2, ChunkDense, ChunkDense2, ChunkSafe — all in SpawnConfig pool. |
| Playtest build: PC + Android (same build), both input schemes validated | engineer | Pending | |
| Playtest protocol: 5 tasks, observation sheet | producer | Pending | |
| Playtest report (`/playtest-report`) — P1–P8 evaluated, go/no-go recorded | playtest-analyst | Pending | |
| S1 + S2 profiler runs on both platforms: GC 0B, frame budget met | engineer | Pending | |
| S5 Android cold start snapshot (Memory Profiler) | engineer | Pending | |

### Exit Criteria
- [ ] Proof points P1–P8 all pass in structured 5-person playtest (see VERTICAL-SLICE.md §2)
- [ ] P3 + P4 specifically: ≥4/5 players notice modifier effect and understand collect-changes-world without being told
- [ ] 60fps sustained on PC in player build (S1); 30fps sustained on Android reference device (S1)
- [ ] Android cold start ≤ 5s; total process memory ≤ 350MB (S5)
- [ ] Go/no-go for production recorded in VERTICAL-SLICE.md §9 Change Log
- [ ] **If go/no-go is NO: halt and schedule a design review before M4**

### Candidate Descopes
- Touch input on Android (PC-only playtest acceptable if Android build is not stable)
- Audio (silent build acceptable for P1–P7; P8 is performance-only)

---

## M4 — Core Systems

**Goal:** All five TDD systems fully implemented, integrated, and unit-tested. Shield and Surge modifiers complete. Save/load persistent. Meta currency earnable. Daily missions scaffolded. Content production can begin.

**Phase:** Production
**Status:** In Progress

### Entry Criteria
- M3 go/no-go is **GO** ✓ (conditional — see PLAYTEST-REPORT-M3.md)
- Art direction workshop complete (first biome visual direction decided)
- Sprite Atlas layout and compression strategy agreed with technical-artist

### Deliverables
| Deliverable | Owner | Status |
|---|---|---|
| Modifier activation feedback — label near chain dots when bias activates (P4 fix from M3 playtest) | engineer | ✓ |
| `ModifierSystem` — Shield and Surge chains complete; one-modifier-at-a-time rule enforced | engineer | Pending |
| `SaveManager` — local persistence: personal best, meta currency, daily mission date stamp | engineer | Pending |
| `SaveData` v1 format documented; no versioning required (local only) | engineer | Pending |
| Meta currency: earned per run (distance + chain bonus), displayed on death screen | engineer | Pending |
| Daily missions: 3 procedurally-selected missions from authored pool; progress display | engineer | Pending |
| Meta hub screen: personal best, daily missions, currency balance | engineer / artist | Pending |
| First biome art pass: environment, obstacles, collectibles (Sprite Atlas, ETC2 ready) | technical-artist | Pending |
| Player character art pass (placeholder replaced) | technical-artist | Pending |
| HUD polish: distance, score, chain counter, modifier icon near character | engineer / artist | Pending |
| All TDD §13 unit tests complete and passing | engineer | Pending |
| Input bindings validated on Android physical device | engineer | Pending |

### Exit Criteria
- [ ] Complete run with all 3 modifier types triggerable and observable
- [ ] Run data persists across app restart (personal best, currency)
- [ ] Daily missions display correctly with correct progress reset on new day
- [ ] All unit tests in Runtime and Editor test assemblies pass
- [ ] S1 benchmarks within budget on both platforms (player builds, not editor)
- [ ] No regressions from M3 baseline in GC Alloc, frame time, memory

---

## M5 — Full Feature

**Goal:** All v1 features complete. All 3 modifier chains, biomes 2 and 3, full obstacle and collectible content pool, unlock shop functional, final audio in. The game plays end-to-end as designed in the GDD.

**Phase:** Production
**Status:** Blocked on M4

### Entry Criteria
- M4 exit criteria all met
- Biome 2 and 3 art direction approved
- All chunk content authored for 0–2000m distance range

### Deliverables
| Deliverable | Owner | Status |
|---|---|---|
| Biome 2 + 3 visual assets and biome transition logic | technical-artist / engineer | Pending |
| Full obstacle chunk pool: milestone expansions at 500m, 1000m, 2000m | designer / engineer | Pending |
| Unlock shop: cosmetic skins, trail effects, chain preview indicator | engineer | Pending |
| Daily challenge mode (if in v1 scope per producer decision) | engineer | Pending |
| Adaptive music: intensity tracks speed escalation | audio | Pending |
| Final SFX for all events (collectible types, chain, death, modifier expiry) | audio | Pending |
| Colorblind mode: shape-differentiated collectibles, high-contrast HUD | engineer / artist | Pending |
| Settings screen: audio volume, input sensitivity, colorblind mode | engineer | Pending |
| Telemetry events: all events from GDD §11.3 instrumented | engineer | Pending |
| Biome atlas swap validated under memory budget | engineer | Pending |

### Exit Criteria
- [ ] All GDD v1 features present and functional
- [ ] All three biomes reachable in a single run
- [ ] Unlock shop purchasable with earned meta currency
- [ ] Telemetry events firing correctly (validated via local log)
- [ ] All collectible types distinguishable by shape AND colour (accessibility, GDD §7.3)
- [ ] S1–S5 benchmarks within budget on both platforms

---

## M6 — Code Review & Refactor

**Goal:** Codebase is clean, ownership is clear, no known debt that will block release or live ops. Systems match the TDD. All tests pass. No TODOs in shipped code.

**Phase:** Production
**Status:** Blocked on M5

### Entry Criteria
- M5 exit criteria all met
- Feature freeze (no new features after M6 entry)

### Deliverables
| Deliverable | Owner | Status |
|---|---|---|
| `/unity-review` pass: structure, architecture, maintainability | unity-reviewer | Pending |
| `/godot-review` equivalent not applicable (Unity only) | — | N/A |
| TDD updated to match final implementation (any divergence documented) | technical-design-lead | Pending |
| All TODOs resolved or converted to tracked follow-up items | engineer | Pending |
| Assembly reference audit: no cross-assembly violations | engineer | Pending |
| ScriptableObject read-only audit: no mutable SO runtime state | engineer | Pending |
| All tests passing: Runtime + Editor test suites | engineer | Pending |
| Dead code removed | engineer | Pending |

### Exit Criteria
- [ ] `/unity-review` report has no high-severity findings open
- [ ] TDD version bumped and matches implementation
- [ ] 0 TODO comments in `DashAndCollect.Runtime` assembly
- [ ] All tests passing in clean player build

---

## M7 — Performance

**Goal:** All performance and memory budgets met on both platforms in representative builds. No GC in the hot path. Frame budget not exceeded in any benchmark scenario.

**Phase:** Production
**Status:** Blocked on M6

### Entry Criteria
- M6 exit criteria all met
- Final art and audio assets imported with correct compression settings

### Deliverables
| Deliverable | Owner | Status |
|---|---|---|
| S1–S5 full benchmark suite on PC and Android (player builds) | engineer | Pending |
| GC Alloc = 0B in `Running` state — verified on both platforms | engineer | Pending |
| Draw call audit: ≤50 PC / ≤30 Android during gameplay | technical-artist / engineer | Pending |
| Overdraw audit: ≤3 layers during gameplay | technical-artist | Pending |
| Texture compression confirmed: ETC2 on all Android atlases | technical-artist | Pending |
| Cold start ≤ 3s PC / ≤ 5s Android | engineer | Pending |
| Restart cycle ≤ 0.5s PC / ≤ 1s Android | engineer | Pending |
| Total process memory: PC ≤ 512MB / Android ≤ 350MB working budget | engineer | Pending |
| `/perf-budget` and `/memory-budget` documents updated with actual measured numbers | performance-reviewer | Pending |

### Exit Criteria
- [ ] All PERF-BUDGET.md and MEMORY-BUDGET.md targets met (working budgets, not just hard ceilings)
- [ ] Zero GC alloc in `Running` state on both platforms
- [ ] No benchmark scenario exceeds its frame time budget on reference hardware
- [ ] Performance documents updated with measured baselines

---

## M8 — QA & Certification Readiness

**Goal:** Game is stable, all known bugs resolved or triaged, and the build is ready to submit for platform review (Android). First-time user experience validated.

**Phase:** Release
**Status:** Blocked on M7

### Entry Criteria
- M7 exit criteria all met
- Candidate release build produced

### Deliverables
| Deliverable | Owner | Status |
|---|---|---|
| `/qa-plan` executed: full test matrix across platforms and input methods | qa-lead | Pending |
| Chunk safety pass regression test: no impossible layouts in 500 auto-generated runs | qa-lead / engineer | Pending |
| Modifier state edge cases tested: shield + simultaneous second hit, modifier stack | qa-lead | Pending |
| Input edge cases: simultaneous left+right neutral, recovery frame queuing | qa-lead | Pending |
| Save data: verify persistence across app kill, low-storage device | qa-lead | Pending |
| Accessibility: colorblind mode, audio-off playable, one-thumb mobile | qa-lead | Pending |
| First-run experience: no hazards in first 10 seconds, collectible in default path | qa-lead | Pending |
| Death screen: correct delta from personal best shown on first run | qa-lead | Pending |
| Android: target API level, permissions, manifest, splash screen | engineer | Pending |
| Release notes drafted (`/patch-notes`) | producer | Pending |
| `/release-check` go/no-go pass | release-manager | Pending |

### Exit Criteria
- [ ] Zero P0 (crash / data loss) bugs open
- [ ] Zero P1 (gameplay-breaking) bugs open
- [ ] P2 bugs triaged: all accepted or have a plan
- [ ] `/release-check` go/no-go is GO
- [ ] Build signed, versioned, and ready for store submission

---

## M9 — Release & Live Ops

**Goal:** Game shipped. Post-launch telemetry reviewed. Live ops cadence established. Day-1 patch process validated.

**Phase:** Live
**Status:** Blocked on M8

### Entry Criteria
- M8 exit criteria all met
- Build submitted to and approved by Android store
- Telemetry pipeline verified (events received and queryable)

### Deliverables
| Deliverable | Owner | Status |
|---|---|---|
| Release build live on target platform(s) | producer | Pending |
| D1 / D7 retention data reviewed (first week post-launch) | producer / playtest-analyst | Pending |
| Death distance distribution reviewed: is the casual die-off at 500m or earlier? | playtest-analyst | Pending |
| Chain completion rate reviewed: is collect-modifies-world being used? | playtest-analyst | Pending |
| `/liveops-brief` for first post-launch event / update (if applicable) | producer | Pending |
| Day-1 patch process validated: can a patch be built and submitted within 24h? | engineer | Pending |
| Live ops document: cadence, event types, decision criteria for content updates | producer | Pending |

### Exit Criteria
- [ ] Telemetry data available and being reviewed on a defined cadence
- [ ] D1 retention baseline established
- [ ] At least one post-launch issue (bug or balance) diagnosed and addressed or scheduled
- [ ] Live ops brief for next update window exists

---

## 2. Dependency Map

```
M0 ──▶ M1 ──▶ M2 ──▶ M3 ──[go/no-go gate]──▶ M4 ──▶ M5 ──▶ M6 ──▶ M7 ──▶ M8 ──▶ M9
              │              │
              │              └── Art direction workshop (parallel to M3)
              │
              └── InputSystem_Actions bindings (M2 entry blocker)
```

**Hard sequential dependencies:**
- M3 go/no-go must be GO before M4 begins — no exceptions
- Art production (first biome) cannot begin until M3 input parity proof point passes
- Save system (M4) cannot be implemented until ScoreManager (M2) is stable
- Modifier system Shield/Surge (M4) depends on chain counter (M2) and CollisionHandler (M2)

**Parallel work opportunities:**
- Art direction workshop can run during M3 (does not require playable build)
- Audio SFX production can begin during M4 (collectible types confirmed)
- Daily missions content authoring can begin during M4 once mission pool format is defined

---

## 3. Risk Register

| ID | Risk | Prob | Impact | Owner | Mitigation | Trigger |
|---|---|---|---|---|---|---|
| R1 | Collect-modifies-world is not legible — M3 playtest fails | Medium | **Critical** — halts production | design | Simplify modifier to instant visible change; reduce chain length to 2 | P3 or P4 fails in M3 playtest |
| R2 | Android 30fps not achievable with initial art | Medium | High — delays M7, may require art rework | technical-artist | Validate S5 before biome art production; ETC2 locked at M4 entry | S1 Android > 33ms in M3 profiler |
| R3 | GC allocation introduced in core systems during production | Medium | High — affects Android stability | engineer | Profiler S1 GC check at every milestone; zero-alloc enforced in code review | Any non-zero GC in S1 after M2 |
| R4 | Chunk safety pass failure — impossible layouts reach players | Low | High — unfair death, breaks trust | engineer | Edit-mode SO validation + SpawnManager safety pass; automated 500-run test in M8 | Any all-lane hazard in M3 playtest |
| R5 | Restart time > 1s on Android | Medium | Medium — breaks one-more-run loop | engineer | Profile S4 at M2; GameManager reset must not re-instantiate pooled objects | S4 restart > 1s at M2 |
| R6 | Art scope exceeds team capacity (3 biomes + full collectible set) | Medium | Medium — delays M5 | producer | Define style reuse strategy at art direction workshop (M3 parallel); limit biome 2/3 to texture swaps only | Art estimates exceed available sprint capacity at M4 |
| R7 | Shield modifier consumed on same frame as second hit — edge case | Low | Low — rare but exploitable | engineer | Unit test covering simultaneous-frame scenario; CollisionHandler trigger buffer handles ordering | Found during M8 QA edge-case testing |
| R8 | Daily challenge mode scope too large for v1 | Medium | Low — it's a stretch goal | producer | Confirm in/out of v1 scope at M3 go/no-go review; do not begin implementation until M4 core is done | Feature creep detected at M4 |
| R9 | Android store submission rejected (API level, permissions) | Low | Medium — delays release | engineer | Validate Android build target requirements at M7 entry; do not leave for M8 | First Android build produced at M3 |

---

## 4. Pre-production Exit Criteria Summary

M3 is the formal pre-production gate. Production (M4+) does not begin until all of the following are true:

- [ ] All 8 vertical slice proof points pass in structured playtest
- [ ] 60fps PC / 30fps Android sustained in player build
- [ ] Zero GC alloc in `Running` state on both platforms
- [ ] Go/no-go explicitly recorded by producer in VERTICAL-SLICE.md
- [ ] Art direction decided and Sprite Atlas layout agreed with technical-artist
- [ ] Input parity (keyboard + touch) confirmed in same build

---

## 5. Change Log

| Date | Change | Owner | Rationale |
|---|---|---|---|
| 2026-03-30 | v0.1 created | producer / planner | Initial milestone plan from `/milestone-plan` command; M0 and M1 marked complete |
| 2026-03-30 | M2 input blocker resolved | engineer | `InputSystem_Actions.inputactions` replaced with DashLeft / DashRight + Touch + UI Confirm |
| 2026-03-30 | M2 deliverables complete (minus profiler) | engineer | All runtime systems, 11 test files (Runtime) + 17 editor SO validation tests, AudioManager, SaveSystem, IInputProvider, audio bible implemented |
| 2026-03-30 | M2 Complete | engineer | Full run cycle verified in editor: spawn → run → death → retry. M3 unblocked. Profiler baselines (S1/S3/S4) deferred to M7. |
| 2026-03-30 | M3 audit | engineer | Entry criteria met. SetModifierBias + OnChainCompleted exist but not wired. ModifierSystem class missing. Need 2 more chunk prefabs. |
| 2026-03-31 | M3 core deliverables complete | engineer | ModifierSystem (8 tests), ChainCounterDisplay (9 tests), ChainFlash overlay, 5 chunk prefabs — all wired in scene. Pending: playtest build, profiler runs, SFX clip. |
| 2026-03-31 | M3 conditional go recorded, M4 started | producer | Self-assessment playtest: 6/8 pass. P4 fail → modifier feedback fix as first M4 task. See PLAYTEST-REPORT-M3.md and VERTICAL-SLICE.md §9. |
