import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const ContactSection: React.FC = () => {
  const { hotelProfile, addNotification } = useHotel();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Room Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Trigger notification to hotel owner
    addNotification({
      title: `New Inquiry from ${formData.name}`,
      message: `${formData.subject}: "${formData.message}" (Tel: ${formData.phone || 'N/A'}, Email: ${formData.email})`,
      type: 'system',
      targetRole: 'HOTEL_OWNER'
    });

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Room Inquiry',
      message: ''
    });
  };

  const handleWhatsApp = () => {
    const cleanNum = hotelProfile.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = `Hello ${hotelProfile.name}, I am contacting you regarding accommodation and cafeteria reservations.`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div id="section-contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
          Concierge & Location
        </span>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
          Contact Grand Horizon
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Our front desk and reservation specialists are on call 24 hours a day to coordinate your stay.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 cols: Hotel info, WhatsApp card, Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="font-serif-luxury text-2xl font-bold text-amber-400">
              {hotelProfile.name}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">Physical Address</span>
                  <span className="text-slate-400 leading-relaxed">
                    {hotelProfile.address}, {hotelProfile.city}, {hotelProfile.state} - {hotelProfile.zipCode}, {hotelProfile.country}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">Front Desk & Reservations</span>
                  <a href={`tel:${hotelProfile.phone}`} className="text-amber-300 hover:underline">
                    {hotelProfile.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">Official Inquiries</span>
                  <a href={`mailto:${hotelProfile.email}`} className="text-amber-300 hover:underline">
                    {hotelProfile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">Check-In / Out Schedule</span>
                  <span className="text-slate-400">
                    Check-in: {hotelProfile.checkInTime} • Check-out: {hotelProfile.checkOutTime}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Action Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleWhatsApp}
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Map Preview Container */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Interactive Location Map</span>
              </span>
              <a
                href={hotelProfile.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(hotelProfile.name + ' ' + hotelProfile.city)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-amber-700 hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>

            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <iframe
                title="Hotel Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019253457169!2d-122.42177838468205!3d37.80362397975323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580e78877119f%3A0x6d2c4ebf99d63c52!2sFisherman&#39;s%20Wharf%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Right 7 cols: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
              Send an Inquiry to Concierge
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Have a special request, event booking, or question? Fill out the form and our duty manager will respond promptly.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center space-x-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold">Inquiry Transmitted Successfully!</p>
                <p className="text-emerald-700 mt-0.5">
                  Our front office team has received your message and sent a copy to your inbox.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Eleanor Vance"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="eleanor@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="General Room Inquiry">General Room Inquiry</option>
                  <option value="Cafeteria & Banquet Catering">Cafeteria & Banquet Catering</option>
                  <option value="Airport Transfer & Chauffeur">Airport Transfer & Chauffeur</option>
                  <option value="Special Occasion / Anniversary">Special Occasion / Anniversary</option>
                  <option value="Corporate / Group Rates">Corporate / Group Rates</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Message or Detailed Request *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                rows={5}
                placeholder="How may our concierge assist your stay?"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message to Front Desk</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
