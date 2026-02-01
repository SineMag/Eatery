import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = "Search restaurants...",
  loading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSubmitEditing = () => {
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <View style={styles.searchIcon}>
          <IconSymbol name="magnifyingglass" size={20} color="#9ca3af" />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query.trim() && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setQuery("")}
          >
            <IconSymbol name="xmark.circle.fill" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.searchButton, loading && styles.searchButtonDisabled]}
        onPress={handleSearch}
        disabled={loading || !query.trim()}
      >
        <IconSymbol
          name={loading ? "clock" : "magnifyingglass"}
          size={16}
          color={loading || !query.trim() ? "#9ca3af" : "#fff"}
        />
        <Text
          style={[
            styles.searchButtonText,
            loading && styles.searchButtonTextDisabled,
          ]}
        >
          {loading ? "Searching..." : "Search"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#11181C",
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#11181C",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  searchButtonDisabled: {
    backgroundColor: "#e5e5e5",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  searchButtonTextDisabled: {
    color: "#9ca3af",
  },
});
