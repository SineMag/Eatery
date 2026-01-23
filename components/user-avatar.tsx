import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface UserAvatarProps {
  size?: "small" | "medium" | "large";
  showBorder?: boolean;
  customProfileImage?: string | null;
}

export function UserAvatar({
  size = "medium",
  showBorder = true,
  customProfileImage,
}: UserAvatarProps) {
  const { user } = useAuth();

  const getSize = () => {
    switch (size) {
      case "small":
        return 32;
      case "medium":
        return 48;
      case "large":
        return 64;
      default:
        return 48;
    }
  };

  const getBorderWidth = () => {
    return showBorder ? 2 : 0;
  };

  const profileImage = customProfileImage || user?.profileImage;

  return (
    <View style={[styles.container, { width: getSize(), height: getSize() }]}>
      {user ? (
        <View
          style={[styles.avatarContainer, { borderWidth: getBorderWidth() }]}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={[
                styles.avatarImage,
                { width: getSize() - 4, height: getSize() - 4 },
              ]}
              resizeMode="cover"
            />
          ) : (
            <IconSymbol
              name="person.crop.circle.fill"
              size={getSize() - 8}
              color="#9ca3af"
            />
          )}
        </View>
      ) : (
        <View
          style={[styles.avatarContainer, { borderWidth: getBorderWidth() }]}
        >
          <IconSymbol
            name="person.crop.circle"
            size={getSize() - 8}
            color="#d1d5db"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 60,
    maxHeight: 60,
  },
  avatarContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#e5e5e5",
    borderWidth: 1,
    overflow: "hidden",
  },
  avatarImage: {
    borderRadius: 9999,
  },
});
