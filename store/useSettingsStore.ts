import { create } from 'zustand';

interface VendorSettings {
  preferredVendors: string[]; // e.g. ['Amazon', "Dan's Fish"]
}

interface SettingsState extends VendorSettings {
  setPreferredVendors: (vendors: string[]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  preferredVendors: ['Amazon', "Dan's Fish", 'Aqua Huna', 'Flip Aquatics'],
  setPreferredVendors: (vendors) => set({ preferredVendors: vendors }),
}));
