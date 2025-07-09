import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Zap,
  ShoppingCart,
  DoorOpen,
  Info
} from 'lucide-react';
import { storeMap } from '@/data/mockData';

const StoreMap = () => {
  const [selectedAisle, setSelectedAisle] = useState<string | null>(null);
  const [searchAisle, setSearchAisle] = useState('');

  const filteredAisles = storeMap.aisles.filter(aisle =>
    aisle.name.toLowerCase().includes(searchAisle.toLowerCase()) ||
    aisle.id.toLowerCase().includes(searchAisle.toLowerCase())
  );

  const handleAisleClick = (aisleId: string) => {
    setSelectedAisle(aisleId === selectedAisle ? null : aisleId);
  };

  const getAislePosition = (x: number, y: number) => ({
    left: `${x}%`,
    top: `${y}%`
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Store Map & Navigation</h3>
        <p className="text-muted-foreground">Find your way around the store with our interactive map</p>
      </div>

      {/* Search Aisle */}
      <Card className="card-retail">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for aisle or product category..."
              value={searchAisle}
              onChange={(e) => setSearchAisle(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Interactive Store Map */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Interactive Store Layout</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-slate-100 rounded-lg p-4 aspect-[4/3] overflow-hidden">
            {/* Store Layout */}
            <div className="relative w-full h-full border-2 border-slate-300 rounded">
              {/* Entrance */}
              <div 
                className="absolute flex items-center justify-center bg-green-500 text-white rounded p-2 transform -translate-x-1/2 -translate-y-1/2"
                style={getAislePosition(storeMap.layout.entrance.x, storeMap.layout.entrance.y)}
              >
                <DoorOpen className="w-4 h-4 mr-1" />
                <span className="text-xs font-bold">Entrance</span>
              </div>

              {/* Checkout */}
              <div 
                className="absolute flex items-center justify-center bg-blue-500 text-white rounded p-2 transform -translate-x-1/2 -translate-y-1/2"
                style={getAislePosition(storeMap.layout.checkout.x, storeMap.layout.checkout.y)}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                <span className="text-xs font-bold">Checkout</span>
              </div>

              {/* Aisles */}
              {storeMap.aisles.map((aisle) => (
                <div
                  key={aisle.id}
                  className={`absolute cursor-pointer transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                    selectedAisle === aisle.id 
                      ? 'scale-110 z-10' 
                      : 'hover:scale-105'
                  }`}
                  style={getAislePosition(aisle.x, aisle.y)}
                  onClick={() => handleAisleClick(aisle.id)}
                >
                  <div className={`
                    p-3 rounded-lg border-2 text-center min-w-[80px] shadow-md
                    ${selectedAisle === aisle.id 
                      ? 'bg-primary text-primary-foreground border-primary-hover shadow-lg' 
                      : 'bg-white border-slate-300 hover:border-primary hover:shadow-md'
                    }
                  `}>
                    <div className="font-bold text-sm">{aisle.id}</div>
                    <div className="text-xs mt-1 leading-tight">
                      {aisle.name.split('&').map((part, idx) => (
                        <div key={idx}>{part.trim()}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Path lines (decorative) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          {/* Selected Aisle Info */}
          {selectedAisle && (
            <div className="mt-4 p-4 bg-primary-light border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary">
                    Aisle {selectedAisle}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {storeMap.aisles.find(a => a.id === selectedAisle)?.name}
                  </p>
                </div>
                <Button size="sm" className="btn-primary">
                  <Navigation className="w-4 h-4 mr-1" />
                  Navigate Here
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aisle Directory */}
      <Card className="card-retail">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Aisle Directory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAisles.map((aisle) => (
              <Card 
                key={aisle.id} 
                className={`cursor-pointer transition-all duration-200 hover-lift ${
                  selectedAisle === aisle.id ? 'ring-2 ring-primary bg-primary-light' : ''
                }`}
                onClick={() => handleAisleClick(aisle.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="font-bold">
                      {aisle.id}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                  <h4 className="font-medium text-foreground">{aisle.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click to view on map
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AR Navigation Info */}
      <Card className="card-retail bg-secondary-light border-secondary/20">
        <CardHeader>
          <CardTitle className="text-secondary flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>AR Navigation (Coming Soon)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Navigation className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Augmented Reality Directions</p>
              <p className="text-sm text-muted-foreground">
                Use your camera to see overlay directions on the actual store layout
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Real-time Location</p>
              <p className="text-sm text-muted-foreground">
                Get turn-by-turn directions to any product or aisle in the store
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" disabled>
            <Zap className="w-4 h-4 mr-2" />
            Enable AR Navigation (Beta)
          </Button>
        </CardContent>
      </Card>

      {/* Navigation Tips */}
      <Card className="card-retail bg-primary-light border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Navigation Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Store Layout</p>
              <p className="text-sm text-muted-foreground">
                The store is organized in a grid pattern for easy navigation. Use aisle numbers to locate products.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Search className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Quick Search</p>
              <p className="text-sm text-muted-foreground">
                Search for specific aisles or product categories to quickly find what you need.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Product Locations</p>
              <p className="text-sm text-muted-foreground">
                Every scanned product shows its exact aisle location for easy reference.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreMap;