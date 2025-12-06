import React from 'react';
import { X } from 'lucide-react';
import { WhereToBuySection } from './WhereToBuySection';
import { 
  getEquipmentPurchaseLinks, 
  getFishPurchaseLinks, 
  getPlantPurchaseLinks, 
  getSubstratePurchaseLinks, 
  getInvertebratePurchaseLinks,
  getTankPurchaseLinks
} from '@/lib/purchasing';
import { Fish, Plant, Equipment, Substrate, Invertebrate, Tank } from '@/types';

import type { PurchaseLink } from '@/types/purchasing';

interface ItemDetailModalProps {
  item: Fish | Plant | Equipment | Substrate | Invertebrate | Tank | null;
  isOpen: boolean;
  onClose: () => void;
  type: 'fish' | 'plant' | 'equipment' | 'substrate' | 'invertebrate' | 'tank' | null;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, isOpen, onClose, type }) => {
  if (!isOpen || !item || !type) return null;

  let links: PurchaseLink[] = [];
  let title = '';
  let description = '';
  // const imageUrl = item.imageUrl; // Unused for now

  // Helper to get links and details based on type
  switch (type) {
    case 'fish': {
      const fish = item as Fish;
      links = getFishPurchaseLinks(fish);
      title = fish.commonName;
      description = `${fish.scientificName} • ${fish.temperament} • ${fish.careLevel}`;
      break;
    }
    case 'plant': {
      const plant = item as Plant;
      links = getPlantPurchaseLinks(plant);
      title = plant.commonName;
      description = `${plant.scientificName} • ${plant.lightRequirement} light • ${plant.growthRate} growth`;
      break;
    }
    case 'equipment': {
      const eq = item as Equipment;
      links = getEquipmentPurchaseLinks(eq);
      title = eq.name;
      description = `${eq.brand || ''} ${eq.category}`;
      break;
    }
    case 'substrate': {
      const sub = item as Substrate;
      links = getSubstratePurchaseLinks(sub);
      title = sub.name;
      description = `${sub.brand || ''} ${sub.type}`;
      break;
    }
    case 'invertebrate': {
      const inv = item as Invertebrate;
      links = getInvertebratePurchaseLinks(inv);
      title = inv.commonName;
      description = `${inv.scientificName} • ${inv.bioload} bioload`;
      break;
    }
    case 'tank': {
      const tank = item as Tank;
      links = getTankPurchaseLinks(tank);
      title = tank.name;
      description = `${tank.dimensions.length}" x ${tank.dimensions.width}" x ${tank.dimensions.height}" • ${tank.volumeGallons} gal`;
      break;
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
           {/* Placeholder for image */}
           <span className="text-slate-400 font-medium">{title}</span>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 mt-1">{description}</p>
          
          <div className="mt-4">
             <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                <span>Price Estimate</span>
                <span className="font-mono font-bold text-teal-700">${item.price}</span>
             </div>
             
             {/* Additional details could go here */}
          </div>

          <WhereToBuySection purchaseLinks={links} />
        </div>
      </div>
    </div>
  );
};
