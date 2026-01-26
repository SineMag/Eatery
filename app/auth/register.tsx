import { auth } from "@/utils/firebase";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Logo } from "../../components/logo";
import { userService } from "../../utils/user-service";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    contactNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    console.log("handleRegister called!");
    console.log("Current loading state:", loading);

    const {
      email,
      password,
      confirmPassword,
      name,
      surname,
      contactNumber,
      address,
    } = formData;

    console.log("Form data:", {
      email,
      name,
      surname,
      hasPassword: !!password,
    });

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !name ||
      !surname ||
      !contactNumber ||
      !address
    ) {
      console.log("Validation failed - missing fields");
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Password mismatch");
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      console.log("Password too short");
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Additional password validation
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      console.log("Password needs letter");
      Alert.alert("Error", "Password must contain at least one letter");
      return;
    }

    console.log("All validation passed, setting loading to true");
    setLoading(true);
    try {
      console.log("Creating user with email:", email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User created successfully:", userCredential.user.uid);

      // Save user profile to Firestore
      try {
        await userService.createUserProfile({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          name: name.trim(),
          surname: surname.trim(),
          contactNumber: contactNumber.trim(),
        });
        console.log("User profile saved to Firestore");
      } catch (profileError) {
        console.error("Error saving user profile:", profileError);
        // Continue anyway - user was created in Auth
      }

      Alert.alert("Success", "Account created successfully!");
      router.replace("/" as any);
    } catch (error: any) {
      console.error("Registration error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      let errorMessage = "Registration failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please use a different email or sign in.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage =
          "Email/password accounts are not enabled. Please contact support.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      console.log("Setting loading back to false");
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Logo size="large" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Name"
              value={formData.name}
              onChangeText={(value) => updateField("name", value)}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Surname"
              value={formData.surname}
              onChangeText={(value) => updateField("surname", value)}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChangeText={(value) => updateField("contactNumber", value)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(value) => updateField("address", value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => updateField("password", value)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField("confirmPassword", value)}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.linkText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    justifyContent: "center",
    minHeight: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 60,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  halfInput: {
    width: "48%",
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
});
