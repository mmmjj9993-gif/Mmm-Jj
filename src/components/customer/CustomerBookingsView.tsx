import React, { useState } from 'react';
import { 
  Calendar, 
  ShoppingBag, 
  Search, 
  Printer, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  MapPin, 
  MessageCircle,
  FileText,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { useAuth } from '../../context/AuthContext';
import { Booking, FoodOrder } from '../../types';

interface Props {
  onOpenAuth: () => void;
  onBookRoomClick: () => void;
}

export const CustomerBookingsView: React.FC<Props> = ({ onOpenAuth, onBookRoomClick }) => {
  const { bookings, foodOrders, hotelProfile, updateBookingStatus } = useHotel();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'bookings' | 'food'>('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);

  // Filter bookings for logged in user or query
  const userBookings = bookings.filter(b => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.customerEmail.toLowerCase().includes(q)
      );
    }
    if (currentUser?.email) {
      return (
        b.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
        b.customerId === currentUser.id
      );
    }
    return true; // Show demo guest bookings if not logged in
  });

  // Filter food orders
  const userFoodOrders = foodOrders.filter(o => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.roomNumber.includes(q) || o.customerName.toLowerCase().includes(q);
    }
    if (currentUser?.id) {
      return o.customerId === currentUser.id;
    }
    return true;
  });

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation? (Free cancellation policy applies up to 48 hours before check-in)')) {
      updateBookingStatus(bookingId, 'Cancelled');
    }
  };

  const getStatusBadge = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Confirmed</span>;
      case 'Checked-in':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Checked-In</span>;
      case 'Checked-out':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Checked-Out</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending</span>;
    }
  };

  const getFoodStatusBadge = (status: FoodOrder['orderStatus']) => {
    switch (status) {
      case 'Received':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Received by Kitchen</span>;
      case 'Preparing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Preparing Hot</span>;
      case 'Ready':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Ready for Service</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Delivered</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Cancelled</span>;
    }
  };

  return (
    <div id="section-customer-bookings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
            Guest Portal
          </span>
          <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1">
            My Reservations & Dining Orders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your room itineraries, print official payment receipts, or track kitchen delivery.
          </p>
        </div>

        {!currentUser && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center space-x-3 text-xs text-amber-900">
            <UserIcon className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div>
              <span>Have an account?</span>{' '}
              <button
                onClick={onOpenAuth}
                className="font-bold underline hover:text-amber-800"
              >
                Sign In to sync bookings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/90 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
              activeTab === 'bookings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Room Bookings ({userBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('food')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
              activeTab === 'food'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Food Orders ({userFoodOrders.length})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name or phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Content for Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {userBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-base">No bookings found</h4>
              <p className="text-xs text-slate-400 mt-1 mb-6">
                You do not have any room reservations matching your search.
              </p>
              <button
                onClick={onBookRoomClick}
                className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
              >
                Book a Suite Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userBookings.map((b) => (
                <div
                  key={b.id}
                  id={`booking-card-${b.id}`}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-md text-slate-800">
                        {b.id}
                      </span>
                      {getStatusBadge(b.bookingStatus)}
                      <span className="text-xs text-slate-400">
                        Booked on {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                        {b.roomName} <span className="text-amber-800 text-sm font-sans font-semibold">(Room {b.roomNumber})</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Guest: <strong className="text-slate-800">{b.customerName}</strong> • {b.customerPhone}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block">Check-In</span>
                        <span className="font-semibold text-slate-800">{b.checkIn}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Check-Out</span>
                        <span className="font-semibold text-slate-800">{b.checkOut}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Stay Duration</span>
                        <span className="font-semibold text-slate-800">{b.numberOfNights} Nights ({b.guests} Guests)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Paid</span>
                        <span className="font-bold text-amber-800">${b.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap sm:flex-col gap-2 justify-end lg:w-48">
                    <button
                      onClick={() => setSelectedBookingForReceipt(b)}
                      className="flex-1 sm:flex-initial py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View / Print Receipt</span>
                    </button>

                    {b.bookingStatus === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="flex-1 sm:flex-initial py-2 px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition text-center"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content for Food Orders */}
      {activeTab === 'food' && (
        <div className="space-y-4">
          {userFoodOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-base">No food orders found</h4>
              <p className="text-xs text-slate-400 mt-1">
                You haven't placed any room service orders yet. Browse our cafeteria menu!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userFoodOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        #{order.id}
                      </span>
                      {getFoodStatusBadge(order.orderStatus)}
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block">Deliver to:</span>
                      <p className="font-bold text-slate-900 text-sm">Room {order.roomNumber}</p>
                      <p className="text-[11px] text-slate-500">Ordered by {order.customerName}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-600">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Total Charged:</span>
                    <span className="font-bold text-amber-800 text-sm">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedBookingForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                  {hotelProfile.name}
                </h3>
                <p className="text-xs text-slate-500">{hotelProfile.address}, {hotelProfile.city}</p>
                <p className="text-xs text-slate-500">Tel: {hotelProfile.phone} | Web: {hotelProfile.customDomain}</p>
              </div>
              <button
                onClick={() => setSelectedBookingForReceipt(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 no-print"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-900">
                <span>OFFICIAL RESERVATION VOUCHER</span>
                <span className="font-mono">{selectedBookingForReceipt.id}</span>
              </div>
              <p className="text-slate-500">Issued to: {selectedBookingForReceipt.customerName} ({selectedBookingForReceipt.customerEmail})</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Room</span>
                <span className="font-bold text-slate-800">{selectedBookingForReceipt.roomName} (Room {selectedBookingForReceipt.roomNumber})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-bold text-slate-800">{selectedBookingForReceipt.roomCategory}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Check-In</span>
                <span className="font-bold text-slate-800">{selectedBookingForReceipt.checkIn} ({hotelProfile.checkInTime})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Check-Out</span>
                <span className="font-bold text-slate-800">{selectedBookingForReceipt.checkOut} ({hotelProfile.checkOutTime})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration & Guests</span>
                <span className="font-bold text-slate-800">{selectedBookingForReceipt.numberOfNights} Nights • {selectedBookingForReceipt.guests} Guests</span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Method</span>
                <span className="font-bold text-emerald-700">{selectedBookingForReceipt.paymentMethod} (Transaction #{selectedBookingForReceipt.transactionId})</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-700">Total Paid:</span>
              <span className="font-serif-luxury text-2xl font-bold text-amber-800">
                ${selectedBookingForReceipt.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-slate-100 no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setSelectedBookingForReceipt(null)}
                className="py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
