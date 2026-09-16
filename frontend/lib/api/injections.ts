import { request } from '@/lib/api/client';
import { mapInjection } from '@/lib/api/mappers';
import type { InjectionLogResponse } from '@/types/api';
import type { InjectionLog } from '@/types/injection';

// Trailing slash is load-bearing — see the note in lib/api/cats.ts.
const INJECTIONS_PATH = '/injections/';

/**
 * Returns every log for the cat, newest first.
 *
 * The endpoint has no date or limit parameters yet, so the 48h and 6-month windows are
 * derived client-side in lib/stats.ts. At two injections a day that is ~730 rows a year:
 * fine now, but `since`/`limit` are in the backend follow-up contract.
 */
export async function fetchInjections(
  catId: number,
  signal?: AbortSignal
): Promise<InjectionLog[]> {
  const data = await request<InjectionLogResponse[]>(
    `${INJECTIONS_PATH}?cat_id=${catId}`,
    { signal }
  );
  return data.map(mapInjection);
}

export async function createInjection(input: {
  catId: number;
  dosage: number;
  notes?: string;
}): Promise<InjectionLog> {
  const data = await request<InjectionLogResponse>(INJECTIONS_PATH, {
    method: 'POST',
    body: {
      cat_id: input.catId,
      dosage: input.dosage,
      notes: input.notes ?? null
    }
  });
  return mapInjection(data);
}
