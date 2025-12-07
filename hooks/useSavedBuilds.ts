import useSWR from 'swr';
import { useUser } from '@clerk/nextjs';
import { useSavedBuildsStore } from '@/store/useSavedBuildsStore';
import { AquariumBuild } from '@/types';
import { getSavedBuilds, saveBuild as saveBuildAction, deleteBuild as deleteBuildAction } from '@/lib/actions/builds';

export function useSavedBuilds() {
  const { user, isLoaded } = useUser();
  const localStore = useSavedBuildsStore();

  const { data: dbBuilds, error, mutate } = useSWR(
    user ? ['saved-builds', user.id] : null,
    getSavedBuilds
  );

  const saveBuild = async (build: AquariumBuild) => {
    if (user) {
      await saveBuildAction(build);
      mutate();
    } else {
      localStore.saveBuild(build);
    }
  };

  const deleteBuild = async (buildId: string) => {
    if (user) {
      await deleteBuildAction(buildId);
      mutate();
    } else {
      localStore.deleteBuild(buildId);
    }
  };

  return {
    savedBuilds: user ? (dbBuilds || []) : localStore.savedBuilds,
    isLoading: !isLoaded || (!!user && !dbBuilds && !error),
    saveBuild,
    deleteBuild,
    user
  };
}

