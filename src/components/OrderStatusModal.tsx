import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircle2, Clock, Truck, ChefHat, PackageCheck, Phone, MessageCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface OrderStatusModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateOrderStatus,
}) => {
  // Timer auto-advance simulation
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);

  useEffect(() => {
    if (!isOpen || !autoAdvanceEnabled) return;
    if (order.status === 'delivered') return;

    // Advance automatically after 20 seconds
    const timer = setTimeout(() => {
      if (order.status === 'preparing') {
        onUpdateOrderStatus(order.id, 'on_the_way');
      } else if (order.status === 'on_the_way') {
        onUpdateOrderStatus(order.id, 'delivered');
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [order.id, order.status, isOpen, autoAdvanceEnabled, onUpdateOrderStatus]);

  if (!isOpen) return null;

  const handleNextStage = () => {
    if (order.status === 'preparing') {
      onUpdateOrderStatus(order.id, 'on_the_way');
    } else if (order.status === 'on_the_way') {
      onUpdateOrderStatus(order.id, 'delivered');
    }
  };

  const stages: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'preparing',
      label: 'Preparing in Kitchen',
      desc: 'The chef is preparing your dishes with fresh ingredients.',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      key: 'on_the_way',
      label: 'On the Way',
      desc: 'A dispatch rider is en route to your delivery address.',
      icon: <Truck className="w-5 h-5" />,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      desc: 'Order safely delivered. Bon appétit!',
      icon: <PackageCheck className="w-5 h-5" />,
    },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'preparing':
        return 0;
      case 'on_the_way':
        return 1;
      case 'delivered':
        return 2;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(order.status);

  // WhatsApp link pre-filled with order ID
  const whatsappUrl = `https://wa.me/${order.restaurantWhatsapp}?text=${encodeURIComponent(
    `Hello ${order.restaurantName}, I am following up on my FoodHub Order #${order.id}.`
  )}`;

  return (
    <div
      id="order-status-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              title="Close"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Order Live Status</h2>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  #{order.id}
                </span>
              </div>
              <p className="text-xs text-orange-100">{order.restaurantName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                order.status === 'delivered'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-orange-700'
              }`}
            >
              {order.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Progress Timeline Stepper */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Delivery Stages
              </span>
              {order.status !== 'delivered' && (
                <span className="text-[11px] text-orange-600 font-medium flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" />
                  <span>Auto-advancing (or use manual button)</span>
                </span>
              )}
            </div>

            {/* Stepper bar */}
            <div className="relative pl-6 space-y-6 border-l-2 border-stone-200 ml-3">
              {stages.map((stage, idx) => {
                const isPast = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                const isUpcoming = idx > currentStageIdx;

                return (
                  <div key={stage.key} className="relative">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isPast
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-100 shadow-md animate-pulse'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : stage.icon}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-bold text-sm ${
                            isCurrent
                              ? 'text-orange-600'
                              : isPast
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {stage.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demo Stage Advance Button (Requirement 6) */}
          {order.status !== 'delivered' && (
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-600">
                <span className="font-bold text-stone-900">Demo Controller:</span> Manually push order to the next stage to inspect status updates instantly.
              </div>
              <button
                id="advance-order-stage-btn"
                onClick={handleNextStage}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5 active:scale-95 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Next Stage: {currentStageIdx === 0 ? 'On the Way' : 'Delivered'}</span>
              </button>
            </div>
          )}

          {/* Restaurant Direct Contact (Feature 7 & 8) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Direct Contact with {order.restaurantName}
              </span>
              <span className="text-[11px] text-stone-400">Call or WhatsApp</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${order.restaurantPhone}`}
                className="py-2.5 px-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-orange-600" />
                <span>Call Restaurant</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Order #{order.id}</span>
              </a>
            </div>
          </div>

          {/* Order Details & Delivery Info */}
          <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
            <div className="flex justify-between">
              <span>Delivery To:</span>
              <span className="font-semibold text-stone-900 text-right max-w-xs truncate">
                {order.customerInfo.address}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-semibold text-stone-900">
                {order.customerInfo.name} ({order.customerInfo.phone})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span className="font-semibold text-stone-900">
                {order.items.reduce((s, i) => s + i.quantity, 0)} items ({order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')})
              </span>
            </div>
            <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-100">
              <span>Total Paid:</span>
              <span className="text-orange-600 font-mono">₦{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition active:scale-98"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
