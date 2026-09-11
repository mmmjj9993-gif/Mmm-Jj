import React from 'react';
import { Hotel, Phone, Mail, MapPin, MessageCircle, ShieldCheck, Heart } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

interface FooterProps {
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  onOpenOwnerLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, onNavigate, onOpenOwnerLogin }) => {
  const { hotelProfile } = useHotel();

  const handleNav = (view: string) => {
    if (setCurrentView) setCurrentView(view);
    if (onNavigate) onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-luxury font-bold text-lg text-white block">
                  {hotelProfile.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-500 block">
                  Luxury Coastal Haven
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {hotelProfile.description}
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Online Reservations Active 24/7</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">
              Explore Hotel
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-amber-400 transition">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('rooms')} className="hover:text-amber-400 transition">
                  Room Suites & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('cafeteria')} className="hover:text-amber-400 transition">
                  Cafeteria & Gourmet Dining
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('my-bookings')} className="hover:text-amber-400 transition">
                  My Bookings & Orders
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-amber-400 transition">
                  About Our Heritage
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-amber-400 transition">
                  Location & Map Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies & Security */}
          <div>
            <h4 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">
              Guest Policies & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('policies')} className="hover:text-amber-400 transition">
                  Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('policies')} className="hover:text-amber-400 transition">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('policies')} className="hover:text-amber-400 transition">
                  Privacy & Data Security
                </button>
              </li>
              <li>
                <span className="text-slate-500">Check-in: {hotelProfile.checkInTime}</span>
              </li>
              <li>
                <span className="text-slate-500">Check-out: {hotelProfile.checkOutTime}</span>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={onOpenOwnerLogin}
                className="inline-flex items-center space-x-1.5 text-xs text-amber-500 hover:text-amber-400 font-medium py-1 px-2.5 rounded bg-amber-950/40 border border-amber-800/50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Hotel Owner Management Portal</span>
              </button>
            </div>
          </div>

          {/* Col 4: Contact & WhatsApp */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>{hotelProfile.address}, {hotelProfile.city}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>{hotelProfile.phone}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>{hotelProfile.email}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>WhatsApp: {hotelProfile.whatsappNumber}</span>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-slate-500">
                Custom Domain Ready: {hotelProfile.customDomain || 'custom.domain'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} {hotelProfile.name}. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with hospitality</span>
            <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600 inline" />
            <span>for discerning travelers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
