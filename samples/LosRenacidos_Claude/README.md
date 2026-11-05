# Los Renacidos: Ecos de Talasaria — Vertical Slice

Top-down action roguelike (LitRPG) basado en el GDD canónico **Los Renacidos: Ecos de Talasaria**. Esta carpeta contiene la **rebanada vertical** que define la sección 22 del GDD (MVP propuesto), generada en una sola pasada por el comando `/full-game` del scaffold [Everything Game Dev Code](https://github.com/MRCalderon3D/everything-game-dev-code).

## Cómo ejecutar

```bash
cd samples/LosRenacidos_Claude
npx serve .
```

Y abre la URL que muestre el terminal (típicamente `http://localhost:3000`). Cualquier servidor estático funciona (`python -m http.server`, `npx http-server`, etc.).

## Controles

| Acción | Teclado |
|---|---|
| Mover | WASD / Flechas |
| Atacar | J o Espacio |
| Esquiva (i-frames) | Shift |
| Bloquear / Parada perfecta | L (mantener) |
| Meditar (fuera de combate) | M |
| Interactuar / Avanzar | E o ENTER |
| Archivo de Ecos | I |
| Menú / Salir | ESC |
| Elegir opción de diálogo / ruta | 1 - 4 |

## Bucle de juego

1. **Menú** → ENTER inicia partida.
2. **Minoc (hub):** habla con Alcalde Thorpe (misión Recolector de Hierbas), Herrero Garrett (Filo Afilado +2 daño), Herborista Elara (pociones), Posadero Aldous (descanso = restaura PV/Res), Brand (acceso al Archivo). Sal hacia el norte (puerta dorada) para iniciar una incursión.
3. **Incursión:** un mapa procedural de 4–6 nodos con salas de combate, evento, élite, descanso y, al final, el cubil del Alfa.
4. **Combate:** las salas se despejan eliminando todos los enemigos. Cada acción (golpear, parar, esquivar, meditar) sube tus skills correspondientes en la corrida.
5. **Jefe — Jabalí Maldito Alfa:** dos fases (embiste · enraged que invoca conejos malditos). Derrotarlo registra el Eco en el Archivo y otorga bonus permanentes.
6. **Muerte:** se pierde el progreso de la corrida; el Archivo de Ecos y el cobre vuelven a Minoc.

## Qué entrega esta rebanada

- **Erik** jugable (warrior route), top-down 2D action.
- **Hub Minoc** con 5 NPCs y diálogos diegéticos.
- **Cinco plantillas de sala:** Claro del Bosque, Emboscada en el Camino, Campamento Goblin, Sendero de los Jabalíes, Cubil del Alfa.
- **Cuatro enemigos** + **un boss** con IA distinta (hopper, melee, charger, embestida + invocación).
- **Skills por uso** (Esgrima, Parada, Táctica, Supervivencia, Anatomía, Curación, Meditación, Negociación) con notificaciones del Sistema cuando suben.
- **Misión Recolector de Hierbas** completable.
- **Procedural map** de la incursión con nodos y bifurcaciones.
- **Archivo de Ecos** persistente en `localStorage` con desbloqueos permanentes (Filo Afilado, +Esgrima inicial, +Parada inicial, +PV máx).
- **Audio procedural** completo (Web Audio API).
- **HUD diegético** estilo Sistema con notificaciones flotantes.

## Estructura del proyecto

```
LosRenacidos_Claude/
├── GDD.md                       Game Design (slice MVP)
├── TDD.md                       Technical Design
├── README.md
├── package.json
├── .gitignore
├── index.html
└── src/
    ├── main.js                  bootstrap + frame loop
    ├── constants.js             tuning + paleta + curva XP
    ├── data/
    │   ├── enemies.js           tabla de enemigos + Alfa
    │   ├── npcs.js              tabla de NPCs + diálogos
    │   └── rooms.js             plantillas de sala + tipos de nodo
    ├── entities/
    │   ├── player.js            Erik
    │   ├── enemy.js             IA común para todos los enemigos
    │   └── npc.js               NPC contenedor
    ├── systems/
    │   ├── renderer.js          Canvas 2D top-down
    │   ├── input.js             keyboard + touch unlock
    │   ├── audio.js             Web Audio procedural
    │   ├── storage.js           localStorage wrapper
    │   ├── notifications.js     Sistema log
    │   └── particles.js         sparks + dust
    ├── world/
    │   ├── room.js              sala instanciada con colisiones
    │   └── map-gen.js           grafo procedural de la incursión
    └── states/
        ├── state-machine.js
        ├── menu-state.js
        ├── hub-state.js
        ├── dialog-state.js
        ├── run-state.js
        ├── combat-state.js
        ├── victory-state.js
        ├── gameover-state.js
        └── archive-state.js
```

## Qué se ve / oye

- **Visuales:** todo dibujado en Canvas 2D — sin imágenes externas. Tiles de suelo de ajedrez, muros con doble tono, sprites circulares con ojos y aura para el jefe, indicadores de wind-up para los enemigos.
- **Audio:** todo sintetizado en tiempo real con la Web Audio API — golpes, paradas, parry, mejoras de skill, rugido del boss y muerte del jefe.

## Generado por

```
/full-game crea un juego usando el comando /full-game en la carpeta samples/LosRenacidos_Claude siguiendo ese GDD
```

El pipeline produjo GDD slice, TDD, estructura de proyecto, lógica de combate, IA enemiga, sistema procedural de incursión, audio procedural, persistencia y este README en una sola pasada.

## Próximos pasos (out of slice)

Para ir hacia el GDD completo sería necesario:

1. Añadir a **Cris** (ruta maga) con los cinco círculos de magia.
2. Implementar Valdrenot, la Torre de los Magos, y los actos II–V.
3. Lotus y Mae como duelos narrativos.
4. Sistema de durabilidad, ascensos de rango y reliquias vinculadas.
5. Cinco finales y modo Nueva Partida+.

Esta rebanada demuestra el bucle nuclear definido por el GDD: el Sistema, las skills por uso, la muerte como Eco fallido y la metaprogresión a través del Archivo.
