'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { Card } from '@/components/ui/Card';
import { CompatibilityBadge } from '@/components/ui/CompatibilityBadge';
import CompatibilityWidget from '@/components/CompatibilityWidget';
import { SelectedPartsList } from '@/components/SelectedPartsList';
import { WaterParameterVisualizer } from '@/components/WaterParameterVisualizer';
import { StockingVisualizer } from '@/components/StockingVisualizer';

export function BuildDashboard() {
  const build = useBuildStore();
  const { tank, warnings, totalCost } = build;

  const status = warnings.some(w => w.severity === 'error') ? 'error' :
                 warnings.some(w => w.severity === 'warning') ? 'warning' : 'ok';

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Top Section: Tank & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tank Preview */}
          <Card className="min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            {tank ? (
              <>
                <div className="text-center z-10">
                  <h2 className="text-2xl font-bold font-outfit text-slate-900">{tank.name}</h2>
                  <p className="text-slate-500">{tank.dimensions.length}&quot; x {tank.dimensions.width}&quot; x {tank.dimensions.height}&quot; • {tank.volumeGallons} Gallons</p>
                </div>
                {/* Placeholder for Tank Image */}
                <div className="mt-8 w-3/4 h-48 border-2 border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center">
                   <span className="text-slate-400">Tank Visualization</span>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-400">
                <p className="text-lg">No Tank Selected</p>
                <button className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                  Select a Tank
                </button>
              </div>
            )}
            
            {/* Compatibility Badge */}
            <div className="absolute top-4 right-4">
               <CompatibilityBadge status={status} />
            </div>
          </Card>

          {/* Selected Parts List */}
          <SelectedPartsList />
        </div>

        {/* Right Column: Compatibility & Stats */}
        <div className="space-y-6">
            <CompatibilityWidget />
            <WaterParameterVisualizer />
            <StockingVisualizer />
            
            <Card className="p-4 space-y-4">
                <h3 className="font-heading font-semibold text-slate-800">Build Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                    <span className="text-slate-500">Fish</span>
                    <span className="text-slate-900 font-medium">{build.fish.reduce((acc, f) => acc + f.quantity, 0)} ({build.fish.length} species)</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-slate-500">Plants</span>
                    <span className="text-slate-900 font-medium">{build.plants.reduce((acc, p) => acc + p.quantity, 0)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Est. Cost</span>
                    <span className="font-mono text-xl text-teal-700 font-bold">${totalCost.toFixed(2)}</span>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
