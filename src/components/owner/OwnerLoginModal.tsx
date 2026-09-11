import React, { useState } from 'react';
import { X, Lock, Mail, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OwnerLoginModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { loginOwner, quickLoginDemoOwner } = useAuth();

  const [email, setEmail] = useState('owner@grandhorizon.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await loginOwner(email, password);
    setIsSubmitting(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || 'Invalid administrator credentials.');
    }
  };

  const handleDemoOwner = () => {
    quickLoginDemoOwner();
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="modal-owner-login"
        className="w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                Administrative Access
              </span>
              <h3 className="font-serif-luxury text-lg font-bold">
                Hotel Owner & Management Portal
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Login Trigger */}
        <div className="bg-amber-950/50 px-6 py-3 border-b border-amber-900/50 flex items-center justify-between text-xs">
          <span className="text-amber-300 font-medium flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Prototype Admin Credentials:</span>
          </span>
          <button
            type="button"
            onClick={handleDemoOwner}
            className="font-bold text-amber-400 hover:text-amber-300 underline"
          >
            1-Click Demo Owner Sign-In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200 font-medium flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Administrative Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@grandhorizon.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Management Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Default prototype passcode is <code className="text-amber-400 font-mono">admin123</code>
        </div>
      </div>
    </div>
  );
};
