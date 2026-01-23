import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const {
  EXPO_PUBLIC_FIREBASE_API_KEY: apiKey,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: authDomain,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: projectId,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  EXPO_PUBLIC_FIREBASE_APP_ID: appId,
} = Constants?.expoConfig?.extra ?? {};

if (!apiKey || !authDomain || !projectId || !appId) {
  console.warn(
    "Firebase environment variables are missing. Add EXPO_PUBLIC_FIREBASE_* to your app config.",
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
