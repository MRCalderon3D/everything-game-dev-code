# Memory Budget — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Owner:** performance-reviewer / technical-artist
- **Contributors:** technical-design-lead, gameplay-programmer
- **Version:** 0.1
- **Status:** Draft — to be measured against player builds at Milestone 1 exit
- **Last Updated:** 2026-03-30
- **Related Docs:** `design/PERF-BUDGET.md`, `design/TDD.md`

---

## 1. Target Platforms and Hard Ceilings

| Platform | Hard ceiling | Working budget | Headroom |
|---|---|---|---|
| **PC** (primary) | ≤ 1024MB | ≤ 512MB | 512MB reserved for OS, driver, browser tabs, background apps |
| **Android** (secondary) | ≤ 512MB | ≤ 350MB | ~160MB before OOM kill on mid-range 2022 device (~450MB app limit) |

**Working budget is the number the team targets.** The hard ceiling is the absolute OOM / crash boundary. All tooling, alerts, and milestone checks use the working budget. Exceeding the working budget is a yellow flag; exceeding the hard ceiling is a red blocker.

**Reference devices:**
- PC: Mid-range laptop, 8GB RAM, integrated or discrete GPU (GTX 1650 equivalent)
- Android: Snapdragon 778G, 6GB RAM (but ~450MB addressable by app before OOM)

---

## 2. Memory Budget by Category

### 2.1 PC — Working budget: 512MB

| Category | Budget | Owner | Notes |
|---|---|---|---|
| **Unity engine + runtime** | ≤ 120MB | engine | Baseline Unity 6 overhead, URP 2D renderer |
| **Managed heap (C# runtime)** | ≤ 64MB | gameplay-programmer | All five systems + ScriptableObjects loaded |
| **Native heap** | ≤ 48MB | engine | Physics2D, audio, job system overhead |
| **Textures** | ≤ 128MB | technical-artist | All atlases loaded (see §4) |
| **Audio** | ≤ 32MB | audio | SFX loaded; music streamed (see §5) |
| **Chunk prefab pool** | ≤ 32MB | gameplay-programmer | Pre-warmed ObjectPool; all chunks resident during run |
| **UI assets** | ≤ 16MB | engineer | HUD + death screen canvases |
| **Miscellaneous / margin** | ≤ 72MB | — | Slack for packages, profiler overhead, unexpected growth |
| **Total** | **≤ 512MB** | | |

### 2.2 Android — Working budget: 350MB

| Category | Budget | Owner | Notes |
|---|---|---|---|
| **Unity engine + runtime** | ≤ 80MB | engine | Stripped, IL2CPP build |
| **Managed heap (C# runtime)** | ≤ 48MB | gameplay-programmer | |
| **Native heap** | ≤ 32MB | engine | |
| **Textures** | ≤ 96MB | technical-artist | ETC2 compression mandatory; mips disabled (see §4) |
| **Audio** | ≤ 24MB | audio | SFX loaded; music streamed at 128kbps (see §5) |
| **Chunk prefab pool** | ≤ 24MB | gameplay-programmer | Smaller pool than PC if needed; deload unused chunks aggressively |
| **UI assets** | ≤ 12MB | engineer | |
| **Miscellaneous / margin** | ≤ 34MB | — | |
| **Total** | **≤ 350MB** | | |

---

## 3. GC Allocation Rules — Hot Path

**Zero GC allocation during `Running` state is non-negotiable on both platforms.**

A GC collection on Android mid-run causes a visible frame hitch. On PC it is less severe but still a profiler flag.

### What counts as the hot path
Every code path that executes between `GameManager.StartRun()` and `GameManager.EndRun()`:
- `PlayerController.Update` — dash input, lane lerp
- `SpawnManager.Update` — spawn cursor advance, chunk selection, chunk recycle
- `CollisionHandler` — trigger buffer processing, event dispatch
- `ScoreManager` — collectible pickup handling, chain logic, score accumulation
- `ModifierSystem` — modifier timer tick, effect application
- HUD update driven by `OnScoreChanged`

### Allocation sources to eliminate

| Source | Fix |
|---|---|
| `new` inside `Update` or event handlers | Pre-allocate at `Initialize()`; reuse instances |
| LINQ (`.Where`, `.Select`, `.ToList`, etc.) | Replace with `for` loops over pre-allocated lists |
| String formatting (`$"score: {x}"`) | Use `int.ToString()` into a pre-allocated `StringBuilder`, or UI text binding that avoids per-frame allocation |
| Boxing (passing `int`/`float`/`struct` as `object`) | Use generic event types; avoid `object` parameters in hot paths |
| Lambda capture in event subscriptions | Subscribe named methods, not lambdas, in `OnEnable` |
| `UnityEvent` invocation with value-type params | Prefer C# `Action<T>` with value-type generics |
| `Instantiate` during active run | Pre-warm `ObjectPool<T>` at run start; never `Instantiate` after `StartRun()` |
| `GetComponent<T>()` on hit | Cache all component references in `Awake` / `Initialize` |
| `FindObjectOfType<T>()` at any point | Forbidden at runtime; wire references in inspector or `Initialize` |

### Acceptable allocations outside the hot path
- `Awake` / `Initialize` — pool pre-warm, list pre-allocation, component caching
- `StartRun` / `RestartRun` — resetting state, resizing collections if needed
- `EndRun` / Death screen — building summary string, triggering save
- Editor-only code — no restrictions

### Validation
- Unity Profiler → Memory → GC Alloc column: must read **0B** for every frame sampled during benchmark scenario S1 (90s steady run)
- Use the **Memory Profiler package** at M1 exit to capture a full snapshot and verify no unexpected retained objects

---

## 4. Texture Memory — Asset Rules

### Atlas layout

| Atlas | Contents | Max size (PC) | Max size (Android) | Compression |
|---|---|---|---|---|
| `Atlas_Player` | Player sprite + dash animation frames | 512×512 | 512×512 | RGBA32 / ETC2 |
| `Atlas_Collectibles` | Dash (blue), Shield (gold), Surge (red), Coin — all states | 512×512 | 512×512 | RGBA32 / ETC2 |
| `Atlas_Obstacles` | All obstacle tile variants | 512×512 | 512×512 | RGBA32 / ETC2 |
| `Atlas_Environment_Biome01` | Background tiles, parallax layers — biome 1 | 1024×1024 | 1024×1024 | RGBA32 / ETC2 |
| `Atlas_UI` | HUD icons, death screen elements | 512×512 | 512×512 | RGBA32 / ETC2 |
| `Atlas_VFX` | Particle sprites (collection burst, chain flash) | 256×256 | 256×256 | RGBA32 / ETC2 |

**Rules:**
- Mip maps **disabled** for all 2D sprites — they render at known screen sizes; mips waste memory
- Max 2 atlases loaded simultaneously during gameplay: gameplay set (Player + Collectibles + Obstacles + VFX) and current biome environment
- UI atlas loaded independently; does not share a batch with gameplay atlases
- Future biome atlases (biome 2, biome 3) must fit within the same 1024×1024 ceiling and are **not** loaded until the player approaches the biome transition

### Texture residency rules
- All atlases in the gameplay set are loaded at `Initialize()` and remain resident for the run lifetime
- Biome atlases swap at biome transition: unload previous, load next — transition must not spike above working budget ceiling
- No textures loaded or unloaded during `Running` state (steady state must be flat)

---

## 5. Audio Memory — Asset Rules

| Category | Format | Loading | PC budget | Android budget |
|---|---|---|---|---|
| Music (main loop) | OGG, 128kbps stereo | Streamed | ≤ 4MB resident | ≤ 4MB resident |
| SFX — collectible types (3) | WAV, < 1s, mono | Preloaded | ≤ 1MB | ≤ 1MB |
| SFX — chain completion | WAV, < 2s, mono | Preloaded | ≤ 0.5MB | ≤ 0.5MB |
| SFX — dash input | WAV, < 0.5s, mono | Preloaded | ≤ 0.5MB | ≤ 0.5MB |
| SFX — death | WAV, < 1s, mono | Preloaded | ≤ 0.5MB | ≤ 0.5MB |
| SFX — modifier expiry warn | WAV, < 1s, mono | Preloaded | ≤ 0.5MB | ≤ 0.5MB |
| Remaining SFX pool | — | Preloaded | ≤ 25MB | ≤ 17MB |
| **Total** | | | **≤ 32MB** | **≤ 24MB** |

**Rules:**
- Music is always streamed — never decompressed into memory
- All SFX preloaded at startup; no async audio load during `Running` state
- `AudioClip.LoadType`: `DecompressOnLoad` for short SFX (< 1s); `CompressedInMemory` for clips > 1s
- No `Resources.Load` for audio at runtime — all clips assigned via inspector on `AudioManager`

---

## 6. Runtime Object Residency

### Chunk pool
- Pre-warm at `StartRun()`: instantiate all chunk prefab variants once, deactivate, park below camera
- During run: activate from pool, scroll, deactivate and return when off-screen — **no `Instantiate` / `Destroy`**
- Pool size: enough to cover `lookAheadDistance` plus 1 buffer chunk; typically 6–8 active chunks at any time
- Android: if pool memory exceeds budget, reduce `lookAheadDistance` before reducing chunk variety

### Collectible and hazard objects
- Collectibles and hazards are children of chunk prefabs — they are pooled implicitly with the chunk
- No separate collectible pool required unless profiling shows chunk-level granularity is insufficient

### ScriptableObject assets
- All SO config assets (`PlayerConfig`, `SpawnConfig`, `ScoreConfig`, `ModifierConfig`, `ChunkDefinition[]`) loaded at startup via direct serialized references on `GameManager` — no `Resources.Load`, no Addressables in v1
- SO instances are read-only at runtime; they do not accumulate per-run state
- Total SO asset memory: negligible (< 1MB)

### Managed heap growth rules
- Managed heap must **not grow** during `Running` state — a growing heap indicates allocation
- Acceptable: heap growth during `Initialize()`, `StartRun()`, `RestartRun()`
- Measure: Unity Profiler → Memory → Used Total; must be flat from 10s into run until death

---

## 7. Ownership Map

| Memory category | Who authors it | Who owns the budget | Who reviews at milestone |
|---|---|---|---|
| Texture atlases | technical-artist | technical-artist | performance-reviewer |
| Audio clips | audio | audio | performance-reviewer |
| Managed heap / GC | gameplay-programmer | gameplay-programmer | performance-reviewer |
| Chunk pool | gameplay-programmer | gameplay-programmer | performance-reviewer |
| Unity engine baseline | — | performance-reviewer (monitor only) | performance-reviewer |
| Total process memory | — | performance-reviewer | performance-reviewer |

---

## 8. Benchmark and Validation

| Scenario | What to measure | Tool | When |
|---|---|---|---|
| **S1: 90s steady run** | GC Alloc (must be 0B), managed heap flat, total process memory stable | Unity Profiler | M1, M2, slice gate |
| **S4: Restart loop × 10** | Memory residency after each restart; no leak accumulation | Unity Profiler + Memory Profiler | M1 |
| **S5: Cold start (Android)** | Peak memory at startup; texture + audio load cost | Memory Profiler snapshot | Before content production |
| **Biome transition (future)** | Peak during unload/load; must not exceed working budget | Memory Profiler | Before biome 2 enters production |

Full benchmark scenario definitions are in [PERF-BUDGET.md §7](PERF-BUDGET.md).

---

## 9. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Android total memory exceeds 350MB working budget after first art pass | High | Validate S5 before art production; ETC2 compression enforced from first import |
| GC alloc introduced via LINQ or lambda in event handlers | High | Code review at M1; profiler S1 GC column must be 0B before M2 |
| Chunk pool pre-warm causes startup spike above working budget | Medium | Measure S4 at M1; reduce pool size or stagger pre-warm across frames if needed |
| Biome atlas swap causes mid-run memory spike (future) | Medium | Not relevant for vertical slice (one biome); design swap pattern before biome 2 |
| ScriptableObject assets accidentally mutated at runtime | Low | Read-only usage enforced by convention; add editor validation in `DashAndCollect.Tests.Editor` |

---

## 10. Change Log

| Date | Change | Owner | Rationale |
|---|---|---|---|
| 2026-03-30 | v0.1 created | performance-reviewer | Initial memory budget from `/memory-budget` command; hard ceilings PC ≤1GB, Android ≤512MB; working budgets PC ≤512MB, Android ≤350MB |
