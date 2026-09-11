import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Bed, 
  Wind, 
  Wifi, 
  Coffee, 
  Bath, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Room } from '../../types';
import { useHotel } from '../../context/HotelContext';

interface Props {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking: (room: Room) => void;
}

export const RoomDetailsModal: React.FC<Props> = ({
  room,
  isOpen,
  onClose,
  onProceedToBooking
}) => {
  const { hotelProfile, isRoomAvailable, searchDates, setSearchDates } = useHotel();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  if (!isOpen || !room) return null;

  const checkIn = searchDates.checkIn;
  const checkOut = searchDates.checkOut;

  // Calculate nights
  const dIn = new Date(checkIn);
  const dOut = new Date(checkOut);
  const diffTime = dOut.getTime() - dIn.getTime();
  const numberOfNights = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));

  const basePrice = room.pricePerNight * numberOfNights;
  const taxAmount = (basePrice * hotelProfile.taxRatePercent) / 100;
  const finalTotal = basePrice + taxAmount;

  const available = isRoomAvailable(room.id, checkIn, checkOut);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        id="modal-room-details"
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 block">
              {room.category} • Room {room.roomNumber}
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-slate-900">
              {room.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Gallery Showcase */}
          <div>
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 mb-3 shadow-inner">
              <img
                src={room.images[selectedImgIdx] || room.images[0]}
                alt={room.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                Photo {selectedImgIdx + 1} of {room.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {room.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                      selectedImgIdx === idx ? 'border-amber-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Live Price Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Description & Amenities */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About This Room
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Room Specifications Table */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Maximum Capacity</span>
                  <span className="font-semibold text-slate-800 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>Up to {room.capacity} Guests</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Bed Configuration</span>
                  <span className="font-semibold text-slate-800 flex items-center space-x-1">
                    <Bed className="w-3.5 h-3.5 text-amber-600" />
                    <span>{room.bedType}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Climate & Air</span>
                  <span className="font-semibold text-slate-800 flex items-center space-x-1">
                    <Wind className="w-3.5 h-3.5 text-amber-600" />
                    <span>{room.isAC ? 'Climate Control AC' : 'High Performance Ceiling Fans'}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Wi-Fi & Service</span>
                  <span className="font-semibold text-slate-800 flex items-center space-x-1">
                    <Wifi className="w-3.5 h-3.5 text-amber-600" />
                    <span>Complimentary Ultra-Fast Wi-Fi</span>
                  </span>
                </div>
              </div>

              {/* Bathroom Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                  <Bath className="w-4 h-4 text-amber-700" />
                  <span>Ensuite Bathroom</span>
                </h4>
                <p className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100/80">
                  {room.bathroomInfo}
                </p>
              </div>

              {/* All Amenities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Included Amenities & Features</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {room.amenities.map((item, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel Policies Reminder */}
              <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Check-in: {hotelProfile.checkInTime} | Check-out: {hotelProfile.checkOutTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>{hotelProfile.cancellationPolicy}</span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Interactive Total Price Calculator & Availability */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-5">
              <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-amber-400 uppercase tracking-wider block">Nightly Rate</span>
                  <span className="text-3xl font-bold">${room.pricePerNight}</span>
                  <span className="text-xs text-slate-400 ml-1">/ night</span>
                </div>
                <div>
                  {available ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <CheckCircle className="w-3 h-3" />
                      <span>Dates Available</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40">
                      <AlertCircle className="w-3 h-3" />
                      <span>Booked on Selected Dates</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Date pickers inside calculator */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Stay Calculator</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Check-in Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSearchDates(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setSearchDates(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Guests</label>
                    <select
                      value={searchDates.guests}
                      onChange={(e) => setSearchDates(prev => ({ ...prev, guests: Number(e.target.value) }))}
                      className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {[...Array(room.capacity)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Rooms</label>
                    <select
                      value={searchDates.roomsCount}
                      onChange={(e) => setSearchDates(prev => ({ ...prev, roomsCount: Number(e.target.value) }))}
                      className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value={1}>1 Room</option>
                      <option value={2}>2 Rooms</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>${room.pricePerNight} x {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes & Fees ({hotelProfile.taxRatePercent}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Special Promo Offer</span>
                  <span>Coupons applicable at checkout</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Estimated Total</span>
                  <span className="text-amber-400">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                id="btn-proceed-to-booking"
                onClick={() => onProceedToBooking(room)}
                disabled={!available}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2 shadow-lg ${
                  available
                    ? 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{available ? 'Proceed to Booking' : 'Unavailable for Selected Dates'}</span>
                {available && <ArrowRight className="w-4 h-4" />}
              </button>

              {!available && (
                <p className="text-[11px] text-red-400 text-center">
                  This room is currently occupied for the dates selected above. Please adjust check-in / check-out dates.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
