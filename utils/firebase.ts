import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRrqSIfEQKqBIb631Z0yIcMtNlnuaIMLQ",
  authDomain: "eatery-45672.firebaseapp.com",
  databaseURL: "https://eatery-45672-default-rtdb.firebaseio.com",
  projectId: "eatery-45672",
  messagingSenderId: "306837127782",
  appId: "1:306837127782:web:57f21d73dc805ef52523a7",
};

// Initialize Firebase...
export const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Realtime Database
export const rtdb = getDatabase(app);
