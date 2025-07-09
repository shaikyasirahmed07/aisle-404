export interface Product {
  id: string;
  productId: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  aisleLocation: string;
  location: string;
  mrp: number;
  price: number;
  discount: number;
  category: string;
  stock: number;
  stockCount: number;
  qrCode: string;
  qrLink: string;
  description?: string;
  reviews: Review[];
  averageRating: number;
  salesVelocity: 'high' | 'medium' | 'low';
  isNearExpiry: boolean;
  scannedCount: number;
  cartAddCount: number;
  saleCount: number;
  isEcoFriendly: boolean;
  shelfNumber: string;
  coordinates?: { x: number; y: number };
  viewCount: number;
  dwellTime: number;
  customerId?: string;
  loyaltyPoints: number;
  offerId?: string;
  qrGeneratedDate: string;
  lastUpdated: string;
  supplierId: string;
  restockThreshold: number;
  isOnPromotion: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ComboOffer {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  discount: number;
  conditions: string;
  isActive: boolean;
}

export interface Analytics {
  totalProducts: number;
  lowStockAlerts: number;
  slowMovingStock: number;
  upcomingBatches: number;
  aisleTraffic: { aisle: string; scans: number }[];
  topScannedProducts: { productId: string; scans: number }[];
  comboPerformance: { comboId: string; sales: number }[];
  virtualVsRealCart: {
    virtualItems: number;
    purchasedItems: number;
    abandonmentRate: number;
  };
}

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: "P001",
    productId: "PROD001",
    name: "Colgate Total Advanced",
    batchNumber: "CT2024001",
    expiryDate: "2025-03-15",
    aisleLocation: "5B",
    location: "Aisle 5B, Shelf 2",
    mrp: 150,
    price: 135,
    discount: 10,
    category: "Personal Care",
    stock: 45,
    stockCount: 45,
    qrCode: "QR_CT2024001",
    qrLink: "https://qr.retail.com/QR_CT2024001",
    description: "Advanced whitening toothpaste with fluoride protection",
    reviews: [
      {
        id: "R001",
        userId: "U001",
        userName: "Priya Sharma",
        rating: 4,
        comment: "Good product, fresh breath all day",
        date: "2024-01-10"
      }
    ],
    averageRating: 4.2,
    salesVelocity: 'high',
    isNearExpiry: false,
    scannedCount: 456,
    cartAddCount: 320,
    saleCount: 298,
    isEcoFriendly: true,
    shelfNumber: "5B-S2",
    coordinates: { x: 50, y: 30 },
    viewCount: 1200,
    dwellTime: 45,
    loyaltyPoints: 8,
    offerId: "OFF001",
    qrGeneratedDate: "2024-01-15",
    lastUpdated: "2024-07-09",
    supplierId: "SUP001",
    restockThreshold: 15,
    isOnPromotion: true
  },
  {
    id: "P002",
    productId: "PROD002",
    name: "Amul Taza Milk 1L",
    batchNumber: "AT2024015",
    expiryDate: "2024-01-20",
    aisleLocation: "2A",
    location: "Aisle 2A, Shelf 1",
    mrp: 60,
    price: 58,
    discount: 3,
    category: "Dairy",
    stock: 12,
    stockCount: 12,
    qrCode: "QR_AT2024015",
    qrLink: "https://qr.retail.com/QR_AT2024015",
    description: "Fresh toned milk, rich in protein and calcium",
    reviews: [
      {
        id: "R002",
        userId: "U002",
        userName: "Rahul Singh",
        rating: 5,
        comment: "Always fresh and good quality",
        date: "2024-01-08"
      }
    ],
    averageRating: 4.8,
    salesVelocity: 'medium',
    isNearExpiry: true,
    scannedCount: 234,
    cartAddCount: 189,
    saleCount: 167,
    isEcoFriendly: false,
    shelfNumber: "2A-S1",
    coordinates: { x: 10, y: 30 },
    viewCount: 890,
    dwellTime: 35,
    loyaltyPoints: 3,
    qrGeneratedDate: "2024-01-20",
    lastUpdated: "2024-07-09",
    supplierId: "SUP002",
    restockThreshold: 5,
    isOnPromotion: false
  },
  {
    id: "P003",
    productId: "PROD003",
    name: "Maggi 2-Minute Noodles",
    batchNumber: "MG2024032",
    expiryDate: "2024-08-30",
    aisleLocation: "7C",
    location: "Aisle 7C, Shelf 3",
    mrp: 15,
    price: 14,
    discount: 7,
    category: "Instant Food",
    stock: 89,
    stockCount: 89,
    qrCode: "QR_MG2024032",
    qrLink: "https://qr.retail.com/QR_MG2024032",
    description: "Quick and tasty instant noodles",
    reviews: [],
    averageRating: 4.5,
    salesVelocity: 'high',
    isNearExpiry: false,
    scannedCount: 389,
    cartAddCount: 298,
    saleCount: 276,
    isEcoFriendly: false,
    shelfNumber: "7C-S3",
    coordinates: { x: 90, y: 10 },
    viewCount: 756,
    dwellTime: 28,
    loyaltyPoints: 2,
    qrGeneratedDate: "2024-02-01",
    lastUpdated: "2024-07-09",
    supplierId: "SUP003",
    restockThreshold: 20,
    isOnPromotion: false
  },
  {
    id: "P004",
    productId: "PROD004",
    name: "Britannia Good Day Cookies",
    batchNumber: "BR2024018",
    expiryDate: "2024-12-15",
    aisleLocation: "4D",
    location: "Aisle 4D, Shelf 2",
    mrp: 30,
    price: 28,
    discount: 7,
    category: "Snacks",
    stock: 156,
    stockCount: 156,
    qrCode: "QR_BR2024018",
    qrLink: "https://qr.retail.com/QR_BR2024018",
    description: "Crispy butter cookies with cashews",
    reviews: [
      {
        id: "R003",
        userId: "U003",
        userName: "Anita Desai",
        rating: 4,
        comment: "Kids love these cookies",
        date: "2024-01-05"
      }
    ],
    averageRating: 4.3,
    salesVelocity: 'low',
    isNearExpiry: false,
    scannedCount: 123,
    cartAddCount: 89,
    saleCount: 76,
    isEcoFriendly: false,
    shelfNumber: "4D-S2",
    coordinates: { x: 50, y: 10 },
    viewCount: 345,
    dwellTime: 52,
    loyaltyPoints: 4,
    qrGeneratedDate: "2024-01-18",
    lastUpdated: "2024-07-09",
    supplierId: "SUP004",
    restockThreshold: 30,
    isOnPromotion: false
  },
  {
    id: "P005",
    productId: "PROD005",
    name: "Surf Excel Liquid 1L",
    batchNumber: "SE2024009",
    expiryDate: "2025-06-20",
    aisleLocation: "8A",
    location: "Aisle 8A, Shelf 4",
    mrp: 280,
    price: 245,
    discount: 13,
    category: "Household",
    stock: 23,
    stockCount: 23,
    qrCode: "QR_SE2024009",
    qrLink: "https://qr.retail.com/QR_SE2024009",
    description: "Powerful liquid detergent for tough stains",
    reviews: [],
    averageRating: 4.6,
    salesVelocity: 'medium',
    isNearExpiry: false,
    scannedCount: 198,
    cartAddCount: 134,
    saleCount: 112,
    isEcoFriendly: true,
    shelfNumber: "8A-S4",
    coordinates: { x: 90, y: 30 },
    viewCount: 567,
    dwellTime: 67,
    loyaltyPoints: 12,
    qrGeneratedDate: "2024-01-25",
    lastUpdated: "2024-07-09",
    supplierId: "SUP005",
    restockThreshold: 8,
    isOnPromotion: false
  }
];

// Mock Combo Offers
export const mockComboOffers: ComboOffer[] = [
  {
    id: "C001",
    name: "Oral Care Combo",
    description: "Toothpaste + Mouthwash for complete oral care",
    productIds: ["P001", "P006"],
    discount: 15,
    conditions: "Scan both items to unlock 15% discount",
    isActive: true
  },
  {
    id: "C002",
    name: "Breakfast Bundle",
    description: "Milk + Bread + Butter for perfect breakfast",
    productIds: ["P002", "P007", "P008"],
    discount: 12,
    conditions: "Scan all three items to get 12% off",
    isActive: true
  }
];

// Mock Analytics Data
export const mockAnalytics: Analytics = {
  totalProducts: 1247,
  lowStockAlerts: 23,
  slowMovingStock: 45,
  upcomingBatches: 8,
  aisleTraffic: [
    { aisle: "2A", scans: 234 },
    { aisle: "5B", scans: 189 },
    { aisle: "7C", scans: 167 },
    { aisle: "4D", scans: 145 },
    { aisle: "8A", scans: 123 }
  ],
  topScannedProducts: [
    { productId: "P001", scans: 456 },
    { productId: "P003", scans: 389 },
    { productId: "P002", scans: 234 },
    { productId: "P005", scans: 198 },
    { productId: "P004", scans: 123 }
  ],
  comboPerformance: [
    { comboId: "C001", sales: 234 },
    { comboId: "C002", sales: 156 }
  ],
  virtualVsRealCart: {
    virtualItems: 1234,
    purchasedItems: 987,
    abandonmentRate: 20
  }
};

// Store Map Data
export const storeMap = {
  aisles: [
    { id: "1A", name: "Fruits & Vegetables", x: 10, y: 10 },
    { id: "2A", name: "Dairy & Beverages", x: 10, y: 30 },
    { id: "3A", name: "Bread & Bakery", x: 10, y: 50 },
    { id: "4D", name: "Snacks & Confectionery", x: 50, y: 10 },
    { id: "5B", name: "Personal Care", x: 50, y: 30 },
    { id: "6B", name: "Health & Wellness", x: 50, y: 50 },
    { id: "7C", name: "Instant Food", x: 90, y: 10 },
    { id: "8A", name: "Household & Cleaning", x: 90, y: 30 },
    { id: "9A", name: "Electronics & Accessories", x: 90, y: 50 }
  ],
  layout: {
    width: 100,
    height: 70,
    entrance: { x: 50, y: 5 },
    checkout: { x: 50, y: 65 }
  }
};
