import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
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
  const {
    pickImage,
    image: profileImage,
    setImage: setProfileImage,
    loading: imageLoading,
  } = useImagePicker();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
    address: user?.address || "",
  });

  const handleUpdateProfile = async () => {
    // TODO: Update profile in Firestore including profile image
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

  const handleImageUpload = async () => {
    const selectedImage = await pickImage();
    if (selectedImage) {
      // TODO: Upload image to Firebase Storage
      Alert.alert("Success", "Profile image updated!");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>
          <View style={styles.notLoggedIn}>
            <IconSymbol name="person.crop.circle" size={48} color="#9ca3af" />
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
        </ScrollView>
        <BottomNavigation activeTab="profile" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Profile"
          showProfile={false}
          showCart={false}
          showLogo={false}
          rightAction={
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <IconSymbol
                  name={isEditing ? "checkmark" : "pencil"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push("/(tabs)/settings")}
              >
                <IconSymbol name="gearshape" size={20} color="#11181C" />
              </TouchableOpacity>
            </View>
          }
        />

        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleImageUpload}
            disabled={imageLoading}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <IconSymbol
                  name="person.crop.circle.fill"
                  size={48}
                  color="#fff"
                />
                {isEditing && (
                  <View style={styles.cameraOverlay}>
                    <IconSymbol name="camera.fill" size={20} color="#fff" />
                  </View>
                )}
              </View>
            )}
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <IconSymbol name="clock" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>
            {formData.name} {formData.surname}
          </Text>
          <Text style={styles.userEmail}>{formData.email}</Text>
          {isEditing && (
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handleImageUpload}
              disabled={imageLoading}
            >
              <IconSymbol name="camera" size={16} color="#11181C" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          )}
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
          <IconSymbol name="hand.point.right" size={20} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Account for bottom navigation
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    backgroundColor: "#11181C",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    backgroundColor: "#f3f4f6",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#11181C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#11181C",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    marginTop: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
  },
  changePhotoText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#11181C",
    fontWeight: "500",
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
