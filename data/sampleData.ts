import { Tank, Fish, Plant, Invertebrate, Equipment, Substrate } from '@/types';

export const sampleTanks: Tank[] = [
  {
    id: 'tank-1',
    name: 'Standard 20 Gallon High',
    brand: 'Aqueon',
    dimensions: { length: 24, width: 12, height: 16 },
    volumeGallons: 20,
    volumeLiters: 75,
    shape: 'rectangular',
    material: 'glass',
    price: 49.99,
    imageUrl: '/images/tank-20g.png'
  },
  {
    id: 'tank-2',
    name: 'Fluval Flex 32.5',
    brand: 'Fluval',
    dimensions: { length: 32.5, width: 15.7, height: 15.4 },
    volumeGallons: 32.5,
    volumeLiters: 123,
    shape: 'bow-front',
    material: 'glass',
    price: 349.99,
    imageUrl: '/images/fluval-flex.png'
  }
];

export const sampleFish: Fish[] = [
  {
    id: 'fish-1',
    commonName: 'Neon Tetra',
    scientificName: 'Paracheirodon innesi',
    category: 'Freshwater',
    subcategory: 'Tetra',
    adultSizeInches: 1.5,
    minTankGallons: 10,
    swimmingLevel: 'middle',
    waterParams: { tempMin: 70, tempMax: 81, phMin: 6.0, phMax: 7.5, hardnessMin: 2, hardnessMax: 10 },
    temperament: 'peaceful',
    schoolingSize: 6,
    territorialRadius: 0,
    incompatibleWith: [],
    predatorOf: [],
    preyTo: ['fish-3'], // Angelfish
    nipsAtFins: false,
    incompatibleWithLongFinned: false,
    careLevel: 'beginner',
    diet: 'omnivore',
    price: 3.99,
    imageUrl: '/images/neon-tetra.png'
  },
  {
    id: 'fish-2',
    commonName: 'Betta',
    scientificName: 'Betta splendens',
    category: 'Freshwater',
    subcategory: 'Labyrinth',
    adultSizeInches: 2.5,
    minTankGallons: 5,
    swimmingLevel: 'top',
    waterParams: { tempMin: 75, tempMax: 82, phMin: 6.5, phMax: 7.5, hardnessMin: 5, hardnessMax: 20 },
    temperament: 'semi-aggressive',
    schoolingSize: 1,
    territorialRadius: 12,
    incompatibleWith: ['fish-2'], // Other Bettas
    predatorOf: [],
    preyTo: [],
    nipsAtFins: false,
    incompatibleWithLongFinned: false,
    isLongFinned: true,
    careLevel: 'beginner',
    diet: 'carnivore',
    price: 9.99,
    imageUrl: '/images/betta.png'
  },
  {
    id: 'fish-3',
    commonName: 'Angelfish',
    scientificName: 'Pterophyllum scalare',
    category: 'Freshwater',
    subcategory: 'Cichlid',
    adultSizeInches: 6,
    minTankGallons: 29,
    swimmingLevel: 'middle',
    waterParams: { tempMin: 76, tempMax: 82, phMin: 6.5, phMax: 7.5, hardnessMin: 5, hardnessMax: 12 },
    temperament: 'semi-aggressive',
    schoolingSize: 1, // Can be schooled but okay alone/pairs
    territorialRadius: 18,
    incompatibleWith: [],
    predatorOf: ['fish-1'], // Neons
    preyTo: [],
    nipsAtFins: false,
    incompatibleWithLongFinned: false,
    careLevel: 'intermediate',
    diet: 'omnivore',
    price: 14.99,
    imageUrl: '/images/angelfish.png'
  }
];

export const samplePlants: Plant[] = [
  {
    id: 'plant-1',
    commonName: 'Java Fern',
    scientificName: 'Microsorum pteropus',
    category: 'Fern',
    lightRequirement: 'low',
    co2Required: false,
    co2Recommended: false,
    substrateType: 'wood/rock',
    waterParams: { tempMin: 60, tempMax: 83, phMin: 6.0, phMax: 7.5 },
    growthRate: 'slow',
    maxHeightInches: 13,
    placement: 'midground',
    incompatibleWithFish: [],
    price: 8.99,
    imageUrl: '/images/java-fern.png'
  }
];

export const sampleInvertebrates: Invertebrate[] = [
  {
    id: 'invert-1',
    commonName: 'Cherry Shrimp',
    scientificName: 'Neocaridina davidi',
    category: 'Freshwater',
    subcategory: 'Shrimp',
    adultSizeInches: 1,
    minTankGallons: 2,
    swimmingLevel: 'bottom',
    waterParams: { tempMin: 65, tempMax: 80, phMin: 6.5, phMax: 8.0, hardnessMin: 6, hardnessMax: 15 },
    temperament: 'peaceful',
    schoolingSize: 5,
    territorialRadius: 0,
    incompatibleWith: ['fish-3', 'fish-2'], // Angelfish, Betta (sometimes)
    predatorOf: [],
    preyTo: ['fish-3', 'fish-2'],
    careLevel: 'beginner',
    diet: 'omnivore',
    copperSensitive: true,
    bioload: 'minimal',
    plantSafe: true,
    price: 3.99,
    imageUrl: '/images/cherry-shrimp.png'
  },
  {
    id: 'invert-2',
    commonName: 'Nerite Snail',
    scientificName: 'Neritina natalensis',
    category: 'Freshwater',
    subcategory: 'Snail',
    adultSizeInches: 1,
    minTankGallons: 5,
    swimmingLevel: 'all',
    waterParams: { tempMin: 72, tempMax: 78, phMin: 7.5, phMax: 8.5, hardnessMin: 8, hardnessMax: 20 },
    temperament: 'peaceful',
    schoolingSize: 1,
    territorialRadius: 0,
    incompatibleWith: [],
    predatorOf: [],
    preyTo: [],
    careLevel: 'beginner',
    diet: 'herbivore',
    copperSensitive: true,
    bioload: 'low',
    plantSafe: true,
    price: 2.99,
    imageUrl: '/images/nerite-snail.png'
  }
];

export const sampleEquipment: Equipment[] = [
  {
    id: 'filter-1',
    name: 'AquaClear 20',
    brand: 'Fluval',
    category: 'Filter',
    price: 29.99,
    minTankGallons: 5,
    maxTankGallons: 20,
    flowRateGPH: 100,
    filterType: 'Hang-on-Back',
    imageUrl: '/images/aquaclear-20.png'
  },
  {
    id: 'filter-2',
    name: 'Fluval 207 Performance Canister Filter',
    brand: 'Fluval',
    category: 'Filter',
    price: 119.99,
    minTankGallons: 20,
    maxTankGallons: 45,
    flowRateGPH: 206,
    filterType: 'Canister',
    imageUrl: '/images/fluval-207.png'
  },
  {
    id: 'heater-1',
    name: 'Eheim Jager 50W',
    brand: 'Eheim',
    category: 'Heater',
    price: 24.99,
    minTankGallons: 5,
    maxTankGallons: 15,
    watts: 50,
    imageUrl: '/images/eheim-50w.png'
  },
  {
    id: 'heater-2',
    name: 'Eheim Jager 100W',
    brand: 'Eheim',
    category: 'Heater',
    price: 29.99,
    minTankGallons: 15,
    maxTankGallons: 30,
    watts: 100,
    imageUrl: '/images/eheim-100w.png'
  },
  {
    id: 'light-1',
    name: 'Fluval Plant 3.0 LED - 24"',
    brand: 'Fluval',
    category: 'Light',
    price: 139.99,
    minTankGallons: 15,
    maxTankGallons: 30,
    watts: 32,
    lumens: 2350,
    lengthInches: 24,
    imageUrl: '/images/fluval-plant-3.0.png'
  }
];

export const sampleSubstrate: Substrate[] = [
  {
    id: 'sub-1',
    name: 'Eco-Complete Planted',
    brand: 'CaribSea',
    type: 'soil',
    nutrientRich: true,
    buffersPH: false,
    poundsPerGallon: 1.5,
    bagSizePounds: 20,
    price: 29.99,
    imageUrl: '/images/eco-complete.png'
  },
  {
    id: 'sub-2',
    name: 'Super Naturals Sand',
    brand: 'CaribSea',
    type: 'sand',
    nutrientRich: false,
    buffersPH: true,
    buffersTo: 7.0,
    grainSizeMM: 0.5,
    color: 'Sunset Gold',
    poundsPerGallon: 1.5,
    bagSizePounds: 20,
    price: 24.99,
    imageUrl: '/images/super-naturals.png'
  }
];
