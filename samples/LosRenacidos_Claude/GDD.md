# Los Renacidos: Ecos de Talasaria — GDD (slice MVP)

The canonical, full-scope GDD for the franchise is preserved here verbatim from the original brief. This implemented sample is the **MVP vertical slice** defined in section 22 of that document — a top-down action roguelike playable in the browser.

> Full canon, world, characters, magic system, antagonists, and roadmap follow the document below. The web sample implements only Erik's first run loop and the Minoc hub, as defined under "MVP propuesto".

## Implemented slice — at a glance

- **Character:** Erik (warrior), top-down 2D action.
- **Hub:** Minoc — Posada, Alcalde Thorpe, Herrero Garrett, Herborista Elara, salida a la Frontera.
- **Run:** procedural map of 5 nodos → claros del bosque y emboscadas en el Camino a Valdrenot → jefe Jabalí Maldito Alfa.
- **Enemies:** Jabalí Maldito, Conejo Maldito, Goblin, Bandido.
- **Boss:** Jabalí Maldito Alfa (dos fases — embestidas y enraged).
- **Stat/skill system:** Fuerza, Destreza, Inteligencia, Fama + skills-by-use (Esgrima, Parada, Táctica, Supervivencia, Anatomía, Curación, Meditación).
- **System UI:** notificaciones flotantes estilo Sistema en dorado/azul, panel diegético de stats.
- **Quests:** "Recolector de Hierbas" (Thorpe) y "Escolta del Comerciante" (Aldric en ruta).
- **Metaprogresión:** Archivo de Ecos — cada hito completado desbloquea bonus permanentes.
- **Death loop:** muerte = run perdida; conocimiento y Ecos sobreviven.
- **Audio:** procedural Web Audio (golpes, parada, level-up del Sistema, jefe, muerte).

What is OUT of this slice (kept for future expansiones, descritos en GDD canon): Cris y el sistema mágico de los Cinco Círculos, Valdrenot completo, Torre de los Magos, Lotus, Archelas, frente norte, fisuras y corrupción avanzada.

---

# GDD canon — Los Renacidos: Ecos de Talasaria

**Versión:** 0.1
**Género:** Roguelike narrativo de acción / LitRPG
**Cámara propuesta:** Isométrica 3D o 2.5D (web sample usa top-down 2D simplificado)
**Plataformas objetivo:** PC primero; consola en fase posterior
**Tono:** Fantasía oscura de supervivencia, progresión LitRPG, misterio entre mundos, épica íntima

## 1. Visión general

*Los Renacidos: Ecos de Talasaria* es un roguelike de acción basado en los libros *Los Renacidos*, centrado en la llegada de humanos modernos a Talasaria, un reino de fantasía donde una interfaz invisible llamada el Sistema convierte la supervivencia, el entrenamiento y el combate en progresión medible. El jugador encarna a un Renacido atrapado en un mundo que parece funcionar con reglas de videojuego, pero donde el dolor, la muerte, la culpa y las consecuencias son reales. Cada partida es una incursión dentro de una fisura de realidad provocada por la corrupción entre mundos. La estructura roguelike permite reinterpretar el viaje de Erik y Cris como una sucesión de "ecos": fragmentos inestables de Talasaria que cambian en cada intento, pero conservan hitos narrativos canónicos.

## 2. Premisa, Erik, Cris, Archelas

Los protagonistas proceden del mundo moderno. Erik, treinta y cuatro años, atrapado en una vida gris de gimnasio, trabajo IT y soledad, despierta en Talasaria. Cris, directora financiera brillante pero emocionalmente vacía, aparece en un bosque montañoso tras una noche de trabajo extremo. Ambos reciben mensajes del Sistema, una capa invisible que solo los Renacidos perciben y que traduce aprendizaje, violencia, supervivencia, magia y reputación en progreso numérico.

Erik es ruta física: cuerpo entrenado, sin saber luchar de verdad. Aprende en Minoc que cada acción mejora habilidades; pasa por Minoc → Brand → Valdrenot → Gremio → ruinas → Biblioteca → Torre → Lotus → Mae → Archelas → epílogo con detección de otro Renacido.

Cris es ruta mágica: Fuerza/Destreza bajas, Inteligencia alta. Edwin la rescata y revela que Archelas tortura y elimina Renacidos. Cris aprende los cinco círculos de magia, viaja al norte para unirse a la reina Mara, encuentra a Kaldorei.

Archelas, Mago Supremo de la Torre, es un Renacido de más de trescientos años que explota corrupción y fisuras para abrir un camino de regreso a su mundo natal con poder mágico suficiente para conquistarlo. Lotus caza Renacidos porque cada uno acerca el colapso; brutal pero trágico.

## 3. Pilares de diseño

- **Sobrevive antes de entender:** sin tutoriales largos, solo situaciones.
- **Progresión por uso, no por menú:** bloquear sube Parada, cocinar sube Cocina, negociar sube Negociación.
- **Roguelike con causa narrativa:** cada run es un "Eco de Talasaria", una simulación parcial creada por la Gema/Biblioteca/Archelas.
- **Dos fantasías complementarias:** Erik (físico) y Cris (magia).
- **La historia avanza aunque mueras:** archivo, relaciones y reliquias persisten.

## 4. Fantasía del jugador

De ropa de gimnasio a armaduras y reliquias. De espada tosca a armas legendarias. De miedo a criaturas menores a duelos contra liches, draconianos, Lotus y Archelas. De no entender el Sistema a manipular sus reglas.

## 5. Estructura roguelike

Cada partida: hub narrativo → selección de ruta → mapa procedural de nodos → resolución de hito → extracción o muerte → Archivo de Ecos. Duraciones: 20–30 min (corta), 40–60 min (media), 70–90 min (acto completo). Tipos: Supervivencia, Gremio, Archivo, Corrupción, Torre, Norte.

## 6. Personajes jugables

**Erik — Guerrero Renacido:** Fuerza alta, Destreza media, Inteligencia baja. Espada, escudo, gran hacha, espadón dorado. Habilidades: ataque básico, esquiva básica, resistencia, parada, carga, torbellino, absorción de energía, resistencia mágica.

**Cris — Maga Renacida:** Fuerza baja, Destreza baja, Inteligencia alta. Staff, grimorio, anillos. Estilo: estudia, medita, combos de hechizos. Vulnerable sin mana, requiere gestionar concentración.

## 7. Sistema de estadísticas

**Stats principales:** Fuerza, Destreza, Inteligencia, Fama, Salud, Mana, Resistencia, Corrupción.

**Habilidades por uso:** Esgrima, Táctica, Anatomía, Curación, Parada, Acampar, Cocina, Herboristería, Negociación, Supervivencia, Resistencia Mágica, Magia, Meditación, Evaluar Inteligencia.

Cada habilidad sube en la run; al morir se pierde el progreso bruto pero los hitos desbloquean Maestría de Eco permanente.

## 8. Sistema de magia: los Cinco Círculos

**Primer Círculo:** Cura Menor, Purga de Veneno, Dardo Arcano, Velo Protector.
**Segundo Círculo:** Bendición Trina, Orbe Ígneo, Marca Venenosa, Paso Breve.
**Tercer Círculo:** Sanación Mayor, Llamada del Hogar, Cadenas Invisibles, Estallido Mental.
**Cuarto Círculo:** Detonación Arcana, Rayo Puro, Paso Velado, Muro de Fuego.
**Quinto Círculo:** Juicio de Fuego, Ladrón de Esencia, Vórtice Arcano, Llamada del Servidor.

Combos: Velo + Dardo, Paso Breve + Cura, Marca + Dardo, Cadenas + Sanación, Muro + Velado, Ladrón + Vórtice.

## 9. Combate

Tiempo real. Ataque ligero, pesado, esquiva, interacción, objeto rápido, habilidad primaria, secundaria, ultimate. Erik: pesado y físico (bloqueo direccional, parada perfecta, posturas, rotura de guardia). Cris: frágil y brillante (apuntar, canalizar, hechizos mantenidos, teletransporte táctico, combos, meditación segura).

## 10–11. Enemigos, biomas y jefes

Bosques (Jabalí Alfa) → Camino a Valdrenot (Capitán Bandido) → Ruinas (Esqueleto Mago Archivista) → Pueblo Fantasma (Liche) → Bosque de las Bestias (Grifo Corrupto) → Minas (Elemental de Veneno) → Templo (Valdrick) → Torre (Archelas) → Frente Norte (orcos/draconianos). Lotus como duelo narrativo de cuatro fases.

## 12. Hub y NPCs

**Minoc:** Aldous (posadero), Thorpe (alcalde), Garrett (herrero), Elara (herborista).
**Valdrenot:** Shasa (gremio), Garrick (herrero), Corvus (archivero), Mae (guerrera), Aldric (caravanas).
**Cabaña de Edwin:** Edwin (mentor mago).
**Camino al Norte:** Fionn, Kaldorei, Capitana Loren.

## 13. Sistema de misiones

Plantillas: Recolección peligrosa (hierbas de Thorpe/Elara), Escolta (caravana de Aldric), Caza de criatura corrupta, Exploración de ruinas, Purificación, Caza de Renacido (Lotus), Ascenso de la Torre.

## 14. Generación procedural

Mapa de nodos ramificado: Combate, Evento, Descanso, Comerciante, Entrenamiento, Recurso, Élite, Historia, Jefe. Eventos narrativos: Comerciante Errante, entrenamiento con Brand, Mae como aliada, Corvus descifra pergamino, fisura muestra recuerdos del mundo moderno.

## 15. Metaprogresión

**Archivo de Corvus:** pergaminos, fragmentos de Renacidos, mapas antiguos, registros de fisuras, ecos de otros mundos.
**Reliquias vinculadas:** Medallón de Lotus, Gema de Resonancia, Grimorio de Bolsillo, staff de aprendiz, espadón dorado.
**Relaciones:** Mae, Garrick, Shasa, Corvus, Edwin, Kaldorei.

## 16. Economía

Cobre / Plata / Oro. Categorías de equipo: armas (corte/impacto/perforación), escudos, armaduras (ligera/media/pesada), staffs, grimorios, anillos, bolsas, consumibles. Durabilidad importa pero no molesta.

## 17. Corrupción

Mecánica y tema. Aumenta por tiempo, cofres sellados, magia prohibida, golpes de enemigos corruptos, pactos. Más enemigos élite, mutaciones, recompensas mejores, eventos oscuros, diálogos de Archelas. La corrupción personal abre poderes peligrosos pero contamina Fama y desbloquea finales oscuros.

## 18. Actos narrativos

- **Acto 0 — Despertar.**
- **Acto I — Aprender a sobrevivir** (Minoc → Valdrenot).
- **Acto II — Ganarse un nombre** (Gremio, equipo, misiones de rango).
- **Acto III — La verdad de los Renacidos** (Corvus, Torre, Lotus, medallón).
- **Acto IV — El precio de la verdad** (Lotus, Mae, Archelas).
- **Acto V — Ecos futuros** (otro Renacido, ruta de Cris, guerra de Mara).

## 19. Finales

1. Victoria táctica canónica (Archelas huye).
2. Pacto con Archelas (final oscuro).
3. Camino de Lotus (cazador de Renacidos).
4. Archivo Completo (alternativa al colapso sin matar Renacidos).

## 20. Dirección artística

Fantasía medieval realista con UI LitRPG elegante. Bosques húmedos primitivos, Valdrenot como capital de piedra, magia como luz física, corrupción como vetas verdosas. UI: dorado/azul, notificaciones breves, sonidos de escritura mágica, modo lectura.

## 21. Audio

Cuerdas bajas en frontera, laúd en Minoc, ciudad viva en Valdrenot, coros en ruinas, cristal en Torre, percusión marcial en Lotus, tema frío en Archelas. Sonido del Sistema con identidad propia, magia arcana como chispa azul, corrupción como zumbido orgánico.

## 22. MVP propuesto (implementado en este sample)

Vertical slice de 45–60 minutos. Erik. Frontera + Minoc + Camino a Valdrenot. Enemigos: jabalí maldito, conejos malditos, goblins, bandidos. NPCs: Comerciante Errante, Thorpe, Brand, Garrick básico. Habilidades por uso. Mapa procedural simple. Un jefe: Jabalí Maldito Alfa o Capitán Bandido. Misiones: Recolector de Hierbas + Escolta. Notificaciones del Sistema. Metaprogresión básica: Archivo de Ecos I.

## 23. Expansiones previstas

1. La Maga de Edwin (Cris + dos primeros círculos).
2. Archivos de Corvus (ruinas, Biblioteca, Liche).
3. La Caza de Lotus (medallón, espada dorada, decisiones morales).
4. El Frente Norte (Mara, Kaldorei, guerra abierta).
5. La Torre de los Magos (Archelas, finales, NG+).

## 24. Riesgos

1. Procedural rompe historia → hitos fijos en mapas variables.
2. Demasiadas habilidades abruman → desbloqueo escalonado.
3. Erik y Cris parecen juegos distintos → núcleo de Sistema compartido.
4. Muerte roguelike choca con drama → la muerte es un Eco fallido.
5. Archelas se revela pronto → al inicio parece fuente de respuestas.

## 25. Reglas de fidelidad al libro

1. Talasaria es real, no simulación falsa.
2. NPCs no ven la interfaz.
3. Progresión viene de acciones concretas.
4. Renacidos como misterio central.
5. Archelas mantiene doble cara.
6. Lotus es trágico y comprensible.
7. Mae no es recompensa romántica.
8. Cris es brillante y estratégica.
9. Edwin es mentor cálido, culpable y perseguido.
10. Corrupción ligada a fisuras y colapso entre mundos.

## 26. Experiencia objetivo

Al terminar una buena run el jugador debería pensar: "he sobrevivido por poco", "mi personaje aprendió porque yo jugué mejor", "quiero otro intento para descubrir otra pieza del misterio", "Archelas me está usando pero necesito respuestas", "no sé si Lotus está equivocado del todo".
