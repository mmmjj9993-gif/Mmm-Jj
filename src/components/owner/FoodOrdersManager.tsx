import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Check, 
  Clock, 
  Printer, 
  X, 
  Search, 
  Coffee, 
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { FoodOrder, FoodItem, FoodCategory } from '../../types';
import { useHotel } from '../../context/HotelContext';

export const FoodOrdersManager: React.FC = () => {
  const { 
    foodOrders, 
    foodItems, 
    updateFoodOrderStatus, 
    addFoodItem, 
    updateFoodItem, 
    deleteFoodItem,
    hotelProfile 
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // New Food Item Form
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({
    name: '',
    category: 'Breakfast',
    price: 15,
    isVeg: true,
    isAvailable: true,
    preparationTimeMins: 20,
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
  });

  const filteredOrders = foodOrders.filter(o => {
    if (orderFilter !== 'All' && o.orderStatus !== orderFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.roomNumber.includes(q);
    }
    return true;
  });

  const handleStatusUpdate = (orderId: string, status: FoodOrder['orderStatus']) => {
    updateFoodOrderStatus(orderId, status);
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    const itemToAdd: FoodItem = {
      id: `food-${Date.now()}`,
      hotelId: hotelProfile.id,
      name: newItem.name,
      category: newItem.category as FoodCategory || 'Breakfast',
      price: Number(newItem.price) || 10,
      description: newItem.description || '',
      image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      isVeg: Boolean(newItem.isVeg),
      isAvailable: true,
      preparationTimeMins: Number(newItem.preparationTimeMins) || 15
    };

    addFoodItem(itemToAdd);
    setIsAddItemOpen(false);
    setNewItem({
      name: '',
      category: 'Breakfast',
      price: 15,
      isVeg: true,
      isAvailable: true,
      preparationTimeMins: 20,
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
    });
  };

  const handleToggleFoodStock = (item: FoodItem) => {
    updateFoodItem({
      ...item,
      isAvailable: !item.isAvailable
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Cafeteria & In-Room Dining Operations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live kitchen dispatch, food order workflows, and digital menu pricing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              Live Kitchen Orders ({foodOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'menu' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              Menu Items ({foodItems.length})
            </button>
          </div>

          {activeTab === 'menu' && (
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish</span>
            </button>
          )}
        </div>
      </div>

      {/* ORDERS VIEW */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
            <div className="flex space-x-1 overflow-x-auto w-full md:w-auto pb-1">
              {['All', 'Received', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                    orderFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID, room, guest..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                No food orders in this category.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                        #{order.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        order.orderStatus === 'Received' ? 'bg-amber-100 text-amber-800' :
                        order.orderStatus === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'Ready' ? 'bg-purple-100 text-purple-800' :
                        order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block">Deliver To:</span>
                      <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
                        Room {order.roomNumber}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {order.customerName} ({order.customerPhone})
                      </p>
                    </div>

                    {/* Items table */}
                    <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700">
                          <span>{it.name} <strong className="text-slate-900">x{it.quantity}</strong></span>
                          <span>${(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {order.specialInstructions && (
                      <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 italic">
                        Note: "{order.specialInstructions}"
                      </div>
                    )}
                  </div>

                  {/* Status update buttons */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Total Billed:</span>
                      <span className="text-amber-800 text-sm">${order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1">
                      {order.orderStatus === 'Received' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                          className="col-span-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Start Preparing
                        </button>
                      )}

                      {order.orderStatus === 'Preparing' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'Ready')}
                          className="col-span-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Mark Ready for Delivery
                        </button>
                      )}

                      {order.orderStatus === 'Ready' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                          className="col-span-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Mark as Delivered
                        </button>
                      )}

                      {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                          className="col-span-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-[11px] font-semibold transition"
                        >
                          Cancel Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* DIGITAL MENU ITEMS MANAGEMENT VIEW */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {foodItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 bg-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.isVeg ? 'bg-emerald-800 text-emerald-200' : 'bg-red-800 text-red-200'
                  }`}>
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[10px]">
                    {item.preparationTimeMins}m
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <span className="font-bold text-amber-800 text-sm">${item.price}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mt-0.5">
                    {item.category}
                  </span>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                <button
                  onClick={() => handleToggleFoodStock(item)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                    item.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                </button>

                <button
                  onClick={() => deleteFoodItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dish Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
                Add Menu Dish
              </h4>
              <button
                onClick={() => setIsAddItemOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Dish Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Organic Avocado Toast"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(p => ({ ...p, category: e.target.value as FoodCategory }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Tea/Coffee">Tea/Coffee</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Price ($) *</label>
                  <input
                    type="number"
                    min={1}
                    value={newItem.price}
                    onChange={(e) => setNewItem(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    min={5}
                    value={newItem.preparationTimeMins}
                    onChange={(e) => setNewItem(p => ({ ...p, preparationTimeMins: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={newItem.isVeg}
                      onChange={(e) => setNewItem(p => ({ ...p, isVeg: e.target.checked }))}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span>Is Vegetarian?</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={newItem.image}
                  onChange={(e) => setNewItem(p => ({ ...p, image: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl"
                >
                  Add Dish to Menu
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
