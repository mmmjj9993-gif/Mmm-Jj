import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Image, 
  Users, 
  Bed, 
  Wind, 
  X, 
  DollarSign, 
  Sparkles 
} from 'lucide-react';
import { Room, RoomCategory } from '../../types';
import { useHotel } from '../../context/HotelContext';

export const RoomsManager: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom, hotelProfile } = useHotel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState<Partial<Room>>({
    roomNumber: '105',
    name: '',
    category: 'AC Room',
    pricePerNight: 160,
    capacity: 2,
    bedType: '1 King Bed',
    isAC: true,
    bathroomInfo: 'Ensuite luxury bathroom with rain shower & complimentary organic toiletries',
    description: '',
    amenities: ['High-speed Wi-Fi', 'Smart 4K TV', 'Air Conditioning', 'Espresso Machine', 'Mini Bar', 'Ocean View Balcony'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    isAvailable: true
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: `${100 + rooms.length + 1}`,
      name: '',
      category: 'AC Room',
      pricePerNight: 150,
      capacity: 2,
      bedType: '1 King Bed',
      isAC: true,
      bathroomInfo: 'Ensuite marble bathroom with rainfall shower',
      description: '',
      amenities: ['High-speed Wi-Fi', 'Smart 4K TV', 'Air Conditioning', 'Room Service'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({ ...room });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the inventory?`)) {
      deleteRoom(id);
    }
  };

  const handleToggleStatus = (room: Room) => {
    updateRoom({
      ...room,
      isAvailable: !room.isAvailable
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.roomNumber) return;

    if (editingRoom) {
      updateRoom({
        ...editingRoom,
        ...formData
      } as Room);
    } else {
      const newRoom: Room = {
        id: `rm-${Date.now()}`,
        hotelId: hotelProfile.id,
        roomNumber: formData.roomNumber || '100',
        name: formData.name || 'Deluxe Suite',
        category: formData.category as RoomCategory || 'AC Room',
        pricePerNight: Number(formData.pricePerNight) || 120,
        capacity: Number(formData.capacity) || 2,
        bedType: formData.bedType || '1 King Bed',
        isAC: Boolean(formData.isAC),
        bathroomInfo: formData.bathroomInfo || 'Ensuite bathroom',
        description: formData.description || '',
        amenities: formData.amenities || ['Wi-Fi'],
        images: formData.images && formData.images.length > 0 
          ? formData.images 
          : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
        status: 'Available',
        isAvailable: formData.isAvailable !== false
      };
      addRoom(newRoom);
    }

    setIsModalOpen(false);
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: (prev.amenities || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrlInput.trim()]
      }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Room Inventory & Tariff Management
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure room types, adjust nightly rates, update photo galleries, and control active status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room Type</span>
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition"
          >
            <div>
              {/* Room Image */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 px-2.5 py-1 rounded-md text-[11px] font-bold">
                  {room.category}
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleToggleStatus(room)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs flex items-center space-x-1 ${
                      room.isAvailable
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-red-600/90 text-white'
                    }`}
                  >
                    <span>{room.isAvailable ? 'Active in Search' : 'Suspended'}</span>
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 text-slate-800 px-2 py-0.5 rounded text-xs font-bold">
                  Room {room.roomNumber}
                </div>
              </div>

              {/* Room Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-serif-luxury font-bold text-lg text-slate-900 line-clamp-1">
                    {room.name}
                  </h4>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-lg font-bold text-slate-900">${room.pricePerNight}</span>
                    <span className="text-[10px] text-slate-500 block">/ night</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    <span>Max {room.capacity} Guests</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Bed className="w-3.5 h-3.5 text-amber-700" />
                    <span>{room.bedType}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Wind className="w-3.5 h-3.5 text-amber-700" />
                    <span>{room.isAC ? 'Climate AC' : 'Non-AC Fan'}</span>
                  </span>
                  <span className="truncate">
                    {room.images.length} Photos
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 border-t border-slate-100 grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => handleOpenEdit(room)}
                className="py-2 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={() => handleDelete(room.id, room.name)}
                className="py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h4 className="font-serif-luxury font-bold text-lg">
                {editingRoom ? `Edit Room: ${editingRoom.name}` : 'Add New Room / Suite'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Room Number *</label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData(p => ({ ...p, roomNumber: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Room Display Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Deluxe AC King Room"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value as RoomCategory }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="AC Room">AC Room</option>
                    <option value="Non-AC Room">Non-AC Room</option>
                    <option value="Double AC Room">Double AC Room</option>
                    <option value="Bamboo AC Room">Bamboo AC Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Price / Night ($) *</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData(p => ({ ...p, pricePerNight: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Max Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.capacity}
                    onChange={(e) => setFormData(p => ({ ...p, capacity: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Bed Configuration</label>
                  <input
                    type="text"
                    value={formData.bedType}
                    onChange={(e) => setFormData(p => ({ ...p, bedType: e.target.value }))}
                    placeholder="1 King Bed / 2 Queen Beds"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Air Conditioning</label>
                  <div className="flex items-center space-x-4 pt-2">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="ac"
                        checked={formData.isAC === true}
                        onChange={() => setFormData(p => ({ ...p, isAC: true }))}
                        className="text-amber-700"
                      />
                      <span>Air Conditioned (AC)</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="ac"
                        checked={formData.isAC === false}
                        onChange={() => setFormData(p => ({ ...p, isAC: false }))}
                        className="text-amber-700"
                      />
                      <span>Non-AC</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Bathroom Description</label>
                <input
                  type="text"
                  value={formData.bathroomInfo}
                  onChange={(e) => setFormData(p => ({ ...p, bathroomInfo: e.target.value }))}
                  placeholder="Ensuite rainfall shower, premium amenities"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe view, ambiance, space, furniture..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Photo URLs */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Room Photo URLs</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-2 bg-slate-800 text-white rounded-xl"
                  >
                    Add Photo
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.images?.map((url, i) => (
                    <div key={i} className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200">
                      <img src={url} alt="room" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-0 right-0 bg-red-600 text-white p-0.5 text-[9px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Included Amenities</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="e.g. High-speed Wi-Fi, Balcony"
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="px-3 py-2 bg-slate-800 text-white rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.amenities?.map((am, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md flex items-center space-x-1">
                      <span>{am}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(i)}
                        className="text-slate-400 hover:text-red-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold shadow-xs"
                >
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
