import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Printer, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Users, 
  Tag, 
  Download, 
  Sparkles,
  Smartphone,
  Building,
  DollarSign
} from 'lucide-react';
import { Room, Booking, PaymentMethod, PaymentStatus } from '../../types';
import { useHotel } from '../../context/HotelContext';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';

interface Props {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete?: (booking: Booking) => void;
}

export const BookingFlowModal: React.FC<Props> = ({
  room,
  isOpen,
  onClose,
  onBookingComplete
}) => {
  const { hotelProfile, createBooking, validateCoupon, searchDates } = useHotel();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedDates, setSelectedDates] = useState({
    checkIn: searchDates.checkIn,
    checkOut: searchDates.checkOut,
    guests: searchDates.guests,
    roomsCount: searchDates.roomsCount
  });

  const [guestDetails, setGuestDetails] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    specialRequests: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('DemoGateway');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Sync dates when modal opens or room changes
  useEffect(() => {
    if (isOpen) {
      setSelectedDates({
        checkIn: searchDates.checkIn,
        checkOut: searchDates.checkOut,
        guests: searchDates.guests,
        roomsCount: searchDates.roomsCount
      });
      if (currentUser) {
        setGuestDetails(prev => ({
          ...prev,
          name: currentUser.name || prev.name,
          email: currentUser.email || prev.email,
          phone: currentUser.phone || prev.phone,
          address: currentUser.address || prev.address
        }));
      }
      setStep(1);
      setCreatedBooking(null);
      setAppliedDiscount(0);
      setCouponCode('');
      setCouponFeedback(null);
    }
  }, [isOpen, searchDates, currentUser]);

  if (!isOpen || !room) return null;

  // Calculate pricing
  const dIn = new Date(selectedDates.checkIn);
  const dOut = new Date(selectedDates.checkOut);
  const diffTime = dOut.getTime() - dIn.getTime();
  const numberOfNights = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));

  const basePrice = room.pricePerNight * numberOfNights * selectedDates.roomsCount;
  const taxAmount = (basePrice * hotelProfile.taxRatePercent) / 100;
  const grossTotal = basePrice + taxAmount;
  const finalTotal = Math.max(0, grossTotal - appliedDiscount);

  // Availability validation
  const isAvailable = storageService.isRoomAvailable(room.id, selectedDates.checkIn, selectedDates.checkOut);

  // Apply Coupon Handler
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const result = validateCoupon(couponCode, basePrice);
    if (result.valid) {
      setAppliedDiscount(result.discountAmount);
      setCouponFeedback({ success: true, message: result.message });
    } else {
      setAppliedDiscount(0);
      setCouponFeedback({ success: false, message: result.message });
    }
  };

  // Submit and finalize booking
  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);

    // Simulate payment gateway delay (500ms)
    setTimeout(async () => {
      const newBookingId = storageService.getNextBookingId();
      const newBooking: Booking = {
        id: newBookingId,
        hotelId: hotelProfile.id,
        customerId: currentUser?.id || `guest-${Date.now()}`,
        customerName: guestDetails.name,
        customerEmail: guestDetails.email,
        customerPhone: guestDetails.phone,
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomName: room.name,
        roomCategory: room.category,
        checkIn: selectedDates.checkIn,
        checkOut: selectedDates.checkOut,
        guests: selectedDates.guests,
        roomsCount: selectedDates.roomsCount,
        numberOfNights,
        basePrice,
        taxAmount,
        discountAmount: appliedDiscount,
        totalAmount: finalTotal,
        couponCode: appliedDiscount > 0 ? couponCode.toUpperCase() : undefined,
        specialRequests: guestDetails.specialRequests || undefined,
        paymentStatus: 'Successful',
        paymentMethod,
        transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        bookingStatus: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      await createBooking(newBooking);
      setCreatedBooking(newBooking);
      setIsProcessingPayment(false);
      setStep(6); // Confirmation screen
      if (onBookingComplete) {
        onBookingComplete(newBooking);
      }
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!createdBooking) return;
    const msg = `*Booking Confirmation - ${hotelProfile.name}*\n` +
      `Booking ID: ${createdBooking.id}\n` +
      `Guest: ${createdBooking.customerName}\n` +
      `Room: ${createdBooking.roomName} (Room ${createdBooking.roomNumber})\n` +
      `Check-in: ${createdBooking.checkIn}\n` +
      `Check-out: ${createdBooking.checkOut}\n` +
      `Nights: ${createdBooking.numberOfNights} | Guests: ${createdBooking.guests}\n` +
      `Total Paid: $${createdBooking.totalAmount.toFixed(2)}\n\n` +
      `We look forward to welcoming you to Grand Horizon!`;
    const cleanNumber = hotelProfile.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const stepsList = [
    'Room',
    'Dates',
    'Guest Details',
    'Review',
    'Payment',
    'Confirmation'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        id="modal-booking-flow"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Topbar with Step Progress */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Reservation System
            </span>
            <h3 className="font-serif-luxury text-lg font-bold">
              {step === 6 ? 'Booking Confirmed!' : `Step ${step} of 5: ${stepsList[step - 1]}`}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Pills (Steps 1 to 5) */}
        {step < 6 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between overflow-x-auto text-xs">
            {stepsList.slice(0, 5).map((label, idx) => {
              const current = idx + 1;
              const isCompleted = current < step;
              const isActive = current === step;
              return (
                <div key={idx} className="flex items-center space-x-2 flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isActive
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : current}
                  </div>
                  <span className={`font-medium ${isActive ? 'text-amber-900 font-bold' : 'text-slate-500'}`}>
                    {label}
                  </span>
                  {idx < 4 && <span className="text-slate-300 mx-1">›</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SELECT / CONFIRM ROOM */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full sm:w-40 h-28 object-cover rounded-xl shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 text-left">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    {room.category} • Room {room.roomNumber}
                  </span>
                  <h4 className="font-serif-luxury text-xl font-bold text-slate-900">{room.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{room.description}</p>
                  <div className="mt-2 text-sm font-bold text-slate-900">
                    ${room.pricePerNight} <span className="text-xs font-normal text-slate-500">/ night</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Complimentary with this reservation:</span>
                </p>
                <p>• High-speed Wi-Fi, 24/7 Concierge, Welcome Cocktail at Cafeteria, and Daily Housekeeping.</p>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DATES & GUESTS */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h4 className="font-semibold text-slate-900 text-sm">Select Your Reservation Dates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Check-In Date</label>
                  <input
                    type="date"
                    value={selectedDates.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Check-Out Date</label>
                  <input
                    type="date"
                    value={selectedDates.checkOut}
                    min={selectedDates.checkIn}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Number of Guests</label>
                  <select
                    value={selectedDates.guests}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, guests: Number(e.target.value) }))}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Number of Rooms</label>
                  <select
                    value={selectedDates.roomsCount}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, roomsCount: Number(e.target.value) }))}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                  </select>
                </div>
              </div>

              {/* Real Availability Check banner */}
              {isAvailable ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Room {room.roomNumber} is available for {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'} ({selectedDates.checkIn} to {selectedDates.checkOut}).</span>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>Room {room.roomNumber} is currently occupied or booked for these dates. Please modify your dates.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: GUEST DETAILS */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-semibold text-slate-900 text-sm">Guest Contact & Identification</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={guestDetails.name}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number (with country code) *</label>
                  <input
                    type="tel"
                    value={guestDetails.phone}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +1 555 123 4567"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={guestDetails.email}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. eleanor@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Billing City / Address</label>
                  <input
                    type="text"
                    value={guestDetails.address}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Special Requests (Optional)</label>
                <textarea
                  value={guestDetails.specialRequests}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Late check-in, dietary restrictions for breakfast, high floor preference, airport pickup inquiry, etc."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW BOOKING & COUPONS */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <h4 className="font-semibold text-slate-900 text-sm">Review Reservation Summary</h4>

              {/* Summary breakdown box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Accommodation:</span>
                  <span className="font-semibold text-slate-800">{room.name} (Room {room.roomNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dates:</span>
                  <span className="font-semibold text-slate-800">{selectedDates.checkIn} to {selectedDates.checkOut} ({numberOfNights} nights)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guests & Rooms:</span>
                  <span className="font-semibold text-slate-800">{selectedDates.guests} Guests • {selectedDates.roomsCount} Room</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Guest:</span>
                  <span className="font-semibold text-slate-800">{guestDetails.name} ({guestDetails.phone})</span>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
                <label className="block text-xs font-bold text-amber-900 mb-1.5 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  <span>Have a Promo Coupon Code?</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Try 'WELCOME10' or 'HORIZON50'"
                    className="flex-1 p-2.5 bg-white border border-amber-300 rounded-xl text-xs uppercase font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Apply
                  </button>
                </div>

                {couponFeedback && (
                  <p className={`text-xs mt-2 font-medium ${couponFeedback.success ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Final Cost Breakdown */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Room Charge (${room.pricePerNight} x {numberOfNights} nights)</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>State & Hotel Occupancy Taxes ({hotelProfile.taxRatePercent}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Promotional Discount</span>
                    <span>-${appliedDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount Payable</span>
                  <span className="text-amber-400">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PAYMENT (INTEGRATION-READY + DEMO GATEWAY) */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900 text-sm">Select Secure Payment Method</h4>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  256-Bit SSL Encrypted
                </span>
              </div>

              {/* Demo Mode Notice as required by prompt */}
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-900 flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Test / Demo Payment Mode Active</p>
                  <p className="text-blue-700 mt-0.5">
                    For prototype testing, instant confirmation is simulated. No real credit card or bank account will be charged. Payment architecture is production-ready for Stripe/Razorpay.
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label 
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                    paymentMethod === 'DemoGateway' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="DemoGateway"
                    checked={paymentMethod === 'DemoGateway'}
                    onChange={() => setPaymentMethod('DemoGateway')}
                    className="mt-1 text-amber-700 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Instant Demo Card / Test Pay</span>
                    <span className="text-[11px] text-slate-500">1-click instant booking confirmation for testing.</span>
                  </div>
                </label>

                <label 
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                    paymentMethod === 'UPI' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-amber-700 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block flex items-center space-x-1">
                      <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                      <span>UPI / QR Payment</span>
                    </span>
                    <span className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, BHIM instant transfer.</span>
                  </div>
                </label>

                <label 
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                    paymentMethod === 'Card' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="mt-1 text-amber-700 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block flex items-center space-x-1">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                      <span>Credit / Debit Card</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Visa, Mastercard, American Express.</span>
                  </div>
                </label>

                <label 
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                    paymentMethod === 'NetBanking' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="NetBanking"
                    checked={paymentMethod === 'NetBanking'}
                    onChange={() => setPaymentMethod('NetBanking')}
                    className="mt-1 text-amber-700 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-amber-600" />
                      <span>Net Banking & Wallets</span>
                    </span>
                    <span className="text-[11px] text-slate-500">All major banks supported.</span>
                  </div>
                </label>
              </div>

              {/* Total reminder */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Due Now</span>
                  <span className="text-2xl font-bold text-amber-400">${finalTotal.toFixed(2)}</span>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span>Room {room.roomNumber}</span>
                  <span className="block">{selectedDates.checkIn} to {selectedDates.checkOut}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: BOOKING CONFIRMATION & RECEIPT */}
          {step === 6 && createdBooking && (
            <div id="booking-confirmation-receipt" className="space-y-6 animate-fade-in text-slate-900">
              {/* Success Banner */}
              <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif-luxury text-2xl font-bold text-emerald-900">
                  Reservation Confirmed!
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  A confirmation receipt has been generated and recorded in the hotel system.
                </p>
              </div>

              {/* Printable Official Receipt Box */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/50 space-y-4 text-xs">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-amber-800 font-bold uppercase tracking-wider text-xs block">
                      {hotelProfile.name}
                    </span>
                    <span className="text-slate-500 text-[11px] block">{hotelProfile.address}, {hotelProfile.city}</span>
                    <span className="text-slate-500 text-[11px] block">Concierge: {hotelProfile.phone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Booking ID</span>
                    <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-300 inline-block">
                      {createdBooking.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Guest Name</span>
                    <span className="font-semibold text-slate-800">{createdBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contact Phone</span>
                    <span className="font-semibold text-slate-800">{createdBooking.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Room Reserved</span>
                    <span className="font-semibold text-slate-800">{createdBooking.roomName} (Room {createdBooking.roomNumber})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Occupancy</span>
                    <span className="font-semibold text-slate-800">{createdBooking.guests} Guests ({createdBooking.roomsCount} Room)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Check-In Date</span>
                    <span className="font-semibold text-slate-800">{createdBooking.checkIn} ({hotelProfile.checkInTime})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Check-Out Date</span>
                    <span className="font-semibold text-slate-800">{createdBooking.checkOut} ({hotelProfile.checkOutTime})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Payment Status</span>
                    <span className="font-semibold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{createdBooking.paymentStatus} ({createdBooking.paymentMethod})</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Transaction Reference</span>
                    <span className="font-mono text-slate-800">{createdBooking.transactionId}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold">
                  <span>Total Paid (incl. taxes & discount)</span>
                  <span className="text-amber-800 text-lg">${createdBooking.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons: Print, WhatsApp share, Done */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
                <button
                  onClick={handlePrint}
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 flex items-center justify-center space-x-2 transition"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Download / Print Receipt</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Confirmation</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 && step < 6 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center space-x-1 hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {step === 1 && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          )}

          {step < 5 && (
            <button
              id={`btn-booking-step-${step}-next`}
              onClick={() => {
                if (step === 2 && !isAvailable) return;
                if (step === 3 && (!guestDetails.name || !guestDetails.email || !guestDetails.phone)) {
                  alert('Please fill in your name, email, and phone number.');
                  return;
                }
                setStep(step + 1);
              }}
              disabled={step === 2 && !isAvailable}
              className={`ml-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                step === 2 && !isAvailable
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-700 hover:bg-amber-800 text-white shadow-sm'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 5 && (
            <button
              id="btn-pay-and-confirm"
              onClick={handleProcessPayment}
              disabled={isProcessingPayment}
              className="ml-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition flex items-center space-x-2"
            >
              {isProcessingPayment ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <span>Confirm & Pay ${finalTotal.toFixed(2)}</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {step === 6 && (
            <button
              onClick={onClose}
              className="ml-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
