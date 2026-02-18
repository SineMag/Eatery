import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/src/contexts/CartContext';
import { BackIcon, CheckIcon } from '@/src/components/Icons';
import { SideOption, DrinkOption, ExtraOption, CartItemCustomization } from '@/src/types';

export default function EditCartItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { items, updateCustomization } = useCart();

  const cartItem = items.find((item) => item.id === id);
  
  const [selectedSides, setSelectedSides] = useState<SideOption[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkOption[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);

  useEffect(() => {
    if (cartItem) {
      setSelectedSides(cartItem.customization.selectedSides);
      setSelectedDrinks(cartItem.customization.selectedDrinks);
      setSelectedExtras(cartItem.customization.selectedExtras);
      setRemovedIngredients(cartItem.customization.removedIngredients);
      setAddedIngredients(cartItem.customization.addedIngredients);
    }
  }, [cartItem]);

  if (!cartItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { foodItem } = cartItem;

  const toggleSide = (side: SideOption) => {
    setSelectedSides((prev) => {
      const exists = prev.find((s) => s.id === side.id);
      if (exists) {
        return prev.filter((s) => s.id !== side.id);
      }
      if (prev.length >= 2) {
        return [...prev.slice(1), side];
      }
      return [...prev, side];
    });
  };

  const toggleDrink = (drink: DrinkOption) => {
    setSelectedDrinks((prev) => {
      const exists = prev.find((d) => d.id === drink.id);
      if (exists) {
        return prev.filter((d) => d.id !== drink.id);
      }
      return [...prev, drink];
    });
  };

  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  };

  const toggleIngredient = (ingredient: { id: string; name: string; removable: boolean; addable: boolean }) => {
    if (ingredient.removable && !ingredient.addable) {
      setRemovedIngredients((prev) => {
        if (prev.includes(ingredient.name)) {
          return prev.filter((i) => i !== ingredient.name);
        }
        return [...prev, ingredient.name];
      });
    } else if (ingredient.addable && !ingredient.removable) {
      setAddedIngredients((prev) => {
        if (prev.includes(ingredient.name)) {
          return prev.filter((i) => i !== ingredient.name);
        }
        return [...prev, ingredient.name];
      });
    } else if (ingredient.removable && ingredient.addable) {
      if (removedIngredients.includes(ingredient.name)) {
        setRemovedIngredients((prev) => prev.filter((i) => i !== ingredient.name));
      } else if (addedIngredients.includes(ingredient.name)) {
        setAddedIngredients((prev) => prev.filter((i) => i !== ingredient.name));
        setRemovedIngredients((prev) => [...prev, ingredient.name]);
      } else {
        setAddedIngredients((prev) => [...prev, ingredient.name]);
      }
    }
  };

  const handleSaveChanges = () => {
    const customization: CartItemCustomization = {
      selectedSides,
      selectedDrinks,
      selectedExtras,
      removedIngredients,
      addedIngredients,
    };
    updateCustomization(cartItem.id, customization);
    if (Platform.OS === 'web') {
      router.back();
      return;
    }
    Alert.alert('Updated', 'Your customizations have been saved!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <BackIcon size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Item</Text>
        <TouchableOpacity onPress={handleSaveChanges} style={styles.headerButton}>
          <CheckIcon size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.itemHeader}>
          <Image source={{ uri: foodItem.image }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{foodItem.name}</Text>
            <Text style={styles.itemPrice}>R{foodItem.price.toFixed(2)}</Text>
          </View>
        </View>

        {foodItem.sides && foodItem.sides.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Sides (up to 2)</Text>
            <Text style={styles.sectionSubtitle}>Included with your meal</Text>
            <View style={styles.optionsGrid}>
              {foodItem.sides.map((side) => (
                <TouchableOpacity
                  key={side.id}
                  style={[
                    styles.optionCard,
                    selectedSides.find((s) => s.id === side.id) && styles.optionCardSelected,
                  ]}
                  onPress={() => toggleSide(side)}
                >
                  <Text style={styles.optionName}>{side.name}</Text>
                  <Text style={styles.optionPrice}>Included</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {foodItem.drinks && foodItem.drinks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Drinks</Text>
            <View style={styles.optionsGrid}>
              {foodItem.drinks.map((drink) => (
                <TouchableOpacity
                  key={drink.id}
                  style={[
                    styles.optionCard,
                    selectedDrinks.find((d) => d.id === drink.id) && styles.optionCardSelected,
                  ]}
                  onPress={() => toggleDrink(drink)}
                >
                  <Text style={styles.optionName}>{drink.name}</Text>
                  <Text style={styles.optionPrice}>
                    {drink.included ? 'Included' : `+R${drink.price.toFixed(2)}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {foodItem.extras && foodItem.extras.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Extras</Text>
            <View style={styles.optionsGrid}>
              {foodItem.extras.map((extra) => (
                <TouchableOpacity
                  key={extra.id}
                  style={[
                    styles.optionCard,
                    selectedExtras.find((e) => e.id === extra.id) && styles.optionCardSelected,
                  ]}
                  onPress={() => toggleExtra(extra)}
                >
                  <Text style={styles.optionName}>{extra.name}</Text>
                  <Text style={styles.optionPriceAdd}>+R{extra.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {foodItem.ingredients && foodItem.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customize Ingredients</Text>
            <View style={styles.ingredientsList}>
              {foodItem.ingredients.map((ingredient) => {
                const isRemoved = removedIngredients.includes(ingredient.name);
                const isAdded = addedIngredients.includes(ingredient.name);
                return (
                  <TouchableOpacity
                    key={ingredient.id}
                    style={[
                      styles.ingredientItem,
                      isRemoved && styles.ingredientRemoved,
                      isAdded && styles.ingredientAdded,
                    ]}
                    onPress={() => toggleIngredient(ingredient)}
                  >
                    <Text style={styles.ingredientName}>
                      {isRemoved ? 'No ' : isAdded ? 'Extra ' : ''}
                      {ingredient.name}
                    </Text>
                    <Text style={styles.ingredientAction}>
                      {ingredient.removable && !isRemoved ? 'Tap to remove' : ''}
                      {ingredient.addable && !isAdded && !isRemoved ? 'Tap to add' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <CheckIcon size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#11181C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181C',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 14,
    minWidth: '45%',
    flex: 1,
  },
  optionCardSelected: {
    borderColor: '#11181C',
    backgroundColor: '#f0f9ff',
  },
  optionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
    marginBottom: 4,
  },
  optionPrice: {
    fontSize: 12,
    color: '#6b7280',
  },
  optionPriceAdd: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  ingredientsList: {
    marginTop: 12,
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  ingredientRemoved: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  ingredientAdded: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  ingredientAction: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
