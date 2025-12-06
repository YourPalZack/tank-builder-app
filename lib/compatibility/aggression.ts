import { Fish, Invertebrate, CompatibilityIssue } from '@/types';

export function checkAggression(
  fish: { item: Fish; quantity: number }[],
  inverts: { item: Invertebrate; quantity: number }[]
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  // Combine lists, keeping track of type if needed, but they share common fields
  const allItems = [...fish, ...inverts];

  // 1. Schooling Checks (Fish only)
  fish.forEach(({ item, quantity }) => {
    if (quantity < item.schoolingSize) {
      issues.push({
        id: `schooling-${item.id}`,
        severity: 'warning',
        category: 'aggression',
        title: 'Schooling Group Too Small',
        description: `${item.commonName} prefers a group of at least ${item.schoolingSize}. Current: ${quantity}.`,
        affectedItems: [item.id],
        suggestion: `Add ${item.schoolingSize - quantity} more ${item.commonName}.`
      });
    }
  });

  // 2. Pairwise Checks
  for (let i = 0; i < allItems.length; i++) {
    for (let j = 0; j < allItems.length; j++) {
      if (i === j) continue;
      
      const a = allItems[i].item;
      const b = allItems[j].item;
      
      // Avoid duplicate reports for the same pair if possible, but directional checks matter.
      // e.g. A eats B.
      
      // Check explicit incompatibility
      if (a.incompatibleWith.includes(b.id) || a.incompatibleWith.includes(b.category)) {
         // Check if we already added this pair?
         // For now, just add it.
         issues.push({
          id: `incomp-${a.id}-${b.id}`,
          severity: 'error',
          category: 'aggression',
          title: 'Incompatible Species',
          description: `${a.commonName} is listed as incompatible with ${b.commonName}.`,
          affectedItems: [a.id, b.id]
        });
      }

      // Check Predator
      if (a.predatorOf.includes(b.id) || a.predatorOf.includes(b.category)) {
         issues.push({
          id: `predator-${a.id}-${b.id}`,
          severity: 'error',
          category: 'aggression',
          title: 'Predator Risk',
          description: `${a.commonName} is a potential predator of ${b.commonName}.`,
          affectedItems: [a.id, b.id]
        });
      }
      
      // Check Fin Nipping (Fish only)
      if ('nipsAtFins' in a && a.nipsAtFins && 'isLongFinned' in b && b.isLongFinned) {
         issues.push({
          id: `nipping-${a.id}-${b.id}`,
          severity: 'warning',
          category: 'aggression',
          title: 'Fin Nipping Risk',
          description: `${a.commonName} may nip the fins of ${b.commonName}.`,
          affectedItems: [a.id, b.id]
        });
      }
    }
  }

  // Deduplicate issues by ID?
  // The IDs I generated are unique per pair direction.
  // We might want to dedupe if A incompatible B AND B incompatible A.
  
  return issues;
}
