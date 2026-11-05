# Los Renacidos: Echoes of Talasaria - Vertical Slice GDD

## Concept
This sample adapts the supplied `Los Renacidos: Ecos de Talasaria` GDD into a compact HTML5 roguelike action vertical slice. The player controls Erik during an unstable Echo of Talasaria, moving between procedural route nodes, surviving real-time encounters, gaining skill through use, and bringing knowledge back to Corvus' Archive after extraction, victory, or death.

## Genre, Audience, And Platform
- Genre: Narrative action roguelike / LitRPG survival.
- Camera: 2.5D top-down Canvas arena presentation.
- Platform: Web browser, PC-first controls.
- Audience: Players who want fast tactical combat, persistent lore progression, and clear LitRPG feedback.

## Scope
This build focuses on the MVP slice from the source GDD:
- Playable character: Erik.
- Biomes: Frontier, Minoc outskirts, Road to Valdrenot, Lost Knowledge ruins.
- Enemies: cursed boars, cursed rabbits, goblins, bandits, and the Alpha Cursed Boar boss.
- NPC/event echoes: Wandering Merchant, Brand, Thorpe, Garrick, and Corvus.
- Systems: procedural node route, real-time combat, skills by use, corruption pressure, echo archive metaprogression.

Out of scope for this sample:
- Cris as a playable mage.
- Full five-circle magic system.
- Full story campaign, Lotus duel, Archelas fight, console support, external art, and network saves.

## Core Loop
1. Start in Minoc's echo camp.
2. Enter a procedural route of nodes.
3. Choose between combat, event, rest, merchant, training, elite, and boss nodes.
4. Fight in a 2.5D arena using movement, light attacks, heavy attacks, dodge, block, and bandages.
5. Gain skills by performing actions.
6. Earn copper, supplies, archive fragments, and temporary run upgrades.
7. Clear the boss or die, then convert fragments into Archive mastery for future runs.

## Player Mechanics
- Move with WASD or arrow keys.
- Light attack with `J` or left mouse.
- Heavy attack with `K`.
- Dodge with `Space`, consuming stamina and granting brief invulnerability.
- Block with `Shift`, reducing incoming damage and raising Parry.
- Use bandage with `Q`, raising Healing.
- Interact and confirm choices with `E`, `Enter`, or number keys.

## Progression By Use
Actions raise skills during the run:
- Swordsmanship: landing attacks.
- Tactics: defeating enemies.
- Parry: blocking or mitigating attacks.
- Healing: using bandages.
- Survival: clearing rooms and handling route events.
- Negotiation: merchant choices.

Completing major milestones grants Archive fragments. Archive mastery is stored permanently and increases Erik's initial stats in later runs.

## Combat Model
Combat is real-time and pattern based. Enemies telegraph attacks, chase, circle, and pressure stamina. Erik is durable but must manage stamina for blocks, dodges, and heavy attacks. The boss teaches charge timing, dodge spacing, and stamina discipline.

## Corruption
Corruption increases during a run and from risky event choices. Higher corruption increases enemy pressure and reward value. If it rises too far, incoming damage increases and Archelas' presence intrudes through System warnings.

## UI Flow
- Title screen.
- Hub screen.
- Route map.
- Combat HUD.
- Event/reward panels.
- Archive screen.
- Settings screen.
- Pause overlay.
- Run end screen.

## Art Direction
The game uses procedural Canvas art: dark forest floors, torchlit UI panels, rune-blue System text, gold stat highlights, green corruption cracks, readable silhouettes, and stylized 2.5D shadows.

## Audio Direction
The Web Audio API generates:
- Low ambient drone during play.
- Soft System notification tones.
- Metal attack impacts.
- Block and parry sounds.
- Corruption pulses.
- Victory and death motifs.

## Win And Loss
The player wins a run by defeating the Alpha Cursed Boar boss. The player loses when Erik's health reaches zero. Both outcomes return to the Archive with some persistent progress.
