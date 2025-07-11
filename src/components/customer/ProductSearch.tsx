import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, ShoppingCart, Navigation, Filter } from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';
import ProductCard from './ProductCard';

interface ProductSearchProps {
  onAddToCart: (product: Product) => void;
  t: (key: string, options?: any) => string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onAddToCart, t }) => {
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
        <h3 className="text-2xl font-bold text-foreground mb-2">{t("search.title")}</h3>
        <p className="text-muted-foreground">{t("search.description")}</p>
      </div>

      {/* Search Bar */}
      <Card className="card-retail">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search.placeholder")}
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
                <span>{t("search.filters")}</span>
              </Button>
              
              {showFilters && (
                <>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("search.category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("search.allCategories")}</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("search.sortBy")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">{t("search.sortName")}</SelectItem>
                      <SelectItem value="price-low">{t("search.sortPriceLow")}</SelectItem>
                      <SelectItem value="price-high">{t("search.sortPriceHigh")}</SelectItem>
                      <SelectItem value="rating">{t("search.sortRating")}</SelectItem>
                      <SelectItem value="discount">{t("search.sortDiscount")}</SelectItem>
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
            <CardTitle>{t("search.popularSearches")}</CardTitle>
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
            <span>{t("search.results")} ({filteredProducts.length})</span>
            {searchTerm && (
              <Badge variant="outline">
                {t("search.searchingFor")}: "{searchTerm}"
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("search.noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  t={t}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Tips */}
      <Card className="card-retail bg-primary-light border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">{t("search.tips.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Search className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t("search.tips.navigation.title")}</p>
              <p className="text-sm text-muted-foreground">
                {t("search.tips.navigation.description")}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t("search.tips.aisle.title")}</p>
              <p className="text-sm text-muted-foreground">
                {t("search.tips.aisle.description")}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Filter className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t("search.tips.filters.title")}</p>
              <p className="text-sm text-muted-foreground">
                {t("search.tips.filters.description")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSearch;