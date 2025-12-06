export const VENDORS = {
  AMAZON: 'Amazon',
  DANS_FISH: "Dan's Fish",
  AQUA_HUNA: 'Aqua Huna',
  FLIP_AQUATICS: 'Flip Aquatics',
} as const;

export type VendorKey = keyof typeof VENDORS;

export const vendorDisplayNames: Record<VendorKey, string> = {
  AMAZON: 'Amazon',
  DANS_FISH: "Dan's Fish",
  AQUA_HUNA: 'Aqua Huna',
  FLIP_AQUATICS: 'Flip Aquatics',
};
