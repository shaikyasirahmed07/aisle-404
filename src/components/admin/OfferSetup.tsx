import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Gift, Edit, Trash, Eye, Percent } from 'lucide-react';
import { mockComboOffers, mockProducts, ComboOffer } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const OfferSetup = () => {
  const [offers, setOffers] = useState<ComboOffer[]>(mockComboOffers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const [newOffer, setNewOffer] = useState({
    name: '',
    description: '',
    discount: '',
    conditions: '',
    isActive: true
  });

  const handleCreateOffer = () => {
    if (!newOffer.name || selectedProducts.length < 2 || !newOffer.discount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least 2 products",
        variant: "destructive",
      });
      return;
    }

    const offer: ComboOffer = {
      id: `C${String(offers.length + 1).padStart(3, '0')}`,
      name: newOffer.name,
      description: newOffer.description,
      productIds: selectedProducts,
      discount: parseFloat(newOffer.discount),
      conditions: newOffer.conditions || `Scan all ${selectedProducts.length} items to unlock ${newOffer.discount}% discount`,
      isActive: newOffer.isActive
    };

    setOffers([...offers, offer]);
    setNewOffer({ name: '', description: '', discount: '', conditions: '', isActive: true });
    setSelectedProducts([]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Offer Created",
      description: `${offer.name} has been created successfully`,
    });
  };

  const handleToggleOffer = (offerId: string) => {
    setOffers(offers.map(offer => 
      offer.id === offerId 
        ? { ...offer, isActive: !offer.isActive }
        : offer
    ));
    
    toast({
      title: "Offer Updated",
      description: "Offer status has been updated",
    });
  };

  const handleDeleteOffer = (offerId: string) => {
    setOffers(offers.filter(offer => offer.id !== offerId));
    toast({
      title: "Offer Deleted",
      description: "Offer has been removed",
    });
  };

  const getProductName = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const handleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Combo Offer Setup</h3>
          <p className="text-muted-foreground">Create and manage combo offers to boost sales</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Combo Offer</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Offer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offerName">Offer Name *</Label>
                  <Input
                    id="offerName"
                    value={newOffer.name}
                    onChange={(e) => setNewOffer({...newOffer, name: e.target.value})}
                    placeholder="e.g., Breakfast Bundle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%) *</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="50"
                    value={newOffer.discount}
                    onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                    placeholder="15"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  placeholder="Describe the offer benefits..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Conditions</Label>
                <Textarea
                  id="conditions"
                  value={newOffer.conditions}
                  onChange={(e) => setNewOffer({...newOffer, conditions: e.target.value})}
                  placeholder="Auto-generated if empty"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newOffer.isActive}
                  onCheckedChange={(checked) => setNewOffer({...newOffer, isActive: checked})}
                />
                <Label htmlFor="isActive">Activate offer immediately</Label>
              </div>

              {/* Product Selection */}
              <div className="space-y-4">
                <Label>Select Products for Combo (minimum 2) *</Label>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelection(product.id)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.category} • ₹{product.price} • {product.aisleLocation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedProducts.length} products
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOffer} className="btn-secondary">
                Create Offer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Offers */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Combo Offers ({offers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer Name</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{offer.name}</div>
                        <div className="text-sm text-muted-foreground">{offer.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {offer.productIds.slice(0, 2).map(productId => (
                          <div key={productId} className="text-sm">
                            {getProductName(productId)}
                          </div>
                        ))}
                        {offer.productIds.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            +{offer.productIds.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success-light text-success">
                        <Percent className="w-3 h-3 mr-1" />
                        {offer.discount}% OFF
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={offer.isActive ? "default" : "secondary"}>
                        {offer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">234 sales</div>
                        <div className="text-muted-foreground">This month</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleOffer(offer.id)}
                        >
                          <Switch checked={offer.isActive} onChange={() => {}} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteOffer(offer.id)}
                        >
                          <Trash className="w-4 h-4" />
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

      {/* Offer Preview */}
      <Card className="card-retail bg-secondary-light border-secondary/20">
        <CardHeader>
          <CardTitle className="text-secondary">Customer Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-card rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">Breakfast Bundle</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Complete your morning routine with this perfect breakfast combo
            </p>
            <div className="flex items-center space-x-4 mb-3">
              <Badge variant="secondary" className="bg-success-light text-success">
                <Percent className="w-3 h-3 mr-1" />
                12% OFF
              </Badge>
              <span className="text-sm text-muted-foreground">
                Scan all 3 items to unlock discount
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              ✓ Amul Taza Milk 1L • ✓ Bread • ✓ Butter
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferSetup;