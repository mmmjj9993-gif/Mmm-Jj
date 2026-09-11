import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Bed, 
  Grid3X3, 
  UtensilsCrossed, 
  Users, 
  Tag, 
  BarChart3, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Bell, 
  ShieldCheck, 
  Building,
  Menu,
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHotel } from '../../context/HotelContext';

import { BookingsManager } from './BookingsManager';
import { RoomsManager } from './RoomsManager';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { FoodOrdersManager } from './FoodOrdersManager';
import { CustomersManager } from './CustomersManager';
import { CouponsManager } from './CouponsManager';
import { AnalyticsReports } from './AnalyticsReports';
import { HotelSettingsManager } from './HotelSettingsManager';

interface Props {
  onSwitchToCustomerView: () => void;
}

type DashboardTab = 
  | 'overview' 
  | 'bookings' 
  | 'rooms' 
  | 'calendar' 
  | 'food' 
  | 'customers' 
  | 'coupons' 
  | 'analytics' 
  | 'settings';

export const OwnerDashboard: React.FC<Props> = ({ onSwitchToCustomerView }) => {
  const { currentUser, logout } = useAuth();
  const { 
    hotelProfile, 
    bookings, 
    foodOrders, 
    rooms, 
    customers, 
    unreadNotificationCount, 
    setIsNotificationsOpen 
  } = useHotel();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Quick stats
  const activeBookings = bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-in');
  const totalRevenue = bookings
    .filter(b => b.bookingStatus !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingFoodOrders = foodOrders.filter(o => o.orderStatus === 'Received' || o.orderStatus === 'Preparing');

  const navItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings & Check-in', icon: Calendar, badge: activeBookings.length },
    { id: 'rooms', label: 'Rooms & Pricing', icon: Bed },
    { id: 'calendar', label: 'Availability Matrix', icon: Grid3X3 },
    { id: 'food', label: 'Cafeteria & Dining', icon: UtensilsCrossed, badge: pendingFoodOrders.length },
    { id: 'customers', label: 'Guest CRM', icon: Users },
    { id: 'coupons', label: 'Promos & Coupons', icon: Tag },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Hotel Profile & Domain', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-serif-luxury font-bold text-base text-amber-400">
            {hotelProfile.name}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-slate-300 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>
          <button
            onClick={onSwitchToCustomerView}
            className="text-xs bg-amber-700 text-white px-2.5 py-1 rounded-lg font-bold"
          >
            Public View
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Hotel Identity */}
          <div className="p-6 border-b border-slate-900">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
              Owner Management
            </span>
            <h1 className="font-serif-luxury text-xl font-bold tracking-wide text-white">
              {hotelProfile.name}
            </h1>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="truncate">{hotelProfile.customDomain}</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-owner-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id as DashboardTab);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-amber-900' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-slate-900 space-y-3">
          {/* Public Website button */}
          <button
            onClick={onSwitchToCustomerView}
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition border border-slate-800"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Go to Customer Website</span>
          </button>

          {/* User info */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0) || 'O'}
              </div>
              <div className="text-left">
                <span className="font-bold text-xs text-white block truncate max-w-[100px]">
                  {currentUser?.name || 'Hotel Owner'}
                </span>
                <span className="text-[10px] text-amber-400 block font-mono">
                  Administrator
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-900 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Top bar on Desktop */}
        <div className="hidden lg:flex items-center justify-between pb-8 border-b border-slate-200 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
              Hotel Management Suite
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
              Welcome back, {currentUser?.name || 'General Manager'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-xs"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              onClick={onSwitchToCustomerView}
              className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Customer Booking Website</span>
            </button>
          </div>
        </div>

        {/* Tab Route Switching */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick KPI stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Active Bookings
                </span>
                <span className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1 block">
                  {activeBookings.length}
                </span>
                <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                  {bookings.length} Total reservations logged
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Total Revenue
                </span>
                <span className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1 block">
                  ${totalRevenue.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Paid via cards, UPI, gateways
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Kitchen Orders Today
                </span>
                <span className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1 block">
                  {foodOrders.length}
                </span>
                <span className="text-xs text-amber-700 font-semibold mt-1 block">
                  {pendingFoodOrders.length} Active in preparation
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Available Inventory
                </span>
                <span className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1 block">
                  {rooms.filter(r => r.isAvailable).length} / {rooms.length}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Suites ready for guest check-in
                </span>
              </div>
            </div>

            {/* Quick overview of latest bookings */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
                  Recent Guest Bookings
                </h4>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  View All ({bookings.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Guest</th>
                      <th className="p-3">Room</th>
                      <th className="p-3">Dates</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-800">{b.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{b.customerName}</td>
                        <td className="p-3 text-slate-700">Room {b.roomNumber} ({b.roomCategory})</td>
                        <td className="p-3 text-slate-600">{b.checkIn} → {b.checkOut}</td>
                        <td className="p-3 font-bold text-amber-800">${b.totalAmount.toFixed(2)}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('calendar')}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-amber-600 text-left transition group"
              >
                <Grid3X3 className="w-6 h-6 text-amber-700 mb-2 group-hover:scale-110 transition-transform" />
                <h5 className="font-bold text-slate-900 text-sm">Room Availability Matrix</h5>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect vacancies and block rooms for maintenance or private VIP reservations.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('food')}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-amber-600 text-left transition group"
              >
                <UtensilsCrossed className="w-6 h-6 text-amber-700 mb-2 group-hover:scale-110 transition-transform" />
                <h5 className="font-bold text-slate-900 text-sm">Cafeteria Kitchen Tickets</h5>
                <p className="text-xs text-slate-500 mt-1">
                  Dispatch in-room dining orders, change order progress, and edit digital menu.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-amber-600 text-left transition group"
              >
                <BarChart3 className="w-6 h-6 text-amber-700 mb-2 group-hover:scale-110 transition-transform" />
                <h5 className="font-bold text-slate-900 text-sm">Revenue Intelligence</h5>
                <p className="text-xs text-slate-500 mt-1">
                  Interactive charts for revenue trends, category demands, and ADR projections.
                </p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && <BookingsManager />}
        {activeTab === 'rooms' && <RoomsManager />}
        {activeTab === 'calendar' && <AvailabilityCalendar />}
        {activeTab === 'food' && <FoodOrdersManager />}
        {activeTab === 'customers' && <CustomersManager />}
        {activeTab === 'coupons' && <CouponsManager />}
        {activeTab === 'analytics' && <AnalyticsReports />}
        {activeTab === 'settings' && <HotelSettingsManager />}
      </main>
    </div>
  );
};
