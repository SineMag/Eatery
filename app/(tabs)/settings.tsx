import LayoutWrapper from "@/components/layout-wrapper";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    if (loading || signingOut) return;

    setSigningOut(true);
    try {
      const { error } = await signOut();

      if (error) {
        throw error;
      }

      // Add a small delay to ensure auth state has propagated
      setTimeout(() => {
        router.replace("/");
      }, 100);
    } catch (error: any) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
      setSigningOut(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Account deletion will be implemented when needed
              Alert.alert(
                "Info",
                "Please contact support to delete your account.",
              );
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  if (!user) {
    return (
      <LayoutWrapper title="Settings" showBottomNavigation={true}>
        <View style={styles.notLoggedIn}>
          <IconSymbol name="gearshape" size={48} color="#9ca3af" />
          <Text style={styles.notLoggedInText}>
            Please login to access settings
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper title="Settings" showBottomNavigation={true}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admin Section - Only visible to admins */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin</Text>

            <TouchableOpacity
              style={[styles.settingItem, styles.adminItem]}
              onPress={() => router.push("/admin/dashboard")}
            >
              <View style={styles.settingLeft}>
                <IconSymbol name="chart.bar.fill" size={24} color="#3b82f6" />
                <Text style={[styles.settingText, styles.adminText]}>
                  Admin Dashboard
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <View style={styles.settingLeft}>
              <IconSymbol name="person.crop.circle" size={24} color="#11181C" />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.signOutButton]}
            onPress={handleSignOut}
            activeOpacity={0.8}
            disabled={signingOut}
          >
            <View style={styles.settingLeft}>
              <IconSymbol name="arrow.right.square" size={24} color="#ef4444" />
              <Text style={[styles.settingText, styles.dangerText]}>
                {signingOut ? "Signing Out..." : "Sign Out"}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#ef4444" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <IconSymbol name="trash" size={24} color="#ef4444" />
              <Text style={[styles.settingText, styles.dangerText]}>
                Delete Account
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="bell" size={24} color="#11181C" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="lock" size={24} color="#11181C" />
              <Text style={styles.settingText}>Privacy</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol
                name="questionmark.circle"
                size={24}
                color="#11181C"
              />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="doc.text" size={24} color="#11181C" />
              <Text style={styles.settingText}>Terms & Conditions</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#11181C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: "#11181C",
    marginLeft: 12,
  },
  dangerText: {
    color: "#ef4444",
  },
  signOutButton: {
    backgroundColor: "#fef2f2",
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  adminItem: {
    backgroundColor: "#eff6ff",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  adminText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
