import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Room } from './types';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { NotificationsModal } from './components/common/NotificationsModal';

// Customer Components
import { HeroSearch } from './components/customer/HeroSearch';
import { RoomsListingView } from './components/customer/RoomsListingView';
import { RoomCard } from './components/customer/RoomCard';
import { RoomDetailsModal } from './components/customer/RoomDetailsModal';
import { BookingFlowModal } from './components/customer/BookingFlowModal';
import { FoodMenuView } from './components/customer/FoodMenuView';
import { FoodCartDrawer } from './components/customer/FoodCartDrawer';
import { CustomerBookingsView } from './components/customer/CustomerBookingsView';
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';
import { AboutSection } from './components/customer/AboutSection';
import { ReviewsSection } from './components/customer/ReviewsSection';
import { ContactSection } from './components/customer/ContactSection';
import { PolicyViews } from './components/customer/PolicyViews';

// Owner Components
import { OwnerLoginModal } from './components/owner/OwnerLoginModal';
import { OwnerDashboard } from './components/owner/OwnerDashboard';

// Lucide Icons
import { 
  Sparkles, 
  ArrowRight, 
  UtensilsCrossed, 
  ShieldCheck, 
  Bed, 
  Award, 
  Coffee, 
  CheckCircle,
  Wifi,
  Compass,
  Star
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { rooms, hotelProfile, isNotificationsOpen, setIsNotificationsOpen } = useHotel();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');

  // Modals
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState<boolean>(false);
  const [isOwnerLoginOpen, setIsOwnerLoginOpen] = useState<boolean>(false);

  // If user signs in as HOTEL_OWNER, auto open owner dashboard
  useEffect(() => {
    if (currentUser?.role === 'HOTEL_OWNER') {
      setCurrentView('owner-dashboard');
    }
  }, [currentUser]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleViewDetails = (room: Room) => {
    setSelectedRoomForDetails(room);
  };

  const handleBookNow = (room: Room) => {
    setSelectedRoomForBooking(room);
  };

  const handleProceedToBookingFromDetails = (room: Room) => {
    setSelectedRoomForDetails(null);
    setSelectedRoomForBooking(room);
  };

  // If owner dashboard is active, render full-screen management view
  if (currentView === 'owner-dashboard') {
    return (
      <>
        <OwnerDashboard 
          onSwitchToCustomerView={() => setCurrentView('home')} 
        />
        <NotificationsModal 
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onNavigate={setCurrentView}
        onOpenAuthModal={() => setIsCustomerAuthOpen(true)}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Page View Switcher */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="space-y-16 animate-fade-in">
            {/* Hero Search Section with Real-Time Availability Bar */}
            <HeroSearch
              onSearchClick={() => setCurrentView('rooms')}
              onSearchComplete={() => setCurrentView('rooms')}
              onBookNowClick={() => {
                if (rooms.length > 0) {
                  setSelectedRoomForBooking(rooms[0]);
                } else {
                  setCurrentView('rooms');
                }
              }}
            />

            {/* Featured Suites Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Premier Living</span>
                  </div>
                  <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
                    Featured Suites & Villas
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Discover handpicked sanctuary suites with panoramic ocean views and private climate control.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('rooms')}
                  className="mt-4 md:mt-0 font-bold text-xs text-amber-800 hover:text-amber-900 flex items-center space-x-1"
                >
                  <span>Explore All {rooms.length} Suites</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Featured Room Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.slice(0, 3).map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onViewDetails={handleViewDetails}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            </section>

            {/* Hotel Highlights / Amenities */}
            <section className="bg-slate-900 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block mb-1">
                    World-Class Facilities
                  </span>
                  <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold">
                    Designed for Exceptional Living
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-luxury font-bold text-lg text-white">The Grand Cafeteria</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Artisanal breakfasts, freshly brewed espresso, and 24/7 room service ordering from your phone.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-luxury font-bold text-lg text-white">Ultra-Fast Fiber Wi-Fi</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Gigabit connection available in every room, poolside cabana, and restaurant courtyard.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-luxury font-bold text-lg text-white">Horizon Mineral Spa</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Therapeutic heated infinity pool, cedar sauna, and tailored wellness treatments.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-luxury font-bold text-lg text-white">Concierge & Valet</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Private airport chauffeuring, luggage assistance, and bespoke coastal excursions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cafeteria Spotlight Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-amber-900/50">
                <div className="space-y-4 max-w-xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Artisanal Kitchen & Room Dining
                  </span>
                  <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold">
                    Hungry? Order From Our Digital Cafeteria
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Enjoy organic poached eggs, fresh avocado toast, gourmet pastas, and desserts delivered warm to your suite within 25 minutes.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setCurrentView('cafeteria')}
                      className="py-3 px-6 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center space-x-2"
                    >
                      <Coffee className="w-4 h-4" />
                      <span>Browse Digital Food Menu</span>
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-96 h-64 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
                    alt="Delicious Gourmet Dish"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </section>

            {/* Guest Reviews & Owner Response Section */}
            <ReviewsSection />

            {/* Location & Contact */}
            <ContactSection />
          </div>
        )}

        {/* VIEW 2: ROOMS LISTING */}
        {currentView === 'rooms' && (
          <div className="animate-fade-in">
            <RoomsListingView
              onViewDetails={handleViewDetails}
              onBookNow={handleBookNow}
            />
          </div>
        )}

        {/* VIEW 3: CAFETERIA & DIGITAL MENU */}
        {currentView === 'cafeteria' && (
          <div className="animate-fade-in">
            <FoodMenuView />
          </div>
        )}

        {/* VIEW 4: MY BOOKINGS & FOOD ORDERS */}
        {currentView === 'my-bookings' && (
          <div className="animate-fade-in">
            <CustomerBookingsView
              onOpenAuth={() => setIsCustomerAuthOpen(true)}
              onBookRoomClick={() => setCurrentView('rooms')}
            />
          </div>
        )}

        {/* VIEW 5: ABOUT SECTION */}
        {currentView === 'about' && (
          <div className="animate-fade-in">
            <AboutSection />
            <ReviewsSection />
          </div>
        )}

        {/* VIEW 6: CONTACT SECTION */}
        {currentView === 'contact' && (
          <div className="animate-fade-in">
            <ContactSection />
          </div>
        )}

        {/* VIEW 7: POLICIES */}
        {currentView === 'policies' && (
          <div className="animate-fade-in">
            <PolicyViews />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        setCurrentView={setCurrentView}
        onNavigate={setCurrentView}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
      />

      {/* Floating Widgets */}
      <WhatsAppButton />
      <FoodCartDrawer />
      <NotificationsModal 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Customer Modals */}
      <RoomDetailsModal
        room={selectedRoomForDetails}
        isOpen={Boolean(selectedRoomForDetails)}
        onClose={() => setSelectedRoomForDetails(null)}
        onProceedToBooking={handleProceedToBookingFromDetails}
      />

      <BookingFlowModal
        room={selectedRoomForBooking}
        isOpen={Boolean(selectedRoomForBooking)}
        onClose={() => setSelectedRoomForBooking(null)}
        onBookingComplete={(b) => {
          // Booking confirmed, prompt user to review in My Bookings
        }}
      />

      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
      />

      {/* Owner Login Modal */}
      <OwnerLoginModal
        isOpen={isOwnerLoginOpen}
        onClose={() => setIsOwnerLoginOpen(false)}
        onSuccess={() => setCurrentView('owner-dashboard')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HotelProvider>
        <MainAppContent />
      </HotelProvider>
    </AuthProvider>
  );
}
