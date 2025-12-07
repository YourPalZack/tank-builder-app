import { pgTable, uuid, text, decimal, json, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

// 1. Tanks Table
export const tanks = pgTable('tanks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'), // Clerk User ID
  name: text('name').notNull(),
  brand: text('brand'),
  dimensions: json('dimensions').notNull(), // { length, width, height }
  volumeGallons: decimal('volume_gallons').notNull(),
  volumeLiters: decimal('volume_liters'),
  shape: text('shape'),
  material: text('material'),
  price: decimal('price'),
  imageUrl: text('image_url'),
  link: text('link'),
  purchaseLinks: json('purchase_links'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Species Table
export const species = pgTable('species', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  type: text('type').notNull(), // 'fish' | 'invertebrate'
  commonName: text('common_name').notNull(),
  scientificName: text('scientific_name'),
  category: text('category'),
  subcategory: text('subcategory'),
  adultSizeInches: decimal('adult_size_inches'),
  minTankGallons: decimal('min_tank_gallons'),
  swimmingLevel: text('swimming_level'),
  waterParams: json('water_params'),
  temperament: text('temperament'),
  schoolingSize: integer('schooling_size').default(1),
  territorialRadius: decimal('territorial_radius').default('0'),
  incompatibleWith: text('incompatible_with').array(),
  predatorOf: text('predator_of').array(),
  preyTo: text('prey_to').array(),
  nipsAtFins: boolean('nips_at_fins').default(false),
  incompatibleWithLongFinned: boolean('incompatible_with_long_finned').default(false),
  isLongFinned: boolean('is_long_finned').default(false),
  careLevel: text('care_level'),
  diet: text('diet'),
  copperSensitive: boolean('copper_sensitive').default(false),
  bioload: text('bioload'),
  plantSafe: boolean('plant_safe').default(true),
  price: decimal('price'),
  imageUrl: text('image_url'),
  link: text('link'),
  purchaseLinks: json('purchase_links'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Plants Table
export const plants = pgTable('plants', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  commonName: text('common_name').notNull(),
  scientificName: text('scientific_name'),
  category: text('category'),
  lightRequirement: text('light_requirement'),
  co2Required: boolean('co2_required').default(false),
  co2Recommended: boolean('co2_recommended').default(false),
  substrateType: text('substrate_type'),
  waterParams: json('water_params'),
  growthRate: text('growth_rate'),
  maxHeightInches: decimal('max_height_inches'),
  placement: text('placement'),
  incompatibleWithFish: text('incompatible_with_fish').array(),
  price: decimal('price'),
  imageUrl: text('image_url'),
  link: text('link'),
  purchaseLinks: json('purchase_links'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Equipment Table
export const equipment = pgTable('equipment', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  name: text('name').notNull(),
  brand: text('brand'),
  category: text('category').notNull(),
  price: decimal('price'),
  minTankGallons: decimal('min_tank_gallons'),
  maxTankGallons: decimal('max_tank_gallons'),
  flowRateGph: decimal('flow_rate_gph'),
  watts: decimal('watts'),
  lumens: decimal('lumens'),
  lengthInches: decimal('length_inches'),
  filterType: text('filter_type'),
  imageUrl: text('image_url'),
  link: text('link'),
  purchaseLinks: json('purchase_links'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Substrates Table
export const substrates = pgTable('substrates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  name: text('name').notNull(),
  brand: text('brand'),
  type: text('type'),
  nutrientRich: boolean('nutrient_rich').default(false),
  buffersPh: boolean('buffers_ph').default(false),
  buffersTo: decimal('buffers_to'),
  grainSizeMm: decimal('grain_size_mm'),
  color: text('color'),
  poundsPerGallon: decimal('pounds_per_gallon'),
  bagSizePounds: decimal('bag_size_pounds'),
  price: decimal('price'),
  imageUrl: text('image_url'),
  link: text('link'),
  purchaseLinks: json('purchase_links'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Builds Table
export const builds = pgTable('builds', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  totalCost: decimal('total_cost').default('0'),
  stockingLevel: decimal('stocking_level').default('0'),
  configuration: json('configuration').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
