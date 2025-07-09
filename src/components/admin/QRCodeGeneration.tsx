import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QrCode, Download, Search, RefreshCw, Eye } from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const QRCodeGeneration = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateQR = (productId: string) => {
    toast({
      title: "QR Code Generated",
      description: "QR code has been generated and is ready for download",
    });
  };

  const handleBulkGenerate = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No products selected",
        description: "Please select products to generate QR codes",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bulk QR Generation",
      description: `Generated QR codes for ${selectedProducts.length} products`,
    });
    setSelectedProducts([]);
  };

  const handleDownloadQR = (product: Product) => {
    // In a real app, this would generate and download the actual QR code
    toast({
      title: "Download Started",
      description: `Downloading QR code for ${product.name}`,
    });
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  // Mock QR code component
  const QRCodeDisplay = ({ qrCode }: { qrCode: string }) => (
    <div className="w-16 h-16 bg-foreground flex items-center justify-center rounded border">
      <div className="w-12 h-12 bg-background rounded grid grid-cols-3 grid-rows-3 gap-px">
        {Array.from({ length: 9 }).map((_, i) => (
          <div 
            key={i} 
            className={`${Math.random() > 0.5 ? 'bg-foreground' : 'bg-background'} rounded-sm`} 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground">QR Code Generation</h3>
          <p className="text-muted-foreground">Generate and manage QR codes for your products</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleBulkGenerate}
            disabled={selectedProducts.length === 0}
            className="btn-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Selected ({selectedProducts.length})
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="card-retail">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or QR codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleSelectAll}>
              {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Codes Table */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>QR Codes ({filteredProducts.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>QR ID</TableHead>
                  <TableHead>Aisle Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <QRCodeDisplay qrCode={product.qrCode} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {product.qrCode}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.aisleLocation}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadQR(product)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGenerateQR(product.id)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Management Tips */}
      <Card className="card-retail bg-primary-light border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">QR Code Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <QrCode className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Print Quality</p>
              <p className="text-sm text-muted-foreground">
                Ensure QR codes are printed at minimum 2cm x 2cm for reliable scanning
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <QrCode className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Placement</p>
              <p className="text-sm text-muted-foreground">
                Place QR codes at eye level on product shelves for easy customer access
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <QrCode className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Batch Updates</p>
              <p className="text-sm text-muted-foreground">
                Regenerate QR codes when product information changes significantly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGeneration;