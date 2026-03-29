# Chapter 8 — Release

**Goal:** Run the release readiness checklist, build the project, generate patch notes, and certify the build for distribution.

**Context:** `contexts/release.md`

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/release.md` | Activates release-phase agents |
| `commands/` | `/verify` | Run full scaffold validation |
| `commands/` | `/release-check` | Full release readiness review |
| `commands/` | `/unity-build-fix` | Resolve build failures |
| `commands/` | `/patch-notes` | Generate structured release notes |
| `agents/` | `release-manager`, `qa-lead`, `build-engineer`, `unity-build-resolver` | Release agents |
| `skills/` | `skills/qa-release/release-readiness/SKILL.md` | Release checklist validation |
| `skills/` | `skills/qa-release/store-submission/SKILL.md` | Store submission preparation |
| `skills/` | `skills/unity/unity-build-release/SKILL.md` | Unity build pipeline configuration |
| `skills/` | `skills/engineering-common/build-pipeline-patterns/SKILL.md` | CI/build patterns |
| `docs/templates/` | `docs/templates/release-checklist.md` | Release checklist template |
| `rules/` | `rules/common/build-release.md` | Build configuration standards |
| `rules/` | `rules/unity/build-release.md` | Unity build specifics |
| `hooks/` | `build-matrix-capture` | Captures build configuration for debugging |
| `hooks/` | `session-summary` | Writes a structured session summary at session end |

---

## Steps

### 1. Switch to the release context

```
contexts/release.md
```

This activates the `release-manager` as the lead agent. The `release-manager` owns the
release checklist and the go/no-go decision. No build is shipped without `release-manager`
sign-off backed by `qa-lead` sign-off from Chapter 7.

### 2. Run scaffold validation — /verify

```
/verify
```

The `verify` command runs the full scaffold validation suite. This catches any scaffold-level
issues before the release checklist runs: missing rule files, broken manifest references,
hook configuration errors.

Expected output:

```
[PASS] Engine profile: unity-production
[PASS] rules/common/ — 18 files present
[PASS] rules/unity/ — 23 files present
[PASS] hooks/hooks.json — valid, all 10 hooks configured
[PASS] manifests/ — all 3 manifest files valid against schemas
[PASS] agents/ — no broken references
[PASS] commands/ — no broken references
[PASS] skills/ — all SKILL.md files present
Scaffold validation: PASSED
```

### 3. Run the release checklist — /release-check

```
/release-check
```

The `release-manager` and `qa-lead` use `skills/qa-release/release-readiness` and
`docs/templates/release-checklist.md`.

**Release checklist:**

```
## Code and Tests
[ ] All 33 automated tests pass (confirmed from Chapter 7)
[ ] No TODO or FIXME comments in production code paths
[ ] No Debug.Log calls outside #if UNITY_EDITOR guards
[ ] No hardcoded test values in production code

## Performance
[ ] Frame budget met on all target platforms (confirmed from Chapter 6)
[ ] Memory budget met on all target platforms (confirmed from Chapter 6)
[ ] GC.Alloc zero in hot path (confirmed from Chapter 6)

## QA
[ ] QA sign-off documented (confirmed from Chapter 7)
[ ] Zero P0 bugs
[ ] Zero P1 bugs
[ ] All P2 bugs resolved or formally deferred

## Data and Save
[ ] Save system tested after simulated force-quit
[ ] Default high score (0) shown on fresh install
[ ] No PlayerPrefs keys conflict with system keys

## Build Configuration
[ ] Development Build is UNCHECKED in Build Settings
[ ] Scripting Define Symbols: RELEASE is defined, DEBUG is not
[ ] Target Architecture: ARM64 (Android) / Universal (PC)
[ ] Compression: LZ4HC (Android) / default (PC)
[ ] Bundle ID / Package Name matches store registration
[ ] Version number updated (current: 1.0.0)
[ ] Build number incremented

## Audio / Assets
[ ] All audio assets are the final approved versions (not placeholder)
[ ] All art assets are the final approved versions
[ ] No missing asset references in scenes or prefabs

## Platform
[ ] Game runs at 60fps on the minimum supported device
[ ] Touch input works on all tested screen sizes
[ ] Game correctly resumes after OS interruption (phone call, notification)
```

### 4. Configure the build

The `build-engineer` uses `skills/unity/unity-build-release` and applies
`rules/unity/build-release.md`.

**Build Settings (Unity Editor):**

```
Platform:            Android (or PC)
Architecture:        ARM64
Scripting Backend:   IL2CPP
API Compatibility:   .NET Standard 2.1
Development Build:   [ ] (UNCHECKED)
Autoconnect Profiler:[ ] (UNCHECKED)
Script Debugging:    [ ] (UNCHECKED)
Compression:         LZ4HC
```

**Player Settings:**

```
Company Name:    [your studio]
Product Name:    Dash & Collect
Bundle ID:       com.[studio].dashandcollect
Version:         1.0.0
Build Number:    1
Orientation:     Landscape (locked)
```

### 5. Build the project

Trigger the build. The `build-matrix-capture` hook fires to capture the full build
configuration (Unity version, platform, scripting backend, all player settings) to a
build log. This log is essential if a post-release bug needs to be reproduced against
the exact build environment.

If the build fails:

```
/unity-build-fix
```

The `unity-build-resolver` agent analyzes the error output and proposes a fix. Common
Unity build failures at this stage:

| Error | Cause | Fix |
|-------|-------|-----|
| `TypeLoadException` at runtime | IL2CPP stripping removed a needed type | Add `link.xml` preserve rule |
| Missing native library | Android plugin not configured for ARM64 | Update plugin settings in Inspector |
| Assembly definition error | Cross-assembly reference in IL2CPP | Review `asmdef` dependencies |
| Texture compression error | Unsupported format on target device | Change texture format in import settings |

### 6. Generate patch notes — /patch-notes

```
/patch-notes
```

The `release-manager` generates structured release notes covering the full development
cycle:

**Patch notes — Dash & Collect v1.0.0:**

```
## Dash & Collect — Version 1.0.0

Initial release.

### Features
- Endless 2D runner with auto-run and tap-to-jump mechanic
- Procedural obstacle and coin spawning with increasing difficulty
- Local high score persistence
- Main menu, gameplay HUD, and game-over screen
- Jump, coin, death, and background music audio
- First-play onboarding prompt

### Performance
- 60fps on target hardware
- Zero GC allocations in gameplay hot path
- Object pooling for all spawned objects

### Platforms
- PC (Windows, macOS)
- Android (ARM64, Android 8.0+)
```

### 7. Store submission (if applicable)

The `release-manager` uses `skills/qa-release/store-submission` for platform-specific
packaging:

- **PC (itch.io):** Zip the build folder, upload via `butler push`
- **Android (Google Play):** Generate signed AAB, upload to Play Console as internal track
- **iOS (App Store):** Archive in Xcode, upload via Transporter

---

## Release Sign-off Checklist

- [ ] `/verify` passes cleanly
- [ ] All release checklist items checked
- [ ] Build compiles without errors or warnings
- [ ] Build runs on a clean device (not the development machine)
- [ ] Patch notes written and reviewed
- [ ] `release-manager` sign-off documented
- [ ] `qa-lead` sign-off confirmed (from Chapter 7)
- [ ] Build artifact stored (e.g., in `builds/v1.0.0/`)

This is **Milestone M8**.

The `session-summary` hook fires when the release session ends, writing a structured
summary of all decisions made, commands run, and agents invoked during the release pass.

---

## Scaffold Features in Action (Behind the Scenes)

- `hooks/build-matrix-capture` ensures the exact build configuration is archived with
  every build — not just the artifact, but the environment that produced it
- `hooks/session-summary` captures the release session as a structured document that
  becomes part of the project's release history
- `rules/unity/build-release.md` prevents common mistakes like shipping with
  "Development Build" checked or with the profiler autoconnect enabled

---

## What You Have After This Chapter

- Certified build artifact
- Patch notes published
- Build configuration archived
- Release sign-off documented from both `release-manager` and `qa-lead`
- Session summary written by the `session-summary` hook

---

## Next

[Chapter 9 — Post-Launch & Live Ops](./chapter-09-liveops.md)
