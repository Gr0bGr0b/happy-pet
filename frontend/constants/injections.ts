// Fallback until cats.injection_interval_hours ships (see the backend follow-up issue).
// Once the column exists the mapper picks it up and this constant stops being reached.
export const DEFAULT_INJECTION_INTERVAL_HOURS = 12;

// The log list shows a rolling window rather than calendar days, so an injection
// logged at 23:50 does not vanish ten minutes later.
export const RECENT_LOGS_WINDOW_HOURS = 48;

// Number of months in the trend charts.
export const TREND_MONTHS = 6;

export const DOSAGE_MIN = 0.5;
export const DOSAGE_MAX = 20;
export const DOSAGE_STEP = 0.1;
export const DOSAGE_DEFAULT = 3.5;
