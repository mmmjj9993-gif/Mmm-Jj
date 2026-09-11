import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  HotelProfile, 
  Room, 
  Booking, 
  FoodItem, 
  FoodOrder, 
  Review, 
  Coupon, 
  NotificationItem, 
  CartItem,
  BookingStatus,
  FoodOrderStatus,
  Customer
} from '../types';
import { storageService } from '../services/storage';

interface HotelContextType {
  hotelProfile: HotelProfile;
  rooms: Room[];
  bookings: Booking[];
  foodItems: FoodItem[];
  foodOrders: FoodOrder[];
  reviews: Review[];
  coupons: Coupon[];
  notifications: NotificationItem[];
  customers: Customer[];
  unreadNotifsCount: number;
  unreadNotificationCount: number;

  // Search Dates State
  searchDates: {
    checkIn: string;
    checkOut: string;
    guests: number;
    roomsCount: number;
  };
  setSearchDates: React.Dispatch<React.SetStateAction<{
    checkIn: string;
    checkOut: string;
    guests: number;
    roomsCount: number;
  }>>;

  // Cart
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Actions
  isRoomAvailable: (roomId: string, checkIn?: string, checkOut?: string, excludeBookingId?: string) => boolean;
  createBooking: (booking: Booking) => Promise<string>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  createFoodOrder: (order: FoodOrder) => Promise<string>;
  updateFoodOrderStatus: (orderId: string, status: FoodOrderStatus) => void;
  addReview: (review: Review) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  saveRoom: (room: Room) => void;
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
  updateHotelProfile: (profile: HotelProfile) => void;
  validateCoupon: (code: string, amount: number) => { valid: boolean; discountAmount: number; message: string };
  saveCoupon: (coupon: Coupon) => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
  addFoodItem: (item: FoodItem) => void;
  updateFoodItem: (item: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
  addNotification: (item: Partial<NotificationItem> & { title: string; message: string }) => void;
  markNotificationsAsRead: () => void;
  resetDemoData: () => void;

  // Modals / Navigation Triggers
  bookingModalData: {
    isOpen: boolean;
    room: Room | null;
  };
  openBookingModal: (room: Room) => void;
  closeBookingModal: () => void;

  detailsModalData: {
    isOpen: boolean;
    room: Room | null;
  };
  openRoomDetails: (room: Room) => void;
  closeRoomDetails: () => void;

  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Compute default checkIn = today, checkOut = tomorrow (or 2 days out)
  const getInitialDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    return {
      checkIn: formatDate(today),
      checkOut: formatDate(tomorrow),
      guests: 2,
      roomsCount: 1
    };
  };

  const [hotelProfile, setHotelProfile] = useState<HotelProfile>(() => storageService.getHotelProfile());
  const [rooms, setRooms] = useState<Room[]>(() => storageService.getRooms());
  const [bookings, setBookings] = useState<Booking[]>(() => storageService.getBookings());
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => storageService.getFoodItems());
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>(() => storageService.getFoodOrders());
  const [reviews, setReviews] = useState<Review[]>(() => storageService.getReviews());
  const [coupons, setCoupons] = useState<Coupon[]>(() => storageService.getCoupons());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storageService.getNotifications());
  const [customers, setCustomers] = useState<Customer[]>(() => storageService.getCustomers());
  const [searchDates, setSearchDates] = useState(getInitialDates);

  // Notifications modal state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Modals
  const [bookingModalData, setBookingModalData] = useState<{ isOpen: boolean; room: Room | null }>({
    isOpen: false,
    room: null
  });
  const [detailsModalData, setDetailsModalData] = useState<{ isOpen: boolean; room: Room | null }>({
    isOpen: false,
    room: null
  });

  const reloadData = useCallback(() => {
    setHotelProfile(storageService.getHotelProfile());
    setRooms(storageService.getRooms());
    setBookings(storageService.getBookings());
    setFoodItems(storageService.getFoodItems());
    setFoodOrders(storageService.getFoodOrders());
    setReviews(storageService.getReviews());
    setCoupons(storageService.getCoupons());
    setNotifications(storageService.getNotifications());
    setCustomers(storageService.getCustomers());
  }, []);

  useEffect(() => {
    window.addEventListener('grand_horizon_db_change', reloadData);
    return () => window.removeEventListener('grand_horizon_db_change', reloadData);
  }, [reloadData]);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const isRoomAvailable = useCallback(
    (roomId: string, checkIn?: string, checkOut?: string, excludeBookingId?: string) => {
      const cIn = checkIn || searchDates.checkIn;
      const cOut = checkOut || searchDates.checkOut;
      return storageService.isRoomAvailable(roomId, cIn, cOut, excludeBookingId);
    },
    [searchDates]
  );

  const createBooking = async (booking: Booking): Promise<string> => {
    storageService.addBooking(booking);
    reloadData();
    return booking.id;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    const existing = bookings.find(b => b.id === bookingId);
    if (existing) {
      const updated = { ...existing, bookingStatus: status };
      storageService.updateBooking(updated);
      reloadData();
    }
  };

  const createFoodOrder = async (order: FoodOrder): Promise<string> => {
    storageService.addFoodOrder(order);
    clearCart();
    reloadData();
    return order.id;
  };

  const updateFoodOrderStatus = (orderId: string, status: FoodOrderStatus) => {
    storageService.updateFoodOrderStatus(orderId, status);
    reloadData();
  };

  const addReview = (review: Review) => {
    storageService.addReview(review);
    reloadData();
  };

  const replyToReview = (reviewId: string, reply: string) => {
    storageService.replyToReview(reviewId, reply);
    reloadData();
  };

  const saveRoom = (room: Room) => {
    storageService.saveRoom(room);
    reloadData();
  };

  const addRoom = (room: Room) => {
    saveRoom(room);
  };

  const updateRoom = (room: Room) => {
    saveRoom(room);
  };

  const deleteRoom = (roomId: string) => {
    storageService.deleteRoom(roomId);
    reloadData();
  };

  const updateHotelProfile = (profile: HotelProfile) => {
    storageService.saveHotelProfile(profile);
    setHotelProfile(profile);
  };

  const validateCoupon = (code: string, amount: number) => {
    return storageService.validateCoupon(code, amount);
  };

  const saveCoupon = (coupon: Coupon) => {
    const existing = coupons.filter(c => c.id !== coupon.id);
    existing.push(coupon);
    storageService.saveCoupons(existing);
    reloadData();
  };

  const addCoupon = (coupon: Coupon) => {
    saveCoupon(coupon);
  };

  const updateCoupon = (coupon: Coupon) => {
    saveCoupon(coupon);
  };

  const deleteCoupon = (couponId: string) => {
    storageService.deleteCoupon(couponId);
    reloadData();
  };

  const addFoodItem = (item: FoodItem) => {
    storageService.saveFoodItem(item);
    reloadData();
  };

  const updateFoodItem = (item: FoodItem) => {
    storageService.saveFoodItem(item);
    reloadData();
  };

  const deleteFoodItem = (id: string) => {
    storageService.deleteFoodItem(id);
    reloadData();
  };

  const addNotification = (item: Partial<NotificationItem> & { title: string; message: string }) => {
    const newNotif: NotificationItem = {
      id: item.id || `notif-${Date.now()}`,
      hotelId: item.hotelId || hotelProfile.id,
      title: item.title,
      message: item.message,
      type: item.type || 'enquiry',
      read: false,
      createdAt: new Date().toISOString(),
      link: item.link
    };
    storageService.addNotification(newNotif);
    reloadData();
  };

  const markNotificationsAsRead = () => {
    storageService.markNotificationsAsRead();
    reloadData();
  };

  const resetDemoData = () => {
    storageService.resetToDefaults();
    reloadData();
  };

  // Cart operations
  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.foodItem.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.foodItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { foodItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.foodItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(ci => (ci.foodItem.id === itemId ? { ...ci, quantity: qty } : ci))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);

  const openBookingModal = (room: Room) => {
    setBookingModalData({ isOpen: true, room });
  };

  const closeBookingModal = () => {
    setBookingModalData({ isOpen: false, room: null });
  };

  const openRoomDetails = (room: Room) => {
    setDetailsModalData({ isOpen: true, room });
  };

  const closeRoomDetails = () => {
    setDetailsModalData({ isOpen: false, room: null });
  };

  return (
    <HotelContext.Provider
      value={{
        hotelProfile,
        rooms,
        bookings,
        foodItems,
        foodOrders,
        reviews,
        coupons,
        notifications,
        customers,
        unreadNotifsCount,
        unreadNotificationCount: unreadNotifsCount,
        searchDates,
        setSearchDates,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isRoomAvailable,
        createBooking,
        updateBookingStatus,
        createFoodOrder,
        updateFoodOrderStatus,
        addReview,
        replyToReview,
        saveRoom,
        addRoom,
        updateRoom,
        deleteRoom,
        updateHotelProfile,
        validateCoupon,
        saveCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        addNotification,
        markNotificationsAsRead,
        resetDemoData,
        bookingModalData,
        openBookingModal,
        closeBookingModal,
        detailsModalData,
        openRoomDetails,
        closeRoomDetails,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isNotificationsOpen,
        setIsNotificationsOpen
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
