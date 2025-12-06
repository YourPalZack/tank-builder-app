'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function CompatibilityWidget() {
  const { warnings, stockingLevel, targetParams } = useBuildStore();

  const errorCount = warnings.filter(w => w.severity === 'error').length;
  const warningCount = warnings.filter(w => w.severity === 'warning').length;
  
  const statusColor = errorCount > 0 ? 'text-red-600' : warningCount > 0 ? 'text-yellow-600' : 'text-emerald-600';
  const StatusIcon = errorCount > 0 ? XCircle : warningCount > 0 ? AlertTriangle : CheckCircle;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-slate-800">Compatibility</h3>
        <div className={`flex items-center gap-2 ${statusColor}`}>
          <StatusIcon className="w-5 h-5" />
          <span className="font-medium">
            {errorCount > 0 ? 'Incompatible' : warningCount > 0 ? 'Warnings' : 'Compatible'}
          </span>
        </div>
      </div>

      {/* Stocking Level */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Stocking Level</span>
          <span className={`font-medium ${stockingLevel > 100 ? 'text-red-600' : stockingLevel > 85 ? 'text-yellow-600' : 'text-slate-900'}`}>
            {stockingLevel}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              stockingLevel > 100 ? 'bg-red-500' : stockingLevel > 85 ? 'bg-yellow-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(stockingLevel, 100)}%` }}
          />
        </div>
      </div>

      {/* Issues List */}
      {warnings.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {warnings.map((issue, idx) => (
            <div key={idx} className={`p-3 rounded-lg text-sm border ${
              issue.severity === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
              issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' :
              'bg-blue-50 border-blue-100 text-blue-800'
            }`}>
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{issue.title}</p>
                  <p className="text-xs opacity-90 mt-0.5">{issue.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Target Parameters */}
      {targetParams && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Parameters</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-2 rounded-lg">
              <div className="text-xs text-slate-500">Temp</div>
              <div className="font-medium text-slate-700 text-sm">
                {targetParams.temp[0] === 0 && targetParams.temp[1] === 0 ? '-' : `${targetParams.temp[0]}-${targetParams.temp[1]}°F`}
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <div className="text-xs text-slate-500">pH</div>
              <div className="font-medium text-slate-700 text-sm">
                {targetParams.ph[0] === 0 && targetParams.ph[1] === 0 ? '-' : `${targetParams.ph[0]}-${targetParams.ph[1]}`}
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <div className="text-xs text-slate-500">Hardness</div>
              <div className="font-medium text-slate-700 text-sm">
                {targetParams.hardness[0] === 0 && targetParams.hardness[1] === 0 ? '-' : `${targetParams.hardness[0]}-${targetParams.hardness[1]} dGH`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
