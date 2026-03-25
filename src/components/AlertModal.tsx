import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onButtonPress: () => void;
  type?: "info" | "success" | "error" | "warning";
}

export function AlertModal({
  visible,
  title,
  message,
  buttonText = "OK",
  onButtonPress,
  type = "info",
}: AlertModalProps) {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#d1fae5";
      case "error":
        return "#fee2e2";
      case "warning":
        return "#fef3c7";
      case "info":
      default:
        return "#dbeafe";
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "success":
        return "#059669";
      case "error":
        return "#dc2626";
      case "warning":
        return "#d97706";
      case "info":
      default:
        return "#2563eb";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "#059669";
      case "error":
        return "#dc2626";
      case "warning":
        return "#d97706";
      case "info":
      default:
        return "#2563eb";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onButtonPress}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              { borderLeftColor: getTitleColor(), borderLeftWidth: 4 },
            ]}
          >
            <Text style={[styles.title, { color: getTitleColor() }]}>
              {title}
            </Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: getButtonColor() }]}
              onPress={onButtonPress}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
