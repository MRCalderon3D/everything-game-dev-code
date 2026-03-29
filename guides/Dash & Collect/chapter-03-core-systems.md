# Chapter 3 — Core Systems

**Goal:** Build the core gameplay systems: Game Manager, Player Controller, Spawn Manager, Collision Handler, and Score Manager.

**Context:** `contexts/production.md`

> **Start a new Claude Code session for this chapter.**
> Each phase uses a different context — a fresh session ensures the previous phase's decisions don't carry over unintentionally.

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/production.md` | Adds `gameplay-programmer`, `code-reviewer` to active agents |
| `commands/` | `/plan` | Break each system into implementation steps |
| `commands/` | `/tdd` | Test-driven implementation per system |
| `agents/` | `gameplay-programmer`, `code-reviewer`, `systems-designer`, `planner` | Core implementation agents |
| `skills/` | `skills/workflow/tdd-workflow/SKILL.md` | Test-first implementation process |
| `skills/` | `skills/workflow/verification-loop/SKILL.md` | Verify implementation matches design |
| `skills/` | `skills/unity/unity-csharp-standards/SKILL.md` | Unity C# coding standards |
| `skills/` | `skills/unity/unity-gameplay-patterns/SKILL.md` | Unity gameplay system patterns |
| `skills/` | `skills/unity/unity-testing/SKILL.md` | Unity Test Framework usage |
| `skills/` | `skills/engineering-common/gameplay-architecture/SKILL.md` | Core loop structuring |
| `skills/` | `skills/engineering-common/physics-gameplay-patterns/SKILL.md` | Physics for jump mechanic |
| `skills/` | `skills/engineering-common/event-bus-patterns/SKILL.md` | Decoupled system communication |
| `rules/` | `rules/common/coding-style.md` | Code correctness and clarity |
| `rules/` | `rules/common/testing.md` | Test structure and coverage |
| `rules/` | `rules/unity/coding-style.md` | Unity-specific C# conventions |
| `rules/` | `rules/unity/testing.md` | Unity test framework rules |
| `rules/` | `rules/unity/patterns.md` | Unity architectural patterns |
| `rules/` | `rules/unity/playmode-architecture.md` | Play mode lifecycle guidance |
| `hooks/` | `gdd-sync-warning` | Fires if gameplay code changes without GDD update |
| `hooks/` | `performance-budget-warning` | Fires when touching physics or rendering systems |

---

## Steps

### 1. Load the production context

In your new Claude Code session, tell Claude to read and apply the production context:

```
Read contexts/production.md and apply it to this session.
```

This activates `gameplay-programmer` and `code-reviewer` as the lead agents for this phase.

---

## Implementation Order

Build systems in dependency order: Game Manager first (everything depends on game state),
then Player Controller, then Spawn Manager and Score Manager, then Collision Handler to wire
them together.

---

## System 1: Game Manager

### Plan

```
/plan Implement GameManager: state machine (Menu, Playing, GameOver), events (OnGameStart,
OnGameOver, OnGameRestart), singleton lifecycle.
```

### Implement with TDD

```
/tdd GameManager
```

The `gameplay-programmer` uses `skills/workflow/tdd-workflow` and
`skills/unity/unity-gameplay-patterns`. The `tdd-workflow` skill enforces: write the test
first, see it fail, write the minimum code to pass, refactor.

**Test examples (Unity Test Framework — EditMode):**

```csharp
[Test]
public void GameManager_StartsInMenuState()
{
    var gm = new GameObject().AddComponent<GameManager>();
    Assert.AreEqual(GameState.Menu, gm.CurrentState);
}

[Test]
public void GameManager_TransitionsToPlaying_OnStart()
{
    var gm = new GameObject().AddComponent<GameManager>();
    gm.StartGame();
    Assert.AreEqual(GameState.Playing, gm.CurrentState);
}

[Test]
public void GameManager_TransitionsToGameOver_OnTrigger()
{
    var gm = new GameObject().AddComponent<GameManager>();
    gm.StartGame();
    gm.TriggerGameOver();
    Assert.AreEqual(GameState.GameOver, gm.CurrentState);
}

[Test]
public void GameManager_FiresOnGameOver_Event()
{
    var gm = new GameObject().AddComponent<GameManager>();
    bool fired = false;
    gm.OnGameOver += () => fired = true;
    gm.StartGame();
    gm.TriggerGameOver();
    Assert.IsTrue(fired);
}
```

**Rules applied:**
- `rules/unity/patterns.md` — Singleton via static Instance property, not FindObjectOfType
- `rules/unity/playmode-architecture.md` — state transitions are synchronous, no coroutines
  in state machine logic

---

## System 2: Player Controller

### Plan

```
/plan Implement PlayerController: auto-run (constant horizontal velocity), single jump
(Rigidbody2D AddForce impulse), ground detection (OverlapCircle), coyote time (100ms).
```

### Implement with TDD

```
/tdd PlayerController
```

The `gameplay-programmer` uses `skills/engineering-common/physics-gameplay-patterns` and
`skills/unity/unity-gameplay-patterns`.

The `performance-budget-warning` hook fires because this system touches `Rigidbody2D`.
Review the physics section of the performance budget before proceeding.

**Test examples (Unity Test Framework — PlayMode):**

```csharp
[UnityTest]
public IEnumerator Player_MovesRight_Automatically()
{
    var player = CreateTestPlayer();
    float startX = player.transform.position.x;
    yield return new WaitForSeconds(0.5f);
    Assert.Greater(player.transform.position.x, startX);
}

[UnityTest]
public IEnumerator Player_Jumps_WhenGrounded()
{
    var player = CreateTestPlayer();
    float startY = player.transform.position.y;
    player.GetComponent<PlayerController>().Jump();
    yield return new WaitForFixedUpdate();
    Assert.Greater(player.transform.position.y, startY);
}

[Test]
public void Player_CannotDoubleJump()
{
    var controller = CreateTestPlayerController();
    controller.Jump(); // first jump
    bool secondJumpAllowed = controller.TryJump(); // attempt second
    Assert.IsFalse(secondJumpAllowed);
}
```

**Rules applied:**
- `rules/unity/coding-style.md` — no Update() polling for input; input is event-driven
  via InputHandler (implemented in Chapter 4)
- `rules/common/coding-style.md` — coyote time implemented as a timer, not a bool flag

---

## System 3: Spawn Manager

### Plan

```
/plan Implement SpawnManager: object pool (10 obstacles, 20 coins), procedural spawn on
timer, randomized gap distance, speed ramp (5% interval decrease every 10 seconds).
```

### Implement with TDD

```
/tdd SpawnManager
```

The `gameplay-programmer` uses `skills/unity/unity-gameplay-patterns` (object pooling pattern)
and `skills/engineering-common/event-bus-patterns` (subscribes to OnGameStart/OnGameOver).

**Test examples (EditMode):**

```csharp
[Test]
public void SpawnManager_PoolPrewarms_CorrectCount()
{
    var spawner = CreateTestSpawner(obstaclePoolSize: 10, coinPoolSize: 20);
    Assert.AreEqual(10, spawner.AvailableObstacles);
    Assert.AreEqual(20, spawner.AvailableCoins);
}

[Test]
public void SpawnManager_SpawnInterval_DecreasesOverTime()
{
    var spawner = CreateTestSpawner();
    float initial = spawner.CurrentInterval;
    spawner.SimulateTime(10f);
    Assert.Less(spawner.CurrentInterval, initial);
}

[Test]
public void SpawnManager_ReturnsObjects_ToPool_OnGameOver()
{
    var spawner = CreateTestSpawner();
    spawner.SpawnObstacle();
    spawner.OnGameOver();
    Assert.AreEqual(10, spawner.AvailableObstacles);
}
```

---

## System 4: Score Manager

### Plan

```
/plan Implement ScoreManager: distance tracking (time × speed), coin counting, events
(OnScoreChanged, OnHighScoreBeaten), high-score comparison.
```

### Implement with TDD

```
/tdd ScoreManager
```

The `gameplay-programmer` uses `skills/engineering-common/event-bus-patterns`.

The `gdd-sync-warning` hook fires because score affects the GDD's core loop description.
Verify the GDD's scoring section matches the implementation before continuing.

**Test examples (EditMode):**

```csharp
[Test]
public void ScoreManager_TracksDistance_OverTime()
{
    var sm = new ScoreManager(speed: 5f);
    sm.Tick(2f); // 2 seconds at speed 5
    Assert.AreEqual(10f, sm.Distance, 0.01f);
}

[Test]
public void ScoreManager_AddCoin_IncreasesCoinCount()
{
    var sm = new ScoreManager(speed: 5f);
    sm.AddCoin();
    sm.AddCoin();
    Assert.AreEqual(2, sm.Coins);
}

[Test]
public void ScoreManager_FiresHighScoreBeaten_WhenExceeded()
{
    var sm = new ScoreManager(speed: 5f);
    sm.SetHighScore(50f);
    bool fired = false;
    sm.OnHighScoreBeaten += () => fired = true;
    sm.Tick(11f); // distance = 55 > 50
    Assert.IsTrue(fired);
}
```

---

## System 5: Collision Handler

### Plan

```
/plan Implement CollisionHandler: OnTriggerEnter2D for obstacle (→ GameManager.TriggerGameOver)
and coin (→ ScoreManager.AddCoin, deactivate coin).
```

### Implement with TDD

```
/tdd CollisionHandler
```

**Test examples (PlayMode):**

```csharp
[UnityTest]
public IEnumerator CollisionHandler_TriggerGameOver_OnObstacleHit()
{
    var (player, obstacle, gm) = CreateCollisionTestScene();
    MoveObstacleToPlayer(obstacle, player);
    yield return new WaitForFixedUpdate();
    Assert.AreEqual(GameState.GameOver, gm.CurrentState);
}

[UnityTest]
public IEnumerator CollisionHandler_AddCoin_OnCoinCollect()
{
    var (player, coin, sm) = CreateCoinTestScene();
    MovePlayerToCoin(player, coin);
    yield return new WaitForFixedUpdate();
    Assert.AreEqual(1, sm.Coins);
    Assert.IsFalse(coin.gameObject.activeSelf);
}
```

---

## Code Review After Each System

After each system, invoke the review:

```
/unity-review [SystemName]
```

The `code-reviewer` applies `rules/common/coding-style.md` and `rules/unity/coding-style.md`.
Key checks:
- No `FindObjectOfType` in hot paths
- No per-frame allocations (no `new` in Update/FixedUpdate)
- Events are unsubscribed in OnDestroy
- All public methods have a corresponding test

---

## Milestone Check: Vertical Slice

After all 5 systems are implemented and tests pass, verify the vertical slice criteria:

- [ ] Player can run, jump, die, and restart
- [ ] Obstacles spawn and approach correctly
- [ ] Coins spawn, are collectable, and increment score
- [ ] Distance score increments in real time
- [ ] No frame rate drops below 60fps in a 1-minute run
- [ ] No crashes in 10 consecutive runs

This is **Milestone M3**.

---

## Scaffold Features in Action (Behind the Scenes)

- `hooks/gdd-sync-warning` fires whenever scoring logic changes — ensuring the GDD's
  description of scoring stays accurate
- `hooks/performance-budget-warning` fires when touching `Rigidbody2D` — a reminder to
  profile before and after physics changes
- `skills/workflow/tdd-workflow` enforces the test-first discipline; the `gameplay-programmer`
  agent refuses to write implementation code until the failing test exists

---

## What You Have After This Chapter

- 5 gameplay systems, all test-covered
- Vertical slice playable end to end
- Zero known P0/P1 bugs (enforced by QA process in Chapter 7)

---

## Next

[Chapter 4 — UI / Input / Audio / Save](./chapter-04-supporting-systems.md)
