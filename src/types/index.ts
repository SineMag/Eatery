export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  contactNumber: string;
  address: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  isAdmin?: boolean;
  isStaff?: boolean;
  staffId?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface SideOption {
  id: string;
  name: string;
  price: number;
  included: boolean;
}

export interface DrinkOption {
  id: string;
  name: string;
  price: number;
  included: boolean;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface IngredientOption {
  id: string;
  name: string;
  removable: boolean;
  addable: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  sides?: SideOption[];
  drinks?: DrinkOption[];
  extras?: ExtraOption[];
  ingredients?: IngredientOption[];
}

export interface CartItemCustomization {
  selectedSides: SideOption[];
  selectedDrinks: DrinkOption[];
  selectedExtras: ExtraOption[];
  removedIngredients: string[];
  addedIngredients: string[];
  notes?: string;
}

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  customization: CartItemCustomization;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'deleted';
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  userName?: string;
  userContact?: string;
}
