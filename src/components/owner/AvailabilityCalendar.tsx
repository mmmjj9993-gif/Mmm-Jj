import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle, 
  User 
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Room } from '../../types';

export const AvailabilityCalendar: React.FC = () => {
  const { rooms, bookings, isRoomAvailable, createBooking } = useHotel();

  // Selected reference month
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate 14 days view starting from currentDate
  const daysToShow = 14;
  const days: Date[] = [];
  for (let i = 0; i < daysToShow; i++) {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + i);
    days.push(d);
  }

  const handlePrev = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  // Helper to check if a specific room is booked on a single day
  const getDayBooking = (roomId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.find(b => {
      if (b.roomId !== roomId) return false;
      if (b.bookingStatus === 'Cancelled') return false;
      return dateStr >= b.checkIn && dateStr < b.checkOut;
    });
  };

  // Quick block room for a day
  const handleQuickBlock = (room: Room, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    const existing = getDayBooking(room.id, date);
    if (existing) {
      alert(`Room ${room.roomNumber} is already booked by ${existing.customerName} on ${dateStr}.`);
      return;
    }

    if (window.confirm(`Block Room ${room.roomNumber} on ${dateStr} for Maintenance / Owner Reserve?`)) {
      createBooking({
        id: `BLK-${Date.now().toString().slice(-6)}`,
        hotelId: room.hotelId,
        customerId: 'owner-block',
        customerName: 'Hotel Maintenance / Blocked',
        customerEmail: 'admin@hotel.com',
        customerPhone: 'N/A',
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomName: room.name,
        roomCategory: room.category,
        checkIn: dateStr,
        checkOut: nextDayStr,
        guests: 1,
        roomsCount: 1,
        numberOfNights: 1,
        basePrice: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
        specialRequests: 'Blocked by Manager',
        paymentStatus: 'Successful',
        paymentMethod: 'DemoGateway',
        transactionId: 'N/A',
        bookingStatus: 'Confirmed',
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Room Availability Matrix & Occupancy Grid
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visual schedule. Green indicates available for booking; Red indicates occupied with guest details.
          </p>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={handlePrev}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 px-2 flex items-center space-x-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {days[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
              {days[days.length - 1].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </span>
          <button
            onClick={handleNext}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 inline-block"></span>
          <span>Vacant & Bookable</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 rounded-md bg-red-500 inline-block"></span>
          <span>Reserved / Guest Stay</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 rounded-md bg-slate-300 inline-block"></span>
          <span>Maintenance Block</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <th className="p-4 w-48 font-bold uppercase text-[11px] sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                Room
              </th>
              {days.map((d, i) => (
                <th key={i} className="p-2 text-center min-w-[70px] border-r border-slate-100">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    {d.toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {d.getDate()}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 font-semibold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-xs">
                  <div className="font-bold text-slate-900">Room {room.roomNumber}</div>
                  <div className="text-[10px] text-amber-800 font-medium truncate max-w-[150px]">{room.name}</div>
                  <div className="text-[10px] text-slate-400">${room.pricePerNight}/night</div>
                </td>

                {days.map((day, idx) => {
                  const booking = getDayBooking(room.id, day);
                  const isBlocked = booking?.customerId === 'owner-block';

                  return (
                    <td
                      key={idx}
                      onClick={() => !booking && handleQuickBlock(room, day)}
                      className={`p-1 text-center border-r border-slate-100 cursor-pointer transition ${
                        booking
                          ? isBlocked
                            ? 'bg-slate-200/80 hover:bg-slate-300'
                            : 'bg-red-50 hover:bg-red-100 text-red-900'
                          : 'bg-emerald-50/40 hover:bg-emerald-100 text-emerald-800'
                      }`}
                      title={
                        booking
                          ? `${booking.customerName} (${booking.checkIn} to ${booking.checkOut})`
                          : 'Click to block for maintenance'
                      }
                    >
                      <div className="h-14 rounded-lg flex flex-col items-center justify-center p-1 text-[10px]">
                        {booking ? (
                          isBlocked ? (
                            <span className="font-mono text-[9px] font-bold text-slate-600">
                              BLOCKED
                            </span>
                          ) : (
                            <>
                              <span className="font-bold truncate max-w-[60px] block leading-tight">
                                {booking.customerName.split(' ')[0]}
                              </span>
                              <span className="text-[9px] text-red-600 block">
                                {booking.id.slice(-4)}
                              </span>
                            </>
                          )
                        ) : (
                          <span className="text-emerald-700 font-semibold opacity-60 hover:opacity-100">
                            Free
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
