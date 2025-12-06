import useSWR from 'swr';
import { supabase } from '@/lib/supabase';
import { Tank, Fish, Plant, Invertebrate, Equipment, Substrate } from '@/types';

// Generic fetcher for Supabase
const fetcher = async (key: string) => {
  const [table, category] = key.split(':');
  
  let query = supabase.from(table).select('*');
  
  // Filter by category if provided (for equipment/species)
  if (category && category !== 'all') {
    if (table === 'species') {
      query = query.eq('type', category); // 'fish' or 'invertebrate'
    } else if (table === 'equipment') {
      // Equipment category filtering is handled in the UI usually, but we can do it here if needed.
      // For now, let's fetch all equipment and filter client-side or refine this.
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  
  // Need to map snake_case DB fields to camelCase TS types if they differ
  // Or update types to match DB. 
  // For now, I'll do a simple mapping or assume the UI handles it.
  // Actually, the UI expects camelCase. I should map it here.
  return data.map(mapDatabaseToClient);
};

// Helper to map DB snake_case to Client camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDatabaseToClient = (item: any): any => {
  // This is a simplified mapper. You might need more specific ones per type.
  const newItem: any = {};
  for (const key in item) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newItem[camelKey] = item[key];
  }
  // Fix specific fields that might not map perfectly automatically
  if (item.volume_gallons) newItem.volumeGallons = item.volume_gallons;
  if (item.volume_liters) newItem.volumeLiters = item.volume_liters;
  if (item.image_url) newItem.imageUrl = item.image_url;
  if (item.min_tank_gallons) newItem.minTankGallons = item.min_tank_gallons;
  if (item.adult_size_inches) newItem.adultSizeInches = item.adult_size_inches;
  if (item.water_params) newItem.waterParams = item.water_params;
  if (item.swimming_level) newItem.swimmingLevel = item.swimming_level;
  if (item.schooling_size) newItem.schoolingSize = item.schooling_size;
  if (item.territorial_radius) newItem.territorialRadius = item.territorial_radius;
  if (item.incompatible_with) newItem.incompatibleWith = item.incompatible_with;
  if (item.predator_of) newItem.predatorOf = item.predator_of;
  if (item.prey_to) newItem.preyTo = item.prey_to;
  if (item.nips_at_fins) newItem.nipsAtFins = item.nips_at_fins;
  if (item.incompatible_with_long_finned) newItem.incompatibleWithLongFinned = item.incompatible_with_long_finned;
  if (item.is_long_finned) newItem.isLongFinned = item.is_long_finned;
  if (item.care_level) newItem.careLevel = item.care_level;
  if (item.copper_sensitive) newItem.copperSensitive = item.copper_sensitive;
  if (item.plant_safe) newItem.plantSafe = item.plant_safe;
  if (item.light_requirement) newItem.lightRequirement = item.light_requirement;
  if (item.co2_required) newItem.co2Required = item.co2_required;
  if (item.co2_recommended) newItem.co2Recommended = item.co2_recommended;
  if (item.substrate_type) newItem.substrateType = item.substrate_type;
  if (item.growth_rate) newItem.growthRate = item.growth_rate;
  if (item.max_height_inches) newItem.maxHeightInches = item.max_height_inches;
  if (item.incompatible_with_fish) newItem.incompatibleWithFish = item.incompatible_with_fish;
  if (item.max_tank_gallons) newItem.maxTankGallons = item.max_tank_gallons;
  if (item.flow_rate_gph) newItem.flowRateGPH = item.flow_rate_gph;
  if (item.length_inches) newItem.lengthInches = item.length_inches;
  if (item.filter_type) newItem.filterType = item.filter_type;
  if (item.nutrient_rich) newItem.nutrientRich = item.nutrient_rich;
  if (item.buffers_ph) newItem.buffersPH = item.buffers_ph;
  if (item.buffers_to) newItem.buffersTo = item.buffers_to;
  if (item.grain_size_mm) newItem.grainSizeMM = item.grain_size_mm;
  if (item.pounds_per_gallon) newItem.poundsPerGallon = item.pounds_per_gallon;
  if (item.bag_size_pounds) newItem.bagSizePounds = item.bag_size_pounds;

  return newItem;
};

export function useTanks() {
  const { data, error, isLoading } = useSWR('tanks', fetcher);
  return { tanks: data as Tank[], error, isLoading };
}

export function useFish() {
  const { data, error, isLoading } = useSWR('species:fish', fetcher);
  return { fish: data as Fish[], error, isLoading };
}

export function useInvertebrates() {
  const { data, error, isLoading } = useSWR('species:invertebrate', fetcher);
  return { invertebrates: data as Invertebrate[], error, isLoading };
}

export function usePlants() {
  const { data, error, isLoading } = useSWR('plants', fetcher);
  return { plants: data as Plant[], error, isLoading };
}

export function useEquipment() {
  const { data, error, isLoading } = useSWR('equipment', fetcher);
  return { equipment: data as Equipment[], error, isLoading };
}

export function useSubstrates() {
  const { data, error, isLoading } = useSWR('substrates', fetcher);
  return { substrates: data as Substrate[], error, isLoading };
}
