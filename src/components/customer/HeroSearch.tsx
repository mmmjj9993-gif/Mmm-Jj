import React from 'react';
import { Calendar, Users, Home, Search, Shield, Coffee, Award, Sparkles } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

interface Props {
  onSearchClick?: () => void;
  onSearchComplete?: () => void;
  onBookNowClick?: () => void;
}

export const HeroSearch: React.FC<Props> = ({ onSearchClick, onSearchComplete, onBookNowClick }) => {
  const { hotelProfile, searchDates, setSearchDates } = useHotel();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchClick) onSearchClick();
    if (onSearchComplete) onSearchComplete();
  };

  return (
    <div className="relative">
      {/* Hero Background with High-res photo & luxury dark gradient overlay */}
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        <img
          src={hotelProfile.heroImage}
          alt={hotelProfile.name}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-semibold mb-6 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Five-Star Coastal Sanctuary</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
            Welcome to {hotelProfile.name}
          </h1>

          <p className="text-base sm:text-xl text-amber-100/90 font-light max-w-2xl mx-auto mb-10 tracking-wide">
            {hotelProfile.tagline}
          </p>

          {/* Quick Perks Bar */}
          <div className="hidden sm:flex items-center justify-center space-x-8 text-xs text-slate-200 mb-10">
            <span className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Direct Booking Best Rate</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Gourmet Cafeteria Included</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Zero Cancellation Fees (48h)</span>
            </span>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-800 max-w-4xl mx-auto border border-white/20 backdrop-blur-md">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Check-in Date */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Check-In</span>
                </label>
                <input
                  type="date"
                  value={searchDates.checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSearchDates(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Check-out Date */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Check-Out</span>
                </label>
                <input
                  type="date"
                  value={searchDates.checkOut}
                  min={searchDates.checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSearchDates(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Guests */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  <span>Guests</span>
                </label>
                <select
                  value={searchDates.guests}
                  onChange={(e) => setSearchDates(prev => ({ ...prev, guests: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5+ Guests</option>
                </select>
              </div>

              {/* Rooms */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Home className="w-3.5 h-3.5 text-amber-700" />
                  <span>Rooms</span>
                </label>
                <select
                  value={searchDates.roomsCount}
                  onChange={(e) => setSearchDates(prev => ({ ...prev, roomsCount: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value={1}>1 Room</option>
                  <option value={2}>2 Rooms</option>
                  <option value={3}>3 Rooms</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  id="btn-hero-search-rooms"
                  className="w-full py-3 px-4 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Rooms</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
