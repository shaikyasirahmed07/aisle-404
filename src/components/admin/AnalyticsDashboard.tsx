import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Eye,
  MapPin,
  Percent,
  Users
} from 'lucide-react';
import { mockAnalytics } from '@/data/mockData';

const AnalyticsDashboard = () => {
  const analytics = mockAnalytics;

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon,
    description 
  }: {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon: React.ElementType;
    description?: string;
  }) => (
    <Card className="card-retail hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className={`flex items-center space-x-1 text-sm ${
                changeType === 'positive' ? 'text-success' : 'text-destructive'
              }`}>
                {changeType === 'positive' ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span>{change}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary-light">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground">Analytics Dashboard</h3>
        <p className="text-muted-foreground">Track performance and gain insights into your store operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Virtual vs Real Cart"
          value={`${analytics.virtualVsRealCart.abandonmentRate}%`}
          change="+2.3% from last month"
          changeType="negative"
          icon={ShoppingCart}
          description="Cart abandonment rate"
        />
        <MetricCard
          title="Total Scans Today"
          value="1,247"
          change="+15.3% from yesterday"
          changeType="positive"
          icon={Eye}
        />
        <MetricCard
          title="Conversion Rate"
          value="78.2%"
          change="+4.1% from last week"
          changeType="positive"
          icon={Percent}
        />
        <MetricCard
          title="Active Customers"
          value="342"
          change="+23 from yesterday"
          changeType="positive"
          icon={Users}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aisle Traffic */}
        <Card className="card-retail">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Aisle Traffic</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.aisleTraffic.map((aisle, index) => (
              <div key={aisle.aisle} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Aisle {aisle.aisle}</span>
                  <span className="text-sm text-muted-foreground">{aisle.scans} scans</span>
                </div>
                <Progress 
                  value={(aisle.scans / Math.max(...analytics.aisleTraffic.map(a => a.scans))) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Scanned Products */}
        <Card className="card-retail">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Top Scanned Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topScannedProducts.map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-medium">{product.productId}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{product.scans}</div>
                  <div className="text-xs text-muted-foreground">scans</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Virtual vs Real Cart Analysis */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Virtual vs Real Cart Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">
                {analytics.virtualVsRealCart.virtualItems.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Items added to virtual cart</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-success">
                {analytics.virtualVsRealCart.purchasedItems.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Items actually purchased</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-warning">
                {(analytics.virtualVsRealCart.virtualItems - analytics.virtualVsRealCart.purchasedItems).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Items abandoned</div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Conversion Rate</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((analytics.virtualVsRealCart.purchasedItems / analytics.virtualVsRealCart.virtualItems) * 100)}%
              </span>
            </div>
            <Progress 
              value={(analytics.virtualVsRealCart.purchasedItems / analytics.virtualVsRealCart.virtualItems) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Combo Performance */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Combo Offer Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.comboPerformance.map((combo, index) => (
              <div key={combo.comboId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <div>
                    <div className="font-medium">{combo.comboId}</div>
                    <div className="text-sm text-muted-foreground">Combo offer</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">{combo.sales}</div>
                  <div className="text-sm text-muted-foreground">sales</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="card-retail bg-primary-light border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Actionable Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-success mt-1" />
            <div>
              <p className="font-medium text-foreground">High Traffic Areas</p>
              <p className="text-sm text-muted-foreground">
                Aisles 2A and 5B have highest traffic. Consider placing promotional items here.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingDown className="w-5 h-5 text-warning mt-1" />
            <div>
              <p className="font-medium text-foreground">Cart Abandonment</p>
              <p className="text-sm text-muted-foreground">
                20% cart abandonment rate suggests need for better checkout experience or pricing strategy.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <BarChart3 className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium text-foreground">Combo Opportunities</p>
              <p className="text-sm text-muted-foreground">
                Products P001 and P003 are frequently scanned together. Create a combo offer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;