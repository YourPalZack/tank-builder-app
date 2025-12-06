import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AquariumBuild, Tank, Fish, Invertebrate, Plant, Equipment, Substrate, EquipmentCategory } from '@/types';
import { checkCompatibility } from '@/lib/compatibility';

interface BuildState extends AquariumBuild {
  setTank: (tank: Tank) => void;
  addFish: (fish: Fish, quantity?: number) => void;
  removeFish: (fishId: string) => void;
  updateFishQuantity: (fishId: string, quantity: number) => void;
  
  addInvert: (invert: Invertebrate, quantity?: number) => void;
  removeInvert: (invertId: string) => void;
  updateInvertQuantity: (invertId: string, quantity: number) => void;

  addPlant: (plant: Plant, quantity?: number) => void;
  removePlant: (plantId: string) => void;
  updatePlantQuantity: (plantId: string, quantity: number) => void;

  setEquipment: (category: EquipmentCategory, item: Equipment) => void;
  setSubstrate: (substrate: Substrate) => void;
  resetBuild: () => void;
  recalculate: () => void;
}

const initialState = {
  tank: null,
  fish: [],
  inverts: [],
  plants: [],
  equipment: {
    filter: null,
    heater: null,
    light: null,
    co2: null,
    airPump: null,
    other: []
  },
  substrate: null,
  substrateBags: 0,
  totalCost: 0,
  stockingLevel: 0,
  warnings: [],
  targetParams: { 
    temp: [70, 80] as [number, number], 
    ph: [6.5, 7.5] as [number, number], 
    hardness: [5, 15] as [number, number] 
  }
};

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      id: 'default-build',
      name: 'My Aquarium',
      ...initialState,

      recalculate: () => {
        const state = get();
        const build: AquariumBuild = {
            id: state.id,
            name: state.name,
            tank: state.tank,
            fish: state.fish,
            inverts: state.inverts,
            plants: state.plants,
            equipment: state.equipment,
            substrate: state.substrate,
            substrateBags: state.substrateBags,
            totalCost: state.totalCost,
            stockingLevel: state.stockingLevel,
            warnings: state.warnings
        };
        
        const result = checkCompatibility(build);
        
        // Calculate Cost
        let cost = 0;
        if (state.tank) cost += state.tank.price;
        state.fish.forEach(i => cost += i.item.price * i.quantity);
        state.inverts.forEach(i => cost += i.item.price * i.quantity);
        state.plants.forEach(i => cost += i.item.price * i.quantity);
        if (state.equipment.filter) cost += state.equipment.filter.price;
        if (state.equipment.heater) cost += state.equipment.heater.price;
        if (state.equipment.light) cost += state.equipment.light.price;
        if (state.equipment.co2) cost += state.equipment.co2.price;
        if (state.equipment.airPump) cost += state.equipment.airPump.price;
        state.equipment.other.forEach(e => cost += e.price);
        if (state.substrate) cost += state.substrate.price * state.substrateBags;

        set({ 
            warnings: result.warnings, 
            stockingLevel: result.stockingLevel,
            targetParams: result.targetParams,
            totalCost: cost
        });
      },

      setTank: (tank) => {
        set({ tank });
        // Recalculate substrate bags if substrate exists
        const sub = get().substrate;
        if (sub) {
             const needed = sub.poundsPerGallon * tank.volumeGallons;
             const bags = Math.ceil(needed / sub.bagSizePounds);
             set({ substrateBags: bags });
        }
        get().recalculate();
      },
      
      addFish: (fish, quantity = 1) => {
        const current = get().fish;
        const existing = current.find(f => f.item.id === fish.id);
        if (existing) {
          get().updateFishQuantity(fish.id, existing.quantity + quantity);
        } else {
          set({ fish: [...current, { item: fish, quantity }] });
          get().recalculate();
        }
      },

      removeFish: (fishId) => {
        set({ fish: get().fish.filter(f => f.item.id !== fishId) });
        get().recalculate();
      },

      updateFishQuantity: (fishId, quantity) => {
        if (quantity <= 0) {
          get().removeFish(fishId);
          return;
        }
        set({
          fish: get().fish.map(f => f.item.id === fishId ? { ...f, quantity } : f)
        });
        get().recalculate();
      },

      addInvert: (invert, quantity = 1) => {
        const current = get().inverts;
        const existing = current.find(i => i.item.id === invert.id);
        if (existing) {
          get().updateInvertQuantity(invert.id, existing.quantity + quantity);
        } else {
          set({ inverts: [...current, { item: invert, quantity }] });
          get().recalculate();
        }
      },

      removeInvert: (invertId) => {
        set({ inverts: get().inverts.filter(i => i.item.id !== invertId) });
        get().recalculate();
      },

      updateInvertQuantity: (invertId, quantity) => {
        if (quantity <= 0) {
          get().removeInvert(invertId);
          return;
        }
        set({
          inverts: get().inverts.map(i => i.item.id === invertId ? { ...i, quantity } : i)
        });
        get().recalculate();
      },

      addPlant: (plant, quantity = 1) => {
        const current = get().plants;
        const existing = current.find(p => p.item.id === plant.id);
        if (existing) {
          get().updatePlantQuantity(plant.id, existing.quantity + quantity);
        } else {
          set({ plants: [...current, { item: plant, quantity }] });
          get().recalculate();
        }
      },

      removePlant: (plantId) => {
        set({ plants: get().plants.filter(p => p.item.id !== plantId) });
        get().recalculate();
      },

      updatePlantQuantity: (plantId, quantity) => {
        if (quantity <= 0) {
          get().removePlant(plantId);
          return;
        }
        set({
          plants: get().plants.map(p => p.item.id === plantId ? { ...p, quantity } : p)
        });
        get().recalculate();
      },

      setEquipment: (category, item) => {
        const current = get().equipment;
        // Map category string to state key
        let key: keyof typeof current | null = null;
        if (category === 'Filter') key = 'filter';
        else if (category === 'Heater') key = 'heater';
        else if (category === 'Light') key = 'light';
        else if (category === 'CO2') key = 'co2';
        else if (category === 'AirPump') key = 'airPump';
        else if (category === 'Other') key = 'other';

        if (key === 'other') {
             set({ equipment: { ...current, other: [...current.other, item] } });
        } else if (key) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             set({ equipment: { ...current, [key]: item } as any });
        }
        get().recalculate();
      },

      setSubstrate: (substrate) => {
        set({ substrate });
        const tank = get().tank;
        if (tank && substrate) {
            const needed = substrate.poundsPerGallon * tank.volumeGallons;
            const bags = Math.ceil(needed / substrate.bagSizePounds);
            set({ substrateBags: bags });
        }
        get().recalculate();
      },

      resetBuild: () => {
        set({ ...initialState, id: get().id, name: get().name });
      },
    }),
    {
      name: 'aqua-builder-storage',
    }
  )
);
