import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Clock,
  Users
} from 'lucide-react';
import { Product } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [newBudget, setNewBudget] = useState(userBudget.toString());
  const [waitingTime, setWaitingTime] = useState(Math.floor(Math.random() * 8) + 2);
  const [customersAhead, setCustomersAhead] = useState(Math.floor(Math.random() * 4) + 1);

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
      title: t("cart.itemRemoved"),
      description: t("cart.itemRemovedDesc"),
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: t("cart.cartCleared"),
      description: t("cart.cartClearedDesc"),
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
        title: t("cart.budgetUpdated"),
        description: t("cart.budgetUpdatedDesc", { amount: budget }),
      });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: t("cart.emptyCart"),
        description: t("cart.addItemsBeforeCheckout"),
        variant: "destructive",
      });
      return;
    }

    // Recalculate waiting time each time checkout is clicked
    const newCustomersAhead = Math.floor(Math.random() * 8) + 1;
    const newWaitingTime = newCustomersAhead * 2;
    
    setWaitingTime(newWaitingTime);
    setCustomersAhead(newCustomersAhead);

    toast({
      title: t("cart.proceedToCheckout"),
      description: t("cart.waitingTimeEstimate", { minutes: newWaitingTime, customers: newCustomersAhead }),
      duration: 5000,
    });
  };

  const getBudgetStatus = () => {
    if (budgetPercentage >= 100) return { color: 'text-destructive', bg: 'bg-destructive', message: t('cart.budgetExceeded') };
    if (budgetPercentage >= 80) return { color: 'text-warning', bg: 'bg-warning', message: t('cart.approachingBudget') };
    return { color: 'text-success', bg: 'bg-success', message: t('cart.withinBudget') };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{t('cart.virtualCart')}</h3>
          <p className="text-muted-foreground">{t('cart.reviewYourItems')}</p>
        </div>
        {cartItems.length > 0 && (
          <Button variant="outline" onClick={clearCart}>
            <Trash className="w-4 h-4 mr-2" />
            {t('cart.clearCart')}
          </Button>
        )}
      </div>

      {/* Budget Tracker */}
      <Card className="card-retail bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>{t('cart.budgetTracker')}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBudgetEdit(!showBudgetEdit)}
            >
              {t('cart.editBudget')}
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
                placeholder={t('cart.enterBudget')}
              />
              <Button onClick={updateBudget} size="sm">{t('common.save')}</Button>
              <Button variant="outline" size="sm" onClick={() => setShowBudgetEdit(false)}>{t('common.cancel')}</Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('cart.current')}: ₹{total.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">{t('cart.budget')}: ₹{userBudget}</span>
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
            <span>{t('cart.cartItems')} ({cartItems.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('cart.emptyCartMessage')}</p>
              <p className="text-sm text-muted-foreground">{t('cart.startScanning')}</p>
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
                          {item.product.discount}% {t('product.off')}
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
              <span>{t('cart.cartSummary')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} {t('customer.items')})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {isFirstTime && firstTimeDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <span className="flex items-center space-x-1">
                    <Gift className="w-4 h-4" />
                    <span>{t('cart.firstTimeDiscount')} (5%)</span>
                  </span>
                  <span>-₹{firstTimeDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              {budgetPercentage > 100 && (
                <div className="text-sm text-destructive">
                  {t('cart.overBudget')} ₹{(total - userBudget).toFixed(2)}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {/* Waiting Time Indicator */}
              <div className="text-center p-4 bg-secondary-light rounded-lg">
                <div className="text-sm font-medium text-secondary">{t('cart.estimatedWaitingTime')}</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Clock className="w-5 h-5 text-secondary animate-pulse" />
                  <div className="text-lg font-bold text-foreground">
                    {waitingTime} {t('cart.minutes')}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                  <Users className="w-3 h-3" />
                  <span>{customersAhead} {t('cart.customersAhead')}</span>
                </div>
              </div>
              
              <Button className="w-full bg-primary text-white" onClick={handleCheckout}>
                <CreditCard className="w-4 h-4 mr-2" />
                {t('cart.proceedToCheckout')}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              {t('cart.virtualCartNote')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cart Tips */}
      <Card className="card-retail bg-secondary-light border-secondary/20">
        <CardHeader>
          <CardTitle className="text-secondary">{t('cart.shoppingTips')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t('cart.budgetManagement')}</p>
              <p className="text-sm text-muted-foreground">
                {t('cart.budgetManagementDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Receipt className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t('cart.virtualCartTip')}</p>
              <p className="text-sm text-muted-foreground">
                {t('cart.virtualCartTipDesc')}
              </p>
            </div>
          </div>
          {isFirstTime && (
            <div className="flex items-start space-x-3">
              <Gift className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{t('cart.firstTimeBonus')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('cart.firstTimeBonusDesc')}
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