import { Room, FoodItem, HotelProfile, Booking, Review, Coupon, NotificationItem } from '../types';

export const INITIAL_HOTEL_PROFILE: HotelProfile = {
  id: 'hotel-remix-tfc',
  name: 'Remix TFC Hotel',
  tagline: 'Luxury Stay, Comfort & Delicious Dining in Anandpur Sahib',
  description: 'Experience sublime comfort, genuine hospitality, and delicious cafeteria dining at Remix TFC Hotel, ideally situated near Takht Sri Kesgarh Sahib in the sacred city of Anandpur Sahib, Punjab.',
  logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80',
  heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80'
  ],
  address: 'Main Highway Road, Near Takht Sri Kesgarh Sahib',
  city: 'Anandpur Sahib',
  state: 'Punjab',
  zipCode: '140118',
  country: 'India',
  phone: '+91 98779 32787',
  email: 'reservations@remixtfc.com',
  whatsappNumber: '9877932787',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Anandpur+Sahib+Punjab+India&t=&z=14&ie=UTF8&iwloc=&output=embed',
  googleMapsUrl: 'https://maps.google.com/?q=Anandpur+Sahib+Punjab+India',
  upiId: '9877932787@fam',
  upiPayeeName: 'Manjeet Singh',
  upiPhone: '9877932787',
  checkInTime: '12:00 (12:00 PM)',
  checkOutTime: '11:00 (11:00 AM)',
  taxRatePercent: 12,
  advancePaymentPercent: 20,
  cancellationPolicy: 'Free cancellation up to 48 hours before check-in. Cancellations made within 48 hours are subject to a 1-night room charge.',
  termsAndConditions: 'Valid government photo ID is mandatory at check-in. Smoking prohibited inside suites. Pure vegetarian options available in cafeteria.',
  privacyPolicy: 'We respect your personal privacy. Customer contact details and payment records are encrypted and never disclosed to third parties.',
  customDomain: 'www.remixtfchotel.com',
  domainStatus: 'Active',
  facilities: [
    'High-Speed Wi-Fi',
    'Valet & Free Parking',
    '24/7 Room Service',
    'Gourmet Cafeteria & Restaurant',
    'Climate-Controlled AC Rooms',
    'Spacious Family Suites',
    '24/7 Concierge & Front Desk',
    'Daily Housekeeping',
    'Near Takht Sri Kesgarh Sahib',
    'Quick UPI QR Scanner Payments',
    'Travel & Darshan Assistance',
    'Power Backup & 24/7 Security'
  ]
};

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-101',
    hotelId: 'hotel-grand-horizon',
    roomNumber: '101',
    category: 'AC Room',
    name: 'Deluxe AC King Room',
    description: 'A sanctuary of modern elegance featuring a plush king-sized bed, high-efficiency silent air conditioning, custom mahogany furnishings, and private balcony overlooking the palm gardens.',
    pricePerNight: 120,
    capacity: 2,
    bedType: '1 King Bed',
    isAC: true,
    bathroomInfo: 'Ensuite Italian marble bathroom with rainfall shower, luxury bathrobes and premium toiletries',
    hasWifi: true,
    hasRoomService: true,
    amenities: ['High-speed Wi-Fi', 'Silent Air Conditioning', '4K Smart TV with Streaming', 'Espresso Coffee Machine', 'Mini Refrigerator', 'Electronic Safe', 'Work Desk', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Available',
    checkInTime: '14:00',
    checkOutTime: '11:00'
  },
  {
    id: 'room-102',
    hotelId: 'hotel-grand-horizon',
    roomNumber: '102',
    category: 'Non-AC Room',
    name: 'Classic Garden Breeze Room',
    description: 'Designed for eco-conscious travelers who relish natural sea breezes. Features airy vaulted ceilings, whisper-quiet aerodynamic ceiling fans, screened garden-view windows, and a queen-sized orthopaedic mattress.',
    pricePerNight: 75,
    capacity: 2,
    bedType: '1 Queen Bed',
    isAC: false,
    bathroomInfo: 'Private ceramic-tiled bathroom with walk-in hot water shower and organic botanical soaps',
    hasWifi: true,
    hasRoomService: true,
    amenities: ['High-speed Wi-Fi', 'Ceiling Fan & Natural Cross-Ventilation', 'Garden View Balcony', 'Tea / Coffee Station', 'Luggage Rack', 'Wardrobe', 'Daily Housekeeping'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Available',
    checkInTime: '14:00',
    checkOutTime: '11:00'
  },
  {
    id: 'room-103',
    hotelId: 'hotel-grand-horizon',
    roomNumber: '103',
    category: 'Double AC Room',
    name: 'Executive Double AC Family Suite',
    description: 'Generously proportioned luxury suite with two premium queen beds, perfect for families or groups. Features a distinct seating lounge, dual climate zones, panoramic ocean vistas, and a private sun terrace.',
    pricePerNight: 180,
    capacity: 4,
    bedType: '2 Queen Beds',
    isAC: true,
    bathroomInfo: 'Spacious double-vanity bathroom with deep soaking tub and glass enclosed rain shower',
    hasWifi: true,
    hasRoomService: true,
    amenities: ['High-speed Wi-Fi', 'Dual Inverter AC Units', '55" Ultra HD TV', 'Mini Bar & Snack Bar', 'Private Sun Terrace', 'Dining / Work Table', 'In-room Safe', 'Plush Robes & Slippers'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Available',
    checkInTime: '14:00',
    checkOutTime: '11:00'
  },
  {
    id: 'room-104',
    hotelId: 'hotel-grand-horizon',
    roomNumber: '104',
    category: 'Bamboo AC Room',
    name: 'Signature Bamboo Sanctuary AC Villa',
    description: 'An architectural masterpiece combining sustainable treated bamboo architecture with contemporary five-star indulgence. Features soaring thatched bamboo ceilings, secluded open-air jacuzzi courtyard, and climate control.',
    pricePerNight: 220,
    capacity: 2,
    bedType: '1 California King Bed',
    isAC: true,
    bathroomInfo: 'Open-air tropical stone garden bathroom with freestanding jacuzzi tub and rainfall cascade',
    hasWifi: true,
    hasRoomService: true,
    amenities: ['High-speed Wi-Fi', 'Whisper-quiet Daikin AC', 'Private Outdoor Jacuzzi', 'Artisanal Organic Bar', 'Marshall Bluetooth Sound System', 'Private Garden Veranda', 'Dedicated Butler Call Button'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Available',
    checkInTime: '14:00',
    checkOutTime: '11:00'
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  // Breakfast
  {
    id: 'food-01',
    hotelId: 'hotel-grand-horizon',
    name: 'Grand Continental Sunrise Platter',
    description: 'Freshly baked flaky croissants, artisanal sourdough toast, seasonal berries, whipped butter, fruit preserves, and poached farm eggs.',
    price: 18,
    category: 'Breakfast',
    isVeg: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 15
  },
  {
    id: 'food-02',
    hotelId: 'hotel-grand-horizon',
    name: 'Eggs Benedict Royale with Smoked Salmon',
    description: 'Toasted English muffin, cured Scottish smoked salmon, soft poached organic eggs, topped with rich homemade velvety hollandaise sauce.',
    price: 22,
    category: 'Breakfast',
    isVeg: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 20
  },
  {
    id: 'food-03',
    hotelId: 'hotel-grand-horizon',
    name: 'Belgian Buttermilk Berry Waffles',
    description: 'Crisp golden Belgian waffles served with maple syrup, whipped Madagascar vanilla cream, and a medley of fresh strawberries and blueberries.',
    price: 16,
    category: 'Breakfast',
    isVeg: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 15
  },

  // Starters
  {
    id: 'food-04',
    hotelId: 'hotel-grand-horizon',
    name: 'Crispy Truffle Parmesan Fries & Aioli',
    description: 'Hand-cut russet potato batons tossed in black truffle oil, aged Grana Padano parmesan, and fresh herbs with garlic confit aioli.',
    price: 12,
    category: 'Starters',
    isVeg: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 12
  },
  {
    id: 'food-05',
    hotelId: 'hotel-grand-horizon',
    name: 'Golden Panko Crusted Prawns',
    description: 'Succulent jumbo tiger prawns coated in Japanese panko crumb, flash-fried until golden, served with sweet chili lime dip.',
    price: 19,
    category: 'Starters',
    isVeg: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 18
  },

  // Main Course
  {
    id: 'food-06',
    hotelId: 'hotel-grand-horizon',
    name: 'Flame-Grilled Wild Herb Salmon',
    description: 'Pan-seared Atlantic salmon fillet with dill lemon butter glaze, served over creamy saffron risotto and grilled asparagus spears.',
    price: 32,
    category: 'Main Course',
    isVeg: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 25
  },
  {
    id: 'food-07',
    hotelId: 'hotel-grand-horizon',
    name: 'Signature Horizon Butter Paneer & Naan',
    description: 'Cottage cheese simmered in a velvety slow-cooked tomato, cashew and butter gravy, served with aromatic garlic butter tandoori naan.',
    price: 24,
    category: 'Main Course',
    isVeg: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 22
  },
  {
    id: 'food-08',
    hotelId: 'hotel-grand-horizon',
    name: 'Rosemary Garlic Braised Lamb Shank',
    description: 'Tender slow-cooked Australian lamb shank that falls off the bone, accompanied by roasted garlic potato puree and red wine reduction.',
    price: 36,
    category: 'Main Course',
    isVeg: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 30
  },

  // Snacks & Lunch
  {
    id: 'food-09',
    hotelId: 'hotel-grand-horizon',
    name: 'Artisan Gourmet Wagyu Club Burger',
    description: 'Juicy 180g prime beef patty, caramelized onions, smoked cheddar, heirloom tomato, and crisp butter lettuce on a brioche bun with fries.',
    price: 21,
    category: 'Snacks',
    isVeg: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 20
  },
  {
    id: 'food-10',
    hotelId: 'hotel-grand-horizon',
    name: 'Mediterranean Grilled Vegetable Panini',
    description: 'Char-grilled zucchini, roasted bell peppers, buffalo mozzarella, and fresh basil pesto pressed hot in rustic ciabatta bread.',
    price: 15,
    category: 'Snacks',
    isVeg: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 15
  },

  // Beverages & Coffee
  {
    id: 'food-11',
    hotelId: 'hotel-grand-horizon',
    name: 'Iced Madagascar Vanilla Cold Brew',
    description: 'Single-origin Ethiopian cold brewed coffee steeped for 18 hours, infused with organic vanilla bean and a splash of silky almond cream.',
    price: 7,
    category: 'Tea/Coffee',
    isVeg: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 5
  },
  {
    id: 'food-12',
    hotelId: 'hotel-grand-horizon',
    name: 'Fresh Tropical Passionfruit Cooler',
    description: 'Pressed passionfruit pulp, lime juice, garden mint, and sparkling mineral water served over crushed ice with a sugarcane swizzle.',
    price: 8,
    category: 'Beverages',
    isVeg: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 5
  },

  // Desserts
  {
    id: 'food-13',
    hotelId: 'hotel-grand-horizon',
    name: 'Warm Belgian Chocolate Lava Soufflé',
    description: 'Rich dark chocolate molten cake with a liquid core, served with a scoop of house-made Tahitian vanilla bean gelato.',
    price: 14,
    category: 'Desserts',
    isVeg: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    preparationTimeMins: 15
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'HTL-2026-0001',
    hotelId: 'hotel-grand-horizon',
    customerId: 'cust-01',
    customerName: 'Alexander Hayes',
    customerEmail: 'alex.hayes@example.com',
    customerPhone: '+1 (555) 234-5678',
    roomId: 'room-101',
    roomNumber: '101',
    roomName: 'Deluxe AC King Room',
    roomCategory: 'AC Room',
    checkIn: '2026-09-10',
    checkOut: '2026-09-13',
    guests: 2,
    roomsCount: 1,
    numberOfNights: 3,
    basePrice: 360,
    taxAmount: 43.2,
    discountAmount: 36,
    totalAmount: 367.2,
    couponCode: 'WELCOME10',
    specialRequests: 'Late check-in around 6:00 PM and quiet high-floor room if possible.',
    paymentStatus: 'Successful',
    paymentMethod: 'Card',
    transactionId: 'TXN-98472391',
    bookingStatus: 'Confirmed',
    createdAt: '2026-09-08T14:32:00.000Z'
  },
  {
    id: 'HTL-2026-0002',
    hotelId: 'hotel-grand-horizon',
    customerId: 'cust-02',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@example.com',
    customerPhone: '+1 (555) 876-5432',
    roomId: 'room-103',
    roomNumber: '103',
    roomName: 'Executive Double AC Family Suite',
    roomCategory: 'Double AC Room',
    checkIn: '2026-09-11',
    checkOut: '2026-09-14',
    guests: 3,
    roomsCount: 1,
    numberOfNights: 3,
    basePrice: 540,
    taxAmount: 64.8,
    discountAmount: 50,
    totalAmount: 554.8,
    couponCode: 'HORIZON50',
    specialRequests: 'Extra pillows and baby cot needed.',
    paymentStatus: 'Successful',
    paymentMethod: 'UPI',
    transactionId: 'TXN-87291044',
    bookingStatus: 'Confirmed',
    createdAt: '2026-09-09T09:15:00.000Z'
  },
  {
    id: 'HTL-2026-0003',
    hotelId: 'hotel-grand-horizon',
    customerId: 'cust-03',
    customerName: 'Marcus Bennett',
    customerEmail: 'm.bennett@example.com',
    customerPhone: '+1 (555) 345-6789',
    roomId: 'room-104',
    roomNumber: '104',
    roomName: 'Signature Bamboo Sanctuary AC Villa',
    roomCategory: 'Bamboo AC Room',
    checkIn: '2026-09-05',
    checkOut: '2026-09-08',
    guests: 2,
    roomsCount: 1,
    numberOfNights: 3,
    basePrice: 660,
    taxAmount: 79.2,
    discountAmount: 0,
    totalAmount: 739.2,
    paymentStatus: 'Successful',
    paymentMethod: 'Card',
    transactionId: 'TXN-66190284',
    bookingStatus: 'Checked-out',
    createdAt: '2026-09-01T11:20:00.000Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    hotelId: 'hotel-grand-horizon',
    customerName: 'Sophia Montgomery',
    rating: 5,
    comment: 'An extraordinary retreat! The Deluxe AC Room was immaculate with sensational views, and the breakfast spread at the cafeteria was five-star quality. Staff went above and beyond.',
    roomCategory: 'AC Room',
    date: '2026-09-04',
    ownerReply: 'Dear Sophia, thank you sincerely for your kind words! It was our utmost pleasure to host you at Grand Horizon. We look forward to welcoming you back soon.',
    replyDate: '2026-09-05'
  },
  {
    id: 'rev-02',
    hotelId: 'hotel-grand-horizon',
    customerName: 'Marcus Bennett',
    rating: 5,
    comment: 'The Bamboo AC Villa is an architectural triumph. Having a private outdoor jacuzzi beneath the stars was magical. Seamless room service and rapid WhatsApp concierge assistance.',
    roomCategory: 'Bamboo AC Room',
    date: '2026-09-08',
    ownerReply: 'Thank you Marcus! The Bamboo Sanctuary is truly our pride. We are glad you enjoyed the private jacuzzi and prompt concierge service.',
    replyDate: '2026-09-08'
  },
  {
    id: 'rev-03',
    hotelId: 'hotel-grand-horizon',
    customerName: 'David & Claire Miller',
    rating: 4,
    comment: 'Excellent stay with the family in the Double AC Suite. Plentiful space for our luggage and children. The oceanfront restaurant meals were fresh and delicious.',
    roomCategory: 'Double AC Room',
    date: '2026-08-28'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-01',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minBookingValue: 100,
    maxDiscount: 100,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true
  },
  {
    id: 'coup-02',
    code: 'HORIZON50',
    discountType: 'fixed',
    discountValue: 50,
    minBookingValue: 300,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true
  },
  {
    id: 'coup-03',
    code: 'SUMMERSAVE',
    discountType: 'percentage',
    discountValue: 15,
    minBookingValue: 250,
    maxDiscount: 150,
    validFrom: '2026-06-01',
    validUntil: '2026-10-31',
    isActive: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    hotelId: 'hotel-grand-horizon',
    title: 'New Booking Confirmed',
    message: 'Alexander Hayes confirmed Room 101 for Sep 10 - Sep 13. Total: $367.20',
    type: 'booking',
    read: false,
    createdAt: '2026-09-08T14:32:00.000Z'
  },
  {
    id: 'notif-02',
    hotelId: 'hotel-grand-horizon',
    title: 'Payment Successful',
    message: 'Payment of $554.80 received via UPI for booking HTL-2026-0002.',
    type: 'payment',
    read: false,
    createdAt: '2026-09-09T09:15:00.000Z'
  },
  {
    id: 'notif-03',
    hotelId: 'hotel-grand-horizon',
    title: 'New Review Received',
    message: 'Marcus Bennett posted a 5-star review for the Bamboo Sanctuary.',
    type: 'review',
    read: true,
    createdAt: '2026-09-08T16:20:00.000Z'
  }
];
