import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBoUpG3nLrjaHwvXhRvos25i4K_4PrtjDo",
    authDomain: "ftui-hub-2026.firebaseapp.com",
    projectId: "ftui-hub-2026",
    storageBucket: "ftui-hub-2026.firebasestorage.app",
    messagingSenderId: "168337394806",
    appId: "1:168337394806:web:00e1dbbe25face9391e357"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export {
    auth, db,
    signInWithEmailAndPassword, signOut, onAuthStateChanged,
    collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot
};
