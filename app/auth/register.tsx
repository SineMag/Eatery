import { useAuth } from "@/hooks";
import { createUserProfile } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { signUp } = useAuth();
  const { width } = Dimensions.get("window");
  const isSmallScreen = width < 400;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const {
      email,
      password,
      confirmPassword,
      name,
      surname,
      contactNumber,
      address,
    } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!surname.trim()) newErrors.surname = "Surname is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password && !/(?=.*[a-zA-Z])/.test(password)) {
      newErrors.password = "Password must contain at least one letter";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const { email, password, name, surname, contactNumber, address } = formData;

    setLoading(true);
    try {
      const { data, error } = await signUp(
        email,
        password,
        `${name} ${surname}`,
      );

      if (error) {
        throw error;
      }

      // Save user profile to Supabase
      if (data.user?.id) {
        try {
          await createUserProfile({
            user_id: data.user.id,
            name: name.trim(),
            surname: surname.trim(),
            contact_number: contactNumber.trim(),
            address: address.trim(),
            role: "user",
          });
        } catch (profileError) {
          console.error("Error saving user profile:", profileError);
          // Continue anyway - user was created in Auth
        }
      }

      Alert.alert("Success", "Account created successfully!");
      router.replace("/" as any);
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.message?.includes("User already registered")) {
        errorMessage =
          "This email is already registered. Please use a different email or sign in.";
      } else if (error.message?.includes("Invalid email")) {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.message?.includes("Password should be at least")) {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const renderInput = (
    field: string,
    placeholder: string,
    keyboardType = "default",
    secureTextEntry = false,
    width_percent = "100%"
  ) => (
    <View style={{ width: width_percent }}>
      <TextInput
        style={[
          styles.input,
          errors[field] && styles.inputError,
          width_percent !== "100%" && styles.halfInput,
        ]}
        placeholder={placeholder}
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => updateField(field, value)}
        keyboardType={keyboardType as any}
        autoCapitalize={secureTextEntry ? "none" : "sentences"}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9ca3af"
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Logo size="large" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.row}>
            {renderInput("name", "First Name", "default", false, isSmallScreen ? "100%" : "48%")}
            {!isSmallScreen && <View style={{ width: "4%" }} />}
            {renderInput("surname", "Last Name", "default", false, isSmallScreen ? "100%" : "48%")}
          </View>

          {renderInput("email", "Email Address", "email-address")}
          {renderInput("contactNumber", "Contact Number", "phone-pad")}
          {renderInput("address", "Delivery Address")}
          {renderInput("password", "Password", "default", true)}
          {renderInput("confirmPassword", "Confirm Password", "default", true)}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push("/auth/login")}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
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
  scrollContent: {
    flexGrow: 1,
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
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 4,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    color: "#11181C",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  halfInput: {
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 12,
    marginTop: -12,
  },
  button: {
    backgroundColor: "#11181C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
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
  linkTextBold: {
    fontWeight: "600",
    color: "#11181C",
  },
});
