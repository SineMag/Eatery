import { FoodCategory, FoodItem } from '../types';

export const categories: FoodCategory[] = [
  { id: '1', name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: '2', name: 'Mains', icon: '🍽️', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
  { id: '3', name: 'Starters', icon: '🥗', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' },
  { id: '4', name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
  { id: '5', name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
  { id: '6', name: 'Alcohol', icon: '🍺', image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400' },
];

export const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty with fresh lettuce, tomato, pickles, and our special sauce on a toasted brioche bun.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    categoryId: '1',
    sides: [
      { id: 's1', name: 'French Fries', price: 0, included: true },
      { id: 's2', name: 'Sweet Potato Fries', price: 0, included: true },
      { id: 's3', name: 'Coleslaw', price: 0, included: true },
      { id: 's4', name: 'Garden Salad', price: 0, included: true },
    ],
    drinks: [
      { id: 'd1', name: 'Coca-Cola', price: 0, included: true },
      { id: 'd2', name: 'Sprite', price: 0, included: true },
      { id: 'd3', name: 'Fanta', price: 0, included: true },
      { id: 'd4', name: 'Milkshake', price: 25, included: false },
    ],
    extras: [
      { id: 'e1', name: 'Extra Patty', price: 35 },
      { id: 'e2', name: 'Bacon', price: 20 },
      { id: 'e3', name: 'Cheese', price: 15 },
      { id: 'e4', name: 'Fried Egg', price: 12 },
      { id: 'e5', name: 'Extra Sauce', price: 8 },
    ],
    ingredients: [
      { id: 'i1', name: 'Lettuce', removable: true, addable: false },
      { id: 'i2', name: 'Tomato', removable: true, addable: false },
      { id: 'i3', name: 'Pickles', removable: true, addable: false },
      { id: 'i4', name: 'Onion', removable: true, addable: true },
      { id: 'i5', name: 'Jalapeños', removable: false, addable: true },
    ],
  },
  {
    id: '2',
    name: 'Chicken Burger',
    description: 'Crispy fried chicken breast with mayo, lettuce, and tomato on a sesame seed bun.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    categoryId: '1',
    sides: [
      { id: 's1', name: 'French Fries', price: 0, included: true },
      { id: 's2', name: 'Onion Rings', price: 0, included: true },
      { id: 's3', name: 'Coleslaw', price: 0, included: true },
    ],
    drinks: [
      { id: 'd1', name: 'Coca-Cola', price: 0, included: true },
      { id: 'd2', name: 'Iced Tea', price: 0, included: true },
    ],
    extras: [
      { id: 'e1', name: 'Extra Chicken', price: 30 },
      { id: 'e2', name: 'Cheese', price: 15 },
      { id: 'e3', name: 'Avocado', price: 25 },
    ],
    ingredients: [
      { id: 'i1', name: 'Lettuce', removable: true, addable: false },
      { id: 'i2', name: 'Tomato', removable: true, addable: false },
      { id: 'i3', name: 'Mayo', removable: true, addable: false },
    ],
  },
  {
    id: '3',
    name: 'Grilled Chicken Breast',
    description: 'Tender grilled chicken breast served with seasonal vegetables and your choice of sides.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
    categoryId: '2',
    sides: [
      { id: 's1', name: 'Mashed Potatoes', price: 0, included: true },
      { id: 's2', name: 'Rice', price: 0, included: true },
      { id: 's3', name: 'Grilled Vegetables', price: 0, included: true },
      { id: 's4', name: 'Pap', price: 0, included: true },
    ],
    drinks: [
      { id: 'd1', name: 'Still Water', price: 0, included: true },
      { id: 'd2', name: 'Sparkling Water', price: 10, included: false },
      { id: 'd3', name: 'Fresh Juice', price: 25, included: false },
    ],
    extras: [
      { id: 'e1', name: 'Extra Vegetables', price: 20 },
      { id: 'e2', name: 'Mushroom Sauce', price: 18 },
      { id: 'e3', name: 'Pepper Sauce', price: 18 },
    ],
    ingredients: [
      { id: 'i1', name: 'Herbs', removable: true, addable: false },
      { id: 'i2', name: 'Garlic Butter', removable: true, addable: true },
    ],
  },
  {
    id: '4',
    name: 'Beef Steak',
    description: '250g premium beef sirloin cooked to your preference, served with chips and salad.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400',
    categoryId: '2',
    sides: [
      { id: 's1', name: 'Chips', price: 0, included: true },
      { id: 's2', name: 'Baked Potato', price: 0, included: true },
      { id: 's3', name: 'Garden Salad', price: 0, included: true },
    ],
    drinks: [
      { id: 'd1', name: 'House Wine (Glass)', price: 45, included: false },
      { id: 'd2', name: 'Craft Beer', price: 35, included: false },
    ],
    extras: [
      { id: 'e1', name: 'Prawns', price: 55 },
      { id: 'e2', name: 'Cheese Sauce', price: 20 },
      { id: 'e3', name: 'Mushroom Sauce', price: 20 },
    ],
    ingredients: [
      { id: 'i1', name: 'Garlic Butter', removable: true, addable: true },
    ],
  },
  {
    id: '5',
    name: 'Crispy Calamari',
    description: 'Golden fried calamari rings served with tartar sauce and lemon wedges.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    categoryId: '3',
    drinks: [
      { id: 'd1', name: 'Lemonade', price: 0, included: true },
    ],
    extras: [
      { id: 'e1', name: 'Extra Sauce', price: 10 },
      { id: 'e2', name: 'Chilli Sauce', price: 8 },
    ],
    ingredients: [],
  },
  {
    id: '6',
    name: 'Spring Rolls',
    description: 'Crispy vegetable spring rolls served with sweet chilli dipping sauce.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76978d54b8d?w=400',
    categoryId: '3',
    extras: [
      { id: 'e1', name: 'Extra Dipping Sauce', price: 8 },
    ],
    ingredients: [],
  },
  {
    id: '7',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
    price: 65.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    categoryId: '4',
    extras: [
      { id: 'e1', name: 'Extra Ice Cream', price: 15 },
      { id: 'e2', name: 'Whipped Cream', price: 10 },
      { id: 'e3', name: 'Chocolate Sauce', price: 8 },
    ],
    ingredients: [],
  },
  {
    id: '8',
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake with berry compote.',
    price: 55.99,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
    categoryId: '4',
    extras: [
      { id: 'e1', name: 'Extra Berry Compote', price: 12 },
      { id: 'e2', name: 'Whipped Cream', price: 10 },
    ],
    ingredients: [],
  },
  {
    id: '9',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, 100% natural.',
    price: 35.99,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
    categoryId: '5',
    extras: [],
    ingredients: [],
  },
  {
    id: '10',
    name: 'Milkshake',
    description: 'Creamy milkshake available in chocolate, vanilla, or strawberry.',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    categoryId: '5',
    extras: [
      { id: 'e1', name: 'Whipped Cream', price: 8 },
      { id: 'e2', name: 'Extra Syrup', price: 5 },
    ],
    ingredients: [],
  },
  {
    id: '11',
    name: 'Craft Beer',
    description: 'Selection of local craft beers, 500ml.',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400',
    categoryId: '6',
    extras: [],
    ingredients: [],
  },
  {
    id: '12',
    name: 'House Wine',
    description: 'Glass of red or white house wine, 175ml.',
    price: 55.99,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
    categoryId: '6',
    extras: [],
    ingredients: [],
  },
];

export const getFoodItemsByCategory = (categoryId: string): FoodItem[] => {
  return foodItems.filter(item => item.categoryId === categoryId);
};

export const getFoodItemById = (id: string): FoodItem | undefined => {
  return foodItems.find(item => item.id === id);
};

export const getCategoryById = (id: string): FoodCategory | undefined => {
  return categories.find(cat => cat.id === id);
};
