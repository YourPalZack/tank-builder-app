import useSWR from 'swr';
import { supabase } from '@/lib/supabase';
import { useSavedBuildsStore } from '@/store/useSavedBuildsStore';
import { AquariumBuild } from '@/types';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export function useSavedBuilds() {
  const [user, setUser] = useState<User | null>(null);
  const localStore = useSavedBuildsStore();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: dbBuilds, error, mutate } = useSWR(
    user ? ['saved-builds', user.id] : null,
    async () => {
      const { data, error } = await supabase
        .from('builds')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((row) => ({
        ...row.configuration,
        id: row.id, // Ensure DB ID is used
        name: row.name, // Ensure DB Name is used
      })) as AquariumBuild[];
    }
  );

  const saveBuild = async (build: AquariumBuild) => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, name, ...configuration } = build;
      
      const payload = {
        id: build.id,
        user_id: user.id,
        name: build.name,
        total_cost: build.totalCost,
        stocking_level: build.stockingLevel,
        configuration: configuration,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('builds')
        .upsert(payload);

      if (error) throw error;
      mutate();
    } else {
      localStore.saveBuild(build);
    }
  };

  const deleteBuild = async (buildId: string) => {
    if (user) {
      const { error } = await supabase
        .from('builds')
        .delete()
        .eq('id', buildId);
      
      if (error) throw error;
      mutate();
    } else {
      localStore.deleteBuild(buildId);
    }
  };

  return {
    savedBuilds: user ? (dbBuilds || []) : localStore.savedBuilds,
    isLoading: user ? (!dbBuilds && !error) : false,
    saveBuild,
    deleteBuild,
    user
  };
}
