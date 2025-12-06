import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AquariumBuild } from '@/types';

interface SavedBuildsState {
  savedBuilds: AquariumBuild[];
  saveBuild: (build: AquariumBuild) => void;
  deleteBuild: (buildId: string) => void;
}

export const useSavedBuildsStore = create<SavedBuildsState>()(
  persist(
    (set) => ({
      savedBuilds: [],
      saveBuild: (build) => set((state) => {
        const existingIndex = state.savedBuilds.findIndex(b => b.id === build.id);
        if (existingIndex >= 0) {
            const newBuilds = [...state.savedBuilds];
            newBuilds[existingIndex] = build;
            return { savedBuilds: newBuilds };
        }
        return { savedBuilds: [...state.savedBuilds, build] };
      }),
      deleteBuild: (buildId) => set((state) => ({
        savedBuilds: state.savedBuilds.filter((b) => b.id !== buildId),
      })),
    }),
    {
      name: 'aquabuilder-saved-builds',
    }
  )
);
