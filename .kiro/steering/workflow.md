---
inclusion: fileMatch
fileMatchPattern: "**/*"
---

# Workflow Guidance

## Preferred execution order
1. resolve to a shared command if possible
2. select the owning agent
3. apply the matching skill set
4. check the relevant rules layer
5. update docs and verification outputs if behavior changes

## Guardrails
- preserve engine isolation
- surface risks and ownership explicitly
- avoid ad hoc workflows when a shared command or skill already exists
