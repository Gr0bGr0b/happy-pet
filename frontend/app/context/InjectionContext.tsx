import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { InjectionLogs } from "../../types/DiabetesInjection";

interface InjectionContextType {
  logs: InjectionLogs[];
  addInjection: (dose: number) => void;
}

const InjectionContext = createContext<InjectionContextType>({
  logs: [],
  addInjection: () => {},
});

export const useInjectionContext = () => useContext(InjectionContext);

const DEMO_LOGS: InjectionLogs[] = [
  { date: "2025-12-15T13:07:04.054", unit: 3.5 },
  { date: "2025-12-15T13:07:04.054", unit: 3.5 },
  { date: "2025-12-15T13:07:04.054", unit: 3.5 },
  { date: "2025-12-15T13:07:04.054", unit: 3.5 },
  { date: "2025-12-15T13:07:04.054", unit: 3.5 },
  { date: "2025-12-15T13:07:04.054", unit: 3.5 },
];

export const InjectionProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<InjectionLogs[]>(DEMO_LOGS);

  const addInjection = useCallback((dose: number) => {
    const newEntry: InjectionLogs = {
      date: new Date().toISOString(),
      unit: dose,
    };
    setLogs((prev) => [newEntry, ...prev]);
  }, []);

  return (
    <InjectionContext.Provider value={{ logs, addInjection }}>
      {children}
    </InjectionContext.Provider>
  );
};
