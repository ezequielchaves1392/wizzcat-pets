// public/js/game-engine.js
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase-init.js";

export class GameEngine {
  constructor(userId) {
    this.userId = userId;
    this.petRef = doc(db, "pets", userId);
  }

  async syncOfflineProgress() {
    const petSnap = await getDoc(this.petRef);
    if (!petSnap.exists()) return;

    const data = petSnap.data();
    const now = Date.now();
    const elapsedMinutes = Math.floor((now - data.lastUpdate.toMillis()) / 60000);

    if (elapsedMinutes <= 0) return;

    // Desgaste de stats por tiempo inactivo (ej. -0.5 por minuto)
    let newBattery = Math.max(0, data.stats.battery - (elapsedMinutes * 0.5));
    let newHealth = data.stats.health;
    let newRebellion = data.stats.rebellion + (elapsedMinutes * 0.2);

    // Lógica de enfermedad o muerte por descuidos
    if (newBattery === 0) {
      newHealth = Math.max(0, newHealth - (elapsedMinutes * 0.8));
    }

    if (newHealth <= 0) {
      await this.triggerDeathAndLegacy(data);
      return;
    }

    await updateDoc(this.petRef, {
      "stats.battery": newBattery,
      "stats.health": newHealth,
      "stats.rebellion": Math.min(100, newRebellion),
      lastUpdate: new Date()
    });
  }

  async triggerDeathAndLegacy(currentData) {
    // Generar Huevo de Datos con bonificaciones pasivas para la siguiente generación
    const legacyBonus = {
      generation: (currentData.generation || 1) + 1,
      bonusMultiplier: 1.15, // +15% de ganancia de EXP permanente
      createdAt: new Date()
    };
    
    await updateDoc(this.petRef, {
      status: "DECEASED",
      legacy: legacyBonus,
      "stats.health": 0
    });
    alert("Tu Cyber-Pet se ha corrompido (Muerto). Ha dejado un 'Huevo de Datos' con bonificación.");
  }
}