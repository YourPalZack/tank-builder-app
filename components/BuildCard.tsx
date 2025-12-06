'use client';

import { AquariumBuild } from '@/types';
import { Card } from '@/components/ui/Card';
import { Trash2, Edit, Copy } from 'lucide-react';

interface BuildCardProps {
  build: AquariumBuild;
  onEdit: (build: AquariumBuild) => void;
  onDelete: (id: string) => void;
  onClone: (build: AquariumBuild) => void;
}

export function BuildCard({ build, onEdit, onDelete, onClone }: BuildCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4 hover:shadow-md transition-shadow group">
      <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center text-slate-400 relative overflow-hidden">
        {/* Placeholder for tank image */}
        {build.tank ? (
            <div className="text-center z-10">
                <div className="font-bold text-slate-700">{build.tank.volumeGallons}g</div>
                <div className="text-xs text-slate-500">{build.tank.shape}</div>
            </div>
        ) : (
            <span>No Tank</span>
        )}
        
        {/* Simple visual representation of stocking */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
            <div 
                className={`h-full ${build.stockingLevel > 100 ? 'bg-red-500' : build.stockingLevel > 85 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                style={{ width: `${Math.min(build.stockingLevel, 100)}%` }}
            />
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-lg truncate text-slate-800" title={build.name}>{build.name}</h3>
        <div className="text-sm text-slate-500 flex justify-between mt-1">
            <span>{build.fish.length} Species</span>
            <span className="font-mono">${build.totalCost.toFixed(0)}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(build)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm transition-colors">
            <Edit className="w-3 h-3" /> Edit
        </button>
        <button onClick={() => onClone(build)} className="p-2 text-slate-500 hover:bg-slate-100 rounded transition-colors" title="Clone">
            <Copy className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(build.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
