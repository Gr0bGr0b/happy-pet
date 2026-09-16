import { DEFAULT_INJECTION_INTERVAL_HOURS } from '@/constants/injections';
import { parseApiDate, parseApiDateOnly } from '@/lib/date';
import type { CatResponse, InjectionLogResponse } from '@/types/api';
import type { Cat, Sex } from '@/types/cat';
import type { InjectionLog } from '@/types/injection';

export function mapCat(data: CatResponse): Cat {
  return {
    id: data.id,
    name: data.name,
    dateOfBirth: parseApiDateOnly(data.date_of_birth),
    breed: data.breed,
    sex: (data.sex as Sex) ?? 'Male',
    diabetes: data.diabetes,
    color: data.color,
    weight: data.weight,
    imageUrl: data.image_url ?? undefined,
    foodPerRation: data.food_per_ration ?? undefined,
    foodName: data.food_name ?? undefined,
    createdAt: parseApiDate(data.created_at),
    updatedAt: parseApiDate(data.updated_at),
    // Resolves to the fallback today; starts working the moment the column ships,
    // with no frontend change.
    injectionIntervalHours:
      data.injection_interval_hours ?? DEFAULT_INJECTION_INTERVAL_HOURS
  };
}

export function mapInjection(data: InjectionLogResponse): InjectionLog {
  return {
    id: data.id,
    catId: data.cat_id,
    dosage: data.dosage,
    notes: data.notes ?? undefined,
    createdAt: parseApiDate(data.created_at)
  };
}
