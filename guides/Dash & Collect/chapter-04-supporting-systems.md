# Chapter 4 — UI / Input / Audio / Save

**Goal:** Build the supporting systems: UI/HUD, input abstraction, audio integration, save/load, and first-play onboarding.

**Context:** `contexts/production.md` (continued)

> **Continue the same Claude Code session from Chapter 3.**
> This chapter shares the production context — no context switch needed.

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `commands/` | `/unity-placeholders` | Generate placeholder sprites, prefabs, and audio stubs |
| `commands/` | `/scene-bootstrap` | Populate the game scene and wire all inspector references |
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

## Step 0: Create visual placeholders

Before building any supporting systems, generate placeholder assets so the core systems from
Chapter 3 are visually testable in the Unity Editor. These placeholders will be replaced by
final assets later — they exist only to make the game runnable and observable.

First, generate the placeholder assets:

```
/unity-placeholders Create placeholder assets for "Dash & Collect":
- Player: white rectangle sprite (1x2 units) → Prefabs/Player/Player.prefab
- Obstacle: red rectangle sprite (1x2 units) → Prefabs/Obstacles/Obstacle.prefab
- Coin: yellow circle sprite (0.5x0.5 units) → Prefabs/Collectibles/Coin.prefab
- Ground: grey rectangle sprite (20x1 units) → Prefabs/Environment/Ground.prefab
- Background: dark blue rectangle sprite (20x12 units) → Prefabs/Environment/Background.prefab
- Audio: procedurally generated AudioClip assets (not silent) in Audio/SFX/ and Audio/Music/:
  - Jump: quick rising sine sweep (0.1s, 400Hz→800Hz)
  - Collect: bright double-ping sine tone (0.05s, 880Hz + 1100Hz)
  - GameOver: descending square wave (0.3s, 300Hz→100Hz) with noise burst
  - BGM: looping chiptune sequence — square wave arpeggio (120bpm, 4 bars, C-E-G-C pattern)
```

The script generates audio using `AudioClip.Create()` + `SetData()` with math-based
synthesis — sine waves, square waves, and white noise. No external audio tools or APIs
are needed. The generated clips are saved as `.wav` assets.

Run the generated script in Unity via **Tools → Generate Placeholders**. Verify all prefabs
appear in the Project window and audio plays correctly in Play mode, then delete the script.

Then, populate the scene:

```
/scene-bootstrap Populate Assets/Scenes/Game.unity for "Dash & Collect":
- Main Camera: orthographic, size 5, position (0, 0, -10)
- Background at (0, 0, 10), Ground at (0, -4, 0) with BoxCollider2D
- Player prefab at (-4, -3, 0)
- Empty GameObjects with scripts: GameManager, SpawnManager, ScoreManager, AudioManager
- HUD Canvas (Screen Space — Overlay)
- Wire: GameManager ← Player, SpawnManager ← Obstacle prefab + Coin prefab, AudioManager ← all audio clips
```

Run the generated script in Unity via **Tools → Bootstrap Scene**. Verify the scene opens,
all objects are placed, and the game runs in Play mode before continuing.

> These placeholders are intentionally minimal. Do not spend time on visuals or audio polish
> here — the goal is a playable loop you can see and hear, not a polished game. The
> procedural audio gives immediate gameplay feedback (you hear the jump, the coin, the death)
> which makes testing far more effective than silent stubs.

---

## System 1: UI — Main Menu, HUD, Game Over

### Implement with TDD

```
/tdd Implement UI for "Dash & Collect": MainMenuController (Play button → GameManager.StartGame, high score display), HUDController (score label, coin counter, high score label — all event-driven), GameOverController (final score, Retry button → GameManager.RestartGame, Main Menu button → SceneLoader.LoadMainMenu).
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
/tdd Implement InputHandler for "Dash & Collect": IInputProvider interface with JumpPressed property, UnityInputProvider (Space key, left mouse click, touch), TestInputProvider for test doubles. PlayerController must receive IInputProvider via constructor injection.
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
/plan Create a minimal Audio Bible for "Dash & Collect" using docs/templates/audio-bible.md. Save the output to project/docs/audio-bible.md. Sound events: jump (quick whoosh), coin_collect (bright ding), death (impact crunch), background music (lo-fi chiptune loop).
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
/audio-pass Review and implement audio integration for "Dash & Collect": AudioManager singleton (DontDestroyOnLoad), PlayOneShot for all SFX (jump, coin, death), looping music source. Verify all 4 events trigger correctly and audio stubs are wired in the scene.
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
/tdd Implement SaveSystem for "Dash & Collect" using PlayerPrefs: SaveHighScore(int), LoadHighScore() → int, ClearAll(). Also IsOnboardingComplete() → bool and CompleteOnboarding(). All keys must be constants. No sensitive data stored.
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
/save-system-review Review the SaveSystem for "Dash & Collect": PlayerPrefs-based, stores high_score (int) and onboarding_complete (int). Verify no injection risk, corrupt/missing data defaults gracefully, no sensitive data persisted.
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

Before moving to the next chapter, ask Claude to validate the milestone plan against what has been built:

```
Read the milestone plan (design/MILESTONE-PLAN.md or similar) and compare it against what we have implemented in this session. List any gaps — features, tests, or criteria that are not yet met.
```

If Claude reports gaps, address them before continuing. For each gap:
- Use `/tdd [description]` for missing code or tests.
- Items that require manual work in Unity (prefabs, scene wiring) must be done in the editor — Claude will tell you which ones.

Do not proceed to Chapter 5 until all M4 criteria are met.

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

[Chapter 5 — 2D Art Assets](./chapter-05-2d-art.md)
