import { useEffect, useMemo, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { hoursToMs } from '@/lib/date';
import type { InjectionLog } from '@/types/injection';

export interface Cooldown {
  canInject: boolean;
  nextAt: Date | null;
  remainingMs: number;
  /** 0 → just injected, 1 → due. */
  progress: number;
}

/**
 * Derives the injection gate from the last log's server timestamp.
 *
 * Ticks only while cooling. Background and inactive-tab timers get throttled by the OS
 * and the browser, so it also resyncs on AppState/visibility change — otherwise the CTA
 * would stay disabled past the point where the injection is actually due.
 *
 * Known limitation: this compares a server timestamp against the device clock, so a
 * badly skewed device clock skews the gate.
 */
export function useCooldown(
  lastLog: InjectionLog | null,
  intervalHours: number
): Cooldown {
  const [now, setNow] = useState(() => Date.now());

  const lastAt = lastLog?.createdAt.getTime() ?? null;
  const intervalMs = hoursToMs(intervalHours);

  const state = useMemo<Cooldown>(() => {
    if (lastAt === null) {
      return { canInject: true, nextAt: null, remainingMs: 0, progress: 1 };
    }
    const nextMs = lastAt + intervalMs;
    const remainingMs = Math.max(0, nextMs - now);
    return {
      canInject: remainingMs === 0,
      nextAt: new Date(nextMs),
      remainingMs,
      progress: intervalMs === 0 ? 1 : Math.min(1, (now - lastAt) / intervalMs)
    };
  }, [lastAt, intervalMs, now]);

  const cooling = !state.canInject;

  useEffect(() => {
    if (!cooling) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [cooling]);

  useEffect(() => {
    const resync = () => setNow(Date.now());

    if (Platform.OS === 'web') {
      if (typeof document === 'undefined') return;
      document.addEventListener('visibilitychange', resync);
      window.addEventListener('focus', resync);
      return () => {
        document.removeEventListener('visibilitychange', resync);
        window.removeEventListener('focus', resync);
      };
    }

    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') resync();
    });
    return () => sub.remove();
  }, []);

  return state;
}
