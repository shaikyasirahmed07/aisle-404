import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Calendar,
  QrCode,
  BarChart3,
  Plus,
  Search,
  Download,
  Gift
} from 'lucide-react';
import { mockProducts, mockAnalytics, mockComboOffers } from '@/data/mockData';
import InventoryManagement from '@/components/admin/InventoryManagement';
import QRCodeGeneration from '@/components/admin/QRCodeGeneration';
import OfferSetup from '@/components/admin/OfferSetup';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    {
      title: "Total Products",
      value: mockAnalytics.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary-light"
    },
    {
      title: "Low Stock Alerts",
      value: mockAnalytics.lowStockAlerts,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning-light"
    },
    {
      title: "Slow Moving Stock",
      value: mockAnalytics.slowMovingStock,
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-red-100"
    },
    {
      title: "Upcoming Batches",
      value: mockAnalytics.upcomingBatches,
      icon: Calendar,
      color: "text-success",
      bgColor: "bg-success-light"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <QrCode className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">QR Retail Admin</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your store performance and manage inventory</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-retail hover-lift animate-fade-in" 
                  style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="qrcodes" className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>QR Codes</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>Offers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="qrcodes" className="space-y-6">
            <QRCodeGeneration />
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <OfferSetup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;