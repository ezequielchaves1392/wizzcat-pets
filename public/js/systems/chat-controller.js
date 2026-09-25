// js/systems/chat-controller.js
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export class ChatController {
  constructor(currentUserName = "CyberUser_" + Math.floor(Math.random() * 1000)) {
    this.currentUserName = currentUserName;
    this.unreadCount = 0;
    this.isDrawerOpen = false;
    this.initUIEvents();
    
    if (db) {
      this.chatRef = collection(db, "global_chat");
      this.initFirestoreListener();
    } else {
      this.renderConnectionError("Error crítico: Base de datos no inicializada. Revisa firebase-init.js");
    }
  }

  initUIEvents() {
    const drawer = document.getElementById("chat-drawer");
    const toggleBtn = document.getElementById("toggle-chat-btn");
    const closeBtn = document.getElementById("close-chat-btn");
    const sendBtn = document.getElementById("send-chat-btn");
    const input = document.getElementById("chat-input");

    toggleBtn.addEventListener("click", () => {
      this.isDrawerOpen = !this.isDrawerOpen;
      drawer.classList.toggle("translate-x-full", !this.isDrawerOpen);
      if (this.isDrawerOpen) {
        this.unreadCount = 0;
        this.updateBadgeUI();
      }
    });

    closeBtn.addEventListener("click", () => {
      this.isDrawerOpen = false;
      drawer.classList.add("translate-x-full");
    });

    sendBtn.addEventListener("click", () => this.handleSendMessage());
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSendMessage();
    });
  }

  async handleSendMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text || !db) return;

    try {
      input.value = "";
      await addDoc(this.chatRef, {
        user: this.currentUserName,
        text: text,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error de transmisión. Verifica las reglas de seguridad de Firestore.");
    }
  }

  initFirestoreListener() {
    const q = query(this.chatRef, orderBy("timestamp", "asc"), limit(50));

    onSnapshot(q, (snapshot) => {
      const container = document.getElementById("chat-messages-container");
      container.innerHTML = "";

      if (snapshot.empty) {
        container.innerHTML = `<div class="text-center text-slate-500 py-4">Canal global vacío. ¡Sé el primero en transmitir!</div>`;
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        const isMe = data.user === this.currentUserName;

        const messageBubble = document.createElement("div");
        messageBubble.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`;
        
        messageBubble.innerHTML = `
          <span class="text-[10px] text-slate-500">${data.user}</span>
          <div class="p-2.5 rounded-xl max-w-[85%] text-xs ${isMe ? 'bg-cyan-950/80 border border-cyan-800 text-cyan-200' : 'bg-slate-800/80 border border-slate-700 text-slate-200'}">
            ${this.escapeHTML(data.text || '')}
          </div>
        `;
        container.appendChild(messageBubble);
      });

      container.scrollTop = container.scrollHeight;

      if (!this.isDrawerOpen && snapshot.docChanges().some(change => change.type === "added")) {
        this.unreadCount++;
        this.updateBadgeUI();
      }
    }, (error) => {
      console.error("Error en el stream de Firestore:", error);
      this.renderConnectionError("Acceso denegado a Firestore. Configura tus reglas de seguridad públicas (read, write if true).");
    });
  }

  renderConnectionError(msg) {
    const container = document.getElementById("chat-messages-container");
    if (container) {
      container.innerHTML = `<div class="text-center text-rose-400 py-4 font-bold">${msg}</div>`;
    }
  }

  updateBadgeUI() {
    const badge = document.getElementById("chat-badge");
    if (!badge) return;
    if (this.unreadCount > 0) {
      badge.textContent = this.unreadCount > 9 ? "9+" : this.unreadCount;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}