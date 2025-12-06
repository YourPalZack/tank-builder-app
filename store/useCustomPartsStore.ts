import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tank, Fish, Plant, Invertebrate, Equipment, Substrate } from '@/types';

interface CustomPartsState {
  customTanks: Tank[];
  customFish: Fish[];
  customPlants: Plant[];
  customInverts: Invertebrate[];
  customEquipment: Equipment[];
  customSubstrate: Substrate[];
  
  addCustomTank: (tank: Tank) => void;
  addCustomFish: (fish: Fish) => void;
  addCustomPlant: (plant: Plant) => void;
  addCustomInvert: (invert: Invertebrate) => void;
  addCustomEquipment: (equipment: Equipment) => void;
  addCustomSubstrate: (substrate: Substrate) => void;
  
  removeCustomPart: (category: string, id: string) => void;
}

export const useCustomPartsStore = create<CustomPartsState>()(
  persist(
    (set) => ({
      customTanks: [],
      customFish: [],
      customPlants: [],
      customInverts: [],
      customEquipment: [],
      customSubstrate: [],

      addCustomTank: (tank) => set((state) => ({ customTanks: [...state.customTanks, tank] })),
      addCustomFish: (fish) => set((state) => ({ customFish: [...state.customFish, fish] })),
      addCustomPlant: (plant) => set((state) => ({ customPlants: [...state.customPlants, plant] })),
      addCustomInvert: (invert) => set((state) => ({ customInverts: [...state.customInverts, invert] })),
      addCustomEquipment: (equipment) => set((state) => ({ customEquipment: [...state.customEquipment, equipment] })),
      addCustomSubstrate: (substrate) => set((state) => ({ customSubstrate: [...state.customSubstrate, substrate] })),

      removeCustomPart: (category, id) => set((state) => {
        switch (category) {
          case 'tank': return { customTanks: state.customTanks.filter(i => i.id !== id) };
          case 'fish': return { customFish: state.customFish.filter(i => i.id !== id) };
          case 'plants': return { customPlants: state.customPlants.filter(i => i.id !== id) };
          case 'inverts': return { customInverts: state.customInverts.filter(i => i.id !== id) };
          case 'substrate': return { customSubstrate: state.customSubstrate.filter(i => i.id !== id) };
          default: return { customEquipment: state.customEquipment.filter(i => i.id !== id) };
        }
      }),
    }),
    {
      name: 'aquabuilder-custom-parts',
    }
  )
);
