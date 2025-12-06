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
            {status === 'ok' && <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200"><CheckCircle className="w-4 h-4" /> Compatible</div>}
            {status === 'warning' && <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200"><AlertTriangle className="w-4 h-4" /> Warnings</div>}
            {status === 'error' && <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200"><XCircle className="w-4 h-4" /> Incompatible</div>}
          </div>
        </Card>

        {/* Stats Panel */}
        <Card className="space-y-6 p-6">
          <h3 className="text-lg font-semibold font-outfit border-b border-slate-100 pb-2 text-slate-900">Build Summary</h3>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Stocking Level</span>
              <span className={stockingLevel > 100 ? "text-red-600 font-bold" : stockingLevel > 85 ? "text-yellow-600 font-bold" : "text-green-600 font-bold"}>
                {stockingLevel}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${stockingLevel > 100 ? "bg-red-500" : stockingLevel > 85 ? "bg-yellow-500" : "bg-teal-500"}`}
                style={{ width: `${Math.min(stockingLevel, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Fish</span>
              <span className="text-slate-900 font-medium">{build.fish.reduce((acc, f) => acc + f.quantity, 0)} ({build.fish.length} species)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Plants</span>
              <span className="text-slate-900 font-medium">{build.plants.reduce((acc, p) => acc + p.quantity, 0)}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-slate-500">Est. Cost</span>
              <span className="font-mono text-teal-700 font-bold">${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500 p-6">
          <h3 className="text-lg font-semibold font-outfit mb-4 flex items-center gap-2 text-slate-900">
            <AlertTriangle className="text-yellow-500" /> Compatibility Report
          </h3>
          <div className="space-y-3">
            {warnings.map((issue, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                {issue.severity === 'error' ? <XCircle className="w-5 h-5 text-red-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />}
                <div>
                  <h4 className={`font-medium ${issue.severity === 'error' ? 'text-red-700' : 'text-yellow-700'}`}>{issue.title}</h4>
                  <p className="text-sm text-slate-600">{issue.description}</p>
                  {issue.suggestion && <p className="text-sm text-teal-600 mt-1">💡 {issue.suggestion}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
