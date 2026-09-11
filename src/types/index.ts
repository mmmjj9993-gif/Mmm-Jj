export type UserRole = 'CUSTOMER' | 'HOTEL_OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: UserRole;
  hotelId?: string; // For owners/staff
  createdAt: string;
}

export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Blocked';
export type RoomCategoryType = 'AC Room' | 'Non-AC Room' | 'Double AC Room' | 'Bamboo AC Room' | 'Luxury Suite';
export type RoomCategory = RoomCategoryType;
export type Customer = User;

export interface Room {
  id: string;
  hotelId: string;
  roomNumber: string;
  category: RoomCategoryType;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  isAC: boolean;
  bathroomInfo: string;
  hasWifi?: boolean;
  hasRoomService?: boolean;
  amenities: string[];
  images: string[];
  status: RoomStatus;
  isAvailable?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Successful' | 'Failed' | 'Refunded';
export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'CashAtHotel' | 'DemoGateway';

export interface Booking {
  id: string; // HTL-2026-XXXX
  hotelId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  roomId: string;
  roomNumber: string;
  roomName: string;
  roomCategory: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  roomsCount: number;
  numberOfNights: number;
  basePrice: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  specialRequests?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  bookingStatus: BookingStatus;
  createdAt: string;
}

export type FoodCategory = 
  | 'Breakfast' 
  | 'Lunch' 
  | 'Dinner' 
  | 'Snacks' 
  | 'Beverages' 
  | 'Desserts'
  | 'Starters'
  | 'Main Course'
  | 'Tea/Coffee';

export interface FoodItem {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  isVeg: boolean;
  isAvailable: boolean;
  image: string;
  preparationTimeMins: number;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export type FoodOrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export interface FoodOrder {
  id: string; // FOOD-2026-XXXX
  hotelId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  roomNumber: string;
  items: {
    foodId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  specialInstructions?: string;
  paymentStatus: PaymentStatus;
  orderStatus: FoodOrderStatus;
  createdAt: string;
}

export interface HotelProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  heroImage: string;
  gallery: string[];
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  googleMapsEmbedUrl?: string;
  googleMapsUrl?: string;
  upiId?: string;
  upiPayeeName?: string;
  upiPhone?: string;
  upiQrImage?: string;
  checkInTime: string;
  checkOutTime: string;
  taxRatePercent: number;
  advancePaymentPercent: number;
  cancellationPolicy: string;
  termsAndConditions: string;
  privacyPolicy: string;
  customDomain?: string;
  domainStatus?: 'Pending' | 'Active' | 'Not Connected';
  facilities: string[];
}

export interface Review {
  id: string;
  hotelId: string;
  customerName: string;
  customerId?: string;
  rating: number; // 1 to 5
  comment: string;
  roomCategory?: string;
  date: string;
  ownerReply?: string;
  replyDate?: string;
}

export interface Coupon {
  id: string;
  hotelId?: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'Percentage' | 'Fixed';
  discountValue: number;
  minBookingValue?: number;
  minBookingAmount?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil: string;
  isActive: boolean;
}

export interface NotificationItem {
  id: string;
  hotelId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'food' | 'enquiry' | 'review';
  read: boolean;
  createdAt: string;
  link?: string;
}
