# Technical Design Document — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Feature / Product:** Core Runtime Systems — v1
- **Owner:** technical-design-lead
- **Contributors:** architect, gameplay-programmer
- **Version:** 0.1
- **Status:** Draft
- **Last Updated:** 2026-03-30
- **Related Docs:** `design/GDD.md`, `dash-and-collect-game/`

---

## 1. Scope and Goals

### 1.1 In Scope
Five core runtime systems required for a playable vertical slice:
- **GameManager** — run lifecycle, global state machine
- **PlayerController** — input, lane movement, dash
- **SpawnManager** — chunk-based obstacle and collectible spawning
- **CollisionHandler** — collectible pickup, hazard detection, death
- **ScoreManager** — score, chain counter, meta currency, personal best

### 1.2 Out of Scope (v1)
- Cloud save, leaderboard, monetization
- Daily challenge mode (deferred per GDD §4.1)
- Addressables / asset streaming
- Any multiplayer or online systems (GDD §5.8)

### 1.3 Assumptions
- Unity 6000.3.12f1 with URP 2D Renderer (17.3.0)
- Input System 1.19.0 for all input handling
- No Entities/DOTS; all systems are MonoBehaviour-based plain C# unless stated otherwise
- PC (keyboard) + mobile (touch) are equal first-class targets
- Lane model is **3 discrete lanes with snap dash** — confirmed 2026-03-30 (GDD §14 resolved)

---

## 2. Unity Environment

| Item | Value |
|---|---|
| Unity version | 6000.3.12f1 |
| Render pipeline | URP 2D (Universal Render Pipeline 17.3.0) |
| Input | Input System 1.19.0 |
| Test framework | Unity Test Framework 1.6.0 |
| Assembly structure | `DashAndCollect.Runtime`, `DashAndCollect.Editor`, `DashAndCollect.Tests.Runtime`, `DashAndCollect.Tests.Editor` |
| Primary scene | `Assets/Scenes/Game.unity` |

---

## 3. Architecture Overview

### 3.1 Scene Structure

```
Game.unity
  ├── [SystemRoot]         (DontDestroyOnLoad — bootstrap only, then removed once systems initialize)
  │     ├── GameManager
  │     ├── ScoreManager
  │     └── SpawnManager
  ├── [World]
  │     ├── Background (parallax tilemap layers)
  │     └── ChunkRoot        (active chunk pool parented here)
  ├── [Player]
  │     └── PlayerController
  ├── [Collision]
  │     └── CollisionHandler
  └── [UI]
        ├── HUD
        └── DeathScreen
```

All five core systems are present in the single game scene. There is no bootstrap scene in v1. Persistent systems survive via explicit lifetime management, not `DontDestroyOnLoad`.

### 3.2 System Lifetime

| System | Lifetime | Owns |
|---|---|---|
| GameManager | Scene lifetime | Run state machine, event bus |
| PlayerController | Scene lifetime | Input state, lane position |
| SpawnManager | Scene lifetime | Chunk pool, spawn cursor |
| CollisionHandler | Scene lifetime | Overlap queries, pickup/death dispatch |
| ScoreManager | Scene lifetime | Score, chain counter, meta currency accumulation |
| SaveManager *(separate, later)* | Scene lifetime | Persisted data read/write |

### 3.3 Communication Pattern

Systems communicate exclusively via **C# events** (not `UnityEvent`, not `SendMessage`, not static singletons).

```
GameManager exposes:
  event Action<RunState> OnRunStateChanged

PlayerController exposes:
  event Action<int> OnLaneChanged          // new lane index

CollisionHandler exposes:
  event Action<CollectibleType> OnCollectiblePickedUp
  event Action              OnPlayerDied

ScoreManager exposes:
  event Action<ScoreSnapshot> OnScoreChanged
```

All listeners must unsubscribe in `OnDestroy`. No cross-system direct method calls except initialization wiring in `GameManager.Awake`.

---

## 4. System Specifications

### 4.1 GameManager

**Responsibility:** Own the run state machine. Coordinate system initialization. Broadcast run lifecycle events.

**Location:** `Assets/Scripts/Runtime/Core/GameManager.cs`

**State Machine:**

```
Idle ──StartRun──▶ Running ──PlayerDied──▶ Dead ──Restart──▶ Running
                    │                                          ▲
                    └──────────────────────────────────────────┘
```

States:
- `Idle` — systems initialized, waiting for first input or explicit start
- `Running` — active run; spawning, input, scoring all active
- `Dead` — player died; input locked, death screen shown, restart accepted
- (No Paused state in v1 scope)

**Initialization order (Awake):**
1. ScoreManager.Initialize()
2. SpawnManager.Initialize()
3. PlayerController.Initialize()
4. CollisionHandler.Initialize()
5. GameManager transitions to `Idle`

**Key methods:**
```csharp
public void StartRun();    // Idle → Running; resets all systems
public void EndRun();      // Running → Dead; fired by CollisionHandler event
public void RestartRun();  // Dead → Running; resets all systems
```

**Unity pattern:** Plain `MonoBehaviour` in scene. No singleton. Systems hold a serialized reference to `GameManager` via inspector, or receive it via `Initialize(GameManager gm)`.

**Risk:** Initialization order bugs. Mitigation: all systems validate they have been initialized before accepting calls; throw explicit exceptions in development builds if not.

---

### 4.2 PlayerController

**Responsibility:** Read input, manage lane position, execute dash movement, expose lane state.

**Location:** `Assets/Scripts/Runtime/Player/PlayerController.cs`

**Lane Model:**
- 3 lanes: index 0 (left), 1 (center, spawn position), 2 (right)
- Lane positions are authored as a `float[]` of world X coordinates on a `LaneConfig` ScriptableObject
- Dash moves the character ±1 lane instantly with a configurable recovery frame duration

**Input:**
- Uses `InputSystem_Actions.inputactions` (already placed at `Assets/Scripts/Runtime/Player/`)
- Bindings: `DashLeft` (A / ← / swipe-left), `DashRight` (D / → / swipe-right)
- Input ignored during recovery frame and during `Dead` state
- Simultaneous left+right = neutral (no movement), per GDD §5.1

**Movement:**
- On valid dash input: `currentLane = Clamp(currentLane ± 1, 0, 2)`
- Character `Transform.position.x` lerps to `lanePositions[currentLane]` over `dashDuration` (authored on `PlayerConfig` SO)
- Recovery frame timer blocks subsequent input for `recoveryDuration` (authored on `PlayerConfig` SO)

**Authored data (`PlayerConfig` ScriptableObject):**
```csharp
public float dashDuration       = 0.08f;
public float recoveryDuration   = 0.05f;
public LaneConfig laneConfig;
```

**Key interface:**
```csharp
public int CurrentLane { get; }
public bool IsInRecovery { get; }
public event Action<int> OnLaneChanged;
```

**Unity pattern:** `MonoBehaviour`. Input is via `PlayerInput` component or manual `InputAction` wiring — either is acceptable; document the choice before implementation. Prefer manual `InputAction.Enable/Disable` pattern for testability.

**Risk:** Input queuing edge case — input during recovery frame should queue for exactly one frame (GDD §5.1). This must be covered by a unit test.

---

### 4.3 SpawnManager

**Responsibility:** Pool and spawn obstacle/collectible chunks. Bias chunk selection based on active modifier. Advance the spawn cursor as the world scrolls.

**Location:** `Assets/Scripts/Runtime/Obstacles/SpawnManager.cs`

**Chunk System:**
- A "chunk" is a prefab containing a pre-authored pattern of hazards and collectibles in a fixed height strip
- `ChunkDefinition` is a ScriptableObject referencing the chunk prefab plus metadata:
  ```csharp
  public class ChunkDefinition : ScriptableObject {
      public GameObject prefab;
      public float height;
      public int minDistanceMilestone;  // distance before this chunk becomes eligible
      public ChunkTag[] tags;           // e.g. Dense, Sparse, Safe
  }
  ```
- `ChunkPool` — a `List<ChunkDefinition>` configured as a `SpawnConfig` ScriptableObject
- Active chunk pool expands at 500m, 1000m, 2000m (GDD §6.3)

**Spawn Loop (runs each frame while `Running`):**
1. If spawn cursor is within `lookAheadDistance` of camera top edge, select and spawn next chunk
2. Chunk selection: filter pool by `minDistanceMilestone ≤ currentDistance`, then filter by active modifier tag (Dash modifier excludes `Dense` chunks), then pick pseudo-randomly
3. Safety pass: if spawned chunk contains hazards in all 3 lanes, replace center lane hazard with a coin collectible
4. Recycle chunks that have scrolled below camera bottom — return to object pool

**World scrolling:**
- The world scrolls upward (or the camera moves forward) — camera is fixed, all spawned objects move toward the player
- `WorldSpeed` is a shared runtime value owned by `GameManager` and read by `SpawnManager` each frame
- Speed increases every 250m per GDD §6.3

**Key interface:**
```csharp
public void SetModifierBias(ModifierType modifier);  // called by modifier system on activation/expiry
public float CurrentWorldSpeed { get; }
```

**Unity pattern:** `MonoBehaviour` using Unity's object pool (`UnityEngine.Pool.ObjectPool<T>`) for chunk instances.

**Risk:** Safety pass correctness — impossible lane configuration must be verified at spawn time, not authored time. Must have a dedicated test.

---

### 4.4 CollisionHandler

**Responsibility:** Detect player overlap with collectibles and hazards. Dispatch typed events. Enforce the "one frame wins" rule for simultaneous overlaps.

**Location:** `Assets/Scripts/Runtime/Core/CollisionHandler.cs`

**Detection:**
- Physics 2D trigger overlap (`OnTriggerEnter2D`) on the player's collider
- Player collider: `CircleCollider2D`, radius authored on `PlayerConfig` SO
- Collectibles: `BoxCollider2D` trigger, tagged with `CollectibleType` via component
- Hazards: `BoxCollider2D` trigger, tagged as hazard via component
- Layer matrix: Player on layer `Player`, collectibles and hazards on layer `Gameplay`; only these layers interact

**Collision priority:**
- In a single frame, collectible pickup is processed before hazard. This means a frame where the player touches both a collectible and a hazard: collectible is registered, then death is triggered (the chain count is preserved in the death state).
- Shield modifier absorbs the first hazard overlap; shield is consumed immediately, death is suppressed.

**Events dispatched:**
```csharp
public event Action<CollectibleType> OnCollectiblePickedUp;
public event Action                  OnPlayerDied;
```

**CollectibleType:**
```csharp
public enum CollectibleType { Dash, Shield, Surge, Coin }
```

**Unity pattern:** `MonoBehaviour` attached to the Player GameObject (or a child trigger object). Does not own scoring or modifier state — only detects and dispatches.

**Risk:** `OnTriggerEnter2D` does not guarantee call order between multiple overlaps in the same frame. Mitigation: buffer all trigger events in a list each frame, then process the list in order (collectibles first, hazards second) in `Update` after physics step, using Script Execution Order settings.

---

### 4.5 ScoreManager

**Responsibility:** Accumulate score, manage chain counter, track meta currency earned per run, record personal best.

**Location:** `Assets/Scripts/Runtime/Core/ScoreManager.cs`

**State:**
```csharp
int currentScore;
int chainCount;         // 0–3
CollectibleType? chainType;  // null if no chain in progress
int coinsEarnedThisRun;
```

**Score rules (from GDD §5.2, §10.2):**
- Each collectible pickup: `+basePickupScore` (authored)
- Chain completion (3 of same type): `+chainBonusScore`, coins awarded
- Surge modifier active: score multiplier ×2 applied to all pickups during modifier window
- Distance-based score: `+1` per meter (added by GameManager tick, not ScoreManager)

**Chain logic:**
```
pickup type == chainType → chainCount++
pickup type != chainType → chainCount = 1, chainType = pickup type
chainCount == 3 → chain complete, fire OnChainCompleted(type), reset chainCount = 0 / chainType = null
Coin type never contributes to chain counter
```

**Persistence boundary:**
- `coinsEarnedThisRun` and `personalBest` are handed off to `SaveManager` on run end
- `ScoreManager` does not call save directly — it exposes `GetRunSummary()` which `GameManager` passes to `SaveManager`

**Key interface:**
```csharp
public event Action<ScoreSnapshot> OnScoreChanged;
public event Action<CollectibleType> OnChainCompleted;
public ScoreSnapshot GetRunSummary();
public void SetMultiplier(float multiplier);   // called by ModifierSystem on Surge start/end
public void ResetForNewRun();
```

**ScoreSnapshot (plain C# struct):**
```csharp
public struct ScoreSnapshot {
    public int score;
    public int chainCount;
    public CollectibleType? chainType;
    public int coinsEarnedThisRun;
    public int personalBest;
    public bool isNewPersonalBest;
}
```

**Unity pattern:** Plain C# service class, owned and instantiated by `GameManager`, not a `MonoBehaviour`. This makes it directly unit-testable without scene setup.

**Risk:** Multiplier state desync if Surge modifier expires during chain completion frame. Mitigation: multiplier is applied at score-write time, not at event-dispatch time.

---

## 5. Modifier System (Integration Layer)

The modifier system is triggered by `ScoreManager.OnChainCompleted` and coordinates effects across systems. It is not one of the five primary systems but is required for integration.

**Location:** `Assets/Scripts/Runtime/Modifiers/ModifierSystem.cs`

| Chain | Effect | Duration | Systems Notified |
|---|---|---|---|
| 3× Dash | Obstacle density reduces | 5s | `SpawnManager.SetModifierBias(Dash)` |
| 3× Shield | Absorb next hazard | Until used / 15s | `CollisionHandler` sets shield flag |
| 3× Surge | Speed +, score ×2 | 8s | `GameManager.WorldSpeed`, `ScoreManager.SetMultiplier(2)` |

One modifier active at a time. New chain completion replaces active modifier.

---

## 6. Data Architecture

### 6.1 Authored ScriptableObjects (config, not mutable runtime state)

| Asset | Location | Purpose |
|---|---|---|
| `PlayerConfig` | `Assets/Data/` | Dash speed, recovery duration, lane config |
| `LaneConfig` | `Assets/Data/` | World X positions for lanes 0–2 |
| `SpawnConfig` | `Assets/Data/` | Full chunk pool, speed curve, spawn lookahead |
| `ChunkDefinition[]` | `Assets/Data/Chunks/` | Per-chunk authored data |
| `ScoreConfig` | `Assets/Data/` | Base pickup score, chain bonus, coin award rates |
| `ModifierConfig` | `Assets/Data/` | Modifier durations, Surge speed multiplier |

All ScriptableObjects are **read-only at runtime**. Runtime mutable state lives in plain C# classes owned by the relevant system.

### 6.2 Save Data (local, v1)

```csharp
[Serializable]
public class SaveData {
    public int personalBestDistance;
    public int personalBestScore;
    public int metaCurrencyBalance;
    public string lastDailyMissionDate;  // ISO date string
    // v1: no cloud, no versioning schema yet
}
```

Saved via `JsonUtility.ToJson` to `Application.persistentDataPath`. `SaveManager` owns read/write; no other system accesses the file directly.

---

## 7. Scene and Prefab Ownership

| Asset | Owner | Notes |
|---|---|---|
| `Assets/Scenes/Game.unity` | Engineering | Only scene in v1. Do not add gameplay logic to scene directly. |
| `Assets/Prefabs/Player/Player.prefab` | Engineering | Contains `PlayerController`, `CollisionHandler`, colliders |
| `Assets/Prefabs/Obstacles/Chunk_*.prefab` | Design + Technical Art | Chunk patterns authored here |
| `Assets/Prefabs/Collectibles/Collectible_*.prefab` | Engineering | Component + collider; sprite assigned by Technical Art |
| `Assets/Prefabs/UI/HUD.prefab` | Engineering | Bound to `ScoreManager.OnScoreChanged` |
| `Assets/Prefabs/UI/DeathScreen.prefab` | Engineering | Shown on `GameManager.OnRunStateChanged(Dead)` |

---

## 8. Input System Configuration

**File:** `Assets/Scripts/Runtime/Player/InputSystem_Actions.inputactions`

Actions required (replace default Unity starter bindings):

| Action | Keyboard | Mobile |
|---|---|---|
| `DashLeft` | A, ← | Swipe left, tap left half |
| `DashRight` | D, → | Swipe right, tap right half |

Implementation approach: manual `InputAction.Enable()` / `Disable()` in `PlayerController.OnEnable` / `OnDisable` rather than `PlayerInput` component. This supports unit testing without a `PlayerInput` dependency and gives explicit control over action lifetime.

---

## 9. Assembly Impact

No new asmdefs required beyond the four created during `/unity-setup`:

| Assembly | Contains |
|---|---|
| `DashAndCollect.Runtime` | All five systems, ModifierSystem, SaveManager, all ScriptableObject classes |
| `DashAndCollect.Editor` | Inspector validators (e.g. ChunkDefinition validation, SaveData debug tools) |
| `DashAndCollect.Tests.Runtime` | Unit tests for ScoreManager, ChainLogic, SpawnManager safety pass |
| `DashAndCollect.Tests.Editor` | Edit mode tests for SO authoring validation |

---

## 10. Performance Considerations

**Target frame budget:** 60fps on mid-range mobile (e.g. iPhone 12 equivalent). 16ms total frame budget.

| System | Per-frame concern | Mitigation |
|---|---|---|
| SpawnManager | Object pool churn | `ObjectPool<T>` with pre-warmed pool at run start |
| CollisionHandler | Physics2D overlap volume | Layer matrix restricts to Player ↔ Gameplay only; no `OverlapCircleAll` polling — use trigger callbacks |
| ScoreManager | Event fan-out | Single listener chain; `OnScoreChanged` fires at most once per collectible pickup |
| PlayerController | Movement lerp | Transform only; no Rigidbody2D velocity manipulation |
| Spawner background tiles | Draw call count | Sprite Atlas for environment tiles required before art production begins |

No allocations in hot paths (collectible pickup, score update, dash input). All event delegates use cached references, not lambdas assigned each frame.

---

## 11. Testing Plan

### Unit tests (plain C# — `DashAndCollect.Tests.Runtime`)
- `ScoreManager`: chain counter logic, reset, multiplier, personal best write, all chain completion paths
- `SpawnManager`: safety pass correctness (all-lane hazard replaced), chunk filter by milestone distance
- `PlayerController`: lane clamp (no lane < 0, > 2), recovery frame blocks input, simultaneous input = neutral

### Edit mode tests (`DashAndCollect.Tests.Editor`)
- All `ChunkDefinition` assets have at least one eligible lane unblocked
- All `PlayerConfig` and `SpawnConfig` assets have non-zero required fields

### Play mode integration (manual at vertical slice)
- GameManager state machine: Idle → Running → Dead → Running cycle
- Collectible pickup dispatches correct type; chain completes at 3
- Shield absorbs exactly one hazard
- Death screen shows correct score delta

### Not tested in v1
- Save file corruption recovery
- Performance regression automation (deferred to `/perf-budget`)

---

## 12. Risks and Open Questions

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| ~~Lane model unresolved (GDD §14)~~ | — | **Resolved 2026-03-30** | 3 discrete lanes with snap dash confirmed. |
| Input system `InputSystem_Actions.inputactions` is currently the Unity default starter file | Medium | Open | Must be replaced with dash-left/dash-right bindings before `PlayerController` can be implemented. |
| CollisionHandler trigger ordering in single frame | Medium | Mitigated | Buffered processing via Script Execution Order — document order before release. |
| ScriptableObject asset misconfiguration (e.g. chunk with all-lane hazards) | Low | Mitigated | Edit mode tests + safety pass in SpawnManager. |
| Save data format not versioned | Low | Accepted | v1 local only, no migration required. Revisit before any cloud save or public release. |

---

## 13. Implementation Order (Recommended)

1. `LaneConfig` + `PlayerConfig` SOs → `PlayerController` → input binding update
2. `GameManager` state machine (no systems wired yet, just state transitions)
3. `ScoreManager` (pure C#, fully unit-tested before integration)
4. `CollisionHandler` (triggers, buffering, events)
5. `ChunkDefinition` SO + first 3 chunk prefabs → `SpawnManager`
6. Wire all systems through `GameManager.Awake`
7. `ModifierSystem` (integration layer, depends on all above)
8. HUD + DeathScreen UI (bind to events)
9. `SaveManager` (local persistence, last)

---

## 14. Change Log

| Date | Change | Owner | Rationale |
|---|---|---|---|
| 2026-03-30 | v0.1 created | technical-design-lead / architect | Initial TDD from `/tech-design` command, based on GDD v0.1 |
