import { request } from '@/lib/api/client';
import { mapCat } from '@/lib/api/mappers';
import { parseApiDate } from '@/lib/date';
import type { CatResponse } from '@/types/api';
import type { Cat, WeightPoint } from '@/types/cat';

// The trailing slash is load-bearing. The backend registers these routes as "/", so
// "/cats" (no slash) answers 307 and the redirect re-sends POST bodies cross-origin.
// Do not "tidy" it away.
export const CATS_PATH = '/cats/';

export async function fetchCats(signal?: AbortSignal): Promise<Cat[]> {
  const data = await request<CatResponse[]>(CATS_PATH, { signal });
  return data.map(mapCat);
}

/** The app is single-cat for now: the dashboard shows the first one. */
export async function fetchPrimaryCat(signal?: AbortSignal): Promise<Cat> {
  const cats = await fetchCats(signal);
  if (cats.length === 0) throw new Error('Aucun chat enregistré');
  return cats[0];
}

/** Weight points recorded for the cat, newest first. */
export async function fetchWeightHistory(
  catId: number,
  signal?: AbortSignal
): Promise<WeightPoint[]> {
  const data = await request<{ weight: number; recorded_at: string }[]>(
    `${CATS_PATH}${catId}/weights`,
    { signal }
  );
  return data.map((row) => ({
    weight: row.weight,
    recordedAt: parseApiDate(row.recorded_at)
  }));
}
