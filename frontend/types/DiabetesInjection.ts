export interface DiabetesInjection {
  id: string;
  type: string;
  date: string;
  dosage: number;
  notes?: string;
}

export interface InjectionLogs {
  date: string;
  unit: number;
}
