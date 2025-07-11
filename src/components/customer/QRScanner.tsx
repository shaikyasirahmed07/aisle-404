import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, QrCode, MapPin, Star, ShoppingCart, Info } from 'lucide-react';
import { fetchProductById } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';

interface QRScannerProps {
  onProductScan: (product: any) => void;
  onAddToCart: (product: any) => void;
  t?: (key: string, options?: any) => string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onProductScan, onAddToCart, t: tProp }) => {
  const { t } = useTranslation();
  const translate = tProp || t;
  const { toast } = useToast();
  
  const [scanInput, setScanInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);
  const [recentlyScanned, setRecentlyScanned] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!scanInput.trim()) {
      toast({
        title: translate("qr.emptyInput"),
        description: translate("qr.enterProductIdOrScan"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Attempt to fetch product by ID
      const product = await fetchProductById(scanInput);
      
      if (product) {
        setScannedProduct(product);
        addToRecentlyScanned(product);
        onProductScan(product);
        setScanInput('');
      } else {
        toast({
          title: translate("product.notFound"),
          description: translate("product.noProductFound"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error scanning product:', error);
      toast({
        title: translate("qr.scanError"),
        description: translate("qr.scanErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedScan = async (productId: string) => {
    setLoading(true);
    try {
      const product = await fetchProductById(productId);
      if (product) {
        setScannedProduct(product);
        addToRecentlyScanned(product);
        onProductScan(product);
      }
    } catch (error) {
      console.error('Error in simulated scan:', error);
      toast({
        title: translate("qr.scanError"),
        description: translate("qr.scanErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addToRecentlyScanned = (product: any) => {
    setRecentlyScanned(prev => {
      // Check if product already exists in recently scanned
      if (prev.some(p => p.id === product.id)) {
        return prev;
      }
      // Add to beginning and keep only the last 6
      return [product, ...prev].slice(0, 6);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{translate("customer.scanQR")}</h3>
        <p className="text-muted-foreground">{translate("customer.scanDescription")}</p>
      </div>

      {/* Camera Scanner Simulation */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>{translate("qr.cameraScanner")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simulated Camera View */}
          <div className="relative bg-slate-900 rounded-lg aspect-video flex items-center justify-center">
            <div className="absolute inset-4 border-2 border-white/50 rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-white/70" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
              {translate("qr.positionQR")}
            </div>
          </div>

          {/* Manual Input for Demo */}
          <div className="flex space-x-2">
            <Input
              placeholder={translate("qr.enterProductId")}
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              disabled={loading}
            />
            <Button 
              onClick={handleScan} 
              className="bg-primary text-white"
              disabled={loading}
            >
              {loading ? translate("common.loading") : translate("customer.scan")}
            </Button>
          </div>

          {/* Quick Demo Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSimulatedScan('P001')}
              disabled={loading}
            >
              {translate("product.demoToothpaste") || "Toothpaste"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSimulatedScan('P002')}
              disabled={loading}
            >
              {translate("product.demoMilk") || "Milk"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSimulatedScan('P003')}
              disabled={loading}
            >
              {translate("product.demoNoodles") || "Noodles"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSimulatedScan('P004')}
              disabled={loading}
            >
              {translate("product.demoCookies") || "Cookies"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSimulatedScan('P005')}
              disabled={loading}
            >
              {translate("product.demoDetergent") || "Detergent"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recently Scanned Products */}
      {recentlyScanned.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold flex items-center">
            {translate("qr.recentlyScanned")}
            <Badge className="ml-2 bg-primary">{recentlyScanned.length}</Badge>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyScanned.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
                t={translate} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Scanned Product Details */}
      {scannedProduct && (
        <Card className="card-retail animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{translate("product.details")}</span>
              <Badge variant="outline" className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{translate("product.aisle")} {scannedProduct.aisleLocation}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {translate("product.availability")}:{" "}
                {scannedProduct.stockCount > 0
                  ? `${scannedProduct.stockCount} ${translate("product.inStock")}`
                  : translate("product.outOfStock")}
              </span>
              <span>
                {translate("product.expiry")}:{" "}
                {scannedProduct.expiryDate
                  ? new Date(scannedProduct.expiryDate).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <ProductCard 
              product={scannedProduct} 
              onAddToCart={onAddToCart}
              t={translate}
            />
          </CardContent>
        </Card>
      )}

      {/* Scanning without sign-in note */}
      <Card className="card-retail bg-secondary-light border-secondary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium text-secondary">{translate("qr.scanWithoutSignin")}</p>
              <p className="text-sm text-muted-foreground">
                {translate("qr.scanWithoutSigninDesc")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;