import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { categories, foodItems } from '@/src/data/menuData';
import { 
  getCategoryIcon, 
  PlusIcon, 
  AdminIcon,
  ChevronRightIcon 
} from '@/src/components/Icons';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const featuredItems = foodItems.slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {user ? `Welcome back, ${user.name}!` : 'Welcome to Eatery'}
            </Text>
            <Text style={styles.subGreeting}>What would you like to eat today?</Text>
          </View>
          {user?.isAdmin && (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => router.push('/admin')}
            >
              <AdminIcon size={18} color="#fff" />
              <Text style={styles.adminButtonText}>Admin</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryRow}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => router.push(`/menu?category=${category.id}`)}
                >
                  <View style={styles.categoryIconContainer}>
                    {getCategoryIcon(category.id, 28, '#11181C')}
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Items</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.seeAll}>See All</Text>
              <ChevronRightIcon size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <View style={styles.itemsGrid}>
            {featuredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => router.push(`/item/${item.id}`)}
              >
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => router.push(`/item/${item.id}`)}
                    >
                      <PlusIcon size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular This Week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.popularRow}>
              {foodItems.slice(4, 8).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.popularCard}
                  onPress={() => router.push(`/item/${item.id}`)}
                >
                  <Image source={{ uri: item.image }} style={styles.popularImage} />
                  <Text style={styles.popularName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.popularPrice}>R{item.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {!user && (
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to order?</Text>
            <Text style={styles.ctaText}>
              Sign in or create an account to start ordering delicious food!
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity
                style={styles.ctaButtonPrimary}
                onPress={() => router.push('/auth/login')}
              >
                <Text style={styles.ctaButtonPrimaryText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ctaButtonSecondary}
                onPress={() => router.push('/auth/register')}
              >
                <Text style={styles.ctaButtonSecondaryText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#11181C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAll: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    width: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#11181C',
    textAlign: 'center',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181C',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#11181C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  popularCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  popularImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#f3f4f6',
  },
  popularName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#11181C',
    padding: 8,
    paddingBottom: 0,
  },
  popularPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#11181C',
    padding: 8,
    paddingTop: 4,
  },
  ctaSection: {
    margin: 20,
    padding: 24,
    backgroundColor: '#11181C',
    borderRadius: 16,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaButtonPrimary: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonPrimaryText: {
    color: '#11181C',
    fontWeight: '600',
    fontSize: 14,
  },
  ctaButtonSecondary: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  ctaButtonSecondaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
