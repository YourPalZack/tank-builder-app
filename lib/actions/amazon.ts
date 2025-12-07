'use server';

import { db } from '@/lib/db';
import { tanks, species, plants, equipment, substrates } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { Tank, Fish, Invertebrate, Plant, Equipment, Substrate } from '@/types';

export async function saveAmazonTank(tank: Tank) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.insert(tanks).values({
    userId: userId,
    name: tank.name,
    brand: tank.brand,
    dimensions: tank.dimensions,
    volumeGallons: tank.volumeGallons.toString(),
    volumeLiters: tank.volumeLiters?.toString(),
    shape: tank.shape,
    material: tank.material,
    price: tank.price.toString(),
    imageUrl: tank.imageUrl,
    link: tank.link,
    purchaseLinks: tank.purchaseLinks,
  });
}

export async function saveAmazonFish(fish: Fish) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.insert(species).values({
    userId: userId,
    type: 'fish',
    commonName: fish.commonName,
    scientificName: fish.scientificName,
    category: fish.category,
    subcategory: fish.subcategory,
    adultSizeInches: fish.adultSizeInches.toString(),
    minTankGallons: fish.minTankGallons.toString(),
    swimmingLevel: fish.swimmingLevel,
    waterParams: fish.waterParams,
    temperament: fish.temperament,
    schoolingSize: fish.schoolingSize,
    territorialRadius: fish.territorialRadius?.toString(),
    incompatibleWith: fish.incompatibleWith,
    predatorOf: fish.predatorOf,
    preyTo: fish.preyTo,
    nipsAtFins: fish.nipsAtFins,
    incompatibleWithLongFinned: fish.incompatibleWithLongFinned,
    isLongFinned: fish.isLongFinned,
    careLevel: fish.careLevel,
    diet: fish.diet,
    price: fish.price.toString(),
    imageUrl: fish.imageUrl,
    link: fish.link,
    purchaseLinks: fish.purchaseLinks,
  });
}

export async function saveAmazonInvertebrate(invert: Invertebrate) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.insert(species).values({
    userId: userId,
    type: 'invertebrate',
    commonName: invert.commonName,
    scientificName: invert.scientificName,
    category: invert.category,
    subcategory: invert.subcategory,
    adultSizeInches: invert.adultSizeInches.toString(),
    minTankGallons: invert.minTankGallons.toString(),
    swimmingLevel: invert.swimmingLevel,
    waterParams: invert.waterParams,
    temperament: invert.temperament,
    schoolingSize: invert.schoolingSize,
    territorialRadius: invert.territorialRadius?.toString(),
    incompatibleWith: invert.incompatibleWith,
    predatorOf: invert.predatorOf,
    preyTo: invert.preyTo,
    careLevel: invert.careLevel,
    diet: invert.diet,
    copperSensitive: invert.copperSensitive,
    bioload: invert.bioload,
    plantSafe: invert.plantSafe,
    price: invert.price.toString(),
    imageUrl: invert.imageUrl,
    link: invert.link,
    purchaseLinks: invert.purchaseLinks,
  });
}

export async function saveAmazonPlant(plant: Plant) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.insert(plants).values({
    userId: userId,
    commonName: plant.commonName,
    scientificName: plant.scientificName,
    category: plant.category,
    lightRequirement: plant.lightRequirement,
    co2Required: plant.co2Required,
    co2Recommended: plant.co2Recommended,
    substrateType: plant.substrateType,
    waterParams: plant.waterParams,
    growthRate: plant.growthRate,
    maxHeightInches: plant.maxHeightInches.toString(),
    placement: plant.placement,
    incompatibleWithFish: plant.incompatibleWithFish,
    price: plant.price.toString(),
    imageUrl: plant.imageUrl,
    link: plant.link,
    purchaseLinks: plant.purchaseLinks,
  });
}

export async function saveAmazonEquipment(item: Equipment) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.insert(equipment).values({
    userId: userId,
    name: item.name,
    brand: item.brand,
    category: item.category,
    price: item.price.toString(),
    minTankGallons: item.minTankGallons?.toString(),
    maxTankGallons: item.maxTankGallons?.toString(),
    flowRateGph: item.flowRateGPH?.toString(),
    watts: item.watts?.toString(),
    lumens: item.lumens?.toString(),
    lengthInches: item.lengthInches?.toString(),
    filterType: item.filterType,
    imageUrl: item.imageUrl,
    link: item.link,
    purchaseLinks: item.purchaseLinks,
  });
}

export async function saveAmazonSubstrate(item: Substrate) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.insert(substrates).values({
    userId: userId,
    name: item.name,
    brand: item.brand,
    type: item.type,
    nutrientRich: item.nutrientRich,
    buffersPh: item.buffersPH,
    buffersTo: item.buffersTo?.toString(),
    grainSizeMm: item.grainSizeMM?.toString(),
    color: item.color,
    poundsPerGallon: item.poundsPerGallon.toString(),
    bagSizePounds: item.bagSizePounds.toString(),
    price: item.price.toString(),
    imageUrl: item.imageUrl,
    link: item.link,
    purchaseLinks: item.purchaseLinks,
  });
}
