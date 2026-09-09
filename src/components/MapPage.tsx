import React, { useState } from 'react';
import { Restaurant } from '../types';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  ArrowLeft, 
  Utensils, 
  Star, 
  Clock, 
  SlidersHorizontal,
  Search,
  Check
} from 'lucide-react';

interface MapPageProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onBack: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  restaurants,
  onSelectRestaurant,
  onBack,
}) => {
  const [selectedId, setSelectedId] = useState<number>(restaurants[0]?.id || 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [activeMobileTab, setActiveMobileTab] = useState<'map' | 'list'>('map');

  const cuisines = ['All', 'African & Grills', 'Italian', 'Asian & Sushi', 'Burgers & Fast Casual', 'Healthy & Salads'];
  const dietaryOptions = [
    { id: 'All', label: 'All Dietary' },
    { id: 'vegetarian', label: '🥬 Vegetarian' },
    { id: 'vegan', label: '🌱 Vegan' },
    { id: 'gluten-free', label: '🌾 Gluten-Free' },
  ];

  // Filter restaurants on map page
  const filteredRestaurants = restaurants.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.name.toLowerCase().includes(q);
      const matchAddress = r.location.address?.toLowerCase().includes(q);
      const matchCuisine = r.cuisine.toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchCuisine) return false;
    }
    if (selectedCuisine !== 'All' && r.cuisine !== selectedCuisine) {
      return false;
    }
    if (selectedDietary !== 'All') {
      if (!r.dietaryTags || !r.dietaryTags.includes(selectedDietary)) {
        return false;
      }
    }
    return true;
  });

  const activeRestaurant =
    restaurants.find((r) => r.id === selectedId) ||
    filteredRestaurants[0] ||
    restaurants[0];

  // OpenStreetMap embed URL centered on active restaurant location with marker
  // Coordinates are formatted to provide adequate area view around Victoria Island & Lekki
  const lat = activeRestaurant?.location.lat || 6.4281;
  const lng = activeRestaurant?.location.lng || 3.4219;
  
  // Bounding box with buffer around selected restaurant
  const deltaLat = 0.025;
  const deltaLng = 0.035;
  const bbox = `${lng - deltaLng}%2C${lat - deltaLat}%2C${lng + deltaLng}%2C${lat + deltaLat}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition active:scale-95"
              title="Return to Restaurant List"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Restaurants</span>
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-orange-100 text-orange-600">
                  <MapPin className="w-5 h-5" />
                </span>
                <span>Partnered Kitchens Map</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Full-screen geographic view of all 5 kitchens across Victoria Island, Ikoyi & Lekki
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{filteredRestaurants.length} Locations Visible</span>
            </span>
          </div>
        </div>

        {/* Filters & Search Toolbar inside Map Page */}
        <div className="pt-3 border-t border-stone-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter locations by name, street, or cuisine..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
            />
          </div>

          {/* Dietary Restrictions filter chips on Map */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap mr-1">
              Dietary:
            </span>
            {dietaryOptions.map((opt) => {
              const active = selectedDietary === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedDietary(opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile View Switcher (Map vs List) */}
        <div className="flex lg:hidden bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveMobileTab('map')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeMobileTab === 'map'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>Interactive Map View</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('list')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeMobileTab === 'list'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Utensils className="w-4 h-4 text-stone-700" />
            <span>Kitchens List ({filteredRestaurants.length})</span>
          </button>
        </div>
      </div>

      {/* Main Expansive Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* Left Column: Interactive Restaurant Location Cards */}
        <div
          className={`lg:col-span-5 flex flex-col space-y-3 lg:max-h-[760px] lg:overflow-y-auto pr-0 lg:pr-1.5 ${
            activeMobileTab === 'list' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Select kitchen to pinpoint ({filteredRestaurants.length})
            </span>
            <span className="text-xs text-stone-400">Click to focus</span>
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-200 space-y-2">
              <p className="text-stone-600 font-medium text-sm">No kitchens match your map search</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDietary('All');
                }}
                className="text-xs font-semibold text-orange-600 hover:underline"
              >
                Reset map filters
              </button>
            </div>
          )}

          {filteredRestaurants.map((rest, index) => {
            const isSelected = rest.id === activeRestaurant?.id;
            return (
              <div
                key={rest.id}
                onClick={() => {
                  setSelectedId(rest.id);
                  if (activeMobileTab === 'list') {
                    // Switch to map view on mobile when tapping
                    setActiveMobileTab('map');
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Pin badge number */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                      isSelected ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={rest.image}
                    alt={rest.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-stone-900 truncate">{rest.name}</h3>
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 shrink-0">
                        {rest.priceRange.replace(/\$/g, '₦')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-orange-600 truncate">{rest.cuisine}</span>
                      <span className="text-stone-300">•</span>
                      <span className="flex items-center gap-0.5 text-stone-700 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {rest.rating}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 flex items-start gap-1 pt-0.5">
                      <Navigation className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{rest.location.address}</span>
                    </p>

                    {/* Dietary badges */}
                    {rest.dietaryTags && rest.dietaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rest.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                          >
                            {tag === 'vegetarian'
                              ? '🥬 Vegetarian'
                              : tag === 'vegan'
                              ? '🌱 Vegan'
                              : tag === 'gluten-free'
                              ? '🌾 Gluten-Free'
                              : tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${rest.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1 transition"
                      title="Call Kitchen"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-600" />
                      <span className="hidden sm:inline text-[11px]">Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${rest.whatsapp}?text=${encodeURIComponent(
                        `Hello ${rest.name}, I found your location on the FoodHub Map.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1 transition"
                      title="WhatsApp Kitchen"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline text-[11px]">WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRestaurant(rest);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>View Menu</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full-Height Expansive Map Stage */}
        <div
          className={`lg:col-span-7 flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm relative min-h-[520px] lg:min-h-[760px] ${
            activeMobileTab === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Floating Top Control Bar */}
          <div className="p-3 sm:p-4 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
              <div className="min-w-0">
                <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider">
                  Active Location Pin
                </div>
                <div className="font-bold text-sm sm:text-base text-white truncate">
                  {activeRestaurant?.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition active:scale-95"
                title="Get navigation directions in Google Maps"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>

              <button
                onClick={() => onSelectRestaurant(activeRestaurant)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition active:scale-95"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Open Menu</span>
              </button>
            </div>
          </div>

          {/* Interactive Map IFrame with generous dimensions */}
          <div className="relative flex-1 w-full h-full min-h-[440px] bg-stone-100">
            <iframe
              title={`Map view for ${activeRestaurant?.name}`}
              src={osmUrl}
              className="w-full h-full min-h-[440px] border-0"
              loading="lazy"
            />
          </div>

          {/* Bottom Active Restaurant Showcase Card */}
          {activeRestaurant && (
            <div className="p-4 bg-white border-t border-stone-200 shadow-lg z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      {activeRestaurant.cuisine}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {activeRestaurant.deliveryTime}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs font-bold text-stone-700 font-mono">
                      {activeRestaurant.priceRange.replace(/\$/g, '₦')}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                    {activeRestaurant.name}
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{activeRestaurant.location.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${activeRestaurant.phone}`}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs flex items-center gap-1.5 transition font-semibold"
                  >
                    <Phone className="w-4 h-4 text-stone-600" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${activeRestaurant.whatsapp}?text=${encodeURIComponent(
                      `Hello ${activeRestaurant.name}, I am ordering through FoodHub.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs flex items-center gap-1.5 transition font-semibold"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={() => onSelectRestaurant(activeRestaurant)}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>View Menu & Order</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
