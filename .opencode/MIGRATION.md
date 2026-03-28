# OpenCode Migration Notes

## Goal
Keep OpenCode integration thin and aligned with the scaffold.

## Do
- reuse shared commands, agents, rules, and skills
- keep OpenCode config focused on client-specific behavior

## Do not
- fork the whole workflow layer into `.opencode/`
- create OpenCode-only engine rules that diverge from shared policy
