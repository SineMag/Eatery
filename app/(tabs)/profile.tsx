import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { useImagePicker } from "@/hooks/useImagePicker";
import { saveProfileImage, updateUserProfile } from "@/utils/firestore";
import { uploadProfileImage, validateProfileImage } from "@/utils/storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

  // Initialize profile image from user data
  React.useEffect(() => {
    if (user?.profileImage && !profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user, profileImage, setProfileImage]);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
    address: user?.address || "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);

      // Update all profile details in Firestore
      await updateUserProfile(user.uid, {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
        profileImage: profileImage || undefined,
      });

      // Update local user object to reflect changes immediately
      if (user) {
        user.name = formData.name.trim();
        user.surname = formData.surname.trim();
        user.contactNumber = formData.contactNumber.trim();
        user.address = formData.address.trim();
        user.profileImage = profileImage || undefined;
      }

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setUploadingImage(true);

      const selectedImage = await pickImage();
      if (!selectedImage) {
        return; // User cancelled
      }

      // Validate the image
      if (!validateProfileImage(selectedImage)) {
        Alert.alert(
          "Error",
          "Invalid image format. Please select a valid image file.",
        );
        return;
      }

      // Upload image to Firebase Storage
      const downloadURL = await uploadProfileImage(selectedImage, user.uid);

      // Save the image URL to Firestore
      await saveProfileImage(user.uid, downloadURL);

      // Update local state
      setProfileImage(downloadURL);

      Alert.alert("Success", "Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload profile image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <AppHeader showProfile={false} showCart={false} showLogo={false} />
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
        <AppHeader showProfile={false} showCart={false} showLogo={false} />

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

          {/* Edit and Settings buttons under profile */}
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.profileEditButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <IconSymbol
                name={isEditing ? "checkmark" : "pencil"}
                size={20}
                color="#fff"
              />
              <Text style={styles.profileButtonText}>
                {isEditing ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileSettingsButton}
              onPress={() => router.push("/(tabs)/settings")}
            >
              <IconSymbol name="gearshape" size={20} color="#fff" />
              <Text style={styles.profileButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>

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
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.saveButtonText}>Saving...</Text>
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.disabledButton]}
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
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#11181C",
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
  },
  profileActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  profileEditButton: {
    backgroundColor: "#11181C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileSettingsButton: {
    backgroundColor: "#6b7280",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
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
  disabledButton: {
    opacity: 0.6,
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
});
