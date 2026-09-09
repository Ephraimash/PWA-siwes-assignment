import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, WifiOff, AlertTriangle, Store } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (menuItemId: number, delta: number) => void;
  onRemoveItem: (menuItemId: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onBrowseRestaurants: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onBrowseRestaurants,
}) => {
  const isOnline = useOnlineStatus();

  if (!isOpen) return null;

  // Subtotal & Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? (subtotal >= 40 ? 0 : 2.99) : 0;
  const tax = subtotal * 0.05; // 5% consumption tax
  const total = subtotal + deliveryFee + tax;

  // Group items by restaurant
  const groupedByRestaurant: Record<number, { name: string; items: CartItem[] }> = {};
  cartItems.forEach((item) => {
    const rid = item.restaurant.id;
    if (!groupedByRestaurant[rid]) {
      groupedByRestaurant[rid] = { name: item.restaurant.name, items: [] };
    }
    groupedByRestaurant[rid].items.push(item);
  });

  const restaurantCount = Object.keys(groupedByRestaurant).length;

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-stone-900 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-stone-900 leading-none">Your Cart</h2>
              <span className="text-xs text-stone-500">
                {cartItems.reduce((s, i) => s + i.quantity, 0)} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-stone-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-stone-100 transition"
                title="Clear all items in cart"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Empty Cart State */}
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-stone-800 text-base">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Explore menus from our 5 top restaurants and add freshly prepared dishes to start an order.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBrowseRestaurants();
                }}
                className="px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Multi-restaurant note if applicable */}
              {restaurantCount > 1 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Your cart contains items from <strong>{restaurantCount} different restaurants</strong>. Deliveries will be scheduled concurrently.
                  </span>
                </div>
              )}

              {/* Items grouped by restaurant */}
              {Object.entries(groupedByRestaurant).map(([rid, group]) => (
                <div key={rid} className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider pb-1 border-b border-stone-100">
                    <Store className="w-3.5 h-3.5 text-orange-600" />
                    <span>{group.name}</span>
                  </div>

                  <div className="space-y-2.5">
                    {group.items.map((item) => {
                      const lineTotal = item.menuItem.price * item.quantity;
                      return (
                        <div
                          key={item.menuItem.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition"
                        >
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0 bg-stone-200"
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                              {item.menuItem.name}
                            </h4>
                            <div className="text-xs text-stone-500 font-mono">
                              ₦{item.menuItem.price.toFixed(2)} each
                            </div>
                            <div className="font-bold text-xs text-stone-900 font-mono mt-0.5">
                              Total: ₦{lineTotal.toFixed(2)}
                            </div>
                          </div>

                          {/* Stepper + Delete */}
                          <div className="flex items-center gap-1">
                            <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
                              <button
                                onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                                className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-stone-100 active:scale-95 transition"
                                title="Decrease"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                                className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-stone-100 active:scale-95 transition"
                                title="Increase"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.menuItem.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer / Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-medium">₦{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-mono font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE (₦40+ promo)</span>
                  ) : (
                    `₦${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Service (5%)</span>
                <span className="font-mono font-medium">₦{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Amount</span>
                <span className="font-mono text-base text-orange-600">₦{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Offline Checkout Notice (Feature 11 Requirement) */}
            {!isOnline && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-amber-700 shrink-0 animate-pulse" />
                <span>
                  <strong>Offline Mode:</strong> Reconnect to the internet before completing simulated checkout.
                </span>
              </div>
            )}

            {/* Proceed to Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={onProceedToCheckout}
              disabled={!isOnline}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                isOnline
                  ? 'bg-orange-600 hover:bg-orange-700 text-white active:scale-98'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <span>{isOnline ? 'Proceed to Simulated Checkout' : 'Requires Internet to Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
