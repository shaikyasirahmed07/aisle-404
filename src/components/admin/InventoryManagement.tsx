import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Search, Package, AlertTriangle, QrCode } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseProduct } from '@/types/supabase';

const InventoryManagement = () => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    mrp: '',
    stockCount: '',
    aisleLocation: '',
    batchNumber: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stockCount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const productId = `P${String(products.length + 1).padStart(3, '0')}`;
      const productData = {
        productid: productId,
        name: newProduct.name,
        batchnumber: newProduct.batchNumber || `BT${Date.now()}`,
        expirydate: newProduct.expiryDate || null,
        location: newProduct.aisleLocation,
        mrp: parseFloat(newProduct.mrp) || parseFloat(newProduct.price),
        price: parseFloat(newProduct.price),
        discount: newProduct.mrp ? Math.round(((parseFloat(newProduct.mrp) - parseFloat(newProduct.price)) / parseFloat(newProduct.mrp)) * 100) : 0,
        category: newProduct.category,
        stockcount: parseInt(newProduct.stockCount),
        qrlink: `${window.location.origin}/product/${productId}`,
        scannedcount: 0,
        cartaddcount: 0,
        salecount: 0,
        viewcount: 0,
        salesvelocity: 0,
        restockthreshold: 10,
        isonpromotion: false
      };

      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) throw error;

      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to inventory with QR code generated`,
      });

      // Reset form and close dialog
      setNewProduct({
        name: '', category: '', price: '', mrp: '', stockCount: '', 
        aisleLocation: '', batchNumber: '', expiryDate: ''
      });
      setIsAddDialogOpen(false);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inventory Management</h2>
          <p className="text-muted-foreground">Manage your product inventory and generate QR codes</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    placeholder="e.g., Personal Care"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Selling Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="mrp">MRP</Label>
                  <Input
                    id="mrp"
                    type="number"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({...newProduct, mrp: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stockCount">Stock Count *</Label>
                  <Input
                    id="stockCount"
                    type="number"
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({...newProduct, stockCount: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="aisleLocation">Location</Label>
                  <Input
                    id="aisleLocation"
                    value={newProduct.aisleLocation}
                    onChange={(e) => setNewProduct({...newProduct, aisleLocation: e.target.value})}
                    placeholder="Aisle 5B"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={newProduct.batchNumber}
                    onChange={(e) => setNewProduct({...newProduct, batchNumber: e.target.value})}
                    placeholder="Auto-generated"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newProduct.expiryDate}
                    onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={handleAddProduct} className="w-full">
                <QrCode className="w-4 h-4 mr-2" />
                Add Product & Generate QR
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.stockcount <= (p.restockthreshold || 10)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <QrCode className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">QR Codes Generated</p>
                <p className="text-2xl font-bold">{products.filter(p => p.qrlink).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>QR Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.productid}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.productid}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">₹{product.price}</p>
                        {product.mrp && product.mrp > product.price && (
                          <p className="text-sm text-muted-foreground line-through">₹{product.mrp}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.stockcount <= (product.restockthreshold || 10) ? "destructive" : "default"}
                      >
                        {product.stockcount}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.location || 'Not set'}</TableCell>
                    <TableCell>
                      {product.qrlink ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <QrCode className="w-3 h-3 mr-1" />
                          Generated
                        </Badge>
                      ) : (
                        <Badge variant="outline">No QR</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        {product.qrlink && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(product.qrlink, '_blank')}
                          >
                            <QrCode className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;