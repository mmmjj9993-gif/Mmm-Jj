import React, { useState } from 'react';
import { 
  Bed, 
  Filter, 
  Calendar, 
  Users, 
  CheckCircle, 
  SlidersHorizontal, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Room, RoomCategory } from '../../types';
import { useHotel } from '../../context/HotelContext';
import { RoomCard } from './RoomCard';

interface Props {
  onViewDetails: (room: Room) => void;
  onBookNow: (room: Room) => void;
}

export const RoomsListingView: React.FC<Props> = ({ onViewDetails, onBookNow }) => {
  const { rooms, searchDates, setSearchDates } = useHotel();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceTier, setPriceTier] = useState<string>('All');
  const [acFilter, setAcFilter] = useState<'all' | 'ac' | 'non-ac'>('all');

  const categories = [
    'All',
    'AC Room',
    'Non-AC Room',
    'Double AC Room',
    'Bamboo AC Room'
  ];

  const filteredRooms = rooms.filter(room => {
    if (selectedCategory !== 'All' && room.category !== selectedCategory) return false;
    if (acFilter === 'ac' && !room.isAC) return false;
    if (acFilter === 'non-ac' && room.isAC) return false;

    if (priceTier === 'budget' && room.pricePerNight >= 150) return false;
    if (priceTier === 'mid' && (room.pricePerNight < 150 || room.pricePerNight > 250)) return false;
    if (priceTier === 'luxury' && room.pricePerNight <= 250) return false;

    return true;
  });

  return (
    <div id="section-rooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Curated Suite Selection</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
          Accommodations & Coastal Suites
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Select from our signature AC suites, natural bamboo sanctuaries, and spacious double executive rooms.
        </p>
      </div>

      {/* Selected Stay Banner */}
      <div className="bg-amber-900 text-white rounded-3xl p-4 sm:p-5 mb-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-300 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-amber-300 uppercase font-bold text-[10px] tracking-wider block">
              Checking Availability For
            </span>
            <span className="font-semibold text-sm">
              {searchDates.checkIn} to {searchDates.checkOut} • {searchDates.guests} {searchDates.guests === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <input
            type="date"
            value={searchDates.checkIn}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSearchDates(p => ({ ...p, checkIn: e.target.value }))}
            className="px-2.5 py-1.5 bg-amber-800/80 border border-amber-700 rounded-xl text-xs text-white focus:outline-none"
          />
          <span className="text-amber-400 text-xs">to</span>
          <input
            type="date"
            value={searchDates.checkOut}
            min={searchDates.checkIn}
            onChange={(e) => setSearchDates(p => ({ ...p, checkOut: e.target.value }))}
            className="px-2.5 py-1.5 bg-amber-800/80 border border-amber-700 rounded-xl text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-10 space-y-4">
        {/* Category Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary filters: Price & AC */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Price Filter:</span>
            <select
              value={priceTier}
              onChange={(e) => setPriceTier(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Rates</option>
              <option value="budget">Under $150 / night</option>
              <option value="mid">$150 - $250 / night</option>
              <option value="luxury">Above $250 / night</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Climate Preference:</span>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl space-x-1">
              <button
                onClick={() => setAcFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  acFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAcFilter('ac')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  acFilter === 'ac' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                AC Only
              </button>
              <button
                onClick={() => setAcFilter('non-ac')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  acFilter === 'non-ac' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Non-AC
              </button>
            </div>
          </div>

          <span className="text-slate-400 font-medium ml-auto">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'Suite' : 'Suites'} Available
          </span>
        </div>
      </div>

      {/* Room Cards Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <Bed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-base">No rooms match your filter criteria</h4>
          <p className="text-xs text-slate-400 mt-1">
            Try resetting your price filter or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onViewDetails={onViewDetails}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
