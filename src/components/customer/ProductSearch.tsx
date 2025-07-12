import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, ShoppingCart, Navigation, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import { fetchAllProducts, searchProducts } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  batchNumber: string;
  expiryDate: string;
  aisleLocation: string;
  location: string;
  stock: number;
  stockCount: number;
  description: string;
  imageUrl: string;
  brand: string;
  manufacturer: string;
  weight: string;
  dimensions: string;
  tags: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  // Add other fields as needed
}

interface ProductSearchProps {
  onAddToCart: (product: Product) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onAddToCart, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initial product load
  useEffect(() => {
    loadProducts();
  }, []);

  // Load products based on search/filter/sort
  useEffect(() => {
    if (searchTerm || categoryFilter !== 'all' || sortBy !== 'name') {
      handleSearch();
    }
  }, [categoryFilter, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await fetchAllProducts();
      // Ensure all required Product fields are present
      const normalizedProducts: Product[] = allProducts.map((p: any) => ({
        id: p.id,
        productId: p.productId,
        name: p.name,
        category: p.category,
        price: p.price,
        mrp: p.mrp,
        discount: p.discount,
        rating: p.rating ?? 0,
        batchNumber: p.batchNumber ?? '',
        expiryDate: p.expiryDate ?? '',
        aisleLocation: p.aisleLocation ?? '',
        location: p.location ?? '',
        stock: p.stock ?? 0,
        stockCount: p.stockCount ?? 0,
        description: p.description ?? '',
        imageUrl: p.imageUrl ?? '',
        brand: p.brand ?? '',
        manufacturer: p.manufacturer ?? '',
        weight: p.weight ?? '',
        dimensions: p.dimensions ?? '',
        tags: p.tags ?? [],
        isAvailable: p.isAvailable ?? true,
        isFeatured: p.isFeatured ?? false,
        createdAt: p.createdAt ?? '',
        updatedAt: p.updatedAt ?? '',
      }));
      setProducts(normalizedProducts);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(normalizedProducts.map(p => p.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast({
        title: t("search.error"),
        description: t("search.errorLoadingProducts"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchProducts(searchTerm, categoryFilter, sortBy);
      setProducts(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: t("search.error"),
        description: t("search.errorSearching"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
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
          <form onSubmit={handleSearchSubmit} className="space-y-4">
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
                type="button"
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
              
              <Button 
                type="submit" 
                className="ml-auto"
              >
                {t("search.search")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Search Suggestions */}
      {searchTerm === '' && !loading && (
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
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch();
                  }}
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
            <span>{t("search.results")} ({products.length})</span>
            {searchTerm && (
              <Badge variant="outline">
                {t("search.searchingFor")}: "{searchTerm}"
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("search.noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
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