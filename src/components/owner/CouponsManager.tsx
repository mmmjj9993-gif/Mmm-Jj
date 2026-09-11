import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle, Clock, Percent, DollarSign, X } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Coupon } from '../../types';

export const CouponsManager: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, hotelProfile } = useHotel();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [form, setForm] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'Percentage',
    discountValue: 15,
    minBookingAmount: 100,
    validUntil: '2026-12-31',
    isActive: true
  });

  const handleToggle = (coupon: Coupon) => {
    updateCoupon({
      ...coupon,
      isActive: !coupon.isActive
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;

    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      hotelId: hotelProfile.id,
      code: form.code.toUpperCase().trim(),
      discountType: form.discountType as 'Percentage' | 'Fixed',
      discountValue: Number(form.discountValue) || 10,
      minBookingAmount: Number(form.minBookingAmount) || 0,
      validUntil: form.validUntil || '2026-12-31',
      isActive: form.isActive !== false
    };

    addCoupon(newCoupon);
    setIsAddOpen(false);
    setForm({
      code: '',
      discountType: 'Percentage',
      discountValue: 15,
      minBookingAmount: 100,
      validUntil: '2026-12-31',
      isActive: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Promotional Coupons & Special Offers
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure discount codes for season campaigns, early bird rates, and special VIP rewards.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-xl tracking-wider">
                  {c.code}
                </span>
                <button
                  onClick={() => handleToggle(c)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Min spend: <strong>${c.minBookingAmount}</strong> • Valid until <strong>{c.validUntil}</strong>
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-400">Campaign Voucher</span>
              <button
                onClick={() => deleteCoupon(c.id)}
                className="text-red-500 hover:text-red-700 text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
                Create Promotional Code
              </h4>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SUMMER20"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl uppercase font-mono font-bold tracking-wider"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm(p => ({ ...p, discountType: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.discountValue}
                    onChange={(e) => setForm(p => ({ ...p, discountValue: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.minBookingAmount}
                    onChange={(e) => setForm(p => ({ ...p, minBookingAmount: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm(p => ({ ...p, validUntil: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl"
                >
                  Save Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
