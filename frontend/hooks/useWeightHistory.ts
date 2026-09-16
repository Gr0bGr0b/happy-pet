import { useMemo } from 'react';
import { BACKEND_SUPPORTS_WEIGHT_HISTORY } from '@/constants/features';
import { demoWeightHistory } from '@/lib/demoWeightHistory';
import type { Cat, WeightPoint } from '@/types/cat';

export interface WeightHistory {
  points: WeightPoint[];
  /** True while the series is fabricated — drives the warning badge on the card. */
  isDemo: boolean;
}

/**
 * Weight series for the trend chart.
 *
 * There is no weight history in the backend today, so this returns generated data
 * (see lib/demoWeightHistory.ts for how to remove it). WeightTrendCard never knows the
 * difference — when the endpoint ships, only this hook body changes.
 */
export function useWeightHistory(cat: Cat | null): WeightHistory {
  return useMemo(() => {
    if (!cat) return { points: [], isDemo: false };

    if (!BACKEND_SUPPORTS_WEIGHT_HISTORY) {
      return { points: demoWeightHistory(cat.weight, cat.id), isDemo: true };
    }

    // Real path lands here once fetchWeightHistory is wired into a provider.
    return {
      points: [{ weight: cat.weight, recordedAt: cat.updatedAt }],
      isDemo: false
    };
  }, [cat]);
}
