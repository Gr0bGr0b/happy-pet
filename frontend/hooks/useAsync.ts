import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setData: (updater: T | ((prev: T | null) => T | null)) => void;
}

/**
 * Fetch helper with cancellation.
 *
 * Replaces the previous hand-rolled effect, which called setState unconditionally after
 * the promise resolved — a guaranteed post-unmount update and a lost-update race when
 * refetch fired twice quickly. A monotonic request id discards stale responses and the
 * AbortController cancels the in-flight request on unmount.
 */
export function useAsync<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
  options: { enabled?: boolean } = {}
): AsyncState<T> {
  const { enabled = true } = options;

  const [data, setDataState] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);
  const mounted = useRef(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const id = ++requestId.current;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fn(controller.signal)
      .then((result) => {
        if (!mounted.current || id !== requestId.current) return;
        setDataState(result);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!mounted.current || id !== requestId.current) return;
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : String(e));
        setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  const setData = useCallback((updater: T | ((prev: T | null) => T | null)) => {
    setDataState((prev) =>
      typeof updater === 'function'
        ? (updater as (p: T | null) => T | null)(prev)
        : updater
    );
  }, []);

  return { data, loading, error, refetch, setData };
}
