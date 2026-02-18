import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/src/contexts/CartContext';
import { useMenu } from '@/src/contexts/MenuContext';
import { SideOption, DrinkOption, ExtraOption, CartItemCustomization } from '@/src/types';
import { 
  BackIcon, 
  PlusIcon, 
  MinusIcon, 
  CartIcon,
  CheckIcon 
} from '@/src/components/Icons';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addItem } = useCart();
  const { getMenuItemById, categories } = useMenu();

  const foodItem = getMenuItemById(id as string);
  const category = foodItem ? categories.find((entry) => entry.id === foodItem.categoryId) : null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState<SideOption[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkOption[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);

  const totalPrice = useMemo(() => {
    if (!foodItem) return 0;
    let price = foodItem.price;
    selectedDrinks.forEach((drink) => {
      if (!drink.included) price += drink.price;
    });
    selectedExtras.forEach((extra) => {
      price += extra.price;
    });
    return price * quantity;
  }, [foodItem, selectedDrinks, selectedExtras, quantity]);

  if (!foodItem) {
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

  const handleAddToCart = () => {
    const customization: CartItemCustomization = {
      selectedSides,
      selectedDrinks,
      selectedExtras,
      removedIngredients,
      addedIngredients,
    };
    addItem(foodItem, quantity, customization);
    Alert.alert('Added to Cart', `${quantity}x ${foodItem.name} added to your cart!`, [
      { text: 'Continue Shopping', onPress: () => router.back() },
      { text: 'View Cart', onPress: () => router.push('/cart') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
        <BackIcon size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: foodItem.image }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            {category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{category.name}</Text>
              </View>
            )}
            <Text style={styles.name}>{foodItem.name}</Text>
            <Text style={styles.description}>{foodItem.description}</Text>
            <Text style={styles.price}>R{foodItem.price.toFixed(2)}</Text>
          </View>

          {foodItem.sides && foodItem.sides.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Your Sides (up to 2)</Text>
              <Text style={styles.sectionSubtitle}>Included with your meal</Text>
              <View style={styles.optionsGrid}>
                {foodItem.sides.map((side) => {
                  const isSelected = selectedSides.find((s) => s.id === side.id);
                  return (
                    <TouchableOpacity
                      key={side.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={() => toggleSide(side)}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionName}>{side.name}</Text>
                        <Text style={styles.optionPrice}>Included</Text>
                      </View>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <CheckIcon size={14} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {foodItem.drinks && foodItem.drinks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Your Drinks</Text>
              <View style={styles.optionsGrid}>
                {foodItem.drinks.map((drink) => {
                  const isSelected = selectedDrinks.find((d) => d.id === drink.id);
                  return (
                    <TouchableOpacity
                      key={drink.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={() => toggleDrink(drink)}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionName}>{drink.name}</Text>
                        <Text style={drink.included ? styles.optionPrice : styles.optionPriceAdd}>
                          {drink.included ? 'Included' : `+R${drink.price.toFixed(2)}`}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <CheckIcon size={14} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {foodItem.extras && foodItem.extras.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Extras</Text>
              <View style={styles.optionsGrid}>
                {foodItem.extras.map((extra) => {
                  const isSelected = selectedExtras.find((e) => e.id === extra.id);
                  return (
                    <TouchableOpacity
                      key={extra.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={() => toggleExtra(extra)}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionName}>{extra.name}</Text>
                        <Text style={styles.optionPriceAdd}>+R{extra.price.toFixed(2)}</Text>
                      </View>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <CheckIcon size={14} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <MinusIcon size={20} color="#11181C" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <PlusIcon size={20} color="#11181C" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>R{totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <CartIcon size={20} color="#fff" />
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f3f4f6',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  categoryBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
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
  optionContent: {
    flex: 1,
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
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#11181C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientsList: {
    marginTop: 12,
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
  },
  quantityButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
    minWidth: 48,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    gap: 16,
  },
  totalContainer: {
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#11181C',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#11181C',
    paddingVertical: 16,
    borderRadius: 12,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
