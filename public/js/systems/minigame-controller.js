// public/js/systems/minigame-controller.js
import { TrainingSystem } from "./training.js";

export class HackerGridMinigame {
  constructor(userId) {
    this.trainingSystem = new TrainingSystem(userId);
    this.score = 0;
    this.activeTimer = null;
  }

  start() {
    this.score = 0;
    const modal = document.getElementById("minijuego-modal");
    modal.classList.remove("hidden");
    this.spawnNode();
  }

  spawnNode() {
    const grid = document.getElementById("grid-container");
    grid.innerHTML = "";

    if (this.score >= 10) {
      this.endGame();
      return;
    }

    const node = document.createElement("button");
    node.className = "w-full h-full bg-cyan-950/60 border border-cyan-400 rounded animate-ping flex items-center justify-center text-xs font-bold text-cyan-200 cursor-pointer";
    node.textContent = "DATA";
    
    node.onclick = () => {
      this.score += 2;
      document.getElementById("score-counter").textContent = this.score;
      clearTimeout(this.activeTimer);
      this.spawnNode();
    };

    // Posición aleatoria simple en la grilla
    const randomIndex = Math.floor(Math.random() * 9);
    // Para simplificar, añadimos el nodo directamente
    grid.appendChild(node);

    // Tiempo límite por nodo (1.2 segundos para hacer clic)
    this.activeTimer = setTimeout(() => {
      this.spawnNode();
    }, 1200);
  }

  async endGame() {
    clearTimeout(this.activeTimer);
    document.getElementById("minijuego-modal").classList.add("hidden");
    
    // Convertir puntuación a porcentaje (max 10 pts = 100%)
    const performancePercentage = Math.min(100, this.score * 10);
    await this.trainingSystem.completeTrainingSession("agility", performancePercentage);
    alert(`¡Secuencia completada! Rendimiento: ${performancePercentage}%`);
  }
}