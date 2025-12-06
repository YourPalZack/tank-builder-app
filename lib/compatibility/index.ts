import { AquariumBuild, CompatibilityIssue } from '@/types';
import { checkWaterParameters } from './waterParams';
import { calculateStockingLevel } from './stocking';
import { checkAggression } from './aggression';

type Range = { min: number; max: number };

export function checkCompatibility(build: AquariumBuild): { 
  warnings: CompatibilityIssue[], 
  stockingLevel: number,
  targetParams: { temp: [number, number], ph: [number, number], hardness: [number, number] } 
} {
  let issues: CompatibilityIssue[] = [];

  // 1. Water Parameters
  const waterResult = checkWaterParameters(
    build.fish.map(f => f.item),
    build.inverts.map(i => i.item),
    build.plants.map(p => p.item)
  );
  issues = [...issues, ...waterResult.issues];

  // 2. Stocking Level
  const stockingLevel = calculateStockingLevel(
    build.tank,
    build.fish,
    build.inverts
  );
  
  if (stockingLevel > 100) {
    issues.push({
      id: 'overstocking',
      severity: 'error',
      category: 'space',
      title: 'Tank Overstocked',
      description: `Stocking level is ${stockingLevel}%. This exceeds the recommended capacity.`,
      affectedItems: ['tank']
    });
  } else if (stockingLevel > 85) {
    issues.push({
      id: 'high-stocking',
      severity: 'warning',
      category: 'space',
      title: 'High Stocking Level',
      description: `Stocking level is ${stockingLevel}%. Monitor water quality closely.`,
      affectedItems: ['tank']
    });
  }

  // 3. Aggression
  const aggressionIssues = checkAggression(build.fish, build.inverts);
  issues = [...issues, ...aggressionIssues];

  // 4. Tank Size Checks (Min Tank Size)
  if (build.tank) {
    [...build.fish, ...build.inverts].forEach(({ item }) => {
      if (build.tank && item.minTankGallons > build.tank.volumeGallons) {
        issues.push({
          id: `tank-size-${item.id}`,
          severity: 'error',
          category: 'space',
          title: 'Tank Too Small',
          description: `${item.commonName} requires at least ${item.minTankGallons} gallons. Current: ${build.tank.volumeGallons}g.`,
          affectedItems: [item.id, 'tank']
        });
      }
    });
  } else if (build.fish.length > 0 || build.inverts.length > 0) {
      issues.push({
          id: 'no-tank',
          severity: 'error',
          category: 'space',
          title: 'No Tank Selected',
          description: 'Please select a tank to check compatibility.',
          affectedItems: ['tank']
      });
  }

  const convertRange = (r: Range | null): [number, number] => r ? [r.min, r.max] : [0, 0];

  return {
    warnings: issues,
    stockingLevel,
    targetParams: {
        temp: convertRange(waterResult.targetParams.temp),
        ph: convertRange(waterResult.targetParams.ph),
        hardness: convertRange(waterResult.targetParams.hardness)
    }
  };
}
