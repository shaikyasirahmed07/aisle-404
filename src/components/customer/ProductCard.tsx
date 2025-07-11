import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star,
  Heart,
  MessageCircle,
  MapPin,
  X
} from 'lucide-react';
import { Product } from '@/data/mockData';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  t: (key: string, options?: any) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, t }) => {
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    
    if (isLeftSwipe) {
      setIsSwipeActive(true);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsSwipeActive(false);
  };

  const handleCancel = () => {
    setIsSwipeActive(false);
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 max-w-sm mx-auto md:max-w-none relative overflow-hidden">
      {/* Swipe to Add Overlay */}
      {isSwipeActive && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center space-x-3">
            <span className="text-sm font-medium">{t("customer.swipeToAdd")}</span>
            <Button size="sm" onClick={handleAddToCart} className="bg-primary text-white">
              {t("customer.addToCart")}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Product Card */}
      <div 
        className="md:hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative mb-3">
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">{product.name}</span>
          </div>
          <button className="absolute top-2 right-2 p-1">
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm">{product.name}</h4>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{t("customer.aisle")} {product.aisleLocation}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">₹{product.price}</span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
                <Badge variant="secondary" className="bg-success-light text-success text-xs">
                  {product.discount}% OFF
                </Badge>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
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
              <span className="text-xs text-muted-foreground ml-1">
                {product.averageRating}
              </span>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>2.3k</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>630</span>
              </div>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full btn-primary mt-3"
            onClick={handleAddToCart}
          >
            {t("customer.addToCart")}
          </Button>
        </div>
      </div>

      {/* Desktop Product Card */}
      <div className="hidden md:block">
        <div className="relative mb-3">
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">{product.name}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{product.name}</h4>
          <Badge variant="outline">{product.aisleLocation}</Badge>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          <span>{t("customer.aisle")} {product.aisleLocation}</span>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg font-bold text-primary">₹{product.price}</span>
          {product.discount > 0 && (
            <>
              <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
              <Badge variant="secondary" className="bg-success-light text-success">
                {product.discount}% OFF
              </Badge>
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
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
          
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>2.3k</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" />
              <span>630</span>
            </div>
          </div>
        </div>
        
        <Button 
          size="sm" 
          className="w-full btn-primary"
          onClick={handleAddToCart}
        >
          {t("customer.addToCart")}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;