import React, { useState } from 'react';
import { CartItem, Order, OrderCustomerInfo } from '../types';
import { X, CheckCircle2, ShieldCheck, MapPin, User, Phone, FileText, WifiOff, CreditCard, ArrowLeft } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onPlaceOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onPlaceOrder,
}) => {
  const isOnline = useOnlineStatus();

  // Form State
  const [formData, setFormData] = useState<OrderCustomerInfo>({
    name: 'Alex Johnson',
    phone: '+234 801 234 5678',
    address: 'Apartment 4B, 12 Ahmadu Bello Way, Victoria Island, Lagos',
    deliveryNotes: 'Please ring bell 4B or call on arrival.',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 40 ? 0 : 2.99;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const primaryRestaurant = cartItems[0]?.restaurant;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOnline) {
      setFormError('Placing an order requires an active internet connection.');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setFormError('Please fill in your name, contact phone number, and delivery address.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    // Simulate 800ms order dispatch network simulation
    setTimeout(() => {
      const newOrder: Order = {
        id: `FH-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        restaurantId: primaryRestaurant?.id || 1,
        restaurantName: primaryRestaurant?.name || 'FoodHub Kitchen',
        restaurantPhone: primaryRestaurant?.phone || '+2348012345678',
        restaurantWhatsapp: primaryRestaurant?.whatsapp || '2348012345678',
        items: [...cartItems],
        subtotal,
        deliveryFee,
        total,
        customerInfo: { ...formData },
        status: 'preparing',
        statusUpdatedAt: new Date().toISOString(),
      };

      setIsSubmitting(false);
      onPlaceOrder(newOrder);
    }, 800);
  };

  return (
    <div
      id="checkout-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Simulated Checkout</h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-200/70 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mock Mode (No Real Charges)</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {formError}
            </div>
          )}

          {!isOnline && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-700 shrink-0 animate-pulse" />
              <span>
                <strong>Offline:</strong> You are currently offline. Please reconnect to submit this simulated order.
              </span>
            </div>
          )}

          {/* Delivery Details Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1. Delivery Details
              </span>
              <span className="text-[11px] text-stone-400">Recipient information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                  placeholder="e.g. Alex Johnson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>Phone (for courier)</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                  placeholder="+234..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Delivery Address</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                placeholder="Street address, building name, flat number..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
                <span>Delivery Instructions (Optional)</span>
              </label>
              <input
                type="text"
                value={formData.deliveryNotes || ''}
                onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                placeholder="Gate code, landmark, leave at door..."
              />
            </div>
          </div>

          {/* Simulated Payment Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                2. Simulated Payment Method
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Demo Only</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'cash'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-bold ring-1 ring-orange-500'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span className="text-xs">Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-bold ring-1 ring-orange-500'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span className="text-xs">POS / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'transfer'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-bold ring-1 ring-orange-500'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span className="text-xs">Instant Transfer</span>
              </button>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="font-bold text-stone-800 text-xs uppercase tracking-wider pb-1 border-b border-stone-200/60">
              Order Items ({cartItems.length})
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {cartItems.map((ci) => (
                <div key={ci.menuItem.id} className="flex justify-between text-stone-600">
                  <span className="truncate max-w-[260px]">
                    {ci.quantity}x {ci.menuItem.name}
                  </span>
                  <span className="font-mono">₦{(ci.menuItem.price * ci.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200/60 flex justify-between font-extrabold text-sm text-stone-900">
              <span>Total to Pay</span>
              <span className="text-orange-600 font-mono">₦{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA (Feature 6) */}
          <button
            id="place-simulated-order-btn"
            type="submit"
            disabled={isSubmitting || !isOnline}
            className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
              isOnline && !isSubmitting
                ? 'bg-orange-600 hover:bg-orange-700 text-white active:scale-98'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Order with Kitchen...</span>
              </span>
            ) : isOnline ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Place Simulated Order (₦{total.toFixed(2)})</span>
              </span>
            ) : (
              <span>Internet Connection Required</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
