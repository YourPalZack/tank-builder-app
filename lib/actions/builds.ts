'use server';

import { db } from '@/lib/db';
import { builds } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { AquariumBuild } from '@/types';

export async function getSavedBuilds() {
  const { userId } = await auth();
  if (!userId) return [];

  const userBuilds = await db
    .select()
    .from(builds)
    .where(eq(builds.userId, userId))
    .orderBy(desc(builds.updatedAt));

  return userBuilds.map(b => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...b.configuration as any,
    id: b.id,
    name: b.name,
  })) as AquariumBuild[];
}

export async function saveBuild(build: AquariumBuild) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const { id, name, ...configuration } = build;

  await db.insert(builds).values({
    id: id,
    userId: userId,
    name: name,
    totalCost: build.totalCost.toString(),
    stockingLevel: build.stockingLevel.toString(),
    configuration: configuration,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: builds.id,
    set: {
      name: name,
      totalCost: build.totalCost.toString(),
      stockingLevel: build.stockingLevel.toString(),
      configuration: configuration,
      updatedAt: new Date(),
    },
  });
}

export async function deleteBuild(buildId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.delete(builds).where(eq(builds.id, buildId));
}
