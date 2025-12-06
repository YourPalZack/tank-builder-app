'use client';

import { useUIStore } from '@/store/useUIStore';
import { useBuildStore } from '@/store/useBuildStore';
import { sampleTanks, sampleFish, samplePlants } from '@/data/sampleData';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tank, Fish, Plant } from '@/types';

export function PartBrowserModal() {
  const { isModalOpen, activeCategory, closeModal } = useUIStore();
  const { setTank, addFish, addPlant } = useBuildStore();

  if (!isModalOpen) return null;

  let items: (Tank | Fish | Plant)[] = [];
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
    case 'plants':
      items = samplePlants;
      title = 'Add Plants';
      break;
    default:
      items = [];
      title = 'Select Parts';
  }

  const handleAdd = (item: Tank | Fish | Plant) => {
    if (activeCategory === 'tank') {
      setTank(item as Tank);
      closeModal();
    } else if (activeCategory === 'fish') {
      addFish(item as Fish, 1);
    } else if (activeCategory === 'plants') {
      addPlant(item as Plant, 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-ocean-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-ocean-950/50">
          <h2 className="text-xl font-bold font-outfit text-white">{title}</h2>
          <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const anyItem = item as any;
              return (
              <Card key={item.id} className="flex flex-col gap-3 hover:border-teal-500/50 transition-colors cursor-pointer group">
                <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                   {/* Placeholder Image */}
                   <span className="text-white/20 text-sm">{anyItem.name || anyItem.commonName}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-teal-100 group-hover:text-teal-400 transition-colors">
                    {anyItem.name || anyItem.commonName}
                  </h3>
                  {anyItem.scientificName && <p className="text-xs text-gray-400 italic">{anyItem.scientificName}</p>}
                  
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-300">
                    {anyItem.volumeGallons && <span className="bg-white/10 px-2 py-1 rounded">{anyItem.volumeGallons} gal</span>}
                    {anyItem.adultSizeInches && <span className="bg-white/10 px-2 py-1 rounded">{anyItem.adultSizeInches}&quot;</span>}
                    {anyItem.temperament && <span className="bg-white/10 px-2 py-1 rounded capitalize">{anyItem.temperament}</span>}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-teal-300">${item.price}</span>
                    <button 
                      onClick={() => handleAdd(item)}
                      className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </Card>
            );
            })}
            {items.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12">
                No items found in this category yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
