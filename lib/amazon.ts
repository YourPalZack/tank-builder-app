import { Tank, Equipment, Fish, Plant, Substrate, Invertebrate } from '@/types';
import { VENDORS } from './vendors';

// Simplified Amazon Item Type based on PA-API 5.0
export interface AmazonItem {
  ASIN: string;
  DetailPageURL: string;
  Images?: {
    Primary?: {
      Large?: {
        URL: string;
      };
    };
  };
  ItemInfo?: {
    Title?: {
      DisplayValue: string;
    };
    Features?: {
      DisplayValues: string[];
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
    }>;
  };
}

const extractPrice = (item: AmazonItem): number => {
  return item.Offers?.Listings?.[0]?.Price?.Amount || 0;
};

const extractImage = (item: AmazonItem): string | undefined => {
  return item.Images?.Primary?.Large?.URL;
};

const extractTitle = (item: AmazonItem): string => {
  return item.ItemInfo?.Title?.DisplayValue || 'Unknown Item';
};

const createPurchaseLink = (item: AmazonItem, price: number) => ({
  vendor: VENDORS.AMAZON,
  url: item.DetailPageURL,
  externalId: item.ASIN,
  price,
  availability: 'in-stock' as const,
  affiliate: true
});

export const mapAmazonItemToEquipment = (item: AmazonItem, category: Equipment['category']): Equipment => {
  const price = extractPrice(item);
  const title = extractTitle(item);
  
  return {
    id: `amazon-${item.ASIN}`,
    name: title,
    brand: 'Amazon Selection',
    category,
    price,
    imageUrl: extractImage(item),
    link: item.DetailPageURL,
    purchaseLinks: [createPurchaseLink(item, price)],
    // Default specs
    minTankGallons: 0,
    maxTankGallons: 0,
    watts: 0
  };
};

export const mapAmazonItemToTank = (item: AmazonItem): Tank => {
  const price = extractPrice(item);
  const title = extractTitle(item);

  return {
    id: `amazon-${item.ASIN}`,
    name: title,
    brand: 'Amazon Selection',
    dimensions: { length: 0, width: 0, height: 0 }, // User will need to fill this
    volumeGallons: 0,
    volumeLiters: 0,
    shape: 'rectangular',
    material: 'glass',
    price,
    imageUrl: extractImage(item),
    link: item.DetailPageURL,
    purchaseLinks: [createPurchaseLink(item, price)]
  };
};

export const mapAmazonItemToPlant = (item: AmazonItem): Plant => {
  const price = extractPrice(item);
  const title = extractTitle(item);

  return {
    id: `amazon-${item.ASIN}`,
    commonName: title,
    scientificName: 'Unknown',
    category: 'Planted',
    lightRequirement: 'medium',
    co2Required: false,
    co2Recommended: false,
    substrateType: 'any',
    waterParams: { tempMin: 70, tempMax: 80, phMin: 6.5, phMax: 7.5 },
    growthRate: 'medium',
    maxHeightInches: 0,
    placement: 'midground',
    incompatibleWithFish: [],
    price,
    imageUrl: extractImage(item),
    purchaseLinks: [createPurchaseLink(item, price)]
  };
};

export const mapAmazonItemToSubstrate = (item: AmazonItem): Substrate => {
  const price = extractPrice(item);
  const title = extractTitle(item);

  return {
    id: `amazon-${item.ASIN}`,
    name: title,
    brand: 'Amazon Selection',
    type: 'other',
    nutrientRich: false,
    buffersPH: false,
    poundsPerGallon: 1,
    bagSizePounds: 0,
    price,
    imageUrl: extractImage(item),
    purchaseLinks: [createPurchaseLink(item, price)]
  };
};

export const mapAmazonItemToFish = (item: AmazonItem): Fish => {
  const price = extractPrice(item);
  const title = extractTitle(item);

  return {
    id: `amazon-${item.ASIN}`,
    commonName: title,
    scientificName: 'Unknown',
    category: 'Freshwater',
    adultSizeInches: 0,
    minTankGallons: 0,
    swimmingLevel: 'middle',
    waterParams: { tempMin: 70, tempMax: 80, phMin: 6.5, phMax: 7.5, hardnessMin: 5, hardnessMax: 15 },
    temperament: 'peaceful',
    schoolingSize: 1,
    territorialRadius: 0,
    incompatibleWith: [],
    predatorOf: [],
    preyTo: [],
    nipsAtFins: false,
    incompatibleWithLongFinned: false,
    careLevel: 'intermediate',
    diet: 'omnivore',
    price,
    imageUrl: extractImage(item),
    purchaseLinks: [createPurchaseLink(item, price)]
  };
};

export const mapAmazonItemToInvertebrate = (item: AmazonItem): Invertebrate => {
  const price = extractPrice(item);
  const title = extractTitle(item);

  return {
    id: `amazon-${item.ASIN}`,
    commonName: title,
    scientificName: 'Unknown',
    category: 'Invertebrate',
    adultSizeInches: 0,
    minTankGallons: 0,
    swimmingLevel: 'bottom',
    waterParams: { tempMin: 70, tempMax: 80, phMin: 6.5, phMax: 7.5, hardnessMin: 5, hardnessMax: 15 },
    temperament: 'peaceful',
    schoolingSize: 1,
    territorialRadius: 0,
    incompatibleWith: [],
    predatorOf: [],
    preyTo: [],
    careLevel: 'intermediate',
    diet: 'omnivore',
    copperSensitive: true,
    bioload: 'low',
    plantSafe: true,
    price,
    imageUrl: extractImage(item),
    purchaseLinks: [createPurchaseLink(item, price)]
  };
};
