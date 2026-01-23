import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/utils/firebase";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
    address: user?.address || "",
  });

  const handleUpdateProfile = async () => {
    // TODO: Update profile in Firestore
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditing(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/auth/login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.notLoggedIn}>
          <IconSymbol name="person" size={48} color="#9ca3af" />
          <Text style={styles.notLoggedInText}>
            Please login to view your profile
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <IconSymbol
            name={isEditing ? "xmark" : "pencil"}
            size={24}
            color="#11181C"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <IconSymbol name="person.fill" size={48} color="#fff" />
        </View>
        <Text style={styles.userName}>
          {formData.name} {formData.surname}
        </Text>
        <Text style={styles.userEmail}>{formData.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, name: value }))
              }
            />
          ) : (
            <Text style={styles.fieldValue}>{formData.name}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Surname</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.surname}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, surname: value }))
              }
            />
          ) : (
            <Text style={styles.fieldValue}>{formData.surname}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{formData.email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Contact Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.contactNumber}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, contactNumber: value }))
              }
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.fieldValue}>{formData.contactNumber}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Address</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, address: value }))
              }
              multiline
            />
          ) : (
            <Text style={styles.fieldValue}>{formData.address}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <TouchableOpacity style={styles.paymentCard}>
          <IconSymbol name="creditcard" size={20} color="#11181C" />
          <Text style={styles.paymentText}>•••• 4242 (Visa)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addPaymentButton}>
          <IconSymbol name="plus" size={20} color="#11181C" />
          <Text style={styles.addPaymentText}>Add Payment Method</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order History</Text>
        <TouchableOpacity style={styles.historyButton}>
          <IconSymbol name="list.bullet" size={20} color="#11181C" />
          <Text style={styles.historyText}>View Order History</Text>
        </TouchableOpacity>
      </View>

      {isEditing && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsEditing(false);
              setFormData({
                name: user?.name || "",
                surname: user?.surname || "",
                email: user?.email || "",
                contactNumber: user?.contactNumber || "",
                address: user?.address || "",
              });
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <IconSymbol name="arrow.right.square" size={20} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#11181C",
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#11181C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#11181C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#11181C",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 16,
    color: "#11181C",
    marginLeft: 12,
  },
  addPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    borderStyle: "dashed",
  },
  addPaymentText: {
    fontSize: 16,
    color: "#11181C",
    marginLeft: 8,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
  },
  historyText: {
    fontSize: 16,
    color: "#11181C",
    marginLeft: 12,
  },
  actions: {
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#11181C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#11181C",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
  },
  signOutText: {
    fontSize: 16,
    color: "#ef4444",
    marginLeft: 8,
  },
});
