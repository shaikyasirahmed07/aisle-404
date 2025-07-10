import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  Search, 
  ShoppingCart, 
  MapPin,
  Star,
  Camera,
  Navigation,
  User,
  Gift,
  Receipt,
  Globe
} from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';
import QRScanner from '@/components/customer/QRScanner';
import ProductSearch from '@/components/customer/ProductSearch';
import VirtualCart from '@/components/customer/VirtualCart';
import StoreMap from '@/components/customer/StoreMap';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const CustomerInterface = () => {
  const { user, logout } = useAuth();
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);
  const [showFirstTimeDiscount, setShowFirstTimeDiscount] = useState(false);
  const [userBudget, setUserBudget] = useState<number>(1000);
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.isFirstTime) {
      setShowFirstTimeDiscount(true);
      toast({
        title: t("customer.welcomeNew"),
        description: t("customer.firstPurchaseDiscount"),
      });
    }
  }, [user, t]);

  const handleProductScan = (product: Product) => {
    setScannedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (!exists) {
        toast({
          title: t("customer.productScanned"),
          description: `${product.name} - ₹${product.price}`,
        });
        return [...prev, product];
      }
      return prev;
    });
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    const updatedTotalAmount = getTotalAmount() + product.price;
    if (updatedTotalAmount > userBudget * 0.8) {
      const percentage = Math.round((updatedTotalAmount / userBudget) * 100);
      toast({
        title: t("customer.budgetReached"),
        description: t("customer.budgetReachedDescription", { percentage, amount: userBudget }),
        variant: "destructive",
      });
    }
  };

  const getTotalAmount = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const discount = user?.isFirstTime ? subtotal * 0.05 : 0;
    return subtotal - discount;
  };

  const getBudgetStatus = () => {
    const total = getTotalAmount();
    const percentage = (total / userBudget) * 100;
    
    if (percentage >= 100) return { status: 'over', message: 'Budget exceeded!', color: 'text-destructive' };
    if (percentage >= 80) return { status: 'warning', message: '80% of budget reached', color: 'text-warning' };
    return { status: 'safe', message: 'Within budget', color: 'text-success' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <QrCode className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{t("common.welcome")}</h1>
              </div>
              {user?.isFirstTime && (
                <Badge variant="secondary" className="bg-success-light text-success">
                  <Gift className="w-3 h-3 mr-1" />
                  {t("customer.firstPurchaseDiscount")}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">{cartItems.length} {t("customer.items")}</span>
                <span className="text-sm text-muted-foreground">₹{getTotalAmount().toFixed(2)}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">{t("customer.budget")}</div>
                <div className={`text-sm font-medium ${getBudgetStatus().color}`}>
                  ₹{getTotalAmount().toFixed(2)} / ₹{userBudget}
                </div>
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to Smart Shopping!</h2>
          <p className="text-muted-foreground">Scan QR codes, find products, and navigate the store with ease</p>
          
          {/* Budget Alert */}
          {getBudgetStatus().status !== 'safe' && (
            <Card className="mt-4 card-retail bg-warning-light border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-warning" />
                  <span className="font-medium text-warning">{getBudgetStatus().message}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Language Selector */}
        <div className="mb-8">
          <LanguageSelector />
        </div>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scan" className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>QR Scan</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cartItems.length})</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Store Map</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            <QRScanner onProductScan={handleProductScan} onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <ProductSearch onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            <VirtualCart 
              cartItems={cartItems} 
              setCartItems={setCartItems}
              userBudget={userBudget}
              setUserBudget={setUserBudget}
              isFirstTime={user?.isFirstTime || false}
            />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <StoreMap />
          </TabsContent>
        </Tabs>

        {/* Recently Scanned Products */}
        {scannedProducts.length > 0 && (
          <Card className="card-retail mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>Recently Scanned</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scannedProducts.slice(-6).map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{product.name}</h4>
                      <Badge variant="outline">{product.aisleLocation}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">₹{product.price}</span>
                      {product.discount > 0 && (
                        <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
                      )}
                      {product.discount > 0 && (
                        <Badge variant="secondary" className="bg-success-light text-success">
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.averageRating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">
                        ({product.averageRating})
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerInterface;