import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRrqSIfEQKqBIb631Z0yIcMtNlnuaIMLQ",
  authDomain: "eatery-45672.firebaseapp.com",
  projectId: "eatery-45672",
  storageBucket: "eatery-45672.firebasestorage.app",
  messagingSenderId: "306837127782",
  appId: "1:306837127782:web:57f21d73dc805ef52523a7",
  measurementId: "G-XXXXXXXXXX",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
