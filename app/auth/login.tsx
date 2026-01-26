import { Logo } from "@/components/logo";
import { auth } from "@/utils/firebase";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Debug: Check Firebase Auth on mount
  React.useEffect(() => {
    console.log("=== Login Screen Mount ===");
    console.log("Auth instance:", !!auth);
    console.log("Current user:", auth.currentUser);
    console.log("Auth config:", auth.config);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login with email:", email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("Login successful:", userCredential.user.uid);
      router.replace("/" as any);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage =
          "Email/Password authentication is not enabled. Please check Firebase Console.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Test function for debugging
  const testEmail = "test@example.com";
  const testPassword = "test123456";

  const handleTestAuth = async () => {
    console.log("=== Testing Firebase Auth ===");

    try {
      console.log("Attempting to create test account...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        testEmail,
        testPassword,
      );
      console.log("Test login successful:", userCredential.user.uid);
    } catch (error: any) {
      console.log("Test login failed (expected):", error.code);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        console.log("Test account doesn't exist, trying to create...");
        try {
          console.log("Importing createUserWithEmailAndPassword...");
          const { createUserWithEmailAndPassword } =
            await import("firebase/auth");
          console.log(
            "Creating user with:",
            testEmail,
            "password length:",
            testPassword.length,
          );

          const userCredential = await createUserWithEmailAndPassword(
            auth,
            testEmail,
            testPassword,
          );
          console.log(
            "Test account created successfully:",
            userCredential.user.uid,
          );
          Alert.alert(
            "Success",
            "Test account created! You can now login with test@example.com / test123456",
          );
        } catch (createError: any) {
          console.error(
            "Failed to create test account:",
            createError.code,
            createError.message,
          );

          if (createError.code === "auth/email-already-in-use") {
            Alert.alert(
              "Account Exists",
              "Test account already exists! Try logging in with test@example.com / test123456",
            );
          } else if (createError.code === "auth/operation-not-allowed") {
            Alert.alert(
              "Firebase Configuration Error",
              "Email/Password authentication is not enabled. Please go to Firebase Console → Authentication → Sign-in method → Enable Email/Password provider.",
            );
          } else {
            Alert.alert(
              "Account Creation Error",
              `Failed to create test account: ${createError.code} - ${createError.message}`,
            );
          }
        }
      } else {
        Alert.alert(
          "Auth Test Error",
          `Error: ${error.code} - ${error.message}`,
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size="large" />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        {/* Debug Test Button - Remove in production */}
        <TouchableOpacity style={styles.testButton} onPress={handleTestAuth}>
          <Text style={styles.testButtonText}>🔧 Test Firebase Auth</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#11181C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  button: {
    backgroundColor: "#11181C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
  },
  testButton: {
    backgroundColor: "#f59e0b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#d97706",
  },
  testButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
