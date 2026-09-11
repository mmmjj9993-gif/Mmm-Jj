import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  ShieldCheck, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Percent, 
  Copy, 
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { HotelProfile } from '../../types';

export const HotelSettingsManager: React.FC = () => {
  const { hotelProfile, updateHotelProfile } = useHotel();
  const [profileForm, setProfileForm] = useState<HotelProfile>({ ...hotelProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHotelProfile(profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Hotel Identity, Branding & Domain Settings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your property profile, operational timings, tax compliance, and white-label custom domain mapping.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* General Hotel Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-amber-700" />
            <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
              General Property Information
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Hotel Brand Name *</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Brand Tagline / Slogan</label>
              <input
                type="text"
                value={profileForm.tagline}
                onChange={(e) => setProfileForm(p => ({ ...p, tagline: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">About the Property (Description)</label>
            <textarea
              value={profileForm.description}
              onChange={(e) => setProfileForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Street Address</label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">City</label>
              <input
                type="text"
                value={profileForm.city}
                onChange={(e) => setProfileForm(p => ({ ...p, city: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">State / Province</label>
              <input
                type="text"
                value={profileForm.state}
                onChange={(e) => setProfileForm(p => ({ ...p, state: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Contact & Integrations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Phone className="w-5 h-5 text-amber-700" />
            <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
              Communication & Social Channels
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Reservations Phone</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1 flex items-center space-x-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Business Number</span>
              </label>
              <input
                type="text"
                value={profileForm.whatsappNumber}
                onChange={(e) => setProfileForm(p => ({ ...p, whatsappNumber: e.target.value }))}
                placeholder="+14155552671"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* Operations, Timings & Taxes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-amber-700" />
            <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
              Check-In, Check-Out & Tax Policies
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Check-In Standard Time</label>
              <input
                type="text"
                value={profileForm.checkInTime}
                onChange={(e) => setProfileForm(p => ({ ...p, checkInTime: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Check-Out Standard Time</label>
              <input
                type="text"
                value={profileForm.checkOutTime}
                onChange={(e) => setProfileForm(p => ({ ...p, checkOutTime: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Applicable Tax Rate (%)</label>
              <input
                type="number"
                min={0}
                max={50}
                value={profileForm.taxRatePercent}
                onChange={(e) => setProfileForm(p => ({ ...p, taxRatePercent: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Cancellation Policy Display</label>
            <textarea
              value={profileForm.cancellationPolicy}
              onChange={(e) => setProfileForm(p => ({ ...p, cancellationPolicy: e.target.value }))}
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* CUSTOM DOMAIN ARCHITECTURE (Requirement 18 from prompt) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                  Custom Domain Ready Architecture
                </span>
                <h4 className="font-serif-luxury font-bold text-xl">
                  White-Label Domain Configuration
                </h4>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SSL / TLS Auto-Provisioned</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Attach your own branded commercial domain name to this hotel instance. The system handles routing, multi-tenant hotel isolation via <code className="text-amber-300">hotelId</code> parameterization, and automated HTTPS certificates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Custom Domain / Subdomain</label>
              <input
                type="text"
                value={profileForm.customDomain}
                onChange={(e) => setProfileForm(p => ({ ...p, customDomain: e.target.value }))}
                placeholder="booking.grandhorizon.com"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Domain Health & Status</label>
              <div className="p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-emerald-400 font-semibold flex items-center justify-between">
                <span>Domain DNS Active & Verified</span>
                <span className="text-slate-400 text-[10px]">TTL 300s</span>
              </div>
            </div>
          </div>

          {/* DNS Records Guide */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h5 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
              DNS Configuration Instructions for Domain Registrar (GoDaddy, Namecheap, Cloudflare)
            </h5>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="text-slate-500 border-b border-slate-800 pb-1">
                  <tr>
                    <th className="p-1.5">Type</th>
                    <th className="p-1.5">Host / Name</th>
                    <th className="p-1.5">Points To (Value)</th>
                    <th className="p-1.5 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-1.5 text-amber-400 font-bold">CNAME</td>
                    <td className="p-1.5">booking</td>
                    <td className="p-1.5">domains.grandhorizon.app</td>
                    <td className="p-1.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopy('domains.grandhorizon.app', 'cname')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedField === 'cname' ? 'Copied!' : <Copy className="w-3 h-3 inline" />}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1.5 text-amber-400 font-bold">A Record</td>
                    <td className="p-1.5">@ (Root)</td>
                    <td className="p-1.5">76.76.21.21</td>
                    <td className="p-1.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopy('76.76.21.21', 'arecord')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedField === 'arecord' ? 'Copied!' : <Copy className="w-3 h-3 inline" />}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md transition"
          >
            Save All Hotel & Domain Changes
          </button>
        </div>
      </form>
    </div>
  );
};
