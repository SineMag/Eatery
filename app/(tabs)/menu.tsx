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
import { useMenu } from '@/src/contexts/MenuContext';
import { ChevronRightIcon } from '@/src/components/Icons';
import { useResponsive } from '@/src/hooks/useResponsive';

export default function MenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { categories, menuItems } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (params.category as string) || ''
  );
  const { isTablet, isDesktop } = useResponsive();

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter((item) => item.categoryId === selectedCategory);
  }, [menuItems, selectedCategory]);

  const selectedCategoryData = selectedCategory
    ? categories.find((category) => category.id === selectedCategory)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        <Text style={[styles.title, isDesktop && styles.titleDesktop]}>Menu</Text>
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
        <View style={[
          styles.itemsContainer,
          isTablet && styles.itemsContainerTablet,
          isDesktop && styles.itemsContainerDesktop
        ]}>
          {filteredItems.map((item) => {
            const category = categories.find((entry) => entry.id === item.categoryId);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  isTablet && styles.itemCardTablet,
                  isDesktop && styles.itemCardDesktop
                ]}
                onPress={() => router.push(`/item/${item.id}`)}
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={[
                    styles.itemImage,
                    isTablet && styles.itemImageTablet,
                    isDesktop && styles.itemImageDesktop
                  ]} 
                />
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.itemName, isDesktop && styles.itemNameDesktop]}>
                      {item.name}
                    </Text>
                    {category && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeEmoji}>{category.icon}</Text>
                        <Text style={styles.categoryBadgeText}>{category.name}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.itemFooter}>
                    <Text style={[styles.itemPrice, isDesktop && styles.itemPriceDesktop]}>
                      R{item.price.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => router.push(`/item/${item.id}`)}
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                      <ChevronRightIcon size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  headerDesktop: {
    paddingHorizontal: 40,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  titleDesktop: {
    fontSize: 36,
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
  itemsContainer: {
    gap: 12,
  },
  itemsContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 8,
  },
  itemsContainerDesktop: {
    paddingHorizontal: 24,
    gap: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemCardTablet: {
    width: '48%',
    flexDirection: 'column',
  },
  itemCardDesktop: {
    width: '31%',
    flexDirection: 'column',
  },
  itemImage: {
    width: 120,
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  itemImageTablet: {
    width: '100%',
    height: 140,
  },
  itemImageDesktop: {
    width: '100%',
    height: 180,
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
  itemNameDesktop: {
    fontSize: 18,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryBadgeEmoji: {
    fontSize: 12,
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
  itemPriceDesktop: {
    fontSize: 20,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#11181C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
