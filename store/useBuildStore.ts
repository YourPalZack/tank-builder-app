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
  warnings: []
};

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      id: 'default-build',
      name: 'My Aquarium',
      ...initialState,

      recalculate: () => {
        const state = get();
        // Construct build object for checker
        // We need to cast or ensure it matches AquariumBuild structure
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
        // ... other equipment
        if (state.substrate) cost += state.substrate.price * state.substrateBags;

        set({ 
            warnings: result.issues, 
            stockingLevel: result.stockingLevel,
            totalCost: cost
        });
      },

      setTank: (tank) => {
        set({ tank });
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
        const key = category.toLowerCase() as keyof typeof current;
        if (key === 'other') {
            // Handle 'other' array logic if needed, for now ignore or append
            // Assuming 'Other' category items go to 'other' array
             set({ equipment: { ...current, other: [...current.other, item] } });
        } else if (key in current) {
             set({ equipment: { ...current, [key]: item } });
        }
        get().recalculate();
      },

      setSubstrate: (substrate) => {
        set({ substrate });
        // Calculate bags needed based on tank size
        const tank = get().tank;
        if (tank && substrate) {
            // Heuristic: 1.5 lbs per gallon or based on dimensions
            // Volume = L * W * H. Floor = L * W.
            // 2 inch depth.
            // Volume of substrate = L * W * 2 inches.
            // Weight = Volume * Density.
            // Simplified: poundsPerGallon * tankGallons? No, poundsPerGallon is usually density.
            // Let's use: (L * W * 2) / 231 (gallons of substrate) * Density (lbs/gal of substrate)?
            // Or just use the field `poundsPerGallon` from Substrate model which I defined as "pounds per gallon of tank"?
            // "poundsPerGallon recommendation (how many pounds of this substrate per gallon for a typical 2-inch bed)"
            // So: bags = (poundsPerGallon * tank.volumeGallons) / bagSizePounds
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
