import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBRrqSIfEQKqBIb631Z0yIcMtNlnuaIMLQ",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "eatery-45672.firebaseapp.com",
  databaseURL:
    process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://eatery-45672-default-rtdb.firebaseio.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "eatery-45672",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "eatery-45672.appspot.com",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "306837127782",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    "1:306837127782:web:57f21d73dc805ef52523a7",
};

// Initialize Firebase...
export const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Realtime Database
export const rtdb = getDatabase(app);
