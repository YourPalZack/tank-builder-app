import { AquariumBuild, CompatibilityIssue } from '@/types';

export function checkCompatibility(build: AquariumBuild): { 
  stockingLevel: number; 
  warnings: CompatibilityIssue[]; 
  targetParams: { temp: [number, number], ph: [number, number], hardness: [number, number] } 
} {
  const issues: CompatibilityIssue[] = [];
  const { tank, fish, inverts, plants, equipment } = build;

  // 1. Tank Validation
  if (!tank) {
    return { 
      stockingLevel: 0, 
      warnings: [], 
      targetParams: { temp: [0, 0], ph: [0, 0], hardness: [0, 0] } 
    };
  }

  // 2. Water Parameter Overlap
  // Initialize ranges with wide bounds
  const tempRange = [60, 90];
  const phRange = [5.0, 9.0];
  const hardnessRange = [0, 30];

  const allLivestock = [
    ...fish.map(f => ({ ...f.item, type: 'Fish', count: f.quantity })),
    ...inverts.map(i => ({ ...i.item, type: 'Invert', count: i.quantity })),
    ...plants.map(p => ({ ...p.item, type: 'Plant', count: p.quantity }))
  ];

  allLivestock.forEach(item => {
    // Temp
    tempRange[0] = Math.max(tempRange[0], item.waterParams.tempMin);
    tempRange[1] = Math.min(tempRange[1], item.waterParams.tempMax);
    
    // pH
    phRange[0] = Math.max(phRange[0], item.waterParams.phMin);
    phRange[1] = Math.min(phRange[1], item.waterParams.phMax);

    // Hardness (Plants might not have hardness in our type, check existence)
    if ('hardnessMin' in item.waterParams) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wp = item.waterParams as any; // Cast to access hardness
      hardnessRange[0] = Math.max(hardnessRange[0], wp.hardnessMin);
      hardnessRange[1] = Math.min(hardnessRange[1], wp.hardnessMax);
    }
  });

  // Check for impossible ranges
  if (tempRange[0] > tempRange[1]) {
    issues.push({
      id: 'temp-mismatch',
      severity: 'error',
      category: 'water',
      title: 'Temperature Incompatibility',
      description: `Selected species have conflicting temperature requirements. No overlap found.`,
      affectedItems: [],
      suggestion: 'Remove species with extreme temperature needs.'
    });
  } else if (tempRange[1] - tempRange[0] < 2) {
    issues.push({
      id: 'temp-narrow',
      severity: 'warning',
      category: 'water',
      title: 'Narrow Temperature Range',
      description: `The safe temperature range is very narrow (${tempRange[0]}°F - ${tempRange[1]}°F).`,
      affectedItems: [],
      suggestion: 'Ensure your heater is precise and monitor temperature closely.'
    });
  }

  if (phRange[0] > phRange[1]) {
    issues.push({
      id: 'ph-mismatch',
      severity: 'error',
      category: 'water',
      title: 'pH Incompatibility',
      description: `Selected species have conflicting pH requirements.`,
      affectedItems: [],
      suggestion: 'Group species that prefer either acidic or alkaline water.'
    });
  }

  // 3. Tank Size & Stocking
  let totalInches = 0;
  
  // Check Min Tank Size for each fish
  fish.forEach(({ item, quantity }) => {
    if (item.minTankGallons > tank.volumeGallons) {
      issues.push({
        id: `size-${item.id}`,
        severity: 'error',
        category: 'space',
        title: 'Tank Too Small',
        description: `${item.commonName} requires at least ${item.minTankGallons} gallons.`,
        affectedItems: [item.id],
        suggestion: `Upgrade to a larger tank or remove ${item.commonName}.`
      });
    }
    // Basic stocking calc: 1 inch per gallon (refined by bioload later if needed)
    // We can add a multiplier for "heavy" bioload fish here if we had that data
    totalInches += item.adultSizeInches * quantity;
  });

  // Check Min Tank Size for inverts
  inverts.forEach(({ item }) => {
    if (item.minTankGallons > tank.volumeGallons) {
      issues.push({
        id: `size-${item.id}`,
        severity: 'warning',
        category: 'space',
        title: 'Tank Too Small',
        description: `${item.commonName} prefers at least ${item.minTankGallons} gallons.`,
        affectedItems: [item.id],
        suggestion: `Consider a larger tank for ${item.commonName}.`
      });
    }
    // Inverts usually count less towards stocking, maybe 0.25 inch per inch?
    // For now, let's say 1 inch of invert = 0.5 inch of fish equivalent
    totalInches += (item.adultSizeInches * 0.5); 
  });

  const stockingLevel = Math.round((totalInches / tank.volumeGallons) * 100);

  if (stockingLevel > 100) {
    issues.push({
      id: 'overstocking',
      severity: 'error',
      category: 'space',
      title: 'Tank Overstocked',
      description: `Stocking level is at ${stockingLevel}%. This exceeds the recommended capacity.`,
      affectedItems: [],
      suggestion: 'Remove some fish or upgrade filtration significantly.'
    });
  } else if (stockingLevel > 85) {
    issues.push({
      id: 'high-stocking',
      severity: 'warning',
      category: 'space',
      title: 'High Stocking Level',
      description: `Stocking level is at ${stockingLevel}%. Maintenance will need to be diligent.`,
      affectedItems: [],
      suggestion: 'Ensure you have excellent filtration.'
    });
  }

  // 4. Social & Schooling
  fish.forEach(({ item, quantity }) => {
    if (item.schoolingSize > 1 && quantity < item.schoolingSize) {
      issues.push({
        id: `school-${item.id}`,
        severity: 'warning',
        category: 'aggression',
        title: 'Schooling Group Too Small',
        description: `${item.commonName} is a schooling fish and prefers groups of ${item.schoolingSize}+.`,
        affectedItems: [item.id],
        suggestion: `Add ${item.schoolingSize - quantity} more ${item.commonName}.`
      });
    }
  });

  // 5. Aggression & Predation
  // Check incompatibleWith
  fish.forEach(f1 => {
    fish.forEach(f2 => {
      if (f1.item.id === f2.item.id) return; // Don't check against self (unless we check male aggression later)

      // Check explicit incompatibility
      if (f1.item.incompatibleWith.includes(f2.item.id)) {
        issues.push({
          id: `conflict-${f1.item.id}-${f2.item.id}`,
          severity: 'error',
          category: 'aggression',
          title: 'Incompatible Species',
          description: `${f1.item.commonName} is known to be incompatible with ${f2.item.commonName}.`,
          affectedItems: [f1.item.id, f2.item.id],
          suggestion: 'Do not keep these species together.'
        });
      }

      // Check Predator/Prey
      if (f1.item.predatorOf.includes(f2.item.id)) {
        issues.push({
          id: `predator-${f1.item.id}-${f2.item.id}`,
          severity: 'error',
          category: 'aggression',
          title: 'Predation Risk',
          description: `${f1.item.commonName} may eat ${f2.item.commonName}.`,
          affectedItems: [f1.item.id, f2.item.id],
          suggestion: `Remove ${f1.item.commonName} or ${f2.item.commonName}.`
        });
      }
    });
  });

  // 6. Equipment Validation
  // Filter
  if (equipment.filter) {
    if (equipment.filter.maxTankGallons && equipment.filter.maxTankGallons < tank.volumeGallons) {
      issues.push({
        id: 'filter-undersized',
        severity: 'warning',
        category: 'equipment',
        title: 'Filter Undersized',
        description: `${equipment.filter.name} is rated for up to ${equipment.filter.maxTankGallons} gallons.`,
        affectedItems: [equipment.filter.id],
        suggestion: 'Upgrade to a larger filter.'
      });
    }
  } else if (fish.length > 0) {
     issues.push({
        id: 'no-filter',
        severity: 'error',
        category: 'equipment',
        title: 'No Filter Selected',
        description: 'A filter is essential for maintaining water quality with fish.',
        affectedItems: [],
        suggestion: 'Add a filter from the equipment section.'
      });
  }

  // Heater
  if (equipment.heater) {
    const wattsPerGallon = equipment.heater.watts ? equipment.heater.watts / tank.volumeGallons : 0;
    if (wattsPerGallon < 2.5) {
       issues.push({
        id: 'heater-weak',
        severity: 'warning',
        category: 'equipment',
        title: 'Heater May Be Weak',
        description: `Current heating is ${wattsPerGallon.toFixed(1)} W/gal. Recommended is 3-5 W/gal.`,
        affectedItems: [equipment.heater.id],
        suggestion: 'Consider a higher wattage heater.'
      });
    }
  } else if (fish.some(f => f.item.waterParams.tempMin > 72)) {
     issues.push({
        id: 'no-heater',
        severity: 'warning',
        category: 'equipment',
        title: 'No Heater Selected',
        description: 'Tropical fish require a heater to maintain stable temperature.',
        affectedItems: [],
        suggestion: 'Add a heater.'
      });
  }

  return {
    stockingLevel,
    warnings: issues,
    targetParams: {
      temp: tempRange as [number, number],
      ph: phRange as [number, number],
      hardness: hardnessRange as [number, number]
    }
  };
}
