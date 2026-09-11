import React from 'react';
import { 
  Users, 
  Bed, 
  Wind, 
  Wifi, 
  Coffee, 
  Bath, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Star 
} from 'lucide-react';
import { Room } from '../../types';
import { useHotel } from '../../context/HotelContext';

interface Props {
  room: Room;
  onViewDetails: (room: Room) => void;
  onBookNow: (room: Room) => void;
}

export const RoomCard: React.FC<Props> = ({ room, onViewDetails, onBookNow }) => {
  const { isRoomAvailable, searchDates } = useHotel();
  const available = isRoomAvailable(room.id, searchDates.checkIn, searchDates.checkOut);

  return (
    <div 
      id={`room-card-${room.id}`}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      {/* Image with overlays */}
      <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-100">
        <img
          src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-amber-300 shadow-sm">
            {room.category}
          </span>
        </div>

        {/* Real-time Availability Pill */}
        <div className="absolute top-4 right-4">
          {available ? (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 backdrop-blur-md text-white shadow-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Available</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/90 backdrop-blur-md text-white shadow-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Occupied on Dates</span>
            </span>
          )}
        </div>

        {/* Room Number pill */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/90 text-slate-800 backdrop-blur-sm">
            Room {room.roomNumber}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Price */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                {room.name}
              </h3>
              <div className="flex items-center space-x-1 text-amber-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-slate-500 ml-1.5 font-medium">5.0 (Premier Choice)</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-3">
              <span className="text-2xl font-bold text-slate-900">${room.pricePerNight}</span>
              <span className="text-xs text-slate-500 block">/ night</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {room.description}
          </p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-700" />
              <span>Max {room.capacity} Guests</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bed className="w-4 h-4 text-amber-700" />
              <span>{room.bedType}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-amber-700" />
              <span>{room.isAC ? 'Climate Control AC' : 'Ceiling Fan / Eco Air'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bath className="w-4 h-4 text-amber-700" />
              <span className="truncate" title={room.bathroomInfo}>Ensuite Bath</span>
            </div>
          </div>

          {/* Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.amenities.slice(0, 4).map((amenity, idx) => (
              <span 
                key={idx} 
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-1 rounded-md">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            id={`btn-view-details-${room.id}`}
            onClick={() => onViewDetails(room)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition text-center"
          >
            View Details
          </button>

          <button
            id={`btn-book-now-${room.id}`}
            onClick={() => onBookNow(room)}
            disabled={!available}
            className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs ${
              available
                ? 'bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{available ? 'Book Now' : 'Occupied'}</span>
            {available && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
