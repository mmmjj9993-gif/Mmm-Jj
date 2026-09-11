import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  Phone, 
  Sparkles,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

interface UPIScannerCardProps {
  amount?: number;
  note?: string;
  onPaymentComplete?: (refId: string) => void;
  showPaymentConfirmation?: boolean;
  className?: string;
}

export const UPIScannerCard: React.FC<UPIScannerCardProps> = ({
  amount,
  note = 'Hotel Reservation',
  onPaymentComplete,
  showPaymentConfirmation = false,
  className = ''
}) => {
  const { hotelProfile } = useHotel();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const upiId = hotelProfile.upiId || '9877932787@fam';
  const payeeName = hotelProfile.upiPayeeName || 'Manjeet Singh';
  const phoneNumber = hotelProfile.upiPhone || '9877932787';

  // Build standard UPI payment URI
  const upiUri = React.useMemo(() => {
    let uri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&cu=INR`;
    if (amount && amount > 0) {
      uri += `&am=${amount.toFixed(2)}`;
    }
    if (note) {
      uri += `&tn=${encodeURIComponent(note)}`;
    }
    return uri;
  }, [upiId, payeeName, amount, note]);

  // Generate QR Code image data URL
  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#111827',
        light: '#FDFBF7'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR Code', err));
  }, [upiUri]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pay ${payeeName} via UPI`,
          text: `Scan or pay to UPI ID: ${upiId} (${payeeName}) for ${hotelProfile.name}, Anandpur Sahib.`,
          url: upiUri
        });
      } catch {
        handleCopyUPI();
      }
    } else {
      handleCopyUPI();
    }
  };

  const handleConfirmUTR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) return;
    setIsConfirmed(true);
    if (onPaymentComplete) {
      onPaymentComplete(utrNumber.trim());
    }
  };

  return (
    <div className={`w-full max-w-sm mx-auto select-none ${className}`}>
      {/* Outer Shell styled with the exact FamX dark aesthetics from screenshot */}
      <div className="relative rounded-[28px] bg-gradient-to-b from-[#18181b] via-[#0f0f11] to-[#09090b] text-white p-5 sm:p-6 shadow-2xl border border-white/10 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Check Balance or Amount */}
        <div className="text-center mb-5 relative z-10">
          <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
            {amount ? 'Total Amount Payable' : 'Check Balance / Direct UPI'}
          </p>
          <div className="flex items-center justify-center space-x-1 mt-0.5">
            <span className="text-sm font-semibold text-slate-400">₹</span>
            <span className="text-2xl font-bold tracking-wider font-mono text-white">
              {amount ? amount.toLocaleString('en-IN') : 'XXXX'}
            </span>
            <span className="text-slate-500 text-xs ml-1.5">
              {!amount && (
                <span className="inline-block px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">
                  Any Amount
                </span>
              )}
            </span>
          </div>
        </div>

        {/* QR Code Container with fun decorative stickers from screenshot */}
        <div className="relative p-4 rounded-3xl bg-[#1e1e24]/90 border border-white/10 shadow-inner flex flex-col items-center justify-center my-2">
          {/* Smiley sticker top-left */}
          <div className="absolute -top-2 -left-2 w-9 h-9 rounded-full bg-amber-400 shadow-md border-2 border-black flex items-center justify-center text-black text-sm font-bold rotate-[-12deg] z-20">
            😊
          </div>

          {/* Green heart sticker top-right */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-950/80 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center text-xs rotate-[15deg] z-20 shadow-md">
            💚
          </div>

          {/* Golden Trophy sticker bottom-left */}
          <div className="absolute -bottom-2.5 -left-2.5 w-9 h-9 rounded-xl bg-amber-950 border border-amber-400/60 flex items-center justify-center text-amber-300 text-base rotate-[8deg] z-20 shadow-md">
            🏆
          </div>

          {/* Stars sticker bottom-right */}
          <div className="absolute -bottom-2 -right-2 flex space-x-0.5 text-amber-400 rotate-[-10deg] z-20 drop-shadow">
            <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300" />
          </div>

          {/* QR Image Box */}
          <div className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-2xl overflow-hidden bg-[#FDFBF7] p-2 flex items-center justify-center shadow-lg">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="UPI Scanner QR Code"
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}

            {/* Center Bird Icon Badge (matches screenshot) */}
            <div className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-black/95 border-2 border-amber-400/90 flex items-center justify-center shadow-lg pointer-events-none">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-400 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" opacity="0.1" />
                <path d="M21 7.28a7.84 7.84 0 0 0-2.48.96 4.3 4.3 0 0 0-3.66-1.92c-2.4 0-4.35 1.95-4.35 4.35 0 .34.04.67.12.98A12.33 12.33 0 0 1 1.7 6.6a4.34 4.34 0 0 0 1.34 5.8 4.3 4.3 0 0 1-1.97-.54v.05c0 2.1 1.5 3.86 3.48 4.26a4.35 4.35 0 0 1-1.96.07c.56 1.72 2.15 2.97 4.04 3A8.72 8.72 0 0 1 1 21.05 12.3 12.3 0 0 0 7.66 23c7.99 0 12.36-6.62 12.36-12.36 0-.19 0-.37-.01-.56A8.84 8.84 0 0 0 22 7.78a8.68 8.68 0 0 1-2.52.69 4.4 4.4 0 0 0 1.93-2.43 8.76 8.76 0 0 1-2.73 1.04 4.3 4.3 0 0 0-3.1-1.34c-2.38 0-4.3 1.93-4.3 4.3 0 .34.04.67.11.98-3.57-.18-6.74-1.89-8.86-4.5a4.29 4.29 0 0 0-.58 2.16c0 1.49.76 2.81 1.91 3.58a4.27 4.27 0 0 1-1.95-.54v.05c0 2.08 1.48 3.82 3.44 4.22-.36.1-.74.15-1.13.15-.28 0-.54-.03-.8-.08.55 1.7 2.14 2.94 4.02 2.97A8.64 8.64 0 0 1 1 20.84a12.18 12.18 0 0 0 6.6 1.93c7.92 0 12.25-6.56 12.25-12.25 0-.19 0-.37-.01-.56.84-.61 1.57-1.37 2.16-2.24z" />
              </svg>
            </div>
          </div>
        </div>

        {/* UPI ID Pill with 1-Click Copy and Share */}
        <div className="mt-4 flex items-center justify-between bg-black/60 border border-white/15 rounded-2xl px-3.5 py-2.5 shadow-sm">
          <div className="flex items-center space-x-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide truncate">
              {upiId}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <button
              onClick={handleCopyUPI}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition active:scale-90"
              title="Copy UPI ID"
            >
              {copiedId ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition active:scale-90"
              title="Share UPI Details"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FamX RuPay Card representation matching screenshot */}
        <div className="mt-4 rounded-2xl p-4 bg-gradient-to-r from-[#1b1c20] via-[#24252a] to-[#30251d] border border-white/10 relative overflow-hidden shadow-lg">
          {/* Subtle geometric overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-500/15 via-orange-500/10 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-3 relative z-10">
            {/* famX branding */}
            <div className="flex items-baseline space-x-0.5">
              <span className="font-bold text-base tracking-tight text-white">fam</span>
              <span className="font-black text-lg text-amber-500">X</span>
            </div>
            {/* Verified badge */}
            <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Hotel Payee</span>
            </span>
          </div>

          <div className="relative z-10 space-y-1">
            <p className="text-xs font-semibold text-slate-300">
              {payeeName}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <span>Mob:</span>
                <span className="font-mono text-slate-200 font-medium">{phoneNumber}</span>
              </span>
              <button
                onClick={handleCopyPhone}
                className="text-amber-400 hover:text-amber-300 text-[10px] underline"
              >
                {copiedPhone ? 'Copied!' : 'Copy No.'}
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
            <span>Prepaid <strong className="text-white">RuPay</strong></span>
            <span className="text-[10px] text-amber-400 font-medium">Anandpur Sahib, PB</span>
          </div>
        </div>

        {/* Direct UPI App links for mobile devices */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
          <a
            href={upiUri}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 transition shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Pay in UPI App</span>
          </a>
          <button
            onClick={handleCopyUPI}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-[11px] flex items-center justify-center space-x-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedId ? 'UPI Copied!' : 'Copy UPI ID'}</span>
          </button>
        </div>

        {/* Accepted UPI Apps icons pill */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center space-x-2 text-[10px] text-slate-400">
          <span>GPay</span>
          <span>•</span>
          <span>PhonePe</span>
          <span>•</span>
          <span>Paytm</span>
          <span>•</span>
          <span>BHIM</span>
          <span>•</span>
          <span>Cred / FamPay</span>
        </div>

        {/* Optional UTR confirmation form */}
        {showPaymentConfirmation && !isConfirmed && (
          <form onSubmit={handleConfirmUTR} className="mt-4 pt-3 border-t border-white/10 space-y-2">
            <label className="block text-[11px] font-medium text-slate-300">
              Enter 12-digit UPI Reference / UTR No. (after paying):
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 423987123456"
                maxLength={20}
                className="flex-1 bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center space-x-1">
              <HelpCircle className="w-3 h-3 text-slate-500" />
              <span>You can find the 12-digit UTR in your payment receipt</span>
            </p>
          </form>
        )}

        {isConfirmed && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 animate-fade-in flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>UTR Received: {utrNumber}</span>
          </div>
        )}
      </div>

      {/* Hotel location & direct call footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>📍 Anandpur Sahib, Punjab</span>
        <a href={`tel:${phoneNumber}`} className="flex items-center space-x-1 text-amber-700 hover:underline">
          <Phone className="w-3 h-3" />
          <span>Call {phoneNumber}</span>
        </a>
      </div>
    </div>
  );
};
