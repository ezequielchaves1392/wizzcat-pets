// js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración oficial de Firebase para "Cyber-Pet: Nexus"
const firebaseConfig = {
  apiKey: "AIzaSyBR0R04751C2ytAjkIYTcFJ2NMDOUS0wCw",
  authDomain: "pet-project-aef10.firebaseapp.com",
  databaseURL: "https://pet-project-aef10-default-rtdb.firebaseio.com",
  projectId: "pet-project-aef10",
  storageBucket: "pet-project-aef10.firebasestorage.app",
  messagingSenderId: "1095832691858",
  appId: "1:1095832691858:web:62991ce2f3df13eb1bb24b",
  measurementId: "G-594M26YM0P"
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Nexus Firebase Core: Cloud Firestore conectado exitosamente.");
} catch (error) {
  console.error("Nexus Firebase Core Error: No se pudo inicializar Firestore.", error);
}

export { db };