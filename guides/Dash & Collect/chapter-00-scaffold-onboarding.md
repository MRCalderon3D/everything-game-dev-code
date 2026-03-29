# Chapter 0 — Scaffold Onboarding

**Goal:** Set up the complete workspace — scaffold installed, Unity project created, Claude Code pointed at the right root — so that all subsequent chapters work correctly.

---

## Prerequisites

Before starting, make sure you have:

| Tool | Version | Why |
|------|---------|-----|
| **Git** | any | Clone the scaffold repo |
| **Node.js** | 18+ | Runs the install scripts and hooks |
| **Unity Hub** | latest | Create and manage the Unity project |
| **Unity Editor** | 2022 LTS or 6 LTS | Target engine for this guide |
| **Claude Code** | latest | AI assistant that reads this scaffold |

---

## Step 1 — Clone the scaffold repository

The scaffold is a standalone repository. Clone it to wherever you keep your projects:

```bash
git clone https://github.com/your-org/everything-game-dev-code.git dash-and-collect
cd dash-and-collect
```

> If you already have the repository, make sure you are on the `main` branch and up to date:
> ```bash
> git checkout main && git pull
> ```

---

## Step 2 — Understand the workspace structure

This is the most important concept to get right before doing anything else.

**The scaffold IS the Claude Code workspace root.** The Unity project lives INSIDE the scaffold as a subfolder. This is what the final layout looks like:

```
dash-and-collect/                ← Claude Code workspace (scaffold root)
  │
  ├── game/                      ← Unity project (created in Step 4)
  │     ├── Assets/
  │     ├── Packages/
  │     └── ProjectSettings/
  │
  ├── agents/                    ← scaffold agents
  ├── commands/                  ← scaffold commands
  ├── rules/                     ← scaffold rules
  ├── skills/                    ← scaffold skills
  ├── hooks/                     ← scaffold hooks
  ├── contexts/                  ← scaffold phase contexts
  ├── manifests/                 ← install profiles
  ├── guides/                    ← this guide
  └── .game-dev/                 ← install state (created in Step 5, gitignored)
```

**Why this layout?**

- Claude Code opens the scaffold root — it can read all rules, agents, commands, and skills
- Claude Code can also read and edit the Unity project files under `game/`
- The hooks system uses the scaffold root as `WORKSPACE_ROOT`
- Engine isolation is enforced: Unreal or Godot rules never activate for a Unity project

---

## Step 3 — Install Node.js dependencies

```bash
npm install
```

This installs the dependencies for the install script and the hook scripts. Required before
running any scaffold tooling.

---

## Step 4 — Create the Unity project

Open Unity Hub and create a new project:

1. Click **New Project**
2. Template: **2D (Built-in Render Pipeline)**
3. Project name: `game`
4. Location: set to the scaffold root folder (`dash-and-collect/`)
5. Click **Create project**

Unity Hub will create `dash-and-collect/game/` with the standard `Assets/`, `Packages/`,
and `ProjectSettings/` structure.

**Verify the layout is correct:**

```
dash-and-collect/
  game/
    Assets/
    Packages/
    ProjectSettings/
  agents/
  commands/
  ...
```

If Unity created the project somewhere else, move the `game/` folder into the scaffold root.

---

## Step 5 — Install the scaffold profile

Run the install script from the scaffold root (not from inside `game/`):

```bash
# macOS / Linux
bash install.sh unity-production

# Windows (PowerShell)
.\install.ps1 -Profile unity-production

# Direct (any platform)
node scripts/install-profile.js unity-production
```

Expected output:

```json
{
  "ok": true,
  "profile": "unity-production",
  "active_engine": "unity",
  "installed_components": 12,
  "installed_modules": 12,
  "included_files": 297
}
```

This creates three files under `.game-dev/` (gitignored, never committed):

| File | Content |
|------|---------|
| `.game-dev/profile.json` | Active engine: `unity` |
| `.game-dev/install-state.json` | Full list of installed components |
| `.game-dev/install-report.json` | All 297 files active in this profile |

**Understand the profile system:**

`manifests/install-profiles.json` defines named profiles. The `unity-production` profile
activates these components:

```
baseline:rules       → rules/common/
baseline:agents      → agents/
baseline:commands    → commands/
baseline:skills      → skills/ (workflow, design, engineering-common, art-audio-content, qa-release)
baseline:docs        → docs/templates/ + docs/orchestration/
baseline:contexts    → contexts/
engine:unity         → rules/unity/ + skills/unity/
```

Unreal and Godot components are NOT installed. This enforces engine isolation from the start.

---

## Step 6 — Set the engine environment variable

The hooks system reads `GAME_DEV_PROFILE` to enforce engine isolation at runtime.
Set it for your current shell session:

```bash
# macOS / Linux
export GAME_DEV_PROFILE=unity

# Windows (PowerShell)
$env:GAME_DEV_PROFILE = "unity"

# Windows (Command Prompt)
set GAME_DEV_PROFILE=unity
```

> To avoid setting this every session, add it to your shell profile (`.bashrc`, `.zshrc`,
> or Windows environment variables).

---

## Step 7 — Open Claude Code in the scaffold root

Open Claude Code from the scaffold root, **not** from inside `game/`:

```bash
# From inside dash-and-collect/
claude
```

Or open the `dash-and-collect/` folder in VS Code and start Claude Code from there.

**Verify Claude Code is in the right directory:**

```bash
pwd
# should show: .../dash-and-collect
# NOT: .../dash-and-collect/game
```

---

## Step 8 — Read the entry point files

With Claude Code open, read the three files that orient the AI to this project:

- `README.md` — repository purpose and high-level structure
- `CLAUDE.md` — behavior rules for the AI in this project
- `AGENTS.md` — which agents exist and what each one does

These are the first things Claude Code reads when starting a session on this scaffold.

---

## Step 9 — Understand the rules resolution order

The scaffold resolves rules in a strict two-layer order for this project. Never mix engines:

```
1. rules/common/   — shared policy (always active, engine-neutral)
2. rules/unity/    — Unity-specific execution (active for this project only)
```

Verify both layers are present:

```bash
ls rules/common/     # ~18 .md files
ls rules/unity/      # ~23 .md files
```

The following engine layers are present in the repository but are **not active** and
should never be applied to this project:

```
rules/unreal/   ← ignored
rules/godot/    ← ignored
```

---

## Verification Checklist

Before proceeding to Chapter 1:

- [ ] `dash-and-collect/` is the workspace root (scaffold root)
- [ ] `dash-and-collect/game/` contains the Unity project (`Assets/`, `Packages/`, `ProjectSettings/`)
- [ ] `npm install` completed successfully
- [ ] Install script ran: `ok: true`, `active_engine: "unity"`
- [ ] `.game-dev/profile.json` shows `"active_profile": "unity"`
- [ ] `GAME_DEV_PROFILE=unity` is set in the current shell
- [ ] Claude Code is open from `dash-and-collect/` (not from `game/`)
- [ ] `rules/common/` and `rules/unity/` are both present
- [ ] Unreal and Godot rules confirmed NOT in the installed profile

---

## Scaffold Features in Action (Behind the Scenes)

- `manifests/` ensures you only activate Unity-relevant agents, skills, and rules — 297
  files instead of the full repository
- `schemas/` validates the manifest files every time the install runs — catching broken
  references before they cause problems later
- `hooks/engine-profile-guard` will warn on any Write or Edit operation if
  `GAME_DEV_PROFILE` is not set — protecting engine isolation throughout the project
- `.game-dev/profile.json` is the runtime source of truth for which engine is active —
  scripts and hooks read this file, not just the env var

---

## What You Have After This Chapter

```
dash-and-collect/
  game/               ← Unity 2D project, ready for development
  .game-dev/          ← scaffold install state (unity-production profile active)
  rules/common/       ← 18 shared rules active
  rules/unity/        ← 23 Unity rules active
  agents/             ← 40 agent definitions available
  commands/           ← 44 commands available
  skills/             ← 78 skills available (6 domains)
  contexts/           ← 9 phase contexts available
  hooks/              ← 10 hooks configured
```

---

## Next

[Chapter 1 — Ideation](./chapter-01-ideation.md)
