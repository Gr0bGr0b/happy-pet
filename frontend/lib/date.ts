// Date helpers. All formatting is fr-FR: the entire UI copy is French, while the
// previous implementation formatted in en-US.

const OFFSET_RE = /(Z|[+-]\d{2}:?\d{2})$/;

const SHORT_MONTHS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.'
];

/** Abbreviated French month name, used for chart x axes. */
export function shortMonthLabel(date: Date): string {
  return SHORT_MONTHS[date.getMonth()];
}

/**
 * Parse a timestamp from the API.
 *
 * The backend stores naive datetimes (`DateTime` without `timezone=True`, filled by
 * `datetime.utcnow()`), so it serializes values like "2026-09-16T12:04:33.120" with no
 * offset. Per ECMA-262 a date-TIME form without an offset is parsed as *local* time, so
 * `new Date(s)` is wrong by the device's UTC offset — which silently corrupts the
 * injection cooldown. Treat an offset-less value as UTC, which is what it actually is.
 *
 * Tolerates offset-carrying values too, so it keeps working unchanged once the backend
 * switches to timezone-aware timestamps.
 */
export function parseApiDate(value: string): Date {
  return new Date(OFFSET_RE.test(value) ? value : `${value}Z`);
}

/**
 * Parse a date-only value such as date_of_birth ("2020-05-15").
 *
 * The opposite trap: a date-ONLY form is parsed as UTC midnight, which lands on the
 * previous day for any negative UTC offset. Build it in local time instead.
 */
export function parseApiDateOnly(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function calculateAge(birthDate: Date, now: Date = new Date()): number {
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/** Relative day label for the 48h log list. */
export function formatDayLabel(date: Date, now: Date = new Date()): string {
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfTarget.getTime()) / 86_400_000
  );
  if (dayDiff === 0) return "Aujourd'hui";
  if (dayDiff === 1) return 'Hier';
  return formatDay(date);
}

/** "4 h 12" / "12 min" — used by the cooldown CTA. */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours} h ${String(minutes).padStart(2, '0')}`;
}

export function hoursToMs(hours: number): number {
  return hours * 3_600_000;
}
