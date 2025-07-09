export interface Product {
  id: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  aisleLocation: string;
  mrp: number;
  price: number;
  discount: number;
  category: string;
  stock: number;
  qrCode: string;
  description?: string;
  reviews: Review[];
  averageRating: number;
  salesVelocity: 'high' | 'medium' | 'low';
  isNearExpiry: boolean;
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
    name: "Colgate Total Advanced",
    batchNumber: "CT2024001",
    expiryDate: "2025-03-15",
    aisleLocation: "5B",
    mrp: 150,
    price: 135,
    discount: 10,
    category: "Personal Care",
    stock: 45,
    qrCode: "QR_CT2024001",
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
    isNearExpiry: false
  },
  {
    id: "P002",
    name: "Amul Taza Milk 1L",
    batchNumber: "AT2024015",
    expiryDate: "2024-01-20",
    aisleLocation: "2A",
    mrp: 60,
    price: 58,
    discount: 3,
    category: "Dairy",
    stock: 12,
    qrCode: "QR_AT2024015",
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
    isNearExpiry: true
  },
  {
    id: "P003",
    name: "Maggi 2-Minute Noodles",
    batchNumber: "MG2024032",
    expiryDate: "2024-08-30",
    aisleLocation: "7C",
    mrp: 15,
    price: 14,
    discount: 7,
    category: "Instant Food",
    stock: 89,
    qrCode: "QR_MG2024032",
    description: "Quick and tasty instant noodles",
    reviews: [],
    averageRating: 4.5,
    salesVelocity: 'high',
    isNearExpiry: false
  },
  {
    id: "P004",
    name: "Britannia Good Day Cookies",
    batchNumber: "BR2024018",
    expiryDate: "2024-12-15",
    aisleLocation: "4D",
    mrp: 30,
    price: 28,
    discount: 7,
    category: "Snacks",
    stock: 156,
    qrCode: "QR_BR2024018",
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
    isNearExpiry: false
  },
  {
    id: "P005",
    name: "Surf Excel Liquid 1L",
    batchNumber: "SE2024009",
    expiryDate: "2025-06-20",
    aisleLocation: "8A",
    mrp: 280,
    price: 245,
    discount: 13,
    category: "Household",
    stock: 23,
    qrCode: "QR_SE2024009",
    description: "Powerful liquid detergent for tough stains",
    reviews: [],
    averageRating: 4.6,
    salesVelocity: 'medium',
    isNearExpiry: false
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