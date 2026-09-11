import React from 'react';
import { X, Bell, CheckCircle, Clock, AlertCircle, ShoppingBag, Star, Calendar } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export const NotificationsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead, isNotificationsOpen, setIsNotificationsOpen } = useHotel();

  const show = isOpen !== undefined ? isOpen : isNotificationsOpen;
  const handleClose = onClose || (() => setIsNotificationsOpen(false));

  if (!show) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'food':
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="modal-notifications" 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">System Notifications</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-xs text-amber-700 hover:text-amber-800 font-medium px-2 py-1 rounded hover:bg-amber-50"
            >
              Mark all read
            </button>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto divide-y divide-slate-100 space-y-2 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-slate-600">No notifications yet</p>
              <p className="text-xs text-slate-400">Recent bookings, food orders, and reviews will appear here.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl transition flex items-start space-x-3.5 ${
                  item.read ? 'bg-white opacity-80' : 'bg-amber-50/50 border border-amber-100'
                }`}
              >
                <div className="mt-0.5 p-2 rounded-lg bg-white shadow-xs border border-slate-100">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-sm font-semibold ${item.read ? 'text-slate-800' : 'text-slate-900'}`}>
                      {item.title}
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(item.createdAt)}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={handleClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
