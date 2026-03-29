# Chapter 4 — UI / Input / Audio / Save

**Goal:** Build the supporting systems: UI/HUD, input abstraction, audio integration, save/load, and first-play onboarding.

**Context:** `contexts/production.md` (continued)

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `commands/` | `/tdd` | Test-driven implementation per system |
| `commands/` | `/audio-pass` | Audio integration review |
| `commands/` | `/save-system-review` | Validate save/load correctness |
| `agents/` | `ui-programmer`, `ui-ux-designer`, `gameplay-programmer`, `security-reviewer` | Supporting system agents |
| `skills/` | `skills/engineering-common/ui-hud-patterns/SKILL.md` | HUD/menu architecture |
| `skills/` | `skills/engineering-common/input-abstraction/SKILL.md` | Input handling abstraction |
| `skills/` | `skills/engineering-common/save-system-patterns/SKILL.md` | Save/load with versioning |
| `skills/` | `skills/unity/unity-input-system/SKILL.md` | Unity Input System setup |
| `skills/` | `skills/art-audio-content/audio-implementation/SKILL.md` | Audio integration patterns |
| `skills/` | `skills/design/accessibility-design/SKILL.md` | Accessibility options |
| `skills/` | `skills/design/onboarding-tutorial-design/SKILL.md` | First-play experience |
| `docs/templates/` | `docs/templates/art-bible.md` | Visual direction |
| `docs/templates/` | `docs/templates/audio-bible.md` | Audio direction |
| `rules/` | `rules/common/ui-ux.md` | HUD clarity, navigation |
| `rules/` | `rules/common/accessibility.md` | Accessibility standards |
| `rules/` | `rules/common/security.md` | Save data integrity |
| `rules/` | `rules/unity/ui.md` | Unity UI specifics |
| `rules/` | `rules/unity/serialization-data.md` | Unity serialization guidance |
| `hooks/` | `scene-integrity-check` | Fires when editing Unity scene files |
| `hooks/` | `prefab-blueprint-node-warning` | Fires when editing prefab files |
| `hooks/` | `asset-size-warning` | Fires when adding audio/texture assets |

---

## System 1: UI — Main Menu, HUD, Game Over

### Implement with TDD

```
/tdd UI — MainMenuController, HUDController, GameOverController
```

The `ui-programmer` uses `skills/engineering-common/ui-hud-patterns` and applies
`rules/common/ui-ux.md` and `rules/unity/ui.md`.

The `scene-integrity-check` hook fires when the scene files are modified. The
`prefab-blueprint-node-warning` hook fires when UI prefabs are edited.

**UI structure:**

```
MainMenu scene
  └── MainMenuController
        ├── Play Button → GameManager.StartGame()
        └── High Score display (read from SaveSystem)

Gameplay scene
  └── HUDController
        ├── Score label (subscribes to ScoreManager.OnScoreChanged)
        ├── Coin counter (subscribes to ScoreManager.OnScoreChanged)
        └── High Score label (subscribes to ScoreManager.OnHighScoreBeaten)

GameOver overlay (active on GameState.GameOver)
  └── GameOverController
        ├── Final score display
        ├── Retry Button → GameManager.RestartGame()
        └── Main Menu Button → SceneLoader.LoadMainMenu()
```

**Test examples:**

```csharp
[Test]
public void HUDController_UpdatesScore_OnScoreChanged()
{
    var hud = CreateTestHUD();
    var sm = CreateTestScoreManager();
    hud.BindTo(sm);
    sm.Tick(5f); // distance = 25 at speed 5
    Assert.AreEqual("25", hud.ScoreLabel.text);
}

[Test]
public void GameOverController_ShowsFinalScore()
{
    var goc = CreateTestGameOverController(finalScore: 150f, coins: 7);
    Assert.AreEqual("150", goc.ScoreLabel.text);
    Assert.AreEqual("7", goc.CoinLabel.text);
}
```

**Rules applied:**
- `rules/common/ui-ux.md` — score is always visible during play, never hidden by HUD layout
- `rules/common/accessibility.md` — minimum touch target size 44×44pt (mobile), font size
  minimum 16pt, sufficient contrast ratio

The `ui-ux-designer` agent applies `skills/design/accessibility-design` to verify the HUD
passes basic accessibility checks.

---

## System 2: Input Abstraction

### Implement with TDD

```
/tdd InputHandler
```

The `gameplay-programmer` uses `skills/engineering-common/input-abstraction` and
`skills/unity/unity-input-system`.

**Why abstraction?** The PlayerController should not call `Input.GetKeyDown` directly.
An `IInputProvider` interface decouples the game logic from the input source, which makes
testing easier and allows the same game to work with keyboard, gamepad, or touch.

**Interface:**

```csharp
public interface IInputProvider
{
    bool JumpPressed { get; }
}

public class UnityInputProvider : IInputProvider
{
    public bool JumpPressed =>
        Input.GetKeyDown(KeyCode.Space) ||
        Input.GetMouseButtonDown(0) ||
        (Touchscreen.current != null &&
         Touchscreen.current.primaryTouch.phase.ReadValue() == UnityEngine.InputSystem.TouchPhase.Began);
}

public class TestInputProvider : IInputProvider
{
    public bool JumpPressed { get; set; }
}
```

**Test example:**

```csharp
[Test]
public void PlayerController_Jumps_WhenInputProviderReportsJump()
{
    var inputProvider = new TestInputProvider();
    var controller = CreateTestPlayerController(inputProvider);
    inputProvider.JumpPressed = true;
    controller.Tick(Time.fixedDeltaTime);
    Assert.IsTrue(controller.IsJumping);
}
```

---

## System 3: Audio

### Define audio direction

Before implementation, create a minimal Audio Bible from the template:

```
docs/templates/audio-bible.md → project/docs/audio-bible.md
```

**Audio Bible excerpt:**

```
## Audio Identity
Snappy, punchy arcade feel. No realism. Rewards are satisfying.

## Sound Events
| Event         | Sound Description                  | Priority |
|---------------|------------------------------------|----------|
| jump          | Quick whoosh, 0.1s                 | High     |
| coin_collect  | Bright ding, 0.05s                 | High     |
| death         | Impact crunch, 0.3s                | High     |
| background    | Lo-fi chiptune loop, 120bpm        | Medium   |

## Technical
Format: WAV (SFX), MP3 (music)
Max size per SFX: 50KB
Max size music: 2MB
```

### Implement audio integration

```
/audio-pass
```

The `asset-size-warning` hook fires when audio assets are imported. Verify all SFX are
under 50KB and music is under 2MB.

The `gameplay-programmer` uses `skills/art-audio-content/audio-implementation`.

**AudioManager implementation note:**

```csharp
// AudioManager is a DontDestroyOnLoad singleton
// All SFX played via PlayOneShot to avoid cutoff on rapid events
// Music loops via AudioSource.loop = true
// All PlaySFX calls are fire-and-forget — no awaiting

public void PlayJump()   => sfxSource.PlayOneShot(jumpClip);
public void PlayCoin()   => sfxSource.PlayOneShot(coinClip);
public void PlayDeath()  => sfxSource.PlayOneShot(deathClip);
public void PlayMusic()  => musicSource.Play();
public void StopMusic()  => musicSource.Stop();
```

---

## System 4: Save System

### Implement with TDD

```
/tdd SaveSystem
```

The `gameplay-programmer` uses `skills/engineering-common/save-system-patterns` and applies
`rules/unity/serialization-data.md`.

**Implementation:**

```csharp
public static class SaveSystem
{
    private const string KEY_HIGH_SCORE = "high_score";
    private const int DEFAULT_HIGH_SCORE = 0;

    public static void SaveHighScore(int score)
    {
        PlayerPrefs.SetInt(KEY_HIGH_SCORE, score);
        PlayerPrefs.Save();
    }

    public static int LoadHighScore()
    {
        return PlayerPrefs.GetInt(KEY_HIGH_SCORE, DEFAULT_HIGH_SCORE);
    }

    public static void ClearAll()
    {
        PlayerPrefs.DeleteAll();
        PlayerPrefs.Save();
    }
}
```

**Test examples:**

```csharp
[SetUp]
public void Setup() => SaveSystem.ClearAll();

[Test]
public void SaveSystem_DefaultHighScore_IsZero()
{
    Assert.AreEqual(0, SaveSystem.LoadHighScore());
}

[Test]
public void SaveSystem_SaveAndLoad_RoundTrips()
{
    SaveSystem.SaveHighScore(450);
    Assert.AreEqual(450, SaveSystem.LoadHighScore());
}

[Test]
public void SaveSystem_Load_AfterClear_ReturnsDefault()
{
    SaveSystem.SaveHighScore(900);
    SaveSystem.ClearAll();
    Assert.AreEqual(0, SaveSystem.LoadHighScore());
}
```

### Validate with /save-system-review

```
/save-system-review
```

The `security-reviewer` agent applies `rules/common/security.md` to check:
- Save data cannot be used for code injection (PlayerPrefs values are integers — safe)
- Corrupt/missing data defaults gracefully (tested above)
- No sensitive data is persisted (only integer score — safe)

---

## System 5: First-Play Onboarding

The `ui-ux-designer` applies `skills/design/onboarding-tutorial-design` to define a
minimal first-play experience.

**Onboarding design:**

```
First run only:
1. "TAP TO JUMP" text overlay appears 1 second after run starts
2. First obstacle is placed 3 seconds in (vs normal 1.5 seconds)
3. Overlay disappears when player first jumps successfully
4. Never shown again (flag saved: onboarding_complete = true)
```

This is a one-flag SaveSystem extension:

```csharp
public static bool IsOnboardingComplete()
    => PlayerPrefs.GetInt("onboarding_complete", 0) == 1;

public static void CompleteOnboarding()
{
    PlayerPrefs.SetInt("onboarding_complete", 1);
    PlayerPrefs.Save();
}
```

---

## Milestone Check: Full Feature Complete

After all supporting systems pass tests:

- [ ] Main menu, HUD, and game-over screen working end to end
- [ ] Input works on keyboard and touch (mobile build)
- [ ] All 4 audio events trigger correctly
- [ ] High score saves and loads correctly across sessions
- [ ] Onboarding shows on first run, not on subsequent runs
- [ ] No P0/P1 bugs

This is **Milestone M4**.

---

## Scaffold Features in Action (Behind the Scenes)

- `hooks/scene-integrity-check` fires on scene edits — catches accidental scene corruption
  before it reaches version control
- `hooks/prefab-blueprint-node-warning` fires on prefab edits — ensures prefab changes are
  intentional and reviewed
- `hooks/asset-size-warning` fires on audio asset import — keeps the build size in budget
- `rules/common/security.md` applied by `security-reviewer` ensures the save system cannot
  be exploited even though it only stores scores

---

## What You Have After This Chapter

- All 8 systems implemented and test-covered
- Full game loop playable: menu → run → game over → retry
- Audio integrated
- High score persisting between sessions
- First-play onboarding working

---

## Next

[Chapter 5 — Code Review & Scene Audit](./chapter-05-review.md)
