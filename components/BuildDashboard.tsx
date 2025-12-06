'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { useSavedBuildsStore } from '@/store/useSavedBuildsStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { CompatibilityBadge } from '@/components/ui/CompatibilityBadge';
import CompatibilityWidget from '@/components/CompatibilityWidget';
import { SelectedPartsList } from '@/components/SelectedPartsList';
import { WaterParameterVisualizer } from '@/components/WaterParameterVisualizer';
import { StockingVisualizer } from '@/components/StockingVisualizer';
import { MaintenanceWidget } from '@/components/MaintenanceWidget';
import { CyclingGuide } from '@/components/CyclingGuide';
import { BuildWizardModal } from '@/components/BuildWizardModal';
import { Save, Edit2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { AquariumBuild } from '@/types';

export function BuildDashboard() {
  const build = useBuildStore();
  const { openModal } = useUIStore();
  const { saveBuild } = useSavedBuildsStore();
  const { tank, warnings, totalCost } = build;
  const [isEditingName, setIsEditingName] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const status = warnings.some(w => w.severity === 'error') ? 'error' :
                 warnings.some(w => w.severity === 'warning') ? 'warning' : 'ok';

  const handleSave = () => {
    const buildData: AquariumBuild = {
        id: build.id,
        name: build.name,
        tank: build.tank,
        fish: build.fish,
        inverts: build.inverts,
        plants: build.plants,
        equipment: build.equipment,
        substrate: build.substrate,
        substrateBags: build.substrateBags,
        totalCost: build.totalCost,
        stockingLevel: build.stockingLevel,
        warnings: build.warnings,
        targetParams: build.targetParams
    };
    saveBuild(buildData);
    alert('Build saved successfully!');
  };

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            {isEditingName ? (
                <input 
                    type="text" 
                    value={build.name} 
                    onChange={(e) => build.setName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                    className="text-2xl font-bold font-outfit text-slate-900 bg-transparent border-b-2 border-teal-500 focus:outline-none"
                    autoFocus
                />
            ) : (
                <h1 className="text-2xl font-bold font-outfit text-slate-900 flex items-center gap-2 cursor-pointer hover:text-teal-700" onClick={() => setIsEditingName(true)}>
                    {build.name} <Edit2 className="w-4 h-4 text-slate-400" />
                </h1>
            )}
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <Save className="w-4 h-4" /> Save Build
        </button>
      </div>

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
                <div className="flex gap-4 justify-center mt-4">
                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                        Select a Tank
                    </button>
                    <button 
                        onClick={() => setIsWizardOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
                    >
                        <Wand2 className="w-4 h-4" /> Build Wizard
                    </button>
                </div>
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
            <MaintenanceWidget />
            <CyclingGuide />
            
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
      
      <BuildWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  );
}
