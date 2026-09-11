import React, { useState } from 'react';
import { 
  Hotel, 
  Menu, 
  X, 
  ShoppingBag, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  Coffee,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHotel } from '../../context/HotelContext';

interface NavbarProps {
  currentView: string;
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  onOpenAuthModal: () => void;
  onOpenOwnerLogin: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNavigate,
  onOpenAuthModal,
  onOpenOwnerLogin,
  onOpenNotifications
}) => {
  const { currentUser, isOwner, logout } = useAuth();
  const { hotelProfile, cartCount, unreadNotifsCount, setIsCartDrawerOpen, setIsNotificationsOpen } = useHotel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'cafeteria', label: 'Cafeteria & Menu' },
    { id: 'about', label: 'About Hotel' },
    { id: 'contact', label: 'Contact & Location' },
    { id: 'my-bookings', label: 'My Bookings' }
  ];

  const navigate = (viewId: string) => {
    if (setCurrentView) setCurrentView(viewId);
    if (onNavigate) onNavigate(viewId);
  };

  const handleNavClick = (viewId: string) => {
    navigate(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top micro bar for hotel contact & quick owner switch */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">{hotelProfile.city}</span>
          </span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-300">Call Us: {hotelProfile.phone}</span>
        </div>

        <div className="flex items-center space-x-3">
          {isOwner ? (
            <button
              onClick={() => navigate('owner-dashboard')}
              className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-semibold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/60 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Dashboard Active</span>
            </button>
          ) : (
            <button
              id="btn-owner-portal-link"
              onClick={onOpenOwnerLogin}
              className="flex items-center space-x-1 text-slate-400 hover:text-amber-400 transition"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Hotel Owner Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hotel Title */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-xl sm:text-2xl text-slate-900 tracking-wide block leading-none">
                GRAND HORIZON
              </span>
              <span className="text-[11px] uppercase tracking-widest text-amber-700 font-medium block mt-0.5">
                Resort & Suites
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-amber-800 bg-amber-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Cafeteria Cart Button */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition"
              title="Cafeteria Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notifications Button */}
            <button
              id="btn-nav-notifications"
              onClick={() => {
                if (onOpenNotifications) {
                  onOpenNotifications();
                } else {
                  setIsNotificationsOpen(true);
                }
              }}
              className="relative p-2.5 rounded-full text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute 1.5 top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="btn-nav-user-menu"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-xs font-medium text-slate-700 max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-sm animate-scale-up">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="font-semibold text-slate-800 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {currentUser.role}
                      </span>
                    </div>

                    {isOwner ? (
                      <button
                        onClick={() => {
                          navigate('owner-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-amber-800 font-semibold hover:bg-amber-50 flex items-center space-x-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Owner Dashboard</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            navigate('my-bookings');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                        >
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>My Bookings</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('cafeteria');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                        >
                          <Coffee className="w-4 h-4 text-slate-400" />
                          <span>Food Orders</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-nav-sign-in"
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 border border-slate-300 hover:bg-slate-50 transition"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Book Now Primary Button */}
            <button
              id="btn-nav-book-now"
              onClick={() => handleNavClick('rooms')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 active:bg-amber-900 rounded-xl shadow-sm transition"
            >
              Book a Room
            </button>

            {/* Mobile menu trigger */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fade-in">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
                currentView === link.id
                  ? 'bg-amber-50 text-amber-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('rooms')}
              className="w-full py-3 text-center bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-xs"
            >
              Book a Room Now
            </button>
            {isOwner ? (
              <button
                onClick={() => handleNavClick('owner-dashboard')}
                className="w-full py-2.5 text-center bg-slate-900 text-amber-400 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Go to Owner Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOwnerLogin();
                }}
                className="w-full py-2.5 text-center text-slate-500 hover:text-slate-800 text-xs font-medium"
              >
                Hotel Owner / Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
