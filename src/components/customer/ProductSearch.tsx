import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, ShoppingCart, Navigation, Filter } from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';

interface ProductSearchProps {
  onAddToCart: (product: Product) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(mockProducts.map(p => p.category))];

  const filteredProducts = mockProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'discount':
          return b.discount - a.discount;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleTakeMeThere = (product: Product) => {
    // In a real app, this would show navigation
    alert(`Navigate to Aisle ${product.aisleLocation} to find ${product.name}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Product Search</h3>
        <p className="text-muted-foreground">Find products and their locations in the store</p>
      </div>

      {/* Search Bar */}
      <Card className="card-retail">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for products... (e.g., toothpaste, milk, bread)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
              
              {showFilters && (
                <>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="discount">Best Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Search Suggestions */}
      {searchTerm === '' && (
        <Card className="card-retail">
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['toothpaste', 'milk', 'bread', 'cookies', 'detergent', 'noodles'].map(term => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Search Results ({filteredProducts.length})</span>
            {searchTerm && (
              <Badge variant="outline">
                Searching for: "{searchTerm}"
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover-lift">
                  <CardContent className="p-4 space-y-3">
                    {/* Product Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge variant="outline" className="flex items-center space-x-1 ml-2">
                        <MapPin className="w-3 h-3" />
                        <span>{product.aisleLocation}</span>
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
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
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.averageRating} ({product.reviews.length})
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-1">
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
                      {product.discount > 0 && (
                        <p className="text-xs text-success">
                          You save ₹{product.mrp - product.price}
                        </p>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div>
                      <Badge variant={product.stock > 20 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleTakeMeThere(product)}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Take me there
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 btn-primary"
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>

                    {/* Special Indicators */}
                    <div className="flex space-x-1">
                      {product.isNearExpiry && (
                        <Badge variant="destructive" className="text-xs">
                          Near Expiry
                        </Badge>
                      )}
                      {product.salesVelocity === 'high' && (
                        <Badge variant="default" className="text-xs bg-orange-100 text-orange-700">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Tips */}
      <Card className="card-retail bg-primary-light border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Search Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Search className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Quick Navigation</p>
              <p className="text-sm text-muted-foreground">
                Use "Take me there" to get directions to any product location
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Aisle Information</p>
              <p className="text-sm text-muted-foreground">
                Each product shows its exact aisle location for easy finding
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Filter className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Smart Filters</p>
              <p className="text-sm text-muted-foreground">
                Filter by category, price, rating, or discount to find exactly what you need
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSearch;