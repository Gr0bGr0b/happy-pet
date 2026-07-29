import Constants from "expo-constants";
import type { Cat } from "../../types/Cat";

// API base URL configured in app.json → expo-constants.
const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ?? "http://localhost:8080/api/v1";

// Raw shape returned by GET /api/v1/cats/ (snake_case from Python backend).
interface CatResponse {
  id: number;
  name: string;
  date_of_birth: string;
  breed: string;
  color: string;
  weight: number;
  image_url: string | null;
  food_per_ration: number | null;
  food_name: string | null;
}

// Generic fetch wrapper with error handling.
async function fetchApi<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

// Convert snake_case backend response → camelCase frontend Cat model.
function mapCatResponse(data: CatResponse): Cat {
  return {
    id: String(data.id),
    name: data.name,
    dateOfBirth: data.date_of_birth,
    breed: data.breed,
    color: data.color,
    weight: data.weight,
    imageUrl: data.image_url ?? undefined,
    foodPerRation: data.food_per_ration ?? undefined,
    foodName: data.food_name ?? undefined,
  };
}

// Fetch the first (and currently only) cat from the API.
export async function fetchCat(): Promise<Cat> {
  const cats = await fetchApi<CatResponse[]>("/cats/");
  if (cats.length === 0) {
    throw new Error("No cats found");
  }
  return mapCatResponse(cats[0]);
}
