// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeFawpN7RtHgCVoJWXtPVbLO3iU8gz8xQ",
  authDomain: "is424-term-project.firebaseapp.com",
  projectId: "is424-term-project",
  storageBucket: "is424-term-project.firebasestorage.app",
  messagingSenderId: "571020263691",
  appId: "1:571020263691:web:73fb6c4519dff2caf0e20e",
  measurementId: "G-FL49EFV0B1",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
