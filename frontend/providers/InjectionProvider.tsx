import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { useAsync } from '@/hooks/useAsync';
import { createInjection, fetchInjections } from '@/lib/api/injections';
import {
  bucketDosage,
  groupByDay,
  monthBuckets,
  recentLogs
} from '@/lib/stats';
import { useCat } from '@/providers/CatProvider';
import type { DosagePoint, InjectionLog } from '@/types/injection';

interface InjectionContextValue {
  logs: InjectionLog[];
  /** Rolling 48h window, grouped into day sections. */
  recentGroups: { key: string; logs: InjectionLog[] }[];
  monthlyDosage: DosagePoint[];
  lastLog: InjectionLog | null;
  addInjection: (dosage: number, notes?: string) => Promise<void>;
  submitting: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const InjectionContext = createContext<InjectionContextValue | null>(null);

export const useInjections = (): InjectionContextValue => {
  const ctx = useContext(InjectionContext);
  if (!ctx)
    throw new Error('useInjections must be used inside InjectionProvider');
  return ctx;
};

export const InjectionProvider = ({ children }: { children: ReactNode }) => {
  const { cat } = useCat();
  const catId = cat?.id ?? null;
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, refetch, setData } = useAsync<InjectionLog[]>(
    (signal) => fetchInjections(catId as number, signal),
    [catId],
    { enabled: catId !== null }
  );

  const logs = useMemo(() => data ?? [], [data]);

  const addInjection = useCallback(
    async (dosage: number, notes?: string) => {
      if (catId === null) return;
      setSubmitting(true);

      // Optimistic entry so the list and the cooldown react immediately.
      const optimistic: InjectionLog = {
        id: -Date.now(),
        catId,
        dosage,
        notes,
        createdAt: new Date()
      };
      setData((prev) => [optimistic, ...(prev ?? [])]);

      try {
        const saved = await createInjection({ catId, dosage, notes });
        // Replace with the server row: created_at from the server is the source of
        // truth for the cooldown, and it will differ slightly from the local clock.
        setData((prev) =>
          (prev ?? []).map((log) => (log.id === optimistic.id ? saved : log))
        );
      } catch (e) {
        setData((prev) =>
          (prev ?? []).filter((log) => log.id !== optimistic.id)
        );
        throw e;
      } finally {
        setSubmitting(false);
      }
    },
    [catId, setData]
  );

  const value = useMemo<InjectionContextValue>(() => {
    const now = new Date();
    return {
      logs,
      recentGroups: groupByDay(recentLogs(logs, now)),
      monthlyDosage: bucketDosage(logs, monthBuckets(now)),
      lastLog: logs.length > 0 ? logs[0] : null,
      addInjection,
      submitting,
      loading,
      error,
      refetch
    };
  }, [logs, addInjection, submitting, loading, error, refetch]);

  return (
    <InjectionContext.Provider value={value}>
      {children}
    </InjectionContext.Provider>
  );
};
