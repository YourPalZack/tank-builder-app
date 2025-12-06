import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Ideally use SERVICE_ROLE_KEY for seeding to bypass RLS, but ANON works if policies allow public insert (which they don't for user_id=null). 
// Wait, my policies say "Public items are visible to everyone" but don't allow insert for user_id=null.
// I need a SERVICE_ROLE_KEY to insert public items.
// For now, I will assume the user has the service role key or I will update the script to use it if provided.

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

// Use service role key if available for bypassing RLS, otherwise use anon key (which might fail for public items)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Seeding database...');

  // 1. Tanks
  console.log('Seeding Tanks...');
  const { error: tankError } = await supabase.from('tanks').upsert(
    sampleTanks.map(t => ({
      name: t.name,
      brand: t.brand,
      dimensions: t.dimensions,
      volume_gallons: t.volumeGallons,
      volume_liters: t.volumeLiters,
      shape: t.shape,
      material: t.material,
      price: t.price,
      image_url: t.imageUrl,
      // Map other fields if necessary
    }))
  );
  if (tankError) console.error('Error seeding tanks:', tankError);

  // 2. Species (Fish)
  console.log('Seeding Fish...');
  const { error: fishError } = await supabase.from('species').upsert(
    sampleFish.map(f => ({
      type: 'fish',
      common_name: f.commonName,
      scientific_name: f.scientificName,
      category: f.category,
      subcategory: f.subcategory,
      adult_size_inches: f.adultSizeInches,
      min_tank_gallons: f.minTankGallons,
      swimming_level: f.swimmingLevel,
      water_params: f.waterParams,
      temperament: f.temperament,
      schooling_size: f.schoolingSize,
      territorial_radius: f.territorialRadius,
      incompatible_with: f.incompatibleWith,
      predator_of: f.predatorOf,
      prey_to: f.preyTo,
      nips_at_fins: f.nipsAtFins,
      incompatible_with_long_finned: f.incompatibleWithLongFinned,
      is_long_finned: f.isLongFinned,
      care_level: f.careLevel,
      diet: f.diet,
      price: f.price,
      image_url: f.imageUrl,
    }))
  );
  if (fishError) console.error('Error seeding fish:', fishError);

  // 3. Species (Invertebrates)
  console.log('Seeding Invertebrates...');
  const { error: invertError } = await supabase.from('species').upsert(
    sampleInvertebrates.map(i => ({
      type: 'invertebrate',
      common_name: i.commonName,
      scientific_name: i.scientificName,
      category: i.category,
      subcategory: i.subcategory,
      adult_size_inches: i.adultSizeInches,
      min_tank_gallons: i.minTankGallons,
      swimming_level: i.swimmingLevel,
      water_params: i.waterParams,
      temperament: i.temperament,
      schooling_size: i.schoolingSize,
      territorial_radius: i.territorialRadius,
      incompatible_with: i.incompatibleWith,
      predator_of: i.predatorOf,
      prey_to: i.preyTo,
      care_level: i.careLevel,
      diet: i.diet,
      copper_sensitive: i.copperSensitive,
      bioload: i.bioload,
      plant_safe: i.plantSafe,
      price: i.price,
      image_url: i.imageUrl,
    }))
  );
  if (invertError) console.error('Error seeding invertebrates:', invertError);

  // 4. Plants
  console.log('Seeding Plants...');
  const { error: plantError } = await supabase.from('plants').upsert(
    samplePlants.map(p => ({
      common_name: p.commonName,
      scientific_name: p.scientificName,
      category: p.category,
      light_requirement: p.lightRequirement,
      co2_required: p.co2Required,
      co2_recommended: p.co2Recommended,
      substrate_type: p.substrateType,
      water_params: p.waterParams,
      growth_rate: p.growthRate,
      max_height_inches: p.maxHeightInches,
      placement: p.placement,
      incompatible_with_fish: p.incompatibleWithFish,
      price: p.price,
      image_url: p.imageUrl,
    }))
  );
  if (plantError) console.error('Error seeding plants:', plantError);

  // 5. Equipment
  console.log('Seeding Equipment...');
  const { error: equipError } = await supabase.from('equipment').upsert(
    sampleEquipment.map(e => ({
      name: e.name,
      brand: e.brand,
      category: e.category,
      price: e.price,
      min_tank_gallons: e.minTankGallons,
      max_tank_gallons: e.maxTankGallons,
      flow_rate_gph: e.flowRateGPH,
      watts: e.watts,
      lumens: e.lumens,
      length_inches: e.lengthInches,
      filter_type: e.filterType,
      image_url: e.imageUrl,
    }))
  );
  if (equipError) console.error('Error seeding equipment:', equipError);

  // 6. Substrates
  console.log('Seeding Substrates...');
  const { error: subError } = await supabase.from('substrates').upsert(
    sampleSubstrate.map(s => ({
      name: s.name,
      brand: s.brand,
      type: s.type,
      nutrient_rich: s.nutrientRich,
      buffers_ph: s.buffersPH,
      buffers_to: s.buffersTo,
      grain_size_mm: s.grainSizeMM,
      color: s.color,
      pounds_per_gallon: s.poundsPerGallon,
      bag_size_pounds: s.bagSizePounds,
      price: s.price,
      image_url: s.imageUrl,
    }))
  );
  if (subError) console.error('Error seeding substrates:', subError);

  console.log('Seeding complete!');
}

seed();
