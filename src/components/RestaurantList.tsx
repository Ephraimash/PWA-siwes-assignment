import React from 'react';
import { Restaurant, RestaurantFilters } from '../types';
import { Search, Star, Clock, Phone, MessageCircle, MapPin, X, SlidersHorizontal, ArrowRight, DollarSign } from 'lucide-react';

interface RestaurantListProps {
  restaurants: Restaurant[];
  filters: RestaurantFilters;
  onFilterChange: (newFilters: Partial<RestaurantFilters>) => void;
  onResetFilters: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onOpenMap: () => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectRestaurant,
  onOpenMap,
}) => {
  // Unique cuisines available
  const cuisines = ['All', 'African & Grills', 'Italian', 'Asian & Sushi', 'Burgers & Fast Casual', 'Healthy & Salads'];
  const priceRanges = ['All', '₦', '₦₦', '₦₦₦'];
  const ratingOptions = [
    { label: 'All Ratings', value: 0 },
    { label: '★ 4.5+', value: 4.5 },
    { label: '★ 4.7+', value: 4.7 },
    { label: '★ 4.8+', value: 4.8 },
  ];
  const dietaryOptions = [
    { id: 'All', label: 'All Dietary' },
    { id: 'vegetarian', label: '🥬 Vegetarian' },
    { id: 'vegan', label: '🌱 Vegan' },
    { id: 'gluten-free', label: '🌾 Gluten-Free' },
  ];

  // Filtering logic
  const filteredRestaurants = restaurants.filter((r) => {
    // Search query match (name, cuisine, description, address, or dietary tags)
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisine.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchAddress = r.location.address?.toLowerCase().includes(q);
      const matchDietary = r.dietaryTags?.some(
        (t) => t.toLowerCase().includes(q) || (q === 'gf' && t === 'gluten-free')
      );
      if (!matchName && !matchCuisine && !matchDesc && !matchAddress && !matchDietary) return false;
    }

    // Cuisine filter
    if (filters.cuisine !== 'All' && r.cuisine !== filters.cuisine) {
      return false;
    }

    // Price range filter
    if (filters.priceRange !== 'All') {
      const target = filters.priceRange.replace(/\$/g, '₦');
      const restPrice = r.priceRange.replace(/\$/g, '₦');
      if (restPrice !== target) {
        return false;
      }
    }

    // Rating filter
    if (filters.minRating > 0 && r.rating < filters.minRating) {
      return false;
    }

    // Dietary restriction filter
    if (filters.dietary && filters.dietary !== 'All') {
      if (!r.dietaryTags || !r.dietaryTags.includes(filters.dietary.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.cuisine !== 'All' ||
    filters.priceRange !== 'All' ||
    filters.minRating > 0 ||
    (filters.dietary && filters.dietary !== 'All');

  return (
    <div className="space-y-6">
      {/* Hero Announcement & Search Header */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-800 to-orange-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-orange-600/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Delicious meals from our top 5 partnered kitchens.
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Order fresh artisanal menus with simulated checkout, browse offline anywhere, or contact kitchens directly via WhatsApp & phone.
          </p>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative flex items-center w-full bg-white text-stone-900 rounded-2xl shadow-lg border border-stone-200/80 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
              <Search className="w-5 h-5 text-stone-400 ml-4 shrink-0" />
              <input
                id="restaurant-search-input"
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder="Search by restaurant, cuisine, or dietary preference (e.g. vegan, gluten-free)..."
                className="w-full px-3 py-3.5 text-sm sm:text-base bg-transparent focus:outline-none placeholder:text-stone-400"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => onFilterChange({ searchQuery: '' })}
                  className="p-2 mr-2 text-stone-400 hover:text-stone-700 transition"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Toolbar (Feature 4 & Dietary restrictions) */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
            <span>Refine Restaurants</span>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition"
              >
                Reset all filters
              </button>
            )}

            <button
              onClick={onOpenMap}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-orange-600 bg-stone-100 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-stone-200 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Explore Map Page</span>
            </button>
          </div>
        </div>

        {/* Dietary Restrictions Filter Row */}
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-2">
            Dietary Preferences
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {dietaryOptions.map((d) => {
              const active = (filters.dietary || 'All') === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => onFilterChange({ dietary: d.id })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-50/80 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cuisines Pill List */}
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-2">Cuisine Type</label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {cuisines.map((c) => {
              const active = filters.cuisine === c;
              return (
                <button
                  key={c}
                  onClick={() => onFilterChange({ cuisine: c })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters: Price Range & Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Price Range</label>
            <div className="grid grid-cols-4 gap-2">
              {priceRanges.map((p) => {
                const active = filters.priceRange === p;
                return (
                  <button
                    key={p}
                    onClick={() => onFilterChange({ priceRange: p })}
                    className={`py-1.5 rounded-lg text-xs font-bold transition ${
                      active
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Customer Rating</label>
            <div className="grid grid-cols-4 gap-2">
              {ratingOptions.map((r) => {
                const active = filters.minRating === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => onFilterChange({ minRating: r.value })}
                    className={`py-1.5 px-1 rounded-lg text-xs font-semibold truncate transition ${
                      active
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="font-bold text-stone-900 text-lg sm:text-xl tracking-tight">
          Partner Restaurants ({filteredRestaurants.length})
        </h2>
        <span className="text-xs text-stone-500">
          Showing {filteredRestaurants.length} of {restaurants.length} kitchens
        </span>
      </div>

      {/* Empty State */}
      {filteredRestaurants.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-stone-300 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-bold">
            🍽️
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-stone-900 text-lg">No matching restaurants found</h3>
            <p className="text-stone-500 text-sm">
              We couldn't find any kitchens matching your current search or filter combination. Try loosening your filters.
            </p>
          </div>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition"
          >
            Clear Filters & Show All 5 Restaurants
          </button>
        </div>
      )}

      {/* Restaurants Grid (Feature 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((rest) => (
          <article
            key={rest.id}
            onClick={() => onSelectRestaurant(rest)}
            className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex flex-col"
          >
            {/* Image Header with Badges */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
              <img
                src={rest.image}
                alt={rest.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Rating Pill */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-stone-900">{rest.rating}</span>
              </div>

              {/* Price Range Badge */}
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-white text-xs font-mono font-bold tracking-wider">
                {rest.priceRange.replace(/\$/g, '₦')}
              </div>

              {/* Bottom overlay info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{rest.deliveryTime || '25-35 min'}</span>
                </span>
                <span className="font-semibold text-[11px] bg-orange-600/90 px-2 py-0.5 rounded-md">
                  Min ₦{rest.minimumOrder?.toFixed(2) || '15.00'}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    {rest.cuisine}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-orange-600 transition-colors leading-tight">
                  {rest.name}
                </h3>

                <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                  {rest.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{rest.location.address}</span>
                </div>

                {/* Dietary Tags Badges */}
                {rest.dietaryTags && rest.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {rest.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60"
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

              {/* Quick Actions Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Call icon link */}
                  <a
                    href={`tel:${rest.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                    title={`Call ${rest.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  {/* WhatsApp link */}
                  <a
                    href={`https://wa.me/${rest.whatsapp}?text=${encodeURIComponent(
                      `Hello ${rest.name}, I am ordering through FoodHub.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                    title={`WhatsApp ${rest.name}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* View Menu CTA */}
                <button
                  onClick={() => onSelectRestaurant(rest)}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 group/btn"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
