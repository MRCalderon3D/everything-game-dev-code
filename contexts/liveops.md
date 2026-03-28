# liveops

Post-launch operations, telemetry, and events. Ongoing game management after the initial release to sustain engagement, fix live issues, and deliver new content.

## Purpose
Keep the live game healthy, respond to player issues, and deliver new content and events on a cadence that sustains engagement. Live ops requires faster response cycles than production and a tighter feedback loop between telemetry data and design decisions.

## Active Agents
- `producer` — manages the live ops calendar, content cadence, and incident response priorities
- `planner` — tracks open issues, event deliverables, and ongoing content drops
- `gameplay-programmer` — implements live patches, hotfixes, and event content
- `systems-designer` — adjusts balance parameters and event configuration based on telemetry
- `qa-lead` — validates patches and event content before they go live
- `playtest-analyst` — interprets telemetry and player feedback to surface design issues
- `security-reviewer` — monitors for exploits, cheating, and data handling risks in the live environment
- `release-manager` — manages patch submission, certification (where required), and deployment

## Key Commands
- `/plan` — plan a content update, event, or patch cycle
- `/playtest-report` — capture and analyze player feedback and telemetry findings
- `/perf-budget` — monitor live performance metrics against targets
- `/milestone-plan` — schedule the live ops content roadmap

## Source-of-Truth Documents
- `Live ops calendar` — scheduled events, patches, and content drops with dates
- `Telemetry dashboard` — active player metrics, retention, and engagement signals
- `Incident log` — tracked live issues with severity, status, and resolution notes
- `Patch notes` — documented changes in each live update

## Priorities
1. Respond to live-breaking issues within the incident response SLA — do not wait for the next patch cycle.
2. Base live balance and event decisions on telemetry data, not intuition.
3. Test every patch and event content drop in a staging environment before deploying to live.
4. Communicate changes to players before they go live — surprise patches erode trust.
5. Maintain a rollback plan for every deployment — live rollbacks must be executable under pressure.
6. Keep the live ops calendar realistic — overpromising content drops causes quality shortcuts.

## Escalate When
- A live issue is affecting a significant portion of the player base and cannot wait for the next patch
- Telemetry reveals a systemic design problem that cannot be fixed with balance parameters alone
- A security exploit is found in the live build
- A content drop or event cannot be delivered to the stated quality bar within the scheduled window
- Platform certification delays are threatening a time-sensitive live event

## What to Avoid
- Deploying patches without a QA pass because the issue seems minor
- Making live balance changes without telemetry data to justify them
- Running events that have not been tested end-to-end in a staging environment
- Treating the live ops calendar as fixed when player response or business needs change it
- Ignoring incident reports because the team is busy with the next content drop
