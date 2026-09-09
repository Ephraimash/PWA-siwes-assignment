export interface RestaurantLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '₦' | '₦₦' | '₦₦₦';
  image: string;
  location: RestaurantLocation;
  phone: string;
  whatsapp: string;
  deliveryTime?: string;
  minimumOrder?: number;
  description?: string;
  dietaryTags?: string[];
}

export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'dairy-free';

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  dietary?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  restaurant: Restaurant;
  quantity: number;
}

export type OrderStatus = 'preparing' | 'on_the_way' | 'delivered';

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  address: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  restaurantId: number;
  restaurantName: string;
  restaurantPhone: string;
  restaurantWhatsapp: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerInfo: OrderCustomerInfo;
  status: OrderStatus;
  statusUpdatedAt: string;
}

export interface RestaurantFilters {
  searchQuery: string;
  cuisine: string;
  priceRange: string;
  minRating: number;
  dietary: string; // 'All' | 'vegetarian' | 'vegan' | 'gluten-free'
}
