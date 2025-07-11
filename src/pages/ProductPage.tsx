import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ShoppingCart, ArrowLeft, Phone, Heart, MessageCircle, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface Product {
  productid: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  location: string;
  stockcount: number;
  category: string;
  expirydate: string;
  description?: string;
  viewcount?: number;
  cartaddcount?: number;
}

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      updateViewCount();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('productid', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: t("product.notFound"),
        description: t("product.scannedProductNotFound"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateViewCount = async () => {
    try {
      if (productId) {
        const { data, error } = await supabase
          .from('products')
          .select('viewcount')
          .eq('productid', productId)
          .single();

        if (error) throw error;

        const newViewCount = (data.viewcount || 0) + 1;
        
        await supabase
          .from('products')
          .update({ viewcount: newViewCount })
          .eq('productid', productId);
      }
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!phoneNumber && !showPhoneInput) {
      setShowPhoneInput(true);
      return;
    }

    if (!phoneNumber) {
      toast({
        title: t("cart.phoneRequired"),
        description: t("cart.enterPhoneToAddToCart"),
        variant: "destructive",
      });
      return;
    }

    if (phoneNumber.length !== 10 || isNaN(Number(phoneNumber))) {
      toast({
        title: t("cart.invalidPhone"),
        description: t("cart.enterValidPhone"),
        variant: "destructive",
      });
      return;
    }

    try {
      if (product) {
        // Update cart count in database
        const { error: cartError } = await supabase
          .from('products')
          .update({ 
            cartaddcount: (product.cartaddcount || 0) + 1 
          })
          .eq('productid', productId);

        if (cartError) throw cartError;

        // In a real app, we would add this to the user's cart in the database
        toast({
          title: t("cart.addedToCart"),
          description: `${product.name} - ₹${product.price}`,
        });

        // Reset after adding to cart
        setShowPhoneInput(false);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: t("cart.addToCartError"),
        description: t("cart.tryAgain"),
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen p-6 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t("product.notFound")}</h1>
          <p className="text-muted-foreground mb-6">{t("product.scannedProductNotFound")}</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  // Random engagement metrics for demo
  const likes = Math.floor(Math.random() * 5000) + 100;
  const comments = Math.floor(Math.random() * 800) + 20;
  const formattedLikes = likes > 1000 ? `${(likes / 1000).toFixed(1)}K` : likes;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
        <h1 className="text-lg font-bold text-foreground truncate max-w-[200px]">
          {product.name}
        </h1>
        <Button variant="ghost" size="sm" onClick={() => setLiked(!liked)}>
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <div className="container mx-auto p-6 max-w-3xl">
        {/* Product Main Card */}
        <Card className="mb-6 overflow-hidden">
          {/* Product Image */}
          <div className="h-64 bg-muted flex items-center justify-center">
            <div className="w-40 h-40 bg-white/80 rounded-lg flex items-center justify-center p-4">
              <span className="text-xl font-medium text-gray-500">{product.name}</span>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Product Title and Category */}
              <div>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="mr-2">
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {product.location}
                  </Badge>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{product.mrp}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {product.discount}% {t('product.off')}
                    </Badge>
                  </>
                )}
              </div>

              {/* Rating and Stats */}
              <div className="flex items-center space-x-6 border-y py-3">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < 4 // Mock 4-star rating
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium ml-1">4.0</span>
                </div>
                
                <div className="flex items-center">
                  <Heart className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm">{formattedLikes}</span>
                </div>
                
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm">{comments}</span>
                </div>
                
                <div className="flex items-center">
                  <Share2 className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm">{t('product.share')}</span>
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('product.availability')}</span>
                  <span className="text-sm font-medium">
                    {product.stockcount > 0 
                      ? `${product.stockcount} ${t('product.inStock')}` 
                      : t('product.outOfStock')}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm">{t('product.expiry')}</span>
                  <span className="text-sm font-medium">
                    {product.expirydate
                      ? new Date(product.expirydate).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">{t('product.description')}</h3>
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                </div>
              )}

              {/* Phone Input for Cart */}
              {showPhoneInput && (
                <div className="border-t pt-4 space-y-3">
                  <label htmlFor="phone-input" className="text-sm font-medium">
                    {t('cart.enterPhoneForCart')}
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="phone-input"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="1234567890"
                      maxLength={10}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => setShowPhoneInput(false)}>
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button 
                className="w-full mt-4 bg-primary text-white" 
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stockcount <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('customer.addToCart')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Products would go here */}
      </div>
    </div>
  );
};

export default ProductPage;