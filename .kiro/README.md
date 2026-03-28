# Kiro Adapter

This adapter maps the shared scaffold to Kiro steering.

## Key conventions
- Kiro supports foundational steering files such as `product.md`, `tech.md`, and `structure.md`.
- Kiro also supports `AGENTS.md` as always-included steering.

## Adapter strategy
- keep foundational product, tech, and structure guidance in `.kiro/steering/`
- keep detailed role, rule, skill, and command logic in the shared scaffold
- use Kiro steering to orient the agent quickly, not to duplicate the full repository
