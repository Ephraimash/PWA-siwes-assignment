import React, { useState, useEffect, useMemo } from 'react';
import { Restaurant, MenuItem, CartItem, Order, OrderStatus, RestaurantFilters } from './types';
import { INITIAL_RESTAURANTS, INITIAL_MENUS } from './data/mockData';
import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { RestaurantList } from './components/RestaurantList';
import { MenuPage } from './components/MenuPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { MapPage } from './components/MapPage';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_CART = 'foodhub_cart_v1';
const STORAGE_KEY_ORDERS = 'foodhub_orders_v1';

type ActiveView = 'restaurants' | 'menu' | 'map';

export default function App() {
  // Restaurants and Menus state
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);

  // Active view and selected restaurant
  const [currentView, setCurrentView] = useState<ActiveView>('restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Filters state (including dietary)
  const [filters, setFilters] = useState<RestaurantFilters>({
    searchQuery: '',
    cuisine: 'All',
    priceRange: 'All',
    minRating: 0,
    dietary: 'All',
  });

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Order History State (Persisted in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active tracking order (for OrderStatusModal)
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Modal display states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Try fetching external static JSON data on mount (caches through service worker)
  useEffect(() => {
    async function loadData() {
      try {
        const resRestaurants = await fetch('/data/restaurants.json');
        if (resRestaurants.ok) {
          const data = await resRestaurants.json();
          if (Array.isArray(data) && data.length > 0) {
            setRestaurants(data);
          }
        }
      } catch (err) {
        console.warn('Using bundled restaurant data fallback', err);
      }

      try {
        const resMenus = await fetch('/data/menus.json');
        if (resMenus.ok) {
          const data = await resMenus.json();
          if (Array.isArray(data) && data.length > 0) {
            setMenus(data);
          }
        }
      } catch (err) {
        console.warn('Using bundled menu data fallback', err);
      }
    }

    loadData();
  }, []);

  // Cart Handlers
  const handleAddToCart = (item: MenuItem, restaurant: Restaurant, quantity = 1) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (ci) => ci.menuItem.id === item.id && ci.restaurant.id === restaurant.id
      );
      if (existingIdx >= 0) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { menuItem: item, restaurant, quantity }];
      }
    });
    showToast(`Added "${item.name}" to cart`);
  };

  const handleUpdateQuantity = (menuItemId: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((ci) => {
          if (ci.menuItem.id === menuItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (menuItemId: number) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.menuItem.id !== menuItemId));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  // Order placement handler
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart after placing order
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveTrackingOrder(newOrder);
    setIsOrderStatusOpen(true);
    showToast(`Order #${newOrder.id} placed successfully!`);
  };

  // Order status progression handler
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: nextStatus,
              statusUpdatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              statusUpdatedAt: new Date().toISOString(),
            }
          : null
      );
    }
  };

  // Reorder past items
  const handleReorder = (items: CartItem[]) => {
    setCart((prev) => {
      const merged = [...prev];
      items.forEach((newItem) => {
        const match = merged.find(
          (m) => m.menuItem.id === newItem.menuItem.id && m.restaurant.id === newItem.restaurant.id
        );
        if (match) {
          match.quantity += newItem.quantity;
        } else {
          merged.push({ ...newItem });
        }
      });
      return merged;
    });
    setIsCartOpen(true);
    showToast(`Added ${items.length} items from previous order to cart!`);
  };

  const handleClearHistory = () => {
    setOrders([]);
    showToast('Order history cleared');
  };

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<RestaurantFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      cuisine: 'All',
      priceRange: 'All',
      minRating: 0,
      dietary: 'All',
    });
  };

  // Navigation handlers
  const handleSelectRestaurant = (rest: Restaurant) => {
    setSelectedRestaurant(rest);
    setCurrentView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedRestaurant(null);
    setCurrentView('restaurants');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMap = () => {
    setCurrentView('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active restaurant menu items
  const activeRestaurantMenu = useMemo(() => {
    if (!selectedRestaurant) return [];
    return menus.filter((m) => m.restaurantId === selectedRestaurant.id);
  }, [menus, selectedRestaurant]);

  // Cart summary calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      {/* Offline Connectivity Notification Banner */}
      <OfflineBanner />

      {/* Persistent Navigation Header */}
      <Header
        cartItemCount={cartItemCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsOrderHistoryOpen(true)}
        onOpenMap={handleOpenMap}
        onGoHome={handleGoHome}
        orderCount={orders.length}
        isMapActive={currentView === 'map'}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentView === 'map' ? (
          /* Dedicated Kitchens Map Page */
          <MapPage
            restaurants={restaurants}
            onSelectRestaurant={handleSelectRestaurant}
            onBack={handleGoHome}
          />
        ) : currentView === 'menu' && selectedRestaurant ? (
          /* Restaurant Menu Page */
          <MenuPage
            restaurant={selectedRestaurant}
            menuItems={activeRestaurantMenu}
            cartItems={cart}
            onBack={handleGoHome}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenCart={() => setIsCartOpen(true)}
          />
        ) : (
          /* Home Restaurant Listing */
          <RestaurantList
            restaurants={restaurants}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSelectRestaurant={handleSelectRestaurant}
            onOpenMap={handleOpenMap}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-800">FoodHub</span>
            <span>• Multi-Restaurant Food Delivery PWA</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Offline-first PWA</span>
            <span>•</span>
            <span>Simulated Mock Engine</span>
            <span>•</span>
            <button
              onClick={handleOpenMap}
              className="text-orange-600 hover:underline font-medium"
            >
              5 Partner Locations Map
            </button>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onBrowseRestaurants={handleGoHome}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Order Status & Tracking Modal */}
      {activeTrackingOrder && (
        <OrderStatusModal
          order={activeTrackingOrder}
          isOpen={isOrderStatusOpen}
          onClose={() => setIsOrderStatusOpen(false)}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => {
          setActiveTrackingOrder(ord);
          setIsOrderStatusOpen(true);
        }}
        onReorder={handleReorder}
        onClearHistory={handleClearHistory}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          id="foodhub-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-stone-900 text-white px-4 py-3 text-xs font-semibold shadow-xl animate-in slide-in-from-bottom-5 duration-200 border border-stone-800"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
