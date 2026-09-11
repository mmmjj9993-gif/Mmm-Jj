import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Printer, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Plus, 
  Download, 
  Eye, 
  UserCheck, 
  LogOut,
  X
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types';
import { useHotel } from '../../context/HotelContext';

export const BookingsManager: React.FC = () => {
  const { bookings, updateBookingStatus, createBooking, rooms, hotelProfile } = useHotel();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);

  // Manual walk-in booking state
  const [manualForm, setManualForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    roomId: rooms[0]?.id || '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 1,
    roomsCount: 1,
    specialRequests: ''
  });

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.bookingStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.roomNumber.toLowerCase().includes(q) ||
        b.roomName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus);
  };

  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selRoom = rooms.find(r => r.id === manualForm.roomId) || rooms[0];
    if (!selRoom) return;

    const dIn = new Date(manualForm.checkIn);
    const dOut = new Date(manualForm.checkOut);
    const diff = dOut.getTime() - dIn.getTime();
    const nights = Math.max(1, Math.round(diff / (1000 * 3600 * 24)));
    const base = selRoom.pricePerNight * nights * manualForm.roomsCount;
    const tax = (base * hotelProfile.taxRatePercent) / 100;

    const newBooking: Booking = {
      id: `HTL-WALK-${Math.floor(1000 + Math.random() * 9000)}`,
      hotelId: hotelProfile.id,
      customerId: `walkin-${Date.now()}`,
      customerName: manualForm.customerName,
      customerEmail: manualForm.customerEmail || 'walkin@hotel.com',
      customerPhone: manualForm.customerPhone,
      roomId: selRoom.id,
      roomNumber: selRoom.roomNumber,
      roomName: selRoom.name,
      roomCategory: selRoom.category,
      checkIn: manualForm.checkIn,
      checkOut: manualForm.checkOut,
      guests: Number(manualForm.guests),
      roomsCount: Number(manualForm.roomsCount),
      numberOfNights: nights,
      basePrice: base,
      taxAmount: tax,
      discountAmount: 0,
      totalAmount: base + tax,
      specialRequests: manualForm.specialRequests || 'Front desk walk-in reservation',
      paymentStatus: 'Successful',
      paymentMethod: 'Card',
      transactionId: `WALK-${Date.now().toString().slice(-6)}`,
      bookingStatus: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    createBooking(newBooking);
    setIsManualBookingOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Reservations & Booking Management
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total of {bookings.length} reservations tracked. Process guest check-ins, departures, and cancellations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsManualBookingOpen(true)}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Walk-In / New Reservation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        <div className="flex space-x-1 overflow-x-auto w-full md:w-auto pb-1">
          {['All', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest, ID, phone, room..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold tracking-wider">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Guest Information</th>
                <th className="p-4">Room Reserved</th>
                <th className="p-4">Dates & Nights</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No reservations matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {b.id}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{b.customerName}</span>
                      <span className="text-slate-500 block">{b.customerPhone}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 block">Room {b.roomNumber}</span>
                      <span className="text-slate-500 block">{b.roomName}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-800 block">{b.checkIn} → {b.checkOut}</span>
                      <span className="text-slate-500 block">{b.numberOfNights} Nights • {b.guests} Guests</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">${b.totalAmount.toFixed(2)}</span>
                      <span className="text-[10px] text-emerald-600 font-medium">{b.paymentStatus}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        b.bookingStatus === 'Checked-in' ? 'bg-blue-100 text-blue-800' :
                        b.bookingStatus === 'Checked-out' ? 'bg-slate-100 text-slate-700' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {b.bookingStatus === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Checked-in')}
                          title="Check-In Guest"
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold text-[11px] transition"
                        >
                          Check-In
                        </button>
                      )}

                      {b.bookingStatus === 'Checked-in' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Checked-out')}
                          title="Check-Out Guest"
                          className="px-2.5 py-1.5 bg-slate-800 text-white hover:bg-slate-700 rounded-lg font-semibold text-[11px] transition"
                        >
                          Check-Out
                        </button>
                      )}

                      {b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Checked-out' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Cancelled')}
                          title="Cancel Reservation"
                          className="px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-[11px] transition"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedBookingForDetails(b)}
                        title="View Voucher"
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Walk-In Booking Modal */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
                Create Walk-In / Phone Reservation
              </h4>
              <button
                onClick={() => setIsManualBookingOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualBookingSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Guest Name *</label>
                  <input
                    type="text"
                    value={manualForm.customerName}
                    onChange={(e) => setManualForm(p => ({ ...p, customerName: e.target.value }))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={manualForm.customerPhone}
                    onChange={(e) => setManualForm(p => ({ ...p, customerPhone: e.target.value }))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Room Selection *</label>
                <select
                  value={manualForm.roomId}
                  onChange={(e) => setManualForm(p => ({ ...p, roomId: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Room {r.roomNumber} - {r.name} (${r.pricePerNight}/nt)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Check-In</label>
                  <input
                    type="date"
                    value={manualForm.checkIn}
                    onChange={(e) => setManualForm(p => ({ ...p, checkIn: e.target.value }))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Check-Out</label>
                  <input
                    type="date"
                    value={manualForm.checkOut}
                    min={manualForm.checkIn}
                    onChange={(e) => setManualForm(p => ({ ...p, checkOut: e.target.value }))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={manualForm.guests}
                    onChange={(e) => setManualForm(p => ({ ...p, guests: Number(e.target.value) }))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Rooms Count</label>
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={manualForm.roomsCount}
                    onChange={(e) => setManualForm(p => ({ ...p, roomsCount: Number(e.target.value) }))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Special Requests / Notes</label>
                <textarea
                  value={manualForm.specialRequests}
                  onChange={(e) => setManualForm(p => ({ ...p, specialRequests: e.target.value }))}
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl"
                >
                  Create & Confirm Reservation
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualBookingOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Voucher Modal */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
                Reservation Voucher - {selectedBookingForDetails.id}
              </h4>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Guest:</span>
                <span className="font-bold text-slate-900">{selectedBookingForDetails.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone / Email:</span>
                <span className="text-slate-900">{selectedBookingForDetails.customerPhone} | {selectedBookingForDetails.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room:</span>
                <span className="text-slate-900">Room {selectedBookingForDetails.roomNumber} ({selectedBookingForDetails.roomName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-in / Out:</span>
                <span className="text-slate-900">{selectedBookingForDetails.checkIn} to {selectedBookingForDetails.checkOut} ({selectedBookingForDetails.numberOfNights} Nights)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700">{selectedBookingForDetails.bookingStatus}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span>Total Amount Paid:</span>
                <span className="text-amber-800 text-sm">${selectedBookingForDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Voucher</span>
              </button>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
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
