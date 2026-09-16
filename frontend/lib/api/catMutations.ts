/**
 * The single seam for backend capabilities that do not exist yet.
 *
 * Every function below has its real HTTP implementation written and gated on a flag in
 * constants/features.ts. When the endpoint ships, flip the flag — that is the entire
 * change. Nothing else in the app knows these endpoints are missing.
 *
 * Contract for the follow-up backend issue:
 *
 *   PATCH /api/v1/cats/{cat_id}
 *     body: any subset of {name, date_of_birth, breed, sex, diabetes, color, weight,
 *           food_per_ration, food_name, image_url, injection_interval_hours}
 *     200 -> CatResponse | 404 | 422
 *     side effect: if `weight` changed, insert a weight_history row
 *
 *   POST /api/v1/cats/{cat_id}/image
 *     multipart/form-data, field "file", image/jpeg|png|webp, <= 5 MB
 *     201 -> {"image_url": "<absolute URL or /static/... path>"} | 404 | 413 | 415
 *
 *   GET /api/v1/cats/{cat_id}/weights?since=<ISO8601>&limit=<int>
 *     200 -> [{"id", "cat_id", "weight", "recorded_at"}] ordered recorded_at DESC
 *     new weight_history table; the migration must backfill one row per existing cat
 *     from cats.weight / cats.created_at so the chart is not empty on day one
 */
import {
  BACKEND_SUPPORTS_CAT_WRITES,
  BACKEND_SUPPORTS_IMAGE_UPLOAD,
  BACKEND_SUPPORTS_WEIGHT_HISTORY
} from '@/constants/features';
import { request, uploadFile } from '@/lib/api/client';
import { mapCat } from '@/lib/api/mappers';
import { parseApiDate } from '@/lib/date';
import type { CatResponse } from '@/types/api';
import type { Cat, CatPatch, WeightPoint } from '@/types/cat';

export class BackendNotReadyError extends Error {
  constructor(capability: string) {
    super(`${capability} nécessite une mise à jour de l'API`);
    this.name = 'BackendNotReadyError';
  }
}

export async function updateCat(id: number, patch: CatPatch): Promise<Cat> {
  if (!BACKEND_SUPPORTS_CAT_WRITES) {
    throw new BackendNotReadyError('La modification du profil');
  }

  const data = await request<CatResponse>(`/cats/${id}`, {
    method: 'PATCH',
    body: {
      weight: patch.weight,
      food_per_ration: patch.foodPerRation,
      food_name: patch.foodName,
      image_url: patch.imageUrl
    }
  });
  return mapCat(data);
}

export interface PickedImage {
  uri: string;
  mimeType?: string;
  fileName?: string;
}

export async function uploadCatImage(
  id: number,
  asset: PickedImage
): Promise<{ imageUrl: string }> {
  if (!BACKEND_SUPPORTS_IMAGE_UPLOAD) {
    throw new BackendNotReadyError("L'envoi d'une photo");
  }

  const form = new FormData();
  // React Native's FormData takes this {uri, name, type} shape rather than a File.
  form.append('file', {
    uri: asset.uri,
    name: asset.fileName ?? 'cat.jpg',
    type: asset.mimeType ?? 'image/jpeg'
  } as unknown as Blob);

  const data = await uploadFile<{ image_url: string }>(
    `/cats/${id}/image`,
    form
  );
  return { imageUrl: data.image_url };
}

export async function fetchWeightHistory(
  id: number,
  signal?: AbortSignal
): Promise<WeightPoint[]> {
  if (!BACKEND_SUPPORTS_WEIGHT_HISTORY) {
    throw new BackendNotReadyError("L'historique de poids");
  }

  const data = await request<{ weight: number; recorded_at: string }[]>(
    `/cats/${id}/weights`,
    { signal }
  );
  return data.map((row) => ({
    weight: row.weight,
    recordedAt: parseApiDate(row.recorded_at)
  }));
}
