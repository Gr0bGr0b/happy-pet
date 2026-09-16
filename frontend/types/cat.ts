export type Sex = 'Male' | 'Female';

export interface Cat {
  // int, not string: the backend sends an integer and POST /injections/ needs one back.
  id: number;
  name: string;
  dateOfBirth: Date;
  breed: string;
  sex: Sex;
  diabetes: boolean;
  color: string;
  weight: number;
  imageUrl?: string;
  foodPerRation?: number;
  foodName?: string;
  createdAt: Date;
  updatedAt: Date;
  // Falls back to DEFAULT_INJECTION_INTERVAL_HOURS until the column ships.
  injectionIntervalHours: number;
}

// Fields the edit view can change. Sent to PATCH /api/v1/cats/{id} once it exists.
export interface CatPatch {
  weight?: number;
  foodPerRation?: number;
  foodName?: string;
  imageUrl?: string;
}

export interface WeightPoint {
  weight: number;
  recordedAt: Date;
}
