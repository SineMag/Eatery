import { IconSymbol } from "@/components/ui/icon-symbol";
import { locationService } from "@/utils/location-service";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LocationPermissionProps {
  onLocationGranted: (location: any) => void;
  onLocationDenied?: () => void;
}

export function LocationPermission({
  onLocationGranted,
  onLocationDenied,
}: LocationPermissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRequestLocation = async () => {
    setIsLoading(true);

    try {
      const location = await locationService.getCurrentLocation();

      if (location) {
        Alert.alert(
          "Location Access Granted",
          "We'll show you restaurants near your current location.",
          [
            {
              text: "OK",
              onPress: () => onLocationGranted(location),
            },
          ],
        );
      } else {
        throw new Error("Unable to get location");
      }
    } catch (error: any) {
      console.error("Location error:", error);
      Alert.alert(
        "Location Access Denied",
        "You can still browse restaurants, but we won't be able to show you the nearest ones. You can enable location in your browser settings.",
        [
          {
            text: "Continue Without Location",
            onPress: () => onLocationDenied?.(),
          },
          {
            text: "Try Again",
            onPress: () => handleRequestLocation(),
          },
        ],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipLocation = () => {
    Alert.alert(
      "Skip Location Access",
      "You can still browse all available restaurants, but they won't be sorted by distance.",
      [
        {
          text: "Browse All Restaurants",
          onPress: () => onLocationDenied?.(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol name="location.circle.fill" size={80} color="#11181C" />
        </View>

        <Text style={styles.title}>Find Restaurants Near You</Text>

        <Text style={styles.description}>
          Allow location access to see restaurants closest to you and get
          accurate delivery times.
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <IconSymbol
              name="checkmark.circle.fill"
              size={20}
              color="#10b981"
            />
            <Text style={styles.benefitText}>
              See nearest restaurants first
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol
              name="checkmark.circle.fill"
              size={20}
              color="#10b981"
            />
            <Text style={styles.benefitText}>Accurate delivery estimates</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol
              name="checkmark.circle.fill"
              size={20}
              color="#10b981"
            />
            <Text style={styles.benefitText}>Personalized recommendations</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleRequestLocation}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Getting Location..." : "Enable Location"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSkipLocation}
          >
            <Text style={styles.secondaryButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.privacyNote}>
          Your location is only used to find nearby restaurants and is never
          shared with third parties.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#11181C",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  benefitsContainer: {
    width: "100%",
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 200,
  },
  primaryButton: {
    backgroundColor: "#11181C",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },
  privacyNote: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },
});
