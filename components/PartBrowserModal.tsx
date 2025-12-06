'use client';

import { useUIStore } from '@/store/useUIStore';
import { useBuildStore } from '@/store/useBuildStore';
import { 
  sampleTanks, 
  sampleFish, 
  samplePlants, 
  sampleInvertebrates, 
  sampleEquipment, 
  sampleSubstrate 
} from '@/data/sampleData';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tank, Fish, Plant, Invertebrate, Equipment, Substrate } from '@/types';

export function PartBrowserModal() {
  const { isModalOpen, activeCategory, closeModal } = useUIStore();
  const { setTank, addFish, addPlant, addInvert, setEquipment, setSubstrate } = useBuildStore();

  if (!isModalOpen) return null;

  let items: (Tank | Fish | Plant | Invertebrate | Equipment | Substrate)[] = [];
  let title = '';

  switch (activeCategory) {
    case 'tank':
      items = sampleTanks;
      title = 'Select a Tank';
      break;
    case 'fish':
      items = sampleFish;
      title = 'Add Fish';
      break;
    case 'inverts':
      items = sampleInvertebrates;
      title = 'Add Invertebrates';
      break;
    case 'plants':
      items = samplePlants;
      title = 'Add Plants';
      break;
    case 'filter':
      items = sampleEquipment.filter(e => e.category === 'Filter');
      title = 'Select Filtration';
      break;
    case 'heater':
      items = sampleEquipment.filter(e => e.category === 'Heater');
      title = 'Select Heater';
      break;
    case 'light':
      items = sampleEquipment.filter(e => e.category === 'Light');
      title = 'Select Lighting';
      break;
    case 'co2':
      items = sampleEquipment.filter(e => e.category === 'CO2' || e.category === 'AirPump');
      title = 'Select CO2 & Air';
      break;
    case 'substrate':
      items = sampleSubstrate;
      title = 'Select Substrate';
      break;
    case 'other':
      items = sampleEquipment.filter(e => e.category === 'Other');
      title = 'Select Other Equipment';
      break;
    default:
      items = [];
      title = 'Select Parts';
  }

  const handleAdd = (item: any) => {
    switch (activeCategory) {
      case 'tank':
        setTank(item as Tank);
        closeModal();
        break;
      case 'fish':
        addFish(item as Fish, 1);
        break;
      case 'inverts':
        addInvert(item as Invertebrate, 1);
        break;
      case 'plants':
        addPlant(item as Plant, 1);
        break;
      case 'filter':
      case 'heater':
      case 'light':
      case 'co2':
      case 'other':
        setEquipment(item.category, item as Equipment);
        closeModal(); // Usually only one of each equipment type per slot, so close modal
        break;
      case 'substrate':
        setSubstrate(item as Substrate);
        closeModal();
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold font-outfit text-slate-900">{title}</h2>
          <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const anyItem = item as any;
              return (
              <Card key={item.id} className="flex flex-col gap-3 hover:border-teal-500 transition-colors cursor-pointer group bg-white shadow-sm hover:shadow-md">
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-100">
                   {/* Placeholder Image */}
                   <span className="text-slate-400 text-sm font-medium">{anyItem.name || anyItem.commonName}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-teal-700 transition-colors">
                    {anyItem.name || anyItem.commonName}
                  </h3>
                  {anyItem.scientificName && <p className="text-xs text-slate-500 italic">{anyItem.scientificName}</p>}
                  
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                    {anyItem.volumeGallons && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{anyItem.volumeGallons} gal</span>}
                    {anyItem.adultSizeInches && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{anyItem.adultSizeInches}&quot;</span>}
                    {anyItem.temperament && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 capitalize">{anyItem.temperament}</span>}
                    {anyItem.watts && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{anyItem.watts}W</span>}
                    {anyItem.flowRateGPH && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{anyItem.flowRateGPH} GPH</span>}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-teal-700 font-bold">${item.price}</span>
                    <button 
                      onClick={() => handleAdd(item)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm transition-colors shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </Card>
            );
            })}
            {items.length === 0 && (
              <div className="col-span-full text-center text-slate-400 py-12">
                No items found in this category yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
