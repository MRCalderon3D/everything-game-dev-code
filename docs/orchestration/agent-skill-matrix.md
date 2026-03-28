# Agent / Skill Matrix

This matrix defines which skill groups each agent should reach for first. It is not a hard lock, but it is the default routing map for consistent delegation.

## How to Use This Matrix
- Start with the agent's primary skill set.
- Pull adjacent skills only when the task crosses boundaries.
- Escalate to `planner`, `producer`, or `technical-design-lead` when a task spans multiple domains or changes project-level decisions.
- Use engine-specific skill groups only when the implementation is explicitly inside Unity, Unreal, or Godot.

## Core Delivery Agents

### planner
Primary skills:
- workflow/gdd-writing
- workflow/technical-design-document
- workflow/vertical-slice-planning
- workflow/milestone-planning
- workflow/risk-register
- workflow/orchestration-patterns

Secondary skills:
- workflow/verification-loop
- workflow/continuous-learning

### architect
Primary skills:
- engineering-common/gameplay-architecture
- engineering-common/event-bus-patterns
- engineering-common/save-system-patterns
- engineering-common/tools-pipeline-patterns
- engineering-common/build-pipeline-patterns
- workflow/technical-design-document

Secondary skills:
- engineering-common/input-abstraction
- engineering-common/ui-hud-patterns
- engineering-common/multiplayer-netcode-patterns

### producer
Primary skills:
- workflow/milestone-planning
- workflow/risk-register
- workflow/vertical-slice-planning
- qa-release/release-readiness
- workflow/orchestration-patterns

Secondary skills:
- workflow/playtest-analysis
- engineering-common/performance-budgeting
- engineering-common/memory-budgeting

### gdd-designer
Primary skills:
- workflow/gdd-writing
- design/core-loop-design
- design/progression-design
- design/level-design
- design/onboarding-tutorial-design

Secondary skills:
- design/narrative-design
- design/accessibility-design
- design/liveops-design

### technical-design-lead
Primary skills:
- workflow/technical-design-document
- engineering-common/gameplay-architecture
- engineering-common/save-system-patterns
- engineering-common/event-bus-patterns
- engineering-common/build-pipeline-patterns

Secondary skills:
- engineering-common/multiplayer-netcode-patterns
- engineering-common/performance-budgeting
- engineering-common/memory-budgeting

## Design Agents

### systems-designer
Primary skills:
- design/core-loop-design
- design/progression-design
- design/economy-balancing
- design/liveops-design

### combat-designer
Primary skills:
- design/combat-design
- design/progression-design
- workflow/playtest-analysis

### level-designer
Primary skills:
- design/level-design
- design/onboarding-tutorial-design
- design/quest-design

### narrative-designer
Primary skills:
- design/narrative-design
- art-audio-content/dialogue-content-pipeline
- art-audio-content/localization-pipeline

### ui-ux-designer
Primary skills:
- design/accessibility-design
- design/onboarding-tutorial-design
- engineering-common/ui-hud-patterns

### economy-designer
Primary skills:
- design/economy-balancing
- design/monetization-design
- design/liveops-design
- engineering-common/telemetry-instrumentation

### technical-artist
Primary skills:
- art-audio-content/technical-art-pipeline
- art-audio-content/vfx-pipeline
- engineering-common/asset-management
- engineering-common/performance-budgeting

### audio-designer
Primary skills:
- art-audio-content/audio-implementation
- art-audio-content/dialogue-content-pipeline
- design/accessibility-design

## Engineering Agents

### gameplay-programmer
Primary skills:
- engineering-common/gameplay-architecture
- engineering-common/input-abstraction
- engineering-common/save-system-patterns
- engineering-common/event-bus-patterns

### ai-programmer
Primary skills:
- engineering-common/ai-behavior-patterns
- engineering-common/gameplay-architecture
- engineering-common/performance-budgeting

### physics-programmer
Primary skills:
- engineering-common/physics-gameplay-patterns
- engineering-common/gameplay-architecture

### animation-programmer
Primary skills:
- engineering-common/animation-state-patterns
- engineering-common/gameplay-architecture

### ui-programmer
Primary skills:
- engineering-common/ui-hud-patterns
- engineering-common/input-abstraction
- engineering-common/telemetry-instrumentation

### network-programmer
Primary skills:
- engineering-common/multiplayer-netcode-patterns
- engineering-common/save-system-patterns
- engineering-common/telemetry-instrumentation

### tools-programmer
Primary skills:
- engineering-common/tools-pipeline-patterns
- engineering-common/asset-management
- engineering-common/build-pipeline-patterns

### build-engineer
Primary skills:
- engineering-common/build-pipeline-patterns
- qa-release/store-submission
- qa-release/release-readiness

## QA / Review / Release Agents

### qa-lead
Primary skills:
- qa-release/qa-test-matrix
- qa-release/bug-triage
- qa-release/release-readiness
- workflow/verification-loop

### playtest-analyst
Primary skills:
- workflow/playtest-analysis
- design/core-loop-design
- engineering-common/telemetry-instrumentation

### performance-reviewer
Primary skills:
- engineering-common/performance-budgeting
- engineering-common/memory-budgeting
- qa-release/crash-triage

### accessibility-reviewer
Primary skills:
- design/accessibility-design
- engineering-common/ui-hud-patterns
- art-audio-content/audio-implementation

### release-manager
Primary skills:
- qa-release/release-readiness
- qa-release/store-submission
- qa-release/compliance-checklists
- workflow/milestone-planning

### code-reviewer
Primary skills:
- workflow/verification-loop
- engineering-common/gameplay-architecture
- engineering-common/tools-pipeline-patterns

### security-reviewer
Primary skills:
- qa-release/compliance-checklists
- engineering-common/build-pipeline-patterns
- engineering-common/telemetry-instrumentation

### refactor-cleaner
Primary skills:
- engineering-common/gameplay-architecture
- engineering-common/event-bus-patterns
- engineering-common/asset-management

### console-compliance-reviewer
Primary skills:
- qa-release/console-certification
- qa-release/compliance-checklists
- qa-release/store-submission

## LiveOps / Analytics Agents

### liveops-manager
Primary skills:
- design/liveops-design
- design/monetization-design
- engineering-common/telemetry-instrumentation
- qa-release/release-readiness

### telemetry-analyst
Primary skills:
- engineering-common/telemetry-instrumentation
- design/economy-balancing
- workflow/playtest-analysis

### mobile-f2p-analyst
Primary skills:
- design/monetization-design
- design/economy-balancing
- design/liveops-design
- engineering-common/telemetry-instrumentation

## Engine-Specific Agents

### unity-reviewer
Primary skills:
- unity/unity-project-structure
- unity/unity-csharp-standards
- unity/unity-gameplay-patterns
- unity/unity-performance
- unity/unity-testing

### unity-build-resolver
Primary skills:
- unity/unity-build-release
- unity/unity-editor-tooling
- unity/unity-project-structure

### unreal-reviewer
Primary skills:
- unreal/unreal-project-structure
- unreal/unreal-cpp-standards
- unreal/unreal-blueprint-patterns
- unreal/unreal-performance
- unreal/unreal-testing

### unreal-build-resolver
Primary skills:
- unreal/unreal-build-release
- unreal/unreal-editor-tooling
- unreal/unreal-project-structure

### godot-reviewer
Primary skills:
- godot/godot-project-structure
- godot/godot-gdscript-standards
- godot/godot-scene-architecture
- godot/godot-performance
- godot/godot-testing

### godot-build-resolver
Primary skills:
- godot/godot-build-release
- godot/godot-editor-tooling
- godot/godot-project-structure

## Routing Rules
- If a task changes player-facing goals, route through the relevant design agent before engineering finalization.
- If a task changes architecture, persistence, networking, or build strategy, route through `technical-design-lead` or `architect`.
- If a task affects milestone risk, scope, compliance, or launch readiness, route through `producer`, `qa-lead`, or `release-manager`.
- If a task is implementation-only inside one engine, prefer the matching engine reviewer or build resolver.
