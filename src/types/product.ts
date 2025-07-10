// Define the product types to match the data requirements

/**
 * Product interface with all the required columns
 */
export interface Product {
  // Basic product information
  id: string;
  productId: string;
  name: string;
  description?: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  
  // Location information
  location: string;
  shelfNumber: string;
  coordinates?: { x: number; y: number };
  
  // Pricing information
  mrp: number;
  price: number;
  discount: number;
  isOnPromotion: boolean;
  
  // Inventory information
  stockCount: number;
  restockThreshold: number;
  supplierId: string;
  
  // QR related information
  qrCode?: string;
  qrLink: string;
  qrGeneratedDate: string;
  
  // Analytics information
  scannedCount: number;
  cartAddCount: number;
  saleCount: number;
  viewCount: number;
  dwellTime: number; // time spent viewing the product in seconds
  salesVelocity: 'high' | 'medium' | 'low';
  
  // Additional product attributes
  isEcoFriendly: boolean;
  
  // Customer related
  customerId?: string;
  loyaltyPoints: number;
  offerId?: string;
  
  // Timestamps
  createdAt?: string;
  lastUpdated: string;
}

/**
 * Data needed to generate a QR code
 */
export interface QRCodeData {
  productId: string;
  name?: string;
  price?: number;
  discount?: number;
  isOnPromotion?: boolean;
  expiryDate?: string;
  location?: string;
  shelfNumber?: string;
  qrGeneratedDate: string;
  qrLink: string;
  // Add any other fields that might be included in QR code
}

/**
 * Product filter options for search and filtering
 */
export interface ProductFilter {
  category?: string;
  priceRange?: { min: number; max: number };
  inStock?: boolean;
  onPromotion?: boolean;
  ecoFriendly?: boolean;
  sortBy?: 'price' | 'popularity' | 'name' | 'expiryDate';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Product analytics data for reporting
 */
export interface ProductAnalytics {
  productId: string;
  views: number;
  scans: number;
  cartAdds: number;
  sales: number;
  conversionRate: number; // Percentage of views that convert to sales
  averageDwellTime: number;
  salesVelocity: 'high' | 'medium' | 'low';
  restockNeeded: boolean;
}
