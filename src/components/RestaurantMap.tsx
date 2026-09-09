import React, { useState } from 'react';
import { Restaurant } from '../types';
import { MapPin, Navigation, Phone, MessageCircle, ExternalLink, X, Utensils } from 'lucide-react';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurants,
  onSelectRestaurant,
  onClose,
  isModal = false,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(restaurants[0]?.id || 1);
  const activeRestaurant = restaurants.find((r) => r.id === selectedId) || restaurants[0];

  // OpenStreetMap embed URL covering the Victoria Island / Ikoyi / Lekki corridor
  // Bounding box: min_lon=3.400, min_lat=6.410, max_lon=3.490, max_lat=6.475
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=3.4000%2C6.4100%2C3.4950%2C6.4750&layer=mapnik&marker=${activeRestaurant?.location.lat}%2C${activeRestaurant?.location.lng}`;

  const content = (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
      {/* Map Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">Restaurant Locations</h3>
            <p className="text-xs text-stone-500">Visual reference map for all 5 partnered restaurants</p>
          </div>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Map Body: Grid on desktop, stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 min-h-[420px]">
        {/* Left: Restaurant Location Pins Selector */}
        <div className="p-3 border-b lg:border-b-0 lg:border-r border-stone-200 bg-stone-50/50 space-y-2 max-h-[300px] lg:max-h-none overflow-y-auto">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
            Tap to highlight on map ({restaurants.length} locations)
          </div>
          {restaurants.map((rest, idx) => {
            const isSelected = rest.id === selectedId;
            return (
              <div
                key={rest.id}
                onClick={() => setSelectedId(rest.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50/90 border-orange-300 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h4 className="font-semibold text-sm text-stone-900 leading-tight">{rest.name}</h4>
                  </div>
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                    {rest.priceRange.replace(/\$/g, '₦')}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 pl-7 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-orange-500 shrink-0" />
                  <span className="truncate">{rest.location.address || 'Victoria Island, Lagos'}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Embedded Map + Active Location Details Bar */}
        <div className="lg:col-span-2 flex flex-col relative bg-stone-100 min-h-[320px]">
          <iframe
            title="Restaurant Locations Reference Map"
            src={osmUrl}
            className="w-full flex-1 border-0 min-h-[280px]"
            loading="lazy"
          />

          {/* Active Location Info Pill */}
          {activeRestaurant && (
            <div className="p-3 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                    {activeRestaurant.cuisine}
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs font-medium text-stone-600">★ {activeRestaurant.rating}</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">{activeRestaurant.name}</h4>
                <p className="text-xs text-stone-500 truncate max-w-sm">{activeRestaurant.location.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeRestaurant.phone}`}
                  className="p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 text-xs flex items-center gap-1 transition"
                  title="Call Restaurant"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Call</span>
                </a>
                <a
                  href={`https://wa.me/${activeRestaurant.whatsapp}?text=${encodeURIComponent(
                    `Hello ${activeRestaurant.name}, I am inquiring about your menu.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs flex items-center gap-1 transition"
                  title="WhatsApp Restaurant"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    onSelectRestaurant(activeRestaurant);
                    if (onClose) onClose();
                  }}
                  className="px-3 py-2 rounded-lg bg-orange-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-orange-700 shadow-xs transition"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>View Menu</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        id="restaurant-map-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
      >
        <div
          className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
};
