// Raw snake_case wire shapes returned by the FastAPI backend.
// Nothing outside lib/api/mappers.ts should touch these.

export interface CatResponse {
  id: number;
  name: string;
  date_of_birth: string;
  breed: string;
  sex: string;
  diabetes: boolean;
  color: string;
  weight: number;
  image_url: string | null;
  food_per_ration: number | null;
  food_name: string | null;
  injection_interval_hours: number;
  created_at: string;
  updated_at: string;
}

export interface InjectionLogResponse {
  id: number;
  cat_id: number;
  dosage: number;
  notes: string | null;
  created_at: string;
}
