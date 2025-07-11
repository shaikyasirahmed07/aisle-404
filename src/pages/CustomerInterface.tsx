import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  Search, 
  ShoppingCart, 
  MapPin,
  Star,
  Heart,
  MessageCircle,
  Gift,
  Receipt
} from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';
import QRScanner from '@/components/customer/QRScanner';
import ProductSearch from '@/components/customer/ProductSearch';
import VirtualCart from '@/components/customer/VirtualCart';
import StoreMap from '@/components/customer/StoreMap';
import ProductCard from '@/components/customer/ProductCard';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const CustomerInterface = () => {
  const { user, logout } = useAuth();
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);
  const [showFirstTimeDiscount, setShowFirstTimeDiscount] = useState(false);
  const [userBudget, setUserBudget] = useState<number>(1000);
  const [activeTab, setActiveTab] = useState('scan');
  const { t, i18n } = useTranslation();

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
    } else {
      toast({
        title: t("cart.addedToCart"),
        description: `${product.name} - ₹${product.price}`,
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
    
    if (percentage >= 100) return { status: 'over', message: t('cart.budgetExceeded'), color: 'text-destructive' };
    if (percentage >= 80) return { status: 'warning', message: t('cart.approachingBudget'), color: 'text-warning' };
    return { status: 'safe', message: t('cart.withinBudget'), color: 'text-success' };
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header - Hidden on Mobile */}
      <header className="hidden md:block bg-card border-b border-border shadow-soft">
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
                <span className="text-sm font-medium">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} </span>
                <span className="text-sm text-muted-foreground">₹{getTotalAmount().toFixed(2)}</span>
              </div>
              <Button variant="outline" onClick={logout}>
                {t("common.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b border-border">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <QrCode className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-bold text-foreground">{t("common.welcome")}</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
        {/* Recommended Products Card for Larger Screens */}
        <div className="hidden md:block mb-8">
          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t("customer.smartShopping")}</h2>
                <Button variant="outline">{t("common.viewAll")}</Button>
              </div>
              <p className="text-muted-foreground mb-6">{t("customer.scanDescription")}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockProducts.slice(0, 4).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    t={t}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area with Tabs */}
        <Tabs defaultValue="scan" value={activeTab} onValueChange={handleTabChange}>
          {/* Mobile Tabs - Hidden on Desktop */}
          <div className="md:hidden mb-6">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="scan" className="flex flex-col items-center py-2">
                <QrCode className="h-5 w-5 mb-1" />
                <span className="text-xs">{t("customer.scanQR")}</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex flex-col items-center py-2">
                <Search className="h-5 w-5 mb-1" />
                <span className="text-xs">{t("customer.productSearch")}</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex flex-col items-center py-2">
                <MapPin className="h-5 w-5 mb-1" />
                <span className="text-xs">{t("customer.storeMap")}</span>
              </TabsTrigger>
              <TabsTrigger value="cart" className="flex flex-col items-center py-2">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 mb-1" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </div>
                <span className="text-xs">{t("customer.virtualCart")}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:block mb-6">
            <TabsList>
              <TabsTrigger value="scan">
                <QrCode className="h-4 w-4 mr-2" />
                {t("customer.scanQR")}
              </TabsTrigger>
              <TabsTrigger value="search">
                <Search className="h-4 w-4 mr-2" />
                {t("customer.productSearch")}
              </TabsTrigger>
              <TabsTrigger value="map">
                <MapPin className="h-4 w-4 mr-2" />
                {t("customer.storeMap")}
              </TabsTrigger>
              <TabsTrigger value="cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("customer.virtualCart")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="scan" className="mt-2 space-y-4">
            <QRScanner 
              onProductScan={handleProductScan} 
              onAddToCart={addToCart}
              t={t}
            />
          </TabsContent>

          <TabsContent value="search" className="mt-2 space-y-4">
            <ProductSearch onAddToCart={addToCart} t={t} />
          </TabsContent>

          <TabsContent value="map" className="mt-2 space-y-4">
            <StoreMap />
          </TabsContent>

          <TabsContent value="cart" className="mt-2 space-y-4">
            <VirtualCart 
              cartItems={cartItems} 
              setCartItems={setCartItems} 
              userBudget={userBudget}
              setUserBudget={setUserBudget}
              isFirstTime={!!user?.isFirstTime}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-16 px-4 z-50">
        <div className="flex flex-col items-center justify-center space-y-1">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'map' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-xs">{t("customer.storeMap")}</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-1">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'search' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">{t("customer.productSearch")}</span>
          </button>
        </div>
          
        <div className="flex flex-col items-center justify-center space-y-1">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'scan' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">{t("customer.scan")}</span>
          </button>
        </div>
          
        <div className="flex flex-col items-center justify-center space-y-1">
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex flex-col items-center justify-center space-y-1 relative ${
              activeTab === 'cart' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs">{t("customer.virtualCart")}</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInterface;
