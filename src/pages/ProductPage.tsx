import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ShoppingCart, ArrowLeft, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);

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
        title: "Product not found",
        description: "The scanned product could not be found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateViewCount = async () => {
    try {
      if (productId) {
        await supabase
          .from('products')
          .update({ viewcount: (product?.viewcount || 0) + 1 })
          .eq('productid', productId);
      }
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!phoneNumber) {
      setShowPhoneInput(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('virtual_carts')
        .insert({
          productid: productId,
          phonenumber: phoneNumber,
          quantity: 1
        });

      if (error) throw error;

      // Update cart add count
      if (productId) {
        await supabase
          .from('products')
          .update({ cartaddcount: (product?.cartaddcount || 0) + 1 })
          .eq('productid', productId);
      }

      toast({
        title: "Added to Cart",
        description: `${product?.name} added to your virtual cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add item to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
        </div>

        {/* Product Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl">{product.name}</span>
              <Badge variant="outline" className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{product.location}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      {product.discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                MRP: ₹{product.mrp} • You save ₹{(product.mrp || 0) - product.price}
              </div>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Category:</span>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <span className="text-gray-600">Stock:</span>
                <p className={`font-medium ${product.stockcount > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                  {product.stockcount} available
                </p>
              </div>
            </div>

            {/* Location */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Location</span>
                </div>
                <p className="text-sm text-blue-700">
                  Find this product at: <strong>{product.location}</strong>
                </p>
              </CardContent>
            </Card>

            {/* Phone Input for Cart */}
            {showPhoneInput && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Phone className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Add to Virtual Cart</span>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      maxLength={10}
                    />
                    <Button 
                      onClick={handleAddToCart}
                      disabled={phoneNumber.length !== 10}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">
                    We'll link your cart to this number for easy checkout
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={product.stockcount === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stockcount === 0 ? 'Out of Stock' : 'Add to Virtual Cart'}
            </Button>

            {/* Customer Interface Link */}
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/customer')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductPage;