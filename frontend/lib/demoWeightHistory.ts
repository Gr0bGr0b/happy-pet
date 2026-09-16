/**
 * ⚠️  FABRICATED DATA — NOT THIS CAT'S WEIGHT.
 *
 * The backend stores weight as a single scalar column on `cats` with no history table,
 * so a 6-month weight trend cannot be built from real data. This module generates a
 * plausible series purely so the chart design is reviewable.
 *
 * TO DELETE THIS, once GET /api/v1/cats/{id}/weights ships:
 *   1. set BACKEND_SUPPORTS_WEIGHT_HISTORY = true in constants/features.ts
 *   2. delete this file
 *   3. delete its import + the demo branch in hooks/useWeightHistory.ts
 *   4. remove the "données simulées" badge in components/charts/WeightTrendCard.tsx
 * Nothing else references it.
 */
import { TREND_MONTHS } from '@/constants/injections';
import type { WeightPoint } from '@/types/cat';

/** Deterministic per-cat so the fake line doesn't jitter between renders. */
function seededOffset(seed: number, index: number): number {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return x - Math.floor(x) - 0.5;
}

export function demoWeightHistory(
  currentWeight: number,
  catId: number,
  now: Date = new Date(),
  months = TREND_MONTHS
): WeightPoint[] {
  const points: WeightPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const recordedAt = new Date(now.getFullYear(), now.getMonth() - i, 15);
    if (i === 0) {
      points.push({ weight: currentWeight, recordedAt });
      continue;
    }
    // Drift gently away from the current value the further back we go.
    const drift = (i / months) * 0.45 + seededOffset(catId, i) * 0.18;
    points.push({
      weight: Math.round((currentWeight - drift) * 10) / 10,
      recordedAt
    });
  }
  return points;
}
