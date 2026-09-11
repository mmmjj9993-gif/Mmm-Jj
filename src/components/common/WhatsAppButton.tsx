import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const WhatsAppButton: React.FC = () => {
  const { hotelProfile } = useHotel();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cleanNumber = hotelProfile.whatsappNumber.replace(/[^0-9]/g, '');

  const openWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const predefinedMessages = [
    'Hello, I want to book a room at Grand Horizon.',
    'Hello, I want to know room availability for upcoming dates.',
    'Hello, I want to know about the cafeteria menu and room service.',
    'Hello, I have an inquiry regarding check-in and hotel policies.'
  ];

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div 
          id="whatsapp-chat-popup"
          className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 transform scale-100"
        >
          {/* Header */}
          <div className="bg-[#128C7E] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{hotelProfile.name}</h4>
                <p className="text-xs text-emerald-100 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  <span>Concierge Online</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3 max-h-72 overflow-y-auto text-sm">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-slate-700">
              <p className="font-medium text-slate-900 mb-1">Welcome to Grand Horizon! 👋</p>
              <p className="text-xs text-slate-500">How may our front desk concierge assist you today?</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Inquiries</p>
              {predefinedMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => openWhatsApp(msg)}
                  className="w-full text-left p-2.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs transition duration-150 flex items-center justify-between"
                >
                  <span className="line-clamp-2">{msg}</span>
                  <Send className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Custom message */}
            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Type a custom inquiry..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customMsg.trim()) {
                      openWhatsApp(customMsg.trim());
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (customMsg.trim()) openWhatsApp(customMsg.trim());
                  }}
                  disabled={!customMsg.trim()}
                  className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#20bd5a] disabled:opacity-50 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 px-4 py-2 text-center text-[10px] text-slate-500 border-t border-slate-200">
            Hotel WhatsApp: {hotelProfile.whatsappNumber}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        id="btn-open-whatsapp"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-300"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
};
