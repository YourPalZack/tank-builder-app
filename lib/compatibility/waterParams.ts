import { Fish, Invertebrate, Plant, CompatibilityIssue } from '@/types';

type Range = { min: number; max: number };

function getOverlap(ranges: Range[]): Range | null {
  if (ranges.length === 0) return null;
  let maxMin = ranges[0].min;
  let minMax = ranges[0].max;

  for (const r of ranges) {
    maxMin = Math.max(maxMin, r.min);
    minMax = Math.min(minMax, r.max);
  }

  if (maxMin > minMax) return null;
  return { min: maxMin, max: minMax };
}

export function checkWaterParameters(
  fish: Fish[],
  inverts: Invertebrate[],
  plants: Plant[]
): { issues: CompatibilityIssue[]; targetParams: { temp: Range | null; ph: Range | null; hardness: Range | null } } {
  const issues: CompatibilityIssue[] = [];

  // Collect all ranges
  const tempRanges: Range[] = [];
  const phRanges: Range[] = [];
  const hardnessRanges: Range[] = [];

  const allItems = [...fish, ...inverts];
  
  allItems.forEach(item => {
    tempRanges.push({ min: item.waterParams.tempMin, max: item.waterParams.tempMax });
    phRanges.push({ min: item.waterParams.phMin, max: item.waterParams.phMax });
    hardnessRanges.push({ min: item.waterParams.hardnessMin, max: item.waterParams.hardnessMax });
  });

  // Plants usually have wider ranges, but we should include them for Temp and pH
  plants.forEach(item => {
    tempRanges.push({ min: item.waterParams.tempMin, max: item.waterParams.tempMax });
    phRanges.push({ min: item.waterParams.phMin, max: item.waterParams.phMax });
    // Plants often don't have strict hardness data in our model, or it's less critical, but if we had it we'd check.
  });

  const tempOverlap = getOverlap(tempRanges);
  const phOverlap = getOverlap(phRanges);
  const hardnessOverlap = getOverlap(hardnessRanges);

  if (allItems.length > 0 || plants.length > 0) {
    if (!tempOverlap) {
      issues.push({
        id: 'temp-mismatch',
        severity: 'error',
        category: 'water',
        title: 'Incompatible Temperature Requirements',
        description: 'Selected species have conflicting temperature requirements with no overlap.',
        affectedItems: [], // Could list specific conflicting ones if we did pairwise checks
      });
    } else if (tempOverlap.max - tempOverlap.min < 2) {
      issues.push({
        id: 'temp-narrow',
        severity: 'warning',
        category: 'water',
        title: 'Narrow Temperature Range',
        description: `The overlap for temperature is very narrow (${tempOverlap.min}-${tempOverlap.max}°F). Precise control required.`,
        affectedItems: [],
      });
    }

    if (!phOverlap) {
      issues.push({
        id: 'ph-mismatch',
        severity: 'error',
        category: 'water',
        title: 'Incompatible pH Requirements',
        description: 'Selected species have conflicting pH requirements.',
        affectedItems: [],
      });
    }

    if (!hardnessOverlap && allItems.length > 0) {
       issues.push({
        id: 'hardness-mismatch',
        severity: 'error',
        category: 'water',
        title: 'Incompatible Hardness Requirements',
        description: 'Selected species have conflicting water hardness requirements.',
        affectedItems: [],
      });
    }
  }

  return {
    issues,
    targetParams: {
      temp: tempOverlap,
      ph: phOverlap,
      hardness: hardnessOverlap
    }
  };
}
