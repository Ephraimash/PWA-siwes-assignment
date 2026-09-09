import React from 'react';
import { Order, CartItem } from '../types';
import { X, Clock, ShoppingBag, ArrowRight, RotateCcw, CheckCircle2, ChevronRight } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onReorder: (items: CartItem[]) => void;
  onClearHistory: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onReorder,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="order-history-modal"
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
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">Order History</h2>
              <span className="text-xs text-stone-500">
                {orders.length} past {orders.length === 1 ? 'order' : 'orders'} saved locally
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-stone-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-stone-100 transition"
                title="Clear local order history"
              >
                Clear History
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

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-800 text-base">No orders yet</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Your simulated orders will be remembered in local storage so you can review receipts and track delivery anytime.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const dateFormatted = new Date(order.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const totalItemCount = order.items.reduce((s, i) => s + i.quantity, 0);

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-orange-200 hover:shadow-xs transition space-y-3"
                  >
                    {/* Top line: Restaurant & Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-900">{order.restaurantName}</span>
                        <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <span>#{order.id}</span>
                          <span>•</span>
                          <span>{dateFormatted}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'on_the_way'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Items summary */}
                    <div className="text-xs text-stone-600 line-clamp-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(' • ')}
                    </div>

                    {/* Bottom row: Total, Track Order CTA, and Reorder CTA */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs font-semibold text-stone-900">
                        Total: <span className="font-mono text-orange-600 font-bold">₦{order.total.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onReorder(order.items);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition"
                          title="Add items back to cart"
                        >
                          <RotateCcw className="w-3 h-3 text-stone-500" />
                          <span>Reorder</span>
                        </button>

                        <button
                          onClick={() => {
                            onSelectOrder(order);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                        >
                          <span>Track</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition"
          >
            Back to FoodHub
          </button>
        </div>
      </div>
    </div>
  );
};
