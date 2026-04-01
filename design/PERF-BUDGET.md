# Performance Budget — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Owner:** performance-reviewer / technical-artist
- **Contributors:** technical-design-lead, engineer
- **Version:** 0.1
- **Status:** Draft — to be validated against player builds at vertical slice gate
- **Last Updated:** 2026-03-30
- **Related Docs:** `design/TDD.md`, `design/VERTICAL-SLICE.md`

---

## 1. Target Platforms

| Platform | Target FPS | Hard Floor | Ref Device | Resolution |
|---|---|---|---|---|
| **PC** (primary) | 60fps | 60fps — no dips | Mid-range laptop GPU (e.g. GTX 1650 / RX 580) | 1920×1080, windowed and fullscreen |
| **Android** (secondary) | 30fps | 30fps sustained — no dips below 25 | Mid-range Android 2022 (e.g. Snapdragon 778G) | 1080p, portrait or landscape TBD |

**Notes:**
- iOS is not in scope for v1 (GDD §12.1), but the Android budget should be conservative enough that an iOS port does not require re-engineering.
- PC is the vertical slice validation platform. Android budget must be validated before content production begins.
- "No dip" means the profiler's frame time graph shows no spikes above the floor during a representative 90-second run.

---

## 2. Frame Time Budgets

### 2.1 PC — 60fps target (16.7ms total frame)

| Category | Budget | Notes |
|---|---|---|
| **CPU total** | ≤ 10ms | Leaves headroom for OS, driver, input |
| — Gameplay logic (all 5 systems) | ≤ 3ms | GameManager, PlayerController, SpawnManager, CollisionHandler, ScoreManager |
| — Physics2D | ≤ 1ms | Trigger overlap queries only; no rigidbody simulation |
| — UI update | ≤ 1ms | HUD tick, chain counter, score; no layout rebuild per frame |
| — Audio | ≤ 0.5ms | Managed by Unity audio thread; budget for mixer overhead |
| — Spawn / pool work | ≤ 1ms | Chunk instantiation amortised across frames; no spike on spawn |
| — Other (input, misc) | ≤ 3.5ms | Input System polling, misc Unity overhead |
| **GPU total** | ≤ 6ms | |
| — Scene render (URP 2D) | ≤ 4ms | Sprite batches, background parallax, player, collectibles, obstacles |
| — Post-processing | ≤ 1ms | Bloom only if URP 2D renderer supports it without overdraw cost; otherwise disable |
| — UI render | ≤ 1ms | HUD canvas; single canvas, no nested layouts |

### 2.2 Android — 30fps target (33.3ms total frame)

| Category | Budget | Notes |
|---|---|---|
| **CPU total** | ≤ 20ms | Conservative; leaves 13ms for OS, thermal throttle headroom |
| — Gameplay logic | ≤ 5ms | Same systems; no per-frame allocation |
| — Physics2D | ≤ 2ms | |
| — UI update | ≤ 2ms | |
| — Spawn / pool work | ≤ 2ms | |
| — Other | ≤ 9ms | |
| **GPU total** | ≤ 12ms | Mobile GPU is the tightest constraint |
| — Scene render | ≤ 8ms | Sprite Atlas mandatory; overdraw must be measured |
| — Post-processing | ≤ 1ms | Bloom disabled on Android unless measured cost is < 0.5ms |
| — UI render | ≤ 3ms | |

---

## 3. Memory Budgets

> Full memory budget with ownership, residency rules, GC hot-path policy, atlas layout, and audio loading strategy is in **[MEMORY-BUDGET.md](MEMORY-BUDGET.md)** — that document is the authoritative source. The summary below is for quick reference only.

| Platform | Hard ceiling | Working budget | GC alloc (Running state) |
|---|---|---|---|
| **PC** | ≤ 1024MB | ≤ 512MB | **0 bytes** |
| **Android** | ≤ 512MB | ≤ 350MB | **0 bytes** |

Key working-budget lines (PC / Android):

| Category | PC | Android |
|---|---|---|
| Textures (all atlases) | ≤ 128MB | ≤ 96MB (ETC2) |
| Audio (SFX loaded, music streamed) | ≤ 32MB | ≤ 24MB |
| Managed heap (C# runtime) | ≤ 64MB | ≤ 48MB |
| Chunk prefab pool | ≤ 32MB | ≤ 24MB |

---

## 4. Load Time Budgets

| Metric | PC | Android |
|---|---|---|
| Cold start to gameplay-ready | ≤ 3s | ≤ 5s |
| Restart (Dead → Running) | ≤ 0.5s | ≤ 1s |
| Scene reload (if used) | N/A — no scene reload in v1 | N/A |

The restart budget is critical to the "one more run" loop (GDD §4.3). A restart that takes more than 1 second on Android must be fixed before content production begins — the retry impulse dies if there is a visible wait.

---

## 5. Rendering Budgets

### 5.1 Draw Calls

| Context | PC | Android |
|---|---|---|
| Gameplay (active run) | ≤ 50 | ≤ 30 |
| UI only (death screen) | ≤ 10 | ≤ 10 |

Achieve these via:
- Sprite Atlas per thematic group (player, collectibles, obstacles, environment)
- URP 2D sprite batching — do not break batching with mixed sorting layers or material overrides
- No per-object material instances on hot paths

### 5.2 Overdraw
- Max overdraw depth: **3 layers** during normal gameplay
- Background parallax layers count toward overdraw; limit to 2 parallax layers on Android
- VFX particles (collection burst, chain flash) must not pile overdraw on top of the gameplay layer — offset z or use additive blend with early alpha cutoff

### 5.3 Shader Complexity
- All gameplay sprites: default URP 2D Lit or Unlit sprite shader only
- No custom shaders on hot-path objects until profiled
- Post-processing: Bloom permitted on PC if < 1ms; **disabled by default on Android**

### 5.4 Texture Budget
| Atlas | Max size | Compression |
|---|---|---|
| Player + collectibles | 512×512 | RGBA32 (PC) / ETC2 (Android) |
| Obstacles | 512×512 | RGBA32 / ETC2 |
| Environment (per biome) | 1024×1024 | RGBA32 / ETC2 |
| UI | 512×512 | RGBA32 / ETC2 |

Mip maps: **disabled** for all 2D sprites (they are rendered at known screen sizes).

---

## 6. System-Level Ownership

| Budget line | Owning system | Owner |
|---|---|---|
| Gameplay logic CPU | GameManager, PlayerController, SpawnManager, CollisionHandler, ScoreManager | gameplay-programmer |
| Physics2D CPU | CollisionHandler (layer matrix, trigger configuration) | gameplay-programmer |
| Spawn pool memory | SpawnManager (ObjectPool pre-warm, recycle cadence) | gameplay-programmer |
| GC zero-alloc (runtime) | All systems | gameplay-programmer (enforced via profiler) |
| Draw calls + batching | Sprite Atlas layout, sorting layer setup | technical-artist |
| Texture memory | Atlas dimensions, compression settings | technical-artist |
| Overdraw | Parallax layer count, VFX blend modes | technical-artist |
| Audio memory | Clip loading strategy, music streaming | audio |
| Load / restart time | GameManager restart path, scene state reset | gameplay-programmer |

---

## 7. Benchmark Scenarios

All profiling must use **player builds**, not the editor. Editor overhead (managed debugging, asset tracking) inflates every metric.

| Scenario | Description | When to run |
|---|---|---|
| **S1: 90s steady run** | Continuous play from spawn to 500m on reference hardware; profile CPU, GPU, GC alloc | Every milestone |
| **S2: Chain burst** | 5 consecutive chain completions in 10s; profile for event fan-out and GC spike | M2 and release |
| **S3: Spawn stress** | First 30s of run with maximum chunk density; profile spawn + pool work | M1 and release |
| **S4: Restart loop** | 10 consecutive death → restart cycles; measure restart time and memory residency | M1 and release |
| **S5: Cold start** | Fresh app launch on low-memory Android device; measure startup to first input accepted | Before content production |

---

## 8. Regression Cadence

| Checkpoint | Action |
|---|---|
| **Milestone 1 exit** | Run S1, S3, S4 on PC and Android. Record baseline numbers. Any overage is a blocker. |
| **Milestone 2 exit** | Run S1, S2 on both platforms. Validate zero-alloc in `Running` state. |
| **Vertical slice playtest build** | Full S1–S5 suite on both platforms. Final go/no-go for content production entry. |
| **Weekly during production** | S1 on PC. Catch regressions before they compound. |

Regressions are not deferred. Any overage at a milestone gate must be investigated and resolved or explicitly accepted with a documented descope before the next milestone begins.

---

## 9. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Android GPU is tighter than expected — 30fps not achievable without art changes | High | Validate S5 before art production begins; atlas compression strategy locked early |
| GC alloc introduced via event delegates or LINQ in gameplay code | High | Profile S1 GC alloc column at M1; zero-alloc enforced before M2 |
| Sprite batching broken by URP sorting layer misconfiguration | Medium | Technical artist reviews layer setup at first art pass |
| Restart time exceeds 1s on Android due to system reset overhead | Medium | Profile S4 at M1; GameManager reset path must not re-instantiate pooled objects |
| Overdraw from VFX (chain flash, collection burst) exceeds budget | Low | VFX reviewed at M2; additive blend + early cutoff as default |

---

## 10. Change Log

| Date | Change | Owner | Rationale |
|---|---|---|---|
| 2026-03-30 | v0.1 created | performance-reviewer | Initial budget from `/perf-budget` command; PC primary 60fps, Android secondary 30fps |
| 2026-03-30 | §3 updated | performance-reviewer | Memory detail moved to MEMORY-BUDGET.md; hard ceilings updated to PC ≤1GB, Android ≤512MB |
