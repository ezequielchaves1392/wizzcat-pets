// public/js/systems/training.js
import { doc, runTransaction, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export class TrainingSystem {
  constructor(userId) {
    this.userId = userId;
    this.petRef = doc(db, "pets", userId);
  }

  /**
   * Ejecuta una sesión de entrenamiento basada en reflejos (Minijuego Web).
   * @param {string} statType - 'strength' | 'agility' | 'intelligence'
   * @param {number} performanceScore - Puntuación de 0 a 100 obtenida en el minijuego.
   */
  async completeTrainingSession(statType, performanceScore) {
    try {
      await runTransaction(db, async (transaction) => {
        const petDoc = await transaction.get(this.petRef);
        if (!petDoc.exists()) throw new Error("Mascota no encontrada.");

        const data = petDoc.data();
        
        // Comprobación de Rebeldía: Si la rebeldía supera el 80%, la mascota se niega a entrenar
        if (data.stats.rebellion >= 80) {
          throw new Error("⚠️ REBELDICIÓN CRÍTICA: Tu Cyber-Pet se niega a obedecer. ¡Dale mantenimiento o reduce su estrés!");
        }

        // Comprobación de Energía / Batería
        const energyCost = 15;
        if (data.stats.battery < energyCost) {
          throw new Error("⚠️ Batería agotada. Conéctala a la red de carga antes de entrenar.");
        }

        // Cálculo de EXP y Atributo ganado basado en rendimiento y bonificador de Legado
        const legacyMultiplier = data.legacy?.bonusMultiplier || 1.0;
        const rawGain = Math.round((performanceScore * 0.5) * legacyMultiplier);
        
        const currentStatValue = data.attributes[statType] || 10;
        const newStatValue = currentStatValue + rawGain;
        
        // Ganancia de Moneda Dual: Core-Coins (frecuente) y Nexus-Shards (premium/raro)
        const coreCoinsEarned = Math.round(performanceScore * 1.2);
        const nexusShardsEarned = performanceScore > 90 ? 1 : 0;

        // Actualización atómica en Firestore
        transaction.update(this.petRef, {
          [`attributes.${statType}`]: newStatValue,
          "stats.battery": Math.max(0, data.stats.battery - energyCost),
          "stats.rebellion": Math.min(100, data.stats.rebellion + 5), // El entrenamiento eleva levemente la rebeldía
          "currencies.coreCoins": increment(coreCoinsEarned),
          "currencies.nexusShards": increment(nexusShardsEarned),
          exp: increment(rawGain * 2),
          lastUpdate: new Date()
        });

        console.log(`Entrenamiento exitoso: +${rawGain} en ${statType}. Monedas ganadas: ${coreCoinsEarned} Core-Coins.`);
      });
    } catch (error) {
      console.error("Error en sesión de entrenamiento:", error.message);
      alert(error.message);
    }
  }
}