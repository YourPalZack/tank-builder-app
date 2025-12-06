'use client';

import { useUIStore } from '@/store/useUIStore';
import { useBuildStore } from '@/store/useBuildStore';
import { 
  useTanks, 
  useFish, 
  usePlants, 
  useInvertebrates, 
  useEquipment, 
  useSubstrates 
} from '@/hooks/useCatalog';
import { supabase } from '@/lib/supabase';
import { X, Search, Filter, AlertTriangle, CheckCircle, Loader2, Database } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tank, Fish, Plant, Invertebrate, Equipment, Substrate, AquariumBuild, EquipmentCategory } from '@/types';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { checkCompatibility } from '@/lib/compatibility';
import { ItemDetailModal } from './ItemDetailModal';
import { 
  mapAmazonItemToTank, 
  mapAmazonItemToEquipment, 
  mapAmazonItemToFish, 
  mapAmazonItemToPlant, 
  mapAmazonItemToSubstrate, 
  mapAmazonItemToInvertebrate,
  AmazonItem 
} from '@/lib/amazon';

export function PartBrowserModal() {
  const { isModalOpen, activeCategory, closeModal } = useUIStore();
  const buildStore = useBuildStore();
  
  // Fetch data from Supabase
  const { tanks, isLoading: loadingTanks } = useTanks();
  const { fish, isLoading: loadingFish } = useFish();
  const { invertebrates, isLoading: loadingInverts } = useInvertebrates();
  const { plants, isLoading: loadingPlants } = usePlants();
  const { equipment, isLoading: loadingEquipment } = useEquipment();
  const { substrates, isLoading: loadingSubstrates } = useSubstrates();

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

  const [searchSource, setSearchSource] = useState<'local' | 'amazon'>('local');
  const [amazonResults, setAmazonResults] = useState<AmazonItem[]>([]);
  const [isLoadingAmazon, setIsLoadingAmazon] = useState(false);

  // Clear search query when category changes
  // useEffect(() => {
  //   setSearchQuery('');
  //   setAmazonResults([]);
  // }, [activeCategory]);

  const searchAmazon = useCallback(async (query: string) => {
    setIsLoadingAmazon(true);
    try {
      // Map activeCategory to Amazon search term/category
      let term = query;
      let category = 'All';
      
      if (activeCategory === 'tank') { term += ' aquarium tank'; category = 'PetSupplies'; }
      else if (activeCategory === 'fish') { term += ' live aquarium fish'; category = 'PetSupplies'; }
      else if (activeCategory === 'plants') { term += ' live aquarium plants'; category = 'PetSupplies'; }
      else if (activeCategory === 'inverts') { term += ' live aquarium shrimp snail'; category = 'PetSupplies'; }
      else if (activeCategory === 'substrate') { term += ' aquarium substrate'; category = 'PetSupplies'; }
      else { term += ' aquarium equipment'; category = 'PetSupplies'; }

      const res = await fetch(`/api/amazon/search?query=${encodeURIComponent(term)}&category=${category}`);
      const data = await res.json();
      if (data.SearchResult?.Items) {
        setAmazonResults(data.SearchResult.Items);
      } else {
        setAmazonResults([]);
      }
    } catch (e) {
      console.error(e);
      setAmazonResults([]);
    } finally {
      setIsLoadingAmazon(false);
    }
  }, [activeCategory]);

  // Effect: Handle Category Change
  useEffect(() => {
      setSearchQuery(''); // Clear search query on category change
      if (searchSource === 'amazon') {
          searchAmazon(''); // Fetch default/popular items for new category
      }
  }, [activeCategory, searchSource, searchAmazon]);

  // Effect: Handle Source Change
  useEffect(() => {
      if (searchSource === 'amazon') {
          // When switching to Amazon, perform search with current query (or empty if none)
          searchAmazon(searchQuery);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchSource, searchAmazon]); // We intentionally omit searchQuery to avoid search-as-you-type 

  const handleAmazonAdd = (item: AmazonItem) => {
    switch (activeCategory) {
      case 'tank':
        setTank(mapAmazonItemToTank(item));
        closeModal();
        break;
      case 'fish':
        addFish(mapAmazonItemToFish(item), 1);
        break;
      case 'inverts':
        addInvert(mapAmazonItemToInvertebrate(item), 1);
        break;
      case 'plants':
        addPlant(mapAmazonItemToPlant(item), 1);
        break;
// ... imports

// ...

      case 'filter':
      case 'heater':
      case 'light':
      case 'co2':
      case 'other': {
        let eqCat: EquipmentCategory = 'Other';
        if (activeCategory === 'filter') eqCat = 'Filter';
        if (activeCategory === 'heater') eqCat = 'Heater';
        if (activeCategory === 'light') eqCat = 'Light';
        if (activeCategory === 'co2') eqCat = 'CO2';
        
        setEquipment(eqCat, mapAmazonItemToEquipment(item, eqCat));
        closeModal(); 
        break;
      }
      case 'substrate':
        setSubstrate(mapAmazonItemToSubstrate(item));
        closeModal();
        break;
    }
  };

  const handleAmazonSave = async (item: AmazonItem) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to save custom parts.');
      return;
    }

    const userId = user.id;
    let error = null;

    switch (activeCategory) {
      case 'tank': {
        const tank = mapAmazonItemToTank(item);
        const { error: e } = await supabase.from('tanks').insert({
          user_id: userId,
          name: tank.name,
          brand: tank.brand,
          dimensions: tank.dimensions,
          volume_gallons: tank.volumeGallons,
          volume_liters: tank.volumeLiters,
          shape: tank.shape,
          material: tank.material,
          price: tank.price,
          image_url: tank.imageUrl,
          link: tank.link,
          purchase_links: tank.purchaseLinks
        });
        error = e;
        break;
      }
      case 'fish': {
        const fish = mapAmazonItemToFish(item);
        const { error: e } = await supabase.from('species').insert({
          user_id: userId,
          type: 'fish',
          common_name: fish.commonName,
          scientific_name: fish.scientificName,
          category: fish.category,
          subcategory: fish.subcategory,
          adult_size_inches: fish.adultSizeInches,
          min_tank_gallons: fish.minTankGallons,
          swimming_level: fish.swimmingLevel,
          water_params: fish.waterParams,
          temperament: fish.temperament,
          schooling_size: fish.schoolingSize,
          territorial_radius: fish.territorialRadius,
          incompatible_with: fish.incompatibleWith,
          predator_of: fish.predatorOf,
          prey_to: fish.preyTo,
          nips_at_fins: fish.nipsAtFins,
          incompatible_with_long_finned: fish.incompatibleWithLongFinned,
          is_long_finned: fish.isLongFinned,
          care_level: fish.careLevel,
          diet: fish.diet,
          price: fish.price,
          image_url: fish.imageUrl,
          link: fish.link,
          purchase_links: fish.purchaseLinks
        });
        error = e;
        break;
      }
      case 'inverts': {
        const invert = mapAmazonItemToInvertebrate(item);
        const { error: e } = await supabase.from('species').insert({
          user_id: userId,
          type: 'invertebrate',
          common_name: invert.commonName,
          scientific_name: invert.scientificName,
          category: invert.category,
          subcategory: invert.subcategory,
          adult_size_inches: invert.adultSizeInches,
          min_tank_gallons: invert.minTankGallons,
          swimming_level: invert.swimmingLevel,
          water_params: invert.waterParams,
          temperament: invert.temperament,
          schooling_size: invert.schoolingSize,
          territorial_radius: invert.territorialRadius,
          incompatible_with: invert.incompatibleWith,
          predator_of: invert.predatorOf,
          prey_to: invert.preyTo,
          care_level: invert.careLevel,
          diet: invert.diet,
          copper_sensitive: invert.copperSensitive,
          bioload: invert.bioload,
          plant_safe: invert.plantSafe,
          price: invert.price,
          image_url: invert.imageUrl,
          link: invert.link,
          purchase_links: invert.purchaseLinks
        });
        error = e;
        break;
      }
      case 'plants': {
        const plant = mapAmazonItemToPlant(item);
        const { error: e } = await supabase.from('plants').insert({
          user_id: userId,
          common_name: plant.commonName,
          scientific_name: plant.scientificName,
          category: plant.category,
          light_requirement: plant.lightRequirement,
          co2_required: plant.co2Required,
          co2_recommended: plant.co2Recommended,
          substrate_type: plant.substrateType,
          water_params: plant.waterParams,
          growth_rate: plant.growthRate,
          max_height_inches: plant.maxHeightInches,
          placement: plant.placement,
          incompatible_with_fish: plant.incompatibleWithFish,
          price: plant.price,
          image_url: plant.imageUrl,
          link: plant.link,
          purchase_links: plant.purchaseLinks
        });
        error = e;
        break;
      }
      case 'filter':
      case 'heater':
      case 'light':
      case 'co2':
      case 'other': {
        let eqCat: EquipmentCategory = 'Other';
        if (activeCategory === 'filter') eqCat = 'Filter';
        if (activeCategory === 'heater') eqCat = 'Heater';
        if (activeCategory === 'light') eqCat = 'Light';
        if (activeCategory === 'co2') eqCat = 'CO2';
        
        const equip = mapAmazonItemToEquipment(item, eqCat);
        const { error: e } = await supabase.from('equipment').insert({
          user_id: userId,
          name: equip.name,
          brand: equip.brand,
          category: equip.category,
          price: equip.price,
          min_tank_gallons: equip.minTankGallons,
          max_tank_gallons: equip.maxTankGallons,
          flow_rate_gph: equip.flowRateGPH,
          watts: equip.watts,
          lumens: equip.lumens,
          length_inches: equip.lengthInches,
          filter_type: equip.filterType,
          image_url: equip.imageUrl,
          link: equip.link,
          purchase_links: equip.purchaseLinks
        });
        error = e;
        break;
      }
      case 'substrate': {
        const sub = mapAmazonItemToSubstrate(item);
        const { error: e } = await supabase.from('substrates').insert({
          user_id: userId,
          name: sub.name,
          brand: sub.brand,
          type: sub.type,
          nutrient_rich: sub.nutrientRich,
          buffers_ph: sub.buffersPH,
          buffers_to: sub.buffersTo,
          grain_size_mm: sub.grainSizeMM,
          color: sub.color,
          pounds_per_gallon: sub.poundsPerGallon,
          bag_size_pounds: sub.bagSizePounds,
          price: sub.price,
          image_url: sub.imageUrl,
          link: sub.link,
          purchase_links: sub.purchaseLinks
        });
        error = e;
        break;
      }
    }

    if (error) {
      console.error('Error saving custom part:', error);
      alert('Failed to save custom part. See console for details.');
    } else {
      // Switch to local view to show the newly added item
      // We might need to revalidate the SWR cache here
      setSearchSource('local');
    }
  };

  const { items, title, isLoading } = useMemo(() => {
    let items: (Tank | Fish | Plant | Invertebrate | Equipment | Substrate)[] = [];
    let title = '';
    let isLoading = false;

    if (isModalOpen) {
      switch (activeCategory) {
        case 'tank':
          items = tanks || [];
          isLoading = loadingTanks;
          title = 'Select a Tank';
          break;
        case 'fish':
          items = fish || [];
          isLoading = loadingFish;
          title = 'Add Fish';
          break;
        case 'inverts':
          items = invertebrates || [];
          isLoading = loadingInverts;
          title = 'Add Invertebrates';
          break;
        case 'plants':
          items = plants || [];
          isLoading = loadingPlants;
          title = 'Add Plants';
          break;
        case 'filter':
          items = (equipment || []).filter(e => e.category === 'Filter');
          isLoading = loadingEquipment;
          title = 'Select Filtration';
          break;
        case 'heater':
          items = (equipment || []).filter(e => e.category === 'Heater');
          isLoading = loadingEquipment;
          title = 'Select Heater';
          break;
        case 'light':
          items = (equipment || []).filter(e => e.category === 'Light');
          isLoading = loadingEquipment;
          title = 'Select Lighting';
          break;
        case 'co2':
          items = (equipment || []).filter(e => e.category === 'CO2' || e.category === 'AirPump');
          isLoading = loadingEquipment;
          title = 'Select CO2 & Air';
          break;
        case 'substrate':
          items = substrates || [];
          isLoading = loadingSubstrates;
          title = 'Select Substrate';
          break;
        case 'other':
          items = (equipment || []).filter(e => e.category === 'Other');
          isLoading = loadingEquipment;
          title = 'Select Other Equipment';
          break;
        default:
          items = [];
          title = 'Select Parts';
      }
    }
    return { items, title, isLoading };
  }, [
    activeCategory, isModalOpen, 
    tanks, fish, invertebrates, plants, equipment, substrates,
    loadingTanks, loadingFish, loadingInverts, loadingPlants, loadingEquipment, loadingSubstrates
  ]);  // Helper to check if an item is compatible with the current build
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
                        <Database className="w-4 h-4" /> Source
                    </label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setSearchSource('local')}
                            className={`flex-1 py-1 text-sm font-medium rounded-md transition-colors ${searchSource === 'local' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Local
                        </button>
                        <button 
                            onClick={() => { setSearchSource('amazon'); }}
                            className={`flex-1 py-1 text-sm font-medium rounded-md transition-colors ${searchSource === 'amazon' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Amazon
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Search
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            placeholder={searchSource === 'amazon' ? "Search Amazon..." : "Search parts..."}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && searchSource === 'amazon') searchAmazon(searchQuery); }}
                        />
                        {searchSource === 'amazon' && (
                            <button 
                                onClick={() => searchAmazon(searchQuery)}
                                className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition-colors"
                                disabled={isLoadingAmazon}
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {searchSource === 'local' && (
                    <>
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
                    </>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                {isLoading && searchSource === 'local' ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                ) : searchSource === 'amazon' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {amazonResults.map((item) => (
                            <Card key={item.ASIN} className="flex flex-col gap-3 p-4 transition-all cursor-pointer group bg-white shadow-sm hover:shadow-md border border-slate-100 hover:border-teal-500">
                                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-100 relative overflow-hidden p-2">
                                    {item.Images?.Primary?.Large?.URL ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.Images.Primary.Large.URL} alt={item.ItemInfo?.Title?.DisplayValue} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-slate-400 text-sm font-medium">No Image</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-teal-700 transition-colors truncate" title={item.ItemInfo?.Title?.DisplayValue}>
                                        {item.ItemInfo?.Title?.DisplayValue || 'Unknown Item'}
                                    </h3>
                                    <p className="text-xs text-slate-500 italic truncate">Amazon Product</p>
                                    
                                    <div className="mt-4 flex items-center justify-between gap-2">
                                        <span className="font-mono text-teal-700 font-bold flex-1">
                                            {item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'N/A'}
                                        </span>
                                        <button 
                                            onClick={() => handleAmazonSave(item)}
                                            className="bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 px-3 py-1 rounded text-sm transition-colors shadow-sm"
                                            title="Save to Options"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={() => handleAmazonAdd(item)}
                                            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm transition-colors shadow-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {isLoadingAmazon && (
                            <div className="col-span-full text-center py-12">
                                <p className="text-slate-500 animate-pulse">Searching Amazon...</p>
                            </div>
                        )}
                        {!isLoadingAmazon && amazonResults.length === 0 && (
                            <div className="col-span-full text-center text-slate-400 py-12">
                                <p className="text-lg">No Amazon results found.</p>
                                <p className="text-sm mt-2">Try a different search term.</p>
                            </div>
                        )}
                    </div>
                ) : (
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
                )}
            </div>
        </div>
      </div>
      <ItemDetailModal 
        isOpen={!!detailItem} 
        onClose={() => setDetailItem(null)} 
        item={detailItem}
        type={
            activeCategory === 'tank' ? 'tank' :
            activeCategory === 'fish' ? 'fish' :
            activeCategory === 'inverts' ? 'invertebrate' :
            activeCategory === 'plants' ? 'plant' :
            activeCategory === 'substrate' ? 'substrate' :
            'equipment'
        }
      />
    </div>
  );
}
