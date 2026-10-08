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
  // Read outside the closure: the React Compiler hoists a `cat!.id` inside it into a
  // render-time memo dependency, which throws while there is no cat yet.
  const catId = cat?.id;
  const { data, error } = useAsync<WeightPoint[]>(
    (signal) => fetchWeightHistory(catId as number, signal),
    [catId, cat?.weight],
    { enabled: catId !== undefined }
  );

  return {
    // The endpoint answers newest first; the sparkline reads left to right.
    points: data ? [...data].reverse() : [],
    error
  };
}
