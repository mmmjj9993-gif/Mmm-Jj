import React, { useState } from 'react';
import { 
  Coffee, 
  Search, 
  Plus, 
  Check, 
  Clock, 
  ShoppingBag, 
  Sparkles, 
  SlidersHorizontal,
  UtensilsCrossed
} from 'lucide-react';
import { FoodItem, FoodCategory } from '../../types';
import { useHotel } from '../../context/HotelContext';

export const FoodMenuView: React.FC = () => {
  const { foodItems, addToCart, cart, setIsCartDrawerOpen } = useHotel();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<{ [key: string]: boolean }>({});

  const categories = [
    'All',
    'Breakfast',
    'Starters',
    'Main Course',
    'Snacks',
    'Tea/Coffee',
    'Beverages',
    'Desserts'
  ];

  const filteredItems = foodItems.filter(item => {
    if (!item.isAvailable) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAdd = (item: FoodItem) => {
    addToCart(item);
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const handleOrderNow = (item: FoodItem) => {
    addToCart(item);
    setIsCartDrawerOpen(true);
  };

  return (
    <div id="section-cafeteria" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 tracking-wide uppercase">
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
          <span>The Grand Terrace Cafeteria & In-Room Dining</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Artisanal Gastronomy & Room Service
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Savor farm-to-table breakfast spreads, gourmet chef specialties, handcrafted beverages, and late-night snacks delivered freshly to your suite.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-slate-200/90 mb-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, coffees, desserts, or snacks..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Veg Toggle */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Vegetarian Only</span>
              </span>
            </label>

            {/* Open Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Coffee className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-base">No items found</h4>
          <p className="text-xs text-slate-400 mt-1">Try changing your search query or selecting a different menu category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isAdded = addedItemIds[item.id];
            const inCart = cart.find(c => c.foodItem.id === item.id);

            return (
              <div
                key={item.id}
                id={`food-card-${item.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Food Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Veg / Non-Veg badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold backdrop-blur-md shadow-xs ${
                        item.isVeg 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50' 
                          : 'bg-red-950/80 text-red-300 border border-red-500/50'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        <span>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                      </span>
                    </div>

                    {/* Preparation Time */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{item.preparationTimeMins} mins</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition line-clamp-1">
                        {item.name}
                      </h4>
                      <span className="font-bold text-slate-900 text-sm ml-2">
                        ${item.price}
                      </span>
                    </div>

                    <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider block mb-2">
                      {item.category}
                    </span>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAdd(item)}
                    className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1 border ${
                      isAdded
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{inCart ? `Add (${inCart.quantity})` : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOrderNow(item)}
                    className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white transition text-center shadow-xs"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
