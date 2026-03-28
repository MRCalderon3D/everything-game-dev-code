# godot/tooling

Extends `../common/documentation.md` with Godot-specific content.

## Tooling Rules
- Editor plugins, import helpers, validators, exporters, and pipeline helpers must reduce manual work or pipeline risk.
- Tools that modify many resources or scene paths must fail safely and explain what changed.
- Production-critical tools need documentation and an owner.

## Workflow Rules
- Validation tooling should be easy to run locally and in automation where possible.
- Avoid hidden workflows that depend on one expert remembering editor rituals.
- Engine upgrades that affect tooling or addons require compatibility review and migration notes.

## Done Criteria
Godot tooling is acceptable when it is safe, discoverable, and worth the maintenance cost.
