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
import { X, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tank, Fish, Plant, Invertebrate, Equipment, Substrate, AquariumBuild } from '@/types';
import { useState, useMemo, useCallback } from 'react';
import { checkCompatibility } from '@/lib/compatibility';
import { ItemDetailModal } from './ItemDetailModal';

export function PartBrowserModal() {
  const { isModalOpen, activeCategory, closeModal } = useUIStore();
  const buildStore = useBuildStore();
  const { 
    tank: currentTank, 
    fish: currentFish, 
    inverts: currentInverts, 
    plants: currentPlants, 
    equipment: currentEquipment,
    substrate: currentSubstrate,
    setTank, 
    addFish, 
    addPlant, 
    addInvert, 
    setEquipment, 
    setSubstrate 
  } = buildStore;

  const [searchQuery, setSearchQuery] = useState('');
  const [showCompatibleOnly, setShowCompatibleOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [selectedCareLevel, setSelectedCareLevel] = useState<string>('all');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detailItem, setDetailItem] = useState<any>(null);

  const { items, title } = useMemo(() => {
    let items: (Tank | Fish | Plant | Invertebrate | Equipment | Substrate)[] = [];
    let title = '';

    if (isModalOpen) {
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
    }
    return { items, title };
  }, [activeCategory, isModalOpen]);  // Helper to check if an item is compatible with the current build
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkItemCompatibility = useCallback((item: any): boolean => {
    // Create a temporary build state with this item added
    const tempBuild: AquariumBuild = {
      id: 'temp',
      name: 'Temp',
      tank: activeCategory === 'tank' ? item : currentTank,
      fish: activeCategory === 'fish' ? [...currentFish, { item, quantity: 1 }] : currentFish,
      inverts: activeCategory === 'inverts' ? [...currentInverts, { item, quantity: 1 }] : currentInverts,
      plants: activeCategory === 'plants' ? [...currentPlants, { item, quantity: 1 }] : currentPlants,
      equipment: { ...currentEquipment },
      substrate: activeCategory === 'substrate' ? item : currentSubstrate,
      substrateBags: 0,
      warnings: [],
      totalCost: 0,
      stockingLevel: 0,
      targetParams: { temp: [0,0], ph: [0,0], hardness: [0,0] }
    };

    if (activeCategory === 'filter') tempBuild.equipment.filter = item;
    if (activeCategory === 'heater') tempBuild.equipment.heater = item;
    if (activeCategory === 'light') tempBuild.equipment.light = item;
    if (activeCategory === 'co2') tempBuild.equipment.co2 = item;
    if (activeCategory === 'other') tempBuild.equipment.other = [...(tempBuild.equipment.other || []), item];

    const { warnings } = checkCompatibility(tempBuild);
    // Return false if there are any errors (warnings are okay-ish, but maybe we want strict?)
    // Let's say "Compatible Only" means no Errors.
    return !warnings.some(w => w.severity === 'error');
  }, [activeCategory, currentTank, currentFish, currentInverts, currentPlants, currentEquipment, currentSubstrate]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyItem = item as any;
      const name = anyItem.name || anyItem.commonName || '';
      
      // Text Search
      if (!name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // Price Filter
      if (item.price > maxPrice) return false;

      // Care Level Filter
      if (selectedCareLevel !== 'all' && anyItem.careLevel && anyItem.careLevel !== selectedCareLevel) return false;

      // Compatibility Filter
      if (showCompatibleOnly) {
        if (!checkItemCompatibility(item)) return false;
      }

      return true;
    });
  }, [items, searchQuery, maxPrice, selectedCareLevel, showCompatibleOnly, checkItemCompatibility]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        closeModal(); 
        break;
      case 'substrate':
        setSubstrate(item as Substrate);
        closeModal();
        break;
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl h-[85vh] bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex flex-col border-b border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-xl font-bold font-outfit text-slate-900">{title}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-500" />
                </button>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Filters */}
            <div className="w-64 bg-white border-r border-slate-100 p-4 flex flex-col gap-6 overflow-y-auto">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Search
                    </label>
                    <input 
                        type="text"
                        placeholder="Search parts..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filters
                    </label>
                    
                    {/* Compatible Only Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={showCompatibleOnly}
                            onChange={(e) => setShowCompatibleOnly(e.target.checked)}
                            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                        />
                        <span className="text-sm text-slate-600">Compatible Only</span>
                    </label>
                </div>

                {/* Price Filter */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-slate-700">Max Price</span>
                        <span className="text-slate-500">${maxPrice}</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        step="10"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                </div>

                {/* Care Level Filter (Only for Fish/Inverts) */}
                {(activeCategory === 'fish' || activeCategory === 'inverts') && (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Care Level</label>
                        <select 
                            value={selectedCareLevel}
                            onChange={(e) => setSelectedCareLevel(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredItems.map((item) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const anyItem = item as any;
                    const isCompatible = checkItemCompatibility(item);

                    return (
                    <Card key={item.id} className={`flex flex-col gap-3 p-4 transition-all cursor-pointer group bg-white shadow-sm hover:shadow-md border ${!isCompatible && !showCompatibleOnly ? 'border-red-200 opacity-80' : 'border-slate-100 hover:border-teal-500'}`}>
                        <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-100 relative overflow-hidden">
                            {/* Placeholder Image */}
                            <span className="text-slate-400 text-sm font-medium">{anyItem.name || anyItem.commonName}</span>
                            
                            {/* Compatibility Badge on Card */}
                            {!isCompatible && (
                                <div className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full" title="Incompatible with current build">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                            )}
                            {isCompatible && showCompatibleOnly && (
                                <div className="absolute top-2 right-2 bg-green-100 text-green-600 p-1 rounded-full">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        <div>
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-teal-700 transition-colors truncate">
                            {anyItem.name || anyItem.commonName}
                        </h3>
                        {anyItem.scientificName && <p className="text-xs text-slate-500 italic truncate">{anyItem.scientificName}</p>}
                        
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                            {anyItem.volumeGallons && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{anyItem.volumeGallons} gal</span>}
                            {anyItem.adultSizeInches && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{anyItem.adultSizeInches}&quot;</span>}
                            {anyItem.temperament && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 capitalize">{anyItem.temperament}</span>}
                            {anyItem.watts && <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{anyItem.watts}W</span>}
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                            <span className="font-mono text-teal-700 font-bold">${item.price}</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setDetailItem(item); }}
                                    className="text-slate-500 hover:text-teal-600 text-sm px-2 py-1"
                                >
                                    Details
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm transition-colors shadow-sm"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        </div>
                    </Card>
                    );
                    })}
                    {filteredItems.length === 0 && (
                    <div className="col-span-full text-center text-slate-400 py-12">
                        <p className="text-lg">No items found.</p>
                        <p className="text-sm mt-2">Try adjusting your filters or search query.</p>
                    </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
