import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertCircle, Clock } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const PolicyViews: React.FC = () => {
  const { hotelProfile } = useHotel();
  const [activeTab, setActiveTab] = useState<'cancellation' | 'terms' | 'privacy'>('cancellation');

  return (
    <div id="section-policies" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
          Trust & Compliance
        </span>
        <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1">
          Hotel Policies & Terms
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Clear, transparent booking standards designed to guarantee your peace of mind.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl space-x-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cancellation')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'cancellation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cancellation Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'terms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'privacy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm leading-relaxed text-slate-700 text-sm space-y-6">
        {activeTab === 'cancellation' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2 text-amber-800 font-bold">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif-luxury text-xl">Standard Cancellation Policy</h3>
            </div>
            <p className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-amber-900 text-xs font-medium">
              {hotelProfile.cancellationPolicy}
            </p>
            <div className="space-y-3 text-xs text-slate-600 pt-2">
              <p>• <strong>Advance Notice:</strong> Cancellations made at least 48 hours prior to check-in (14:00 hotel local time) receive a 100% full refund with zero cancellation fees.</p>
              <p>• <strong>Late Cancellation:</strong> Cancellations received within 48 hours of scheduled arrival are subject to a fee equal to the first night's room rate plus applicable taxes.</p>
              <p>• <strong>No-Shows:</strong> In the event of a guest no-show, the entire booking amount will be retained by the property.</p>
              <p>• <strong>Refund Processing:</strong> Approved refunds will be automatically credited to the original payment source within 3-5 business banking days.</p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2 text-amber-800 font-bold">
              <FileText className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif-luxury text-xl">Terms & Conditions of Stay</h3>
            </div>
            <p className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs">
              {hotelProfile.termsAndConditions}
            </p>
            <div className="space-y-3 text-xs text-slate-600 pt-2">
              <p>• <strong>Check-In & Check-Out:</strong> Standard check-in begins at {hotelProfile.checkInTime}. Check-out is strictly until {hotelProfile.checkOutTime}. Early check-in or late check-out is subject to room availability.</p>
              <p>• <strong>Identification:</strong> Every staying adult guest must furnish an official government photo ID (Passport, Driving License, or National Identity Card) at the front desk upon arrival.</p>
              <p>• <strong>Occupancy Restrictions:</strong> Total guests per room must not exceed the stated room capacity.</p>
              <p>• <strong>Smoking & Damages:</strong> All interior rooms and enclosed suites are non-smoking. Guests are held liable for any deliberate damage or loss to hotel fixtures.</p>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2 text-amber-800 font-bold">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif-luxury text-xl">Guest Privacy & Data Protection</h3>
            </div>
            <p className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-emerald-900 text-xs">
              {hotelProfile.privacyPolicy}
            </p>
            <div className="space-y-3 text-xs text-slate-600 pt-2">
              <p>• <strong>Personal Information:</strong> We store only necessary information required to manage reservations and food orders (name, email, phone number, and stay dates).</p>
              <p>• <strong>Payment Security:</strong> Card details and bank credentials are processed exclusively via tokenized 256-bit SSL encrypted payment channels and are never stored in plain text.</p>
              <p>• <strong>No Marketing Spam:</strong> We will never sell, lease, or distribute your email or phone number to third-party marketing brokers.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
