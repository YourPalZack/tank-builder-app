'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { Card } from '@/components/ui/Card';
import { Droplets, Scissors, Wrench, Calendar } from 'lucide-react';

export function MaintenanceWidget() {
  const { stockingLevel, plants, equipment, tank } = useBuildStore();

  if (!tank) return null;

  // Calculate Water Change Schedule
  let waterChangeText = '10% Weekly';
  let waterChangeColor = 'text-green-600';
  
  if (stockingLevel > 110) {
    waterChangeText = '50% Twice Weekly (Overstocked)';
    waterChangeColor = 'text-red-600';
  } else if (stockingLevel > 90) {
    waterChangeText = '30-40% Weekly';
    waterChangeColor = 'text-orange-600';
  } else if (stockingLevel > 70) {
    waterChangeText = '25% Weekly';
    waterChangeColor = 'text-yellow-600';
  } else if (stockingLevel > 40) {
    waterChangeText = '20% Weekly';
    waterChangeColor = 'text-teal-600';
  }

  // Calculate Plant Care
  const hasPlants = plants.length > 0;
  const highTech = equipment.co2 !== null || equipment.light?.category === 'Light'; // Simplified check
  
  const plantCare = hasPlants 
    ? highTech 
        ? 'Trim & Fertilize Weekly' 
        : 'Trim & Fertilize Bi-Weekly'
    : 'Algae Scrub Bi-Weekly';

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-heading font-semibold text-slate-800 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-teal-600" /> Maintenance Schedule
      </h3>
      
      <div className="space-y-3">
        {/* Water Change */}
        <div className="flex items-start gap-3 p-2 rounded-lg bg-blue-50/50">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
                <Droplets className="w-4 h-4" />
            </div>
            <div>
                <div className="text-sm font-medium text-slate-700">Water Change</div>
                <div className={`text-sm font-bold ${waterChangeColor}`}>{waterChangeText}</div>
                <div className="text-xs text-slate-500 mt-1">
                    Based on {stockingLevel.toFixed(0)}% stocking level.
                </div>
            </div>
        </div>

        {/* Filter Maintenance */}
        <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-50">
            <div className="p-2 bg-slate-200 rounded-full text-slate-600 mt-1">
                <Wrench className="w-4 h-4" />
            </div>
            <div>
                <div className="text-sm font-medium text-slate-700">Filter Maintenance</div>
                <div className="text-sm font-bold text-slate-800">Rinse Media Monthly</div>
                <div className="text-xs text-slate-500 mt-1">
                    Never use tap water to clean filter media.
                </div>
            </div>
        </div>

        {/* Plant/General Care */}
        <div className="flex items-start gap-3 p-2 rounded-lg bg-green-50/50">
            <div className="p-2 bg-green-100 rounded-full text-green-600 mt-1">
                <Scissors className="w-4 h-4" />
            </div>
            <div>
                <div className="text-sm font-medium text-slate-700">{hasPlants ? 'Plant Care' : 'General Care'}</div>
                <div className="text-sm font-bold text-slate-800">{plantCare}</div>
                {equipment.co2 && (
                    <div className="text-xs text-slate-500 mt-1">Check CO2 drop checker daily.</div>
                )}
            </div>
        </div>
      </div>
    </Card>
  );
}
