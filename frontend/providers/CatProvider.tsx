import { createContext, useContext, type ReactNode } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { fetchPrimaryCat } from '@/lib/api/cats';
import type { Cat } from '@/types/cat';

interface CatContextValue {
  cat: Cat | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CatContext = createContext<CatContextValue | null>(null);

export const useCat = (): CatContextValue => {
  const ctx = useContext(CatContext);
  if (!ctx) throw new Error('useCat must be used inside CatProvider');
  return ctx;
};

export const CatProvider = ({ children }: { children: ReactNode }) => {
  // Mounted at the layout so /cat/edit gets the cat without refetching.
  const { data, loading, error, refetch } = useAsync<Cat>(
    (signal) => fetchPrimaryCat(signal),
    []
  );

  return (
    <CatContext.Provider value={{ cat: data, loading, error, refetch }}>
      {children}
    </CatContext.Provider>
  );
};
