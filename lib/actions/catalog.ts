'use server';

import { db } from '@/lib/db';
import { tanks, species, plants, equipment, substrates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getTanks() {
  return await db.select().from(tanks);
}

export async function getFish() {
  return await db.select().from(species).where(eq(species.type, 'fish'));
}

export async function getInvertebrates() {
  return await db.select().from(species).where(eq(species.type, 'invertebrate'));
}

export async function getPlants() {
  return await db.select().from(plants);
}

export async function getEquipment() {
  return await db.select().from(equipment);
}

export async function getSubstrates() {
  return await db.select().from(substrates);
}
