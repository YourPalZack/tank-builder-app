'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { Card } from '@/components/ui/Card';
import { Fish as FishIcon, Info } from 'lucide-react';
import { useMemo } from 'react';

interface VisualizerProps {
  className?: string;
}

interface VisualItem {
  id: string;
  type: 'fish' | 'invert';
  name: string;
  level: 'top' | 'middle' | 'bottom' | 'all';
  color: string;
  size: number; // relative size
  territory: number; // radius in inches
  x: number; // 0-100%
  y: number; // 0-100%
}

export function StockingVisualizer({ className }: VisualizerProps) {
  const { tank, fish, inverts } = useBuildStore();

  // Generate visual items with stable positions
  const visualItems = useMemo(() => {
    const items: VisualItem[] = [];
    let seed = 1;
    
    // Simple pseudo-random generator for stable positions
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const getYPos = (level: string) => {
      const r = random();
      switch (level) {
        case 'top': return 5 + (r * 20); // 5-25%
        case 'middle': return 30 + (r * 40); // 30-70%
        case 'bottom': return 75 + (r * 20); // 75-95%
        default: return 5 + (r * 90); // 5-95%
      }
    };

    fish.forEach(f => {
      // Limit visual count for large schools to avoid clutter (max 10 per species)
      const visualCount = Math.min(f.quantity, 10);
      
      for (let i = 0; i < visualCount; i++) {
        items.push({
          id: `${f.item.id}-${i}`,
          type: 'fish',
          name: f.item.commonName,
          level: f.item.swimmingLevel,
          color: 'text-teal-600',
          size: Math.max(0.8, Math.min(2, f.item.adultSizeInches / 2)), // Scale size slightly
          territory: f.item.territorialRadius,
          x: 5 + (random() * 90), // 5-95% width
          y: getYPos(f.item.swimmingLevel)
        });
      }
    });

    inverts.forEach(inv => {
      const visualCount = Math.min(inv.quantity, 5);
      for (let i = 0; i < visualCount; i++) {
        items.push({
          id: `${inv.item.id}-${i}`,
          type: 'invert',
          name: inv.item.commonName,
          level: 'bottom', // Most inverts are bottom dwellers
          color: 'text-orange-500',
          size: 0.8,
          territory: 0,
          x: 5 + (random() * 90),
          y: 85 + (random() * 10) // Very bottom
        });
      }
    });

    return items;
  }, [fish, inverts]);

  if (!tank) {
    return (
      <Card className={`p-6 flex flex-col items-center justify-center min-h-[300px] bg-slate-50 ${className}`}>
        <p className="text-slate-400">Select a tank to view stocking visualization</p>
      </Card>
    );
  }

  // Calculate aspect ratio for the tank view
  // Default to 16:9 if dimensions missing, otherwise use tank dims
  const aspectRatio = tank.dimensions.length / tank.dimensions.height;
  
  // Scale factor for territory circles (approximate pixels per inch)
  // We'll assume the container width represents the tank length
  // This is dynamic in CSS, so we use percentages for positions, but territory needs to be relative to width
  const getTerritoryStyle = (radiusInches: number) => {
    if (!radiusInches) return {};
    // radius in % of width = (radius / length) * 100
    const radiusPercent = (radiusInches / tank.dimensions.length) * 100;
    return {
      width: `${radiusPercent * 2}%`, // Diameter
      height: `${radiusPercent * 2 * aspectRatio}%`, // Correct for aspect ratio to keep circle circular-ish
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <Card className={`p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-semibold text-slate-800">Stocking Visualization</h3>
          <div className="group relative">
            <Info className="w-4 h-4 text-slate-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Side view of your tank. Fish are placed at their preferred swimming levels. Circles indicate territorial zones.
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {tank.dimensions.length}&quot;L x {tank.dimensions.height}&quot;H
        </div>
      </div>

      {/* Tank Container */}
      <div className="w-full relative bg-blue-50/50 border-2 border-blue-200 rounded-lg overflow-hidden" style={{ aspectRatio: `${aspectRatio}` }}>
        {/* Water Surface */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-blue-100/50 border-b border-blue-200/30" />
        
        {/* Substrate */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-amber-100/50 border-t border-amber-200/30" />

        {/* Fish & Inverts */}
        {visualItems.map((item) => (
          <div
            key={item.id}
            className="absolute flex items-center justify-center transition-all duration-500"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.size * 20}px`, // Base size multiplier
              height: `${item.size * 20}px`,
              transform: 'translate(-50%, -50%)'
            }}
            title={item.name}
          >
            {/* Territory Zone */}
            {item.territory > 0 && (
              <div 
                className="absolute rounded-full border border-red-400/30 bg-red-400/10 pointer-events-none"
                style={getTerritoryStyle(item.territory)}
              />
            )}
            
            {/* Icon */}
            <FishIcon 
              className={`w-full h-full ${item.color} drop-shadow-sm`} 
              strokeWidth={2}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-xs text-slate-500 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-teal-600" /> Fish
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" /> Invertebrates
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full border border-red-400 bg-red-100" /> Territory
        </div>
      </div>
    </Card>
  );
}
