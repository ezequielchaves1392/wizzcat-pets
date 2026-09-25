// js/systems/pet-controller.js
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export class PetController {
  constructor(userId) {
    this.userId = userId;
    this.petDocRef = doc(db, "pets", this.userId);
    
    this.state = {
      hunger: 100,
      energy: 100,
      fun: 100,
      level: 1,
      exp: 0,
      lastUpdate: Date.now()
    };

    this.initPetData();
    this.initActions();
    this.startLifecycleLoop();
  }

  async initPetData() {
    try {
      const snap = await getDoc(this.petDocRef);
      if (snap.exists()) {
        const data = snap.data();
        this.state = { ...this.state, ...data };
      } else {
        await this.syncToCloud();
      }
      this.updateUI();
    } catch (e) {
      console.error("Error al sincronizar mascota con Firestore:", e);
    }
  }

  initActions() {
    document.getElementById("btn-feed").addEventListener("click", () => this.interact("hunger", 25, "¡Unidad alimentada con éxito!"));
    document.getElementById("btn-sleep").addEventListener("click", () => this.interact("energy", 35, "¡Recarga energética completada!"));
    document.getElementById("btn-play").addEventListener("click", () => this.interact("fun", 20, "¡Simulación de entretenimiento ejecutada!"));
    document.getElementById("btn-train").addEventListener("click", () => this.trainPet());
  }

  interact(stat, amount, message) {
    this.state[stat] = Math.min(100, this.state[stat] + amount);
    this.addExp(5);
    this.setStatus(message);
    this.updateUI();
    this.syncToCloud();
  }

  trainPet() {
    if (this.state.energy < 15) {
      this.setStatus("⚠️ Error: Energía insuficiente para entrenar.");
      return;
    }
    this.state.energy -= 15;
    this.state.hunger = Math.max(0, this.state.hunger - 10);
    this.addExp(25);
    this.setStatus("🔥 ¡Entrenamiento Nexus completado con éxito!");
    this.updateUI();
    this.syncToCloud();
  }

  addExp(amount) {
    this.state.exp += amount;
    const requiredExp = this.state.level * 50;
    if (this.state.exp >= requiredExp) {
      this.state.exp -= requiredExp;
      this.state.level++;
      this.setStatus(`🌟 ¡SISTEMA EVOLUCIONADO A NIVEL ${this.state.level}!`);
    }
  }

  startLifecycleLoop() {
    setInterval(() => {
      // Degradar estadísticas cada 15 segundos
      this.state.hunger = Math.max(0, this.state.hunger - 2);
      this.state.energy = Math.max(0, this.state.energy - 1);
      this.state.fun = Math.max(0, this.state.fun - 2);
      this.updateUI();
      this.syncToCloud();
    }, 15000);
  }

  async syncToCloud() {
    try {
      await setDoc(this.petDocRef, {
        user: this.userId,
        level: this.state.level,
        exp: this.state.exp,
        hunger: this.state.hunger,
        energy: this.state.energy,
        fun: this.state.fun,
        lastUpdate: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error("Error al actualizar estado en Cloud:", e);
    }
  }

  setStatus(text) {
    const el = document.getElementById("pet-status-text");
    if (el) el.textContent = text;
  }

  updateUI() {
    document.getElementById("hunger-val").textContent = `${this.state.hunger}%`;
    document.getElementById("hunger-bar").style.width = `${this.state.hunger}%`;

    document.getElementById("energy-val").textContent = `${this.state.energy}%`;
    document.getElementById("energy-bar").style.width = `${this.state.energy}%`;

    document.getElementById("fun-val").textContent = `${this.state.fun}%`;
    document.getElementById("fun-bar").style.width = `${this.state.fun}%`;

    document.getElementById("pet-level").textContent = `NV. ${this.state.level}`;

    // Evolución visual de sprites según el Nivel
    const avatar = document.getElementById("pet-avatar");
    if (this.state.level >= 5) {
      avatar.textContent = "🐉";
    } else if (this.state.level >= 3) {
      avatar.textContent = "🦊";
    } else if (this.state.level >= 2) {
      avatar.textContent = "🤖";
    } else {
      avatar.textContent = "🥚";
    }
  }
}