import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash, 
  Gift, 
  CreditCard,
  Receipt,
  Target,
  Percent
} from 'lucide-react';
import { Product } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface VirtualCartProps {
  cartItems: {product: Product, quantity: number}[];
  setCartItems: React.Dispatch<React.SetStateAction<{product: Product, quantity: number}[]>>;
  userBudget: number;
  setUserBudget: React.Dispatch<React.SetStateAction<number>>;
  isFirstTime: boolean;
}

const VirtualCart: React.FC<VirtualCartProps> = ({ 
  cartItems, 
  setCartItems, 
  userBudget, 
  setUserBudget,
  isFirstTime 
}) => {
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [newBudget, setNewBudget] = useState(userBudget.toString());

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const firstTimeDiscount = isFirstTime ? subtotal * 0.05 : 0;
  const total = subtotal - firstTimeDiscount;
  const budgetPercentage = (total / userBudget) * 100;

  const updateBudget = () => {
    const budget = parseFloat(newBudget);
    if (budget > 0) {
      setUserBudget(budget);
      setShowBudgetEdit(false);
      toast({
        title: "Budget updated",
        description: `Your budget has been set to ₹${budget}`,
      });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    // Calculate estimated waiting time based on queue
    const customersAhead = Math.floor(Math.random() * 8) + 1; // 1-8 customers
    const waitingTime = customersAhead * 2; // 2 minutes per customer

    toast({
      title: "Proceed to Checkout",
      description: `Estimated waiting time: ${waitingTime} minutes (${customersAhead} customers ahead)`,
      duration: 5000,
    });
  };

  const getBudgetStatus = () => {
    if (budgetPercentage >= 100) return { color: 'text-destructive', bg: 'bg-destructive', message: 'Budget exceeded!' };
    if (budgetPercentage >= 80) return { color: 'text-warning', bg: 'bg-warning', message: 'Approaching budget limit' };
    return { color: 'text-success', bg: 'bg-success', message: 'Within budget' };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Virtual Cart</h3>
          <p className="text-muted-foreground">Review your items and manage your budget</p>
        </div>
        {cartItems.length > 0 && (
          <Button variant="outline" onClick={clearCart}>
            <Trash className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      {/* Budget Tracker */}
      <Card className="card-retail bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Budget Tracker</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBudgetEdit(!showBudgetEdit)}
            >
              Edit Budget
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showBudgetEdit ? (
            <div className="flex space-x-2">
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="Enter budget"
              />
              <Button onClick={updateBudget} size="sm">Save</Button>
              <Button variant="outline" size="sm" onClick={() => setShowBudgetEdit(false)}>Cancel</Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current: ₹{total.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">Budget: ₹{userBudget}</span>
              </div>
              <Progress value={Math.min(budgetPercentage, 100)} className="h-3" />
              <div className={`text-sm font-medium ${budgetStatus.color}`}>
                {budgetStatus.message} ({budgetPercentage.toFixed(1)}%)
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Cart Items */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Cart Items ({cartItems.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Start scanning QR codes or search for products to add them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg font-bold text-primary">₹{item.product.price}</span>
                      {item.product.discount > 0 && (
                        <Badge variant="secondary" className="bg-success-light text-success">
                          {item.product.discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <Card className="card-retail">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Cart Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {isFirstTime && firstTimeDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <span className="flex items-center space-x-1">
                    <Gift className="w-4 h-4" />
                    <span>First-time discount (5%)</span>
                  </span>
                  <span>-₹{firstTimeDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              {budgetPercentage > 100 && (
                <div className="text-sm text-destructive">
                  Over budget by ₹{(total - userBudget).toFixed(2)}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="text-center p-3 bg-secondary-light rounded-lg">
                <div className="text-sm font-medium text-secondary">Estimated Waiting Time</div>
                <div className="text-lg font-bold text-foreground">
                  {Math.floor(Math.random() * 8) + 2} minutes
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 4) + 1} customers ahead in queue
                </div>
              </div>
              
              <Button className="w-full btn-primary" onClick={handleCheckout}>
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Note: This is a virtual cart. Actual payment will be processed at the checkout counter.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cart Tips */}
      <Card className="card-retail bg-secondary-light border-secondary/20">
        <CardHeader>
          <CardTitle className="text-secondary">Shopping Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Budget Management</p>
              <p className="text-sm text-muted-foreground">
                Set and track your budget to stay within your spending limits
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Receipt className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Virtual Cart</p>
              <p className="text-sm text-muted-foreground">
                Your virtual cart helps you track items and estimated total before checkout
              </p>
            </div>
          </div>
          {isFirstTime && (
            <div className="flex items-start space-x-3">
              <Gift className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">First-time Bonus</p>
                <p className="text-sm text-muted-foreground">
                  Enjoy 5% off on your first purchase! Discount applied automatically.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualCart;