class DialogueSystem {
  static getDialogue(npcId, state = 'default') {
    const dialogues = {
      comerciante_errante: {
        default: [
          { text: 'Bienvenido, viajero. Tengo mercancías que podrían salvarte la vida.', speaker: 'Comerciante Errante' },
          { text: 'Mira lo que tengo. No acepto créditos, solo monedas contantes.', speaker: 'Comerciante Errante', action: 'shop' },
        ],
        repeat: [
          { text: 'Sigues vivo. Eso es buena señal. ¿Necesitas algo más?', speaker: 'Comerciante Errante', action: 'shop' },
        ],
      },
      thorpe: {
        default: [
          { text: '¡Un forastero! No solemos ver caras nuevas por Minoc. Soy Thorpe, el alcalde.', speaker: 'Thorpe' },
          { text: 'Necesito que alguien recolecte hierbas Moonstalk en el bosque. La corrupción está enfermando a nuestra gente. ¿Te encargas?', speaker: 'Thorpe', action: 'quest_recoleccion_hierbas' },
        ],
        quest_accepted: [
          { text: 'Gracias. Las Moonstalk crecen cerca de los claros del bosque. Ten cuidado con los jabalíes.', speaker: 'Thorpe' },
        ],
        quest_complete: [
          { text: '¡Lo has conseguido! Con estas hierbas podemos preparar los antídotos. Toma tu recompensa.', speaker: 'Thorpe', action: 'complete_quest' },
        ],
      },
      brand: {
        default: [
          { text: 'Veo que tienes músculo, pero te falta técnica. Soy Brand. Puedo enseñarte a manejar esa espada.', speaker: 'Brand' },
          { text: '¿Quieres entrenar? Te enseñaré algunos fundamentos de esgrima.', speaker: 'Brand', action: 'train_esgrima' },
        ],
        trained: [
          { text: 'Buen trabajo. Sigue practicando cada vez que luches. La esgrima se aprende con la espada en la mano.', speaker: 'Brand' },
        ],
      },
      garrick: {
        default: [
          { text: 'Bienvenido a mi forja. Si necesitas reparar equipo o mejorar tus armas, has venido al sitio correcto.', speaker: 'Garrick' },
          { text: 'El acero de Minoc no es el mejor, pero aguanta lo que le echen.', speaker: 'Garrick', action: 'blacksmith' },
        ],
      },
      aldous: {
        default: [
          { text: '¡Pasa, pasa! En la Posada del Ciervo encontrarás cama caliente y comida decente.', speaker: 'Aldous' },
          { text: 'Por 5 cobres puedes descansar. También necesito a alguien que escolte una caravana a Valdrenot.', speaker: 'Aldous', action: 'quest_escolta' },
        ],
      },
      elara: {
        default: [
          { text: 'Soy Elara, la herborista del pueblo. Si encuentras hierbas raras, tráemelas y te prepararé algo útil.', speaker: 'Elara' },
        ],
      },
    };

    const npcDialogues = dialogues[npcId];
    if (!npcDialogues) return [{ text: '...', speaker: npcId }];
    return npcDialogues[state] || npcDialogues.default;
  }
}

export default DialogueSystem;
