import { request } from '@/lib/api/client';
import { mapCat } from '@/lib/api/mappers';
import type { CatResponse } from '@/types/api';
import type { Cat } from '@/types/cat';

// The trailing slash is load-bearing. The backend registers these routes as "/", so
// "/cats" (no slash) answers 307 and the redirect re-sends POST bodies cross-origin.
// Do not "tidy" it away.
const CATS_PATH = '/cats/';

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
