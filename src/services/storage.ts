import { 
  Room, 
  Booking, 
  FoodItem, 
  FoodOrder, 
  HotelProfile, 
  Review, 
  Coupon, 
  NotificationItem, 
  User 
} from '../types';
import { 
  INITIAL_HOTEL_PROFILE, 
  INITIAL_ROOMS, 
  INITIAL_FOOD_ITEMS, 
  INITIAL_BOOKINGS, 
  INITIAL_REVIEWS, 
  INITIAL_COUPONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/seedData';

const STORAGE_KEYS = {
  PROFILE: 'gh_hotel_profile',
  ROOMS: 'gh_rooms',
  BOOKINGS: 'gh_bookings',
  FOOD_ITEMS: 'gh_food_items',
  FOOD_ORDERS: 'gh_food_orders',
  REVIEWS: 'gh_reviews',
  COUPONS: 'gh_coupons',
  NOTIFICATIONS: 'gh_notifications',
  USERS: 'gh_users',
  ACTIVE_USER: 'gh_active_user',
};

// Dispatch global event for reactive UI updates across all components
export function notifyDatabaseChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('grand_horizon_db_change'));
  }
}

// Initial default users
const DEFAULT_USERS: User[] = [
  {
    id: 'owner-01',
    name: 'Robert Vance (Owner & GM)',
    email: 'admin@grandhorizon.com',
    phone: '+1 (800) 555-4726',
    address: 'Grand Horizon Executive Suite, Marina Bay',
    role: 'HOTEL_OWNER',
    hotelId: 'hotel-grand-horizon',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'cust-01',
    name: 'Alexander Hayes',
    email: 'alex.hayes@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, San Francisco, CA',
    role: 'CUSTOMER',
    createdAt: '2026-09-08T00:00:00.000Z'
  }
];

export const storageService = {
  // Profiles
  getHotelProfile(): HotelProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_HOTEL_PROFILE));
        return INITIAL_HOTEL_PROFILE;
      }
      const parsed = JSON.parse(data);
      // If cached data contains older demo location, phone, or missing upiId, update to Anandpur Sahib & 9877932787
      if (!parsed.upiId || parsed.city?.includes('Marina Bay') || parsed.phone?.includes('555-4726') || !parsed.city?.includes('Anandpur')) {
        const updated: HotelProfile = {
          ...parsed,
          name: parsed.name && parsed.name !== 'Grand Horizon Resort & Suites' ? parsed.name : 'Remix TFC Hotel',
          city: 'Anandpur Sahib',
          address: 'Main Highway Road, Near Takht Sri Kesgarh Sahib',
          state: 'Punjab',
          zipCode: '140118',
          country: 'India',
          phone: '+91 98779 32787',
          whatsappNumber: '9877932787',
          upiId: '9877932787@fam',
          upiPayeeName: 'Manjeet Singh',
          upiPhone: '9877932787',
          googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Anandpur+Sahib+Punjab+India&t=&z=14&ie=UTF8&iwloc=&output=embed',
          googleMapsUrl: 'https://maps.google.com/?q=Anandpur+Sahib+Punjab+India'
        };
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        return updated;
      }
      return { ...INITIAL_HOTEL_PROFILE, ...parsed };
    } catch {
      return INITIAL_HOTEL_PROFILE;
    }
  },
  saveHotelProfile(profile: HotelProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    notifyDatabaseChange();
  },

  // Rooms
  getRooms(): Room[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
        return INITIAL_ROOMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ROOMS;
    }
  },
  saveRooms(rooms: Room[]): void {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    notifyDatabaseChange();
  },
  saveRoom(room: Room): void {
    const rooms = this.getRooms();
    const index = rooms.findIndex(r => r.id === room.id);
    if (index >= 0) {
      rooms[index] = room;
    } else {
      rooms.push(room);
    }
    this.saveRooms(rooms);
  },
  deleteRoom(roomId: string): void {
    const rooms = this.getRooms().filter(r => r.id !== roomId);
    this.saveRooms(rooms);
  },

  // Bookings
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },
  saveBookings(bookings: Booking[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    notifyDatabaseChange();
  },
  addBooking(booking: Booking): void {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.saveBookings(bookings);

    // Auto-create notification for owner
    this.addNotification({
      id: `notif-${Date.now()}`,
      hotelId: booking.hotelId,
      title: 'New Booking Created',
      message: `${booking.customerName} booked ${booking.roomName} (${booking.roomNumber}) for ${booking.checkIn} to ${booking.checkOut}. Amount: $${booking.totalAmount.toFixed(2)}`,
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString()
    });
  },
  updateBooking(updated: Booking): void {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === updated.id);
    if (idx >= 0) {
      bookings[idx] = updated;
      this.saveBookings(bookings);
    }
  },

  // Real availability calculation: prevents double bookings
  isRoomAvailable(roomId: string, checkInStr: string, checkOutStr: string, excludeBookingId?: string): boolean {
    if (!checkInStr || !checkOutStr) return true;
    const checkIn = new Date(checkInStr).getTime();
    const checkOut = new Date(checkOutStr).getTime();

    if (checkOut <= checkIn) return false;

    const bookings = this.getBookings();
    for (const b of bookings) {
      if (b.roomId === roomId && b.bookingStatus !== 'Cancelled' && b.id !== excludeBookingId) {
        const bCheckIn = new Date(b.checkIn).getTime();
        const bCheckOut = new Date(b.checkOut).getTime();

        // Check if date ranges overlap:
        // Two intervals [A, B] and [C, D] overlap if max(A, C) < min(B, D)
        const overlap = Math.max(checkIn, bCheckIn) < Math.min(checkOut, bCheckOut);
        if (overlap) {
          return false;
        }
      }
    }
    return true;
  },

  // Get available rooms for dates
  getAvailableRooms(checkInStr: string, checkOutStr: string, guestsCount: number = 1): Room[] {
    const rooms = this.getRooms();
    return rooms.filter(room => {
      if (room.status === 'Maintenance' || room.status === 'Blocked') return false;
      if (room.capacity < guestsCount) return false;
      return this.isRoomAvailable(room.id, checkInStr, checkOutStr);
    });
  },

  // Generate unique booking ID: HTL-2026-XXXX
  getNextBookingId(): string {
    const bookings = this.getBookings();
    const nextNum = bookings.length + 1;
    return `HTL-2026-${String(nextNum).padStart(4, '0')}`;
  },

  // Food items
  getFoodItems(): FoodItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
        return INITIAL_FOOD_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_FOOD_ITEMS;
    }
  },
  saveFoodItems(items: FoodItem[]): void {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
    notifyDatabaseChange();
  },
  saveFoodItem(item: FoodItem): void {
    const items = this.getFoodItems();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    this.saveFoodItems(items);
  },
  deleteFoodItem(id: string): void {
    const items = this.getFoodItems().filter(i => i.id !== id);
    this.saveFoodItems(items);
  },

  // Food Orders
  getFoodOrders(): FoodOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOOD_ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveFoodOrders(orders: FoodOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.FOOD_ORDERS, JSON.stringify(orders));
    notifyDatabaseChange();
  },
  addFoodOrder(order: FoodOrder): void {
    const orders = this.getFoodOrders();
    orders.unshift(order);
    this.saveFoodOrders(orders);

    this.addNotification({
      id: `notif-${Date.now()}`,
      hotelId: order.hotelId,
      title: 'New Food Order Received',
      message: `Order #${order.id} for Room ${order.roomNumber} (${order.items.length} items, Total: $${order.totalAmount.toFixed(2)})`,
      type: 'food',
      read: false,
      createdAt: new Date().toISOString()
    });
  },
  updateFoodOrderStatus(orderId: string, status: FoodOrder['orderStatus']): void {
    const orders = this.getFoodOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].orderStatus = status;
      this.saveFoodOrders(orders);
    }
  },
  getNextFoodOrderId(): string {
    const orders = this.getFoodOrders();
    const nextNum = orders.length + 1;
    return `FOOD-2026-${String(nextNum).padStart(4, '0')}`;
  },

  // Reviews
  getReviews(): Review[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
        return INITIAL_REVIEWS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REVIEWS;
    }
  },
  saveReviews(reviews: Review[]): void {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    notifyDatabaseChange();
  },
  addReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.saveReviews(reviews);

    this.addNotification({
      id: `notif-${Date.now()}`,
      hotelId: review.hotelId,
      title: 'New Guest Review',
      message: `${review.customerName} gave a ${review.rating}-star review: "${review.comment.substring(0, 60)}..."`,
      type: 'review',
      read: false,
      createdAt: new Date().toISOString()
    });
  },
  replyToReview(reviewId: string, reply: string): void {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id === reviewId);
    if (idx >= 0) {
      reviews[idx].ownerReply = reply;
      reviews[idx].replyDate = new Date().toISOString().split('T')[0];
      this.saveReviews(reviews);
    }
  },

  // Coupons
  getCoupons(): Coupon[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
        return INITIAL_COUPONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_COUPONS;
    }
  },
  saveCoupons(coupons: Coupon[]): void {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    notifyDatabaseChange();
  },
  deleteCoupon(couponId: string): void {
    const coupons = this.getCoupons().filter(c => c.id !== couponId);
    this.saveCoupons(coupons);
  },
  validateCoupon(code: string, bookingAmount: number): { valid: boolean; discountAmount: number; message: string } {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }
    const today = new Date().toISOString().split('T')[0];
    if (coupon.validFrom && today < coupon.validFrom) {
      return { valid: false, discountAmount: 0, message: 'Coupon is not active yet.' };
    }
    if (coupon.validUntil && today > coupon.validUntil) {
      return { valid: false, discountAmount: 0, message: 'Coupon has expired.' };
    }
    if (bookingAmount < coupon.minBookingValue) {
      return { valid: false, discountAmount: 0, message: `Minimum booking amount of $${coupon.minBookingValue} required for this coupon.` };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (bookingAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discountAmount: Math.min(discount, bookingAmount),
      message: `Coupon "${coupon.code}" applied successfully! You saved $${discount.toFixed(2)}.`
    };
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    notifyDatabaseChange();
  },
  addNotification(item: NotificationItem): void {
    const list = this.getNotifications();
    list.unshift(item);
    this.saveNotifications(list);
  },
  markNotificationsAsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(list);
  },

  // Users & Auth
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_USERS;
    }
  },
  getCustomers(): User[] {
    const users = this.getUsers();
    const customerMap = new Map<string, User>();
    
    // Add existing registered customers
    users.filter(u => u.role === 'CUSTOMER').forEach(u => {
      customerMap.set(u.email.toLowerCase(), u);
    });

    // Derive any guests from past bookings who haven't registered
    const bookings = this.getBookings();
    bookings.forEach(b => {
      const email = b.customerEmail.toLowerCase();
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: b.customerId || `cust-${b.id}`,
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          role: 'CUSTOMER',
          createdAt: b.createdAt
        });
      }
    });

    return Array.from(customerMap.values());
  },
  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  getActiveUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setActiveUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
    notifyDatabaseChange();
  },

  // Reset entire system to demo defaults
  resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_HOTEL_PROFILE));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
    localStorage.setItem(STORAGE_KEYS.FOOD_ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    notifyDatabaseChange();
  }
};
