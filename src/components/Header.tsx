import React from 'react';
import { ShoppingBag, Clock, MapPin, UtensilsCrossed, WifiOff } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  cartItemCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  onOpenMap: () => void;
  onGoHome: () => void;
  orderCount: number;
  isMapActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  cartSubtotal,
  onOpenCart,
  onOpenHistory,
  onOpenMap,
  onGoHome,
  orderCount,
  isMapActive = false,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
          title="FoodHub Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 leading-none">
                Food<span className="text-orange-600">Hub</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-none">Victoria Island & Lekki</span>
            </p>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline indicator badge in header */}
          {!isOnline && (
            <div
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300"
              title="You are currently offline. Local cache is being used."
            >
              <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-700" />
              <span className="hidden xs:inline">Offline</span>
            </div>
          )}

          {/* Map view button */}
          <button
            id="view-locations-map-btn"
            onClick={onOpenMap}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
              isMapActive
                ? 'bg-orange-600 text-white shadow-xs border border-orange-600'
                : 'border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
            }`}
            title="View restaurant locations map"
          >
            <MapPin className={`w-3.5 h-3.5 ${isMapActive ? 'text-white' : 'text-orange-600'}`} />
            <span className="hidden sm:inline">5 Locations Map</span>
          </button>

          {/* Orders History button */}
          <button
            id="orders-history-btn"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition active:scale-95"
            title="View Order History"
          >
            <Clock className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Orders</span>
            {orderCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">
                {orderCount}
              </span>
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Persistent Cart Button */}
          <button
            id="open-cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 rounded-full bg-stone-900 hover:bg-black text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition active:scale-95"
            aria-label={`Cart with ${cartItemCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-mono">
              ₦{cartSubtotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
