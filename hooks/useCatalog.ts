import useSWR from 'swr';
import { 
  getTanks, 
  getFish, 
  getInvertebrates, 
  getPlants, 
  getEquipment, 
  getSubstrates 
} from '@/lib/actions/catalog';
import { Tank, Fish, Plant, Invertebrate, Equipment, Substrate } from '@/types';

// Helper to convert decimal strings to numbers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapTypes = (item: any): any => {
  const newItem = { ...item };
  // Convert common decimal fields
  ['volumeGallons', 'volumeLiters', 'price', 'adultSizeInches', 'minTankGallons', 'territorialRadius', 'maxHeightInches', 'poundsPerGallon', 'bagSizePounds', 'watts', 'lumens', 'lengthInches', 'flowRateGph', 'buffersTo', 'grainSizeMm'].forEach(key => {
    if (newItem[key] && typeof newItem[key] === 'string') {
      newItem[key] = parseFloat(newItem[key]);
    }
  });
  return newItem;
};

export function useTanks() {
  const { data, error, isLoading } = useSWR('tanks', getTanks);
  return {
    tanks: data?.map(mapTypes) as Tank[] || [],
    isLoading,
    isError: error
  };
}

export function useFish() {
  const { data, error, isLoading } = useSWR('fish', getFish);
  return {
    fish: data?.map(mapTypes) as Fish[] || [],
    isLoading,
    isError: error
  };
}

export function useInvertebrates() {
  const { data, error, isLoading } = useSWR('invertebrates', getInvertebrates);
  return {
    invertebrates: data?.map(mapTypes) as Invertebrate[] || [],
    isLoading,
    isError: error
  };
}

export function usePlants() {
  const { data, error, isLoading } = useSWR('plants', getPlants);
  return {
    plants: data?.map(mapTypes) as Plant[] || [],
    isLoading,
    isError: error
  };
}

export function useEquipment() {
  const { data, error, isLoading } = useSWR('equipment', getEquipment);
  return {
    equipment: data?.map(mapTypes) as Equipment[] || [],
    isLoading,
    isError: error
  };
}

export function useSubstrates() {
  const { data, error, isLoading } = useSWR('substrates', getSubstrates);
  return {
    substrates: data?.map(mapTypes) as Substrate[] || [],
    isLoading,
    isError: error
  };
}
