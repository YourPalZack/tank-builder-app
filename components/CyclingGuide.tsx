'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { Card } from '@/components/ui/Card';
import { Clock, CheckCircle2 } from 'lucide-react';

export function CyclingGuide() {
  const { tank, fish } = useBuildStore();

  if (!tank) return null;

  // Identify hardy fish for "First Batch"
  const hardyFish = fish.filter(f => f.item.careLevel === 'beginner' && f.item.temperament === 'peaceful');
  const sensitiveFish = fish.filter(f => f.item.careLevel === 'expert' || f.item.careLevel === 'intermediate');

  const steps = [
    {
      week: 'Week 0-2',
      title: 'Setup & Nitrogen Cycle',
      desc: 'Install equipment, add substrate/plants. Add ammonia source to start cycling. Test water daily.',
      color: 'bg-slate-200 border-slate-300'
    },
    {
      week: 'Week 3',
      title: 'First Inhabitants',
      desc: hardyFish.length > 0 
        ? `Add hardy species: ${hardyFish.slice(0, 2).map(f => f.item.commonName).join(', ')}...`
        : 'Add a small group of hardy starter fish (e.g., Danios or Rasboras).',
      color: 'bg-blue-100 border-blue-200'
    },
    {
      week: 'Week 4-5',
      title: 'Stabilization',
      desc: 'Monitor ammonia/nitrite. Perform weekly water changes. Ensure plants are rooting.',
      color: 'bg-teal-100 border-teal-200'
    },
    {
      week: 'Week 6+',
      title: 'Complete Stocking',
      desc: sensitiveFish.length > 0
        ? `Slowly add remaining fish: ${sensitiveFish.slice(0, 2).map(f => f.item.commonName).join(', ')}...`
        : 'Slowly add the rest of your planned stock over several weeks.',
      color: 'bg-green-100 border-green-200'
    }
  ];

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-heading font-semibold text-slate-800 flex items-center gap-2">
        <Clock className="w-4 h-4 text-teal-600" /> Cycling Planner
      </h3>

      <div className="relative pl-4 border-l-2 border-slate-200 space-y-6 my-2">
        {steps.map((step, idx) => (
            <div key={idx} className="relative">
                {/* Dot */}
                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-slate-400' : 'bg-teal-500'}`} />
                
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{step.week}</span>
                    <span className="font-bold text-slate-800">{step.title}</span>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {step.desc}
                    </p>
                </div>
            </div>
        ))}
      </div>
      
      <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 flex gap-2 items-start">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Always test water parameters (Ammonia: 0, Nitrite: 0, Nitrate: <20ppm) before adding new fish.</span>
      </div>
    </Card>
  );
}
