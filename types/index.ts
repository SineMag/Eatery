export interface FoodCategory {
  id: string;
  name: string;
  order: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  sides?: Option[];
  drinks?: Option[];
  extras?: Option[];
  optionalIngredients?: Option[];
}

export interface Option {
  id: string;
  name: string;
  price?: number;
}

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  selectedSides?: Option[];
  selectedDrinks?: Option[];
  selectedExtras?: Option[];
  selectedIngredients?: Option[];
  customizations?: {
    removeIngredients: string[];
    addIngredients: string[];
  };
}

export interface User {
  uid: string;
  email: string;
  name: string;
  surname: string;
  contactNumber: string;
  address: string;
  profileImage?: string;
  cardDetails?: CardDetails;
}

export interface CardDetails {
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  foodItem: FoodItem;
  quantity: number;
  selectedSides?: Option[];
  selectedDrinks?: Option[];
  selectedExtras?: Option[];
  selectedIngredients?: Option[];
  customizations?: {
    removeIngredients: string[];
    addIngredients: string[];
  };
  subtotal: number;
}
