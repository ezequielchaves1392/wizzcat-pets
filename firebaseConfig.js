// Importa los SDKs necesarios de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot, collection, addDoc, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    onSnapshot, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    limit, 
    serverTimestamp 
};