import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/db/schema';
import * as dotenv from 'dotenv';
import { 
  sampleTanks, 
  sampleFish, 
  samplePlants, 
  sampleInvertebrates, 
  sampleEquipment, 
  sampleSubstrate 
} from '../data/sampleData';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding Neon database...');

  try {
    // 1. Tanks
    console.log('Seeding Tanks...');
    await db.insert(schema.tanks).values(
      sampleTanks.map(t => ({
        name: t.name,
        brand: t.brand,
        dimensions: t.dimensions,
        volumeGallons: t.volumeGallons.toString(),
        volumeLiters: t.volumeLiters?.toString(),
        shape: t.shape,
        material: t.material,
        price: t.price.toString(),
        imageUrl: t.imageUrl,
      }))
    );

    // 2. Species (Fish)
    console.log('Seeding Fish...');
    await db.insert(schema.species).values(
      sampleFish.map(f => ({
        type: 'fish',
        commonName: f.commonName,
        scientificName: f.scientificName,
        category: f.category,
        subcategory: f.subcategory,
        adultSizeInches: f.adultSizeInches.toString(),
        minTankGallons: f.minTankGallons.toString(),
        swimmingLevel: f.swimmingLevel,
        waterParams: f.waterParams,
        temperament: f.temperament,
        schoolingSize: f.schoolingSize,
        territorialRadius: f.territorialRadius?.toString(),
        incompatibleWith: f.incompatibleWith,
        predatorOf: f.predatorOf,
        preyTo: f.preyTo,
        nipsAtFins: f.nipsAtFins,
        incompatibleWithLongFinned: f.incompatibleWithLongFinned,
        isLongFinned: f.isLongFinned,
        careLevel: f.careLevel,
        diet: f.diet,
        price: f.price.toString(),
        imageUrl: f.imageUrl,
      }))
    );

    // 3. Species (Invertebrates)
    console.log('Seeding Invertebrates...');
    await db.insert(schema.species).values(
      sampleInvertebrates.map(i => ({
        type: 'invertebrate',
        commonName: i.commonName,
        scientificName: i.scientificName,
        category: i.category,
        subcategory: i.subcategory,
        adultSizeInches: i.adultSizeInches.toString(),
        minTankGallons: i.minTankGallons.toString(),
        swimmingLevel: i.swimmingLevel,
        waterParams: i.waterParams,
        temperament: i.temperament,
        schoolingSize: i.schoolingSize,
        territorialRadius: i.territorialRadius?.toString(),
        incompatibleWith: i.incompatibleWith,
        predatorOf: i.predatorOf,
        preyTo: i.preyTo,
        careLevel: i.careLevel,
        diet: i.diet,
        copperSensitive: i.copperSensitive,
        bioload: i.bioload,
        plantSafe: i.plantSafe,
        price: i.price.toString(),
        imageUrl: i.imageUrl,
      }))
    );

    // 4. Plants
    console.log('Seeding Plants...');
    await db.insert(schema.plants).values(
      samplePlants.map(p => ({
        commonName: p.commonName,
        scientificName: p.scientificName,
        category: p.category,
        lightRequirement: p.lightRequirement,
        co2Required: p.co2Required,
        co2Recommended: p.co2Recommended,
        substrateType: p.substrateType,
        waterParams: p.waterParams,
        growthRate: p.growthRate,
        maxHeightInches: p.maxHeightInches.toString(),
        placement: p.placement,
        incompatibleWithFish: p.incompatibleWithFish,
        price: p.price.toString(),
        imageUrl: p.imageUrl,
      }))
    );

    // 5. Equipment
    console.log('Seeding Equipment...');
    await db.insert(schema.equipment).values(
      sampleEquipment.map(e => ({
        name: e.name,
        brand: e.brand,
        category: e.category,
        price: e.price.toString(),
        minTankGallons: e.minTankGallons?.toString(),
        maxTankGallons: e.maxTankGallons?.toString(),
        flowRateGph: e.flowRateGPH?.toString(),
        watts: e.watts?.toString(),
        lumens: e.lumens?.toString(),

        lengthInches: e.lengthInches?.toString(),
        filterType: e.filterType,
        imageUrl: e.imageUrl,
      }))
    );

    // 6. Substrates
    console.log('Seeding Substrates...');
    await db.insert(schema.substrates).values(
      sampleSubstrate.map(s => ({
        name: s.name,
        brand: s.brand,
        type: s.type,
        nutrientRich: s.nutrientRich,
        buffersPh: s.buffersPH,
        buffersTo: s.buffersTo?.toString(),
        grainSizeMm: s.grainSizeMM?.toString(),
        color: s.color,

        poundsPerGallon: s.poundsPerGallon.toString(),
        bagSizePounds: s.bagSizePounds.toString(),
        price: s.price.toString(),
        imageUrl: s.imageUrl,
      }))
    );

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
