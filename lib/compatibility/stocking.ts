import { Tank, Fish, Invertebrate } from '@/types';

export function calculateStockingLevel(
  tank: Tank | null,
  fish: { item: Fish; quantity: number }[],
  inverts: { item: Invertebrate; quantity: number }[]
): number {
  if (!tank) return 0;

  let totalBioload = 0;

  fish.forEach(({ item, quantity }) => {
    // Basic heuristic: 1 inch = 1 bioload unit.
    // Adjust for body mass/waste.
    let factor = 1.0;
    // Large fish produce exponentially more waste
    if (item.adultSizeInches > 12) factor = 3.0;
    else if (item.adultSizeInches > 6) factor = 2.0;
    else if (item.adultSizeInches > 4) factor = 1.5;
    
    // Goldfish/Plecos are messy (if we had a 'messy' flag, we'd use it).
    // For now, rely on size.
    
    totalBioload += item.adultSizeInches * quantity * factor;
  });

  inverts.forEach(({ item, quantity }) => {
    let factor = 0.1;
    if (item.bioload === 'medium') factor = 0.5;
    if (item.bioload === 'low') factor = 0.2;
    
    totalBioload += item.adultSizeInches * quantity * factor;
  });

  // Base capacity is tank volume
  const capacity = tank.volumeGallons;

  // Filter adjustment: If filter is powerful, we might allow slightly higher stocking,
  // but usually it's safer not to.
  // However, if filter is UNDERSIZED, stocking level effectively rises because waste isn't processed.
  // Let's keep it simple: Stocking % is purely Biological Load vs Water Volume.
  // Filter adequacy is a separate check.

  if (capacity === 0) return 0;

  return Math.round((totalBioload / capacity) * 100);
}
