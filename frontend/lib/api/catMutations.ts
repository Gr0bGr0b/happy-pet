/**
 * Writes on the cat resource.
 *
 * Both endpoints shipped with backend migration 003:
 *   PATCH /api/v1/cats/{id}       — partial update, unknown fields answer 422
 *   POST  /api/v1/cats/{id}/image — multipart, jpeg/png/webp, <= 5 MB
 * A weight change on PATCH also writes a weight_history row, which is what
 * fetchWeightHistory reads back for the trend chart.
 */
import { Platform } from 'react-native';
import { CATS_PATH } from '@/lib/api/cats';
import {
  ApiError,
  resolveMediaUrl,
  request,
  uploadFile
} from '@/lib/api/client';
import { mapCat } from '@/lib/api/mappers';
import type { CatResponse } from '@/types/api';
import type { Cat, CatPatch } from '@/types/cat';

export async function updateCat(id: number, patch: CatPatch): Promise<Cat> {
  // Only the keys actually present are sent: the endpoint applies exactly what it
  // receives, and it rejects unknown keys rather than ignoring them.
  const body: Record<string, unknown> = {};
  if (patch.weight !== undefined) body.weight = patch.weight;
  if (patch.foodPerRation !== undefined)
    body.food_per_ration = patch.foodPerRation;
  if (patch.foodName !== undefined) body.food_name = patch.foodName;

  const data = await request<CatResponse>(`${CATS_PATH}${id}`, {
    method: 'PATCH',
    body
  });
  return mapCat(data);
}

/** Mirrors the backend's MAX_IMAGE_BYTES, so an oversized photo is refused before upload. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_MB = MAX_IMAGE_BYTES / (1024 * 1024);
export const IMAGE_TOO_LARGE_MESSAGE = `La photo dépasse ${MAX_IMAGE_MB} Mo. Choisissez une image plus légère.`;
const IMAGE_UNSUPPORTED_MESSAGE =
  'Format non pris en charge. Choisissez une image JPEG, PNG ou WebP.';

/** Upload statuses that are the photo's fault: the screen shows them next to it. */
export const PHOTO_ERROR_STATUSES = [413, 415];

export interface PickedImage {
  uri: string;
  mimeType?: string;
  fileName?: string;
  /** Bytes, when the picker reports it (not guaranteed on every platform). */
  fileSize?: number;
}

export async function uploadCatImage(
  id: number,
  asset: PickedImage
): Promise<{ imageUrl: string }> {
  const form = new FormData();
  const name = asset.fileName ?? 'cat.jpg';

  if (Platform.OS === 'web') {
    // The picker hands back a blob: URL on web, and the {uri, name, type} shape below
    // would be serialised as "[object Object]". Re-read it as a real Blob, retyped
    // when the browser left the type empty (the backend decides on Content-Type).
    const blob = await fetch(asset.uri).then((r) => r.blob());
    const typed = blob.type
      ? blob
      : blob.slice(0, blob.size, asset.mimeType ?? 'image/jpeg');
    form.append('file', typed, name);
  } else {
    // React Native's FormData takes this {uri, name, type} shape rather than a File.
    form.append('file', {
      uri: asset.uri,
      name,
      type: asset.mimeType ?? 'image/jpeg'
    } as unknown as Blob);
  }

  try {
    const data = await uploadFile<{ image_url: string }>(
      `${CATS_PATH}${id}/image`,
      form
    );
    return { imageUrl: resolveMediaUrl(data.image_url) };
  } catch (e) {
    // The picker can't always report a size or type, so the server is the backstop;
    // its English detail is replaced by a message the user can act on.
    if (e instanceof ApiError && e.status === 413) {
      throw new ApiError(413, IMAGE_TOO_LARGE_MESSAGE);
    }
    if (e instanceof ApiError && e.status === 415) {
      throw new ApiError(415, IMAGE_UNSUPPORTED_MESSAGE);
    }
    throw e;
  }
}
