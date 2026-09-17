import { RECENT_LOGS_WINDOW_HOURS, TREND_MONTHS } from '@/constants/injections';
import { hoursToMs, shortMonthLabel } from '@/lib/date';
import type { DosagePoint, InjectionLog, MonthBucket } from '@/types/injection';

/** The last `count` months, oldest first, current month included. */
export function monthBuckets(
  now: Date = new Date(),
  count = TREND_MONTHS
): MonthBucket[] {
  const buckets: MonthBucket[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    buckets.push({
      key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
      label: shortMonthLabel(start),
      start,
      end
    });
  }
  return buckets;
}

/**
 * Mean dosage per injection, per month.
 *
 * Deliberately the mean and not the sum: a monthly total is dominated by how many days
 * the month has and how many doses were missed, so it measures adherence rather than
 * dose. The clinically useful question is whether the unit dose is creeping up.
 *
 * Months with no logs keep their slot with a null value, so the axis always spans the
 * full period instead of silently compressing it.
 */
export function bucketDosage(
  logs: InjectionLog[],
  buckets: MonthBucket[]
): DosagePoint[] {
  return buckets.map((bucket) => {
    let total = 0;
    let count = 0;
    for (const log of logs) {
      const t = log.createdAt.getTime();
      if (t >= bucket.start.getTime() && t < bucket.end.getTime()) {
        total += log.dosage;
        count += 1;
      }
    }
    return {
      label: bucket.label,
      value: count === 0 ? null : Math.round((total / count) * 10) / 10,
      count,
      total: Math.round(total * 10) / 10
    };
  });
}

/**
 * Rolling window, not calendar days — an injection logged at 23:50 should not disappear
 * ten minutes later. Input is already newest-first from the API, so this is a prefix.
 */
export function recentLogs(
  logs: InjectionLog[],
  now: Date = new Date(),
  windowHours: number = RECENT_LOGS_WINDOW_HOURS
): InjectionLog[] {
  const cutoff = now.getTime() - hoursToMs(windowHours);
  return logs.filter((log) => log.createdAt.getTime() >= cutoff);
}

/** Groups logs into day sections for the timeline. Preserves input order. */
export function groupByDay(
  logs: InjectionLog[]
): { key: string; logs: InjectionLog[] }[] {
  const groups: { key: string; logs: InjectionLog[] }[] = [];
  for (const log of logs) {
    const d = log.createdAt;
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.logs.push(log);
    else groups.push({ key, logs: [log] });
  }
  return groups;
}
