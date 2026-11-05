# TDD - Los Renacidos: Ecos de Talasaria

**Versión:** 0.1
**Plataforma objetivo:** Web (HTML5)
**Framework:** Vanilla Canvas (custom engine)
**Lenguaje:** JavaScript (ES6+)

---

## 1. Arquitectura General

### Patrón: Game Loop + Scene Manager + ECS-like Entity System

El juego usa un game loop central (`requestAnimationFrame`) que delega en un Scene Manager. Las escenas (MainMenu, Hub, Map, Combat, Event, GameOver, Settings, Pause) controlan qué se renderiza y procesa en cada frame.

Las entidades (Player, Enemy, NPC, Projectile) se manejan como objetos planos con posición, sprite, stats y comportamiento.

```
[Game Loop] -> [Scene Manager] -> [Active Scene]
                                      |
                    [Entities] [Systems] [UI] [Audio] [Input]
```

### Data Flow

```
Input -> PlayerController -> Entity State -> Renderer
Stats/Combat Events -> NotificationSystem -> HUD
Combat Events -> AudioManager -> SFX
Scene Changes -> AudioManager -> Music
Progression Events -> SaveManager -> localStorage
```

---

## 2. System Breakdown

### 2.1 Scene Manager
- Mantiene una pila o referencia a la escena activa
- Escenas: MAIN_MENU, HUB, MAP, COMBAT, EVENT, GAME_OVER, SETTINGS, PAUSE
- Cada escena tiene: init(), update(dt), render(ctx), destroy()

### 2.2 Input System
- Teclado: WASD/Arrows para movimiento, Space para ataque, E para interactuar, Q para habilidad, Esc para pausa
- Mouse: Click para ataque dirigido, mover para apuntar
- Abstracción: Input.isKeyDown(key), Input.getMousePos(), Input.isMouseDown()

### 2.3 Player Controller
- Movimiento WASD con velocidad base
- Ataque ligero (click/space) y ataque pesado (space mantenido)
- Esquiva (Shift + dirección)
- Bloqueo (Ctrl mantenido)
- Interacción (E cerca de NPC/objeto)

### 2.4 Combat System
- Tiempo real, hitbox-based
- Tipos de daño: corte, impacto, perforación, veneno, corrupción
- Fórmula de daño: baseDamage * strengthMultiplier - enemyDefense
- Parada perfecta: bloquear en el frame exacto del ataque enemigo -> stun al enemigo
- Esquiva: iframes durante animación de dash

### 2.5 Stats & Skills System
- Stats base: fuerza, destreza, inteligencia, fama
- Recursos: salud, resistencia, mana, corrupción
- Skills que suben por uso: esgrima, táctica, anatomía, curación, parada, supervivencia, negociación, herboristería
- Cada uso de skill relevante incrementa XP; al llegar a umbral, sube de nivel
- Al morir: se pierde progreso de run, se guarda "maestría de eco" (hitos)

### 2.6 Inventory System
- Slots: arma, escudo, armadura, anillo, consumibles (x4)
- Durabilidad: las armas/escudos pierden durabilidad al usar
- Consumibles: vendas (cura 20%), hierbas (cura estados)
- Moneda: cobre, plata, oro

### 2.7 Procedural Generation
- Mapa de nodos: grid de ~4 columnas x 3 filas con caminos ramificados
- Tipos de nodo: combate, evento, descanso, comerciante, élite, jefe
- Salas de combate: arenas rectangulares con obstáculos aleatorios
- Enemigos generados según bioma actual

### 2.8 Corruption System
- Medidor 0-100 que sube con ciertas acciones
- Efectos: más enemigos élite, mutaciones visuales, eventos más oscuros
- Corrupción personal: desbloquea ventajas temporales con penalizaciones

### 2.9 Progression System (Meta)
- Archivo de Ecos: desbloqueos permanentes entre runs
- Reliquias vinculadas: objetos que sobreviven a la muerte
- Maestría de Eco: bonos iniciales por hitos completados

### 2.10 Audio System
- Web Audio API
- Música procedural por escena (osciladores con diferentes timbres)
- SFX procedurales: ataque, daño, bloqueo, parada, muerte, notificación, item

### 2.11 Save System
- localStorage para metaprogresión y settings
- Datos guardados: ecoArchive, relics, relationships, settings, highScores

---

## 3. Input Handling Strategy

```
Keyboard Events -> Input State Map -> Scene reads Input state each frame
Mouse Events -> Mouse Position + Click State -> Scene reads each frame
```

Keys:
- WASD / Arrows: movimiento
- Space: ataque ligero
- Shift: esquiva
- Ctrl: bloqueo
- E: interactuar
- Q: habilidad especial
- I: inventario
- M: mapa
- Esc: pausa

---

## 4. Scene/Screen Management

### Scene Flow
```
MainMenu -> Hub (Minoc)
Hub -> Map (node selection) -> Combat / Event / Rest / Merchant / Boss
Combat/Event -> Map -> Hub (after extraction or death)
Death -> GameOver -> Hub or MainMenu
```

### UI Screens
- MainMenu: título, "Nueva Partida", "Continuar", "Configuración", "Archivo de Ecos"
- HUD: barra de salud, barra de resistencia, habilidades activas, notificaciones, minimapa
- Pause: overlay con "Reanudar", "Configuración", "Salir al menú"
- GameOver: estadísticas de la run, eco ganado, "Volver al Hub" / "Nueva Partida"
- Settings: volumen música, volumen SFX, controles

---

## 5. Save Data Structure

```json
{
  "metaProgression": {
    "ecoArchive": { "esgrima": 1, "parada": 0, "supervivencia": 0 },
    "relics": ["medallón_lotus"],
    "relationships": { "mae": 0, "garrick": 0, "corvus": 0 },
    "unlockedRoutes": ["frontera", "minoc"],
    "runsCompleted": 0,
    "bossesDefeated": []
  },
  "settings": {
    "musicVolume": 0.7,
    "sfxVolume": 0.8
  }
}
```

---

## 6. Platform-Specific Notes

### Web (Vanilla Canvas)
- Framework: Ninguno. JavaScript vanilla con Canvas 2D API para máximo control y mínimo overhead.
- Build: Sin build step. `index.html` carga `src/main.js` directamente como módulo ES6.
- Deploy: Servir estáticos. Cualquier servidor HTTP funciona.
- Audio: Web Audio API con AudioContext. Sonidos generados proceduralmente con osciladores.
- Save: localStorage.
- Rendering: Canvas 2D con culling básico (solo se renderiza lo visible en viewport).

### Decisiones técnicas
- Sin dependencias externas para máxima portabilidad y cero configuración.
- Toda la lógica en JavaScript vanilla ES6 modules.
- Viewport: 960x540 (16:9), escalado a pantalla completa.
- Target: 60 FPS. Si baja, priorizar gameplay sobre gráficos.

---

## 7. MVP Scope - Technical Implementation Map

| Sistema | Archivo(s) | Complejidad |
|---------|------------|-------------|
| Game Loop + Scene Manager | main.js, SceneManager.js | Baja |
| Input System | Input.js | Baja |
| Player (Erik) | entities/Player.js | Media |
| Enemies (4 tipos) | entities/Enemy.js, entities/enemies/*.js | Media |
| Combat System | systems/CombatSystem.js | Media |
| Stats/Skills | systems/StatsSystem.js | Media |
| Inventory | systems/InventorySystem.js | Media |
| Procedural Map | systems/ProceduralGen.js | Media |
| Hub (Minoc) | scenes/HubScene.js | Baja |
| Combat Scene | scenes/CombatScene.js | Media |
| Event/Dialogue | scenes/EventScene.js, systems/DialogueSystem.js | Baja |
| HUD | ui/HUD.js | Baja |
| Notifications | ui/Notifications.js | Baja |
| Audio Manager | audio/AudioManager.js | Baja |
| Save System | utils/SaveManager.js | Baja |
| Main Menu | scenes/MainMenuScene.js | Baja |
| Game Over | scenes/GameOverScene.js | Baja |
| Settings | scenes/SettingsScene.js | Baja |
| Pause | scenes/PauseScene.js | Baja |
| NPC System | entities/NPC.js | Baja |
| Mission System | systems/MissionSystem.js | Baja |
| Corruption | systems/CorruptionSystem.js | Baja |
| Progression | systems/ProgressionSystem.js | Baja |
