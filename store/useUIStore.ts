import { create } from 'zustand';

interface UIState {
  isModalOpen: boolean;
  activeCategory: string | null;
  openModal: (category: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  activeCategory: null,
  openModal: (category) => set({ isModalOpen: true, activeCategory: category }),
  closeModal: () => set({ isModalOpen: false, activeCategory: null }),
}));
