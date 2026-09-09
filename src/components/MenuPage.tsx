import React, { useState, useMemo } from 'react';
import { Restaurant, MenuItem, CartItem } from '../types';
import { ArrowLeft, Search, Star, Phone, MessageCircle, Plus, Minus, Check, ShoppingBag, MapPin, X } from 'lucide-react';

interface MenuPageProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  cartItems: CartItem[];
  onBack: () => void;
  onAddToCart: (item: MenuItem, restaurant: Restaurant, quantity?: number) => void;
  onUpdateQuantity: (menuItemId: number, delta: number) => void;
  onOpenCart: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  restaurant,
  menuItems,
  cartItems,
  onBack,
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [justAddedId, setJustAddedId] = useState<number | null>(null);

  const dietaryOptions = [
    { id: 'All', label: 'All Items' },
    { id: 'vegetarian', label: '🥬 Vegetarian' },
    { id: 'vegan', label: '🌱 Vegan' },
    { id: 'gluten-free', label: '🌾 Gluten-Free' },
  ];

  // Cart items specifically for this restaurant
  const itemsInCartForRestaurant = useMemo(() => {
    return cartItems.filter((ci) => ci.restaurant.id === restaurant.id);
  }, [cartItems, restaurant.id]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const restaurantSubtotal = itemsInCartForRestaurant.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  // Filter menu items by search query and dietary restriction
  const filteredItems = useMemo(() => {
    return menuItems.filter((m) => {
      // Dietary filter
      if (selectedDietary !== 'All') {
        if (!m.dietary || !m.dietary.includes(selectedDietary)) {
          return false;
        }
      }

      // Search query (name, description, or dietary tag match)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name.toLowerCase().includes(q);
        const matchDesc = m.description.toLowerCase().includes(q);
        const matchTag = m.dietary?.some(
          (t) => t.toLowerCase().includes(q) || (q === 'gf' && t === 'gluten-free')
        );
        if (!matchName && !matchDesc && !matchTag) return false;
      }

      return true;
    });
  }, [menuItems, searchQuery, selectedDietary]);

  // Pre-filled WhatsApp message with restaurant items or general inquiry
  const whatsappMessage = useMemo(() => {
    if (itemsInCartForRestaurant.length > 0) {
      const itemsList = itemsInCartForRestaurant
        .map((ci) => `• ${ci.quantity}x ${ci.menuItem.name} (₦${(ci.menuItem.price * ci.quantity).toFixed(2)})`)
        .join('\n');
      return encodeURIComponent(
        `Hello ${restaurant.name}!\n\nI would like to place an order via FoodHub:\n${itemsList}\n\nSubtotal: ₦${restaurantSubtotal.toFixed(
          2
        )}\n\nPlease confirm availability and delivery timeframe. Thank you!`
      );
    }
    return encodeURIComponent(
      `Hello ${restaurant.name}, I am browsing your menu on FoodHub and would like to inquire about ordering.`
    );
  }, [restaurant.name, itemsInCartForRestaurant, restaurantSubtotal]);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item, restaurant, 1);
    setJustAddedId(item.id);
    setTimeout(() => {
      setJustAddedId((prev) => (prev === item.id ? null : prev));
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Restaurants</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Direct Call Button (Feature 7) */}
          <a
            href={`tel:${restaurant.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition active:scale-95"
            title={`Call ${restaurant.name}`}
          >
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Call Kitchen</span>
          </a>

          {/* WhatsApp Order Button (Feature 8) */}
          <a
            href={`https://wa.me/${restaurant.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition active:scale-95"
            title={`Order directly on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Order</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Restaurant Hero Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs">
        <div className="relative h-48 sm:h-64 w-full bg-stone-100">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badges on hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-600 font-bold uppercase tracking-wider text-[11px]">
                {restaurant.cuisine}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs font-bold text-amber-300 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-300" /> {restaurant.rating}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs font-mono font-bold">
                {restaurant.priceRange.replace(/\$/g, '₦')}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-200 font-medium">{restaurant.deliveryTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl line-clamp-2">
              {restaurant.description}
            </p>
          </div>
        </div>

        {/* Info Strip */}
        <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
            <span>{restaurant.location.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Phone: <strong className="text-stone-800">{restaurant.phone}</strong></span>
            <span>Min Order: <strong className="text-stone-800">₦{restaurant.minimumOrder?.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      {/* Menu Search Bar & Dietary Filter */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="menu-item-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search dishes in ${restaurant.name} (e.g. vegan, gluten-free)...`}
              className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-stone-500 w-full sm:w-auto text-left sm:text-right font-medium">
            {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} available
          </div>
        </div>

        {/* Dietary filter pills for menu */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap mr-1">
            Dietary:
          </span>
          {dietaryOptions.map((opt) => {
            const active = selectedDietary === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedDietary(opt.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty state for menu search */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-stone-200 space-y-3">
          <p className="text-stone-600 font-medium text-sm">
            No dishes found matching current search or dietary filter
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDietary('All');
            }}
            className="text-xs font-semibold text-orange-600 hover:underline"
          >
            Reset dish filters
          </button>
        </div>
      )}

      {/* Menu Items List / Grid (Feature 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((dish) => {
          // Check if this dish is already in the cart
          const existingCartItem = cartItems.find(
            (ci) => ci.menuItem.id === dish.id && ci.restaurant.id === restaurant.id
          );
          const quantityInCart = existingCartItem ? existingCartItem.quantity : 0;
          const wasJustAdded = justAddedId === dish.id;

          return (
            <div
              key={dish.id}
              className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:border-orange-200 transition-all flex gap-4 justify-between"
            >
              {/* Dish info */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                    {dish.name}
                  </h3>
                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Dietary badges on dish */}
                  {dish.dietary && dish.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {dish.dietary.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/50"
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

                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="font-extrabold text-stone-900 text-base font-mono">
                    ₦{dish.price.toFixed(2)}
                  </span>

                  {/* Quantity Stepper & Add to Cart (Feature 2) */}
                  {quantityInCart > 0 ? (
                    <div className="flex items-center gap-1.5 bg-stone-900 text-white rounded-xl p-1 shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(dish.id, -1)}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200 active:scale-95 transition"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-mono font-bold text-xs min-w-[20px] text-center">
                        {quantityInCart}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(dish.id, 1)}
                        className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-500 flex items-center justify-center text-white active:scale-95 transition"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(dish)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                        wasJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                      }`}
                    >
                      {wasJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Dish Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Bar if cart contains items */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-30 animate-in slide-in-from-bottom-4">
          <div className="bg-stone-900 text-white rounded-2xl p-3 sm:p-4 shadow-xl border border-stone-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                {totalCartCount}
              </div>
              <div>
                <div className="text-xs text-stone-400">Total in Cart</div>
                <div className="font-extrabold text-sm sm:text-base font-mono">
                  ₦{cartItems.reduce((s, i) => s + i.menuItem.price * i.quantity, 0).toFixed(2)}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Review Cart</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
