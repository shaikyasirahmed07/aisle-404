import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, QrCode, MapPin, Star, ShoppingCart, Info } from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onProductScan: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  t?: (key: string, options?: any) => string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onProductScan, onAddToCart, t }) => {
  const [scanInput, setScanInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  const handleScan = () => {
    // Simulate QR scanning by searching for product by QR code or ID
    const product = mockProducts.find(p => 
      p.qrCode.toLowerCase().includes(scanInput.toLowerCase()) ||
      p.id.toLowerCase().includes(scanInput.toLowerCase()) ||
      p.name.toLowerCase().includes(scanInput.toLowerCase())
    );

    if (product) {
      setScannedProduct(product);
      onProductScan(product);
      setScanInput('');
    } else {
      toast({
        title: "Product not found",
        description: "No product found with that QR code",
        variant: "destructive",
      });
    }
  };

  const handleSimulatedScan = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setScannedProduct(product);
      onProductScan(product);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">QR Code Scanner</h3>
        <p className="text-muted-foreground">Scan product QR codes to view details, pricing, and location</p>
      </div>

      {/* Camera Scanner Simulation */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>{t?.("customer.cameraScanner") || "Camera Scanner"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simulated Camera View */}
          <div className="relative bg-slate-900 rounded-lg aspect-video flex items-center justify-center">
            <div className="absolute inset-4 border-2 border-white/50 rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-white/70" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
              {t?.("customer.positionQR") || "Position QR code within the frame"}
            </div>
          </div>

          {/* Manual Input for Demo */}
          <div className="flex space-x-2">
            <Input
              placeholder={t?.("customer.enterQR") || "Enter QR code or product ID for demo..."}
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
            <Button onClick={handleScan} className="btn-primary">
              {t?.("customer.scan") || "Scan"}
            </Button>
          </div>

          {/* Quick Demo Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSimulatedScan('P001')}>
              Demo: Toothpaste
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSimulatedScan('P002')}>
              Demo: Milk
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSimulatedScan('P003')}>
              Demo: Noodles
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSimulatedScan('P004')}>
              Demo: Cookies
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSimulatedScan('P005')}>
              Demo: Detergent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Product Details */}
      {scannedProduct && (
        <Card className="card-retail animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Product Details</span>
              <Badge variant="outline" className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Aisle {scannedProduct.aisleLocation}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{scannedProduct.name}</h3>
                  <p className="text-muted-foreground">{scannedProduct.category}</p>
                  {scannedProduct.description && (
                    <p className="text-sm text-muted-foreground mt-2">{scannedProduct.description}</p>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-primary">₹{scannedProduct.price}</span>
                    {scannedProduct.discount > 0 && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">₹{scannedProduct.mrp}</span>
                        <Badge variant="secondary" className="bg-success-light text-success">
                          {scannedProduct.discount}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    MRP: ₹{scannedProduct.mrp} • You save ₹{scannedProduct.mrp - scannedProduct.price}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(scannedProduct.averageRating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{scannedProduct.averageRating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({scannedProduct.reviews.length} reviews)
                  </span>
                  {scannedProduct.reviews.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowReviews(!showReviews)}
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <Badge variant={scannedProduct.stock > 20 ? "default" : scannedProduct.stock > 0 ? "secondary" : "destructive"}>
                    {scannedProduct.stock > 0 ? `${scannedProduct.stock} available` : 'Out of stock'}
                  </Badge>
                </div>
              </div>

              {/* Location & Actions */}
              <div className="space-y-4">
                <Card className="bg-primary-light border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-medium text-primary">Location</span>
                    </div>
                    <p className="text-sm text-foreground">
                      This product is located in <strong>Aisle {scannedProduct.aisleLocation}</strong>
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Show on Map
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button 
                    className="w-full btn-primary"
                    onClick={() => onAddToCart(scannedProduct)}
                    disabled={scannedProduct.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  {scannedProduct.isNearExpiry && (
                    <div className="bg-warning-light border border-warning/20 rounded-lg p-3">
                      <p className="text-sm text-warning font-medium">
                        ⚠️ This product is near expiry. Check the date before purchase.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            {showReviews && scannedProduct.reviews.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium">Customer Reviews</h4>
                {scannedProduct.reviews.map((review) => (
                  <div key={review.id} className="bg-muted rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{review.userName}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scanning without sign-in note */}
      <Card className="card-retail bg-secondary-light border-secondary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium text-secondary">Scan without signing in</p>
              <p className="text-sm text-muted-foreground">
                You can scan QR codes to view prices and locations without creating an account. 
                Sign in to add reviews, manage cart, and access personalized features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;