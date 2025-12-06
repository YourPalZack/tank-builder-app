import { PurchasableItem } from './purchasing';

export type WaterParams = {
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
  hardnessMin: number;
  hardnessMax: number;
};

export interface Tank extends PurchasableItem {
  id: string;
  name: string;
  brand?: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  volumeGallons: number;
  volumeLiters: number;
  shape: 'rectangular' | 'cube' | 'bow-front' | 'cylinder' | 'other';
  material: 'glass' | 'acrylic';
  price: number;
  imageUrl?: string;
  link?: string;
}

export type SwimmingLevel = 'top' | 'middle' | 'bottom' | 'all';
export type Temperament = 'peaceful' | 'semi-aggressive' | 'aggressive';
export type Diet = 'carnivore' | 'herbivore' | 'omnivore';
export type CareLevel = 'beginner' | 'intermediate' | 'expert';

export interface Fish extends PurchasableItem {
  id: string;
  commonName: string;
  scientificName: string;
  category: string; // e.g., "Freshwater", "Cichlid"
  subcategory?: string;
  adultSizeInches: number;
  minTankGallons: number;
  swimmingLevel: SwimmingLevel;
  waterParams: WaterParams;
  temperament: Temperament;
  schoolingSize: number; // 1 for solitary
  territorialRadius: number; // 0 for non-territorial
  incompatibleWith: string[]; // IDs or categories
  predatorOf: string[];
  preyTo: string[];
  nipsAtFins: boolean;
  incompatibleWithLongFinned: boolean;
  isLongFinned?: boolean;
  careLevel: CareLevel;
  diet: Diet;
  specialNeeds?: string;
  price: number;
  imageUrl?: string;
}

export interface Invertebrate extends Omit<Fish, 'nipsAtFins' | 'incompatibleWithLongFinned'> {
  copperSensitive: boolean;
  bioload: 'minimal' | 'low' | 'medium';
  plantSafe: boolean;
}

export type LightRequirement = 'low' | 'medium' | 'high' | 'very-high';
export type PlantPlacement = 'foreground' | 'midground' | 'background' | 'floating';

export interface Plant extends PurchasableItem {
  id: string;
  commonName: string;
  scientificName: string;
  category: string;
  lightRequirement: LightRequirement;
  co2Required: boolean;
  co2Recommended: boolean;
  substrateType: 'any' | 'nutrient-rich' | 'sand' | 'gravel' | 'wood/rock';
  waterParams: Pick<WaterParams, 'tempMin' | 'tempMax' | 'phMin' | 'phMax'>;
  growthRate: 'slow' | 'medium' | 'fast';
  maxHeightInches: number;
  placement: PlantPlacement;
  incompatibleWithFish: string[];
  price: number;
  imageUrl?: string;
}

export type EquipmentCategory = 'Filter' | 'Heater' | 'Light' | 'CO2' | 'AirPump' | 'Other';

export interface Equipment extends PurchasableItem {
  id: string;
  name: string;
  brand?: string;
  category: EquipmentCategory;
  price: number;
  imageUrl?: string;
  link?: string;
  // Specific specs
  minTankGallons?: number;
  maxTankGallons?: number;
  flowRateGPH?: number; // Filter/Pump
  watts?: number; // Heater/Light
  lumens?: number; // Light
  lengthInches?: number; // Light
  filterType?: string; // Filter
}

export interface Substrate extends PurchasableItem {
  id: string;
  name: string;
  brand?: string;
  type: 'sand' | 'gravel' | 'soil' | 'other';
  nutrientRich: boolean;
  buffersPH: boolean;
  buffersTo?: number;
  grainSizeMM?: number;
  color?: string;
  poundsPerGallon: number;
  bagSizePounds: number;
  price: number;
  imageUrl?: string;
}

export interface BuildItem<T> {
  item: T;
  quantity: number;
}

export interface AquariumBuild {
  id: string;
  name: string;
  tank: Tank | null;
  fish: BuildItem<Fish>[];
  inverts: BuildItem<Invertebrate>[];
  plants: BuildItem<Plant>[];
  equipment: {
    filter: Equipment | null;
    heater: Equipment | null;
    light: Equipment | null;
    co2: Equipment | null;
    airPump: Equipment | null;
    other: Equipment[];
  };
  substrate: Substrate | null;
  substrateBags: number;
  totalCost: number;
  stockingLevel: number; // Percentage
  warnings: CompatibilityIssue[];
  targetParams?: {
    temp: [number, number];
    ph: [number, number];
    hardness: [number, number];
  };
}

export type IssueSeverity = 'info' | 'warning' | 'error';

export interface CompatibilityIssue {
  id: string;
  severity: IssueSeverity;
  category: 'water' | 'space' | 'aggression' | 'equipment' | 'other';
  title: string;
  description: string;
  affectedItems: string[]; // IDs or names
  suggestion?: string;
}
