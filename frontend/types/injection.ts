export interface InjectionLog {
  id: number;
  catId: number;
  dosage: number;
  notes?: string;
  // Parsed at the API boundary — no component ever handles a raw timestamp string.
  createdAt: Date;
}

export interface MonthBucket {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

export interface DosagePoint {
  label: string;
  value: number | null;
  count: number;
  total: number;
}
