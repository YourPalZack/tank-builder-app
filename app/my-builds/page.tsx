'use client';

import { useSavedBuilds } from '@/hooks/useSavedBuilds';
import { useBuildStore } from '@/store/useBuildStore';
import { BuildCard } from '@/components/BuildCard';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { AquariumBuild } from '@/types';

export default function MyBuildsPage() {
  const { savedBuilds, deleteBuild, saveBuild, isLoading } = useSavedBuilds();
  const { loadBuild, createNewBuild } = useBuildStore();
  const router = useRouter();

  const handleEdit = (build: AquariumBuild) => {
    loadBuild(build);
    router.push('/');
  };

  const handleClone = (build: AquariumBuild) => {
    const newBuild = { ...build, id: crypto.randomUUID(), name: `${build.name} (Copy)` };
    saveBuild(newBuild);
  };

  const handleNew = () => {
    createNewBuild();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-slate-900">My Builds</h1>
        <button onClick={handleNew} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <Plus className="w-4 h-4" /> New Build
        </button>
      </div>

      {savedBuilds.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700">No Saved Builds</h2>
            <p className="text-slate-500 mt-2">Start your first aquarium project today!</p>
            <button onClick={handleNew} className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors">
                Create New Build
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedBuilds.map(build => (
                <BuildCard 
                  key={build.id} 
                  build={build} 
                  onEdit={handleEdit}
                  onDelete={deleteBuild}
                  onClone={handleClone}
                />
            ))}
        </div>
      )}
    </div>
  );
}