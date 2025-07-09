import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [adminCreds, setAdminCreds] = useState({ employeeId: '', password: '' });
  const [customerCreds, setCustomerCreds] = useState({ phone: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock admin validation
    if (adminCreds.employeeId === 'admin001' && adminCreds.password === 'password123') {
      login({
        id: 'admin001',
        name: 'Store Manager',
        role: 'admin',
        employeeId: adminCreds.employeeId
      });
      toast({
        title: "Welcome back!",
        description: "Logged in successfully as Store Manager",
      });
      navigate('/admin');
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your employee ID and password",
        variant: "destructive",
      });
    }
  };

  const handleSendOTP = () => {
    if (customerCreds.phone.length === 10) {
      setOtpSent(true);
      toast({
        title: "OTP sent!",
        description: "Please enter OTP: 123456",
      });
    } else {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
    }
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (customerCreds.otp === '123456') {
      login({
        id: `customer_${customerCreds.phone}`,
        name: 'Customer',
        role: 'customer',
        phone: customerCreds.phone,
        isFirstTime: Math.random() > 0.5 // Random first-time user
      });
      toast({
        title: "Welcome!",
        description: "Logged in successfully",
      });
      navigate('/customer');
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            QR Retail System
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Enhancing retail operations through smart QR code-based inventory management, 
            customer engagement, and analytics
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <ShoppingCart className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Smart Shopping</h3>
              <p className="text-white/80 text-sm">QR scanning, virtual cart, and store navigation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Inventory Management</h3>
              <p className="text-white/80 text-sm">Real-time stock tracking and QR code generation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <BarChart3 className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Data Analytics</h3>
              <p className="text-white/80 text-sm">Actionable insights for business optimization</p>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto animate-slide-up">
          <Card className="card-retail shadow-strong">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Choose your role to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="admin">Store Manager</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="admin">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        type="text"
                        placeholder="Enter employee ID"
                        value={adminCreds.employeeId}
                        onChange={(e) => setAdminCreds({...adminCreds, employeeId: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={adminCreds.password}
                        onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full btn-primary">
                      Login as Manager
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Demo: Use ID "admin001" and password "password123"
                    </p>
                  </form>
                </TabsContent>
                
                <TabsContent value="customer">
                  <form onSubmit={handleCustomerLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter 10-digit phone"
                          value={customerCreds.phone}
                          onChange={(e) => setCustomerCreds({...customerCreds, phone: e.target.value})}
                          required
                          maxLength={10}
                        />
                        <Button 
                          type="button" 
                          onClick={handleSendOTP}
                          variant="outline"
                          disabled={otpSent || customerCreds.phone.length !== 10}
                        >
                          {otpSent ? 'Sent' : 'Send OTP'}
                        </Button>
                      </div>
                    </div>
                    {otpSent && (
                      <div className="space-y-2">
                        <Label htmlFor="otp">OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter OTP"
                          value={customerCreds.otp}
                          onChange={(e) => setCustomerCreds({...customerCreds, otp: e.target.value})}
                          required
                          maxLength={6}
                        />
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full btn-secondary"
                      disabled={!otpSent || customerCreds.otp.length !== 6}
                    >
                      Login as Customer
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Demo OTP: 123456
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;