import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star,
  Heart,
  MessageCircle,
  MapPin,
  X,
  Navigation,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { Product } from '@/data/mockData';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  t?: (key: string, options?: any) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, t: tProp }) => {
  const { t } = useTranslation();
  const translate = tProp || t;
  
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [liked, setLiked] = useState(false);

  const minSwipeDistance = 50;
  const maxSwipeDistance = 150;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeDistance(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    const distance = touchStart - currentTouch;
    if (distance > 0) { // Only allow left swipes
      setSwipeDistance(Math.min(distance, maxSwipeDistance));
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    
    if (isLeftSwipe) {
      setIsSwipeActive(true);
    } else {
      // Reset swipe
      setSwipeDistance(0);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsSwipeActive(false);
    setSwipeDistance(0);
  };

  const handleCancel = () => {
    setIsSwipeActive(false);
    setSwipeDistance(0);
  };

  // Calculate savings
  const savings = product.mrp - product.price;
  
  // Generate random engagement metrics
  const likes = Math.floor(Math.random() * 4000) + 100;
  const comments = Math.floor(Math.random() * 800) + 10;
  const formattedLikes = likes > 1000 ? `${(likes / 1000).toFixed(1)}K` : likes;
  
  // Create swipe animation style
  const swipeStyle = {
    transform: `translateX(-${swipeDistance}px)`,
    transition: touchEnd ? 'none' : 'transform 0.3s ease'
  };

  return (
    <Card className="relative overflow-hidden bg-white shadow-sm">
      {/* Swipe to Add Overlay */}
      {isSwipeActive && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center space-x-3">
            <span className="text-sm font-medium">{translate("customer.addToCart")}</span>
            <Button size="sm" onClick={handleAddToCart} className="bg-primary text-white">
              {translate("customer.confirm")}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Product Card Content */}
      <div 
        className="relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={swipeStyle}
      >
        <div className="relative">
          {/* Product Image */}
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
            <div className="w-32 h-32 bg-white/80 rounded-lg flex items-center justify-center">
              <span className="font-medium text-gray-500">{product.name}</span>
            </div>
          </div>
          
          {/* Like Button */}
          <button 
            className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </button>
        </div>

        <div className="p-3">
          {/* Product Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm leading-tight">{product.name}</h4>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs h-5 py-0 px-1.5 bg-gray-50">
                  <MapPin className="w-3 h-3 mr-0.5" />
                  {product.aisleLocation}
                </Badge>
                <Badge variant="secondary" className="text-xs h-5 py-0 px-1.5">
                  {product.category.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${
                    i < Math.floor(product.averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">{product.averageRating.toFixed(1)}</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">₹{product.price}</span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                <Badge className="bg-green-100 text-green-700 text-xs border-0">
                  {product.discount}% OFF
                </Badge>
              </>
            )}
          </div>

          {/* Engagement metrics */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500 ml-1">{formattedLikes}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500 ml-1">{comments}</span>
              </div>
            </div>
            
            <Button 
              size="sm" 
              className="h-8 bg-primary hover:bg-primary/90 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              {translate("customer.addToCart")}
            </Button>
          </div>
          
          {/* Availability and Expiry */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>
              {translate("product.availability")}:{" "}
              {product.stockCount > 0
                ? `${product.stockCount} ${translate("product.inStock")}`
                : translate("product.outOfStock")}
            </span>
            <span>
              {translate("product.expiry")}:{" "}
              {product.expiryDate
                ? new Date(product.expiryDate).toLocaleDateString()
                : "-"}
            </span>
          </div>

          {/* Swipe indicator - mobile only */}
          <div className="absolute bottom-2 right-2 md:hidden">
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-1">{translate("customer.swipeToAddToCart")}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;