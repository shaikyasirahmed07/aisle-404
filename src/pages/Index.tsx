import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, ShoppingCart, BarChart3 } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
          <QrCode className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Aisle404 QR Retail System
        </h1>
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Intelligent QR-based inventory management and customer experience platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <Link to="/admin-login">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <BarChart3 className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2 text-xl">Store Manager</h3>
              <p className="text-white/80 text-sm mb-4">Access admin dashboard, manage inventory, and generate QR codes</p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                Admin Login
              </Button>
            </div>
          </Link>

          <Link to="/customer">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <ShoppingCart className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2 text-xl">Customer</h3>
              <p className="text-white/80 text-sm mb-4">Scan QR codes, view products, and manage virtual cart</p>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                Start Shopping
              </Button>
            </div>
          </Link>
        </div>

        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default Index;