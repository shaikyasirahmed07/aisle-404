import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { QrCode, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [adminCreds, setAdminCreds] = useState({ employeeId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll use a simple check
      // In production, this would authenticate against Supabase
      if (adminCreds.employeeId === 'admin001' && adminCreds.password === 'password123') {
        // Store admin session
        localStorage.setItem('admin-session', JSON.stringify({
          id: 'admin001',
          name: 'Store Manager',
          role: 'admin',
          employeeId: adminCreds.employeeId
        }));
        
        toast({
          title: "Welcome Back!",
          description: "Successfully logged in as Store Manager",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please check your Employee ID and password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Aisle404 Admin
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Intelligent QR-based inventory management system for modern retail
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <ShoppingCart className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Smart Inventory</h3>
              <p className="text-white/80 text-sm">Real-time tracking with QR codes and analytics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Customer Insights</h3>
              <p className="text-white/80 text-sm">Track customer behavior and preferences</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <BarChart3 className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-white/80 text-sm">Data-driven insights for better decisions</p>
            </div>
          </div>
        </div>

        {/* Admin Login Section */}
        <div className="max-w-md mx-auto animate-slide-up">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">Store Manager Login</CardTitle>
              <CardDescription className="text-gray-600">
                Access your admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-gray-700">Employee ID</Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="Enter your employee ID"
                    value={adminCreds.employeeId}
                    onChange={(e) => setAdminCreds({...adminCreds, employeeId: e.target.value})}
                    required
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={adminCreds.password}
                    onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})}
                    required
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In as Manager'}
                </Button>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
                  <p className="text-xs text-gray-600 font-mono">
                    ID: admin001 | Password: password123
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;