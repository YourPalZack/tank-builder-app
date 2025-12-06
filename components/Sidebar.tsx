'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { 
  Box, Fish, Shell, Sprout, Filter, Thermometer, Lightbulb, 
  Wind, Layers, Wrench 
} from 'lucide-react';

const categories = [
  { id: 'tank', label: 'Tank', icon: Box },
  { id: 'fish', label: 'Fish', icon: Fish },
  { id: 'inverts', label: 'Invertebrates', icon: Shell },
  { id: 'plants', label: 'Plants', icon: Sprout },
  { id: 'filter', label: 'Filtration', icon: Filter },
  { id: 'heater', label: 'Heating', icon: Thermometer },
  { id: 'light', label: 'Lighting', icon: Lightbulb },
  { id: 'co2', label: 'CO2 & Air', icon: Wind },
  { id: 'substrate', label: 'Substrate', icon: Layers },
  { id: 'other', label: 'Other', icon: Wrench },
];

export function Sidebar() {
  const build = useBuildStore();
  const { openModal } = useUIStore();

  const getCount = (id: string) => {
    switch (id) {
      case 'tank': return build.tank ? 1 : 0;
      case 'fish': return build.fish.length;
      case 'inverts': return build.inverts.length;
      case 'plants': return build.plants.length;
      case 'filter': return build.equipment.filter ? 1 : 0;
      case 'heater': return build.equipment.heater ? 1 : 0;
      case 'light': return build.equipment.light ? 1 : 0;
      case 'co2': return (build.equipment.co2 ? 1 : 0) + (build.equipment.airPump ? 1 : 0);
      case 'substrate': return build.substrate ? 1 : 0;
      case 'other': return build.equipment.other.length;
      default: return 0;
    }
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white hidden md:block h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
      <div className="p-4 space-y-2">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Build Components
        </h2>
        {categories.map((cat) => {
          const count = getCount(cat.id);
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => openModal(cat.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left group",
                "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-teal-600/70 group-hover:text-teal-600" />
                <span className="font-medium">{cat.label}</span>
              </div>
              {count > 0 && (
                <span className="bg-teal-100 text-teal-700 text-xs py-0.5 px-2 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
