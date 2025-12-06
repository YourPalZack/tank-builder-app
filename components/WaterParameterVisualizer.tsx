'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { Card } from '@/components/ui/Card';
import { Info } from 'lucide-react';

type ParameterType = 'temp' | 'ph' | 'hardness';

interface VisualizerProps {
  className?: string;
}

const CONFIG = {
  temp: { min: 60, max: 90, label: 'Temperature', unit: '°F' },
  ph: { min: 5.0, max: 9.0, label: 'pH Level', unit: '' },
  hardness: { min: 0, max: 30, label: 'Hardness', unit: ' dGH' },
};

export function WaterParameterVisualizer({ className }: VisualizerProps) {
  const { fish, inverts, plants, targetParams } = useBuildStore();

  // Helper to calculate percentage position
  const getPercent = (value: number, type: ParameterType) => {
    const { min, max } = CONFIG[type];
    const clamped = Math.max(min, Math.min(max, value));
    return ((clamped - min) / (max - min)) * 100;
  };

  // Helper to calculate width percentage
  const getWidth = (min: number, max: number, type: ParameterType) => {
    const start = getPercent(min, type);
    const end = getPercent(max, type);
    return Math.max(end - start, 1); // Min 1% width
  };

  const renderBar = (type: ParameterType) => {
    const config = CONFIG[type];
    const target = targetParams ? targetParams[type] : null;
    
    // Collect all individual ranges
    const items = [
      ...fish.map(f => ({ name: f.item.commonName, range: type === 'temp' ? { min: f.item.waterParams.tempMin, max: f.item.waterParams.tempMax } : type === 'ph' ? { min: f.item.waterParams.phMin, max: f.item.waterParams.phMax } : { min: f.item.waterParams.hardnessMin, max: f.item.waterParams.hardnessMax } })),
      ...inverts.map(i => ({ name: i.item.commonName, range: type === 'temp' ? { min: i.item.waterParams.tempMin, max: i.item.waterParams.tempMax } : type === 'ph' ? { min: i.item.waterParams.phMin, max: i.item.waterParams.phMax } : { min: i.item.waterParams.hardnessMin, max: i.item.waterParams.hardnessMax } })),
      ...plants.map(p => ({ name: p.item.commonName, range: type === 'temp' ? { min: p.item.waterParams.tempMin, max: p.item.waterParams.tempMax } : type === 'ph' ? { min: p.item.waterParams.phMin, max: p.item.waterParams.phMax } : { min: 0, max: 30 } })) // Plants often don't have strict hardness in our model, defaulting
    ];

    // Filter out items that don't have valid ranges for this param (e.g. plants might not have hardness)
    const validItems = items.filter(i => i.range.min !== undefined && i.range.max !== undefined);

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-700">{config.label}</span>
          <span className="text-slate-500 text-xs">
            {target && target[1] > 0 ? `Target: ${target[0]}-${target[1]}${config.unit}` : 'No Overlap'}
          </span>
        </div>

        <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          {/* Background Grid/Ticks could go here */}
          
          {/* Individual Species Ranges (faint) */}
          {validItems.map((item, idx) => (
            <div
              key={idx}
              className="absolute top-0 bottom-0 bg-slate-300/30 border-l border-r border-slate-400/30"
              style={{
                left: `${getPercent(item.range.min, type)}%`,
                width: `${getWidth(item.range.min, item.range.max, type)}%`,
              }}
              title={`${item.name}: ${item.range.min}-${item.range.max}${config.unit}`}
            />
          ))}

          {/* Target Overlap (Green) */}
          {target && target[1] > 0 && (
            <div
              className="absolute top-0 bottom-0 bg-teal-500/80 border-l border-r border-teal-600 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
              style={{
                left: `${getPercent(target[0], type)}%`,
                width: `${getWidth(target[0], target[1], type)}%`,
              }}
            />
          )}
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>{config.min}{config.unit}</span>
          <span>{config.max}{config.unit}</span>
        </div>
      </div>
    );
  };

  if (fish.length === 0 && inverts.length === 0 && plants.length === 0) {
    return null;
  }

  return (
    <Card className={`p-6 space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-heading font-semibold text-slate-800">Water Parameters</h3>
        <div className="group relative">
            <Info className="w-4 h-4 text-slate-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                The green bar shows the safe overlap range where all your selected species can thrive together.
            </div>
        </div>
      </div>

      <div className="space-y-6">
        {renderBar('temp')}
        {renderBar('ph')}
        {renderBar('hardness')}
      </div>
    </Card>
  );
}
