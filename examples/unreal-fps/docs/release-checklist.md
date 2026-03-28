# Shardline Zero Release Checklist

## Candidate Build Gates

- Packaged build launches cleanly on target hardware
- Match flow from menu to postmatch completes without blocker defects
- Replication regressions are reviewed under simulated latency
- Crash capture and packaged-build logs are archived

## Required Reviews

- `release-manager` for go/no-go framing
- `qa-lead` for blocker review
- `network-programmer` for authority and replication risk sign-off
- `unreal-reviewer` for Unreal-specific implementation review

## Known Risk Areas

- Blueprint authority drift
- Plugin instability after engine updates
- Packaged-only asset loading failures
- Matchmaking or session recovery edge cases
