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
