import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Clock, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { FoodOrder } from '../../types';

export const FoodCartDrawer: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    createFoodOrder, 
    hotelProfile 
  } = useHotel();

  const { currentUser } = useAuth();

  const [roomNumber, setRoomNumber] = useState('101');
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Alexander Hayes');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<FoodOrder | null>(null);

  if (!isCartDrawerOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);

    const orderId = storageService.getNextFoodOrderId();
    const newOrder: FoodOrder = {
      id: orderId,
      hotelId: hotelProfile.id,
      customerId: currentUser?.id || `guest-${Date.now()}`,
      customerName,
      customerPhone,
      roomNumber,
      items: cart.map(ci => ({
        foodId: ci.foodItem.id,
        name: ci.foodItem.name,
        price: ci.foodItem.price,
        quantity: ci.quantity
      })),
      totalAmount: cartTotal,
      specialInstructions: specialInstructions || undefined,
      paymentStatus: 'Successful',
      orderStatus: 'Received',
      createdAt: new Date().toISOString()
    };

    await createFoodOrder(newOrder);
    setConfirmedOrder(newOrder);
    setIsSubmitting(false);
  };

  const handleWhatsAppOrder = () => {
    if (!confirmedOrder) return;
    const itemsList = confirmedOrder.items.map(i => `• ${i.name} x${i.quantity} ($${(i.price * i.quantity).toFixed(2)})`).join('\n');
    const msg = `*New Food Order - ${hotelProfile.name}*\n` +
      `Order ID: ${confirmedOrder.id}\n` +
      `Room / Location: Room ${confirmedOrder.roomNumber}\n` +
      `Customer: ${confirmedOrder.customerName} (${confirmedOrder.customerPhone})\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Total:* $${confirmedOrder.totalAmount.toFixed(2)}\n` +
      `Instructions: ${confirmedOrder.specialInstructions || 'None'}\n\n` +
      `Please confirm delivery estimation. Thank you!`;

    const cleanNum = hotelProfile.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => {
          setIsCartDrawerOpen(false);
          setConfirmedOrder(null);
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif-luxury font-bold text-lg">Room Service Cart</h3>
            </div>
            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                setConfirmedOrder(null);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {confirmedOrder ? (
              /* Order Confirmation Display */
              <div className="space-y-6 text-center py-6 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                    Kitchen Received Order
                  </span>
                  <h4 className="font-serif-luxury text-2xl font-bold text-slate-900 mt-1">
                    Order #{confirmedOrder.id}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Delivering hot to <strong>Room {confirmedOrder.roomNumber}</strong> in approx. 20-30 mins.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                  <p className="font-bold text-slate-700 border-b border-slate-200 pb-1">Order Summary</p>
                  {confirmedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600">
                      <span>{it.name} x {it.quantity}</span>
                      <span className="font-medium">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Amount</span>
                    <span className="text-amber-800">${confirmedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Track / Send via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      setConfirmedOrder(null);
                      setIsCartDrawerOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              /* Empty state */
              <div className="py-20 text-center text-slate-400">
                <ShoppingBag className="w-14 h-14 mx-auto mb-3 opacity-30" />
                <h4 className="font-bold text-slate-700 text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Add savory dishes, coffees, or gourmet meals from our digital cafeteria menu.
                </p>
              </div>
            ) : (
              /* Cart Items List and Delivery Form */
              <div className="space-y-6">
                <div className="space-y-3 divide-y divide-slate-100">
                  {cart.map(item => (
                    <div key={item.foodItem.id} className="pt-3 flex items-center justify-between">
                      <div className="flex-1 pr-3">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.foodItem.name}
                        </h4>
                        <span className="text-xs text-amber-800 font-semibold block mt-0.5">
                          ${item.foodItem.price} each
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.foodItem.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.foodItem.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => removeFromCart(item.foodItem.id)}
                          className="text-slate-400 hover:text-red-500 p-1 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery details form */}
                <form onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Delivery & Guest Information
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Room / Suite Number *</label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. 101, 104, Poolside Cabana"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Guest Name"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Phone"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Special Dietary Instructions</label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Extra spicy, no onions, extra napkins, cut into pieces, etc."
                      rows={2}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Payment notice */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>Payment will be billed to your room folio upon delivery or settled via UPI/Card.</span>
                  </div>

                  {/* Total and Place Order Button */}
                  <div className="pt-2">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-xs text-slate-500">Order Subtotal:</span>
                      <span className="text-xl font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <span>{isSubmitting ? 'Submitting to Kitchen...' : `Place Room Order ($${cartTotal.toFixed(2)})`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
