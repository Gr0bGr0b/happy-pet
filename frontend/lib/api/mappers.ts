import { resolveMediaUrl } from '@/lib/api/client';
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
    imageUrl: data.image_url ? resolveMediaUrl(data.image_url) : undefined,
    foodPerRation: data.food_per_ration ?? undefined,
    foodName: data.food_name ?? undefined,
    createdAt: parseApiDate(data.created_at),
    updatedAt: parseApiDate(data.updated_at),
    injectionIntervalHours: data.injection_interval_hours
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
