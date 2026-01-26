import { auth } from "./firebase";

export function testFirebaseAuth() {
  console.log("=== Firebase Auth Test ===");
  console.log("Auth instance:", auth);
  console.log("Current user:", auth.currentUser);
  console.log("Auth config:", auth.config);

  // Test if auth is properly initialized
  if (!auth) {
    console.error("Firebase Auth is not initialized!");
    return false;
  }

  console.log("Firebase Auth is properly initialized");
  return true;
}

export function checkAuthMethods() {
  console.log("=== Checking Auth Methods ===");

  // These should be available if Email/Password auth is enabled
  const methods = [
    "signInWithEmailAndPassword",
    "createUserWithEmailAndPassword",
    "sendPasswordResetEmail",
    "signOut",
  ];

  methods.forEach((method) => {
    if (typeof (auth as any)[method] === "function") {
      console.log(`✅ ${method} is available`);
    } else {
      console.log(`❌ ${method} is NOT available`);
    }
  });
}
