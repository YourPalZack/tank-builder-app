import { VENDORS } from './vendors';
import type { PurchaseLink } from '@/types/purchasing';
import type { Equipment, Fish, Plant, Substrate, Invertebrate } from '@/types';

const getAmazonTag = () => process.env.NEXT_PUBLIC_AMAZON_TAG;

const appendAffiliateTag = (url: string): string => {
  const tag = getAmazonTag();
  if (!tag) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tag=${encodeURIComponent(tag)}`;
};

export const buildAmazonSearchUrl = (query: string): string => {
  const base = 'https://www.amazon.com/s';
  const params = new URLSearchParams({ k: query });
  return appendAffiliateTag(`${base}?${params.toString()}`);
};

export const buildDansFishSearchUrl = (scientificName: string): string => {
  const base = 'https://www.dansfish.com/search';
  const params = new URLSearchParams({ q: scientificName });
  return `${base}?${params.toString()}`;
};

export const buildAquaHunaSearchUrl = (scientificName: string): string => {
  const base = 'https://aquahuna.com/search';
  const params = new URLSearchParams({ q: scientificName });
  return `${base}?${params.toString()}`;
};

export const buildFlipAquaticsSearchUrl = (scientificName: string): string => {
  const base = 'https://flipaquatics.com/search';
  const params = new URLSearchParams({ q: scientificName });
  return `${base}?${params.toString()}`;
};

export const getEquipmentPurchaseLinks = (item: Equipment): PurchaseLink[] => {
  const query = `${item.brand || ''} ${item.name}`.trim();
  const links: PurchaseLink[] = [];

  links.push({
    vendor: VENDORS.AMAZON,
    url: buildAmazonSearchUrl(query),
    affiliate: true,
  });

  return item.purchaseLinks?.length ? item.purchaseLinks : links;
};

export const getFishPurchaseLinks = (item: Fish): PurchaseLink[] => {
  const links: PurchaseLink[] = [];

  // Dan's Fish
  links.push({
    vendor: VENDORS.DANS_FISH,
    url: buildDansFishSearchUrl(item.scientificName),
  });

  // Aqua Huna
  links.push({
    vendor: VENDORS.AQUA_HUNA,
    url: buildAquaHunaSearchUrl(item.scientificName),
  });

  // Flip Aquatics
  links.push({
    vendor: VENDORS.FLIP_AQUATICS,
    url: buildFlipAquaticsSearchUrl(item.scientificName),
  });

  return item.purchaseLinks?.length ? item.purchaseLinks : links;
};

export const getPlantPurchaseLinks = (item: Plant): PurchaseLink[] => {
  const query = `${item.scientificName} aquarium plant`.trim();
  const links: PurchaseLink[] = [];

  links.push({
    vendor: VENDORS.AMAZON,
    url: buildAmazonSearchUrl(query),
    affiliate: true,
  });

  return item.purchaseLinks?.length ? item.purchaseLinks : links;
};

export const getSubstratePurchaseLinks = (item: Substrate): PurchaseLink[] => {
  const query = `${item.brand || ''} ${item.name} substrate`.trim();
  const links: PurchaseLink[] = [];

  links.push({
    vendor: VENDORS.AMAZON,
    url: buildAmazonSearchUrl(query),
    affiliate: true,
  });

  return item.purchaseLinks?.length ? item.purchaseLinks : links;
};

export const getInvertebratePurchaseLinks = (item: Invertebrate): PurchaseLink[] => {
  const links: PurchaseLink[] = [];

  // Try specialty vendors first
  links.push({
    vendor: VENDORS.DANS_FISH,
    url: buildDansFishSearchUrl(item.scientificName),
  });

  links.push({
    vendor: VENDORS.FLIP_AQUATICS,
    url: buildFlipAquaticsSearchUrl(item.scientificName),
  });

  // Also Amazon
  links.push({
    vendor: VENDORS.AMAZON,
    url: buildAmazonSearchUrl(`${item.scientificName} aquarium shrimp snail`),
    affiliate: true,
  });

  return item.purchaseLinks?.length ? item.purchaseLinks : links;
};

export const filterAndSortPurchaseLinks = (
  links: PurchaseLink[],
  preferredVendors: string[]
): PurchaseLink[] => {
  if (!links.length) return [];

  const preferredSet = new Set(preferredVendors);

  return [...links].sort((a, b) => {
    const aPreferred = preferredSet.has(a.vendor);
    const bPreferred = preferredSet.has(b.vendor);

    if (aPreferred && !bPreferred) return -1;
    if (!aPreferred && bPreferred) return 1;
    return 0;
  });
};
