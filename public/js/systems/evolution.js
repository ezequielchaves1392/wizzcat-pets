// public/js/systems/evolution.js

export class EvolutionEngine {
  /**
   * Determina la fase y el sprite estético basado en los atributos y ADN.
   * @param {Object} attributes - { strength, agility, intelligence }
   * @param {number} level - Nivel actual de la mascota
   */
  static evaluateEvolutionStage(attributes, level) {
    let stage = "MK-I (Inipi)";
    let spriteAsset = "cybergotchi_mk1_base.png";
    let cssGlowColor = "cyan";

    // Determinar rama de especialización basada en el atributo dominante
    const dominantStat = Object.keys(attributes).reduce((a, b) => 
      attributes[a] > attributes[b] ? a : b
    );

    if (level >= 10 && level < 30) {
      stage = "MK-II (Vector)";
      if (dominantStat === 'strength') {
        spriteAsset = "cybergotchi_mk2_heavy.png";
        cssGlowColor = "red";
      } else if (dominantStat === 'agility') {
        spriteAsset = "cybergotchi_mk2_speed.png";
        cssGlowColor = "emerald";
      } else {
        spriteAsset = "cybergotchi_mk2_neural.png";
        cssGlowColor = "purple";
      }
    } else if (level >= 30) {
      stage = "MK-III (Nexus-Prime)";
      spriteAsset = `cybergotchi_mk3_${dominantStat}_apex.png`;
      cssGlowColor = "amber"; // Tonalidad legendaria
    }

    return { stage, spriteAsset, cssGlowColor, dominantStat };
  }
}