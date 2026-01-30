import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { categories, foodItems, getCategoryById } from '@/src/data/menuData';

export default function MenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (params.category as string) || ''
  );

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return foodItems;
    return foodItems.filter((item) => item.categoryId === selectedCategory);
  }, [selectedCategory]);

  const selectedCategoryData = selectedCategory
    ? getCategoryById(selectedCategory)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>
          {selectedCategoryData
            ? `${selectedCategoryData.name} (${filteredItems.length} items)`
            : `All Items (${filteredItems.length})`}
        </Text>
      </View>

      <View style={styles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory('')}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  !selectedCategory && styles.categoryChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.itemsList}>
        {filteredItems.map((item) => {
          const category = getCategoryById(item.categoryId);
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push(`/item/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {category && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{category.name}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => router.push(`/item/${item.id}`)}
                  >
                    <Text style={styles.viewButtonText}>View Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  categoryFilter: {
    paddingBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  categoryChipActive: {
    backgroundColor: '#11181C',
    borderColor: '#11181C',
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 120,
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  categoryBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginTop: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  viewButton: {
    backgroundColor: '#11181C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
