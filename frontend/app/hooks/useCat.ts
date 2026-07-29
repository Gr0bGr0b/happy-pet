import { useEffect, useState, useCallback } from "react";
import type { Cat } from "../../types/Cat";
import { fetchCat as fetchCatFromApi } from "../utils/api";

interface UseCatResult {
  cat: Cat | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Fetches the single cat from the API on mount.
// Exposes loading/error states and a refetch function.
export function useCat(): UseCatResult {
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchCatFromApi()
      .then(setCat)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { cat, loading, error, refetch: load };
}
