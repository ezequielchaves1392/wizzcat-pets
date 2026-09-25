// js/systems/leaderboard-controller.js
import { collection, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export class LeaderboardController {
  constructor(currentUserId) {
    this.currentUserId = currentUserId;
    if (db) {
      this.petsRef = collection(db, "pets");
      this.initListener();
    } else {
      console.error("Leaderboard error: Base de datos Firestore no disponible.");
    }
  }

  initListener() {
    const q = query(this.petsRef, orderBy("level", "desc"), orderBy("exp", "desc"), limit(10));

    onSnapshot(q, (snapshot) => {
      const container = document.getElementById("leaderboard-container");
      if (!container) return;

      container.innerHTML = "";

      if (snapshot.empty) {
        container.innerHTML = `<div class="text-center text-slate-500 py-4">Sin registros en la red global.</div>`;
        return;
      }

      let rank = 1;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const isMe = data.user === this.currentUserId;

        const row = document.createElement("div");
        row.className = `flex justify-between items-center p-2 rounded-xl border ${isMe ? 'bg-cyan-950/60 border-cyan-700 text-cyan-200' : 'bg-slate-950/40 border-slate-800 text-slate-300'}`;
        
        row.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="font-bold text-[10px] text-cyan-400">#${rank}</span>
            <span class="truncate max-w-[110px]">${data.user || 'Desconocido'}</span>
          </div>
          <div class="flex items-center gap-2 text-[10px]">
            <span class="bg-cyan-900/50 px-2 py-0.5 rounded text-cyan-300 border border-cyan-800">Nv. ${data.level || 1}</span>
          </div>
        `;
        container.appendChild(row);
        rank++;
      });
    }, (error) => {
      console.error("Error al sincronizar el Leaderboard con Firestore:", error);
    });
  }
}