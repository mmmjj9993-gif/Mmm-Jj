import React from 'react';
import { X, QrCode, ShieldCheck } from 'lucide-react';
import { UPIScannerCard } from './UPIScannerCard';
import { useHotel } from '../../context/HotelContext';

interface UPIScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  note?: string;
  onPaymentComplete?: (refId: string) => void;
}

export const UPIScannerModal: React.FC<UPIScannerModalProps> = ({
  isOpen,
  onClose,
  amount,
  note = 'Direct Hotel Payment',
  onPaymentComplete
}) => {
  const { hotelProfile } = useHotel();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-7 text-white animate-scale-in my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          title="Close Scanner"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-white">
              Scan & Pay via UPI
            </h3>
            <p className="text-xs text-slate-400">
              {hotelProfile.name} • Anandpur Sahib
            </p>
          </div>
        </div>

        {/* The Authentic FamX UPI Scanner Card */}
        <UPIScannerCard 
          amount={amount}
          note={note}
          onPaymentComplete={onPaymentComplete}
          showPaymentConfirmation={!!onPaymentComplete}
        />

        {/* Bottom Help Text */}
        <div className="mt-5 text-center text-xs text-slate-400">
          <p>
            Scan with any UPI App: GPay, PhonePe, Paytm, BHIM, or Banking Apps.
          </p>
          <button
            onClick={onClose}
            className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-medium underline"
          >
            Done & Return to App
          </button>
        </div>
      </div>
    </div>
  );
};
