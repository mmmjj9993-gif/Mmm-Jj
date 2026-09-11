import React from 'react';
import { Sparkles, Award, ShieldCheck, HeartHandshake, Compass, Clock } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const AboutSection: React.FC = () => {
  const { hotelProfile } = useHotel();

  return (
    <div id="section-about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 tracking-wide uppercase">
          <Award className="w-3.5 h-3.5 text-amber-700" />
          <span>Heritage of Distinction & Modern Coastal Luxury</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Welcome to {hotelProfile.name}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
          Nestled along pristine coastal bluffs, {hotelProfile.name} is an oasis where timeless architecture, natural bamboo craftsmanship, and refined culinary gastronomy converge.
        </p>
      </div>

      {/* Visual Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-7 rounded-3xl overflow-hidden shadow-lg h-80 sm:h-96 relative group">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
            alt="Hotel Resort Grounds"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
            <div className="text-white">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-300">Architecture</span>
              <h3 className="font-serif-luxury text-2xl font-bold">Crafted for Serenity</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Eco-sustainable timber, floor-to-ceiling panoramic glass, and secluded botanical garden walkways.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-rows-2 gap-6">
          <div className="rounded-3xl overflow-hidden shadow-md relative group h-44 sm:h-auto">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
              alt="Luxury Spa"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">Wellness</span>
                <h4 className="font-serif-luxury text-lg font-bold">Horizon Mineral Spa</h4>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-md relative group h-44 sm:h-auto">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
              alt="Cafeteria Dining"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">Dining</span>
                <h4 className="font-serif-luxury text-lg font-bold">The Grand Terrace Cafeteria</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars of Hospitality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-serif-luxury font-bold text-lg text-slate-900">Bespoke Living</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every suite is acoustically treated and equipped with climate control, organic luxury cottons, and rain showers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-serif-luxury font-bold text-lg text-slate-900">24/7 Room Service</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Order directly from your phone through our digital cafeteria menu for swift, warm delivery straight to your door.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h4 className="font-serif-luxury font-bold text-lg text-slate-900">Prime Location</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Minutes from world-class marina excursions, cultural landmarks, and white sand beaches.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-serif-luxury font-bold text-lg text-slate-900">Safe & Certified</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            256-bit SSL encrypted booking confirmations, transparent cancellation policies, and 24-hour on-site security.
          </p>
        </div>
      </div>
    </div>
  );
};
