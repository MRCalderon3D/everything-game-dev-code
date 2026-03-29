# Chapter 7 — QA & Testing

**Goal:** Define the test plan, run automated tests, conduct a structured playtest, triage bugs, and achieve QA sign-off.

**Context:** `contexts/qa.md`

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/qa.md` | Activates QA-focused agents and rules |
| `commands/` | `/qa-plan` | Build the test plan |
| `commands/` | `/playtest-report` | Structured playtest findings |
| `commands/` | `/bug-triage` | Classify and prioritize bugs |
| `commands/` | `/tdd` | Fix bugs with regression tests |
| `agents/` | `qa-lead`, `playtest-analyst`, `gameplay-programmer` | QA agents |
| `skills/` | `skills/qa-release/qa-test-matrix/SKILL.md` | Test coverage matrix |
| `skills/` | `skills/qa-release/bug-triage/SKILL.md` | Bug classification process |
| `skills/` | `skills/workflow/playtest-analysis/SKILL.md` | Playtest synthesis |
| `skills/` | `skills/unity/unity-testing/SKILL.md` | Unity Test Framework execution |
| `docs/templates/` | `docs/templates/qa-test-plan.md` | QA plan template |
| `docs/templates/` | `docs/templates/playtest-report.md` | Playtest report template |
| `rules/` | `rules/common/qa.md` | Test coverage requirements |
| `rules/` | `rules/common/testing.md` | Test structure standards |
| `rules/` | `rules/unity/qa.md` | Unity QA specifics |
| `rules/` | `rules/unity/testing.md` | Unity testing specifics |
| `hooks/` | `playtest-capture` | Fires to scaffold playtest note structure |
| `hooks/` | `crash-log-capture` | Fires to capture crash metadata |

---

## Steps

### 1. Switch to the QA context

```
contexts/qa.md
```

This activates the `qa-lead` as the lead agent. The `qa-lead` owns the test plan, the
bug registry, and the sign-off decision. No one can declare the game release-ready
without `qa-lead` sign-off.

### 2. Build the test plan — /qa-plan

```
/qa-plan
```

The `qa-lead` uses `skills/qa-release/qa-test-matrix` and
`docs/templates/qa-test-plan.md` to produce the test plan.

**Test plan excerpt:**

```
## Acceptance Criteria

### AC-01: Jump Mechanic
- Player jumps when jump input is pressed while grounded
- Player cannot double jump
- Coyote time: player can jump up to 100ms after walking off a ledge
- Jump height is consistent across frame rates

### AC-02: Collision Detection
- Player touching obstacle triggers game over within 1 frame
- Player touching coin increments coin count and deactivates coin
- False positive rate: 0 (no phantom collisions in 100 test runs)

### AC-03: Scoring
- Distance score increments in real time during play
- Score displayed on HUD matches ScoreManager internal value
- High score correctly identified and saved when beaten
- High score persists after app restart

### AC-04: Save / Load
- High score loads correctly on fresh install (default: 0)
- High score loads correctly after save
- Save is not corrupted by force-quitting during save operation

### AC-05: UI Flow
- Main Menu → Play → Gameplay: no missing transitions
- Gameplay → Game Over: score and coins shown correctly
- Game Over → Retry: game resets completely (score, speed, player position)
- Game Over → Main Menu: scene loads cleanly, no lingering state

### AC-06: Audio
- Jump SFX plays on every jump with no cutoff
- Coin SFX plays on every collect
- Death SFX plays on game over
- Background music loops without audible gap
- No audio when SFX volume is set to 0

### AC-07: Onboarding
- "TAP TO JUMP" prompt appears on first run only
- Prompt disappears after first successful jump
- Prompt does not appear on any subsequent run
```

### 3. Run all automated tests

```
/tdd --run-all
```

The `qa-lead` uses `skills/unity/unity-testing` to run the full test suite in the
Unity Test Framework.

**Expected test suite:**

```
EditMode Tests (fast, no Unity runtime):
  GameManagerTests          (4 tests)
  PlayerControllerTests     (5 tests)
  SpawnManagerTests         (4 tests)
  ScoreManagerTests         (5 tests)
  CollisionHandlerTests     (2 tests — setup only, collision in PlayMode)
  SaveSystemTests           (3 tests)
  InputAbstractionTests     (2 tests)
  HUDControllerTests        (2 tests)
  GameOverControllerTests   (2 tests)

PlayMode Tests (with Unity runtime):
  PlayerMovementTests       (2 tests)
  CollisionIntegrationTests (2 tests)

Total: 33 tests
All must pass before proceeding to playtest.
```

### 4. Run a structured playtest

```
/playtest-report
```

The `playtest-capture` hook fires to scaffold the note-taking structure. This ensures
all playtest observations are captured in a format the `playtest-analyst` can analyze.

**Playtest session format:**

```
Duration: 30 minutes of active play
Sessions: minimum 20 consecutive runs
Testers: at least 2 people who have not built the game

Observations to capture per run:
- Did the jump feel responsive? (Y/N + notes)
- Did any obstacle placement feel unfair? (Y/N + description)
- Was the speed ramp noticeable? (Y/N + when it felt too fast)
- Did the retry feel instant? (Y/N + observed delay)
- Any visual glitches? (Y/N + description)
- Any audio issues? (Y/N + description)
```

The `playtest-analyst` synthesizes the observations into a report using
`skills/workflow/playtest-analysis` and `docs/templates/playtest-report.md`.

**Example playtest report excerpt:**

```
## Findings

### P1 — Obstacle gap at speed ramp step 4 is too small
Observed: 6/8 testers hit an obstacle at the exact moment the speed increases from
step 3 to step 4. The gap between spawns is 1.0s at step 3 but drops to 0.6s at step 4.
Recommendation: Step 4 gap to 0.75s. Re-test with 3 testers.

### P2 — Retry button requires double-tap on mobile
Observed: 3/4 mobile testers tapped retry and nothing happened, then tapped again.
Cause: Likely the death SFX coroutine is delaying button activation by 0.3s.
Recommendation: Activate retry button immediately on GameOver, before SFX completes.

### Info — Jump feel is consistently rated as satisfying
All 8 testers said jump felt good with no changes needed.
```

If any crash occurs during playtesting, the `crash-log-capture` hook fires to capture
the crash context automatically.

### 5. Triage bugs — /bug-triage

```
/bug-triage
```

The `qa-lead` uses `skills/qa-release/bug-triage` to classify every defect found.

**Severity classification:**

| Severity | Definition | Example |
|----------|-----------|---------|
| P0 — Blocker | Game cannot be played | Crash on launch |
| P1 — Critical | Core mechanic broken | Jump never works |
| P2 — Major | Significant degradation | Retry requires double tap |
| P3 — Minor | Small issue, workaround exists | Score flickers for 1 frame |
| P4 — Cosmetic | Visual/audio polish | Coin SFX slightly loud |

**Release gate:** P0 and P1 bugs must be zero before release. P2 bugs must be addressed
or explicitly deferred. P3 and P4 bugs can be deferred.

### 6. Fix bugs with regression tests

For each P0, P1, and P2 bug:

```
/tdd [bug description]
```

The `gameplay-programmer` implements the fix. Every fix must include a regression test
that would have caught the original bug. No fix without a test.

**Example — P2 retry button delay fix:**

```csharp
// Before: button activated after SFX delay
IEnumerator ShowGameOver()
{
    audioManager.PlayDeath();
    yield return new WaitForSeconds(0.3f); // ← was blocking button
    gameOverPanel.SetActive(true);
    retryButton.interactable = true;
}

// After: button activated immediately, SFX plays concurrently
void ShowGameOver()
{
    audioManager.PlayDeath(); // fire-and-forget
    gameOverPanel.SetActive(true);
    retryButton.interactable = true; // immediate
}
```

**Regression test:**

```csharp
[UnityTest]
public IEnumerator RetryButton_IsInteractable_ImmediatelyOnGameOver()
{
    var (gm, ui) = CreateGameWithUI();
    gm.TriggerGameOver();
    yield return null; // one frame
    Assert.IsTrue(ui.RetryButton.interactable);
}
```

---

## QA Sign-off Checklist

- [ ] All 33 automated tests pass
- [ ] All acceptance criteria (AC-01 through AC-07) verified
- [ ] Playtest report complete (minimum 20 runs, 2 testers)
- [ ] P0 bug count: 0
- [ ] P1 bug count: 0
- [ ] P2 bugs: resolved or explicitly deferred with justification
- [ ] All bug fixes include regression tests
- [ ] `qa-lead` sign-off documented

This is **Milestone M7**.

---

## Scaffold Features in Action (Behind the Scenes)

- `hooks/playtest-capture` fires at the start of a playtest session and captures tester
  names, session length, and device info automatically — no manual setup required
- `hooks/crash-log-capture` fires if a crash log is detected — the context is preserved
  before the session ends so the bug can be reproduced
- `skills/qa-release/bug-triage` enforces that every bug gets a severity, an owner, and
  a resolution status — no vague "will fix later" entries in the registry

---

## What You Have After This Chapter

- 33 passing automated tests
- QA test plan with 7 acceptance criteria verified
- Playtest report with structured findings
- Bug registry with all P0/P1 resolved
- QA sign-off documented

---

## Next

[Chapter 8 — Release](./chapter-08-release.md)
