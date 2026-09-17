import { useAsync } from '@/hooks/useAsync';
import { fetchWeightHistory } from '@/lib/api/cats';
import type { Cat, WeightPoint } from '@/types/cat';

export interface WeightHistory {
  points: WeightPoint[];
  error: string | null;
}

/**
 * Weight series for the trend chart, oldest first.
 *
 * `cat.weight` is part of the key on purpose: saving a new weight writes a
 * weight_history row on the backend, so the chart has to refetch when it changes.
 */
export function useWeightHistory(cat: Cat | null): WeightHistory {
  const { data, error } = useAsync<WeightPoint[]>(
    (signal) => fetchWeightHistory(cat!.id, signal),
    [cat?.id, cat?.weight],
    { enabled: cat !== null }
  );

  return {
    // The endpoint answers newest first; the sparkline reads left to right.
    points: data ? [...data].reverse() : [],
    error
  };
}
