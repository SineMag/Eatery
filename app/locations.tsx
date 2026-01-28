import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export default function LocationsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    // Mock data - in a real app, this would come from Firestore
    const mockLocations: Location[] = [
      {
        id: "1",
        name: "Home",
        address: "123 Main Street",
        city: "Cape Town",
        postalCode: "8001",
        isDefault: true,
      },
      {
        id: "2",
        name: "Office",
        address: "456 Business Avenue",
        city: "Cape Town",
        postalCode: "8002",
        isDefault: false,
      },
    ];

    setLocations(mockLocations);
  }, []);

  const handleAddLocation = () => {
    if (
      !newLocation.name ||
      !newLocation.address ||
      !newLocation.city ||
      !newLocation.postalCode
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const location: Location = {
      id: Date.now().toString(),
      ...newLocation,
      isDefault: locations.length === 0,
    };

    setLocations([...locations, location]);
    setNewLocation({ name: "", address: "", city: "", postalCode: "" });
    setShowAddForm(false);
    Alert.alert("Success", "Location added successfully!");
  };

  const handleSetDefault = (locationId: string) => {
    setLocations(
      locations.map((loc) => ({
        ...loc,
        isDefault: loc.id === locationId,
      })),
    );
    Alert.alert("Success", "Default location updated!");
  };

  const handleDeleteLocation = (locationId: string) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (location?.isDefault) {
      Alert.alert("Error", "Cannot delete default location");
      return;
    }

    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setLocations(locations.filter((loc) => loc.id !== locationId));
            Alert.alert("Success", "Location deleted!");
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Locations</Text>
        <TouchableOpacity onPress={() => setShowAddForm(true)}>
          <IconSymbol name="plus" size={24} color="#11181C" />
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>Add New Location</Text>

          <TextInput
            style={styles.input}
            placeholder="Location Name (e.g., Home, Office)"
            value={newLocation.name}
            onChangeText={(text) =>
              setNewLocation({ ...newLocation, name: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={newLocation.address}
            onChangeText={(text) =>
              setNewLocation({ ...newLocation, address: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            value={newLocation.city}
            onChangeText={(text) =>
              setNewLocation({ ...newLocation, city: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={newLocation.postalCode}
            onChangeText={(text) =>
              setNewLocation({ ...newLocation, postalCode: text })
            }
          />

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowAddForm(false);
                setNewLocation({
                  name: "",
                  address: "",
                  city: "",
                  postalCode: "",
                });
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddLocation}
            >
              <Text style={styles.addButtonText}>Add Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.locationsList}>
        {locations.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="location" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No locations saved</Text>
            <Text style={styles.emptySubtitle}>
              Add your delivery addresses to make ordering faster
            </Text>
          </View>
        ) : (
          locations.map((location) => (
            <View key={location.id} style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  {location.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.locationActions}>
                  {!location.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(location.id)}
                    >
                      <IconSymbol name="star" size={16} color="#f59e0b" />
                    </TouchableOpacity>
                  )}
                  {!location.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteLocation(location.id)}
                    >
                      <IconSymbol name="trash" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.addressDetails}>
                <View style={styles.addressRow}>
                  <IconSymbol name="location" size={14} color="#6b7280" />
                  <Text style={styles.addressText}>
                    {location.address}, {location.city}, {location.postalCode}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
  },
  addForm: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#11181C",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  locationsList: {
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  locationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  defaultText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  locationActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  addressDetails: {
    gap: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
});
