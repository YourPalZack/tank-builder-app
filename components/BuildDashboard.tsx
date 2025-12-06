'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { Card } from '@/components/ui/Card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function BuildDashboard() {
  const build = useBuildStore();
  const { tank, stockingLevel, warnings, totalCost } = build;

  const status = warnings.some(w => w.severity === 'error') ? 'error' :
                 warnings.some(w => w.severity === 'warning') ? 'warning' : 'ok';

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Top Section: Tank & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tank Preview */}
        <Card className="lg:col-span-2 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
          {tank ? (
            <>
              <div className="text-center z-10">
                <h2 className="text-2xl font-bold font-outfit">{tank.name}</h2>
                <p className="text-gray-400">{tank.dimensions.length}&quot; x {tank.dimensions.width}&quot; x {tank.dimensions.height}&quot; • {tank.volumeGallons} Gallons</p>
              </div>
              {/* Placeholder for Tank Image */}
              <div className="mt-8 w-3/4 h-48 border-2 border-white/20 rounded-lg bg-white/5 flex items-center justify-center">
                 <span className="text-white/30">Tank Visualization</span>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-lg">No Tank Selected</p>
              <button className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
                Select a Tank
              </button>
            </div>
          )}
          
          {/* Compatibility Badge */}
          <div className="absolute top-4 right-4">
            {status === 'ok' && <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30"><CheckCircle className="w-4 h-4" /> Compatible</div>}
            {status === 'warning' && <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/30"><AlertTriangle className="w-4 h-4" /> Warnings</div>}
            {status === 'error' && <div className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30"><XCircle className="w-4 h-4" /> Incompatible</div>}
          </div>
        </Card>

        {/* Stats Panel */}
        <Card className="space-y-6">
          <h3 className="text-lg font-semibold font-outfit border-b border-white/10 pb-2">Build Summary</h3>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Stocking Level</span>
              <span className={stockingLevel > 100 ? "text-red-400" : stockingLevel > 85 ? "text-yellow-400" : "text-green-400"}>
                {stockingLevel}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${stockingLevel > 100 ? "bg-red-500" : stockingLevel > 85 ? "bg-yellow-500" : "bg-teal-500"}`}
                style={{ width: `${Math.min(stockingLevel, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Fish</span>
              <span>{build.fish.reduce((acc, f) => acc + f.quantity, 0)} ({build.fish.length} species)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Plants</span>
              <span>{build.plants.reduce((acc, p) => acc + p.quantity, 0)}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-gray-400">Est. Cost</span>
              <span className="font-mono text-teal-300">${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <h3 className="text-lg font-semibold font-outfit mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" /> Compatibility Report
          </h3>
          <div className="space-y-3">
            {warnings.map((issue, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                {issue.severity === 'error' ? <XCircle className="w-5 h-5 text-red-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />}
                <div>
                  <h4 className={`font-medium ${issue.severity === 'error' ? 'text-red-300' : 'text-yellow-300'}`}>{issue.title}</h4>
                  <p className="text-sm text-gray-400">{issue.description}</p>
                  {issue.suggestion && <p className="text-sm text-teal-400/80 mt-1">💡 {issue.suggestion}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
