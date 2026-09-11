import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Phone, Lock, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loginCustomer, registerCustomer, quickLoginDemoCustomer } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (isRegister) {
      if (!formData.name || !formData.email || !formData.phone) {
        setErrorMsg('Please fill in name, email, and phone.');
        setIsSubmitting(false);
        return;
      }
      const res = await registerCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
      setIsSubmitting(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } else {
      if (!formData.email) {
        setErrorMsg('Please enter your email.');
        setIsSubmitting(false);
        return;
      }
      const res = await loginCustomer(formData.email);
      setIsSubmitting(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Login failed.');
      }
    }
  };

  const handleDemoLogin = () => {
    quickLoginDemoCustomer();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        id="modal-customer-auth"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Guest Account
            </span>
            <h3 className="font-serif-luxury text-xl font-bold">
              {isRegister ? 'Create Guest Profile' : 'Sign In to Your Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Fill */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-100 flex items-center justify-between text-xs">
          <span className="text-amber-900 font-medium flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Prototype Evaluation:</span>
          </span>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="font-bold text-amber-800 hover:text-amber-950 underline"
          >
            1-Click Demo Guest Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Eleanor Vance"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="guest@example.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required={isRegister}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Billing City / Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                    placeholder="Marina Bay, CA"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 mt-4"
          >
            <span>{isSubmitting ? 'Processing...' : isRegister ? 'Complete Registration' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-amber-800 hover:underline"
              >
                Sign In here
              </button>
            </p>
          ) : (
            <p>
              Don't have a profile yet?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-amber-800 hover:underline"
              >
                Register as New Guest
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
